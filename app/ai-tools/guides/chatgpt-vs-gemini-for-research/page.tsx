import type { Metadata } from "next";
import Link from "@/components/app-link";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, CircleHelp, GitCompareArrows } from "lucide-react";
import { AiComparisonEvaluation } from "@/components/ai-comparison-evaluation";
import { AiToolsRelatedComparisons } from "@/components/ai-tools-related-comparisons";
import type { EvaluationTask } from "@/lib/ai-tools-evaluation";
import { CHATGPT_GEMINI_RESEARCH_GUIDE } from "@/lib/ai-tools-research-guides";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "../../ai-tools.css";

/**
 * Source-led editorial analysis of documented workflow differences, not an
 * independently executed head-to-head performance benchmark. Kept entirely
 * within /ai-tools; the general editorial news promotion remains unchanged.
 */
const { slug, title: TITLE, subtitle: SUBTITLE, reviewedOn: REVIEWED_ON } = CHATGPT_GEMINI_RESEARCH_GUIDE;
const PAGE_URL = "/ai-tools/guides/" + slug;

export const metadata: Metadata = {
  title: TITLE,
  description: SUBTITLE,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "article",
    title: TITLE,
    description: SUBTITLE,
    url: PAGE_URL,
    publishedTime: REVIEWED_ON,
    modifiedTime: REVIEWED_ON,
  },
  twitter: { card: "summary", title: TITLE + " | " + SITE_NAME, description: SUBTITLE },
};

const comparisons = [
  {
    factor: "Fast public-web questions",
    chatgpt: "ChatGPT Search can surface web results and source links. Search answers still need source-date and claim checks.",
    gemini: "Gemini draws on Google Search within its research workflow; the default Deep Research source selection includes Search.",
    impact: "For a short question, test normal search first. Do not assume a long report is more accurate just because it is longer.",
  },
  {
    factor: "Multi-source research reports",
    chatgpt: "Deep research can plan multi-step work, investigate web and uploaded sources, and deliver a cited report with a source list.",
    gemini: "Deep Research creates a research plan and report; users can choose Google Search, files, and eligible connected sources.",
    impact: "Compare the research plan, evidence trail and effort required to correct unsupported claims—not report length alone.",
  },
  {
    factor: "Your own documents",
    chatgpt: "Uploaded files can support research; Projects keeps related chats, files and instructions together for repeated work.",
    gemini: "Gemini Apps supports attachments and file analysis, with access to Drive files and notebooks subject to settings.",
    impact: "Verify exactly which file version each response used and whether figures or footnotes were omitted.",
  },
  {
    factor: "Connected services",
    chatgpt: "Deep research can use supported connected apps when available to the account, workspace and authorization.",
    gemini: "Gmail and Drive can be used as Deep Research sources when the Google Workspace connection is available and enabled.",
    impact: "Access depends on your real account and permissions. Neither company has universal or exclusive access to Google files.",
  },
  {
    factor: "Repeated work and continuity",
    chatgpt: "Projects supports persistent project files, chats and custom instructions; tool availability is plan-dependent.",
    gemini: "Gemini supports continuing conversations, files and research reports, with history and app features controlled by settings.",
    impact: "Try the actual handoff: can you return next week, locate your materials and verify which version was used?",
  },
  {
    factor: "Privacy and governance",
    chatgpt: "Privacy, training choices, retention and connected-app permissions depend on account and workspace configuration.",
    gemini: "Gemini Privacy Hub describes history, connected apps, data use, retention and controls with product-specific caveats.",
    impact: "Use fictional samples first; review both privacy notices, workspace admin policies and sharing controls before client uploads.",
  },
] as const;

const scenarios = [
  {
    title: "You need a sourced update on a changing policy",
    start: "Trial ChatGPT Search and Gemini with an identical source checklist",
    why: "Both can retrieve public information. The useful distinction is whether you can trace dates, the official issuing body and changes between two versions—not which creates the most confident summary.",
    verify: "Check the publisher URL, publication date, effective date, jurisdiction, and any published correction. Reopen the original page in both cases.",
  },
  {
    title: "You need a research report comparing ten public documents",
    start: "Compare Deep Research planning and traceability in both products",
    why: "Both document research-plan and cited-report workflows. Ask each to identify its scope before beginning; record any unavailable sources or limits that alter the result.",
    verify: "Save the research plan, chosen sources and missing-source notes. Confirm each key claim in its original document; track the number of corrections.",
  },
  {
    title: "Your team returns to the same project files each week",
    start: "Trial ChatGPT Projects alongside the equivalent Gemini file workflow",
    why: "ChatGPT specifically documents Projects with files, instructions and shared context. Gemini can use uploaded and connected materials, but continuity and sharing must be checked in the user's account.",
    verify: "Create fictional files with version labels, update one file after the first run, and check whether the second answer identifies the correct revision. Check permissions before sharing.",
  },
  {
    title: "Research includes private client data in Drive or connected apps",
    start: "Audit access controls before either product",
    why: "Both describe ways to access connected sources, but provider authorization does not remove your employer's confidentiality obligations. Available connectors and data policies differ by account.",
    verify: "Use fabricated or redacted inputs, test least-privilege access, and review specific retention, training, feedback and administrator settings.",
  },
] as const;

const insights = [
  {
    heading: "Start with the evidence boundary",
    paragraphs: [
      "A useful research brief states whether you need live public information, an answer confined to supplied documents, or a comparison of both. If you give either assistant a vague question, you may receive a plausible narrative that mixes evidence from different dates. List what is in scope: countries, exact periods, document versions and source priorities.",
      "OpenAI describes selecting web, uploaded files and eligible connected sources in Deep Research. Google documents Google Search as a default source in Gemini Deep Research, with optional files and eligible connected Workspace services. These descriptions establish feature availability, not measured accuracy or equal access on every account.",
    ],
  },
  {
    heading: "A citation should answer a concrete question",
    paragraphs: [
      "For every claim that could alter a business or study decision, ask: does the source literally support this statement? Was the cited paragraph written before or after the event? Does a footnote narrow the population, date or region? Are two quoted figures calculated from the same denominator? Record contradictions instead of smoothing them away.",
      "An AI report that links five pages but cites the wrong one for its key assertion is less useful than a shorter answer with traceable evidence. Both providers warn users to verify model outputs. A source link is not a guarantee that the underlying reasoning is sound.",
    ],
  },
  {
    heading: "Do not confuse connected access with permission to upload",
    paragraphs: [
      "A file may be available in Drive or a shared folder without being suitable for an external AI research workflow. Before enabling a connector, check your organization's policy, the account's approved data processing terms and access scopes. A subscription label by itself says little about where your confidential material will go.",
      "If you cannot verify those rules, create a fictional sample. It is enough to test whether the tool follows conflicting revisions, respects source boundaries and cites a paragraph correctly. The worksheet below deliberately uses invented organizations and numbers so readers need not disclose real data.",
    ],
  },
  {
    heading: "Use a fair test that admits product differences",
    paragraphs: [
      "Make each experiment repeatable. Record the exact prompt, date, account plan, source attachments, research mode and time budget. For a document test, use the same fictional source text in both; if one service requires a different import method or exposes a different model, note the difference rather than declaring conditions identical.",
      "Start with the same three assignments below. Compare whether each answer meets explicit checks and how many corrections you must make. No results have been run or supplied by DECODISTA, so this page publishes neither a score nor a winning assistant.",
    ],
  },
] as const;

const questions = [
  {
    question: "Is ChatGPT universally better than Gemini for research?",
    answer: "No defensible conclusion follows from feature lists. This article is a documented workflow comparison, not an independently run accuracy benchmark. Test both using your actual source types and quality criteria.",
  },
  {
    question: "Can both use files and public web sources?",
    answer: "Both describe file and web research capabilities. Exact combinations, plan quotas and connected services can vary by country, account and workspace policy.",
  },
  {
    question: "Does Gemini automatically see everything in my Google Drive?",
    answer: "No universal access should be assumed. Google documents connecting Workspace, access conditions and administrator permissions; review what is enabled for your account.",
  },
  {
    question: "Is a Deep Research report fact-checked automatically?",
    answer: "A report may contain references, but important claims still require human review against primary sources, dates and original data. This guide does not treat citations as proof of correctness.",
  },
] as const;

const sources = [
  {
    label: "OpenAI Help: Deep research in ChatGPT",
    url: "https://help.openai.com/en/articles/10500283-deep-research-in-chatgpt",
    supports: "Research plans, sources, citations, downloads and connected-app access",
  },
  {
    label: "OpenAI Help: Projects in ChatGPT",
    url: "https://help.openai.com/en/articles/10169521-projects-in-chatgpt",
    supports: "Persistent project files, instructions, sharing and project limitations",
  },
  {
    label: "OpenAI Help: Searching the web with ChatGPT",
    url: "https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt",
    supports: "Search sources and warnings about incomplete or incorrect citations",
  },
  {
    label: "OpenAI Help: ChatGPT capabilities overview",
    url: "https://help.openai.com/en/articles/9260256-chatgpt-capabilities-overview",
    supports: "File and research surfaces and plan-dependent capabilities",
  },
  {
    label: "Google Help: Use Deep Research in Gemini Apps",
    url: "https://support.google.com/gemini/answer/15719111?hl=en",
    supports: "Google Search defaults, optional files, Workspace sources and planning",
  },
  {
    label: "Google Help: Attach and analyze files in Gemini Apps",
    url: "https://support.google.com/gemini/answer/14903178?hl=en",
    supports: "File attachments, supported access and Workspace permissions",
  },
  {
    label: "Google Help: Gemini Apps Privacy Hub",
    url: "https://support.google.com/gemini/answer/13594961?hl=en",
    supports: "History, data retention, connected apps and privacy controls",
  },
] as const;

const trials: readonly EvaluationTask[] = [
  {
    id: "conflicting-research-versions",
    title: "01 / Reconcile two fictional document revisions",
    aim: "Check citation discipline when a newer version contradicts an older one.",
    prompt: "FICTIONAL SOURCES ONLY — no web browsing.\n\nDOC A, 4 May 2027: The Alder Museum pilot recorded 240 bookings and 192 visits in April. Its June budget is not published.\nDOC B, corrected 7 May 2027: The same April pilot recorded 238 bookings and 191 visits after deduplication. No June budget was published.\n\nTASK: Produce a 100–140 word neutral briefing. Label every numeric claim with the relevant DOC source and date. Explain which version should be used for current April totals and why; show what the change was in absolute counts. State what cannot be concluded about June cost. Do not calculate a visitor conversion rate or invent information. Include any uncertainty.",
    checklist: [
      "Explains DOC B is the later corrected April count, without erasing DOC A.",
      "Correctly reports a reduction of 2 bookings and 1 visit from the original.",
      "No June budget invented and no unsupported conversion-rate claim.",
      "Numerical facts refer to the matching source/date, not fabricated web citations.",
    ],
  },
  {
    id: "research-plan-scope",
    title: "02 / Plan without pretending to browse",
    aim: "Assess source-selection, evidence provenance and research planning.",
    prompt: "You are preparing to verify a FICTIONAL 2027 announcement about a public library's revised opening hours. You have NOT visited any website.\n\nTASK: Write exactly six numbered verification steps. Specify an official library or municipal source, publication vs effective dates, a second independent source, whether weekends are included, how to capture screenshots/URLs and how to label a missing fact. Separate the proposed search plan from any completed research. Do not invent URLs or state that the announcement is true.",
    checklist: [
      "Exactly six practical steps, naming authoritative and corroborating sources.",
      "Separates effective date from date the announcement was posted.",
      "Distinguishes future research plan from results and never claims web browsing occurred.",
      "Mentions unknown weekend details and records source URLs when actually checked.",
    ],
  },
  {
    id: "file-boundary-check",
    title: "03 / Answer only from a supplied policy fragment",
    aim: "Test missing-information handling and refusal to assume permissions.",
    prompt: "FICTIONAL POLICY SOURCE (no other source is available): 'At Maple Cooperative, staff may view the sample demo folder. Only editors may change the folder contents. Access for external contractors is not described. The folder contains no client files.'\n\nTASK: Answer four questions in a compact table: (1) Can staff view? (2) Can staff edit? (3) Can editors edit? (4) Can external contractors view? Quote the supporting words for every known answer; answer 'not stated' for any unknown permission. Do not assume that access to the folder permits uploading it to an AI service.",
    checklist: [
      "Staff may view; staff editing is not authorized by the provided text.",
      "Editors may change contents; external contractor permissions are not stated.",
      "Every definite answer is grounded in the quoted fictional source.",
      "Explicitly avoids inferring permission to upload to third-party tools.",
    ],
  },
];

export default function ChatgptGeminiResearchGuide() {
  const structured = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "AI Tools", item: SITE_URL + "/ai-tools" },
        { "@type": "ListItem", position: 3, name: "Comparison Guides", item: SITE_URL + "/ai-tools/guides" },
        { "@type": "ListItem", position: 4, name: TITLE, item: SITE_URL + PAGE_URL },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: TITLE,
      description: SUBTITLE,
      datePublished: REVIEWED_ON,
      dateModified: REVIEWED_ON,
      mainEntityOfPage: SITE_URL + PAGE_URL,
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    },
  ];
  return (
    <main id="main-content" className="ai-tools-page ai-guide-page">
      {structured.map((entry, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }} />
      ))}
      <header className="ai-guide-hero wrap">
        <Link className="ai-tools-back" href="/ai-tools/guides"><ArrowLeft size={17} aria-hidden="true" /> AI Tools Comparison Guides</Link>
        <span className="ai-tools-eyebrow">DECODISTA / RESEARCH DECISION GUIDE</span>
        <h1>{TITLE}</h1>
        <p className="ai-guide-subtitle">{SUBTITLE}</p>
        <div className="ai-guide-byline">
          <span>DECODISTA Documentation Research</span><span aria-hidden="true">·</span>
          <span>Official sources checked <time dateTime={REVIEWED_ON}>22 November 2026</time></span>
          <span aria-hidden="true">·</span><span>No hands-on benchmark claimed</span>
        </div>
        <div className="ai-guide-hero-actions">
          <Link href="/ai-tools/compare?first=chatgpt&second=gemini">
            <GitCompareArrows size={17} aria-hidden="true" /> Interactive comparison
          </Link>
          <a href="#test-it-yourself"><BookOpen size={17} aria-hidden="true" /> Run your own three tests</a>
        </div>
      </header>

      <div className="ai-guide-layout wrap">
        <article className="ai-guide-article">
          <section className="ai-guide-intro" aria-label="Comparison overview">
            <p>Choosing between ChatGPT and Gemini for research is not just a question about which model writes a better summary. A serious workflow has inputs, permissions, source versions, evidence requirements and a deliverable that another person must be able to verify. Both providers document web research and files; both may work across connected sources when account permissions allow. The best starting point depends on how your work is organized.</p>
            <p>We reviewed official OpenAI and Google documentation and developed an original decision framework for these choices. We did not run side-by-side model tests, measure output correctness or subscribe to both products for this article. The reader-run tests below deliberately use fictional materials and begin with blank ratings; they cannot stand in for an independent published benchmark.</p>
          </section>

          <section id="key-differences" className="ai-guide-section" aria-labelledby="chatgpt-gemini-factors">
            <span className="ai-tools-eyebrow">01 / Key research differences</span>
            <h2 id="chatgpt-gemini-factors">Six questions to ask before choosing</h2>
            <p>These are source-checked product capabilities and practical decision points, not accuracy rankings or promises of access on every plan.</p>
            <div className="ai-tools-table-scroll" role="region" aria-label="ChatGPT and Gemini research comparison" tabIndex={0}>
              <table className="ai-tools-compare-table ai-guide-table">
                <caption className="sr-only">Research workflow differences between ChatGPT and Gemini</caption>
                <thead>
                  <tr><th scope="col">Decision factor</th><th scope="col">ChatGPT</th><th scope="col">Gemini</th><th scope="col">What to verify</th></tr>
                </thead>
                <tbody>{comparisons.map((item) => (
                  <tr key={item.factor}>
                    <th scope="row">{item.factor}</th><td>{item.chatgpt}</td><td>{item.gemini}</td><td>{item.impact}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </section>

          <section id="who-should-try-what" className="ai-guide-section" aria-labelledby="chatgpt-gemini-scenarios">
            <span className="ai-tools-eyebrow">02 / Decision scenarios</span>
            <h2 id="chatgpt-gemini-scenarios">Four situations worth testing for yourself</h2>
            <p>Start with the workflow that matches your evidence and document boundaries. Every recommendation has a verification step.</p>
            <div className="ai-guide-scenarios">{scenarios.map((scenario, i) => (
              <div className="ai-guide-scenario" key={scenario.title}>
                <span className="ai-guide-scenario-number">{String(i + 1).padStart(2, "0")}</span>
                <div><h3>{scenario.title}</h3><strong>{scenario.start}</strong>
                  <p>{scenario.why}</p><p className="ai-guide-check"><b>What to verify:</b> {scenario.verify}</p>
                </div>
              </div>
            ))}</div>
          </section>

          <section id="analysis" className="ai-guide-section" aria-labelledby="chatgpt-gemini-analysis">
            <span className="ai-tools-eyebrow">03 / Research methodology</span>
            <h2 id="chatgpt-gemini-analysis">A decision you can defend with evidence</h2>
            {insights.map((item) => (
              <div key={item.heading} className="ai-guide-insight">
                <h3>{item.heading}</h3>{item.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            ))}
          </section>

          <section id="verdict" className="ai-guide-section" aria-labelledby="chatgpt-gemini-verdict">
            <span className="ai-tools-eyebrow">04 / Practical conclusion</span>
            <h2 id="chatgpt-gemini-verdict">Decide by evidence and daily workflow—not a universal winner</h2>
            <p>If you manage ongoing work with many related conversations and source files, evaluate ChatGPT Projects in the same trial as research tools. If your work is strongly oriented around Google services, verify whether Gemini can actually access the relevant sources under your account permissions. Both tools offer broader research features and neither should be chosen solely on a marketing feature grid. Run controlled sample tasks, inspect citations and check privacy restrictions before making a purchase.</p>
            <div className="ai-guide-primary-links">
              <Link href="/ai-tools/chatgpt">ChatGPT tool profile <ArrowRight size={16} aria-hidden="true" /></Link>
              <Link href="/ai-tools/gemini">Gemini tool profile <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          </section>

          <section id="questions" className="ai-guide-section" aria-labelledby="chatgpt-gemini-questions">
            <span className="ai-tools-eyebrow">05 / Important questions</span>
            <h2 id="chatgpt-gemini-questions">Before you commit to a plan</h2>
            <div className="ai-guide-faq-list">{questions.map((item) => (
              <div key={item.question}><h3><CircleHelp size={19} aria-hidden="true" /> {item.question}</h3><p>{item.answer}</p></div>
            ))}</div>
          </section>

          <section id="sources" className="ai-guide-section ai-guide-sources" aria-labelledby="chatgpt-gemini-sources">
            <span className="ai-tools-eyebrow">06 / Evidence ledger</span>
            <h2 id="chatgpt-gemini-sources">Seven official sources, with scope stated</h2>
            <p>Last source check: <time dateTime={REVIEWED_ON}>22 November 2026</time>. Provider features, plans, model names, permissions and retention rules can change. Visit the linked help pages for current details.</p>
            <ol>{sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.label} <ArrowUpRight size={16} aria-hidden="true" />
                </a>
                <span>{source.supports}</span>
              </li>
            ))}</ol>
            <p className="ai-guide-disclosure"><strong>Methodology and limitations:</strong> This guide contains documentation-based editorial synthesis and three original fictional exercises. No model output was collected, no hands-on benchmarking was performed, no sponsored ranking is offered, and no winner is implied. Verify your account terms, source claims and personal data settings independently.</p>
          </section>

          <div className="ai-guide-insight">
            <h3>Prepare a fair reader test</h3>
            <p>Use the fictional source fragments in the exact prompts below. If you choose to upload them as separate files, use the same content and record the upload method in both tools. If you instead paste the prompt into an ordinary chat, record that condition as well. Run the same task in matching research modes when available; do not interpret different quotas or missing connector access as a model-quality failure.</p>
            <p>Leave all ratings blank until you have checked real output against each task checklist. The worksheet saves nothing to DECODISTA or a remote account. A downloaded CSV is the reader&apos;s own record, not a published review or validated independent benchmark.</p>
          </div>

          <AiComparisonEvaluation
            guideSlug="chatgpt-vs-gemini-for-research"
            firstName="ChatGPT"
            secondName="Gemini"
            tasks={trials}
          />
        </article>
        <aside className="ai-guide-aside" aria-label="Guide navigation">
          <nav className="ai-guide-toc" aria-label="In this guide">
            <strong>IN THIS GUIDE</strong>
            <a href="#key-differences">Key differences</a>
            <a href="#who-should-try-what">Research scenarios</a>
            <a href="#analysis">Evidence method</a>
            <a href="#verdict">Practical decision</a>
            <a href="#questions">Common questions</a>
            <a href="#sources">Sources and disclosure</a>
            <a href="#test-it-yourself">Run your own test</a>
          </nav>
          <div className="ai-guide-side-links">
            <span className="ai-tools-eyebrow">Continue with AI Tools</span>
            <Link href="/ai-tools/compare?first=chatgpt&second=gemini">Open interactive comparison <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link href="/ai-tools/guides">All AI comparison guides <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </aside>
      </div>
      <AiToolsRelatedComparisons currentSlug="chatgpt-vs-gemini-for-research" />
    </main>
  );
}
