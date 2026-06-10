import { siteConfig } from "@/config/site";

export function BrandLogo() {
  return (
    <a className="brand" href="#product" aria-label={`${siteConfig.name} home`}>
      <span className="brand-mark">AI</span>
      <span>{siteConfig.name}</span>
    </a>
  );
}
