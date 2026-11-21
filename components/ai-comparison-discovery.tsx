import Link from "@/components/app-link";
import { ArrowRight, BookOpen, GitCompareArrows } from "lucide-react";
import { AI_COMPARISON_GUIDES, AI_GUIDES_REVIEWED_ON } from "@/lib/ai-tools-comparison-guides";

/**
 * Contextual editorial discovery for two researched, indexable guides.
 * Kept separate from the starter noindex tools directory and unverified listings.
 */
export function AiComparisonDiscovery({ placement }: { placement: "home" | "category" }) {
  return (
    <section className={`editorial-ai-guides editorial-ai-guides--${placement} wrap`} aria-labelledby={`editorial-ai-guides-title-${placement}`}>
      <div className="editorial-ai-guides-heading">
        <div>
          <span className="eyebrow"><BookOpen size={15} aria-hidden="true" /> DECODISTA / Comparison research</span>
          <h2 id={`editorial-ai-guides-title-${placement}`}>Choosing an AI tool? Compare the workflow.</h2>
          <p>Explore original, source-linked comparisons that explain when to try each tool, which trade-offs matter, and how to test them yourself. No untested winners or paid rankings.</p>
        </div>
        <Link href="/ai-tools/guides" className="editorial-ai-guides-archive">All comparison guides <ArrowRight size={17} aria-hidden="true" /></Link>
      </div>
      <div className="editorial-ai-guides-grid">
        {AI_COMPARISON_GUIDES.map((guide) => (
          <article className="editorial-ai-guide" key={guide.slug}>
            <span className="editorial-ai-guide-category"><GitCompareArrows size={16} aria-hidden="true" /> Workflow comparison</span>
            <h3><Link href={`/ai-tools/guides/${guide.slug}`}>{guide.title}</Link></h3>
            <p>{guide.subtitle}</p>
            <Link href={`/ai-tools/guides/${guide.slug}`} className="editorial-ai-guide-action">
              Read the source-led guide <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
      <p className="editorial-ai-guides-note">Official documentation reviewed <time dateTime={AI_GUIDES_REVIEWED_ON}>21 November 2026</time>. These comparisons are not hands-on model benchmarks; verify current plan details with providers.</p>
    </section>
  );
}
