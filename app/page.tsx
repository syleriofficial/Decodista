import Image from "next/image";
import Link from "@/components/app-link";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { SectionHeading } from "@/components/section-heading";
import {
  articles,
  formatDate,
  getArticlesByCategory,
  getArticlesByContentType,
  getEditorsPicks,
  getArticlesByTopic,
} from "@/lib/content";
import { CATEGORY_MAP, CONTENT_TYPE_MAP, TOPIC_MAP } from "@/lib/site";
import { weeklyBriefs } from "@/lib/weekly-briefs";

function EditorialSection({
  eyebrow,
  title,
  href,
  stories,
}: {
  eyebrow: string;
  title: string;
  href: string;
  stories: typeof articles;
}) {
  if (!stories.length) return null;
  const titleId = `home-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

  return (
    <section className="home-topic wrap" aria-labelledby={titleId}>
      <SectionHeading eyebrow={eyebrow} title={title} href={href} id={titleId} />
      <div className={`home-topic-grid ${stories.length === 1 ? "home-topic-grid--single" : ""}`}>
        {stories.slice(0, 3).map((article) => (
          <ArticleCard key={article.slug} article={article} variant={stories.length === 1 ? "horizontal" : "compact"} />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  // Lead with the newest published story. Older curated selections remain
  // available in the dedicated Editors' Picks section.
  const lead = articles[0];
  const latestBrief = weeklyBriefs[0];
  const readerJourneys = ([
    {
      slug: "photos-backup",
      title: "Protect your photos",
      description: "Understand backups before deleting, moving or syncing photos.",
    },
    {
      slug: "google-account",
      title: "Secure your Google account",
      description: "Make sense of sign-in, recovery and connected apps.",
    },
    {
      slug: "privacy",
      title: "Take control of privacy",
      description: "Find the settings and trade-offs behind everyday tech.",
    },
  ] as const).filter(({ slug }) => getArticlesByTopic(slug).length >= TOPIC_MAP[slug].minimumArticles);
  const secondary = articles.filter((article) => article.slug !== lead.slug).slice(0, 3);
  const alreadyShown = new Set([lead.slug, ...secondary.map((article) => article.slug)]);
  const takeDistinct = (candidates: typeof articles, limit: number, fill = true) => {
    const distinct = candidates.filter((article) => !alreadyShown.has(article.slug));
    const fallback = fill ? candidates.filter((article) => alreadyShown.has(article.slug)) : [];
    const selected = [...distinct, ...fallback].slice(0, limit);
    selected.forEach((article) => alreadyShown.add(article.slug));
    return selected;
  };
  const latest = takeDistinct(articles, 4);
  const ai = takeDistinct(getArticlesByCategory("ai"), 3, false);
  const howTo = takeDistinct(getArticlesByContentType("how-to"), 3);
  const digitalLife = takeDistinct(getArticlesByCategory("digital-life"), 3);
  const security = takeDistinct(getArticlesByCategory("security"), 3);
  const editorsPicks = takeDistinct(getEditorsPicks(), 3, false);

  return (
    <main id="main-content">
      <section className="hero wrap" aria-labelledby="lead-story-title">
        <article className="lead-story">
          <Link className="lead-image" href={`/articles/${lead.slug}`}>
            <Image src={lead.featuredImage} alt={lead.featuredImageAlt} fill priority sizes="(max-width: 900px) 100vw, 65vw" />
          </Link>
          <div className="lead-copy">
            <div className="card-labels">
              <Link className="category-label" href={`/${lead.category}`}>{CATEGORY_MAP[lead.category].shortName}</Link>
              {lead.contentType === "how-to"
                ? <Link className="content-type-label" href="/how-to">{CONTENT_TYPE_MAP[lead.contentType].name}</Link>
                : <span className="content-type-label">{CONTENT_TYPE_MAP[lead.contentType].name}</span>}
            </div>
            <h1 id="lead-story-title"><Link href={`/articles/${lead.slug}`}>{lead.title}</Link></h1>
            <p>{lead.standfirst}</p>
            <div className="lead-meta">
              <span>{lead.readingTime} min read</span>
              <time dateTime={lead.publishedDate}>{formatDate(lead.publishedDate)}</time>
              <Link className="read-link" href={`/articles/${lead.slug}`}>Read the story <ArrowRight aria-hidden="true" /></Link>
            </div>
          </div>
        </article>
        <aside className="hero-rail" aria-label="More recent stories">
          <div className="rail-heading"><span>Latest</span><span>02—04</span></div>
          {secondary.map((article, index) => (
            <article key={article.slug}>
              <span className="story-index">0{index + 2}</span>
              <div>
                <Link className="category-label" href={`/${article.category}`}>{CATEGORY_MAP[article.category].shortName}</Link>
                <h2><Link href={`/articles/${article.slug}`}>{article.title}</Link></h2>
                <span className="rail-meta">{CONTENT_TYPE_MAP[article.contentType].name} · {article.readingTime} min</span>
              </div>
            </article>
          ))}
        </aside>
      </section>

      <section className="reader-paths wrap" aria-labelledby="reader-paths-title">
        <div className="reader-paths-heading">
          <span className="eyebrow">Start with a problem</span>
          <h2 id="reader-paths-title">Find a useful answer</h2>
          <p>Practical guides to the accounts, photos and privacy decisions that matter in everyday life.</p>
        </div>
        <div className="reader-paths-grid">
          {readerJourneys.map((journey) => (
            <Link className="reader-path" href={`/topics/${journey.slug}`} key={journey.slug}>
              <strong>{journey.title}</strong>
              <span>{journey.description}</span>
              <span className="reader-path-action">Explore guides <ArrowRight aria-hidden="true" /></span>
            </Link>
          ))}
          <Link className="reader-path" href="/security">
            <strong>Stay safer online</strong>
            <span>Understand account protection, scams and safer sign-in choices.</span>
            <span className="reader-path-action">Explore security <ArrowRight aria-hidden="true" /></span>
          </Link>
        </div>
      </section>

      <section className="weekly-feature wrap" aria-labelledby="weekly-feature-heading">
        <div className="weekly-feature-lead">
          <span className="eyebrow">Weekly Digital Safety Brief · {formatDate(latestBrief.publishedDate)}</span>
          <h2 id="weekly-feature-heading">What changed. Why it matters. What you can do.</h2>
          <p>Five verified AI, privacy and security developments, with clear takeaways and links to the original sources.</p>
          <Link className="weekly-primary-link" href={`/weekly/${latestBrief.slug}`}>Read the latest brief <ArrowRight aria-hidden="true" /></Link>
        </div>
        <ol className="weekly-feature-headlines">
          {latestBrief.items.slice(0, 3).map((item) => (
            <li key={item.id}>
              <span>{item.category}</span>
              <Link href={`/weekly/${latestBrief.slug}#${item.id}`}>{item.headline}</Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="section-block latest-home wrap" aria-labelledby="latest-title">
        <SectionHeading eyebrow="Recently published" title="Latest" href="/latest" id="latest-title" />
        <div className="latest-feed">
          {latest.map((article) => <ArticleCard key={article.slug} article={article} variant="horizontal" />)}
        </div>
      </section>

      <EditorialSection eyebrow="Understand" title="AI" href="/ai" stories={ai} />
      <EditorialSection eyebrow="Fix" title="How-To" href="/how-to" stories={howTo} />
      <EditorialSection eyebrow="Everyday technology" title="Digital Life" href="/digital-life" stories={digitalLife} />
      <EditorialSection eyebrow="Protect what matters" title="Security" href="/security" stories={security} />
      <EditorialSection eyebrow="Selected by DECODISTA" title="Editor’s Picks" href="/latest" stories={editorsPicks} />
    </main>
  );
}
