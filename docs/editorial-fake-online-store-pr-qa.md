# Fake Online Store — Draft PR QA and asset handoff

This branch stages the editorial source for **How to Spot a Fake Online Store: 10 Checks Before You Buy**.

## Asset uploads required before merging

The approved V4 publishing kit contains three optimized 1600×900 WebP images. GitHub's connected text-file write path cannot transmit the binary files here, so **the images are not yet committed**. Upload the exact assets from the V4 kit to these paths:

- `public/images/uploads/how-to-spot-fake-online-store.webp` — featured image (122,652 bytes; SHA-256 begins `e47010cb163bacc1`)
- `public/images/uploads/fake-online-store-domain-comparison.webp` — in-article domain diagram (82,428 bytes; SHA-256 begins `6255ec8d92f7add5`)
- `public/images/uploads/fake-online-store-checklist.webp` — in-article checklist (123,972 bytes; SHA-256 begins `e36e667774808c`)

The source Markdown references these paths. Do not merge or deploy until all three resolve.

## Final checks required

- Run the repository's full CMS validation, content loader, build, and CI on the completed branch.
- Inspect desktop and mobile preview, especially the two inline diagrams and image captions.
- Verify all external and related internal links.
- Reconfirm time-sensitive sources and change `publishedAt` to the **actual** publication date.
- Keep the byline `DECODISTA Editorial`; do not invent an individual author.
- Confirm the title, metadata, canonical slug and structured data on staging.

**Publication status:** draft only. No production deploy was authorized.