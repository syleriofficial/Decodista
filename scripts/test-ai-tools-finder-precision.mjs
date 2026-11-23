import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import ts from "typescript";

// Evaluates the actual production matcher without a browser, paid API or query telemetry.
// All test prompts are synthetic fixtures authored in this repository—not user searches.
const root = new URL("../", import.meta.url);
const [source, fixtureText] = await Promise.all([
  readFile(new URL("lib/ai-tools-smart-finder.ts", root), "utf8"),
  readFile(new URL("scripts/fixtures/ai-tools-finder-precision.json", root), "utf8"),
]);
const fixture = JSON.parse(fixtureText);
assert.equal(fixture.version, 1, "Unknown finder benchmark fixture version");
assert.equal(fixture.cases.length, 114, "Keep this baseline fixed; review intentional changes");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleUrl = "data:text/javascript;base64," + Buffer.from(compiled).toString("base64");
const { matchSmartFinderTask, SMART_FINDER_TASK_IDS } = await import(moduleUrl);
const known = new Set(SMART_FINDER_TASK_IDS);
const seen = new Set();

const failures = [];
const byGroup = {};
for (const item of fixture.cases) {
  assert.equal(typeof item.request, "string");
  assert(item.request.length >= 3 && item.request.length <= 220, "Invalid synthetic request: " + item.id);
  assert(!seen.has(item.id), "Duplicate benchmark case: " + item.id);
  seen.add(item.id);
  assert(Array.isArray(item.expected) && item.expected.length <= 2);
  for (const id of item.expected) assert(known.has(id), "Unknown expected task " + id);
  const result = matchSmartFinderTask(item.request);
  assert(Array.isArray(result.matchedTasks), "Missing matchedTasks for " + item.id);
  assert.equal(result.ambiguous, result.matchedTasks.length > 1, "Inconsistent ambiguous flag: " + item.id);
  assert(result.matchedTasks.every(id => known.has(id)), "Unapproved task returned for " + item.id);
  const expected = [...item.expected].sort();
  const actual = [...new Set(result.matchedTasks)].sort();
  const passed = JSON.stringify(expected) === JSON.stringify(actual);
  const group = byGroup[item.group] ??= { total: 0, passed: 0 };
  group.total++;
  if (passed) group.passed++;
  else failures.push({ id: item.id, expected, actual });
}
const passed = fixture.cases.length - failures.length;
const report = {
  kind: "hand-labeled-synthetic-regression",
  disclaimer: "Curated English examples only. Not actual search logs, field accuracy, coverage of all languages, provider capability testing or independent model benchmarking.",
  count: fixture.cases.length,
  passed,
  exactMatchPercent: Number((100 * passed / fixture.cases.length).toFixed(1)),
  byGroup: Object.fromEntries(Object.entries(byGroup).map(([name, x]) => [name, {
    ...x, exactMatchPercent: Number((100 * x.passed / x.total).toFixed(1)),
  }])),
  mismatches: failures,
};
await mkdir(new URL("artifacts/ai-tools-qa/", root), { recursive: true });
await writeFile(new URL("artifacts/ai-tools-qa/finder-precision.json", root), JSON.stringify(report, null, 2) + "\n");
console.log("FINDER_SYNTHETIC_PRECISION " + JSON.stringify(report));
test("Finder synthetic exact-match coverage with conservative unsupported handling", () => {
  assert.equal(byGroup.abstain.passed, byGroup.abstain.total,
    "Never recommend tools for the 20 unsupported synthetic requests");
  assert(byGroup.ambiguous.passed >= 8,
    "At least 8/10 synthetic multi-intent requests must request explicit user choice");
  assert(passed >= 109,
    "At least 109/114 exact synthetic matches required; inspect report and review expected labels rather than gaming thresholds");
});
