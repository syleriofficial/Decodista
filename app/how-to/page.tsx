import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/app-link";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { getArticlesByContentType } from "@/lib/content";
import { CATEGORY_MAP, CONTENT_TYPE_MAP, SITE_NAME, SITE_URL } from "@/lib/site";

const howTo = CONTENT_TYPE_MAP["how-to"];

export const metadata: Metadata = {
  title: howTo.name,
  description: howTo.description,
  alternates: { canonical: "/how-to" },
  openGraph: { type: "website", title: `${howTo.name} | ${SITE_NAME}`, description: howTo.description, url: "/how-to" },
  twitter: { card: "summary", title: `${howTo.name} | ${SITE_NAME}`, description: howTo.description },
};

export default function HowToPage() {
  const stories = getArticlesByContentType("how-to");
  const featured = stories[0];
  const rest = stories.slice(1);
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: howTo.name, item: `${SITE_URL}/how-to` },
    ],
  };

  return (
    <main id="main-content" className="category-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <header className="category-header wrap">
        <div><span className="eyebrow">Content type / Fix</span><h1>{howTo.name}</h1></div>
        <p>{howTo.description}</p>
      </header>
      {featured && <section className="category-lead wrap" aria-labelledby="how-to-lead-title">
        <Link className="category-lead-image" href={`/articles/${featured.slug}`}>
          <Image src={featured.featuredImage} alt={featured.featuredImageAlt} fill priority sizes="(max-width: 800px) 100vw, 58vw" />
        </Link>
        <div>
          <Link className="category-label" href={`/${featured.category}`}>{CATEGORY_MAP[featured.category].name}</Link>
          <h2 id="how-to-lead-title"><Link href={`/articles/${featured.slug}`}>{featured.title}</Link></h2>
          <p>{featured.standfirst}</p>
          <Link className="read-link category-read-link" href={`/articles/${featured.slug}`}>Read the guide <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>}
      {rest.length > 0 && <section className="section-block wrap" aria-labelledby="more-how-to-title">
        <div className="section-heading"><div><span className="eyebrow">Across DECODISTA</span><h2 id="more-how-to-title">More practical guides</h2></div></div>
        <div className="article-grid">{rest.map((article) => <ArticleCard key={article.slug} article={article} />)}</div>
      </section>}
    </main>
  );
}
