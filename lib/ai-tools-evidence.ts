/**
 * Manually reviewed, limited provider statements. Not model benchmarks.
 * Recheck these official sources before changing any feature or plan claim.
 * The site must never silently represent them as live/current provider data.
 */
export const AI_EVIDENCE_CHECKED_ON = "2026-11-21";
export const AI_EVIDENCE_REVIEW_INTERVAL_DAYS = 30;

export type AiToolEvidence = {
  slug: "chatgpt" | "claude" | "gemini" | "perplexity" | "github-copilot"
    | "adobe-firefly" | "canva" | "cursor" | "elevenlabs" | "midjourney" | "notebooklm" | "runway"
    | "bolt" | "gamma" | "lovable" | "replit";
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

  {
    slug: "adobe-firefly",
    sourceUrl: "https://www.adobe.com/in/products/firefly.html",
    sourceLabel: "Adobe Firefly product features (India)",
    checkedOn: "2026-11-22",
    findings: [
      "Adobe describes text-driven image and video creation as Firefly capabilities.",
      "Its image workflows include AI editing and Generative Fill.",
      "Some premium and partner-model generations consume plan-based generative credits.",
    ],
    caveat: "Model availability, credit consumption, usage rights and promotional entitlements depend on feature, plan and market.",
  },
  {
    slug: "canva",
    sourceUrl: "https://www.canva.com/help/use-magic-design/",
    sourceLabel: "Canva Help: Magic Design",
    checkedOn: "2026-11-22",
    findings: [
      "Magic Design uses a prompt, uploaded images or ideas to generate design suggestions.",
      "Suggested designs can be customized with a user's own photos, video and text.",
      "Canva also offers stock media and AI-generated media for design workflows.",
    ],
    caveat: "Feature access, stock-asset rights and template availability may differ by plan; generated outputs still require human checking.",
  },
  {
    slug: "cursor",
    sourceUrl: "https://cursor.com/docs/agent/overview",
    sourceLabel: "Cursor Docs: Agent overview",
    checkedOn: "2026-11-22",
    findings: [
      "Cursor Agent can inspect a codebase and edit project files.",
      "Its supported tools can search files and run terminal commands.",
      "Agent checkpoints can preserve snapshots before significant edits.",
    ],
    caveat: "Review and test generated changes before deployment; tool permissions, environments and plan limits may vary.",
  },
  {
    slug: "elevenlabs",
    sourceUrl: "https://elevenlabs.io/docs/eleven-creative/quickstart",
    sourceLabel: "ElevenLabs: ElevenCreative quickstart",
    checkedOn: "2026-11-22",
    findings: [
      "ElevenCreative supports text-to-speech and voice-changing workflows.",
      "Its creative tools include sound effects and dubbing workflows.",
      "The documentation describes voice-cloning and Studio narration workflows.",
    ],
    caveat: "Obtain consent for voice use; verify cloning permissions, commercial rights and generation limits for the account.",
  },
  {
    slug: "midjourney",
    sourceUrl: "https://docs.midjourney.com/hc/en-us/articles/32764383466893-Editor",
    sourceLabel: "Midjourney documentation: Editor",
    checkedOn: "2026-11-22",
    findings: [
      "The Midjourney Editor can modify images from a user's gallery.",
      "Its editing tools include regional erasure and broader retexturing workflows.",
      "Layers can be used to add reference imagery to an edit.",
    ],
    caveat: "The Editor's availability, permitted source material, privacy options and output rights require checking the current account terms.",
  },
  {
    slug: "notebooklm",
    sourceUrl: "https://workspace.google.com/intl/en_in/products/gemini-notebook/",
    sourceLabel: "Google Workspace: Gemini Notebook (formerly NotebookLM)",
    checkedOn: "2026-11-22",
    findings: [
      "Google renamed NotebookLM to Gemini Notebook in July 2026.",
      "The product accepts source material such as PDFs, Google Docs and web URLs.",
      "It helps research and learning with source-grounded responses and citations.",
    ],
    caveat: "Supported formats, citation quality, app availability and usage limits may differ by plan and surface; verify against original sources.",
  },
  {
    slug: "runway",
    sourceUrl: "https://help.runwayml.com/hc/en-us/articles/37425232841875-Getting-Started-with-Generative-Video",
    sourceLabel: "Runway Help: Getting Started with Generative Video",
    checkedOn: "2026-11-22",
    findings: [
      "Runway's creative workspace provides text-to-video generation.",
      "Image-to-video lets a supplied image guide a generated scene.",
      "Model choices can differ in generation speed, output behavior and required credits.",
    ],
    caveat: "Available models, credit costs, output restrictions and rights change; check the selected model and account terms.",
  },
  {
    slug: "bolt",
    sourceUrl: "https://support.bolt.new/building/intro-bolt",
    sourceLabel: "Bolt: introduction to building",
    checkedOn: "2026-11-23",
    findings: [
      "Bolt describes building websites, web apps and mobile apps with AI.",
      "The product provides a project editing workflow and publishing through Bolt Cloud.",
      "Deployment access and AI token usage are subject to account limits."
    ],
    caveat: "Hosted app behavior, framework support, token allowances and publishing rights vary by plan and should be checked.",
  },
  {
    slug: "gamma",
    sourceUrl: "https://help.gamma.app/en/articles/7838093-how-do-i-create-a-new-presentation-document-or-webpage-in-gamma",
    sourceLabel: "Gamma Help: create presentations, documents and webpages",
    checkedOn: "2026-11-23",
    findings: [
      "Gamma's creation flow supports presentation, document and webpage formats.",
      "Users can generate a new visual project from a prompt or supplied content.",
      "The editor permits AI-assisted revisions after generation."
    ],
    caveat: "Export format, branding options, AI credits and team permissions depend on the active plan.",
  },
  {
    slug: "lovable",
    sourceUrl: "https://lovable.dev/build/web-app-builder",
    sourceLabel: "Lovable: AI web app builder",
    checkedOn: "2026-11-23",
    findings: [
      "Lovable describes prompt-driven creation of full-stack web applications.",
      "The product supports app databases, logins and hosting capabilities.",
      "It describes integrations for services such as payments and email."
    ],
    caveat: "Generated code needs independent security review; cloud and AI credit charges can be separate from workspace subscription terms.",
  },
  {
    slug: "replit",
    sourceUrl: "https://replit.com/products/agent",
    sourceLabel: "Replit: Agent product overview",
    checkedOn: "2026-11-23",
    findings: [
      "Replit Agent supports building apps and websites from natural-language requirements.",
      "Replit provides a cloud environment to edit and work on app code.",
      "Publishing and deployments are supported within the platform."
    ],
    caveat: "Agent usage, hosting, compute, collaboration and deployment allowances vary by plan and resource use.",
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
