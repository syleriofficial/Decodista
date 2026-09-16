"use client";

import Link from "next/link";
import { Menu, Moon, Search, Sun, X } from "lucide-react";
import { useState } from "react";
import { NAV_ITEMS } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  const toggleTheme = () => {
    const next = document.documentElement.dataset.theme !== "dark";
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("decodista-theme", next ? "dark" : "light");
  };

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
        <Link className="wordmark" href="/" aria-label="DECODISTA home">
          <span>DECODISTA</span>
          <small>Technology, Decoded.</small>
        </Link>
        <div className="header-actions">
          <Link className="icon-button" href="/search" aria-label="Search DECODISTA">
            <Search aria-hidden="true" />
          </Link>
          <button className="icon-button theme-button" type="button" onClick={toggleTheme} aria-label="Toggle light and dark mode">
            <Moon className="theme-moon" aria-hidden="true" />
            <Sun className="theme-sun" aria-hidden="true" />
          </button>
        </div>
      </div>
      <nav id="site-navigation" className={`primary-nav ${open ? "is-open" : ""}`} aria-label="Main navigation">
        <div className="wrap nav-scroll">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
