import type { MetadataRoute } from "next";
import { articles, getArticlesByCategory, getArticlesByContentType, getArticlesByTopic } from "@/lib/content";
import { CATEGORY_DEFINITIONS, SITE_URL, TOPIC_HUBS } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const latestArticleDate = (items: typeof articles) => items.reduce(
    (date, article) => {
      const articleDate = article.updatedDate ?? article.publishedDate;
      return articleDate > date ? articleDate : date;
    },
    "2026-09-01",
  );
  const latest = latestArticleDate(articles);
  const discoveryRoutes = [
    { route: "", lastModified: latest },
    { route: "/latest", lastModified: latest },
    { route: "/how-to", lastModified: latestArticleDate(getArticlesByContentType("how-to")) },
  ];
  const trustRoutes = [
    "/about",
    "/editorial-policy",
    "/how-we-work",
    "/corrections",
    "/editorial-team",
    "/ai-policy",
    "/contact",
    "/privacy-policy",
    "/terms",
  ];
  const populatedCategories = CATEGORY_DEFINITIONS.filter(
    ({ slug }) => getArticlesByCategory(slug).length > 0,
  );
  const meaningfulTopics = TOPIC_HUBS.filter(
    ({ slug, minimumArticles }) => getArticlesByTopic(slug).length >= minimumArticles,
  );

  return [
    ...discoveryRoutes.map(({ route, lastModified }) => ({
      url: `${SITE_URL}${route}`,
      lastModified,
      changeFrequency: route === "" || route === "/latest" ? "daily" as const : "weekly" as const,
      priority: route === "" ? 1 : route === "/latest" || route === "/how-to" ? .9 : .5,
    })),
    ...trustRoutes.map((route) => ({
      url: `${SITE_URL}${route}`,
      changeFrequency: "monthly" as const,
      priority: .5,
    })),
    ...populatedCategories.map(({ slug }) => ({
      url: `${SITE_URL}/${slug}`,
      lastModified: latestArticleDate(getArticlesByCategory(slug)),
      changeFrequency: "weekly" as const,
      priority: .8,
    })),
    ...meaningfulTopics.map(({ slug }) => ({
      url: `${SITE_URL}/topics/${slug}`,
      lastModified: latestArticleDate(getArticlesByTopic(slug)),
      changeFrequency: "weekly" as const,
      priority: .7,
    })),
    ...articles.map((article) => ({
      url: `${SITE_URL}/articles/${article.slug}`,
      lastModified: article.updatedDate ?? article.publishedDate,
      changeFrequency: "monthly" as const,
      priority: .8,
    })),
  ];
}
