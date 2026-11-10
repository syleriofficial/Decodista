import Link from "@/components/app-link";
import { PrivacyChoicesButton } from "@/components/analytics-consent";
import { MORE_NAV_ITEMS, NAV_ITEMS, NAV_TOPIC_HUBS, SITE_DESCRIPTION, SITE_TAGLINE, TRUST_LINKS } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="wordmark footer-wordmark" href="/">DECODISTA</Link>
            <p>{SITE_TAGLINE}</p>
            <p className="footer-note">{SITE_DESCRIPTION}</p>
          </div>
          <div>
            <h2>Explore</h2>
            <ul>
              {NAV_ITEMS.map((item) => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}
              {MORE_NAV_ITEMS.map((item) => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}
              <li><Link href="/weekly">Weekly Brief</Link></li>
              <li><a href="/rss.xml" type="application/rss+xml">RSS Feed</a></li>
            </ul>
          </div>
          <div>
            <h2>Topics</h2>
            <ul>
              {NAV_TOPIC_HUBS.map((topic) => <li key={topic.slug}><Link href={`/topics/${topic.slug}`}>{topic.name}</Link></li>)}
            </ul>
          </div>
          <div>
            <h2>DECODISTA</h2>
            <ul>
              {TRUST_LINKS.map((item) => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}
            </ul>
          </div>
        </div>
        <div className="footer-base">
          <span>© {new Date().getUTCFullYear()} DECODISTA</span>
          <PrivacyChoicesButton />
          <span>{SITE_TAGLINE}</span>
        </div>
      </div>
    </footer>
  );
}
