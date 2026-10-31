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
const weeklyArchive = read("app/weekly/page.tsx");
const weeklyIssue = read("app/weekly/[slug]/page.tsx");
const weeklyData = read("lib/weekly-briefs.ts");
const topicPage = read("app/topics/[topic]/page.tsx");
const articlePage = read("app/articles/[slug]/page.tsx");
const contentHelpers = read("lib/content.ts");
const science = read("app/[section]/page.tsx");
const sitemap = read("app/sitemap.ts");
const robots = read("app/robots.ts");
const ads = read("public/ads.txt");
const contactPage = read("app/contact/page.tsx");
const standardsRedirect = read("app/editorial-standards/page.tsx");
const nextConfig = read("next.config.ts");
const notFound = read("app/not-found.tsx");
const staticHeaders = read("public/_headers");
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { articles } = loadArticles(projectRoot);

const navigation = site.match(/export const NAV_ITEMS = \[([\s\S]*?)\] as const;/)?.[1];
assert(navigation, "Primary navigation definition is missing");
assert.deepEqual(
  [...navigation.matchAll(/label: "([^"]+)"/g)].map((match) => match[1]),
  ["AI", "How-To", "Digital Life", "Security", "Latest"],
  "Primary navigation must not expose inactive or legacy sections",
);

assert(!/title="Science"|href="\/science"/.test(homepage), "Homepage must not expose an empty Science module");
assert.equal(articles.filter((article) => article.category === "science").length, 0, "Science must remain empty until genuine coverage is published");
assert(/robots:\s*\{[\s\S]*?index:\s*hasStories/.test(science), "Empty category routes must remain noindex");
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
assert(homepage.includes("getArticlesByTopic(slug).length >= TOPIC_MAP[slug].minimumArticles"), "Reader paths must never lead to unpopulated topics");
assert(topicPage.includes("Start here") && topicPage.includes("startHereSlugs"), "Topic hubs must have non-duplicated starting points");
assert(articlePage.includes("related.length > 0"), "Do not render an empty related-reading section");
assert(contentHelpers.includes(".filter(({ score }) => score > 0)"), "Related articles must have a positive relevance score");
assert(!/newsletter|subscribe now/i.test(homepage), "Do not advertise an unimplemented subscription feature");
assert(homepage.includes("weeklyBriefs[0]") && homepage.includes("weekly-feature"), "Homepage must highlight a published weekly issue");
assert(weeklyArchive.includes("weeklyBriefs") && weeklyArchive.includes("Latest published issue"), "Weekly archive must render a real published edition");
assert(weeklyIssue.includes("getWeeklyBrief(slug)") && weeklyIssue.includes("notFound()"), "Weekly issue route must reject unknown slugs");
assert(weeklyIssue.includes("Primary source:") && weeklyIssue.includes("rel=\"noopener noreferrer\""), "Weekly issue must attribute and safely link to primary sources");
assert(weeklyIssue.includes("BreadcrumbList") && weeklyIssue.includes("BlogPosting"), "Weekly issues need discoverable structured data");
assert(sitemap.includes('route: "/weekly"') && sitemap.includes('url: `${SITE_URL}/weekly/${issue.slug}`'), "Weekly archive and issues must appear in the sitemap");
assert(!/<form|subscribe now|newsletter signup/i.test(weeklyArchive), "Do not publish an unimplemented weekly email signup");
const weeklySources = [...weeklyData.matchAll(/url: "(https:\/\/[^"]+)"/g)].map((match) => match[1]);
assert(weeklySources.length >= 4, "First weekly edition must cite multiple direct primary sources");
assert(new Set(weeklySources).size === weeklySources.length, "Weekly issue should not repeat a primary source");
assert(weeklySources.every((url) => /^https:\/\/(?:support\.apple\.com|www\.mozilla\.org|blog\.google|openai\.com)\//.test(url)), "Weekly sources must point directly to reviewed primary publishers");
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
