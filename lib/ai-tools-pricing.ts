/**
 * Editorial source ledger for the initial AI Tools pricing section.
 *
 * Checked manually against official provider pages on 2026-11-21.
 * Not a real-time feed or a guarantee of price/feature availability.
 * Do not invent localised prices, use affiliate redirects or extrapolate
 * monthly prices from annual promotions.
 */
export const PRICING_CHECKED_ON = "2026-11-21";

export type AiToolPricingRecord = {
  slug: "chatgpt" | "claude" | "gemini" | "perplexity";
  pricingUrl: string;
  planNames: readonly string[];
  priceSummary: string;
  evidence: string;
  caution: string;
  verifiedAmount?: {
    plan: string;
    price: string;
    billing: string;
  };
};

export const AI_TOOL_PRICING: readonly AiToolPricingRecord[] = [
  {
    slug: "chatgpt",
    pricingUrl: "https://chatgpt.com/pricing/",
    planNames: ["Free", "Go", "Plus", "Pro"],
    priceSummary: "Check pricing for your country and subscription tier.",
    evidence: "The official ChatGPT pricing page lists individual Free, Go, Plus and Pro tiers and their feature differences.",
    caution: "The public page did not expose a stable localized numeric subscription price in the source we checked; verify the checkout total in your country.",
  },
  {
    slug: "claude",
    pricingUrl: "https://claude.com/pricing",
    planNames: ["Free", "Pro", "Max", "Ultra"],
    priceSummary: "Claude publishes USD list prices for its individual plans.",
    evidence: "Claude's official pricing page lists Free, Pro, Max and Ultra. Its Pro plan is listed as US$20 monthly or US$200 billed up front annually.",
    caution: "USD public pricing is not a guaranteed local checkout quote. Taxes, country availability and usage limits may vary.",
    verifiedAmount: { plan: "Pro", price: "US$20", billing: "per month if billed monthly; US$200/year with annual billing" },
  },
  {
    slug: "gemini",
    pricingUrl: "https://one.google.com/intl/en_in/about/google-ai-plans/",
    planNames: ["Google AI Plus", "Google AI Pro", "Google AI Ultra"],
    priceSummary: "Check Google One for local currency pricing.",
    evidence: "Google's official AI plans comparison lists Plus, Pro and Ultra offerings and shows how benefits vary between plans.",
    caution: "Google AI plan pricing and included benefits are region-dependent. The accessible source did not provide a stable INR price suitable for publishing.",
  },
  {
    slug: "perplexity",
    pricingUrl: "https://www.perplexity.ai/pro",
    planNames: ["Pro", "Max"],
    priceSummary: "Check the official checkout for monthly or annual offers.",
    evidence: "Perplexity's public product page shows Pro and Max subscriptions with differing usage and research-related benefits.",
    caution: "The public page includes promotional or annual-billing offers that may change. Do not treat promotional prices as permanent month-to-month rates.",
  },
];

export const AI_TOOL_PRICING_MAP = Object.fromEntries(
  AI_TOOL_PRICING.map((item) => [item.slug, item])
) as Partial<Record<string, AiToolPricingRecord>>;

export function getAiToolPricing(slug: string) {
  return AI_TOOL_PRICING_MAP[slug];
}
