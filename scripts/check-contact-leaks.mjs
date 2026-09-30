import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const privateRecipient = process.env.DECODISTA_CONTACT_RECIPIENT?.trim();
const textExtensions = new Set([".css", ".html", ".js", ".json", ".map", ".md", ".mjs", ".svg", ".ts", ".tsx", ".txt", ".xml", ".yml", ".yaml"]);
const publicRoots = ["app", "components", "content", "lib", "public", "dist"];
const files = new Set();

for (const file of execFileSync("git", ["ls-files"], { cwd: projectRoot, encoding: "utf8" }).trim().split("\n")) {
  if (file) files.add(file);
}
for (const root of publicRoots) {
  const rootPath = path.join(projectRoot, root);
  if (!fs.existsSync(rootPath)) continue;
  const stack = [rootPath];
  while (stack.length) {
    const directory = stack.pop();
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const location = path.join(directory, entry.name);
      if (entry.isDirectory()) stack.push(location);
      else files.add(path.relative(projectRoot, location));
    }
  }
}

for (const relativePath of files) {
  const absolutePath = path.join(projectRoot, relativePath);
  if (!fs.existsSync(absolutePath) || !textExtensions.has(path.extname(relativePath))) continue;
  const contents = fs.readFileSync(absolutePath, "utf8");
  if (privateRecipient) {
    assert.equal(contents.includes(privateRecipient), false, `Private contact recipient leaked into ${relativePath}`);
  }
  if (["app", "components", "lib", "public", "dist"].includes(relativePath.split(path.sep)[0])) {
    assert.doesNotMatch(contents, /[a-z0-9._%+-]+@(gmail|outlook|hotmail|yahoo)\.[a-z]{2,}/i, `Consumer mailbox found in public output: ${relativePath}`);
  }
}

console.log(`Contact privacy scan passed across ${files.size} tracked and generated files; no private recipient appears in public output.`);
