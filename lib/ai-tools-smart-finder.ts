/**
 * Smart Finder 2.0: transparent, on-device task-intent matching.
 * This only classifies tasks, NEVER ranks the underlying AI products.
 * Input is not transmitted, stored, logged or included in a URL.
 */
export const SMART_FINDER_TASK_IDS = [
  "research", "writing", "coding", "app-building",
  "visuals", "video", "voice", "presentations",
] as const;

export type SmartFinderTaskId = (typeof SMART_FINDER_TASK_IDS)[number];

export type SmartFinderResult = {
  matchedTasks: SmartFinderTaskId[];
  ambiguous: boolean;
};

type TaskSignals = {
  id: SmartFinderTaskId;
  strong: readonly RegExp[];
  medium: readonly RegExp[];
  weak?: readonly RegExp[];
};

const SIGNALS: readonly TaskSignals[] = [
  {
    id: "research",
    strong: [
      /\b(?:research(?:ing)? (?:a |the |my )?topic|web research|fact check|verify (?:claims|facts|sources)|find (?:credible )?sources|check citations)\b/,
      /\b(?:summari[sz]e|analy[sz]e|study|review) (?:my |some |the |a )?(?:pdfs?|research papers?|documents?|sources?|studies|articles?)\b/,
    ],
    medium: [/\b(?:research|pdfs?|documents?|citations?|sources?|academic papers?|scientific papers?)\b/],
    weak: [/\b(?:find information|look up facts)\b/],
  },
  {
    id: "writing",
    strong: [
      /\b(?:write|draft|rewrite|proofread|edit) (?:an? |my |some |the )?(?:emails?|articles?|blogs?|essays?|stories|story|copy|letters?|reports?|text|scripts?|resumes?|cvs?|posts?|captions?)\b/,
    ],
    medium: [/\b(?:writing|rewriting|drafting|grammar|proofread(?:ing)?|emails?|blog posts?|copywriting|content writing)\b/],
    weak: [/\b(?:write|draft)\b/],
  },
  {
    id: "coding",
    strong: [
      /\b(?:debug(?:ging)?|fix (?:the |my )?(?:bugs?|errors?|code)|refactor(?:ing)?|code review|pull requests?|review source code)\b/,
    ],
    medium: [/\b(?:coding|programming|write code|codebase|ide|developer|repository|github|javascript|python|typescript)\b/],
    weak: [/\b(?:code|software development)\b/],
  },
  {
    id: "app-building",
    strong: [
      /\b(?:build|create|make|launch|develop|generate|prototype) (?:an? |my |our |a new |some )?(?:full stack |mobile |web |saas |simple )?(?:apps?|applications?|websites?|web sites?|web apps?|landing pages?|online stores?)\b/,
      /\b(?:no code|nocode|without (?:any )?coding|without (?:any )?code|no programming)\b/,
    ],
    medium: [/\b(?:websites?|web apps?|mobile apps?|full stack|saas|webpages?|landing pages?|app builders?|deploy an app|publish an app|create a backend)\b/],
    weak: [/\b(?:hosting|app deployment)\b/],
  },
  {
    id: "visuals",
    strong: [
      /\b(?:generate|create|make|design|draw|edit) (?:an? |my |some |the )?(?:images?|pictures?|photos?|logos?|artwork|illustrations?|graphics?|posters?)\b/,
      /\b(?:image generation|photo editing|image editing|concept art)\b/,
    ],
    medium: [/\b(?:images?|pictures?|photos?|logos?|artwork|illustrations?|graphics?|posters?)\b/],
    weak: [/\b(?:visual design|design assets)\b/],
  },
  {
    id: "video",
    strong: [
      /\b(?:generate|create|make|edit|animate|produce) (?:an? |my |some |the |short |youtube )?(?:videos?|clips?|animations?|reels?|short films?)\b/,
      /\b(?:image to video|text to video|video generation|video editing)\b/,
    ],
    medium: [/\b(?:videos?|animations?|reels?|footage|video clips?|short films?)\b/],
    weak: [/\b(?:moving images|motion video)\b/],
  },
  {
    id: "voice",
    strong: [
      /\b(?:text to speech|voice ?overs?|voice narration|narrate|narration|dubb(?:ing|ed)?|synthetic speech|voice cloning)\b/,
      /\b(?:generate|create|make) (?:an? |my |some |the )?(?:voice|speech|audio narration)\b/,
    ],
    medium: [/\b(?:voice|speech|spoken audio|dubbing|audio narration)\b/],
    weak: [/\b(?:audio voices?)\b/],
  },
  {
    id: "presentations",
    strong: [
      /\b(?:slide decks?|pitch decks?|powerpoint|pptx?|presentations?|slideshows?)\b/,
      /\b(?:make|create|generate|design) (?:an? |my |some |the )?(?:slides?|decks?)\b/,
    ],
    medium: [/\b(?:slides?|speaker notes|deck)\b/],
    weak: [/\b(?:present to clients)\b/],
  },
];

function normalized(text: string): string {
  // Browser-local only; never logged, hashed or persisted.
  return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 280);
}

export function matchSmartFinderTask(input: string): SmartFinderResult {
  const text = normalized(input);
  if (text.length < 3) return { matchedTasks: [], ambiguous: false };
  // "Without coding" must not be a request for a coding IDE.
  const codingText = text.replace(/\b(?:no|without) (?:any )?(?:coding|code|programming)\b/g, " ");
  const matches = SIGNALS.map((task) => {
    const content = task.id === "coding" ? codingText : text;
    const strong = task.strong.some((signal) => signal.test(content)) ? 4 : 0;
    const medium = task.medium.some((signal) => signal.test(content)) ? 2 : 0;
    const weak = task.weak?.some((signal) => signal.test(content)) ? 1 : 0;
    return { id: task.id, score: strong + medium + weak };
  }).filter((item) => item.score >= 2).sort((a, b) => b.score - a.score);

  const best = matches[0];
  if (!best) return { matchedTasks: [], ambiguous: false };
  const close = matches.filter((item) => item.score >= best.score - 2).slice(0, 2);
  return { matchedTasks: close.map((item) => item.id), ambiguous: close.length > 1 };
}
