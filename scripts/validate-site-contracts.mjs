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
const mobileAudit = read("scripts/audit-mobile-performance.mjs");
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
const visualReview = read("docs/EDITORIAL_HERO_VISUAL_REVIEW_2026-11-16.md");
const contentHelpers = read("lib/content.ts");
const science = read("app/[section]/page.tsx");
const css = read("app/globals.css");
const redesignedCss = read("app/editorial-redesign.css");
const latestArchive = read("app/latest/page.tsx");
const paginationHelper = read("lib/pagination.ts");
const sitemap = read("app/sitemap.ts");
const robots = read("app/robots.ts");
const ads = read("public/ads.txt");
const contactPage = read("app/contact/page.tsx");
const searchPage = read("app/search/page.tsx");
const searchClient = read("components/search-client.tsx");
const searchLogic = read("lib/search.mjs");
assert(searchPage.includes("normalizeSearchQuery(Array.isArray(q) ? q[0] : q)"), "Search URL parameters must be bounded and safe for duplicate values");
assert(searchPage.includes("index: false"), "Internal search results must remain noindex");
assert(searchClient.includes("searchPublishedRecords(records, query)"), "Reader search must rank published records by separate keywords");
assert(searchClient.includes("Clear search") && searchClient.includes("maxLength={SEARCH_QUERY_LIMIT}"), "Search must have a clear action and bounded user input");
assert(searchClient.includes('action="/search" method="get"') && searchClient.includes('name="q"'), "Search must remain functional before React hydration or when JavaScript is disabled");
assert(searchLogic.includes("terms.every") && searchLogic.includes("a.index - b.index"), "Search relevance must be all-keywords and stable");
assert(searchClient.includes("suggestedQueries.map") && searchClient.includes('aria-pressed={normalizeSearchQuery(query) === term}')
  && searchClient.includes('onClick={() => setSearch(term)}'),
  "Search topic suggestions must be accessible and interactive");
assert(css.includes(".search-suggestions button[aria-pressed"), "Search topic chips need visible selection feedback");

const howToPage = read("app/how-to/page.tsx");
const standardsRedirect = read("app/editorial-standards/page.tsx");
const nextConfig = read("next.config.ts");
assert(layout.includes('import "./editorial-redesign.css";'), "All public pages must load the Signal Edition design system");
assert(redesignedCss.includes(".lead-story") && redesignedCss.includes(".latest-feed") && redesignedCss.includes(".reader-paths") &&
       redesignedCss.includes(".article-reading") && redesignedCss.includes(".category-header") &&
       redesignedCss.includes(".search-page") && redesignedCss.includes(".weekly-page") &&
       redesignedCss.includes(".site-footer"), "Full redesign must cover all public editorial page templates");
assert(header.includes('className="edition-line wrap"'), "Editorial masthead must include publication identity line");
assert(footer.includes('className="footer-manifesto wrap"'), "Footer must include editorial colophon");
assert(redesignedCss.includes("@media (max-width: 600px)") && redesignedCss.includes("@media (max-width: 800px)"),
  "Magazine layout must include compact mobile and tablet reflow");
const imageComponent = read("components/responsive-image.tsx");
const cardComponent = read("components/article-card.tsx");
const imageGenerator = read("build/responsive-images-vite-plugin.ts");
const issue78Generator = read("scripts/generate-issue78-heroes.mjs");
const packageInfo = read("package.json");
const viteConfig = read("vite.config.ts");
assert(imageComponent.includes("srcSet={info?.srcSet}"), "Responsive image component must use generated srcset");
assert(cardComponent.includes("imageSizes?: string") && cardComponent.includes("sizes={responsiveSizes}"),
  "Article cards must expose layout-aware image sizes");
assert(cardComponent.includes('(max-width: 1000px) 50vw, 48vw'),
  "Two-column article card images must not use undersized three-column candidates");
assert(homepage.includes('imageSizes={stories.length === 1 ? undefined :'),
  "Three-column homepage cards must retain efficient, layout-specific image sizes");
assert(css.includes(".category-lead-image:hover img") && css.includes(".search-result-image:hover img"),
  "Editorial media should share consistent hover presentation");
assert(css.includes(".section-heading { align-items: flex-start; flex-direction: column; gap: .55rem; }"),
  "Narrow-screen editorial headings must stack rather than overflow");
assert(imageComponent.includes("fetchPriority={priority ?"), "Hero image must retain high fetch priority");
const articleHeroGenerator = read("scripts/generate-article-heroes.mjs");
const packageScripts = JSON.parse(packageInfo).scripts;
assert(issue78Generator.includes("Refusing to overwrite a different existing editorial asset") &&
  articleHeroGenerator.includes("recover-hacked-google-account-gmail") &&
  ["precontent:validate", "prebuild", "predev"].every(hook =>
    packageScripts[hook].includes("node scripts/generate-issue78-heroes.mjs") &&
    packageScripts[hook].includes("node scripts/generate-article-heroes.mjs")),
  "Reviewed hero art must be checked before validation, development and builds without overwriting existing originals");
for (const name of ["openai-agent-image-leak-concept", "google-photos-undo-backup-local-kept-cloud-removed", "google-photos-free-up-space-cloud-copies-kept"]) {
  assert(issue78Generator.includes(name), "All three Issue #78 hero artworks must be reproducibly generated");
}
assert(imageGenerator.includes("withoutEnlargement: true") && imageGenerator.includes("responsive-images.generated.json"), "Image pipeline must not enlarge originals and must write the manifest");
assert(viteConfig.includes("responsiveImagesPlugin()"), "Vite must generate responsive WebP assets in local previews and production builds");
assert(nextConfig.includes("images: { unoptimized: true }"), "Do not generate redirecting image optimizer URLs until Vinext has a working image backend");
const notFound = read("app/not-found.tsx");
const staticHeaders = read("public/_headers");
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { articles } = loadArticles(projectRoot);

const navigation = site.match(/export const NAV_ITEMS = \[([\s\S]*?)\] as const;/)?.[1];
assert(navigation, "Primary navigation definition is missing");
assert.deepEqual(
  [...navigation.matchAll(/label: "([^"]+)"/g)].map((match) => match[1]),
  ["Tech News", "AI", "Reviews", "How-To", "Security", "Science"],
  "Primary navigation must follow the selected editorial menu order",
);

const footerSecondary = site.match(/export const FOOTER_SECONDARY_ITEMS = \[([\s\S]*?)\] as const;/)?.[1];
assert(footerSecondary, "Footer secondary navigation definition is missing");
assert.deepEqual(
  [...footerSecondary.matchAll(/label: "([^"]+)"/g)].map((match) => match[1]),
  ["Latest", "Digital Life", "Weekly Brief"],
  "Footer must retain Latest, Digital Life and Weekly Brief without restoring More",
);
assert(header.includes("NAV_ITEMS.map") && !header.includes("MORE_NAV_ITEMS") && !header.includes("more-menu"),
  "Header must expose only the approved primary nav items, without a More dropdown");
assert(header.includes('aria-current={pathname === item.href ? "page" : undefined}'),
  "Navigation should identify the active editorial category accessibly");
assert(homepage.includes('className="home-intro wrap"'), "Homepage needs a visible editorial introduction");
assert(homepage.includes('className="home-quick-search wrap"') && homepage.includes('action="/search" method="get"') &&
  homepage.includes('id="home-quick-search-input"') && homepage.includes('name="q"') &&
  homepage.includes('type="search"'), "Homepage quick search must work with an accessible GET form before hydration");
assert(redesignedCss.includes(".home-quick-search-controls") && redesignedCss.includes(".home-quick-search-controls:focus-within"),
  "First-screen search needs responsive and visible focus styling");
assert(science.includes("!featured && articles.length > 0") &&
  science.includes("Latest published across DECODISTA") &&
  science.includes("These articles are from other published sections"),
  "Empty categories must clearly label genuine cross-section reading options without miscategorizing content");
assert(homepage.indexOf('className="section-block latest-home') < homepage.indexOf('className="reader-paths wrap"')
  && homepage.indexOf('className="reader-paths wrap"') < homepage.indexOf('title="AI" href="/ai"'),
  "Homepage should lead with recent stories and search discovery before category archives");
assert(homepage.indexOf('const latest = takeDistinct(articles, 3, false)') < homepage.indexOf('const ai = takeDistinct('),
  "Latest Stories should reserve distinct recent articles before category sections");
assert(homepage.includes('sizes="(max-width: 1180px) 100vw, 38vw"'),
  "Signal Edition feature artwork should not overfetch oversized desktop WebP variants");
assert(mobileAudit.includes('"small-mobile-homepage"') && mobileAudit.includes('"small-mobile-search"') &&
  mobileAudit.includes('"small-mobile-article"') && mobileAudit.includes("hasTouch: true") &&
  mobileAudit.includes("-after-consent.png"),
  "Live mobile verification must cover 320px touch behavior, key pages and unobstructed screenshots");
assert(homepage.includes('imageSizes="(max-width: 600px) 38vw, (max-width: 1000px) 50vw, 32vw"'),
  "Latest magazine tiles must preserve correct responsive image hints");
assert(footer.includes("FOOTER_SECONDARY_ITEMS.map"), "Footer must keep secondary destinations accessible");
assert(footer.includes("{SITE_DESCRIPTION}"), "Footer summary must stay in sync with site metadata");
assert(footer.includes("{SITE_TAGLINE}"), "Footer tagline must stay in sync with the site-wide identity");
for (const category of ["ai", "security", "digital-life"]) {
  assert(homepage.includes(`getArticlesByCategory("${category}")`), `Homepage must feature populated ${category} stories`);
  assert(articles.some((article) => article.category === category), `Promoted category ${category} cannot be empty`);
}
assert(homepage.includes('getArticlesByContentType("how-to")'), "Homepage must promote real How-To guides");
assert(howToPage.includes('import { ResponsiveImage } from "@/components/responsive-image"'), "How-To lead must use the shared responsive WebP implementation");
assert(howToPage.includes('<ResponsiveImage src={featured.featuredImage}') && howToPage.includes("fill priority sizes="), "How-To Hero must advertise real variants and retain high priority");
assert(!howToPage.includes('next/image'), "How-To must not revert to redirecting Next.js image URLs");
assert(articles.some((article) => article.contentType === "how-to"), "Primary How-To archive must have real guides");
for (const category of ["tech-news", "ai", "reviews", "how-to", "security", "science"]) {
  assert(navigation.includes(`href: "/${category}"`), `Editorial primary navigation is missing ${category}`);
}
for (const destination of ["latest", "digital-life", "weekly"]) {
  assert(footerSecondary.includes(`href: "/${destination}"`), `Footer secondary navigation is missing ${destination}`);
}
const primaryHrefs = [...navigation.matchAll(/href: "([^"]+)"/g)].map((match) => match[1]);
const footerHrefs = [...footerSecondary.matchAll(/href: "([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set([...primaryHrefs, ...footerHrefs]).size, primaryHrefs.length + footerHrefs.length,
  "Primary and footer secondary navigation must not duplicate destinations");
assert(!navigation.includes('href: "/entertainment"') && !navigation.includes('href: "/latest"') && !navigation.includes('href: "/weekly"') && !site.includes("MORE_NAV_ITEMS"),
  "Retired Entertainment and More navigation must not return");
assert(homepage.includes("if (!stories.length) return null;"), "Homepage must not present empty editorial sections");
assert.equal(articles.filter((article) => article.category === "science").length, 0, "Science must remain empty until genuine coverage is published");
assert(/robots:\s*\{[\s\S]*?index:\s*hasStories/.test(science), "Empty category routes must remain noindex");
assert(science.includes('className="section-explore-links"') && science.includes('getArticlesByContentType("how-to").length')
  && science.includes('all.length === 1 ? "story" : "stories"'),
  "Category design must report real content counts and suggest only populated archives");
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
const aboutContent = legal.split('  about: {', 2)[1]?.split('  "review-methodology": {', 1)[0] ?? "";
assert(aboutContent.includes("Our current published coverage focuses on AI tools"), "About must describe the coverage readers can actually access");
assert(!/Follow technology, science and digital entertainment/.test(aboutContent), "About must not imply unlaunched sections are active");
assert(/ContactForm/.test(contactPage), "Contact page must expose the protected production form");
assert(/TURNSTILE_SITE_KEY/.test(contactPage), "Contact page must configure Cloudflare Turnstile");
assert(/private delivery address is never shown/i.test(contactPage), "Contact page must keep the recipient private");
assert(/permanentRedirect\("\/editorial-policy"\)/.test(standardsRedirect), "Editorial Standards alias must resolve to the canonical policy route");
const homepageForms = [...homepage.matchAll(/<form\\b[^>]*>/g)].map(([tag]) => tag);
assert(homepageForms.length === 1 &&
  homepageForms[0].includes('role="search"') &&
  homepageForms[0].includes('action="/search"') &&
  homepageForms[0].includes('method="get"') &&
  !/contact-form|newsletter-form|email-signup/i.test(homepage),
  "Homepage must contain only its functional GET search form, not a contact or signup form");
assert(!/Trending|Preview only/i.test(homepage), "Homepage must not expose unsupported traffic or preview claims");
assert(homepage.includes("const lead = articles[0]"), "Homepage must lead with the newest published story");
assert(homepage.includes("readerJourneys") && homepage.includes("reader-paths"), "Homepage must offer curated reader journeys");
assert(homepage.includes('className="reader-search-link" href="/search"'), "Homepage must offer direct access to published-guide search");
assert(!homepage.includes("<FollowDecodista />"), "Homepage should not promote a duplicate RSS subscribe panel; footer retains RSS");
assert(homepage.includes("getArticlesByTopic(slug).length >= TOPIC_MAP[slug].minimumArticles"), "Reader paths must never lead to unpopulated topics");
assert(topicPage.includes("Start here") && topicPage.includes("startHereSlugs"), "Topic hubs must have non-duplicated starting points");
assert(articlePage.includes("related.length > 0"), "Do not render an empty related-reading section");
assert(contentHelpers.includes(".filter(({ contextScore }) => contextScore > 0)"), "Automatic related guides must share at least one topical signal; category or content type alone is insufficient");
assert(contentHelpers.includes("return [...manual, ...automaticallyRelated].slice(0, limit)"), "Manual editorial related guides must continue to take priority over automatic suggestions");
assert(contentHelpers.includes("contextScore = sharedTags * 6 + sharedHubs * 3"),
  "Related guides must prefer a genuinely shared subject before generic category similarity");
assert(contentHelpers.includes("getArticleTopicHubs") && contentHelpers.includes("articleCount >= topic.minimumArticles"),
  "Article discovery must link only to populated topic hubs");
assert(articlePage.includes("Conceptual editorial illustration, not an official product screenshot.") &&
  articlePage.includes("fictional artwork, not a photograph"),
  "Published images must distinguish conceptual art from documentary evidence");
assert(visualReview.includes("Complete article-to-image review") && visualReview.includes("openai-agent-leak-53-chatgpt-user-images"),
  "Every published hero must have an accessible and honest visual review record");
assert(articlePage.indexOf('className="article-discovery"') > articlePage.indexOf('className="article-main-grid"'),
  "Article discovery must follow the full article, not interrupt reading");
assert(articlePage.includes('className="article-discovery"') && articlePage.includes("topicHubs.slice(0, 2)"),
  "Article readers must find contextual guides and populated topic hubs before finishing the story");
assert(!/newsletter|subscribe now/i.test(homepage), "Do not advertise an unimplemented subscription feature");
assert(!homepage.includes('className="weekly-feature'), "Weekly Brief must not dominate the homepage");
assert(weeklyArchive.includes("weeklyBriefs") && weeklyArchive.includes("Latest published issue"), "Weekly archive must render a real published edition");
assert(weeklyIssue.includes("getWeeklyBrief(slug)") && weeklyIssue.includes("notFound()"), "Weekly issue route must reject unknown slugs");
assert(weeklyIssue.includes("Primary source:") && weeklyIssue.includes("rel=\"noopener noreferrer\""), "Weekly issue must attribute and safely link to primary sources");
assert(weeklyIssue.includes("BreadcrumbList") && weeklyIssue.includes("BlogPosting"), "Weekly issues need discoverable structured data");
assert(sitemap.includes('route: "/weekly"') && sitemap.includes('url: `${SITE_URL}/weekly/${issue.slug}`'), "Weekly archive and issues must appear in the sitemap");
assert(!/<form|subscribe now|newsletter signup/i.test(weeklyArchive), "Do not publish an unimplemented weekly email signup");
assert(layout.includes('"application/rss+xml": `${SITE_URL}/rss.xml`'), "RSS must be discoverable through document metadata");
assert(!navigation.includes('href: "/weekly"') && footerSecondary.includes('href: "/weekly"'),
  "Weekly Brief must remain a footer destination, not a primary menu item");
assert(site.includes('href: "/review-methodology", label: "Review Methodology"'), "Review methodology must be discoverable");
assert(sitemap.includes('"/review-methodology"'), "Review methodology must appear in sitemap");
assert(!homepage.includes('title="Reviews"'), "Do not promote the empty Reviews pillar in homepage sections");
assert(!homepage.includes('Tested and evaluated'), "Homepage must not imply unverified hands-on testing");
assert(site.includes("Independent technology explainers and step-by-step guides"), "Site description must reflect presently published content rather than empty future categories");
assert(!header.includes('href="/rss.xml"'), "RSS feed should remain discoverable in footer and metadata, not the main navigation");
assert(header.includes('event.key === "Escape" && open') && header.includes('setOpen(false)'),
  "Escape must still close the mobile navigation when open");
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
const verifiedWeeklyHosts = new Set([
  "support.apple.com", "www.mozilla.org", "blog.google", "openai.com",
  "www.microsoft.com", "about.fb.com", "chromereleases.googleblog.com",
  "consumer.ftc.gov", "security.apple.com", "www.cisa.gov",
  "forums.unrealircd.org", "research.checkpoint.com",
]);
assert(weeklySources.every((url) => {
  try { const parsed = new URL(url); return parsed.protocol === "https:" && verifiedWeeklyHosts.has(parsed.hostname); }
  catch { return false; }
}), "Weekly sources must point directly to reviewed primary publishers");
assert(weeklyData.includes('slug: "2026-11-16"') && weeklyData.includes('issueNumber: 3'), "Weekly issue 03 must be dated and numbered");
const thirdIssue = weeklyData.split('slug: "2026-11-16"')[1]?.split('slug: "2026-11-11"')[0] ?? "";
assert(thirdIssue.includes('periodStart: "2026-11-11"') && thirdIssue.includes('periodEnd: "2026-11-15"'), "Issue 03 must report on November 11–15");
const thirdIssueDates = [...thirdIssue.matchAll(/announcedDate: "(2026-11-\d{2})"/g)].map((match) => match[1]);
assert.equal(thirdIssueDates.length, 5, "Issue 03 must contain five dated developments");
assert(thirdIssueDates.every((date) => date >= "2026-11-11" && date <= "2026-11-15"), "Issue 03 updates must fall within the reporting period");
assert(weeklyData.indexOf('slug: "2026-11-16"') < weeklyData.indexOf('slug: "2026-11-11"'), "Weekly issue 03 must be newest");
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
