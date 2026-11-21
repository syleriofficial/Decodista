import type { Metadata } from "next";
import Link from "@/components/app-link";
import { ArrowLeft, ArrowRight, ArrowUpRight, GitCompareArrows } from "lucide-react";
import { AI_TOOLS, findAiTool, getCategoryLabel } from "@/lib/ai-tools";
import { SITE_NAME } from "@/lib/site";
import "../ai-tools.css";

const description =
  "Compare two AI tools by primary purpose, common use cases and practical considerations. Check official websites for current pricing and plan availability.";

export const metadata: Metadata = {
  title: "Compare AI Tools",
  description,
  alternates: { canonical: "/ai-tools/compare" },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    title: `Compare AI Tools | ${SITE_NAME}`,
    description,
    url: "/ai-tools/compare",
  },
};

type CompareSearchParams = Promise<{ first?: string | string[]; second?: string | string[] }>;

function single(value: string | string[] | undefined) {
  return typeof value === "string" ? value : Array.isArray(value) ? value[0] : undefined;
}

export default async function CompareAiToolsPage({ searchParams }: { searchParams: CompareSearchParams }) {
  const params = await searchParams;
  const first = findAiTool(single(params.first) ?? "") ?? findAiTool("chatgpt");
  const requestedSecond = findAiTool(single(params.second) ?? "");
  const second = requestedSecond && requestedSecond.slug !== first.slug
    ? requestedSecond
    : AI_TOOLS.find((tool) => tool.slug !== first.slug && tool.category === first.category)
      ?? AI_TOOLS.find((tool) => tool.slug !== first.slug)!;

  const rows = [
    { title: "Made by", a: first.provider, b: second.provider },
    { title: "Primary category", a: getCategoryLabel(first.category), b: getCategoryLabel(second.category) },
    { title: "Overview", a: first.description, b: second.description },
    { title: "Common use cases", a: first.useCases.join(" · "), b: second.useCases.join(" · ") },
    { title: "Practical consideration", a: first.practicalNote, b: second.practicalNote },
    {
      title: "Current plans & pricing",
      a: "Check the official website; this directory does not provide live price verification.",
      b: "Check the official website; this directory does not provide live price verification.",
    },
  ];

  return (
    <main id="main-content" className="ai-tools-page">
      <section className="ai-tools-compare-hero wrap">
        <Link href="/ai-tools" className="ai-tools-back"><ArrowLeft size={16} aria-hidden="true" /> Back to AI Tools</Link>
        <span className="ai-tools-eyebrow">A side-by-side starting point</span>
        <h1>Compare <em>AI tools</em> with context.</h1>
        <p>No fictional ratings, winner badges or unsupported performance claims. Use this view to understand each tool&apos;s general role—and investigate before buying.</p>
      </section>

      <section className="ai-tools-compare-main wrap" aria-labelledby="ai-tools-compare-title">
        <div className="ai-tools-section-heading">
          <div>
            <span className="ai-tools-eyebrow">Choose two</span>
            <h2 id="ai-tools-compare-title">Make a comparison</h2>
          </div>
        </div>
        <form className="ai-tools-compare-form" action="/ai-tools/compare" method="get">
          <label htmlFor="compare-first">First tool
            <select id="compare-first" name="first" defaultValue={first.slug}>
              {AI_TOOLS.map((tool) => <option key={tool.slug} value={tool.slug}>{tool.name}</option>)}
            </select>
          </label>
          <GitCompareArrows size={23} aria-hidden="true" className="ai-tools-compare-switch" />
          <label htmlFor="compare-second">Second tool
            <select id="compare-second" name="second" defaultValue={second.slug}>
              {AI_TOOLS.map((tool) => <option key={tool.slug} value={tool.slug}>{tool.name}</option>)}
            </select>
          </label>
          <button type="submit">Compare <ArrowRight size={16} aria-hidden="true" /></button>
        </form>
        <p className="ai-tools-form-hint">Selecting the same tool twice will use a different second tool. This is a descriptive overview, not an evaluation of model quality.</p>

        <div className="ai-tools-table-scroll" role="region" aria-label={`${first.name} and ${second.name} comparison table`} tabIndex={0}>
          <table className="ai-tools-compare-table">
            <caption className="sr-only">Side-by-side descriptive comparison of {first.name} and {second.name}</caption>
            <thead>
              <tr>
                <th scope="col">At a glance</th>
                <th scope="col"><Link href={`/ai-tools/${first.slug}`} className="ai-tools-compare-tool-name">{first.name}</Link><small>{first.provider}</small></th>
                <th scope="col"><Link href={`/ai-tools/${second.slug}`} className="ai-tools-compare-tool-name">{second.name}</Link><small>{second.provider}</small></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.title}>
                  <th scope="row">{row.title}</th>
                  <td>{row.a}</td>
                  <td>{row.b}</td>
                </tr>
              ))}
              <tr>
                <th scope="row">Verify with provider</th>
                <td><a href={first.officialUrl} target="_blank" rel="noopener noreferrer">Official {first.name} website <ArrowUpRight size={15} aria-hidden="true" /></a></td>
                <td><a href={second.officialUrl} target="_blank" rel="noopener noreferrer">Official {second.name} website <ArrowUpRight size={15} aria-hidden="true" /></a></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="ai-tools-compare-notice">
          <strong>How to use this comparison</strong>
          <p>Decide which features you actually need. Then confirm plan limits, data handling, export options and current prices on both official websites. This page does not imply first-hand testing, a paid recommendation or real-time pricing data.</p>
        </div>
      </section>
    </main>
  );
}
