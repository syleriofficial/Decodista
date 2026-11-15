import { ResponsiveImage } from "@/components/responsive-image";
import Link from "@/components/app-link";
import { ArrowUpRight } from "lucide-react";
import type { Article } from "@/lib/content";
import { formatDate } from "@/lib/content";
import { CATEGORY_MAP, CONTENT_TYPE_MAP } from "@/lib/site";

interface ArticleCardProps {
  article: Article;
  variant?: "standard" | "compact" | "horizontal";
  priority?: boolean;
  imageSizes?: string;
}

export function ArticleCard({ article, variant = "standard", priority = false, imageSizes }: ArticleCardProps) {
  const category = CATEGORY_MAP[article.category];
  // Two-column grids need larger candidates than the three-column homepage.
  // The homepage supplies its tighter three-column sizes explicitly.
  const responsiveSizes = imageSizes ?? (variant === "horizontal"
    ? "(max-width: 600px) 38vw, (max-width: 1000px) 34vw, 32vw"
    : "(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 48vw");

  return (
    <article className={`article-card article-card--${variant}`}>
      <Link className="card-image" href={`/articles/${article.slug}`} aria-label={`Read ${article.title}`}>
        <ResponsiveImage
          src={article.featuredImage}
          alt={article.featuredImageAlt}
          fill
          sizes={responsiveSizes}
          priority={priority}
        />
      </Link>
      <div className="card-copy">
        <div className="card-labels">
          <Link className="category-label" href={`/${article.category}`}>{category.shortName}</Link>
          {article.contentType === "how-to"
            ? <Link className="content-type-label" href="/how-to">{CONTENT_TYPE_MAP[article.contentType].name}</Link>
            : <span className="content-type-label">{CONTENT_TYPE_MAP[article.contentType].name}</span>}
        </div>
        <h3><Link href={`/articles/${article.slug}`}>{article.title}</Link></h3>
        {variant !== "compact" && <p>{article.description}</p>}
        <div className="meta-row">
          <time dateTime={article.publishedDate}>{formatDate(article.publishedDate)}</time>
          <span>{article.readingTime} min read</span>
          <ArrowUpRight aria-hidden="true" />
        </div>
      </div>
    </article>
  );
}
