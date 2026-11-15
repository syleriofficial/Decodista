# DECODISTA — Signal Edition: Editorial Design System
Status: Draft design direction, November 2026. Review visual screenshots and pre-release checks before merging. This document records the reasoning behind the **full-site redesign**, not a commitment to publish new content.

## The product and its audience
DECODISTA is an English-first publication about understanding technology and making safer digital decisions. The live publication currently has a relatively small library of practical explainers/guides; some headline editorial beats (Tech News, Reviews and Science) are not yet populated. Design **only around real inventory**: an informative empty state is preferable to a fake review, breaking-news banner or empty tag page.

Positioning: **a thoughtful technology magazine, with the utility of a practical guide library**.

## Competitive design research (inspiration, never copying)
- **The Verge** (2026 homepage evolution): editorial/top stories and reverse-chronological feed are distinct surfaces. Reference: https://www.theverge.com/bulletin/914842/the-next-evolution-of-the-verges-homepage-is-here
- **WIRED**: distinctive art direction, intentional headline sizing and a curated editorial front page. Reference: https://www.wired.com/
- **Ars Technica**: readable, information-forward editorial structure; layouts need not all have equal visual density. Reference: https://arstechnica.com/
- **Rest of World**: accessible, restrained identity and clear beats/topic discovery. Reference: https://restofworld.org/
- **Nielsen Norman Group**: short meaningful headings and scannable content hierarchy help people find the right information. Reference: https://www.nngroup.com/articles/layer-cake-pattern-scanning/

DO NOT reuse competitors' logos, typography files, illustrations, photographs or proprietary layouts.

## Brand principles
1. **Contrast without noise:** charcoal/navy as an editorial anchor, ultramarine for actionable links, calm neutral background.
2. **Proof before promotion:** article credibility, sources, updates, author policies and real content trump superficial claims.
3. **Rhythm rather than repeating cards:** cover spread; time-ordered latest; curated topics; usable step-by-step articles.
4. **Original imagery with truthful captions:** existing original artwork may be retained, but subject accuracy and alt text must be audited before new stories.
5. **Speed is part of the design:** no font CDN, auto-playing backgrounds, heavy motion or newly introduced JavaScript just for appearance.

## The tokens
Source of truth: `app/editorial-redesign.css`, layered after the existing `app/globals.css` to make safe rollout possible.

| Role | Light | Dark |
| --- | --- | --- |
| Paper | #f4f6f9 | #0b1423 |
| Surface | #ffffff | #152239 |
| Primary text | #102033 | #f1f5fc |
| Secondary text | #566577 | #b0bfd1 |
| Rules | #d9e1ec | #30445f |
| Signal accent | #2454e8 | #9ab6ff |
| Soft accent | #e9efff | #1c3054 |
| Warm micro-accent | #e96b44 | #ff946d |

Hero panels retain a fixed dark surface (#101f39 / #162540) with off-white text and light-blue category labels. Links need visible focus and selected states. The dark colophon footer has its own high-contrast palette.

Typography: platform UI sans stack for labels, navigation, forms, metadata; Iowan/Palatino/Georgia-style editorial serif stack for titles and reading. Avoid loading external font files until speed and licensing are validated. Focus on readable line heights, not maximum font size.

## Page-template inventory
- **Header:** two-tier desktop magazine masthead, 6 stable section links; mobile collapses to the existing accessible menu.
- **Home:** one strong image/text cover; separate Latest rail; real recent stories in responsive cards; task-oriented discovery; category sections only when populated.
- **Category + How-To:** large editorial header; image-led lead story; accurate article count; honest, noindex unpopulated categories.
- **Article:** clean headline/byline; captioned cover; direct answer; takeaways; sidebar TOC; restrained long-form copy; related discovery after the full body.
- **Search:** form-first with working GET and no-JS fallback, published-only results, shareable query URL, accessible suggested terms. Search results remain noindex.
- **Latest + topic hubs:** descriptive article lists and genuinely populated topics, with existing pagination and canonicals.
- **Weekly Brief:** same colour/type system, distinct issue cover, sources and checklists, retained as a secondary destination.
- **Contact/Info/Legal:** restrained typography and readable forms, legal links, privacy choices; not a disconnected template.
- **Footer:** editorial mission statement + 4 accessible link groupings and RSS, rather than a generic link dump.

## Image/performance contract
Maintain generated responsive WebP variants, native srcset/sizes, explicit dimensions, lazy loading below the fold and fetchpriority=high for the first meaningful cover. Source: https://web.dev/articles/serve-responsive-images

The mobile Lighthouse baseline **can vary materially** between runs; do not declare success based only on a single synthetic score. Compare lab scores, check image LCP and blocking time, and monitor real-user field metrics. Targets at the 75th percentile:
- LCP <= 2.5 seconds
- INP <= 200 milliseconds
- CLS <= 0.1
Google reference: https://developers.google.com/search/docs/appearance/core-web-vitals

## Accessibility and responsive contract
Keyboard access to all links/actions; semantic headings; discernible focus rings; text contrast; screen-reader labels; reduced-motion media query; 320 CSS px reflow with no page-wide horizontal scroll. Source: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
Keep the privacy-first consent model (off until explicitly accepted), make the mobile dialog compact rather than a large overlay, and maintain a visible decline choice.

## Release plan
1. Draft PR with source-level site contracts and the automated Release Checks.
2. Chrome visual checks for 1440 desktop light/dark, 768 tablet, 390 and 320 mobile (including first-screen captures).
3. Human review of desktop and mobile screenshots, empty categories, dark mode, long headlines and consent.
4. Confirm article/page/content URLs unchanged; no fake content, no CMS schema migration, no new dependencies.
5. Only after approval: merge to main; wait for matching Cloudflare build; verify public HTTP, SEO and simulated-mobile Lighthouse. Compare real user metrics when available.
6. If content grows, revisit the balance between curated covers and chronological feeds instead of hardcoding a fake “breaking news” experience.

## Known limits
A visual redesign cannot promise traffic growth or original story inventory. Proprietary menu-level traffic requires connected Search Console/analytics; domain-level competitor traffic is not section data. The new design is intentionally not automatically deployed from this draft PR.
