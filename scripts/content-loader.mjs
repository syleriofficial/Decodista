import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import { parse as parseYaml } from "yaml";

const ARTICLE_DIRECTORY = "content/articles";
const ALLOWED_CATEGORIES = new Set(["ai", "digital-life", "security", "science"]);
const ALLOWED_CONTENT_TYPES = new Set(["how-to", "explainer", "news", "analysis"]);
const ALLOWED_AUTHORS = new Set(["DECODISTA Editorial"]);
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const IMAGE_PATTERN = /^\/images\/[a-zA-Z0-9/_-]+\.(?:avif|jpe?g|png|webp)$/;
const CALLOUT_PREFIX = "DECODISTA callout — ";

const isObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

function fail(source, message) {
  throw new Error(`${source}: ${message}`);
}

function parseFrontMatter(raw, source) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) fail(source, "article files must begin with YAML front matter");
  let data;
  try {
    data = parseYaml(match[1]);
  } catch (error) {
    fail(source, `invalid YAML front matter (${error instanceof Error ? error.message : "unknown error"})`);
  }
  return { data, content: raw.slice(match[0].length) };
}

function requiredString(value, field, source) {
  if (typeof value !== "string" || !value.trim()) fail(source, `"${field}" must be a non-empty string`);
  return value.trim();
}

function optionalString(value, field, source) {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") fail(source, `"${field}" must be a string when provided`);
  return value.trim() || undefined;
}

function requiredDate(value, field, source) {
  const date = requiredString(value, field, source);
  if (!DATE_PATTERN.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
    fail(source, `"${field}" must use YYYY-MM-DD`);
  }
  return date;
}

function optionalDate(value, field, source) {
  const date = optionalString(value, field, source);
  if (!date) return undefined;
  if (!DATE_PATTERN.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
    fail(source, `"${field}" must use YYYY-MM-DD`);
  }
  return date;
}

function requiredStringList(value, field, source) {
  if (!Array.isArray(value) || value.length === 0) fail(source, `"${field}" must contain at least one item`);
  return value.map((item, index) => requiredString(item, `${field}[${index}]`, source));
}

function optionalStringList(value, field, source) {
  if (value === undefined || value === null) return undefined;
  if (!Array.isArray(value)) fail(source, `"${field}" must be a list`);
  return value.map((item, index) => requiredString(item, `${field}[${index}]`, source));
}

function slugifyHeading(value) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "section";
}

function normalizeTextPieces(pieces) {
  const merged = [];
  for (const piece of pieces) {
    if (piece === "") continue;
    if (typeof piece === "string" && typeof merged.at(-1) === "string") {
      merged[merged.length - 1] += piece;
    } else {
      merged.push(piece);
    }
  }
  if (merged.length === 1 && typeof merged[0] === "string") return merged[0];
  return merged;
}

function inlineTokensToRichText(tokens, source) {
  const pieces = [];
  for (const token of tokens) {
    switch (token.type) {
      case "text":
      case "escape":
        if (token.tokens?.length) {
          const nested = inlineTokensToRichText(token.tokens, source);
          pieces.push(...(typeof nested === "string" ? [nested] : nested));
        } else {
          pieces.push(token.text);
        }
        break;
      case "strong":
        pieces.push({ type: "strong", text: token.text });
        break;
      case "em":
        pieces.push({ type: "emphasis", text: token.text });
        break;
      case "del":
        pieces.push({ type: "delete", text: token.text });
        break;
      case "codespan":
        pieces.push({ type: "code", text: token.text });
        break;
      case "link":
        pieces.push({ type: "link", text: token.text, href: token.href });
        break;
      case "br":
        pieces.push({ type: "break" });
        break;
      case "html":
        fail(source, "raw HTML is not allowed in article content");
        break;
      case "image":
        fail(source, "images must be placed on their own line");
        break;
      default:
        fail(source, `unsupported inline Markdown token "${token.type}"`);
    }
  }
  return normalizeTextPieces(pieces);
}

function markdownInlineToRichText(markdown, source) {
  const blocks = marked.lexer(markdown, { gfm: true }).filter((token) => token.type !== "space");
  const pieces = [];
  for (const [index, block] of blocks.entries()) {
    if (!["paragraph", "text"].includes(block.type)) {
      fail(source, "this field supports inline formatting only");
    }
    if (index > 0) pieces.push({ type: "break" }, { type: "break" });
    const richText = inlineTokensToRichText(block.tokens ?? marked.lexer(block.text).flatMap((token) => token.tokens ?? [token]), source);
    pieces.push(...(typeof richText === "string" ? [richText] : richText));
  }
  return normalizeTextPieces(pieces);
}

function listItemToRichText(item, source) {
  const meaningful = item.tokens.filter((token) => token.type !== "space");
  if (meaningful.length !== 1 || !["text", "paragraph"].includes(meaningful[0].type)) {
    fail(source, "nested or multi-paragraph list items are not supported");
  }
  const token = meaningful[0];
  return inlineTokensToRichText(token.tokens ?? marked.lexer(token.text).flatMap((entry) => entry.tokens ?? [entry]), source);
}

function blockquoteToBlock(token, source) {
  const meaningful = token.tokens.filter((entry) => entry.type !== "space");
  if (meaningful.length === 2 && meaningful[0].type === "paragraph" && meaningful[1].type === "paragraph") {
    const firstTokens = meaningful[0].tokens ?? [];
    if (firstTokens.length === 1 && firstTokens[0].type === "strong" && firstTokens[0].text.startsWith(CALLOUT_PREFIX)) {
      return {
        type: "callout",
        title: firstTokens[0].text.slice(CALLOUT_PREFIX.length),
        text: inlineTokensToRichText(meaningful[1].tokens ?? [], source),
      };
    }
  }
  if (meaningful.length !== 1 || meaningful[0].type !== "paragraph") {
    fail(source, "block quotes must contain a single paragraph unless they use the DECODISTA callout format");
  }
  return { type: "quote", text: inlineTokensToRichText(meaningful[0].tokens ?? [], source) };
}

export function markdownToBlocks(markdown, source = "article Markdown") {
  if (typeof markdown !== "string" || !markdown.trim()) return [];
  const blocks = [];
  const ids = new Set();
  for (const token of marked.lexer(markdown, { gfm: true })) {
    switch (token.type) {
      case "space":
      case "def":
        break;
      case "heading": { // Preserve explicit anchors written as: ## Heading {#anchor}
        if (![2, 3].includes(token.depth)) fail(source, "article headings must use H2 or H3");
        const explicit = token.text.match(/\s+\{#([a-z0-9][a-z0-9-]*)\}\s*$/);
        const text = (explicit ? token.text.slice(0, explicit.index) : token.text).trim();
        const id = explicit?.[1] ?? slugifyHeading(text);
        if (ids.has(id)) fail(source, `duplicate heading anchor "${id}"`);
        ids.add(id);
        blocks.push({ type: "heading", level: token.depth, text, id });
        break;
      }
      case "paragraph": {
        const meaningful = token.tokens?.filter((entry) => entry.type !== "space") ?? [];
        if (meaningful.length === 1 && meaningful[0].type === "image") {
          const image = meaningful[0];
          blocks.push({ type: "image", src: image.href, alt: image.text, ...(image.title ? { caption: image.title } : {}) });
        } else {
          blocks.push({ type: "paragraph", text: inlineTokensToRichText(token.tokens ?? [], source) });
        }
        break;
      }
      case "list":
        blocks.push({
          type: "list",
          style: token.ordered ? "ordered" : "unordered",
          items: token.items.map((item) => listItemToRichText(item, source)),
        });
        break;
      case "blockquote":
        blocks.push(blockquoteToBlock(token, source));
        break;
      case "code":
        blocks.push({ type: "code", language: token.lang ?? "text", code: token.text });
        break;
      case "table":
        blocks.push({
          type: "table",
          headers: token.header.map((cell) => inlineTokensToRichText(cell.tokens, source)),
          rows: token.rows.map((row) => row.map((cell) => inlineTokensToRichText(cell.tokens, source))),
        });
        break;
      case "html":
        fail(source, "raw HTML is not allowed in article content");
        break;
      default:
        fail(source, `unsupported Markdown block "${token.type}"`);
    }
  }
  return blocks;
}

function validateLink(href, source) {
  if (typeof href !== "string" || !href) fail(source, "link destinations must be non-empty strings");
  if (href.startsWith("/")) return;
  let url;
  try {
    url = new URL(href);
  } catch {
    fail(source, `link destination "${href}" must be an internal path or absolute HTTPS URL`);
  }
  if (url.protocol !== "https:") fail(source, `external link "${href}" must use HTTPS`);
}

function validateRichText(value, source) {
  if (typeof value === "string") return;
  if (!Array.isArray(value) || value.length === 0) fail(source, "rich text cannot be empty");
  for (const piece of value) {
    if (typeof piece === "string") continue;
    if (!isObject(piece) || typeof piece.type !== "string") fail(source, "invalid rich-text item");
    if (piece.type === "link") validateLink(piece.href, source);
  }
}

function validateBlocks(blocks, source) {
  const ids = new Set();
  for (const block of blocks) {
    if (block.type === "heading") {
      if (ids.has(block.id)) fail(source, `duplicate heading anchor "${block.id}"`);
      ids.add(block.id);
    } else if (block.type === "paragraph" || block.type === "quote" || block.type === "callout") {
      validateRichText(block.text, source);
    } else if (block.type === "list") {
      block.items.forEach((item) => validateRichText(item, source));
    } else if (block.type === "table") {
      if (!block.headers.length || block.rows.some((row) => row.length !== block.headers.length)) {
        fail(source, "every table row must match its header column count");
      }
      [...block.headers, ...block.rows.flat()].forEach((cell) => validateRichText(cell, source));
    } else if (block.type === "image") {
      if (!IMAGE_PATTERN.test(block.src) || !block.alt.trim()) fail(source, "body images need a valid /images/ path and alt text");
    }
  }
}

function normalizeFaqs(value, source) {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) fail(source, "" + '"faqs" must be a list');
  return value.map((faq, index) => {
    if (!isObject(faq)) fail(source, `faqs[${index}] must be an object`);
    const question = requiredString(faq.question, `faqs[${index}].question`, source);
    const id = optionalString(faq.id, `faqs[${index}].id`, source) ?? slugifyHeading(question);
    if (!SLUG_PATTERN.test(id)) fail(source, `faqs[${index}].id must be a URL-safe anchor`);
    const answerMarkdown = requiredString(faq.answer, `faqs[${index}].answer`, source);
    const answer = markdownToBlocks(answerMarkdown, `${source} FAQ “${question}”`);
    if (!answer.length) fail(source, `faqs[${index}].answer cannot be empty`);
    return { question, id, answer, answerMarkdown };
  });
}

export function parseArticleDocument(raw, filePath, projectRoot) {
  const source = path.relative(projectRoot, filePath);
  const parsed = parseFrontMatter(raw, source);
  const data = parsed.data;
  if (!isObject(data)) fail(source, "front matter must be an object");

  const title = requiredString(data.title, "title", source);
  const slug = requiredString(data.slug, "slug", source);
  if (!SLUG_PATTERN.test(slug)) fail(source, '"slug" must use lowercase words separated by hyphens');
  if (path.basename(filePath, path.extname(filePath)) !== slug) fail(source, "filename must match the article slug");

  const category = requiredString(data.primaryCategory, "primaryCategory", source);
  if (!ALLOWED_CATEGORIES.has(category)) fail(source, `unknown primaryCategory "${category}"`);
  const contentType = requiredString(data.contentType, "contentType", source);
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) fail(source, `unknown contentType "${contentType}"`);
  const author = requiredString(data.author, "author", source);
  if (!ALLOWED_AUTHORS.has(author)) fail(source, `author "${author}" is not an approved editorial profile`);

  const publishedDate = requiredDate(data.publishedAt, "publishedAt", source);
  const rawUpdatedDate = optionalDate(data.updatedAt, "updatedAt", source);
  const updatedDate = rawUpdatedDate && rawUpdatedDate !== publishedDate ? rawUpdatedDate : undefined;
  if (updatedDate && updatedDate < publishedDate) fail(source, '"updatedAt" cannot be earlier than "publishedAt"');
  const checkedDate = optionalDate(data.informationCheckedAt, "informationCheckedAt", source);

  const featuredImage = requiredString(data.heroImage, "heroImage", source);
  if (!IMAGE_PATTERN.test(featuredImage)) fail(source, '"heroImage" must point to a supported file under /images/');
  const featuredImageAlt = requiredString(data.heroImageAlt, "heroImageAlt", source);
  if (featuredImageAlt.length < 20) fail(source, '"heroImageAlt" must be meaningfully descriptive');
  const width = Number(data.heroImageWidth ?? (featuredImage.startsWith("/images/uploads/") ? 1600 : NaN));
  const height = Number(data.heroImageHeight ?? (featuredImage.startsWith("/images/uploads/") ? 900 : NaN));
  if (!Number.isInteger(width) || width < 320 || !Number.isInteger(height) || height < 180) {
    fail(source, "hero image dimensions must be positive integers (CMS uploads default to 1600×900)");
  }
  const readingTime = Number(data.readingTime);
  if (!Number.isInteger(readingTime) || readingTime < 1 || readingTime > 120) fail(source, '"readingTime" must be 1–120 minutes');

  const shortAnswerMarkdown = requiredString(data.shortAnswer, "shortAnswer", source);
  const shortAnswer = markdownInlineToRichText(shortAnswerMarkdown, `${source} short answer`);
  const keyTakeawayMarkdown = requiredStringList(data.keyTakeaways, "keyTakeaways", source);
  const keyTakeaways = keyTakeawayMarkdown.map((item, index) => markdownInlineToRichText(item, `${source} key takeaway ${index + 1}`));
  const introductionMarkdown = optionalString(data.introduction, "introduction", source);
  const introduction = introductionMarkdown ? markdownToBlocks(introductionMarkdown, `${source} introduction`) : [];
  const body = markdownToBlocks(parsed.content, `${source} body`);
  const faqs = normalizeFaqs(data.faqs, source);
  const sourcesMarkdown = requiredString(data.sourcesVerification, "sourcesVerification", source);
  const sources = markdownToBlocks(sourcesMarkdown, `${source} sources and verification`);

  const content = [
    ...introduction,
    { type: "heading", level: 2, id: "key-takeaways", text: "Key takeaways" },
    { type: "list", style: "unordered", items: keyTakeaways },
    ...body,
    ...(faqs.length ? [
      { type: "heading", level: 2, id: "faq", text: "FAQ" },
      ...faqs.flatMap((faq) => [
        { type: "heading", level: 3, id: faq.id, text: faq.question },
        ...faq.answer,
      ]),
    ] : []),
    { type: "heading", level: 2, id: "sources-verification", text: "Sources and verification" },
    ...sources,
  ];
  validateRichText(shortAnswer, `${source} short answer`);
  validateBlocks(content, source);

  const description = requiredString(data.metaDescription, "metaDescription", source);
  const seoTitle = requiredString(data.seoTitle, "seoTitle", source);
  if (seoTitle.length > 70) fail(source, '"seoTitle" must not exceed 70 characters');
  if (description.length > 170) fail(source, '"metaDescription" must not exceed 170 characters');

  return {
    article: {
      title,
      seoTitle,
      slug,
      description,
      standfirst: requiredString(data.deck, "deck", source),
      category,
      contentType,
      tags: requiredStringList(data.topics, "topics", source),
      author,
      publishedDate,
      ...(updatedDate ? { updatedDate } : {}),
      ...(checkedDate ? { checkedDate } : {}),
      featuredImage,
      featuredImageAlt,
      featuredImageWidth: width,
      featuredImageHeight: height,
      readingTime,
      ...(data.featured === true ? { featured: true } : {}),
      ...(data.editorsPick === true ? { editorsPick: true } : {}),
      shortAnswer,
      ...(optionalStringList(data.relatedArticles, "relatedArticles", source)?.length
        ? { relatedArticleSlugs: optionalStringList(data.relatedArticles, "relatedArticles", source) }
        : {}),
      content,
    },
    editorial: {
      shortAnswerMarkdown,
      keyTakeawayMarkdown,
      introductionMarkdown,
      bodyMarkdown: parsed.content.trim(),
      faqs,
      sourcesMarkdown,
    },
    source,
  };
}

export function loadArticles(projectRoot) {
  const directory = path.join(projectRoot, ARTICLE_DIRECTORY);
  if (!fs.existsSync(directory)) fail(ARTICLE_DIRECTORY, "article directory is missing");
  const files = fs.readdirSync(directory)
    .filter((filename) => filename.endsWith(".md"))
    .sort()
    .map((filename) => path.join(directory, filename));
  if (!files.length) fail(ARTICLE_DIRECTORY, "no article files were found");

  const parsed = files.map((filePath) => parseArticleDocument(fs.readFileSync(filePath, "utf8"), filePath, projectRoot));
  const slugSet = new Set();
  const titleSet = new Set();
  let featuredCount = 0;
  for (const { article, source } of parsed) {
    if (slugSet.has(article.slug)) fail(source, `duplicate slug "${article.slug}"`);
    if (titleSet.has(article.title)) fail(source, `duplicate title "${article.title}"`);
    slugSet.add(article.slug);
    titleSet.add(article.title);
    if (article.featured) featuredCount += 1;
  }
  if (featuredCount > 1) fail(ARTICLE_DIRECTORY, "only one article may be the featured story");
  const publicSlugs = new Set(parsed.map(({ article }) => article.slug));
  for (const { article, source } of parsed) {
    for (const related of article.relatedArticleSlugs ?? []) {
      if (related === article.slug) fail(source, "an article cannot relate to itself");
      if (!publicSlugs.has(related)) fail(source, `related article "${related}" is not a production article`);
    }
  }

  return {
    files,
    parsed,
    articles: parsed.map(({ article }) => article),
  };
}
