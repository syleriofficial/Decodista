import { ArrowUpRight } from "lucide-react";
import { APP_BUILDER_COSTS_REVIEWED_ON, getAppBuilderCost } from "@/lib/ai-tools-app-builder-costs";

/** This is source-led purchase decision support, not a performance ranking. */
export function AiAppBuilderCostComparison({ firstSlug, secondSlug }: {
  firstSlug: string;
  secondSlug: string;
}) {
  const first = getAppBuilderCost(firstSlug);
  const second = getAppBuilderCost(secondSlug);
  if (!first || !second) return null;

  return (
    <section className="ai-tools-app-cost" aria-labelledby="ai-tools-app-cost-title">
      <div className="ai-tools-app-cost-intro">
        <span className="ai-tools-eyebrow">Buying decision · App builders</span>
        <h2 id="ai-tools-app-cost-title">Compare how you actually pay.</h2>
        <p>Subscription price alone cannot predict app costs. These providers use different meters, and a token is not equivalent to a credit. Check your workload before subscribing.</p>
        <p className="ai-tools-app-cost-date">Official billing sources reviewed <time dateTime={APP_BUILDER_COSTS_REVIEWED_ON}>23 November 2026</time>. Not live account or checkout data.</p>
      </div>
      <div className="ai-tools-app-cost-grid">
        {[first, second].map((item) => (
          <article key={item.slug} className="ai-tools-app-cost-card" data-cost-tool={item.slug}>
            <h3>{item.name}</h3>
            <dl>
              <div><dt>What usage is measured?</dt><dd>{item.meter}</dd></div>
              <div><dt>Free starting allowance</dt><dd>{item.freeStart}</dd></div>
              <div><dt>What can cost more?</dt><dd>{item.runningCosts}</dd></div>
              <div><dt>Collaborators and seats</dt><dd>{item.teamwork}</dd></div>
            </dl>
            <p className="ai-tools-app-cost-question"><strong>Ask before paying</strong> {item.question}</p>
            <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
              Verify official billing terms <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>
      <p className="ai-tools-app-cost-limits"><strong>Limits of this comparison:</strong> These are provider-described billing mechanics, not tested cost estimates, a total-cost calculator or a claim that one tool is cheaper. Local taxes, account terms, add-ons and usage can change.</p>
    </section>
  );
}
