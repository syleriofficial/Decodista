/**
 * Consent-gated, non-identifying AI Tools interaction events.
 *
 * This module NEVER sends page_view events. The existing GA4 installation
 * handles ordinary pageviews and consent for native page navigations.
 *
 * Event payloads are allowlisted static taxonomy values only: no search
 * input, prompt, document, URL parameters, personal data or user identifiers.
 */
import { AI_TOOL_CATEGORIES, AI_TOOLS } from "@/lib/ai-tools";

const CONSENT_STORAGE_KEY = "decodista-analytics-consent";
const taskIds = new Set(["research", "writing", "coding", "visuals", "video", "voice", "presentations"]);
const categoryIds = new Set(AI_TOOL_CATEGORIES.map((category) => category.slug));
const toolIds = new Set(AI_TOOLS.map((tool) => tool.slug));

export type AiToolsInteraction =
  | { name: "ai_tools_task_select"; task_id: string }
  | { name: "ai_tools_category_select"; category_id: string }
  | { name: "ai_tools_compare_select"; tool_slug: string; selection: "add" | "remove" };

export function isAiToolsPath(pathname: string): boolean {
  return pathname === "/ai-tools" || pathname.startsWith("/ai-tools/");
}

export function trackAiToolsInteraction(event: AiToolsInteraction): void {
  if (typeof window === "undefined" || !isAiToolsPath(window.location.pathname)) return;

  try {
    // Only opted-in visitors should generate events. A denied/unknown choice
    // must not be passed to GA, even if the global gtag queue exists.
    if (window.localStorage.getItem(CONSENT_STORAGE_KEY) !== "granted") return;
  } catch {
    // Private storage modes can throw. Fail closed and never attempt tracking.
    return;
  }

  if (typeof window.gtag !== "function") return;

  switch (event.name) {
    case "ai_tools_task_select":
      if (!taskIds.has(event.task_id)) return;
      window.gtag("event", event.name, { task_id: event.task_id });
      return;
    case "ai_tools_category_select":
      if (!categoryIds.has(event.category_id)) return;
      window.gtag("event", event.name, { category_id: event.category_id });
      return;
    case "ai_tools_compare_select":
      if (!toolIds.has(event.tool_slug) || !["add", "remove"].includes(event.selection)) return;
      window.gtag("event", event.name, {
        tool_slug: event.tool_slug,
        selection: event.selection,
      });
      return;
  }
}
