# Decodista AI Tools — first-party measurement playbook

Status: AI Tools consent-gated interaction instrumentation was deployed and production-verified via PR #113. **Collection of live events and GA4/GSC traffic totals has not been independently verified.** The GSC Wizard connection returned `payment_required` again on 23 November 2026; this is a connector/subscription limitation, not evidence that traffic or indexing is zero.

## Exact north star

**10,000,000 calendar-month GA4 page views occurring on the AI Tools product only**, where the page's pathname is exactly `/ai-tools` or begins `/ai-tools/`. Includes directory, profiles, comparison, pricing and alternatives paths; excludes removed editorial guides, `/ai`, generic articles, news, homepage, `/ai-tools-foo`, and all other Decodista routes.

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
| `ai_tools_compare_open` | An opted-in reader opens a selected pair in the comparison dock | `first_tool`, `second_tool` | Explicit comparison-open intent; direct visits remain page views only |
| `ai_tools_save_toggle` | A reader successfully saves or removes a bookmark locally | `tool_slug`, `selection` | Which tools prompted a local save action, not a count of unique people |
| `ai_tools_search_complete` | Reader presses Enter or leaves a nontrivial directory search field | `result_bucket` | Search outcomes: `none`, `one`, `few` (2–5), `many` (6+), without the text typed |


All event names obey GA4 event naming rules; no submitted search term, text prompt, file, evaluation score, email, URL query, precise geolocation or provider credential is sent. Values are validated against hardcoded AI Tools task/category and curated tool IDs. The `app-building` task is included in the allowlist. Search text is not sent, hashed, written to storage, or included in events; only an outcome bucket is transmitted. The search field keeps the last submitted value in transient component memory to deduplicate blur/Enter events. Comparisons opened directly from shared URLs are tracked through ordinary consented page views, not backfilled as `ai_tools_compare_open`. Events require a local `decodista-analytics-consent=granted` flag and a present `gtag`; missing/blocking storage fails closed. Existing ads consent remains denied. No new cookies, server endpoints, database or third-party analytics provider are added. Event counts are **not** page views.

When creating a GA4 exploration, event names are reportable out of the box. To break down by `task_id`, `category_id`, `tool_slug`, `selection`, `first_tool`, `second_tool` or `result_bucket`, register only the required event-scoped custom dimensions in GA4 Admin first (if not already present), observing the property's limits; this is an optional later **owner** step. Avoid sending or registering arbitrary dynamic values.


### Decision-use dashboard (do not infer winners without data)

For a settled rolling 28-day window, record `/ai-tools` page views separately from actual task selections and comparison opens. Analyze:

- **Task demand:** `ai_tools_task_select` grouped by `task_id`. The default preselected task is not an event.
- **Search friction:** `ai_tools_search_complete` grouped by `result_bucket`. The no-result share is `none / all reported completed searches`, not the percentage of people unable to find a tool. Search phrases are never collected.
- **Tool interest:** count `ai_tools_save_toggle` with `selection=add` by `tool_slug`; users who declined analytics are not represented. Saves and removals are actions, not unique saved-user counts.
- **Comparison intent:** group `ai_tools_compare_open` by ordered `first_tool` and `second_tool`. Compare-open events may be lost during navigation or never fire for direct-link visitors; compare-page views are a separate metric.
- **Purchase research:** analyze pricing page views and app-builder pair-specific compare-page views from consented `page_view` events, never from a guessed conversion rate.

Do not claim this is observed demand until data collection and registration are verified in the GA4 property. For reporting event parameters in GA4, register the selected event-scoped custom dimensions in Admin → Custom definitions and wait for future collected data; registration is not retroactive for old events.

## GA4: calculate AI Tools-only calendar-month pageviews

1. Open [Google Analytics](https://analytics.google.com/) and select the Decodista GA4 property using the tracking ID configured in `lib/site.ts`. Verify that events arrive; a configured measurement ID alone does **not** prove collection.
2. In **Explore > Free form**, select a full calendar month (also keep a separate settled 28-day view for comparisons). Add **Page path and screen class**, **Event name**, and **Date** as dimensions; **Event count** or **Views** as metric. Use `Event name` equals `page_view` when using Event count; do not combine unrelated event counts with Views.
3. Include page path with anchored regex `^/ai-tools(?:/|$)`, which matches the parent exactly and all children but excludes `/ai-tools-foo`. Exclude any internal/test traffic using documented property rules. Confirm a tool profile URL and the root directory appear, and a generic `/ai` URL does not. Record the property time zone.
4. Report exact measured views, by individual AI Tools page and by channel/landing page if available. In Traffic acquisition, distinguish sessions and users from pageviews. GA4 can have privacy/thresholding/consent gaps; note them rather than inflating totals.
5. Compare the same measure for the prior full calendar month, or for two equal, settled 28-day windows. Preserve filter and property settings. Do not interpret a newly published tool profile's pre-publication zero as negative growth.

Google reference: https://support.google.com/analytics/answer/12926732

## Google Search Console: AI Tools search discovery, NOT pageviews

1. Open [Google Search Console](https://search.google.com/search-console), choose the verified Decodista property and verify Google can fetch `https://decodista.com/sitemap.xml`. Submission does not ensure indexation.
2. In **Performance > Search results**, set **Search type: Web** and the last **28 complete/settled days**. Apply a **Page** filter for AI Tools URLs. A domain/URL-prefix property may support an anchored RE2 filter `^https://(www\.)?decodista\.com/ai-tools(/|$)`; validate the actual property URLs and regex before recording numbers. Do not sum exact page query tables to infer hidden search query totals.
3. Record total AI Tools Google clicks, impressions, CTR, weighted average position and the exact observation dates. Break down by pages, queries and countries as available. Be mindful of anonymized/hidden queries and data processing lags.
4. Use **URL Inspection** only for AI Tools product URLs approved for indexing; record indexed status, canonical and crawl problems. Current introductory directory and profiles remain noindex until review. GSC **clicks** are organic search visits, not AI Tools pageviews.
5. Do not request indexing repeatedly and do not lift `noindex` from thin directory/alternatives/pricing/profiles merely to boost a count.

Google reference: https://support.google.com/webmasters/answer/7576553

### No paid connector: manual export fallback

A GSC Wizard subscription or a third-party analytics connector is **not required** to collect a first-party baseline. The verified Decodista owner can use the official Google interfaces directly, then upload the exported **page-level** CSV files for analysis. Do not share credentials or API keys.

1. **Search Console:** Open **Performance > Search results** for the verified Decodista property. Set **Web** search type, the last 28 complete/settled days, and add **+ Add filter > Pages > Custom (regex) > Matches regex**. Paste this exact expression, with **one** backslash before each period:
   ```regex
   ^https://(www\.)?decodista\.com/ai-tools(/|$)
   ```
   Confirm a tool profile URL is included but `https://decodista.com/ai-tools-other` is not. Record the filtered report's **chart summary totals** (clicks, impressions, CTR and average position) and date range separately, then export its **Pages table** as CSV. The exported table can be truncated or otherwise differ from graph totals, so never claim the row sum is necessarily the full organic-search total.
2. **Google Analytics 4:** In the Decodista GA4 property, open **Explore > Free form**, use the same settled 28-day period and add **Page path and screen class** plus **Views**. Apply the path-scope filter `^/ai-tools(?:/|$)`. Review that root `/ai-tools` and tool-profile subpaths match but `/ai` and `/ai-tools-other` do not. Export the page-level results as CSV, record the property time zone and consent limitation, and avoid accidentally summing `ai_tools_*` interaction events as pageviews.
3. **Share only the two relevant exports and the recorded filtered GSC summary totals**, with report date ranges and time zone. Do not export private search terms, user identifiers or audience segments. With these exports, an AI Tools-only baseline and page opportunity analysis can be computed without paying for another plugin.

Both filters are documented for the **Google-owned reporting UI**; they do not grant access to the accounts, do not overcome analytics consent gaps and do not verify Google indexation.

Google reference: https://support.google.com/webmasters/answer/17011165?hl=en
Google reference: https://support.google.com/analytics/answer/1034324?hl=en


## Weekly scorecard fields — fill with actual observed values only

| Metric | Scope / source | Current value |
| --- | --- | --- |
| Calendar-month AI Tools pageviews | GA4 page_view + anchored `/ai-tools` path filter | **Not available** |
| Last 28 settled days AI Tools pageviews | Same GA4 path filter | **Not available** |
| Google Search clicks / impressions / CTR / position | GSC AI Tools URL filter, Web | **Not available** |
| Top AI Tools landing pages and returning readers | GA4 filtered reports; note exact attribution dimension | **Not available** |
| Task, category, search-outcome, save and comparison-open event counts | GA4 consented events; only after instrumentation release | **Not available** |
| Indexed, source-reviewed AI Tools product pages | GSC URL Inspection, individually | **Not verified** |

Record source, exact date range, data maturity, time zone, exclusions, whether analytics consent was enabled and who extracted the number before publishing any metric. Do not use third-party traffic estimates to represent first-party results.

## Guardrails

- Instrumentation lives **only inside the AI Tools interactions**. No changes to site navigation, general news, editorial categories or other products.
- No manual duplicate page_view instrumentation, no search-query tracking, no test-sheet data leakage or dynamic user IDs.
- Privacy policy and existing consent banner remain accurate: optional analytics, deny by default; visitors can change preferences.
- Removed AI Tools editorial routes are excluded; product pages remain noindex until approved.
- When GA4/GSC account access is restored, first measure the baseline. Only then decide whether a task or comparison feature should expand.
