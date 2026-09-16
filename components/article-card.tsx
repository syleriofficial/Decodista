import Image from "next/image";
import Link from "@/components/app-link";
import { ArrowUpRight } from "lucide-react";
import type { Article } from "@/lib/content";
import { formatDate } from "@/lib/content";
import { CATEGORY_MAP } from "@/lib/site";

interface ArticleCardProps {
  article: Article;
  variant?: "standard" | "compact" | "horizontal";
  priority?: boolean;
}

export function ArticleCard({ article, variant = "standard", priority = false }: ArticleCardProps) {
  const category = CATEGORY_MAP[article.category];

  return (
    <article className={`article-card article-card--${variant}`}>
      <Link className="card-image" href={`/articles/${article.slug}`} aria-label={`Read ${article.title}`}>
        <Image
          src={article.featuredImage}
          alt={article.featuredImageAlt}
          fill
          sizes={variant === "horizontal" ? "(max-width: 700px) 100vw, 34vw" : "(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 32vw"}
          priority={priority}
        />
      </Link>
      <div className="card-copy">
        <div className="card-labels">
          <Link className="category-label" href={`/${article.category}`}>{category.shortName}</Link>
          {article.sample && <span className="sample-label">Sample</span>}
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
