import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import ts from "typescript";

// Measurement-only evaluation against a frozen set of synthetic examples.
// Do NOT impose an accuracy pass threshold: this should reveal gaps, not hide them.
const root = new URL("../", import.meta.url);
const [matcherSource, rawFixture] = await Promise.all([
  readFile(new URL("lib/ai-tools-smart-finder.ts", root), "utf8"),
  readFile(new URL("scripts/fixtures/ai-tools-finder-holdout-100.json", root), "utf8"),
]);
const fixture = JSON.parse(rawFixture);
assert.equal(fixture.version, 1, "Unexpected evaluation-set version");
assert.equal(fixture.cases.length, 100, "Holdout v1 must remain a fixed 100 examples");

const compiled = ts.transpileModule(matcherSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { matchSmartFinderTask, SMART_FINDER_TASK_IDS } = await import(
  "data:text/javascript;base64," + Buffer.from(compiled).toString("base64")
);

const allowed = new Set(SMART_FINDER_TASK_IDS);
const usedIds = new Set();
const stats = {};
const mismatches = [];
let exact = 0;
let unsupportedFalsePositives = 0;
let unsupportedTotal = 0;
let mixedExact = 0;
let mixedTotal = 0;

for (const example of fixture.cases) {
  assert.equal(typeof example.id, "string");
  assert(!usedIds.has(example.id), "Duplicate example ID: " + example.id);
  usedIds.add(example.id);
  assert.equal(typeof example.request, "string");
  assert(example.request.length >= 3 && example.request.length <= 220,
    "Example must respect the Finder's input bound: " + example.id);
  assert(Array.isArray(example.expected) && example.expected.length <= 2);
  assert(example.expected.every(id => allowed.has(id)), "Unknown expected task " + example.id);
  assert.equal(new Set(example.expected).size, example.expected.length, "Duplicate expected task");

  const result = matchSmartFinderTask(example.request);
  assert(result.matchedTasks.length <= 2, "Finder must not return unlimited tasks");
  assert(result.matchedTasks.every(id => allowed.has(id)), "Unexpected task in " + example.id);
  assert.equal(new Set(result.matchedTasks).size, result.matchedTasks.length,
    "Finder must not return duplicate tasks");
  assert.equal(result.ambiguous, result.matchedTasks.length > 1, "Ambiguity flag inconsistent");

  const expected = [...example.expected].sort();
  const actual = [...result.matchedTasks].sort();
  const isMatch = JSON.stringify(expected) === JSON.stringify(actual);
  const group = stats[example.group] ??= { total: 0, exact: 0 };
  group.total++;
  if (isMatch) { exact++; group.exact++; }
  else mismatches.push({ id: example.id, expected, actual });

  if (example.group === "abstain") {
    unsupportedTotal++;
    if (actual.length > 0) unsupportedFalsePositives++;
  }
  if (example.group === "mixed") {
    mixedTotal++;
    if (isMatch) mixedExact++;
  }
}
const score = (num, den) => den ? Number((100 * num / den).toFixed(1)) : null;
const report = {
  kind: "frozen-new-synthetic-holdout",
  caveat: "Hand-written English stress tests, not statistically sampled users, a blinded external benchmark, or proof of real-world accuracy. Keep labels fixed for future versions.",
  count: fixture.cases.length,
  exactMatchCount: exact,
  exactMatchPercent: score(exact, fixture.cases.length),
  byGroup: Object.fromEntries(Object.entries(stats).map(([name, values]) => [name, {
    ...values, exactMatchPercent: score(values.exact, values.total),
  }])),
  unsupported: { total: unsupportedTotal, falsePositiveRecommendations: unsupportedFalsePositives },
  mixed: { total: mixedTotal, exactMatches: mixedExact },
  mismatches,
};
const outputDir = new URL("artifacts/ai-tools-qa/", root);
await mkdir(outputDir, { recursive: true });
await writeFile(new URL("finder-holdout.json", outputDir), JSON.stringify(report, null, 2) + "\n");
console.log("FINDER_NEW_HOLDOUT " + JSON.stringify(report));

test("100 frozen holdout requests produce a complete diagnostic report", () => {
  assert.equal(Object.values(stats).reduce((n, value) => n + value.total, 0), 100);
  assert.equal(exact + mismatches.length, 100);
  assert.equal(unsupportedTotal, 18);
  assert.equal(mixedTotal, 10);
  // Deliberately no score gate: CI success does not mean model quality is good.
});
