import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const manifest = JSON.parse(await readFile("lib/responsive-images.generated.json", "utf8"));
const assets = Object.entries(manifest);
assert(assets.length >= 20, "Build must discover the existing editorial WebP collection");

let checked = 0;
let aggregateOriginal = 0;
let aggregateMobile = 0;
for (const [src, entry] of assets) {
  assert(/^\/images\/(?!responsive\/).+\.webp$/.test(src), "Only original local WebP may be a manifest key");
  const originalPath = path.join(root, "public", src.slice(1));
  const original = await sharp(originalPath).metadata();
  assert.equal(entry.width, original.width, src + " original width must match");
  assert.equal(entry.height, original.height, src + " original height must match");
  assert(entry.srcSet.endsWith(src + " " + original.width + "w"), "srcset ends with untouched original");
  assert((await stat(originalPath)).size === entry.originalBytes, "Original byte size must match");
  aggregateOriginal += entry.originalBytes;

  const variants = entry.variants;
  assert(variants.length >= 1, src + " should have at least one smaller variant");
  const seen = new Set();
  for (const variant of variants) {
    assert(!seen.has(variant.width), "No duplicate srcset widths");
    seen.add(variant.width);
    assert([320, 640, 960, 1280].includes(variant.width), "Width must be a supported breakpoint");
    assert(variant.width < original.width, "Do not upscale a source image");
    assert(variant.url.startsWith("/images/responsive/"), "Generated image path must be inside public/images/responsive");
    const relative = variant.url.slice(1);
    const file = path.join(root, "public", relative);
    const metadata = await sharp(file).metadata();
    assert.equal(metadata.format, "webp", "Variant format must stay WebP");
    assert.equal(metadata.width, variant.width, "Variant intrinsic width must match srcset");
    assert.equal((await stat(file)).size, variant.bytes, "Manifest byte size must match file");
    assert(variant.bytes < entry.originalBytes, "Variants must reduce bytes compared with original");
    assert(entry.srcSet.includes(variant.url + " " + variant.width + "w"), "Manifest should list actual variant");
    checked++;
  }
  const mobile = variants.find(variant => variant.width >= 640) ?? variants[variants.length - 1];
  aggregateMobile += mobile.bytes;
}
console.log(JSON.stringify({
  originals: assets.length,
  testedVariants: checked,
  rawOriginalBytes: aggregateOriginal,
  illustrativeMobileBytes: aggregateMobile,
  note: "Illustrative 640w-or-next-lower totals across all images; not a live network saving metric.",
}, null, 2));
