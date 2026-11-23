import type { Metadata } from "next";
import Link from "@/components/app-link";
import { ArrowLeft, ArrowRight, ArrowUpRight, GitCompareArrows } from "lucide-react";
import { AI_TOOLS, findAiTool, getCategoryLabel, type AiTool } from "@/lib/ai-tools";
import { AI_ALTERNATIVE_JOBS, getAlternativeGroups, type AiAlternativeMatch } from "@/lib/ai-tools-alternatives";
import { getAiToolEvidence } from "@/lib/ai-tools-evidence";
import { SITE_NAME } from "@/lib/site";
import "../ai-tools.css";

const description = "Explore tool alternatives by stated use cases, not just categories. See where documented workflows overlap and where tools serve different jobs.";

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

type SearchParams = Promise<{ tool?: string | string[]; job?: string | string[] }>;
function firstString(input: string | string[] | undefined) {
  return typeof input === "string" ? input : Array.isArray(input) ? input[0] : undefined;
}

function AlternativeCard({ selected, candidate, related }: {
  selected: AiTool;
  candidate: AiAlternativeMatch;
  related?: boolean;
}) {
  const evidence = getAiToolEvidence(candidate.tool.slug);
  return (
    <article className={related
      ? "ai-tools-alternative-card ai-tools-alternative-secondary-card"
      : "ai-tools-alternative-card ai-tools-alternative-match-card"}>
      <span className="ai-tools-eyebrow">{related ? "Different workflow focus" : "Shared listed use case"}</span>
      <h3><Link href={`/ai-tools/${candidate.tool.slug}`}>{candidate.tool.name}</Link></h3>
      <p className="ai-tools-provider">By {candidate.tool.provider}</p>
      <p>{candidate.tool.description}</p>
      {candidate.sharedJobs.length > 0 && (
        <div className="ai-tools-alternative-overlap">
          <strong>{related ? "Shared in other areas" : "Shared work in the current directory"}</strong>
          <ul>{candidate.sharedJobs.map((job) => <li key={job}>{AI_ALTERNATIVE_JOBS[job]}</li>)}</ul>
        </div>
      )}
      {related && candidate.sharedJobs.length === 0 && (
        <p className="ai-tools-alternative-distinction">No identical workflow label is currently documented for this pair. Consider the different jobs they are built for.</p>
      )}
      <div className="ai-tools-alternative-evidence">
        {evidence ? (
          <span>Provider information checked <time dateTime={evidence.checkedOn}>{evidence.checkedOn}</time>. <a href={evidence.sourceUrl} target="_blank" rel="noopener noreferrer">Official source <ArrowUpRight size={14} aria-hidden="true" /></a></span>
        ) : (
          <span>Detailed provider verification pending. No feature equivalence claimed.</span>
        )}
      </div>
      <div className="ai-tools-alternative-actions">
        <Link href={`/ai-tools/compare?first=${selected.slug}&second=${candidate.tool.slug}`}>
          <GitCompareArrows size={16} aria-hidden="true" /> Compare with {selected.name}
        </Link>
        <a href={candidate.tool.officialUrl} target="_blank" rel="noopener noreferrer">Official site <ArrowUpRight size={16} aria-hidden="true" /></a>
      </div>
    </article>
  );
}

export default async function AlternativesPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const selected = findAiTool(firstString(query.tool) ?? "") ?? findAiTool("chatgpt");
  const { selectedJobs, selectedJob, matched, related } = getAlternativeGroups(selected, firstString(query.job));
  const categoryLabel = getCategoryLabel(selected.category);

  return (
    <main id="main-content" className="ai-tools-page">
      <section className="ai-tools-feature-hero wrap">
        <Link className="ai-tools-back" href="/ai-tools"><ArrowLeft size={17} aria-hidden="true" /> Back to AI Tools</Link>
        <span className="ai-tools-eyebrow">Explore a common job first</span>
        <h1>Explore <em>AI tool alternatives.</em></h1>
        <p>Start with the work you need done. Tools in the same broad category are not necessarily interchangeable, so we separate documented task overlap from other related products.</p>
      </section>
      <section className="ai-tools-alternatives-section wrap" aria-labelledby="alternatives-heading">
        <div className="ai-tools-section-heading"><div><span className="ai-tools-eyebrow">Make a focused selection</span><h2 id="alternatives-heading">What are you considering?</h2></div></div>
        <form className="ai-tools-alternatives-form" action="/ai-tools/alternatives" method="get">
          <div className="ai-tools-alternatives-fields">
            <label htmlFor="ai-alternative-tool">Starting tool
              <select name="tool" id="ai-alternative-tool" defaultValue={selected.slug}>
                {AI_TOOLS.map((tool) => <option key={tool.slug} value={tool.slug}>{tool.name}</option>)}
              </select>
            </label>
            <label htmlFor="ai-alternative-job">My main task
              <select name="job" id="ai-alternative-job" defaultValue={selectedJob ?? ""}>
                <option value="">All listed workflows</option>
                {selectedJobs.map((job) => <option key={job} value={job}>{AI_ALTERNATIVE_JOBS[job]}</option>)}
              </select>
            </label>
            <button type="submit">Find alternatives <ArrowRight size={16} aria-hidden="true" /></button>
          </div>
          <p className="ai-tools-alternatives-hint">Changing the starting tool and submitting will show its valid task choices. Invalid task links fall back to all workflows.</p>
        </form>

        <div className="ai-tools-alternatives-context">
          <div className="ai-tools-alternatives-context-heading">
            <span className={`ai-tools-monogram ai-tools-monogram--${selected.category}`} aria-hidden="true">{selected.name.slice(0, 2).toUpperCase()}</span>
            <div><span className="ai-tools-eyebrow">Your starting tool</span><h2>{selected.name}</h2><p>By {selected.provider} · {categoryLabel}</p></div>
          </div>
          <p>{selected.description}</p>
          <Link href={`/ai-tools/${selected.slug}`}>Read {selected.name} overview <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>

        <section aria-labelledby="ai-alternative-matched-title">
          <div className="ai-tools-section-heading ai-tools-alternatives-results-heading">
            <div><span className="ai-tools-eyebrow">Workflow overlap · Not a ranking</span><h2 id="ai-alternative-matched-title">Options with shared stated uses</h2>
              <p>{selectedJob ? `Showing tools also listed for ${AI_ALTERNATIVE_JOBS[selectedJob].toLowerCase()}.` : "These tools share at least one curated task label with the starting product. That does not verify equal functionality."}</p></div>
            <span className="ai-tools-count-label">{matched.length} {matched.length === 1 ? "match" : "matches"}</span>
          </div>
          {matched.length ? (
            <div className="ai-tools-alternatives-grid">
              {matched.map((candidate) => <AlternativeCard key={candidate.tool.slug} selected={selected} candidate={candidate} />)}
            </div>
          ) : (
            <div className="ai-tools-alternatives-empty">
              <h3>No documented task overlap in this starter directory</h3>
              <p>We do not invent an alternative when the current evidence does not show the same task. Broader category options, where available, appear separately below.</p>
            </div>
          )}
        </section>

        {related.length > 0 && (
          <section className="ai-tools-alternatives-secondary" aria-labelledby="ai-alternative-related-title">
            <div className="ai-tools-section-heading ai-tools-alternatives-results-heading">
              <div><span className="ai-tools-eyebrow">Related, not equivalent</span><h2 id="ai-alternative-related-title">Different work in the same category</h2>
                <p>These products share a broad category with {selected.name}, but do not have a listed match for {selectedJob ? "your selected task" : "the same specific workflow"}.</p></div>
              <span className="ai-tools-count-label">{related.length} {related.length === 1 ? "listing" : "listings"}</span>
            </div>
            <div className="ai-tools-alternatives-grid">
              {related.map((candidate) => <AlternativeCard key={candidate.tool.slug} selected={selected} candidate={candidate} related />)}
            </div>
          </section>
        )}
      </section>

      <section className="ai-tools-alternatives-note wrap">
        <strong>How alternatives are classified</strong>
        <p>DECODISTA manually assigns a small set of stated workflow labels based on the descriptions and dated official-source checks in its 12-tool directory. Matching labels show a shared type of work, not identical features, independently tested results, interchangeable plans or product rankings. Recheck official documents before switching.</p>
        <Link href="/ai-tools/pricing">View source-linked pricing research <ArrowRight size={16} aria-hidden="true" /></Link>
      </section>
    </main>
  );
}
