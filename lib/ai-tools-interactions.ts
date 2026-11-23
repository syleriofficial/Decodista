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
const taskIds = new Set(["research", "writing", "coding", "app-building", "visuals", "video", "voice", "presentations"]);
const categoryIds = new Set<string>(AI_TOOL_CATEGORIES.map((category) => category.slug));
const toolIds = new Set(AI_TOOLS.map((tool) => tool.slug));

export type AiToolsResultBucket = "none" | "one" | "few" | "many";

export function getAiToolsResultBucket(count: number): AiToolsResultBucket {
  if (count <= 0 || !Number.isFinite(count)) return "none";
  if (count === 1) return "one";
  return count <= 5 ? "few" : "many";
}

export type AiToolsInteraction =
  | { name: "ai_tools_task_select"; task_id: string }
  | { name: "ai_tools_category_select"; category_id: string }
  | { name: "ai_tools_compare_select"; tool_slug: string; selection: "add" | "remove" }
  | { name: "ai_tools_compare_open"; first_tool: string; second_tool: string }
  | { name: "ai_tools_save_toggle"; tool_slug: string; selection: "add" | "remove" }
  | { name: "ai_tools_search_complete"; result_bucket: AiToolsResultBucket };

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
    case "ai_tools_compare_open":
      if (!toolIds.has(event.first_tool) || !toolIds.has(event.second_tool) ||
          event.first_tool === event.second_tool) return;
      window.gtag("event", event.name, {
        first_tool: event.first_tool,
        second_tool: event.second_tool,
      });
      return;
    case "ai_tools_save_toggle":
      if (!toolIds.has(event.tool_slug) || !["add", "remove"].includes(event.selection)) return;
      window.gtag("event", event.name, {
        tool_slug: event.tool_slug,
        selection: event.selection,
      });
      return;
    case "ai_tools_search_complete":
      if (!["none", "one", "few", "many"].includes(event.result_bucket)) return;
      window.gtag("event", event.name, { result_bucket: event.result_bucket });
      return;
  }
}
