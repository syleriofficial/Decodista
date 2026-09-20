import type { CategorySlug, ContentTypeSlug, TopicSlug } from "@/lib/site";
import { TOPIC_MAP } from "@/lib/site";
import { doesIcloudBackupIncludePhotosArticle } from "@/lib/articles/does-icloud-backup-include-photos";
import { googleAuthenticatorNewPhoneArticle } from "@/lib/articles/google-authenticator-new-phone-codes-missing";
import { geminiTemporaryChatArticle } from "@/lib/articles/gemini-temporary-chat-vs-keep-activity-off";
import { googlePhotosUndoBackupArticle } from "@/lib/articles/google-photos-android-undo-backup-keep-phone-photos";
import { removeThirdPartyGoogleAccessArticle } from "@/lib/articles/remove-third-party-google-access-without-losing-login";

export type InlineContent =
  | string
  | { type: "strong"; text: string }
  | { type: "emphasis"; text: string }
  | { type: "link"; text: string; href: string }
  | { type: "break" };

export type RichText = string | InlineContent[];

export type ContentBlock =
  | { type: "heading"; level: 2 | 3; text: string; id: string }
  | { type: "paragraph"; text: RichText }
  | { type: "list"; style: "ordered" | "unordered"; items: RichText[] }
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
  doesIcloudBackupIncludePhotosArticle,
  googleAuthenticatorNewPhoneArticle,
  googlePhotosUndoBackupArticle,
  removeThirdPartyGoogleAccessArticle,
  geminiTemporaryChatArticle,
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
  if (article.relatedArticleSlugs?.length) {
    return article.relatedArticleSlugs
      .map((slug) => getArticle(slug))
      .filter((candidate): candidate is Article => Boolean(candidate))
      .slice(0, limit);
  }

  const sourceTags = new Set(article.tags.map((tag) => tag.toLowerCase()));
  return articles
    .filter((candidate) => candidate.slug !== article.slug)
    .map((candidate) => {
      const sharedTopics = candidate.tags.filter((tag) => sourceTags.has(tag.toLowerCase())).length;
      const score =
        sharedTopics * 3 +
        (candidate.category === article.category ? 2 : 0) +
        (candidate.contentType === article.contentType ? 1 : 0);
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score || publicationOrder(a.candidate, b.candidate))
    .slice(0, limit)
    .map(({ candidate }) => candidate);
};

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
