import type { CategorySlug, ContentTypeSlug, TopicSlug } from "@/lib/site";
import { TOPIC_HUBS, TOPIC_MAP } from "@/lib/site";
import { cmsArticles } from "virtual:decodista-articles";

export type InlineContent =
  | string
  | { type: "strong"; text: string }
  | { type: "emphasis"; text: string }
  | { type: "delete"; text: string }
  | { type: "code"; text: string }
  | { type: "link"; text: string; href: string }
  | { type: "break" };

export type RichText = string | InlineContent[];

export type ContentBlock =
  | { type: "heading"; level: 2 | 3; text: string; id: string }
  | { type: "paragraph"; text: RichText }
  | { type: "list"; style: "ordered" | "unordered" | "checklist"; items: RichText[] }
  | { type: "quote"; text: RichText; attribution?: string }
  | { type: "callout"; title: string; text: RichText }
  | { type: "code"; language: string; code: string }
  | { type: "table"; headers: RichText[]; rows: RichText[][]; caption?: string }
  | { type: "image"; src: string; alt: string; caption?: string };

export interface Article {
  title: string;
  seoTitle?: string;
  slug: string;
  description: string;
  standfirst: string;
  category: CategorySlug;
  contentType: ContentTypeSlug;
  tags: string[];
  author: string;
  publishedDate: string;
  updatedDate?: string;
  checkedDate?: string;
  featuredImage: string;
  featuredImageAlt: string;
  featuredImageWidth?: number;
  featuredImageHeight?: number;
  readingTime: number;
  featured?: boolean;
  editorsPick?: boolean;
  shortAnswer: RichText;
  relatedArticleSlugs?: string[];
  content: ContentBlock[];
}

const publicationOrder = (a: Article, b: Article) =>
  b.publishedDate.localeCompare(a.publishedDate) ||
  (b.updatedDate ?? b.publishedDate).localeCompare(a.updatedDate ?? a.publishedDate);

/**
 * The public article repository contains approved production stories only.
 * Sample fixtures are not registered for rendering, search or discovery.
 */
export const articles: Article[] = [
  ...cmsArticles,
].sort(publicationOrder);

export const getArticle = (slug: string) =>
  articles.find((article) => article.slug === slug);

export const getArticlesByCategory = (category: CategorySlug) =>
  articles.filter((article) => article.category === category);

export const getArticlesByContentType = (contentType: ContentTypeSlug) =>
  articles.filter((article) => article.contentType === contentType);

export const getArticlesByTopic = (topic: TopicSlug) => {
  const acceptedTags = new Set(TOPIC_MAP[topic].tags.map((tag) => tag.toLowerCase()));
  return articles.filter((article) =>
    article.tags.some((tag) => acceptedTags.has(tag.toLowerCase())),
  );
};

// Link only to published topic hubs with enough genuine articles to render.
// The count reflects available guides, not projected coverage.
export const getArticleTopicHubs = (article: Article, limit = 3) => {
  const articleTags = new Set(article.tags.map((tag) => tag.toLowerCase()));
  return TOPIC_HUBS.map((topic) => {
    const matchCount = topic.tags.filter((tag) => articleTags.has(tag.toLowerCase())).length;
    const articleCount = getArticlesByTopic(topic.slug).length;
    return { topic, matchCount, articleCount };
  })
    .filter(({ topic, matchCount, articleCount }) =>
      matchCount > 0 && articleCount >= topic.minimumArticles)
    .sort((a, b) =>
      b.matchCount - a.matchCount ||
      b.articleCount - a.articleCount ||
      a.topic.name.localeCompare(b.topic.name))
    .slice(0, Math.max(0, limit))
    .map(({ topic, articleCount }) => ({ slug: topic.slug, name: topic.name, articleCount }));
};

export const getEditorsPicks = () =>
  articles.filter((article) => article.editorsPick);

export const getRelatedArticles = (article: Article, limit = 3) => {
  const manual = [...new Set(article.relatedArticleSlugs ?? [])]
    .filter((slug) => slug !== article.slug)
    .map((slug) => getArticle(slug))
    .filter((candidate): candidate is Article => Boolean(candidate));
  const excluded = new Set([article.slug, ...manual.map((candidate) => candidate.slug)]);
  const sourceTags = new Set(article.tags.map((tag) => tag.toLowerCase()));
  const sourceHubs = new Set(getArticleTopicHubs(article, TOPIC_HUBS.length).map(({ slug }) => slug));
  const automaticallyRelated = articles
    .filter((candidate) => !excluded.has(candidate.slug))
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) => sourceTags.has(tag.toLowerCase())).length;
      const sharedHubs = getArticleTopicHubs(candidate, TOPIC_HUBS.length)
        .filter(({ slug }) => sourceHubs.has(slug)).length;
      // Reward subject overlap before broad category/content-type similarity.
      const contextScore = sharedTags * 6 + sharedHubs * 3;
      const score =
        contextScore +
        (candidate.category === article.category ? 2 : 0) +
        (candidate.contentType === article.contentType ? 1 : 0);
      return { candidate, contextScore, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) =>
      Number(b.contextScore > 0) - Number(a.contextScore > 0) ||
      b.score - a.score ||
      publicationOrder(a.candidate, b.candidate))
    .map(({ candidate }) => candidate);

  return [...manual, ...automaticallyRelated].slice(0, limit);
};

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
