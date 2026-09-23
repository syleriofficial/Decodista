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
  const hasMeaningfulCoverage = getArticlesByTopic(topic).length >= 2;
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
  if (stories.length < 2) notFound();

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
      <section className="topic-grid" aria-label={`${definition.name} articles`}>
        {stories.map((article) => <ArticleCard key={article.slug} article={article} />)}
      </section>
    </main>
  );
}
