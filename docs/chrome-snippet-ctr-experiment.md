# Search snippet experiment — Chrome Safe Browsing comparison

Status: proposed metadata-only change; production timing and indexing are checked separately.

## The single change

Target: `/articles/chrome-enhanced-protection-vs-standard-protection`

- Previous SEO title: `Chrome Enhanced vs Standard Protection: Privacy & Security`
- Candidate SEO title: `Chrome Enhanced vs Standard Protection: Which Is Better?`
- Previous description: descriptive privacy and security comparison
- Candidate description: a clear question-led summary of phishing/scam protection, privacy and data-sharing trade-offs.

The body, headings, publisher, canonical, robots settings, images, source ledger, fact checking and dates are **unchanged**. The editorial answer is conditional, not a claim that one setting is universally best.

Google's title-link and snippet systems can generate their own wording; this experiment **does not guarantee** that the new text will be displayed or will increase traffic.

Official guidance:
- https://developers.google.com/search/docs/appearance/title-link
- https://developers.google.com/search/docs/appearance/snippet

## Measuring without cherry-picking

1. Note the exact **verified Cloudflare production deploy time**. This is the implementation timestamp, not a search-crawl timestamp.
2. In Search Console, inspect the exact canonical and verify that Google recrawls before attributing outcomes. No repeated indexing requests.
3. Export a comparable **28-day pre-deployment vs 28-day post-deployment** window. Use settled Search Console data; preserve dates, search type=Web, countries/devices and query/page filters. Avoid mixing the broader site metrics with page-only results.
4. Check the specific canonical article page and the query cluster around `enhanced protection`, `standard protection`, `which is better`. Track actual clicks, impressions, CTR and average position; also monitor the page's total organic clicks.
5. Review desktop/mobile separately when sample sizes permit. The page could appear for new queries, changing its overall CTR without a real improvement to existing queries.
6. If there is no meaningful signal or click volume is too small, **report insufficient evidence**. Do not claim statistical significance or a causal SEO gain. Optionally restore the original snippet after editorial review.

Do not commit private Search Console exports, account identifiers, subscriber details or unpublished financial analytics to the public repository. Use first-party private reports for baseline and follow-up.
