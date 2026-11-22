# DECODISTA ClickFix Security Article — Editorial and Image Release Gate

**Status:** Draft only; **not published**, **not merged**.  
**Date of editorial and image asset preparation:** 2026-11-23.  
**Draft article:** [fake-captcha-scams-clickfix-malware.md](editorial-drafts/fake-captcha-scams-clickfix-malware.md).  
**Intended canonical:** https://decodista.com/articles/fake-captcha-scams-clickfix-malware  
**Category:** Security. **Content type:** Explainer.

## Editorial scope

Global English, consumer-facing ClickFix safety guide with precise differentiation between:
- Viewing a page, clicking a checkbox, copying text, pasting a command, and executing code;
- ClickFix as social engineering versus malware families delivered afterward;
- Separate Windows, macOS and mobile attack mechanisms;
- Observed findings and potential capabilities in Microsoft TerminalFix, macOS ClickFix and Blackpoint ROMULUS reporting.

Primary references are linked beside relevant material in the article, with a sources and disclosures section. No claim of original malware testing or first-hand investigation.

## Final original image asset manifest

The following three image files were produced and checked in the **local editorial package**. They are **NOT yet uploaded to the GitHub PR**, so no browser or production image-loading check can be marked complete.

| Destination in repository | Size | Dimensions | SHA-256 |
|---|---:|---|---|
| \`public/images/uploads/fake-captcha-scams-clickfix-malware.webp\` | 68,496 B | 1600×900 | \`d14f49411eae5efd6f0e59b3d180cc257f3a3f40a760d19109c2a55cfa5bf06e\` |
| \`public/images/uploads/clickfix-real-vs-fake-captcha.webp\` | 62,406 B | 1600×900 | \`9073e0a77d97cf47cfdaeaa3d82944e1dd47060f446b73a9064251ffe00a16cd\` |
| \`public/images/uploads/clickfix-recovery-decision-flowchart.webp\` | 71,754 B | 1600×900 | \`7d114976c0da23f77d19fc7bbfc560427051a010a4ed4020ec6b608c60ca4211\` |

**Featured image alt:** Original conceptual laptop showing fictional \`verification.example\` and a warning against running a command.  
**Comparison alt:** Illustrative side-by-side normal browser verification versus suspicious system-command request.  
**Recovery alt:** Decision aid for viewed, clicked and command-executed responses.

Each image was reopened after WebP encoding. 390-pixel-wide image previews were generated and examined. The layouts avoid real company impersonation, harmful executable content, and non-reserved sample domains. Supporting diagrams are for education, not verified screenshots of an actual campaign. Their full-size reader experience must still be checked inside the article layout.

## Next steps to release, in order

1. Upload all three exact WebP files from the final local package to \`public/images/uploads/\` **on the draft branch**, not directly to \`main\`. Confirm sizes and hashes.
2. Move the article Markdown from \`docs/editorial-drafts/\` to \`content/articles/\`. Replace \`publishedAt: REPLACE_WITH_ACTUAL_PUBLICATION_DATE\` with the **actual original publication date** only after an authorized release decision. Do not falsely change \`informationCheckedAt\` merely because of formatting.
3. Run \`npm run release:check\` and the article link/content/image validation on the actual PR head SHA.
4. Browser QA: desktop 1440×900, tablet 768×1024, mobile 390×844 and small mobile 320×720 in light/dark where applicable. Verify image loading and correct captions, TOC/FAQ, no overflow, meta/canonical, JSON-LD Article and Breadcrumb, internal links and console errors.
5. Manually review factual nuance and live availability of external sources. An automated build does not verify reporting.
6. Request explicit editorial approval; **only then** merge. Verify matching Cloudflare deployment and actual live article URL/assets before declaring published.

## Current hard blocker

The GitHub connector in the current session exposes text-file and Git-blob creation but **no direct container-binary upload action**. The final WebP files remain available in the downloadable local editorial package. Do not substitute a placeholder image, publish with broken paths, or claim browser QA passed without those assets.

This is deliberately a documentation-only PR to keep the production content gate green until the exact files are available.
