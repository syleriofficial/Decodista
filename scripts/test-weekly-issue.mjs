import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.WEEKLY_PREVIEW_URL ?? "http://localhost:5173";
const dest = "artifacts/weekly-issue-qa";
await mkdir(dest, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
const issues = [];
for (const sample of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
  { name: "small-mobile", width: 320, height: 720 },
]) {
  const context = await browser.newContext({
    viewport: { width: sample.width, height: sample.height },
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  try {
    const res = await page.goto(base + "/weekly/2026-11-16", { waitUntil: "domcontentloaded", timeout: 45000 });
    assert.equal(res?.status(), 200, "New weekly issue must return 200");
    await page.waitForLoadState("networkidle", { timeout: 30000 });
    assert.equal(await page.locator("main h1").count(), 1, "Exactly one H1");
    assert.match(await page.locator("main h1").innerText(), /Chrome.+83 Security Fixes/);
    assert(/issue\s+3/i.test(await page.locator(".weekly-issue-header .eyebrow").innerText()), "Issue number must display");
    assert.equal(await page.locator(".weekly-item").count(), 5, "Five verified developments");
    assert.equal(await page.locator(".weekly-top-takeaways li").count(), 3, "Three top takeaways");
    assert.equal(await page.locator(".weekly-checklist li").count(), 5, "Five practical steps");
    assert.equal(await page.locator(".weekly-in-this-issue li").count(), 5, "Five jump links");
    assert.equal(await page.locator(".weekly-sources a").count(), 7, "Five primary and two vendor references");
    for (const a of await page.locator(".weekly-sources a").all()) {
      assert.match(await a.getAttribute("href"), /^https:\/\//, "External source must use HTTPS");
      assert.equal(await a.getAttribute("rel"), "noopener noreferrer");
    }
    const image = page.locator(".weekly-hero img");
    assert.equal(await image.count(), 1, "One issue cover image");
    assert((await image.getAttribute("alt"))?.length > 20, "Issue cover must have descriptive alt text");
    const src = await image.getAttribute("src");
    assert(src?.includes("/images/weekly/2026-11-16-cover.webp"), "Expected committed issue cover");
    const heroAsset = await page.request.get(base + "/images/weekly/2026-11-16-cover.webp");
    assert.equal(heroAsset.status(), 200, "Issue cover should load");
    const ogAsset = await page.request.get(base + "/images/weekly/2026-11-16-og.webp");
    assert.equal(ogAsset.status(), 200, "Social cover should load");
    assert.match(ogAsset.headers()["content-type"] ?? "", /image\/webp/, "Social image content type");
    assert.match(heroAsset.headers()["content-type"] ?? "", /image\/webp/, "Cover must use image content type");
    const canonical = await page.locator('head link[rel="canonical"]').getAttribute("href");
    assert.equal(canonical, "https://decodista.com/weekly/2026-11-16", "Issue canonical should be absolute");
    assert.equal(await page.locator('head meta[property="og:type"]').getAttribute("content"), "article");
    assert.match(await page.locator('head meta[property="og:image"]').getAttribute("content") ?? "", /2026-11-16-og.webp/);
    assert.equal(await page.locator('head meta[name="twitter:card"]').getAttribute("content"), "summary_large_image");
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    const parsed = ld.map(x => JSON.parse(x));
    const types = parsed.map(x => x["@type"]);
    assert(types.includes("BlogPosting"), "BlogPosting JSON-LD");
    assert(types.includes("BreadcrumbList"), "BreadcrumbList JSON-LD");
    const post = parsed.find(x => x["@type"] === "BlogPosting");
    assert.equal(post.datePublished, "2026-11-16");
    assert.deepEqual(post.image, ["https://decodista.com/images/weekly/2026-11-16-cover.webp"]);
    const widths = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
    assert(widths.document <= widths.viewport + 1, `Unexpected horizontal overflow: ${JSON.stringify(widths)}`);
    const jump = page.locator(".weekly-in-this-issue a").first();
    await jump.focus();
    assert(await jump.evaluate(el => el === document.activeElement), "Keyboard focus on weekly jump link");
    await jump.click();
    assert.equal(new URL(page.url()).hash, "#chrome-157-security-fixes", "Anchor navigates to issue update");
    await page.screenshot({ path: `${dest}/${sample.name}.png`, fullPage: true });
    results.push({ sample: sample.name, pass: true, ...widths });

    // Check the current weekly edition without replacing coverage of issue 3.
    const latest = await page.goto(base + "/weekly/2026-11-22", { waitUntil: "domcontentloaded", timeout: 45000 });
    assert.equal(latest?.status(), 200, "Issue 4 must return 200");
    await page.waitForLoadState("networkidle", { timeout: 30000 });
    assert.equal(await page.locator("main h1").count(), 1, "Issue 4: exactly one H1");
    assert.match(await page.locator("main h1").innerText(), /Chrome.+204 Fixes/);
    assert(/issue\\s+4/i.test(await page.locator(".weekly-issue-header .eyebrow").innerText()), "Issue 4 number must display");
    assert.equal(await page.locator(".weekly-item").count(), 5, "Issue 4: five verified updates");
    assert.equal(await page.locator(".weekly-top-takeaways li").count(), 3, "Issue 4: three takeaways");
    assert.equal(await page.locator(".weekly-item-visual img").count(), 2, "Issue 4: two inline illustrations");
    assert.equal(await page.locator(".weekly-hero img").count(), 1, "Issue 4: hero illustration");
    for (const img of await page.locator(".weekly-hero img, .weekly-item-visual img").all()) {
      assert((await img.getAttribute("alt"))?.length > 20, "Issue 4: image needs meaningful alt text");
      const url = await img.getAttribute("src");
      assert(url?.endsWith(".webp"), "Issue 4: image must be WebP");
      const asset = await page.request.get(base + url);
      assert.equal(asset.status(), 200, "Issue 4: committed image must load");
      assert.match(asset.headers()["content-type"] ?? "", /image\\/webp/, "Issue 4: image MIME type");
    }
    const social = await page.request.get(base + "/images/weekly/2026-11-22-og.webp");
    assert.equal(social.status(), 200, "Issue 4: social image must load");
    assert.match(await page.locator('head meta[property="og:image"]').getAttribute("content") ?? "", /2026-11-22-og.webp/);
    assert.equal(await page.locator('head link[rel="canonical"]').getAttribute("href"), "https://decodista.com/weekly/2026-11-22");
    const latestWidths = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
    assert(latestWidths.document <= latestWidths.viewport + 1, "Issue 4: unexpected horizontal overflow");
    assert.equal(errors.length, 0, "Issue 4: browser must not report errors");
    await page.screenshot({ path: `${dest}/${sample.name}-issue-4.png`, fullPage: true });
    results.push({ sample: `${sample.name}-issue-4`, pass: true, ...latestWidths });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    issues.push({ sample: sample.name, message, errors });
    await page.screenshot({ path: `${dest}/${sample.name}-failure.png`, fullPage: true }).catch(() => {});
  } finally {
    await context.close();
  }
}
const context = await browser.newContext();
const page = await context.newPage();
try {
  const archive = await page.goto(base + "/weekly", { waitUntil: "domcontentloaded", timeout: 45000 });
  assert.equal(archive?.status(), 200);
  assert.match(await page.locator(".weekly-spotlight h2").innerText(), /Chrome.+204 Fixes/, "Issue 4 must be latest");
  assert((await page.locator(".weekly-archive").innerText()).includes("Chrome\u0027s 83 Security Fixes"), "Issue 3 retained");
  assert((await page.locator(".weekly-archive").innerText()).includes("iPhone and Firefox Fixes"), "Older issue retained");
  const sitemap = await page.request.get(base + "/sitemap.xml");
  assert.equal(sitemap.status(), 200);
  const xml = await sitemap.text();
  assert(xml.includes("https://decodista.com/weekly/2026-11-22"), "Issue 4 in sitemap");
  assert(xml.includes("https://decodista.com/weekly/2026-11-16"), "Issue 3 retained in sitemap");
  assert(xml.includes("https://decodista.com/weekly/2026-11-11"), "Issue 2 retained in sitemap");
  const unknown = await page.goto(base + "/weekly/not-a-date", { waitUntil: "domcontentloaded" });
  assert.equal(unknown?.status(), 404);
  results.push({ sample: "archive-sitemap-404", pass: true });
} catch (error) {
  issues.push({ sample: "archive-sitemap-404", message: error instanceof Error ? error.message : String(error) });
}
await context.close();
await browser.close();
await writeFile(dest + "/results.json", JSON.stringify({ results, issues }, null, 2));
console.log(JSON.stringify({ results, issues }, null, 2));
if (issues.length > 0) process.exitCode = 1;
