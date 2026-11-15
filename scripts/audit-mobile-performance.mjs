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
  { path: "/", label: "mobile-homepage", width: 390, theme: "light" },
  { path: "/latest", label: "mobile-latest", width: 390, theme: "light" },
  { path: "/how-to", label: "mobile-how-to", width: 390, theme: "light" },
  { path: "/articles/gmail-not-receiving-emails-google-storage-full", label: "mobile-article", width: 390, theme: "light" },
  { path: "/", label: "small-mobile-homepage", width: 320, theme: "dark" },
  { path: "/search", label: "small-mobile-search", width: 320, theme: "dark" },
  { path: "/articles/gmail-not-receiving-emails-google-storage-full", label: "small-mobile-article", width: 320, theme: "dark" },
];
const records = [];
const failures = [];

try {
  for (const route of routes) {
    const context = await browser.newContext({
      viewport: { width: route.width, height: route.width === 320 ? 720 : 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      colorScheme: route.theme,
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
      assert.equal(errors.length, 0, route.label + " must have no uncaught browser exceptions: " + errors.join("; "));

      // Capture real production HTML in touch-enabled Chrome, not a purely
      // CSS-sized desktop browser. These remain synthetic emulations, not
      // screenshots of a physical phone or CrUX field measurements.
      if (route.path === "/" || route.width === 320) {
        await page.screenshot({ path: outDir + "/" + route.label + "-before-consent.png" });
      }

      const privacy = page.getByRole("button", { name: "Decline analytics" });
      if (await privacy.count()) {
        const banner = page.locator(".consent-banner");
        const bounds = await banner.boundingBox();
        assert(bounds && bounds.height <= (route.width === 320 ? 720 : 844) * .45 + 2,
          route.label + " privacy choice should not dominate the mobile viewport");
        await privacy.click();
        assert.equal(await banner.count(), 0, route.label + " opting out should close the notice");
      }

      if (route.path === "/") {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: outDir + "/" + route.label + "-after-consent.png" });
        const menu = page.locator(".mobile-menu-button");
        assert(await menu.isVisible(), route.label + " needs an accessible mobile menu");
        await menu.click();
        assert(await page.locator("#site-navigation").isVisible(), route.label + " menu must open after tap");
        const links = await page.locator("#site-navigation .nav-scroll > a").allTextContents();
        assert.deepEqual(links, ["Tech News", "AI", "Reviews", "How-To", "Security", "Science"],
          "Mobile menu must preserve all six editorial destinations");
        await page.keyboard.press("Escape");
        assert(!(await page.locator("#site-navigation").isVisible()), route.label + " Escape should close mobile menu");
      }

      records.push({ ...route, status: "passed", metrics,
        caution: metrics.longTaskTotalMs > 500
          ? "Unthrottled long tasks exceed 500 ms; investigate rather than interpreting one run as a real-user INP measurement"
          : null });
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
    : "Touch-enabled, device-sized Chrome on public production from GitHub Actions. Screenshots are browser emulations, not physical-phone captures. Measurements are unthrottled lab data, not Lighthouse, CrUX field data or real-user INP.",
  records,
  failures,
};
await writeFile(outDir + "/mobile-performance.json", JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
