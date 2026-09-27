export const SITE_NAME = "DECODISTA";
export const SITE_TAGLINE = "Technology, Decoded.";
export const SITE_DESCRIPTION =
  "Clear answers for the technology people use every day.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://decodista.com";
export const GOOGLE_ANALYTICS_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-1T57TWPXM6";

export const CATEGORY_DEFINITIONS = [
  {
    slug: "ai",
    name: "Artificial Intelligence",
    navName: "AI",
    shortName: "AI",
    mark: "AI",
    description:
      "Clear explanations of the AI tools, privacy choices and ideas changing everyday technology.",
  },
  {
    slug: "digital-life",
    name: "Digital Life",
    navName: "Digital Life",
    shortName: "Digital Life",
    mark: "DL",
    description:
      "Practical guidance for managing photos, accounts, storage and the technology woven into daily life.",
  },
  {
    slug: "security",
    name: "Security",
    navName: "Security",
    shortName: "Security",
    mark: "SEC",
    description:
      "Understand account security, privacy controls, authentication and safer choices without unnecessary alarm.",
  },
  {
    slug: "science",
    name: "Science",
    navName: "Science",
    shortName: "Science",
    mark: "SCI",
    description:
      "Technology-adjacent science, from advanced computing and semiconductors to energy, robotics and space.",
  },
] as const;

export type CategorySlug = (typeof CATEGORY_DEFINITIONS)[number]["slug"];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORY_DEFINITIONS.map((category) => [category.slug, category]),
) as Record<CategorySlug, (typeof CATEGORY_DEFINITIONS)[number]>;

export const CONTENT_TYPE_DEFINITIONS = [
  {
    slug: "how-to",
    name: "How-To",
    description:
      "Careful, step-by-step help for fixing problems, changing settings and moving data safely.",
  },
  {
    slug: "explainer",
    name: "Explainer",
    description:
      "Plain-English context for understanding how technology works and what its choices mean.",
  },
  {
    slug: "news",
    name: "News",
    description:
      "Timely reporting on technology changes that matter to everyday users.",
  },
  {
    slug: "analysis",
    name: "Analysis",
    description:
      "Evidence-based analysis of important technology decisions, policies and shifts.",
  },
] as const;

export type ContentTypeSlug = (typeof CONTENT_TYPE_DEFINITIONS)[number]["slug"];

export const CONTENT_TYPE_MAP = Object.fromEntries(
  CONTENT_TYPE_DEFINITIONS.map((contentType) => [contentType.slug, contentType]),
) as Record<ContentTypeSlug, (typeof CONTENT_TYPE_DEFINITIONS)[number]>;

export const TOPIC_HUBS = [
  {
    slug: "google",
    name: "Google",
    showInNavigation: true,
    minimumArticles: 2,
    description:
      "Guides and explainers for Google accounts, Gemini, Google Photos and authentication.",
    tags: [
      "Google Gemini",
      "Google Account",
      "Google Photos",
      "Google Authenticator",
      "Sign in with Google",
    ],
  },
  {
    slug: "google-account",
    name: "Google Account",
    showInNavigation: true,
    minimumArticles: 2,
    description:
      "Understand Google sign-in, account connections, authentication and privacy controls.",
    tags: ["Google Account", "Sign in with Google", "Google Authenticator"],
  },
  {
    slug: "photos-backup",
    name: "Photos & Backup",
    showInNavigation: true,
    minimumArticles: 2,
    description:
      "Clear guidance on photo libraries, device copies, cloud sync and independent backups.",
    tags: [
      "Google Photos",
      "Photo Backup",
      "Photo backup",
      "Photo Storage",
      "Cloud Storage",
      "iCloud Photos",
      "iCloud Backup",
    ],
  },
  {
    slug: "privacy",
    name: "Privacy",
    showInNavigation: true,
    minimumArticles: 2,
    description:
      "Practical explanations of privacy controls, permissions, retention and safer data choices.",
    tags: [
      "AI Privacy",
      "Digital Privacy",
      "App Permissions",
      "Account Security",
      "Data Protection",
      "Data protection",
    ],
  },
  {
    slug: "scams-and-fraud",
    name: "Scams & Fraud",
    showInNavigation: false,
    minimumArticles: 3,
    description:
      "Practical guidance for recognizing scams, protecting accounts and recovering safely after fraud or account compromise.",
    tags: [
      "Scams & Fraud",
      "Phishing",
      "Fake Messages",
      "Account Takeover",
      "Voice Cloning",
      "Deepfake Scams",
      "Fake Support",
      "QR Scams",
      "Recovery After Hacking",
    ],
  },
] as const;

export type TopicSlug = (typeof TOPIC_HUBS)[number]["slug"];

export const TOPIC_MAP = Object.fromEntries(
  TOPIC_HUBS.map((topic) => [topic.slug, topic]),
) as Record<TopicSlug, (typeof TOPIC_HUBS)[number]>;

export const NAV_TOPIC_HUBS = TOPIC_HUBS.filter(
  (topic) => topic.showInNavigation,
);

export const NAV_ITEMS = [
  { href: "/ai", label: "AI" },
  { href: "/how-to", label: "How-To" },
  { href: "/digital-life", label: "Digital Life" },
  { href: "/security", label: "Security" },
  { href: "/latest", label: "Latest" },
] as const;

export const TRUST_LINKS = [
  { href: "/about", label: "About" },
  { href: "/editorial-policy", label: "Editorial Standards" },
  { href: "/how-we-work", label: "How We Work" },
  { href: "/corrections", label: "Corrections" },
  { href: "/editorial-team", label: "Editorial Team" },
  { href: "/ai-policy", label: "AI Policy" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;
