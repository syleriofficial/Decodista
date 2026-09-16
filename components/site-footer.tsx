import Link from "next/link";
import { Newsletter } from "@/components/newsletter";
import { CATEGORY_DEFINITIONS } from "@/lib/site";

const footerLinks = [
  ["About", "/about"],
  ["Contact", "/contact"],
  ["Editorial Policy", "/editorial-policy"],
  ["Privacy Policy", "/privacy-policy"],
  ["Terms", "/terms"],
  ["Categories", "/ai"],
  ["Guides", "/guides"],
  ["Reviews", "/reviews"],
  ["Newsletter", "/#newsletter-title"],
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <Newsletter />
        <div className="footer-grid">
          <div>
            <Link className="wordmark footer-wordmark" href="/">DECODISTA</Link>
            <p>Technology, Decoded.</p>
            <p className="footer-note">Making technology easier to understand.</p>
          </div>
          <div>
            <h2>Explore</h2>
            <ul>
              {CATEGORY_DEFINITIONS.slice(0, 7).map((category) => (
                <li key={category.slug}><Link href={`/${category.slug}`}>{category.shortName}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h2>DECODISTA</h2>
            <ul>
              {footerLinks.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}
            </ul>
          </div>
        </div>
        <div className="footer-base">
          <span>© {new Date().getUTCFullYear()} DECODISTA</span>
          <span>Demo publication foundation</span>
        </div>
      </div>
    </footer>
  );
}
