import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

// Browser checks against local preview: no production writes.
const base = (process.env.HOMEPAGE_PREVIEW_URL ?? "http://localhost:5173").replace(/\/$/, "");
const outputDir = "artifacts/ai-tools-qa";
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const checks = [];
try {
  for (const view of [
    { label: "desktop", width: 1440, height: 900 },
    { label: "mobile", width: 390, height: 844 },
    { label: "compact", width: 320, height: 720 },
  ]) {
    const page = await browser.newPage({ viewport: { width: view.width, height: view.height } });
    try {
      const response = await page.goto(base + "/ai-tools", { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(response?.status(), 200, "Directory should load");
      await page.locator("#ai-tool-query").waitFor();
      await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => undefined);

      const navLabels = (await page.locator(".primary-nav .nav-scroll > a").allTextContents()).map((label) => label.trim());
      assert.deepEqual(navLabels, ["Tech News", "AI", "AI Tools", "Reviews", "How-To", "Science"]);

      const cards = page.locator(".ai-tools-card");
      assert.equal(await cards.count(), 12, "All starting tool profiles must render");
      assert.equal(await page.locator(".ai-tools-hero h1").count(), 1);
      await page.screenshot({ path: `${outputDir}/${view.label}-directory.png`, fullPage: true });

      // Search, category filters and reset behavior depend on hydration.
      await page.locator("#ai-tool-query").fill("voiceovers");
      await page.getByRole("status").first().count(); // status can also be the empty-state region
      assert.equal(await cards.count(), 1, "Voiceover search should return ElevenLabs");
      assert.equal((await cards.locator("h3").first().innerText()).trim(), "ElevenLabs");
      await page.getByRole("button", { name: "Clear tool search" }).click();
      await page.getByRole("button", { name: "Coding", exact: true }).click();
      assert.equal(await cards.count(), 2, "Coding category must show two tools");
      await page.getByRole("button", { name: "Clear filters" }).click();
      assert.equal(await cards.count(), 12, "Clearing filters must restore all entries");

      const chatgpt = cards.filter({ has: page.locator("h3", { hasText: "ChatGPT" }) });
      const claude = cards.filter({ has: page.locator("h3", { hasText: "Claude" }) });
      await chatgpt.getByRole("button", { name: "Compare" }).click();
      await claude.getByRole("button", { name: "Compare" }).click();
      const comparisonLink = page.getByRole("link", { name: /Compare selected tools/ });
      assert((await comparisonLink.getAttribute("href"))?.includes("first=chatgpt&second=claude"));
      await comparisonLink.click();
      await page.locator(".ai-tools-compare-table").waitFor();
      assert.equal(await page.locator(".ai-tools-compare-table thead th").count(), 3);
      assert((await page.locator(".ai-tools-compare-table").innerText()).includes("ChatGPT"));
      assert((await page.locator(".ai-tools-compare-table").innerText()).includes("Claude"));
      assert.equal(await page.getByText("invented rating", { exact: false }).count(), 0);

      await page.locator("#compare-first").selectOption("perplexity");
      await page.locator("#compare-second").selectOption("notebooklm");
      await page.getByRole("button", { name: "Compare", exact: true }).click();
      await page.locator(".ai-tools-compare-table").waitFor();
      assert((await page.locator(".ai-tools-compare-table").innerText()).includes("Perplexity"));
      assert((await page.locator(".ai-tools-compare-table").innerText()).includes("NotebookLM"));

      const dimensions = await page.evaluate(() => ({
        body: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth,
      }));
      assert(dimensions.body <= dimensions.viewport + 1,
        `Comparison must not cause page overflow at ${view.width}px: ${JSON.stringify(dimensions)}`);
      await page.screenshot({ path: `${outputDir}/${view.label}-comparison.png`, fullPage: true });
      
      // Profile discovery is fully browsable and remains descriptive / noindex.
      const profileResponse = await page.goto(base + "/ai-tools/chatgpt", { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(profileResponse?.status(), 200, "A real profile should load");
      await page.locator(".ai-tools-profile-title h1").waitFor();
      assert.equal((await page.locator(".ai-tools-profile-title h1").innerText()).trim(), "ChatGPT");
      assert.equal(await page.locator(".ai-tools-profile-related-card li").count(), 2,
        "ChatGPT should link to two same-category profiles");
      assert.equal(await page.locator('a[href="/ai-tools/claude"]').count(), 1,
        "Profile should link to Claude as a same-category alternative");
      assert.equal(await page.locator('a[href="/ai-tools/gemini"]').count(), 1,
        "Profile should link to Gemini as a same-category alternative");
      assert.equal(await page.locator(".ai-tools-profile-actions a").count(), 2,
        "Profile should provide official-site and comparison actions");

      const profileDimensions = await page.evaluate(() => ({
        body: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth,
      }));
      assert(profileDimensions.body <= profileDimensions.viewport + 1,
        `Profile must not overflow at ${view.width}px: ${JSON.stringify(profileDimensions)}`);
      await page.screenshot({ path: `${outputDir}/${view.label}-profile.png`, fullPage: true });

      const singleCategoryResponse = await page.goto(base + "/ai-tools/runway", { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(singleCategoryResponse?.status(), 200, "Runway profile should load");
      assert.equal(await page.locator(".ai-tools-profile-related-card li").count(), 0,
        "Single-entry video category must not fabricate alternatives");
      assert((await page.locator(".ai-tools-profile-related-card").innerText()).includes("no other video"));

      if (view.label === "desktop") {
        const missing = await page.request.get(base + "/ai-tools/not-an-actual-listed-tool");
        assert.equal(missing.status(), 404, "Unknown tool profiles must return 404");
      }
      // Source-linked pricing: no made-up regional totals or unverified rankings.
      const pricingResponse = await page.goto(base + "/ai-tools/pricing", { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(pricingResponse?.status(), 200, "Pricing overview must render");
      await page.locator(".ai-tools-price-card").first().waitFor();
      assert.equal(await page.locator(".ai-tools-price-card").count(), 4, "Exactly four sourced pricing records");
      assert.equal(await page.locator(".ai-tools-price-card a[target=\"_blank\"]").count(), 4, "Each priced tool needs an official source");
      assert((await page.locator(".ai-tools-feature-meta").innerText()).includes("21 November 2026"), "Display source check date");
      assert((await page.locator(".ai-tools-verified-amount").innerText()).includes("US$20"), "Claude monthly USD figure is labeled");
      await page.screenshot({ path: `${outputDir}/${view.label}-pricing.png`, fullPage: true });

      // Shareable alternatives queries are bounded by the curated directory.
      const alternativesResponse = await page.goto(base + "/ai-tools/alternatives?tool=claude", { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(alternativesResponse?.status(), 200, "Alternatives overview must render");
      assert.equal(await page.locator(".ai-tools-alternatives-context h2").innerText(), "Claude");
      assert.equal(await page.locator(".ai-tools-alternative-card").count(), 2, "Claude should show two same-category listings");
      assert((await page.locator('.ai-tools-alternative-actions a[href*="first=claude&second=chatgpt"]').count()) === 1,
        "Alternative comparisons must use shareable valid tool IDs");
      await page.screenshot({ path: `${outputDir}/${view.label}-alternatives.png`, fullPage: true });

      const runwayAlternatives = await page.goto(base + "/ai-tools/alternatives?tool=runway", { waitUntil: "domcontentloaded", timeout: 45000 });
      assert.equal(runwayAlternatives?.status(), 200, "One-listing categories must work");
      assert.equal(await page.locator(".ai-tools-alternative-card").count(), 0, "No invented video alternatives");
      assert.equal(await page.locator(".ai-tools-alternatives-empty").count(), 1, "Show honest zero-result state");
      
      const altDimensions = await page.evaluate(() => ({
        body: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth,
      }));
      assert(altDimensions.body <= altDimensions.viewport + 1,
        `Alternatives must not overflow at ${view.width}px: ${JSON.stringify(altDimensions)}`);
      if (view.label === "desktop") {
        const invalidTool = await page.goto(base + "/ai-tools/alternatives?tool=not-in-our-directory", { waitUntil: "domcontentloaded", timeout: 45000 });
        assert.equal(invalidTool?.status(), 200, "Unknown query must safely fall back to default");
        assert.equal((await page.locator(".ai-tools-alternatives-context h2").innerText()).trim(), "ChatGPT");
      }

      checks.push({ view: view.label, result: "passed" });
    } finally {
      await page.close();
    }
  }
} catch (error) {
  checks.push({ result: "failed", message: String(error) });
  throw error;
} finally {
  await writeFile(`${outputDir}/results.json`, JSON.stringify(checks, null, 2));
  await browser.close();
}

console.log("AI Tools browser QA passed:", checks.map((item) => item.view).join(", "));
