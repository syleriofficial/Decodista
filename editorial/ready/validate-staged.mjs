import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArticleDocument, loadArticles } from "../../scripts/content-loader.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const approved = [
  "gmail-not-receiving-emails-google-storage-full",
  "iphone-storage-full-icloud-has-space",
];
const published = new Set(loadArticles(root).articles.map((article) => article.slug));
const seen = new Set();
for (const slug of approved) {
  const filename = path.join(root, "editorial", "ready", `${slug}.md`);
  const source = fs.readFileSync(filename, "utf8");
  const { article } = parseArticleDocument(source, filename, root);
  assert.equal(article.slug, slug, "Staged filename and slug must match");
  assert(!seen.has(slug), "Staged slugs must be unique");
  assert(!published.has(slug), "Do not stage a duplicate production article");
  seen.add(slug);

  assert.equal(article.category, "digital-life");
  assert.equal(article.contentType, "how-to");
  assert.equal(article.publishedDate, "2026-11-11", "Adjust the date before a later release");
  assert.equal(article.featuredImage, `/images/uploads/${slug}.webp`);
  assert.equal(article.featuredImageWidth, 1600);
  assert.equal(article.featuredImageHeight, 900);
  assert(article.description.length <= 180);
  assert(article.seoTitle.length <= 70);
  assert(article.content.some((b) => b.type === "heading" && b.id === "key-takeaways"));
  assert.equal(article.content.filter((b) => b.type === "heading" && b.id === "faq").length, 1);
  assert.equal(article.content.filter((b) => b.type === "heading" && b.id === "sources-verification").length, 1);
  assert(article.content.filter((b) => b.type === "heading").length >= 7);
  assert(article.relatedArticleSlugs.every((related) => published.has(related)), "Every related article must be published");
  assert(article.shortAnswer);
  assert(article.featuredImageAlt.length >= 20);
  assert(!source.includes("**Status:** Editorial draft"), "No drafting notes in production-ready body");

  // This staging test checks typed CMS content, NOT the pending hero asset.
  // The production image-integrity gate will run after the files enter content/articles.
  console.log(`Staged CMS guide validated: ${slug} (${article.content.length} blocks)`);
}
