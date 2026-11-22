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
