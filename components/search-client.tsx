"use client";

import Image from "next/image";
import Link from "@/components/app-link";
import { Search } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

export interface SearchRecord {
  title: string;
  slug: string;
  description: string;
  categoryName: string;
  contentTypeName: string;
  tags: string[];
  image: string;
  imageAlt: string;
  readingTime: number;
}

export function SearchClient({ records, initialQuery = "" }: { records: SearchRecord[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return records;
    return records.filter((record) => [record.title, record.description, record.categoryName, record.contentTypeName, ...record.tags].join(" ").toLowerCase().includes(term));
  }, [query, records]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const url = query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search";
    window.history.replaceState({}, "", url);
  };

  return (
    <>
      <form className="search-form" role="search" onSubmit={submit}>
        <Search aria-hidden="true" />
        <label className="sr-only" htmlFor="article-search">Search all articles</label>
        <input id="article-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search topics, guides, and articles" autoComplete="off" />
        <button type="submit">Search</button>
      </form>
      <div className="search-summary" aria-live="polite"><strong>{results.length}</strong> published {results.length === 1 ? "article" : "articles"}{query.trim() ? ` matching “${query.trim()}”` : " in the library"}</div>
      {results.length ? <div className="search-results">{results.map((record) => <article key={record.slug}><Link className="search-result-image" href={`/articles/${record.slug}`}><Image src={record.image} alt={record.imageAlt} fill sizes="(max-width: 650px) 32vw, 220px" /></Link><div><div className="card-labels"><span className="category-label">{record.categoryName}</span><span className="content-type-label">{record.contentTypeName}</span></div><h2><Link href={`/articles/${record.slug}`}>{record.title}</Link></h2><p>{record.description}</p><span className="rail-meta">{record.readingTime} min read</span></div></article>)}</div> : <div className="empty-state"><h2>No matching articles</h2><p>Try a broader term such as “Google”, “photos”, “privacy” or “backup”.</p></div>}
    </>
  );
}
