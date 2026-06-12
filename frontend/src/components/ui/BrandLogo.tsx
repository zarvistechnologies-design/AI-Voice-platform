import Link from "next/link";

import { siteConfig } from "@/config/site";

export function BrandLogo() {
  return (
    <Link className="brand" href="/#product" aria-label={`${siteConfig.name} home`}>
      <span className="brand-mark">AI</span>
      <span>{siteConfig.name}</span>
    </Link>
  );
}
