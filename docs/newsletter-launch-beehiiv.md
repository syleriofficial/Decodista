# DECODISTA Newsletter — provider selection and launch checklist

**Status:** Preparation only; no mailing list, account, email provider, or campaign has been connected or activated through this repository.

## Recommendation (checked 1 November 2026)

Use **beehiiv Launch** for an initial opt-in, English-language, once-weekly DECODISTA newsletter. Official pricing currently lists **$0/month for up to 2,500 subscribers and unlimited email sends**. Current plan terms can change: check them again before creating the account. Keep full articles and the Weekly Digital Safety Brief archive on `decodista.com`; use email for a concise summary with links back to the canonical pages.

Provider primary sources:
- https://www.beehiiv.com/pricing
- https://www.beehiiv.com/support/article/13081072798743-How-to-enable-double-opt-in-and-Smart-Nudge
- https://www.beehiiv.com/support/article/18621437457303-ways-to-contact-beehiiv-support

Alternative plans checked:
- MailerLite free: 250 active subscribers and 2,500 emails/month, per https://www.mailerlite.com/help/free-plan-update-faq
- Buttondown free: first 100 subscribers, per https://www.buttondown.com/pricing
- Brevo free: 300 sends/day, per https://help.brevo.com/hc/en-us/articles/208580669-FAQs-What-are-the-limits-of-the-Free-plan

## Newsletter identity

- Publication name: **DECODISTA Weekly Digital Safety Brief**
- Website: https://decodista.com
- Language and audience: English, global
- Proposed cadence: **one edition each Sunday**, subject to a verified weekly issue being published first
- Editorial promise: "The important AI, privacy and security changes of the week — what changed, why it matters, and what to do."
- Avoid hype, unsolicited campaigns, urgency spam and implying that every provider announcement applies worldwide.
- No newsletter-exclusive repost of entire site articles; link to the authoritative original DECODISTA pages.
- Do not invent or publish a sender email address. Choose a verified sender only after provider/domain ownership confirmation.

## Account activation checklist (owner / account-holder action required)

1. Open https://www.beehiiv.com/ and create a publication in the publisher's own account. Do not purchase a paid plan unless explicitly approved.
2. Enter the publication name and existing site URL; avoid redirecting the main `decodista.com` website away from Cloudflare.
3. Verify publisher ownership and configure any requested domain authentication (SPF, DKIM, DMARC) exactly as the provider instructs. Preserve existing DNS records; never replace unrelated DNS or MX records.
4. **Enable publication-wide Double Opt-in Email:** Settings > Emails > Preset Emails > Double Opt-in Email. Confirm that new subscribers remain Pending until they click the confirmation message.
5. Keep welcome email conditional on confirmation. Test with two consented inboxes: initial Pending, confirmed Active, welcome message, sample weekly issue and unsubscribe.
6. Confirm the provider appends an unsubscribe link to every campaign. Test that using it suppresses future sends.
7. Obtain the exact public HTTPS subscription-page URL. Verify it in a browser, including phone and desktop.
8. **Before enabling any CTA**, revise the site's Privacy Policy to clearly name the email provider, information collected (email), purpose (weekly newsletter), confirmation, opt-out, retention/deletion, and any international processing. Publish that policy update first. This policy is not being modified by this preparation PR.
9. Set Cloudflare build-time `NEXT_PUBLIC_NEWSLETTER_SUBSCRIBE_URL` to the verified subscription page URL. This existing variable controls whether the "Subscribe by email" link is displayed in `components/follow-decodista.tsx`. Do not add API credentials or subscriber addresses to this public variable.
10. Trigger a normal production deployment after policy and account tests; validate link safety, confirmation/unsubscribe and mobile UX on the actual site.
11. Send the first email **only to confirmed opt-in subscribers**. Do not import contacts without permission.
12. Review monthly subscriber counts, successful sends, bounces, unsubscribes and clicks to the site. Avoid intrusive tracking. Never claim user-return or revenue lift without analytics.

## Security and editorial release gates

- Keep email processing with the provider, not a new Cloudflare email-collection API.
- A provider-hosted subscription page avoids creating an unreviewed local subscriber database.
- Do not add an email signup popup just to chase signups.
- Confirm unsubscribe is working before sending.
- Confirm no newsletter appears in the UI until the provider URL is configured.
- Draft copy is not sent automatically; an editor checks official sources and links before each send.
- If an edition contains few meaningful changes, send fewer items or skip that week.
- Maintain the publishing guidance in `docs/weekly-brief-playbook.md`.

## Release decision

**Do not activate the provider or set the URL environment variable from this PR.** Account creation, the Privacy Policy update and an end-to-end test require the owner's account setup and an additional separately reviewed release.
