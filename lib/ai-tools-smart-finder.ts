/**
 * Smart Finder 2.4: transparent, on-device task-intent matching.
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
      /\b(?:investigate|examine|explore) (?:\w+ ){0,5}(?:causes?|findings?|evidence|sources?|issues?|crises?|topics?)\b/,
      /\b(?:compare findings|what evidence supports|evaluate (?:the )?evidence|find trustworthy sources|find credible sources|verify (?:a |the )?claim)\b/,
      /\b(?:summari[sz]e|compare|analy[sz]e|interpret) (?:\w+ ){0,5}(?:journal articles?|academic (?:studies|papers)|research (?:documents?|reports?|papers?|studies)|studies)\b/,
      /\b(?:research(?:ing)? (?:a |the |my )?topic|web research|fact check|verify (?:claims|facts|sources)|find (?:credible )?sources|check citations)\b/,
      /\b(?:summari[sz]e|analy[sz]e|study|review) (?:my |some |the |a )?(?:pdfs?|research papers?|documents?|sources?|studies|articles?)\b/,
      /\bresearch and (?:write|draft|prepare|create)\b/,
    ],
    medium: [/\b(?:research|pdfs?|documents?|citations?|sources?|academic papers?|scientific papers?|find information about|look up facts about|evidence|journal articles?|research publications?)\b/],
    weak: [/\b(?:find information|look up facts)\b/],
  },
  {
    id: "writing",
    strong: [
      /\b(?:polish|rewrite|improve|draft|prepare|write|edit|proofread|correct|generate|create) (?:\w+ ){0,4}(?:cover letters?|newsletters?|press statements?|press releases?|biographies?|bios?|bedtime (?:stories?|story)|emails?|blog articles?|blog posts?|marketing copy|captions?|speeches?|articles?|paragraphs?|stories|essays?)\b/,
      /\b(?:wording|phrasing|tone|grammar) (?:\w+ ){0,5}(?:bios?|text|letters?|emails?|articles?|copy)\b/,
      /\b(?:write|draft|create) (?:\w+ ){0,3}(?:script|captions?) and (?:\w+ ){0,2}(?:videos?|animations?)\b/,
      /\bwrite and (?:produce|create|make) (?:a |the )?video\b/,
      /\b(?:write|draft|rewrite|proofread|edit|create|generate) (?:an? |my |some |the )?(?:emails?|articles?|blogs?|essays?|stories|story|copy|letters?|reports?|text|scripts?|resumes?|cvs?|posts?|captions?|linkedin posts?|social media (?:posts?|captions?)|product descriptions?|press releases?|marketing copy|speech(?:es)?)\b/,
    ],
    medium: [/\b(?:writing|rewriting|drafting|grammar|proofread(?:ing)?|emails?|blog posts?|copywriting|content writing)\b/],

    weak: [/\b(?:write|draft)\b/],
  },
  {
    id: "coding",
    strong: [
      /\b(?:unit tests?|failing tests?|tracebacks?|stack traces?|api bugs?|pair programm?(?:ing)?|review code|code review|javascript crashes?|python exceptions?)\b/,
      /\b(?:fix|debug|troubleshoot|investigate|suggest a fix for|explain|review|refactor) (?:\w+ ){0,5}(?:tests?|bugs?|api bugs?|code|errors?|exceptions?|tracebacks?|modules?|repositories?)\b/,
      /\b(?:write|generate|create) (?:some |the |my )?(?:code|(?:python|javascript|typescript) code)\b/,
      /\b(?:debug(?:ging)?|fix (?:the |my )?(?:bugs?|errors?|code)|refactor(?:ing)?|code review|pull requests?|review source code)\b/,
    ],
    medium: [/\b(?:coding|programming|write code|codebase|ide|developer|repository|github|javascript|python|typescript)\b/],
    weak: [/\b(?:code|software development)\b/],
  },
  {
    id: "app-building",
    strong: [
      /\b(?:launch|build|develop|create|ship|prototype|make|turn (?:this )?idea into) (?:\w+ ){0,5}(?:booking platforms?|portfolios? sites?|websites?|web apps?|mobile apps?|applications?|landing pages?|online stores?|dashboards?|saas products?|ordering apps?|platforms?)\b/,
      /\b(?:no code|nocode|no coding) (?:\w+ ){0,4}(?:portfolio|websites?|web ?sites?|apps?|landing pages?|stores?)\b/,
      /\band (?:a |an |the )?(?:websites?|web apps?|apps?)\b(?! (?:logo|icon|banner|thumbnail))/,
      /\b(?:build|create|make|launch|develop|generate|prototype) (?:an? |my |our |a new |some )?(?:full stack |mobile |web |saas |simple )?(?:apps?|applications?|websites?|web sites?|web apps?|landing pages?|online stores?)\b/,
    ],
    medium: [/\b(?:websites?|web apps?|mobile apps?|full stack|saas|webpages?|landing pages?|app builders?|deploy an app|publish an app|create a backend|(?:build|create|make|launch|develop|generate|prototype) (?:an? |my |our |a new |some )?apps?)\b/],
    weak: [/\b(?:hosting|app deployment)\b/],
  },
  {
    id: "visuals",
    strong: [
      /\b(?:retouch|illustrat(?:e|ed|ion)|remove (?:the |my )?background|(?:create|design|generate|make|produce) (?:\w+ ){0,5}(?:thumbnails?|splash screens?|diagrams?|mockups?|graphics?|illustrations?|banners?|maps?))\b/,
      /\b(?:create|design|generate|make|produce) (?:\w+ ){0,5}(?:logos?|icons?|social graphics|brand assets?)\b/,
      /\b(?:generate|create|make|design|draw|edit) (?:an? |my |some |the )?(?:images?|pictures?|photos?|logos?|artwork|illustrations?|graphics?|posters?)\b/,
      /\b(?:image generation|photo editing|image editing|concept art)\b/,
      /\b(?:create|make|design|generate|draw|edit) (?:an? |my |some |the |its )?(?:(?:app|website|brand|company|product) )?(?:logos?|icons?|banners?|thumbnails?|splash screens?)\b/,
    ],
    medium: [/\b(?:images?|pictures?|photos?|logos?|artwork|illustrations?|graphics?|posters?|icons?|banners?|thumbnails?)\b/],
    weak: [/\b(?:visual design|design assets)\b/],
  },
  {
    id: "video",
    strong: [
      /\b(?:animate|turn|convert|transform) (?:\w+ ){0,9}(?:photos?|images?|drawings?|storyboards?|illustrations?) (?:\w+ ){0,9}(?:videos?|clips?|reels?|animations?)\b/,
      /\b(?:animate|turn|convert|transform) (?:\w+ ){0,6}(?:photos?|images?|drawings?|illustrations?|storyboards?)\b/,
      /\b(?:animate|turn|convert|transform) (?:\w+ ){0,6}(?:videos?|clips?|reels?|trailers?|animations?)\b/,
      /\b(?:cinematic trailers?|video trailers?|promo clips?|product demo videos?|ad videos?)\b/,
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
      /\b(?:visuals|slides?) for (?:my |the )?(?:ted talks?|keynotes?|talks?|lectures?)\b/,
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
  /\b(?:join|combine|merge|split|rotate|compress|convert|unlock|encrypt|decrypt|remove (?:a |my |the )?(?:pdf )?password) (?:\w+ ){0,7}(?:pdfs?|docx|word files?|files?|passwords?)\b/,
  /\b(?:remove|reset|crack) (?:\w+ ){0,6}(?:pdf )?password\b/,
  /\b(?:turn|convert|export) (?:\w+ ){0,7}(?:docx|word document) (?:\w+ ){0,5}(?:pdfs?)\b/,
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
  const researchText = text.replace(/\b(?:review|check|inspect) (?:source )?code\b/g, " ");
  // Requests to design an app's logo or icon do not mean building the app itself.
  const appBuildingText = text
    .replace(/\b(?:build|create|make|launch|develop|generate|prototype) (?:an? |my |our |a new |some )?(?:mobile |web )?(?:apps?|websites?) (?:logos?|icons?|banners?|thumbnails?|splash screens?)\b/g, " ")
    // Making an asset *for* an app is not the same as making the app.
    .replace(/\b(?:make|create|design|generate|draw|edit|produce) (?:\w+ ){0,5}(?:logos?|banners?|icons?|thumbnails?|splash screens?) (?:for|of) (?:\w+ ){0,4}(?:apps?|websites?)\b/g, " ");
  // Converting an existing photo into a clip asks for video, not image generation.
  const visualText = text.replace(/\b(?:turn|convert|transform) (?:\w+ ){0,7}(?:photos?|images?) (?:\w+ ){0,7}(?:clips?|videos?|reels?)\b/g, " ");
  const matches = SIGNALS.map((task) => {
    const content = task.id === "coding" ? codingText : task.id === "app-building" ? appBuildingText : task.id === "research" ? researchText : task.id === "visuals" ? visualText : text;
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
