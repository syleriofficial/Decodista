/**
 * Editorial source ledger for the initial AI Tools pricing section.
 *
 * Original four sources were reviewed 2026-11-21; twelve further provider plan
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
    | "github-copilot" | "midjourney" | "notebooklm" | "runway"
    | "bolt" | "gamma" | "lovable" | "replit";
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
  {
    slug: "bolt",
    checkedOn: PRICING_LAST_EXPANDED_ON,
    pricingUrl: "https://bolt.new/pricing",
    planNames: ["Free","Pro","Teams","Enterprise"],
    priceSummary: "Check available AI token allowances and workspace billing on the official plan page.",
    evidence: "Bolt lists free and paid options, with paid token allowances and collaboration features differing by subscription.",
    caution: "Token quotas, rollover terms, published app hosting and team-seat billing can affect the total cost.",
  },
  {
    slug: "gamma",
    checkedOn: PRICING_LAST_EXPANDED_ON,
    pricingUrl: "https://gamma.app/en/pricing",
    planNames: ["Free","Plus","Pro","Ultra","Business"],
    priceSummary: "Check AI credits, export options, branding and seats on Gamma's official pricing page.",
    evidence: "Gamma lists individual Free, Plus, Pro and Ultra options and business offerings, with differing generation and collaboration allowances.",
    caution: "Annual billing, AI credits and optional additional seats change the effective cost; verify region and checkout.",
  },
  {
    slug: "lovable",
    checkedOn: PRICING_LAST_EXPANDED_ON,
    pricingUrl: "https://lovable.dev/pricing",
    planNames: ["Free","Pro","Business","Enterprise"],
    priceSummary: "Check Lovable credits, hosting and usage-based billing for each subscription.",
    evidence: "Lovable lists Free, Pro and Business workspaces and enterprise arrangements, with credits for building and hosting.",
    caution: "Credit consumption and workspace limits vary by operation and subscription; do not infer a flat all-in cost.",
  },
  {
    slug: "replit",
    checkedOn: PRICING_LAST_EXPANDED_ON,
    pricingUrl: "https://replit.com/pricing",
    planNames: ["Starter","Core","Pro","Enterprise"],
    priceSummary: "Review Replit credits, deployment resources and usage-based charges on its official plans page.",
    evidence: "Replit lists a Starter entry tier and Core/Pro paid plans, with enterprise terms for larger organizations.",
    caution: "Agent credits, database/hosting consumption and extra usage can be billed separately from the base subscription.",
  },
];

export const AI_TOOL_PRICING_MAP = Object.fromEntries(
  AI_TOOL_PRICING.map((item) => [item.slug, item])
) as Partial<Record<string, AiToolPricingRecord>>;

export function getAiToolPricing(slug: string) {
  return AI_TOOL_PRICING_MAP[slug];
}
