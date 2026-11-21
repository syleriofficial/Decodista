/**
 * Individually reviewed, indexable AI Tools-only research guide registry.
 *
 * Kept separate from the two editorial AI_COMPARISON_GUIDES, which also
 * appear outside the AI Tools section via the Decodista news homepage.
 * Nothing in this registry should be automatically promoted to news pages.
 *
 * Dates are editorial source-review dates, not simulated refresh timestamps.
 */
export const AI_TOOLS_RESEARCH_GUIDES = [
  {
    slug: "perplexity-vs-gemini-notebook",
    title: "Perplexity vs Gemini Notebook: Research the web or your sources?",
    subtitle:
      "A practical, evidence-led decision guide for comparing public web research, curated documents, citations and privacy constraints. Gemini Notebook was formerly called NotebookLM.",
    reviewedOn: "2026-11-22",
    sourceCount: 7,
    decisionFactors: 5,
    scenarios: 4,
    readerTests: 3,
  },
  {
    slug: "chatgpt-vs-gemini-for-research",
    title: "ChatGPT vs Gemini for Research: Files, Sources and Workflows",
    subtitle:
      "A source-led guide to research with ChatGPT and Gemini: web citations, uploaded documents, connected services, project continuity and an independent reader test worksheet.",
    reviewedOn: "2026-11-22",
    sourceCount: 7,
    decisionFactors: 6,
    scenarios: 4,
    readerTests: 3,
  },
] as const;

export const PERPLEXITY_NOTEBOOK_RESEARCH_GUIDE = AI_TOOLS_RESEARCH_GUIDES[0];

export const CHATGPT_GEMINI_RESEARCH_GUIDE = AI_TOOLS_RESEARCH_GUIDES[1];
