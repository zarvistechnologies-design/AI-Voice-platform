"use client";

import { useEffect, useState } from "react";

import { BrandLogo } from "@/components/ui/BrandLogo";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 12);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`site-header${isScrolled ? " site-header--scrolled" : ""}`}>
      <div className="header-bar">
        <div className="header-brand">
          <BrandLogo />
        </div>

        <nav
          className={`main-nav${isMenuOpen ? " main-nav--open" : ""}`}
          aria-label="Main navigation"
        >
          {siteConfig.headerLinks.map((link) => (
            <a
              className={link.hasMenu ? "nav-link nav-link--menu" : "nav-link"}
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          {siteConfig.headerActions.map((action) => (
            <a
              className={`header-action header-action--${action.variant}`}
              href={action.href}
              key={action.label}
            >
              {action.label}
            </a>
          ))}
        </div>

        <button
          className={`mobile-menu-button${isMenuOpen ? " mobile-menu-button--open" : ""}`}
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
