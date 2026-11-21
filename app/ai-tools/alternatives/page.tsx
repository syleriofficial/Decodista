import type { Metadata } from "next";
import Link from "@/components/app-link";
import { ArrowLeft, ArrowRight, ArrowUpRight, GitCompareArrows } from "lucide-react";
import { AI_TOOLS, findAiTool, getCategoryLabel } from "@/lib/ai-tools";
import { SITE_NAME } from "@/lib/site";
import "../ai-tools.css";

const description = "Explore AI tools serving similar workflows, with honest same-category discovery rather than fabricated rankings or claims of interchangeable features.";

export const metadata: Metadata = {
  title: "AI Tool Alternatives",
  description,
  alternates: { canonical: "/ai-tools/alternatives" },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    title: `AI Tool Alternatives | ${SITE_NAME}`,
    description,
    url: "/ai-tools/alternatives",
  },
};

type SearchParams = Promise<{ tool?: string | string[] }>;
function firstString(input: string | string[] | undefined) {
  return typeof input === "string" ? input : Array.isArray(input) ? input[0] : undefined;
}

export default async function AlternativesPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const selected = findAiTool(firstString(query.tool) ?? "") ?? findAiTool("chatgpt");
  const candidates = AI_TOOLS.filter((tool) => tool.category === selected.category && tool.slug !== selected.slug);
  const categoryLabel = getCategoryLabel(selected.category);

  return (
    <main id="main-content" className="ai-tools-page">
      <section className="ai-tools-feature-hero wrap">
        <Link className="ai-tools-back" href="/ai-tools"><ArrowLeft size={17} aria-hidden="true" /> Back to AI Tools</Link>
        <span className="ai-tools-eyebrow">Discover related workflows</span>
        <h1>Explore <em>AI tool alternatives.</em></h1>
        <p>Choose a tool to see others in the same broad category. Similar purpose does not guarantee matching features, quality, pricing or data handling.</p>
      </section>
      <section className="ai-tools-alternatives-section wrap" aria-labelledby="alternatives-heading">
        <div className="ai-tools-section-heading"><div><span className="ai-tools-eyebrow">Choose your starting point</span><h2 id="alternatives-heading">What are you considering?</h2></div></div>
        <form className="ai-tools-alternatives-form" action="/ai-tools/alternatives" method="get">
          <label htmlFor="ai-alternative-tool">Select a tool</label>
          <div className="ai-tools-alternatives-fields">
            <select name="tool" id="ai-alternative-tool" defaultValue={selected.slug}>
              {AI_TOOLS.map((tool) => <option key={tool.slug} value={tool.slug}>{tool.name}</option>)}
            </select>
            <button type="submit">Find alternatives <ArrowRight size={16} aria-hidden="true" /></button>
          </div>
        </form>

        <div className="ai-tools-alternatives-context">
          <div className="ai-tools-alternatives-context-heading">
            <span className={`ai-tools-monogram ai-tools-monogram--${selected.category}`} aria-hidden="true">{selected.name.slice(0, 2).toUpperCase()}</span>
            <div><span className="ai-tools-eyebrow">Your starting tool</span><h2>{selected.name}</h2><p>By {selected.provider} · {categoryLabel}</p></div>
          </div>
          <p>{selected.description}</p>
          <Link href={`/ai-tools/${selected.slug}`}>Read {selected.name} overview <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="ai-tools-section-heading ai-tools-alternatives-results-heading">
          <div><span className="ai-tools-eyebrow">Similar category · Not a ranking</span><h2>Other {categoryLabel.toLowerCase()} tools</h2><p>Use these listings as starting points, then inspect actual plan terms and capabilities before choosing.</p></div>
          <span className="ai-tools-count-label">{candidates.length} {candidates.length === 1 ? "listing" : "listings"}</span>
        </div>
        {candidates.length ? (
          <div className="ai-tools-alternatives-grid">
            {candidates.map((candidate) => (
              <article className="ai-tools-alternative-card" key={candidate.slug}>
                <span className="ai-tools-eyebrow">Same-category discovery</span>
                <h3><Link href={`/ai-tools/${candidate.slug}`}>{candidate.name}</Link></h3>
                <p className="ai-tools-provider">By {candidate.provider}</p>
                <p>{candidate.description}</p>
                <ul>{candidate.useCases.map((item) => <li key={item}>{item}</li>)}</ul>
                <div className="ai-tools-alternative-actions">
                  <Link href={`/ai-tools/compare?first=${selected.slug}&second=${candidate.slug}`}>
                    <GitCompareArrows size={16} aria-hidden="true" /> Compare with {selected.name}
                  </Link>
                  <a href={candidate.officialUrl} target="_blank" rel="noopener noreferrer">Official site <ArrowUpRight size={16} aria-hidden="true" /></a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="ai-tools-alternatives-empty">
            <h3>No same-category alternative listed yet</h3>
            <p>Our starter directory currently has only one {categoryLabel.toLowerCase()} listing. We won&apos;t invent matches or call unrelated tools direct substitutes.</p>
            <Link href="/ai-tools">Browse the full directory <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        )}
      </section>
      <section className="ai-tools-alternatives-note wrap">
        <strong>What &ldquo;alternative&rdquo; means here</strong>
        <p>These are other products placed in the same broad discovery category. They have not been ranked, tested against one another, or confirmed as feature-for-feature replacements. Check product documentation, subscription terms, privacy and current availability before making a switch.</p>
        <Link href="/ai-tools/pricing">View source-linked pricing research <ArrowRight size={16} aria-hidden="true" /></Link>
      </section>
    </main>
  );
}
