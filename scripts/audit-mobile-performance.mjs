import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

// Synthetic browser readings, either on a local preview or on the public
// production site. Never confuse them with CrUX field data or Lighthouse.
const base = process.env.HOMEPAGE_PREVIEW_URL ?? "http://localhost:5173";
const targetHost = new URL(base).hostname;
const isLocal = targetHost === "localhost" || targetHost === "127.0.0.1";
const outDir = process.env.MOBILE_AUDIT_OUTPUT_DIR ?? "artifacts/homepage-qa";
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const routes = [
  { path: "/", label: "mobile-homepage" },
  { path: "/latest", label: "mobile-latest" },
  { path: "/articles/gmail-not-receiving-emails-google-storage-full", label: "mobile-article" },
];
const records = [];
const failures = [];

try {
  for (const route of routes) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.addInitScript(() => {
      window.__decodistaLab = { lcpMs: null, cls: 0, longTaskCount: 0, longTaskTotalMs: 0 };
      if (!("PerformanceObserver" in window)) return;
      for (const [type, callback] of [
        ["largest-contentful-paint", (entry) => { window.__decodistaLab.lcpMs = entry.startTime; }],
        ["layout-shift", (entry) => { if (!entry.hadRecentInput) window.__decodistaLab.cls += entry.value; }],
        ["longtask", (entry) => { window.__decodistaLab.longTaskCount++; window.__decodistaLab.longTaskTotalMs += entry.duration; }],
      ]) {
        try {
          new PerformanceObserver(list => { for (const item of list.getEntries()) callback(item); })
            .observe({ type, buffered: true });
        } catch {}
      }
    });
    try {
      const response = await page.goto(base + route.path, { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(response?.status(), 200, route.path + " must be accessible");
      await page.locator("main").first().waitFor({ state: "visible", timeout: 30000 });
      await page.waitForLoadState("networkidle", { timeout: 30000 });
      // Give late paint/shift observers a chance to deliver their buffered entries.
      await page.waitForTimeout(250);
      const metrics = await page.evaluate(() => {
        const nav = performance.getEntriesByType("navigation")[0];
        const paint = performance.getEntriesByType("paint");
        const resources = performance.getEntriesByType("resource");
        const fcp = paint.find(entry => entry.name === "first-contentful-paint")?.startTime ?? null;
        const byType = (kind) => resources.filter(entry => entry.initiatorType === kind);
        const transferred = entries => Math.round(entries.reduce((total, item) => total + (item.transferSize || 0), 0) / 1024);
        return {
          firstContentfulPaintMs: fcp && Math.round(fcp),
          largestContentfulPaintMs: window.__decodistaLab?.lcpMs ? Math.round(window.__decodistaLab.lcpMs) : null,
          cumulativeLayoutShift: window.__decodistaLab ? Number(window.__decodistaLab.cls.toFixed(4)) : null,
          longTaskCount: window.__decodistaLab?.longTaskCount ?? null,
          longTaskTotalMs: window.__decodistaLab ? Math.round(window.__decodistaLab.longTaskTotalMs) : null,
          domContentLoadedMs: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
          navigationResponseEndMs: nav ? Math.round(nav.responseEnd) : null,
          totalResources: resources.length,
          scriptRequests: byType("script").length,
          imageRequests: byType("img").length,
          resourceTransferKiB: transferred(resources),
          scriptTransferKiB: transferred(byType("script")),
          imageTransferKiB: transferred(byType("img")),
          viewportWidth: window.innerWidth,
          documentWidth: document.documentElement.scrollWidth,
        };
      });
      assert(metrics.documentWidth <= metrics.viewportWidth + 1, route.path + " must not overflow the mobile viewport");
      assert(metrics.firstContentfulPaintMs !== null, route.path + " must render a paint entry");
      assert.equal(errors.length, 0, route.path + " must have no uncaught browser exceptions: " + errors.join("; "));
      records.push({ ...route, status: "passed", metrics });
    } catch (error) {
      failures.push(route.label + ": " + String(error));
      records.push({ ...route, status: "failed", error: String(error), errors });
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}
const result = {
  kind: isLocal ? "synthetic-dev-preview-observation" : "synthetic-public-production-observation",
  checkedAt: new Date().toISOString(),
  target: base,
  disclaimer: isLocal
    ? "Local unthrottled Chrome preview. Not production Lighthouse, PageSpeed Insights, CrUX or real-user INP."
    : "Unthrottled Chrome on a public website from GitHub Actions. This is not a mobile-network Lighthouse score, CrUX field data, or real-user INP.",
  records,
  failures,
};
await writeFile(outDir + "/mobile-performance.json", JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
