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
} from "@/lib/content";
import { CATEGORY_MAP, CONTENT_TYPE_MAP } from "@/lib/site";

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
  const lead = articles.find((article) => article.featured) ?? articles[0];
  const secondary = articles.filter((article) => article.slug !== lead.slug).slice(0, 3);
  const latest = articles.slice(0, 5);
  const ai = getArticlesByCategory("ai");
  const howTo = getArticlesByContentType("how-to");
  const digitalLife = getArticlesByCategory("digital-life");
  const security = getArticlesByCategory("security");
  const science = getArticlesByCategory("science");
  const editorsPicks = getEditorsPicks();

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

      <section className="section-block latest-home wrap" aria-labelledby="latest-title">
        <SectionHeading eyebrow="Stay current" title="Latest" href="/latest" id="latest-title" />
        <div className="latest-feed">
          {latest.map((article) => <ArticleCard key={article.slug} article={article} variant="horizontal" />)}
        </div>
      </section>

      <EditorialSection eyebrow="Understand" title="AI" href="/ai" stories={ai} />
      <EditorialSection eyebrow="Fix" title="How-To" href="/how-to" stories={howTo} />
      <EditorialSection eyebrow="Everyday technology" title="Digital Life" href="/digital-life" stories={digitalLife} />
      <EditorialSection eyebrow="Protect what matters" title="Security" href="/security" stories={security} />
      <EditorialSection eyebrow="Explore what comes next" title="Science" href="/science" stories={science} />
      <EditorialSection eyebrow="Selected by DECODISTA" title="Editor’s Picks" href="/latest" stories={editorsPicks} />
    </main>
  );
}
