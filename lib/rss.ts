/**
 * RSS XML helpers are deliberately framework-independent so the output can be
 * tested without a running Cloudflare Worker.
 */
export interface RssEntry {
  title: string;
  description: string;
  url: string;
  publishedDate: string; // YYYY-MM-DD; source content has calendar dates, not times
  category: string;
}

export const escapeRssXml = (value: string): string =>
  value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const toRssPubDate = (date: string): string => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("RSS requires a YYYY-MM-DD publication date");
  // Content stores only a calendar date. UTC midnight is a serialization
  // convention and must not be presented as a verified publication timestamp.
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error("Invalid RSS publication date");
  }
  return parsed.toUTCString();
};

export function renderRssFeed(entries: readonly RssEntry[], siteUrl: string): string {
  const base = siteUrl.replace(/\/$/, "");
  if (!base.startsWith("https://")) throw new Error("RSS requires an HTTPS canonical site origin");
  const rssUrl = `${base}/rss.xml`;
  const ordered = [...entries].sort(
    (a, b) => b.publishedDate.localeCompare(a.publishedDate) || a.url.localeCompare(b.url),
  ).slice(0, 50);
  const latest = ordered[0]?.publishedDate;

  const items = ordered.map(({ title, description, url, publishedDate, category }) => {
    if (!url.startsWith(`${base}/`)) throw new Error("RSS item URL must belong to DECODISTA");
    return [
      "    <item>",
      `      <title>${escapeRssXml(title)}</title>`,
      `      <link>${escapeRssXml(url)}</link>`,
      `      <guid isPermaLink="true">${escapeRssXml(url)}</guid>`,
      `      <description>${escapeRssXml(description)}</description>`,
      `      <pubDate>${toRssPubDate(publishedDate)}</pubDate>`,
      `      <category>${escapeRssXml(category)}</category>`,
      "    </item>",
    ].join("\n");
  }).join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    "    <title>DECODISTA — Technology, Decoded.</title>",
    `    <link>${escapeRssXml(base)}</link>`,
    "    <description>Clear explanations, practical tech guides and verified weekly AI, privacy and security briefs.</description>",
    "    <language>en</language>",
    `    <atom:link href="${escapeRssXml(rssUrl)}" rel="self" type="application/rss+xml"/>`,
    "    <ttl>60</ttl>",
    ...(latest ? [`    <lastBuildDate>${toRssPubDate(latest)}</lastBuildDate>`] : []),
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}
