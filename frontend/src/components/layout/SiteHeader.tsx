"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeAll = () => {
    setActiveMenu(null);
    setMobileOpen(false);
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

  return (
    <header
      className="fixed inset-x-0 top-0 z-[100] flex justify-center px-3 sm:px-6 pt-2.5 transition-all duration-300"
      ref={headerRef}
    >
      {/* Slim Floating Glass Capsule with Fixed Consistent Dimensions */}
      <div
        className={`relative flex h-[54px] w-full max-w-[1400px] items-center justify-between rounded-full border px-4 sm:px-8 transition-all duration-300 ${
          scrolled
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
          className="hidden items-center gap-0.5 md:flex"
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
                ? "bg-slate-900 text-white shadow-xs font-semibold"
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
                ? "bg-slate-900 text-white shadow-xs font-semibold"
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
                ? "bg-slate-900 text-white shadow-xs font-semibold"
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
            className="grid size-8 place-items-center rounded-full border border-slate-200/80 bg-white/80 text-slate-700 shadow-xs transition-colors hover:bg-slate-100 md:hidden"
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
        {activeMenu ? (
          <div className="absolute left-1/2 top-[calc(100%+8px)] hidden w-[min(900px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12)] backdrop-blur-2xl md:grid md:grid-cols-[0.75fr_1.25fr] transition-all duration-200">
            {/* Left Feature Card */}
            <div className="flex flex-col justify-between rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 p-5 text-white shadow-inner border border-slate-800">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 shadow-sm">
                  {menus[activeMenu].badge}
                </span>
                <h3 className="mt-3 text-xl font-bold tracking-tight text-white">
                  {menus[activeMenu].intro.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {menus[activeMenu].intro.body}
                </p>
              </div>

              <Link
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 transition-transform duration-200 hover:translate-x-1"
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
                          className="group flex flex-col rounded-lg p-1.5 transition-all duration-150 hover:bg-slate-50"
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

        {/* Mobile Dropdown Sheet */}
        {mobileOpen ? (
          <nav
            aria-label="Mobile navigation"
            className="absolute inset-x-0 top-[calc(100%+6px)] max-h-[calc(100vh-80px)] overflow-y-auto rounded-2xl border border-slate-200/90 bg-white/95 p-5 shadow-xl backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col space-y-2">
              <Link
                className="rounded-lg px-3 py-2 text-sm font-bold text-slate-900 hover:bg-slate-100"
                href="/"
                onClick={closeAll}
              >
                Home
              </Link>
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
