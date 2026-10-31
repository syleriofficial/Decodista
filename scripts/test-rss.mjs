import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

// Compile the same framework-independent TypeScript used by the live RSS
// route. This avoids starting a Next/Cloudflare server in unit tests.
const source = readFileSync(new URL("../lib/rss.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { escapeRssXml, renderRssFeed, toRssPubDate } = await import(
  `data:text/javascript;charset=utf-8,${encodeURIComponent(compiled)}`
);

const site = "https://decodista.com";
const example = {
  title: "Privacy & Security <guide>",
  description: "Read \"this\" & don't click <anything>",
  url: `${site}/articles/example`,
  publishedDate: "2026-10-26",
  category: "Security",
};

test("escapes unsafe XML characters and drops illegal control bytes", () => {
  assert.equal(
    escapeRssXml("A & B < C > D \"E\" 'F'\u0001"),
    "A &amp; B &lt; C &gt; D &quot;E&quot; &apos;F&apos;",
  );
});

test("renders a valid RSS-shaped feed with safe summary, self link, guid and UTC date", () => {
  const xml = renderRssFeed([example], site);
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<rss version="2\.0" xmlns:atom=/);
  assert.match(xml, /<atom:link href="https:\/\/decodista\.com\/rss\.xml" rel="self" type="application\/rss\+xml"\/>/);
  assert.match(xml, /<title>Privacy &amp; Security &lt;guide&gt;<\/title>/);
  assert.match(xml, /<description>Read &quot;this&quot; &amp; don&apos;t click &lt;anything&gt;<\/description>/);
  assert.match(xml, /<guid isPermaLink="true">https:\/\/decodista\.com\/articles\/example<\/guid>/);
  assert.match(xml, /<pubDate>Mon, 26 Oct 2026 00:00:00 GMT<\/pubDate>/);
  assert.equal((xml.match(/<item>/g) ?? []).length, 1);
});

test("orders calendar publication dates with consistent tie breaks and caps to 50 items", () => {
  const entries = Array.from({ length: 60 }, (_, i) => ({
    ...example,
    url: `${site}/articles/story-${String(i).padStart(2, "0")}`,
    publishedDate: i < 2 ? "2026-11-01" : "2026-10-01",
  }));
  const xml = renderRssFeed(entries.reverse(), site);
  assert.equal((xml.match(/<item>/g) ?? []).length, 50);
  assert(xml.indexOf("story-00") < xml.indexOf("story-01"));
  assert(xml.indexOf("story-01") < xml.indexOf("story-59"));
});

test("rejects invalid dates, external links, non-HTTPS canonical origins", () => {
  assert.throws(() => toRssPubDate("2026-02-30"), /Invalid RSS publication date/);
  assert.throws(() => toRssPubDate("2026-10-01T10:00:00Z"), /YYYY-MM-DD/);
  assert.throws(() => renderRssFeed([{ ...example, url: "https://evil.test/read" }], site), /belong to DECODISTA/);
  assert.throws(() => renderRssFeed([example], "http://decodista.com"), /HTTPS/);
});

test("supports an empty feed without synthesizing a fake last build date", () => {
  const xml = renderRssFeed([], site);
  assert.match(xml, /<channel>/);
  assert.doesNotMatch(xml, /<lastBuildDate>/);
  assert.doesNotMatch(xml, /<item>/);
});
