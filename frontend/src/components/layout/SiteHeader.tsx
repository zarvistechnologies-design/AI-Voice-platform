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
    developers: {
      id: "developers-menu",
      variant: "developers",
      featured: siteConfig.developersMenu.featured,
      groups: siteConfig.developersMenu.columns,
      story: siteConfig.developersMenu.story,
      cta: siteConfig.developersMenu.cta,
    },
    resources: {
      id: "resources-menu",
      variant: "resources",
      featured: siteConfig.resourcesMenu.featured,
      groups: siteConfig.resourcesMenu.columns,
      story: siteConfig.resourcesMenu.story,
      cta: siteConfig.resourcesMenu.cta,
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
      className={`pointer-events-none fixed right-0 left-0 z-50 transition-all duration-200 max-[1180px]:top-2 max-[1180px]:px-[clamp(12px,4vw,28px)] max-[560px]:px-2.5 ${
        isScrolled
          ? "top-2 px-[clamp(16px,5vw,72px)]"
          : "top-3.5 px-[clamp(14px,3vw,36px)]"
      }`}
      ref={headerRef}
    >
      <div
        className={`pointer-events-auto relative mx-auto grid w-full grid-cols-[minmax(150px,0.9fr)_auto_minmax(170px,0.9fr)] items-center gap-2.5 rounded-full border border-slate-200/80 bg-white/82 py-[7px] pr-2 pl-3.5 text-slate-950 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur-2xl transition-all duration-200 max-[1180px]:grid-cols-[minmax(0,1fr)_auto_auto] max-[1180px]:min-h-[54px] max-[1180px]:max-w-[1040px] max-[560px]:min-h-[52px] max-[560px]:gap-[7px] max-[560px]:p-[7px] dark:border-[#71349b]/55 dark:bg-[#080112]/70 dark:text-[#f6f1ff] dark:shadow-[0_18px_55px_rgba(4,1,10,0.46)] ${
          isScrolled
            ? "min-h-[50px] max-w-[1180px]"
            : "min-h-14 max-w-[1280px]"
        }`}
      >
        <div className="flex min-w-0 items-center">
          <BrandLogo />
        </div>

        <nav
          className={`flex items-center justify-center gap-0.5 whitespace-nowrap text-[0.78rem] font-bold text-slate-700 max-[1180px]:absolute max-[1180px]:top-[calc(100%+8px)] max-[1180px]:right-0 max-[1180px]:left-0 max-[1180px]:flex-col max-[1180px]:items-stretch max-[1180px]:justify-start max-[1180px]:gap-[3px] max-[1180px]:whitespace-normal max-[1180px]:rounded-[22px] max-[1180px]:border max-[1180px]:border-slate-200 max-[1180px]:bg-white/95 max-[1180px]:p-2 max-[1180px]:shadow-[0_22px_60px_rgba(15,23,42,0.16)] max-[1180px]:backdrop-blur-2xl dark:text-[#f6f1ff] dark:max-[1180px]:border-[#71349b]/80 dark:max-[1180px]:bg-[linear-gradient(180deg,#111827_0%,#1f2937_48%,#111827_100%)] dark:max-[1180px]:shadow-[0_22px_60px_rgba(4,1,10,0.5)] ${
            isMenuOpen ? "max-[1180px]:flex" : "max-[1180px]:hidden"
          }`}
          aria-label="Main navigation"
        >
          {siteConfig.headerLinks.map((link) => {
            const menuKey = megaMenuLabels[link.label];

            return menuKey ? (
              <div className="inline-flex max-[1180px]:w-full" key={link.href}>
                <button
                  className={`inline-flex min-h-8 items-center gap-[5px] rounded-full border-0 bg-transparent px-[9px] text-left font-inherit text-inherit transition max-[1180px]:min-h-10 max-[1180px]:w-full max-[1180px]:justify-between max-[1180px]:px-3 ${
                    activeMegaMenu === menuKey
                      ? "!bg-teal-50 !text-[#0f766e] dark:!bg-[#26063b] dark:!text-[#b34cff]"
                      : "hover:bg-teal-50 hover:text-[#0f766e] dark:hover:bg-[#26063b] dark:hover:text-[#b34cff]"
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
                className="inline-flex min-h-8 items-center gap-[5px] rounded-full px-[9px] text-slate-700 transition hover:bg-teal-50 hover:text-[#0f766e] max-[1180px]:min-h-10 max-[1180px]:w-full max-[1180px]:justify-between max-[1180px]:px-3 dark:text-[#f6f1ff] dark:hover:bg-[#26063b] dark:hover:text-[#b34cff]"
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
                  ? "border border-[#00ADB5]/40 bg-[#00ADB5] text-slate-950 shadow-[0_12px_26px_rgba(0,173,181,0.22)] max-[560px]:hidden dark:border-[#71349b] dark:bg-gradient-to-br dark:from-[#6a00a8] dark:to-[#6a00a8] dark:text-white"
                  : "text-slate-700 max-[1180px]:hidden hover:text-[#0f766e] dark:text-[#f6f1ff] dark:hover:text-[#b34cff]"
              }`}
              href={action.href}
              key={action.label}
            >
              {action.label}
            </a>
          ))}
        </div>

        <button
          className="hidden size-[38px] place-items-center rounded-full border border-slate-200 bg-slate-100 text-slate-800 max-[1180px]:grid dark:border-[#71349b] dark:bg-[#26063b] dark:text-[#f6f1ff]"
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

      {(["product", "business", "developers", "resources", "company"] as const).map((menuKey) => {
        const menu = megaMenus[menuKey];
        const isCompanyMenu = menu.variant === "company";
        const isWideMenu =
          menu.variant === "business" ||
          menu.variant === "developers" ||
          menu.variant === "resources";
        const contentColumns =
          menu.variant === "developers"
            ? "min-[1181px]:grid-cols-[minmax(260px,0.9fr)_minmax(280px,1fr)] min-[1181px]:gap-[clamp(60px,14vw,320px)]"
            : menu.variant === "product"
              ? "min-[1181px]:grid-cols-3 min-[1181px]:gap-[clamp(18px,4vw,64px)]"
              : "min-[1181px]:grid-cols-[minmax(180px,1fr)_minmax(170px,0.9fr)_minmax(220px,1.05fr)] min-[1181px]:gap-[clamp(20px,3vw,54px)]";

        return (
          <div
            className={`absolute top-[calc(100%+12px)] right-[clamp(14px,3vw,36px)] left-[clamp(14px,3vw,36px)] mx-auto grid min-h-[284px] grid-cols-[minmax(190px,0.3fr)_minmax(0,1fr)] gap-[clamp(16px,2.4vw,28px)] rounded-lg border border-slate-200 bg-white/95 p-1.5 shadow-[0_26px_80px_rgba(15,23,42,0.18)] backdrop-blur-2xl transition-all duration-200 max-[1180px]:top-[calc(100%+262px)] max-[1180px]:right-0 max-[1180px]:left-0 max-[1180px]:hidden max-[1180px]:min-h-0 max-[1180px]:w-[min(100%,1040px)] max-[1180px]:grid-cols-1 max-[1180px]:gap-3.5 max-[1180px]:rounded-[22px] max-[1180px]:p-2 dark:border-[#71349b]/70 dark:bg-[linear-gradient(180deg,#111827_0%,#1f2937_48%,#111827_100%)] dark:shadow-[0_26px_80px_rgba(0,0,0,0.48)] ${
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
              className={`relative flex min-h-[272px] flex-col justify-between overflow-hidden rounded-md bg-gradient-to-br from-[#6a00a8] to-[#4c1bbb] px-[18px] py-5 text-white max-[1180px]:min-h-[124px] max-[1180px]:p-[15px] ${
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
                  className="border-t border-slate-200 p-2.5 min-[1181px]:border-0 min-[1181px]:p-0 dark:border-[#71349b]/70"
                  key={group.title}
                >
                  <h2 className="m-0 mb-2 text-[0.78rem] font-bold text-[#0f766e] min-[1181px]:mb-[22px] dark:text-[#b34cff]">
                    {group.title}
                  </h2>
                  {group.links.map((item) => (
                    <a
                      className={`mt-2 flex items-center gap-3.5 text-[0.9rem] leading-[1.2] font-medium text-slate-700 transition hover:translate-x-[3px] hover:text-[#0f766e] min-[1181px]:mt-[13px] min-[1181px]:text-[clamp(0.9rem,1.3vw,1.08rem)] dark:text-[#f6f1ff] dark:hover:text-[#b34cff] ${
                        "icon" in item ? "" : "block"
                      }`}
                      href={item.href}
                      key={item.label}
                      onClick={closeMenus}
                    >
                      {"icon" in item ? (
                        <span
                          className="grid size-7 min-w-7 place-items-center text-[0.9rem] font-bold text-[#0f766e] dark:text-[#f6f1ff]"
                          aria-hidden="true"
                        >
                          {item.icon}
                        </span>
                      ) : null}
                      {item.label}
                    </a>
                  ))}
                </div>
              ))}

              {"story" in menu ? (
                <a
                  className="block border-t border-slate-200 p-2.5 text-slate-950 min-[1181px]:border-0 min-[1181px]:p-0 dark:border-[#71349b]/70 dark:text-[#f6f1ff]"
                  href={menu.story.href}
                  onClick={closeMenus}
                >
                  <span className="mb-2 block text-[0.95rem] leading-[1.15] font-medium min-[1181px]:mb-7 min-[1181px]:text-[clamp(1rem,1.8vw,1.35rem)]">
                    {menu.story.title}
                  </span>
                  <p className="m-0 max-w-[280px] text-[0.78rem] leading-[1.28] font-medium text-slate-500 min-[1181px]:text-[0.9rem] dark:text-[#b9a8d6]">
                    {menu.story.body}
                  </p>
                </a>
              ) : null}
            </div>

            {menu.cta ? (
              <a
                className="inline-flex min-h-[42px] w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-br from-[#ffb26f] to-[#d08cff] px-4 text-[0.86rem] font-semibold text-[#13071e] min-[1181px]:absolute min-[1181px]:right-1.5 min-[1181px]:bottom-1.5 min-[1181px]:min-h-[52px] min-[1181px]:w-[min(224px,calc(100%-32px))] min-[1181px]:text-[0.92rem]"
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
    </header>
  );
}
