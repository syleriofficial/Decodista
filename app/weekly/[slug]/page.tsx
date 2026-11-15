import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/app-link";
import { ArticleCard } from "@/components/article-card";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { articles, formatDate } from "@/lib/content";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { getWeeklyBrief, weeklyBriefs } from "@/lib/weekly-briefs";

export function generateStaticParams() {
  return weeklyBriefs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const issue = getWeeklyBrief(slug);
  if (!issue) return {};
  return {
    title: `${issue.title} — Weekly Brief`,
    description: issue.standfirst,
    alternates: { canonical: `/weekly/${issue.slug}` },
    openGraph: {
      type: "article",
      title: issue.title,
      description: issue.standfirst,
      url: `/weekly/${issue.slug}`,
      publishedTime: issue.publishedDate,
      ...(issue.cover ? { images: [{ url: issue.cover.src, width: issue.cover.width, height: issue.cover.height, alt: issue.cover.alt }] } : {}),
    },
    twitter: { card: issue.cover ? "summary_large_image" : "summary", title: `${issue.title} | ${SITE_NAME}`, description: issue.standfirst, ...(issue.cover ? { images: [issue.cover.src] } : {}) },
  };
}

export default async function WeeklyIssuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const issue = getWeeklyBrief(slug);
  if (!issue) notFound();
  const relatedSlugs = new Set(issue.relatedArticleSlugs);
  const related = articles.filter((article) => relatedSlugs.has(article.slug));

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Weekly Brief", item: `${SITE_URL}/weekly` },
      { "@type": "ListItem", position: 3, name: issue.title, item: `${SITE_URL}/weekly/${issue.slug}` },
    ],
  };
  const postingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: issue.title,
    description: issue.standfirst,
    datePublished: issue.publishedDate,
    ...(issue.cover ? { image: [`${SITE_URL}${issue.cover.src}`] } : {}),
    mainEntityOfPage: `${SITE_URL}/weekly/${issue.slug}`,
    author: { "@type": "Organization", name: SITE_NAME, url: `${SITE_URL}/editorial-team` },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    inLanguage: "en",
    isAccessibleForFree: true,
  };

  return (
    <main id="main-content" className="weekly-page weekly-issue wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(postingJsonLd) }} />
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/weekly">Weekly Brief</Link></nav>
      <header className="weekly-issue-header">
        <span className="eyebrow">Digital Safety Brief · Issue {issue.issueNumber}</span>
        <h1>{issue.title}</h1>
        <p>{issue.standfirst}</p>
        <div className="weekly-issue-meta">
          <span>Published <time dateTime={issue.publishedDate}>{formatDate(issue.publishedDate)}</time></span>
          <span>Reporting window: <time dateTime={issue.periodStart}>{formatDate(issue.periodStart)}</time> – <time dateTime={issue.periodEnd}>{formatDate(issue.periodEnd)}</time></span>
          <span>{issue.items.length} verified updates</span>
        </div>
      </header>
      {issue.cover && (
        <figure className="weekly-hero">
          <Image src={issue.cover.src} alt={issue.cover.alt} width={issue.cover.width} height={issue.cover.height} priority />
        </figure>
      )}
      {issue.topTakeaways && issue.topTakeaways.length > 0 && (
        <section className="weekly-top-takeaways" aria-labelledby="weekly-takeaways-heading">
          <h2 id="weekly-takeaways-heading">Three things to know</h2>
          <ol>{issue.topTakeaways.map((takeaway) => <li key={takeaway}>{takeaway}</li>)}</ol>
        </section>
      )}
      <nav className="weekly-in-this-issue" aria-label="Jump to an update">
        <strong>In this edition</strong>
        <ol>{issue.items.map((item) => <li key={item.id}><a href={`#${item.id}`}>{item.headline}</a></li>)}</ol>
      </nav>
      <div className="weekly-items">
        {issue.items.map((item, index) => (
          <article id={item.id} className="weekly-item" key={item.id} aria-labelledby={`${item.id}-heading`}>
            <div className="weekly-item-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
            <div className="weekly-item-content">
              <div className="weekly-item-kicker"><span>{item.category}</span><time dateTime={item.announcedDate}>{formatDate(item.announcedDate)}</time></div>
              <h2 id={`${item.id}-heading`}>{item.headline}</h2>
              <div className="weekly-item-details">
                <section><h3>What changed</h3><p>{item.whatChanged}</p></section>
                <section><h3>Why it matters</h3><p>{item.whyItMatters}</p></section>
                <section className="weekly-takeaway"><h3>What you can do</h3><p>{item.whatToDo}</p></section>
              </div>
              {item.insight && <p className="weekly-insight"><strong>DECODISTA insight:</strong> {item.insight}</p>}
              <div className="weekly-sources">
                {[item.source, ...(item.additionalSources ?? [])].map((source, sourceIndex) => (
                  <a className="weekly-source" key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">
                    {sourceIndex === 0 ? "Primary source:" : "Additional source:"} {source.label} <ExternalLink aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
      {issue.earlierAlerts && (
        <aside className="weekly-earlier-alerts" aria-labelledby="weekly-earlier-heading">
          <h2 id="weekly-earlier-heading">Earlier alerts still worth checking</h2>
          <p>{issue.earlierAlerts}</p>
        </aside>
      )}
      {issue.checklist && issue.checklist.length > 0 && (
        <section className="weekly-checklist" aria-labelledby="weekly-checklist-heading">
          <h2 id="weekly-checklist-heading">Your five-minute digital safety checklist</h2>
          <ul>{issue.checklist.map((task) => <li key={task}>{task}</li>)}</ul>
        </section>
      )}
      <aside className="weekly-editor-note" aria-labelledby="weekly-editor-note-title">
        <h2 id="weekly-editor-note-title">How we selected these updates</h2>
        <p>This edition records announcements and releases in the stated date range, based on the linked primary sources. It is a dated snapshot, not a continuously updated vulnerability tracker or a substitute for your device’s own update screen. Availability and policies may change after publication.</p>
      </aside>
      {related.length > 0 && (
        <section className="weekly-related" aria-labelledby="weekly-related-heading">
          <div className="section-heading"><div><span className="eyebrow">Keep learning</span><h2 id="weekly-related-heading">Practical guides</h2></div></div>
          <div className="article-grid">{related.map((article) => <ArticleCard key={article.slug} article={article} variant="compact" />)}</div>
        </section>
      )}
      <nav className="weekly-bottom-nav" aria-label="Weekly Brief navigation">
        <Link href="/weekly"><ArrowLeft aria-hidden="true" /> All editions</Link>
        <Link href="/latest">Latest articles <ArrowRight aria-hidden="true" /></Link>
      </nav>
    </main>
  );
}
