# Decodista AI Tools — repeatable mobile performance and real-user validation

## What is measured

This is a **diagnostic-only** performance study for `/ai-tools` and `/ai-tools/compare`. It does not modify the UI or Smart Finder matcher. It runs the existing Lighthouse 13.6 simulated mobile audit **three times per route** on the deployed site, alternating route order. Every raw report is retained alongside `artifacts/ai-tools-performance/summary.json`, which records the median, minimum, maximum and original samples for each route's:

- Performance score (0–100)
- Largest Contentful Paint (lab ms)
- Total Blocking Time (lab ms)
- Cumulative Layout Shift (lab)
- Accessibility and SEO scores

The script refuses missing, failed, incompatible or incomplete measurements. A green workflow means all audits and report checks completed; it **does not guarantee a particular performance score**.

### Running

On GitHub, run **AI Tools repeated mobile Lighthouse lab** with `workflow_dispatch`. The same workflow also runs after a push to `main` that changes AI Tools UI or the measurement scripts. For pull requests that edit the lab scripts, only the statistics unit tests run: measuring public production in a PR would not measure unmerged code. For production runs, the workflow first waits for the **matching commit's successful Cloudflare Workers build**.

The command `npm run ai:performance:stats:test` verifies median calculations, three-run completeness, failed audits, version consistency and simulated-throttling metadata. The command `npm run ai:performance:repeat` runs the three production repeats and requires Chrome and globally installed `lighthouse@13.6.0`; do not run this repeatedly from arbitrary hosts while diagnosing changing deployment versions.

### Reading results responsibly

A single simulated Lighthouse score fluctuates. Earlier `/ai-tools` examples on successive deployments included performance scores 98 and 93, with a TBT reading of 312 ms in one run. Neither alone establishes a speed regression or improvement. Compare the median and range from repeat audits before prioritizing optimization, and use controlled same-version before/after measurements before attributing differences to changes. These values are NOT CrUX p75 field LCP, CLS, INP or actual phone measurements. Avoid using a single score as proof of real-world performance.

### Measuring actual usefulness without collecting private requests

Browser QA already exercises task examples, no-match handling, app-building and visual intent, 16 source-linked directory entries, compare/alternatives and privacy consent states. These checks are **functionality tests**, not a user study.

To evaluate *user success* separately, first recruit a small, consented sample of test participants, have them perform realistic supported tasks without showing them suggestions first, and have an independent reviewer record only aggregate completion and time-to-task for the existing flows (Finder → source-backed shortlist → tool profile/compare), along with harmless task IDs and explicit consent. Keep their original free-text inputs out of analytics and study exports. For unsupported requests, judge whether the interface declines to recommend tools instead of making up results. Include mobile participants and accessibility testing. A representative field-quality estimate will still require more varied participants and independently labeled tasks.

The site sends certain **opt-in, pre-defined intent events**, but that is not enough to claim successful task completion. Without access to relevant live GA4 consented data, no event counts or real-user success rates are claimed. The site should not enable new query collection to run this performance test.

## Scope

Only AI Tools diagnostics, test scripts, documentation and GitHub Actions workflow are changed here. No new articles, SEO index-policy change, paid AI requests, Finder prompt collection, tool rankings or other site menus.

## 658 ms TBT anomaly — source-evidence audit (23 November 2026 UTC)

We inspected the archived **original** Lighthouse 13.6 JSON files, not only the score summary, for [matching-commit GitHub Actions run 45280623708](https://github.com/syleriofficial/Decodista/actions/runs/45280623708). All results refer to public production commit `e21edb91377774b7fa64dc03d01ae72b2a4f9a83`.

| Raw Lighthouse evidence — `/ai-tools` | Round 1 | Round 2 | Round 3 |
| --- | ---: | ---: | ---: |
| Performance score | 83 | 100 | 100 |
| Total Blocking Time | **658.4 ms** | 0 ms | 0 ms |
| CPU benchmark index (higher is faster) | **2,876.5** | 4,374.5 | 4,435 |
| Main-thread work | **2,373.1 ms** | 491.5 ms | 642.6 ms |
| JS bootup | **790.3 ms** | 136.8 ms | 155.2 ms |
| Script-evaluation work | **789.1 ms** | 146.1 ms | 161.1 ms |
| Framework chunk scripting | **537.6 ms** | 100.3 ms | 118.2 ms |
| Long tasks captured by Lighthouse | 7 | 1 | 2 |
| Network request count | 23 | 23 | 23 |

Crucially, the **`/ai-tools/compare` page in those same three rounds** showed CPU benchmark indices of **4,255.5, 4,108 and 4,175.5** with **0 ms TBT in every run**. Lower CPU capacity was **not** a persistent condition across all pages in the first round. Temporary browser/CPU contention or page-specific execution may be contributors, but a single three-run audit cannot distinguish or prove a root cause. The unusually slow first round also attributed some scripting to Cloudflare's beacon, but its appearance is **not** evidence the beacon caused the 658 ms blocking.

The archived request count was identical, and the framework bundle URL was the same in all three Finder runs. There is no evidence here of a newly injected script, a changed Finder task matcher or a deploy-to-deploy performance regression. This is a **within-commit variance** observation. The fixed score is neither a user-success measure nor a field Core Web Vitals result.

### Automatic evidence for future repeat audits

The new `scripts/lib/ai-tools-lighthouse-diagnostics.mjs` reads each original Lighthouse JSON and adds a `diagnostics` section to the existing repeated-lab summary. It records sanitized script source names (no URL query strings), per-round CPU index, TBT, main-thread and script-bootup times, long-task counts and top task/script entries for both Finder and Compare. Three explanatory **attention flags** call out >200 ms TBT spread, >20% CPU index spread or main-thread work >2× its median. Flags request investigation; they are not automated evidence of causation.

The additional unit tests reject missing raw evidence, unexpected origins/routes, non-mobile settings and invalid metrics, and verify source URL sanitization. This PR changes **only diagnostics, documentation, tests and CI**; it intentionally does not remove Cloudflare analytics, change React hydration, alter Smart Finder functionality or assert a speed improvement.

**Next meaningful action** is to repeat the audit on a stable, controlled machine under comparable conditions and inspect the affected Chrome trace. Only optimize the page after a source-specific bottleneck is reproducible. Consider field data from consented analytics if available; the connected analytics provider was unavailable during this analysis.

## Chrome DevTools trace follow-up — isolated *within one hosted runner*, not a dedicated machine

Two previous three-repeat Lighthouse runs showed outlier TBT on the Finder route (658 ms in one audit, 317 ms in another) alongside lower Chrome CPU benchmark indices. The Compare route did not show a similar spike in those runs. This association alone cannot distinguish site code, runner contention, cold-start effects or tracing overhead.

The dedicated workflow `AI Tools Chrome Performance trace audit` navigates anonymous public Finder and Compare pages **eight times** in this ABBA / BAAB order, with four runs for each route, on **one GitHub-hosted Ubuntu 24.04 runner and one Chrome browser instance**. A new browser context is used per navigation, with 390×844 mobile viewport emulation and Chrome DevTools Protocol CPU throttling set to 4×, without network throttling or form entry. No user searches or authenticated data are collected.

Using CDP `Tracing.start` and `ReturnAsStream`, it writes eight gzip-compressed, query-stripped Chrome Performance traces and a machine-readable `summary.json`. The report separates renderer-main-thread tasks, script event duration, in-page PerformanceObserver long tasks, CPU-throttled CDP ScriptDuration, and resource count; it also saves actual Chrome version. The raw traces are **temporary GitHub Actions artifacts, retained for three days**, and are not embedded in the site or sent to web analytics.

**Interpretation:** The sum of event durations above 50 ms is a *Chrome trace blocking proxy*, not Lighthouse's simulated Total Blocking Time and not Core Web Vitals INP. Tracing incurs overhead; 4× CDP slowdown is not identical to Lighthouse's simulated mobile throttling. Shared GitHub-hosted runners are not dedicated or guaranteed CPU-stable, even within one job. Comparing Finder and Compare in the same process is more controlled than comparing unrelated CI runs, but does **not** establish a root cause. If long tasks are reproducible, inspect the individual trace in Chrome Performance tools before proposing a specific JavaScript, framework hydration, caching or third-party optimization.

On a pull request, the workflow runs the new instrumented script against the **currently public production website**, not the unmerged PR. After merge, it first verifies the matching Cloudflare build. A separate pure unit test verifies trace parsing and URL-query sanitization and is included in `npm run release:check`. This is strictly diagnostics-only: the website's UI, Finder behavior, analytics setup and content remain unchanged.

### First same-runner trace experiment — 27 November 2026

The initial PR-run experiment recorded eight Chrome 158.0.8127.36 CDP traces on one runner using 4× CPU throttling (no network throttling). In these **anonymous, trace-instrumented public-page** visits:

| Order / route | Chrome main renderer scheduler tasks above 50 ms, excess duration | In-page longtask observer excess |
| --- | ---: | ---: |
| 1 · Finder | **366.3 ms** | **148 ms** |
| 2 · Compare | 76.0 ms | 32 ms |
| 3 · Compare | 27.1 ms | 12 ms |
| 4 · Finder | 85.8 ms | 14 ms |
| 5 · Compare | 50.9 ms | 14 ms |
| 6 · Finder | 98.2 ms | 19 ms |
| 7 · Finder | 47.9 ms | 17 ms |
| 8 · Compare | 32.3 ms | 12 ms |

The two excess-duration methods **do not measure the same event set or window** and must never be labeled Lighthouse TBT. The Chrome DevTools trace showed seven renderer scheduler tasks above 50 ms on the first Finder visit, compared with only two or three on the later visits; its longest was 205.8 ms. The script-duration CDP performance metric was 0.383 seconds on that visit and approximately 0.187–0.195 seconds on later Finder visits. Network-resource counts remained constant by route (22 Finder, 20 Compare).

**Parser correction:** Chrome 158 names its renderer scheduler event `ThreadControllerImpl::RunTask`, not simply `RunTask`. The first iteration of the diagnostic parser therefore incorrectly reported zero trace scheduler tasks despite the raw traces containing them. The parser now accepts both names and **fails closed** if no scheduler task evidence exists. The original artifact and this documented reanalysis remain traceable in [GitHub Actions run 45934224548](https://github.com/syleriofficial/Decodista/actions/runs/45934224548).

The first visit shows a consistent cold-start-like pattern, not a proven React/hydration or hosting defect. CDP tracing overhead, per-context renderer process startup and shared-runner scheduling all remain confounders. Keep production features unchanged pending controlled trace reproduction or more convincing attribution.
