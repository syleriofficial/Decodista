import type { Metadata } from "next";
import Link from "@/components/app-link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { articles } from "@/lib/content";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const PAGE_SIZE = 12;

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ page?: string }> }): Promise<Metadata> {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const suffix = page > 1 ? ` — Page ${page}` : "";
  const canonical = page > 1 ? `/latest?page=${page}` : "/latest";
  const description = "The newest DECODISTA technology explainers and practical guides, ordered by publication date.";
  return {
    title: `Latest${suffix}`,
    description,
    alternates: { canonical },
    openGraph: { type: "website", title: `Latest${suffix} | ${SITE_NAME}`, description, url: canonical },
    twitter: { card: "summary", title: `Latest${suffix} | ${SITE_NAME}`, description },
  };
}

export default async function LatestPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const pages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  if (page > pages) notFound();
  const visible = articles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Latest", item: `${SITE_URL}/latest` },
    ],
  };

  return (
    <main id="main-content" className="archive-page wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <header className="page-intro">
        <span className="eyebrow">Stay current</span>
        <h1>Latest</h1>
        <p>The newest DECODISTA explanations and guides, ordered by publication date.</p>
      </header>
      <section className="archive-feed" aria-label="Latest articles">
        {visible.map((article) => <ArticleCard key={article.slug} article={article} variant="horizontal" />)}
      </section>
      {pages > 1 && <nav className="pagination" aria-label="Latest pagination">
        {page > 1 && <Link href={page === 2 ? "/latest" : `/latest?page=${page - 1}`}>Previous</Link>}
        <span>Page {page} of {pages}</span>
        {page < pages && <Link href={`/latest?page=${page + 1}`}>Next</Link>}
      </nav>}
    </main>
  );
}
