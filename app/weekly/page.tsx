import type { Metadata } from "next";
import Link from "@/components/app-link";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/content";
import { SITE_NAME } from "@/lib/site";
import { weeklyBriefs } from "@/lib/weekly-briefs";

const description =
  "A concise, source-verified weekly briefing on AI, privacy and practical technology security, with clear next steps and links to primary sources.";

export const metadata: Metadata = {
  title: "Weekly Digital Safety Brief",
  description,
  alternates: { canonical: "/weekly" },
  openGraph: { type: "website", title: `Weekly Digital Safety Brief | ${SITE_NAME}`, description, url: "/weekly" },
  twitter: { card: "summary", title: `Weekly Digital Safety Brief | ${SITE_NAME}`, description },
};

export default function WeeklyArchive() {
  const [latest, ...earlier] = weeklyBriefs;
  return (
    <main id="main-content" className="weekly-page wrap">
      <header className="page-intro">
        <span className="eyebrow">Independent and practical</span>
        <h1>Weekly Digital Safety Brief</h1>
        <p>A calm weekly look at important AI, privacy and security changes. We explain what actually changed, who it affects, and whether you need to act.</p>
      </header>
      <section className="weekly-spotlight" aria-labelledby="weekly-latest-heading">
        <div className="weekly-spotlight-copy">
          <span className="eyebrow">Latest published issue · No. {latest.issueNumber}</span>
          <p className="weekly-date">Published <time dateTime={latest.publishedDate}>{formatDate(latest.publishedDate)}</time></p>
          <h2 id="weekly-latest-heading"><Link href={`/weekly/${latest.slug}`}>{latest.title}</Link></h2>
          <p>{latest.standfirst}</p>
          <Link className="weekly-primary-link" href={`/weekly/${latest.slug}`}>Read this issue <ArrowRight aria-hidden="true" /></Link>
        </div>
        <aside className="weekly-spotlight-list" aria-label="Included in the latest issue">
          <h3>Inside this edition</h3>
          <ol>
            {latest.items.map((item) => (
              <li key={item.id}><span>{item.category}</span><strong>{item.headline}</strong></li>
            ))}
          </ol>
        </aside>
      </section>
      <section className="weekly-explainer" aria-labelledby="weekly-approach-title">
        <h2 id="weekly-approach-title">Useful information, not an endless feed</h2>
        <p>Each edition is assembled from dated primary sources. A mention does not mean a feature is already available to everyone, a vulnerability is widely exploited, or a proposed policy has taken effect. We distinguish announcements from releases and recommend actions only when the evidence supports them.</p>
      </section>
      {earlier.length > 0 && (
        <section className="weekly-archive" aria-labelledby="weekly-archive-heading">
          <h2 id="weekly-archive-heading">Previous editions</h2>
          <ul>
            {earlier.map((issue) => (
              <li key={issue.slug}>
                <time dateTime={issue.publishedDate}>{formatDate(issue.publishedDate)}</time>
                <Link href={`/weekly/${issue.slug}`}>{issue.title} <ArrowRight aria-hidden="true" /></Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
