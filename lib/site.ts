export const SITE_NAME = "DECODISTA";
export const SITE_TAGLINE = "Technology, Decoded.";
export const SITE_DESCRIPTION =
  "Clear, practical explanations of technology and digital life for everyone.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://decodista.com";

export const CATEGORY_DEFINITIONS = [
  { slug: "ai", name: "Artificial Intelligence", navName: "AI", shortName: "AI", mark: "AI", description: "Understand the tools, ideas, and choices shaping everyday artificial intelligence." },
  { slug: "devices", name: "Devices", navName: "Devices", shortName: "Devices", mark: "DV", description: "Make clearer choices about the phones, wearables, and gadgets you use every day." },
  { slug: "computers", name: "Computers", navName: "Computers", shortName: "Computers", mark: "PC", description: "Friendly explanations and practical advice for laptops, desktops, and everything inside them." },
  { slug: "apps", name: "Apps & Software", navName: "Apps", shortName: "Apps", mark: "AP", description: "Useful software, better workflows, and the details hidden behind everyday apps." },
  { slug: "internet", name: "Internet & Web", navName: "Internet", shortName: "Internet", mark: "WEB", description: "How the web works, where it is changing, and how to use it with more confidence." },
  { slug: "security", name: "Privacy & Security", navName: "Security", shortName: "Security", mark: "SEC", description: "Practical ways to protect your accounts, devices, identity, and personal information." },
  { slug: "digital-life", name: "Digital Life", navName: "Digital Life", shortName: "Digital Life", mark: "DL", description: "Thoughtful guidance for living well with the technology that surrounds us." },
  { slug: "guides", name: "Guides", navName: "Guides", shortName: "Guides", mark: "HOW", description: "Step-by-step help for solving common technology problems without the jargon." },
  { slug: "reviews", name: "Reviews", navName: "Reviews", shortName: "Reviews", mark: "REV", description: "Clear evaluation frameworks designed to help you buy and choose more thoughtfully." },
] as const;

export type CategorySlug = (typeof CATEGORY_DEFINITIONS)[number]["slug"];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORY_DEFINITIONS.map((category) => [category.slug, category]),
) as Record<CategorySlug, (typeof CATEGORY_DEFINITIONS)[number]>;

export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  ...CATEGORY_DEFINITIONS.map((category) => ({
    href: `/${category.slug}`,
    label: category.navName,
  })),
];
