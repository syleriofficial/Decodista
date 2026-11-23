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
const mobileAudit = read("scripts/audit-mobile-performance.mjs");
const layout = read("app/layout.tsx");
const header = read("components/site-header.tsx");
const footer = read("components/site-footer.tsx");
const rssRoute = read("app/rss.xml/route.ts");
const rssFormatter = read("lib/rss.ts");
const followComponent = read("components/follow-decodista.tsx");
const newsletterProvider = read("lib/newsletter.ts");
const weeklyArchive = read("app/weekly/page.tsx");
const weeklyIssue = read("app/weekly/[slug]/page.tsx");
const weeklyData = read("lib/weekly-briefs.ts");
const topicPage = read("app/topics/[topic]/page.tsx");
const articlePage = read("app/articles/[slug]/page.tsx");
const visualReview = read("docs/EDITORIAL_HERO_VISUAL_REVIEW_2026-11-16.md");
const contentHelpers = read("lib/content.ts");
const science = read("app/[section]/page.tsx");
const css = read("app/globals.css");
const redesignedCss = read("app/editorial-redesign.css");
const latestArchive = read("app/latest/page.tsx");
const paginationHelper = read("lib/pagination.ts");
const sitemap = read("app/sitemap.ts");
const robots = read("app/robots.ts");
const ads = read("public/ads.txt");
const contactPage = read("app/contact/page.tsx");
const searchPage = read("app/search/page.tsx");
const searchClient = read("components/search-client.tsx");
const searchLogic = read("lib/search.mjs");
assert(searchPage.includes("normalizeSearchQuery(Array.isArray(q) ? q[0] : q)"), "Search URL parameters must be bounded and safe for duplicate values");
assert(searchPage.includes("index: false"), "Internal search results must remain noindex");
assert(searchClient.includes("searchPublishedRecords(records, query)"), "Reader search must rank published records by separate keywords");
assert(searchClient.includes("Clear search") && searchClient.includes("maxLength={SEARCH_QUERY_LIMIT}"), "Search must have a clear action and bounded user input");
assert(searchClient.includes('action="/search" method="get"') && searchClient.includes('name="q"'), "Search must remain functional before React hydration or when JavaScript is disabled");
assert(searchLogic.includes("terms.every") && searchLogic.includes("a.index - b.index"), "Search relevance must be all-keywords and stable");
assert(searchClient.includes("suggestedQueries.map") && searchClient.includes('aria-pressed={normalizeSearchQuery(query) === term}')
  && searchClient.includes('onClick={() => setSearch(term)}'),
  "Search topic suggestions must be accessible and interactive");
assert(css.includes(".search-suggestions button[aria-pressed"), "Search topic chips need visible selection feedback");

const howToPage = read("app/how-to/page.tsx");
const standardsRedirect = read("app/editorial-standards/page.tsx");
const nextConfig = read("next.config.ts");
assert(layout.includes('import "./editorial-redesign.css";'), "All public pages must load the Signal Edition design system");
assert(redesignedCss.includes(".lead-story") && redesignedCss.includes(".latest-feed") && redesignedCss.includes(".reader-paths") &&
       redesignedCss.includes(".article-reading") && redesignedCss.includes(".category-header") &&
       redesignedCss.includes(".search-page") && redesignedCss.includes(".weekly-page") &&
       redesignedCss.includes(".site-footer"), "Full redesign must cover all public editorial page templates");
assert(header.includes('className="edition-line wrap"'), "Editorial masthead must include publication identity line");
assert(footer.includes('className="footer-manifesto wrap"'), "Footer must include editorial colophon");
assert(redesignedCss.includes("@media (max-width: 600px)") && redesignedCss.includes("@media (max-width: 800px)"),
  "Magazine layout must include compact mobile and tablet reflow");
const imageComponent = read("components/responsive-image.tsx");
const cardComponent = read("components/article-card.tsx");
const imageGenerator = read("build/responsive-images-vite-plugin.ts");
const issue78Generator = read("scripts/generate-issue78-heroes.mjs");
const packageInfo = read("package.json");
const viteConfig = read("vite.config.ts");
assert(imageComponent.includes("srcSet={info?.srcSet}"), "Responsive image component must use generated srcset");
assert(cardComponent.includes("imageSizes?: string") && cardComponent.includes("sizes={responsiveSizes}"),
  "Article cards must expose layout-aware image sizes");
assert(cardComponent.includes('(max-width: 1000px) 50vw, 48vw'),
  "Two-column article card images must not use undersized three-column candidates");
assert(homepage.includes('imageSizes={stories.length === 1 ? undefined :'),
  "Three-column homepage cards must retain efficient, layout-specific image sizes");
assert(css.includes(".category-lead-image:hover img") && css.includes(".search-result-image:hover img"),
  "Editorial media should share consistent hover presentation");
assert(css.includes(".section-heading { align-items: flex-start; flex-direction: column; gap: .55rem; }"),
  "Narrow-screen editorial headings must stack rather than overflow");
assert(imageComponent.includes("fetchPriority={priority ?"), "Hero image must retain high fetch priority");
const articleHeroGenerator = read("scripts/generate-article-heroes.mjs");
const packageScripts = JSON.parse(packageInfo).scripts;
assert(issue78Generator.includes("Refusing to overwrite a different existing editorial asset") &&
  articleHeroGenerator.includes("recover-hacked-google-account-gmail") &&
  ["precontent:validate", "prebuild", "predev"].every(hook =>
    packageScripts[hook].includes("node scripts/generate-issue78-heroes.mjs") &&
    packageScripts[hook].includes("node scripts/generate-article-heroes.mjs")),
  "Reviewed hero art must be checked before validation, development and builds without overwriting existing originals");
for (const name of ["openai-agent-image-leak-concept", "google-photos-undo-backup-local-kept-cloud-removed", "google-photos-free-up-space-cloud-copies-kept"]) {
  assert(issue78Generator.includes(name), "All three Issue #78 hero artworks must be reproducibly generated");
}
assert(imageGenerator.includes("withoutEnlargement: true") && imageGenerator.includes("responsive-images.generated.json"), "Image pipeline must not enlarge originals and must write the manifest");
assert(viteConfig.includes("responsiveImagesPlugin()"), "Vite must generate responsive WebP assets in local previews and production builds");
assert(nextConfig.includes("images: { unoptimized: true }"), "Do not generate redirecting image optimizer URLs until Vinext has a working image backend");
const notFound = read("app/not-found.tsx");
const staticHeaders = read("public/_headers");
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { articles } = loadArticles(projectRoot);
const icloudMetadataExperiment = read("content/articles/does-icloud-backup-include-photos.md");
assert(icloudMetadataExperiment.includes("seoTitle: Does iCloud Backup Include Photos? On vs Off Explained") &&
  icloudMetadataExperiment.includes("With iCloud Photos on, synced photos aren't in iCloud device backups.") &&
  icloudMetadataExperiment.includes("With it off, iCloud Backup may include them."),
  "iCloud search snippet must give the qualified on/off answer from Apple support");
assert(icloudMetadataExperiment.includes("publishedAt: 2026-09-20") &&
  icloudMetadataExperiment.includes("informationCheckedAt: 2026-09-18"),
  "Metadata-only experiment must not falsify original publish or review dates");

const chromeSeoExperiment = read("content/articles/chrome-enhanced-protection-vs-standard-protection.md");
assert(chromeSeoExperiment.includes('seoTitle: "Chrome Enhanced vs Standard Protection: Which Is Better?"') &&
  chromeSeoExperiment.includes('Is Chrome Enhanced Protection better than Standard?'),
  "Chrome SEO metadata must answer the observed comparison-intent query without claiming a universal winner");
assert(chromeSeoExperiment.includes("updatedAt: 2026-11-15") &&
  chromeSeoExperiment.includes("informationCheckedAt: 2026-11-15"),
  "A metadata-only CTR experiment must preserve the genuine source-review and editorial update dates");
assert(articlePage.includes("const metadataTitle = article.seoTitle ?? article.title") &&
  articlePage.includes("description: article.description"),
  "Published article HTML must render the targeted SEO title and description fields");


const navigation = site.match(/export const NAV_ITEMS = \[([\s\S]*?)\] as const;/)?.[1];
assert(navigation, "Primary navigation definition is missing");
assert.deepEqual(
  [...navigation.matchAll(/label: "([^"]+)"/g)].map((match) => match[1]),
  ["Tech News", "AI", "AI Tools", "Reviews", "How-To", "Security", "Science", "Latest"],
  "Primary navigation must follow the selected editorial menu order",
);

const aiToolsPage = read("app/ai-tools/page.tsx");
const aiToolsCompare = read("app/ai-tools/compare/page.tsx");
const aiToolsWorkflowCompare = read("lib/ai-tools-compare-workflows.ts");
const aiToolsAppCostData = read("lib/ai-tools-app-builder-costs.ts");
const aiToolsAppCostPanel = read("components/ai-app-builder-cost-comparison.tsx");
const aiToolsProfile = read("app/ai-tools/[slug]/page.tsx");
const aiToolsPricing = read("app/ai-tools/pricing/page.tsx");
const aiToolsTrialAudit = read("scripts/verify-ai-tool-trial.mjs");
const aiToolsTrialTests = read("scripts/test-verify-ai-tool-trial.mjs");
const aiToolsProtocol = read("docs/ai-tools-evaluation-protocol.md");
const gitignore = read(".gitignore");
const aiToolsPricingData = read("lib/ai-tools-pricing.ts");
const aiToolsEvidence = read("lib/ai-tools-evidence.ts");
const aiToolsEvidenceClient = read("components/ai-tools-evidence-status.tsx");
const aiToolsFreshnessAudit = read("scripts/check-ai-tools-source-freshness.mjs");
const aiToolsReviewWorkflow = read(".github/workflows/ai-tools-source-review.yml");
const aiToolsAlternatives = read("app/ai-tools/alternatives/page.tsx");
const aiToolsAlternativeJobs = read("lib/ai-tools-alternatives.ts");
const aiToolsExplorer = read("components/ai-tools-explorer.tsx");
const aiToolsTaskFinder = read("components/ai-task-finder.tsx");
const aiToolsInteractions = read("lib/ai-tools-interactions.ts");
const aiToolsMeasurementPlaybook = read("docs/ai-tools-measurement-playbook.md");
const aiToolsData = read("lib/ai-tools.ts");
const aiToolsProductScope = read("docs/ai-tools-product-scope.md");
const aiToolsCss = read("app/ai-tools/ai-tools.css");
assert(aiToolsInteractions.includes('CONSENT_STORAGE_KEY = "decodista-analytics-consent"') &&
  aiToolsInteractions.includes('!== "granted"') &&
  aiToolsInteractions.includes('isAiToolsPath(window.location.pathname)') &&
  aiToolsInteractions.includes('window.gtag("event", event.name') &&
  !aiToolsInteractions.includes('window.gtag("event", "page_view"') &&
  !aiToolsInteractions.includes('search_query:') &&
  !aiToolsInteractions.includes('email:'),
  "AI Tools telemetry needs consent, strict path matching, static event taxonomy and no duplicate pageview / private content");
assert(
  aiToolsInteractions.includes('"app-building"') &&
  aiToolsInteractions.includes('name: "ai_tools_compare_open"') &&
  aiToolsInteractions.includes('name: "ai_tools_search_complete"') &&
  aiToolsInteractions.includes('name: "ai_tools_save_toggle"') &&
  aiToolsInteractions.includes('event.first_tool === event.second_tool') &&
  aiToolsInteractions.includes('!toolIds.has(event.tool_slug)') &&
  aiToolsInteractions.includes('result_bucket: event.result_bucket') &&
  aiToolsExplorer.includes("const lastRecordedSearchRef = useRef") &&
  aiToolsExplorer.includes("getAiToolsResultBucket(filtered.length)") &&
  aiToolsExplorer.includes("onBlur={recordCompletedSearch}") &&
  aiToolsExplorer.includes('name: "ai_tools_compare_open"') &&
  aiToolsExplorer.includes('name: "ai_tools_save_toggle"') &&
  !aiToolsExplorer.includes('search_query:') &&
  !aiToolsInteractions.includes('search_term:') &&
  !aiToolsInteractions.includes('email:'),
  "Measure opt-in product intent without transmitting search text, personal IDs or unapproved tool IDs");
assert(aiToolsTaskFinder.includes('trackAiToolsInteraction({ name: "ai_tools_task_select"') &&
  aiToolsExplorer.includes('name: "ai_tools_category_select"') &&
  aiToolsExplorer.includes('name: "ai_tools_compare_select"'),
  "Only real interaction events after consent should generate AI Tools analytics");
assert(aiToolsMeasurementPlaybook.includes('^/ai-tools(?:/|$)') &&
  aiToolsMeasurementPlaybook.includes('No additional') &&
  aiToolsMeasurementPlaybook.includes('GSC Wizard connection returned') &&
  aiToolsMeasurementPlaybook.includes('Not available'),
  "AI Tools scorecard must isolate path-only pageviews, distinguish search clicks and disclose missing data");

const gscAiToolsPageFilter = aiToolsMeasurementPlaybook.split("anchored RE2 filter `")[1]?.split("`")[0];
assert.equal(gscAiToolsPageFilter, String.raw`^https://(www\.)?decodista\.com/ai-tools(/|$)`,
  "The copy-paste GSC filter must use ONE regex escape before every literal domain dot");
const copyPasteGscRegex = aiToolsMeasurementPlaybook.split("   \`\`\`regex\n   ")[1]?.split("\n   \`\`\`")[0];
assert.equal(copyPasteGscRegex, gscAiToolsPageFilter,
  "The visible GSC regex code block must match the inline tested filter exactly");
const gscScope = new RegExp(gscAiToolsPageFilter);
for (const url of [
  "https://decodista.com/ai-tools",
  "https://decodista.com/ai-tools/",
  "https://decodista.com/ai-tools/compare?first=chatgpt&second=claude",
  "https://www.decodista.com/ai-tools/compare",
]) {
  assert(gscScope.test(url), "GSC AI Tools scope should include real product paths: " + url);
}
for (const url of [
  "https://decodista.com/ai",
  "https://decodista.com/ai-tools-other",
  "https://decodistaXcom/ai-tools",
  "https://evil.decodista.com/ai-tools",
  "https://decodista.com/",
  "https://example.com/ai-tools",
]) {
  assert(!gscScope.test(url), "GSC AI Tools scope must exclude unrelated URLs: " + url);
}
const ga4Scope = /^\/ai-tools(?:\/|$)/;
assert(ga4Scope.test("/ai-tools") && ga4Scope.test("/ai-tools/compare?first=chatgpt&second=claude") &&
  !ga4Scope.test("/ai-tools-other") && !ga4Scope.test("/ai"),
  "GA4 page-path scope must include only the AI Tools product");
assert(aiToolsMeasurementPlaybook.includes("No paid connector: manual export fallback") &&
  aiToolsMeasurementPlaybook.includes("page-level") &&
  aiToolsMeasurementPlaybook.includes("chart summary totals"),
  "The AI Tools measurement fallback must preserve source aggregates and avoid requiring a paid connector");

assert(aiToolsPage.includes('title: "AI Tools Directory & Comparison"') && aiToolsPage.includes('index: false'),
  "AI Tools starter directory must stay noindex until its editorial verification is complete");
assert(aiToolsPage.includes("<AiToolsExplorer />") && aiToolsPage.includes('href="/ai-tools/compare"'),
  "AI Tools directory must expose actual discovery and a comparison destination");
assert(aiToolsCompare.includes('title: "Compare AI Tools"') && aiToolsCompare.includes('index: false'),
  "AI tools comparison must be honest, functional and noindex until editorial review");
assert(aiToolsCompare.includes('action="/ai-tools/compare"') && aiToolsCompare.includes('findAiTool('),
  "Comparisons must support shareable form-based tool selection");
assert(
  aiToolsCompare.includes('<AiAppBuilderCostComparison firstSlug={first.slug} secondSlug={second.slug} />') &&
  aiToolsAppCostData.includes('APP_BUILDER_COSTS_REVIEWED_ON = "2026-11-23"') &&
  ["lovable", "bolt", "replit"].every((slug) => aiToolsAppCostData.includes('slug: "' + slug + '"')) &&
  aiToolsAppCostData.includes("https://lovable.dev/pricing") &&
  aiToolsAppCostData.includes("https://bolt.new/pricing") &&
  aiToolsAppCostData.includes("https://docs.replit.com/category/billing") &&
  aiToolsAppCostData.includes("getAppBuilderCost(slug: string)") &&
  aiToolsAppCostPanel.includes("if (!first || !second) return null") &&
  aiToolsAppCostPanel.includes("token is not equivalent to a credit") &&
  aiToolsAppCostPanel.includes('data-cost-tool={item.slug}') &&
  aiToolsAppCostPanel.includes('href={item.sourceUrl}') &&
  aiToolsAppCostPanel.includes("not tested cost estimates") &&
  aiToolsCss.includes(".ai-tools-app-cost-grid") &&
  aiToolsPricing.includes("Compare app-builder costs"),
  "App builder billing comparison must be official-sourced, mobile-friendly and never imply comparable credit units"
);
assert(aiToolsCompare.includes("compareListedAiWorkflows(first.slug, second.slug)") &&
  aiToolsCompare.includes('className="ai-tools-workflow-comparison"') &&
  aiToolsCompare.includes('data-workflow={item.job}') &&
  aiToolsCompare.includes('"Not listed here"') &&
  aiToolsCompare.includes("not mean a missing feature") &&
  aiToolsWorkflowCompare.includes("getAiToolJobs(firstSlug)") &&
  aiToolsWorkflowCompare.includes("getAiToolJobs(secondSlug)") &&
  aiToolsWorkflowCompare.includes("secondOnlyCount") &&
  aiToolsWorkflowCompare.includes("sharedCount") &&
  !aiToolsWorkflowCompare.includes("score:") &&
  aiToolsCss.includes(".ai-tools-workflow-table") &&
  aiToolsCss.includes(".ai-tools-workflow-summary"),
  "Comparison must show task overlap without inventing missing features, ranks or scores");
assert(aiToolsExplorer.includes("useSyncExternalStore(") &&
  aiToolsExplorer.includes('SAVED_STORAGE_KEY = "decodista-ai-tools-saved-v1"') &&
  aiToolsExplorer.includes('aria-pressed={isSaved}') &&
  aiToolsExplorer.includes("Saved tools (") &&
  aiToolsExplorer.includes('value={sortOrder}') &&
  aiToolsExplorer.includes('onClick={() => toggleSave(tool.slug)}') &&
  !aiToolsExplorer.includes("fetch(") &&
  aiToolsCss.includes(".ai-tools-save-button") &&
  aiToolsCss.includes(".ai-tools-sort-control"),
  "AI Tools bookmarks and sorting must be private, accessible and entirely local");

assert(aiToolsExplorer.includes('aria-pressed={isSelected}') && aiToolsExplorer.includes('filtered.length') &&
  aiToolsExplorer.includes('getCategoryLabel') && aiToolsExplorer.includes('Compare selected tools'),
  "Directory needs accessible search, filters and two-tool selection");
assert(aiToolsData.includes('officialUrl:') && aiToolsData.includes('practicalNote:') &&
  aiToolsData.includes('export const AI_TOOLS: readonly AiTool[]'),
  "Editorial tool entries must link to providers and explain practical caveats");
assert(aiToolsCss.includes('@media (max-width: 600px)') &&
  aiToolsCss.includes('.ai-tools-compare-table') && aiToolsCss.includes('.ai-tools-grid'),
  "AI Tools needs responsive directory and comparison styles");
assert(aiToolsProfile.includes("generateStaticParams()") &&
  aiToolsProfile.includes("notFound()") && aiToolsProfile.includes("index: false"),
  "Individual tool profile pages must exist, return real 404s and remain noindex pending original editorial research");
assert(aiToolsProfile.includes('candidate.category === tool.category') &&
  aiToolsProfile.includes('/ai-tools/compare?first=') &&
  aiToolsProfile.includes('tool.officialUrl'),
  "Profiles must show same-category alternatives, comparison routes and official providers");
assert(aiToolsExplorer.includes('href={`/ai-tools/${tool.slug}`}') &&
  aiToolsCompare.includes('href={`/ai-tools/${first.slug}`}'),
  "Tool directory and comparison must link to individual tool profiles");
assert(aiToolsCss.includes('.ai-tools-profile-body') && aiToolsCss.includes('.ai-tools-profile-related'),
  "Individual tool profiles require responsive content and related-tool styles");
assert(!sitemap.includes('AI_TOOLS.map(') && !sitemap.includes('route: "/ai-tools"'),
  "Introductory noindex AI Tools directory and tool profiles must stay out of sitemap");
assert(aiToolsPricing.includes('title: "AI Tool Pricing & Plans"') &&
  aiToolsPricing.includes('index: false') &&
  aiToolsPricing.includes('record.pricingUrl') &&
  aiToolsPricing.includes('PRICING_LAST_EXPANDED_ON') &&
  aiToolsPricing.includes('dateTime={record.checkedOn}') &&
  aiToolsPricing.includes('source.findings.slice(0, 2)') &&
  aiToolsPricing.includes('id={`plan-${record.slug}`}'),
  "Pricing product must disclose all dated provider sources, capability evidence, and noindex");
assert(aiToolsPricingData.includes('PRICING_CHECKED_ON = "2026-11-21"') &&
  aiToolsPricingData.includes('https://chatgpt.com/pricing/') &&
  aiToolsPricingData.includes('https://claude.com/pricing') &&
  aiToolsPricingData.includes('https://one.google.com/intl/en_in/about/google-ai-plans/') &&
  aiToolsPricingData.includes('https://www.perplexity.ai/pro') &&
  aiToolsPricingData.includes('US$200/year'),
  "Dated pricing claims must point to official provider sources with billing context");
assert(
  ["bolt", "gamma", "lovable", "replit"].every((slug) =>
    aiToolsData.includes('slug: "' + slug + '"') &&
    aiToolsEvidence.includes('slug: "' + slug + '"') &&
    aiToolsPricingData.includes('slug: "' + slug + '"') &&
    aiToolsAlternativeJobs.includes('"' + slug + '":')) &&
  aiToolsTaskFinder.includes('id: "app-building"') &&
  aiToolsTaskFinder.includes('slug: "gamma"') &&
  aiToolsPricingData.includes("https://lovable.dev/pricing") &&
  aiToolsPricingData.includes("https://bolt.new/pricing") &&
  aiToolsPricingData.includes("https://replit.com/pricing") &&
  aiToolsPricingData.includes("https://gamma.app/en/pricing") &&
  aiToolsEvidence.includes("https://replit.com/products/agent") &&
  aiToolsEvidence.includes("https://support.bolt.new/building/intro-bolt") &&
  aiToolsEvidence.includes("https://lovable.dev/build/web-app-builder") &&
  aiToolsEvidence.includes("https://help.gamma.app/en/articles/7838093-how-do-i-create-a-new-presentation-document-or-webpage-in-gamma"),
  "Every new catalog entry requires evidence, official pricing, task taxonomy and discoverability");

assert(aiToolsPricingData.includes('PRICING_LAST_EXPANDED_ON = "2026-11-23"') &&
  aiToolsPricingData.includes("checkedOn: PRICING_CHECKED_ON") &&
  (aiToolsPricingData.match(/    slug: "/g) || []).length === 16 &&
  (aiToolsPricingData.match(/checkedOn: PRICING_LAST_EXPANDED_ON/g) || []).length === 12 &&
  aiToolsPricingData.includes('https://cursor.com/pricing') &&
  aiToolsPricingData.includes('https://docs.github.com/en/copilot/get-started/plans') &&
  aiToolsPricingData.includes('https://elevenlabs.io/pricing') &&
  aiToolsPricingData.includes('https://support.google.com/gemininotebook/answer/16213268') &&
  aiToolsPricingData.includes('https://www.canva.com/pricing/'),
  "All 16 AI tools need dated official plan records, with separate dates for earlier reviews");
assert(aiToolsExplorer.includes('href={`/ai-tools/pricing#plan-${tool.slug}`}') &&
  aiToolsProfile.includes('href={`/ai-tools/pricing#plan-${tool.slug}`}') &&
  aiToolsCompare.includes('firstPlans.planNames.join(" · ")') &&
  aiToolsCompare.includes('secondPlans.planNames.join(" · ")') &&
  aiToolsCss.includes(".ai-tools-card-plans") && aiToolsCss.includes(".ai-tools-price-capabilities"),
  "Directory, tool profiles and comparison must use the same source-backed plan ledger");
assert(aiToolsAlternatives.includes('title: "AI Tool Alternatives"') &&
  aiToolsAlternatives.includes('index: false') &&
  aiToolsAlternatives.includes('action="/ai-tools/alternatives"') &&
  aiToolsAlternatives.includes('getAlternativeGroups(selected, firstString(query.job))') &&
  aiToolsAlternatives.includes('ai-tools-alternative-match-card') &&
  aiToolsAlternatives.includes('ai-tools-alternative-secondary-card') &&
  aiToolsAlternatives.includes('evidence.sourceUrl') &&
  aiToolsAlternativeJobs.includes('tool.category === selected.category') &&
  aiToolsAlternativeJobs.includes('selectedJobs.includes(job)') &&
  aiToolsAlternativeJobs.includes('related.push({ tool, sharedJobs: common })') &&
  aiToolsAlternativeJobs.includes('AI_ALTERNATIVE_JOBS') &&
  !aiToolsAlternativeJobs.includes('score:'),
  "Alternative matching must distinguish actual listed workflow overlap from broader category discovery, with official sources and no scores");
assert(aiToolsPage.includes('href="/ai-tools/pricing"') &&
  aiToolsPage.includes('href="/ai-tools/alternatives"') &&
  aiToolsProfile.includes('/ai-tools/alternatives?tool='),
  "Directory and tool profiles must link to Pricing and Alternatives");
assert(aiToolsCss.includes('.ai-tools-price-grid') &&
  aiToolsCss.includes('.ai-tools-alternatives-grid') &&
  aiToolsCss.includes('.ai-tools-alternatives-secondary') &&
  aiToolsCss.includes('.ai-tools-alternative-overlap') &&
  aiToolsCss.includes('.ai-tools-decision-links'),
  "Pricing and alternative pages need responsive scoped styles");
assert(!sitemap.includes('route: "/ai-tools/pricing"') && !sitemap.includes('route: "/ai-tools/alternatives"'),
  "Early-stage pricing and alternatives pages must remain outside the sitemap");
assert(aiToolsEvidence.includes('AI_EVIDENCE_CHECKED_ON = "2026-11-21"') &&
  aiToolsEvidence.includes('AI_EVIDENCE_REVIEW_INTERVAL_DAYS = 30') &&
  aiToolsEvidence.includes('docs.github.com/en/copilot/get-started/plans') &&
  aiToolsEvidence.includes('https://claude.com/pricing'),
  "Five selected AI Tools must have dated official verification evidence");
assert(aiToolsProfile.includes('getAiToolEvidence(tool.slug)') &&
  aiToolsProfile.includes('source.sourceUrl') &&
  aiToolsCompare.includes('getAiToolEvidence(tool.slug)') &&
  aiToolsCompare.includes('ai-tools-compare-evidence'),
  "Profiles and comparisons must surface source trail where available");
assert(aiToolsPricing.includes('<AiEvidenceStatus checkedOn={PRICING_LAST_EXPANDED_ON} />') &&
  aiToolsPricing.includes('<AiEvidenceStatus checkedOn={record.checkedOn} />') &&
  aiToolsEvidenceClient.includes('is-stale') &&
  aiToolsEvidenceClient.includes('daysSinceEvidenceCheck'),
  "Every provider card must independently warn when its dated plan snapshot becomes stale");
assert(aiToolsFreshnessAudit.includes('MAX_AGE_DAYS = 30') &&
  aiToolsFreshnessAudit.includes('PRICING_CHECKED_ON') &&
  aiToolsFreshnessAudit.includes('AI_EVIDENCE_CHECKED_ON'),
  "Source check audit must include dated pricing and feature records");
assert(aiToolsReviewWorkflow.includes("cron: '0 9 * * 1'") &&
  aiToolsReviewWorkflow.includes('gh issue create') &&
  aiToolsReviewWorkflow.includes('steps.freshness.outcome'),
  "Weekly audit must request human review when source records are stale");
assert(aiToolsCss.includes('.ai-tools-evidence-status.is-stale') &&
  aiToolsCss.includes('.ai-tools-compare-evidence-grid'),
  "Source evidence and date warning must be readable on mobile");
assert(aiToolsProductScope.includes("No editorial guides") && aiToolsProductScope.includes("global English-first discovery") && aiToolsProductScope.includes("/ai-tools/compare"), "AI Tools must remain a product-only discovery and comparison application");
// Product-only contract: legacy editorial AI Tools pages, files and links must stay removed.
for (const deleted of [
  "app/ai-tools/guides/page.tsx",
  "app/ai-tools/guides/[slug]/page.tsx",
  "app/ai-tools/guides/chatgpt-vs-gemini-for-research/page.tsx",
  "app/ai-tools/guides/perplexity-vs-gemini-notebook/page.tsx",
  "app/ai-tools/workflows/compare-two-pdfs-with-ai/page.tsx",
  "public/ai-tools/samples/library-hours-notice-v1.txt",
  "public/ai-tools/samples/library-hours-notice-v2.txt",
  "lib/ai-tools-comparison-guides.ts",
  "lib/ai-tools-research-guides.ts",
  "lib/ai-tools-workflows.ts",
]) {
  assert(!fs.existsSync(new URL("../" + deleted, import.meta.url)), "Obsolete editorial file must remain removed: " + deleted);
}
for (const artifact of [homepage, aiToolsPage, aiToolsProfile, aiToolsCompare, aiToolsTaskFinder, sitemap]) {
  assert(!artifact.includes("/ai-tools/guides") && !artifact.includes("/ai-tools/workflows"),
    "User-facing AI Tools navigation must not point at removed editorial pages");
}
assert(!sitemap.includes("AI_COMPARISON_GUIDES") && !sitemap.includes("AI_TOOLS_RESEARCH_GUIDES") && !sitemap.includes("AI_TOOLS_WORKFLOWS"),
  "Removed editorial URLs must not be reintroduced through the sitemap");
assert(aiToolsTrialAudit.includes("auditTrialPacket(") &&
  aiToolsTrialTests.includes("syntheticPacket(") &&
  aiToolsProtocol.includes("not an automated vendor benchmark") &&
  gitignore.includes("/local-ai-trials/"),
  "Independent evidence-audit tooling remains private and functional");
const footerSecondary = site.match(/export const FOOTER_SECONDARY_ITEMS = \[([\s\S]*?)\] as const;/)?.[1];
assert(footerSecondary, "Footer secondary navigation definition is missing");
assert.deepEqual(
  [...footerSecondary.matchAll(/label: "([^"]+)"/g)].map((match) => match[1]),
  ["Digital Life", "Weekly Brief"],
  "Footer must retain secondary archives and Weekly Brief without restoring More",
);
assert(header.includes("NAV_ITEMS.map") && !header.includes("MORE_NAV_ITEMS") && !header.includes("more-menu"),
  "Header must expose only the approved primary nav items, without a More dropdown");
assert(header.includes('aria-current={pathname === item.href ||') &&
  header.includes('pathname.startsWith(`${item.href}/`)') &&
  header.includes(' ? "page" : undefined}'),
  "Navigation should identify the active editorial category and nested paths accessibly");
assert(homepage.includes('className="home-intro wrap"'), "Homepage needs a visible editorial introduction");
assert(science.includes("!featured && articles.length > 0") &&
  science.includes("Latest published across DECODISTA") &&
  science.includes("These articles are from other published sections"),
  "Empty categories must clearly label genuine cross-section reading options without miscategorizing content");
assert(homepage.indexOf('className="section-block latest-home') < homepage.indexOf('className="reader-paths wrap"')
  && homepage.indexOf('className="reader-paths wrap"') < homepage.indexOf('title="AI" href="/ai"'),
  "Homepage should lead with recent stories and guided discovery before category archives");
assert(homepage.indexOf('const latest = takeDistinct(articles, 3, false)') < homepage.indexOf('const ai = takeDistinct('),
  "Latest Stories should reserve distinct recent articles before category sections");
assert(homepage.includes('sizes="(max-width: 1180px) 100vw, 38vw"'),
  "Signal Edition feature artwork should not overfetch oversized desktop WebP variants");
assert(mobileAudit.includes('"small-mobile-homepage"') && mobileAudit.includes('"small-mobile-search"') &&
  mobileAudit.includes('"small-mobile-article"') && mobileAudit.includes("hasTouch: true") &&
  mobileAudit.includes("-after-consent.png"),
  "Live mobile verification must cover 320px touch behavior, key pages and unobstructed screenshots");
assert(homepage.includes('imageSizes="(max-width: 600px) 38vw, (max-width: 1000px) 50vw, 32vw"'),
  "Latest magazine tiles must preserve correct responsive image hints");
assert(footer.includes("FOOTER_SECONDARY_ITEMS.map"), "Footer must keep secondary destinations accessible");
assert(footer.includes("{SITE_DESCRIPTION}"), "Footer summary must stay in sync with site metadata");
assert(footer.includes("{SITE_TAGLINE}"), "Footer tagline must stay in sync with the site-wide identity");
for (const category of ["ai", "security", "digital-life"]) {
  assert(homepage.includes(`getArticlesByCategory("${category}")`), `Homepage must feature populated ${category} stories`);
  assert(articles.some((article) => article.category === category), `Promoted category ${category} cannot be empty`);
}
assert(homepage.includes('getArticlesByContentType("how-to")'), "Homepage must promote real How-To guides");
assert(howToPage.includes('import { ResponsiveImage } from "@/components/responsive-image"'), "How-To lead must use the shared responsive WebP implementation");
assert(howToPage.includes('<ResponsiveImage src={featured.featuredImage}') && howToPage.includes("fill priority sizes="), "How-To Hero must advertise real variants and retain high priority");
assert(!howToPage.includes('next/image'), "How-To must not revert to redirecting Next.js image URLs");
assert(articles.some((article) => article.contentType === "how-to"), "Primary How-To archive must have real guides");
for (const category of ["tech-news","ai","ai-tools","reviews","how-to","security","science","latest"]) {
  assert(navigation.includes(`href: "/${category}"`), `Editorial primary navigation is missing ${category}`);
}
for (const destination of ["digital-life", "weekly"]) {
  assert(footerSecondary.includes(`href: "/${destination}"`), `Footer secondary navigation is missing ${destination}`);
}
const primaryHrefs = [...navigation.matchAll(/href: "([^"]+)"/g)].map((match) => match[1]);
const footerHrefs = [...footerSecondary.matchAll(/href: "([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set([...primaryHrefs, ...footerHrefs]).size, primaryHrefs.length + footerHrefs.length,
  "Primary and footer secondary navigation must not duplicate destinations");
assert(navigation.includes('href: "/security"') && navigation.includes('href: "/latest"') && !navigation.includes('href: "/entertainment"') && !navigation.includes('href: "/weekly"') && !site.includes("MORE_NAV_ITEMS"),
  "Security and Latest belong in the primary navigation; retired Entertainment and More navigation must not return");
assert(footerSecondary.includes('href: "/weekly", label: "Weekly Brief"'),
  "Published Weekly Brief must have a visible footer archive link");
assert(homepage.includes("if (!stories.length) return null;"), "Homepage must not present empty editorial sections");
assert.equal(articles.filter((article) => article.category === "science").length, 0, "Science must remain empty until genuine coverage is published");
assert(/robots:\s*\{[\s\S]*?index:\s*hasStories/.test(science), "Empty category routes must remain noindex");
assert(science.includes('className="section-explore-links"') && science.includes('getArticlesByContentType("how-to").length')
  && science.includes('all.length === 1 ? "story" : "stories"'),
  "Category design must report real content counts and suggest only populated archives");
assert(paginationHelper.includes("Number.isSafeInteger"), "Pagination must reject unsafe values");
assert(paginationHelper.includes("/^[1-9]\\d*$/"), "Pagination must only accept positive integer page numbers");
assert(latestArchive.includes("parsePageNumber(pageParam)"), "Latest must validate page numbers");
assert(latestArchive.includes('id="latest-articles-heading"'), "Latest archive must provide an h2 parent for article h3 headings");
assert(nextConfig.includes("htmlLimitedBots: /.*/"), "Async archive/article metadata must render in head for all crawlers");
assert(science.includes("parsePageNumber(pageParam)"), "Category pagination must validate page numbers");
assert(science.includes("featured && page === 1"), "Category featured article must not repeat on paginated pages");
assert(!/"\/science"/.test(sitemap), "Empty Science route must not be hard-coded into the sitemap");

assert(/const trustRoutes = \[/.test(sitemap), "Trust routes must be separated from content-freshness routes");
assert(!/host:\s*SITE_URL/.test(robots), "robots.txt must not emit a non-standard Host directive");
assert.equal(
  ads,
  "google.com, pub-5589150014762971, DIRECT, f08c47fec0942fa0\n",
  "ads.txt must contain exactly the approved Google AdSense publisher entry",
);
assert(!/ads\.txt/.test(robots), "robots.txt must not block ads.txt");

assert(/href: "\/contact\?type=correction", label: "Submit a correction"/.test(legal), "Corrections policy must preselect the correction form");
assert(!/mailto:/i.test(legal), "Trust pages must not publish an unverified email route");
const aboutContent = legal.split('  about: {', 2)[1]?.split('  "review-methodology": {', 1)[0] ?? "";
assert(aboutContent.includes("Our current published coverage focuses on AI tools"), "About must describe the coverage readers can actually access");
assert(!/Follow technology, science and digital entertainment/.test(aboutContent), "About must not imply unlaunched sections are active");
assert(/ContactForm/.test(contactPage), "Contact page must expose the protected production form");
assert(/TURNSTILE_SITE_KEY/.test(contactPage), "Contact page must configure Cloudflare Turnstile");
assert(/private delivery address is never shown/i.test(contactPage), "Contact page must keep the recipient private");
assert(/permanentRedirect\("\/editorial-policy"\)/.test(standardsRedirect), "Editorial Standards alias must resolve to the canonical policy route");
assert(!/<form|contact-form/i.test(homepage), "Homepage must not expose a non-functional contact or signup form");
assert(!/Trending|Preview only/i.test(homepage), "Homepage must not expose unsupported traffic or preview claims");
assert(homepage.includes("const lead = articles[0]"), "Homepage must lead with the newest published story");
assert(homepage.includes("readerJourneys") && homepage.includes("reader-paths"), "Homepage must offer curated reader journeys");
assert(homepage.includes('className="reader-search-link" href="/search"'), "Homepage must offer direct access to published-guide search");
assert(!homepage.includes("<FollowDecodista />"), "Homepage should not promote a duplicate RSS subscribe panel; footer retains RSS");
assert(homepage.includes("getArticlesByTopic(slug).length >= TOPIC_MAP[slug].minimumArticles"), "Reader paths must never lead to unpopulated topics");
assert(topicPage.includes("Start here") && topicPage.includes("startHereSlugs"), "Topic hubs must have non-duplicated starting points");
assert(articlePage.includes("related.length > 0"), "Do not render an empty related-reading section");
assert(contentHelpers.includes(".filter(({ contextScore }) => contextScore > 0)"), "Automatic related guides must share at least one topical signal; category or content type alone is insufficient");
assert(contentHelpers.includes("return [...manual, ...automaticallyRelated].slice(0, limit)"), "Manual editorial related guides must continue to take priority over automatic suggestions");
assert(contentHelpers.includes("contextScore = sharedTags * 6 + sharedHubs * 3"),
  "Related guides must prefer a genuinely shared subject before generic category similarity");
assert(contentHelpers.includes("getArticleTopicHubs") && contentHelpers.includes("articleCount >= topic.minimumArticles"),
  "Article discovery must link only to populated topic hubs");
assert(articlePage.includes("Conceptual editorial illustration, not an official product screenshot.") &&
  articlePage.includes("fictional artwork, not a photograph"),
  "Published images must distinguish conceptual art from documentary evidence");
assert(visualReview.includes("Complete article-to-image review") && visualReview.includes("openai-agent-leak-53-chatgpt-user-images"),
  "Every published hero must have an accessible and honest visual review record");
assert(articlePage.indexOf('className="article-discovery"') > articlePage.indexOf('className="article-main-grid"'),
  "Article discovery must follow the full article, not interrupt reading");
assert(articlePage.includes('className="article-discovery"') && articlePage.includes("topicHubs.slice(0, 2)"),
  "Article readers must find contextual guides and populated topic hubs before finishing the story");
assert(!/newsletter|subscribe now/i.test(homepage), "Do not advertise an unimplemented subscription feature");
assert(homepage.includes('className="home-weekly-brief wrap"') && homepage.includes("weeklyBriefs[0]") &&
  homepage.includes('href="/weekly"') && homepage.includes('href={`/weekly/${currentWeeklyBrief.slug}`}' ),
  "Homepage must link both the latest real Weekly Brief edition and the complete archive");
assert(weeklyArchive.includes("weeklyBriefs") && weeklyArchive.includes("Latest published issue"), "Weekly archive must render a real published edition");
assert(weeklyIssue.includes("getWeeklyBrief(slug)") && weeklyIssue.includes("notFound()"), "Weekly issue route must reject unknown slugs");
assert(weeklyIssue.includes("Primary source:") && weeklyIssue.includes("rel=\"noopener noreferrer\""), "Weekly issue must attribute and safely link to primary sources");
assert(weeklyIssue.includes("BreadcrumbList") && weeklyIssue.includes("BlogPosting"), "Weekly issues need discoverable structured data");
assert(sitemap.includes('route: "/weekly"') && sitemap.includes('url: `${SITE_URL}/weekly/${issue.slug}`'), "Weekly archive and issues must appear in the sitemap");
assert(!/<form|subscribe now|newsletter signup/i.test(weeklyArchive), "Do not publish an unimplemented weekly email signup");
assert(layout.includes('"application/rss+xml": `${SITE_URL}/rss.xml`'), "RSS must be discoverable through document metadata");
assert(!navigation.includes('href: "/weekly"') && footerSecondary.includes('href: "/weekly"'),
  "Weekly Brief stays out of primary navigation but remains discoverable in the footer");
assert(site.includes('href: "/review-methodology", label: "Review Methodology"'), "Review methodology must be discoverable");
assert(sitemap.includes('"/review-methodology"'), "Review methodology must appear in sitemap");
assert(!homepage.includes('title="Reviews"'), "Do not promote the empty Reviews pillar in homepage sections");
assert(!homepage.includes('Tested and evaluated'), "Homepage must not imply unverified hands-on testing");
assert(site.includes("Independent technology explainers and step-by-step guides"), "Site description must reflect presently published content rather than empty future categories");
assert(!header.includes('href="/rss.xml"'), "RSS feed should remain discoverable in footer and metadata, not the main navigation");
assert(header.includes('event.key === "Escape" && open') && header.includes('setOpen(false)'),
  "Escape must still close the mobile navigation when open");
assert(footer.includes('href="/rss.xml"'), "RSS must have a permanent footer link");
assert(weeklyArchive.includes("FollowDecodista"), "Weekly archive must preserve RSS follow options");
assert(rssRoute.includes("articles.map(") && rssRoute.includes("weeklyBriefs.map("), "RSS must include both approved article and weekly issue records");
assert(rssRoute.includes('"Content-Type": "application/rss+xml; charset=utf-8"'), "RSS must serve an explicit XML MIME type");
assert(rssFormatter.includes("escapeRssXml") && rssFormatter.includes("toRssPubDate"), "RSS must escape XML and serialize real calendar dates");
assert(followComponent.includes("subscribeUrl &&") && !/<form\b/i.test(followComponent), "Email follow must be provider-gated, never a fake local signup form");
assert(newsletterProvider.includes('process.env.NEXT_PUBLIC_NEWSLETTER_SUBSCRIBE_URL'), "Newsletter destination must be opt-in configured");
assert(newsletterProvider.includes('url.protocol !== "https:"'), "Newsletter destinations must require HTTPS");
assert(legal.includes("DECODISTA does not operate a newsletter signup"), "Privacy policy must not claim an unconfigured subscription service is active");
const weeklySources = [...weeklyData.matchAll(/url: "(https:\/\/[^"]+)"/g)].map((match) => match[1]);
assert(weeklySources.length >= 4, "First weekly edition must cite multiple direct primary sources");
assert(new Set(weeklySources).size === weeklySources.length, "Weekly issue should not repeat a primary source");
const verifiedWeeklyHosts = new Set([
  "support.apple.com", "www.mozilla.org", "blog.google", "openai.com",
  "www.microsoft.com", "about.fb.com", "chromereleases.googleblog.com",
  "consumer.ftc.gov", "security.apple.com", "www.cisa.gov",
  "forums.unrealircd.org", "research.checkpoint.com",
]);
assert(weeklySources.every((url) => {
  try { const parsed = new URL(url); return parsed.protocol === "https:" && verifiedWeeklyHosts.has(parsed.hostname); }
  catch { return false; }
}), "Weekly sources must point directly to reviewed primary publishers");
assert(weeklyData.includes('slug: "2026-11-16"') && weeklyData.includes('issueNumber: 3'), "Weekly issue 03 must be dated and numbered");
const thirdIssue = weeklyData.split('slug: "2026-11-16"')[1]?.split('slug: "2026-11-11"')[0] ?? "";
assert(thirdIssue.includes('periodStart: "2026-11-11"') && thirdIssue.includes('periodEnd: "2026-11-15"'), "Issue 03 must report on November 11–15");
const thirdIssueDates = [...thirdIssue.matchAll(/announcedDate: "(2026-11-\d{2})"/g)].map((match) => match[1]);
assert.equal(thirdIssueDates.length, 5, "Issue 03 must contain five dated developments");
assert(thirdIssueDates.every((date) => date >= "2026-11-11" && date <= "2026-11-15"), "Issue 03 updates must fall within the reporting period");
assert(weeklyData.indexOf('slug: "2026-11-16"') < weeklyData.indexOf('slug: "2026-11-11"'), "Weekly issue 03 must be newest");
assert(weeklyData.indexOf('slug: "2026-11-11"') !== -1, "Weekly issue 02 must be dated");
assert(weeklyData.indexOf('slug: "2026-11-11"') < weeklyData.indexOf('slug: "2026-11-01"'), "Newest weekly issue must come first");
const secondIssue = weeklyData.split('slug: "2026-11-11"')[1]?.split('slug: "2026-11-01"')[0] ?? "";
assert(/issueNumber: 2/.test(secondIssue), "Issue 02 must have the correct issue number");
assert(/publishedDate: "2026-11-11"/.test(secondIssue), "Issue 02 must carry its actual publication date");
assert(/periodStart: "2026-11-02"/.test(secondIssue) && /periodEnd: "2026-11-10"/.test(secondIssue), "Issue 02 must state its reporting window");
const secondIssueDates = [...secondIssue.matchAll(/announcedDate: "(2026-11-\d{2})"/g)].map((match) => match[1]);
assert.equal(secondIssueDates.length, 5, "Issue 02 must have exactly five dated developments");
assert(secondIssueDates.every((date) => date >= "2026-11-02" && date <= "2026-11-10"), "Issue 02 updates must fall within its reporting window");
assert(/slug: "2026-11-01"/.test(weeklyData), "First weekly issue must have an explicit dated slug");
assert(/publishedDate: "2026-11-01"/.test(weeklyData), "First weekly issue must have a dated publication field");
assert(weeklyData.includes("implementation is planned over the coming months"), "Do not describe the proposed AI training signal as already implemented");

for (const header of [
  "Content-Security-Policy",
  "Strict-Transport-Security",
  "X-Content-Type-Options",
  "Referrer-Policy",
  "X-Frame-Options",
  "Permissions-Policy",
]) {
  assert(nextConfig.includes(header), `Global security header is missing: ${header}`);
}
assert(nextConfig.includes("https://challenges.cloudflare.com"), "CSP must allow Cloudflare Turnstile");
assert(!nextConfig.includes("'unsafe-eval'"), "CSP must not permit unsafe-eval");
assert(!/includeSubDomains|preload/.test(nextConfig), "HSTS must not opt into subdomains or preload without a separate audit");
assert(/\/admin\*[\s\S]*Content-Security-Policy:[^\n]*https:\/\/unpkg\.com/.test(staticHeaders), "Admin CSP must preserve the pinned Decap bundle");
assert(/\/admin\*[\s\S]*script-src[^\n]*'unsafe-eval'[^\n]*https:\/\/unpkg\.com/.test(staticHeaders), "Admin CSP must retain Decap's narrowly scoped runtime-evaluation requirement");
assert(/\/_next\/static\/\*[\s\S]*max-age=31536000, immutable/.test(staticHeaders), "Hashed framework assets need immutable caching");
assert(/alternates:\s*null/.test(notFound), "404 metadata must not inherit the homepage canonical");
assert(/openGraph:\s*null/.test(notFound), "404 metadata must not inherit homepage Open Graph metadata");
assert(/index:\s*false/.test(notFound), "404 metadata must remain noindex");

const topicCaseGroups = new Map();
for (const article of articles) {
  for (const topic of article.tags) {
    const key = topic.toLocaleLowerCase("en");
    const labels = topicCaseGroups.get(key) ?? new Set();
    labels.add(topic);
    topicCaseGroups.set(key, labels);
  }
}
for (const [topic, labels] of topicCaseGroups) {
  assert.equal(labels.size, 1, `Topic casing differs for ${topic}: ${[...labels].join(", ")}`);
}

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

console.log("Validated navigation, Science visibility, protected contact route, sitemap freshness rules, and robots output contracts.");
