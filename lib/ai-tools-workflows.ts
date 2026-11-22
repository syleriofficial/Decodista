/**
 * Individually source-reviewed, original AI Tools task walkthroughs.
 * Separate from comparison guides and general editorial news.
 *
 * reviewedOn = last manual source check; never updated by a clock at build time.
 */
export const AI_TOOLS_WORKFLOWS = [
  {
    slug: "compare-two-pdfs-with-ai",
    title: "How to Compare Two PDFs with AI and Find Contradictions",
    description:
      "A step-by-step source-checking workflow for comparing PDF versions with AI, including fictional sample documents, a reusable prompt, a verified difference table and a human review checklist.",
    reviewedOn: "2026-11-23",
    primarySources: 5,
    sampleDocuments: 2,
    verificationChecks: 6,
  },
] as const;

export const COMPARE_TWO_PDFS_WORKFLOW = AI_TOOLS_WORKFLOWS[0];
