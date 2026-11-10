import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/app-link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { getArticlesByCategory } from "@/lib/content";
import { parsePageNumber } from "@/lib/pagination";
import { CATEGORY_DEFINITIONS, CATEGORY_MAP, CONTENT_TYPE_MAP, SITE_NAME, SITE_URL, type CategorySlug } from "@/lib/site";

const PAGE_SIZE = 6;
const isCategory = (value: string): value is CategorySlug => value in CATEGORY_MAP;

export function generateStaticParams() {
  return CATEGORY_DEFINITIONS.map(({ slug }) => ({ section: slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  const { page: pageParam } = await searchParams;
  if (!isCategory(section)) return {};
  const category = CATEGORY_MAP[section];
  const hasStories = getArticlesByCategory(section).length > 0;
  const page = parsePageNumber(pageParam);
  const pages = Math.max(1, Math.ceil(Math.max(0, getArticlesByCategory(section).length - 1) / PAGE_SIZE));
  if (page === null || page > pages) {
    return { robots: { index: false, follow: true }, alternates: { canonical: null } };
  }
  const title = `${category.name}${page > 1 ? ` — Page ${page}` : ""}`;
  const canonical = page > 1 ? `/${section}?page=${page}` : `/${section}`;
  return {
    title,
    description: category.description,
    alternates: { canonical },
    openGraph: { type: "website", title: `${title} | ${SITE_NAME}`, description: category.description, url: canonical },
    twitter: { card: "summary", title: `${title} | ${SITE_NAME}`, description: category.description },
    robots: {
      index: hasStories,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ section: string }>; searchParams: Promise<{ page?: string }> }) {
  const { section } = await params;
  const { page: pageParam } = await searchParams;
  if (!isCategory(section)) notFound();
  const category = CATEGORY_MAP[section];
  const all = getArticlesByCategory(section);
  const page = parsePageNumber(pageParam);
  if (page === null) notFound();
  const featured = all[0];
  const listing = all.slice(1);
  const pages = Math.max(1, Math.ceil(listing.length / PAGE_SIZE));
  const visible = listing.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  if (page > pages) notFound();

  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: category.name, item: `${SITE_URL}/${section}` }] };

  return (
    <main id="main-content" className="category-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <header className="category-header wrap">
        <div><span className="eyebrow">Section / {category.mark}</span><h1>{category.name}</h1></div>
        <p>{category.description}</p>
      </header>
      {featured && page === 1 ? <section className="category-lead wrap" aria-labelledby="category-lead-title">
        <Link className="category-lead-image" href={`/articles/${featured.slug}`}><Image src={featured.featuredImage} alt={featured.featuredImageAlt} fill priority sizes="(max-width: 800px) 100vw, 58vw" /></Link>
        <div><span className="content-type-label">{CONTENT_TYPE_MAP[featured.contentType].name}</span><h2 id="category-lead-title"><Link href={`/articles/${featured.slug}`}>{featured.title}</Link></h2><p>{featured.standfirst}</p><Link className="read-link category-read-link" href={`/articles/${featured.slug}`}>Read the story <ArrowRight aria-hidden="true" /></Link></div>
      </section> : !featured ? <section className="section-principle wrap" aria-labelledby="section-coverage-title"><span className="eyebrow">Editorial scope</span><h2 id="section-coverage-title">Coverage in development</h2><p>Our {category.name.toLowerCase()} section will publish original, verified stories as they are ready. We do not fill sections with placeholder articles.</p><p><Link className="read-link" href="/latest">Explore published stories <ArrowRight aria-hidden="true" /></Link></p></section> : null}
      {listing.length > 0 && <section className="section-block wrap" aria-labelledby="category-latest-title">
        <div className="section-heading"><div><span className="eyebrow">Page {page} of {pages}</span><h2 id="category-latest-title">More in {category.shortName}</h2></div></div>
        <div className="article-grid">{visible.map((article) => <ArticleCard key={article.slug} article={article} />)}</div>
        {pages > 1 && <nav className="pagination" aria-label="Category pagination">{page > 1 && <Link href={`/${section}?page=${page - 1}`}>Previous</Link>}<span>Page {page} of {pages}</span>{page < pages && <Link href={`/${section}?page=${page + 1}`}>Next</Link>}</nav>}
      </section>}
    </main>
  );
}
