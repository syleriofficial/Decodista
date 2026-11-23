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
