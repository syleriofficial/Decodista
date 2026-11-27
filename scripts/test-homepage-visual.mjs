import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.HOMEPAGE_PREVIEW_URL ?? "http://localhost:5173";
const previewOrigin = new URL(base).origin;
const weeklySource = await readFile("lib/weekly-briefs.ts", "utf8");
const newestWeeklySlug = weeklySource.match(/["']?slug["']?\s*:\s*"([0-9]{4}-[0-9]{2}-[0-9]{2})"/)?.[1];
assert(newestWeeklySlug, "Weekly brief source must contain a dated issue");
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
    assert.equal(await page.locator("section.editorial-ai-guides--home").count(), 0,
      "Homepage must not promote removed AI Tools editorial articles");
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

    if (sample.width >= 1200) {
      const density = await page.evaluate(() => ({
        heroHeading: parseFloat(getComputedStyle(document.querySelector(".lead-copy h1")).fontSize),
        sectionHeading: parseFloat(getComputedStyle(document.querySelector(".section-heading h2")).fontSize),
        mastheadHeight: document.querySelector(".masthead").getBoundingClientRect().height,
      }));
      assert(density.heroHeading <= 50 && density.sectionHeading <= 46,
        "Desktop editorial headings should not look artificially zoomed in");
      assert(density.mastheadHeight <= 90,
        "Desktop masthead should preserve reading space without hiding navigation");
    }

    if (sample.width > 1000) {
      assert((await page.locator(".edition-line").isVisible()), "Desktop publication masthead must be visible");
      assert((await page.locator(".masthead .primary-nav").isVisible()), "Desktop second-tier navigation must be visible");
    } else {
      assert(!(await page.locator(".edition-line").isVisible()), "Mobile masthead should avoid extra chrome");
    }

    // On long pages keep the complete desktop masthead and navigation visible,
    // and preserve the compact mobile header plus menu and search controls.
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, 1100);
    });
    await page.waitForFunction(() => document.querySelector(".site-header")?.classList.contains("is-scrolled"));
    const stickyHeader = await page.locator(".site-header").evaluate(header => {
      const headerRect = header.getBoundingClientRect();
      const navRect = header.querySelector(".primary-nav").getBoundingClientRect();
      const brandRect = header.querySelector(".wordmark").getBoundingClientRect();
      const searchRect = header.querySelector('[aria-label="Search DECODISTA"]').getBoundingClientRect();
      const editionRect = header.querySelector(".edition-line").getBoundingClientRect();
      return {
        position: getComputedStyle(header).position,
        shadow: getComputedStyle(header).boxShadow,
        top: headerRect.top,
        bottom: headerRect.bottom,
        navTop: navRect.top,
        navBottom: navRect.bottom,
        brandTop: brandRect.top,
        brandBottom: brandRect.bottom,
        searchBottom: searchRect.bottom,
        editionTop: editionRect.top,
        editionBottom: editionRect.bottom,
      };
    });
    assert.equal(stickyHeader.position, "sticky", "Header must use native sticky positioning");
    assert(stickyHeader.shadow !== "none", "Scrolled header must gain a subtle separator shadow");
    assert(stickyHeader.top >= -2 && stickyHeader.top <= 3,
      "The whole sticky header must remain fixed at the top after scrolling");
    if (sample.width > 1000) {
      assert(stickyHeader.editionTop >= 0 && stickyHeader.editionBottom > 12,
        "Desktop edition bar must remain visible while scrolling");
      assert(stickyHeader.brandTop >= 0 && stickyHeader.brandBottom <= stickyHeader.navTop,
        "DECODISTA logo/tagline must remain above the nav while scrolling");
      assert(stickyHeader.searchBottom <= stickyHeader.navTop,
        "Search control must remain visible above the nav while scrolling");
      assert(stickyHeader.navTop >= stickyHeader.editionBottom + 30 &&
        stickyHeader.navBottom - stickyHeader.navTop >= 30 &&
        stickyHeader.navBottom <= stickyHeader.bottom + 1,
        "Desktop full eight-link menu must remain completely visible below the compact masthead");
    } else {
      assert(stickyHeader.bottom >= 60 && stickyHeader.brandTop >= 0,
        "Mobile compact header, logo, search and menu button must remain visible after scrolling");
    }
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      document.documentElement.style.scrollBehavior = "";
    });
    await page.waitForFunction(() => !document.querySelector(".site-header")?.classList.contains("is-scrolled"));
    const articleHrefs = await page.locator(".lead-story h1 a, .hero-rail h2 a, .latest-feed .article-card h3 a, .home-topic .article-card h3 a")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    assert.equal(new Set(articleHrefs).size, articleHrefs.length, "Homepage headline positions must not repeat article destinations");
    assert.equal(await page.locator("section.home-weekly-brief").count(), 1, "Published Weekly Brief must have one visible homepage feature");
    assert.equal(await page.locator("#home-weekly-brief-title").innerText(), "Weekly Brief", "Homepage must label the recurring edition");
    assert.equal(await page.locator('section.home-weekly-brief a[href="/weekly"]').count(), 1, "Weekly homepage feature must link to the archive");
    assert.equal(await page.locator(`section.home-weekly-brief a[href="/weekly/${newestWeeklySlug}"]`).count(), 1,
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
    assert.deepEqual(await page.locator(".primary-nav .nav-scroll > a").allTextContents(), ["Tech News", "AI", "AI Tools", "Reviews", "How-To", "Security", "Science", "Latest"], "Primary menu must use all eight approved destinations");
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
    // A full-page screenshot does not automatically trigger native lazy-loading.
    // Scroll each editorial image into view and require a decoded, nonempty
    // bitmap before capturing the reference screenshots. This detects broken
    // images and prevents false visual reports with blank thumbnail frames.
    if (sample.name === "desktop-light" || sample.name === "mobile-light") {
      const editorialImages = page.locator(
        "main .lead-image img, main .latest-feed .card-image img, main .home-topic .card-image img"
      );
      const totalImages = await editorialImages.count();
      assert(totalImages >= 4, "Homepage image audit requires a real cover and story thumbnails");
      for (let index = 0; index < totalImages; index++) {
        const image = editorialImages.nth(index);
        await image.scrollIntoViewIfNeeded();
        const loaded = await image.evaluate(async (element) => {
          try { await element.decode(); } catch { /* Assert a failed decode below. */ }
          return { complete: element.complete, width: element.naturalWidth, url: element.currentSrc || element.src };
        });
        assert(loaded.complete && loaded.width > 0,
          `Homepage editorial image ${index + 1}/${totalImages} did not load: ${loaded.url}`);
      }
    }
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
    assert.equal(await page.locator('.primary-nav .nav-scroll > a[href="/latest"]').count(), 1, "Latest should be the final primary navigation destination");
    for (const category of ["tech-news","ai","ai-tools","reviews","how-to","security","science","latest"]) {
      assert.equal(await page.locator(`header .nav-scroll > a[href="/${category}"]`).count(), 1, `Primary navigation must include ${category}`);
      assert.equal(await page.locator(`footer a[href="/${category}"]`).count(), 1, `Footer Explore must include ${category}`);
    }
    for (const destination of ["digital-life"]) {
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

    // Simulate a short guide without a TOC: the reading column must stay wide
    // rather than landing in the former narrow sidebar grid track.
    const noTocProseWidth = await page.locator(".article-main-grid").evaluate((grid) => {
      const toc = grid.querySelector(".toc");
      const nextSibling = toc?.nextSibling;
      toc?.remove();
      grid.classList.add("article-main-grid--no-toc");
      const width = grid.querySelector(".article-prose")?.getBoundingClientRect().width ?? 0;
      grid.classList.remove("article-main-grid--no-toc");
      if (toc) grid.insertBefore(toc, nextSibling ?? null);
      return width;
    });
    assert(noTocProseWidth >= Math.min(600, sample.width - 48),
      "Short articles without a table of contents must retain a readable main column");

    if (sample.name === "desktop-light" || sample.name === "mobile-light") {
      const comparisonResponse = await page.goto(base + "/articles/how-to-spot-fake-online-store",
        { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(comparisonResponse?.status(), 200, "Published comparison guide must load");
      const comparisonTable = page.locator("figure.table-figure").first();
      assert.equal(await comparisonTable.count(), 1, "Comparison guide must retain its published table");
      const scrollRegion = comparisonTable.locator(".table-scroll");
      assert.equal(await scrollRegion.getAttribute("role"), "region", "Scrollable comparison needs a named region");
      assert.equal(await scrollRegion.getAttribute("tabindex"), "0", "Comparison must be keyboard-scrollable");
      const hint = comparisonTable.locator(".table-scroll-hint");
      assert.equal(await hint.isVisible(), sample.width <= 800,
        "Compact layouts must explain that comparison tables scroll horizontally");
      if (sample.width <= 600) {
        const dimensions = await scrollRegion.evaluate(node => ({
          scrollWidth: node.scrollWidth,
          clientWidth: node.clientWidth,
          documentWidth: document.documentElement.scrollWidth,
        }));
        assert(dimensions.scrollWidth > dimensions.clientWidth, "Comparison columns should scroll inside the table region");
        assert(dimensions.documentWidth <= sample.width + 1, "Comparison must not overflow the mobile viewport");
      }
      const captionSize = await page.locator("figure.article-hero figcaption").evaluate(
        el => parseFloat(getComputedStyle(el).fontSize));
      assert(captionSize >= 12.7, "Editorial image captions should be legible on mobile and desktop");
    }

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
    if (sample.name === "mobile-light" || sample.name === "small-mobile-dark") {
      const mobileHowTo = await page.goto(base + "/how-to", { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(mobileHowTo?.status(), 200, "Mobile How-To archive should load");
      const mobileGuides = page.locator(".how-to-guide-list .article-card--horizontal");
      assert((await mobileGuides.count()) > 0, "Mobile How-To needs published guides");
      const mobileGuideLayout = await mobileGuides.first().evaluate((article) => {
        const outer = article.getBoundingClientRect();
        const image = article.querySelector(".card-image").getBoundingClientRect();
        const copy = article.querySelector(".card-copy").getBoundingClientRect();
        return {
          horizontal: image.left < copy.left && image.right <= copy.left,
          thumbnailFraction: image.width / outer.width,
          pageWidth: document.documentElement.scrollWidth,
          viewport: window.innerWidth,
        };
      });
      assert(mobileGuideLayout.horizontal && mobileGuideLayout.thumbnailFraction <= .37,
        "Mobile guide rows should keep a compact thumbnail left of their text");
      assert(mobileGuideLayout.pageWidth <= mobileGuideLayout.viewport + 1,
        "How-To must not introduce horizontal overflow on mobile");
      const featuredImageLayout = await page.locator(".how-to-page .category-lead-image").evaluate((element) => ({
        height: element.getBoundingClientRect().height,
        viewportWidth: window.innerWidth,
      }));
      assert(featuredImageLayout.height <= featuredImageLayout.viewportWidth * .55,
        "How-To mobile featured image should leave room for the guide list");
      if (sample.name === "mobile-light") {
        await page.screenshot({ path: out + "/how-to-mobile-first-screen.png" });
        await page.locator(".how-to-guide-list").screenshot({ path: out + "/how-to-mobile-guide-list.png" });
      }
      const mobileTechNews = await page.goto(base + "/tech-news", { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(mobileTechNews?.status(), 200, "Tech News archive should load on mobile");
      const mobileTechRows = page.locator(".tech-news-page .editorial-vertical-list .article-card--horizontal");
      const techMobileRowCount = await mobileTechRows.count();
      if (techMobileRowCount === 0) {
        assert.equal(await page.locator(".tech-news-page .category-lead").count(), 1,
          "A Tech News archive with only one published article should show its real featured story");
        assert((await page.locator(".tech-news-page .category-count").textContent()).includes("1 published story"),
          "A Tech News archive with no list must have exactly one published story");
        const width = await page.evaluate(() => document.documentElement.scrollWidth);
        assert(width <= sample.width + 1, "Single-story Tech News must not overflow mobile");
      }
      if (await page.locator(".tech-news-page .tech-news-empty-state").count()) {
        assert.equal(await page.locator(".tech-news-page .tech-news-elsewhere").count(), 1,
          "Empty Tech News must clearly distinguish articles published elsewhere");
        assert((await page.locator(".tech-news-page .cross-section-note").innerText()).includes("other published sections"),
          "Do not mislabel cross-section articles as Tech News reporting");
      }
      if (techMobileRowCount > 0) {
        const techMobileLayout = await mobileTechRows.first().evaluate((article) => {
          const row = article.getBoundingClientRect();
          const image = article.querySelector(".card-image").getBoundingClientRect();
          const content = article.querySelector(".card-copy").getBoundingClientRect();
          return {
            sideBySide: image.left < content.left && image.right <= content.left,
            thumbnailFraction: image.width / row.width,
            pageWidth: document.documentElement.scrollWidth,
            viewportWidth: window.innerWidth,
          };
        });
        assert(techMobileLayout.sideBySide && techMobileLayout.thumbnailFraction <= .37,
          "Tech News mobile should show compact left thumbnails and headlines on the right");
        assert(techMobileLayout.pageWidth <= techMobileLayout.viewportWidth + 1,
          "Tech News must not introduce horizontal overflow on 390px or 320px phones");
      }
      if (await page.locator(".tech-news-page .category-lead-image").count()) {
        const techFeature = await page.locator(".tech-news-page .category-lead-image").evaluate((element) => ({
          height: element.getBoundingClientRect().height,
          viewport: window.innerWidth,
        }));
        assert(techFeature.height <= techFeature.viewport * .55,
          "Published Tech News mobile feature should use a compact image");
      }
      if (sample.name === "mobile-light") {
        await page.screenshot({ path: out + "/tech-news-mobile-first-screen.png" });
        if (techMobileRowCount > 0) {
          await page.locator(".tech-news-page .editorial-vertical-list").screenshot({ path: out + "/tech-news-mobile-list.png" });
        }
      }
      const scienceMobileResponse = await page.goto(base + "/science", { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(scienceMobileResponse?.status(), 200, "Science should load on mobile");
      const scienceMobileRows = page.locator(".science-page .editorial-vertical-list .article-card--horizontal");
      const scienceMobileRowCount = await scienceMobileRows.count();
      if (scienceMobileRowCount === 0) {
        assert.equal(await page.locator(".science-page .category-lead").count(), 1,
          "A Science archive with only one published article should show its real featured story");
        assert((await page.locator(".science-page .category-count").textContent()).includes("1 published story"),
          "A Science archive with no list must have exactly one published story");
        const width = await page.evaluate(() => document.documentElement.scrollWidth);
        assert(width <= sample.width + 1, "Single-story Science must not overflow mobile");
      }
      if (await page.locator(".science-page .science-empty-state").count()) {
        assert.equal(await page.locator(".science-page .science-elsewhere").count(), 1,
          "Empty Science should clearly label its cross-section articles");
        assert((await page.locator(".science-page .cross-section-note").innerText()).includes("other published sections"),
          "Do not pass off other sections' articles as Science reporting");
        assert((await page.locator('head meta[name="robots"]').getAttribute("content"))?.includes("noindex"),
          "Unpublished Science section must remain noindex");
      }
      if (scienceMobileRowCount > 0) {
        const scienceMobileLayout = await scienceMobileRows.first().evaluate(article => {
          const row = article.getBoundingClientRect();
          const thumb = article.querySelector(".card-image").getBoundingClientRect();
          const copy = article.querySelector(".card-copy").getBoundingClientRect();
          return {
            adjacent: thumb.left < copy.left && thumb.right <= copy.left,
            fraction: thumb.width / row.width,
            pageWidth: document.documentElement.scrollWidth,
            viewportWidth: window.innerWidth,
          };
        });
        assert(scienceMobileLayout.adjacent && scienceMobileLayout.fraction <= .37,
          "Science mobile needs compact left thumbnails and headlines to the right");
        assert(scienceMobileLayout.pageWidth <= scienceMobileLayout.viewportWidth + 1,
          "Science must not horizontally overflow 390px or 320px screens");
      }
      if (sample.name === "mobile-light") {
        await page.screenshot({ path: out + "/science-mobile-first-screen.png" });
        if (scienceMobileRowCount > 0) {
          await page.locator(".science-page .editorial-vertical-list").screenshot({ path: out + "/science-mobile-vertical-list.png" });
        }
      }
      const mobileSecurity = await page.goto(base + "/security", { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(mobileSecurity?.status(), 200, "Security category should load on mobile");
      const securityRows = page.locator(".security-page .editorial-vertical-list .article-card--horizontal");
      assert((await securityRows.count()) > 0, "Security needs real articles in a vertical list");
      const metrics = await securityRows.first().evaluate((article) => {
        const row = article.getBoundingClientRect();
        const image = article.querySelector(".card-image").getBoundingClientRect();
        const copy = article.querySelector(".card-copy").getBoundingClientRect();
        return { horizontal: image.left < copy.left && image.right <= copy.left,
          thumbnailRatio: image.width / row.width,
          scrollWidth: document.documentElement.scrollWidth, viewportWidth: window.innerWidth };
      });
      assert(metrics.horizontal && metrics.thumbnailRatio <= .37, "Security mobile thumbnails should stay compact beside the text");
      assert(metrics.scrollWidth <= metrics.viewportWidth + 1, "Security mobile should have no horizontal overflow");
      if (sample.name === "mobile-light") {
        await page.screenshot({ path: out + "/security-mobile-first-screen.png" });
        await page.locator(".security-page .editorial-vertical-list").screenshot({ path: out + "/security-mobile-archive.png" });
      }
      const mobileDigitalLife = await page.goto(base + "/digital-life", { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(mobileDigitalLife?.status(), 200, "Digital Life should load on mobile");
      const mobileDigitalRows = page.locator(".digital-life-page .editorial-vertical-list .article-card--horizontal");
      assert((await mobileDigitalRows.count()) > 0, "Digital Life mobile needs published vertical story rows");
      const digitalMobileMetrics = await mobileDigitalRows.first().evaluate((article) => {
        const row = article.getBoundingClientRect();
        const thumbnail = article.querySelector(".card-image").getBoundingClientRect();
        const heading = article.querySelector(".card-copy").getBoundingClientRect();
        return {
          sideBySide: thumbnail.left < heading.left && thumbnail.right <= heading.left,
          fraction: thumbnail.width / row.width,
          scrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
        };
      });
      assert(digitalMobileMetrics.sideBySide && digitalMobileMetrics.fraction <= .37,
        "Digital Life mobile rows must preserve small thumbnails beside headlines");
      assert(digitalMobileMetrics.scrollWidth <= digitalMobileMetrics.viewportWidth + 1,
        "Digital Life should not introduce horizontal overflow");
      if (sample.name === "mobile-light") {
        await page.screenshot({ path: out + "/digital-life-mobile-first-screen.png" });
        await page.locator(".digital-life-page .editorial-vertical-list").screenshot({ path: out + "/digital-life-mobile-archive.png" });
      }
    }
    if (sample.name === "desktop-light") {
      for (const category of ["ai", "tech-news", "how-to", "security", "digital-life"]) {
        const sectionResponse = await page.goto(base + "/" + category, { waitUntil: "domcontentloaded", timeout: 45000 });
        assert.equal(sectionResponse?.status(), 200, `Primary category ${category} should load`);
        if (category === "how-to") {
          assert.equal(await page.locator('header .nav-scroll > a[href="/how-to"]').count(), 1,
            "How-To must appear in the eight-section primary navigation");
        }
        assert((await page.locator('main a[href^="/articles/"]').count()) > 0, `Primary category ${category} should link to published stories`);
        if (category !== "tech-news") assert.equal(await page.locator("main").getByText("Coverage in development").count(), 0, `Primary category ${category} must not be an empty placeholder`);
        if (category === "how-to") {
          const image = page.locator(".category-lead-image img").first();
          assert.equal(await image.getAttribute("fetchpriority"), "high", "How-To lead must retain high fetch priority");
          assert((await image.getAttribute("src"))?.startsWith("/images/"), "How-To lead must avoid /_next/image redirects");
          assert((await image.getAttribute("srcset"))?.includes("/images/responsive/"), "How-To lead should serve generated responsive WebP variants");
          const list = page.locator(".how-to-guide-list");
          assert.equal(await list.count(), 1, "How-To needs a dedicated vertical guide list");
          const guideCards = list.locator(".article-card--horizontal");
          assert((await guideCards.count()) > 0, "How-To must display published guides after the featured story");
          assert.equal(await page.locator(".how-to-page .article-grid").count(), 0,
            "How-To must not use the old two-column article grid");
          const listLayout = await list.evaluate((element) => ({
            columns: getComputedStyle(element).gridTemplateColumns.split(" ").length,
            positions: Array.from(element.querySelectorAll(":scope > article")).slice(0, 3)
              .map((article) => article.getBoundingClientRect().top),
            width: element.getBoundingClientRect().width,
          }));
          assert.equal(listLayout.columns, 1, "How-To guides should be one column on desktop");
          assert(listLayout.positions.every((top, idx, all) => idx === 0 || top > all[idx - 1]),
            "How-To guide rows must be vertically stacked");
          const guideImage = guideCards.locator(".card-image img").first();
          assert((await guideImage.getAttribute("sizes"))?.includes("260px"),
            "How-To list images should request thumbnail-sized responsive artwork");
          await page.screenshot({ path: out + "/how-to-desktop-first-screen.png" });
          await list.screenshot({ path: out + "/how-to-desktop-guide-list.png" });
        }
        if (category === "tech-news") {
          const techSingle = (await page.locator(".tech-news-page .editorial-vertical-list").count()) === 0;
          if (techSingle) {
            assert.equal(await page.locator(".tech-news-page .category-lead").count(), 1,
              "Single published Tech News story should have a real featured article without a list");
            assert((await page.locator(".tech-news-page .category-count").textContent()).includes("1 published story"),
              "Tech News needs exactly one published story when no archive list is present");
            await page.screenshot({ path: out + "/tech-news-desktop-first-screen.png" });
          } else {
            const list = page.locator(".tech-news-page .editorial-vertical-list");
            assert.equal(await list.count(), 1, "Tech News should use one vertical archive list");
            assert.equal(await page.locator(".tech-news-page .article-grid").count(), 0,
              "Tech News must not retain the two-column card grid");
            const rows = list.locator(".article-card--horizontal");
            assert((await rows.count()) > 0, "Tech News must display genuine published rows without fabricating section articles");
            const noTechNewsYet = (await page.locator(".tech-news-page .tech-news-empty-state").count()) > 0;
            if (noTechNewsYet) {
              assert.equal(await page.locator(".tech-news-page .tech-news-elsewhere").count(), 1,
                "If Tech News has no published stories, only clearly labeled cross-section content can be shown");
              assert.equal(await page.locator(".tech-news-page .category-lead").count(), 0,
                "Do not invent a Tech News featured article for an empty category");
              assert((await page.locator(".tech-news-page .cross-section-note").innerText()).includes("other published sections"),
                "Empty Tech News must identify the true source sections");
            } else {
              assert.equal(await page.locator(".tech-news-page .tech-news-elsewhere").count(), 0,
                "Once Tech News has published stories, the true category archive should be displayed");
            }
            const positions = await list.evaluate((element) => ({
              columns: getComputedStyle(element).gridTemplateColumns.split(" ").length,
              tops: Array.from(element.querySelectorAll(":scope > article")).slice(0, 3)
                .map((article) => article.getBoundingClientRect().top),
            }));
            assert.equal(positions.columns, 1, "Tech News desktop articles should be in a single column");
            assert(positions.tops.every((y, i, all) => i === 0 || y > all[i - 1]),
              "Tech News rows must be vertically stacked");
            assert((await rows.locator(".card-image img").first().getAttribute("sizes"))?.includes("260px"),
              "Tech News images should request thumbnail-sized responsive WebP");
            await page.screenshot({ path: out + "/tech-news-desktop-first-screen.png" });
            await list.screenshot({ path: out + "/tech-news-desktop-list.png" });
            if (await page.locator('.tech-news-page .pagination a[href="/tech-news?page=2"]').count()) {
              const second = await page.goto(base + "/tech-news?page=2", { waitUntil: "domcontentloaded", timeout: 45000 });
              assert.equal(second?.status(), 200, "Tech News second page must load if pagination is present");
              assert.equal(await page.locator(".tech-news-page .category-lead").count(), 0,
                "Tech News featured story must only appear on page one");
              assert((await page.locator(".tech-news-page .editorial-vertical-list .article-card--horizontal").count()) > 0,
                "Tech News later pages should keep the vertical list layout");
            }
  
          }
        }
        if (category === "security") {
          const securityList = page.locator(".security-page .editorial-vertical-list");
          assert.equal(await securityList.count(), 1, "Security must have a single editorial archive list");
          assert.equal(await page.locator(".security-page .article-grid").count(), 0, "Security must not use the old two-column grid");
          const rows = securityList.locator(".article-card--horizontal");
          assert((await rows.count()) > 0, "Security must have published rows");
          const positions = await securityList.evaluate((el) => ({
            columns: getComputedStyle(el).gridTemplateColumns.split(" ").length,
            tops: Array.from(el.querySelectorAll(":scope > article")).slice(0, 3)
              .map(article => article.getBoundingClientRect().top),
          }));
          assert.equal(positions.columns, 1, "Security archive should use one column");
          assert(positions.tops.every((y, i, arr) => i === 0 || y > arr[i - 1]), "Security rows must stack vertically");
          assert((await rows.locator(".card-image img").first().getAttribute("sizes"))?.includes("260px"),
            "Security archive should use appropriately sized responsive thumbnails");
          await page.screenshot({ path: out + "/security-desktop-first-screen.png" });
          await securityList.screenshot({ path: out + "/security-desktop-archive.png" });
        }
        if (category === "digital-life") {
          const list = page.locator(".digital-life-page .editorial-vertical-list");
          assert.equal(await list.count(), 1, "Digital Life should have a single editorial archive list");
          assert.equal(await page.locator(".digital-life-page .article-grid").count(), 0,
            "Digital Life should not use the old two-column article grid");
          const rows = list.locator(".article-card--horizontal");
          assert((await rows.count()) > 0, "Digital Life needs real published story rows");
          const grid = await list.evaluate((element) => ({
            columns: getComputedStyle(element).gridTemplateColumns.split(" ").length,
            positions: Array.from(element.querySelectorAll(":scope > article")).slice(0, 3)
              .map((article) => article.getBoundingClientRect().top),
          }));
          assert.equal(grid.columns, 1, "Digital Life archive must be one column on desktop");
          assert(grid.positions.every((top, index, arr) => index === 0 || top > arr[index - 1]),
            "Digital Life article rows must stack vertically");
          assert((await rows.locator(".card-image img").first().getAttribute("sizes"))?.includes("260px"),
            "Digital Life archive should request correctly sized thumbnail images");
          await page.screenshot({ path: out + "/digital-life-desktop-first-screen.png" });
          await list.screenshot({ path: out + "/digital-life-desktop-archive.png" });
          if (await page.locator('.digital-life-page .pagination a[href="/digital-life?page=2"]').count()) {
            const nextPage = await page.goto(base + "/digital-life?page=2", { waitUntil: "domcontentloaded", timeout: 45000 });
            assert.equal(nextPage?.status(), 200, "Digital Life page 2 should remain valid");
            assert.equal(await page.locator(".digital-life-page .category-lead").count(), 0,
              "Digital Life must not repeat the featured story on page 2");
            assert((await page.locator(".digital-life-page .editorial-vertical-list .article-card--horizontal").count()) > 0,
              "Digital Life pagination must continue in the vertical archive layout");
          }
        }
      }
      const scienceResponse = await page.goto(base + "/science", { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(scienceResponse?.status(), 200, "Science category must remain reachable");
      const scienceList = page.locator(".science-page .editorial-vertical-list");
      const scienceSingle = (await scienceList.count()) === 0;
      if (scienceSingle) {
        assert.equal(await page.locator(".science-page .category-lead").count(), 1,
          "A single genuine Science article should appear as a featured story");
        assert((await page.locator(".science-page .category-count").textContent()).includes("1 published story"),
          "Science needs one actual published article when no list exists");
        await page.screenshot({ path: out + "/science-desktop-first-screen.png" });
      } else {
        assert.equal(await scienceList.count(), 1, "Science must display a single-column editorial list");
        assert.equal(await page.locator(".science-page .article-grid").count(), 0,
          "Science must not show the old tiled article grid");
        const scienceRows = scienceList.locator(".article-card--horizontal");
        assert((await scienceRows.count()) > 0, "Science must link to real published articles");
        if (await page.locator(".science-page .science-empty-state").count()) {
          assert((await page.locator('head meta[name="robots"]').getAttribute("content"))?.includes("noindex"),
            "Empty Science category must remain noindex");
          assert.equal(await page.locator(".science-page .category-lead").count(), 0,
            "Empty Science must never invent a featured article");
          assert.equal(await page.locator("main").getByText("Coverage in development").count(), 1,
            "Empty Science must still accurately describe editorial coverage");
          assert.equal(await page.locator(".science-page .science-elsewhere").count(), 1,
            "Cross-section articles must be clearly distinguished from Science reporting");
          assert((await page.locator(".science-page .cross-section-note").innerText()).includes("other published sections"),
            "Other articles must not be mislabeled as Science");
        } else {
          assert.equal(await page.locator(".science-page .science-elsewhere").count(), 0,
            "Once Science has published articles, use genuine Science content");
        }
        const sciencePositions = await scienceList.evaluate(element => ({
          columns: getComputedStyle(element).gridTemplateColumns.split(" ").length,
          tops: Array.from(element.querySelectorAll(":scope > article")).slice(0, 3)
            .map(article => article.getBoundingClientRect().top),
        }));
        assert.equal(sciencePositions.columns, 1, "Science must use a vertical one-column list");
        assert(sciencePositions.tops.every((y, i, all) => i === 0 || y > all[i - 1]),
          "Science rows should stack one below another");
        assert((await scienceRows.locator(".card-image img").first().getAttribute("sizes"))?.includes("260px"),
          "Science list should request responsive thumbnail-sized images");
        await page.screenshot({ path: out + "/science-desktop-first-screen.png" });
        await scienceList.screenshot({ path: out + "/science-desktop-vertical-list.png" });
        if (await page.locator('.science-page .pagination a[href="/science?page=2"]').count()) {
          const scienceSecond = await page.goto(base + "/science?page=2", { waitUntil: "domcontentloaded", timeout: 45000 });
          assert.equal(scienceSecond?.status(), 200, "Science page two must work when published archive grows");
          assert.equal(await page.locator(".science-page .category-lead").count(), 0,
            "Featured Science story should only appear on first page");
          assert((await page.locator(".science-page .editorial-vertical-list .article-card--horizontal").count()) > 0,
            "Science pagination must preserve the vertical layout");
        }
  
      }
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
      assert.equal(await page.locator(".security-page .editorial-vertical-list").count(), 1,
        "Security page 2 should also use a vertical archive");
      assert((await page.locator(".security-page .editorial-vertical-list .article-card--horizontal").count()) > 0,
        "Security page 2 should list published articles");
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
        if (name === "weekly-archive") {
          assert.equal(await page.locator(".weekly-magazine").count(), 1, "Weekly archive must show exactly one latest issue");
          assert.equal(await page.locator(`.weekly-magazine-feature a[href="/weekly/${newestWeeklySlug}"]`).count(), 2,
            "Featured Weekly title and reading CTA must both open the current published issue");
          const cover = page.locator(".weekly-magazine-cover img");
          assert.equal(await cover.count(), 1, "Weekly archive should display the published edition cover");
          assert((await cover.getAttribute("src"))?.startsWith("/images/weekly/"),
            "Weekly archive should use an actual editorial cover image");
          assert((await cover.getAttribute("alt"))?.length > 20, "Cover image must have meaningful alt text");
          const coverMetrics = await page.locator(".weekly-magazine-cover").evaluate(el => ({
            ratio: el.getBoundingClientRect().width / el.getBoundingClientRect().height,
          }));
          assert(coverMetrics.ratio > 2 && coverMetrics.ratio < 2.5,
            "Desktop magazine cover should have a 16:7-style wide format");
          assert((await page.locator(".weekly-magazine-index li").count()) >= 1,
            "Latest Weekly contents should be sourced from the published issue");
          assert((await page.locator(".weekly-magazine-archive li").count()) >= 1,
            "Previous Weekly editions must remain discoverable");
          assert.equal(await page.locator('.weekly-archive-page a[href="/rss.xml"]').count(), 1,
            "Weekly archive should retain its working RSS link");
          assert.equal(await page.locator(".weekly-archive-page .weekly-magazine-method").count(), 1,
            "Weekly archive should retain its editorial methodology");
          await page.screenshot({ path: out + "/weekly-magazine-desktop-first-screen.png" });
          await page.screenshot({ path: out + "/weekly-magazine-desktop-full.png", fullPage: true });
        }
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
    if (sample.name === "mobile-light" || sample.name === "small-mobile-dark") {
      const weeklyResponse = await page.goto(base + "/weekly", { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(weeklyResponse?.status(), 200, "Weekly magazine should load on mobile");
      assert.equal(await page.locator(".weekly-magazine").count(), 1, "Weekly mobile needs a featured issue");
      assert((await page.locator(".weekly-magazine-index li").count()) >= 1, "Weekly mobile should keep the issue topics");
      assert((await page.locator(".weekly-magazine-archive li").count()) >= 1, "Earlier Weekly editions must be visible on mobile");
      const weeklyMobile = await page.locator(".weekly-magazine-cover").evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        return {
          ratio: bounds.width / bounds.height,
          scrollWidth: document.documentElement.scrollWidth,
          viewport: window.innerWidth,
        };
      });
      assert(weeklyMobile.ratio > 1.7 && weeklyMobile.ratio < 1.9,
        "Weekly mobile cover should retain a compact 16:9 ratio");
      assert(weeklyMobile.scrollWidth <= weeklyMobile.viewport + 1, "Weekly mobile must not overflow horizontally");
      if (sample.name === "mobile-light") {
        await page.screenshot({ path: out + "/weekly-magazine-mobile-first-screen.png" });
        await page.screenshot({ path: out + "/weekly-magazine-mobile-full.png", fullPage: true });
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
