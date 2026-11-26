import Link from "@/components/app-link";
import { ArticleCard } from "@/components/article-card";
import { ResponsiveImage } from "@/components/responsive-image";
import { getArticlesByCategory, formatDate, type Article } from "@/lib/content";

const categories = [
  ["phones", "Phones"], ["computing", "Computing"], ["audio", "Audio"],
  ["tv-home-theater", "TV & Home Theater"], ["wearables", "Wearables"],
  ["smart-home", "Smart Home"], ["cameras", "Cameras"], ["gaming", "Gaming"],
  ["accessories", "Accessories"],
] as const;
const formats = [["hands-on", "Hands-on Reviews"], ["buying-guides", "Buying Guides"], ["comparisons", "Comparisons"]] as const;
const tagged = (article: Article, prefix: string, slug: string) =>
  article.tags.some(tag => tag.trim().toLowerCase() === prefix + ":" + slug);
export function ReviewsPage({ category, format }: { category?: string; format?: string }) {
  const all = getArticlesByCategory("reviews");
  const available = categories.filter(([slug]) => all.some(a => tagged(a, "review-category", slug)));
  const availableFormats = formats.filter(([slug]) => all.some(a => (!category || tagged(a, "review-category", category)) && tagged(a, "review-format", slug)));
  const selected = all.filter(a => (!category || tagged(a, "review-category", category)) && (!format || tagged(a, "review-format", format)));
  const [lead, ...rest] = selected;
  const href = (cat?: string, kind?: string) => {
    const query = new URLSearchParams();
    if (cat) query.set("category", cat);
    if (kind) query.set("format", kind);
    return "/reviews" + (query.size ? "?" + query.toString() : "");
  };
  return <main id="main-content" className="reviews-editorial wrap">
    <header className="reviews-masthead">
      <span className="eyebrow">DECODISTA / Consumer technology</span>
      <h1>Reviews</h1>
      <p>Independent product reviews, thoughtful comparisons and practical buying advice.</p>
      <Link className="read-link" href="/review-methodology">How we evaluate products →</Link>
    </header>
    <nav className="reviews-nav" aria-label="Review categories">
      <Link href={href()} aria-current={!category ? "page" : undefined}>All</Link>
      {available.map(([slug,label]) => <Link key={slug} href={href(slug)} aria-current={category === slug ? "page" : undefined}>{label}</Link>)}
    </nav>
    {availableFormats.length > 0 && <nav className="reviews-nav reviews-formats" aria-label="Review formats">
      <Link href={href(category)} aria-current={!format ? "page" : undefined}>Latest</Link>
      {availableFormats.map(([slug,label]) => <Link key={slug} href={href(category,slug)} aria-current={format === slug ? "page" : undefined}>{label}</Link>)}
    </nav>}
    {lead ? <>
      <section className="reviews-feature" aria-labelledby="reviews-lead">
        <Link className="reviews-feature-image" href={"/articles/"+lead.slug}><ResponsiveImage src={lead.featuredImage} alt={lead.featuredImageAlt} fill priority sizes="(max-width: 760px) 100vw, 60vw" /></Link>
        <div className="reviews-feature-copy"><span className="eyebrow">Latest coverage</span><h2 id="reviews-lead"><Link href={"/articles/"+lead.slug}>{lead.title}</Link></h2><p>{lead.standfirst}</p><time dateTime={lead.publishedDate}>{formatDate(lead.publishedDate)}</time></div>
      </section>
      {rest.length > 0 && <section className="reviews-list" aria-labelledby="reviews-latest"><h2 id="reviews-latest">More reviews &amp; guides</h2><div className="reviews-grid">{rest.map(article => <ArticleCard key={article.slug} article={article} imageSizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" />)}</div></section>}
    </> : <section className="reviews-empty" aria-labelledby="reviews-empty-title"><span className="eyebrow">Our editorial approach</span><h2 id="reviews-empty-title">{all.length ? "No matching stories" : "Good advice takes good evidence."}</h2><p>{all.length ? "Explore all reviews to see our published coverage." : "Our product coverage is in development. We publish only when our reporting is ready, and distinguish firsthand testing from research-based analysis."}</p><Link className="read-link" href={all.length ? "/reviews" : "/review-methodology"}>{all.length ? "All reviews" : "Read our review methodology"} →</Link></section>}
    <section className="reviews-scope" aria-labelledby="reviews-scope-title"><span className="eyebrow">Coverage</span><h2 id="reviews-scope-title">Technology for everyday life</h2><div className="reviews-scope-grid">{categories.map(([slug,label]) => <div key={slug}>{available.some(([value]) => value === slug) ? <Link href={href(slug)}>{label}</Link> : <span>{label}</span>}</div>)}</div></section>
  </main>;
}
