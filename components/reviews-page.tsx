import Link from "@/components/app-link";
import { ArticleCard } from "@/components/article-card";
import { ResponsiveImage } from "@/components/responsive-image";
import { articles, getArticlesByCategory, formatDate, type Article } from "@/lib/content";
import { parsePageNumber } from "@/lib/pagination";
import { SITE_URL } from "@/lib/site";

const categories = [
  ["phones", "Phones"], ["computing", "Computing"], ["audio", "Audio"],
  ["tv-home-theater", "TV & Home Theater"], ["wearables", "Wearables"],
  ["smart-home", "Smart Home"], ["cameras", "Cameras"], ["gaming", "Gaming"],
  ["accessories", "Accessories"],
] as const;
const formats = [["hands-on", "Hands-on Reviews"], ["research-based", "Research-based Reviews"], ["buying-guides", "Buying Guides"], ["comparisons", "Comparisons"]] as const;
const PAGE_SIZE = 6;
export type ReviewQuery = { page?: string | string[]; category?: string | string[]; format?: string | string[] };
const tagged = (article: Article, prefix: string, slug: string) =>
  article.tags.some(tag => tag.trim().toLowerCase() === prefix + ":" + slug);

export function getReviewArchive(query: ReviewQuery) {
  const all = getArticlesByCategory("reviews");
  const { category, format } = query;
  const page = parsePageNumber(query.page);
  if (page === null ||
      (category !== undefined && (typeof category !== "string" || !categories.some(([slug]) => slug === category))) ||
      (format !== undefined && (typeof format !== "string" || !formats.some(([slug]) => slug === format)))) return null;
  const available = categories.filter(([slug]) => all.some(a => tagged(a, "review-category", slug)));
  const availableFormats = formats.filter(([slug]) => all.some(a => (!category || tagged(a, "review-category", category)) && tagged(a, "review-format", slug)));
  const selected = all.filter(a => (!category || tagged(a, "review-category", category)) && (!format || tagged(a, "review-format", format)));
  // Unpublished or impossible filter combinations must not create soft-404 archives.
  if ((category || format) && selected.length === 0) return null;
  const pages = Math.max(1, Math.ceil(Math.max(0, selected.length - 1) / PAGE_SIZE));
  if (page > pages) return null;
  return { all, available, availableFormats, selected, category, format, page, pages };
}

export function reviewHref(category?: string, format?: string, page = 1) {
  const query = new URLSearchParams();
  if (category) query.set("category", category);
  if (format) query.set("format", format);
  if (page > 1) query.set("page", String(page));
  const suffix = query.toString();
  return "/reviews" + (suffix ? "?" + suffix : "");
}

export function ReviewsPage({ archive }: { archive: NonNullable<ReturnType<typeof getReviewArchive>> }) {
  const { all, available, availableFormats, selected, category, format, page, pages } = archive;
  const lead = page === 1 ? selected[0] : undefined;
  const rest = selected.slice(1 + (page - 1) * PAGE_SIZE, 1 + page * PAGE_SIZE);
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: "Reviews", item: SITE_URL + "/reviews" }] };
  return <main id="main-content" className="reviews-editorial wrap">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    <header className="reviews-masthead">
      <span className="eyebrow">DECODISTA / Consumer technology</span>
      <h1>Reviews</h1>
      <p>Independent product reviews, thoughtful comparisons and practical buying advice, with our evidence and limitations made clear.</p>
      <Link className="read-link" href="/review-methodology">How we evaluate products →</Link>
    </header>
    {all.length > 0 && <nav className="reviews-nav" aria-label="Review categories">
      <Link href={reviewHref()} aria-current={!category && !format ? "page" : undefined}>All</Link>
      {available.map(([slug,label]) => <Link key={slug} href={reviewHref(slug)} aria-current={category === slug ? "page" : undefined}>{label}</Link>)}
    </nav>}
    {availableFormats.length > 0 && <nav className="reviews-nav reviews-formats" aria-label="Review formats">
      <Link href={reviewHref(category)} aria-current={!format ? "page" : undefined}>Latest</Link>
      {availableFormats.map(([slug,label]) => <Link key={slug} href={reviewHref(category,slug)} aria-current={format === slug ? "page" : undefined}>{label}</Link>)}
    </nav>}
    {lead && <section className="reviews-feature" aria-labelledby="reviews-lead">
      <Link className="reviews-feature-image" href={"/articles/"+lead.slug} aria-label={"Read "+lead.title}><ResponsiveImage src={lead.featuredImage} alt={lead.featuredImageAlt} fill priority sizes="(max-width: 760px) 100vw, 60vw" /></Link>
      <div className="reviews-feature-copy"><span className="eyebrow">Latest coverage</span><h2 id="reviews-lead"><Link href={"/articles/"+lead.slug}>{lead.title}</Link></h2><p>{lead.standfirst}</p><time dateTime={lead.publishedDate}>{formatDate(lead.publishedDate)}</time></div>
    </section>}
    {rest.length > 0 && <section className="reviews-list" aria-labelledby="reviews-latest">
      <h2 id="reviews-latest">{page === 1 ? "More reviews & guides" : "Reviews & guides"}</h2>
      <div className="reviews-grid">{rest.map(article => <ArticleCard key={article.slug} article={article} imageSizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" />)}</div>
      {pages > 1 && <nav className="pagination" aria-label="Reviews pagination">{page > 1 && <Link href={reviewHref(category,format,page-1)}>Previous</Link>}<span>Page {page} of {pages}</span>{page < pages && <Link href={reviewHref(category,format,page+1)}>Next</Link>}</nav>}
    </section>}
    {all.length === 0 && <section className="reviews-empty" aria-labelledby="reviews-empty-title">
      <span className="eyebrow">Our editorial approach</span><h2 id="reviews-empty-title">Good advice takes good evidence.</h2><p>Our product coverage is in development. We publish only when our reporting is ready, and distinguish firsthand testing from research-based analysis.</p><Link className="read-link" href="/review-methodology">Read our review methodology →</Link>
    </section>}
    <section className="reviews-scope" aria-labelledby="reviews-scope-title"><span className="eyebrow">Editorial scope</span><h2 id="reviews-scope-title">Technology for everyday life</h2><p>Our planned coverage. Only categories with published stories are linked.</p><div className="reviews-scope-grid">{categories.map(([slug,label]) => <div key={slug}>{available.some(([value]) => value === slug) ? <Link href={reviewHref(slug)}>{label}</Link> : <span>{label}</span>}</div>)}</div></section>
    {all.length === 0 && articles.length > 0 && <section className="reviews-list" aria-labelledby="reviews-elsewhere"><span className="eyebrow">Elsewhere in DECODISTA</span><h2 id="reviews-elsewhere">Latest published across DECODISTA</h2><p className="cross-section-note">These articles are from other published sections, not reviews coverage.</p><div className="reviews-grid">{articles.slice(0,3).map(article => <ArticleCard key={article.slug} article={article} imageSizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" />)}</div><p><Link className="read-link" href="/latest">View all published stories →</Link></p></section>}
  </main>;
}
