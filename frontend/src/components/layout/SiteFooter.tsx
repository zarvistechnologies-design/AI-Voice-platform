import Link from "next/link";
import Image from "next/image";

import { siteConfig } from "@/config/site";

const footerNavigation = [
  {
    title: "Product",
    links: [
      { href: "/services/voice-agents", label: "Voice agents" },
      { href: "/ai-phone-agent", label: "AI phone agent" },
      { href: "/ai-receptionist", label: "AI receptionist" },
      { href: "/outbound-ai-calling", label: "Outbound calling" },
      { href: "/services/speech-analytics", label: "Speech analytics" },
      { href: "/integrations", label: "Integrations" },
      { href: "/services/api-access", label: "API access" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/career", label: "Careers" },
      { href: "/resources/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "API documentation" },
      { href: "/resources/changelog", label: "Changelog" },
      { href: "/resources/help-center", label: "Help center" },
      { href: "/resources/case-studies", label: "Case studies" },
      { href: "/compare", label: "Compare platforms" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/resources/trust-center", label: "Security" },
    ],
  },
];

const socialLinks = [
  {
    accent: "hover:border-[#58a6e7]/65 hover:bg-[#0a66c2]/20 hover:text-[#74bdff]",
    href: "https://www.linkedin.com",
    label: "LinkedIn",
  },
  {
    accent: "hover:border-white/45 hover:bg-white/10 hover:text-white",
    href: "https://x.com",
    label: "X",
  },
  {
    accent: "hover:border-[#ff69c9]/65 hover:bg-[#d946ef]/15 hover:text-[#ff8bd5]",
    href: "https://www.instagram.com",
    label: "Instagram",
  },
] as const;

function SocialIcon({ name }: { name: (typeof socialLinks)[number]["label"] }) {
  if (name === "LinkedIn") {
    return (
      <svg aria-hidden="true" className="size-[18px]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7.3 9.45H4.45V18H7.3V9.45ZM5.87 5.2a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3ZM18.35 13.1c0-2.75-1.47-4.03-3.43-4.03a3.37 3.37 0 0 0-3.04 1.67V9.45H9.03V18h2.85v-4.23c0-1.12.21-2.2 1.6-2.2 1.37 0 1.39 1.28 1.39 2.27V18h2.85v-4.7l.63-.2Z" />
      </svg>
    );
  }

  if (name === "Instagram") {
    return (
      <svg aria-hidden="true" className="size-[19px]" fill="none" viewBox="0 0 24 24">
        <rect height="16" rx="4.5" stroke="currentColor" strokeWidth="2" width="16" x="4" y="4" />
        <circle cx="12" cy="12" r="3.45" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.1" cy="6.95" fill="currentColor" r="1.1" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="size-[17px]" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4.2 4.5h4.42l4.25 5.68 4.8-5.68h2.08l-5.91 7 6.31 8H15.7l-4.62-6.19-5.22 6.19H3.8l6.3-7.5-5.9-7.5Zm3.38 1.54 8.9 11.92h1.3L8.88 6.04h-1.3Z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="w-full bg-[#101c1b] text-white" id="company">
      <div
        className="relative min-h-[500px] w-full overflow-hidden border-y border-[#66f4dc]/12 bg-[#061410] px-6 py-8 shadow-[0_30px_100px_rgba(0,0,0,0.34)] sm:px-10 sm:py-9 lg:min-h-[540px] lg:px-16 lg:py-10"
        id="contact"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_58%_52%_at_55%_88%,rgba(39,244,210,0.22),transparent_70%),radial-gradient(ellipse_38%_42%_at_82%_75%,rgba(30,185,145,0.16),transparent_70%),radial-gradient(ellipse_34%_35%_at_20%_94%,rgba(16,185,129,0.18),transparent_72%),linear-gradient(180deg,#07130f_0%,#04110e_58%,#071c17_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 left-1/2 h-72 w-[78%] -translate-x-1/2 rounded-[50%] bg-[#2fffe0]/10 blur-[70px]"
        />

        <div className="relative z-10 mx-auto flex min-h-[436px] w-full max-w-[1440px] flex-col lg:grid lg:min-h-[460px] lg:grid-cols-[minmax(300px,0.75fr)_minmax(600px,1.25fr)] lg:gap-x-10">
          <div className="lg:col-start-1 lg:row-start-1">
            <p className="mb-3 flex items-center gap-2 text-[10px] font-semibold tracking-[0.08em] text-[#7dfff0] uppercase">
              <span className="text-sm leading-none" aria-hidden="true">✦</span>
              Contact us
            </p>
            <h2 className="m-0 max-w-[600px] text-[clamp(1.3rem,2.2vw,2.25rem)] leading-[1.18] font-medium tracking-[-0.03em] text-white">
              Interested in building smarter conversations?{" "}
              <span className="text-white/48">Let&apos;s bring your voice experience to life.</span>
            </h2>
          </div>

          <div className="mt-9 grid gap-8 lg:contents">
            <div className="lg:col-start-1 lg:row-start-2 lg:mt-8">
              <p className="mb-1.5 text-[10px] text-white/45">Contact us at:</p>
              <a
                className="group inline-flex items-center gap-2 text-[13px] font-medium text-white transition-colors hover:text-[#7dfff0]"
                href="mailto:hello@vozon.ai"
              >
                hello@vozon.ai
                <svg
                  aria-hidden="true"
                  className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                </svg>
              </a>

            </div>

            <nav
              aria-label="Footer navigation"
              className="grid w-full grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-[720px] lg:justify-self-end lg:gap-x-10 xl:gap-x-14"
            >
              {footerNavigation.map((group) => (
                <div className="min-w-0" key={group.title}>
                  <h3 className="mb-5 text-xs font-medium tracking-[0.04em] text-[#62b7a7] uppercase">
                    {group.title}
                  </h3>
                  <ul className="m-0 flex list-none flex-col gap-3 p-0">
                    {group.links.map((link) => (
                      <li key={`${group.title}-${link.label}`}>
                        <Link
                          className="text-[15px] leading-5 font-normal text-white/90 transition-colors hover:text-[#7dfff0]"
                          href={link.href}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div className="mt-auto pt-8 lg:col-span-2 lg:row-start-3 lg:mt-8">
            <Link
              aria-label={`${siteConfig.name} home`}
              className="group flex items-center gap-[clamp(0.75rem,2vw,1.75rem)] text-white"
              href="/"
            >
              <span className="relative block h-[clamp(3.25rem,7vw,6.25rem)] w-[clamp(11.375rem,24.5vw,21.875rem)] shrink-0 bg-transparent transition-transform duration-300 group-hover:scale-[1.02]">
                <Image
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-contain object-left"
                  height={350}
                  src="/images/logo_2.svg"
                  width={1160}
                />
              </span>
            </Link>

            <div className="-mt-2 flex flex-col gap-5 border-t border-white/10 pt-5 text-[11px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
              <p className="m-0">&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-medium tracking-[0.1em] text-white/35 uppercase">Follow us</span>
                <nav aria-label="Social media" className="flex items-center gap-2.5">
                  {socialLinks.map((social) => (
                    <a
                      aria-label={social.label}
                      className={`inline-flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.035] text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_7px_20px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dfff0] ${social.accent}`}
                      href={social.href}
                      key={social.label}
                      rel="noreferrer"
                      target="_blank"
                      title={social.label}
                    >
                      <SocialIcon name={social.label} />
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
