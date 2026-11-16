"use client";

import Link from "next/link";
import "@/components/sections/PublicMarketingAccent.css";
import { useEffect, useRef, useState } from "react";

import { BrandLogo } from "@/components/ui/BrandLogo";
import { siteConfig } from "@/config/site";

type MenuKey = "product" | "business" | "company";

const menus = {
  product: {
    label: "Products",
    badge: "AI Voice Engine",
    intro: siteConfig.productMenu.featured,
    groups: siteConfig.productMenu.groups,
  },
  business: {
    label: "Solutions",
    badge: "Industries",
    intro: siteConfig.businessMenu.featured,
    groups: siteConfig.businessMenu.columns,
  },
  company: {
    label: "Company",
    badge: "Vozon AI",
    intro: siteConfig.companyMenu.featured,
    groups: [
      {
        title: "About Vozon",
        links: [
          { href: "/about", label: "About us", desc: "Our vision & team" },
          { href: "/career", label: "Careers", desc: "We're hiring!" },
          { href: "/partners", label: "White Label Partners", desc: "Reseller program" },
          { href: "/resources/blog", label: "Blog & Insights", desc: "Latest Voice AI updates" },
          { href: "/contact", label: "Contact us", desc: "24/7 dedicated support" },
        ],
      },
    ],
  },
} as const;

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeAll = () => {
    setActiveMenu(null);
    setMobileOpen(false);
  };


  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) closeAll();
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAll();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  return (
      <div className={`fixed inset-x-0 top-0 z-[100] public-accent-header`}>
        <header className="relative flex h-[70px] w-full items-center justify-between border-b border-slate-200/80 bg-[#f3f5fc] px-[7.5%]" ref={headerRef}>
          <div className="landing-header-logo flex items-center" onClick={closeAll}>
            <BrandLogo compact showWebsiteLogo />
          </div>
          <nav aria-label="Main navigation" className="hidden items-center gap-5 text-[13px] font-medium text-slate-800 lg:flex">
            <Link className="hover:text-black" href="/" onClick={closeAll}>Home</Link>
            {(["product", "business"] as const).map((key) => (
              <button aria-expanded={activeMenu === key} className="hover:text-black" key={key} onClick={() => setActiveMenu(activeMenu === key ? null : key)} type="button">{menus[key].label}</button>
            ))}
            <Link className="hover:text-black" href="/integrations" onClick={closeAll}>Integrations</Link>
            <Link className="hover:text-black" href="/pricing" onClick={closeAll}>Pricing</Link>
            <button aria-expanded={activeMenu === "company"} className="hover:text-black" onClick={() => setActiveMenu(activeMenu === "company" ? null : "company")} type="button">Company</button>
          </nav>
          <div className="hidden items-center gap-3 text-[12px] font-medium md:flex">
            <Link className="px-3 py-2 text-slate-800 hover:text-black" href="/login">Login</Link>
            <Link className="rounded-full bg-white px-4 py-2 text-slate-800 shadow-sm hover:bg-[#EEF3FF] hover:text-[#2457D6]" href="/contact">Contact sales</Link>
            <Link className="public-header-start rounded-full bg-black px-4 py-2 text-white shadow-sm hover:bg-neutral-800" href="/login">Start for free</Link>
          </div>
          <button aria-label={mobileOpen ? "Close menu" : "Open menu"} className="rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-800 md:hidden" onClick={() => setMobileOpen(!mobileOpen)} type="button">{mobileOpen ? "Close" : "Menu"}</button>
          {activeMenu ? (
            <div className="absolute left-1/2 top-full z-50 hidden w-[min(1000px,calc(100vw-32px))] -translate-x-1/2 rounded-b-2xl border border-slate-200 bg-white p-5 shadow-xl lg:block">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {menus[activeMenu].groups.map((group) => (
                  <section key={group.title}>
                    <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">{group.title}</h3>
                    <div className="flex flex-col gap-1">
                      {group.links.map((item) => <Link className="rounded-lg px-2 py-1.5 text-[13px] font-medium text-slate-700 hover:bg-[#EEF3FF] hover:text-[#2457D6]" href={item.href} key={item.href} onClick={closeAll}>{item.label}</Link>)}
                    </div>
                  </section>
                ))}
              </div>
              <Link className="mt-4 inline-block text-xs font-semibold text-[#2457D6] hover:underline" href={menus[activeMenu].intro.href} onClick={closeAll}>Explore all {menus[activeMenu].label.toLowerCase()} →</Link>
            </div>
          ) : null}
          {mobileOpen ? <nav aria-label="Mobile navigation" className="absolute left-3 right-3 top-full z-50 flex max-h-[calc(100vh-70px)] flex-col gap-3 overflow-y-auto rounded-b-xl border border-slate-200 bg-white p-4 text-sm shadow-xl lg:hidden">
            <Link href="/" onClick={closeAll}>Home</Link><Link href="/integrations" onClick={closeAll}>Integrations</Link><Link href="/pricing" onClick={closeAll}>Pricing</Link>
            {(["product", "business", "company"] as const).map((key) => <section className="border-t border-slate-100 pt-2" key={key}><h3 className="mb-1 font-semibold">{menus[key].label}</h3>{menus[key].groups.flatMap((group) => group.links).map((item) => <Link className="block py-1 text-slate-600" href={item.href} key={item.href} onClick={closeAll}>{item.label}</Link>)}</section>)}
            <Link className="border-t border-slate-100 pt-2" href="/login" onClick={closeAll}>Login · Start for free</Link><Link href="/contact" onClick={closeAll}>Contact sales</Link>
          </nav> : null}
        </header>
      </div>
    );
}
