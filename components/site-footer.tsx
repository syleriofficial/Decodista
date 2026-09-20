import Link from "@/components/app-link";
import { PrivacyChoicesButton } from "@/components/analytics-consent";
import { NAV_ITEMS, TOPIC_HUBS, TRUST_LINKS } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="wordmark footer-wordmark" href="/">DECODISTA</Link>
            <p>Technology, Decoded.</p>
            <p className="footer-note">Clear answers for the technology people use every day.</p>
          </div>
          <div>
            <h2>Explore</h2>
            <ul>
              {NAV_ITEMS.map((item) => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <h2>Topics</h2>
            <ul>
              {TOPIC_HUBS.map((topic) => <li key={topic.slug}><Link href={`/topics/${topic.slug}`}>{topic.name}</Link></li>)}
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
          <span>Technology, Decoded.</span>
        </div>
      </div>
    </footer>
  );
}
