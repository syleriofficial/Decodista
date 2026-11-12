import type { Plugin } from "vite";
import sharp from "sharp";
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const BREAKPOINTS = [320, 640, 960, 1280] as const;
const ROOT = process.cwd();
const IMAGE_DIR = path.join(ROOT, "public", "images");
const OUTPUT_DIR = path.join(IMAGE_DIR, "responsive");
const MANIFEST_PATH = path.join(ROOT, "lib", "responsive-images.generated.json");

interface Variant {
  url: string;
  width: number;
  bytes: number;
}
interface ImageEntry {
  width: number;
  height: number;
  originalBytes: number;
  srcSet: string;
  variants: Variant[];
}

async function sources(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const item of entries) {
    if (dir === IMAGE_DIR && item.name === "responsive") continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) files.push(...await sources(full));
    else if (item.isFile() && /\.webp$/i.test(item.name)) files.push(full);
  }
  return files;
}

async function createVariants() {
  const files = (await sources(IMAGE_DIR)).sort();
  const manifest: Record<string, ImageEntry> = {};
  let savedVariants = 0;
  await mkdir(OUTPUT_DIR, { recursive: true });

  for (const file of files) {
    const relative = path.relative(IMAGE_DIR, file).split(path.sep).join("/");
    const sourceUrl = "/images/" + relative;
    const info = await sharp(file).metadata();
    const width = info.width;
    const height = info.height;
    if (!width || !height || info.format !== "webp") {
      throw new Error("Invalid WebP source: " + relative);
    }

    const originalBytes = (await stat(file)).size;
    const variants: Variant[] = [];
    const candidateWidths = BREAKPOINTS.filter(size => size < width);
    for (const targetWidth of candidateWidths) {
      const relativeOutput = relative.replace(/\.webp$/i, "-w" + targetWidth + ".webp");
      const output = path.join(OUTPUT_DIR, relativeOutput);
      await mkdir(path.dirname(output), { recursive: true });
      // Never upscale, crop or change the original editorial artwork.
      const inputStat = await stat(file);
      let needsBuild = true;
      try {
        const outputStat = await stat(output);
        needsBuild = outputStat.mtimeMs < inputStat.mtimeMs || outputStat.size === 0;
      } catch {
        needsBuild = true;
      }
      if (needsBuild) {
        await sharp(file)
          .resize({ width: targetWidth, withoutEnlargement: true, fit: "inside" })
          .webp({ quality: 76, effort: 4 })
          .toFile(output);
      }
      const resizedBytes = (await stat(output)).size;
      // Do not advertise a variant that is heavier than the original.
      if (resizedBytes < originalBytes) {
        variants.push({
          url: "/images/responsive/" + relativeOutput,
          width: targetWidth,
          bytes: resizedBytes,
        });
      } else {
        await rm(output, { force: true });
      }
    }

    // Always end with the untouched original at its actual intrinsic width.
    const srcSet = [
      ...variants.map(item => item.url + " " + item.width + "w"),
      sourceUrl + " " + width + "w",
    ].join(", ");
    manifest[sourceUrl] = { width, height, originalBytes, srcSet, variants };
    savedVariants += variants.length;
  }

  const serialized = JSON.stringify(manifest, null, 2) + "\n";
  let previous = "";
  try { previous = await readFile(MANIFEST_PATH, "utf8"); } catch {}
  if (previous !== serialized) await writeFile(MANIFEST_PATH, serialized);
  console.log("[responsive-images] " + files.length + " originals, " + savedVariants +
    " smaller WebP variants; originals untouched");
}

// Generating in the config hook ensures assets exist before Vite copies public/
// into its Cloudflare client output. The same hook runs for dev previews and
// production builds, including direct Vinext Cloudflare deployments.
export function responsiveImagesPlugin(): Plugin {
  let generation: Promise<void> | undefined;
  return {
    name: "decodista-responsive-webp",
    enforce: "pre",
    async config() {
      generation ??= createVariants();
      await generation;
    },
  };
}
