import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Editorial vectors are source-controlled. A reviewed WebP is never silently
// re-encoded on another OS/libvips build, which might change its content hash.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assets = ["recover-hacked-google-account-gmail"];
const expectedHashes = {
  "recover-hacked-google-account-gmail": "f9d510da92d6a1fb709fd9da20181dbd2e7c9129d3d6a82294744ab154bae02d",
};
const sha256 = buffer => createHash("sha256").update(buffer).digest("hex");

for (const slug of assets) {
  const svgPath = path.join(root, "artwork", "article-heroes", slug + ".svg");
  const output = path.join(root, "public", "images", "uploads", slug + ".webp");
  const svg = await fs.readFile(svgPath, "utf8");
  if (!svg.includes('width="1600" height="900"') ||
      /<script|<foreignObject|\bonload\s*=|href\s*=\s*["'](?:https?:|data:)/i.test(svg)) {
    throw new Error("Unapproved or externally linked image source: " + slug);
  }

  let existing;
  try { existing = await fs.readFile(output); }
  catch (error) { if (error.code !== "ENOENT") throw error; }

  if (existing) {
    const info = await sharp(existing).metadata();
    if (info.format !== "webp" || info.width !== 1600 || info.height !== 900 ||
        existing.length > 2_000_000 ||
        (expectedHashes[slug] && sha256(existing) !== expectedHashes[slug])) {
      throw new Error("Existing published WebP differs from reviewed original: " + slug);
    }
    console.log("EDITORIAL_HERO " + JSON.stringify({
      slug, action: "verified", width: info.width, height: info.height,
      bytes: existing.length, sha256: sha256(existing)
    }));
    continue;
  }

  const { data, info } = await sharp(Buffer.from(svg), { density: 72 })
    .webp({ quality: 80, effort: 6 })
    .toBuffer({ resolveWithObject: true });
  if (info.format !== "webp" || info.width !== 1600 || info.height !== 900 ||
      data.length > 2_000_000) {
    throw new Error("New hero does not meet the 1600×900 WebP specification: " + slug);
  }
  if (expectedHashes[slug] && sha256(data) !== expectedHashes[slug]) {
    throw new Error("Generated WebP digest does not match the reviewed original: " + slug);
  }
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, data, { flag: "wx" });
  console.log("EDITORIAL_HERO " + JSON.stringify({
    slug, action: "created", width: info.width, height: info.height,
    bytes: data.length, sha256: sha256(data)
  }));
}