import assert from "node:assert/strict";
import test from "node:test";
import { auditTrialPacket, trialTemplate } from "./verify-ai-tool-trial.mjs";

const FIXED_NOW = new Date("2026-11-21T12:00:00.000Z");

function syntheticPacket(guideSlug = "chatgpt-vs-claude", taskId = "source-accuracy") {
  // Synthetic structure-only test data. This is NOT an output from any AI provider.
  const packet = trialTemplate(guideSlug, taskId);
  packet.testedOn = "2026-11-21";
  packet.testedBy = "internal-fixture-tester";
  packet.conditions.comparableConditions = true;
  packet.conditions.differences = "Synthetic schema test fixture, no real model accessed or product tested.";
  packet.runs = packet.runs.map((run) => ({
    ...run,
    model: "synthetic-test-fixture",
    plan: "fixture-only",
    ranAt: "2026-11-21T10:00:00Z",
    originalOutput: "SYNTHETIC PLACEHOLDER. This is only a unit-test text to validate structured packet fields; it is not a response from any named AI provider.",
    testerNotes: "In-memory fixture; no provider contacted, no independent experiment run.",
  }));
  packet.independentReview.reviewerAlias = "internal-fixture-reviewer";
  packet.independentReview.reviewedOn = "2026-11-21";
  packet.independentReview.criteria = packet.independentReview.criteria.map((item) => ({
    ...item,
    observations: Object.fromEntries(Object.keys(item.observations).map((slug) =>
      [slug, { met: false, explanation: "Synthetic fixture review only; there are no real outputs to grade." }])
    ),
  }));
  packet.disclosure.access = "other";
  packet.disclosure.limitations = "STRUCTURE-ONLY UNIT TEST: no vendor interaction, no real review and no publication. This checks schema completeness, nothing more.";
  return packet;
}

test("creates blank, non-published templates with exact task prompt hash", () => {
  const packet = trialTemplate("chatgpt-vs-claude", "source-accuracy");
  assert.equal(packet.schemaVersion, 1);
  assert.match(packet.promptSha256, /^[a-f0-9]{64}$/);
  assert.deepEqual(packet.runs.map((item) => item.toolSlug), ["chatgpt", "claude"]);
  assert(packet.runs.every((item) => item.originalOutput === ""));
  const result = auditTrialPacket(packet, FIXED_NOW);
  assert.equal(result.valid, false, "Blank templates must not be accepted as verified evidence");
  assert(result.errors.length >= 6);
});

test("validates only structural completeness; synthetic fixture cannot imply real benchmarking", () => {
  const packet = syntheticPacket();
  const result = auditTrialPacket(packet, FIXED_NOW);
  assert.deepEqual(result.errors, []);
  assert.equal(result.valid, true);
  assert.equal(result.summary.checkedCriteria, 4);
  assert.equal(result.summary.recordedToolSlugs.length, 2);
  assert.equal(result.summary.guideSlug, "chatgpt-vs-claude");
});

test("rejects fabricated/mismatched prompt, duplicate providers and future dates", () => {
  const packet = syntheticPacket("cursor-vs-github-copilot", "bug-fix");
  packet.promptSha256 = "a".repeat(64);
  packet.runs[1].toolSlug = "cursor";
  packet.testedOn = "2027-11-21";
  const errors = auditTrialPacket(packet, FIXED_NOW).errors.join(" ");
  assert.match(errors, /promptSha256/);
  assert.match(errors, /one record for each/);
  assert.match(errors, /testedOn/);
});

test("rejects incomplete evidence, absent review and identical tester/reviewer", () => {
  const packet = syntheticPacket();
  packet.runs[0].originalOutput = "Too short";
  packet.independentReview.reviewerAlias = packet.testedBy;
  packet.independentReview.criteria[0].observations.chatgpt.met = null;
  packet.independentReview.criteria[1].observations.claude.explanation = "x";
  const errors = auditTrialPacket(packet, FIXED_NOW).errors.join(" ");
  assert.match(errors, /original raw output/);
  assert.match(errors, /same alias/);
  assert.match(errors, /mark each criterion/);
  assert.match(errors, /specific evidence explanation/);
});

test("rejects unsupported winner/ranking fields and unrecorded access differences", () => {
  const packet = syntheticPacket();
  packet.winner = "chatgpt";
  packet.conditions.samePrompt = false;
  packet.conditions.differences = "";
  packet.disclosure.access = "unknown";
  const errors = auditTrialPacket(packet, FIXED_NOW).errors.join(" ");
  assert.match(errors, /unsupported winner/);
  assert.match(errors, /identical published prompt/);
  assert.match(errors, /comparability limitations/);
  assert.match(errors, /financial access terms/);
});

test("supports all six published tasks and refuses unknown task IDs", () => {
  const all = [
    ["chatgpt-vs-claude", "source-accuracy"],
    ["chatgpt-vs-claude", "writing-constraints"],
    ["chatgpt-vs-claude", "planning-constraints"],
    ["cursor-vs-github-copilot", "typed-function"],
    ["cursor-vs-github-copilot", "bug-fix"],
    ["cursor-vs-github-copilot", "review-changes"],
  ];
  for (const [guide, task] of all) {
    const packet = syntheticPacket(guide, task);
    assert.equal(auditTrialPacket(packet, FIXED_NOW).valid, true, guide + "/" + task);
  }
  assert.throws(() => trialTemplate("chatgpt-vs-claude", "nonexistent"), /Unknown guide\/task/);
});
