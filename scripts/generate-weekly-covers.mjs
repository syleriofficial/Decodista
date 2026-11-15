import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const directory = join(process.cwd(), "public", "images", "weekly");
const svg = await readFile(join(directory, "2026-11-16-cover.svg"));
await mkdir(directory, { recursive: true });
for (const output of [
  { file: "2026-11-16-cover.webp", width: 1600, height: 900, quality: 75 },
  { file: "2026-11-16-og.webp", width: 1200, height: 630, quality: 74 },
]) {
  const bytes = await sharp(svg, { density: 160 })
    .resize(output.width, output.height, { fit: "cover", position: "centre" })
    .webp({ quality: output.quality, effort: 6 })
    .toBuffer();
  await writeFile(join(directory, output.file), bytes);
  console.log(`Generated ${output.file} (${bytes.length} bytes)`);
}
