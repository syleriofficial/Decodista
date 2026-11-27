import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { summarizeAiToolsRuns, TARGET_PATHS } from "./lib/ai-tools-lighthouse-stats.mjs";
import { summarizeRawLighthouseDiagnostics } from "./lib/ai-tools-lighthouse-diagnostics.mjs";

// Executed in GitHub Actions AFTER the matching Cloudflare build has succeeded.
// No AI API, user-provided prompts or Finder telemetry. Does not change public UI.
// The existing one-run production audit remains unchanged.
const repeats = Number(process.env.AI_TOOLS_LAB_REPEATS ?? 3);
if (!Number.isInteger(repeats) || repeats < 3 || repeats > 5) {
  throw new Error("AI_TOOLS_LAB_REPEATS must be between 3 and 5");
}
const base = process.env.DECODISTA_PRODUCTION_URL ?? "https://decodista.com/";
const origin = new URL(base);
if (origin.protocol !== "https:" || origin.hostname !== "decodista.com") {
  throw new Error("Repeatable production audit must target decodista.com over HTTPS");
}
const outDir = process.env.AI_TOOLS_LAB_OUTPUT_DIR ?? "artifacts/ai-tools-performance";
await mkdir(outDir, { recursive: true });
const rounds = [];

function childProcess(env) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["scripts/audit-production-lighthouse.mjs"], {
      stdio: "inherit",
      env: { ...process.env, ...env },
    });
    child.on("error", reject);
    child.on("close", code => code === 0 ? resolve() : reject(new Error("Lighthouse round exited " + code)));
  });
}

for (let i = 0; i < repeats; i++) {
  // Reverse order on alternating runs to avoid always auditing Finder first.
  const order = i % 2 ? [...TARGET_PATHS].reverse() : [...TARGET_PATHS];
  const roundDir = path.join(outDir, "round-" + String(i + 1).padStart(2, "0"));
  await mkdir(roundDir, { recursive: true });
  console.log("AI_TOOLS_LAB round " + (i + 1) + "/" + repeats + " paths=" + order.join(","));
  await childProcess({
    LIGHTHOUSE_PATHS: order.join(","),
    LIGHTHOUSE_OUTPUT_DIR: roundDir,
    DECODISTA_PRODUCTION_URL: origin.href,
  });
  const report = JSON.parse(await readFile(path.join(roundDir, "summary.json"), "utf8"));
  if (report.failures?.length || report.results?.length !== TARGET_PATHS.length) {
    throw new Error("Incomplete Lighthouse lab round " + (i + 1));
  }
  rounds.push(report);
}

const diagnostics = [];
for (const route of TARGET_PATHS) {
  const basename = route === "/ai-tools" ? "ai-tools.lighthouse.json" : "ai-tools-compare.lighthouse.json";
  const rawReports = [];
  for (let i = 0; i < repeats; i++) {
    const roundDir = path.join(outDir, "round-" + String(i + 1).padStart(2, "0"));
    const rawReport = JSON.parse(await readFile(path.join(roundDir, basename), "utf8"));
    rawReports.push(rawReport);
  }
  diagnostics.push(summarizeRawLighthouseDiagnostics(rawReports, route));
}
const summary = {
  ...summarizeAiToolsRuns(rounds, origin.href),
  diagnostics,
  checkedAt: new Date().toISOString(),
  gitCommitSha: process.env.GITHUB_SHA ?? null,
  hardware: "GitHub Actions ubuntu-latest, installed Chrome, Lighthouse 13.6.0",
  rawRoundDirs: Array.from({ length: repeats }, (_, i) => "round-" + String(i + 1).padStart(2, "0")),
};
await writeFile(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2) + "\n");
console.log("AI_TOOLS_REPEATED_LAB_SUMMARY " + JSON.stringify(summary));
