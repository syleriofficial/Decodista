import type { CategorySlug } from "@/lib/site";
import { googleAuthenticatorNewPhoneArticle } from "@/lib/articles/google-authenticator-new-phone-codes-missing";
import { geminiTemporaryChatArticle } from "@/lib/articles/gemini-temporary-chat-vs-keep-activity-off";
import { googlePhotosUndoBackupArticle } from "@/lib/articles/google-photos-android-undo-backup-keep-phone-photos";
import { removeThirdPartyGoogleAccessArticle } from "@/lib/articles/remove-third-party-google-access-without-losing-login";

export type InlineContent =
  | string
  | { type: "strong"; text: string }
  | { type: "emphasis"; text: string }
  | { type: "link"; text: string; href: string }
  | { type: "break" };

export type RichText = string | InlineContent[];

export type ContentBlock =
  | { type: "heading"; level: 2 | 3; text: string; id: string }
  | { type: "paragraph"; text: RichText }
  | { type: "list"; style: "ordered" | "unordered"; items: RichText[] }
  | { type: "quote"; text: RichText; attribution?: string }
  | { type: "callout"; title: string; text: RichText }
  | { type: "code"; language: string; code: string }
  | { type: "table"; headers: RichText[]; rows: RichText[][]; caption?: string }
  | { type: "image"; src: string; alt: string; caption?: string };

export interface Article {
  title: string;
  seoTitle?: string;
  slug: string;
  description: string;
  standfirst: string;
  category: CategorySlug;
  tags: string[];
  author: string;
  publishedDate: string;
  updatedDate?: string;
  featuredImage: string;
  featuredImageAlt: string;
  featuredImageWidth?: number;
  featuredImageHeight?: number;
  readingTime: number;
  featured?: boolean;
  trending?: boolean;
  sample: boolean;
  content: ContentBlock[];
}

const aiImage = "/images/ai-understanding.webp";
const deviceImage = "/images/devices-repairability.webp";
const privacyImage = "/images/privacy-path.webp";

export const articles: Article[] = [
  googleAuthenticatorNewPhoneArticle,
  googlePhotosUndoBackupArticle,
  removeThirdPartyGoogleAccessArticle,
  geminiTemporaryChatArticle,
  {
    title: "AI assistants are changing search. Here’s what that actually means",
    slug: "how-ai-assistants-change-search",
    description: "A plain-English guide to how answer engines differ from traditional search—and when to double-check what they tell you.",
    standfirst: "AI assistants can turn a broad question into a direct answer. That convenience changes what we see, what we miss, and how we decide which information to trust.",
    category: "ai",
    tags: ["AI assistants", "search", "digital literacy"],
    author: "DECODISTA Editorial",
    publishedDate: "2026-09-15",
    updatedDate: "2026-09-16",
    featuredImage: aiImage,
    featuredImageAlt: "Abstract glass cube revealing layered information and a warm central light",
    readingTime: 7,
    featured: true,
    trending: true,
    sample: true,
    content: [
      { type: "paragraph", text: "Traditional search usually gives you a ranked list of places to look. An AI assistant tries to do more of the reading and synthesis before you arrive. That sounds like a small interface change, but it moves several decisions—from which source to open to which detail to include—behind a conversational answer." },
      { type: "callout", title: "The short version", text: "Use an AI answer to orient yourself, not as automatic proof. For health, money, law, safety, or anything time-sensitive, open the cited source and confirm the important details." },
      { type: "heading", level: 2, id: "two-models", text: "Two different models for finding information" },
      { type: "paragraph", text: "A search engine is primarily a retrieval system: it matches a query with documents and ranks them. An AI assistant is primarily a generation system: it predicts a useful response based on its model, your prompt, and—when available—information it retrieves from the web or another source." },
      { type: "table", headers: ["Question", "Traditional search", "AI assistant"], rows: [["What you receive", "A list of links", "A composed answer"], ["Best for", "Finding sources and current pages", "Explaining, comparing, and drafting"], ["Main risk", "Poor or misleading results", "Confident but unsupported claims"]], caption: "A simplified comparison; many modern products combine both approaches." },
      { type: "heading", level: 2, id: "better-questions", text: "Ask questions that expose the reasoning" },
      { type: "paragraph", text: "A good prompt gives the assistant useful boundaries. State your goal, your level of familiarity, and any constraint that would change the recommendation. Then ask it to separate established facts from assumptions." },
      { type: "code", language: "text", code: "Explain this for a non-specialist.\nList the sources I should verify.\nFlag anything that may have changed recently." },
      { type: "heading", level: 3, id: "verification", text: "A simple verification habit" },
      { type: "list", style: "ordered", items: ["Open the original source, not only a summary of it.", "Check the publication or update date.", "Look for agreement from a second reliable source when the decision matters.", "Treat missing citations as a reason to slow down."] },
      { type: "quote", text: "The most useful role for an AI assistant is often navigator—not final authority." },
      { type: "image", src: privacyImage, alt: "Layered translucent screens leading toward a bright aperture", caption: "Good information habits create a clear path through layers of generated and retrieved material." },
      { type: "heading", level: 2, id: "bottom-line", text: "The bottom line" },
      { type: "paragraph", text: "AI-assisted search can save time and make unfamiliar subjects easier to enter. It works best when the answer remains connected to visible evidence and when readers keep control of the final judgment." },
    ],
  },
  {
    title: "The repairability questions worth asking before your next device",
    slug: "repairability-questions-before-buying",
    description: "A practical checklist for understanding repair access, software support, and the real lifespan of a new device.",
    standfirst: "A device’s value is not only its launch-day specification. Repair access, replacement parts, and software support all shape how long it remains useful.",
    category: "devices",
    tags: ["smartphones", "repairability", "buying guide"],
    author: "DECODISTA Editorial",
    publishedDate: "2026-09-12",
    featuredImage: deviceImage,
    featuredImageAlt: "Unbranded phone and laptop shown as carefully separated repairable layers",
    readingTime: 6,
    featured: true,
    trending: true,
    sample: true,
    content: [
      { type: "paragraph", text: "The most expensive device is often the one that needs replacing sooner than expected. Before comparing processors or camera modes, it is worth asking whether a battery can be replaced, how long security updates are promised, and whether local repair options exist." },
      { type: "heading", level: 2, id: "checklist", text: "A five-question buying checklist" },
      { type: "list", style: "ordered", items: ["How many years of operating-system and security updates are promised?", "Can the battery be replaced without replacing the whole device?", "Are parts and repair manuals available in your region?", "Does the warranty allow independent repair?", "Will the device remain useful if a connected service closes?"] },
      { type: "callout", title: "Think in years, not launch cycles", text: "A slightly more expensive device can cost less over time if it receives longer support and can survive one routine repair." },
      { type: "heading", level: 2, id: "tradeoffs", text: "Where the trade-offs appear" },
      { type: "paragraph", text: "Thinness, water resistance, and tightly integrated components can make repair more difficult, but the relationship is not absolute. Look for specific evidence—parts, instructions, support periods—rather than a vague promise of durability." },
    ],
  },
  {
    title: "Passkeys, passwords, and the sign-in shift you’ll notice next",
    slug: "passkeys-passwords-sign-in-explained",
    description: "What passkeys change, why they resist phishing, and how to adopt them without losing account access.",
    standfirst: "Passkeys remove the shared secret that makes passwords vulnerable, but recovery and device syncing still deserve careful attention.",
    category: "security",
    tags: ["passkeys", "passwords", "account security"],
    author: "DECODISTA Editorial",
    publishedDate: "2026-09-10",
    featuredImage: privacyImage,
    featuredImageAlt: "A protected digital path through translucent security layers",
    readingTime: 5,
    featured: true,
    trending: true,
    sample: true,
    content: [
      { type: "paragraph", text: "A password is a secret you know and send to a service. A passkey is a cryptographic credential: your device keeps the private half, while the service stores only the public half. The pieces prove a match without revealing a reusable secret." },
      { type: "heading", level: 2, id: "why-phishing", text: "Why passkeys resist phishing" },
      { type: "paragraph", text: "A passkey is created for a specific website or app. A look-alike page on a different domain cannot simply collect it the way it can collect a typed password." },
      { type: "heading", level: 2, id: "before-switching", text: "Before you switch" },
      { type: "list", style: "unordered", items: ["Confirm how your passkeys sync across devices.", "Keep recovery details current.", "Add more than one trusted device where the service allows it.", "Do not remove a working recovery method until the new sign-in has been tested."] },
    ],
  },
  {
    title: "How to choose a laptop without getting lost in specifications",
    slug: "choose-a-laptop-without-spec-overload",
    description: "Turn processors, memory, storage, and displays into a short list based on what you actually do.",
    standfirst: "The right laptop starts with your workload, not the longest specification sheet.",
    category: "computers",
    tags: ["laptops", "buying guide", "computers"],
    author: "DECODISTA Editorial",
    publishedDate: "2026-09-08",
    featuredImage: deviceImage,
    featuredImageAlt: "A modular laptop separated into its main internal layers",
    readingTime: 8,
    sample: true,
    content: [
      { type: "paragraph", text: "Start by naming the heaviest task you perform every week. Browsing, documents, and video calls need less sustained performance than software development, 3D work, or high-resolution video editing." },
      { type: "heading", level: 2, id: "priorities", text: "Translate your work into priorities" },
      { type: "table", headers: ["Typical use", "Prioritise"], rows: [["Everyday study and office work", "Battery life, keyboard, webcam"], ["Creative work", "Display quality, memory, sustained performance"], ["Frequent travel", "Weight, charging flexibility, build quality"]] },
      { type: "callout", title: "A useful rule", text: "Pay for the limitation you know you will encounter—not for every specification that looks impressive." },
    ],
  },
  {
    title: "Browser privacy settings that make a meaningful difference",
    slug: "browser-privacy-settings-that-matter",
    description: "Focus on the browser controls that reduce tracking without making the web frustrating to use.",
    standfirst: "A few well-chosen controls usually help more than turning on every privacy switch you can find.",
    category: "internet",
    tags: ["browsers", "privacy", "web"],
    author: "DECODISTA Editorial",
    publishedDate: "2026-09-05",
    featuredImage: privacyImage,
    featuredImageAlt: "Digital information passing through layered privacy screens",
    readingTime: 6,
    trending: true,
    sample: true,
    content: [
      { type: "paragraph", text: "Modern browsers expose many privacy controls, but not all of them have the same impact. Begin with third-party tracking protection, permission cleanup, and a deliberate choice about syncing browsing data." },
      { type: "heading", level: 2, id: "start-here", text: "Start with these three controls" },
      { type: "list", style: "unordered", items: ["Block or limit third-party tracking.", "Review camera, microphone, location, and notification permissions.", "Clear saved site access for services you no longer use."] },
      { type: "heading", level: 2, id: "balance", text: "Privacy is a balance, not a single switch" },
      { type: "paragraph", text: "The strictest setting may break sign-in flows or embedded services. Choose a protective default, then make narrow exceptions for sites you trust and actually need." },
    ],
  },
  {
    title: "A calmer way to manage app notifications",
    slug: "calmer-app-notifications",
    description: "Build a notification system that protects attention without making you unreachable.",
    standfirst: "Notifications work better when each one has to earn the right to interrupt you.",
    category: "apps",
    tags: ["notifications", "apps", "focus"],
    author: "DECODISTA Editorial",
    publishedDate: "2026-09-02",
    featuredImage: aiImage,
    featuredImageAlt: "Layered signals flowing through a clear glass structure",
    readingTime: 4,
    sample: true,
    content: [
      { type: "paragraph", text: "Instead of deciding app by app, begin with three levels: interruptions that need immediate attention, updates that can wait for a summary, and information you only need when you open the app." },
      { type: "heading", level: 2, id: "three-levels", text: "Use three levels of urgency" },
      { type: "list", style: "unordered", items: ["Immediate: direct messages from important people and time-sensitive alerts.", "Scheduled: news, work updates, and delivery progress.", "On demand: promotions, recommendations, and social activity."] },
    ],
  },
  {
    title: "Your personal data has a lifecycle. Map it in 20 minutes",
    slug: "map-your-personal-data-lifecycle",
    description: "A short exercise for seeing where your information is created, copied, stored, and forgotten.",
    standfirst: "You cannot make every digital service private, but you can make your data footprint more intentional.",
    category: "digital-life",
    tags: ["personal data", "digital habits", "privacy"],
    author: "DECODISTA Editorial",
    publishedDate: "2026-08-29",
    featuredImage: privacyImage,
    featuredImageAlt: "Small luminous data tiles travelling through transparent layers",
    readingTime: 5,
    sample: true,
    content: [
      { type: "paragraph", text: "Choose one ordinary activity—booking travel, ordering food, or sharing photos—and list every place the information goes. Include the app, payment service, email inbox, cloud backup, and any person who receives a copy." },
      { type: "heading", level: 2, id: "map", text: "Draw a simple map" },
      { type: "list", style: "ordered", items: ["Write down where the data starts.", "Trace each copy or transfer.", "Mark which services keep it.", "Delete what no longer serves a purpose."] },
      { type: "callout", title: "Keep the exercise small", text: "The goal is not to document your whole digital life. One useful map is better than an exhaustive one you never finish." },
    ],
  },
  {
    title: "How to back up a computer with fewer surprises",
    slug: "computer-backup-with-fewer-surprises",
    description: "A straightforward guide to copies, cloud sync, external drives, and the restore test people often skip.",
    standfirst: "A backup is only trustworthy when it is separate from your computer and you have checked that it can be restored.",
    category: "guides",
    tags: ["backups", "cloud storage", "how-to"],
    author: "DECODISTA Editorial",
    publishedDate: "2026-08-25",
    featuredImage: deviceImage,
    featuredImageAlt: "Computer components arranged in clear modular layers",
    readingTime: 7,
    sample: true,
    content: [
      { type: "paragraph", text: "Cloud sync is useful, but it is not always a complete backup. A deleted or corrupted file can sync that change everywhere. Keep at least one additional copy that can preserve earlier versions." },
      { type: "heading", level: 2, id: "simple-plan", text: "A simple plan that scales" },
      { type: "list", style: "ordered", items: ["Keep the working copy on your computer.", "Run an automatic local backup to an external drive.", "Keep another protected copy away from the computer.", "Test a small restore on a schedule you will remember."] },
    ],
  },
  {
    title: "A useful framework for reading technology reviews",
    slug: "framework-for-reading-tech-reviews",
    description: "Separate test results, reviewer preferences, and product fit before you make a purchase.",
    standfirst: "The best review is not the one with the strongest verdict. It is the one that helps you predict your own experience.",
    category: "reviews",
    tags: ["reviews", "buying advice", "media literacy"],
    author: "DECODISTA Editorial",
    publishedDate: "2026-08-20",
    featuredImage: aiImage,
    featuredImageAlt: "Transparent layers exposing the structure inside a blue glass cube",
    readingTime: 5,
    sample: true,
    content: [
      { type: "paragraph", text: "Every review combines measurable evidence with judgment. Both can be useful, but they answer different questions. Battery run time is a test result; whether a device feels heavy is partly contextual." },
      { type: "heading", level: 2, id: "four-questions", text: "Ask four questions while reading" },
      { type: "list", style: "ordered", items: ["What was actually tested?", "What was compared?", "Which judgment depends on the reviewer’s preferences?", "Does the conclusion match my priorities and region?"] },
      { type: "quote", text: "A review should narrow your uncertainty, not borrow your decision." },
    ],
  },
];

export const getArticle = (slug: string) =>
  articles.find((article) => article.slug === slug);

export const getArticlesByCategory = (category: CategorySlug) =>
  articles.filter((article) => article.category === category);

export const getRelatedArticles = (article: Article, limit = 3) => {
  const sameCategory = articles.filter(
    (candidate) => candidate.slug !== article.slug && candidate.category === article.category,
  );
  const other = articles.filter(
    (candidate) => candidate.slug !== article.slug && candidate.category !== article.category,
  );
  return [...sameCategory, ...other].slice(0, limit);
};

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
