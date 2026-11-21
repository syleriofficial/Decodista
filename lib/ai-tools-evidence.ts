/**
 * Manually reviewed, limited provider statements. Not model benchmarks.
 * Recheck these official sources before changing any feature or plan claim.
 * The site must never silently represent them as live/current provider data.
 */
export const AI_EVIDENCE_CHECKED_ON = "2026-11-21";
export const AI_EVIDENCE_REVIEW_INTERVAL_DAYS = 30;

export type AiToolEvidence = {
  slug: "chatgpt" | "claude" | "gemini" | "perplexity" | "github-copilot";
  sourceUrl: string;
  sourceLabel: string;
  checkedOn: string;
  findings: readonly string[];
  caveat: string;
};

export const AI_TOOL_EVIDENCE: readonly AiToolEvidence[] = [
  {
    slug: "chatgpt",
    sourceUrl: "https://chatgpt.com/pricing/",
    sourceLabel: "ChatGPT official plans",
    checkedOn: AI_EVIDENCE_CHECKED_ON,
    findings: [
      "The public individual plans include Free, Go, Plus and Pro.",
      "The Free plan lists limits for uploads, image creation, voice and research.",
      "The Go plan describes expanded usage compared with Free.",
    ],
    caveat: "Limits, tools and checkout currencies can differ by plan, region and time.",
  },
  {
    slug: "claude",
    sourceUrl: "https://claude.com/pricing",
    sourceLabel: "Claude official pricing",
    checkedOn: AI_EVIDENCE_CHECKED_ON,
    findings: [
      "The individual pricing page lists Free, Pro, Max and Ultra plans.",
      "Free includes web, desktop and mobile chat, plus Artifacts.",
      "Pro adds features such as Projects and higher usage, subject to limits.",
    ],
    caveat: "Plan feature availability and usage limits may change. Monthly and annual billing are different.",
  },
  {
    slug: "gemini",
    sourceUrl: "https://one.google.com/intl/en_in/about/google-ai-plans/",
    sourceLabel: "Google One AI plan details (India)",
    checkedOn: AI_EVIDENCE_CHECKED_ON,
    findings: [
      "Google lists AI Plus, AI Pro and AI Ultra subscriptions.",
      "The AI plans page describes Gemini-related benefits and Google app integrations.",
      "Storage allowances and AI access differ by plan.",
    ],
    caveat: "Google benefits and local plan totals vary by location and account. Check local checkout.",
  },
  {
    slug: "perplexity",
    sourceUrl: "https://www.perplexity.ai/pro",
    sourceLabel: "Perplexity Pro and Max overview",
    checkedOn: AI_EVIDENCE_CHECKED_ON,
    findings: [
      "Pro and Max are distinct individual subscription tiers.",
      "The Pro page describes deep research, model selection and file/app creation.",
      "Some prominently displayed prices are annual-billing equivalents or promotional offers.",
    ],
    caveat: "Research limits and promotional offers can change. Confirm the actual billing term at checkout.",
  },
  {
    slug: "github-copilot",
    sourceUrl: "https://docs.github.com/en/copilot/get-started/plans",
    sourceLabel: "GitHub Copilot plan documentation",
    checkedOn: AI_EVIDENCE_CHECKED_ON,
    findings: [
      "GitHub describes Copilot Free, Pro, Pro+ and Max individual tiers.",
      "GitHub AI Credits and available models differ between tiers.",
      "Student and organizational plans have different eligibility and controls.",
    ],
    caveat: "Model access and agent allowances are affected by plan, credits, admin policy and region.",
  },
];

export const AI_TOOL_EVIDENCE_MAP = Object.fromEntries(
  AI_TOOL_EVIDENCE.map((record) => [record.slug, record])
) as Partial<Record<string, AiToolEvidence>>;

export function getAiToolEvidence(slug: string) {
  return AI_TOOL_EVIDENCE_MAP[slug];
}

export function daysSinceEvidenceCheck(date: string, now: Date): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return Number.POSITIVE_INFINITY;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return Number.POSITIVE_INFINITY;
  return Math.max(0, Math.floor((now.getTime() - parsed.getTime()) / 86_400_000));
}

export function isAiEvidenceFresh(date: string, now: Date): boolean {
  return daysSinceEvidenceCheck(date, now) <= AI_EVIDENCE_REVIEW_INTERVAL_DAYS;
}
