import type { CategorySlug, ContentTypeSlug, TopicSlug } from "@/lib/site";
import { TOPIC_MAP } from "@/lib/site";
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

export const getEditorsPicks = () =>
  articles.filter((article) => article.editorsPick);

export const getRelatedArticles = (article: Article, limit = 3) => {
  const manual = [...new Set(article.relatedArticleSlugs ?? [])]
    .filter((slug) => slug !== article.slug)
    .map((slug) => getArticle(slug))
    .filter((candidate): candidate is Article => Boolean(candidate));
  const excluded = new Set([article.slug, ...manual.map((candidate) => candidate.slug)]);
  const sourceTags = new Set(article.tags.map((tag) => tag.toLowerCase()));
  const automaticallyRelated = articles
    .filter((candidate) => !excluded.has(candidate.slug))
    .map((candidate) => {
      const sharedTopics = candidate.tags.filter((tag) => sourceTags.has(tag.toLowerCase())).length;
      const score =
        sharedTopics * 3 +
        (candidate.category === article.category ? 2 : 0) +
        (candidate.contentType === article.contentType ? 1 : 0);
      return { candidate, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || publicationOrder(a.candidate, b.candidate))
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
