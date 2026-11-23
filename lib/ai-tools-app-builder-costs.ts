/**
 * Official-provider billing differences for prompt-driven app builders.
 * Reviewed 2026-11-23. Not live billing, a price quote or a ranking.
 * Credits and tokens are NON-COMPARABLE units between providers.
 */
export const APP_BUILDER_COSTS_REVIEWED_ON = "2026-11-23";

export type AppBuilderCost = {
  slug: "lovable" | "bolt" | "replit";
  name: string;
  meter: string;
  freeStart: string;
  runningCosts: string;
  teamwork: string;
  question: string;
  sourceUrl: string;
};

const APP_BUILDER_COSTS: readonly AppBuilderCost[] = [
  {
    slug: "lovable",
    name: "Lovable",
    meter: "Shared workspace credits can be used for building, hosting and in-app AI usage; task costs vary.",
    freeStart: "The published Free allowance is 5 daily build credits (up to 30 per month), plus Cloud and app-AI grants.",
    runningCosts: "Hosting and in-app AI can draw from the credit balance when included grants are exhausted; live-app traffic can change usage.",
    teamwork: "The pricing FAQ says workspaces share credits and are not priced per invited seat.",
    question: "How much will app-building, traffic, databases and app AI consume together?",
    sourceUrl: "https://lovable.dev/pricing",
  },
  {
    slug: "bolt",
    name: "Bolt",
    meter: "Project-building usage is measured in AI tokens. Larger project context can use more tokens per message.",
    freeStart: "The published Free plan includes 1 million tokens per month, capped at 300,000 daily, and limited website hosting.",
    runningCosts: "Hosting requests, branded sites, domains and allowances depend on plan. Pro includes higher token and hosting limits.",
    teamwork: "Teams subscriptions are priced per paid team member; tokens are not pooled across members.",
    question: "Will my project's growing file context and daily token cap fit the plan?",
    sourceUrl: "https://bolt.new/pricing",
  },
  {
    slug: "replit",
    name: "Replit",
    meter: "Subscription credits cover Agent, publishing, database and platform usage up to plan limits; overages can be billed.",
    freeStart: "The official Starter documentation describes limited daily Agent credits and monthly cloud credits; check account limits.",
    runningCosts: "Agent work, publishing and database services share credits; usage beyond the allocation may incur extra charges.",
    teamwork: "Core and Pro support plan-specific collaborator limits; the current billing docs say Pro does not charge per seat.",
    question: "What monthly spending limit and resource budget will protect my deployed app?",
    sourceUrl: "https://docs.replit.com/category/billing",
  },
];

export function getAppBuilderCost(slug: string): AppBuilderCost | undefined {
  return APP_BUILDER_COSTS.find((item) => item.slug === slug);
}
