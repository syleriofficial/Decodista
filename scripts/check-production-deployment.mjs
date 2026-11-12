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
const requiredPaths = ["/", "/latest", "/review-methodology", "/robots.txt", "/sitemap.xml"];
for (const path of requiredPaths) {
  try {
    const result = await inspect(path);
    snapshots[path] = result;
    check("GET " + path, result.status === 200, "HTTP " + result.status);
  } catch (error) {
    check("GET " + path, false, String(error));
  }
}

for (const path of ["/", "/latest", "/review-methodology"]) {
  const html = snapshots[path]?.body ?? "";
  if (!html) continue;
  // Limit the check to the header's nav: the footer may contain repeated links.
  const nav = html.match(/<nav\b[^>]*id="site-navigation"[^>]*>[\s\S]*?<\/nav>/)?.[0] ?? "";
  const latestInPrimary = /<a\b[^>]*href="\/latest"[^>]*>\s*Latest\s*<\/a>/.test(nav);
  const moreStarts = nav.indexOf("more-panel");
  const moreRegion = moreStarts < 0 ? "" : nav.slice(moreStarts);
  check(path + " Latest primary navigation", latestInPrimary, "Latest should be visible in main navigation");
  check(path + " no duplicate Latest in More", !/<a\b[^>]*href="\/latest"/.test(moreRegion), "Latest must not be duplicated in More");
}

const latestHtml = snapshots["/latest"]?.body ?? "";
if (latestHtml) {
  check("Latest mobile thumbnail sizing", latestHtml.includes("38vw"), "Expected <=600px responsive image width from PR #41");
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
  note: "Validates public behavior and PR #41 responsive image marker, not the exact Cloudflare deployment SHA or Google indexing.",
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
