// CDP Performance trace parsing. Anonymous, public-page measurements only.
// Long-task sums are observational proxies, NOT Lighthouse simulated TBT.
export function safeUrl(value) {
  if (typeof value !== "string") return value;
  if (!/^https?:\/\//i.test(value)) return value;
  try {
    const url = new URL(value);
    return url.origin + url.pathname;
  } catch {
    return "[invalid-url]";
  }
}

export function sanitizeTrace(value, depth = 0) {
  if (depth > 30) throw new Error("Unexpected deep CDP trace object");
  if (typeof value === "string") return safeUrl(value);
  if (Array.isArray(value)) return value.map(item => sanitizeTrace(item, depth + 1));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, sanitizeTrace(item, depth + 1)])
    );
  }
  return value;
}

export function summarizeTraceEvents(traceEvents) {
  if (!Array.isArray(traceEvents) || !traceEvents.length) {
    throw new Error("Chrome CDP tracing yielded no events");
  }
  const rendererThreads = new Set();
  for (const e of traceEvents) {
    if (e.name === "thread_name" && e.ph === "M" &&
        /^(?:CrRendererMain|RendererMain)$/.test(e.args?.name ?? "")) {
      rendererThreads.add(String(e.pid) + ":" + String(e.tid));
    }
  }
  if (!rendererThreads.size) {
    throw new Error("No renderer main thread found in Chrome trace");
  }
  const mainEvents = traceEvents.filter(
    e => rendererThreads.has(String(e.pid) + ":" + String(e.tid)) &&
      typeof e.dur === "number" && e.dur >= 0
  );
  const tasks = mainEvents.filter(e => e.name === "RunTask");
  const long = tasks.filter(e => e.dur >= 50000);
  const scripts = mainEvents.filter(e => e.name === "EvaluateScript" || e.name === "FunctionCall");
  const source = e => safeUrl(e.args?.data?.url ?? e.args?.data?.scriptName ?? "unknown");
  return {
    traceEventCount: traceEvents.length,
    rendererThreadCount: rendererThreads.size,
    rendererMainEventCount: mainEvents.length,
    rendererTaskCount: tasks.length,
    rendererTaskOver50msCount: long.length,
    rendererTaskOver50msSumExcessMs: Number(
      long.reduce((sum, e) => sum + (e.dur - 50000) / 1000, 0).toFixed(1)
    ),
    longestRendererTasksMs: long.map(e => Number((e.dur / 1000).toFixed(1)))
      .sort((a, b) => b - a).slice(0, 5),
    longestScriptEvents: scripts.sort((a, b) => b.dur - a.dur).slice(0, 5)
      .map(e => ({ kind: e.name, durationMs: Number((e.dur / 1000).toFixed(1)), source: source(e) })),
  };
}

export function classifyControlledRuns(runs) {
  if (!Array.isArray(runs) || runs.length !== 8) {
    throw new Error("Exactly eight alternating public-page traces are required");
  }
  const byRoute = {};
  for (const run of runs) {
    if (!["/ai-tools", "/ai-tools/compare"].includes(run.route)) {
      throw new Error("Unexpected route in lab");
    }
    if (!Number.isFinite(run.cpuThrottlingRate) || run.cpuThrottlingRate !== 4) {
      throw new Error("CPU throttling configuration changed");
    }
    if (!Number.isFinite(run.networkResourceCount) || run.networkResourceCount < 0) {
      throw new Error("Missing network count");
    }
    if (!Number.isFinite(run.pageLongTaskProxyMs) || run.pageLongTaskProxyMs < 0 ||
        !run.traceSummary || !Number.isFinite(run.traceSummary.rendererTaskOver50msSumExcessMs)) {
      throw new Error("Missing trace task evidence");
    }
    (byRoute[run.route] ??= []).push(run);
  }
  if (byRoute["/ai-tools"]?.length !== 4 || byRoute["/ai-tools/compare"]?.length !== 4) {
    throw new Error("Require four Finder and four Compare traces");
  }
  const summary = Object.fromEntries(Object.entries(byRoute).map(([route, items]) => {
    const med = values => {
      const sorted = [...values].sort((a, b) => a - b);
      return Number(((sorted[1] + sorted[2]) / 2).toFixed(1));
    };
    const distribution = key => ({
      values: items.map(x => x[key]),
      median: med(items.map(x => x[key])),
      min: Math.min(...items.map(x => x[key])),
      max: Math.max(...items.map(x => x[key])),
    });
    return [route, {
      runs: items.length,
      pageLongTaskProxyMs: distribution("pageLongTaskProxyMs"),
      networkResourceCount: distribution("networkResourceCount"),
      rendererTaskProxyMs: {
        values: items.map(x => x.traceSummary.rendererTaskOver50msSumExcessMs),
        median: med(items.map(x => x.traceSummary.rendererTaskOver50msSumExcessMs)),
      },
    }];
  }));
  return summary;
}
