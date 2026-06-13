import Link from "next/link";

import { siteConfig } from "@/config/site";

export function BrandLogo() {
  return (
    <Link
      className="inline-flex min-w-max items-center gap-2 text-[0.9rem] font-extrabold text-inherit no-underline max-[560px]:text-[0.82rem]"
      href="/#product"
      aria-label={`${siteConfig.name} home`}
    >
      <span className="grid size-[31px] place-items-center rounded-full bg-gradient-to-br from-[#d08cff] to-[#6a00a8] text-[0.7rem] font-black text-white max-[560px]:size-7 max-[560px]:text-[0.66rem]">
        AI
      </span>
      <span>{siteConfig.name}</span>
    </Link>
  );
}
