import { readFileSync } from "node:fs";

const MS_PER_DAY = 86_400_000;
const MAX_AGE_DAYS = 30;
const sources = [
  { path: "lib/ai-tools-pricing.ts", key: "PRICING_CHECKED_ON" },
  { path: "lib/ai-tools-evidence.ts", key: "AI_EVIDENCE_CHECKED_ON" },
];

const today = new Date();
const todayUtcMidnight = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
let failed = false;

for (const source of sources) {
  const contents = readFileSync(source.path, "utf8");
  const found = contents.match(new RegExp("export const " + source.key + ' = "(\\d{4}-\\d{2}-\\d{2})"'));
  const date = found?.[1];
  if (!date) {
    console.error("Missing source review date:", source.path);
    failed = true;
    continue;
  }

  const parsed = new Date(date + "T00:00:00Z");
  const valid = Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
  if (!valid) {
    console.error("Invalid review date:", date, source.path);
    failed = true;
    continue;
  }

  const ageDays = Math.floor((todayUtcMidnight - parsed.getTime()) / MS_PER_DAY);
  console.log(source.path + ": last manually checked " + date + " (" + ageDays + " UTC days ago)");
  if (ageDays < 0 || ageDays > MAX_AGE_DAYS) {
    console.error("Source review needed:", source.path, "must be within 0–" + MAX_AGE_DAYS + " UTC days.");
    failed = true;
  }
}

if (failed) {
  console.error("AI Tools requires manual re-verification against provider websites. Do not update dates without checking sources.");
  process.exitCode = 1;
} else {
  console.log("AI Tools source timestamps are within the 30-day review window (not an automated accuracy guarantee).");
}
