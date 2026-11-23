import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/app-link";
import { ArrowRight } from "lucide-react";
import { FollowDecodista } from "@/components/follow-decodista";
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
  const latestHref = "/weekly/" + latest.slug;

  return (
    <main id="main-content" className="weekly-page weekly-archive-page wrap">
      <header className="page-intro weekly-archive-intro">
        <span className="eyebrow">DECODISTA / WEEKLY EDITION</span>
        <h1>Weekly Digital Safety Brief</h1>
        <p>A calm weekly look at important AI, privacy and security changes. We explain what actually changed, who it affects, and whether you need to act.</p>
      </header>

      <section className="weekly-magazine" aria-labelledby="weekly-latest-heading">
        <div className="weekly-magazine-label">
          <span className="eyebrow">Latest edition · Issue {String(latest.issueNumber).padStart(2, "0")}</span>
          <span className="weekly-magazine-period">
            <time dateTime={latest.periodStart}>{formatDate(latest.periodStart)}</time>
            {" – "}
            <time dateTime={latest.periodEnd}>{formatDate(latest.periodEnd)}</time>
          </span>
        </div>
        {latest.cover && (
          <Link href={latestHref} className="weekly-magazine-cover" aria-label={"Read " + latest.title}>
            <Image
              src={latest.cover.src}
              alt={latest.cover.alt}
              width={latest.cover.width}
              height={latest.cover.height}
              priority
              unoptimized
              sizes="(max-width: 720px) 100vw, 1100px"
            />
          </Link>
        )}
        <div className="weekly-magazine-body">
          <div className="weekly-magazine-feature">
            <p className="weekly-magazine-date">
              Published <time dateTime={latest.publishedDate}>{formatDate(latest.publishedDate)}</time>
            </p>
            <h2 id="weekly-latest-heading"><Link href={latestHref}>{latest.title}</Link></h2>
            <p className="weekly-magazine-summary">{latest.standfirst}</p>
            <Link className="weekly-primary-link" href={latestHref}>
              Read full edition <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <aside className="weekly-magazine-index" aria-label="Stories inside the latest edition">
            <h3>Inside this edition</h3>
            <ol>
              {latest.items.map((item) => (
                <li key={item.id}>
                  <span className="weekly-magazine-topic">{item.category}</span>
                  <strong>{item.headline}</strong>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      {earlier.length > 0 && (
        <section className="weekly-archive weekly-magazine-archive" aria-labelledby="weekly-archive-heading">
          <div className="weekly-magazine-section-heading">
            <h2 id="weekly-archive-heading">Previous editions</h2>
            <p>Browse our published, source-verified weekly briefs.</p>
          </div>
          <ol>
            {earlier.map((issue) => (
              <li key={issue.slug}>
                <span className="weekly-magazine-issue-number">Issue {String(issue.issueNumber).padStart(2, "0")}</span>
                <Link href={"/weekly/" + issue.slug}>{issue.title}<ArrowRight aria-hidden="true" /></Link>
                <time dateTime={issue.publishedDate}>{formatDate(issue.publishedDate)}</time>
              </li>
            ))}
          </ol>
        </section>
      )}

      <FollowDecodista />
      <section className="weekly-explainer weekly-magazine-method" aria-labelledby="weekly-approach-title">
        <h2 id="weekly-approach-title">How we select weekly updates</h2>
        <p>Each edition is assembled from dated primary sources. A mention does not mean a feature is already available to everyone, a vulnerability is widely exploited, or a proposed policy has taken effect. We distinguish announcements from releases and recommend actions only when the evidence supports them.</p>
      </section>
    </main>
  );
}
