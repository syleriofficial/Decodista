/**
 * Email subscriptions are not collected by DECODISTA.
 * A provider-hosted, opt-in subscription page can be enabled at build time
 * after the provider, unsubscribe flow and privacy disclosures are verified.
 */
export function newsletterSubscriptionUrl(): string | null {
  const configured = process.env.NEXT_PUBLIC_NEWSLETTER_SUBSCRIBE_URL?.trim();
  if (!configured) return null;

  try {
    const url = new URL(configured);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.hash
    ) return null;
    return url.href;
  } catch {
    return null;
  }
}
