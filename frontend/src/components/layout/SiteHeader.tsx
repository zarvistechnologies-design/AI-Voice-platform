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
      className="vozon-site-header pointer-events-none fixed top-0 right-0 left-0 z-50 px-3 transition-all duration-200 sm:px-5 max-[560px]:px-2.5"
      ref={headerRef}
    >
      <div
        className={`pointer-events-auto relative flex w-full items-center justify-between gap-2 px-2 py-3 text-white transition-all duration-200 max-[560px]:px-1.5 xl:grid xl:grid-cols-[minmax(170px,0.9fr)_auto_minmax(190px,0.9fr)] xl:gap-2.5 ${
          isScrolled
            ? "min-h-[58px]"
            : "min-h-[72px]"
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
  /* HEADER*/

  .vozon-site-header {
    --header-text: #ffffff;
    --header-muted: rgba(255, 255, 255, 0.92);

    pointer-events: none;
    background: #000000;
  }

  .vozon-site-header > div:first-of-type {
    position: relative;

    min-height: 58px !important;

    /* NO OUTER BORDER */
    border: 0 !important;
    border-width: 0 !important;
    border-style: none !important;
    border-color: transparent !important;

    border-radius: 18px !important;

    background: #000000 !important;

    color: #ffffff !important;

    /* KEEP SHADOW / REMOVE INNER TOP LINE */
    box-shadow:
      0 12px 40px rgba(0, 0, 0, 0.24),
      0 0 45px rgba(69, 221, 206, 0.035) !important;

    backdrop-filter:
      blur(18px) saturate(120%);

    -webkit-backdrop-filter:
      blur(18px) saturate(120%);

    overflow: visible;
  }

  .vozon-site-header > div:first-of-type::before {
    content: "";

    position: absolute;

    left: 12%;
    right: 12%;
    bottom: -18px;

    height: 36px;

    border: 0 !important;

    background:
      radial-gradient(
        ellipse,
        rgba(69, 221, 206, 0.09),
        rgba(69, 221, 206, 0.02) 40%,
        transparent 72%
      );

    filter: blur(16px);

    pointer-events: none;

    z-index: -1;
  }
  .vozon-site-header > div:first-of-type::after {
    content: none !important;

    display: none !important;

    border: 0 !important;

    background: none !important;

    box-shadow: none !important;
  }
  .vozon-site-header nav {
    
    border: 0 !important;
    border-width: 0 !important;
    border-style: none !important;
    border-color: transparent !important;

    border-radius: 999px !important;

    background:
      rgba(255, 255, 255, 0.015) !important;

    color:
      #ffffff !important;

    padding:
      3px !important;

    /* NO INNER LINE / SHADOW */
    box-shadow:
      none !important;

    backdrop-filter:
      blur(10px);

    -webkit-backdrop-filter:
      blur(10px);
  }


  /* NAVIGATION TEXT*/

  .vozon-site-header nav a,
  .vozon-site-header nav button {
    min-height:
      34px;

    border-radius:
      999px;

    padding-left:
      13px;

    padding-right:
      13px;

    color:
      #ffffff !important;

    font-weight:
      600 !important;

    text-shadow:
      none !important;

    transition:
      background 180ms ease,
      color 180ms ease,
      transform 180ms ease;
  }


  /* NAVIGATION HOVER */

  .vozon-site-header nav a:hover,
  .vozon-site-header nav button:hover {
    background:
      rgba(97, 255, 240, 0.055) !important;

    color:
      #61fff0 !important;

    transform:
      translateY(-1px);

    box-shadow:
      none !important;
  }


  /* ACTIVE DROPDOWN BUTTON */

  .vozon-site-header nav button[aria-expanded="true"] {
    background:
      rgba(97, 255, 240, 0.07) !important;

    color:
      #61fff0 !important;

    box-shadow:
      none !important;
  }


  /* LOGIN + CONTACT SALES BUTTONS */

  .vozon-site-header a[href="/login"],
  .vozon-site-header a[href="/contact"] {
    position:
      relative;

    overflow:
      hidden;

    min-height:
      34px !important;

    display:
      inline-flex !important;

    align-items:
      center !important;

    justify-content:
      center !important;

    padding-left:
      15px !important;

    padding-right:
      15px !important;

    border:
      1px solid rgba(97, 255, 240, 0.18) !important;

    border-radius:
      9px !important;

    background:
      linear-gradient(
        135deg,
        rgba(97, 255, 240, 0.90),
        rgba(57, 219, 141, 0.90)
      ) !important;

    color:
      #031d18 !important;

    font-weight:
      800 !important;

    box-shadow:
      0 5px 20px rgba(69, 221, 206, 0.08) !important;

    transition:
      transform 180ms ease,
      box-shadow 180ms ease,
      filter 180ms ease !important;
  }


  /* BUTTON SHINE */

  .vozon-site-header a[href="/login"]::before,
  .vozon-site-header a[href="/contact"]::before {
    content:
      "";

    position:
      absolute;

    top:
      0;

    left:
      -100%;

    width:
      55%;

    height:
      100%;

    background:
      linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.25),
        transparent
      );

    transform:
      skewX(-20deg);

    transition:
      left 500ms ease;

    pointer-events:
      none;
  }


  .vozon-site-header a[href="/login"]:hover::before,
  .vozon-site-header a[href="/contact"]:hover::before {
    left:
      140%;
  }


  /*   BUTTON HOVER*/

  .vozon-site-header a[href="/login"]:hover,
  .vozon-site-header a[href="/contact"]:hover {
    transform:
      translateY(-2px) !important;

    filter:
      brightness(1.06);

    box-shadow:
      0 0 20px rgba(97, 255, 240, 0.14),
      0 8px 24px rgba(31, 244, 208, 0.10) !important;
  }


  .vozon-site-header a[href="/login"]:active,
  .vozon-site-header a[href="/contact"]:active {
    transform:
      translateY(0) !important;
  }


  /*DROPDOWN MENUS */

  .vozon-site-header > div[id$="-menu"] {
    position:
      absolute;

    border:
      1px solid rgba(97, 255, 240, 0.13) !important;

    border-radius:
      15px !important;

    background:
      linear-gradient(
        180deg,
        rgba(5, 20, 17, 0.96),
        rgba(2, 12, 10, 0.95)
      ) !important;

    color:
      rgba(238, 255, 251, 0.94) !important;

    box-shadow:
      0 28px 90px rgba(0, 0, 0, 0.50) !important;

    backdrop-filter:
      blur(18px);

    -webkit-backdrop-filter:
      blur(18px);
  }


  /*FEATURED DROPDOWN CARD */

  .vozon-site-header
    > div[id$="-menu"]
    > a:first-child {

    background:
      linear-gradient(
        135deg,
        rgba(4, 32, 27, 0.96),
        rgba(18, 137, 116, 0.46)
      ) !important;

    border-radius:
      11px !important;

    border:
      1px solid rgba(31, 244, 208, 0.09);

    box-shadow:
      none !important;

    transition:
      border-color 180ms ease,
      transform 180ms ease;
  }


  .vozon-site-header
    > div[id$="-menu"]
    > a:first-child:hover {

    border-color:
      rgba(31, 244, 208, 0.20);

    transform:
      translateY(-1px);

    box-shadow:
      none !important;
  }


  /* DROPDOWN TEXT */

  .vozon-site-header
    > div[id$="-menu"]
    p {

    color:
      rgba(238, 255, 251, 0.72) !important;

    line-height:
      1.55 !important;

    margin-top:
      7px !important;
  }


  .vozon-site-header
    > div[id$="-menu"]
    h2 {

    color:
      #61fff0 !important;

    letter-spacing:
      0.075em;

    margin-bottom:
      10px !important;
  }


  .vozon-site-header
    > div[id$="-menu"]
    a {

    color:
      rgba(238, 255, 251, 0.72) !important;

    transition:
      color 160ms ease,
      background 160ms ease,
      transform 160ms ease;
  }


  .vozon-site-header
    > div[id$="-menu"]
    a:hover {

    color:
      #61fff0 !important;

    transform:
      translateX(2px);
  }


  /*BUSINESS MENU */

  .vozon-site-header
    > div[id="business-menu"] {

    padding:
      15px !important;

    border-radius:
      15px !important;

    background:
      rgba(2, 18, 15, 0.94) !important;
  }


  .vozon-site-header
    > div[id="business-menu"]
    > div:nth-child(2) {

    column-gap:
      20px !important;

    row-gap:
      12px !important;
  }


  /*BUSINESS GROUPS */

  .vozon-site-header
    > div[id="business-menu"]
    > div:nth-child(2)
    > div {

    padding-top:
      3px !important;

    padding-bottom:
      3px !important;
  }


  /* PLAN YOUR ROLLOUT CARD*/

  .vozon-site-header
    > div[id="business-menu"]
    > div:nth-child(2)
    > a:last-child {

    display:
      flex !important;

    flex-direction:
      column !important;

    align-items:
      flex-start !important;

    justify-content:
      flex-start !important;

    gap:
      7px !important;

    width:
      100% !important;

    min-width:
      205px !important;

    margin:
      0 !important;

    padding:
      14px 15px !important;

    border:
      1px solid rgba(75, 130, 104, 0.12) !important;

    border-radius:
      11px !important;

    background:
      rgba(7, 22, 18, 0.62) !important;

    color:
      rgba(235, 245, 240, 0.88) !important;

    box-shadow:
      none !important;

    transform:
      none !important;

    transition:
      background 180ms ease,
      border-color 180ms ease !important;
  }


  /* PLAN YOUR ROLLOUT TITLE*/

  .vozon-site-header
    > div[id="business-menu"]
    > div:nth-child(2)
    > a:last-child
    > span {

    display:
      block !important;

    width:
      100% !important;

    margin:
      0 !important;

    padding:
      0 !important;

    color:
      rgba(151, 204, 182, 0.82) !important;

    font-size:
      0.82rem !important;

    line-height:
      1.3 !important;

    font-weight:
      700 !important;

    text-align:
      left !important;
  }


  /*PLAN YOUR ROLLOUT DESCRIPTION */

  .vozon-site-header
    > div[id="business-menu"]
    > div:nth-child(2)
    > a:last-child
    > p {

    display:
      block !important;

    width:
      100% !important;

    max-width:
      245px !important;

    margin:
      0 !important;

    padding:
      0 !important;

    color:
      rgba(215, 229, 222, 0.72) !important;

    font-size:
      0.76rem !important;

    line-height:
      1.5 !important;

    font-weight:
      500 !important;

    text-align:
      left !important;
  }


  /* PLAN YOUR ROLLOUT HOVER */

  .vozon-site-header
    > div[id="business-menu"]
    > div:nth-child(2)
    > a:last-child:hover {

    background:
      rgba(9, 27, 22, 0.72) !important;

    border-color:
      rgba(75, 130, 104, 0.18) !important;

    color:
      rgba(235, 245, 240, 0.90) !important;

    transform:
      none !important;
  }


  .vozon-site-header
    > div[id="business-menu"]
    > div:nth-child(2)
    > a:last-child:hover
    > span {

    color:
      rgba(161, 211, 191, 0.88) !important;
  }


  .vozon-site-header
    > div[id="business-menu"]
    > div:nth-child(2)
    > a:last-child:hover
    > p {

    color:
      rgba(220, 232, 226, 0.76) !important;
  }


  /* BUSINESS MENU LINKS*/

  .vozon-site-header
    > div[id="business-menu"]
    > div:nth-child(2)
    > div
    a {

    border-radius:
      8px !important;

    transition:
      background 160ms ease,
      color 160ms ease,
      transform 160ms ease;
  }


  .vozon-site-header
    > div[id="business-menu"]
    > div:nth-child(2)
    > div
    a:hover {

    background:
      rgba(97, 255, 240, 0.04) !important;

    color:
      #61fff0 !important;

    transform:
      translateX(1px);
  }


  /* PRODUCT MENU*/

  .vozon-site-header
    > div[id="product-menu"]
    > div {

    row-gap:
      14px;

    column-gap:
      24px;
  }


  .vozon-site-header
    > div[id="product-menu"]
    > div
    > div {

    padding-top:
      3px;

    padding-bottom:
      3px;
  }


  /* COMPANY MENU*/

  .vozon-site-header
    > div[id="company-menu"]
    > div {

    row-gap:
      14px;

    column-gap:
      24px;
  }


  /* DROPDOWN BOTTOM CTA */

  .vozon-site-header
    > div[id$="-menu"]
    > a:last-child {

    position:
      absolute !important;

    right:
      10px !important;

    bottom:
      10px !important;

    width:
      170px !important;

    min-height:
      36px !important;

    display:
      inline-flex !important;

    align-items:
      center !important;

    justify-content:
      center !important;

    border-radius:
      8px !important;

    border:
      1px solid rgba(97, 255, 240, 0.30) !important;

    background:
      linear-gradient(
        135deg,
        #61fff0,
        #39db8d
      ) !important;

    color:
      #04251f !important;

    font-size:
      0.72rem !important;

    font-weight:
      800 !important;

    box-shadow:
      0 6px 18px rgba(31, 244, 208, 0.08) !important;

    transition:
      transform 180ms ease,
      box-shadow 180ms ease,
      filter 180ms ease !important;
  }


  .vozon-site-header
    > div[id$="-menu"]
    > a:last-child:hover {

    transform:
      translateY(-2px) !important;

    filter:
      brightness(1.05);

    box-shadow:
      0 0 20px rgba(97, 255, 240, 0.14),
      0 9px 24px rgba(31, 244, 208, 0.10) !important;
  }


  /*TABLET*/

  @media (max-width: 1180px) {

    .vozon-site-header nav {

      /* INNER BORDER REMOVED ON TABLET TOO */
      border:
        0 !important;

      border-width:
        0 !important;

      border-style:
        none !important;

      border-color:
        transparent !important;

      border-radius:
        14px;

      padding:
        5px !important;

      background:
        rgba(0, 0, 0, 0.55) !important;

      box-shadow:
        none !important;
    }


    .vozon-site-header
      nav
      a,
    .vozon-site-header
      nav
      button {

      min-height:
        40px;

      border-radius:
        9px;

      padding-left:
        14px;

      padding-right:
        14px;

      color:
        #ffffff !important;

      font-weight:
        600 !important;
    }


    .vozon-site-header
      > div[id$="-menu"] {

      border-radius:
        14px !important;

      background:
        rgba(2, 18, 15, 0.96) !important;
    }


    .vozon-site-header
      > div[id="business-menu"] {

      padding:
        13px !important;
    }


    .vozon-site-header
      > div[id="business-menu"]
      > div:nth-child(2) {

      row-gap:
        10px !important;

      column-gap:
        16px !important;
    }
  }


  /*MOBILE */

  @media (max-width: 560px) {

    .vozon-site-header {

      padding-left:
        7px;

      padding-right:
        7px;
    }


    .vozon-site-header
      > div:first-of-type {

      min-height:
        50px !important;

      /* OUTER BORDER REMOVED ON MOBILE */
      border:
        0 !important;

      border-width:
        0 !important;

      border-style:
        none !important;

      border-color:
        transparent !important;

      border-radius:
        14px !important;

      background: #000000 !important;

      box-shadow:
        0 0 15px rgba(69, 221, 206, 0.035),
        0 6px 22px rgba(0, 0, 0, 0.30) !important;

      backdrop-filter:
        blur(16px);
    }

    .vozon-site-header nav {

      border:
        0 !important;

      border-width:
        0 !important;

      border-style:
        none !important;

      border-color:
        transparent !important;

      box-shadow:
        none !important;
    }


    .vozon-site-header
      > div:first-of-type
      > div:last-child {

      gap:
        5px;
    }


    .vozon-site-header
      > div[id="business-menu"] {

      padding:
        12px !important;
    }


    .vozon-site-header
      > div[id="business-menu"]
      > div:nth-child(2) {

      row-gap:
        9px !important;

      column-gap:
        12px !important;
    }


    /* Mobile rollout card */

    .vozon-site-header
      > div[id="business-menu"]
      > div:nth-child(2)
      > a:last-child {

      min-width:
        0 !important;

      width:
        100% !important;

      padding:
        12px !important;
    }


    .vozon-site-header
      > div[id="business-menu"]
      > div:nth-child(2)
      > a:last-child
      > p {

      max-width:
        none !important;

      font-size:
        0.74rem !important;
    }


    /* Mobile dropdown CTA */

    .vozon-site-header
      > div[id$="-menu"]
      > a:last-child {

      position:
        relative !important;

      right:
        auto !important;

      bottom:
        auto !important;

      width:
        100% !important;

      margin-top:
        10px !important;
    }

    .vozon-site-header
      a[href="/login"],
    .vozon-site-header
      a[href="/contact"] {

      min-height:
        36px !important;

      padding-left:
        13px !important;

      padding-right:
        13px !important;
    }
  }
  .vozon-site-header
    a:focus-visible,
  .vozon-site-header
    button:focus-visible {

    outline:
      2px solid rgba(97, 255, 240, 0.65);

    outline-offset:
      2px;
  }
  @media (prefers-reduced-motion: reduce) {

    .vozon-site-header *,
    .vozon-site-header *::before,
    .vozon-site-header *::after {

      transition-duration:
        0.01ms !important;

      animation-duration:
        0.01ms !important;

      animation-iteration-count:
        1 !important;
    }
  }

`}</style>
    </header>
  );
}
