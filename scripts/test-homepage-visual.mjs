import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.HOMEPAGE_PREVIEW_URL ?? "http://localhost:5173";
const previewOrigin = new URL(base).origin;
const expectedNotFoundPaths = new Set(["/latest?page=1.5", "/security?page=abc"]);
const out = "artifacts/homepage-qa";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
const failed = [];

for (const sample of [
  { name: "desktop-light", width: 1440, height: 900, theme: "light" },
  { name: "desktop-dark", width: 1440, height: 900, theme: "dark" },
  { name: "tablet-light", width: 768, height: 900, theme: "light" },
  { name: "mobile-light", width: 390, height: 844, theme: "light" },
  { name: "small-mobile-dark", width: 320, height: 720, theme: "dark" },
]) {
  const ctx = await browser.newContext({ viewport: { width: sample.width, height: sample.height }, colorScheme: sample.theme, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  // Cloudflare Turnstile refuses the localhost origin (110200) and injects
  // an unrelated Vite error overlay. In visual/hydration QA only, neutralize
  // its external loader; API validation is exercised in test-contact.mjs.
  // Do not apply this interception to real production browser checks.
  if (new URL(base).hostname === "localhost") {
    await page.route(/https:\/\/challenges\.cloudflare\.com\/turnstile\/v0\/api\.js/, route =>
      route.fulfill({ status: 200, contentType: "application/javascript", body: "/* Turnstile unavailable on localhost; stub for visual QA only */" }));
  }
  const pageErrors = [];
  const unexpectedHttpErrors = [];
  page.on("pageerror", e => pageErrors.push(e.message));
  page.on("console", message => {
    if (message.type() === "error") pageErrors.push("console: " + message.text());
  });
  // Browser console 404s do not identify URLs. Track same-origin responses
  // separately so the two intentionally invalid pagination tests are not
  // mistaken for broken assets or production regressions.
  page.on("response", response => {
    const url = new URL(response.url());
    if (url.origin !== previewOrigin || response.status() < 400) return;
    const pathAndQuery = url.pathname + url.search;
    if (response.status() === 404 && expectedNotFoundPaths.has(pathAndQuery)) return;
    unexpectedHttpErrors.push({ status: response.status(), path: pathAndQuery });
  });
  const report = { ...sample };
  try {
    const res = await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 45000 });
    assert(res && res.status() === 200, "Homepage must return HTTP 200");
    await page.locator(".reader-search-link").waitFor({ state: "visible", timeout: 20000 });
    // Wait until client-side scripts and hydration have settled before testing
    // React-powered controls; a DOM-ready page can still be unhydrated.
    await page.waitForLoadState("networkidle", { timeout: 30000 });
    if (sample.theme === "dark") {
      await page.evaluate(() => document.documentElement.dataset.theme = "dark");
    }
    const search = page.locator('a.reader-search-link[href="/search"]');
    assert.equal(await search.count(), 1, "Homepage should have exactly one new guide-search link");
    assert((await search.innerText()).includes("Search all published guides"), "Search link has expected label");
    assert.equal(await page.locator('h2#latest-title').innerText(), "Latest Stories", "Latest block name");
    const frontPageSections = await page.locator("main > section").evaluateAll((sections) => sections.map((section) => section.className));
    assert(frontPageSections[0].includes("hero"), "Homepage must lead with the existing editorial hero");
    assert(frontPageSections[1].includes("latest-home") && frontPageSections[2].includes("home-weekly-brief") && frontPageSections[3].includes("reader-paths"),
      "Latest stories, the published weekly digest and guided search must precede editorial topic sections");
    assert.equal(await page.locator(".home-intro").count(), 1, "Homepage must have one editorial introduction");
    assert.equal(await page.locator(".edition-line").count(), 1, "Signal Edition masthead must appear once");
    assert.equal(await page.locator(".footer-manifesto").count(), 1, "Signal Edition footer colophon must appear once");
    const redesigned = await page.evaluate(() => {
      const hero = document.querySelector(".lead-story");
      const header = document.querySelector(".masthead");
      const latest = document.querySelector(".latest-feed");
      const footer = document.querySelector(".site-footer");
      return {
        heroDisplay: getComputedStyle(hero).display,
        headerRows: getComputedStyle(header).gridTemplateRows,
        latestDisplay: getComputedStyle(latest).display,
        footerBackground: getComputedStyle(footer).backgroundColor,
      };
    });
    assert.equal(redesigned.heroDisplay, "grid", "Lead story must use the new magazine spread");
    assert.equal(redesigned.latestDisplay, "grid", "Latest Stories must use editorial grid tiles");
    assert(redesigned.footerBackground !== "rgba(0, 0, 0, 0)", "Footer must have its own editorial surface");
    if (sample.width > 1000) {
      assert((await page.locator(".edition-line").isVisible()), "Desktop publication masthead must be visible");
      assert((await page.locator(".masthead .primary-nav").isVisible()), "Desktop second-tier navigation must be visible");
    } else {
      assert(!(await page.locator(".edition-line").isVisible()), "Mobile masthead should avoid extra chrome");
    }
    const articleHrefs = await page.locator(".lead-story h1 a, .hero-rail h2 a, .latest-feed .article-card h3 a, .home-topic .article-card h3 a")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    assert.equal(new Set(articleHrefs).size, articleHrefs.length, "Homepage headline positions must not repeat article destinations");
    assert.equal(await page.locator("section.home-weekly-brief").count(), 1, "Published Weekly Brief must have one visible homepage feature");
    assert.equal(await page.locator("#home-weekly-brief-title").innerText(), "Weekly Brief", "Homepage must label the recurring edition");
    assert.equal(await page.locator('section.home-weekly-brief a[href="/weekly"]').count(), 1, "Weekly homepage feature must link to the archive");
    assert.equal(await page.locator('section.home-weekly-brief a[href="/weekly/2026-11-16"]').count(), 1,
      "Weekly homepage feature must link to the newest published issue");
    const leadSrc = await page.locator(".lead-image img").getAttribute("src");
    assert(leadSrc?.startsWith("/images/"), "Homepage hero must fetch the real WebP directly, not redirect through /_next/image");
    const firstFeedSrc = await page.locator(".latest-feed .card-image img").first().getAttribute("src");
    assert(firstFeedSrc?.startsWith("/images/"), "Homepage thumbnails must avoid unnecessary /_next/image redirects");
    assert.equal(await page.locator(".lead-image img").getAttribute("fetchpriority"), "high", "Hero LCP image must keep high fetch priority");
    const heroSizes = await page.locator(".lead-image img").getAttribute("sizes");
    assert.equal(heroSizes, "(max-width: 1180px) 100vw, 38vw",
      "Responsive feature cover must match the stacked mobile and narrow desktop image widths");
    const heroSrcSet = await page.locator(".lead-image img").getAttribute("srcset");
    assert(heroSrcSet?.includes("/images/responsive/") && heroSrcSet.includes(" 320w"), "Homepage hero must advertise real responsive WebP variants");
    const feedSrcSet = await page.locator(".latest-feed .article-card--horizontal .card-image img").first().getAttribute("srcset");
    assert(feedSrcSet?.includes("/images/responsive/"), "Thumbnail must advertise responsive WebP variants");
    const compactImage = page.locator(".home-topic .article-card--compact .card-image img").first();
    if (await compactImage.count()) {
      const sizes = await compactImage.getAttribute("sizes");
      assert(sizes?.includes("32vw"), "Three-column homepage images should request compact WebP candidates");
      assert(sizes?.includes("(max-width: 600px) 40vw"),
        "Mobile topic images should request thumbnail-sized WebP rather than full-viewport variants");
    }
    const imageFit = await page.locator(".lead-image img").evaluate((img) => getComputedStyle(img).objectFit);
    assert.equal(imageFit, "cover", "Lead artwork must fill its image frame consistently");
    // Card geometry must follow the editorial rhythm at every tested viewport,
    // including category sections that contain only one published story.
    const cardGeometry = await page.evaluate(() => {
      const latest = document.querySelector(".latest-feed .article-card--horizontal .card-image");
      const singleGrid = document.querySelector(".home-topic-grid--single");
      const compactCard = document.querySelector(".home-topic-grid .article-card--compact");
      const compactImage = compactCard?.querySelector(".card-image");
      const latestBox = latest?.getBoundingClientRect();
      const singleGridBox = singleGrid?.getBoundingClientRect();
      const singleCardBox = singleGrid?.querySelector(".article-card")?.getBoundingClientRect();
      return {
        latestAspectRatio: latestBox ? latestBox.width / latestBox.height : null,
        singleGridFullWidth: singleGridBox && singleCardBox
          ? Math.abs(singleGridBox.width - singleCardBox.width) <= 2 : null,
        compactImageWidthFraction: compactCard && compactImage
          ? compactImage.getBoundingClientRect().width / compactCard.getBoundingClientRect().width : null,
        compactImageAspectRatio: compactImage
          ? compactImage.getBoundingClientRect().width / compactImage.getBoundingClientRect().height : null,
      };
    });
    const expectedLatestRatio = sample.width <= 600 ? 4 / 3 : 16 / 10;
    assert(cardGeometry.latestAspectRatio && Math.abs(cardGeometry.latestAspectRatio - expectedLatestRatio) < .06,
      "Latest card images must keep their intended desktop or mobile aspect ratio");
    if (cardGeometry.singleGridFullWidth !== null) {
      assert(cardGeometry.singleGridFullWidth, "A single-story topic grid must use the full available width");
    }
    if (sample.width <= 600 && cardGeometry.compactImageWidthFraction !== null) {
      assert(cardGeometry.compactImageWidthFraction <= .43,
        "Mobile topic cards should use a compact side thumbnail, not a towering full-width image");
      assert(Math.abs(cardGeometry.compactImageAspectRatio - 4 / 3) < .06,
        "Mobile topic thumbnails should retain the cropped 4:3 editorial frame");
    }
    if (sample.width <= 600) {
      const sectionHeaderDirection = await page.locator(".latest-home .section-heading").evaluate((el) => getComputedStyle(el).flexDirection);
      assert.equal(sectionHeaderDirection, "column", "Narrow screens must stack editorial headings and actions");
    }
    if (sample.name === "mobile-light") {
      const heroVariant = await page.locator(".lead-image img").evaluate(img => img.currentSrc);
      assert(heroVariant.includes("/images/responsive/"), "Mobile homepage must select an actual resized WebP");
      const imageResponse = await page.request.get(heroVariant);
      assert.equal(imageResponse.status(), 200, "Chosen mobile WebP must exist");
      assert((imageResponse.headers()["content-type"] ?? "").includes("image/webp"), "Chosen mobile asset must be a WebP");
    }
    assert.deepEqual(await page.locator(".primary-nav .nav-scroll > a").allTextContents(), ["Tech News", "AI", "AI Tools", "Reviews", "How-To", "Security", "Science"], "Primary menu must use all seven approved destinations");
    assert((await page.locator('footer a[href="/review-methodology"]').count()) > 0, "Footer links to Review Methodology");
    assert.equal(await page.locator(".follow-decodista").count(), 0, "Do not promote RSS on homepage");
    assert((await page.locator('footer a[href="/rss.xml"]').count()) > 0, "Footer should retain RSS");
    assert((await page.locator(".reader-path").count()) > 0, "Reader journeys must remain present");

    const measures = await page.evaluate(() => {
      const a = document.querySelector(".reader-search-link");
      const b = a.getBoundingClientRect();
      return {
        viewport: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        searchBounds: { width: b.width, height: b.height, x: b.x, y: b.y },
        searchDisplay: getComputedStyle(a).display,
        background: getComputedStyle(document.body).backgroundColor,
      };
    });
    assert(measures.documentWidth <= measures.viewport + 1, "Unexpected horizontal overflow");
    assert(measures.searchBounds.width > 120 && measures.searchBounds.height > 15, "Search CTA should occupy visible area");
    assert(measures.searchBounds.height >= 44, "Guide search CTA should meet comfortable touch-target height");
    await search.focus();
    assert(await search.evaluate(el => document.activeElement === el), "Search CTA must accept keyboard focus");
    await page.locator("section.reader-paths").screenshot({ path: out + "/" + sample.name + "-discovery.png" });
    // Keep a first-screen screenshot for human design review; do not rely on a
    // Lighthouse score alone to judge editorial layout.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: out + "/" + sample.name + "-first-screen.png" });
    if (sample.name === "desktop-light" || sample.name === "mobile-light") {
      await page.screenshot({ path: out + "/" + sample.name + "-full-page.png", fullPage: true });
      const privacyChoice = page.getByRole("button", { name: "Decline analytics" });
      if (await privacyChoice.count()) {
        await privacyChoice.click();
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: out + "/" + sample.name + "-unobstructed.png" });
      }
    }


    // Browser regression coverage for the navigation, including the mobile drawer.
    const mobileMenu = page.locator(".mobile-menu-button");
    if (sample.width <= 1000) {
      assert(await mobileMenu.isVisible(), "Mobile menu toggle must be available");
      await mobileMenu.click();
      assert(await page.locator("#site-navigation").isVisible(), "Mobile navigation should open");
    } else {
      assert(await page.locator("#site-navigation").isVisible(), "Desktop navigation must be visible");
    }

    assert.equal(await page.locator(".more-menu, .more-panel").count(), 0, "Removed More dropdown must not be rendered");
    assert.equal(await page.locator('header .nav-scroll > a[href="/entertainment"]').count(), 0, "Paused Entertainment section must not be in the primary menu");
    assert.equal(await page.locator('header .nav-scroll > a[href="/weekly"]').count(), 0, "Weekly Brief must not be in the primary menu");
    assert.equal(await page.locator('.primary-nav .nav-scroll > a[href="/latest"]').count(), 0, "Latest should be in the footer, not primary navigation");
    for (const category of ["tech-news","ai","ai-tools","reviews","how-to","security","science"]) {
      assert.equal(await page.locator(`header .nav-scroll > a[href="/${category}"]`).count(), 1, `Primary navigation must include ${category}`);
      assert.equal(await page.locator(`footer a[href="/${category}"]`).count(), 1, `Footer Explore must include ${category}`);
    }
    for (const destination of ["digital-life", "latest"]) {
      assert.equal(await page.locator(`footer a[href="/${destination}"]`).count(), 1, `Footer must retain ${destination}`);
      assert.equal(await page.locator(`header .nav-scroll > a[href="/${destination}"]`).count(), 0, `Secondary destination ${destination} must not be in the header`);
    }
    assert.equal(await page.locator('footer a[href="/weekly"]').count(), 1, "Weekly Brief must remain discoverable from the footer");
    assert((await page.locator('footer a[href="/review-methodology"]').count()) > 0, "Review Methodology remains discoverable from the footer");

    if (sample.width <= 1000) {
      await page.keyboard.press("Escape");
      assert(!await page.locator("#site-navigation").isVisible(), "Escape must close the mobile navigation");
      assert.equal(await mobileMenu.getAttribute("aria-expanded"), "false", "Mobile menu toggle must reflect its closed state");
    }

    const articleDiscoveryResponse = await page.goto(base + "/articles/gmail-not-receiving-emails-google-storage-full", { waitUntil: "domcontentloaded", timeout: 45000 });
    assert.equal(articleDiscoveryResponse?.status(), 200, "Existing article must remain reachable");
    const articleToc = page.locator("nav.toc");
    assert.equal(await articleToc.count(), 1, "Long-form guide must retain its in-page table of contents");
    const tocHref = await articleToc.locator('a[href^="#"]').first().getAttribute("href");
    assert(tocHref && tocHref.length > 1, "TOC must link to an actual in-page heading");
    assert(await page.locator(".article-prose h2[id]").evaluateAll(
      (headings, href) => headings.some((heading) => "#" + heading.id === href), tocHref),
      "TOC destinations must resolve to article section headings");
    const tocMetrics = await articleToc.evaluate((node) => ({
      overflowY: getComputedStyle(node).overflowY,
      height: node.getBoundingClientRect().height,
      viewportHeight: window.innerHeight,
      linkMinHeight: parseFloat(getComputedStyle(node.querySelector("a")).minHeight),
    }));
    assert(tocMetrics.linkMinHeight >= 44, "TOC links need at least 44px tap and focus targets");
    if (sample.width > 800) {
      assert.equal(tocMetrics.overflowY, "auto", "Desktop TOC must scroll independently when long");
      assert(tocMetrics.height <= tocMetrics.viewportHeight, "Sticky TOC must stay within the viewport");
    } else {
      assert.equal(tocMetrics.overflowY, "visible", "Mobile TOC must flow naturally instead of trapping scroll");
      if (sample.width <= 600) {
        const bodyFontPx = await page.locator(".article-main-grid .article-prose").evaluate(
          (element) => parseFloat(getComputedStyle(element).fontSize));
        assert(bodyFontPx >= 18, "Mobile article body must remain at least 18px for comfortable reading");
      }
    }
    const discovery = page.locator("nav.article-discovery");
    assert.equal(await discovery.count(), 1, "Article must have one contextual discovery section");
    assert(await discovery.evaluate((element) => element.previousElementSibling?.classList.contains("article-main-grid")),
      "Related discovery must appear after the full article body");
    assert((await discovery.locator('a[href^="/articles/"]').count()) > 0, "Discovery should link a real related article");
    assert((await discovery.locator('a[href^="/topics/"]').count()) > 0, "Discovery should link a populated topic hub");
    const imageCaption = await page.locator("figure.article-hero figcaption").innerText();
    assert(imageCaption.includes("Conceptual editorial illustration, not an official product screenshot."),
      "Editorial images must not masquerade as real product screenshots");
    if (sample.name === "desktop-light") {
      const incidentResponse = await page.goto(base + "/articles/openai-agent-leak-53-chatgpt-user-images",
        { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(incidentResponse?.status(), 200, "Existing incident article must remain reachable");
      const incidentCaption = await page.locator("figure.article-hero figcaption").innerText();
      assert(incidentCaption.includes("not a photograph or depiction of actual OpenAI facilities"),
        "Fictional staged research scenes must carry a visible documentary-evidence warning");
      const incidentImage = page.locator("figure.article-hero img");
      assert((await incidentImage.getAttribute("alt"))?.includes("fictional AI-agent interface"),
        "Incident artwork alt text must acknowledge fictional staging");
      assert.equal(await incidentImage.getAttribute("src"), "/images/uploads/openai-agent-image-leak-concept-2026.webp",
        "Incident article must use its reviewed replacement artwork");
      for (const [slug, expectedImage, requiredAlt] of [
        ["google-photos-android-undo-backup-keep-phone-photos", "/images/uploads/google-photos-undo-backup-local-kept-cloud-removed.webp", "photos staying on a phone"],
        ["google-photos-free-up-space-what-it-deletes", "/images/uploads/google-photos-free-up-space-cloud-copies-kept.webp", "saved cloud photos remain available"],
      ]) {
        const updatedPage = await page.goto(base + "/articles/" + slug, { waitUntil: "domcontentloaded", timeout: 45000 });
        assert.equal(updatedPage?.status(), 200, "Updated hero article must remain reachable: " + slug);
        const art = page.locator("figure.article-hero img");
        assert.equal(await art.getAttribute("src"), expectedImage, "Article must display its replacement editorial artwork");
        assert((await art.getAttribute("alt"))?.includes(requiredAlt), "Updated artwork must have accurate alt text");
        assert((await art.getAttribute("srcset"))?.includes("/images/responsive/"), "Updated artwork must use real WebP srcset");
        await art.evaluate(async image => { if (!image.complete) await new Promise(resolve => image.addEventListener("load", resolve, { once: true })); });
        assert(await art.evaluate(image => image.complete && image.naturalWidth > 0), "Published editorial image must load successfully");
        const originalResponse = await page.request.get(base + expectedImage);
        assert.equal(originalResponse.status(), 200, "Full-size WebP original must remain directly accessible");
        assert((originalResponse.headers()["content-type"] ?? "").includes("image/webp"),
          "Replacement original must be a WebP served with the correct content type");
      }
      const recoveryGuide = await page.goto(base + "/articles/recover-hacked-google-account-gmail",
        { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(recoveryGuide?.status(), 200, "New researched Gmail recovery guide must render");
      assert((await page.locator("h1").first().innerText()).includes("Google Account Hacked or Locked Out"),
        "New article must have its intended editorial title");
      const recoveryHero = page.locator("figure.article-hero img");
      assert.equal(await recoveryHero.getAttribute("src"), "/images/uploads/recover-hacked-google-account-gmail.webp",
        "New security article must use its own original hero image");
      assert((await recoveryHero.getAttribute("alt"))?.includes("Conceptual security illustration"),
        "Hero alt must describe conceptual artwork and not imply a Google screenshot");
      assert((await recoveryHero.getAttribute("srcset"))?.includes("/images/responsive/"),
        "New article must have responsive WebP variants");
      const newHeroResponse = await page.request.get(base + "/images/uploads/recover-hacked-google-account-gmail.webp");
      assert.equal(newHeroResponse.status(), 200, "New WebP must be reachable");
      assert((newHeroResponse.headers()["content-type"] ?? "").includes("image/webp"), "Original must be served as WebP");
      const routeMap = page.locator('figure.prose-image img[src="/images/editorial/google-account-recovery-route-map.svg"]');
      assert.equal(await routeMap.count(), 1, "Recovery article must include exactly one original route-map visual");
      assert((await routeMap.getAttribute("alt"))?.includes("Three-path recovery map"),
        "Route map must explain all three paths in accessible alternate text");
      const routeMapResponse = await page.request.get(base + "/images/editorial/google-account-recovery-route-map.svg");
      assert.equal(routeMapResponse.status(), 200, "Original route-map SVG must be publicly reachable in preview");
      assert((routeMapResponse.headers()["content-type"] ?? "").includes("image/svg+xml"),
        "Route-map illustration must be served as SVG and not masquerade as a Google screenshot");
      const recoveryPageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      assert(recoveryPageWidth <= sample.width + 1, "Recovery route-map must not cause horizontal overflow");
      const recoveryText = await page.locator("main").innerText();
      assert(recoveryText.includes("Related guides for your next step"),
        "Recovery article must include contextual next-step guides");
      for (const prompt of [
        "Can't sign in, or someone changed your password?",
        "Know your password, but lost your verification phone?",
        "Can still sign in, but suspect someone else accessed the account?",
        "No article or paid service can guarantee",
      ]) {
        assert(recoveryText.includes(prompt), "Reader-first recovery route or safety warning must remain visible: " + prompt);
      }
      assert(await page.locator('a[href="https://accounts.google.com/signin/recovery"]').count() > 0,
        "Guide must link directly to Google's official recovery page");
      await page.goto(base + "/articles/gmail-not-receiving-emails-google-storage-full",
        { waitUntil: "domcontentloaded", timeout: 45000 });
    }
    const articleDocumentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    assert(articleDocumentWidth <= sample.width + 1, "Article discovery must not cause mobile overflow");

    const aboutResponse = await page.goto(base + "/about", { waitUntil: "domcontentloaded", timeout: 45000 });
    assert.equal(aboutResponse?.status(), 200, "About must load");
    assert((await page.locator("main").innerText()).includes("Our current published coverage focuses on AI tools"), "About must accurately describe currently published coverage");
    assert(!((await page.locator("main").innerText()).includes("Follow technology, science and digital entertainment")), "About should not advertise unlaunched content");
    const methodology = await page.goto(base + "/review-methodology", { waitUntil: "domcontentloaded", timeout: 45000 });
    assert(methodology && methodology.status() === 200, "Review Methodology must return HTTP 200");
    assert.equal(await page.locator("main h1").innerText(), "Review Methodology", "Review Methodology page heading");
    assert(await page.locator("main").innerText().then(text => text.includes("Research versus hands-on testing")), "Review policy must distinguish documentation and testing");
    assert((await page.locator(".footer-note").innerText()).includes("Independent technology explainers"), "Footer must describe the current published coverage");

    await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 45000 });
    const searchAgain = page.locator('a.reader-search-link[href="/search"]');
    await searchAgain.click();
    await page.waitForURL(/\/search(?:\?|$)/, { timeout: 20000 });
    assert((await page.locator("h1").first().innerText()).includes("Search DECODISTA"), "Search destination must work");
    await page.waitForLoadState("networkidle", { timeout: 30000 });
    assert.equal(await page.locator(".search-form").getAttribute("method"), "get", "Search should support normal GET submission before JavaScript hydrates");
    assert.equal(await page.locator("#article-search").getAttribute("name"), "q", "Search input must support no-JavaScript fallback");
    // Search should find separated keywords, retain shareable URLs, and
    // recover from no-result queries without a page reload.
    if (sample.name === "desktop-light" || sample.name === "mobile-light") {
      const searchInput = page.locator("#article-search");
      const initialResultCount = await page.locator(".search-results article").count();
      assert(initialResultCount > 0, "Search should initially list published guides");
      const suggestion = page.locator('.search-suggestions button').filter({ hasText: "Privacy" });
      assert(await suggestion.isVisible(), "Suggested search topics must be visible");
      await suggestion.click();
      assert.equal(await page.locator("#article-search").inputValue(), "Privacy", "Suggested topic must populate search");
      assert.equal(new URL(page.url()).searchParams.get("q"), "Privacy", "Suggested topic must retain a shareable URL");
      assert.equal(await suggestion.getAttribute("aria-pressed"), "true", "Selected search topic must be accessible");
      await page.locator("button.search-clear").click();
      assert.equal(await page.locator(".search-results article").count(), initialResultCount, "Clearing a suggested topic restores the library");

      await searchInput.fill("Google    Photos");
      assert((await page.locator(".search-results article").count()) > 0, "Separate Google Photos keywords should match published guides");
      await page.locator(".search-form button[type=submit]").click();
      assert.equal(await searchInput.inputValue(), "Google Photos", "Submitted search should normalize extra spaces");
      assert(new URL(page.url()).searchParams.get("q") === "Google Photos", "Search URL should be shareable");

      await searchInput.fill("termthatcannotmatchanypublishedstoryxyz");
      assert.equal(await page.locator(".search-results article").count(), 0, "Unmatched search should show zero cards");
      assert(await page.locator(".empty-state").isVisible(), "No-results state should explain the empty result");
      await page.locator("button.search-clear").click();
      assert.equal(await searchInput.inputValue(), "", "Clear action must reset the input");
      assert.equal(new URL(page.url()).pathname, "/search", "Clear should reset the URL");
      assert.equal(new URL(page.url()).search, "", "Clear should remove the query parameter");
      assert.equal(await page.locator(".search-results article").count(), initialResultCount, "Clearing search should restore all published articles");

      const deepLink = await page.goto(base + "/search?q=Google%20Photos&q=ignored", { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(deepLink?.status(), 200, "Repeated q parameters must not crash search");
      assert.equal(await page.locator("#article-search").inputValue(), "Google Photos", "Deep-linked search should read the first q parameter");
      assert((await page.locator('head meta[name="robots"]').getAttribute("content"))?.includes("noindex"), "Search results must be noindex");
      assert((await page.locator(".search-results article").count()) > 0, "Deep-linked search should render relevant published articles");
    }
    if (sample.name === "desktop-light") {
      for (const category of ["ai", "how-to", "security", "digital-life"]) {
        const sectionResponse = await page.goto(base + "/" + category, { waitUntil: "domcontentloaded", timeout: 45000 });
        assert.equal(sectionResponse?.status(), 200, `Primary category ${category} should load`);
        if (category === "how-to") {
          assert.equal(await page.locator('header .nav-scroll > a[href="/how-to"]').count(), 1,
            "How-To must appear in the seven-section primary navigation");
        }
        assert((await page.locator('main a[href^="/articles/"]').count()) > 0, `Primary category ${category} should link to published stories`);
        assert.equal(await page.locator("main").getByText("Coverage in development").count(), 0, `Primary category ${category} must not be an empty placeholder`);
        if (category === "how-to") {
          const image = page.locator(".category-lead-image img").first();
          assert.equal(await image.getAttribute("fetchpriority"), "high", "How-To lead must retain high fetch priority");
          assert((await image.getAttribute("src"))?.startsWith("/images/"), "How-To lead must avoid /_next/image redirects");
          assert((await image.getAttribute("srcset"))?.includes("/images/responsive/"), "How-To lead should serve generated responsive WebP variants");
          const twoColumnCard = page.locator(".article-grid .article-card .card-image img").first();
          assert((await twoColumnCard.getAttribute("sizes"))?.includes("48vw"),
            "Two-column archive cards must request appropriately detailed artwork");
        }
      }
      const emptyScience = await page.goto(base + "/science", { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(emptyScience?.status(), 200, "Science category should remain reachable as planned coverage");
      assert((await page.locator('head meta[name="robots"]').getAttribute("content"))?.includes("noindex"),
        "A category without published stories must remain noindex despite appearing in navigation");
      assert.equal(await page.locator("main").getByText("Coverage in development").count(), 1,
        "Do not manufacture science articles to populate an editorial section");
      assert((await page.locator(".section-explore-links a").count()) >= 2,
        "Empty Science should offer real published alternative sections");
      const latestPage = await page.goto(base + "/latest", { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(latestPage?.status(), 200, "Latest archive must load");
      const firstArchiveImage = page.locator(".archive-feed .article-card--horizontal .card-image img").first();
      await firstArchiveImage.waitFor({ state: "attached", timeout: 20000 });
      assert.notEqual(await firstArchiveImage.getAttribute("loading"), "lazy", "Above-the-fold Latest thumbnail must not be lazy-loaded");
      assert((await firstArchiveImage.getAttribute("src"))?.startsWith("/images/"), "Latest archive must fetch original WebP directly, avoiding the redirecting optimizer");
      assert((await firstArchiveImage.getAttribute("srcset"))?.includes("/images/responsive/"), "Latest must advertise generated responsive variants");
      assert.equal(await page.locator("section.archive-feed > h2").innerText(), "Latest articles", "Archive card headings need an h2 parent");
      assert((await page.locator('head meta[name="description"]').getAttribute("content"))?.includes("DECODISTA"), "Latest meta description must be inside <head>");
      assert((await page.locator('head link[rel="canonical"]').getAttribute("href"))?.endsWith("/latest"), "Latest canonical must be inside <head>");
      const articleResponse = await page.goto(base + "/articles/gmail-not-receiving-emails-google-storage-full", { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(articleResponse?.status(), 200, "Representative article must load");
      assert((await page.locator('head meta[name="description"]').getAttribute("content"))?.length > 50, "Article meta description must be inside <head>");
      assert((await page.locator('head link[rel="canonical"]').getAttribute("href"))?.includes("/articles/gmail-not-receiving-emails-google-storage-full"), "Article canonical must be inside <head>");
      const invalidPage = await page.goto(base + "/latest?page=1.5", { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(invalidPage?.status(), 404, "Fractional archive page must return 404");
      const invalidSection = await page.goto(base + "/security?page=abc", { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(invalidSection?.status(), 404, "Non-numeric category page must return 404");
      const secondPage = await page.goto(base + "/security?page=2", { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(secondPage?.status(), 200, "Second Security archive page must work");
      assert.equal(await page.locator(".category-lead").count(), 0, "Featured article must not repeat on category page 2");
      for (const [url, name] of [
        ["/weekly", "weekly-archive"],
        ["/topics/photos-backup", "topic-hub"],
        ["/contact", "contact"],
        ["/about", "about"],
      ]) {
        const response = await page.goto(base + url, { waitUntil: "domcontentloaded", timeout: 45000 });
        assert.equal(response?.status(), 200, `Redesigned ${name} must be reachable`);
        assert.equal(await page.locator("main h1").count(), 1, `Redesigned ${name} requires one main headline`);
        const width = await page.evaluate(() => document.documentElement.scrollWidth);
        assert(width <= sample.width + 1, `Redesigned ${name} must not overflow the desktop viewport`);
        if (name === "contact") {
          // Unlike the server-rendered form, React onChange handlers only
          // exist after client hydration. Test the hydrated UI, not a DOM-only
          // pre-hydration select option change.
          await page.waitForLoadState("networkidle", { timeout: 30000 });
          // Confirm the React form actually hydrates and handles a controlled
          // field change, not just that server-rendered markup is visible.
          // DOMContentLoaded is not enough for the React-controlled form.
          // Turnstile may poll forever on localhost, so never use networkidle.
          // The pinned React 19 DOM renderer attaches __reactProps$ to hydrated
          // controls; wait for those listeners before exercising onChange.
          await page.waitForFunction(() => {
            const select = document.querySelector("select#contact-type");
            return Boolean(select && Object.keys(select).some(key => key.startsWith("__reactProps$")));
          }, null, { timeout: 25000 });
          const enquiryType = page.locator('select#contact-type');
          await enquiryType.selectOption("Correction");
          await page.locator('input#contact-article-url').waitFor({ state: "visible", timeout: 15000 });
          await enquiryType.selectOption("General enquiry");
          await page.locator('input#contact-article-url').waitFor({ state: "detached", timeout: 15000 });
          const hydrationWarnings = pageErrors.filter(error => error.includes("A tree hydrated but some attributes"));
          assert.equal(hydrationWarnings.length, 0,
            "Contact form must hydrate without React attribute mismatch warnings");
        }
        // Playwright defaults to hiding the caret for screenshots, which can
        // mutate inline input styles during React hydration in dev previews.
        await page.screenshot({ path: out + "/" + name + "-desktop.png", caret: "initial" });
      }
    }
    if (sample.name === "small-mobile-dark") {
      for (const url of ["/articles/gmail-not-receiving-emails-google-storage-full", "/how-to", "/search"]) {
        const response = await page.goto(base + url, { waitUntil: "domcontentloaded", timeout: 45000 });
        assert.equal(response?.status(), 200, `Mobile editorial route ${url} must load`);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        assert(overflow <= 1, `320px mobile reflow must not overflow on ${url}: ${overflow}px`);
      }
    }
    assert.deepEqual(unexpectedHttpErrors, [],
      "Unexpected failed first-party HTTP responses: " + JSON.stringify(unexpectedHttpErrors));
    report.status = "passed";
    report.measures = measures;
    report.pageErrors = pageErrors;
    report.unexpectedHttpErrors = unexpectedHttpErrors;
  } catch (err) {
    report.status = "failed";
    report.error = String(err);
    report.pageErrors = pageErrors;
    report.unexpectedHttpErrors = unexpectedHttpErrors;
    failed.push(sample.name + ": " + String(err));
    await page.screenshot({ path: out + "/" + sample.name + "-failure.png", fullPage: false }).catch(() => {});
  } finally {
    results.push(report);
    await ctx.close();
  }
}
await browser.close();
await writeFile(out + "/results.json", JSON.stringify({ base, results, failed }, null, 2));
console.log(JSON.stringify({ base, results, failed }, null, 2));
if (failed.length) process.exitCode = 1;
