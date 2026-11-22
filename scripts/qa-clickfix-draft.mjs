import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const root = process.cwd();
const draftPath = "docs/editorial-drafts/fake-captcha-scams-clickfix-malware.md";
const articlePath = "content/articles/fake-captcha-scams-clickfix-malware.md";
const outputDir = "artifacts/clickfix-draft-qa";
const draft = fs.readFileSync(draftPath, "utf8");
const expected = [
  { file: "fake-captcha-scams-clickfix-malware.webp", bytes: 68496, sha256: "d14f49411eae5efd6f0e59b3d180cc257f3a3f40a760d19109c2a55cfa5bf06e", hero: true },
  { file: "clickfix-real-vs-fake-captcha.webp", bytes: 62406, sha256: "9073e0a77d97cf47cfdaeaa3d82944e1dd47060f446b73a9064251ffe00a16cd", hero: false },
  { file: "clickfix-recovery-decision-flowchart.webp", bytes: 71754, sha256: "7d114976c0da23f77d19fc7bbfc560427051a010a4ed4020ec6b608c60ca4211", hero: false },
];
const checks = [];
function check(name, pass, detail = "") {
  checks.push({ name, status: pass ? "PASS" : "FAIL", detail });
  console.log((pass ? "PASS" : "FAIL") + " " + name + (detail ? " — " + detail : ""));
}
function verifyWebpDimensions(bytes) {
  assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
  assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
  let offset = 12;
  while (offset + 8 <= bytes.length) {
    const kind = bytes.toString("ascii", offset, offset + 4);
    const len = bytes.readUInt32LE(offset + 4), base = offset + 8;
    if (base + len > bytes.length) break;
    if (kind === "VP8X" && len >= 10) return [1 + bytes.readUIntLE(base + 4, 3), 1 + bytes.readUIntLE(base + 7, 3)];
    if (kind === "VP8 " && len >= 10 && bytes.toString("hex", base + 3, base + 6) === "9d012a") return [bytes.readUInt16LE(base + 6) & 0x3fff, bytes.readUInt16LE(base + 8) & 0x3fff];
    if (kind === "VP8L" && len >= 5 && bytes[base] === 0x2f)
      return [1 + bytes[base + 1] + ((bytes[base + 2] & 0x3f) << 8), 1 + ((bytes[base + 2] & 0xc0) >> 6) + (bytes[base + 3] << 2) + ((bytes[base + 4] & 0x0f) << 10)];
    offset = base + len + (len & 1);
  }
  throw new Error("Unrecognized WebP size header");
}

check("Draft front matter is bounded", draft.startsWith("---\n") && draft.indexOf("\n---\n", 4) > 0);
check("Security category and explainer type", /(?:^|\n)primaryCategory: security\n/.test(draft) && /(?:^|\n)contentType: explainer\n/.test(draft));
check("Publication date intentionally unset", /(?:^|\n)publishedAt: REPLACE_WITH_ACTUAL_PUBLICATION_DATE\n/.test(draft));
check("Source check date recorded", /(?:^|\n)informationCheckedAt: 2026-11-23\n/.test(draft));
check("Original byline", /(?:^|\n)author: DECODISTA Editorial\n/.test(draft));
check("No duplicated H1 in Markdown", !/^# /m.test(draft));
check("Primary official sources appear", [
  "think-before-you-clickfix-analyzing-the-clickfix-social-engineering-technique",
  "terminalfix-campaign-deploys-reverse-tunnel",
  "macos-clickfix-campaign-learned-hide",
  "romulus-cncmachinerms",
  "ownyouronline.govt.nz",
  "support.microsoft.com",
  "support.apple.com",
].every(s => draft.includes(s)));
check("No actual executable attack commands", !/(?:^|\n)\s*(?:powershell\s+-|curl\s+https?:\/\/|iwr\s+https?:\/\/|bash\s+-c\s+|osascript\s+-e)/im.test(draft));
check("Live article staged only with all three image files", !fs.existsSync(articlePath) || expected.every(a => fs.existsSync(path.join(root, "public/images/uploads", a.file))));
const internal = [...draft.matchAll(/\]\((\/articles\/([a-z0-9-]+))\)/g)].map(m => m[2]);
for (const slug of internal)
  check("Related article exists: " + slug, fs.existsSync(path.join(root, "content/articles", slug + ".md")));
check("Recovery covers Windows and Mac", draft.includes("**Windows:**") && draft.includes("**Mac:**"));
check("Global reporting advice", draft.includes("in your country"));
check("Disclosure avoids claiming direct malware testing", draft.includes("did not execute malicious code"));
const imageResults = [];
for (const asset of expected) {
  const filePath = path.join(root, "public/images/uploads", asset.file);
  const reference = "/images/uploads/" + asset.file;
  check("Image referenced in draft: " + asset.file, draft.includes(reference));
  if (!fs.existsSync(filePath)) {
    console.log("PENDING image binary: " + asset.file + " — upload to draft branch");
    imageResults.push({ file: asset.file, status: "PENDING", reason: "Missing GitHub binary asset" });
    continue;
  }
  try {
    const buffer = fs.readFileSync(filePath);
    const sha = crypto.createHash("sha256").update(buffer).digest("hex");
    const dim = verifyWebpDimensions(buffer);
    const valid = buffer.length === asset.bytes && sha === asset.sha256 && dim[0] === 1600 && dim[1] === 900;
    check("WebP size/dimensions/hash: " + asset.file, valid, JSON.stringify({ bytes: buffer.length, dimensions: dim, sha256: sha }));
    imageResults.push({ file: asset.file, status: valid ? "PASS" : "FAIL", bytes: buffer.length, sha256: sha, dimensions: dim });
  } catch (error) {
    check("WebP decode: " + asset.file, false, String(error));
    imageResults.push({ file: asset.file, status: "FAIL", error: String(error) });
  }
}
const report = {
  checkedAt: new Date().toISOString(),
  scope: "DRAFT EDITORIAL READINESS ONLY — no browser or production claim",
  draftPr: "https://github.com/syleriofficial/Decodista/pull/125",
  checks,
  imageResults,
  editorialPreparatoryChecksPassed: checks.every(c => c.status === "PASS"),
  assetsComplete: imageResults.every(r => r.status === "PASS"),
  publicationReady: false, // Full editorial and browser sign-off still required
  remaining: ["Commit three exact WebP binaries", "Verify article in content/articles with actual date", "Release check on new head", "4-viewport browser and SEO QA", "Explicit approval and matching production deployment"],
};
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2));
console.log("RESULT: " + JSON.stringify({ passed: checks.filter(c => c.status === "PASS").length, failed: checks.filter(c => c.status === "FAIL").length, assetsComplete: report.assetsComplete, publicationReady: false }));
if (checks.some(c => c.status === "FAIL")) process.exitCode = 1;
