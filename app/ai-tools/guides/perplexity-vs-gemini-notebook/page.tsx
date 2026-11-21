import type { Metadata } from "next";
import Link from "@/components/app-link";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, CircleHelp, GitCompareArrows } from "lucide-react";
import { AiComparisonEvaluation } from "@/components/ai-comparison-evaluation";
import type { EvaluationTask } from "@/lib/ai-tools-evaluation";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "../../ai-tools.css";

/**
 * Standalone, isolated editorial candidate. Do not add to AI_COMPARISON_GUIDES
 * or sitemap yet: that collection would also surface this candidate on the
 * general homepage and /ai news category, beyond the AI Tools-only scope.
 *
 * Source check date is specific to THIS guide and must not rewrite historical
 * dates on the two already-published editorial guides.
 */
const REVIEWED_ON = "2026-11-22";
const PAGE_URL = "/ai-tools/guides/perplexity-vs-gemini-notebook";
const TITLE = "Perplexity vs Gemini Notebook: Research the web or your sources?";
const SUBTITLE = "A practical, evidence-led decision guide for comparing public web research, curated documents, citations and privacy constraints. Gemini Notebook was formerly called NotebookLM.";

export const metadata: Metadata = {
  title: TITLE,
  description: SUBTITLE,
  alternates: { canonical: PAGE_URL },
  // Editorial candidate only. Indexing and sitemap require an explicit
  // separate quality decision after independent review and preview QA.
  robots: { index: false, follow: true },
  openGraph: {
    type: "article",
    title: TITLE,
    description: SUBTITLE,
    url: PAGE_URL,
  },
  twitter: { card: "summary", title: TITLE + " | " + SITE_NAME, description: SUBTITLE },
};

const comparisons = [
  {
    factor: "Starting material",
    perplexity: "Search is oriented toward locating and synthesising public information, with links to relevant pages.",
    notebook: "Notebooks are built around selected sources such as documents, PDFs, links, slides and audio.",
    decision: "Choose based on what you need to verify: discover outside evidence, or interrogate a defined source collection.",
  },
  {
    factor: "Web research",
    perplexity: "Search can run several web queries and bring together citations; depth and limits depend on mode and plan.",
    notebook: "Source discovery can search the web or Drive and import supported results to the notebook.",
    decision: "Neither service is simply 'web only' or 'offline only'. Check the actual source-selection workflow.",
  },
  {
    factor: "Working with files",
    perplexity: "Spaces and file attachments can support document-based research, subject to account access.",
    notebook: "Uploaded or linked sources supply the context for source-grounded chat and other study formats.",
    decision: "For document questions, test what was imported, whether a source is accessible, and how citations point back.",
  },
  {
    factor: "Checking a claim",
    perplexity: "Answers may cite external pages. You still need to open the page, check its date and confirm the claim in context.",
    notebook: "Inline citations help locate passages in selected source material; imported web pages may omit visual or embedded content.",
    decision: "A citation is a lead to evidence, not independent proof. Check the original source in either case.",
  },
  {
    factor: "Access and privacy",
    perplexity: "Search, Spaces, model choices and file access vary by plan and workspace settings.",
    notebook: "Sharing, Workspace administration and data-handling notices vary by account type and feature.",
    decision: "For sensitive files, check the precise account policy, permissions and data settings before uploading anything.",
  },
] as const;

const scenarios = [
  {
    title: "A public claim may have changed this week",
    start: "Begin with Perplexity Search; confirm with the publisher",
    why: "Search is built to help locate multiple public references. But speed or a cited excerpt cannot establish that a page is authoritative or up to date.",
    verify: "Open a primary authority and one independent corroborating source. Record exact publication and event dates. Check for updates or corrections.",
  },
  {
    title: "You have three project PDFs with conflicting figures",
    start: "Begin with a Gemini Notebook source collection",
    why: "A bounded notebook can help you ask targeted questions about specific files and inspect where a cited statement came from.",
    verify: "Confirm all three PDFs imported correctly. Check page-level original passages and name the disagreement rather than averaging incompatible numbers.",
  },
  {
    title: "Your policy documents disagree with a new public rule",
    start: "Use both as complementary steps, not a winner-takes-all contest",
    why: "A source notebook helps examine what your internal files say. Public search helps locate the current official external rule. One does not substitute for the other.",
    verify: "Compare dates, jurisdictions and definitions before writing a gap analysis. Ask a responsible reviewer to approve consequential conclusions.",
  },
  {
    title: "A client document contains confidential information",
    start: "Check permissions and provider terms before either upload",
    why: "Both products have file-related workflows. Their actual data handling depends on account, plan, access controls and feedback or sharing settings.",
    verify: "Use redacted or fictional documents for testing. Confirm applicable enterprise agreements, administrator settings and retention/feedback policies first.",
  },
] as const;

const insights = [
  {
    title: "The real difference is the boundary around evidence",
    paragraphs: [
      "A search-led question asks the system to find material beyond what you already know. A notebook-led question asks you to nominate or discover a set of sources and keep the answer anchored to those materials. Perplexity also has Spaces and document work; Gemini Notebook also has web source discovery. Treat these as different starting habits rather than mutually exclusive product capabilities.",
      "For a public, changing claim, record the publisher, when the page was updated and the date of the event you are researching. For a private document set, make an inventory of the exact versions imported. A plausible answer that cites the wrong edition is still wrong.",
    ],
  },
  {
    title: "Citations are a verification workflow, not a quality score",
    paragraphs: [
      "When a claim seems important, open its cited page or file. Read the sentence before and after the highlighted passage. Ask whether the text supports the exact strength of the claim, whether a table footnote changes its meaning, and whether another relevant source contradicts it.",
      "Google's help documentation notes that web-URL import primarily brings in webpage text; images, embedded videos and nested pages are not imported. This matters for charts and diagrams. Perplexity's own Pro Search guidance likewise tells people to open cited sources rather than accept summaries uncritically.",
    ],
  },
  {
    title: "A fair comparison requires different preparation for each tool",
    paragraphs: [
      "Give both tools the same non-sensitive task and target evidence. But record where the source came from: public search results in one case, and a deliberate source import or discovery step in the other. Do not hide setup time, missing uploads, search limits or a source that one account cannot access.",
      "Score the final deliverable only after looking at original sources. Measure corrections, unsupported assertions, conflicting-source handling and ease of tracing a claim. Do not compare presentation polish or a provider's marketing list as if it were an independent benchmark.",
    ],
  },
  {
    title: "Choose the working arrangement, not an assumed subscription winner",
    paragraphs: [
      "If you spend your day finding recent public evidence, start by testing web search. If your workflow repeatedly uses the same research dossier, evaluate a dedicated notebook. If both are part of your job, trial the combined workflow before buying a second plan.",
      "Do not infer exact prices, upload entitlements, privacy guarantees or model availability from this comparison. Confirm the live account-level terms and privacy notices before you subscribe or share client material.",
    ],
  },
] as const;

const questions = [
  {
    q: "Is Gemini Notebook just the old NotebookLM?",
    a: "Google identifies Gemini Notebook as the renamed NotebookLM product. Existing features and integrations may evolve, so check current official documentation rather than assuming past limits still apply.",
  },
  {
    q: "Can Perplexity answer questions about my own files?",
    a: "Yes, its documentation describes file-based research and Spaces. Access and capabilities vary by product surface and subscription, so this is not a claim that all Perplexity accounts support the same workflow.",
  },
  {
    q: "Can Gemini Notebook search the web?",
    a: "Yes. Google's source-discovery documentation describes web and Drive searches for material to bring into notebooks. It is not correct to describe it as offline-only.",
  },
  {
    q: "Which has more accurate answers?",
    a: "This guide does not claim a measured winner. Accuracy would require controlled tests on real task outputs, with original sources and independent review; no such comparative results are published here.",
  },
] as const;

const sources = [
  {
    name: "Perplexity Help: What is Pro Search?",
    url: "https://www.perplexity.ai/help-center/en/articles/10352903-what-is-pro-search",
    purpose: "Search workflow, citation links, plan boundaries and source checking",
  },
  {
    name: "Perplexity: Student guide to Spaces",
    url: "https://www.perplexity.ai/en-GB/hub/blog/a-student-s-guide-to-using-perplexity-spaces",
    purpose: "Document-source research and web discovery within Spaces",
  },
  {
    name: "Perplexity Help: What is Perplexity Pro?",
    url: "https://www.perplexity.ai/help-center/en/articles/10352901-what-is-perplexity-pro",
    purpose: "Account-level file and advanced-search availability",
  },
  {
    name: "Google Workspace: Gemini Notebook product",
    url: "https://workspace.google.com/intl/en_in/products/gemini-notebook/",
    purpose: "Current product name, source types, research positioning and citations",
  },
  {
    name: "Gemini Notebook Help: Add or discover sources",
    url: "https://support.google.com/gemininotebook/answer/16215270?hl=en",
    purpose: "Web and Drive source discovery, supported imports and limitations",
  },
  {
    name: "Google Workspace Admin: Gemini Notebook access",
    url: "https://knowledge.workspace.google.com/admin/generative-ai/gemini-notebook/turn-gemini-notebook-on-or-off-for-users",
    purpose: "Workspace administration, source-grounded workflows and access",
  },
  {
    name: "Gemini Notebook Help: Privacy and Terms of Use",
    url: "https://support.google.com/gemininotebook/answer/17004255?hl=en",
    purpose: "Account-type and feedback-related data handling caveats",
  },
] as const;

const trials: readonly EvaluationTask[] = [
  {
    id: "fictional-dossier",
    title: "01 / Explain contradictory fictional source documents",
    aim: "Test precise attribution, contradiction handling and honesty about missing facts.",
    prompt: "Use only the two FICTIONAL source documents below. Provide a neutral 110–150-word briefing with explicit source labels. Do not use outside facts.\n\nSOURCE A — Memo dated 10 April 2027: The Willow Clinic pilot enrolled 120 people. 84 completed the first session. No cost estimate was issued.\nSOURCE B — Draft memo dated 12 April 2027: The Willow Clinic pilot enrolled 118 people. 82 completed the first session. The draft calls the cost estimate 'pending'.\n\nTASK: State both enrollment and first-session figures separately, explain why the sources conflict, and say what you cannot conclude about cost. Do not invent a reconciliation. If your source/citation interface cannot cite these labels, disclose that limitation.",
    checklist: [
      "Preserves the separate 120/84 and 118/82 figures with correct source labels.",
      "Explicitly identifies the contradiction; does not invent a reconciled total.",
      "States that no cost amount is established.",
      "Distinguishes quoted input labels from any real clickable source citations.",
    ],
  },
  {
    id: "source-boundary",
    title: "02 / Refuse an unsupported update",
    aim: "Test whether an assistant respects the boundary of the provided evidence.",
    prompt: "FICTIONAL BRIEF — Dated 1 May 2027: Northfield Library will open a digital service desk on 3 June 2027, 10:00–16:00 local time. The brief says nothing about Sunday opening, staffing, fees or wheelchair access.\n\nTASK: Answer these four questions using ONLY the brief: (1) planned opening date, (2) service hours, (3) Sunday availability, (4) whether access is free. For each answer provide the exact supporting text or clearly write 'not stated'. Do not search the live web and do not invent a current status.",
    checklist: [
      "Correct date of 3 June 2027 and 10:00–16:00 local hours.",
      "Sunday availability and fees marked 'not stated'.",
      "No fabricated opening confirmation, web result or accessibility claim.",
      "Each stated answer is traceable to the fictional brief.",
    ],
  },
  {
    id: "public-source-protocol",
    title: "03 / Design a checkable public research protocol",
    aim: "Test practical source-selection instructions without assuming a tool actually browsed.",
    prompt: "You need to verify an unfamiliar public policy announcement. DO NOT assert whether any specific announcement is true. Instead write a 6-step verification plan for a non-expert. Include a primary issuer website, exact event versus publication dates, conflicting corrections, jurisdiction, source-import limitations, and a final evidence log with URLs. Explain how the plan changes when a research tool is restricted to uploaded documents. Make no claim that you have visited a website.",
    checklist: [
      "Contains six actionable steps with primary sources and URLs as evidence requirements.",
      "Separates publication date from event or effective date, and checks jurisdiction.",
      "Explains how restricted source access changes the workflow.",
      "Never claims research was conducted or sources checked during the exercise.",
    ],
  },
];

export default function PerplexityGeminiNotebookGuide() {
  const structured = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "AI Tools", item: SITE_URL + "/ai-tools" },
      { "@type": "ListItem", position: 3, name: "Comparison Guides", item: SITE_URL + "/ai-tools/guides" },
      { "@type": "ListItem", position: 4, name: TITLE, item: SITE_URL + PAGE_URL },
    ],
  };
  return (
    <main id="main-content" className="ai-tools-page ai-guide-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }} />
      <header className="ai-guide-hero wrap">
        <Link className="ai-tools-back" href="/ai-tools"><ArrowLeft size={17} aria-hidden="true" /> AI Tools</Link>
        <span className="ai-tools-eyebrow">DECODISTA / AI TOOLS DECISION GUIDE</span>
        <h1>{TITLE}</h1>
        <p className="ai-guide-subtitle">{SUBTITLE}</p>
        <div className="ai-guide-byline">
          <span>DECODISTA Documentation Research</span>
          <span aria-hidden="true">·</span>
          <span>Official sources checked <time dateTime={REVIEWED_ON}>22 November 2026</time></span>
          <span aria-hidden="true">·</span>
          <span>Provider documentation, not hands-on testing</span>
        </div>
        <div className="ai-guide-hero-actions">
          <Link href="/ai-tools/compare?first=perplexity&second=notebooklm"><GitCompareArrows size={17} aria-hidden="true" /> Interactive comparison</Link>
          <a href="#test-it-yourself"><BookOpen size={17} aria-hidden="true" /> Try three controlled tests</a>
        </div>
      </header>

      <div className="ai-guide-layout wrap">
        <article className="ai-guide-article">
          <section className="ai-guide-intro">
            <p>Which research assistant should you open first? It depends less on brand than on the evidence you need. Sometimes you must discover what reliable public sources exist. Sometimes you already have a bounded set of reports and need an answer that stays faithful to those documents. Both Perplexity and Google&apos;s Gemini Notebook can work across web information and files, but they invite different approaches to collecting, controlling and checking evidence.</p>
            <p>Perplexity&apos;s own documentation describes search that explores external sources and links to them, as well as document workflows in Spaces. Google&apos;s documentation describes source collections that can include PDFs, Docs, websites and newly discovered web material. We reviewed those official descriptions, not the products&apos; accuracy under controlled laboratory conditions. No provider outputs, speed measurements or independent rankings are claimed here.</p>
          </section>

          <section id="key-differences" className="ai-guide-section" aria-labelledby="research-guide-table">
            <span className="ai-tools-eyebrow">01 / What changes your research process</span>
            <h2 id="research-guide-table">Five decisions that matter more than a winner badge</h2>
            <p>The table distinguishes starting workflows and verification costs, not universal capabilities or model-quality scores.</p>
            <div className="ai-tools-table-scroll" role="region" aria-label="Perplexity and Gemini Notebook comparison" tabIndex={0}>
              <table className="ai-tools-compare-table ai-guide-table">
                <thead><tr><th scope="col">Decision factor</th><th scope="col">Perplexity</th><th scope="col">Gemini Notebook</th><th scope="col">Practical consequence</th></tr></thead>
                <tbody>{comparisons.map((c) => (
                  <tr key={c.factor}><th scope="row">{c.factor}</th><td>{c.perplexity}</td><td>{c.notebook}</td><td>{c.decision}</td></tr>
                ))}</tbody>
              </table>
            </div>
          </section>

          <section id="who-should-try-what" className="ai-guide-section" aria-labelledby="research-guide-scenarios">
            <span className="ai-tools-eyebrow">02 / Realistic research decisions</span>
            <h2 id="research-guide-scenarios">Four situations: what to try, and what to verify</h2>
            <div className="ai-guide-scenarios">{scenarios.map((s, i) => (
              <div key={s.title} className="ai-guide-scenario">
                <span className="ai-guide-scenario-number">{String(i+1).padStart(2, "0")}</span>
                <div>
                  <h3>{s.title}</h3><strong>{s.start}</strong>
                  <p>{s.why}</p><p className="ai-guide-check"><b>What to verify:</b> {s.verify}</p>
                </div>
              </div>
            ))}</div>
          </section>

          <section id="analysis" className="ai-guide-section" aria-labelledby="research-guide-analysis">
            <span className="ai-tools-eyebrow">03 / Editorial analysis</span>
            <h2 id="research-guide-analysis">How to make a defensible choice</h2>
            {insights.map((part) => <div className="ai-guide-insight" key={part.title}>
              <h3>{part.title}</h3>{part.paragraphs.map((p) => <p key={p}>{p}</p>)}
            </div>)}
          </section>

          <section id="verdict" className="ai-guide-section" aria-labelledby="research-guide-conclusion">
            <span className="ai-tools-eyebrow">04 / Practical takeaway</span>
            <h2 id="research-guide-conclusion">Start with the evidence you need to control</h2>
            <p>Choose a search-first workflow when you need to discover current, authoritative public evidence; choose a source-collection-first workflow when the main task is to interrogate a stable dossier. Both services can cross that boundary. A test should establish how reliably your actual account handles sources, changes and citations, not assume that a product category guarantees a result. For confidential information, review account-specific permissions and data terms before either upload.</p>
            <div className="ai-guide-primary-links">
              <Link href="/ai-tools/perplexity">Perplexity overview <ArrowRight size={16} aria-hidden="true" /></Link>
              <Link href="/ai-tools/notebooklm">Gemini Notebook overview <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          </section>

          <section id="questions" className="ai-guide-section" aria-labelledby="research-guide-faq">
            <span className="ai-tools-eyebrow">05 / Questions before you choose</span>
            <h2 id="research-guide-faq">What readers commonly confuse</h2>
            <div className="ai-guide-faq-list">{questions.map((item) => (
              <div key={item.q}><h3><CircleHelp size={19} aria-hidden="true" /> {item.q}</h3><p>{item.a}</p></div>
            ))}</div>
          </section>

          <section id="sources" className="ai-guide-section ai-guide-sources" aria-labelledby="research-guide-sources">
            <span className="ai-tools-eyebrow">06 / Evidence ledger</span>
            <h2 id="research-guide-sources">Primary documentation we checked</h2>
            <p>Reviewed <time dateTime={REVIEWED_ON}>22 November 2026</time>. Sources reflect provider descriptions at review time; feature gates and terms can change. Links are provided for your independent verification.</p>
            <ol>{sources.map((s) => <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">{s.name} <ArrowUpRight size={16} aria-hidden="true" /></a>
              <span>{s.purpose}</span>
            </li>)}</ol>
            <p className="ai-guide-disclosure"><strong>Methodology:</strong> Original research synthesis using seven provider-owned documentation pages. No firsthand use of either account, model output, independently measured accuracy, sponsored placement or universal performance verdict. The blank worksheet below is for reader-run tests only.</p>
          </section>

          <AiComparisonEvaluation
            guideSlug="perplexity-vs-gemini-notebook"
            firstName="Perplexity"
            secondName="Gemini Notebook"
            tasks={trials}
          />
        </article>
        <aside className="ai-guide-aside" aria-label="Guide navigation">
          <nav className="ai-guide-toc" aria-label="On this guide">
            <strong>IN THIS GUIDE</strong>
            <a href="#key-differences">Key differences</a>
            <a href="#who-should-try-what">Choose by use case</a>
            <a href="#analysis">Editorial analysis</a>
            <a href="#verdict">Practical takeaway</a>
            <a href="#questions">Common questions</a>
            <a href="#sources">Sources</a>
            <a href="#test-it-yourself">Run your test</a>
          </nav>
          <div className="ai-guide-side-links">
            <span className="ai-tools-eyebrow">Keep exploring AI tools</span>
            <Link href="/ai-tools/compare?first=perplexity&second=notebooklm">Compare products <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link href="/ai-tools">AI Tools directory <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
