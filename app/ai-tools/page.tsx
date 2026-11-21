import type { Metadata } from "next";
import Link from "@/components/app-link";
import { ArrowRight } from "lucide-react";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const description = "Discover Decodista's upcoming AI tool directory, comparisons, pricing research and alternatives, with links to published AI guides in the meantime.";

export const metadata: Metadata = {
  title: "AI Tools",
  description,
  alternates: { canonical: "/ai-tools" },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    title: `AI Tools | ${SITE_NAME}`,
    description,
    url: "/ai-tools",
  },
  twitter: { card: "summary", title: `AI Tools | ${SITE_NAME}`, description },
};

const existingResources = [
  {
    href: "/ai",
    title: "AI reporting & explainers",
    description: "Understand the developments, features and privacy choices shaping AI.",
    action: "Explore AI",
  },
  {
    href: "/how-to",
    title: "Practical how-to guides",
    description: "Follow carefully researched instructions for everyday technology decisions.",
    action: "Read guides",
  },
  {
    href: "/search?q=AI",
    title: "Search published coverage",
    description: "Find existing reporting on AI products, assistants and related services.",
    action: "Search coverage",
  },
] as const;

export default function AIToolsPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "AI Tools", item: `${SITE_URL}/ai-tools` },
    ],
  };

  return (
    <main id="main-content" className="category-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <header className="category-header wrap">
        <div>
          <span className="eyebrow">Discover / Compare / Decide</span>
          <h1>AI Tools</h1>
        </div>
        <p>
          A dedicated home for finding AI tools, comparing capabilities and
          prices, and exploring alternatives—separate from our AI news coverage.
        </p>
      </header>

      <section className="reader-paths wrap" aria-labelledby="ai-tools-status-title">
        <div className="reader-paths-heading">
          <span className="eyebrow">In development</span>
          <h2 id="ai-tools-status-title">Tool comparisons are on the way</h2>
          <p>
            The directory, side-by-side comparisons, pricing pages and
            alternatives are not published yet. Until they are ready, use
            Decodista&apos;s existing reporting and guides below. We won&apos;t
            display invented tool ratings, prices or reviews.
          </p>
        </div>
        <div className="reader-paths-grid">
          {existingResources.map((resource) => (
            <Link className="reader-path" href={resource.href} key={resource.href}>
              <strong>{resource.title}</strong>
              <span>{resource.description}</span>
              <span className="reader-path-action">
                {resource.action} <ArrowRight aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
