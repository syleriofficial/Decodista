import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const target = process.env.DECODISTA_LIVE_URL || "https://decodista.com/latest";
const outDir = "artifacts/live-nav";
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const reports = [];
const errors = [];

async function inspect(label, viewport, javaScriptEnabled) {
  const context = await browser.newContext({
    viewport,
    javaScriptEnabled,
    reducedMotion: "reduce",
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const browserErrors = [];
  const failedAssets = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text().slice(0, 500));
  });
  page.on("requestfailed", (request) => {
    if (request.url().includes("/_next/")) failedAssets.push({
      url: request.url(),
      failure: request.failure()?.errorText ?? "unknown",
    });
  });

  try {
    const response = await page.goto(target, { waitUntil: "domcontentloaded", timeout: 45000 });
    if (!response || response.status() >= 400) {
      throw new Error("Live navigation HTTP status: " + (response?.status() ?? "no response"));
    }
    if (viewport.width <= 1000) {
      await page.locator(".mobile-menu-button").click();
    }
    await page.locator(".more-menu > summary").click();
    if (javaScriptEnabled) await page.waitForTimeout(2000);

    const state = await page.evaluate(() => {
      const panel = document.querySelector(".more-panel");
      const sections = Array.from(panel?.querySelectorAll(":scope > section") ?? []);
      return {
        count: sections.length,
        sections: sections.map((section) => ({
          heading: section.querySelector("h2")?.textContent?.trim() ?? "",
          display: getComputedStyle(section).display,
          visibility: getComputedStyle(section).visibility,
          bounds: (() => {
            const b = section.getBoundingClientRect();
            return { x: b.x, y: b.y, width: b.width, height: b.height };
          })(),
        })),
        followVisible: (() => {
          const el = document.querySelector("#more-follow-title");
          if (!el) return false;
          const s = getComputedStyle(el);
          const b = el.getBoundingClientRect();
          return s.display !== "none" && s.visibility !== "hidden" && b.width > 0 && b.height > 0;
        })(),
        weeklyLink: Boolean(panel?.querySelector('a[href="/weekly"]')),
        rssLink: Boolean(panel?.querySelector('a[href="/rss.xml"]')),
        htmlWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      };
    });
    await page.screenshot({ path: outDir + "/" + label + ".png", fullPage: false });
    const record = {
      label,
      url: response.url(),
      status: response.status(),
      cacheHeaders: {
        cacheControl: response.headers()["cache-control"] ?? null,
        cfCacheStatus: response.headers()["cf-cache-status"] ?? null,
        age: response.headers()["age"] ?? null,
      },
      state,
      browserErrors,
      failedAssets,
    };
    reports.push(record);
    if (state.count !== 3 || !state.followVisible || !state.weeklyLink || !state.rssLink) {
      errors.push(label + ": Follow DECODISTA is not visibly present (" + state.count + " sections)");
    }
    if (state.htmlWidth > state.viewportWidth + 1) {
      errors.push(label + ": horizontal overflow");
    }
  } catch (error) {
    errors.push(label + ": " + String(error));
    reports.push({ label, failure: String(error), browserErrors, failedAssets });
  } finally {
    await context.close();
  }
}

try {
  await inspect("desktop-ssr", { width: 1440, height: 900 }, false);
  await inspect("desktop-hydrated", { width: 1440, height: 900 }, true);
  await inspect("mobile-ssr", { width: 390, height: 780 }, false);
  await inspect("mobile-hydrated", { width: 390, height: 780 }, true);
} finally {
  await browser.close();
}

await writeFile(outDir + "/report.json", JSON.stringify({ target, reports, errors }, null, 2));
console.log(JSON.stringify({ target, reports, errors }, null, 2));
if (errors.length) process.exitCode = 1;
