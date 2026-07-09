import Link from "next/link";

import { siteConfig } from "@/config/site";

export function BrandLogo() {
  return (
    <Link
      className="inline-flex min-w-max items-center gap-2 text-[0.9rem] font-extrabold text-inherit no-underline max-[560px]:text-[0.82rem]"
      href="/"
      aria-label={`${siteConfig.name} home`}
    >
      <span className="grid size-[31px] place-items-center rounded-full border border-[#35fbe0]/30 bg-[radial-gradient(circle_at_38%_20%,#cffff8,#1ee8c2_45%,#06332d_100%)] text-[0.7rem] font-black text-[#00110d] shadow-[0_0_22px_rgba(35,251,224,0.22)] max-[560px]:size-7 max-[560px]:text-[0.66rem]">
        V
      </span>
      <span>{siteConfig.name}</span>
    </Link>
  );
}
