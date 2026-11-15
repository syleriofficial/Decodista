# DECODISTA — Image and Source Quality Checklist
Status: Editorial QA policy, November 2026. **No new articles or image assets are published by this change.**

## Why this matters
Images help readers understand ideas only when their meaning matches the story. Search engines also use contextual text and filenames, while assistive technologies need useful alt text. See:
- [Google Search Central — Image SEO best practices](https://developers.google.com/search/docs/appearance/google-images/)
- [W3C WAI — Informative images](https://www.w3.org/WAI/tutorials/images/informative/)
- [W3C WAI — Decorative images](https://www.w3.org/WAI/tutorials/images/decorative/)

## Before every article is published
1. **Accuracy:** A human editor must visually inspect the actual image. Confirm that devices, brands, features, UI and relationships shown do not imply a test, partnership, product availability or event not supported by the article. Abstract illustrations must not be misrepresented as screenshots or photographs.
2. **Specific hero alt:** Describe what is visually shown and why it relates to this article in one short phrase or sentence. Avoid keyword strings, duplicate descriptions, a bare file name or headline-only alt. These hero images convey content; decorative layout elements should have empty alt text rather than adding audio clutter.
3. **Files and crops:** Use a descriptive lower-case hyphenated file name, such as `google-photos-backup-explainer.webp`. Prefer original appropriately compressed WebP artwork, source dimensions at least 1200px wide, and check the 16:9 / 4:3 / mobile crop. A link card image and an article hero may appropriately use the same article artwork.
4. **Source transparency:** Verify that every article has a substantive Sources & Verification section with accessible source URLs to specific official documentation or credible reports. Record what is documentation-based versus personally tested and what remains unknown.
5. **Updates:** Keep `informationCheckedAt` truthful; it should reflect a real editorial check, never a timestamp changed to simulate freshness. Verify facts again before making a significant update.
6. **Discoverability:** Confirm article metadata, `og:image`, alt text and source image are consistent. Avoid describing a conceptual illustration as a product screenshot.
7. **Accessibility:** Test the article's image on a narrow phone and check keyboard/screen-reader navigation. Complex diagrams may need long-form textual explanation near the image, not only a very long alt.
8. **Editorial ownership:** For stock, user-supplied, AI-generated or commissioned images, maintain a provenance/licensing record internally. Do not make unsupported ownership claims.

## Automatic checks
`npm run editorial:quality` reads the same approved production articles and image paths as the website. It fails CI on missing or superficial hero alt, repeated identical alt, missing image files, missing source sections, or empty inline-image alt. The JSON inventory at `artifacts/editorial-quality/article-inventory.json` includes source-link counts, asset byte sizes and editorial advisories.

### Advisory rather than destructive edits
Legacy file names such as `chatgpt-image-...` and articles with fewer clickable source references are flagged for *manual editorial review*. Do not automatically rename a published image: doing so changes an existing URL and can break cached image links. Neither byte-identical art nor a missing source hyperlink automatically establishes plagiarism or inaccurate reporting.

### Important limitation
A script cannot guarantee that alt text matches the pictured object, that an image is truly original or licensed, that citations still support the claims, or that facts are up to date. It also cannot infer section-level traffic or Google Search Console performance. Those require visual review, source checking, and real first-party analytics.

## Scope guardrails
Keep six approved main menu destinations, article slugs, CMS structure, dates, content and all published URLs intact. No automatic publication, no invented reporting, no editorial rewriting without review, and no webfont or analytics change as part of this audit.
