import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/app-link";
import { AiComparisonEvaluation } from "@/components/ai-comparison-evaluation";
import { getAiEvaluationTasks } from "@/lib/ai-tools-evaluation";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, CircleHelp, GitCompareArrows } from "lucide-react";
import { AI_TOOLS } from "@/lib/ai-tools";
import { AI_COMPARISON_GUIDES, AI_GUIDES_REVIEWED_ON, findAiComparisonGuide } from "@/lib/ai-tools-comparison-guides";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "../../ai-tools.css";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return AI_COMPARISON_GUIDES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = findAiComparisonGuide(slug);
  if (!guide) return { title: "Comparison not found", robots: { index: false, follow: true } };
  const description = guide.subtitle;
  return {
    title: guide.title,
    description,
    alternates: { canonical: `/ai-tools/guides/${guide.slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      title: guide.title,
      description,
      url: `/ai-tools/guides/${guide.slug}`,
      publishedTime: AI_GUIDES_REVIEWED_ON,
      modifiedTime: AI_GUIDES_REVIEWED_ON,
    },
    twitter: { card: "summary", title: `${guide.title} | ${SITE_NAME}`, description },
  };
}

export default async function AiComparisonGuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = findAiComparisonGuide(slug);
  if (!guide) notFound();

  const first = AI_TOOLS.find((tool) => tool.slug === guide.firstSlug)!;
  const second = AI_TOOLS.find((tool) => tool.slug === guide.secondSlug)!;
  const compareUrl = `/ai-tools/compare?first=${first.slug}&second=${second.slug}`;
  const otherGuides = AI_COMPARISON_GUIDES.filter((item) => item.slug !== guide.slug);
  const structured = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "AI Tools", item: `${SITE_URL}/ai-tools` },
        { "@type": "ListItem", position: 3, name: "Comparison Guides", item: `${SITE_URL}/ai-tools/guides` },
        { "@type": "ListItem", position: 4, name: guide.title, item: `${SITE_URL}/ai-tools/guides/${guide.slug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.subtitle,
      datePublished: AI_GUIDES_REVIEWED_ON,
      dateModified: AI_GUIDES_REVIEWED_ON,
      mainEntityOfPage: `${SITE_URL}/ai-tools/guides/${guide.slug}`,
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    },
  ];

  return (
    <main id="main-content" className="ai-tools-page ai-guide-page">
      {structured.map((item, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />)}
      <header className="ai-guide-hero wrap">
        <Link className="ai-tools-back" href="/ai-tools/guides"><ArrowLeft size={17} aria-hidden="true" /> Comparison Guides</Link>
        <span className="ai-tools-eyebrow">DECODISTA / WORKFLOW COMPARISON</span>
        <h1>{guide.title}</h1>
        <p className="ai-guide-subtitle">{guide.subtitle}</p>
        <div className="ai-guide-byline">
          <span>DECODISTA Editorial Research</span>
          <span aria-hidden="true">·</span>
          <span>Official sources checked <time dateTime={AI_GUIDES_REVIEWED_ON}>21 November 2026</time></span>
          <span aria-hidden="true">·</span>
          <span>No hands-on benchmark claimed</span>
        </div>
        <div className="ai-guide-hero-actions">
          <Link href={compareUrl}><GitCompareArrows size={17} aria-hidden="true" /> Open interactive comparison</Link>
          <Link href="/review-methodology"><BookOpen size={17} aria-hidden="true" /> Review methodology</Link>
          <a href="#test-it-yourself"><BookOpen size={17} aria-hidden="true" /> Run a fair test</a>
        </div>
      </header>

      <div className="ai-guide-layout wrap">
        <article className="ai-guide-article">
          <section className="ai-guide-intro" aria-label="Comparison overview">
            {guide.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
          <section id="key-differences" className="ai-guide-section" aria-labelledby="ai-guide-table-heading">
            <span className="ai-tools-eyebrow">01 / Product positioning</span>
            <h2 id="ai-guide-table-heading">The differences that affect your workflow</h2>
            <p>These are documented product positions and editorial considerations, not benchmark scores or promises of identical plan access.</p>
            <div className="ai-tools-table-scroll" role="region" aria-label="Comparison dimensions" tabIndex={0}>
              <table className="ai-tools-compare-table ai-guide-table">
                <caption className="sr-only">{first.name} and {second.name} feature context and decision considerations</caption>
                <thead>
                  <tr><th scope="col">Decision factor</th><th scope="col">{first.name}</th><th scope="col">{second.name}</th><th scope="col">Why it matters</th></tr>
                </thead>
                <tbody>
                  {guide.comparison.map((item) => (
                    <tr key={item.dimension}>
                      <th scope="row">{item.dimension}</th>
                      <td>{item.first}</td>
                      <td>{item.second}</td>
                      <td>{item.significance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="who-should-try-what" className="ai-guide-section" aria-labelledby="ai-guide-scenarios-heading">
            <span className="ai-tools-eyebrow">02 / Choose by use case</span>
            <h2 id="ai-guide-scenarios-heading">Where to start for different tasks</h2>
            <p>These suggestions are based on documented workflow fit. They are starting points for evaluation, not product awards.</p>
            <div className="ai-guide-scenarios">
              {guide.scenarios.map((scenario, i) => (
                <div className="ai-guide-scenario" key={scenario.title}>
                  <span className="ai-guide-scenario-number">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{scenario.title}</h3>
                    <strong>{scenario.startingPoint}</strong>
                    <p>{scenario.why}</p>
                    <p className="ai-guide-check"><b>What to verify:</b> {scenario.check}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="analysis" className="ai-guide-section" aria-labelledby="ai-guide-analysis-heading">
            <span className="ai-tools-eyebrow">03 / Editorial analysis</span>
            <h2 id="ai-guide-analysis-heading">How to make a defensible choice</h2>
            {guide.insights.map((insight) => (
              <div className="ai-guide-insight" key={insight.title}>
                <h3>{insight.title}</h3>
                {insight.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            ))}
          </section>

          <section id="verdict" className="ai-guide-section" aria-labelledby="ai-guide-conclusion-heading">
            <span className="ai-tools-eyebrow">04 / The practical takeaway</span>
            <h2 id="ai-guide-conclusion-heading">A decision, not a winner badge</h2>
            <p>{guide.conclusion}</p>
            <div className="ai-guide-primary-links">
              <Link href={`/ai-tools/${first.slug}`}>{first.name} overview <ArrowRight size={16} aria-hidden="true" /></Link>
              <Link href={`/ai-tools/${second.slug}`}>{second.name} overview <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          </section>

          <section id="questions" className="ai-guide-section" aria-labelledby="ai-guide-faq-heading">
            <span className="ai-tools-eyebrow">05 / Common questions</span>
            <h2 id="ai-guide-faq-heading">Questions worth asking before committing</h2>
            <div className="ai-guide-faq-list">
              {guide.questions.map((item) => (
                <div key={item.question}>
                  <h3><CircleHelp size={19} aria-hidden="true" /> {item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="sources" className="ai-guide-section ai-guide-sources" aria-labelledby="ai-guide-sources-heading">
            <span className="ai-tools-eyebrow">06 / Source ledger</span>
            <h2 id="ai-guide-sources-heading">Official documentation used</h2>
            <p>Source checking date: <time dateTime={AI_GUIDES_REVIEWED_ON}>21 November 2026</time>. Feature gates, pricing, permissions and availability can change after this date. Follow the links to verify current information.</p>
            <ol>
              {guide.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} <ArrowUpRight size={16} aria-hidden="true" /></a>
                  <span>{source.supports}</span>
                </li>
              ))}
            </ol>
            <p className="ai-guide-disclosure"><strong>Methodology and limits:</strong> This guide interprets official documentation and presents an original decision framework. It does not contain sponsored placements, user reviews, model benchmarks or personal performance testing. Recheck plan conditions and evaluate outputs with your own material before purchasing.</p>
          </section>

          <AiComparisonEvaluation guideSlug={guide.slug} firstName={first.name} secondName={second.name} tasks={getAiEvaluationTasks(guide.slug)} />
        </article>

        <aside className="ai-guide-aside" aria-label="Guide navigation">
          <nav className="ai-guide-toc" aria-label="On this page">
            <strong>IN THIS GUIDE</strong>
            <a href="#key-differences">Key differences</a>
            <a href="#who-should-try-what">Choose by use case</a>
            <a href="#analysis">Editorial analysis</a>
            <a href="#verdict">Practical takeaway</a>
            <a href="#questions">Common questions</a>
            <a href="#sources">Sources &amp; disclosures</a>
            <a href="#test-it-yourself">Run your own test</a>
          </nav>
          <div className="ai-guide-side-links">
            <span className="ai-tools-eyebrow">Explore next</span>
            <Link href={compareUrl}>Interactive comparison <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link href="/ai-tools/pricing">Pricing &amp; plans <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link href="/ai-tools/alternatives">Tool alternatives <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </aside>
      </div>

      {otherGuides.length > 0 && (
        <section className="ai-guide-more wrap" aria-labelledby="ai-guide-more-heading">
          <span className="ai-tools-eyebrow">Continue exploring</span>
          <h2 id="ai-guide-more-heading">More workflow comparisons</h2>
          <div className="ai-guide-more-grid">
            {otherGuides.map((item) => <Link key={item.slug} href={`/ai-tools/guides/${item.slug}`}>
              <strong>{item.title}</strong><span>{item.subtitle}</span><ArrowRight size={18} aria-hidden="true" />
            </Link>)}
          </div>
        </section>
      )}
    </main>
  );
}
