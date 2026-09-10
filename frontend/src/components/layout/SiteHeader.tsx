"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { BrandLogo } from "@/components/ui/BrandLogo";
import { siteConfig } from "@/config/site";

type MenuKey = "product" | "business" | "company";

const menus = {
  product: { label: "Products", intro: siteConfig.productMenu.featured, groups: siteConfig.productMenu.groups },
  business: { label: "For Business", intro: siteConfig.businessMenu.featured, groups: siteConfig.businessMenu.columns },
  company: {
    label: "Company",
    intro: siteConfig.companyMenu.featured,
    groups: [{ title: "Explore Vozon", links: [
      { href: "/about", label: "About us" }, { href: "/career", label: "Careers" },
      { href: "/partners", label: "Partners" }, { href: "/resources/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ] }],
  },
} as const;

function Chevron({ open = false }: { open?: boolean }) {
  return <svg aria-hidden="true" className={`size-3 transition ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 12 12"><path d="m2.5 4.5 3.5 3 3.5-3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>;
}

export function SiteHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeAll = () => { setActiveMenu(null); setMobileOpen(false); };

  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!headerRef.current?.contains(event.target as Node)) closeAll(); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") closeAll(); };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, []);

  const isCompany = ["/about", "/career", "/partners", "/contact"].some((route) => pathname.startsWith(route));

  return (
    <header className="site-header-previous fixed inset-x-0 top-0 z-50 border-b border-[#ececf1] bg-white" ref={headerRef}>
      <div className="relative mx-auto flex w-full items-center justify-between gap-4 px-20 py-2.5 max-[900px]:px-6 max-[900px]:py-2.5 max-[640px]:px-4 max-[640px]:py-2">
        <div className="header-previous-logo flex -translate-x-8 flex-col items-center text-[#111113] max-[640px]:-translate-x-3">
          <div className="header-previous-brand-unit flex flex-col items-center">
            <BrandLogo showWebsiteLogo />
            <small className="header-previous-tagline">
              AI Voice for a Smarter Business
            </small>
          </div>
        </div>
        <nav aria-label="Main navigation" className="hidden items-center gap-7 min-[901px]:flex xl:gap-12">
          <Link className={`marketing-nav-link ${pathname === "/" ? "is-active" : ""}`} href="/" onClick={closeAll}>Home</Link>
          <button aria-expanded={activeMenu === "product"} className={`marketing-nav-link ${pathname.startsWith("/product") || pathname.startsWith("/services") ? "is-active" : ""}`} onClick={() => setActiveMenu(activeMenu === "product" ? null : "product")} type="button">Products<Chevron open={activeMenu === "product"} /></button>
          <Link className={`marketing-nav-link ${pathname === "/pricing" ? "is-active" : ""}`} href="/pricing" onClick={closeAll}>Pricing</Link>
          <button aria-expanded={activeMenu === "business"} className={`marketing-nav-link ${pathname.startsWith("/business") ? "is-active" : ""}`} onClick={() => setActiveMenu(activeMenu === "business" ? null : "business")} type="button">For Business<Chevron open={activeMenu === "business"} /></button>
          <button aria-expanded={activeMenu === "company"} className={`marketing-nav-link ${isCompany ? "is-active" : ""}`} onClick={() => setActiveMenu(activeMenu === "company" ? null : "company")} type="button">Company<Chevron open={activeMenu === "company"} /></button>
        </nav>
        <div className="flex items-center gap-2 min-[901px]:translate-x-4">
          <Link className="header-previous-start hidden min-h-12 items-center justify-center rounded-full border-[1.5px] border-[#111116] px-7 text-sm font-bold text-[#111116] min-[901px]:inline-flex" href="/dashboard">Get started</Link>
          <Link
            className="header-previous-contact-sales inline-flex min-h-12 items-center justify-center rounded-full bg-[#123d35] px-6 text-sm font-bold text-white max-[900px]:min-h-[42px] max-[640px]:hidden"
            href="/contact"
          >
            Contact sales
          </Link>
          <button aria-expanded={mobileOpen} aria-label="Toggle navigation" className="grid size-10 place-items-center rounded-full border border-[#cfcfd9] text-[#111113] min-[901px]:hidden" onClick={() => setMobileOpen(!mobileOpen)} type="button"><span className="text-lg leading-none">{mobileOpen ? "×" : "≡"}</span></button>
        </div>

        {activeMenu ? (
          <div className="absolute left-1/2 top-[calc(100%+10px)] hidden w-[min(960px,calc(100vw-40px))] -translate-x-1/2 overflow-hidden rounded-[24px] border border-[#dedee8] bg-white p-2 shadow-[0_28px_80px_rgba(42,39,82,0.14)] min-[901px]:grid min-[901px]:grid-cols-[0.72fr_1.28fr]">
            <Link className="group flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[18px] bg-[radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.65),transparent_30%),linear-gradient(145deg,#e7f6f0,#edf7f4_52%,#dcfaf4)] p-7 text-[#111113]" href={menus[activeMenu].intro.href} onClick={closeAll}>
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#118778]">Overview</span>
              <div><h2 className="text-3xl font-semibold tracking-[-0.045em]">{menus[activeMenu].intro.title}</h2><p className="mt-3 max-w-sm text-sm leading-6 text-[#676773]">{menus[activeMenu].intro.body}</p></div>
              <span className="text-xs font-extrabold">Explore overview →</span>
            </Link>
            <div className={`grid gap-8 p-7 ${activeMenu === "product" ? "grid-cols-3" : activeMenu === "business" ? "grid-cols-2" : "grid-cols-1"}`}>
              {menus[activeMenu].groups.map((group) => <div key={group.title}><h3 className="mb-5 text-[10px] font-black uppercase tracking-[0.15em] text-[#777783]">{group.title}</h3><div className="grid gap-1">{group.links.map((link) => <Link className="rounded-xl px-3 py-2.5 text-sm font-semibold text-[#34343f] transition hover:bg-[#edf7f4] hover:text-[#0e6f62]" href={link.href} key={link.href} onClick={closeAll}>{link.label}</Link>)}</div></div>)}
            </div>
          </div>
        ) : null}

        {mobileOpen ? (
          <nav aria-label="Mobile navigation" className="absolute inset-x-0 top-[calc(100%+8px)] max-h-[calc(100vh-100px)] overflow-y-auto rounded-2xl border border-[#dedee8] bg-white p-3 shadow-[0_24px_60px_rgba(42,39,82,0.14)] min-[901px]:hidden">
            <Link className="mobile-nav-item" href="/" onClick={closeAll}>Home</Link>
            <div className="mt-2 border-t border-[#ededf3] pt-2"><Link className="mobile-nav-heading" href={menus.product.intro.href} onClick={closeAll}>Products<span>→</span></Link>{menus.product.groups.flatMap((group) => group.links).map((link) => <Link className="mobile-nav-item pl-5" href={link.href} key={link.href} onClick={closeAll}>{link.label}</Link>)}</div>
            <Link className="mobile-nav-item mt-2 border-t border-[#ededf3] pt-3" href="/pricing" onClick={closeAll}>Pricing</Link>
            {(["business", "company"] as const).map((key) => <div className="mt-2 border-t border-[#ededf3] pt-2" key={key}><Link className="mobile-nav-heading" href={menus[key].intro.href} onClick={closeAll}>{menus[key].label}<span>→</span></Link>{menus[key].groups.flatMap((group) => group.links).map((link) => <Link className="mobile-nav-item pl-5" href={link.href} key={link.href} onClick={closeAll}>{link.label}</Link>)}</div>)}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
