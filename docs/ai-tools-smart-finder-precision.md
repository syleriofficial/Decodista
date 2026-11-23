# Decodista Smart Finder — synthetic intent regression benchmark

**Scope:** `/ai-tools` product only. English-first task classification; no provider quality rankings, live capability tests, pricing verdicts or user text collection.

## Dataset and metric

- 114 *hand-authored synthetic* requests, labeled to one of eight existing supported tasks, an explicit two-task ambiguity, or no supported match.
- Counts: research 12, writing 12, coding 10, app building 10, visuals 10, video 10, voice 10, presentations 10, unsupported 20, ambiguous 10.
- Exact-match score: predicted set of zero, one, or two task IDs must equal the manually labeled set. Predicting two for a single task counts as wrong. Refusing an unsupported request counts as correct. Tool lists themselves are **not** independently verified by this benchmark.
- This is **not** measured accuracy on actual user traffic, a random population sample, a benchmark of providers, or evidence of performance in languages other than English. The data intentionally overlap with known regression cases, so a perfect fixture score must not be marketed as real-world accuracy.

## Diagnostic baseline and guarded improvement

| Version | Exact labeled cases | Mixed-intent cases | Unsupported cases |
| --- | --- | --- | --- |
| 2.2 before fixes (in-code exploratory evaluation) | 101/114 (88.6%) | 4/10 | 20/20 |
| 2.3 candidate (in-code exploratory evaluation) | 114/114 (100%) | 10/10 | 20/20 |

These numbers use **the same hand-labeled fixtures**, not independent holdout testing. The definitive CI score is from `npm run ai:finder:test`; compare its artifact with this diagnostic before claiming release readiness.

## CI contract

`npm run ai:finder:test` runs the current TypeScript matcher through TypeScript's transpiler, never hardcoded reimplementations. It records `artifacts/ai-tools-qa/finder-precision.json` and fails if:

- Any of the 20 unsupported inputs receive a recommendation.
- Fewer than 8 of 10 labeled dual-intent inputs request explicit choice.
- Fewer than 109 of 114 cases match their labeled task set.

Release checks run the suite automatically and upload the result. Browser QA separately checks tab state, privacy of typed text, and expected shortlist behavior at 1440px, 390px and 320px.

## Next quality milestone

Keep the fixture stable for regression checks. Collect **opt-in, non-sensitive, reviewed** real task examples only with appropriate user permission and privacy processes, and create a separate previously unseen evaluation set. Never transmit raw prompts as analytics by default. Audit false positives and ambiguous-intent misses before expanding the directory. Avoid changes to other site menus or blog content.

## New-request frozen synthetic evaluation (separate from regression set)

A **second, newly written 100-case English stress test** was frozen without changing the 2.3 production matcher. Run `npm run ai:finder:holdout` for a report at `artifacts/ai-tools-qa/finder-holdout.json`.

| Group | Exact matches |
| --- | ---: |
| Research | 5/9 |
| Writing | 3/9 |
| Coding | 6/9 |
| App building | 6/9 |
| Visuals | 6/9 |
| Video | 6/9 |
| Voice | 9/9 |
| Presentations | 8/9 |
| Unsupported / safe abstention | 15/18 |
| Mixed-intent (exact two tasks) | 6/10 |
| **Total** | **70/100 (70%)** |

### Failure types worth fixing next

- Specific paraphrases such as "Polish my cover letter", "Find trustworthy evidence", or "Pair program with me" are often not recognized.
- Some utility requests mentioning "PDF" are incorrectly routed to research, e.g. joining files, removing passwords and DOCX conversion.
- Several two-task requests return only one category, e.g. "Create an image and animate it into a clip".

**Interpretation:** Neither the regression score of 114/114 nor this 70/100 stress-test score estimates actual traffic accuracy. This is a developer-authored, distribution-unrepresentative holdout—not an independent human-labeled blind study. It is useful for exposing obvious generalization gaps only. Keep this version-1 fixture's original prompts and labels unchanged when making future matcher improvements, and report both scores without selectively discarding failures. Do not use the holdout results as an optimization target for the same version or claim the score is a statistically validated generalization rate.

The holdout test is **reporting-only**: CI fails if its file or output structure is broken, not if the accuracy is low. Never describe a green CI badge as an accuracy-quality PASS. Evaluating real-world quality would require a separately managed set of consented, privacy-reviewed, representative queries and independent labeling.
