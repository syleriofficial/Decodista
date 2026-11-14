import assert from "node:assert/strict";
import test from "node:test";
import { SEARCH_QUERY_LIMIT, normalizeSearchQuery, searchPublishedRecords } from "../lib/search.mjs";

const records = [
  {
    slug: "google-photos",
    title: "Google Photos and storage",
    description: "Manage backup files without deleting your originals.",
    categoryName: "Digital Life",
    contentTypeName: "How-To",
    tags: ["Photo Backup", "Google Photos"],
  },
  {
    slug: "account-security",
    title: "Google account security",
    description: "Understand passkeys and recovery options.",
    categoryName: "Security",
    contentTypeName: "Explainer",
    tags: ["Google Account", "Passkeys"],
  },
  {
    slug: "apple-photos",
    title: "iCloud backup and photos",
    description: "Move pictures safely between devices.",
    categoryName: "Digital Life",
    contentTypeName: "How-To",
    tags: ["Apple", "iPhone"],
  },
  {
    slug: "photo-import",
    title: "Photo import and sharing",
    description: "Transfer photos from Google Drive.",
    categoryName: "Digital Life",
    contentTypeName: "How-To",
    tags: ["Cloud"],
  },
];

test("blank search preserves the original publication order", () => {
  assert.equal(searchPublishedRecords(records, ""), records);
  assert.equal(searchPublishedRecords(records, "  "), records);
});

test("all keywords can match across separate fields and punctuation", () => {
  assert.deepEqual(searchPublishedRecords(records, "Google   backup").map(x => x.slug), ["google-photos"]);
  assert.deepEqual(searchPublishedRecords(records, "google-photos").map(x => x.slug), ["google-photos", "photo-import"]); // Both words may match in different fields.
  assert.deepEqual(searchPublishedRecords(records, "google PHOTOS backup").map(x => x.slug), ["google-photos"]);
  assert.deepEqual(searchPublishedRecords(records, "photos passkeys").map(x => x.slug), []);
});

test("title relevance wins over a description-only mention", () => {
  assert.deepEqual(searchPublishedRecords(records, "Google").map(x => x.slug), [
    "google-photos", "account-security", "photo-import",
  ]);
});

test("tag and category queries are discoverable", () => {
  assert.deepEqual(searchPublishedRecords(records, "iPhone").map(x => x.slug), ["apple-photos"]);
  assert.deepEqual(searchPublishedRecords(records, "Security passkeys").map(x => x.slug), ["account-security"]);
});

test("duplicate query words and punctuation-only queries are safe", () => {
  assert.deepEqual(searchPublishedRecords(records, "google google google").map(x => x.slug), [
    "google-photos", "account-security", "photo-import",
  ]);
  assert.deepEqual(searchPublishedRecords(records, "!!!"), []);
});

test("normalization protects malformed or oversized URL queries", () => {
  assert.equal(normalizeSearchQuery(null), "");
  assert.equal(normalizeSearchQuery(["google", "photos"]), "");
  assert.equal(normalizeSearchQuery("   Google\t Photos   "), "Google Photos");
  assert.equal(normalizeSearchQuery("X".repeat(400)).length, SEARCH_QUERY_LIMIT);
  assert.doesNotThrow(() => encodeURIComponent(normalizeSearchQuery("photo\uD800")));
});
