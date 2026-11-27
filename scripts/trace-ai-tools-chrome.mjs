import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import path from "node:path";
import { chromium } from "playwright";
import { classifyControlledRuns, sanitizeTrace, summarizeTraceEvents } from "./lib/ai-tools-chrome-trace.mjs";

// Anonymous public production pages only. No typing, login, cookies or user prompts.
// One Chrome browser and one GitHub Actions VM, fresh browser context for each visit.
// 4x CDP CPU throttle, no network throttle: NOT Lighthouse simulated TBT.
// GitHub-hosted runner CPU isolation is NOT guaranteed; tracing adds overhead.
const origin = new URL(process.env.AI_TOOLS_TRACE_ORIGIN ?? "https://decodista.com/");
assert.equal(origin.href, "https://decodista.com/", "Only public Decodista production is traceable");
const outDir = process.env.AI_TOOLS_TRACE_OUTPUT_DIR ?? "artifacts/ai-tools-chrome-traces";
await mkdir(outDir, { recursive: true });
const order = [
  "/ai-tools", "/ai-tools/compare", "/ai-tools/compare", "/ai-tools",
  "/ai-tools/compare", "/ai-tools", "/ai-tools", "/ai-tools/compare",
];
const chromiumBrowser = await chromium.launch({
  channel: "chrome", headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const chromeVersion = chromiumBrowser.version();
const samples = [];

async function captureTrace(session) {
  const complete = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("CDP Tracing.tracingComplete timed out")), 45000);
    session.once("Tracing.tracingComplete", event => {
      clearTimeout(timeout);
      resolve(event);
    });
  });
  await session.send("Tracing.end");
  const result = await complete;
  if (result.dataLossOccurred || !result.stream) {
    throw new Error("Chrome trace lost events or returned no stream");
  }
  const buffers = [];
  let totalBytes = 0;
  while (true) {
    const chunk = await session.send("IO.read", { handle: result.stream, size: 1048576 });
    const bytes = Buffer.from(chunk.data ?? "", chunk.base64Encoded ? "base64" : "utf8");
    totalBytes += bytes.length;
    if (totalBytes > 80 * 1024 * 1024) throw new Error("Trace exceeded safe 80 MB limit");
    buffers.push(bytes);
    if (chunk.eof) break;
  }
  await session.send("IO.close", { handle: result.stream });
  const trace = JSON.parse(Buffer.concat(buffers).toString("utf8"));
  if (!Array.isArray(trace.traceEvents)) throw new Error("Invalid Chrome trace JSON");
  return trace;
}

try {
  for (const [index, route] of order.entries()) {
    const context = await chromiumBrowser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2, isMobile: true, hasTouch: true,
      reducedMotion: "reduce", locale: "en-US",
    });
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.__aiToolsTraceLongTaskDurations = [];
      if (!("PerformanceObserver" in window)) return;
      try {
        const observer = new PerformanceObserver(list => {
          for (const item of list.getEntries()) {
            if (item.entryType === "longtask") {
              window.__aiToolsTraceLongTaskDurations.push(item.duration);
            }
          }
        });
        observer.observe({ type: "longtask", buffered: true });
      } catch { /* longtask timing not universally supported */ }
    });
    const cdp = await context.newCDPSession(page);
    let trace;
    let response;
    let perf;
    try {
      await cdp.send("Performance.enable");
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await cdp.send("Tracing.start", {
        transferMode: "ReturnAsStream",
        traceConfig: {
          recordMode: "recordUntilFull",
          includedCategories: ["toplevel", "devtools.timeline", "v8", "blink.user_timing", "loading"],
        },
      });
      response = await page.goto(origin.href.slice(0, -1) + route, {
        waitUntil: "load", timeout: 60000,
      });
      assert.equal(response?.status(), 200, route + " must load successfully");
      await page.locator("main").first().waitFor({ state: "visible", timeout: 30000 });
      if (route === "/ai-tools") {
        await page.locator(".ai-task-finder").first().waitFor({ state: "visible", timeout: 30000 });
      }
      await page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => undefined);
      await page.waitForTimeout(800);
      perf = await cdp.send("Performance.getMetrics");
      const observed = await page.evaluate(() => ({
        longTasks: [...(window.__aiToolsTraceLongTaskDurations ?? [])],
        resourceCount: performance.getEntriesByType("resource").length,
        origin: location.origin, pathname: location.pathname,
      }));
      assert.equal(observed.origin, origin.origin);
      assert.equal(observed.pathname, route);
      trace = await captureTrace(cdp);
      const sanitized = sanitizeTrace(trace);
      const traceSummary = summarizeTraceEvents(sanitized.traceEvents);
      const traceFilename = "trace-" + String(index + 1).padStart(2, "0") +
        "-" + (route === "/ai-tools" ? "finder" : "compare") + ".json.gz";
      await writeFile(path.join(outDir, traceFilename),
        gzipSync(Buffer.from(JSON.stringify(sanitized)), { level: 6 }));
      const sample = {
        sequence: index + 1, route, traceFilename, cpuThrottlingRate: 4,
        observerLongTaskCount: observed.longTasks.length,
        pageLongTaskProxyMs: Number(observed.longTasks.reduce(
          (sum, duration) => sum + Math.max(0, duration - 50), 0).toFixed(1)),
        networkResourceCount: observed.resourceCount,
        cdpPerformanceMetrics: Object.fromEntries(
          (perf.metrics ?? []).filter(m =>
            ["TaskDuration", "ScriptDuration", "LayoutDuration", "RecalcStyleDuration"].includes(m.name)
          ).map(m => [m.name, Number(m.value.toFixed(4))])
        ),
        traceSummary,
      };
      samples.push(sample);
      console.log("AI_TOOLS_CDP_TRACE_SAMPLE " + JSON.stringify(sample));
    } finally {
      await cdp.detach().catch(() => {});
      await context.close();
    }
  }
  const summary = {
    kind: "controlled-single-runner-chrome-devtools-performance-traces",
    commit: process.env.GITHUB_SHA ?? null,
    measuredAt: new Date().toISOString(),
    chromeVersion,
    viewport: "390x844 mobile emulation",
    cpuThrottlingRate: 4,
    networkThrottling: "none",
    caveat: "Single shared GitHub VM, same Chrome browser process. NOT dedicated stable physical hardware, Lighthouse simulated TBT, representative field INP or proof of causation. CDP tracing itself adds overhead.",
    site: "https://decodista.com/",
    routes: classifyControlledRuns(samples),
    samples,
  };
  await writeFile(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2) + "\n");
  console.log("AI_TOOLS_CDP_TRACE_SUMMARY " + JSON.stringify({
    kind: summary.kind, chromeVersion, routes: summary.routes,
    samples: samples.map(s => ({
      sequence: s.sequence, route: s.route, proxyMs: s.pageLongTaskProxyMs,
      traceProxyMs: s.traceSummary.rendererTaskOver50msSumExcessMs,
      scriptSeconds: s.cdpPerformanceMetrics.ScriptDuration,
      topScript: s.traceSummary.longestScriptEvents[0],
    })),
  }));
} finally {
  await chromiumBrowser.close();
}
