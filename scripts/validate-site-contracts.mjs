import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadArticles } from "./content-loader.mjs";

function read(relativePath) {
  return fs.readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

const site = read("lib/site.ts");
const legal = read("lib/legal.ts");
const homepage = read("app/page.tsx");
const science = read("app/[section]/page.tsx");
const sitemap = read("app/sitemap.ts");
const robots = read("app/robots.ts");
const contactPage = read("app/contact/page.tsx");
const standardsRedirect = read("app/editorial-standards/page.tsx");
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { articles } = loadArticles(projectRoot);

const navigation = site.match(/export const NAV_ITEMS = \[([\s\S]*?)\] as const;/)?.[1];
assert(navigation, "Primary navigation definition is missing");
assert.deepEqual(
  [...navigation.matchAll(/label: "([^"]+)"/g)].map((match) => match[1]),
  ["AI", "How-To", "Digital Life", "Security", "Latest"],
  "Primary navigation must not expose inactive or legacy sections",
);

assert(!/title="Science"|href="\/science"/.test(homepage), "Homepage must not expose an empty Science module");
assert.equal(articles.filter((article) => article.category === "science").length, 0, "Science must remain empty until genuine coverage is published");
assert(/robots:\s*\{[\s\S]*?index:\s*hasStories/.test(science), "Empty category routes must remain noindex");
assert(!/"\/science"/.test(sitemap), "Empty Science route must not be hard-coded into the sitemap");

assert(/const trustRoutes = \[/.test(sitemap), "Trust routes must be separated from content-freshness routes");
assert(!/host:\s*SITE_URL/.test(robots), "robots.txt must not emit a non-standard Host directive");

assert(/This page does not collect, transmit or store messages/.test(legal), "Contact page must state its real delivery status");
assert(/href: "\/contact", label: "Contact status"/.test(legal), "Corrections policy must point to the contact status page");
assert(!/mailto:/i.test(legal), "Trust pages must not publish an unverified email route");
assert(/InfoPageView/.test(contactPage), "Contact page must use the current shared site shell");
assert(/permanentRedirect\("\/editorial-policy"\)/.test(standardsRedirect), "Editorial Standards alias must resolve to the canonical policy route");
assert(!/<form|contact-form/i.test(homepage), "Homepage must not expose a non-functional contact or signup form");
assert(!/Trending|Preview only/i.test(homepage), "Homepage must not expose unsupported traffic or preview claims");

const publicTextRoots = ["app", "components", "lib", "public"];
const textExtensions = new Set([".css", ".html", ".js", ".json", ".md", ".mjs", ".svg", ".ts", ".tsx", ".txt", ".yml", ".yaml"]);
for (const root of publicTextRoots) {
  const stack = [new URL(`../${root}/`, import.meta.url)];
  while (stack.length) {
    const directory = stack.pop();
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const location = new URL(entry.name, directory);
      if (entry.isDirectory()) {
        stack.push(new URL(`${entry.name}/`, directory));
      } else if (textExtensions.has(new URL(location).pathname.match(/\.[^.]+$/)?.[0] ?? "")) {
        assert(!/[a-z0-9._%+-]+@gmail\.com/i.test(fs.readFileSync(location, "utf8")), `Public source contains a Gmail address: ${location.pathname}`);
      }
    }
  }
}

console.log("Validated navigation, Science visibility, trust-page contact status, sitemap freshness rules, and robots output contracts.");
