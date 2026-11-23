/**
 * Smart Finder 2.3: transparent, on-device task-intent matching.
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
      /\bresearch and (?:write|draft|prepare|create)\b/,
    ],
    medium: [/\b(?:research|pdfs?|documents?|citations?|sources?|academic papers?|scientific papers?|find information about|look up facts about)\b/],
    weak: [/\b(?:find information|look up facts)\b/],
  },
  {
    id: "writing",
    strong: [
      /\bwrite and (?:produce|create|make) (?:a |the )?video\b/,
      /\b(?:write|draft|rewrite|proofread|edit|create|generate) (?:an? |my |some |the )?(?:emails?|articles?|blogs?|essays?|stories|story|copy|letters?|reports?|text|scripts?|resumes?|cvs?|posts?|captions?|linkedin posts?|social media (?:posts?|captions?)|product descriptions?|press releases?|marketing copy|speech(?:es)?)\b/,
    ],
    medium: [/\b(?:writing|rewriting|drafting|grammar|proofread(?:ing)?|emails?|blog posts?|copywriting|content writing)\b/],

    weak: [/\b(?:write|draft)\b/],
  },
  {
    id: "coding",
    strong: [
      /\b(?:write|generate|create) (?:some |the |my )?(?:code|(?:python|javascript|typescript) code)\b/,
      /\b(?:debug(?:ging)?|fix (?:the |my )?(?:bugs?|errors?|code)|refactor(?:ing)?|code review|pull requests?|review source code)\b/,
    ],
    medium: [/\b(?:coding|programming|write code|codebase|ide|developer|repository|github|javascript|python|typescript)\b/],
    weak: [/\b(?:code|software development)\b/],
  },
  {
    id: "app-building",
    strong: [
      /\b(?:logos?|icons?|banners?|thumbnails?) and (?:a |an |the )?(?:websites?|web apps?|apps?)\b(?! (?:logo|icon|banner|thumbnail))/,
      /\b(?:build|create|make|launch|develop|generate|prototype) (?:an? |my |our |a new |some )?(?:full stack |mobile |web |saas |simple )?(?:apps?|applications?|websites?|web sites?|web apps?|landing pages?|online stores?)\b/,
    ],
    medium: [/\b(?:websites?|web apps?|mobile apps?|full stack|saas|webpages?|landing pages?|app builders?|deploy an app|publish an app|create a backend)\b/],
    weak: [/\b(?:hosting|app deployment)\b/],
  },
  {
    id: "visuals",
    strong: [
      /\b(?:generate|create|make|design|draw|edit) (?:an? |my |some |the )?(?:images?|pictures?|photos?|logos?|artwork|illustrations?|graphics?|posters?)\b/,
      /\b(?:image generation|photo editing|image editing|concept art)\b/,
      /\b(?:create|make|design|generate|draw|edit) (?:an? |my |some |the )?(?:(?:app|website|brand|company|product) )?(?:logos?|icons?|banners?|thumbnails?)\b/,
    ],
    medium: [/\b(?:images?|pictures?|photos?|logos?|artwork|illustrations?|graphics?|posters?|icons?|banners?|thumbnails?)\b/],
    weak: [/\b(?:visual design|design assets)\b/],
  },
  {
    id: "video",
    strong: [
      /\b(?:turn|convert|transform) (?:my |some |the )?(?:images?|photos?|text) (?:in)?to (?:a )?videos?\b/,
      /\b(?:generate|create|make|edit|produce) (?:a |some |my |the )?(?:posters?|images?|photos?|graphics?|logos?) and (?:a |some )?(?:videos?|clips?)\b/,
      /\b(?:generate|create|make|edit|animate|produce) (?:an? |my |some |the |short |youtube )?(?:videos?|clips?|animations?|reels?|short films?)\b/,
      /\b(?:image to video|text to video|video generation|video editing)\b/,
    ],
    medium: [/\b(?:videos?|animations?|reels?|footage|video clips?|short films?)\b/],
    weak: [/\b(?:moving images|motion video)\b/],
  },
  {
    id: "voice",
    strong: [
      /\b(?:text to speech|voice ?overs?|voice narration|narrate|narration|dub(?:bing|bed)?|synthetic speech|voice cloning)\b/,
      /\b(?:generate|create|make) (?:an? |my |some |the )?(?:voice|speech|audio narration)\b/,
    ],
    medium: [/\b(?:voice|speech|spoken audio|dubbing|dub|dubbed|audio narration)\b/],
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

// These are utility/account workflows our curated tool directory does not verify.
// A document noun alone must not turn a PDF converter into a research suggestion.
const UNSUPPORTED_REQUESTS: readonly RegExp[] = [
  /\b(?:convert|compress|merge|split|rotate|unlock|encrypt) (?:an? |the |my |some )?(?:pdfs?|files?)\b/,
  /\b(?:reset|recover|retrieve) (?:an? |my |the )?(?:email|accounts?|passwords?)\b/,
];

function normalized(text: string): string {
  // Browser-local only; never logged, hashed or persisted.
  return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 280);
}

export function matchSmartFinderTask(input: string): SmartFinderResult {
  const text = normalized(input);
  if (text.length < 3 || UNSUPPORTED_REQUESTS.some((pattern) => pattern.test(text))) {
    return { matchedTasks: [], ambiguous: false };
  }
  // "Without coding" must not be a request for a coding IDE.
  const codingText = text.replace(/\b(?:no|without) (?:any )?(?:coding|code|programming)\b/g, " ");
  // "Review source code" must not be classified as document/source research.
  const researchText = text.replace(/\b(?:review|check|inspect) source code\b/g, " ");
  // Requests to design an app's logo or icon do not mean building the app itself.
  const appBuildingText = text.replace(
    /\b(?:build|create|make|launch|develop|generate|prototype) (?:an? |my |our |a new |some )?(?:mobile |web )?(?:apps?|websites?) (?:logos?|icons?|banners?|thumbnails?)\b/g,
    " ",
  );
  const matches = SIGNALS.map((task) => {
    const content = task.id === "coding" ? codingText : task.id === "app-building" ? appBuildingText : task.id === "research" ? researchText : text;
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
