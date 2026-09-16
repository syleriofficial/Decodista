import Image from "next/image";
import Link from "@/components/app-link";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { SectionHeading } from "@/components/section-heading";
import { articles, formatDate, getArticlesByCategory } from "@/lib/content";
import { CATEGORY_MAP, type CategorySlug } from "@/lib/site";

export default function HomePage() {
  const lead = articles[0];
  const secondary = articles.slice(1, 5);
  const shortcuts = [
    ["AI", "Artificial Intelligence", "/ai"], ["PH", "Smartphones", "/devices"],
    ["PC", "Computers", "/computers"], ["WEB", "Internet & Web", "/internet"],
    ["APP", "Apps & Software", "/apps"], ["SEC", "Privacy & Security", "/security"],
    ["FLOW", "Productivity", "/search?q=productivity"], ["LIFE", "Digital Life", "/digital-life"],
  ];
  const majorCategories: CategorySlug[] = ["ai", "devices", "computers", "internet", "apps", "security", "digital-life"];

  return (
    <main id="main-content">
      <section className="hero wrap" aria-labelledby="lead-story-title">
        <article className="lead-story">
          <Link className="lead-image" href={`/articles/${lead.slug}`}>
            <Image src={lead.featuredImage} alt={lead.featuredImageAlt} fill priority sizes="(max-width: 900px) 100vw, 65vw" />
            <span className="image-number" aria-hidden="true">01</span>
          </Link>
          <div className="lead-copy">
            <div className="card-labels"><Link className="category-label" href={`/${lead.category}`}>{CATEGORY_MAP[lead.category].shortName}</Link>{lead.sample && <span className="sample-label">Sample story</span>}</div>
            <h1 id="lead-story-title"><Link href={`/articles/${lead.slug}`}>{lead.title}</Link></h1>
            <p>{lead.standfirst}</p>
            <div className="lead-meta">
              <span>{lead.readingTime} min read</span>
              <time dateTime={lead.publishedDate}>{formatDate(lead.publishedDate)}</time>
              <Link className="read-link" href={`/articles/${lead.slug}`}>Read the story <ArrowRight aria-hidden="true" /></Link>
            </div>
          </div>
        </article>
        <aside className="hero-rail" aria-label="More featured stories">
          <div className="rail-heading"><span>In focus</span><span>01—04</span></div>
          {secondary.map((article, index) => (
            <article key={article.slug}>
              <span className="story-index">0{index + 2}</span>
              <div><Link className="category-label" href={`/${article.category}`}>{CATEGORY_MAP[article.category].shortName}</Link><h2><Link href={`/articles/${article.slug}`}>{article.title}</Link></h2><span className="rail-meta">{article.readingTime} min read</span></div>
            </article>
          ))}
        </aside>
      </section>

      <section className="category-strip" aria-label="Browse technology topics">
        <div className="wrap category-shortcuts">
          {shortcuts.map(([mark, label, href]) => <Link key={label} href={href}><span>{mark}</span><strong>{label}</strong><ArrowRight aria-hidden="true" /></Link>)}
        </div>
      </section>

      <section className="section-block wrap" aria-labelledby="latest-title">
        <SectionHeading eyebrow="Freshly decoded" title="Latest articles" href="/search" />
        <div className="latest-layout">
          <div className="article-grid">
            {articles.slice(0, 6).map((article, index) => <ArticleCard key={article.slug} article={article} priority={index < 2} />)}
          </div>
          <aside className="trending-panel" aria-labelledby="trending-title">
            <div className="trending-title"><span className="signal-dot" aria-hidden="true" /><h2 id="trending-title">Trending</h2></div>
            <p className="trending-note">Stories selected by the editorial team. No traffic ranking implied.</p>
            <ol>{articles.filter((article) => article.trending).map((article) => <li key={article.slug}><Link href={`/articles/${article.slug}`}>{article.title}</Link><span>{CATEGORY_MAP[article.category].shortName} · {article.readingTime} min</span></li>)}</ol>
          </aside>
        </div>
      </section>

      <section className="category-sections wrap" aria-labelledby="category-stories-title">
        <SectionHeading eyebrow="The edit" title="Technology, section by section" />
        <h2 id="category-stories-title" className="sr-only">Selected category stories</h2>
        <div className="category-feature-grid">
          {majorCategories.map((slug, index) => {
            const article = getArticlesByCategory(slug)[0] ?? articles[index % articles.length];
            const category = CATEGORY_MAP[slug];
            return <article className="category-feature" key={slug}><div className="category-feature-head"><span>{String(index + 1).padStart(2, "0")}</span><Link href={`/${slug}`}>{category.name} <ArrowRight aria-hidden="true" /></Link></div><ArticleCard article={article} variant="compact" /></article>;
          })}
        </div>
      </section>
    </main>
  );
}
