import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Repeated PUBLIC-PRODUCTION Lighthouse samples (synthetic mobile lab).
// This diagnoses variation; it does not measure CrUX or real-user INP.
const base = new URL(process.env.DECODISTA_PRODUCTION_URL ?? "https://decodista.com/");
const outDir = process.env.HOMEPAGE_DIAGNOSTIC_DIR ?? "artifacts/homepage-tbt-diagnostics";
const homeRuns = Number(process.env.HOMEPAGE_DIAGNOSTIC_RUNS ?? 4);
const controlRuns = Number(process.env.CONTROL_DIAGNOSTIC_RUNS ?? 2);
assert(Number.isInteger(homeRuns) && homeRuns >= 3 && homeRuns <= 8, "Run 3–8 homepage samples");
assert(Number.isInteger(controlRuns) && controlRuns >= 1 && controlRuns <= 4, "Run 1–4 control samples");
await mkdir(outDir, { recursive: true });

function median(values) {
  const ordered = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!ordered.length) return null;
  const middle = Math.floor(ordered.length / 2);
  return ordered.length % 2 ? ordered[middle] : (ordered[middle - 1] + ordered[middle]) / 2;
}

function stats(records, key) {
  const values = records.map(item => item[key]).filter(Number.isFinite);
  return {
    sampleCount: values.length,
    median: median(values),
    min: values.length ? Math.min(...values) : null,
    max: values.length ? Math.max(...values) : null,
  };
}

function attribution(report) {
  const items = report.audits?.["bootup-time"]?.details?.items ?? [];
  const label = url => {
    if (url === "Unattributable") return "Unattributable";
    if (url.startsWith("https://static.cloudflareinsights.com/")) return "Cloudflare Insights";
    if (url.includes("/_next/static/chunks/framework-")) return "First-party framework";
    if (url === base.href || url === new URL("/", base).href || url === new URL("/how-to", base).href) return "Document";
    if (url.startsWith(base.origin)) return "Other first-party assets";
    return "Other external assets";
  };
  const grouped = new Map();
  for (const item of items) {
    const name = label(item.url ?? "");
    const prev = grouped.get(name) ?? { totalTaskTimeMs: 0, scriptingMs: 0 };
    prev.totalTaskTimeMs += item.total ?? 0;
    prev.scriptingMs += item.scripting ?? 0;
    grouped.set(name, prev);
  }
  return Object.fromEntries([...grouped].map(([name, value]) => [name, {
    totalTaskTimeMs: Math.round(value.totalTaskTimeMs),
    scriptingMs: Math.round(value.scriptingMs),
  }]));
}

async function lighthouse(url, output) {
  const args = [
    url,
    "--output=json",
    "--output-path=" + output,
    "--only-categories=performance",
    "--throttling-method=simulate",
    "--form-factor=mobile",
    "--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage",
    "--quiet",
  ];
  await new Promise((resolve, reject) => {
    const child = spawn("lighthouse", args, { stdio: ["ignore", "pipe", "pipe"] });
    let completed = false;
    let log = "";
    const timer = setTimeout(() => {
      if (completed) return;
      completed = true;
      child.kill("SIGKILL");
      reject(new Error("Lighthouse timeout after 150 seconds"));
    }, 150_000);
    for (const stream of [child.stdout, child.stderr]) {
      stream.on("data", chunk => { log = (log + chunk.toString()).slice(-3000); });
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
      if (code === 0) resolve();
      else reject(new Error("Lighthouse exited " + code + ": " + log.slice(-900)));
    });
  });
}

// Interleave control and homepage measurements to reduce time-of-run bias.
// A cold GitHub runner and a busy runner must not silently make every
// homepage sample appear slower just because it was always tested first.
const plan = [];
for (let index = 0; index < homeRuns; index++) {
  plan.push({ route: "/", label: "homepage", index: index + 1 });
  if (index < controlRuns) {
    plan.push({ route: "/how-to", label: "how-to", index: index + 1 });
  }
  if (index === Math.floor(homeRuns / 2)) {
    plan.push({ route: "/latest", label: "latest", index: 1 });
  }
}

const results = [];
for (const sample of plan) {
  const url = new URL(sample.route, base).href;
  const reportPath = path.join(outDir, sample.label + "-" + sample.index + ".lighthouse.json");
  try {
    await lighthouse(url, reportPath);
    const report = JSON.parse(await readFile(reportPath, "utf8"));
    assert.equal(new URL(report.finalDisplayedUrl ?? report.finalUrl).host, base.host, "Unexpected audit host");
    assert(!report.runtimeError, report.runtimeError?.message ?? "Lighthouse runtime error");
    const audits = report.audits;
    const score = report.categories?.performance?.score;
    assert(typeof score === "number", "Missing performance score");
    assert.equal(report.configSettings?.formFactor, "mobile", "Expected simulated mobile Lighthouse");
    const tbtMs = Math.round(audits["total-blocking-time"]?.numericValue ?? 0);
    const lcpMs = Math.round(audits["largest-contentful-paint"]?.numericValue ?? 0);
    const mainThreadMs = Math.round(audits["mainthread-work-breakdown"]?.numericValue ?? 0);
    const nodeCount = audits["dom-size-insight"]?.details?.items
      ?.find(item => item.statistic === "Total elements")?.value?.value ?? null;
    const result = {
      ...sample,
      url,
      status: "passed",
      score: Math.round(score * 100),
      tbtMs,
      lcpMs,
      mainThreadMs,
      nodeCount,
      longTaskCount: audits["long-tasks"]?.details?.items?.length ?? 0,
      attribution: attribution(report),
      reportPath,
    };
    results.push(result);
    console.log("DIAGNOSTIC_SAMPLE " + JSON.stringify(result));
  } catch (error) {
    const result = { ...sample, url, status: "failed", error: String(error) };
    results.push(result);
    console.error("DIAGNOSTIC_FAILED " + JSON.stringify(result));
  }
}

const passed = results.filter(item => item.status === "passed");
const group = label => passed.filter(item => item.label === label);
const summary = {
  kind: "repeated-public-production-lighthouse-mobile-lab",
  checkedAt: new Date().toISOString(),
  target: base.href,
  disclaimer: "Synthetic Lighthouse lab. No CrUX, real-user INP or production UX guarantee. Bootup attribution is not an additive causal breakdown of TBT. Interleaved controls reduce, but cannot eliminate, GitHub runner CPU/load and network variance.",
  environment: "GitHub Actions ubuntu-latest Chrome, Lighthouse 13.6.0",
  plannedRuns: plan.length,
  successfulRuns: passed.length,
  groups: Object.fromEntries(["homepage", "how-to", "latest"].map(label => [
    label, {
      score: stats(group(label), "score"),
      tbtMs: stats(group(label), "tbtMs"),
      lcpMs: stats(group(label), "lcpMs"),
      mainThreadMs: stats(group(label), "mainThreadMs"),
      nodeCount: stats(group(label), "nodeCount"),
    },
  ])),
  samples: results,
};
await writeFile(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2));
console.log("DIAGNOSTIC_SUMMARY " + JSON.stringify(summary));

if (passed.length !== plan.length) {
  console.error("One or more lab measurements failed. Do not make a regression claim from partial samples.");
  process.exitCode = 1;
}
