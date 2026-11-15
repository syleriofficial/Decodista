# DECODISTA Editorial Standards

**Status:** editorial review standard; not an automated accuracy guarantee.  
**Applies to:** every new or updated DECODISTA article, including Tech News, Reviews, Science, Entertainment, AI, Digital Life and Security.  
**Maintainer:** DECODISTA Editorial.

## Mission and publication threshold

Publish original, useful, English-language reporting and explainers that let readers understand a technology development or make a safer, better-informed decision. **Accuracy outranks speed, article count and search traffic.** A source summary alone is not an adequate article: add a verifiable explanation, comparison, decision tree, limitation or practical consequence.

An H1 is supplied by the page template. Use a clear, non-sensational headline, concise deck, direct short answer, genuinely useful key takeaways and descriptive H2/H3 sections. An article must answer its promised question; do not pad to a word target or claim a firsthand experience that never occurred.

## Evidence and attribution

1. **Start with the best available primary record**: product/help documentation, changelog, security advisory, standards document, regulator, original research or company filing. Link to the relevant page, not just a homepage. For disputed or consequential assertions, seek independent reporting and document any disagreement.
2. **Separate evidence classes in the sentence itself.** “Company X says”, “researchers measured”, “Reuters reported” and “DECODISTA tested” are not equivalent. Name the party responsible for a claim; do not silently turn its marketing claim into a verified fact.
3. **Give numbers their denominators and methods.** Say what was counted, over what time and compared with which baseline. “Ten times more warnings” must not become “ten times fewer victims.”
4. **Distinguish announced, testing, rolling out, generally available, patched and discontinued.** State relevant country, platform, model, subscription, age, eligibility and date. A US-only announcement is not evidence of an India or worldwide release.
5. **Security and privacy require more caution.** Explain the concrete threat model, data shared, permissions, retention, exclusions and recovery path. Do not promise total protection, deletion, anonymity, or immunity to scams without evidence. Treat CVE advisories and actual exploitation claims separately.
6. **Reviews require real methodology.** Only claim “hands-on”, test results, photographs, battery measurements or a score when the team actually performed and documented them. Otherwise label the piece as documentation-based comparison/explainer.
7. **Science requires source quality.** Prefer original papers and technical reports, describe sample size/limitations when relevant, and distinguish preprints from peer-reviewed research. Do not extrapolate to consumer or health outcomes unsupported by the study.
8. **Entertainment coverage follows the same verification rule.** Differentiate a release announcement, rumor, casting claim, review, and confirmed availability. Never present a leak or prediction as an official date.

Do not fabricate anonymous sources, quotes, screenshots, expert credentials or contributor biographies. The approved byline is **DECODISTA Editorial** unless a real, verifiable contributor profile is intentionally introduced through a separate reviewed change.

## Dates, corrections and freshness

- **`publishedAt`** records the *original* publication date. Do not change it to imply that an old article is new.
- **`informationCheckedAt`** records the date on which the article’s time-sensitive claims were substantively checked against sources. Do not set it to today merely because formatting or internal links changed.
- **`updatedAt`** records an actual, reader-visible material correction or expansion. Include a concise explanation of important corrections when the previous claim could have changed a reader’s action.
- **Source event dates are separate from review dates.** Name both when the distinction matters.
- Use source-check cadence as a **review queue, never an automatic truth test**: target roughly 30 days for fast-changing security/rollout/availability pages, 60 days for product settings/privacy, 90 days for relatively stable procedures. Act immediately on a verified urgent correction. These are internal targets, not Google ranking rules.
- If an article is superseded, link prominently to the current guidance rather than preserving outdated “install this now” advice. Keep its URL stable unless an explicit migration is planned.

## Internal links, sourcing and SEO

- Link from the **body's relevant explanation** to another article only when it answers a legitimate follow-up. Include a useful descriptive anchor, not a forced “read more” collection. A contextual link may use either `/articles/slug` or `https://decodista.com/articles/slug`; the content gate now validates both forms.
- **Check destination and meaning**: the slug must exist, its advice must still be accurate, and the link must not point readers to an older release as though it were current. Related-article widgets are supplementary, not a substitute for useful context.
- Use direct HTTPS source links. Explicitly identify which evidence supports any important claim. Do not imply a source was checked when it was not; avoid copying long passages of third-party text.
- Keep published slugs and canonical URLs stable. Write accurate `seoTitle` and `metaDescription` rather than keyword stuffing; ensure dates match visible content and structured data.
- Each hero and embedded image needs descriptive alt text and correct, optimized dimensions. An illustration is not documentary photographic evidence. Do not reuse unrelated images solely for visual decoration.
- Google Search Central's [people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) recommends original value, accuracy, credible sourcing, transparent authorship and avoiding artificial date freshness. Its [Article structured data guidance](https://developers.google.com/search/docs/appearance/structured-data/article) explains author, image, `datePublished` and `dateModified` fields. Neither creates a guarantee of ranking or traffic.

## Editorial approval: required sequence

1. Identify the specific reader question, what's new, and the existing page(s) to update. Do not publish a duplicate article just to gain another URL.
2. Verify claims and source URLs; record publication, update and information-check dates honestly. Confirm product/geographic limitations.
3. Review factual accuracy, coherence, language and accessibility. Read comparison tables and FAQs against the article body; a FAQ must not contradict its parent section.
4. Check body links, canonical URLs, source citations, original art and metadata. Prefer a clear correction to unnecessary full rewrites.
5. Create **one focused Draft PR**, with changed files, source evidence, caveats and review notes. Do not merge based solely on draft creation or an old successful check.
6. Run **`npm run release:check`**. Check the result on the current PR head SHA. Code tests confirm structure and buildability, **not** factual truth, link-page live availability or legal conclusions.
7. Merge only after **explicit editorial approval**. Verify Cloudflare deployed the matching commit; then run Production QA and Mobile Lighthouse. Do not declare a release live merely because the GitHub merge succeeded.
8. If any required check fails, stop further merges, correct the problem in a new reviewed change and rerun the gate. Retain correction rationale in the PR.

## What is automated vs human-reviewed

**Automated:** front-matter schema, supported topics and article types, required metadata, internal article slugs (both relative and canonical absolute links), image paths/dimensions, content parsing, link-unit tests, lint, types, build and relevant regression checks.

**Human review:** accuracy and recency of external sources, whether citations support particular assertions, legal/geographic nuance, method and metric caveats, original value, clarity, fair wording, relevance of links and whether the imagery genuinely fits the story.

**No numeric publishing quota.** A page that is useful and fully verified is better than several thin or speculative pieces.

## Related repository documents

- `README.md` — content model, Decap CMS and Cloudflare workflow
- `public/admin/content-rules.mjs` — required fields and browser-side validation
- `scripts/validate-content.mjs` — build-time content gate
- `docs/editorial-audit-2026-11-15.md` — dated inventory and review queue (not permanent facts about current content)
