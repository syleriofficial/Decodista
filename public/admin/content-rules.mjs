export const ALLOWED_CATEGORIES = new Set(["ai", "digital-life", "security", "science"]);
export const ALLOWED_CONTENT_TYPES = new Set(["how-to", "explainer", "news", "analysis"]);
export const ALLOWED_AUTHORS = new Set(["DECODISTA Editorial"]);

export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const IMAGE_PATTERN = /^\/images\/[a-zA-Z0-9/_-]+\.(?:avif|jpe?g|png|webp)$/;

// One production upload predates the slug-based naming rule. Its public URL
// remains stable; all later CMS hero uploads use the article slug.
export const LEGACY_UPLOAD_IMAGE_PATHS = new Set([
  "/images/uploads/chatgpt-image-sep-23-2026-04_46_10-pm.webp",
]);

const OPTIONAL_SCALAR_FIELDS = [
  "introduction",
  "updatedAt",
  "informationCheckedAt",
  "sourcesVerification",
];
const STRING_LIST_FIELDS = ["topics", "keyTakeaways", "relatedArticles"];

export const CANONICAL_TOPIC_LABELS = new Map([
  ["account security", "Account Security"],
  ["data protection", "Data Protection"],
  ["photo backup", "Photo Backup"],
]);

export function normalizeTopicLabel(value) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return CANONICAL_TOPIC_LABELS.get(trimmed.toLocaleLowerCase("en")) ?? trimmed;
}

export function isBlankCmsValue(value) {
  return value === undefined || value === null || (typeof value === "string" && !value.trim());
}

export function isEntirelyBlankCmsValue(value) {
  if (isBlankCmsValue(value)) return true;
  if (Array.isArray(value)) return value.every(isEntirelyBlankCmsValue);
  if (value && typeof value === "object") return Object.values(value).every(isEntirelyBlankCmsValue);
  return false;
}

/**
 * Canonical cleanup for values serialized by Decap. This removes only values
 * that carry no editorial information. Partially completed records remain in
 * place so validation can report the missing field instead of discarding work.
 */
export function normalizeCmsArticleData(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return input;
  const data = { ...input };

  for (const field of OPTIONAL_SCALAR_FIELDS) {
    if (isBlankCmsValue(data[field])) delete data[field];
  }

  for (const field of STRING_LIST_FIELDS) {
    if (!Array.isArray(data[field])) continue;
    data[field] = data[field].filter((item) => !isBlankCmsValue(item));
    if (field === "topics") data[field] = data[field].map(normalizeTopicLabel);
    if (field === "relatedArticles" && data[field].length === 0) delete data[field];
  }

  if (Array.isArray(data.faqs)) {
    data.faqs = data.faqs.filter((item) => !isEntirelyBlankCmsValue(item));
  }

  return data;
}

function sectionMatch(markdown, names) {
  if (typeof markdown !== "string") return undefined;
  const lines = markdown.split(/\r?\n/);
  const heading = /^##\s+(.+?)(?:\s+\{#[a-z0-9][a-z0-9-]*\})?\s*$/i;
  const start = lines.findIndex((line) => {
    const match = line.match(heading);
    return match && names.some((name) => name.test(match[1].trim()));
  });
  if (start < 0) return undefined;
  const next = lines.findIndex((line, index) => index > start && /^##\s+\S/.test(line));
  const end = next < 0 ? lines.length : next;
  return { hasContent: lines.slice(start + 1, end).join("\n").trim().length > 0 };
}

export function getBodySectionState(markdown) {
  return {
    faq: sectionMatch(markdown, [/^faq(?:s)?$/i]),
    sources: sectionMatch(markdown, [/^sources\s+(?:&|and)\s+verification$/i]),
  };
}

function validDate(value) {
  return typeof value === "string"
    && DATE_PATTERN.test(value)
    && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function validateRequiredString(data, field, label, errors) {
  if (typeof data[field] !== "string" || !data[field].trim()) errors.push(`${label} is required.`);
}

function validateStringList(data, field, label, { min = 1, max = Infinity } = {}, errors) {
  const value = data[field];
  if (!Array.isArray(value) || value.length < min) {
    errors.push(`${label} must contain at least ${min} ${min === 1 ? "item" : "items"}.`);
    return;
  }
  if (value.length > max) errors.push(`${label} may contain no more than ${max} items.`);
  value.forEach((item, index) => {
    if (typeof item !== "string" || !item.trim()) errors.push(`${label} item ${index + 1} cannot be blank.`);
  });
}

/**
 * Browser-friendly editorial validation. The Node loader calls this same
 * function before its deeper Markdown and link checks.
 */
export function validateCmsArticleData(input) {
  const data = normalizeCmsArticleData(input);
  const errors = [];
  if (!data || typeof data !== "object" || Array.isArray(data)) return ["Article data is invalid."];

  validateRequiredString(data, "title", "Title", errors);
  validateRequiredString(data, "slug", "Slug", errors);
  if (typeof data.slug === "string" && data.slug.trim() && !SLUG_PATTERN.test(data.slug.trim())) {
    errors.push("Slug must use lowercase words separated by hyphens.");
  }
  validateRequiredString(data, "deck", "Deck", errors);

  if (!ALLOWED_CATEGORIES.has(data.primaryCategory)) {
    errors.push("Primary Category must be AI, Digital Life, Security or Science.");
  }
  if (!ALLOWED_CONTENT_TYPES.has(data.contentType)) {
    errors.push("Content Type must be How-To, Explainer, News or Analysis.");
  }
  validateStringList(data, "topics", "Topics", { min: 1, max: 20 }, errors);

  validateRequiredString(data, "heroImage", "Hero Image", errors);
  if (typeof data.heroImage === "string" && data.heroImage.trim() && !IMAGE_PATTERN.test(data.heroImage.trim())) {
    errors.push("Hero Image must be an image stored under /images/.");
  }
  if (
    typeof data.heroImage === "string"
    && data.heroImage.startsWith("/images/uploads/")
    && typeof data.slug === "string"
    && SLUG_PATTERN.test(data.slug.trim())
    && data.heroImage !== `/images/uploads/${data.slug.trim()}.webp`
    && !LEGACY_UPLOAD_IMAGE_PATHS.has(data.heroImage)
  ) {
    errors.push("Hero Image filename must match the article slug and use WebP, for example /images/uploads/your-article-slug.webp.");
  }
  validateRequiredString(data, "heroImageAlt", "Hero Image Alt Text", errors);
  if (typeof data.heroImageAlt === "string" && data.heroImageAlt.trim() && data.heroImageAlt.trim().length < 20) {
    errors.push("Hero Image Alt Text must be meaningfully descriptive (at least 20 characters).");
  }
  const heroWidth = Number(data.heroImageWidth);
  const heroHeight = Number(data.heroImageHeight);
  if (!Number.isInteger(heroWidth) || heroWidth < 1200 || !Number.isInteger(heroHeight) || heroHeight < 1) {
    errors.push("Hero Image must retain dimensions of at least 1200px wide; CMS uploads should be 1600×900.");
  }

  validateRequiredString(data, "shortAnswer", "Short Answer", errors);
  validateStringList(data, "keyTakeaways", "Key Takeaways", { min: 2, max: 8 }, errors);
  validateRequiredString(data, "body", "Main Article Body", errors);
  if (!isBlankCmsValue(data.introduction) && typeof data.introduction !== "string") {
    errors.push("Opening Note must contain formatted text.");
  }

  if (data.faqs !== undefined && !Array.isArray(data.faqs)) {
    errors.push("FAQ must be a list.");
  } else {
    (data.faqs ?? []).forEach((faq, index) => {
      const label = `FAQ item ${index + 1}`;
      if (!faq || typeof faq !== "object" || Array.isArray(faq)) {
        errors.push(`${label} is invalid.`);
        return;
      }
      if (typeof faq.question !== "string" || !faq.question.trim()) errors.push(`${label} needs a question.`);
      if (typeof faq.answer !== "string" || !faq.answer.trim()) errors.push(`${label} needs an answer.`);
      if (!isBlankCmsValue(faq.id) && (typeof faq.id !== "string" || !SLUG_PATTERN.test(faq.id.trim()))) {
        errors.push(`${label} has an invalid anchor.`);
      }
    });
  }

  const bodySections = getBodySectionState(data.body);
  if (bodySections.faq && !bodySections.faq.hasContent) {
    errors.push("The FAQ section in the Main Article Body cannot be empty.");
  }
  if (bodySections.sources && !bodySections.sources.hasContent) {
    errors.push("The Sources & Verification section in the Main Article Body cannot be empty.");
  }
  if (!bodySections.sources?.hasContent && isBlankCmsValue(data.sourcesVerification)) {
    errors.push("Add Sources & Verification in the Main Article Body or the structured Sources & Verification field.");
  }
  if (!isBlankCmsValue(data.sourcesVerification) && typeof data.sourcesVerification !== "string") {
    errors.push("Sources & Verification must contain formatted text.");
  }

  if (!validDate(data.publishedAt)) errors.push("Published Date must use YYYY-MM-DD.");
  for (const [field, label] of [["updatedAt", "Updated Date"], ["informationCheckedAt", "Information Checked Date"]]) {
    if (!isBlankCmsValue(data[field]) && !validDate(data[field])) errors.push(`${label} must use YYYY-MM-DD.`);
  }
  if (validDate(data.publishedAt) && validDate(data.updatedAt) && data.updatedAt < data.publishedAt) {
    errors.push("Updated Date cannot be earlier than Published Date.");
  }

  if (!ALLOWED_AUTHORS.has(data.author)) errors.push("Author must use the approved DECODISTA Editorial profile.");
  const readingTime = Number(data.readingTime);
  if (!Number.isInteger(readingTime) || readingTime < 1 || readingTime > 120) {
    errors.push("Reading Time must be a whole number from 1 to 120 minutes.");
  }

  validateRequiredString(data, "seoTitle", "SEO Title", errors);
  if (typeof data.seoTitle === "string" && data.seoTitle.trim().length > 70) {
    errors.push("SEO Title must be 70 characters or fewer.");
  }
  validateRequiredString(data, "metaDescription", "Meta Description", errors);
  if (typeof data.metaDescription === "string" && data.metaDescription.trim().length > 180) {
    errors.push("Meta Description must be 180 characters or fewer.");
  }

  if (data.relatedArticles !== undefined) {
    if (!Array.isArray(data.relatedArticles)) {
      errors.push("Related Articles must be a list.");
    } else {
      data.relatedArticles.forEach((slug, index) => {
        if (typeof slug !== "string" || !SLUG_PATTERN.test(slug.trim())) {
          errors.push(`Related Article ${index + 1} must use a valid article slug.`);
        }
      });
    }
  }

  for (const [field, label] of [["featured", "Featured Story"], ["editorsPick", "Editor's Pick"]]) {
    if (data[field] !== undefined && typeof data[field] !== "boolean") errors.push(`${label} must be true or false.`);
  }

  return errors;
}
