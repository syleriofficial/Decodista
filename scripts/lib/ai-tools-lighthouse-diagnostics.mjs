import { summarizeSamples } from "./ai-tools-lighthouse-stats.mjs";

// Evidence from raw Lighthouse JSON only. Do not infer causation from lab timings.
// Avoid leaking full URLs, query strings, session data or raw page text into diagnostics.
const valid = (value, label) => {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new Error("Missing or invalid Lighthouse " + label);
  }
  return value;
};
const sourceLabel = value => {
  if (value === "Unattributable") return "Unattributable";
  try {
    const url = new URL(value);
    const base = url.pathname.split("/").filter(Boolean).at(-1) ?? "/";
    return url.hostname + "/" + base;
  } catch {
    return "Unknown source";
  }
};
const metric = (report, key) => valid(report.audits?.[key]?.numericValue, key);

export function summarizeRawLighthouseDiagnostics(reports, route) {
  if (!Array.isArray(reports) || reports.length < 3 || reports.length > 5) {
    throw new Error("Diagnostics require 3-5 raw Lighthouse reports");
  }
  if (route !== "/ai-tools" && route !== "/ai-tools/compare") {
    throw new Error("Unsupported AI Tools diagnostic route");
  }
  const observations = reports.map((report, i) => {
    if (report.runtimeError || report.configSettings?.formFactor !== "mobile" ||
        report.configSettings?.throttlingMethod !== "simulate" ||
        !report.finalDisplayedUrl?.startsWith("https://decodista.com/ai-tools")) {
      throw new Error("Unexpected Lighthouse report origin/config in round " + (i + 1));
    }
    const url = new URL(report.finalDisplayedUrl);
    if (url.origin !== "https://decodista.com" || url.pathname !== route) {
      throw new Error("Lighthouse route mismatch in round " + (i + 1));
    }
    const tasks = report.audits?.["long-tasks"]?.details?.items;
    const scripts = report.audits?.["bootup-time"]?.details?.items;
    const network = report.audits?.["network-requests"]?.details?.items;
    if (!Array.isArray(tasks) || !Array.isArray(scripts) || !Array.isArray(network)) {
      throw new Error("Missing raw long-task, script or network evidence in round " + (i + 1));
    }
    const breakdown = report.audits?.["mainthread-work-breakdown"]?.details?.items;
    if (!Array.isArray(breakdown)) throw new Error("Missing main-thread groups");
    return {
      round: i + 1,
      cpuBenchmarkIndex: valid(report.environment?.benchmarkIndex, "CPU benchmark"),
      totalBlockingTimeMs: metric(report, "total-blocking-time"),
      totalMainThreadWorkMs: metric(report, "mainthread-work-breakdown"),
      scriptBootupMs: metric(report, "bootup-time"),
      scriptEvaluationMs: valid(
        breakdown.find(item => item.group === "scriptEvaluation")?.duration,
        "script evaluation work"
      ),
      networkRequestCount: network.length,
      longTaskCount: tasks.length,
      longestTasks: [...tasks].sort((a, b) => b.duration - a.duration).slice(0, 3).map(item => ({
        durationMs: valid(item.duration, "long task duration"),
        source: sourceLabel(item.url),
      })),
      largestScriptExecutions: [...scripts].sort((a, b) => b.scripting - a.scripting).slice(0, 3).map(item => ({
        executionMs: valid(item.scripting, "script execution"),
        source: sourceLabel(item.url),
      })),
    };
  });
  const stats = key => summarizeSamples(observations.map(r => r[key]));
  const cpu = stats("cpuBenchmarkIndex");
  const tbt = stats("totalBlockingTimeMs");
  const work = stats("totalMainThreadWorkMs");
  return {
    route,
    interpretation: "Diagnostic signals only. CPU, scripts and third-party tasks may coincide without being the cause of blocking. Reproduce on stable hardware before modifying production.",
    observations,
    variability: {
      cpuBenchmarkIndex: cpu,
      totalBlockingTimeMs: tbt,
      totalMainThreadWorkMs: work,
      scriptBootupMs: stats("scriptBootupMs"),
      scriptEvaluationMs: stats("scriptEvaluationMs"),
      networkRequestCount: stats("networkRequestCount"),
    },
    attentionFlags: {
      tbtSpreadOver200ms: tbt.max - tbt.min > 200,
      cpuBenchmarkSpreadOver20Percent: cpu.min < cpu.max * 0.8,
      mainThreadWorkOverTwiceMedian: work.max > work.median * 2,
    },
  };
}
