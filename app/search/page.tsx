import type { Metadata } from "next";
import { SearchClient } from "@/components/search-client";
import { articles } from "@/lib/content";
import { CATEGORY_MAP, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Search",
  description: "Search DECODISTA articles, guides, and technology explainers.",
  alternates: { canonical: "/search" },
  openGraph: { title: `Search | ${SITE_NAME}`, description: "Search DECODISTA articles, guides, and technology explainers.", url: "/search" },
  robots: { index: true, follow: true },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const records = articles.map((article) => ({ title: article.title, slug: article.slug, description: article.description, category: article.category, categoryName: CATEGORY_MAP[article.category].name, tags: article.tags, image: article.featuredImage, imageAlt: article.featuredImageAlt, readingTime: article.readingTime, sample: article.sample }));
  return <main id="main-content" className="search-page wrap"><header className="page-intro"><span className="eyebrow">Find the signal</span><h1>Search DECODISTA</h1><p>Search the complete article library. Results are filtered locally in your browser.</p></header><SearchClient records={records} initialQuery={q ?? ""} /></main>;
}
