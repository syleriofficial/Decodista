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

Sample articles live in `lib/content.ts`. Every article has a title, slug, description, standfirst, category, tags, author, dates, featured image and alt text, reading time, editorial flags, and typed content blocks.

Supported content blocks include headings, paragraphs, ordered and unordered lists, tables, images with captions, quotes, code blocks, and callouts. The presentation layer consumes the typed `Article` interface, so a Markdown/MDX loader or CMS adapter can replace the current repository without rewriting page components.

## Configuration

Set `NEXT_PUBLIC_SITE_URL` to the canonical production origin before launch. It defaults to `https://decodista.com` so local builds can generate complete sitemap, canonical, and structured-data URLs.

Newsletter and contact interfaces are intentionally not connected to a provider. The sample content is labelled as such and makes no claim of original product testing, traffic rankings, or newsroom credentials.
