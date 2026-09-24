# DECODISTA

**Technology, Decoded.**

The production foundation for a global English technology publication focused on making technology easier to understand.

## Stack

- Vinext / React 19 with Next-compatible App Router APIs
- TypeScript
- CSS and Tailwind's build pipeline (no runtime styling library)
- Cloudflare Workers-compatible production output
- Typed Markdown article content managed through Decap CMS
- GitHub-backed editorial workflow and Cloudflare Workers deployment

## Development

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Quality checks:

```bash
npm run content:validate
npm run lint
npm run typecheck
npm run build
```

Run the complete production gate with:

```bash
npm run release:check
```

## Content model

Approved production articles live in `content/articles/<slug>.md`. Each file uses validated YAML front matter plus standard Markdown. The build-time adapter in `scripts/content-loader.mjs` converts those files to the existing typed article model, so public routes and rendering components do not depend on the CMS runtime.

Every article has a primary category, a separate content type, topic tags, publication and verification metadata, a short answer, key takeaways, optional FAQs, sources, related-article controls and responsive artwork metadata. Build validation rejects unsupported fields, broken article links, missing images, invalid dates, duplicate slugs, multiple featured stories and oversized CMS uploads.

Decap's harmless blank placeholders are normalized before validation. Entirely blank optional FAQ rows and list values are removed, while partly completed FAQ records still fail with a clear error. FAQ and Sources & Verification may each be authored either in the article body or in their structured CMS field; the renderer outputs one version only. Structured FAQs take precedence when both are present, without rewriting the Markdown source.

Supported content includes H2/H3 headings, paragraphs, ordered and unordered lists, GFM tables, images with captions, quotes, code blocks, callouts, links, bold and italic text. The presentation layer continues to consume the typed `Article` interface in `lib/content.ts`.

Primary categories are AI, Digital Life, Security and Science. How-To is a cross-category content type. `/latest` is the chronological archive, while a limited set of populated `/topics/...` hubs provide subject-based discovery without creating thin tag pages.

## Configuration

Set `NEXT_PUBLIC_SITE_URL` to the canonical production origin before launch. It defaults to `https://decodista.com` so local builds can generate complete sitemap, canonical, and structured-data URLs.

The newsletter interface is hidden because no provider is connected. Contact routes are not presented as functional until a verified channel exists. Documentation-based articles do not claim hands-on testing.

## Browser publishing

The editor is served at `/admin/` and uses Decap CMS with the private GitHub repository as its source of truth. Editorial workflow mode keeps new entries on a draft branch and pull request until an authorized editor chooses **Publish**. Decap then squash-merges the editorial changes to `main`.

CMS configuration lives in `public/admin/config.yml`. Uploaded hero images are limited to 2 MB and processed in the browser to a metadata-stripped 1600×900 WebP before being committed under `public/images/uploads/`. Alt text is required.

Publishing authentication uses the same `decodista` Worker through `/api/decap/auth` and `/api/decap/callback`. Configure these values as encrypted Worker secrets; never place them in source, repository variables or a `NEXT_PUBLIC_` variable:

- `GITHUB_OAUTH_CLIENT_ID`
- `GITHUB_OAUTH_CLIENT_SECRET`
- `DECAP_OAUTH_STATE_SECRET`

The GitHub OAuth application callback URL is `https://decodista.com/api/decap/callback`. The proxy validates signed, short-lived state and confirms that the authenticated GitHub account has push permission to `syleriofficial/Decodista` before returning a token to Decap.

Cloudflare Access should protect the `decodista.com/admin*` path only. The public application must not be included in the Access application. The OAuth proxy performs an independent repository-permission check, so passing Access alone does not grant publishing rights.

## Automatic production deployment

Connect the existing `decodista` Worker to `syleriofficial/Decodista` in Cloudflare Workers Builds. Use `main` as the production branch and keep the existing Worker, custom domain and `wrangler.jsonc` configuration.

- Build command: `npm run release:check`
- Deploy command: `npm run deploy:ci`
- Root directory: `/`
- Production branch: `main`

Workers Builds installs the lockfile dependencies before running the build command. A validation, lint, type or build failure prevents deployment. The deploy command publishes the already-validated output to the existing Worker.

## Editor workflow

1. Open `https://decodista.com/admin/` and authenticate with the approved identity and GitHub account.
2. Choose **New Article**, complete the required fields and upload an optimized hero image.
3. Choose **Save** to keep a draft; reopen it from the workflow board to edit or preview it.
4. Move the entry through review as needed, then choose **Publish now**. Browser validation blocks missing required fields and malformed optional records before GitHub is updated.
5. A publish confirmation means the GitHub merge succeeded. Cloudflare then runs `npm run release:check` and deploys automatically; allow a few minutes, then confirm the article's live URL. A failed Cloudflare validation leaves the previous Worker version serving production.
