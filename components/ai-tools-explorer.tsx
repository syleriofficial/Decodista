"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "@/components/app-link";
import { ArrowRight, ArrowUpRight, BookOpen, Bookmark, BookmarkCheck, Check, GitCompareArrows, Info, Search, X } from "lucide-react";
import { AI_TOOL_CATEGORIES, AI_TOOLS, getCategoryLabel, type AiToolCategory } from "@/lib/ai-tools";
import { getAiToolsResultBucket, trackAiToolsInteraction } from "@/lib/ai-tools-interactions";
import { AI_TOOL_EVIDENCE, getAiToolEvidence } from "@/lib/ai-tools-evidence";
import { getAiToolPricing } from "@/lib/ai-tools-pricing";

type CategoryFilter = (typeof AI_TOOL_CATEGORIES)[number]["slug"];

type SortOrder = "name" | "category";
const SAVED_STORAGE_KEY = "decodista-ai-tools-saved-v1";
const SAVED_UPDATED_EVENT = "decodista-ai-tools-saved-updated";
const EMPTY_SAVED = "[]";

// Stable server snapshot avoids mismatched server/client markup.
function getServerSavedSnapshot(): string { return EMPTY_SAVED; }
function getSavedSnapshot(): string {
  if (typeof window === "undefined") return EMPTY_SAVED;
  try { return window.localStorage.getItem(SAVED_STORAGE_KEY) ?? EMPTY_SAVED; }
  catch { return EMPTY_SAVED; }
}
function subscribeSaved(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(SAVED_UPDATED_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(SAVED_UPDATED_EVENT, onChange);
  };
}
function parseSaved(raw: string): string[] {
  try {
    const values: unknown = JSON.parse(raw);
    if (!Array.isArray(values)) return [];
    const slugs = new Set(AI_TOOLS.map((tool) => tool.slug));
    return [...new Set(values.filter((value): value is string =>
      typeof value === "string" && slugs.has(value)))].slice(0, AI_TOOLS.length);
  } catch { return []; }
}

export function AiToolsExplorer() {
  const [search, setSearch] = useState("");
  const lastRecordedSearchRef = useRef("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [sourceCheckedOnly, setSourceCheckedOnly] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>("name");
  const [saveUnavailable, setSaveUnavailable] = useState(false);
  const savedSnapshot = useSyncExternalStore(subscribeSaved, getSavedSnapshot, getServerSavedSnapshot);
  const saved = useMemo(() => parseSaved(savedSnapshot), [savedSnapshot]);

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    const matching = AI_TOOLS.filter((tool) => {
      if (savedOnly && !saved.includes(tool.slug)) return false;
      if (category !== "all" && tool.category !== category) return false;
      if (sourceCheckedOnly && !getAiToolEvidence(tool.slug)) return false;
      return !query || [tool.name, tool.provider, tool.description, ...tool.useCases, getCategoryLabel(tool.category)]
        .join(" ").toLocaleLowerCase().includes(query);
    });
    return matching.sort((first, second) => sortOrder === "category"
      ? getCategoryLabel(first.category).localeCompare(getCategoryLabel(second.category), "en")
        || first.name.localeCompare(second.name, "en")
      : first.name.localeCompare(second.name, "en"));
  }, [category, search, sourceCheckedOnly, savedOnly, saved, sortOrder]);

  const recordCompletedSearch = () => {
    // The typed phrase is NEVER sent; this ref only suppresses duplicate blur/Enter events.
    const query = search.trim();
    if (query.length < 2 || query === lastRecordedSearchRef.current) return;
    lastRecordedSearchRef.current = query;
    trackAiToolsInteraction({
      name: "ai_tools_search_complete",
      result_bucket: getAiToolsResultBucket(filtered.length),
    });
  };

  const toggleSave = (slug: string) => {
    const next = saved.includes(slug) ? saved.filter((item) => item !== slug) : [...saved, slug];
    try {
      window.localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(SAVED_UPDATED_EVENT));
      setSaveUnavailable(false);
      trackAiToolsInteraction({
        name: "ai_tools_save_toggle",
        tool_slug: slug,
        selection: saved.includes(slug) ? "remove" : "add",
      });
    } catch {
      setSaveUnavailable(true);
    }
  };

  const toggleCompare = (slug: string) => {
    const wasSelected = selected.includes(slug);
    if (!wasSelected && selected.length >= 2) return;
    setSelected(wasSelected ? selected.filter((item) => item !== slug) : [...selected, slug]);
    trackAiToolsInteraction({
      name: "ai_tools_compare_select",
      tool_slug: slug,
      selection: wasSelected ? "remove" : "add",
    });
  };

  const selectedNames = selected.map((slug) => AI_TOOLS.find((tool) => tool.slug === slug)?.name ?? slug);
  const compareHref = selected.length === 2
    ? `/ai-tools/compare?first=${encodeURIComponent(selected[0])}&second=${encodeURIComponent(selected[1])}`
    : "/ai-tools/compare";

  return (
    <section className="ai-tools-directory wrap" aria-labelledby="ai-tools-directory-heading">
      <div className="ai-tools-section-heading">
        <div>
          <span className="ai-tools-eyebrow">The directory</span>
          <h2 id="ai-tools-directory-heading">Explore by what you want to do</h2>
          <p>Browse a deliberately small starting collection. New entries will be added only with useful source-backed details.</p>
        </div>
        <span className="ai-tools-count-label">{AI_TOOLS.length} tools · {AI_TOOL_CATEGORIES.length - 1} categories</span>
      </div>

      <div className="ai-tools-workbench">
        <div className="ai-tools-filters">
          <label htmlFor="ai-tool-query" className="ai-tools-search-label">Search tools and use cases</label>
          <div className="ai-tools-search-field">
            <Search aria-hidden="true" size={19} />
            <input
              id="ai-tool-query"
              type="search"
              placeholder="Try writing, coding, research…"
              value={search}
              maxLength={120}
              onChange={(event) => setSearch(event.target.value)}
              onBlur={recordCompletedSearch}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  recordCompletedSearch();
                }
              }}
              autoComplete="off"
            />
            {search && <button className="ai-tools-clear" type="button" aria-label="Clear tool search" onClick={() => setSearch("")}><X size={17} aria-hidden="true" /></button>}
          </div>
          <div className="ai-tools-filter-row" role="group" aria-label="Filter by category">
            {AI_TOOL_CATEGORIES.map((item) => (
              <button
                key={item.slug}
                type="button"
                className={category === item.slug ? "ai-tools-chip is-selected" : "ai-tools-chip"}
                aria-pressed={category === item.slug}
                onClick={() => {
                  if (category === item.slug) return;
                  setCategory(item.slug);
                  trackAiToolsInteraction({ name: "ai_tools_category_select", category_id: item.slug });
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <label className="ai-tools-source-toggle" htmlFor="ai-tools-source-only">
            <input
              id="ai-tools-source-only"
              type="checkbox"
              checked={sourceCheckedOnly}
              onChange={(event) => setSourceCheckedOnly(event.target.checked)}
            />
            <span>
              <strong>Show source-checked listings only</strong>
              <small>{AI_TOOL_EVIDENCE.length} of {AI_TOOLS.length} listings have a dated review of official documentation. This is not a hands-on test.</small>
            </span>
          </label>
          <div className="ai-tools-product-controls">
            <button type="button" className={savedOnly ? "ai-tools-saved-filter is-selected" : "ai-tools-saved-filter"}
              aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)}>
              <Bookmark size={16} aria-hidden="true" /> Saved tools ({saved.length})
            </button>
            <label className="ai-tools-sort-control" htmlFor="ai-tools-sort">
              <span>Sort by</span>
              <select id="ai-tools-sort" value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value as SortOrder)}>
                <option value="name">Name A–Z</option>
                <option value="category">Category</option>
              </select>
            </label>
          </div>
          <p className="ai-tools-saved-note">Bookmarks stay in this browser only; no account or sync.</p>
          {saveUnavailable && <p className="ai-tools-saved-warning" role="status">Browser storage is unavailable. The tool was not saved.</p>}
          <div className="ai-tools-filter-foot">
            <p aria-live="polite" aria-atomic="true">{filtered.length} {filtered.length === 1 ? "tool" : "tools"} shown</p>
            {(category !== "all" || search || sourceCheckedOnly || savedOnly || sortOrder !== "name") && (
              <button type="button" className="ai-tools-reset" onClick={() => { setSearch(""); setCategory("all"); setSourceCheckedOnly(false); setSavedOnly(false); setSortOrder("name"); }}>
                Clear filters
              </button>
            )}
          </div>
        </div>

        <aside className="ai-tools-compare-dock" aria-label="Build a comparison">
          <div className="ai-tools-compare-dock-heading">
            <GitCompareArrows size={20} aria-hidden="true" />
            <div><strong>Compare two tools</strong><small>Choose up to two cards below</small></div>
          </div>
          <div className="ai-tools-comparison-slots">
            {[0, 1].map((index) => (
              <div className="ai-tools-slot" key={index}>
                <span>{selectedNames[index] ?? `Tool ${index + 1}`}</span>
                {selected[index] && <button type="button" aria-label={`Remove ${selectedNames[index]} from comparison`} onClick={() => toggleCompare(selected[index])}><X size={15} aria-hidden="true" /></button>}
              </div>
            ))}
          </div>
          <a
            className={selected.length === 2 ? "ai-tools-compare-link" : "ai-tools-compare-link is-idle"}
            href={compareHref}
            onClick={() => {
              if (selected.length !== 2) return;
              trackAiToolsInteraction({
                name: "ai_tools_compare_open",
                first_tool: selected[0],
                second_tool: selected[1],
              });
            }}
          >
            {selected.length === 2 ? "Compare selected tools" : "Open comparison"}
            <ArrowRight size={17} aria-hidden="true" />
          </a>
        </aside>
      </div>

      {filtered.length > 0 ? (
        <div className="ai-tools-grid">
          {filtered.map((tool) => {
            const evidence = getAiToolEvidence(tool.slug);
            const pricing = getAiToolPricing(tool.slug);
            const isSelected = selected.includes(tool.slug);
            const isSaved = saved.includes(tool.slug);
            const isDisabled = !isSelected && selected.length >= 2;
            return (
              <article className={isSelected ? "ai-tools-card is-selected" : "ai-tools-card"} key={tool.slug}>
                <div className="ai-tools-card-top">
                  <span className={`ai-tools-monogram ai-tools-monogram--${tool.category}`} aria-hidden="true">{tool.name.slice(0, 2).toUpperCase()}</span>
                  <span className="ai-tools-card-category">{getCategoryLabel(tool.category as AiToolCategory)}</span>
                  <button type="button"
                    className={isSaved ? "ai-tools-save-button is-saved" : "ai-tools-save-button"}
                    aria-label={isSaved ? "Remove " + tool.name + " from saved tools" : "Save " + tool.name + " to this browser"}
                    aria-pressed={isSaved}
                    title={isSaved ? "Remove from saved" : "Save on this browser"}
                    onClick={() => toggleSave(tool.slug)}>
                    {isSaved ? <BookmarkCheck size={19} aria-hidden="true" /> : <Bookmark size={19} aria-hidden="true" />}
                  </button>
                </div>
                <div className="ai-tools-card-copy">
                  <h3><Link href={`/ai-tools/${tool.slug}`}>{tool.name}</Link></h3>
                  <p className="ai-tools-provider">By {tool.provider}</p>
                  <p className="ai-tools-summary">{tool.description}</p>
                </div>
                <div className={evidence ? "ai-tools-card-evidence is-reviewed" : "ai-tools-card-evidence is-pending"}>
                  {evidence ? (
                    <>
                      <BookOpen size={15} aria-hidden="true" />
                      <span>Official source reviewed <time dateTime={evidence.checkedOn}>{evidence.checkedOn}</time>. Not live data.</span>
                      <a href={evidence.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`Read ${tool.name} documentation source (opens in new tab)`}>
                        Source <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    </>
                  ) : (
                    <>
                      <Info size={15} aria-hidden="true" />
                      <span>Detailed source review pending. Introductory listing only.</span>
                    </>
                  )}
                </div>
                {pricing && (
                  <div className="ai-tools-card-plans">
                    <span>Documented plans: {pricing.planNames.slice(0, 2).join(" · ")}{pricing.planNames.length > 2 ? " · …" : ""}</span>
                    <Link href={`/ai-tools/pricing#plan-${tool.slug}`}>Plan sources <ArrowRight size={13} aria-hidden="true" /></Link>
                  </div>
                )}
                <ul className="ai-tools-use-tags" aria-label={`${tool.name} common use cases`}>
                  {tool.useCases.map((use) => <li key={use}>{use}</li>)}
                </ul>
                <div className="ai-tools-card-bottom">
                  <button
                    type="button"
                    className={isSelected ? "ai-tools-select is-selected" : "ai-tools-select"}
                    aria-pressed={isSelected}
                    disabled={isDisabled}
                    title={isDisabled ? "Remove one selected tool first" : undefined}
                    onClick={() => toggleCompare(tool.slug)}
                  >
                    {isSelected ? <Check size={16} aria-hidden="true" /> : <GitCompareArrows size={16} aria-hidden="true" />}
                    {isSelected ? "Selected" : "Compare"}
                  </button>
                  <div className="ai-tools-card-links">
                    <Link href={`/ai-tools/${tool.slug}`} className="ai-tools-profile-link">
                      Overview <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                    <a href={tool.officialUrl} target="_blank" rel="noopener noreferrer" className="ai-tools-official" aria-label={`Visit ${tool.name} official website (opens in new tab)`}>
                      Official <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="ai-tools-empty" role="status">
          <Search size={26} aria-hidden="true" />
          <h3>{savedOnly && saved.length === 0 ? "No saved tools yet" : "No matching tools in this starter directory"}</h3>
          <p>{savedOnly && saved.length === 0 ? "Use the bookmark icon on any tool card to save it in this browser." : "Try a broader search or clear the category. We do not list tools we haven&apos;t described yet."}</p>
          <button type="button" onClick={() => { setSearch(""); setCategory("all"); setSourceCheckedOnly(false); setSavedOnly(false); setSortOrder("name"); }}>Show all tools</button>
        </div>
      )}
      <p className="ai-tools-disclosure">
        <strong>Editorial note:</strong> These are descriptive listings, not hands-on reviews, endorsements or ranked recommendations.
        Features, subscription prices, availability and usage rights can change. Confirm them on each provider&apos;s official website.
      </p>
    </section>
  );
}
