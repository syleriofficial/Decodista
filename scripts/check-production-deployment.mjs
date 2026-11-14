import { mkdir, writeFile } from "node:fs/promises";

// Network-only checks against the PUBLIC production deployment.
// No Cloudflare credentials; no changes to the live site.
const base = process.env.DECODISTA_PRODUCTION_URL ?? "https://decodista.com";
const out = process.env.DECODISTA_PRODUCTION_AUDIT_DIR ?? "artifacts/production-qa";
await mkdir(out, { recursive: true });

async function inspect(path) {
  const url = new URL(path, base).toString();
  const response = await fetch(url, {
    headers: { accept: path.endsWith(".xml") ? "application/xml,text/xml,*/*" : path.endsWith(".txt") ? "text/plain,*/*" : "text/html,*/*" },
    signal: AbortSignal.timeout(20000),
  });
  const body = await response.text();
  return {
    url, status: response.status, body,
    headers: {
      cacheControl: response.headers.get("cache-control"),
      cfCacheStatus: response.headers.get("cf-cache-status"),
      cfRay: response.headers.get("cf-ray"),
      contentType: response.headers.get("content-type"),
      xContentTypeOptions: response.headers.get("x-content-type-options"),
      strictTransportSecurity: response.headers.get("strict-transport-security"),
    },
  };
}

const checks = [];
const snapshots = {};
function check(name, condition, details) {
  checks.push({ name, status: condition ? "passed" : "failed", details });
}
const articlePath = "/articles/gmail-not-receiving-emails-google-storage-full";
const currentSections = ["/ai", "/how-to", "/security", "/digital-life"];
const editorialSections = ["/tech-news", "/reviews", "/science", "/entertainment"];
const primaryNavigation = [...editorialSections, "/latest"];
const moreNavigation = [...currentSections, "/weekly"];
const requiredPaths = ["/", ...currentSections, ...editorialSections, "/latest", "/search", "/search?q=Google%20Photos&q=ignored", "/about", "/review-methodology", articlePath, "/robots.txt", "/sitemap.xml"];
for (const path of requiredPaths) {
  try {
    const result = await inspect(path);
    snapshots[path] = result;
    check("GET " + path, result.status === 200, "HTTP " + result.status);
  } catch (error) {
    check("GET " + path, false, String(error));
  }
}

for (const path of ["/", "/how-to", "/latest", "/search", "/about", "/review-methodology", articlePath]) {
  const html = snapshots[path]?.body ?? "";
  if (!html) continue;
  // Limit the check to the header's nav: the footer may contain repeated links.
  const nav = html.match(/<nav\b[^>]*id="site-navigation"[^>]*>[\s\S]*?<\/nav>/)?.[0] ?? "";
  const latestInPrimary = /<a\b[^>]*href="\/latest"[^>]*>\s*Latest\s*<\/a>/.test(nav);
  const moreStarts = nav.indexOf("more-panel");
  const moreRegion = moreStarts < 0 ? "" : nav.slice(moreStarts);
  check(path + " Latest primary navigation", latestInPrimary, "Latest should be visible in main navigation");
  check(path + " no duplicate Latest in More", !/<a\b[^>]*href="\/latest"/.test(moreRegion), "Latest must not be duplicated in More");
  const primary = nav.split("<details", 1)[0];
  const links = [...primary.matchAll(/<a\b[^>]*href="(\/[^"]+)"/g)].map((match) => match[1]);
  check(path + " editorial primary nav order",
    JSON.stringify(links) === JSON.stringify(primaryNavigation),
    "Primary navigation must be Tech News, Reviews, Science, Entertainment, Latest");
  check(path + " More retains published guides",
    moreNavigation.every((section) => moreRegion.includes('href="' + section + '"')),
    "Published AI, How-To, Security, Digital Life and Weekly Brief must remain accessible under More");
  check(path + " More has no duplicate primary sections",
    primaryNavigation.every((section) => !moreRegion.includes('href="' + section + '"')),
    "Each editorial navigation destination must appear in the intended menu only");

  // For vinext async generateMetadata, tags in a hidden body outlet can pass
  // simple string checks while failing search/social crawlers and Lighthouse.
  const head = html.split("</head>", 1)[0];
  const metaTags = [...head.matchAll(/<meta\b[^>]*>/g)].map(match => match[0]);
  const linkTags = [...head.matchAll(/<link\b[^>]*>/g)].map(match => match[0]);
  const description = metaTags.find(tag => /\bname=["']description["']/.test(tag));
  const canonical = linkTags.find(tag => /\brel=["']canonical["']/.test(tag));
  check(path + " description in head", Boolean(description && /\bcontent=["'][^"']{30,}["']/.test(description)), "SEO description must be present in <head>");
  check(path + " canonical in head", Boolean(canonical && canonical.includes(path === "/" ? base : path)), "Canonical URL must be present in <head>");
}

for (const section of currentSections) {
  const html = snapshots[section]?.body ?? "";
  if (!html) continue;
  const main = html.split('<main id="main-content"', 2)[1] ?? "";
  check(section + " contains published articles",
    /<a\b[^>]*href="\/articles\//.test(main) && !main.includes("Coverage in development"),
    "Every promoted section must lead to real published stories, not an empty placeholder");
}
for (const section of editorialSections) {
  const html = snapshots[section]?.body ?? "";
  if (!html || !html.includes("Coverage in development")) continue;
  const head = html.split("</head>", 1)[0];
  check(section + " empty page has noindex",
    /<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/.test(head),
    "Empty editorial sections should not be search-indexable");
}

const articleHtml = snapshots[articlePath]?.body ?? "";
if (articleHtml) {
  const discovery = articleHtml.match(/<nav\b[^>]*class="article-discovery"[^>]*>[\s\S]*?<\/nav>/)?.[0] ?? "";
  check("Article has contextual discovery",
    Boolean(discovery && discovery.includes('href="/articles/') && discovery.includes('href="/topics/')),
    "Readers should be able to follow genuine related guides and populated topic hubs");
  const discoveryLinks = [...new Set([...discovery.matchAll(/href="(\/(?:articles|topics)\/[^"]+)"/g)].map((match) => match[1]))];
  check("Article discovery has distinct destinations",
    discoveryLinks.length >= 2,
    "Continue exploring should offer a relevant guide and populated topic hub");
  for (const link of discoveryLinks) {
    try {
      const destination = await inspect(link);
      check("Discovery destination " + link, destination.status === 200, "HTTP " + destination.status);
    } catch (error) {
      check("Discovery destination " + link, false, String(error));
    }
  }
}
const howToHtml = snapshots["/how-to"]?.body ?? "";
if (howToHtml) {
  const leadIndex = howToHtml.indexOf('class="category-lead-image"');
  const leadMarkup = leadIndex < 0 ? "" : howToHtml.slice(leadIndex, leadIndex + 1500);
  check("How-To lead uses responsive WebP", leadMarkup.includes("/images/responsive/") && !leadMarkup.includes("/_next/image"), "Promoted guide Hero must have direct responsive variants instead of optimizer redirects");
}
const aboutHtml = snapshots["/about"]?.body ?? "";
if (aboutHtml) {
  check("About reflects published topics", aboutHtml.includes("Our current published coverage focuses on AI tools") && !aboutHtml.includes("Follow technology, science and digital entertainment"), "Editorial scope must not imply unlaunched sections are already covered");
}

const searchHtml = snapshots["/search"]?.body ?? "";
if (searchHtml) {
  const head = searchHtml.split("</head>", 1)[0];
  check("Search page is noindex", /<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/.test(head), "Search queries must not become thin indexable pages");
  check("Search provides labeled input", searchHtml.includes('id="article-search"') && searchHtml.includes('type="search"'), "Readers should have an accessible search field");
}
const deepSearch = snapshots["/search?q=Google%20Photos&q=ignored"];
if (deepSearch) {
  const head = deepSearch.body.split("</head>", 1)[0];
  check("Repeated search parameters are safe", deepSearch.status === 200 && /<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/.test(head), "Deep-linked search must stay accessible and noindex without 500 errors");
}
const latestHtml = snapshots["/latest"]?.body ?? "";
if (latestHtml) {
  const imageTags = latestHtml.split("<img ").slice(1).map(fragment => fragment.split(">", 1)[0]);
  check("Latest images bypass optimizer redirects", imageTags.length > 0 && imageTags.every(tag => tag.includes('src="/images/')), "Local article images should point directly to WebP files instead of redirecting through /_next/image");
  const variantUrl = latestHtml.match(/\/images\/responsive\/[a-zA-Z0-9/_-]+\.webp/)?.[0];
  check("Latest responsive srcset exists", Boolean(variantUrl), "Latest article images must advertise real generated WebP candidates");
  if (variantUrl) {
    try {
      const response = await fetch(new URL(variantUrl, base), { signal: AbortSignal.timeout(20000) });
      check("Generated WebP variant accessible", response.ok && (response.headers.get("content-type") ?? "").includes("image/webp"), "Selected responsive WebP should return HTTP 200 image/webp on Cloudflare");
      if (response.ok) await response.arrayBuffer();
    } catch (error) {
      check("Generated WebP variant accessible", false, String(error));
    }
  }
  check("Latest SEO title", /<title[^>]*>[^<]*Latest[^<]*<\/title>/.test(latestHtml), "Latest needs a descriptive title");
  check("Latest canonical", latestHtml.includes("rel=\"canonical\"") && latestHtml.includes("/latest"), "Canonical link should exist");
}
const reviewHtml = snapshots["/review-methodology"]?.body ?? "";
if (reviewHtml) check("Review Methodology content", reviewHtml.includes("Research versus hands-on testing"), "Policy page should be rendered");
const robots = snapshots["/robots.txt"]?.body ?? "";
if (robots) {
  check("Robots contains sitemap", robots.includes("/sitemap.xml"), "Sitemap discovery");
  check("Robots excludes admin", robots.includes("/admin"), "Admin should not be crawled");
}
const sitemap = snapshots["/sitemap.xml"]?.body ?? "";
if (sitemap) {
  check("Sitemap contains Latest", sitemap.includes("https://decodista.com/latest"), "Latest archive must be discoverable");
  check("Sitemap contains review methodology", sitemap.includes("https://decodista.com/review-methodology"), "Trust page discoverability");
}

const report = {
  checkedAt: new Date().toISOString(),
  target: base,
  kind: "public-production-http-check",
  note: "Validates live public HTTP and discovery contracts. Cloudflare deployment SHA is checked separately by the workflow; Google indexing is outside this check.",
  checks,
  pages: Object.fromEntries(Object.entries(snapshots).map(([path, value]) => [path, {
    url: value.url, status: value.status, headers: value.headers, bytes: Buffer.byteLength(value.body, "utf8"),
  }])),
};
await writeFile(out + "/http-checks.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
const failed = checks.filter(item => item.status === "failed");
if (failed.length) {
  console.error("Production verification failed: " + failed.map(item => item.name).join("; "));
  process.exitCode = 1;
}
