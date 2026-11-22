"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { BrandLogo } from "@/components/ui/BrandLogo";
import { integrationCategories, integrations } from "@/config/integrationCatalog";
import { siteConfig } from "@/config/site";

type MenuKey = "product" | "business" | "company" | "integrations";

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
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileIntegrationsOpen, setMobileIntegrationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeAll = () => {
    setActiveMenu(null);
    setMobileOpen(false);
    setMobileIntegrationsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const isCompany = ["/about", "/career", "/partners", "/contact"].some((route) =>
    pathname.startsWith(route)
  );
  const isChangelog = pathname.startsWith("/resources/changelog");
  const isLegalPage = pathname === "/privacy" || pathname === "/terms";
  const hasOpaqueHeader = isChangelog || isLegalPage;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] flex justify-center px-3 pt-2.5 transition-all duration-300 sm:px-6 ${hasOpaqueHeader ? "bg-white pb-2.5 shadow-[0_1px_0_rgba(15,23,42,.08)]" : ""}`}
      ref={headerRef}
    >
      {/* Slim Floating Glass Capsule with Fixed Consistent Dimensions */}
      <div
        className={`relative flex h-[54px] w-full max-w-[1400px] items-center justify-between rounded-full border px-4 transition-all duration-300 sm:px-8 ${
          hasOpaqueHeader
            ? "border-slate-200 bg-white shadow-[0_6px_24px_-6px_rgba(0,0,0,0.1)]"
            : scrolled
            ? "border-slate-200/90 bg-white/95 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] backdrop-blur-2xl"
            : "border-slate-200/70 bg-white/85 shadow-[0_4px_20px_rgba(0,0,0,0.04)] backdrop-blur-xl"
        }`}
      >
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center transition-transform duration-200 hover:scale-[1.02]">
            <BrandLogo compact showWebsiteLogo />
          </div>
        </div>

        {/* Center: Slim Navigation Pills */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-0.5 lg:flex"
        >
          <Link
            className={`rounded-full px-3 py-1 text-[13px] font-medium transition-all duration-150 ${
              pathname === "/"
                ? "bg-slate-900 text-white shadow-xs font-semibold"
                : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
            }`}
            href="/"
            onClick={closeAll}
          >
            Home
          </Link>

          {/* Products Dropdown */}
          <button
            aria-expanded={activeMenu === "product"}
            className={`group flex items-center gap-1 rounded-full px-3 py-1 text-[13px] font-medium transition-all duration-150 ${
              activeMenu === "product" || pathname.startsWith("/product") || pathname.startsWith("/services")
                ? "bg-[#edf7f4] text-[#0e6f62] shadow-xs ring-1 ring-[#cce8e1] font-semibold"
                : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
            }`}
            onClick={() => setActiveMenu(activeMenu === "product" ? null : "product")}
            type="button"
          >
            <span>Products</span>
            <svg
              className={`size-2.5 transition-transform duration-150 ${
                activeMenu === "product" ? "rotate-180 text-emerald-400" : "text-slate-400 group-hover:text-slate-600"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 12 12"
            >
              <path d="m2.5 4.5 3.5 3 3.5-3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Solutions Dropdown */}
          <button
            aria-expanded={activeMenu === "business"}
            className={`group flex items-center gap-1 rounded-full px-3 py-1 text-[13px] font-medium transition-all duration-150 ${
              activeMenu === "business" || pathname.startsWith("/business")
                ? "bg-[#edf7f4] text-[#0e6f62] shadow-xs ring-1 ring-[#cce8e1] font-semibold"
                : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
            }`}
            onClick={() => setActiveMenu(activeMenu === "business" ? null : "business")}
            type="button"
          >
            <span>Solutions</span>
            <svg
              className={`size-2.5 transition-transform duration-150 ${
                activeMenu === "business" ? "rotate-180 text-emerald-400" : "text-slate-400 group-hover:text-slate-600"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 12 12"
            >
              <path d="m2.5 4.5 3.5 3 3.5-3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            aria-expanded={activeMenu === "integrations"}
            aria-controls="header-integrations-menu"
            className={`group flex items-center gap-1 rounded-full px-3 py-1 text-[13px] font-medium transition-all duration-150 ${
              activeMenu === "integrations" || pathname.startsWith("/integrations")
                ? "bg-[#edf7f4] text-[#0e6f62] shadow-xs ring-1 ring-[#cce8e1] font-semibold"
                : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
            }`}
            onClick={() => setActiveMenu(activeMenu === "integrations" ? null : "integrations")}
            type="button"
          >
            <span>Integrations</span>
            <svg aria-hidden="true" className={`size-2.5 transition-transform duration-150 ${activeMenu === "integrations" ? "rotate-180 text-emerald-400" : "text-slate-400 group-hover:text-slate-600"}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 12 12"><path d="m2.5 4.5 3.5 3 3.5-3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>

          <Link
            className={`rounded-full px-3 py-1 text-[13px] font-medium transition-all duration-150 ${
              pathname === "/pricing"
                ? "bg-slate-900 text-white shadow-xs font-semibold"
                : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
            }`}
            href="/pricing"
            onClick={closeAll}
          >
            Pricing
          </Link>

          {/* Company Dropdown */}
          <button
            aria-expanded={activeMenu === "company"}
            className={`group flex items-center gap-1 rounded-full px-3 py-1 text-[13px] font-medium transition-all duration-150 ${
              activeMenu === "company" || isCompany
                ? "bg-[#edf7f4] text-[#0e6f62] shadow-xs ring-1 ring-[#cce8e1] font-semibold"
                : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
            }`}
            onClick={() => setActiveMenu(activeMenu === "company" ? null : "company")}
            type="button"
          >
            <span>Company</span>
            <svg
              className={`size-2.5 transition-transform duration-150 ${
                activeMenu === "company" ? "rotate-180 text-emerald-400" : "text-slate-400 group-hover:text-slate-600"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 12 12"
            >
              <path d="m2.5 4.5 3.5 3 3.5-3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </nav>

        {/* Right: Slim Compact Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            className="hidden px-3 py-1 text-[13px] font-semibold text-slate-700 transition-colors duration-150 hover:text-slate-950 sm:inline-block"
            href="/login"
          >
            Get started
          </Link>

          {/* Slim Gradient Contact Us CTA */}
          <Link
            className="group relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-4 py-1.5 text-[12.5px] font-bold text-white shadow-[0_3px_12px_rgba(16,185,129,0.25)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_4px_16px_rgba(16,185,129,0.4)] active:scale-[0.97]"
            href="/contact"
          >
            <span className="relative z-10">Contact us</span>
            <svg
              className="relative z-10 size-3 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>

          {/* Mobile Toggle */}
          <button
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation"
            className="grid size-8 place-items-center rounded-full border border-slate-200/80 bg-white/80 text-slate-700 shadow-xs transition-colors hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            type="button"
          >
            {mobileOpen ? (
              <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>

        {/* Floating Slim Mega Menu */}
        {activeMenu && activeMenu !== "integrations" ? (
          <div className="absolute left-1/2 top-[calc(100%+8px)] hidden w-[min(900px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.16)] lg:grid lg:grid-cols-[0.75fr_1.25fr] transition-all duration-200">
            {/* Left Feature Card */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#0b7668] bg-gradient-to-br from-[#0b5f55] via-[#0f7668] to-[#148b7b] p-5 shadow-[0_16px_34px_-18px_rgba(7,83,74,0.72),inset_0_1px_0_rgba(255,255,255,0.16)]">
              <span aria-hidden="true" className="absolute -right-12 -top-14 size-36 rounded-full bg-[#6ee7d2]/20 blur-2xl" />
              <span aria-hidden="true" className="absolute -bottom-16 -left-12 size-32 rounded-full bg-[#032f2a]/25 blur-2xl" />
              <div className="relative">
                <div className="mb-4 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/12 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#c8fff3] shadow-sm backdrop-blur-sm">
                  {menus[activeMenu].badge}
                </span>
                  <span className="grid size-9 place-items-center rounded-xl border border-white/25 bg-white/15 text-[#d9fff6] shadow-sm backdrop-blur-sm">
                    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
                      <path d="M4 12h2m2-4v8m3-11v14m3-11v8m3-6v4m3-2h1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                    </svg>
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-bold tracking-tight text-white">
                  {menus[activeMenu].intro.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#d5eee9]">
                  {menus[activeMenu].intro.body}
                </p>
              </div>

              <Link
                className="relative mt-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/80 bg-white px-3.5 py-2 text-xs font-bold text-[#0b665a] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e7faf5] hover:shadow-md"
                href={menus[activeMenu].intro.href}
                onClick={closeAll}
              >
                <span>Explore all capabilities</span>
                <span>&rarr;</span>
              </Link>
            </div>

            {/* Right Categories Grid */}
            <div
              className={`grid gap-5 pl-5 ${
                activeMenu === "product"
                  ? "grid-cols-3"
                  : activeMenu === "business"
                    ? "grid-cols-2"
                    : "grid-cols-1"
              }`}
            >
              {menus[activeMenu].groups.map((group) => (
                <div key={group.title}>
                  <h4 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                    {group.title}
                  </h4>
                  <ul className="mt-2 space-y-1">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          className="group flex flex-col rounded-lg border border-transparent p-1.5 transition-all duration-150 hover:-translate-y-px hover:border-[#dcece8] hover:bg-[#f5fbf9] hover:shadow-sm"
                          href={link.href}
                          onClick={closeAll}
                        >
                          <span className="text-[13px] font-semibold text-slate-800 transition-colors group-hover:text-emerald-700">
                            {link.label}
                          </span>
                          {"desc" in link && link.desc ? (
                            <span className="text-[10.5px] text-slate-400 group-hover:text-slate-500">
                              {link.desc}
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activeMenu === "integrations" ? (
          <div className="absolute left-1/2 top-[calc(100%+6px)] hidden w-[min(1120px,calc(100vw-24px))] -translate-x-1/2 overflow-hidden rounded-2xl border border-[#d7e8e3] bg-[linear-gradient(180deg,#f7fcfa_0%,#ffffff_24%)] p-3 shadow-[0_22px_55px_-16px_rgba(14,111,98,0.26)] lg:block" id="header-integrations-menu">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
              <div><p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Vozon integrations</p><h3 className="text-base font-bold tracking-tight text-slate-900">Connect your voice workflows</h3></div>
              <Link className="shrink-0 text-xs font-bold text-emerald-700 hover:text-emerald-900" href="/integrations" onClick={closeAll}>View all integrations &rarr;</Link>
            </div>
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {integrationCategories.map((category) => (
                <section className="min-w-0 rounded-lg border border-[#cfe4df] bg-[#edf7f4] p-2 shadow-[0_4px_14px_-12px_rgba(14,111,98,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#91c9bc] hover:bg-[#e3f3ef] hover:shadow-[0_10px_24px_-16px_rgba(14,111,98,0.55)]" key={category}>
                  <h4 className="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">{category}</h4>
                  <div>
                    {integrations.filter((integration) => integration.category === category).map((integration) => (
                      <Link className="group flex min-w-0 items-center gap-1.5 rounded-md px-1 py-0.5 transition hover:bg-emerald-50" href={`/integrations/${integration.slug}`} key={integration.slug} onClick={closeAll}>
                        <span className="relative grid size-6 shrink-0 place-items-center rounded-md bg-white">
                          <Image alt="" className="object-contain p-[3px]" fill sizes="24px" src={integration.logo} />
                        </span>
                        <span className="min-w-0 text-[12px] font-semibold leading-5 text-slate-800 transition-colors group-hover:text-emerald-700">{integration.name}</span>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        ) : null}

        {/* Mobile Dropdown Sheet */}
        {mobileOpen ? (
          <nav
            aria-label="Mobile navigation"
            className="absolute inset-x-0 top-[calc(100%+6px)] max-h-[calc(100vh-80px)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-xl lg:hidden"
          >
            <div className="flex flex-col space-y-2">
              <Link
                className="rounded-lg px-3 py-2 text-sm font-bold text-slate-900 hover:bg-slate-100"
                href="/"
                onClick={closeAll}
              >
                Home
              </Link>
              <div className="border-t border-slate-100 pt-2.5">
                <button aria-controls="mobile-integrations-menu" aria-expanded={mobileIntegrationsOpen} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-bold text-slate-900 hover:bg-slate-100" onClick={() => setMobileIntegrationsOpen(!mobileIntegrationsOpen)} type="button"><span>Integrations</span><span aria-hidden="true">{mobileIntegrationsOpen ? "−" : "+"}</span></button>
                {mobileIntegrationsOpen ? <div className="mt-1 space-y-3" id="mobile-integrations-menu">
                  {integrationCategories.map((category) => <section className="rounded-lg border border-slate-100 p-2" key={category}><h4 className="px-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800">{category}</h4><div className="mt-1 grid grid-cols-2 gap-1">{integrations.filter((integration) => integration.category === category).map((integration) => <Link className="rounded-md bg-slate-50 px-2 py-1.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700" href={`/integrations/${integration.slug}`} key={integration.slug} onClick={closeAll}>{integration.name}</Link>)}</div></section>)}
                  <Link className="block rounded-md px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50" href="/integrations" onClick={closeAll}>View all integrations &rarr;</Link>
                </div> : null}
              </div>
              <Link
                className="rounded-lg px-3 py-2 text-sm font-bold text-slate-900 hover:bg-slate-100"
                href="/pricing"
                onClick={closeAll}
              >
                Pricing
              </Link>

              {/* Products Section */}
              <div className="border-t border-slate-100 pt-2.5">
                <p className="px-3 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                  Products
                </p>
                <div className="mt-1.5 grid grid-cols-2 gap-1">
                  {menus.product.groups.flatMap((g) => g.links).map((link) => (
                    <Link
                      className="rounded-md px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                      href={link.href}
                      key={link.href}
                      onClick={closeAll}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Solutions Section */}
              <div className="border-t border-slate-100 pt-2.5">
                <p className="px-3 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                  Solutions
                </p>
                <div className="mt-1.5 grid grid-cols-2 gap-1">
                  {menus.business.groups.flatMap((g) => g.links).map((link) => (
                    <Link
                      className="rounded-md px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                      href={link.href}
                      key={link.href}
                      onClick={closeAll}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="grid grid-cols-2 gap-2.5 border-t border-slate-100 pt-3">
                <Link
                  className="flex items-center justify-center rounded-full border border-slate-200 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                  href="/login"
                  onClick={closeAll}
                >
                  Get started
                </Link>
                <Link
                  className="flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 py-2 text-xs font-bold text-white shadow-xs"
                  href="/contact"
                  onClick={closeAll}
                >
                  Contact us
                </Link>
              </div>
            </div>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
