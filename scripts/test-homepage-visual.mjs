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
  const report = { ...sample };
  try {
    const res = await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 45000 });
    assert(res && res.status() === 200, "Homepage must return HTTP 200");
    await page.locator(".reader-search-link").waitFor({ state: "visible", timeout: 20000 });
    if (sample.theme === "dark") {
      await page.evaluate(() => document.documentElement.dataset.theme = "dark");
    }
    const search = page.locator('a.reader-search-link[href="/search"]');
    assert.equal(await search.count(), 1, "Homepage should have exactly one new guide-search link");
    assert((await search.innerText()).includes("Search all published guides"), "Search link has expected label");
    assert.equal(await page.locator('h2#latest-title').innerText(), "Latest Stories", "Latest block name");
    assert.equal(await page.locator(".weekly-feature").count(), 0, "Weekly Brief should not dominate the homepage");
    assert.deepEqual(await page.locator(".primary-nav .nav-scroll > a").allTextContents(), ["Tech News", "Reviews", "Science", "Entertainment"], "Main navigation items");
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

    await search.click();
    await page.waitForURL(/\/search(?:\?|$)/, { timeout: 20000 });
    assert((await page.locator("h1").first().innerText()).includes("Search DECODISTA"), "Search destination must work");
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
