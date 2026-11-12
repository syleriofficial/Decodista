import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadArticles } from "./content-loader.mjs";

function read(relativePath) {
  return fs.readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

const site = read("lib/site.ts");
const legal = read("lib/legal.ts");
const homepage = read("app/page.tsx");
const layout = read("app/layout.tsx");
const header = read("components/site-header.tsx");
const footer = read("components/site-footer.tsx");
const rssRoute = read("app/rss.xml/route.ts");
const rssFormatter = read("lib/rss.ts");
const followComponent = read("components/follow-decodista.tsx");
const newsletterProvider = read("lib/newsletter.ts");
const weeklyArchive = read("app/weekly/page.tsx");
const weeklyIssue = read("app/weekly/[slug]/page.tsx");
const weeklyData = read("lib/weekly-briefs.ts");
const topicPage = read("app/topics/[topic]/page.tsx");
const articlePage = read("app/articles/[slug]/page.tsx");
const contentHelpers = read("lib/content.ts");
const science = read("app/[section]/page.tsx");
const latestArchive = read("app/latest/page.tsx");
const paginationHelper = read("lib/pagination.ts");
const sitemap = read("app/sitemap.ts");
const robots = read("app/robots.ts");
const ads = read("public/ads.txt");
const contactPage = read("app/contact/page.tsx");
const standardsRedirect = read("app/editorial-standards/page.tsx");
const nextConfig = read("next.config.ts");
assert(nextConfig.includes("images: { unoptimized: true }"), "Do not generate redirecting image optimizer URLs until Vinext has a working image backend");
const notFound = read("app/not-found.tsx");
const staticHeaders = read("public/_headers");
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { articles } = loadArticles(projectRoot);

const navigation = site.match(/export const NAV_ITEMS = \[([\s\S]*?)\] as const;/)?.[1];
assert(navigation, "Primary navigation definition is missing");
assert.deepEqual(
  [...navigation.matchAll(/label: "([^"]+)"/g)].map((match) => match[1]),
  ["Tech News", "Reviews", "Science", "Entertainment", "Latest"],
  "Main navigation must show the four approved editorial sections in order",
);

const moreNavigation = site.match(/export const MORE_NAV_ITEMS = \[([\s\S]*?)\] as const;/)?.[1];
assert(moreNavigation, "More navigation definition is missing");
assert.deepEqual(
  [...moreNavigation.matchAll(/label: "([^"]+)"/g)].map((match) => match[1]),
  ["AI", "How-To", "Security", "Digital Life"],
  "More must retain the existing sections and latest archive",
);
assert(header.includes("MORE_NAV_ITEMS.map"), "Header More menu must list the other sections");
assert(footer.includes("MORE_NAV_ITEMS.map"), "Footer must retain links to existing sections");
assert(footer.includes("{SITE_DESCRIPTION}"), "Footer summary must stay in sync with site metadata");
assert(footer.includes("{SITE_TAGLINE}"), "Footer tagline must stay in sync with the site-wide identity");
for (const category of ["tech-news", "reviews", "science", "entertainment"]) {
  assert(homepage.includes(`getArticlesByCategory("${category}")`), `Homepage must support ${category} stories`);
}
assert(homepage.includes("if (!stories.length) return null;"), "Homepage must not present empty editorial sections");
assert.equal(articles.filter((article) => article.category === "science").length, 0, "Science must remain empty until genuine coverage is published");
assert(/robots:\s*\{[\s\S]*?index:\s*hasStories/.test(science), "Empty category routes must remain noindex");
assert(paginationHelper.includes("Number.isSafeInteger"), "Pagination must reject unsafe values");
assert(paginationHelper.includes("/^[1-9]\\d*$/"), "Pagination must only accept positive integer page numbers");
assert(latestArchive.includes("parsePageNumber(pageParam)"), "Latest must validate page numbers");
assert(latestArchive.includes('id="latest-articles-heading"'), "Latest archive must provide an h2 parent for article h3 headings");
assert(nextConfig.includes("htmlLimitedBots: /.*/"), "Async archive/article metadata must render in head for all crawlers");
assert(science.includes("parsePageNumber(pageParam)"), "Category pagination must validate page numbers");
assert(science.includes("featured && page === 1"), "Category featured article must not repeat on paginated pages");
assert(!/"\/science"/.test(sitemap), "Empty Science route must not be hard-coded into the sitemap");

assert(/const trustRoutes = \[/.test(sitemap), "Trust routes must be separated from content-freshness routes");
assert(!/host:\s*SITE_URL/.test(robots), "robots.txt must not emit a non-standard Host directive");
assert.equal(
  ads,
  "google.com, pub-5589150014762971, DIRECT, f08c47fec0942fa0\n",
  "ads.txt must contain exactly the approved Google AdSense publisher entry",
);
assert(!/ads\.txt/.test(robots), "robots.txt must not block ads.txt");

assert(/href: "\/contact\?type=correction", label: "Submit a correction"/.test(legal), "Corrections policy must preselect the correction form");
assert(!/mailto:/i.test(legal), "Trust pages must not publish an unverified email route");
assert(/ContactForm/.test(contactPage), "Contact page must expose the protected production form");
assert(/TURNSTILE_SITE_KEY/.test(contactPage), "Contact page must configure Cloudflare Turnstile");
assert(/private delivery address is never shown/i.test(contactPage), "Contact page must keep the recipient private");
assert(/permanentRedirect\("\/editorial-policy"\)/.test(standardsRedirect), "Editorial Standards alias must resolve to the canonical policy route");
assert(!/<form|contact-form/i.test(homepage), "Homepage must not expose a non-functional contact or signup form");
assert(!/Trending|Preview only/i.test(homepage), "Homepage must not expose unsupported traffic or preview claims");
assert(homepage.includes("const lead = articles[0]"), "Homepage must lead with the newest published story");
assert(homepage.includes("readerJourneys") && homepage.includes("reader-paths"), "Homepage must offer curated reader journeys");
assert(homepage.includes('className="reader-search-link" href="/search"'), "Homepage must offer direct access to published-guide search");
assert(!homepage.includes("<FollowDecodista />"), "Homepage should not promote a duplicate RSS subscribe panel; footer retains RSS");
assert(homepage.includes("getArticlesByTopic(slug).length >= TOPIC_MAP[slug].minimumArticles"), "Reader paths must never lead to unpopulated topics");
assert(topicPage.includes("Start here") && topicPage.includes("startHereSlugs"), "Topic hubs must have non-duplicated starting points");
assert(articlePage.includes("related.length > 0"), "Do not render an empty related-reading section");
assert(contentHelpers.includes(".filter(({ score }) => score > 0)"), "Related articles must have a positive relevance score");
assert(!/newsletter|subscribe now/i.test(homepage), "Do not advertise an unimplemented subscription feature");
assert(!homepage.includes('className="weekly-feature'), "Weekly Brief should remain in More and its archive, not dominate the homepage");
assert(weeklyArchive.includes("weeklyBriefs") && weeklyArchive.includes("Latest published issue"), "Weekly archive must render a real published edition");
assert(weeklyIssue.includes("getWeeklyBrief(slug)") && weeklyIssue.includes("notFound()"), "Weekly issue route must reject unknown slugs");
assert(weeklyIssue.includes("Primary source:") && weeklyIssue.includes("rel=\"noopener noreferrer\""), "Weekly issue must attribute and safely link to primary sources");
assert(weeklyIssue.includes("BreadcrumbList") && weeklyIssue.includes("BlogPosting"), "Weekly issues need discoverable structured data");
assert(sitemap.includes('route: "/weekly"') && sitemap.includes('url: `${SITE_URL}/weekly/${issue.slug}`'), "Weekly archive and issues must appear in the sitemap");
assert(!/<form|subscribe now|newsletter signup/i.test(weeklyArchive), "Do not publish an unimplemented weekly email signup");
assert(layout.includes('"application/rss+xml": `${SITE_URL}/rss.xml`'), "RSS must be discoverable through document metadata");
assert(header.includes('href="/weekly"'), "Header More menu must expose Weekly Brief");
assert(site.includes('href: "/review-methodology", label: "Review Methodology"'), "Review methodology must be discoverable");
assert(sitemap.includes('"/review-methodology"'), "Review methodology must appear in sitemap");
assert(homepage.includes('eyebrow="Evaluations and comparisons"'), "Reviews must avoid implying unverified testing");
assert(!homepage.includes('Tested and evaluated'), "Homepage must not imply unverified hands-on testing");
assert(!header.includes('href="/rss.xml"'), "RSS feed should remain discoverable in footer and metadata, not the More menu");
assert(header.includes('moreMenuRef.current?.open') && header.includes('querySelector("summary")?.focus()'), "Escape must close the More menu and restore focus");
assert(footer.includes('href="/rss.xml"'), "RSS must have a permanent footer link");
assert(weeklyArchive.includes("FollowDecodista"), "Weekly archive must preserve RSS follow options");
assert(rssRoute.includes("articles.map(") && rssRoute.includes("weeklyBriefs.map("), "RSS must include both approved article and weekly issue records");
assert(rssRoute.includes('"Content-Type": "application/rss+xml; charset=utf-8"'), "RSS must serve an explicit XML MIME type");
assert(rssFormatter.includes("escapeRssXml") && rssFormatter.includes("toRssPubDate"), "RSS must escape XML and serialize real calendar dates");
assert(followComponent.includes("subscribeUrl &&") && !/<form\b/i.test(followComponent), "Email follow must be provider-gated, never a fake local signup form");
assert(newsletterProvider.includes('process.env.NEXT_PUBLIC_NEWSLETTER_SUBSCRIBE_URL'), "Newsletter destination must be opt-in configured");
assert(newsletterProvider.includes('url.protocol !== "https:"'), "Newsletter destinations must require HTTPS");
assert(legal.includes("DECODISTA does not operate a newsletter signup"), "Privacy policy must not claim an unconfigured subscription service is active");
const weeklySources = [...weeklyData.matchAll(/url: "(https:\/\/[^"]+)"/g)].map((match) => match[1]);
assert(weeklySources.length >= 4, "First weekly edition must cite multiple direct primary sources");
assert(new Set(weeklySources).size === weeklySources.length, "Weekly issue should not repeat a primary source");
assert(weeklySources.every((url) => /^https:\/\/(?:support\.apple\.com|www\.mozilla\.org|blog\.google|openai\.com|www\.microsoft\.com|about\.fb\.com)\//.test(url)), "Weekly sources must point directly to reviewed primary publishers");
assert(weeklyData.indexOf('slug: "2026-11-11"') !== -1, "Weekly issue 02 must be dated");
assert(weeklyData.indexOf('slug: "2026-11-11"') < weeklyData.indexOf('slug: "2026-11-01"'), "Newest weekly issue must come first");
const secondIssue = weeklyData.split('slug: "2026-11-11"')[1]?.split('slug: "2026-11-01"')[0] ?? "";
assert(/issueNumber: 2/.test(secondIssue), "Issue 02 must have the correct issue number");
assert(/publishedDate: "2026-11-11"/.test(secondIssue), "Issue 02 must carry its actual publication date");
assert(/periodStart: "2026-11-02"/.test(secondIssue) && /periodEnd: "2026-11-10"/.test(secondIssue), "Issue 02 must state its reporting window");
const secondIssueDates = [...secondIssue.matchAll(/announcedDate: "(2026-11-\d{2})"/g)].map((match) => match[1]);
assert.equal(secondIssueDates.length, 5, "Issue 02 must have exactly five dated developments");
assert(secondIssueDates.every((date) => date >= "2026-11-02" && date <= "2026-11-10"), "Issue 02 updates must fall within its reporting window");
assert(/slug: "2026-11-01"/.test(weeklyData), "First weekly issue must have an explicit dated slug");
assert(/publishedDate: "2026-11-01"/.test(weeklyData), "First weekly issue must have a dated publication field");
assert(weeklyData.includes("implementation is planned over the coming months"), "Do not describe the proposed AI training signal as already implemented");

for (const header of [
  "Content-Security-Policy",
  "Strict-Transport-Security",
  "X-Content-Type-Options",
  "Referrer-Policy",
  "X-Frame-Options",
  "Permissions-Policy",
]) {
  assert(nextConfig.includes(header), `Global security header is missing: ${header}`);
}
assert(nextConfig.includes("https://challenges.cloudflare.com"), "CSP must allow Cloudflare Turnstile");
assert(!nextConfig.includes("'unsafe-eval'"), "CSP must not permit unsafe-eval");
assert(!/includeSubDomains|preload/.test(nextConfig), "HSTS must not opt into subdomains or preload without a separate audit");
assert(/\/admin\*[\s\S]*Content-Security-Policy:[^\n]*https:\/\/unpkg\.com/.test(staticHeaders), "Admin CSP must preserve the pinned Decap bundle");
assert(/\/admin\*[\s\S]*script-src[^\n]*'unsafe-eval'[^\n]*https:\/\/unpkg\.com/.test(staticHeaders), "Admin CSP must retain Decap's narrowly scoped runtime-evaluation requirement");
assert(/\/_next\/static\/\*[\s\S]*max-age=31536000, immutable/.test(staticHeaders), "Hashed framework assets need immutable caching");
assert(/alternates:\s*null/.test(notFound), "404 metadata must not inherit the homepage canonical");
assert(/openGraph:\s*null/.test(notFound), "404 metadata must not inherit homepage Open Graph metadata");
assert(/index:\s*false/.test(notFound), "404 metadata must remain noindex");

const topicCaseGroups = new Map();
for (const article of articles) {
  for (const topic of article.tags) {
    const key = topic.toLocaleLowerCase("en");
    const labels = topicCaseGroups.get(key) ?? new Set();
    labels.add(topic);
    topicCaseGroups.set(key, labels);
  }
}
for (const [topic, labels] of topicCaseGroups) {
  assert.equal(labels.size, 1, `Topic casing differs for ${topic}: ${[...labels].join(", ")}`);
}

const publicTextRoots = ["app", "components", "lib", "public"];
const textExtensions = new Set([".css", ".html", ".js", ".json", ".md", ".mjs", ".svg", ".ts", ".tsx", ".txt", ".yml", ".yaml"]);
for (const root of publicTextRoots) {
  const stack = [new URL(`../${root}/`, import.meta.url)];
  while (stack.length) {
    const directory = stack.pop();
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const location = new URL(entry.name, directory);
      if (entry.isDirectory()) {
        stack.push(new URL(`${entry.name}/`, directory));
      } else if (textExtensions.has(new URL(location).pathname.match(/\.[^.]+$/)?.[0] ?? "")) {
        assert(!/[a-z0-9._%+-]+@gmail\.com/i.test(fs.readFileSync(location, "utf8")), `Public source contains a Gmail address: ${location.pathname}`);
      }
    }
  }
}

console.log("Validated navigation, Science visibility, protected contact route, sitemap freshness rules, and robots output contracts.");
