# Weekly Digital Safety Brief — editorial playbook

A date-stamped, human-reviewed roundup of developments affecting everyday technology users. It is **not** an automated news feed.

## Publication routine (weekly, target Sunday)

1. Select a seven-day reporting window and gather proposed developments from official product blogs, public security advisories and original policy announcements.
2. Verify each item using a live primary source. Record the *actual announcement or release date* and the canonical HTTPS URL. Distinguish **announced**, **rolling out**, **released**, **patched**, and **planned**.
3. Include only changes with a practical reader implication. Do not infer worldwide availability from a limited U.S. rollout or widespread exploitation from a CVE advisory.
4. For each item, independently write: **What changed**, **Why it matters**, **What you can do**. Cite the source with a direct link; avoid copied promotional phrasing.
5. Check for overlap with existing DECODISTA guides. Link to related background only if it is relevant and still accurate. For platform updates, prefer version-agnostic background guides instead of pointing readers to superseded releases as if current.
6. Add a dated issue object to `lib/weekly-briefs.ts`, newest first; use a unique YYYY-MM-DD slug, accurate reporting window and a real publication date. Never silently edit a published issue to pretend it was published later.
7. Ensure the Homepage points to the newest verified issue, the archive includes older editions, and the sitemap contains both.
8. Create a branch and Draft PR. Run `npm run release:check`, review keyboard and mobile layout and all primary links. Merge only after editorial review and explicit owner approval.
9. Once deployed, verify the active production version and the issue URL. Update the next edition manually; no automatic publishing or implied newsletter signup.

## Editorial guardrails

- Separate an official claim from independent verification; a publisher's statement is attributable, not a guarantee.
- Never imply a proposed standard has been implemented before the provider confirms that.
- Say when a feature is rolling out by region, plan or platform. Avoid saying it is available to everyone.
- Keep the weekly archive useful even when an edition becomes old; show absolute dates, not an undated “breaking” banner.
- No artificial urgency, fabricated usage metrics, copied press-release text or unsupported safety advice.
- Do not create an email collection form or claim to send a newsletter without a real subscription and unsubscribe backend.
- If no important developments pass verification in a week, publish fewer items or skip the issue instead of adding filler.

## Follow-up checks

- Homepage CTA to `/weekly/YYYY-MM-DD`.
- `/weekly` archive and historical issue links.
- Source HTTPS URLs; original publish dates; available-region qualifiers.
- Sitemap canonical URLs and structured data.
- Accessibility: one H1, meaningful headings, anchor navigation, keyboard focus and mobile wrapping.
