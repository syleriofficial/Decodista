import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import ts from "typescript";

// Separate, additional synthetic challenge. No quality threshold: the report
// must expose weakness, not convert a green CI badge into a claim of accuracy.
const root = new URL("../", import.meta.url);
const [source, raw] = await Promise.all([
  readFile(new URL("lib/ai-tools-smart-finder.ts", root), "utf8"),
  readFile(new URL("scripts/fixtures/ai-tools-finder-challenge-40.json", root), "utf8"),
]);
const fixture = JSON.parse(raw);
assert.equal(fixture.version, 1);
assert.equal(fixture.cases.length, 40);
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { SMART_FINDER_TASK_IDS, matchSmartFinderTask } = await import(
  "data:text/javascript;base64," + Buffer.from(js).toString("base64")
);
const allowed = new Set(SMART_FINDER_TASK_IDS);
const ids = new Set();
const groups = {};
const mismatches = [];
for (const example of fixture.cases) {
  assert.equal(typeof example.id, "string");
  assert(!ids.has(example.id), "Duplicate test id " + example.id);
  ids.add(example.id);
  assert.equal(typeof example.request, "string");
  assert(example.request.length > 2 && example.request.length <= 220);
  assert(Array.isArray(example.expected) && example.expected.length <= 2);
  assert(example.expected.every(task => allowed.has(task)));
  const result = matchSmartFinderTask(example.request);
  assert(result.matchedTasks.length <= 2 && result.matchedTasks.every(task => allowed.has(task)));
  assert.equal(result.ambiguous, result.matchedTasks.length > 1);
  const got = [...result.matchedTasks].sort();
  const expected = [...example.expected].sort();
  const matched = JSON.stringify(expected) === JSON.stringify(got);
  const group = groups[example.group] ??= { count: 0, exact: 0 };
  group.count++;
  if (matched) group.exact++;
  else mismatches.push({ id: example.id, expected, got });
}
const count = fixture.cases.length;
const exact = count - mismatches.length;
const report = {
  kind: "separate-developer-authored-synthetic-challenge",
  caveat: "Developer-authored, non-representative synthetic queries. Not user traffic, a population accuracy estimate or independent blinded evaluation. Preserve fixture v1.",
  count,
  exact,
  exactMatchPercent: Number((100 * exact / count).toFixed(1)),
  byGroup: Object.fromEntries(Object.entries(groups).map(([group, x]) =>
    [group, { ...x, exactMatchPercent: Number((100 * x.exact / x.count).toFixed(1)) }])),
  mismatches,
};
const out = new URL("artifacts/ai-tools-qa/", root);
await mkdir(out, { recursive: true });
await writeFile(new URL("finder-challenge-40.json", out), JSON.stringify(report, null, 2) + "\n");
console.log("FINDER_FRESH_CHALLENGE_40 " + JSON.stringify(report));
test("Separate 40-case Finder challenge report is complete without quality-gating scores", () => {
  assert.equal(Object.values(groups).reduce((n, x) => n + x.count, 0), count);
  assert.equal(exact + mismatches.length, count);
  assert.equal(groups.abstain.count, 8);
  assert.equal(groups.mixed.count, 8);
});
