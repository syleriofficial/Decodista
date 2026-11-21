import type { Metadata } from "next";
import Link from "@/components/app-link";
import { ArrowRight, ArrowUpRight, BookOpen, GitCompareArrows, Search } from "lucide-react";
import { AiToolsExplorer } from "@/components/ai-tools-explorer";
import { AI_TOOLS } from "@/lib/ai-tools";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./ai-tools.css";

const description =
  "Explore a curated starter directory of AI assistants, research, coding, design, video and voice tools. Search by use case and compare two tools side by side.";

export const metadata: Metadata = {
  title: "AI Tools Directory & Comparison",
  description,
  alternates: { canonical: "/ai-tools" },
  // Keep this early directory noindex until individual claims and discovery content
  // have passed the full editorial review process.
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    title: `AI Tools Directory | ${SITE_NAME}`,
    description,
    url: "/ai-tools",
  },
  twitter: { card: "summary", title: `AI Tools Directory | ${SITE_NAME}`, description },
};

export default function AIToolsPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "AI Tools", item: `${SITE_URL}/ai-tools` },
    ],
  };

  return (
    <main id="main-content" className="ai-tools-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <section className="ai-tools-hero wrap" aria-labelledby="ai-tools-hero-title">
        <div className="ai-tools-hero-copy">
          <span className="ai-tools-kicker"><span className="ai-tools-kicker-dot" /> DECODISTA / AI DISCOVERY</span>
          <h1 id="ai-tools-hero-title">Find the right <em>AI tool</em> for the job.</h1>
          <p className="ai-tools-hero-lede">
            Less hype, clearer choices. Browse tools by the work you need to do,
            then compare their focus and everyday uses side by side.
          </p>
          <div className="ai-tools-hero-actions">
            <a href="#ai-tools-directory-heading" className="ai-tools-primary-action"><Search size={17} aria-hidden="true" /> Explore tools <ArrowRight size={17} aria-hidden="true" /></a>
            <Link href="/ai-tools/compare" className="ai-tools-secondary-action"><GitCompareArrows size={17} aria-hidden="true" /> Compare tools</Link>
          </div>
          <div className="ai-tools-hero-stats">
            <div><strong>{AI_TOOLS.length}</strong><span>starting listings</span></div>
            <div><strong>6</strong><span>use-case categories</span></div>
            <div><strong>0</strong><span>invented ratings</span></div>
          </div>
        </div>
        <div className="ai-tools-hero-art" aria-hidden="true">
          <div className="ai-tools-art-label">DISCOVER / COMPARE</div>
          <div className="ai-tools-art-card ai-tools-art-card-one"><span className="ai-tools-art-symbol">AI</span><span>Find a starting point</span><span className="ai-tools-art-line" /></div>
          <div className="ai-tools-art-card ai-tools-art-card-two"><span className="ai-tools-art-symbol">↔</span><span>Compare the essentials</span><span className="ai-tools-art-line" /></div>
          <div className="ai-tools-art-footer"><span>NO LEADERBOARD</span><span>NO PAY-TO-RANK CLAIMS</span></div>
        </div>
      </section>

      <div className="ai-tools-utility-strip wrap">
        <span>Built for informed choices, not popularity contests</span>
        <span><BookOpen size={16} aria-hidden="true" /> Descriptive listings · Official links · No fabricated scores</span>
      </div>

      <nav className="ai-tools-decision-links wrap" aria-label="Explore AI tools by decision">
        <Link href="/ai-tools/pricing" className="ai-tools-decision-link">
          <span className="ai-tools-eyebrow">Know the costs</span>
          <strong>Pricing &amp; Plans</strong>
          <span>Official sources, dated checks and clear caveats <ArrowRight size={16} aria-hidden="true" /></span>
        </Link>
        <Link href="/ai-tools/alternatives" className="ai-tools-decision-link">
          <span className="ai-tools-eyebrow">Consider other options</span>
          <strong>Alternatives</strong>
          <span>Other tools for related workflows, without rankings <ArrowRight size={16} aria-hidden="true" /></span>
        </Link>
      </nav>

      <AiToolsExplorer />

      <section className="ai-tools-method wrap" aria-labelledby="ai-tools-method-title">
        <div className="ai-tools-method-head">
          <span className="ai-tools-eyebrow">A note on comparisons</span>
          <h2 id="ai-tools-method-title">What this directory does—and doesn&apos;t—measure</h2>
          <p>Our starter comparison focuses on what each product is made for, not a universal &ldquo;best tool&rdquo; score.</p>
        </div>
        <div className="ai-tools-method-grid">
          <article><span>01 / PURPOSE</span><h3>Find the job fit</h3><p>Start with the kind of work you want to complete. Different tools serve different workflows.</p></article>
          <article><span>02 / CONTEXT</span><h3>Know the caveats</h3><p>See practical notes and follow official links for the most current features, access and usage rights.</p></article>
          <article><span>03 / TRANSPARENCY</span><h3>No untested verdicts</h3><p>These profiles do not imply benchmark testing, first-hand review or verified real-time subscription prices.</p></article>
        </div>
      </section>

      <section className="ai-tools-next wrap" aria-labelledby="ai-tools-next-title">
        <div>
          <span className="ai-tools-eyebrow">Also on DECODISTA</span>
          <h2 id="ai-tools-next-title">Go beyond the tool list.</h2>
          <p>Explore AI news and practical guides separately from the directory.</p>
        </div>
        <div className="ai-tools-next-links">
          <Link href="/ai">AI reporting <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <Link href="/how-to">How-To guides <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <Link href="/review-methodology">Review methodology <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  );
}
