import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import { parseArticleDocument } from "./content-loader.mjs";
import {
  ALLOWED_CATEGORIES,
  ALLOWED_CONTENT_TYPES,
  normalizeCmsArticleData,
  validateCmsArticleData,
} from "../public/admin/content-rules.mjs";

const projectRoot = "/tmp/decodista-cms-tests";
const defaultBody = "## Main section\n\nA complete article paragraph.";
const base = {
  title: "Temporary CMS validation article",
  slug: "temporary-cms-validation-article",
  deck: "A temporary document used only by the in-memory CMS validation suite.",
  primaryCategory: "digital-life",
  contentType: "how-to",
  topics: ["Privacy"],
  heroImage: "/images/test-editorial-image.webp",
  heroImageAlt: "Abstract editorial illustration used for validation",
  heroImageWidth: 1600,
  heroImageHeight: 900,
  shortAnswer: "This is the direct answer used by the temporary validation fixture.",
  keyTakeaways: ["First supported takeaway.", "Second supported takeaway."],
  sourcesVerification: "Verified against an official primary source.",
  publishedAt: "2026-09-24",
  author: "DECODISTA Editorial",
  readingTime: 5,
  seoTitle: "Temporary CMS Validation Article",
  metaDescription: "A temporary in-memory fixture that validates the DECODISTA CMS publishing rules without creating public content.",
  featured: false,
  editorsPick: false,
};

function createDocument(overrides = {}, body = defaultBody) {
  const data = { ...base, ...overrides };
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) delete data[key];
  }
  return `---\n${stringifyYaml(data)}---\n${body}\n`;
}

function parse(overrides = {}, body = defaultBody) {
  const data = { ...base, ...overrides };
  const slug = data.slug;
  const filePath = path.join(projectRoot, "content/articles", `${slug}.md`);
  return parseArticleDocument(createDocument(overrides, body), filePath, projectRoot);
}

function headingCount(article, id) {
  return article.content.filter((block) => block.type === "heading" && block.id === id).length;
}

function expectFailure(action, pattern) {
  assert.throws(action, pattern);
}

// TEST A — no FAQ field is valid.
assert.equal(parse().article.slug, base.slug);
console.log("TEST A passed: omitted FAQ is valid.");

// TEST B — Decap's legacy blank FAQ row is removed.
const blankFaq = parse({ faqs: [{ id: "" }] });
assert.equal(headingCount(blankFaq.article, "faq"), 0);
console.log("TEST B passed: blank FAQ object is normalized away.");

// TEST C — editorial work in a partial FAQ is never discarded.
expectFailure(
  () => parse({ faqs: [{ question: "Does this delete photos?", answer: "" }] }),
  /FAQ item 1 needs an answer/,
);
console.log("TEST C passed: partial FAQ fails with a clear missing-answer error.");

// TEST D — a body Sources section works without a structured source field.
const bodySources = parse(
  { sourcesVerification: undefined },
  "## Main section\n\nArticle content.\n\n## Sources & Verification\n\nVerified against official documentation.",
);
assert.equal(headingCount(bodySources.article, "sources-verification"), 1);
console.log("TEST D passed: body Sources & Verification renders exactly once.");

// TEST E — structured sources render once when the body has no Sources section.
const structuredSources = parse();
assert.equal(headingCount(structuredSources.article, "sources-verification"), 1);
console.log("TEST E passed: structured Sources & Verification renders exactly once.");

// TEST F — harmless blank list values are removed before required-list checks.
const blankLists = parse({
  topics: ["Privacy", "", "  ", "photo backup", "account security"],
  keyTakeaways: ["First supported takeaway.", "", "Second supported takeaway."],
  relatedArticles: ["", "  "],
});
assert.deepEqual(blankLists.article.tags, ["Privacy", "Photo Backup", "Account Security"]);
assert.equal(blankLists.article.relatedArticleSlugs, undefined);
console.log("TEST F passed: blank topic, takeaway and optional related values are removed.");

const canonicalTopics = normalizeCmsArticleData({ topics: ["data protection", "Photo Backup"] });
assert.deepEqual(canonicalTopics.topics, ["Data Protection", "Photo Backup"]);
console.log("Topic normalization passed: known case-only variants use canonical DECODISTA labels.");

// TEST G — required Short Answer remains a hard publishing requirement.
expectFailure(() => parse({ shortAnswer: "" }), /Short Answer is required/);
console.log("TEST G passed: missing Short Answer fails before production.");

// TEST H — a fully valid new article passes the same CMS and production parser.
const normalizedValid = normalizeCmsArticleData({ ...base, body: defaultBody });
assert.deepEqual(validateCmsArticleData(normalizedValid), []);
assert.equal(parse().article.title, base.title);
console.log("TEST H passed: valid CMS article passes shared and production validation.");

// Structured FAQ is the single rendered source if both authoring paths exist.
const structuredFaq = parse(
  { faqs: [{ question: "Structured question?", id: "structured-question", answer: "Structured answer." }] },
  "## FAQ\n\n### Body question\n\nBody answer.\n\n## Main section\n\nArticle content.",
);
assert.equal(headingCount(structuredFaq.article, "faq"), 1);
assert.equal(headingCount(structuredFaq.article, "structured-question"), 1);
assert.equal(structuredFaq.article.content.some((block) => block.type === "heading" && block.text === "Body question"), false);
console.log("FAQ precedence passed: structured FAQ replaces the body FAQ section without duplication.");

// Decap's visible field rules must stay aligned with the shared validator.
const config = parseYaml(fs.readFileSync(new URL("../public/admin/config.yml", import.meta.url), "utf8"));
const articleCollection = config.collections.find((collection) => collection.name === "articles");
assert(articleCollection, "Articles collection is missing from Decap config");
const fieldMap = new Map(articleCollection.fields.map((field) => [field.name, field]));
for (const field of [
  "title", "slug", "deck", "primaryCategory", "contentType", "topics", "heroImage", "heroImageAlt",
  "shortAnswer", "keyTakeaways", "body", "publishedAt", "author", "readingTime", "seoTitle", "metaDescription",
]) {
  assert.notEqual(fieldMap.get(field)?.required, false, `${field} must remain required in Decap`);
}
assert.equal(fieldMap.get("faqs")?.required, false);
assert.deepEqual(fieldMap.get("faqs")?.default, []);
assert.equal(fieldMap.get("sourcesVerification")?.required, false);
assert.deepEqual(new Set(fieldMap.get("primaryCategory")?.options.map((option) => option.value)), ALLOWED_CATEGORIES);
assert.deepEqual(new Set(fieldMap.get("contentType")?.options.map((option) => option.value)), ALLOWED_CONTENT_TYPES);
assert.equal(fieldMap.get("heroImage")?.media_processing?.width, 1600);
assert.equal(fieldMap.get("heroImage")?.media_processing?.height, 900);
console.log("CMS configuration alignment passed: required fields, options and image processing match production rules.");

assert.deepEqual(validateCmsArticleData({
  ...base,
  heroImage: `/images/uploads/${base.slug}.webp`,
  body: defaultBody,
}), []);
assert.match(
  validateCmsArticleData({
    ...base,
    heroImage: "/images/uploads/untitled-export.webp",
    body: defaultBody,
  }).join(" "),
  /filename must match the article slug/,
);
console.log("CMS filename rule passed: new uploads use the article slug without changing legacy production URLs.");

console.log("CMS publishing validation suite passed without creating files or public routes.");
