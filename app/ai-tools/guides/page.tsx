import type { Metadata } from "next";
import Link from "@/components/app-link";
import { ArrowLeft, ArrowRight, BookOpen, GitCompareArrows } from "lucide-react";
import { AI_COMPARISON_GUIDES, AI_GUIDES_REVIEWED_ON } from "@/lib/ai-tools-comparison-guides";
import { AI_TOOLS_RESEARCH_GUIDES } from "@/lib/ai-tools-research-guides";
import { SITE_NAME } from "@/lib/site";
import "../ai-tools.css";

const description = "Source-led AI tool comparison guides for assistants, coding and research workflows, with decision tables, evaluation tests and documented limitations.";

export const metadata: Metadata = {
  title: "AI Tools Comparison Guides",
  description,
  alternates: { canonical: "/ai-tools/guides" },
  // Two-guide launch archive is navigational rather than a substantive landing.
  robots: { index: false, follow: true },
  openGraph: { title: `AI Tools Comparison Guides | ${SITE_NAME}`, description, url: "/ai-tools/guides" },
};

export default function AiComparisonGuidesIndex() {
  return (
    <main id="main-content" className="ai-tools-page">
      <header className="ai-tools-feature-hero wrap">
        <Link href="/ai-tools" className="ai-tools-back"><ArrowLeft size={17} aria-hidden="true" /> AI Tools Directory</Link>
        <span className="ai-tools-eyebrow">DECODISTA / Editorial research</span>
        <h1>Compare the work. <em>Not the hype.</em></h1>
        <p>Clear, source-based comparisons for people choosing an AI product. We explain which workflow to try, how to verify the important claims and where official documentation stops short.</p>
        <div className="ai-tools-feature-meta"><BookOpen size={17} aria-hidden="true" /> Individually dated, provider-sourced comparisons · No hands-on benchmark claims</div>
      </header>
      <section className="ai-guide-index wrap" aria-labelledby="ai-guide-index-heading">
        <div className="ai-tools-section-heading">
          <div>
            <span className="ai-tools-eyebrow">Decision guides</span>
            <h2 id="ai-guide-index-heading">Choose your comparison</h2>
            <p>Each article includes a decision table, workflow scenarios, practical evaluation steps and official references.</p>
          </div>
          <span className="ai-tools-count-label">{AI_COMPARISON_GUIDES.length + AI_TOOLS_RESEARCH_GUIDES.length} research guides</span>
        </div>
        <div className="ai-guide-index-grid">
          {AI_COMPARISON_GUIDES.map((guide) => (
            <article className="ai-guide-index-card" key={guide.slug}>
              <span className="ai-tools-eyebrow">Provider-documented · Workflow-first</span>
              <h3><Link href={`/ai-tools/guides/${guide.slug}`}>{guide.title}</Link></h3>
              <p>{guide.subtitle}</p>
              <p><small>Official sources checked: <time dateTime={AI_GUIDES_REVIEWED_ON}>21 November 2026</time></small></p>
              <ul>
                <li>{guide.comparison.length} decision dimensions</li>
                <li>{guide.scenarios.length} realistic evaluation scenarios</li>
                <li>{guide.sources.length} official sources</li>
              </ul>
              <Link className="ai-guide-read-link" href={`/ai-tools/guides/${guide.slug}`}>Read the comparison <ArrowRight size={17} aria-hidden="true" /></Link>
            </article>
          ))}
          {AI_TOOLS_RESEARCH_GUIDES.map((guide) => (
            <article className="ai-guide-index-card" key={guide.slug}>
              <span className="ai-tools-eyebrow">Source-based research · No rankings</span>
              <h3><Link href={`/ai-tools/guides/${guide.slug}`}>{guide.title}</Link></h3>
              <p>{guide.subtitle}</p>
              <p><small>Official sources checked: <time dateTime={guide.reviewedOn}>22 November 2026</time></small></p>
              <ul>
                <li>{guide.decisionFactors} decision dimensions</li>
                <li>{guide.scenarios} research scenarios</li>
                <li>{guide.sourceCount} official sources</li>
                <li>{guide.readerTests} reader-run exercises</li>
              </ul>
              <Link className="ai-guide-read-link" href={`/ai-tools/guides/${guide.slug}`}>
                Read the research comparison <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="ai-guide-index-method wrap">
        <GitCompareArrows size={24} aria-hidden="true" />
        <div>
          <h2>What these comparisons are—and are not</h2>
          <p>They are original editorial decision frameworks based on official product documentation. They are not lab benchmarks, hands-on performance reviews, sponsored rankings or guarantees of subscription access. Check current terms before buying and use your own test task to decide between products.</p>
          <Link href="/review-methodology">Read DECODISTA methodology <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  );
}
