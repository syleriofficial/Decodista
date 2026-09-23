import type { Metadata } from "next";
import { SearchClient } from "@/components/search-client";
import { articles } from "@/lib/content";
import { CATEGORY_MAP, CONTENT_TYPE_MAP, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Search",
  description: "Search DECODISTA articles, guides, and technology explainers.",
  alternates: { canonical: "/search" },
  openGraph: { title: `Search | ${SITE_NAME}`, description: "Search DECODISTA articles, guides, and technology explainers.", url: "/search" },
  robots: {
    index: false,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const records = articles.map((article) => ({ title: article.title, slug: article.slug, description: article.description, categoryName: CATEGORY_MAP[article.category].name, contentTypeName: CONTENT_TYPE_MAP[article.contentType].name, tags: article.tags, image: article.featuredImage, imageAlt: article.featuredImageAlt, readingTime: article.readingTime }));
  return <main id="main-content" className="search-page wrap"><header className="page-intro"><span className="eyebrow">Find the signal</span><h1>Search DECODISTA</h1><p>Search published DECODISTA articles by title, category, content type or topic. Results are filtered locally in your browser.</p></header><SearchClient records={records} initialQuery={q ?? ""} /></main>;
}
