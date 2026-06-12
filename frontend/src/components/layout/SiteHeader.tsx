"use client";

import { useEffect, useRef, useState } from "react";

import { BrandLogo } from "@/components/ui/BrandLogo";
import { siteConfig } from "@/config/site";

type MegaMenuKey = "product" | "business" | "developers" | "resources" | "company";

const megaMenuLabels: Record<string, MegaMenuKey> = {
  Product: "product",
  "For Business": "business",
  "For Developers": "developers",
  Resources: "resources",
  Company: "company",
};

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<MegaMenuKey | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  const megaMenus = {
    product: {
      id: "product-menu",
      className: "",
      contentClassName: "product-menu-groups",
      featured: siteConfig.productMenu.featured,
      groups: siteConfig.productMenu.groups,
      cta: siteConfig.productMenu.cta,
    },
    business: {
      id: "business-menu",
      className: " business-menu-card",
      contentClassName: "business-menu-content",
      featured: siteConfig.businessMenu.featured,
      groups: siteConfig.businessMenu.columns,
      story: siteConfig.businessMenu.story,
      cta: siteConfig.businessMenu.cta,
    },
    developers: {
      id: "developers-menu",
      className: " developers-menu-card",
      contentClassName: "developers-menu-content",
      featured: siteConfig.developersMenu.featured,
      groups: siteConfig.developersMenu.columns,
      story: siteConfig.developersMenu.story,
      cta: siteConfig.developersMenu.cta,
    },
    resources: {
      id: "resources-menu",
      className: " resources-menu-card",
      contentClassName: "resources-menu-content",
      featured: siteConfig.resourcesMenu.featured,
      groups: siteConfig.resourcesMenu.columns,
      story: siteConfig.resourcesMenu.story,
      cta: siteConfig.resourcesMenu.cta,
    },
    company: {
      id: "company-menu",
      className: " company-menu-card",
      contentClassName: "company-menu-content",
      featured: siteConfig.companyMenu.featured,
      groups: siteConfig.companyMenu.columns,
      story: siteConfig.companyMenu.story,
      cta: null,
    },
  };

  function closeMenus() {
    setIsMenuOpen(false);
    setActiveMegaMenu(null);
  }

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 12);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setActiveMegaMenu(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveMegaMenu(null);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header
      className={`site-header${isScrolled ? " site-header--scrolled" : ""}`}
      ref={headerRef}
    >
      <div className="header-bar">
        <div className="header-brand">
          <BrandLogo />
        </div>

        <nav
          className={`main-nav${isMenuOpen ? " main-nav--open" : ""}`}
          aria-label="Main navigation"
        >
          {siteConfig.headerLinks.map((link) => {
            const menuKey = megaMenuLabels[link.label];

            return menuKey ? (
              <div className="nav-menu" key={link.href}>
                <button
                  className={`nav-link nav-link--menu nav-link--button${
                    activeMegaMenu === menuKey ? " nav-link--active" : ""
                  }`}
                  type="button"
                  aria-expanded={activeMegaMenu === menuKey}
                  aria-controls={megaMenus[menuKey].id}
                  onClick={() =>
                    setActiveMegaMenu((current) => (current === menuKey ? null : menuKey))
                  }
                >
                  {link.label}
                </button>
              </div>
            ) : (
              <a
                className={link.hasMenu ? "nav-link nav-link--menu" : "nav-link"}
                key={link.href}
                href={link.href}
                onClick={closeMenus}
              >
                {link.label}
              </a>
            );
          })}
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

      {(["product", "business", "developers", "resources", "company"] as const).map((menuKey) => {
        const menu = megaMenus[menuKey];

        return (
          <div
            className={`product-menu-card${menu.className}${
              activeMegaMenu === menuKey ? " product-menu-card--open" : ""
            }`}
            id={menu.id}
            key={menuKey}
          >
            <a className="product-menu-featured" href={menu.featured.href} onClick={closeMenus}>
              <span>{menu.featured.title}</span>
              <p>{menu.featured.body}</p>
            </a>

            <div className={menu.contentClassName}>
              {menu.groups.map((group) => (
                <div className="product-menu-group" key={group.title}>
                  <h2>{group.title}</h2>
                  {group.links.map((item) => (
                    <a href={item.href} key={item.label} onClick={closeMenus}>
                      {"icon" in item ? (
                        <span className="menu-link-icon" aria-hidden="true">
                          {item.icon}
                        </span>
                      ) : null}
                      {item.label}
                    </a>
                  ))}
                </div>
              ))}

              {"story" in menu ? (
                <a className="business-menu-story" href={menu.story.href} onClick={closeMenus}>
                  <span>{menu.story.title}</span>
                  <p>{menu.story.body}</p>
                </a>
              ) : null}
            </div>

            {menu.cta ? (
              <a className="product-menu-cta" href={menu.cta.href} onClick={closeMenus}>
                {menu.cta.label}
              </a>
            ) : null}
          </div>
        );
      })}
    </header>
  );
}
