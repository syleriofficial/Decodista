"use client";

import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, GitCompareArrows, Search, X } from "lucide-react";
import { AI_TOOL_CATEGORIES, AI_TOOLS, getCategoryLabel, type AiToolCategory } from "@/lib/ai-tools";

type CategoryFilter = (typeof AI_TOOL_CATEGORIES)[number]["slug"];

export function AiToolsExplorer() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return AI_TOOLS.filter((tool) => {
      if (category !== "all" && tool.category !== category) return false;
      return !query || [tool.name, tool.provider, tool.description, ...tool.useCases, getCategoryLabel(tool.category)]
        .join(" ").toLocaleLowerCase().includes(query);
    });
  }, [category, search]);

  const toggleCompare = (slug: string) => {
    setSelected((current) => current.includes(slug)
      ? current.filter((item) => item !== slug)
      : current.length < 2 ? [...current, slug] : current);
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
                onClick={() => setCategory(item.slug)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="ai-tools-filter-foot">
            <p aria-live="polite" aria-atomic="true">{filtered.length} {filtered.length === 1 ? "tool" : "tools"} shown</p>
            {(category !== "all" || search) && (
              <button type="button" className="ai-tools-reset" onClick={() => { setSearch(""); setCategory("all"); }}>
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
          >
            {selected.length === 2 ? "Compare selected tools" : "Open comparison guide"}
            <ArrowRight size={17} aria-hidden="true" />
          </a>
        </aside>
      </div>

      {filtered.length > 0 ? (
        <div className="ai-tools-grid">
          {filtered.map((tool) => {
            const isSelected = selected.includes(tool.slug);
            const isDisabled = !isSelected && selected.length >= 2;
            return (
              <article className={isSelected ? "ai-tools-card is-selected" : "ai-tools-card"} key={tool.slug}>
                <div className="ai-tools-card-top">
                  <span className={`ai-tools-monogram ai-tools-monogram--${tool.category}`} aria-hidden="true">{tool.name.slice(0, 2).toUpperCase()}</span>
                  <span className="ai-tools-card-category">{getCategoryLabel(tool.category as AiToolCategory)}</span>
                </div>
                <div className="ai-tools-card-copy">
                  <h3>{tool.name}</h3>
                  <p className="ai-tools-provider">By {tool.provider}</p>
                  <p className="ai-tools-summary">{tool.description}</p>
                </div>
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
                  <a href={tool.officialUrl} target="_blank" rel="noopener noreferrer" className="ai-tools-official" aria-label={`Visit ${tool.name} official website (opens in new tab)`}>
                    Official site <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="ai-tools-empty" role="status">
          <Search size={26} aria-hidden="true" />
          <h3>No matching tools in this starter directory</h3>
          <p>Try a broader search or clear the category. We do not list tools we haven&apos;t described yet.</p>
          <button type="button" onClick={() => { setSearch(""); setCategory("all"); }}>Show all tools</button>
        </div>
      )}
      <p className="ai-tools-disclosure">
        <strong>Editorial note:</strong> These are descriptive listings, not hands-on reviews, endorsements or ranked recommendations.
        Features, subscription prices, availability and usage rights can change. Confirm them on each provider&apos;s official website.
      </p>
    </section>
  );
}
