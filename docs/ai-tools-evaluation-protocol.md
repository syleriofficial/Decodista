# AI Tools: hands-on evaluation protocol

This is the **protocol for future independent testing**, not a claim that DECODISTA has already tested ChatGPT, Claude, Cursor or GitHub Copilot. Published comparisons currently interpret official documentation. Never turn visitors' self-entered ratings into DECODISTA scores.

## Set up a fair run

1. Select one of the editorial comparisons. Use its three fixed, first-party, fictional tasks from `lib/ai-tools-evaluation.ts` exactly as written. Do not put confidential customer files, credentials or unpublished repositories into third-party AI products.
2. Record the calendar date, each vendor's exact model, subscription tier, relevant integrations/tools allowed, and whether web search or code execution was enabled. Use comparable settings when possible, and disclose any non-equivalence.
3. Use clean conversations or isolated test branches so earlier memory/context does not advantage one system. Give the exact same task and the same time budget to both.
4. For writing tasks, independently verify the test's factual and format checklist. For coding tasks, inspect the diff and **run the supplied tests with a clean toolchain**; a model's statement that tests passed is not test evidence.
5. Record whether the first output passed, which corrections were required, and any blockers. Do not present a single result as a statistically meaningful performance difference.

## Reproducibility and rating

The reader worksheet uses a personal **1–5 subjective rating** for each provider and task:
- 1: misses the task
- 2: substantial failures
- 3: partially meets explicit criteria
- 4: mostly meets explicit criteria
- 5: fully meets explicit criteria

Scores default to **blank / untested** and are never prefilled. The interface displays no winner or aggregate vendor rating. Visitors' notes stay in transient component state, are **not collected or published**, and are cleared on reload. Visitors can download their own CSV to keep the task prompts, checklist, ratings and comments. The CSV escape routine guards against spreadsheet formula injection.

If DECODISTA later publishes hands-on results, keep the raw prompts, outputs, dates, model versions and executable tests where legally and ethically possible. Have a second reviewer score outcomes with the original checklist, document any disagreement, show limitations/sample size, explain whether access was paid or complimentary, and distinguish a tested observation from provider marketing.

## Publication gate

Do **not** attach a performance ranking, endorsement, winner badge, universal "best" claim, or current plan price to these articles merely because the interactive worksheet exists. A published result needs a dated, repeatable test record and independent review. For safety and fairness, do not automate account logins or infer product performance from public documentation. Product claims and pricing require the separate official-source review workflow.

Related files:
- `lib/ai-tools-comparison-guides.ts`: original source-linked editorial comparisons
- `lib/ai-tools-evaluation.ts`: fixed test prompts and expected checks
- `components/ai-comparison-evaluation.tsx`: optional visitor worksheet
- `scripts/test-ai-tools-browser.mjs`: UI interactions, CSV safety and privacy regression checks
