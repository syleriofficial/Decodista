/**
 * Normalize article links for the content audit. Absolute canonical site URLs
 * are internal links, just like root-relative links. Other domains remain
 * external, even when their path looks like an article route.
 *
 * A malformed or unknown slug is returned for validation to reject; this
 * helper does not decide which article slugs exist.
 */
export function getInternalArticleTarget(href) {
  if (typeof href !== "string" || !href) return null;

  let url;
  try {
    if (href.startsWith("/articles/")) {
      url = new URL(href, "https://decodista.com");
    } else {
      url = new URL(href);
      if (url.protocol !== "https:" || !["decodista.com", "www.decodista.com"].includes(url.hostname)) return null;
    }
  } catch {
    return null;
  }

  if (!url.pathname.startsWith("/articles/")) return null;
  const slug = url.pathname.slice("/articles/".length).replace(/\/$/, "");
  return slug || null;
}
