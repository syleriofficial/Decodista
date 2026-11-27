import assert from "node:assert/strict";
import { test } from "node:test";
import { summarizeRawLighthouseDiagnostics } from "./lib/ai-tools-lighthouse-diagnostics.mjs";

function report(cpu, tbt, work, script, evalMs, route = "/ai-tools") {
  return {
    finalDisplayedUrl: "https://decodista.com" + route,
    configSettings: { formFactor: "mobile", throttlingMethod: "simulate" },
    environment: { benchmarkIndex: cpu },
    audits: {
      "total-blocking-time": { numericValue: tbt },
      "mainthread-work-breakdown": {
        numericValue: work,
        details: { items: [{ group: "scriptEvaluation", duration: evalMs }] },
      },
      "bootup-time": {
        numericValue: script,
        details: { items: [
          { url: "https://decodista.com/_next/static/chunks/framework-abc.js?key=secret", scripting: evalMs },
          { url: "Unattributable", scripting: 30 },
        ] },
      },
      "long-tasks": { details: { items: [
        { url: "https://decodista.com/ai-tools?private=input", duration: tbt + 50 },
      ] } },
      "network-requests": { details: { items: [{ url: "https://decodista.com/ai-tools" }] } },
    },
  };
}

test("Flag high variance but do not assign causation from three lab readings", () => {
  const data = [
    report(2876.5, 658.444, 2373.148, 790.26, 789.084),
    report(4374.5, 0, 491.46, 136.816, 146.072),
    report(4435, 0, 642.632, 155.184, 161.088),
  ];
  const x = summarizeRawLighthouseDiagnostics(data, "/ai-tools");
  assert.deepEqual(x.attentionFlags, {
    tbtSpreadOver200ms: true,
    cpuBenchmarkSpreadOver20Percent: true,
    mainThreadWorkOverTwiceMedian: true,
  });
  assert.equal(x.variability.totalBlockingTimeMs.max, 658.444);
  assert.equal(x.variability.totalBlockingTimeMs.median, 0);
  assert.equal(x.variability.cpuBenchmarkIndex.min, 2876.5);
  assert.equal(x.variability.networkRequestCount.min, 1);
  assert.equal(x.observations[0].longestTasks[0].source, "decodista.com/ai-tools");
  assert.equal(x.observations[0].largestScriptExecutions[0].source, "decodista.com/framework-abc.js");
  assert(!JSON.stringify(x).includes("secret"));
  assert(!JSON.stringify(x).includes("private=input"));
  assert(x.interpretation.includes("without being the cause"));
});

test("Stable compare-page readings have no variance flags", () => {
  const r = [
    report(4255.5, 0, 497, 150, 125, "/ai-tools/compare"),
    report(4108, 0, 457, 145, 130, "/ai-tools/compare"),
    report(4175.5, 0, 438, 140, 119, "/ai-tools/compare"),
  ];
  const d = summarizeRawLighthouseDiagnostics(r, "/ai-tools/compare");
  assert.deepEqual(d.attentionFlags, {
    tbtSpreadOver200ms: false,
    cpuBenchmarkSpreadOver20Percent: false,
    mainThreadWorkOverTwiceMedian: false,
  });
  assert.equal(d.observations.length, 3);
});

test("Reject invalid origin, missing raw evidence and invalid CPU index", () => {
  const all = [
    report(4000, 0, 400, 100, 120),
    report(4100, 0, 450, 120, 140),
    report(3900, 0, 500, 150, 150),
  ];
  const copy = () => structuredClone(all);
  assert.throws(() => summarizeRawLighthouseDiagnostics(all.slice(0, 2), "/ai-tools"), /3-5/);
  let data = copy(); data[0].finalDisplayedUrl = "https://attacker.test/ai-tools";
  assert.throws(() => summarizeRawLighthouseDiagnostics(data, "/ai-tools"), /origin\/config/);
  data = copy(); data[0].audits["long-tasks"].details = {};
  assert.throws(() => summarizeRawLighthouseDiagnostics(data, "/ai-tools"), /raw long-task/);
  data = copy(); data[0].environment.benchmarkIndex = null;
  assert.throws(() => summarizeRawLighthouseDiagnostics(data, "/ai-tools"), /CPU benchmark/);
  data = copy(); data[1].configSettings.throttlingMethod = "provided";
  assert.throws(() => summarizeRawLighthouseDiagnostics(data, "/ai-tools"), /origin\/config/);
});
