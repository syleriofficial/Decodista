# Storage troubleshooting guides — editorial review sheet

**Prepared:** November 11, 2026  
**Status:** Internal editorial drafts. These files do NOT enter the production content loader, navigation, sitemap or RSS. No live URLs have been created.

| Draft | Primary problem to solve | Proposed slug | Audience |
| --- | --- | --- | --- |
| Gmail blocked by full Google storage | Restore incoming mail safely without accidentally deleting photos or backups | gmail-not-receiving-emails-google-storage-full | Personal Gmail and Google One users |
| iPhone full, iCloud has space | Distinguish local and cloud capacities, avoid synced deletion | iphone-storage-full-icloud-has-space | iPhone users, including iOS 26 and iOS 27 |

## Why these topics

Both are specific, high-stakes troubleshooting intents: the reader is facing a warning and needs a **safe next action**, not a generic cloud-storage overview. The current Decodista collection already explains Google Photos Free up space, iCloud Backup, and turning off iCloud Photos. These two proposed guides fill adjacent questions without rewriting the existing coverage.

**Keyword search demand is a hypothesis, not a quantified finding.** We have not obtained current Search Console query impressions, CTR, rankings, or keyword search-volume data. Do not promote them as proven traffic winners until first-party data is reviewed.

## Primary-source review

- Gmail draft: Official Google Account, Google Drive, Gmail, Google One and Google Photos Help. Distinguish stopped delivery, bounced mail, delayed quota accounting, mobile local cleanup and cloud deletion.
- iPhone draft: Official Apple Support and iPhone User Guide. Distinguish built-in storage from iCloud quota, optimization vs synced deletion, Offload App vs Delete App, version-specific Settings labels.
- Four proposed internal cross-links in the drafts are verified production article slugs.
- The drafts do **not** claim hands-on testing, personally reproduced warnings, or screenshots.

## Before production publication

1. Fact-check every action against current official primary sources, including region- and OS-specific UI wording. Re-review destructive deletion and account-recovery claims with a second editorial pass.
2. Commission a **distinct original 1600×900 WebP** hero for each guide (at least 1200 px wide; no embedded words or fake app UI); check metadata stripping, under 2 MB, alt text and responsive contrast. Do not reuse unrelated imagery from existing articles.
3. Convert both to the approved Decap CMS YAML front matter in content/articles, following validation constraints for short answers, key takeaways, dates, FAQs, sources and verified article links. Only approved, ready-to-publish articles should enter production.
4. Add context-aware internal links from existing articles after reviewing relevance; do not force exact-match anchor text.
5. Pass content validation, site contracts, lint, typecheck, build, mobile/desktop browser QA and original-source link checks.
6. Use the **actual publication date** at release; do not retroactively mark an editorial draft as already published.
7. Verify the live canonical pages, sitemap and RSS after any authorized merge/deployment.

## Safety rule

If any of the official documentation contradicts a proposed instruction, stop and correct the text before publication. Prefer a modest, supportable claim over confident guidance that could cause the loss of mail, photos or backups.

## November 11 editorial staging update

- Final content has been transformed into **CMS-structured YAML/Markdown files** under `editorial/ready/`, while the original drafts are retained for editorial comparison.
- A production-parser smoke test now checks the staged entries using `parseArticleDocument` and the real Decodista CMS rules, including source sections, unique FAQ sections, SEO lengths, cross-links and intended WebP paths. Run: `node editorial/ready/validate-staged.mjs`.
- Original **text-free 1600×900 WebP** hero artwork was prepared separately and exported in the conversation as `decodista-two-hero-images.zip`. The images were not uploaded to GitHub; the staged CMS files intentionally cannot be published until both matching `/images/uploads/<slug>.webp` files are committed.
- Gmail draft refinement: official Google support treats paid Google One storage as a new *total allowance* in its troubleshooting guidance. Avoid describing it as a second full plan added to the existing capacity; check the displayed account total. Gmail search uses documented `filename:pdf` syntax.
- Source verification confirmed the fundamental storage-limit, bounced email, 48–72-hour accounting, iCloud-vs-device capacity, Photos deletion, optimization and app-offloading claims against official Google and Apple documentation. This is a documentation review, **not hands-on device testing**.
- Full **Release Checks** and **Staged editorial content QA** passed for the PR head. These tests cover repository integrity and typed content parsing, **not** live/mobile article rendering, as the articles are not yet in production.
- **Remaining go/no-go:** upload the two exact WebPs; place approved CMS files into `content/articles/` on a separate publishing PR, update publication dates if needed, run full release checks, run page previews across 320/390/768/1440-pixel layouts, and inspect accessible images and links before merging.
