"use client";

import Link from "next/link";
import "@/components/sections/PublicMarketingAccent.css";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { VoiceAgentVisualIcon, type IconName } from "@/components/product/VoiceAgentVisualIcon";

type MenuKey = "product" | "business" | "company";

type MenuItem = {
  href: string;
  label: string;
  desc: string;
  iconName: IconName;
  badge?: string;
};

type MenuGroup = {
  title: string;
  links: MenuItem[];
};

type MenuConfig = {
  label: string;
  groups: MenuGroup[];
  spotlight: {
    badge: string;
    title: string;
    desc: string;
    pill: string;
    ctaHref: string;
    ctaLabel: string;
  };
  footerAllHref: string;
  footerAllLabel: string;
};

const menus: Record<MenuKey, MenuConfig> = {
  product: {
    label: "Products",
    groups: [
      {
        title: "Voice Intelligence",
        links: [
          {
            href: "/product/ai-voice-agent",
            label: "AI Voice Agent",
            desc: "24/7 autonomous phone agents that sound human",
            iconName: "phone",
            badge: "Popular",
          },
          {
            href: "/product/voice-cloning",
            label: "Voice Cloning",
            desc: "Custom brand likeness with natural timbre",
            iconName: "waveform",
          },
        ],
      },
      {
        title: "Messaging & Web",
        links: [
          {
            href: "/product/whatsapp-bot",
            label: "WhatsApp Bot",
            desc: "Interactive chats with automated workflows",
            iconName: "message",
            badge: "New",
          },
          {
            href: "/product/whatsapp-api",
            label: "WhatsApp API",
            desc: "High-throughput cloud API for messaging",
            iconName: "send",
          },
          {
            href: "/product/web-chatbot",
            label: "Web Chatbot",
            desc: "Instant AI assistant on any website page",
            iconName: "globe",
          },
        ],
      },
      {
        title: "Connect & Automate",
        links: [
          {
            href: "/product/vozon-mcp",
            label: "Vozon MCP",
            desc: "Open Model Context Protocol for business tools",
            iconName: "cpu",
            badge: "Core",
          },
          {
            href: "/product/workflows",
            label: "Workflows",
            desc: "No-code event triggers, branches & conditions",
            iconName: "branch",
          },
          {
            href: "/product/end-to-end-automation",
            label: "End-to-End Automation",
            desc: "Full journey orchestration from trigger to sync",
            iconName: "layers",
          },
        ],
      },
    ],
    spotlight: {
      badge: "✨ VOZON ENGINE 2.0",
      title: "Sub-350ms Realtime Voice",
      desc: "Handle interruptions, background noise, and natural speaker pauses with human-grade conversational presence.",
      pill: "● 99.4% intent accuracy · 140+ languages",
      ctaHref: "/product/ai-voice-agent",
      ctaLabel: "Try Live Voice Agent →",
    },
    footerAllHref: "/product",
    footerAllLabel: "Explore full product suite →",
  },
  business: {
    label: "Solutions",
    groups: [
      {
        title: "Industries",
        links: [
          {
            href: "/business/industries/healthcare",
            label: "Healthcare",
            desc: "Patient intake, scheduling & clinical triage",
            iconName: "activity",
          },
          {
            href: "/business/industries/financial-services",
            label: "Financial Services",
            desc: "Advisor matching & portfolio qualification",
            iconName: "database",
          },
          {
            href: "/business/industries/insurance",
            label: "Insurance",
            desc: "Instant claims FNOL & policy support",
            iconName: "shield",
          },
          {
            href: "/business/industries/home-services",
            label: "Home Services",
            desc: "Emergency dispatch & technician booking",
            iconName: "phone",
            badge: "Top ROI",
          },
          {
            href: "/business/industries/retail-consumer",
            label: "Retail & Consumer",
            desc: "Order updates, exchanges & cart recovery",
            iconName: "spark",
          },
          {
            href: "/business/industries/logistics",
            label: "Logistics & Freight",
            desc: "Driver routing, dispatch & exception handling",
            iconName: "send",
          },
        ],
      },
      {
        title: "Key Use Cases",
        links: [
          {
            href: "/business/lead-qualification",
            label: "Lead Qualification",
            desc: "Convert inbound inquiries in seconds",
            iconName: "bolt",
            badge: "Sales",
          },
          {
            href: "/business/customer-support",
            label: "Customer Support",
            desc: "Resolve routine questions and sync tickets",
            iconName: "headset",
          },
          {
            href: "/business/receptionists",
            label: "AI Receptionist",
            desc: "Never miss an incoming front desk call",
            iconName: "calendar",
          },
          {
            href: "/business/dispatch-service",
            label: "Dispatch Service",
            desc: "Coordinate technicians & field crews",
            iconName: "refresh",
          },
        ],
      },
    ],
    spotlight: {
      badge: "🎯 INDUSTRY BLUEPRINT",
      title: "Pre-Configured Architecture",
      desc: "Pre-integrated with Twilio, WhatsApp, Google Calendar, Zoho CRM, and Salesforce out-of-the-box.",
      pill: "● 3.1x faster lead to booking",
      ctaHref: "/contact",
      ctaLabel: "Book Custom Solution Demo →",
    },
    footerAllHref: "/business",
    footerAllLabel: "View all industries & blueprints →",
  },
  company: {
    label: "Company",
    groups: [
      {
        title: "About Vozon",
        links: [
          {
            href: "/about",
            label: "About Us",
            desc: "Our mission, technology & leadership",
            iconName: "users",
          },
          {
            href: "/career",
            label: "Careers",
            desc: "Join our global distributed team",
            iconName: "spark",
            badge: "Hiring",
          },
          {
            href: "/partners",
            label: "White Label Partners",
            desc: "Reseller & agency partnership program",
            iconName: "layers",
          },
          {
            href: "/resources/blog",
            label: "Blog & Insights",
            desc: "Latest research on voice AI & LLM tooling",
            iconName: "file",
          },
          {
            href: "/contact",
            label: "Contact & Support",
            desc: "24/7 dedicated engineering & sales",
            iconName: "message",
          },
        ],
      },
    ],
    spotlight: {
      badge: "🚀 GLOBAL PRESENCE",
      title: "Built for Mission-Critical Voice",
      desc: "Delivering enterprise SLA reliability, sub-350ms latency, and secure SOC-2 compliant infrastructure.",
      pill: "● 99.99% Uptime Guarantee",
      ctaHref: "/about",
      ctaLabel: "Learn more about Vozon →",
    },
    footerAllHref: "/contact",
    footerAllLabel: "Contact sales team →",
  },
};

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const closeAll = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveMenu(null);
    setMobileOpen(false);
  };

  const handleMenuEnter = (key: MenuKey) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveMenu(key);
  };

  const handleMenuLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 180);
  };

  const handleDropdownEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleDropdownLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 180);
  };

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className={`public-accent-header ${isScrolled ? "is-scrolled" : ""}`}>
      {/* Top announcement for upcoming speech APIs */}
      <div className="site-announcement-bar" role="banner" aria-label="Platform announcement">
        <div className="site-announcement-inner">
          <span className="site-announcement-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </span>
          <p className="site-announcement-text">
            <strong>Speak naturally. Sound human.</strong> Vozon AI&apos;s own STT &amp; TTS APIs are dropping soon.
          </p>
        </div>
      </div>

      <header ref={headerRef}>
        {/* Left: Brand Logo & Aligned Navigation (Ringg.AI style) */}
        <div className="flex items-center gap-7 lg:gap-9">
          <div className="landing-header-logo flex items-center cursor-pointer shrink-0" onClick={closeAll}>
            <BrandLogo compact showWebsiteLogo />
          </div>

          {/* Desktop Navigation */}
          <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
            <Link className="site-nav-btn" href="/" onClick={closeAll}>
              Home
            </Link>

            {(["product", "business"] as const).map((key) => (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => handleMenuEnter(key)}
                onMouseLeave={handleMenuLeave}
              >
                <button
                  aria-expanded={activeMenu === key}
                  className={`site-nav-btn ${activeMenu === key ? "is-active" : ""}`}
                  onClick={() => setActiveMenu(activeMenu === key ? null : key)}
                  type="button"
                >
                  <span>{menus[key].label}</span>
                  <svg
                    className="site-nav-chevron"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            ))}

            <Link className="site-nav-btn" href="/integrations" onClick={closeAll}>
              Integrations
            </Link>

            <Link className="site-nav-btn" href="/pricing" onClick={closeAll}>
              Pricing
            </Link>

            <div
              className="relative"
              onMouseEnter={() => handleMenuEnter("company")}
              onMouseLeave={handleMenuLeave}
            >
              <button
                aria-expanded={activeMenu === "company"}
                className={`site-nav-btn ${activeMenu === "company" ? "is-active" : ""}`}
                onClick={() => setActiveMenu(activeMenu === "company" ? null : "company")}
                type="button"
              >
                <span>Company</span>
                <svg
                  className="site-nav-chevron"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </nav>
        </div>

        {/* Right: Book a Demo and Log in */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            className="rounded-full border border-slate-300/80 bg-white/70 px-5 py-2 text-[13.5px] font-medium text-slate-800 backdrop-blur-sm transition-all hover:bg-white hover:border-slate-400 hover:shadow-sm"
            href="/contact"
            onClick={closeAll}
          >
            Book a Demo
          </Link>

          <Link
            className="rounded-full bg-blue-600 px-5 py-2 text-[13.5px] font-medium text-white transition-all hover:bg-blue-700 shadow-sm"
            href="/login"
            onClick={closeAll}
          >
            Log in
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="rounded-full border border-slate-300 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-slate-800 md:hidden shadow-sm"
          onClick={() => setMobileOpen(!mobileOpen)}
          type="button"
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>

        {/* =========================================================================
            Modern Animated Mega-Menu Dropdown
            ========================================================================= */}
        {activeMenu ? (
          <div
            className="site-mega-menu hidden lg:block"
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <div className="site-menu-grid">
              {/* Left & Center: Categorized link columns */}
              <div className="site-menu-columns">
                {menus[activeMenu].groups.map((group) => (
                  <section key={group.title}>
                    <h3 className="site-menu-group-title">{group.title}</h3>
                    <div className="flex flex-col gap-1.5">
                      {group.links.map((item) => (
                        <Link
                          className="site-menu-item group"
                          href={item.href}
                          key={item.href}
                          onClick={closeAll}
                        >
                          <span className="site-menu-icon">
                            <VoiceAgentVisualIcon name={item.iconName} className="w-4 h-4" />
                          </span>
                          <div className="site-menu-item-info">
                            <span className="site-menu-item-title">
                              {item.label}
                              {item.badge ? (
                                <span className="site-menu-item-badge">{item.badge}</span>
                              ) : null}
                            </span>
                            <span className="site-menu-item-desc">{item.desc}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              {/* Right: Modern Spotlight Banner */}
              <aside className="site-menu-spotlight">
                <div>
                  <span className="site-menu-spotlight-badge">
                    {menus[activeMenu].spotlight.badge}
                  </span>
                  <h4 className="site-menu-spotlight-title">
                    {menus[activeMenu].spotlight.title}
                  </h4>
                  <p className="site-menu-spotlight-desc">
                    {menus[activeMenu].spotlight.desc}
                  </p>
                  <div className="site-menu-spotlight-pill">
                    {menus[activeMenu].spotlight.pill}
                  </div>
                </div>

                <Link
                  className="site-menu-spotlight-cta"
                  href={menus[activeMenu].spotlight.ctaHref}
                  onClick={closeAll}
                >
                  <span>{menus[activeMenu].spotlight.ctaLabel}</span>
                </Link>
              </aside>
            </div>

            {/* Mega-Menu Footer Strip */}
            <div className="site-menu-footer">
              <div className="site-menu-footer-links">
                <Link className="site-menu-footer-link" href="/integrations" onClick={closeAll}>
                  Integrations Hub
                </Link>
                <span>·</span>
                <Link className="site-menu-footer-link" href="/pricing" onClick={closeAll}>
                  Pricing & Calculator
                </Link>
                <span>·</span>
                <span className="text-emerald-600 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  All Systems Operational
                </span>
              </div>

              <Link
                className="site-menu-footer-cta"
                href={menus[activeMenu].footerAllHref}
                onClick={closeAll}
              >
                <span>{menus[activeMenu].footerAllLabel}</span>
              </Link>
            </div>
          </div>
        ) : null}

        {/* Mobile Navigation Drawer */}
        {mobileOpen ? (
          <nav
            aria-label="Mobile navigation"
            className="absolute left-4 right-4 top-[calc(100%+8px)] z-50 flex max-h-[calc(100vh-90px)] flex-col gap-3 overflow-y-auto rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl p-5 text-sm shadow-2xl lg:hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Navigation</span>
              <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Vozon 2.0
              </span>
            </div>

            <Link href="/" onClick={closeAll} className="font-semibold text-slate-900 py-1">Home</Link>
            <Link href="/integrations" onClick={closeAll} className="font-semibold text-slate-900 py-1">Integrations</Link>
            <Link href="/pricing" onClick={closeAll} className="font-semibold text-slate-900 py-1">Pricing</Link>

            {(["product", "business", "company"] as const).map((key) => (
              <section className="border-t border-slate-100 pt-3" key={key}>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">{menus[key].label}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {menus[key].groups.flatMap((group) => group.links).map((item) => (
                    <Link
                      className="flex items-center gap-2.5 py-2 px-2.5 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-[#2457D6] transition-colors"
                      href={item.href}
                      key={item.href}
                      onClick={closeAll}
                    >
                      <VoiceAgentVisualIcon name={item.iconName} className="w-4 h-4 text-[#2457d6] shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 leading-tight">{item.label}</div>
                        <div className="text-[10px] text-slate-500 truncate">{item.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}

            <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
              <Link
                className="rounded-full border border-slate-300 bg-white py-2.5 text-center text-sm font-medium text-slate-800 shadow-sm"
                href="/contact"
                onClick={closeAll}
              >
                Book a Demo
              </Link>
              <Link
                className="rounded-full bg-blue-600 py-2.5 text-center text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                href="/login"
                onClick={closeAll}
              >
                Log in
              </Link>
            </div>
          </nav>
        ) : null}
      </header>
    </div>
  );
}
