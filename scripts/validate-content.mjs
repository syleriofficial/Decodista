import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadArticles } from "./content-loader.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { articles, parsed } = loadArticles(projectRoot);
const documents = parsed.map(({ article }) => article);
const slugs = new Set(articles.map(({ slug }) => slug));
const internalArticleLinks = [];
const images = [];
const uploadDirectory = path.join(projectRoot, "public/images/uploads");

function inspectRichText(value, article) {
  if (!Array.isArray(value)) return;
  for (const piece of value) {
    if (typeof piece !== "object" || piece?.type !== "link") continue;
    if (piece.href.startsWith("/articles/")) internalArticleLinks.push({ article, href: piece.href });
  }
}

for (const article of documents) {
  images.push({ article: article.slug, src: article.featuredImage, uploaded: article.featuredImage.startsWith("/images/uploads/") });
  inspectRichText(article.shortAnswer, article.slug);
  for (const block of article.content) {
    if (block.type === "paragraph" || block.type === "quote" || block.type === "callout") {
      inspectRichText(block.text, article.slug);
    } else if (block.type === "list") {
      block.items.forEach((item) => inspectRichText(item, article.slug));
    } else if (block.type === "table") {
      [...block.headers, ...block.rows.flat()].forEach((item) => inspectRichText(item, article.slug));
    } else if (block.type === "image") {
      images.push({ article: article.slug, src: block.src, uploaded: block.src.startsWith("/images/uploads/") });
    }
  }
}

for (const { article, href } of internalArticleLinks) {
  const target = href.slice("/articles/".length).split(/[?#]/, 1)[0];
  if (!slugs.has(target)) throw new Error(`${article}: broken internal article link ${href}`);
}

for (const { article, src, uploaded } of images) {
  const file = path.join(projectRoot, "public", src.replace(/^\//, ""));
  if (!fs.existsSync(file)) throw new Error(`${article}: missing image ${src}`);
  if (uploaded && fs.statSync(file).size > 2_000_000) {
    throw new Error(`${article}: CMS upload ${src} exceeds the 2 MB repository limit`);
  }
}

let uploadedFiles = 0;
if (fs.existsSync(uploadDirectory)) {
  for (const entry of fs.readdirSync(uploadDirectory, { withFileTypes: true })) {
    if (!entry.isFile()) throw new Error(`CMS upload directory may contain files only: ${entry.name}`);
    if (!entry.name.endsWith(".webp")) throw new Error(`CMS upload must be an optimized WebP: ${entry.name}`);
    const file = path.join(uploadDirectory, entry.name);
    if (fs.statSync(file).size > 2_000_000) throw new Error(`CMS upload exceeds the 2 MB repository limit: ${entry.name}`);
    uploadedFiles += 1;
  }
}

console.log(`Validated ${articles.length} production articles, ${documents.length - articles.length} non-public workflow tests, ${internalArticleLinks.length} internal article links, ${images.length} referenced images, and ${uploadedFiles} CMS uploads.`);
