import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/app-link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { getArticlesByCategory } from "@/lib/content";
import { CATEGORY_DEFINITIONS, CATEGORY_MAP, SITE_NAME, SITE_URL, type CategorySlug } from "@/lib/site";

const PAGE_SIZE = 6;
const isCategory = (value: string): value is CategorySlug => value in CATEGORY_MAP;

export function generateStaticParams() {
  return CATEGORY_DEFINITIONS.map(({ slug }) => ({ section: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  if (!isCategory(section)) return {};
  const category = CATEGORY_MAP[section];
  const title = category.name;
  return {
    title,
    description: category.description,
    alternates: { canonical: `/${section}` },
    openGraph: { type: "website", title: `${title} | ${SITE_NAME}`, description: category.description, url: `/${section}` },
    twitter: { card: "summary", title: `${title} | ${SITE_NAME}`, description: category.description },
  };
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ section: string }>; searchParams: Promise<{ page?: string }> }) {
  const { section } = await params;
  const { page: pageParam } = await searchParams;
  if (!isCategory(section)) notFound();
  const category = CATEGORY_MAP[section];
  const all = getArticlesByCategory(section);
  const page = Math.max(1, Number(pageParam) || 1);
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
      {featured ? <section className="category-lead wrap" aria-labelledby="category-lead-title">
        <Link className="category-lead-image" href={`/articles/${featured.slug}`}><Image src={featured.featuredImage} alt={featured.featuredImageAlt} fill priority sizes="(max-width: 800px) 100vw, 58vw" /></Link>
        <div>{featured.sample && <span className="sample-label">Sample story</span>}<h2 id="category-lead-title"><Link href={`/articles/${featured.slug}`}>{featured.title}</Link></h2><p>{featured.standfirst}</p><Link className="read-link category-read-link" href={`/articles/${featured.slug}`}>Read the story <ArrowRight aria-hidden="true" /></Link></div>
      </section> : <section className="empty-state wrap"><h2>Stories are being prepared</h2><p>This section is ready for publishing. Add an article to the typed content repository and it will appear here automatically.</p></section>}
      <section className="section-block wrap" aria-labelledby="category-latest-title">
        <div className="section-heading"><div><span className="eyebrow">Page {page} of {pages}</span><h2 id="category-latest-title">More in {category.shortName}</h2></div></div>
        {visible.length > 0 ? <div className="article-grid">{visible.map((article) => <ArticleCard key={article.slug} article={article} />)}</div> : <p className="listing-note">More sample stories can be added without changing this page layout.</p>}
        {pages > 1 && <nav className="pagination" aria-label="Category pagination">{page > 1 && <Link href={`/${section}?page=${page - 1}`}>Previous</Link>}<span>Page {page} of {pages}</span>{page < pages && <Link href={`/${section}?page=${page + 1}`}>Next</Link>}</nav>}
      </section>
    </main>
  );
}
