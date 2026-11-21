#!/usr/bin/env node
/**
 * Private editorial evidence packet auditor.
 * Structural verification only: it cannot prove that a provider generated
 * a response, that a reviewer is independent, or that a score is accurate.
 * Never publish a result solely because this command passes.
 */
import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const CRITERIA_PATH = fileURLToPath(new URL("../lib/ai-tools-evaluation.ts", import.meta.url));
const PAIRS = {
  "chatgpt-vs-claude": ["chatgpt", "claude"],
  "cursor-vs-github-copilot": ["cursor", "github-copilot"],
};
const MAX_PACKET_BYTES = 1024 * 1024;

function canonicalTasks() {
  // The task inventory is JSON written verbatim into our TS source.
  // Parsing the JSON (rather than evaluating TypeScript) is deliberate.
  const content = readFileSync(CRITERIA_PATH, "utf8");
  const found = content.match(/export const AI_EVALUATION_TASKS:[^\n]+ = (\{[\s\S]*?\});\s*export function getAiEvaluationTasks/);
  if (!found) throw new Error("Could not read canonical first-party evaluation tasks");
  return JSON.parse(found[1]);
}

const TASKS = canonicalTasks();
function digest(input) {
  return createHash("sha256").update(input, "utf8").digest("hex");
}
function textAtLeast(value, chars) {
  return typeof value === "string" && value.trim().length >= chars;
}
function isIsoDay(value, today) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(value + "T00:00:00Z");
  return !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value &&
    parsed.getTime() <= Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
}
function isIsoInstant(value, today) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value)) return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString() !== "Invalid Date" &&
    parsed.getTime() <= today.getTime();
}
function hasProperties(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function trialTemplate(guideSlug, taskId) {
  const task = TASKS[guideSlug]?.find((entry) => entry.id === taskId);
  const pair = PAIRS[guideSlug];
  if (!task || !pair) throw new Error("Unknown guide/task. Use one of the six published test scenarios.");
  const observations = Object.fromEntries(pair.map((slug) => [
    slug, { met: null, explanation: "" },
  ]));
  return {
    schemaVersion: 1,
    guideSlug,
    taskId,
    testedOn: "",
    promptSha256: digest(task.prompt),
    testedBy: "",
    conditions: {
      samePrompt: true,
      timeBudgetMinutes: 15,
      comparableConditions: false,
      differences: "Describe search, tools, files, model access and other unavoidable differences.",
    },
    runs: pair.map((toolSlug) => ({
      toolSlug,
      model: "",
      plan: "",
      ranAt: "",
      originalOutput: "",
      testerNotes: "",
    })),
    independentReview: {
      reviewerAlias: "",
      reviewedOn: "",
      criteria: task.checklist.map((requirement) => ({
        requirement,
        observations: structuredClone(observations),
      })),
    },
    disclosure: {
      access: "",
      limitations: "",
    },
  };
}

export function auditTrialPacket(packet, today = new Date()) {
  const errors = [];
  const requireThat = (condition, message) => { if (!condition) errors.push(message); };
  if (!hasProperties(packet)) return { valid: false, errors: ["Packet must be an object"], summary: null };
  requireThat(packet.schemaVersion === 1, "schemaVersion must equal 1");
  const pair = PAIRS[packet.guideSlug];
  const task = TASKS[packet.guideSlug]?.find((entry) => entry.id === packet.taskId);
  requireThat(Boolean(pair && task), "guideSlug/taskId must match a published DECODISTA scenario");
  if (!pair || !task) return { valid: false, errors, summary: null };

  requireThat(isIsoDay(packet.testedOn, today), "testedOn must be a valid, nonfuture YYYY-MM-DD");
  requireThat(packet.promptSha256 === digest(task.prompt), "promptSha256 does not match the exact published task prompt");
  requireThat(textAtLeast(packet.testedBy, 2), "testedBy needs a tester alias");
  requireThat(hasProperties(packet.conditions), "conditions must be an object");
  if (hasProperties(packet.conditions)) {
    requireThat(packet.conditions.samePrompt === true, "Both products must receive the identical published prompt");
    requireThat(Number.isInteger(packet.conditions.timeBudgetMinutes) &&
      packet.conditions.timeBudgetMinutes >= 1 && packet.conditions.timeBudgetMinutes <= 240,
      "timeBudgetMinutes must be an integer between 1 and 240");
    requireThat(typeof packet.conditions.comparableConditions === "boolean",
      "comparableConditions must be true or false");
    requireThat(textAtLeast(packet.conditions.differences, 30),
      "Describe tool/model/plan access and comparability limitations in conditions.differences");
  }

  requireThat(Array.isArray(packet.runs) && packet.runs.length === 2,
    "runs must contain exactly two provider output records");
  if (Array.isArray(packet.runs)) {
    requireThat(pair.every((slug) => packet.runs.filter((run) => run?.toolSlug === slug).length === 1),
      "runs must include one record for each original comparison tool, without duplicates");
    for (const run of packet.runs) {
      if (!hasProperties(run)) { errors.push("Each run must be an object"); continue; }
      const label = "runs." + String(run.toolSlug);
      requireThat(pair.includes(run.toolSlug), label + ": toolSlug must match this comparison");
      requireThat(textAtLeast(run.model, 2), label + ": record the exact model name/version");
      requireThat(textAtLeast(run.plan, 2), label + ": record the subscription or access plan");
      requireThat(isIsoInstant(run.ranAt, today), label + ": ranAt must be a nonfuture UTC ISO timestamp");
      requireThat(textAtLeast(run.originalOutput, 50), label + ": keep the original raw output (50+ chars)");
      requireThat(textAtLeast(run.testerNotes, 20), label + ": describe observed tool settings and execution context");
    }
  }

  const review = packet.independentReview;
  requireThat(hasProperties(review), "independentReview must be an object");
  if (hasProperties(review)) {
    requireThat(textAtLeast(review.reviewerAlias, 2), "independentReview.reviewerAlias is required");
    requireThat(review.reviewerAlias !== packet.testedBy, "Independent reviewer cannot have the same alias as the tester");
    requireThat(isIsoDay(review.reviewedOn, today), "Independent review needs a valid, nonfuture YYYY-MM-DD");
    requireThat(Array.isArray(review.criteria) && review.criteria.length === task.checklist.length,
      "Review must cover every published checklist requirement exactly once");
    if (Array.isArray(review.criteria)) {
      for (const requirement of task.checklist) {
        const matches = review.criteria.filter((entry) => entry?.requirement === requirement);
        requireThat(matches.length === 1, "Missing or repeated review criterion: " + requirement);
        if (matches.length !== 1) continue;
        const observations = matches[0].observations;
        requireThat(hasProperties(observations), "Criterion observations must be a keyed object");
        if (!hasProperties(observations)) continue;
        for (const slug of pair) {
          const observation = observations[slug];
          requireThat(hasProperties(observation) && typeof observation.met === "boolean",
            "Independent review must mark each criterion true or false for " + slug);
          requireThat(hasProperties(observation) && textAtLeast(observation.explanation, 20),
            "Independent review needs a specific evidence explanation for " + slug);
        }
      }
    }
  }

  requireThat(hasProperties(packet.disclosure), "disclosure must describe access and limitations");
  if (hasProperties(packet.disclosure)) {
    requireThat(["self-funded", "complimentary-access", "sponsored", "free-plan", "other"].includes(packet.disclosure.access),
      "disclosure.access must identify financial access terms");
    requireThat(textAtLeast(packet.disclosure.limitations, 50),
      "disclosure.limitations must explain important scope, environment and sample-size limitations (50+ chars)");
  }
  requireThat(!("winner" in packet) && !("overallScore" in packet) && !("ranking" in packet),
    "Evidence packet must not contain an unsupported winner, overallScore or ranking");
  return {
    valid: errors.length === 0,
    errors,
    summary: {
      guideSlug: packet.guideSlug,
      taskId: packet.taskId,
      checkedCriteria: task.checklist.length,
      recordedToolSlugs: pair,
    },
  };
}

function usage() {
  return "Usage:\n  node scripts/verify-ai-tool-trial.mjs --template <guide-slug> <task-id>\n  node scripts/verify-ai-tool-trial.mjs <private-json-file>\n\nThis checks structural evidence only. It is NOT proof a model actually produced those outputs.";
}

if (process.argv[1] && resolve(process.argv[1]) === SCRIPT_PATH) {
  try {
    const args = process.argv.slice(2);
    if (args[0] === "--template" && args.length === 3) {
      process.stdout.write(JSON.stringify(trialTemplate(args[1], args[2]), null, 2) + "\n");
    } else if (args.length === 1 && args[0] !== "--template") {
      const inputPath = resolve(args[0]);
      if (statSync(inputPath).size > MAX_PACKET_BYTES) throw new Error("Packet exceeds 1 MiB limit");
      const packet = JSON.parse(readFileSync(inputPath, "utf8"));
      const result = auditTrialPacket(packet);
      if (!result.valid) {
        process.stderr.write("Evidence packet incomplete:\n- " + result.errors.join("\n- ") + "\n");
        process.exitCode = 1;
      } else {
        process.stdout.write("Packet structurally complete for " + result.summary.guideSlug +
          " / " + result.summary.taskId + ". This does NOT verify provenance, accuracy, reviewer independence or permission to publish.\n");
      }
    } else {
      process.stderr.write(usage() + "\n");
      process.exitCode = 2;
    }
  } catch (error) {
    process.stderr.write("Evidence audit error: " + String(error.message ?? error) + "\n");
    process.exitCode = 1;
  }
}
