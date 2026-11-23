import type { Metadata } from "next";
import Link from "@/components/app-link";
import { AiEvidenceStatus } from "@/components/ai-tools-evidence-status";
import { getAiToolEvidence } from "@/lib/ai-tools-evidence";
import { getAiToolPricing } from "@/lib/ai-tools-pricing";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, GitCompareArrows, Info, ShieldCheck } from "lucide-react";
import { AI_TOOLS, findAiTool, getCategoryLabel } from "@/lib/ai-tools";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { notFound } from "next/navigation";
import "../ai-tools.css";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return AI_TOOLS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = findAiTool(slug);
  if (!tool) return { title: "Tool not found", robots: { index: false, follow: true } };
  const description = `${tool.description} Explore common uses, key considerations and similar AI tools on DECODISTA.`;
  return {
    title: `${tool.name} — Overview, Uses & Alternatives`,
    description,
    alternates: { canonical: `/ai-tools/${tool.slug}` },
    // Introductory profiles are not independently evaluated product reviews.
    // Keep out of search indexes and sitemaps until each page receives original research.
    robots: { index: false, follow: true },
    openGraph: {
      type: "website",
      title: `${tool.name} | AI Tools | ${SITE_NAME}`,
      description,
      url: `/ai-tools/${tool.slug}`,
    },
    twitter: { card: "summary", title: `${tool.name} | ${SITE_NAME}`, description },
  };
}

export default async function AiToolProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const tool = findAiTool(slug);
  if (!tool) notFound();

  const source = getAiToolEvidence(tool.slug);
  const pricing = getAiToolPricing(tool.slug);
  const alternatives = AI_TOOLS.filter((candidate) =>
    candidate.category === tool.category && candidate.slug !== tool.slug
  );
  const compareWith = alternatives[0];
  const compareUrl = compareWith
    ? `/ai-tools/compare?first=${encodeURIComponent(tool.slug)}&second=${encodeURIComponent(compareWith.slug)}`
    : `/ai-tools/compare?first=${encodeURIComponent(tool.slug)}`;
  const category = getCategoryLabel(tool.category);
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "AI Tools", item: `${SITE_URL}/ai-tools` },
      { "@type": "ListItem", position: 3, name: tool.name, item: `${SITE_URL}/ai-tools/${tool.slug}` },
    ],
  };

  return (
    <main id="main-content" className="ai-tools-page ai-tool-profile">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <section className="ai-tools-profile-hero wrap">
        <Link href="/ai-tools" className="ai-tools-back">
          <ArrowLeft size={16} aria-hidden="true" /> Back to the AI Tools directory
        </Link>
        <div className="ai-tools-profile-intro">
          <div className="ai-tools-profile-heading">
            <span className="ai-tools-eyebrow">AI Tools / {category}</span>
            <div className="ai-tools-profile-title">
              <span className={`ai-tools-monogram ai-tools-monogram--${tool.category}`} aria-hidden="true">
                {tool.name.slice(0, 2).toUpperCase()}
              </span>
              <h1>{tool.name}</h1>
            </div>
            <p className="ai-tools-profile-provider">By {tool.provider}</p>
            <p className="ai-tools-profile-lede">{tool.description}</p>
            <div className="ai-tools-profile-actions">
              <a className="ai-tools-primary-action" href={tool.officialUrl} target="_blank" rel="noopener noreferrer">
                Official website <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <Link className="ai-tools-secondary-action" href={compareUrl}>
                <GitCompareArrows size={17} aria-hidden="true" /> Compare tools
              </Link>
            </div>
          </div>
          <aside className="ai-tools-profile-summary" aria-label="Quick overview">
            <span className="ai-tools-eyebrow">At a glance</span>
            <dl>
              <div><dt>Provider</dt><dd>{tool.provider}</dd></div>
              <div><dt>Category</dt><dd>{category}</dd></div>
              <div><dt>Directory status</dt><dd>Introductory listing</dd></div>
              <div><dt>Plans & pricing</dt><dd>
                {pricing ? (
                  <>
                    <span>{pricing.planNames.slice(0, 3).join(" · ")}{pricing.planNames.length > 3 ? " · …" : ""}</span>
                    <Link href={`/ai-tools/pricing#plan-${tool.slug}`}> Dated plan sources</Link>
                  </>
                ) : "Confirm with provider"}
              </dd></div>
            </dl>
            <p>Not a hands-on review or a verified live pricing record.</p>
          </aside>
        </div>
      </section>

      <section className="ai-tools-profile-body wrap" aria-label={`${tool.name} profile details`}>
        <div className="ai-tools-profile-main">
          <section className="ai-tools-profile-panel" aria-labelledby="profile-uses-title">
            <span className="ai-tools-eyebrow">01 / Use cases</span>
            <h2 id="profile-uses-title">What people use {tool.name} for</h2>
            <p>These are broad use-case areas for discovery, not independently benchmarked capabilities.</p>
            <ul className="ai-tools-profile-uses">
              {tool.useCases.map((useCase) => (
                <li key={useCase}><span><BookOpen size={17} aria-hidden="true" /></span>{useCase}</li>
              ))}
            </ul>
          </section>
          <section className="ai-tools-profile-panel" aria-labelledby="profile-consider-title">
            <span className="ai-tools-eyebrow">02 / Before you choose</span>
            <h2 id="profile-consider-title">Things worth checking</h2>
            <div className="ai-tools-profile-note">
              <Info size={21} aria-hidden="true" />
              <p>{tool.practicalNote}</p>
            </div>
            <p>
              Compare the available plan with your actual workflow. Check feature availability,
              usage limits, export options and data-handling rules directly with {tool.provider}.
              Offerings and regional access can change.
            </p>
          </section>
          {source && (
            <section className="ai-tools-profile-panel ai-tools-profile-evidence-panel" aria-labelledby="profile-sources-title">
              <span className="ai-tools-eyebrow">03 / Provider documentation</span>
              <h2 id="profile-sources-title">What the official source describes</h2>
              <p>Selected product and plan details from the provider. These are not hands-on test findings.</p>
              <ul className="ai-tools-profile-evidence-list">
                {source.findings.map((finding) => <li key={finding}>{finding}</li>)}
              </ul>
              <p className="ai-tools-evidence-caveat">{source.caveat}</p>
              <AiEvidenceStatus checkedOn={source.checkedOn} />
              <a className="ai-tools-evidence-source" href={source.sourceUrl} target="_blank" rel="noopener noreferrer">
                {source.sourceLabel} <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </section>
          )}
          <section className="ai-tools-profile-panel" aria-labelledby="profile-method-title">
            <span className="ai-tools-eyebrow">Editorial context</span>
            <h2 id="profile-method-title">How to read this profile</h2>
            <p>
              This is a descriptive overview from DECODISTA&apos;s starter directory.
              It does not claim hands-on testing, rank this tool above competitors, or quote live subscription prices.
            </p>
            <Link href="/review-methodology" className="ai-tools-profile-text-link">
              <ShieldCheck size={17} aria-hidden="true" /> Our review methodology <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </section>
        </div>
        <aside className="ai-tools-profile-related" aria-labelledby="related-tools-title">
          <div className="ai-tools-profile-related-card">
            <span className="ai-tools-eyebrow">Same-category discovery</span>
            <h2 id="related-tools-title">Explore alternatives</h2>
            {alternatives.length ? (
              <>
                <p>Other {category.toLowerCase()} tools in this starter directory—not ranked recommendations or direct substitutes.</p>
                <ul>
                  {alternatives.map((candidate) => (
                    <li key={candidate.slug}>
                      <Link href={`/ai-tools/${candidate.slug}`}>
                        <span><strong>{candidate.name}</strong><small>{candidate.provider}</small></span>
                        <ArrowRight size={17} aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : <p>There are no other {category.toLowerCase()} profiles in this starter directory yet. Explore the full list for adjacent workflows.</p>}
            <Link className="ai-tools-profile-browse" href="/ai-tools">Browse all AI tools <ArrowRight size={16} aria-hidden="true" /></Link>
            <div className="ai-tools-profile-more-links">
              <Link href={`/ai-tools/alternatives?tool=${tool.slug}`}>Explore alternatives <ArrowRight size={16} aria-hidden="true" /></Link>
              <Link href="/ai-tools/pricing">Browse sourced pricing <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          </div>
          <div className="ai-tools-profile-verify">
            <strong>Check the source</strong>
            <p>For the latest features, eligibility, subscription limits and licensing, use the provider&apos;s official site.</p>
            <a href={tool.officialUrl} target="_blank" rel="noopener noreferrer">
              Visit {tool.provider} <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </aside>
      </section>
    </main>
  );
}
