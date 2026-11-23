/**
 * Carefully scoped editorial discovery data: not hands-on ratings or live pricing.
 * Official destinations are provided for users to check current features, plans
 * and regional availability. Keep this library distinct from editorial news.
 */
export const AI_TOOL_CATEGORIES = [
  { slug: "all", label: "All tools", description: "Browse the source-reviewed tool directory" },
  { slug: "assistants", label: "Assistants", description: "Writing, questions and everyday work" },
  { slug: "research", label: "Research", description: "Explore information and source material" },
  { slug: "coding", label: "Coding", description: "Build and maintain software" },
  { slug: "design", label: "Image & design", description: "Create and edit visual work" },
  { slug: "video", label: "Video", description: "Generate and edit moving images" },
  { slug: "audio", label: "Audio", description: "Speech, narration and dubbing" },
] as const;

export type AiToolCategory = Exclude<(typeof AI_TOOL_CATEGORIES)[number]["slug"], "all">;

export type AiTool = {
  slug: string;
  name: string;
  provider: string;
  category: AiToolCategory;
  description: string;
  useCases: readonly [string, string, string];
  practicalNote: string;
  officialUrl: string;
};

export const AI_TOOLS: readonly AiTool[] = [
  {
    slug: "adobe-firefly",
    name: "Adobe Firefly",
    provider: "Adobe",
    category: "design",
    description: "Generative tools for creating and editing visual content within Adobe's creative ecosystem.",
    useCases: ["Image generation", "Creative editing", "Visual assets"],
    practicalNote: "Check the specific model, rights guidance and plan limits for your workflow.",
    officialUrl: "https://www.adobe.com/products/firefly.html",
  },
  {
    slug: "canva",
    name: "Canva",
    provider: "Canva",
    category: "design",
    description: "Visual design workspace with AI-assisted creation for graphics, presentations and social content.",
    useCases: ["Presentations", "Social graphics", "Design workflows"],
    practicalNote: "Templates, exports and AI features can differ between plans.",
    officialUrl: "https://www.canva.com/magic/",
  },
  {
    slug: "chatgpt",
    name: "ChatGPT",
    provider: "OpenAI",
    category: "assistants",
    description: "General-purpose AI assistant for writing, questions, analysis and everyday problem-solving.",
    useCases: ["Writing & editing", "Learning & research", "Coding assistance"],
    practicalNote: "Capabilities, limits and connected features depend on the current plan.",
    officialUrl: "https://chatgpt.com/",
  },
  {
    slug: "claude",
    name: "Claude",
    provider: "Anthropic",
    category: "assistants",
    description: "AI assistant used for writing, working with documents and coding-related tasks.",
    useCases: ["Writing & editing", "Document analysis", "Coding assistance"],
    practicalNote: "Check current model access and plan-specific usage limits.",
    officialUrl: "https://claude.ai/",
  },
  {
    slug: "cursor",
    name: "Cursor",
    provider: "Anysphere",
    category: "coding",
    description: "AI-focused code editor with assistance for understanding and changing software projects.",
    useCases: ["Codebase navigation", "Code changes", "Developer workflows"],
    practicalNote: "Review, test and validate any generated code before shipping.",
    officialUrl: "https://cursor.com/",
  },
  {
    slug: "elevenlabs",
    name: "ElevenLabs",
    provider: "ElevenLabs",
    category: "audio",
    description: "AI audio platform for text-to-speech, voice and dubbing workflows.",
    useCases: ["Voiceovers", "Text to speech", "Dubbing"],
    practicalNote: "Use voices only with the necessary permissions; check commercial-use terms.",
    officialUrl: "https://elevenlabs.io/",
  },
  {
    slug: "gemini",
    name: "Gemini",
    provider: "Google",
    category: "assistants",
    description: "Google's AI assistant for questions, content work and multimodal tasks.",
    useCases: ["Everyday questions", "Writing & planning", "Multimodal tasks"],
    practicalNote: "Integrations and available models can vary by account and region.",
    officialUrl: "https://gemini.google.com/",
  },
  {
    slug: "github-copilot",
    name: "GitHub Copilot",
    provider: "GitHub",
    category: "coding",
    description: "AI coding assistance across supported editors and developer workflows.",
    useCases: ["Code suggestions", "Developer questions", "Programming tasks"],
    practicalNote: "Check supported environments and review suggested changes carefully.",
    officialUrl: "https://github.com/features/copilot",
  },
  {
    slug: "midjourney",
    name: "Midjourney",
    provider: "Midjourney",
    category: "design",
    description: "Image-generation tool for developing visual ideas and creative artwork.",
    useCases: ["Concept art", "Visual exploration", "Image generation"],
    practicalNote: "Check creation controls and current licensing terms for each intended use.",
    officialUrl: "https://www.midjourney.com/",
  },
  {
    slug: "notebooklm",
    name: "Gemini Notebook",
    provider: "Google",
    category: "research",
    description: "Formerly NotebookLM, Google's source-based research workspace for documents, study and cited answers.",
    useCases: ["Source summaries", "Studying material", "Research notes"],
    practicalNote: "Formerly called NotebookLM. Check generated answers and citations against original sources.",
    officialUrl: "https://notebook.google.com/",
  },
  {
    slug: "perplexity",
    name: "Perplexity",
    provider: "Perplexity AI",
    category: "research",
    description: "AI-assisted answer and research service that can present linked sources.",
    useCases: ["Web research", "Source discovery", "Follow-up questions"],
    practicalNote: "Open the cited sources; a citation does not guarantee a claim is correct.",
    officialUrl: "https://www.perplexity.ai/",
  },
  {
    slug: "runway",
    name: "Runway",
    provider: "Runway",
    category: "video",
    description: "Creative AI workspace for generating and working with video.",
    useCases: ["Video generation", "Creative motion", "Video workflows"],
    practicalNote: "Check the current video models, output limits and credit requirements.",
    officialUrl: "https://runwayml.com/",
  },
  {
    slug: "bolt",
    name: "Bolt",
    provider: "StackBlitz",
    category: "coding",
    description: "AI-powered builder for creating websites and web apps through prompts, with editing and publishing workflows.",
    useCases: ["Build websites","Prototype web apps","Publish projects"],
    practicalNote: "Review generated code, deployment settings and token limits before relying on a hosted app.",
    officialUrl: "https://bolt.new/",
  },
  {
    slug: "gamma",
    name: "Gamma",
    provider: "Gamma",
    category: "design",
    description: "AI-assisted visual communication workspace for presentations, documents and web pages.",
    useCases: ["Presentations","Document layouts","Web pages"],
    practicalNote: "Inspect generated facts, branding, exports and sharing permissions before sending presentations.",
    officialUrl: "https://gamma.app/",
  },
  {
    slug: "lovable",
    name: "Lovable",
    provider: "Lovable",
    category: "coding",
    description: "AI app builder for generating and iterating on full-stack web applications using natural-language instructions.",
    useCases: ["Build web apps","Create app backends","Publish apps"],
    practicalNote: "Verify generated authentication, database permissions, runtime costs and code before launching an app.",
    officialUrl: "https://lovable.dev/",
  },
  {
    slug: "replit",
    name: "Replit",
    provider: "Replit",
    category: "coding",
    description: "Cloud development platform with an AI Agent for building, testing and deploying apps from prompts.",
    useCases: ["Build web apps","Edit software","Deploy projects"],
    practicalNote: "Check production infrastructure spend, secrets, generated code security and agent usage before deployment.",
    officialUrl: "https://replit.com/",
  },
] as const;

export const AI_TOOL_MAP = Object.fromEntries(AI_TOOLS.map((tool) => [tool.slug, tool])) as Record<string, AiTool>;

export function findAiTool(slug: string) {
  return AI_TOOL_MAP[slug];
}

export function getCategoryLabel(slug: AiToolCategory) {
  return AI_TOOL_CATEGORIES.find((category) => category.slug === slug)?.label ?? slug;
}
