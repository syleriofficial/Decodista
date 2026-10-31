"use client";

import Link from "@/components/app-link";
import { ChevronDown, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NAV_ITEMS, NAV_TOPIC_HUBS, TRUST_LINKS } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const toggleTheme = () => {
    const next = document.documentElement.dataset.theme !== "dark";
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("decodista-theme", next ? "dark" : "light");
  };

  const closeNavigation = () => setOpen(false);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="masthead wrap">
        <button
          className="icon-button mobile-menu-button"
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="site-navigation"
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <Link className="wordmark" href="/" onClick={closeNavigation}>
          <span>DECODISTA</span>
          <small>Technology, Decoded.</small>
          <span className="sr-only">home</span>
        </Link>

        <nav id="site-navigation" className={`primary-nav ${open ? "is-open" : ""}`} aria-label="Main navigation">
          <div className="nav-scroll">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} onClick={closeNavigation}>
                {item.label}
              </Link>
            ))}
            <details className="more-menu">
              <summary>More <ChevronDown aria-hidden="true" /></summary>
              <div className="more-panel">
                <section aria-labelledby="more-topics-title">
                  <h2 id="more-topics-title">Topics</h2>
                  <ul>
                    {NAV_TOPIC_HUBS.map((topic) => (
                      <li key={topic.slug}><Link href={`/topics/${topic.slug}`} onClick={closeNavigation}>{topic.name}</Link></li>
                    ))}
                  </ul>
                </section>
                <section aria-labelledby="more-follow-title">
                  <h2 id="more-follow-title">Follow DECODISTA</h2>
                  <ul>
                    <li><Link href="/weekly" onClick={closeNavigation}>Weekly Digital Safety Brief</Link></li>
                    <li><Link href="/rss.xml" onClick={closeNavigation}>RSS Feed</Link></li>
                  </ul>
                </section>
                <section aria-labelledby="more-decodista-title">
                  <h2 id="more-decodista-title">DECODISTA</h2>
                  <ul>
                    {TRUST_LINKS.map((item) => (
                      <li key={item.href}><Link href={item.href} onClick={closeNavigation}>{item.label}</Link></li>
                    ))}
                  </ul>
                </section>
              </div>
            </details>
            <button className="mobile-theme-toggle" type="button" onClick={toggleTheme}>
              <Moon className="theme-moon" aria-hidden="true" />
              <Sun className="theme-sun" aria-hidden="true" />
              <span>Change appearance</span>
            </button>
          </div>
        </nav>

        <div className="header-actions">
          <Link className="icon-button" href="/search" aria-label="Search DECODISTA" onClick={closeNavigation}>
            <Search aria-hidden="true" />
          </Link>
          <button className="icon-button theme-button" type="button" onClick={toggleTheme} aria-label="Toggle light and dark mode">
            <Moon className="theme-moon" aria-hidden="true" />
            <Sun className="theme-sun" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
