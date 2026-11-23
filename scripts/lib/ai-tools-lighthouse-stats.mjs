// Synthetic lab only; these calculations never represent real-user Core Web Vitals.
export const TARGET_PATHS = ["/ai-tools", "/ai-tools/compare"];

export function summarizeSamples(values) {
  if (!Array.isArray(values) || values.length === 0 ||
      !values.every(value => typeof value === "number" && Number.isFinite(value))) {
    throw new Error("Expected finite numeric Lighthouse samples");
  }
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  return { samples: values, count: values.length, median, min: sorted[0], max: sorted.at(-1) };
}

export function summarizeAiToolsRuns(rounds, origin = "https://decodista.com/") {
  if (!Array.isArray(rounds) || rounds.length < 3 || rounds.length > 5) {
    throw new Error("Run 3-5 independent Lighthouse processes per target route");
  }
  const base = new URL(origin);
  if (base.protocol !== "https:") throw new Error("Production lab requires HTTPS");
  const summaries = [];
  for (const route of TARGET_PATHS) {
    const url = new URL(route, base).href;
    const readings = [];
    for (const [index, round] of rounds.entries()) {
      if (!round || round.failures?.length || !Array.isArray(round.results)) {
        throw new Error("Round " + (index + 1) + " missing or failed");
      }
      const record = round.results.filter(item => item.url === url);
      if (record.length !== 1 || record[0].status !== "passed") {
        throw new Error("Expected exactly one passing " + url + " in round " + (index + 1));
      }
      readings.push(record[0]);
    }
    const metric = (getter) => summarizeSamples(readings.map((item, i) => {
      const value = getter(item);
      if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new Error("Invalid Lighthouse metric for " + route + " in round " + (i + 1));
      }
      return value;
    }));
    const versions = [...new Set(readings.map(item => item.lighthouseVersion))];
    if (versions.length !== 1 || !versions[0]) throw new Error("Lighthouse version mismatch on " + route);
    const modes = [...new Set(readings.map(item => item.simulatedThrottling))];
    if (modes.length !== 1 || modes[0] !== "simulate") throw new Error("Expected simulated mobile throttling on " + route);
    summaries.push({
      route, url, lighthouseVersion: versions[0], repeats: readings.length,
      performanceScore: metric(item => item.scores?.performance),
      largestContentfulPaintMs: metric(item => item.labMetrics?.largestContentfulPaint?.value),
      totalBlockingTimeMs: metric(item => item.labMetrics?.totalBlockingTime?.value),
      cumulativeLayoutShift: metric(item => item.labMetrics?.cumulativeLayoutShift),
      accessibilityScore: metric(item => item.scores?.accessibility),
      seoScore: metric(item => item.scores?.seo),
    });
  }
  return {
    kind: "repeated-public-mobile-lighthouse-lab",
    disclaimer: "Three repeat simulated mobile Lighthouse measurements per route on public production. Medians and min/max describe ONLY this GitHub Actions lab run; not field data, real-user INP, or a controlled causal comparison. Audit scores fluctuate with environment and network.",
    repetitionsPerRoute: rounds.length,
    routes: summaries,
  };
}
