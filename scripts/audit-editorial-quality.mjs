import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { loadArticles } from "./content-loader.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = process.env.EDITORIAL_AUDIT_OUTPUT_DIR ?? "artifacts/editorial-quality";
const { articles, parsed } = loadArticles(root);
const editorialBySlug = new Map(parsed.map(entry => [entry.article.slug, entry.editorial]));
const checks = [];
const advisories = [];
const imageByPath = new Map();
const imageByHash = new Map();
const altByText = new Map();

function note(article, kind, message, severity = "advisory") {
  (severity === "error" ? checks : advisories).push({ article, kind, message });
}

function collectLinks(value, urls) {
  if (typeof value === "string" || value == null) return;
  if (Array.isArray(value)) {
    for (const piece of value) collectLinks(piece, urls);
    return;
  }
  if (value.type === "link" && typeof value.href === "string") {
    urls.add(value.href);
  }
  if (value.text !== undefined) collectLinks(value.text, urls);
  if (value.items) collectLinks(value.items, urls);
  if (value.headers) collectLinks(value.headers, urls);
  if (value.rows) collectLinks(value.rows, urls);
}

function sourceLinks(article) {
  const start = article.content.findIndex(block => block.type === "heading" && block.id === "sources-verification");
  if (start < 0) return null;
  const collected = new Set();
  for (const block of article.content.slice(start + 1)) {
    if (block.type === "heading" && block.level <= 2) break;
    collectLinks(block, collected);
  }
  return [...collected].filter(url => /^https?:\/\//i.test(url));
}

const inventory = [];
for (const article of articles) {
  const alt = (article.featuredImageAlt ?? "").trim();
  const normalizedAlt = alt.replace(/\s+/g, " ").toLowerCase();
  const source = article.featuredImage;
  if (alt.length < 25 || /^(?:image|picture|photo|illustration|graphic)(?: of)?[.! ]*$/i.test(alt)) {
    note(article.slug, "image-alt", "Featured artwork needs a meaningful, context-specific alternative description.", "error");
  }
  if (normalizedAlt === article.title.trim().toLowerCase()) {
    note(article.slug, "image-alt", "Hero alt must describe the visual rather than repeat the headline.", "error");
  }
  if (alt.length > 230) {
    note(article.slug, "image-alt-length", "Hero alt exceeds 230 characters; a concise description is preferred.");
  }
  const priorAlt = altByText.get(normalizedAlt);
  if (priorAlt && priorAlt !== article.slug) {
    note(article.slug, "duplicate-alt", "Hero alt text duplicates " + priorAlt, "error");
  }
  altByText.set(normalizedAlt, article.slug);

  const previousImage = imageByPath.get(source);
  if (previousImage && previousImage !== article.slug) {
    note(article.slug, "shared-hero", "Reuses the hero image of " + previousImage + "; check editorial relevance.");
  }
  imageByPath.set(source, article.slug);

  const imageFile = path.join(root, "public", source.replace(/^\//, ""));
  let fileHash = null;
  if (fs.existsSync(imageFile)) {
    fileHash = createHash("sha256").update(fs.readFileSync(imageFile)).digest("hex");
    const priorHash = imageByHash.get(fileHash);
    if (priorHash && priorHash !== article.slug) {
      note(article.slug, "duplicate-image-bytes", "Identical artwork is also used by " + priorHash + "; review intent.");
    }
    imageByHash.set(fileHash, article.slug);
  } else {
    note(article.slug, "missing-hero", "Featured image file is missing: " + source, "error");
  }

  const filename = path.posix.basename(source, ".webp");
  if (/^(?:chatgpt-image|img[-_0-9]|dsc[-_0-9]|image[-_0-9]|untitled[-_0-9])/i.test(filename)) {
    note(article.slug, "legacy-filename", "Hero image filename is generic: " + filename + ". Preserve existing URLs; use meaningful names for new images.");
  }

  const links = sourceLinks(article);
  const editorial = editorialBySlug.get(article.slug);
  // Official citations in legacy articles often appear directly next to
  // specific claims in the Markdown body, while Sources & Verification is a
  // prose methodology statement. Count both placements: neither is inherently
  // less transparent, and parser-generated rich text is not a full URL ledger.
  const sourceMarkdown = [editorial?.bodyMarkdown ?? "", editorial?.sourcesMarkdown ?? ""].join("\n");
  const rawUrls = [...sourceMarkdown.matchAll(/https?:\/\/[^\s<>\])]+/gi)]
    .map(match => match[0].replace(/[.,;]+$/, ""));
  const referencedUrls = new Set([...(links ?? []), ...rawUrls]);
  if (links === null) {
    note(article.slug, "source-section", "Sources & Verification section is missing.", "error");
  } else if (referencedUrls.size === 0) {
    note(article.slug, "source-links", "No external source URL found in the article body or verification notes; review source transparency.");
  }
  if (!article.checkedDate) {
    note(article.slug, "fact-check-date", "Information checked date is not set; review before substantive updates.");
  }

  const internalImageBlocks = article.content.filter(block => block.type === "image");
  for (const block of internalImageBlocks) {
    if (!block.alt?.trim()) {
      note(article.slug, "inline-image-alt", "An informative inline image has no alt text.", "error");
    }
  }

  inventory.push({
    slug: article.slug,
    category: article.category,
    contentType: article.contentType,
    hero: source,
    heroAltLength: alt.length,
    heroFileBytes: fs.existsSync(imageFile) ? fs.statSync(imageFile).size : null,
    sourceLinks: links === null ? null : referencedUrls.size,
    checkedDate: article.checkedDate ?? null,
    bodyImages: internalImageBlocks.length,
  });
}

const sourceTotals = inventory.map(row => row.sourceLinks).filter(Number.isFinite);
const report = {
  kind: "decodista-editorial-quality-audit",
  scope: "All approved production article metadata, local hero assets and external reference URLs in published article Markdown plus source verification notes",
  caveat: "Automated checks cannot establish whether an illustration visually matches its alt text, whether the art is original, or whether any cited source's facts remain current. These require human editorial review.",
  articles: inventory.length,
  distinctHeroPaths: imageByPath.size,
  distinctHeroFileHashes: imageByHash.size,
  sourceLinks: {
    minimum: sourceTotals.length ? Math.min(...sourceTotals) : null,
    total: sourceTotals.reduce((sum, n) => sum + n, 0),
    articlesWithExternalLinks: sourceTotals.filter(n => n > 0).length,
  },
  errors: checks,
  advisories,
  inventory,
};

await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, "article-inventory.json"), JSON.stringify(report, null, 2) + "\n");
console.log("EDITORIAL_QUALITY_SUMMARY " + JSON.stringify({
  articles: report.articles,
  distinctHeroes: report.distinctHeroPaths,
  sourceLinks: report.sourceLinks,
  errors: checks.length,
  advisories: advisories.length,
  advisoryTypes: [...new Set(advisories.map(entry => entry.kind))],
}));
for (const issue of [...checks, ...advisories]) {
  console.log((checks.includes(issue) ? "EDITORIAL_ERROR " : "EDITORIAL_ADVISORY ") + JSON.stringify(issue));
}
if (checks.length) {
  console.error("Editorial quality gate failed: fix the errors before publishing.");
  process.exitCode = 1;
}
