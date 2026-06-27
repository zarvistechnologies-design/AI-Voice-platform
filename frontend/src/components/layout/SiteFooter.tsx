import { BrandLogo } from "@/components/ui/BrandLogo";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer
      className="w-full border-t border-cyan-100 bg-white text-slate-950"
      id="company"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)] lg:px-12">
        <div className="grid content-start gap-4">
          <BrandLogo />
          <p className="m-0 max-w-sm leading-7 text-slate-600">{siteConfig.description}</p>
        </div>

        <div
          className="grid grid-cols-2 gap-8 sm:grid-cols-3"
          aria-label="Footer navigation"
        >
          {siteConfig.footerLinks.map((group) => (
            <div className="grid content-start gap-3" key={group.title}>
              <h2 className="m-0 text-sm font-black text-slate-950">{group.title}</h2>
              {group.links.map((link) => (
                <a
                  className="text-sm text-slate-600 transition hover:text-cyan-700"
                  key={`${group.title}-${link.label}`}
                  href={link.href}
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <p className="m-0 border-t border-cyan-100 pt-6 text-sm text-slate-500 lg:col-span-2">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
