import assert from "node:assert/strict";
import { test } from "node:test";
import { safeUrl, sanitizeTrace, summarizeTraceEvents, classifyControlledRuns } from "./lib/ai-tools-chrome-trace.mjs";

test("Chrome trace summary focuses on renderer thread and does not mistake nested script events for task TBT", () => {
  const events = [
    { ph: "M", pid: 1, tid: 2, name: "thread_name", args: { name: "CrRendererMain" } },
    { ph: "M", pid: 1, tid: 3, name: "thread_name", args: { name: "CrBrowserMain" } },
    { ph: "X", pid: 1, tid: 2, name: "RunTask", dur: 120000 },
    { ph: "X", pid: 1, tid: 2, name: "RunTask", dur: 45000 },
    { ph: "X", pid: 1, tid: 2, name: "EvaluateScript", dur: 80000,
      args: { data: { url: "https://decodista.com/static/main.js?private=value" } } },
    { ph: "X", pid: 1, tid: 3, name: "RunTask", dur: 1000000 },
  ];
  const report = summarizeTraceEvents(events);
  assert.equal(report.rendererTaskOver50msCount, 1);
  assert.equal(report.rendererTaskOver50msSumExcessMs, 70);
  assert.equal(report.longestRendererTasksMs[0], 120);
  assert.equal(report.longestScriptEvents[0].source, "https://decodista.com/static/main.js");
  assert.equal(report.rendererThreadCount, 1);
  assert(!JSON.stringify(report).includes("private"));
});

test("Sanitize public request URL query strings in source trace JSON", () => {
  assert.equal(safeUrl("https://decodista.com/ai-tools?secret=123#private"), "https://decodista.com/ai-tools");
  assert.deepEqual(sanitizeTrace({
    traceEvents: [{ args: { data: { url: "https://example.org/p?token=abc", ids: [1, 2] } } }],
  }), { traceEvents: [{ args: { data: { url: "https://example.org/p", ids: [1, 2] } } }] });
  assert.throws(() => summarizeTraceEvents([]), /no events/);
  assert.throws(() => summarizeTraceEvents([{ name: "RunTask", ph: "X", dur: 99999 }]), /renderer main/);
});

test("Exactly four same-configuration public route samples per page required", () => {
  const sample = route => ({
    route, cpuThrottlingRate: 4, pageLongTaskProxyMs: 12,
    networkResourceCount: 23,
    traceSummary: { rendererTaskOver50msSumExcessMs: 20 },
  });
  const runs = Array.from({ length: 4 }, () => sample("/ai-tools"))
    .concat(Array.from({ length: 4 }, () => sample("/ai-tools/compare")));
  const summary = classifyControlledRuns(runs);
  assert.equal(summary["/ai-tools"].runs, 4);
  assert.equal(summary["/ai-tools/compare"].pageLongTaskProxyMs.median, 12);
  assert.throws(() => classifyControlledRuns(runs.slice(1)), /eight/);
  const invalid = structuredClone(runs); invalid[0].cpuThrottlingRate = 2;
  assert.throws(() => classifyControlledRuns(invalid), /CPU throttling/);
});
