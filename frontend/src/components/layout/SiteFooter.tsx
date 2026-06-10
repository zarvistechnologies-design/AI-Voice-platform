import { BrandLogo } from "@/components/ui/BrandLogo";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="company">
      <div className="footer-brand">
        <BrandLogo />
        <p>{siteConfig.description}</p>
      </div>

      <div className="footer-links" aria-label="Footer navigation">
        {siteConfig.footerLinks.map((group) => (
          <div className="footer-link-group" key={group.title}>
            <h2>{group.title}</h2>
            {group.links.map((link) => (
              <a key={`${group.title}-${link.label}`} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </div>

      <p className="footer-bottom">
        &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </p>
    </footer>
  );
}
