import { articles } from "@/lib/content";
import { renderRssFeed, type RssEntry } from "@/lib/rss";
import { SITE_URL } from "@/lib/site";
import { weeklyBriefs } from "@/lib/weekly-briefs";

/**
 * A public, opt-in-free RSS 2.0 feed sourced from approved production content.
 * It lists the calendar publication date rather than treating routine edits
 * as brand-new articles.
 */
export function GET() {
  const articleEntries: RssEntry[] = articles.map((article) => ({
    title: article.title,
    description: article.description,
    url: `${SITE_URL}/articles/${article.slug}`,
    publishedDate: article.publishedDate,
    category: article.category === "ai" ? "AI" : article.category === "security" ? "Security" : "Digital Life",
  }));
  const weeklyEntries: RssEntry[] = weeklyBriefs.map((issue) => ({
    title: `Weekly Digital Safety Brief #${issue.issueNumber}: ${issue.title}`,
    description: issue.standfirst,
    url: `${SITE_URL}/weekly/${issue.slug}`,
    publishedDate: issue.publishedDate,
    category: "Weekly Digital Safety Brief",
  }));

  return new Response(renderRssFeed([...articleEntries, ...weeklyEntries], SITE_URL), {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=900",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
