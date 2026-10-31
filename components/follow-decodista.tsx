import { ArrowUpRight, Rss } from "lucide-react";
import { newsletterSubscriptionUrl } from "@/lib/newsletter";

interface FollowDecodistaProps {
  compact?: boolean;
}

/**
 * RSS works immediately. The email CTA appears only when a real external
 * subscription destination is configured; never collects addresses on-site.
 */
export function FollowDecodista({ compact = false }: FollowDecodistaProps) {
  const subscribeUrl = newsletterSubscriptionUrl();

  return (
    <aside className={`follow-decodista${compact ? " follow-decodista--compact" : ""}`} aria-labelledby={compact ? "follow-footer-title" : "follow-weekly-title"}>
      <div>
        <span className="eyebrow">Keep DECODISTA close</span>
        <h2 id={compact ? "follow-footer-title" : "follow-weekly-title"}>Never miss a useful update</h2>
        <p>Follow our practical AI, privacy and security coverage in your favorite RSS reader.{subscribeUrl ? " Or choose an optional email subscription." : ""}</p>
      </div>
      <div className="follow-decodista-actions">
        <a href="/rss.xml" type="application/rss+xml" className="follow-decodista-rss">
          <Rss aria-hidden="true" /> Follow the RSS feed
        </a>
        {subscribeUrl && (
          <a className="follow-decodista-email" href={subscribeUrl} target="_blank" rel="noopener noreferrer">
            Subscribe by email <ArrowUpRight aria-hidden="true" />
          </a>
        )}
      </div>
    </aside>
  );
}
