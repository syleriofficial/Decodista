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

function readWebpDimensions(file) {
  const buffer = fs.readFileSync(file);
  if (buffer.length < 30 || buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP") {
    throw new Error(`Invalid WebP image: ${path.relative(projectRoot, file)}`);
  }

  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const type = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const data = offset + 8;
    if (data + size > buffer.length) break;

    if (type === "VP8X" && size >= 10) {
      return {
        width: 1 + buffer.readUIntLE(data + 4, 3),
        height: 1 + buffer.readUIntLE(data + 7, 3),
      };
    }
    if (type === "VP8L" && size >= 5 && buffer[data] === 0x2f) {
      return {
        width: 1 + buffer[data + 1] + ((buffer[data + 2] & 0x3f) << 8),
        height: 1 + ((buffer[data + 2] & 0xc0) >> 6) + (buffer[data + 3] << 2) + ((buffer[data + 4] & 0x0f) << 10),
      };
    }
    if (type === "VP8 " && size >= 10 && buffer[data + 3] === 0x9d && buffer[data + 4] === 0x01 && buffer[data + 5] === 0x2a) {
      return {
        width: buffer.readUInt16LE(data + 6) & 0x3fff,
        height: buffer.readUInt16LE(data + 8) & 0x3fff,
      };
    }

    offset = data + size + (size % 2);
  }
  throw new Error(`Could not read WebP dimensions: ${path.relative(projectRoot, file)}`);
}

function inspectRichText(value, article) {
  if (!Array.isArray(value)) return;
  for (const piece of value) {
    if (typeof piece !== "object" || piece?.type !== "link") continue;
    if (piece.href.startsWith("/articles/")) internalArticleLinks.push({ article, href: piece.href });
  }
}

for (const article of documents) {
  images.push({
    article: article.slug,
    src: article.featuredImage,
    uploaded: article.featuredImage.startsWith("/images/uploads/"),
    hero: true,
    declaredWidth: article.featuredImageWidth,
    declaredHeight: article.featuredImageHeight,
  });
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

for (const { article, src, hero, declaredWidth, declaredHeight } of images) {
  if (!hero) continue;
  const file = path.join(projectRoot, "public", src.replace(/^\//, ""));
  if (path.extname(file).toLowerCase() !== ".webp") {
    throw new Error(`${article}: hero image must be an optimized WebP`);
  }
  const actual = readWebpDimensions(file);
  if (actual.width < 1200) {
    throw new Error(`${article}: hero image must be at least 1200px wide for large-image eligibility (found ${actual.width}px)`);
  }
  if (actual.width !== declaredWidth || actual.height !== declaredHeight) {
    throw new Error(`${article}: declared hero dimensions ${declaredWidth}×${declaredHeight} do not match ${actual.width}×${actual.height}`);
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

console.log(`Validated ${articles.length} production articles, ${internalArticleLinks.length} internal article links, ${images.length} referenced images, and ${uploadedFiles} CMS uploads.`);
