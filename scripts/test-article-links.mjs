import test from "node:test";
import assert from "node:assert/strict";
import { getInternalArticleTarget } from "./article-link-utils.mjs";

test("root-relative articles with query or fragment are internal", () => {
  assert.equal(getInternalArticleTarget("/articles/google-passkey-vs-2-step-verification"), "google-passkey-vs-2-step-verification");
  assert.equal(getInternalArticleTarget("/articles/example-article/?ref=related#faq"), "example-article");
});

test("canonical and www absolute DECODISTA article links are internal", () => {
  assert.equal(getInternalArticleTarget("https://decodista.com/articles/example-article"), "example-article");
  assert.equal(getInternalArticleTarget("https://www.decodista.com/articles/example-article/#sources"), "example-article");
  assert.equal(getInternalArticleTarget("https://decodista.com/articles/unpublished-guide?utm_source=article"), "unpublished-guide");
});

test("do not mistake off-site links or non-article routes for internal articles", () => {
  assert.equal(getInternalArticleTarget("https://decodista.com.evil.example/articles/example-article"), null);
  assert.equal(getInternalArticleTarget("https://other.example/articles/example-article"), null);
  assert.equal(getInternalArticleTarget("https://decodista.com/science"), null);
  assert.equal(getInternalArticleTarget("/about"), null);
  assert.equal(getInternalArticleTarget("http://decodista.com/articles/example-article"), null);
  assert.equal(getInternalArticleTarget("not a URL"), null);
});

test("return an unknown or malformed article target for the slug validator", () => {
  assert.equal(getInternalArticleTarget("/articles/unknown-guide"), "unknown-guide");
  assert.equal(getInternalArticleTarget("/articles/unexpected/deep/path"), "unexpected/deep/path");
  assert.equal(getInternalArticleTarget("/articles/"), null);
});
