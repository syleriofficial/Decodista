import type { Metadata } from "next";
import Link from "@/components/app-link";
import type { InfoPage } from "@/lib/legal";

export function infoMetadata(page: InfoPage, slug: string): Metadata {
  return { title: page.title, description: page.description, alternates: { canonical: `/${slug}` }, openGraph: { title: page.title, description: page.description, url: `/${slug}` }, twitter: { card: "summary", title: page.title, description: page.description } };
}

export function InfoPageView({ page }: { page: InfoPage }) {
  return <main id="main-content" className="info-page wrap"><header className="page-intro"><span className="eyebrow">{page.eyebrow}</span><h1>{page.title}</h1><p>{page.description}</p>{page.updated && <p className="page-updated">Updated {page.updated}</p>}</header><div className="info-content">{page.sections.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}{section.links && <nav className="info-links" aria-label={`${section.title} related pages`}><ul>{section.links.map((link) => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul></nav>}</section>)}</div></main>;
}
