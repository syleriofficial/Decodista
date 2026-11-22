# Fake Online Store — Draft PR QA

This branch stages **How to Spot a Fake Online Store: 10 Checks Before You Buy** for editorial review.

## Assets — completed and verified

The original V4 1600×900 WebP images were committed under `public/images/uploads/`. The GitHub blob SHA for each matches `git hash-object` of the corresponding original local asset.

- `how-to-spot-fake-online-store.webp` — featured image (122,652 bytes; SHA-256 prefix `e47010cb163bacc1`)
- `fake-online-store-domain-comparison.webp` — domain diagram (82,428 bytes; SHA-256 prefix `6255ec8d92f7add5`)
- `fake-online-store-checklist.webp` — pre-purchase checklist (123,972 bytes; SHA-256 prefix `e36e667774808c`)

All three assets are referenced by the article at their intended `/images/uploads/` paths.

## Automated validation — PASS

GitHub Actions **Release checks** completed successfully for asset commit `8a21be95b592e4bbb011a2b6c5f1d4312f3033cb` (workflow run `45054802690`). This covered the repository's configured validation, test, lint, typecheck and build job.

A subsequent documentation-only change should also pass the configured checks before merging.

## Still pending before publication

- Inspect the built site in an actual mobile and desktop browser, including image crop, captions, readability and responsive layout.
- Click-test outbound sources and related internal links; recheck time-sensitive details.
- Review canonical URL, title and structured metadata in the rendered page.
- Change `publishedAt` to the actual publication date; `2026-11-22` is a draft value.
- Obtain editorial sign-off before marking the PR ready or merging.

**Status:** Draft PR only. No production merge or deployment authorized.

## Follow-up QA — November 23, 2026

- GitHub PR #116 remains **open, mergeable and Draft**. The latest checked head was `97b23c4bedbf1facf6e5e2e1f33d808959733613`.
- GitHub Actions Release checks completed **successfully** at that head (run `45054942460`; job `Validate, test, lint, typecheck and build`).
- Five PR file paths were confirmed: the Markdown article, this QA note, and all three 1600×900 WebP assets.
- All three contextual internal links currently resolve as public DECODISTA articles: Chrome Enhanced vs Standard, Google Account Recovery, and Fake Tech Support Scams.
- FTC primary sources were reachable and substantiate the November 2026 sponsored-search warning, May 2025 JOANN impersonation example and August 2026 reported social-ad purchase-scam losses. The FTC shopping advice, shipping-rule guide and recovery guide were also reachable.
- Google Safe Browsing documentation, Canadian Anti-Fraud Centre reporting page and Australian Scamwatch reporting page were reachable. The UK Report Fraud URL did not allow direct automated retrieval, but its official service and launch were confirmed via UK government and police sources. The Indian cybercrime portal timed out in the automated fetch; retain this as a manual click-test item.
- The article's proposed public slug is not available on production, as expected for an unmerged draft.
- **Not performed:** responsive visual inspection of the actual built site in desktop and mobile browsers; rendered canonical/structured-data inspection. No dedicated PR preview URL was found in the available workflow results. Browser integration was unavailable in this chat context.
- Keep the PR Draft until responsive staging preview and final publication-date checks have been completed and approved. Do not treat CI success alone as a passing visual review.
