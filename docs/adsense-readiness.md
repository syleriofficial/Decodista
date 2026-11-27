# AdSense readiness and launch gates

This work is separate from editorial publishing and design changes. Ads remain disabled. The existing Analytics-only consent flow is not an advertising CMP.

## Before requesting review

- Verify the publisher ID in the AdSense account against public/ads.txt; do not replace it with an assumed ID.
- Verify the production root /ads.txt returns HTTP 200, a plain-text body and the correct account record. Use the ads.txt verification option in Sites if available; no advertising script is needed for that method.
- Verify /robots.txt and /sitemap.xml, canonical redirects, representative public pages, and a genuine 404. Confirm Cloudflare does not challenge or deny genuine AdSense crawlers; inspect verified-bot and security-event evidence, not merely spoofed user-agent requests. Keep admin access controls intact.
- Confirm Privacy Policy renders and its links work; check contact delivery, copyright evidence, mobile layout, and broken links.
- Request review manually in the verified owner's AdSense account. No approval guarantee.

## Before enabling advertising

- Confirm the site has Ready status and the publisher has approved activation.
- Configure and publish the appropriate messages in AdSense Privacy & messaging, including a Google-certified TCF CMP for EEA, UK and Switzerland where required. Configure any other applicable regional privacy controls. Do not treat the existing Analytics banner as a certified CMP.
- Use Google's official tag and documented consent integration. Verify defaults, accept/reject and withdrawal, and ensure advertising choices remain distinct from optional Analytics. Do not let the Analytics consent handler overwrite the CMP's advertising decisions; reconcile and test this integration before release. Do not manually grant advertising consent.
- Keep advertising off on search results, errors, contact, legal pages, admin, and other non-content or insufficient-content screens. Start with explicitly approved substantive editorial pages, not site-wide automatic placements. Check policy compliance, accidental-click risks and layout shift.
- Update the public Privacy Policy to describe the actual advertising implementation and provide working advertising privacy controls before ads go live.
- Verify network requests and consent behavior in clean browser sessions for relevant regions; check rejection, withdrawal, no consent, and permitted consent. Verify mobile layout and performance. Roll back if advertising requests or consent behavior are incorrect.

## References

- https://support.google.com/publisherpolicies/answer/10437794
- https://support.google.com/adsense/answer/12169212
- https://support.google.com/adsense/answer/7679060
- https://support.google.com/adsense/answer/11546682
- https://support.google.com/adsense/answer/10924669

This checklist does not certify production accessibility, CMP configuration, copyright clearance, legal compliance or Google approval. Account-side and live checks must be recorded separately.
