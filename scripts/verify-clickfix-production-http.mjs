import { mkdir, writeFile } from "node:fs/promises";

const origin = "https://decodista.com";
const slug = "/articles/fake-captcha-scams-clickfix-malware";
const images = [
  "/images/uploads/fake-captcha-scams-clickfix-malware.webp",
  "/images/uploads/clickfix-real-vs-fake-captcha.webp",
  "/images/uploads/clickfix-recovery-decision-flowchart.webp",
];
const results = [];
function record(name, passed, details = "") {
  results.push({ name, status: passed ? "PASS" : "FAIL", details });
  console.log((passed ? "PASS" : "FAIL") + " " + name + (details ? " — " + details : ""));
}
async function get(path, accept = "*/*") {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(origin + path, {
        headers: { accept },
        cache: "no-store",
        signal: AbortSignal.timeout(25000),
      });
      const bytes = Buffer.from(await response.arrayBuffer());
      if (response.status >= 500 && attempt < 3) {
        lastError = new Error("HTTP " + response.status);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        continue;
      }
      return { response, bytes, text: bytes.toString("utf8") };
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  throw lastError ?? new Error("Unspecified fetch failure");
}

let article;
try {
  article = await get(slug, "text/html");
  const html = article.text;
  record("Article HTTP 200", article.response.status === 200, "HTTP " + article.response.status + ", " + article.bytes.length + " bytes");
  record("Article HTML content type", (article.response.headers.get("content-type") || "").includes("text/html"), article.response.headers.get("content-type") || "(missing)");
  record("Correct article title", html.includes("Fake CAPTCHA Scams: How ClickFix Works and How to Stay Safe"));
  record("Correct publication date", html.includes("2026-11-23") && html.includes("November 23, 2026"));
  record("Self canonical", /<link\b[^>]*rel=["']canonical["'][^>]*href=["']https:\/\/decodista\.com\/articles\/fake-captcha-scams-clickfix-malware["']/i.test(html));
  record("Meta description", /<meta\b[^>]*name=["']description["'][^>]*content=["'][^"']{70,}/i.test(html));
  record("Article JSON-LD", /"@type"\s*:\s*"Article"/.test(html));
  record("Breadcrumb JSON-LD", /"@type"\s*:\s*"BreadcrumbList"/.test(html));
  record("Global first recovery guidance", html.includes("in your country"));
  record("No noindex tag", !/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html));
  record("All three image references", images.every(path => html.includes(path)));
  record("All three internal related article links", [
    "/articles/recover-hacked-google-account-gmail",
    "/articles/fake-tech-support-scams-remote-access-verification-code",
    "/articles/chrome-enhanced-protection-vs-standard-protection",
  ].every(path => html.includes(path)));
} catch (error) {
  record("Article fetch", false, String(error));
}
for (const path of images) {
  try {
    const asset = await get(path, "image/webp,*/*");
    const isWebp = asset.bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
      asset.bytes.subarray(8, 12).toString("ascii") === "WEBP";
    record("Image " + path, asset.response.status === 200 &&
      (asset.response.headers.get("content-type") || "").includes("image/webp") &&
      isWebp && asset.bytes.length >= 20000,
      "HTTP " + asset.response.status + ", type=" + asset.response.headers.get("content-type") +
      ", bytes=" + asset.bytes.length + ", WebP=" + isWebp);
  } catch (error) {
    record("Image " + path, false, String(error));
  }
}
try {
  const sitemap = await get("/sitemap.xml", "text/xml,application/xml,*/*");
  record("Article in XML sitemap", sitemap.response.status === 200 &&
    sitemap.text.includes("<loc>" + origin + slug + "</loc>"),
    "HTTP " + sitemap.response.status);
} catch (error) {
  record("Sitemap fetch", false, String(error));
}
await mkdir("artifacts/clickfix-live-http-qa", { recursive: true });
const report = {
  checkedAt: new Date().toISOString(),
  target: origin + slug,
  checks: results,
  passed: results.filter(r => r.status === "PASS").length,
  failed: results.filter(r => r.status === "FAIL").length,
  note: "External HTTP smoke test from a GitHub-hosted runner; not a browser visual or real-user performance test.",
};
await writeFile("artifacts/clickfix-live-http-qa/report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify({ passed: report.passed, failed: report.failed, target: report.target }));
if (report.failed) process.exitCode = 1;
