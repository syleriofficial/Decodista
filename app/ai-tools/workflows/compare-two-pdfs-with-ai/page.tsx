import type { Metadata } from "next";
import Link from "@/components/app-link";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Download, FileDiff, ShieldCheck } from "lucide-react";
import { COMPARE_TWO_PDFS_WORKFLOW } from "@/lib/ai-tools-workflows";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "../../ai-tools.css";

/**
 * Original, source-led AI Tools workflow. Demonstration differences were
 * manually derived from our two invented sample notices, not produced by an
 * unrun AI benchmark. No personal/private file upload happens on this site.
 */
const { slug, title: TITLE, description: DESCRIPTION, reviewedOn: REVIEWED_ON } = COMPARE_TWO_PDFS_WORKFLOW;
const PAGE_URL = "/ai-tools/workflows/" + slug;

export const metadata: Metadata = {
  title: "Compare Two PDFs with AI: Find Changes and Check Evidence",
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    publishedTime: REVIEWED_ON,
    modifiedTime: REVIEWED_ON,
  },
  twitter: { card: "summary", title: TITLE + " | " + SITE_NAME, description: DESCRIPTION },
};

const fileLinks = [
  {
    label: "SAMPLE A — Original notice",
    path: "/ai-tools/samples/library-hours-notice-v1.txt",
    note: "Issued 1 October 2026 · Fictional source text",
  },
  {
    label: "SAMPLE B — Revised notice",
    path: "/ai-tools/samples/library-hours-notice-v2.txt",
    note: "Issued 15 October 2026 · Fictional replacement text",
  },
] as const;

const steps = [
  {
    title: "Define the question, not just “summarize both PDFs”",
    body: "Ask which provisions, prices, hours or deadlines changed; what is identical; and what is missing from either document. Record which file is authoritative and the effective date. An issue date is not necessarily an effective date.",
    check: "Write down the filenames, revision labels, dates, and a decision that the comparison will support.",
  },
  {
    title: "Prepare readable, authorized source files",
    body: "Use PDFs you own or have permission to process. Remove identifying client data where you can. Check whether the PDFs contain selectable text, pages of scans, screenshots, footnotes or multi-column tables. If OCR is needed, validate extracted names and figures against the image before comparing.",
    check: "Inspect page count, tables, text extraction, and any confidential or contractual restrictions before upload.",
  },
  {
    title: "Add both sources explicitly to the AI product",
    body: "In ChatGPT, attach each PDF through the file-upload control. In Claude, attach both files to a conversation. In Gemini Notebook, create or open a notebook, add each PDF as its own source and select both in the source panel. Follow the current provider documentation because account and plan restrictions differ.",
    check: "Ask the assistant to list the two filenames and their stated dates; if it cannot access one file, stop.",
  },
  {
    title: "Use a structured differences prompt",
    body: "Request a field-by-field table: exact wording from A and B, change category, direct quotation with page/section, and any unresolved conflict. Insist that unsupported claims are marked “not stated,” not guessed.",
    check: "A strong output distinguishes a real contradiction from an omission and from wording that is merely different.",
  },
  {
    title: "Inspect the original evidence for each row",
    body: "Open the cited pages in both source PDFs and verify every number, date, table heading and qualifier. Source links and page labels may be wrong, and scanning or layout errors can hide material facts. If one source lacks a page number, require a uniquely identifying quote or section title instead.",
    check: "Do not approve any row until a human can locate both pieces of text in the source documents.",
  },
  {
    title: "Resolve the latest version and escalate consequential differences",
    body: "A later bulletin may explicitly supersede the first, but the newer issue date alone is not always enough to establish which contract or regulation applies. Treat legally binding terms, financial decisions and safety claims as requiring the original authority or a qualified reviewer.",
    check: "Produce a separate list of decisions, unresolved questions, and the person who must confirm them.",
  },
] as const;

const referenceDifferences = [
  {
    field: "Effective date",
    a: "1 December 2026",
    b: "15 December 2026",
    result: "Changed: the pilot begins 14 days later.",
    evidence: "Each notice states its own “effective” date.",
  },
  {
    field: "Saturday opening",
    a: "10:00–16:00",
    b: "11:00–15:00",
    result: "Changed: the Saturday window is 2 hours shorter.",
    evidence: "Both bulletins explicitly state Saturday hours.",
  },
  {
    field: "Sunday opening",
    a: "Closed",
    b: "12:00–15:00",
    result: "Changed: the revised notice adds a 3-hour Sunday window.",
    evidence: "Check both Sunday lines; do not generalize to every week of the year.",
  },
  {
    field: "Pilot duration",
    a: "6 weeks",
    b: "8 weeks",
    result: "Changed: the stated pilot duration is 2 weeks longer.",
    evidence: "Both durations are explicitly counted from their own effective dates.",
  },
  {
    field: "Weekday hours",
    a: "Not specified",
    b: "Not specified",
    result: "Unknown: cannot conclude weekdays are unchanged.",
    evidence: "Silence in both versions is not evidence of an unchanged policy.",
  },
  {
    field: "Budget or staffing",
    a: "Not stated",
    b: "Not stated",
    result: "Unknown: no spending or staffing estimate is supported.",
    evidence: "Both notices explicitly omit budget, forecast and headcount.",
  },
] as const;

const prompt = `Compare the TWO ATTACHED DOCUMENTS as different versions of the same policy.

1. First identify each filename, issue date, revision status, and any missing or unreadable pages. If you cannot access both files, stop and say so.
2. Use ONLY the attached documents, not your general knowledge or web search.
3. Make a table with these columns:
   TOPIC | DOCUMENT A: EXACT TEXT | DOCUMENT B: EXACT TEXT | CHANGE TYPE | WHAT IT MEANS | PAGE / SECTION EVIDENCE
4. Distinguish: changed, explicitly unchanged, missing in A, missing in B, and not stated in either.
5. For dates, numbers, percentages and quoted terms, reproduce the source text before calculating a difference. State any arithmetic separately.
6. Never invent a price, deadline, obligation, number, source, page reference or policy requirement. If the documents do not support an answer, say "not stated."
7. Give a short list of consequential differences requiring human approval.
8. Finish with a verification checklist: every claim must be traceable to BOTH originals. Flag scanned or ambiguous tables and uncertain OCR.

Do NOT claim you checked a page or quote unless you actually accessed it. Do NOT call a generated conclusion a legal or financial determination.`;

const qualityChecks = [
  "Both filenames and revision dates are identified correctly.",
  "The comparison accounts for the later document's explicit supersession statement.",
  "Every important change has an exact source quote or verifiable page/section reference.",
  "Mathematical differences use the actual units and source figures.",
  "Missing data stays “not stated”—never “unchanged” or a guessed value.",
  "Private-data restrictions, unreadable pages and unresolved terms are recorded.",
] as const;

const sources = [
  {
    label: "OpenAI — Uploading files and audio to ChatGPT",
    url: "https://help.openai.com/en/articles/8555545-uploading-files-and-audio-to-chatgpt",
    explains: "PDF upload support, document comparison examples, file access and account-specific limitations.",
  },
  {
    label: "Google — Add or discover sources for Gemini Notebook",
    url: "https://support.google.com/gemininotebook/answer/16215270?hl=en",
    explains: "PDF sources, how to import them, source selection, limits and source revision behavior.",
  },
  {
    label: "Google — Gemini Notebook frequently asked questions",
    url: "https://support.google.com/gemininotebook/answer/16269187?hl=en",
    explains: "Source and citation limitations that readers should verify against their originals.",
  },
  {
    label: "Anthropic — Upload files to Claude",
    url: "https://support.claude.com/en/articles/8241126-upload-files-to-claude",
    explains: "Supported document uploads and differences between chat and project files.",
  },
  {
    label: "OpenAI — Optimizing file uploads in ChatGPT Enterprise",
    url: "https://help.openai.com/en/articles/10029836-optimizing-file-uploads-in-chatgpt-enterprise",
    explains: "PDF text/visual processing caveats in Enterprise; not a blanket guarantee for all account tiers.",
  },
] as const;

export default function CompareTwoPdfsWorkflowPage() {
  const structured = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "AI Tools", item: SITE_URL + "/ai-tools" },
        { "@type": "ListItem", position: 3, name: "Compare Two PDFs", item: SITE_URL + PAGE_URL },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: TITLE,
      description: DESCRIPTION,
      mainEntityOfPage: SITE_URL + PAGE_URL,
      datePublished: REVIEWED_ON,
      dateModified: REVIEWED_ON,
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    },
  ];
  return (
    <main id="main-content" className="ai-tools-page ai-guide-page ai-pdf-workflow-page">
      {structured.map((entry, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }} />
      ))}

      <header className="ai-guide-hero wrap">
        <Link href="/ai-tools" className="ai-tools-back"><ArrowLeft size={17} aria-hidden="true" /> AI Tools Directory</Link>
        <span className="ai-tools-eyebrow">DECODISTA / PRACTICAL AI WORKFLOW</span>
        <h1>{TITLE}</h1>
        <p className="ai-guide-subtitle">{DESCRIPTION}</p>
        <div className="ai-guide-byline">
          <span>DECODISTA Editorial</span><span aria-hidden="true">·</span>
          <span>Official documentation reviewed <time dateTime={REVIEWED_ON}>23 November 2026</time></span>
          <span aria-hidden="true">·</span><span>Original fictional case · No AI benchmark</span>
        </div>
        <div className="ai-guide-hero-actions">
          <a href="#download-samples"><Download size={17} aria-hidden="true" /> Download sample documents</a>
          <a href="#comparison-prompt"><FileDiff size={17} aria-hidden="true" /> Reuse the verification prompt</a>
        </div>
      </header>

      <div className="ai-guide-layout wrap">
        <article className="ai-guide-article">
          <section className="ai-guide-intro" aria-label="Quick answer">
            <p><strong>Quick answer:</strong> AI can draft a difference table for two PDF documents, but it cannot replace checking what each original actually says. Upload two clearly labeled versions, ask for a field-by-field comparison with exact quotations, then independently verify every consequential change. This works best when the documents are readable, you know which revision applies and your prompt distinguishes changes from missing facts.</p>
            <p>For this walkthrough we wrote two short <strong>fictional library notices</strong> whose differences can be checked by hand. We publish the two texts and the expected changes so you can try the same task in ChatGPT, Claude or Gemini Notebook without uploading a real client's files. These are editorially calculated reference answers, <strong>not results measured from any AI system</strong>.</p>
          </section>

          <section id="download-samples" className="ai-guide-section" aria-labelledby="pdf-samples-title">
            <span className="ai-tools-eyebrow">01 / Reproducible examples</span>
            <h2 id="pdf-samples-title">Two fictional documents you can inspect</h2>
            <p>Both samples are plain-text documents, deliberately offered instead of pretending they are downloadable PDFs. Open the text files and use your browser or document editor&apos;s Print to PDF option if you want two PDFs for a file-upload test. The original words remain available for manual verification.</p>
            <div className="ai-pdf-sample-grid">
              {fileLinks.map((file) => (
                <a href={file.path} key={file.path} className="ai-pdf-sample-card" download>
                  <span className="ai-tools-eyebrow">{file.note}</span>
                  <strong>{file.label}</strong>
                  <span className="ai-pdf-sample-action">Get sample text <Download size={17} aria-hidden="true" /></span>
                </a>
              ))}
            </div>
            <p><strong>Privacy boundary:</strong> Do not paste private contracts, medical records, credentials or customer files into an AI product unless you have the right permissions and understand its account-specific data controls. Start with these invented notices.</p>
          </section>

          <section id="workflow" className="ai-guide-section" aria-labelledby="pdf-steps-title">
            <span className="ai-tools-eyebrow">02 / Repeatable workflow</span>
            <h2 id="pdf-steps-title">Six steps from documents to a defensible change log</h2>
            <p>The sequence works as a general editorial method; the exact interface and file limits can change between services or account plans.</p>
            <div className="ai-guide-scenarios">
              {steps.map((step, index) => (
                <div key={step.title} className="ai-guide-scenario">
                  <span className="ai-guide-scenario-number">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                    <p className="ai-guide-check"><b>Checkpoint:</b> {step.check}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="expected-differences" className="ai-guide-section" aria-labelledby="pdf-expected-title">
            <span className="ai-tools-eyebrow">03 / Manually verified reference answer</span>
            <h2 id="pdf-expected-title">What actually changes in our sample documents?</h2>
            <p>This is DECODISTA&apos;s worked comparison of the fictional source text, not a generated model output. Sample B says it supersedes Sample A. Check these rows against the files before you judge any AI response.</p>
            <div className="ai-tools-table-scroll" role="region" aria-label="Verified fictional document comparison" tabIndex={0}>
              <table className="ai-tools-compare-table ai-guide-table ai-pdf-reference-table">
                <caption className="sr-only">Manual reference differences between fictional bulletin A and revised bulletin B</caption>
                <thead>
                  <tr><th scope="col">Field</th><th scope="col">Sample A</th><th scope="col">Sample B</th><th scope="col">Change or unknown</th><th scope="col">Check the source</th></tr>
                </thead>
                <tbody>
                  {referenceDifferences.map((row) => (
                    <tr key={row.field}>
                      <th scope="row">{row.field}</th>
                      <td>{row.a}</td><td>{row.b}</td>
                      <td>{row.result}</td><td>{row.evidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p><strong>The easy mistake:</strong> Both files omit weekday hours. That does <em>not</em> prove weekday hours stayed the same. Similarly, neither file supplies a budget. A response that invents the cost is demonstrably unreliable. The distinction between <em>not stated</em> and <em>unchanged</em> is part of the exercise.</p>
          </section>

          <section id="comparison-prompt" className="ai-guide-section" aria-labelledby="pdf-prompt-title">
            <span className="ai-tools-eyebrow">04 / Reusable prompt</span>
            <h2 id="pdf-prompt-title">Ask for evidence, not just a polished summary</h2>
            <p>Attach both source files and use this prompt in the AI product you are testing. It deliberately asks the system to stop if it cannot access either source and to avoid unsupported page references.</p>
            <div className="ai-pdf-prompt">
              <pre>{prompt}</pre>
            </div>
            <p>To reproduce the exercise without uploads, you can paste the exact contents of both fictional samples into separate labeled source blocks. Record that the method differed: pasted text is not a fair stress test of scanned-PDF extraction.</p>
          </section>

          <section id="verify-output" className="ai-guide-section" aria-labelledby="pdf-check-title">
            <span className="ai-tools-eyebrow">05 / The human verification pass</span>
            <h2 id="pdf-check-title">Six checks before trusting the comparison</h2>
            <ul className="ai-pdf-checklist">{qualityChecks.map((item) => <li key={item}><ShieldCheck size={19} aria-hidden="true" /><span>{item}</span></li>)}</ul>
            <div className="ai-guide-insight">
              <h3>Three failure modes to watch for</h3>
              <p><strong>Wrong version:</strong> The tool follows the original date without acknowledging that the revised notice supersedes it. <strong>Untraceable evidence:</strong> It generates a plausible page number or quotation that cannot be found. <strong>Inferred completeness:</strong> It says an omitted clause was removed or unchanged when neither text supports that claim.</p>
              <p>For high-stakes contracts, financial obligations or safety notices, the assistant&apos;s difference table is a drafting aid. The authority or a qualified reviewer must decide legal effect, not an automatically generated summary.</p>
            </div>
          </section>

          <section id="which-tools" className="ai-guide-section" aria-labelledby="pdf-tools-title">
            <span className="ai-tools-eyebrow">06 / Provider-documented options</span>
            <h2 id="pdf-tools-title">Which AI tools can you try?</h2>
            <p>These are supported ways to start a file-based workflow, not rankings, first-hand comparisons or guarantees that every plan handles every PDF feature equally.</p>
            <div className="ai-guide-insight">
              <h3>ChatGPT</h3>
              <p>OpenAI documents PDF uploads and explicitly lists comparing two documents as a supported task. Availability and parsing capabilities depend on the account, model, file contents and enabled tools. Check that both files were read before trusting the answer.</p>
              <h3>Gemini Notebook</h3>
              <p>Google documents PDFs as notebook sources. Add each file separately, then select the relevant sources in the source panel before requesting a comparison. A notebook source is a copy or synced version: verify the intended revision, especially after you update files elsewhere.</p>
              <h3>Claude</h3>
              <p>Anthropic documents uploading PDFs and other documents into a chat or project. Confirm that both files are available in the conversation, and validate any generated citations against the originals.</p>
            </div>
            <div className="ai-guide-primary-links">
              <Link href="/ai-tools/chatgpt">ChatGPT profile <ArrowRight size={16} aria-hidden="true" /></Link>
              <Link href="/ai-tools/claude">Claude profile <ArrowRight size={16} aria-hidden="true" /></Link>
              <Link href="/ai-tools/notebooklm">Gemini Notebook profile <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          </section>

          <section id="sources" className="ai-guide-section ai-guide-sources" aria-labelledby="pdf-sources-title">
            <span className="ai-tools-eyebrow">07 / Provider evidence</span>
            <h2 id="pdf-sources-title">Official documentation and scope</h2>
            <p>Documentation checked <time dateTime={REVIEWED_ON}>23 November 2026</time>. Product names, file limits, accounts and privacy rules may change. Check these sources before uploading sensitive material or choosing a paid plan.</p>
            <ol>
              {sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} <ArrowUpRight size={16} aria-hidden="true" /></a>
                  <span>{source.explains}</span>
                </li>
              ))}
            </ol>
            <p className="ai-guide-disclosure"><strong>Editorial disclosure:</strong> The two sample notices and reference table are independently authored fictional examples. No AI product was independently benchmarked or awarded a score for this page. The tool descriptions above are based on linked provider documentation, and the comparison method is an original DECODISTA procedure, not an official provider instruction.</p>
          </section>

          <section id="questions" className="ai-guide-section" aria-labelledby="pdf-questions-title">
            <span className="ai-tools-eyebrow">08 / Practical questions</span>
            <h2 id="pdf-questions-title">Common problems when comparing PDFs with AI</h2>
            <div className="ai-guide-faq-list">
              <div><h3>Can the AI confirm two files are identical?</h3><p>Not reliably from a prose summary alone. Use a byte-level file comparison for exact digital identity, or a document diff for text differences, and manually inspect visual changes. This guide is about evidence-led semantic differences.</p></div>
              <div><h3>What if my PDFs are scans?</h3><p>Text extraction or OCR can omit headers, tables or small figures. Check the rendered pages and extracted text before trusting an AI difference table. A blank extracted field is not proof the information is absent.</p></div>
              <div><h3>Should I trust page-number citations automatically?</h3><p>No. Ask for short quotations or section names and open each original file to verify. Page labels can differ between the printed document and its PDF viewer.</p></div>
              <div><h3>What if a newer file contradicts the older file?</h3><p>Record the difference and the revision instructions. A newer date does not by itself establish legal authority or the date on which a policy binds someone.</p></div>
            </div>
          </section>
        </article>

        <aside className="ai-guide-aside" aria-label="Workflow navigation">
          <nav className="ai-guide-toc" aria-label="On this page">
            <strong>IN THIS WALKTHROUGH</strong>
            <a href="#download-samples">Download example texts</a>
            <a href="#workflow">Six-step workflow</a>
            <a href="#expected-differences">Expected differences</a>
            <a href="#comparison-prompt">Reusable prompt</a>
            <a href="#verify-output">Verification checklist</a>
            <a href="#which-tools">Which tools to try</a>
            <a href="#sources">Official documentation</a>
            <a href="#questions">FAQ</a>
          </nav>
          <div className="ai-guide-side-links">
            <span className="ai-tools-eyebrow">Continue your research</span>
            <Link href="/ai-tools/guides/perplexity-vs-gemini-notebook">Perplexity vs Gemini Notebook <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link href="/ai-tools/guides/chatgpt-vs-gemini-for-research">ChatGPT vs Gemini research <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link href="/ai-tools/guides">All AI Tools comparisons <BookOpen size={16} aria-hidden="true" /></Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
