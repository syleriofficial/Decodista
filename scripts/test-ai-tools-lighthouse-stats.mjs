import assert from "node:assert/strict";
import { test } from "node:test";
import { summarizeSamples, summarizeAiToolsRuns } from "./lib/ai-tools-lighthouse-stats.mjs";

const make = (performance, lcp, tbt, cls, version = "13.6.0") => ({
  kind: "public-site-lighthouse-simulated-mobile-lab", failures: [],
  results: [
    {
      url: "https://decodista.com/ai-tools", status: "passed",
      lighthouseVersion: version, simulatedThrottling: "simulate",
      scores: { performance, accessibility: 100, seo: 66 },
      labMetrics: { largestContentfulPaint: { value: lcp }, totalBlockingTime: { value: tbt }, cumulativeLayoutShift: cls },
    },
    {
      url: "https://decodista.com/ai-tools/compare", status: "passed",
      lighthouseVersion: version, simulatedThrottling: "simulate",
      scores: { performance: 100, accessibility: 100, seo: 66 },
      labMetrics: { largestContentfulPaint: { value: 900 }, totalBlockingTime: { value: 0 }, cumulativeLayoutShift: 0 },
    },
  ],
});

test("Median and range summarize numeric samples without shifting their order", () => {
  const input = [98, 93, 100, 90, 96];
  assert.deepEqual(summarizeSamples(input), {
    samples: input, count: 5, median: 96, min: 90, max: 100,
  });
  assert.equal(summarizeSamples([1, 4, 2, 3]).median, 2.5);
});

test("Three Lighthouse runs report route medians and spread", () => {
  const data = [
    make(93, 1460, 312, 0),
    make(98, 1189, 138, 0.02),
    make(90, 1530, 250, 0),
  ];
  const result = summarizeAiToolsRuns(data);
  assert.equal(result.repetitionsPerRoute, 3);
  assert.deepEqual(result.routes.map(item => item.route), ["/ai-tools", "/ai-tools/compare"]);
  assert.deepEqual(result.routes[0].performanceScore, {
    samples: [93, 98, 90], count: 3, median: 93, min: 90, max: 98,
  });
  assert.equal(result.routes[0].largestContentfulPaintMs.median, 1460);
  assert.equal(result.routes[0].totalBlockingTimeMs.median, 250);
  assert.equal(result.routes[0].cumulativeLayoutShift.max, 0.02);
  assert.equal(result.routes[1].performanceScore.median, 100);
});

test("Reject missing route, failed run, nonmobile or incomplete numeric metrics", () => {
  const rounds = [make(98, 1000, 50, 0), make(97, 1100, 60, 0), make(96, 1200, 70, 0)];
  const copy = () => structuredClone(rounds);
  let a = copy(); a[0].results.pop();
  assert.throws(() => summarizeAiToolsRuns(a), /exactly one/);
  a = copy(); a[1].failures.push("Timeout");
  assert.throws(() => summarizeAiToolsRuns(a), /failed/);
  a = copy(); a[1].results[0].simulatedThrottling = "provided";
  assert.throws(() => summarizeAiToolsRuns(a), /simulated/);
  a = copy(); a[2].results[0].scores.performance = null;
  assert.throws(() => summarizeAiToolsRuns(a), /Invalid Lighthouse metric/);
  a = copy(); a[2].results[0].lighthouseVersion = "12.0";
  assert.throws(() => summarizeAiToolsRuns(a), /version mismatch/);
  assert.throws(() => summarizeAiToolsRuns(rounds.slice(0, 2)), /3-5/);
});
