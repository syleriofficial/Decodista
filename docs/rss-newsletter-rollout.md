# Decodista RSS + Email Newsletter Rollout

## What this change ships now

- **RSS 2.0** at `https://decodista.com/rss.xml`, generated from approved articles plus dated Weekly Digital Safety Brief issues.
- Feed autodiscovery on HTML pages through `application/rss+xml` metadata.
- Visible, accessible RSS links on Homepage, Weekly Brief archive and Footer.
- Source publication calendar dates (never automatically republishing edited older guides as new), permanent HTTPS item URLs, short XML-escaped text summaries, and cache headers.
- CI unit coverage for hostile XML characters, invalid dates, sorting, stable GUID URLs, item cap and out-of-domain URLs.

No email address is collected by DECODISTA in this rollout.

## Activating email subscriptions later (requires actual provider)

This code provides an optional **external provider-hosted** email subscription link, not a mailing-list database, email delivery service or automatic sender.

1. Create an email publication with a reputable provider of your choice. Do not activate until the account and sender domain are verified.
2. Enable **confirmed opt-in** where available. Test subscribe, confirmation, unsubscribe, suppression list and data export/delete.
3. Review applicable privacy requirements (including processing location/retention) and **update the public Privacy Policy first**. Right now it correctly says the site does not operate a newsletter signup; that statement must change when an email program begins.
4. Ensure the external page uses HTTPS, makes the frequency and sender clear, links to a privacy policy and does not precheck non-essential marketing consent.
5. Set `NEXT_PUBLIC_NEWSLETTER_SUBSCRIBE_URL` at **build time** to the exact provider-hosted HTTPS subscription page. No other value enables the CTA. Do not add API keys, mail server secrets or subscriber addresses to source code or to public `NEXT_PUBLIC_` variables.
6. Rebuild in Cloudflare and confirm the external destination and text. The Homepage and Weekly Brief will then show `Subscribe by email` alongside RSS. If unset, invalid or not HTTPS, that email CTA is hidden.
7. Before telling readers they can subscribe, send one test edition end-to-end to an opted-in mailbox and verify the unsubscribe link works.
8. Send future issues manually after source verification and editorial review. No automatic messages or recurring scheduled emails are part of this PR.

## RSS verification after deployment

```bash
curl -I https://decodista.com/rss.xml
curl -fsSL https://decodista.com/rss.xml > /tmp/decodista-rss.xml
python3 -c 'import xml.etree.ElementTree as ET; root=ET.parse("/tmp/decodista-rss.xml").getroot(); assert root.tag == "rss"; print(len(root.findall("./channel/item")), "feed items")'
```

Expected: HTTP 200, `application/rss+xml`, well-formed XML, a self link, article links and at least one Weekly Brief link. Check new issues after every content deployment; the feed is content-backed, not an external crawler.

For a new issue, maintain `lib/weekly-briefs.ts` following `docs/weekly-brief-playbook.md`. RSS updates once the verified issue is part of a successful production deployment.

## Operational constraints

- Keep the site’s optional GA4 consent separate from the subscription mechanism.
- Email addresses are never appended as query params to DECODISTA pages.
- A provider's unsubscribe/confirmation system must work before sending any messages.
- No empty or pretend signup forms, invented subscriber metrics or surprise popups.
- Cloudflare build success and actual live feed HTTP/XML verification are **separate checks**.
