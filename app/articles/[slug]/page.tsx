import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/app-link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ArticleBody, RichTextContent } from "@/components/article-body";
import { ArticleCard } from "@/components/article-card";
import { articles, formatDate, getArticle, getRelatedArticles } from "@/lib/content";
import { CATEGORY_MAP, CONTENT_TYPE_MAP, SITE_NAME, SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const metadataTitle = article.seoTitle ?? article.title;
  const hasMeaningfulUpdate = article.updatedDate && article.updatedDate !== article.publishedDate;
  return {
    title: metadataTitle,
    description: article.description,
    alternates: { canonical: `/articles/${slug}` },
    openGraph: {
      type: "article",
      title: metadataTitle,
      description: article.description,
      url: `/articles/${slug}`,
      publishedTime: article.publishedDate,
      ...(hasMeaningfulUpdate ? { modifiedTime: article.updatedDate } : {}),
      authors: [article.author],
      section: CATEGORY_MAP[article.category].name,
      tags: article.tags,
      images: [{
        url: article.featuredImage,
        alt: article.featuredImageAlt,
        width: article.featuredImageWidth ?? 1536,
        height: article.featuredImageHeight ?? 1024,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: metadataTitle,
      description: article.description,
      images: [article.featuredImage],
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const category = CATEGORY_MAP[article.category];
  const contentType = CONTENT_TYPE_MAP[article.contentType];
  const heroCaptionSeparator = /[.!?…]$/.test(article.featuredImageAlt) ? " " : ". ";
  const hasMeaningfulUpdate = article.updatedDate && article.updatedDate !== article.publishedDate;
  const related = getRelatedArticles(article);
  const index = articles.findIndex((item) => item.slug === article.slug);
  const newer = index > 0 ? articles[index - 1] : undefined;
  const older = index < articles.length - 1 ? articles[index + 1] : undefined;
  const keyTakeawaysIndex = article.content.findIndex(
    (block) => block.type === "heading" && block.level === 2 && block.id === "key-takeaways",
  );
  const nextSectionOffset = keyTakeawaysIndex >= 0
    ? article.content.slice(keyTakeawaysIndex + 1).findIndex(
      (block) => block.type === "heading" && block.level === 2,
    )
    : -1;
  const nextSectionIndex = nextSectionOffset >= 0
    ? keyTakeawaysIndex + 1 + nextSectionOffset
    : article.content.length;
  const introBlocks = keyTakeawaysIndex > 0 ? article.content.slice(0, keyTakeawaysIndex) : [];
  const takeawayBlocks = keyTakeawaysIndex >= 0
    ? article.content.slice(keyTakeawaysIndex, nextSectionIndex)
    : [];
  const mainBlocks = keyTakeawaysIndex >= 0
    ? article.content.slice(nextSectionIndex)
    : article.content;
  const toc = mainBlocks.filter((block) => block.type === "heading" && block.level === 2);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: [`${SITE_URL}${article.featuredImage}`],
    datePublished: article.publishedDate,
    ...(hasMeaningfulUpdate ? { dateModified: article.updatedDate } : {}),
    author: {
      "@type": "Organization",
      name: article.author,
      url: `${SITE_URL}/editorial-team`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.svg` },
    },
    mainEntityOfPage: `${SITE_URL}/articles/${article.slug}`,
    articleSection: category.name,
    keywords: article.tags.join(", "),
    isAccessibleForFree: true,
    inLanguage: "en",
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: category.name, item: `${SITE_URL}/${article.category}` },
      { "@type": "ListItem", position: 3, name: article.title, item: `${SITE_URL}/articles/${article.slug}` },
    ],
  };

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <article>
        <header className="article-header wrap">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span><Link href={`/${article.category}`}>{category.name}</Link>
          </nav>
          <div className="article-kicker">
            <Link className="category-label" href={`/${article.category}`}>{category.name}</Link>
            {article.contentType === "how-to"
              ? <Link className="content-type-label" href="/how-to">{contentType.name}</Link>
              : <span className="content-type-label">{contentType.name}</span>}
          </div>
          <h1>{article.title}</h1>
          <p className="standfirst">{article.standfirst}</p>
          <div className="article-byline">
            <div>
              <Link href="/editorial-team"><strong>{article.author}</strong></Link>
              <span>Independent explanatory coverage</span>
            </div>
            <dl>
              <div><dt>Published</dt><dd><time dateTime={article.publishedDate}>{formatDate(article.publishedDate)}</time></dd></div>
              {article.updatedDate && article.updatedDate !== article.publishedDate && <div><dt>Updated</dt><dd><time dateTime={article.updatedDate}>{formatDate(article.updatedDate)}</time></dd></div>}
              <div><dt>Read</dt><dd>{article.readingTime} minutes</dd></div>
            </dl>
          </div>
          {article.checkedDate && <p className="information-checked">Information checked on: <time dateTime={article.checkedDate}>{formatDate(article.checkedDate)} (UTC)</time></p>}
        </header>

        <figure className="article-hero wrap">
          <div><Image src={article.featuredImage} alt={article.featuredImageAlt} fill priority sizes="(max-width: 1500px) 100vw, 1440px" /></div>
          <figcaption>{article.featuredImageAlt}{heroCaptionSeparator}Original DECODISTA artwork.</figcaption>
        </figure>

        <div className="article-reading wrap">
          <div className="article-opening">
            <aside className="short-answer" aria-labelledby="short-answer-title">
              <span className="eyebrow">The direct answer</span>
              <h2 id="short-answer-title">Short answer</h2>
              <p><RichTextContent content={article.shortAnswer} /></p>
            </aside>
            {introBlocks.length > 0 && <ArticleBody blocks={introBlocks} className="article-prose--intro" />}
            {takeawayBlocks.length > 0 && <ArticleBody blocks={takeawayBlocks} className="article-prose--takeaways" />}
          </div>

          <div className="article-main-grid">
            {toc.length > 1 && <nav className="toc" aria-label="Table of contents">
              <strong>In this article</strong>
              <ol>{toc.map((item) => item.type === "heading" && <li key={item.id}><a href={`#${item.id}`}>{item.text}</a></li>)}</ol>
            </nav>}
            <ArticleBody blocks={mainBlocks} />
            <aside className="article-side-note"><span>DECODISTA</span><p>Clear context. Practical choices. No manufactured urgency.</p></aside>
          </div>

          <aside className="author-profile" aria-labelledby="author-profile-title">
            <span className="eyebrow">Editorial profile</span>
            <h2 id="author-profile-title"><Link href="/editorial-team">DECODISTA Editorial</Link></h2>
            <p>DECODISTA Editorial explains consumer technology using primary and official sources where possible. Documentation-based reporting is kept distinct from hands-on testing.</p>
            <Link className="read-link" href="/how-we-work">How we work <ArrowRight aria-hidden="true" /></Link>
          </aside>
        </div>

        <footer className="article-footer wrap">
          <div className="tag-list" aria-label="Article topics">{article.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          {(newer || older) && <nav className="article-navigation" aria-label="Newer and older articles">
            {newer ? <Link href={`/articles/${newer.slug}`}><ArrowLeft aria-hidden="true" /><span><small>Newer article</small>{newer.title}</span></Link> : <span />}
            {older && <Link href={`/articles/${older.slug}`}><span><small>Older article</small>{older.title}</span><ArrowRight aria-hidden="true" /></Link>}
          </nav>}
        </footer>
      </article>

      <section className="related-section wrap" aria-labelledby="related-title">
        <div className="section-heading"><div><span className="eyebrow">Continue reading</span><h2 id="related-title">Related reading</h2></div></div>
        <div className="article-grid">{related.map((item) => <ArticleCard key={item.slug} article={item} variant="compact" />)}</div>
      </section>
    </main>
  );
}
