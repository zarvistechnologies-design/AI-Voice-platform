"use client";

import { useEffect, useRef, useState } from "react";

import { BrandLogo } from "@/components/ui/BrandLogo";
import { siteConfig } from "@/config/site";

type MegaMenuKey = "product" | "business" | "company";

const megaMenuLabels: Record<string, MegaMenuKey> = {
  Product: "product",
  "For Business": "business",
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
      variant: "product",
      featured: siteConfig.productMenu.featured,
      groups: siteConfig.productMenu.groups,
      cta: siteConfig.productMenu.cta,
    },
    business: {
      id: "business-menu",
      variant: "business",
      featured: siteConfig.businessMenu.featured,
      groups: siteConfig.businessMenu.columns,
      story: siteConfig.businessMenu.story,
      cta: siteConfig.businessMenu.cta,
    },
    company: {
      id: "company-menu",
      variant: "company",
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
      className={`vozon-site-header pointer-events-none fixed right-0 left-0 z-50 transition-all duration-200 max-[1180px]:top-2 max-[1180px]:px-[clamp(12px,4vw,28px)] max-[560px]:px-2.5 ${
        isScrolled
          ? "top-2 px-[clamp(16px,5vw,72px)]"
          : "top-3.5 px-[clamp(14px,3vw,36px)]"
      }`}
      ref={headerRef}
    >
      <div
        className={`pointer-events-auto relative mx-auto flex w-full items-center justify-between gap-2 px-4 py-3 text-white transition-all duration-200 max-[560px]:px-3 xl:grid xl:grid-cols-[minmax(170px,0.9fr)_auto_minmax(190px,0.9fr)] xl:gap-2.5 ${
          isScrolled
            ? "min-h-[58px] max-w-[1220px]"
            : "min-h-[72px] max-w-[1280px]"
        }`}
      >
        <div className="flex min-w-0 items-center">
          <BrandLogo showWebsiteLogo />
        </div>

        <nav
          className={`absolute top-[calc(100%+8px)] right-0 left-0 z-50 flex-col items-stretch justify-start gap-[3px] rounded-lg border border-white/10 bg-[#0b1220]/98 p-2 text-[0.78rem] font-bold text-slate-100 shadow-[0_22px_60px_rgba(4,1,10,0.50)] backdrop-blur-2xl xl:static xl:flex xl:flex-row xl:items-center xl:justify-center xl:gap-0.5 xl:whitespace-nowrap xl:border-0 xl:bg-transparent xl:p-0 xl:shadow-none xl:backdrop-blur-none ${
            isMenuOpen ? "flex" : "hidden"
          }`}
          aria-label="Main navigation"
        >
          {siteConfig.headerLinks.map((link) => {
            const menuKey = megaMenuLabels[link.label];

            return menuKey ? (
              <div className="inline-flex max-[1180px]:w-full" key={link.href}>
                <button
                  className={`inline-flex min-h-10 w-full items-center justify-between gap-[5px] rounded-full border-0 bg-transparent px-3 text-left font-inherit text-inherit transition xl:min-h-8 xl:w-auto xl:justify-start xl:px-[9px] ${
                    activeMegaMenu === menuKey
                      ? "!bg-cyan-300/10 !text-cyan-200"
                      : "hover:bg-cyan-300/10 hover:text-cyan-200"
                  }`}
                  type="button"
                  aria-expanded={activeMegaMenu === menuKey}
                  aria-controls={megaMenus[menuKey].id}
                  onClick={() =>
                    setActiveMegaMenu((current) => (current === menuKey ? null : menuKey))
                  }
                >
                  {link.label}
                  <span
                    className="mb-[3px] size-[5px] rotate-45 border-r-[1.3px] border-b-[1.3px] border-current opacity-70"
                    aria-hidden="true"
                  />
                </button>
              </div>
            ) : (
              <a
                className="inline-flex min-h-10 w-full items-center justify-between gap-[5px] rounded-full px-3 text-slate-100 transition hover:bg-cyan-300/10 hover:text-cyan-200 xl:min-h-8 xl:w-auto xl:px-[9px]"
                key={link.href}
                href={link.href}
                onClick={closeMenus}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-1.5">
          {siteConfig.headerActions.map((action) => (
            <a
              className={`inline-flex min-h-[34px] items-center justify-center whitespace-nowrap rounded-full px-3 text-[0.8rem] font-extrabold transition hover:-translate-y-px ${
                action.variant === "secondary"
                  ? "hidden border border-cyan-300/40 bg-[#08b8c8] text-slate-950 shadow-[0_12px_26px_rgba(8,184,200,0.24)] hover:bg-cyan-300 sm:inline-flex"
                  : "hidden text-slate-100 hover:text-cyan-200 xl:inline-flex"
              }`}
              href={action.href}
              key={action.label}
            >
              {action.label}
            </a>
          ))}
        </div>

        <button
          className="grid size-[38px] place-items-center rounded-full border border-white/15 bg-white/5 text-white xl:hidden"
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span className="sr-only">{isMenuOpen ? "Close menu" : "Open menu"}</span>
          <span className="relative block h-4 w-4">
            <span
              className={`absolute top-0 left-0 block h-0.5 w-4 rounded-full bg-current transition ${
                isMenuOpen ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute top-[6px] left-0 block h-0.5 w-4 rounded-full bg-current transition ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute top-3 left-0 block h-0.5 w-4 rounded-full bg-current transition ${
                isMenuOpen ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {(["product", "business", "company"] as const).map((menuKey) => {
        const menu = megaMenus[menuKey];
        const isCompanyMenu = menu.variant === "company";
        const isWideMenu = menu.variant === "business";
        const contentColumns =
          menu.variant === "product"
              ? "min-[1181px]:grid-cols-3 min-[1181px]:gap-[clamp(18px,4vw,64px)]"
              : "min-[1181px]:grid-cols-[minmax(180px,1fr)_minmax(170px,0.9fr)_minmax(220px,1.05fr)] min-[1181px]:gap-[clamp(20px,3vw,54px)]";

        return (
          <div
            className={`absolute top-[calc(100%+12px)] right-[clamp(14px,3vw,36px)] left-[clamp(14px,3vw,36px)] mx-auto grid min-h-[284px] grid-cols-[minmax(190px,0.3fr)_minmax(0,1fr)] gap-[clamp(16px,2.4vw,28px)] rounded-lg border border-white/10 bg-[#0b1220]/96 p-1.5 text-white shadow-[0_26px_80px_rgba(0,0,0,0.48)] backdrop-blur-2xl transition-all duration-200 max-[1180px]:top-[calc(100%+214px)] max-[1180px]:right-0 max-[1180px]:left-0 max-[1180px]:hidden max-[1180px]:min-h-0 max-[1180px]:w-[min(100%,1040px)] max-[1180px]:grid-cols-1 max-[1180px]:gap-3.5 max-[1180px]:rounded-[22px] max-[1180px]:p-2 ${
              isCompanyMenu
                ? "w-[min(calc(100%-clamp(28px,6vw,72px)),720px)] min-[1181px]:min-h-[328px] min-[1181px]:grid-cols-2"
                : isWideMenu
                  ? "w-[min(calc(100%-clamp(28px,6vw,72px)),1280px)]"
                  : "w-[min(calc(100%-clamp(28px,6vw,72px)),1080px)]"
            } ${
              activeMegaMenu === menuKey
                ? "pointer-events-auto translate-y-0 opacity-100 max-[1180px]:grid"
                : "pointer-events-none -translate-y-2 opacity-0"
            }`}
            id={menu.id}
            key={menuKey}
          >
            <a
              className={`relative flex min-h-[272px] flex-col justify-between overflow-hidden rounded-md bg-[#075b66] px-[18px] py-5 text-white max-[1180px]:min-h-[124px] max-[1180px]:p-[15px] ${
                isCompanyMenu ? "min-[1181px]:min-h-[316px]" : ""
              }`}
              href={menu.featured.href}
              onClick={closeMenus}
            >
              <span className="flex items-start justify-between gap-4 text-[clamp(1.45rem,2.4vw,2.25rem)] leading-none font-semibold max-[1180px]:text-[1.35rem]">
                {menu.featured.title}
                <span
                  className="mt-3 size-2 rotate-45 border-t-2 border-r-2 border-current"
                  aria-hidden="true"
                />
              </span>
              <p className="m-0 max-w-[260px] text-[0.82rem] leading-[1.28] font-medium text-white/90 max-[1180px]:text-[0.78rem]">
                {menu.featured.body}
              </p>
            </a>

            <div
              className={`grid gap-1.5 p-0 min-[1181px]:pt-1.5 min-[1181px]:pr-3.5 min-[1181px]:pb-[72px] ${contentColumns} ${
                isCompanyMenu ? "min-[1181px]:block min-[1181px]:pt-5 min-[1181px]:pr-2.5" : ""
              }`}
            >
              {menu.groups.map((group) => (
                <div
                  className="border-t border-white/10 p-2.5 min-[1181px]:border-0 min-[1181px]:p-0"
                  key={group.title}
                >
                  <h2 className="m-0 mb-2 text-[0.78rem] font-bold text-cyan-200 min-[1181px]:mb-[22px]">
                    {group.title}
                  </h2>
                  {group.links.map((item) => (
                    <a
                      className="mt-2 block text-[0.9rem] leading-[1.2] font-medium text-slate-100 transition hover:translate-x-[3px] hover:text-cyan-200 min-[1181px]:mt-[13px] min-[1181px]:text-[clamp(0.9rem,1.3vw,1.08rem)]"
                      href={item.href}
                      key={item.label}
                      onClick={closeMenus}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              ))}

              {"story" in menu ? (
                <a
                  className="block border-t border-white/10 p-2.5 text-white min-[1181px]:border-0 min-[1181px]:p-0"
                  href={menu.story.href}
                  onClick={closeMenus}
                >
                  <span className="mb-2 block text-[0.95rem] leading-[1.15] font-medium min-[1181px]:mb-7 min-[1181px]:text-[clamp(1rem,1.8vw,1.35rem)]">
                    {menu.story.title}
                  </span>
                  <p className="m-0 max-w-[280px] text-[0.78rem] leading-[1.28] font-medium text-slate-300 min-[1181px]:text-[0.9rem]">
                    {menu.story.body}
                  </p>
                </a>
              ) : null}
            </div>

            {menu.cta ? (
              <a
                className="inline-flex min-h-[42px] w-full items-center justify-center gap-3 rounded-lg bg-[#08b8c8] px-4 text-[0.86rem] font-semibold text-slate-950 hover:bg-cyan-300 min-[1181px]:absolute min-[1181px]:right-1.5 min-[1181px]:bottom-1.5 min-[1181px]:min-h-[52px] min-[1181px]:w-[min(224px,calc(100%-32px))] min-[1181px]:text-[0.92rem]"
                href={menu.cta.href}
                onClick={closeMenus}
              >
                {menu.cta.label}
                <span
                  className="size-2 rotate-45 border-t-2 border-r-2 border-current"
                  aria-hidden="true"
                />
              </a>
            ) : null}
          </div>
        );
      })}
      <style>{`
        .vozon-site-header > div:first-of-type {
          border-color: transparent !important;
          background: transparent !important;
          color: rgba(238, 255, 251, 0.95) !important;
          box-shadow: none !important;
        }

        .vozon-site-header nav {
          border-color: rgba(45, 255, 219, 0.14) !important;
          background: rgba(255,255,255,0.05) !important;
          color: rgba(238, 255, 251, 0.76) !important;
        }

        .vozon-site-header a,
        .vozon-site-header button {
          color: inherit !important;
        }

        .vozon-site-header nav a:hover,
        .vozon-site-header nav button:hover {
          background: rgba(31,244,208,0.10) !important;
          color: #61fff0 !important;
        }

        .vozon-site-header a[href="/#contact"] {
          border-color: rgba(31,244,208,0.35) !important;
          background: linear-gradient(135deg, rgba(12,119,139,0.72), rgba(31,244,208,0.22), rgba(57,219,141,0.72)) !important;
          color: #dffff8 !important;
          box-shadow: 0 10px 28px rgba(31,244,208,0.14) !important;
        }

        .vozon-site-header > div[id$="-menu"] {
          border-color: rgba(31,244,208,0.18) !important;
          background: rgba(2, 18, 15, 0.94) !important;
          color: rgba(238, 255, 251, 0.94) !important;
          box-shadow: 0 28px 90px rgba(0,0,0,0.5) !important;
        }

        .vozon-site-header > div[id$="-menu"] > a:first-child {
          background: linear-gradient(135deg, rgba(4,32,27,0.96), rgba(18,137,116,0.5)) !important;
        }

        .vozon-site-header > div[id$="-menu"] p,
        .vozon-site-header > div[id$="-menu"] a {
          color: rgba(238, 255, 251, 0.72) !important;
        }

        .vozon-site-header > div[id$="-menu"] h2 {
          color: #61fff0 !important;
        }

        .vozon-site-header > div[id$="-menu"] a:hover {
          color: #61fff0 !important;
        }
      `}</style>
    </header>
  );
}
