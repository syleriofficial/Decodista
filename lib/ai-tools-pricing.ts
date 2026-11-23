/**
 * Editorial source ledger for the initial AI Tools pricing section.
 *
 * Original four sources were reviewed 2026-11-21; eight further provider plan
 * sources were checked 2026-11-23. Each record has an explicit review date.
 * Not a real-time feed or a guarantee of price/feature availability.
 * Do not invent localised prices, use affiliate redirects or extrapolate
 * monthly prices from annual promotions.
 */
export const PRICING_CHECKED_ON = "2026-11-21";
export const PRICING_LAST_EXPANDED_ON = "2026-11-23";

export type AiToolPricingRecord = {
  slug: "chatgpt" | "claude" | "gemini" | "perplexity"
    | "adobe-firefly" | "canva" | "cursor" | "elevenlabs"
    | "github-copilot" | "midjourney" | "notebooklm" | "runway";
  pricingUrl: string;
  checkedOn: string;
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
    checkedOn: PRICING_CHECKED_ON,
    pricingUrl: "https://chatgpt.com/pricing/",
    planNames: ["Free", "Go", "Plus", "Pro"],
    priceSummary: "Check pricing for your country and subscription tier.",
    evidence: "The official ChatGPT pricing page lists individual Free, Go, Plus and Pro tiers and their feature differences.",
    caution: "The public page did not expose a stable localized numeric subscription price in the source we checked; verify the checkout total in your country.",
  },
  {
    slug: "claude",
    checkedOn: PRICING_CHECKED_ON,
    pricingUrl: "https://claude.com/pricing",
    planNames: ["Free", "Pro", "Max", "Ultra"],
    priceSummary: "Claude publishes USD list prices for its individual plans.",
    evidence: "Claude's official pricing page lists Free, Pro, Max and Ultra. Its Pro plan is listed as US$20 monthly or US$200 billed up front annually.",
    caution: "USD public pricing is not a guaranteed local checkout quote. Taxes, country availability and usage limits may vary.",
    verifiedAmount: { plan: "Pro", price: "US$20", billing: "per month if billed monthly; US$200/year with annual billing" },
  },
  {
    slug: "gemini",
    checkedOn: PRICING_CHECKED_ON,
    pricingUrl: "https://one.google.com/intl/en_in/about/google-ai-plans/",
    planNames: ["Google AI Plus", "Google AI Pro", "Google AI Ultra"],
    priceSummary: "Check Google One for local currency pricing.",
    evidence: "Google's official AI plans comparison lists Plus, Pro and Ultra offerings and shows how benefits vary between plans.",
    caution: "Google AI plan pricing and included benefits are region-dependent. The accessible source did not provide a stable INR price suitable for publishing.",
  },
  {
    slug: "perplexity",
    checkedOn: PRICING_CHECKED_ON,
    pricingUrl: "https://www.perplexity.ai/pro",
    planNames: ["Pro", "Max"],
    priceSummary: "Check the official checkout for monthly or annual offers.",
    evidence: "Perplexity's public product page shows Pro and Max subscriptions with differing usage and research-related benefits.",
    caution: "The public page includes promotional or annual-billing offers that may change. Do not treat promotional prices as permanent month-to-month rates.",
  },
  {
    slug: "adobe-firefly",
    checkedOn: PRICING_LAST_EXPANDED_ON,
    pricingUrl: "https://www.adobe.com/products/firefly/plans.html",
    planNames: ["Firefly Free","Firefly Standard","Firefly Pro"],
    priceSummary: "Check Adobe for regional plan prices and generative-credit allowances.",
    evidence: "Adobe describes limited Free access and paid Standard and Pro plans, with access to generative features governed by credits.",
    caution: "Credits, partner-model usage, promotions and commercial rights differ by plan and market.",
  },
  {
    slug: "canva",
    checkedOn: PRICING_LAST_EXPANDED_ON,
    pricingUrl: "https://www.canva.com/pricing/",
    planNames: ["Free","Pro","Business","Enterprise"],
    priceSummary: "Check Canva for country-specific pricing and plan AI allowances.",
    evidence: "Canva lists Free, Pro, Business and Enterprise plans, with different AI allowances, design assets and collaboration features.",
    caution: "Trials, nonprofit/education eligibility and promotional pricing are not universal subscription rates.",
  },
  {
    slug: "cursor",
    checkedOn: PRICING_LAST_EXPANDED_ON,
    pricingUrl: "https://cursor.com/pricing",
    planNames: ["Free","Plus","Premium","Super","Ultra"],
    priceSummary: "Confirm X Subscription access, usage pools and separate model billing.",
    evidence: "Current Cursor plans include Free, Plus, Premium, Super and Ultra; legacy Hobby and Pro subscriptions follow different terms.",
    caution: "Third-party models can be charged separately at API list prices; legacy plans and taxes differ.",
  },
  {
    slug: "elevenlabs",
    checkedOn: PRICING_LAST_EXPANDED_ON,
    pricingUrl: "https://elevenlabs.io/pricing",
    planNames: ["Free","Starter","Creator","Pro","Scale","Business"],
    priceSummary: "Confirm text-to-speech credits, usage rights and monthly billing.",
    evidence: "ElevenLabs advertises Free, Starter, Creator, Pro, Scale and Business, with different credit allowances.",
    caution: "Black Friday and introductory offers are temporary; credits, seats and commercial rights vary.",
  },
  {
    slug: "github-copilot",
    checkedOn: PRICING_LAST_EXPANDED_ON,
    pricingUrl: "https://docs.github.com/en/copilot/get-started/plans",
    planNames: ["Copilot Free","Copilot Pro","Copilot Pro+","Copilot Max"],
    priceSummary: "Verify GitHub AI Credits, agent features and model access.",
    evidence: "GitHub lists four individual plans and varying monthly credit allowances, model access and agent eligibility.",
    caution: "Business, student and enterprise eligibility, policy and overage rules are separate.",
  },
  {
    slug: "midjourney",
    checkedOn: PRICING_LAST_EXPANDED_ON,
    pricingUrl: "https://docs.midjourney.com/hc/en-us/articles/27870484040333-Comparing-Midjourney-Plans",
    planNames: ["Basic","Standard","Pro","Mega"],
    priceSummary: "Check image and video generation allowances and billing terms.",
    evidence: "Midjourney publishes four subscription tiers; Relax and Stealth modes depend on the plan.",
    caution: "Annual billing is paid upfront; private generations and video allowances have tier-specific restrictions.",
  },
  {
    slug: "notebooklm",
    checkedOn: PRICING_LAST_EXPANDED_ON,
    pricingUrl: "https://support.google.com/gemininotebook/answer/16213268",
    planNames: ["Standard access","With Google AI Plus","With Google AI Pro","With Google AI Ultra"],
    priceSummary: "Check Google AI or Workspace eligibility and source-processing limits.",
    evidence: "Gemini Notebook offers standard access and higher limits for eligible Google AI Plus, Pro, Ultra and Workspace subscribers.",
    caution: "These are access levels linked to Google subscriptions, not four separate Notebook checkouts.",
  },
  {
    slug: "runway",
    checkedOn: PRICING_LAST_EXPANDED_ON,
    pricingUrl: "https://help.runwayml.com/hc/en-us/articles/21664961171475-Which-plan-is-right-for-me",
    planNames: ["Free","Standard","Pro","Max","Team"],
    priceSummary: "Check generation credits, output access and plan billing.",
    evidence: "Runway describes Free, Standard, Pro, Max and Team options with different credit and collaboration limits.",
    caution: "Existing subscribers may see legacy Unlimited terms; credits, usage and model access can change.",
  },
];

export const AI_TOOL_PRICING_MAP = Object.fromEntries(
  AI_TOOL_PRICING.map((item) => [item.slug, item])
) as Partial<Record<string, AiToolPricingRecord>>;

export function getAiToolPricing(slug: string) {
  return AI_TOOL_PRICING_MAP[slug];
}
