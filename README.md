# DECODISTA

**Technology, Decoded.**

The production foundation for a global English technology publication focused on making technology easier to understand.

## Stack

- Vinext / React 19 with Next-compatible App Router APIs
- TypeScript
- CSS and Tailwind's build pipeline (no runtime styling library)
- Cloudflare Workers-compatible production output
- Typed, file-based article content with no database or CMS dependency

## Development

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Quality checks:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Content model

Approved production articles live in `lib/articles/` and are registered by `lib/content.ts`. Every article has a primary category, a separate content type, topic tags, publication and verification metadata, a short answer, related-article controls, responsive artwork metadata and typed content blocks.

Supported content blocks include headings, paragraphs, ordered and unordered lists, tables, images with captions, quotes, code blocks, and callouts. The presentation layer consumes the typed `Article` interface, so a Markdown/MDX loader or CMS adapter can replace the current repository without rewriting page components.

Primary categories are AI, Digital Life, Security and Science. How-To is a cross-category content type. `/latest` is the chronological archive, while a limited set of populated `/topics/...` hubs provide subject-based discovery without creating thin tag pages.

## Configuration

Set `NEXT_PUBLIC_SITE_URL` to the canonical production origin before launch. It defaults to `https://decodista.com` so local builds can generate complete sitemap, canonical, and structured-data URLs.

The newsletter interface is hidden because no provider is connected. Contact routes are not presented as functional until a verified channel exists. Documentation-based articles do not claim hands-on testing.
