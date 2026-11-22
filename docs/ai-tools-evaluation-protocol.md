# AI Tools — private evaluation protocol

Internal verification for structured AI tool comparisons. This is **not a published AI Tools blog**; passing a test-packet schema is not an automated vendor benchmark.

## Source and test standards

- Public AI Tools is a directory, Finder, structured comparison, alternatives and pricing product; no blogs, How-To pages or PDF walkthroughs under `/ai-tools`.
- Use fictional, fixed test cases in `lib/ai-tools-evaluation.ts` for genuine, private product experiments.
- Record model, plan, source material, test date, inputs, unaltered outputs and limits, then have a second reviewer validate conclusions.
- Check quotes and generated code independently; do not infer rankings or quality from official provider documentation alone.
- Never include unapproved client data, secrets, confidential repositories or identifying user notes.

## Private trial evidence gate (internal editors)

The repository contains a **structure-only** evidence auditor, not an automated vendor benchmark. Keep all raw model responses and reviewer notes in `local-ai-trials/`, which is Git-ignored. Never commit prompts from customers, private source files, secrets or identifying information. Use only DECODISTA's fictional test inputs.

1. Generate a blank packet for one of the six existing tests:

   ```bash
   mkdir -p local-ai-trials
   node scripts/verify-ai-tool-trial.mjs --template chatgpt-vs-claude source-accuracy > local-ai-trials/chatgpt-vs-claude-source-accuracy.json
   ```

2. Run the exact internal test prompt in both products **yourself**, with access to the real systems. Record the original output verbatim, exact model/plan, UTC run timestamps and settings for each provider. Do not ask an LLM to fabricate counterpart responses. The packet includes a SHA-256 fingerprint tied to the original DECODISTA prompt; leave it unchanged.
3. Have a *different human* independently evaluate each fixed criterion for both outputs. Store yes/no assessments plus a specific observation for every criterion. Disclose financial terms of access, platform differences, sample size and limitations.
4. Run:

   ```bash
   node scripts/verify-ai-tool-trial.mjs local-ai-trials/chatgpt-vs-claude-source-accuracy.json
   npm run ai:trial:test
   ```

5. A structurally complete record can be *submitted for editorial consideration*, not auto-published. A reviewer must still establish provenance, reproduce essential code tests, verify actual correctness, check permissions and determine whether any conclusions are supported. One trial is not a vendor-wide benchmark or an appropriate basis for a product winner.

### Safe alternative test IDs

For `chatgpt-vs-claude`: `source-accuracy`, `writing-constraints`, `planning-constraints`.

For `cursor-vs-github-copilot`: `typed-function`, `bug-fix`, `review-changes`.

The audit strictly matches the original prompt SHA-256 and approved internal checklist. An empty template intentionally **fails** validation. The automated unit tests use clearly identified synthetic, in-memory fixture strings—they are **not provider responses** and cannot be cited as performance evidence. The script never contacts either vendor, never uploads packets and never generates rankings.

Do not equate passing the schema audit with actual test results or independent reviewer credibility. Public product comparisons remain descriptive until a separate genuine hands-on review is completed; no article publication is implied.
