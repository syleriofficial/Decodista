import Link from "@/components/app-link";
import { ArrowRight } from "lucide-react";
import { AI_COMPARISON_GUIDES } from "@/lib/ai-tools-comparison-guides";
import { AI_TOOLS_RESEARCH_GUIDES } from "@/lib/ai-tools-research-guides";

/**
 * Deliberately small, editorially selected cross-links for the four
 * independently reviewed indexable /ai-tools/guides routes.
 *
 * Link destinations are validated against the two reviewed guide registries.
 * Keep this module inside AI Tools; do not promote guides onto news pages.
 * Rationale describes what a reader gains, not a provider performance claim.
 */
const RELATED_BY_SLUG: Record<string, readonly { slug: string; reason: string }[]> = {
  "chatgpt-vs-claude": [
    {
      slug: "chatgpt-vs-gemini-for-research",
      reason: "Compare source citations, project files and connected research workflows with another general-purpose assistant.",
    },
    {
      slug: "perplexity-vs-gemini-notebook",
      reason: "Narrow the decision to finding public evidence versus examining selected source documents.",
    },
  ],
  "cursor-vs-github-copilot": [
    {
      slug: "chatgpt-vs-claude",
      reason: "Explore the broader assistant workflows that sit outside a code editor.",
    },
    {
      slug: "chatgpt-vs-gemini-for-research",
      reason: "For projects with large source dossiers, compare file-grounded research before choosing a working setup.",
    },
  ],
  "perplexity-vs-gemini-notebook": [
    {
      slug: "chatgpt-vs-gemini-for-research",
      reason: "Broaden a source-focused decision to web research, connected services and ongoing project files.",
    },
    {
      slug: "chatgpt-vs-claude",
      reason: "Compare two general-purpose assistants when your next step involves writing and reusable project work.",
    },
  ],
  "chatgpt-vs-gemini-for-research": [
    {
      slug: "perplexity-vs-gemini-notebook",
      reason: "Look more closely at citations from public search and answers grounded in a chosen document collection.",
    },
    {
      slug: "chatgpt-vs-claude",
      reason: "If your task extends beyond research, examine writing, project continuity and reusable outputs.",
    },
  ],
};

const ALL_INDEXABLE_GUIDES = [...AI_COMPARISON_GUIDES, ...AI_TOOLS_RESEARCH_GUIDES];

export function AiToolsRelatedComparisons({ currentSlug }: { currentSlug: string }) {
  const related = (RELATED_BY_SLUG[currentSlug] ?? [])
    .map(({ slug, reason }) => ({
      guide: ALL_INDEXABLE_GUIDES.find((guide) => guide.slug === slug),
      reason,
    }))
    .filter((item) => item.guide !== undefined && item.guide.slug !== currentSlug);
  if (!related.length) return null;

  const headingId = `ai-guide-next-${currentSlug}`;
  return (
    <section className="ai-guide-more wrap" aria-labelledby={headingId}>
      <span className="ai-tools-eyebrow">Continue with a relevant research question</span>
      <h2 id={headingId}>Related AI tool comparisons</h2>
      <div className="ai-guide-more-grid">
        {related.map(({ guide, reason }) => (
          <Link key={guide!.slug} href={`/ai-tools/guides/${guide!.slug}`}>
            <strong>{guide!.title}</strong>
            <span>{reason}</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}
