// Search only published article metadata. No network calls or generated content.
// Keep this pure so search behavior can be tested independently of React/Vinext.
export const SEARCH_QUERY_LIMIT = 160;

export function normalizeSearchQuery(value) {
  if (typeof value !== "string") return "";
  return value
    .toWellFormed()
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, SEARCH_QUERY_LIMIT)
    .trim();
}

function normalized(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function words(value) {
  return normalized(value).match(/[\p{L}\p{N}]+/gu) ?? [];
}

export function searchPublishedRecords(records, rawQuery) {
  const query = normalizeSearchQuery(rawQuery);
  if (!query) return records;
  // Hyphens, punctuation and repeated spaces are separators, not literal
  // substring requirements. All query words must match somewhere on a record.
  const terms = [...new Set(words(query))];
  if (terms.length === 0) return [];

  return records
    .map((record, index) => {
      const title = normalized(record.title);
      const description = normalized(record.description);
      const tags = normalized((record.tags ?? []).join(" "));
      const category = normalized(record.categoryName);
      const type = normalized(record.contentTypeName);
      const all = [title, description, tags, category, type].join(" ");
      if (!terms.every((term) => all.includes(term))) return null;

      const score = terms.reduce((sum, term) => sum +
        (title.includes(term) ? 8 : 0) +
        (tags.includes(term) ? 5 : 0) +
        (category.includes(term) ? 3 : 0) +
        (type.includes(term) ? 3 : 0) +
        (description.includes(term) ? 1 : 0), 0);
      return { record, index, score };
    })
    .filter((match) => match !== null)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ record }) => record);
}
