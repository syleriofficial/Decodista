import type { Metadata } from "next";
import Link from "@/components/app-link";
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarClock, CircleAlert, ShieldCheck } from "lucide-react";
import { AI_TOOLS } from "@/lib/ai-tools";
import { AI_TOOL_PRICING, PRICING_CHECKED_ON } from "@/lib/ai-tools-pricing";
import { SITE_NAME } from "@/lib/site";
import "../ai-tools.css";

const description = "Check a dated, source-linked overview of AI subscription plans for ChatGPT, Claude, Gemini and Perplexity. Local costs and promotions must be verified with the provider.";

export const metadata: Metadata = {
  title: "AI Tool Pricing & Plans",
  description,
  alternates: { canonical: "/ai-tools/pricing" },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    title: `AI Tool Pricing & Plans | ${SITE_NAME}`,
    description,
    url: "/ai-tools/pricing",
  },
};

export default function AiToolsPricingPage() {
  return (
    <main id="main-content" className="ai-tools-page">
      <section className="ai-tools-feature-hero wrap">
        <Link className="ai-tools-back" href="/ai-tools"><ArrowLeft size={17} aria-hidden="true" /> Back to AI Tools</Link>
        <span className="ai-tools-eyebrow">Pricing desk / Source-led research</span>
        <h1>Know the plan <em>before you pay.</em></h1>
        <p>Four official provider sources, one readable starting point. No scraped checkout totals, made-up discounts or universal &ldquo;best value&rdquo; labels.</p>
        <div className="ai-tools-feature-meta"><CalendarClock size={17} aria-hidden="true" /> Sources checked: <time dateTime={PRICING_CHECKED_ON}>21 November 2026</time> <span aria-hidden="true">·</span> Not real-time pricing</div>
      </section>

      <section className="ai-tools-price-section wrap" aria-labelledby="ai-tools-pricing-title">
        <div className="ai-tools-section-heading">
          <div><span className="ai-tools-eyebrow">Official sources</span><h2 id="ai-tools-pricing-title">Plans at a glance</h2><p>Providers can change subscription terms without notice. Open the source for the total in your region.</p></div>
          <span className="ai-tools-count-label">{AI_TOOL_PRICING.length} providers reviewed</span>
        </div>
        <div className="ai-tools-price-grid">
          {AI_TOOL_PRICING.map((record) => {
            const tool = AI_TOOLS.find((item) => item.slug === record.slug)!;
            return (
              <article className="ai-tools-price-card" key={record.slug}>
                <div className="ai-tools-price-card-top">
                  <div className="ai-tools-price-brand">
                    <span className={`ai-tools-monogram ai-tools-monogram--${tool.category}`} aria-hidden="true">{tool.name.slice(0, 2).toUpperCase()}</span>
                    <div><h3><Link href={`/ai-tools/${tool.slug}`}>{tool.name}</Link></h3><span>{tool.provider}</span></div>
                  </div>
                  <span className="ai-tools-price-status"><ShieldCheck size={14} aria-hidden="true" /> Official source</span>
                </div>
                <div className="ai-tools-price-body">
                  <span className="ai-tools-price-label">Identified plans</span>
                  <ul className="ai-tools-plan-pills">{record.planNames.map((plan) => <li key={plan}>{plan}</li>)}</ul>
                  <p className="ai-tools-price-summary">{record.priceSummary}</p>
                  {record.verifiedAmount && (
                    <div className="ai-tools-verified-amount">
                      <span>{record.verifiedAmount.plan} · published USD list price</span>
                      <strong>{record.verifiedAmount.price}</strong>
                      <small>{record.verifiedAmount.billing}</small>
                    </div>
                  )}
                  <p className="ai-tools-price-evidence">{record.evidence}</p>
                  <div className="ai-tools-price-caution"><CircleAlert size={17} aria-hidden="true" /><p>{record.caution}</p></div>
                </div>
                <div className="ai-tools-price-actions">
                  <a href={record.pricingUrl} rel="noopener noreferrer" target="_blank">Official pricing <ArrowUpRight size={16} aria-hidden="true" /></a>
                  <Link href={`/ai-tools/${record.slug}`}>Tool profile <ArrowRight size={16} aria-hidden="true" /></Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <section className="ai-tools-pricing-checklist wrap" aria-labelledby="ai-tools-pricing-checklist-title">
        <div>
          <span className="ai-tools-eyebrow">Before you subscribe</span>
          <h2 id="ai-tools-pricing-checklist-title">Check the cost that actually applies to you.</h2>
          <p>A dated snapshot can help you shortlist, but your provider&apos;s checkout is the final source for the plan, limits, currency and taxes.</p>
        </div>
        <ol>
          <li><strong>Choose a billing term.</strong><span>Monthly and annual commitments are not interchangeable.</span></li>
          <li><strong>Check limits.</strong><span>Models, file uploads, voice, credits and automation access may differ by plan.</span></li>
          <li><strong>Verify your region.</strong><span>Currency, tax, availability and offers can change at checkout.</span></li>
        </ol>
      </section>
      <div className="ai-tools-feature-end wrap">
        <p>Looking for options for the same kind of work?</p>
        <Link href="/ai-tools/alternatives">Explore alternatives <ArrowRight size={17} aria-hidden="true" /></Link>
      </div>
    </main>
  );
}
