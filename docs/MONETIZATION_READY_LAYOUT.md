# DECODISTA — Monetization-ready editorial layout
Status: foundation only · 23 November 2026 · **No advertisements or affiliate links have been activated by this change**.

## Goal
Keep a fast, attractive, clear mobile and desktop technology publication today, while allowing **future** AdSense, well-disclosed affiliate links, sponsorships, useful directories/partnerships, and optional owned products without redesigning the site. Editorial usefulness comes before monetization.

## Current baseline (as checked on 23 November 2026)
- Shared editorial header, article template, category template, reusable cards, trust/standards pages, analytics consent, and responsive images already exist.
- `public/ads.txt` already contains an approved-for-repository Google seller entry. **Presence of ads.txt does not prove account/site approval or active serving.** Leave it unchanged.
- The existing consent dialog covers *analytics*, not a compliant advertising consent system. Ad storage/personalization currently stay denied even when analytics is accepted. Do not reuse analytics approval as ad consent.
- The site's review methodology already calls for honest disclosure of affiliate/supplied products and independence from sponsored decisions.

## Insertion points (no output until a deliberate future integration)
Mounted as `FutureAdPlacement`, which currently returns `null`:
1. `home-after-latest`: below the Latest Stories block, **not** in the masthead/navigation or over the hero image.
2. `article-after-opening`: after short answer/introduction/takeaways; the useful answer remains first.
3. `article-after-body`: after the full article body; not between table-of-contents links or close to source/citation actions.
4. `category-after-lead`: between a real category lead and its genuine story listing, and only if the category has sufficient published content.

Slots are potential locations, not a commitment to insert ads in all of them. When monetization is enabled, evaluate actual widths, height reservations, and ad density per device; do not allocate blank ad areas before approval.

## Future channel implementation
| Channel | Planned component/placement | Rules before launch |
| --- | --- | --- |
| AdSense / other display network | Implement a provider adapter in `FutureAdPlacement`; config per template/device | Confirm account/site approval; advertising consent where necessary; show an unambiguous `Advertisement` label; choose restrained inventory; monitor CLS, LCP, INP and actual ad density |
| Affiliate links | `AffiliateLink` + visible `AffiliateDisclosure` on pages that actually participate | Use `rel="sponsored"`; link to trustworthy destinations; check prices and terms; disclose commercial relationships close to the claim; no invented reviews, tests, or inflated rankings |
| Sponsored stories / partnerships | `SponsoredContentDisclosure` for genuinely sponsored pages | Plain paid-partnership identification at the top; distinct editorial status, review process, and transparent advertiser identity; no disguised news or paid editorial verdict |
| AI Tools / product comparisons | Existing directory and comparison templates | Display independently verified comparison criteria and pricing dates; add attributable commercial links only with disclosures; do not turn rankings into paid placements |
| Optional newsletter / products | Independent opt-in area and owned-product landing pages, if later built | Clear signup purpose, privacy obligations, unsubscribe controls, and honest product description; no fabricated subscriber count |

## Non-negotiable UX rules
- No ad code, third-party ad requests, invisible tracking pixels or blank ad containers on the current site.
- Mobile-first reading priority: headline, lead, context and useful answer before monetization. Never displace menus, buttons, download controls or article links with lookalike ads.
- Ads must be visually differentiated from editorial cards and clearly labeled. No misleading click targets, sticky overlays hiding content or aggressive pop-ups.
- Limit number of visible ad slots relative to meaningful content. Exclude thin, empty, error, privacy, contact and search-result pages from manual placements by default.
- Preserve accessible keyboard navigation, content integrity and responsive image sizing; no unnecessary new JavaScript or dependencies.
- Sponsorships and affiliate revenue must not control editorial conclusions. Human review of material commercial claims remains required.

## Consent and policy gate before turning on an ad network
1. Verify Google account and site approval in the publisher account; verify `ads.txt`, ownership metadata and approved seller IDs. **Do not infer approval from existing files.**
2. Implement appropriate advertising consent and update public privacy/cookie policies. For EEA/UK/Switzerland audiences, review Google's **certified CMP / IAB TCF** publisher requirements. The current analytics-only dialog is not sufficient by itself.
3. Review Google's ad placement and publisher policies; ensure ads do not resemble navigation or outnumber original content.
4. Pilot with one restrained placement, test real mobile/desktop views at 320, 375, 390, 430, 768 and 1440 CSS px; check CLS, LCP, INP, keyboard navigation, banner interactions and ad-blocker behavior.
5. Turn on only after owner approval, successful release checks and a controlled production QA. Retain a kill switch and rollback path.

## Sources (official documentation, reviewed 23 November 2026)
- Google AdSense program policies: https://support.google.com/adsense/answer/48182
- Google AdSense ad placement best practices: https://support.google.com/adsense/answer/1282097
- Google AdSense approval/content guidance: https://support.google.com/adsense/answer/7299563
- Google Search link qualification: https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links
- Google publisher consent requirements: https://support.google.com/adsense/answer/13554116

## Release scope
This foundation adds a single future placement component and two conditional disclosure utilities, then registers potential positions in the existing templates. It does **not** add any scripts, advertising IDs, adverts, affiliate offers, banners, sitewide blank space, new pages, or production deployment. Do not claim AdSense readiness/approval based on this PR alone.
