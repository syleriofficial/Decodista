"use client";

import Link from "@/components/app-link";
import { Menu, Moon, Search, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) setOpen(false);
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
              <Link key={item.href} href={item.href} onClick={closeNavigation} aria-current={pathname === item.href ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
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
