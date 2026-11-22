import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = (process.env.DECODISTA_PREVIEW_URL || "http://localhost:5173").replace(/\/$/, "");
const path = "/articles/fake-captcha-scams-clickfix-malware";
const title = "Fake CAPTCHA Scams: How ClickFix Works and How to Stay Safe";
const output = "artifacts/fake-store-article-qa";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--no-sandbox"] });
const results = [];
let failed = false;

for (const sample of [
  { name: "desktop-light", width: 1440, height: 900, scheme: "light" },
  { name: "tablet-light", width: 768, height: 1024, scheme: "light" },
  { name: "mobile-light", width: 390, height: 844, scheme: "light" },
  { name: "small-mobile-dark", width: 320, height: 720, scheme: "dark" },
]) {
  const context = await browser.newContext({
    viewport: { width: sample.width, height: sample.height },
    colorScheme: sample.scheme, reducedMotion: "reduce",
  });
  // Review the article after the visitor has explicitly declined optional analytics.
  // This is synthetic browser state only; it does not change production consent settings.
  await context.addInitScript(() => localStorage.setItem("decodista-analytics-consent", "denied"));
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (err) => errors.push(err.message));
  const record = { ...sample, success: false, errors: [] };
  try {
    const response = await page.goto(base + path, { waitUntil: "domcontentloaded", timeout: 60000 });
    assert.equal(response?.status(), 200, "Article must return HTTP 200");
    await page.locator("article h1").waitFor({ state: "visible", timeout: 25000 });
    const declineAnalytics = page.getByRole("button", { name: "Decline analytics" });
    if (await declineAnalytics.isVisible()) {
      await declineAnalytics.click();
      await declineAnalytics.waitFor({ state: "hidden", timeout: 10000 });
    }
    assert.equal(await page.locator("article h1").innerText(), title);
    assert.equal(await page.locator("article h1").count(), 1);
    assert((await page.locator("article header").innerText()).includes("Security"), "Category visible");
    assert.equal(await page.locator("h2#short-answer-title").count(), 1);
    assert.equal(await page.locator("h2#faq").count(), 1);
    const toc = page.locator('nav[aria-label="Table of contents"]');
    assert(await toc.count(), "Article TOC must render");
    assert((await toc.locator("a").count()) >= 10, "TOC should include ten checks and other sections");
    for (const href of [
      "/articles/chrome-enhanced-protection-vs-standard-protection",
      "/articles/recover-hacked-google-account-gmail",
          ]) assert((await page.locator('a[href="' + href + '"]').count()) > 0, "Related internal link missing: " + href);
    const hero = page.locator("figure.article-hero img").first();
    const diagram = page.locator('img[alt^="Original educational comparison showing a legitimate"]').first();
    const checklist = page.locator('img[alt^="Original decision aid distinguishing viewing"]').first();
    for (const [label, img] of [["hero", hero], ["domain comparison", diagram], ["shopping checklist", checklist]]) {
      await img.waitFor({ state: "attached", timeout: 20000 });
      await img.scrollIntoViewIfNeeded({ timeout: 20000 });
      await img.evaluate(async (el) => {
        if (!el.complete) await new Promise((resolve, reject) => {
          el.addEventListener("load", resolve, { once: true });
          el.addEventListener("error", reject, { once: true });
        });
        if (el.decode) await el.decode();
      });
      const shape = await img.evaluate(el => ({ width: el.naturalWidth, height: el.naturalHeight, alt: el.alt }));
      assert(shape.width >= 320 && shape.height > 0, label + " did not load");
      assert(shape.alt.length >= 25, label + " needs a descriptive alt");
    }
    const metrics = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      h1Width: document.querySelector("article h1")?.getBoundingClientRect().width,
      metaDescription: document.querySelector('meta[name="description"]')?.content || "",
      canonical: document.querySelector('link[rel="canonical"]')?.href || "",
      jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map(el => {
        try { return JSON.parse(el.textContent || "{}"); } catch { return null; }
      }).filter(Boolean),
    }));
    assert(metrics.scrollWidth <= metrics.viewport + 3, "Page horizontally overflows viewport: " + JSON.stringify(metrics));
    assert(metrics.h1Width > 0, "Heading not laid out");
    assert(metrics.metaDescription.length >= 70, "SEO meta description missing");
    assert(metrics.canonical.endsWith(path), "Canonical URL does not match article");
    assert(metrics.jsonLd.some(j => j["@type"] === "Article" && j.headline === title), "Article structured data missing");
    assert(metrics.jsonLd.some(j => j["@type"] === "BreadcrumbList"), "Breadcrumb structured data missing");
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: output + "/" + sample.name + ".png", fullPage: true, animations: "disabled" });
    assert.deepEqual(errors, [], "Client-side errors");
    record.success = true;
    record.metrics = { viewport: metrics.viewport, scrollWidth: metrics.scrollWidth, canonical: metrics.canonical };
  } catch (error) {
    failed = true;
    record.errors = [...errors, String(error?.stack || error)];
    try { await page.screenshot({ path: output + "/" + sample.name + "-failed.png", fullPage: true }); } catch {}
  } finally {
    results.push(record);
    await context.close();
  }
}
await browser.close();
await writeFile(output + "/report.json", JSON.stringify({ url: base + path, results }, null, 2));
for (const result of results) console.log(result.name, result.success ? "PASS" : "FAIL", result.errors?.join("\n") || "");
if (failed) process.exitCode = 1;
