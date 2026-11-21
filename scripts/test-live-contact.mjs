import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

// Read-only check against the real public site. Never submit the contact form.
const base = new URL(process.env.DECODISTA_PRODUCTION_URL ?? "https://decodista.com").origin;
const output = "artifacts/live-contact-qa";
const expectedMenu = ["Tech News", "Reviews", "Science"];
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];

for (const view of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
  { name: "small-mobile", width: 320, height: 720 },
]) {
  const context = await browser.newContext({
    viewport: { width: view.width, height: view.height },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  const firstPartyFailures = [];
  const turnstileResources = [];
  page.on("requestfailed", (request) => {
    if (request.url().includes("challenges.cloudflare.com/turnstile/")) {
      turnstileResources.push({ kind: "failed-request", urlPath: new URL(request.url()).pathname, reason: request.failure()?.errorText });
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push("console: " + message.text());
  });
  page.on("response", (response) => {
    const url = new URL(response.url());
    if (url.origin === base && response.status() >= 400) {
      firstPartyFailures.push({ path: url.pathname + url.search, status: response.status() });
    }
    if (url.hostname === "challenges.cloudflare.com" && url.pathname.includes("/turnstile/")) {
      turnstileResources.push({ kind: "response", urlPath: url.pathname, status: response.status() });
    }
  });
  const report = { ...view, url: base + "/contact" };

  try {
    const response = await page.goto(report.url, { waitUntil: "domcontentloaded", timeout: 45000 });
    assert.equal(response?.status(), 200, "Live Contact page must return HTTP 200");
    report.cfCacheStatus = response.headers()["cf-cache-status"] ?? null;
    report.cfRay = response.headers()["cf-ray"] ?? null;

    await page.locator("form.contact-form").waitFor({ state: "visible", timeout: 20000 });
    await page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(650); // Allow client hydration after page readiness.

    assert.equal(await page.locator("main h1").innerText(), "Contact");
    assert.deepEqual(
      (await page.locator("#site-navigation .nav-scroll > a").allTextContents()).map((item) => item.trim()),
      expectedMenu, "Live Contact header must show the approved three primary sections",
    );
    const footerHrefs = await page.locator("footer a[href]").evaluateAll(
      (elements) => elements.map((element) => element.getAttribute("href")),
    );
    for (const href of ["/ai", "/how-to", "/security", "/digital-life", "/latest"]) {
      assert(footerHrefs.includes(href), "Live footer should link to " + href);
    }
    // Live checks can run before or after the Weekly Brief footer rollout.
    // Report its visibility without failing a pre-deployment production check.
    report.weeklyBriefFooterVisible = footerHrefs.includes("/weekly");
    assert(!footerHrefs.includes("/entertainment"),
      "Paused Entertainment must stay out of the live footer");

    for (const field of ["#contact-name", "#contact-email", "#contact-type", "#contact-subject", "#contact-message"]) {
      assert.equal(await page.locator(field).count(), 1, "Missing Contact field " + field);
    }
    const turnstile = page.locator(".cf-turnstile[data-sitekey][data-action='contact']");
    assert.equal(await turnstile.count(), 1, "Contact must render a Turnstile placeholder with a public site key");
    await page.locator('script[src*="challenges.cloudflare.com/turnstile/v0/api.js"]')
      .waitFor({ state: "attached", timeout: 18000 });
    report.turnstileScriptIncluded = true;
    // Headless browser challenges may use frames outside of the widget; inspect
    // both DOM mounting and JS API readiness before drawing any conclusion.
    await page.waitForTimeout(1200);
    report.turnstileState = await page.evaluate(() => ({
      apiReady: typeof window.turnstile?.render === "function",
      widgetIframePresent: !!document.querySelector(".turnstile-wrap iframe"),
      anyChallengeIframePresent: !!document.querySelector('iframe[src*="challenges.cloudflare.com"]'),
      responseInputPresent: !!document.querySelector('input[name="cf-turnstile-response"]'),
      widgetHasChildren: (document.querySelector(".cf-turnstile")?.children.length ?? 0) > 0,
    }));

    const enquirySelect = page.locator("#contact-type");
    await enquirySelect.selectOption("Correction");
    await page.locator("#contact-article-url").waitFor({ state: "visible", timeout: 15000 });
    await enquirySelect.selectOption("General enquiry");
    await page.locator("#contact-article-url").waitFor({ state: "detached", timeout: 15000 });

    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    assert(documentWidth <= view.width + 1,
      "Live Contact has horizontal overflow at " + view.width + "px: " + documentWidth);
    const hydrationErrors = errors.filter((error) =>
      /Hydration failed|hydrated but some attributes|server rendered HTML didn't match|hydration mismatch/i.test(error),
    );
    assert.equal(hydrationErrors.length, 0, "React hydration error on live Contact page");

    if (view.name === "desktop") {
      // The Corrections policy deep link must preselect the correct enquiry type.
      const correction = await page.goto(base + "/contact?type=correction", {
        waitUntil: "domcontentloaded", timeout: 45000,
      });
      assert.equal(correction?.status(), 200, "Correction deep-link must work");
      await page.locator("#contact-article-url").waitFor({ state: "visible", timeout: 15000 });
      assert.equal(await page.locator("#contact-type").inputValue(), "Correction");
    }

    report.status = "passed";
  } catch (error) {
    report.status = "failed";
    report.reason = String(error);
    await page.screenshot({ path: output + "/" + view.name + "-failure.png" }).catch(() => {});
  } finally {
    report.firstPartyFailures = firstPartyFailures;
    report.turnstileResources = turnstileResources;
    report.browserErrors = errors.slice(0, 12);
    if (view.name === "desktop" && report.status === "passed") {
      await page.screenshot({ path: output + "/desktop-contact.png" }).catch(() => {});
    }
    results.push(report);
    await context.close();
  }
}

await browser.close();
const failed = results.filter((item) => item.status !== "passed");
await writeFile(output + "/results.json", JSON.stringify({ base, results, failed }, null, 2));
console.log(JSON.stringify({ base, results, failed }, null, 2));
if (failed.length) process.exitCode = 1;
