/**
 * Canonical archive page parsing: one positive, safe decimal integer.
 * Missing page means the first page; malformed, fractional, zero, negative,
 * duplicated or unsafe query values should lead to HTTP 404.
 */
export function parsePageNumber(value: string | string[] | undefined): number | null {
  if (value === undefined) return 1;
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return null;
  const page = Number(value);
  return Number.isSafeInteger(page) ? page : null;
}
