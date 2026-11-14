import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Lighthouse's standard mobile simulated-throttling profile is intentionally
// different from the unthrottled Playwright baseline. This is LAB data only.
// It is not the 28-day CrUX p75 LCP, INP or CLS from real visitors.
const base = new URL(process.env.DECODISTA_PRODUCTION_URL ?? "https://decodista.com/");
const paths = (process.env.LIGHTHOUSE_PATHS ??
  "/,/how-to,/latest,/articles/gmail-not-receiving-emails-google-storage-full")
  .split(",").map(value => value.trim()).filter(Boolean);
const outDir = process.env.LIGHTHOUSE_OUTPUT_DIR ?? "artifacts/production-lighthouse";
const timeoutMs = 150_000;
await mkdir(outDir, { recursive: true });
const results = [];
const failures = [];

async function runLighthouse(url, reportPath) {
  const args = [
    url,
    "--output=json",
    "--output-path=" + reportPath,
    "--only-categories=performance,accessibility,best-practices,seo",
    "--throttling-method=simulate",
    "--form-factor=mobile",
    "--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage",
    "--quiet",
  ];
  await new Promise((resolve, reject) => {
    const child = spawn("lighthouse", args, { stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    let completed = false;
    const timer = setTimeout(() => {
      if (completed) return;
      child.kill("SIGKILL");
      reject(new Error("Lighthouse run exceeded " + timeoutMs + " ms"));
    }, timeoutMs);
    for (const stream of [child.stdout, child.stderr]) {
      stream.on("data", chunk => {
        output = (output + chunk.toString()).slice(-8000);
      });
    }
    child.on("error", error => {
      if (completed) return;
      completed = true;
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", code => {
      if (completed) return;
      completed = true;
      clearTimeout(timer);
      if (code !== 0) reject(new Error("Lighthouse exit code " + code + ": " + output.slice(-1800)));
      else resolve();
    });
  });
}

const metric = (report, id) => {
  const audit = report.audits?.[id];
  return {
    value: typeof audit?.numericValue === "number" ? Math.round(audit.numericValue) : null,
    displayValue: audit?.displayValue ?? null,
  };
};

for (const [index, route] of paths.entries()) {
  const url = new URL(route.replace(/^\//, ""), base).href;
  const slug = route === "/" ? "homepage" : route.replace(/^\//, "").replace(/[^a-z0-9]+/gi, "-").slice(0, 70);
  const reportPath = path.join(outDir, slug + ".lighthouse.json");
  try {
    await runLighthouse(url, reportPath);
    const report = JSON.parse(await readFile(reportPath, "utf8"));
    assert.equal(new URL(report.finalDisplayedUrl ?? report.finalUrl).host, base.host, "Audit must stay on production origin");
    assert(!report.runtimeError, report.runtimeError?.message ?? "Lighthouse runtime error");
    const performance = report.categories?.performance?.score;
    assert(typeof performance === "number", "Lighthouse performance score must exist");
    assert.equal(report.configSettings?.formFactor, "mobile", "Audit must emulate mobile form factor");
    const record = {
      url,
      status: "passed",
      lighthouseVersion: report.lighthouseVersion,
      scores: Object.fromEntries(
        ["performance", "accessibility", "best-practices", "seo"].map(id => [
          id, report.categories?.[id]?.score == null ? null : Math.round(report.categories[id].score * 100),
        ]),
      ),
      labMetrics: {
        firstContentfulPaint: metric(report, "first-contentful-paint"),
        largestContentfulPaint: metric(report, "largest-contentful-paint"),
        speedIndex: metric(report, "speed-index"),
        totalBlockingTime: metric(report, "total-blocking-time"),
        cumulativeLayoutShift: report.audits?.["cumulative-layout-shift"]?.numericValue ?? null,
      },
      simulatedThrottling: report.configSettings?.throttlingMethod ?? null,
      warnings: report.runWarnings?.slice(0, 10) ?? [],
      rawReport: reportPath,
    };
    results.push(record);
    console.log("AUDIT " + (index + 1) + "/" + paths.length + " " + JSON.stringify(record));
  } catch (error) {
    const failure = { url, status: "failed", error: String(error) };
    results.push(failure);
    failures.push(failure);
    console.error("AUDIT FAILED " + JSON.stringify(failure));
  }
}

const summary = {
  kind: "public-site-lighthouse-simulated-mobile-lab",
  checkedAt: new Date().toISOString(),
  disclaimer: "Synthetic Lighthouse lab measurements with simulated mobile throttling; NOT real-user CrUX field Core Web Vitals or INP. Single runs can vary.",
  chromiumEnvironment: "GitHub Actions ubuntu-latest Chrome",
  target: base.href,
  results,
  failures,
};
await writeFile(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2));
console.log("LIGHTHOUSE_SUMMARY " + JSON.stringify(summary));
if (failures.length) process.exitCode = 1;
