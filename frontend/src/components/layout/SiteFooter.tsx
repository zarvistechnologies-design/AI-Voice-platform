import Link from "next/link";
import Image from "next/image";

import { siteConfig } from "@/config/site";

const primaryLinks = [
  { href: "/product", label: "Product" },
  { href: "/business", label: "For Business" },
  { href: "/about", label: "About" },
  { href: "/career", label: "Careers" },
];

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

        <div className="relative z-10 flex min-h-[436px] flex-col lg:min-h-[460px]">
          <div>
            <p className="mb-3 flex items-center gap-2 text-[10px] font-semibold tracking-[0.08em] text-[#7dfff0] uppercase">
              <span className="text-sm leading-none" aria-hidden="true">✦</span>
              Contact us
            </p>
            <h2 className="m-0 max-w-[600px] text-[clamp(1.3rem,2.2vw,2.25rem)] leading-[1.18] font-medium tracking-[-0.03em] text-white">
              Interested in building smarter conversations?{" "}
              <span className="text-white/48">Let&apos;s bring your voice experience to life.</span>
            </h2>
          </div>

          <div className="mt-9 grid gap-7 lg:mt-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
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

            <nav aria-label="Primary footer navigation" className="flex flex-wrap gap-x-7 gap-y-3 lg:justify-end">
              {primaryLinks.map((link) => (
                <Link
                  className="text-xs font-medium text-white/75 transition-colors hover:text-[#7dfff0]"
                  href={link.href}
                  key={link.label}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-auto pt-8">
            <Link
              aria-label={`${siteConfig.name} home`}
              className="group flex items-center gap-[clamp(0.75rem,2vw,1.75rem)] text-white"
              href="/"
            >
              <span className="relative block h-[clamp(3.25rem,7vw,6.25rem)] w-[clamp(11.375rem,24.5vw,21.875rem)] translate-y-2 shrink-0 overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
                <Image
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-contain drop-shadow-[0_0_18px_rgba(53,251,224,0.2)]"
                  height={350}
                  src="/images/logo_2.svg"
                  width={1160}
                />
              </span>
            </Link>

            <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-4 text-[10px] text-white/38 sm:flex-row sm:items-center sm:justify-between">
              <p className="m-0">&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>

              <nav aria-label="Legal and support links" className="flex flex-wrap gap-x-6 gap-y-3">
                {siteConfig.footerLinks.flatMap((group) => group.links).map((link) => (
                  <Link
                    className="transition-colors hover:text-[#7dfff0]"
                    href={link.href}
                    key={`${link.href}-${link.label}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
