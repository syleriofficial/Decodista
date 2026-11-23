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
      assert.equal(await page.locator(".ai-tools-card").count(), 16,
        "Expanded directory should retain sixteen fully sourced product listings");
      assert.equal(await page.locator(".ai-tools-card-plans a").count(), 16,
        "Every directory listing must link to its official-source plan record");
      assert.equal(await page.locator(".ai-task-finder").count(), 1,
        "Task-first AI Tools discovery must remain functional");
      assert.equal(await page.locator(".ai-task-option").count(), 8,
        "Task Finder should preserve eight curated tasks");
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

      // Finder 2.4 must interpret intent locally without rankings, API calls or raw URL parameters.
      const smartFinder = page.locator(".ai-task-finder");
      const smartInput = smartFinder.locator("#ai-smart-finder-input");
      assert.equal(await smartInput.getAttribute("maxLength"), "220");
      assert.equal(await smartFinder.locator(".ai-task-smart-examples button").count(), 4);
      await smartInput.fill("Build a website without coding");
      await smartFinder.getByRole("button", { name: "Find tools" }).click();
      assert((await smartFinder.locator(".ai-task-smart-result").innerText()).includes("Possible task: Build an app"));
      assert.deepEqual((await smartFinder.locator(".ai-task-match h4").allInnerTexts()).sort(),
        ["Bolt", "Lovable", "Replit"], "A no-code website request needs source-linked app builders");
      assert(!page.url().includes("Build") && !page.url().includes("coding"),
        "Private free-text requests must not be written into URL parameters");
      await noOverflow(page, "smart website intent", view.width);

      for (const [request, expectedTask, expectedNames] of [
        ["Create an app logo", "Create visuals", ["Adobe Firefly", "Canva", "Midjourney"]],
        ["Generate an app icon", "Create visuals", ["Adobe Firefly", "Canva", "Midjourney"]],
        ["Make a photo without coding", "Create visuals", ["Adobe Firefly", "Canva", "Midjourney"]],
        ["Create a website without coding", "Build an app", ["Bolt", "Lovable", "Replit"]],
      ]) {
        await smartInput.fill(request);
        await smartFinder.getByRole("button", { name: "Find tools" }).click();
        assert((await smartFinder.locator(".ai-task-smart-result").innerText()).includes("Possible task: " + expectedTask),
          "Task matcher must distinguish app assets, no-code design and app creation: " + request);
        assert.deepEqual((await smartFinder.locator(".ai-task-match h4").allInnerTexts()).sort(), expectedNames);
        assert(!page.url().includes(encodeURIComponent(request)), "Finder request text must stay off URL");
      }
      await smartInput.fill("Summarize research PDFs");
      await smartInput.press("Enter");
      assert((await smartFinder.locator(".ai-task-smart-result").innerText()).includes("Possible task: Research a topic"));
      assert.deepEqual((await smartFinder.locator(".ai-task-match h4").allInnerTexts()).sort(),
        ["Gemini Notebook", "Perplexity"], "Document research must remain a disclosed research shortlist");

      await smartFinder.getByRole("button", { name: "Make presentation slides" }).click();
      assert((await smartFinder.locator(".ai-task-smart-result").innerText()).includes("Possible task: Make presentations"));
      assert.deepEqual((await smartFinder.locator(".ai-task-match h4").allInnerTexts()).sort(), ["Canva", "Gamma"]);

      await smartFinder.getByRole("button", { name: "Generate a voiceover" }).click();
      assert.deepEqual((await smartFinder.locator(".ai-task-match h4").allInnerTexts()), ["ElevenLabs"]);

      await smartInput.fill("Make a video with a voiceover");
      await smartFinder.getByRole("button", { name: "Find tools" }).click();
      assert((await smartFinder.locator(".ai-task-smart-result").innerText()).includes("More than one type of work could fit"));
      assert.equal(await smartFinder.locator(".ai-task-smart-choices button").count(), 2,
        "Ambiguous voice and video intent must prompt a choice, not invent a winning tool");
      assert.equal(await smartFinder.locator(".ai-task-panel").count(), 0,
        "Ambiguous requests must hide the previous result until a task is chosen");
      assert.equal(await smartFinder.locator(".ai-task-option[aria-pressed=true]").count(), 0,
        "No unrelated task should look selected while intent is ambiguous");
      await smartFinder.locator(".ai-task-smart-choices").getByRole("button", { name: "Generate video" }).click();
      assert.deepEqual((await smartFinder.locator(".ai-task-match h4").allInnerTexts()).sort(), ["Adobe Firefly", "Runway"]);

      // 2.3: multi-output intent must request a choice; focused utility must not drift.
      for (const [query, first, second] of [
        ["Research and write a report", "Research a topic", "Write and edit"],
        ["Generate images and videos", "Create visuals", "Generate video"],
        ["Create a website logo and a website", "Create visuals", "Build an app"],
        ["Build an app and write code", "Build an app", "Build software"],
      ]) {
        await smartInput.fill(query);
        await smartFinder.getByRole("button", { name: "Find tools" }).click();
        assert((await smartFinder.locator(".ai-task-smart-result").innerText()).includes("More than one type of work could fit"),
          "Mixed workflow must prompt for an explicit task: " + query);
        const labels = (await smartFinder.locator(".ai-task-smart-choices button").allInnerTexts()).sort();
        assert.deepEqual(labels, [first, second].sort());
        assert.equal(await smartFinder.locator(".ai-task-panel").count(), 0);
      }
      for (const [query, taskName] of [
        ["Review source code", "Build software"],
        ["Dub a video in Spanish", "Narration and dubbing"],
        ["Turn images into video", "Generate video"],
      ]) {
        await smartInput.fill(query);
        await smartFinder.getByRole("button", { name: "Find tools" }).click();
        assert((await smartFinder.locator(".ai-task-smart-result").innerText()).includes("Possible task: " + taskName),
          "Single-output workflow must avoid irrelevant second category: " + query);
        assert.equal(await smartFinder.locator(".ai-task-panel").count(), 1);
      }

      // Smart Finder 2.5: natural phrasings, multi-output requests and safe refusals.
      for (const [query, expectedTask] of [
        ["Polish my cover letter", "Write and edit"],
        ["Investigate the causes of this financial crisis", "Research a topic"],
        ["Pair program with me on a CLI app", "Build software"],
        ["Turn a product photo into a promo clip", "Generate video"],
        ["Make a banner for a mobile app", "Create visuals"],
      ]) {
        await smartInput.fill(query);
        await smartFinder.getByRole("button", { name: "Find tools" }).click();
        assert((await smartFinder.locator(".ai-task-smart-result").innerText()).includes("Possible task: " + expectedTask),
          "Natural-language intent should not pick an unrelated category: " + query);
        assert.equal(await smartFinder.locator(".ai-task-panel").count(), 1);
      }
      for (const utility of ["Join two PDF files into one", "Remove a PDF password", "Convert a DOCX into PDF"]) {
        await smartInput.fill(utility);
        await smartFinder.getByRole("button", { name: "Find tools" }).click();
        assert((await smartFinder.locator(".ai-task-smart-result").innerText()).includes("No confident task match yet."),
          "PDF utility must not be invented as a research task: " + utility);
        assert.equal(await smartFinder.locator(".ai-task-panel").count(), 0);
      }

      // New 2.5 coverage: source-review paraphrases, creator work and unsupported PDF utilities.
      for (const [query, expectedTask] of [
        ["Check the references in my academic manuscript", "Research a topic"],
        ["Prepare an apology letter for a client", "Write and edit"],
        ["Write descriptions for my online shop", "Write and edit"],
        ["Help diagnose an HTTP 500 in my Node server", "Build software"],
        ["Design an infographic for a lesson", "Create visuals"],
        ["Edit a 30-second social clip", "Generate video"],
      ]) {
        await smartInput.fill(query);
        await smartFinder.getByRole("button", { name: "Find tools" }).click();
        assert((await smartFinder.locator(".ai-task-smart-result").innerText()).includes("Possible task: " + expectedTask),
          "Finder 2.5 should recognize a clear single task: " + query);
        assert.equal(await smartFinder.locator(".ai-task-panel").count(), 1);
      }
      for (const utility of [
        "Remove a signature from a document",
        "Extract images from a PDF",
        "Rotate a scanned document",
      ]) {
        await smartInput.fill(utility);
        await smartFinder.getByRole("button", { name: "Find tools" }).click();
        assert((await smartFinder.locator(".ai-task-smart-result").innerText()).includes("No confident task match yet."),
          "Finder 2.5 must not invent a tool for an unsupported utility: " + utility);
        assert.equal(await smartFinder.locator(".ai-task-panel").count(), 0);
      }
      await smartInput.fill("Write a blog post and narrate it");
      await smartFinder.getByRole("button", { name: "Find tools" }).click();
      assert((await smartFinder.locator(".ai-task-smart-result").innerText()).includes("More than one type of work could fit"),
        "Mixed writing and narration should ask the user to choose");

      await smartInput.fill("Draft a LinkedIn post");
      await smartFinder.getByRole("button", { name: "Find tools" }).click();
      assert((await smartFinder.locator(".ai-task-smart-result").innerText()).includes("Possible task: Write and edit"),
        "Social writing requests must match the documented writing shortlist");
      assert.deepEqual((await smartFinder.locator(".ai-task-match h4").allInnerTexts()).sort(),
        ["ChatGPT", "Claude", "Gemini"]);

      await smartInput.fill("Generate social media captions");
      await smartFinder.getByRole("button", { name: "Find tools" }).click();
      assert((await smartFinder.locator(".ai-task-smart-result").innerText()).includes("Possible task: Write and edit"));

      for (const unsupported of ["Convert PDF to Word", "Recover my email password"]) {
        await smartInput.fill(unsupported);
        await smartFinder.getByRole("button", { name: "Find tools" }).click();
        assert((await smartFinder.locator(".ai-task-smart-result").innerText()).includes("No confident task match yet."),
          "Unsupported request must not be turned into a speculative tool recommendation");
        assert.equal(await smartFinder.locator(".ai-task-panel").count(), 0,
          "An unsupported request must not show the earlier recommendation panel");
      }

      await smartInput.fill("I need a local restaurant for dinner");
      await smartFinder.getByRole("button", { name: "Find tools" }).click();
      assert((await smartFinder.locator(".ai-task-smart-result").innerText()).includes("No confident task match yet."),
        "Unsupported intent must fail transparently without fake AI recommendations");
      assert.equal(await smartFinder.locator(".ai-task-panel").count(), 0,
        "A no-match result must not show stale tool cards or comparisons");
      assert.equal(await smartFinder.locator(".ai-task-option[aria-pressed=true]").count(), 0,
        "A no-match result must not leave a selected task");
      await noOverflow(page, "smart no-match state", view.width);
      await page.screenshot({path: outputDir + "/" + view.label + "-smart-finder.png", fullPage: true});

      const tasks = page.locator(".ai-task-finder");
      await tasks.getByRole("button", { name: "Write and edit" }).click();
      assert.equal(await tasks.locator(".ai-task-panel").count(), 1,
        "Clicking the previously chosen task must also recover from no-match");
      await tasks.getByRole("button", { name: "Build software" }).click();
      assert.equal(await tasks.locator(".ai-task-panel").count(), 1,
        "An explicit task choice must restore its documented shortlist");
      assert.deepEqual(
        (await tasks.locator(".ai-task-match h4").allInnerTexts()).map(x => x.trim()).sort(),
        ["Cursor", "GitHub Copilot"]);
      assert((await tasks.getByRole("link", { name: "Compare two starting points" }).getAttribute("href"))?.includes("first=cursor&second=github-copilot"));
      await tasks.getByRole("button", { name: "Build an app" }).click();
      assert.deepEqual(
        (await tasks.locator(".ai-task-match h4").allInnerTexts()).map(x => x.trim()).sort(),
        ["Bolt", "Lovable", "Replit"], "App-building task shows the three source-reviewed builders");
      assert((await tasks.getByRole("link", { name: "Compare two starting points" }).getAttribute("href"))?.includes("first=lovable&second=bolt"));
      await tasks.getByRole("button", { name: "Make presentations" }).click();
      assert.deepEqual((await tasks.locator(".ai-task-match h4").allInnerTexts()).map(x => x.trim()).sort(),
        ["Canva", "Gamma"], "Presentation task includes Gamma alongside Canva");
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
      assert.equal(await page.locator(".ai-tools-card").count(), 16);
      assert.equal(await page.getByRole("button", { name: "Saved tools (0)" }).count(), 1);

      await page.locator("#ai-tools-sort").selectOption("category");
      assert.equal(await page.locator(".ai-tools-card").count(), 16);
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
      assert.equal(await page.locator(".ai-tools-card").count(), 5,
        "Coding category includes both editing assistants and three app builders");
      await page.getByRole("button", { name: "Clear filters" }).click();
      assert.equal(await page.locator(".ai-tools-card").count(), 16);

      await page.locator(".ai-tools-card").filter({ has: page.locator("h3", { hasText: "ChatGPT" }) })
        .getByRole("button", { name: "Compare" }).click();
      await page.locator(".ai-tools-card").filter({ has: page.locator("h3", { hasText: "Claude" }) })
        .getByRole("button", { name: "Compare" }).click();
      const compareLink = page.getByRole("link", { name: "Compare selected tools" });
      assert((await compareLink.getAttribute("href"))?.includes("first=chatgpt&second=claude"));
      await compareLink.click();
      await page.locator(".ai-tools-compare-table").waitFor();
      assert.equal(await page.locator(".ai-tools-compare-table thead th").count(), 3);
      assert((await page.locator(".ai-tools-compare-table").innerText()).includes("Plan names in dated provider sources"),
        "Comparison must show the two dated provider plan summaries");
      assert.equal(await page.locator(".ai-tools-compare-table a[href*='/pricing']").count(), 2,
        "Comparison must link to both providers' primary plan sources");
      const workflow = page.locator(".ai-tools-workflow-comparison");
      assert.equal(await workflow.locator(".ai-tools-workflow-table tbody tr").count(), 4,
        "ChatGPT versus Claude must show the union of four curated tasks");
      assert.equal((await workflow.locator(".ai-tools-workflow-summary").innerText()).includes("Shared listed tasks"), true);
      const codingCells = await workflow.locator('[data-workflow="coding-assistance"] td').allInnerTexts();
      assert.deepEqual(codingCells.map((value) => value.trim()), ["Listed use", "Listed use"],
        "Coding assistance should appear as a shared listed task");
      const docCells = await workflow.locator('[data-workflow="document-analysis"] td').allInnerTexts();
      assert.deepEqual(docCells.map((value) => value.trim()), ["Not listed here", "Listed use"],
        "Not-listed tasks must never be labeled unavailable");
      assert((await workflow.locator(".ai-tools-workflow-disclaimer").innerText()).includes("not mean a missing feature"));
      await noOverflow(page, "workflow comparison", view.width);
      await page.screenshot({ path: outputDir + "/" + view.label + "-workflow-comparison.png", fullPage: true });

      await navigate(page, "/ai-tools/compare?first=perplexity&second=notebooklm");
      const noShared = page.locator(".ai-tools-workflow-comparison");
      assert.equal(await noShared.locator(".ai-tools-workflow-zero").count(), 1,
        "Research tools with different curated jobs must not be falsely called equivalent");
      assert.equal(await noShared.locator(".ai-tools-workflow-table tbody tr").count(), 4);
      assert.equal(await noShared.locator(".ai-tools-workflow-listed").count(), 4,
        "Each curated task is listed for one research tool, without false cross-tool matching");
      await noOverflow(page, "zero-overlap workflow", view.width);
      await navigate(page, "/ai-tools/compare?first=adobe-firefly&second=midjourney");
      const imageRows = page.locator(".ai-tools-workflow-comparison");
      assert.equal(await imageRows.locator(".ai-tools-workflow-table tbody tr").count(), 3);
      assert.deepEqual(
        (await imageRows.locator('[data-workflow="image-generation"] td').allInnerTexts()).map((value) => value.trim()),
        ["Listed use", "Listed use"],
        "Image generation should correctly appear as a common documented use");
      await noOverflow(page, "image workflow comparison", view.width);
      await navigate(page, "/ai-tools/compare?first=lovable&second=bolt");
      const appCost = page.locator(".ai-tools-app-cost");
      assert.equal(await appCost.locator(".ai-tools-app-cost-card").count(), 2,
        "App builder comparison must contain both official billing records");
      assert.equal(await appCost.locator('[data-cost-tool="lovable"]').count(), 1);
      assert.equal(await appCost.locator('[data-cost-tool="bolt"]').count(), 1);
      assert((await appCost.innerText()).includes("token is not equivalent to a credit"),
        "Different billing units must never be called interchangeable");
      assert((await appCost.innerText()).includes("300,000 daily"),
        "Bolt free token limits must be clear");
      assert.equal(await appCost.locator('a[target="_blank"]').count(), 2,
        "Each billing card needs a direct source");
      await noOverflow(page, "app builder billing", view.width);
      await page.screenshot({path: outputDir + "/" + view.label + "-app-builder-billing.png", fullPage: true});

      await navigate(page, "/ai-tools/compare?first=lovable&second=replit");
      assert.equal(await page.locator(".ai-tools-app-cost-card").count(), 2);
      assert((await page.locator('[data-cost-tool="replit"]').innerText()).includes("usage beyond"),
        "Replit metered usage caveat must be visible");
      await noOverflow(page, "replit billing", view.width);

      await navigate(page, "/ai-tools/compare?first=chatgpt&second=claude");
      assert.equal(await page.locator(".ai-tools-app-cost").count(), 0,
        "App builder billing comparisons must not appear on unrelated tools");
      assert.equal(await page.locator(".ai-guide-context-banner").count(), 0,
        "Comparison must focus on structured product data, not removed guides");
      await noOverflow(page, "comparison", view.width);
      await page.screenshot({ path: outputDir + "/" + view.label + "-comparison.png", fullPage: true });

      await navigate(page, "/ai-tools/chatgpt");
      assert((await page.locator("main h1").innerText()).includes("ChatGPT"));
      assert.equal(await page.locator(".ai-tools-profile-evidence-panel").count(), 1);
      assert.equal(await page.locator('.ai-tools-profile-summary a[href="/ai-tools/pricing#plan-chatgpt"]').count(), 1,
        "Individual tool profile must link to its own dated plan record");
      assert.equal(await page.locator(".ai-tools-profile-guide-links").count(), 0,
        "Product profiles must not link to editorial comparison guides");
      assert.equal(await page.locator(".ai-tools-profile-related-card li").count(), 2);
      await noOverflow(page, "profile", view.width);
      await page.screenshot({ path: outputDir + "/" + view.label + "-profile.png", fullPage: true });

      await navigate(page, "/ai-tools/pricing");
      assert.equal(await page.locator(".ai-tools-price-card").count(), 16,
        "Show all sixteen official-source pricing snapshots");
      assert.equal(await page.locator(".ai-tools-price-card .ai-tools-price-reviewed time").count(), 16,
        "Each plan source must show its own last-reviewed date");
      assert.equal(await page.locator(".ai-tools-price-card .ai-tools-price-capabilities").count(), 16,
        "Every plan card must show official-document product details");
      assert.equal(await page.locator('.ai-tools-price-card .ai-tools-price-actions a[target="_blank"]').count(), 16,
        "Each provider should link to its own official pricing or plan source");
      assert.equal(await page.locator('.ai-tools-price-card .ai-tools-price-capabilities a[target="_blank"]').count(), 16,
        "Each provider needs a separate source for documented capabilities");
      const cursorCard = page.locator("#plan-cursor");
      assert((await cursorCard.innerText()).includes("Premium"),
        "New Cursor X Subscription tiers must not reuse legacy Pro-only data");
      assert((await cursorCard.innerText()).includes("23 November 2026"));
      assert((await page.locator("#plan-claude").innerText()).includes("21 November 2026"),
        "Old provider review dates must not be silently reset when new providers are added");
      assert((await page.locator("#plan-notebooklm").innerText()).includes("not four separate Notebook checkouts"),
        "Gemini Notebook plan labels must be identified as Google subscription access levels");
      assert((await page.locator("#plan-runway").innerText()).includes("legacy Unlimited"),
        "Runway transitions should not mislead existing subscribers");
      for (const slug of ["bolt", "gamma", "lovable", "replit"]) {
        const card = page.locator("#plan-" + slug);
        assert.equal(await card.count(), 1, "Plan card missing: " + slug);
        assert((await card.innerText()).includes("23 November 2026"));
        assert.equal(await card.locator("a[target='_blank']").count(), 2,
          "New plan cards must link both pricing and product documentation");
      }
      assert.equal(
        await page.getByRole("link", {name:"Compare app-builder costs"}).count(), 1,
        "Pricing page must link to practical app-builder cost comparison");
      await noOverflow(page, "pricing", view.width);
      await page.screenshot({ path: outputDir + "/" + view.label + "-pricing.png", fullPage: true });

      await navigate(page, "/ai-tools/alternatives?tool=claude");
      assert.equal((await page.locator(".ai-tools-alternatives-context h2").innerText()).trim(), "Claude");
      assert.equal(await page.locator(".ai-tools-alternative-match-card").count(), 2,
        "ChatGPT and Gemini share stated assistant use cases with Claude");
      assert.equal(await page.locator(".ai-tools-alternative-secondary-card").count(), 0,
        "No fabricated separate category for Claude's valid shared-use matches");
      assert.equal(await page.locator(".ai-tools-alternative-evidence a").count(), 2,
        "Every matched alternative must link its own official evidence");
      await noOverflow(page, "alternatives", view.width);
      await page.screenshot({ path: outputDir + "/" + view.label + "-alternatives.png", fullPage: true });

      await navigate(page, "/ai-tools/alternatives?tool=claude&job=coding-assistance");
      assert.equal(await page.locator("#ai-alternative-job").inputValue(), "coding-assistance",
        "Task selection must remain shareable in the address bar");
      assert.equal(await page.locator(".ai-tools-alternative-match-card").count(), 1);
      assert.equal((await page.locator(".ai-tools-alternative-match-card h3").innerText()).trim(), "ChatGPT",
        "Only a matching coding assistant should appear as a stated-use overlap");
      assert.equal((await page.locator(".ai-tools-alternative-secondary-card h3").innerText()).trim(), "Gemini",
        "Writing overlap must not be mislabeled as a coding-assistance match");
      const taskCopy = await page.locator(".ai-tools-alternative-match-card").innerText();
      assert(taskCopy.includes("Coding assistance") && !taskCopy.includes("universal winner"),
        "Displayed match should explain the shared job, not infer a winner");
      await noOverflow(page, "task-specific alternatives", view.width);

      await navigate(page, "/ai-tools/alternatives?tool=perplexity");
      assert.equal(await page.locator(".ai-tools-alternative-match-card").count(), 0,
        "Web research and document-based research are different jobs");
      assert.equal(await page.locator(".ai-tools-alternative-secondary-card").count(), 1,
        "Gemini Notebook may appear as related research, not an interchangeable match");
      assert((await page.locator(".ai-tools-alternatives-empty").innerText()).includes("No documented task overlap"));

      await navigate(page, "/ai-tools/alternatives?tool=adobe-firefly");
      assert.equal((await page.locator(".ai-tools-alternative-match-card h3").innerText()).trim(), "Midjourney",
        "Image generation is a genuine listed common use");
      assert.deepEqual(
        (await page.locator(".ai-tools-alternative-secondary-card h3").allInnerTexts()).map(x => x.trim()),
        ["Canva", "Gamma"],
        "Design and presentation products must remain related, not image-generation substitutes");

      await navigate(page, "/ai-tools/alternatives?tool=bolt&job=app-building");
      assert.equal(await page.locator(".ai-tools-alternative-match-card").count(), 2,
        "Bolt app building should match Lovable and Replit in the documented job");
      assert.deepEqual(
        (await page.locator(".ai-tools-alternative-match-card h3").allInnerTexts()).map(x => x.trim()),
        ["Lovable", "Replit"]);
      assert.equal(await page.locator(".ai-tools-alternative-secondary-card").count(), 2,
        "Code editors should not be misrepresented as equivalent app builders");
      await noOverflow(page, "app alternatives", view.width);

      await navigate(page, "/ai-tools/compare?first=bolt&second=lovable");
      const appWorkflow = page.locator(".ai-tools-workflow-comparison");
      assert.equal(await appWorkflow.locator(".ai-tools-workflow-table tbody tr").count(), 3,
        "App builders share three explicitly listed tasks");
      assert.equal(await appWorkflow.locator(".ai-tools-workflow-listed").count(), 6);
      await noOverflow(page, "app comparison", view.width);

      await navigate(page, "/ai-tools/lovable");
      assert.equal(await page.locator("h1").first().innerText(), "Lovable");
      assert.equal(await page.locator(".ai-tools-profile-evidence-panel").count(), 1);
      assert.equal(await page.locator('.ai-tools-profile-summary a[href="/ai-tools/pricing#plan-lovable"]').count(), 1);
      await noOverflow(page, "new tool profile", view.width);

      await navigate(page, "/ai-tools/alternatives?tool=runway");
      assert.equal(await page.locator(".ai-tools-alternative-card").count(), 0,
        "The single video listing must not invent an alternative");
      assert.equal(await page.locator(".ai-tools-alternatives-empty").count(), 1);
      await noOverflow(page, "zero-match alternatives", view.width);

      await navigate(page, "/ai-tools/alternatives?tool=claude&job=not-a-real-job");
      assert.equal(await page.locator("#ai-alternative-job").inputValue(), "",
        "Unknown job query parameters must safely revert to all stated workflows");
      assert.equal(await page.locator(".ai-tools-alternative-match-card").count(), 2);

      if (view.label === "desktop") {
        // Exercise consent-gated custom events locally; intercept gtag before
        // any external request and never send QA events to real GA4.
        const telemetryPage = await browser.newPage({ viewport: { width: 1280, height: 850 } });
        try {
          await navigate(telemetryPage, "/ai-tools");
          await telemetryPage.evaluate(() => {
            localStorage.setItem("decodista-analytics-consent", "denied");
            sessionStorage.removeItem("__qaAiEvents");
            window.gtag = (...args) => {
              if (args[0] !== "event") return;
              const events = JSON.parse(sessionStorage.getItem("__qaAiEvents") || "[]");
              events.push(args);
              sessionStorage.setItem("__qaAiEvents", JSON.stringify(events));
            };
          });
          await telemetryPage.getByRole("button", { name: "Build an app" }).click();
          await telemetryPage.locator("#ai-tool-query").fill("private-phrase-do-not-send");
          await telemetryPage.locator("#ai-tool-query").press("Enter");
          await telemetryPage.locator("#ai-tool-query").fill("");
          await telemetryPage.getByRole("button", { name: "Save ChatGPT to this browser" }).click();
          assert.deepEqual(await telemetryPage.evaluate(
            () => JSON.parse(sessionStorage.getItem("__qaAiEvents") || "[]")), [],
            "No analytics event may fire without opt-in");

          await telemetryPage.evaluate(() =>
            localStorage.setItem("decodista-analytics-consent", "granted"));
          await telemetryPage.getByRole("button", { name: "Research a topic" }).click();
          await telemetryPage.getByRole("button", { name: "Build an app" }).click();
          await telemetryPage.locator("#ai-tool-query").fill("private-phrase-do-not-send");
          await telemetryPage.locator("#ai-tool-query").press("Enter");
          await telemetryPage.locator("#ai-tool-query").fill("voiceovers");
          await telemetryPage.locator("#ai-tool-query").press("Enter");
          await telemetryPage.locator("#ai-tool-query").fill("");
          await telemetryPage.getByRole("button", { name: "Remove ChatGPT from saved tools" }).click();
          await telemetryPage.getByRole("button", { name: "Save ChatGPT to this browser" }).click();
          await telemetryPage.locator(".ai-tools-card").filter({
            has: telemetryPage.locator("h3", { hasText: "ChatGPT" }),
          }).getByRole("button", { name: "Compare" }).click();
          await telemetryPage.locator(".ai-tools-card").filter({
            has: telemetryPage.locator("h3", { hasText: "Claude" }),
          }).getByRole("button", { name: "Compare" }).click();
          await telemetryPage.getByRole("link", { name: "Compare selected tools" }).click();
          const recorded = await telemetryPage.evaluate(
            () => JSON.parse(sessionStorage.getItem("__qaAiEvents") || "[]"));
          const eventNames = recorded.map((item) => item[1]);
          for (const expected of [
            "ai_tools_task_select", "ai_tools_search_complete",
            "ai_tools_save_toggle", "ai_tools_compare_select", "ai_tools_compare_open",
          ]) {
            assert(eventNames.includes(expected), "Missing opt-in intent event: " + expected);
          }
          assert(recorded.some((item) => item[1] === "ai_tools_task_select" && item[2]?.task_id === "app-building"),
            "New app-building task must be measurable");
          assert(recorded.some((item) => item[1] === "ai_tools_search_complete" && item[2]?.result_bucket === "none"),
            "No-result search must be measurable without collecting the query");
          assert(recorded.some((item) => item[1] === "ai_tools_search_complete" && item[2]?.result_bucket === "one"),
            "Single-result search must be measurable without collecting the query");
          assert(recorded.some((item) => item[1] === "ai_tools_compare_open" &&
            item[2]?.first_tool === "chatgpt" && item[2]?.second_tool === "claude"),
            "Opened comparison needs a validated pair, not just a selection");
          assert(!JSON.stringify(recorded).includes("private-phrase-do-not-send"),
            "Raw user searches must never reach the analytics payload");
          assert(!eventNames.includes("page_view"), "Custom events must not duplicate native page views");
        } finally {
          await telemetryPage.close();
        }

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
