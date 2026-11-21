# Decodista AI Tools — first-party measurement playbook

Status: instrumentation proposal. **No verified GA4/GSC numbers are available in this repository.** The GSC Wizard connection returned `payment_required` on 22 November 2026; this is a connector/subscription limitation, not evidence that traffic or indexing is zero.

## Exact north star

**10,000,000 calendar-month GA4 page views occurring on the AI Tools product only**, where the page's pathname is exactly `/ai-tools` or begins `/ai-tools/`. Includes guides, directory, profiles and comparison paths; excludes `/ai`, generic articles, news, homepage, `/ai-tools-foo`, and all other Decodista routes.

- This is a long-term **goal**, not current achieved traffic or a forecast.
- Count actual, consented **GA4 `page_view`** events for the scope, not sessions, unique users, GSC impressions, bot requests, or GA4 custom-event totals.
- The existing root `AnalyticsConsent` installs GA4 after visitors accept. `components/app-link.tsx` currently uses native anchor navigation, and GA4's initial config handles page views after consent. **No additional `page_view` event is emitted by this feature** to avoid duplicates.
- The denominator omits visitors who do not opt into analytics, including people who refuse/withdraw consent or block scripts. The GA4 total is an observed, consent-limited metric, **not a census of all visits**.
- Do not count internal QA/testing traffic; filter dev/test property sessions and internal traffic in GA4 with documented exclusions. Do not set synthetic goals as traffic events.

## User-journey events (after consent only)

| GA4 event name | Trigger | Safe parameter keys | What it tells us |
| --- | --- | --- | --- |
| `ai_tools_task_select` | A reader changes a task chip in the AI Tools Finder | `task_id` | Tasks readers intentionally explore |
| `ai_tools_category_select` | A reader changes the directory category | `category_id` | Which documented category reader selects |
| `ai_tools_compare_select` | A reader adds/removes a tool in the comparison dock | `tool_slug`, `selection` | Interest in building a comparison, not evidence that the next page was read |

All event names obey GA4 event naming rules; no submitted search term, text prompt, file, evaluation score, email, URL query, precise geolocation or provider credential is sent. Values are validated against hardcoded AI Tools task/category and curated tool IDs. Events require a local `decodista-analytics-consent=granted` flag and a present `gtag`; missing/blocking storage fails closed. Existing ads consent remains denied. No new cookies, server endpoints, database or third-party analytics provider are added. Event counts are **not** page views.

When creating a GA4 exploration, event names are reportable out of the box. To break down by `task_id`, `category_id`, `tool_slug` or `selection`, register only the required event-scoped custom dimensions in GA4 Admin first (if not already present), observing the property's limits; this is an optional later **owner** step. Avoid sending or registering arbitrary dynamic values.

## GA4: calculate AI Tools-only calendar-month pageviews

1. Open [Google Analytics](https://analytics.google.com/) and select the Decodista GA4 property using the tracking ID configured in `lib/site.ts`. Verify that events arrive; a configured measurement ID alone does **not** prove collection.
2. In **Explore > Free form**, select a full calendar month (also keep a separate settled 28-day view for comparisons). Add **Page path and screen class**, **Event name**, and **Date** as dimensions; **Event count** or **Views** as metric. Use `Event name` equals `page_view` when using Event count; do not combine unrelated event counts with Views.
3. Include page path with anchored regex `^/ai-tools(?:/|$)`, which matches the parent exactly and all children but excludes `/ai-tools-foo`. Exclude any internal/test traffic using documented property rules. Confirm a guide URL and the root directory appear, and a generic `/ai` URL does not. Record the property time zone.
4. Report exact measured views, by individual AI Tools page and by channel/landing page if available. In Traffic acquisition, distinguish sessions and users from pageviews. GA4 can have privacy/thresholding/consent gaps; note them rather than inflating totals.
5. Compare the same measure for the prior full calendar month, or for two equal, settled 28-day windows. Preserve filter and property settings. Do not interpret a new guide's pre-publication zero as negative growth.

Google reference: https://support.google.com/analytics/answer/12926732

## Google Search Console: AI Tools search discovery, NOT pageviews

1. Open [Google Search Console](https://search.google.com/search-console), choose the verified Decodista property and verify Google can fetch `https://decodista.com/sitemap.xml`. Submission does not ensure indexation.
2. In **Performance > Search results**, set **Search type: Web** and the last **28 complete/settled days**. Apply a **Page** filter for AI Tools URLs. A domain/URL-prefix property may support an anchored RE2 filter `^https://(www\\.)?decodista\\.com/ai-tools(/|$)`; validate the actual property URLs and regex before recording numbers. Do not sum exact page query tables to infer hidden search query totals.
3. Record total AI Tools Google clicks, impressions, CTR, weighted average position and the exact observation dates. Break down by pages, queries and countries as available. Be mindful of anonymized/hidden queries and data processing lags.
4. Use **URL Inspection** on the four source-led, indexable AI Tools guides; record Google's indexed status, selected canonical, crawl problems, coverage, and whether the page is excluded intentionally. GSC **clicks** are organic search visits, not AI Tools pageviews.
5. Do not request indexing repeatedly and do not lift `noindex` from thin directory/alternatives/pricing/profiles merely to boost a count.

Google reference: https://support.google.com/webmasters/answer/7576553

## Weekly scorecard fields — fill with actual observed values only

| Metric | Scope / source | Current value |
| --- | --- | --- |
| Calendar-month AI Tools pageviews | GA4 page_view + anchored `/ai-tools` path filter | **Not available** |
| Last 28 settled days AI Tools pageviews | Same GA4 path filter | **Not available** |
| Google Search clicks / impressions / CTR / position | GSC AI Tools URL filter, Web | **Not available** |
| Top AI Tools landing pages and returning readers | GA4 filtered reports; note exact attribution dimension | **Not available** |
| Task/category/compare interaction event counts | GA4 consented events; only after instrumentation release | **Not available** |
| Indexed canonical guides (Google-selected) | GSC URL Inspection, individually | **Not verified** |

Record source, exact date range, data maturity, time zone, exclusions, whether analytics consent was enabled and who extracted the number before publishing any metric. Do not use third-party traffic estimates to represent first-party results.

## Guardrails

- Instrumentation lives **only inside the AI Tools interactions**. No changes to site navigation, general news, editorial categories or other products.
- No manual duplicate page_view instrumentation, no search-query tracking, no test-sheet data leakage or dynamic user IDs.
- Privacy policy and existing consent banner remain accurate: optional analytics, deny by default; visitors can change preferences.
- Existing source-reviewed comparison and indexing protections remain unchanged.
- When GA4/GSC account access is restored, first measure the baseline. Only then decide whether a task or comparison feature should expand.
