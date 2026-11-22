import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

// Product-only browser audit against local preview. No production writes.
const base = (process.env.HOMEPAGE_PREVIEW_URL ?? "http://localhost:5173").replace(/\/$/, "");
const outputDir = "artifacts/ai-tools-qa";
await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];

async function navigate(page, path) {
  const response = await page.goto(base + path, { waitUntil: "domcontentloaded", timeout: 45000 });
  assert.equal(response?.status(), 200, path + " should load");
  await page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => undefined);
  return response;
}

async function noOverflow(page, label, width) {
  const dimensions = await page.evaluate(() => ({
    body: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  assert(dimensions.body <= dimensions.viewport + 1,
    label + " must not overflow at " + width + "px: " + JSON.stringify(dimensions));
}

try {
  for (const view of [
    { label: "desktop", width: 1440, height: 900 },
    { label: "mobile", width: 390, height: 844 },
    { label: "compact", width: 320, height: 720 },
  ]) {
    const page = await browser.newPage({ viewport: { width: view.width, height: view.height } });
    try {
      await navigate(page, "/ai-tools");
      await page.locator("#ai-tool-query").waitFor();
      assert.equal(await page.locator(".ai-tools-card").count(), 12,
        "Starter directory should retain twelve real product listings");
      assert.equal(await page.locator(".ai-task-finder").count(), 1,
        "Task-first AI Tools discovery must remain functional");
      assert.equal(await page.locator(".ai-task-option").count(), 7,
        "Task Finder should preserve seven curated tasks");
      assert.deepEqual(
        (await page.locator(".primary-nav .nav-scroll > a").allTextContents()).map(x => x.trim()),
        ["Tech News", "AI", "AI Tools", "Reviews", "How-To", "Security", "Science", "Latest"]);
      assert.equal(await page.locator("a[href^='/ai-tools/guides']").count(), 0,
        "No links to removed AI Tools articles from directory");
      assert.equal(await page.locator("a[href^='/ai-tools/workflows']").count(), 0,
        "No PDF walkthrough links from directory");
      assert.equal(await page.locator(".ai-pdf-home-feature").count(), 0,
        "PDF editorial promotion must be removed");
      assert.equal(await page.locator(".ai-tools-decision-link").count(), 2,
        "Keep only Pricing and Alternatives product navigation cards");

      const tasks = page.locator(".ai-task-finder");
      await tasks.getByRole("button", { name: "Build software" }).click();
      assert.deepEqual(
        (await tasks.locator(".ai-task-match h4").allInnerTexts()).map(x => x.trim()).sort(),
        ["Cursor", "GitHub Copilot"]);
      assert((await tasks.getByRole("link", { name: "Compare two starting points" }).getAttribute("href"))?.includes("first=cursor&second=github-copilot"));
      await tasks.getByRole("button", { name: "Research a topic" }).click();
      assert.equal(await tasks.locator('a[href^="/ai-tools/guides"]').count(), 0,
        "Task finder must not offer editorial guide links");

      // Product utility: bookmarks are local-only, persistent and filterable.
      await page.getByRole("button", { name: "Save ChatGPT to this browser" }).click();
      await page.getByRole("button", { name: "Remove ChatGPT from saved tools" }).waitFor();
      assert.equal(await page.getByRole("button", { name: "Saved tools (1)" }).count(), 1,
        "Saving a tool updates the directory count");
      await page.getByRole("button", { name: "Saved tools (1)" }).click();
      assert.equal(await page.locator(".ai-tools-card").count(), 1,
        "Saved-only filter keeps only the bookmarked tool");
      assert((await page.locator(".ai-tools-card h3").innerText()).includes("ChatGPT"));
      await noOverflow(page, "saved filter", view.width);
      await page.screenshot({ path: outputDir + "/" + view.label + "-saved.png", fullPage: true });

      await page.reload({ waitUntil: "domcontentloaded", timeout: 45000 });
      await page.locator("#ai-tool-query").waitFor();
      await page.getByRole("button", { name: "Saved tools (1)" }).waitFor();
      await page.getByRole("button", { name: "Saved tools (1)" }).click();
      assert.equal(await page.locator(".ai-tools-card").count(), 1,
        "Bookmarks persist across a reload in the same browser");
      await page.getByRole("button", { name: "Remove ChatGPT from saved tools" }).click();
      assert.equal(await page.locator(".ai-tools-card").count(), 0,
        "Removing the last saved tool clears saved-only results");
      assert((await page.locator(".ai-tools-empty h3").innerText()).includes("No saved tools yet"),
        "Empty saved state explains bookmarks");
      await page.getByRole("button", { name: "Show all tools" }).click();
      assert.equal(await page.locator(".ai-tools-card").count(), 12);
      assert.equal(await page.getByRole("button", { name: "Saved tools (0)" }).count(), 1);

      await page.locator("#ai-tools-sort").selectOption("category");
      assert.equal(await page.locator(".ai-tools-card").count(), 12);
      assert.equal((await page.locator(".ai-tools-card h3").first().innerText()).trim(), "ChatGPT",
        "Category sorting groups assistants before other categories");
      await noOverflow(page, "sorted directory", view.width);
      await page.getByRole("button", { name: "Clear filters" }).click();
      assert.equal((await page.locator(".ai-tools-card h3").first().innerText()).trim(), "Adobe Firefly",
        "Reset restores alphabetical name sorting");

      await page.locator("#ai-tool-query").fill("voiceovers");
      assert.equal(await page.locator(".ai-tools-card").count(), 1,
        "Search should find ElevenLabs for voiceovers");
      assert((await page.locator(".ai-tools-card h3").first().innerText()).includes("ElevenLabs"));
      await page.getByRole("button", { name: "Clear tool search" }).click();
      await page.getByRole("button", { name: "Coding", exact: true }).click();
      assert.equal(await page.locator(".ai-tools-card").count(), 2);
      await page.getByRole("button", { name: "Clear filters" }).click();
      assert.equal(await page.locator(".ai-tools-card").count(), 12);

      await page.locator(".ai-tools-card").filter({ has: page.locator("h3", { hasText: "ChatGPT" }) })
        .getByRole("button", { name: "Compare" }).click();
      await page.locator(".ai-tools-card").filter({ has: page.locator("h3", { hasText: "Claude" }) })
        .getByRole("button", { name: "Compare" }).click();
      const compareLink = page.getByRole("link", { name: "Compare selected tools" });
      assert((await compareLink.getAttribute("href"))?.includes("first=chatgpt&second=claude"));
      await compareLink.click();
      await page.locator(".ai-tools-compare-table").waitFor();
      assert.equal(await page.locator(".ai-tools-compare-table thead th").count(), 3);
      assert.equal(await page.locator(".ai-guide-context-banner").count(), 0,
        "Comparison must focus on structured product data, not removed guides");
      await noOverflow(page, "comparison", view.width);
      await page.screenshot({ path: outputDir + "/" + view.label + "-comparison.png", fullPage: true });

      await navigate(page, "/ai-tools/chatgpt");
      assert((await page.locator("main h1").innerText()).includes("ChatGPT"));
      assert.equal(await page.locator(".ai-tools-profile-evidence-panel").count(), 1);
      assert.equal(await page.locator(".ai-tools-profile-guide-links").count(), 0,
        "Product profiles must not link to editorial comparison guides");
      assert.equal(await page.locator(".ai-tools-profile-related-card li").count(), 2);
      await noOverflow(page, "profile", view.width);
      await page.screenshot({ path: outputDir + "/" + view.label + "-profile.png", fullPage: true });

      await navigate(page, "/ai-tools/pricing");
      assert.equal(await page.locator(".ai-tools-price-card").count(), 4,
        "Retain four official-source pricing snapshots");
      assert.equal(await page.locator('.ai-tools-price-card a[target="_blank"]').count(), 4);
      await noOverflow(page, "pricing", view.width);
      await page.screenshot({ path: outputDir + "/" + view.label + "-pricing.png", fullPage: true });

      await navigate(page, "/ai-tools/alternatives?tool=claude");
      assert.equal((await page.locator(".ai-tools-alternatives-context h2").innerText()).trim(), "Claude");
      assert.equal(await page.locator(".ai-tools-alternative-card").count(), 2,
        "Claude should keep two broad category alternatives");
      await noOverflow(page, "alternatives", view.width);
      await page.screenshot({ path: outputDir + "/" + view.label + "-alternatives.png", fullPage: true });

      if (view.label === "desktop") {
        const oldRoutes = [
          "/ai-tools/guides",
          "/ai-tools/guides/chatgpt-vs-claude",
          "/ai-tools/guides/cursor-vs-github-copilot",
          "/ai-tools/guides/perplexity-vs-gemini-notebook",
          "/ai-tools/guides/chatgpt-vs-gemini-for-research",
          "/ai-tools/workflows/compare-two-pdfs-with-ai",
          "/ai-tools/samples/library-hours-notice-v1.txt",
          "/ai-tools/samples/library-hours-notice-v2.txt",
        ];
        for (const old of oldRoutes) {
          const response = await page.request.get(base + old);
          assert([404, 410].includes(response.status()),
            "Removed editorial page or sample should be gone: " + old + " HTTP " + response.status());
        }
        const unknown = await page.request.get(base + "/ai-tools/not-a-real-tool");
        assert.equal(unknown.status(), 404, "Unknown product must 404");
        const sitemap = await page.request.get(base + "/sitemap.xml");
        assert.equal(sitemap.status(), 200);
        const xml = await sitemap.text();
        assert(!xml.includes("/ai-tools/guides/") && !xml.includes("/ai-tools/workflows/"),
          "Sitemap must not advertise deleted editorial URLs");
        for (const route of ["/", "/ai"]) {
          const result = await page.request.get(base + route);
          assert.equal(result.status(), 200);
          assert(!(await result.text()).includes('href="/ai-tools/guides/'),
            "Global editorial pages must not promote removed AI Tools guides: " + route);
        }
      }
      results.push({ viewport: view.label, width: view.width, result: "passed" });
    } finally {
      await page.close();
    }
  }
  console.log("AI Tools product-only browser QA passed: desktop, mobile, compact");
  await writeFile(outputDir + "/report.json", JSON.stringify({ results, status: "passed" }, null, 2));
} finally {
  await browser.close();
}
