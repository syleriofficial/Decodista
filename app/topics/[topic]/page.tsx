import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { getArticlesByTopic } from "@/lib/content";
import { SITE_NAME, SITE_URL, TOPIC_HUBS, TOPIC_MAP, type TopicSlug } from "@/lib/site";

const isTopic = (value: string): value is TopicSlug => value in TOPIC_MAP;

export function generateStaticParams() {
  return TOPIC_HUBS.map(({ slug }) => ({ topic: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  if (!isTopic(topic)) return {};
  const definition = TOPIC_MAP[topic];
  const hasMeaningfulCoverage = getArticlesByTopic(topic).length >= definition.minimumArticles;
  return {
    title: definition.name,
    description: definition.description,
    alternates: { canonical: `/topics/${topic}` },
    openGraph: { type: "website", title: `${definition.name} | ${SITE_NAME}`, description: definition.description, url: `/topics/${topic}` },
    twitter: { card: "summary", title: `${definition.name} | ${SITE_NAME}`, description: definition.description },
    robots: {
      index: hasMeaningfulCoverage,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  if (!isTopic(topic)) notFound();
  const definition = TOPIC_MAP[topic];
  const stories = getArticlesByTopic(topic);
  if (stories.length < definition.minimumArticles) notFound();

  // Put practical guides first without duplicating their cards in the listing.
  const practical = stories.filter((article) => article.contentType === "how-to" || article.contentType === "explainer");
  const startHere = (practical.length > 0 ? practical : stories).slice(0, 3);
  const startHereSlugs = new Set(startHere.map((article) => article.slug));
  const remaining = stories.filter((article) => !startHereSlugs.has(article.slug));

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: definition.name, item: `${SITE_URL}/topics/${topic}` },
    ],
  };

  return (
    <main id="main-content" className="topic-page wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <header className="page-intro topic-intro">
        <span className="eyebrow">Topic</span>
        <h1>{definition.name}</h1>
        <p>{definition.description}</p>
      </header>
      <section className="topic-reading-path" aria-labelledby="topic-start-here">
        <div className="topic-section-intro">
          <span className="eyebrow">Recommended starting points</span>
          <h2 id="topic-start-here">Start here</h2>
          <p>Begin with these practical guides and explainers, then explore the rest of this topic.</p>
        </div>
        <div className="topic-grid">
          {startHere.map((article) => <ArticleCard key={article.slug} article={article} />)}
        </div>
      </section>
      {remaining.length > 0 && (
        <section className="topic-reading-path topic-reading-path--more" aria-labelledby="topic-more">
          <div className="topic-section-intro">
            <h2 id="topic-more">More on {definition.name}</h2>
          </div>
          <div className="topic-grid">
            {remaining.map((article) => <ArticleCard key={article.slug} article={article} />)}
          </div>
        </section>
      )}
    </main>
  );
}
