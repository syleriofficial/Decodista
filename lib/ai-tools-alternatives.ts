import { AI_TOOLS, type AiTool } from "@/lib/ai-tools";

/**
 * Conservative task taxonomy curated from the AI_TOOLS listing descriptions,
 * their three disclosed use cases and the dated provider evidence ledger.
 * Overlap is a discovery hint, NOT product equivalence or test performance.
 */
export const AI_ALTERNATIVE_JOBS = {
  "writing": "Writing and editing",
  "coding-assistance": "Coding assistance",
  "everyday-questions": "Everyday questions",
  "document-analysis": "Working with documents",
  "multimodal": "Multimodal questions",
  "developer-workflows": "Developer workflows",
  "code-changes": "Code changes",
  "code-suggestions": "Code suggestions",
  "web-research": "Web research",
  "source-discovery": "Finding source material",
  "uploaded-sources": "Researching supplied documents",
  "source-summaries": "Summarizing source material",
  "image-generation": "Image generation",
  "creative-image-editing": "Creative image editing",
  "presentation-design": "Presentation design",
  "social-graphics": "Social graphics",
  "concept-art": "Concept art",
  "video-generation": "Video generation",
  "video-editing": "Video editing",
  "voiceovers": "Voiceovers",
  "text-to-speech": "Text to speech",
  "dubbing": "Dubbing",
} as const;

export type AiAlternativeJob = keyof typeof AI_ALTERNATIVE_JOBS;

const WORKFLOWS_BY_TOOL = {
  "adobe-firefly": ["image-generation", "creative-image-editing"],
  "canva": ["presentation-design", "social-graphics"],
  "chatgpt": ["writing", "coding-assistance", "everyday-questions"],
  "claude": ["writing", "coding-assistance", "document-analysis"],
  "cursor": ["developer-workflows", "code-changes"],
  "elevenlabs": ["voiceovers", "text-to-speech", "dubbing"],
  "gemini": ["everyday-questions", "writing", "multimodal"],
  "github-copilot": ["developer-workflows", "code-suggestions"],
  "midjourney": ["image-generation", "concept-art"],
  "notebooklm": ["uploaded-sources", "source-summaries"],
  "perplexity": ["web-research", "source-discovery"],
  "runway": ["video-generation", "video-editing"],
} as const satisfies Record<string, readonly AiAlternativeJob[]>;

export function getAiToolJobs(slug: string): readonly AiAlternativeJob[] {
  return WORKFLOWS_BY_TOOL[slug as keyof typeof WORKFLOWS_BY_TOOL] ?? [];
}

export type AiAlternativeMatch = {
  tool: AiTool;
  sharedJobs: readonly AiAlternativeJob[];
};

export function getAlternativeGroups(selected: AiTool, requestedJob?: string) {
  const selectedJobs = getAiToolJobs(selected.slug);
  const selectedJob = requestedJob && selectedJobs.includes(requestedJob as AiAlternativeJob)
    ? requestedJob as AiAlternativeJob
    : null;
  const sameCategory = AI_TOOLS
    .filter((tool) => tool.category === selected.category && tool.slug !== selected.slug)
    .sort((a, b) => a.name.localeCompare(b.name, "en"));

  const matched: AiAlternativeMatch[] = [];
  const related: AiAlternativeMatch[] = [];

  for (const tool of sameCategory) {
    const common = getAiToolJobs(tool.slug).filter((job) => selectedJobs.includes(job));
    const selectedOverlap = selectedJob ? common.filter((job) => job === selectedJob) : common;
    if (selectedOverlap.length > 0) {
      matched.push({ tool, sharedJobs: selectedOverlap });
    } else {
      // Other tools are surfaced separately, never mislabeled as substitutes.
      related.push({ tool, sharedJobs: common });
    }
  }
  return { selectedJobs, selectedJob, matched, related };
}
