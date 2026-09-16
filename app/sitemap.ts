import type { MetadataRoute } from "next";
import { articles } from "@/lib/content";
import { CATEGORY_DEFINITIONS, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const latest = articles.reduce((date, article) => article.updatedDate && article.updatedDate > date ? article.updatedDate : article.publishedDate > date ? article.publishedDate : date, "2026-08-01");
  const staticRoutes = ["", "/search", "/about", "/contact", "/editorial-policy", "/privacy-policy", "/terms"];
  return [
    ...staticRoutes.map((route) => ({ url: `${SITE_URL}${route}`, lastModified: latest, changeFrequency: route === "" ? "daily" as const : "monthly" as const, priority: route === "" ? 1 : .5 })),
    ...CATEGORY_DEFINITIONS.map(({ slug }) => ({ url: `${SITE_URL}/${slug}`, lastModified: latest, changeFrequency: "weekly" as const, priority: .8 })),
    ...articles.map((article) => ({ url: `${SITE_URL}/articles/${article.slug}`, lastModified: article.updatedDate ?? article.publishedDate, changeFrequency: "monthly" as const, priority: .7 })),
  ];
}
