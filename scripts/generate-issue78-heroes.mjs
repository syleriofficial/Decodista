import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Source-controlled, deterministic illustration pipeline for Issue #78.
// SVGs contain conceptual art only: no actual product UI or incident photos.
// The three existing published WebPs and their URLs are deliberately preserved.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assets = [
  ["openai-agent-image-leak-concept", "openai-agent-image-leak-concept-2026"],
  ["google-photos-undo-backup-local-kept-cloud-removed", "google-photos-undo-backup-local-kept-cloud-removed"],
  ["google-photos-free-up-space-cloud-copies-kept", "google-photos-free-up-space-cloud-copies-kept"],
];
const hash = b => createHash("sha256").update(b).digest("hex");

for (const [svgName, webpName] of assets) {
  const input = path.join(root, "artwork", "issue78", svgName + ".svg");
  const output = path.join(root, "public", "images", "uploads", webpName + ".webp");
  const source = await fs.readFile(input, "utf8");
  if (!source.includes('width="1600" height="900"') || /<script|<foreignObject|\bonload\s*=|href\s*=\s*["'](?:https?:|data:)/i.test(source)) {
    throw new Error("Unapproved or non-self-contained source artwork: " + svgName);
  }
  // Sharp is already a pinned dependency; no new font or runtime script is loaded.
  const { data, info } = await sharp(Buffer.from(source), { density: 96 })
    .webp({ quality: 80, effort: 6 })
    .toBuffer({ resolveWithObject: true });
  if (info.format !== "webp" || info.width !== 1600 || info.height !== 900 || data.byteLength > 2_000_000) {
    throw new Error("Image does not meet the 1600×900 / 2MB WebP contract: " + webpName);
  }
  let old;
  try { old = await fs.readFile(output); } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (old && hash(old) !== hash(data)) {
    throw new Error("Refusing to overwrite a different existing editorial asset: " + output);
  }
  if (!old) {
    await fs.mkdir(path.dirname(output), { recursive: true });
    await fs.writeFile(output, data, { flag: "wx" });
  }
  console.log("ISSUE78_IMAGE " + JSON.stringify({
    path: path.relative(root, output), width: info.width, height: info.height,
    bytes: data.length, sha256: hash(data), action: old ? "verified" : "created"
  }));
}
