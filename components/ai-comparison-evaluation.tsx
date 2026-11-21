"use client";

import { useState } from "react";
import { ClipboardCopy, Download, RotateCcw } from "lucide-react";
import type { EvaluationTask } from "@/lib/ai-tools-evaluation";

type Score = "" | "1" | "2" | "3" | "4" | "5";
type TaskResult = { first: Score; second: Score; notes: string };
type Field = keyof TaskResult;

function safeCsvCell(input: string) {
  // Keep locally entered notes from becoming spreadsheet formulas on import.
  const value = /^[\s\uFEFF]*[=+\-@]/.test(input) ? "'" + input : input;
  return '"' + value.replaceAll('"', '""') + '"';
}

const options: readonly { value: Score; label: string }[] = [
  { value: "", label: "Not rated" },
  { value: "1", label: "1 — Missed the task" },
  { value: "2", label: "2 — Significant gaps" },
  { value: "3", label: "3 — Partly met it" },
  { value: "4", label: "4 — Mostly met it" },
  { value: "5", label: "5 — Fully met it" },
];

export function AiComparisonEvaluation({
  guideSlug,
  firstName,
  secondName,
  tasks,
}: {
  guideSlug: string;
  firstName: string;
  secondName: string;
  tasks: readonly EvaluationTask[];
}) {
  const [results, setResults] = useState<Record<string, TaskResult>>({});
  const [copyStatus, setCopyStatus] = useState("");

  function update(taskId: string, field: Field, value: string) {
    setResults((previous) => {
      const existing = previous[taskId] ?? { first: "" as Score, second: "" as Score, notes: "" };
      return { ...previous, [taskId]: { ...existing, [field]: value } };
    });
  }

  async function copyPrompt(task: EvaluationTask) {
    try {
      await navigator.clipboard.writeText(task.prompt);
      setCopyStatus(task.id + ": copied");
    } catch {
      setCopyStatus(task.id + ": copy unavailable; select and copy the visible prompt instead");
    }
  }

  const paired = tasks.filter((task) => results[task.id]?.first && results[task.id]?.second).length;
  const hasEntries = tasks.some((task) => {
    const result = results[task.id];
    return Boolean(result?.first || result?.second || result?.notes.trim());
  });

  function exportCsv() {
    if (!hasEntries) return;
    const rows = [
      ["Comparison", "Task", "Prompt", "What to check", firstName + " score (1–5)", secondName + " score (1–5)", "Your notes"],
      ...tasks.map((task) => [
        guideSlug,
        task.title,
        task.prompt,
        task.checklist.join(" | "),
        results[task.id]?.first ?? "",
        results[task.id]?.second ?? "",
        results[task.id]?.notes ?? "",
      ]),
    ];
    const csv = "\uFEFF" + rows.map((row) => row.map((value) => safeCsvCell(value)).join(",")).join("\r\n");
    const objectUrl = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = "decodista-" + guideSlug + "-my-test-results.csv";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }

  function clearAll() {
    if (hasEntries && !window.confirm("Clear your unsaved ratings and notes?")) return;
    setResults({});
    setCopyStatus("");
  }

  return (
    <section id="test-it-yourself" className="ai-guide-section ai-guide-self-test" aria-labelledby="ai-guide-self-test-heading">
      <span className="ai-tools-eyebrow">07 / Independent test worksheet</span>
      <h2 id="ai-guide-self-test-heading">Run the same tasks in both tools</h2>
      <p>
        This is a practical worksheet, not a DECODISTA benchmark. Copy each fictional task
        into both products using comparable plans and settings. Inspect the actual outputs
        against the checks below, then enter <strong>your own</strong> observations.
      </p>
      <div className="ai-guide-test-steps">
        <ol>
          <li>Use the same prompt, source text, task instructions and available time in both products.</li>
          <li>Record the model, plan and date in your notes. Check errors independently; do not trust either model to grade itself.</li>
          <li>Rate only completed runs. Repeat on multiple tasks before making a purchase decision.</li>
        </ol>
      </div>
      <div className="ai-guide-test-rubric">
        <strong>Rating rubric</strong>
        <p>1 = misses the task, 3 = partially meets it, 5 = fully meets it. Use 2 and 4 for results in between. Blank means untested. Scores are private notes you provide—not site-generated results or objective model-quality measurements.</p>
      </div>

      <div className="ai-guide-test-cases">
        {tasks.map((task) => {
          const current = results[task.id] ?? { first: "" as Score, second: "" as Score, notes: "" };
          return (
            <article className="ai-guide-test-case" key={task.id}>
              <div className="ai-guide-test-case-head">
                <div>
                  <span className="ai-tools-eyebrow">Repeatable scenario</span>
                  <h3>{task.title}</h3>
                  <p>{task.aim}</p>
                </div>
                <button type="button" className="ai-guide-test-copy" onClick={() => copyPrompt(task)}>
                  <ClipboardCopy size={16} aria-hidden="true" /> Copy prompt
                </button>
              </div>
              <details className="ai-guide-test-prompt">
                <summary>Read the exact test prompt</summary>
                <pre>{task.prompt}</pre>
              </details>
              <div className="ai-guide-test-checklist">
                <strong>Check the actual outputs against:</strong>
                <ul>{task.checklist.map((point) => <li key={point}>{point}</li>)}</ul>
              </div>
              <div className="ai-guide-test-rating">
                <label>
                  {firstName} — your score
                  <select
                    aria-label={firstName + " score for " + task.title}
                    value={current.first}
                    onChange={(event) => update(task.id, "first", event.target.value)}
                  >
                    {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </label>
                <label>
                  {secondName} — your score
                  <select
                    aria-label={secondName + " score for " + task.title}
                    value={current.second}
                    onChange={(event) => update(task.id, "second", event.target.value)}
                  >
                    {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </label>
              </div>
              <label className="ai-guide-test-notes">
                Notes, correction effort, model and plan
                <textarea
                  value={current.notes}
                  onChange={(event) => update(task.id, "notes", event.target.value)}
                  placeholder="What worked, what failed, and which model/plan did you test?"
                  rows={3}
                  maxLength={1500}
                />
              </label>
            </article>
          );
        })}
      </div>
      <div className="ai-guide-test-actions">
        <div className="ai-guide-test-progress" role="status">
          <strong>{paired} of {tasks.length}</strong> scenarios rated for both tools.
          <span>Unrated scenarios are not counted. No winner or provider ranking is inferred.</span>
        </div>
        <div className="ai-guide-test-buttons">
          <button type="button" onClick={exportCsv} disabled={!hasEntries}>
            <Download size={17} aria-hidden="true" /> Export my results (CSV)
          </button>
          <button type="button" className="ai-guide-test-clear" onClick={clearAll} disabled={!hasEntries}>
            <RotateCcw size={16} aria-hidden="true" /> Clear
          </button>
        </div>
      </div>
      <p className="ai-guide-test-privacy">
        Privacy: inputs stay in this page's temporary memory. We do not ask you to sign in,
        submit results to DECODISTA, or upload proprietary files. Nothing is saved between
        reloads; export your CSV before leaving. Do not paste secrets or personal data into test tools.
      </p>
      <p className="ai-guide-test-copy-status" aria-live="polite">{copyStatus ? copyStatus.split(": ")[1] : ""}</p>
    </section>
  );
}
