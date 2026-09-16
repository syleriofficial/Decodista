import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/app-link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ArticleBody } from "@/components/article-body";
import { ArticleCard } from "@/components/article-card";
import { articles, formatDate, getArticle, getRelatedArticles } from "@/lib/content";
import { CATEGORY_MAP, SITE_NAME, SITE_URL } from "@/lib/site";

export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/articles/${slug}` },
    openGraph: { type: "article", title: article.title, description: article.description, url: `/articles/${slug}`, publishedTime: article.publishedDate, modifiedTime: article.updatedDate, authors: [article.author], images: [{ url: article.featuredImage, alt: article.featuredImageAlt, width: 1536, height: 1024 }] },
    twitter: { card: "summary_large_image", title: article.title, description: article.description, images: [article.featuredImage] },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const category = CATEGORY_MAP[article.category];
  const related = getRelatedArticles(article);
  const index = articles.findIndex((item) => item.slug === article.slug);
  const previous = articles[index - 1];
  const next = articles[index + 1];
  const toc = article.content.filter((block) => block.type === "heading" && block.level === 2);
  const articleJsonLd = { "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.description, image: [`${SITE_URL}${article.featuredImage}`], datePublished: article.publishedDate, dateModified: article.updatedDate ?? article.publishedDate, author: { "@type": "Organization", name: article.author }, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL }, mainEntityOfPage: `${SITE_URL}/articles/${article.slug}`, articleSection: category.name, keywords: article.tags.join(", ") };
  const breadcrumbJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }, { "@type": "ListItem", position: 2, name: category.name, item: `${SITE_URL}/${article.category}` }, { "@type": "ListItem", position: 3, name: article.title, item: `${SITE_URL}/articles/${article.slug}` }] };

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <article>
        <header className="article-header wrap">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href={`/${article.category}`}>{category.name}</Link></nav>
          <div className="article-kicker"><Link className="category-label" href={`/${article.category}`}>{category.name}</Link><span className="sample-label">Sample article</span></div>
          <h1>{article.title}</h1>
          <p className="standfirst">{article.standfirst}</p>
          <div className="article-byline"><div><strong>{article.author}</strong><span>Independent explanatory coverage</span></div><dl><div><dt>Published</dt><dd><time dateTime={article.publishedDate}>{formatDate(article.publishedDate)}</time></dd></div>{article.updatedDate && <div><dt>Updated</dt><dd><time dateTime={article.updatedDate}>{formatDate(article.updatedDate)}</time></dd></div>}<div><dt>Read</dt><dd>{article.readingTime} minutes</dd></div></dl></div>
        </header>
        <figure className="article-hero wrap"><div><Image src={article.featuredImage} alt={article.featuredImageAlt} fill priority sizes="(max-width: 1500px) 100vw, 1440px" /></div><figcaption>{article.featuredImageAlt}. Original DECODISTA sample artwork.</figcaption></figure>
        <div className="article-layout wrap">
          {toc.length > 1 && <aside className="toc"><strong>In this article</strong><ol>{toc.map((item) => item.type === "heading" && <li key={item.id}><a href={`#${item.id}`}>{item.text}</a></li>)}</ol></aside>}
          <ArticleBody blocks={article.content} />
          <aside className="article-side-note"><span>DECODISTA</span><p>Clear context. Practical choices. No manufactured urgency.</p></aside>
        </div>
        <footer className="article-footer wrap">
          <div className="tag-list" aria-label="Article tags">{article.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <nav className="article-navigation" aria-label="Previous and next articles">
            {previous ? <Link href={`/articles/${previous.slug}`}><ArrowLeft aria-hidden="true" /><span><small>Previous</small>{previous.title}</span></Link> : <span />}
            {next && <Link href={`/articles/${next.slug}`}><span><small>Next</small>{next.title}</span><ArrowRight aria-hidden="true" /></Link>}
          </nav>
        </footer>
      </article>
      <section className="related-section wrap" aria-labelledby="related-title"><div className="section-heading"><div><span className="eyebrow">Continue reading</span><h2 id="related-title">Related articles</h2></div></div><div className="article-grid">{related.map((item) => <ArticleCard key={item.slug} article={item} variant="compact" />)}</div></section>
    </main>
  );
}
