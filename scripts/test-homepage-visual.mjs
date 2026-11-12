import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.HOMEPAGE_PREVIEW_URL ?? "http://localhost:5173";
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
  const pageErrors = [];
  page.on("pageerror", e => pageErrors.push(e.message));
  page.on("console", message => {
    if (message.type() === "error") pageErrors.push("console: " + message.text());
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
    assert.equal(await page.locator(".weekly-feature").count(), 0, "Weekly Brief should not dominate the homepage");
    const leadSrc = await page.locator(".lead-image img").getAttribute("src");
    assert(leadSrc?.startsWith("/images/"), "Homepage hero must fetch the real WebP directly, not redirect through /_next/image");
    const firstFeedSrc = await page.locator(".latest-feed .card-image img").first().getAttribute("src");
    assert(firstFeedSrc?.startsWith("/images/"), "Homepage thumbnails must avoid unnecessary /_next/image redirects");
    assert.equal(await page.locator(".lead-image img").getAttribute("fetchpriority"), "high", "Hero LCP image must keep high fetch priority");
    assert.equal(await page.locator(".latest-feed .article-card--horizontal .card-image img").first().getAttribute("srcset"), null, "Do not advertise fake optimized widths for unchanged original WebP images");
    assert.deepEqual(await page.locator(".primary-nav .nav-scroll > a").allTextContents(), ["Tech News", "Reviews", "Science", "Entertainment", "Latest"], "Main navigation items");
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
    await search.focus();
    assert(await search.evaluate(el => document.activeElement === el), "Search CTA must accept keyboard focus");
    await page.locator("section.reader-paths").screenshot({ path: out + "/" + sample.name + "-discovery.png" });


    // Browser regression coverage for the navigation, including the mobile drawer.
    const mobileMenu = page.locator(".mobile-menu-button");
    if (sample.width <= 1000) {
      assert(await mobileMenu.isVisible(), "Mobile menu toggle must be available");
      await mobileMenu.click();
      assert(await page.locator("#site-navigation").isVisible(), "Mobile navigation should open");
    } else {
      assert(await page.locator("#site-navigation").isVisible(), "Desktop navigation must be visible");
    }

    const more = page.locator(".more-menu > summary");
    await more.click();
    assert(await page.locator(".more-menu").evaluate(element => element.open), "More menu should expand");
    assert(await page.locator('.more-panel a[href="/ai"]').isVisible(), "Existing AI section must remain discoverable");
    assert.equal(await page.locator('.more-panel a[href="/latest"]').count(), 0, "Latest must not appear in More");
    assert.equal(await page.locator('.primary-nav .nav-scroll > a[href="/latest"]').count(), 1, "Latest must appear once in primary navigation");
    assert(await page.locator('.more-panel a[href="/review-methodology"]').isVisible(), "Review Methodology must be discoverable");

    await page.keyboard.press("Escape");
    assert(!await page.locator(".more-menu").evaluate(element => element.open), "Escape must close More");
    assert(await more.evaluate(element => document.activeElement === element), "Escape restores focus to More");

    const methodology = await page.goto(base + "/review-methodology", { waitUntil: "domcontentloaded", timeout: 45000 });
    assert(methodology && methodology.status() === 200, "Review Methodology must return HTTP 200");
    assert.equal(await page.locator("main h1").innerText(), "Review Methodology", "Review Methodology page heading");
    assert(await page.locator("main").innerText().then(text => text.includes("Research versus hands-on testing")), "Review policy must distinguish documentation and testing");
    assert((await page.locator(".footer-note").innerText()).includes("Technology news, reviews, science"), "Footer must use current publication description");

    await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 45000 });
    const searchAgain = page.locator('a.reader-search-link[href="/search"]');
    await searchAgain.click();
    await page.waitForURL(/\/search(?:\?|$)/, { timeout: 20000 });
    assert((await page.locator("h1").first().innerText()).includes("Search DECODISTA"), "Search destination must work");
    if (sample.name === "desktop-light") {
      const latestPage = await page.goto(base + "/latest", { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(latestPage?.status(), 200, "Latest archive must load");
      const firstArchiveImage = page.locator(".archive-feed .article-card--horizontal .card-image img").first();
      await firstArchiveImage.waitFor({ state: "attached", timeout: 20000 });
      assert.notEqual(await firstArchiveImage.getAttribute("loading"), "lazy", "Above-the-fold Latest thumbnail must not be lazy-loaded");
      assert((await firstArchiveImage.getAttribute("src"))?.startsWith("/images/"), "Latest archive must fetch original WebP directly, avoiding the redirecting optimizer");
      assert.equal(await firstArchiveImage.getAttribute("srcset"), null, "Latest must not emit nonexistent responsive image variants");
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
    }
    report.status = "passed";
    report.measures = measures;
    report.pageErrors = pageErrors;
  } catch (err) {
    report.status = "failed";
    report.error = String(err);
    report.pageErrors = pageErrors;
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
