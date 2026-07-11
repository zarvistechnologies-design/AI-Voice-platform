import Link from "next/link";
import Image from "next/image";

import { siteConfig } from "@/config/site";

export function BrandLogo({ showWebsiteLogo = false }: { showWebsiteLogo?: boolean }) {
  return (
    <Link
      className="inline-flex min-w-max items-center gap-2 text-[0.9rem] font-extrabold text-inherit no-underline max-[560px]:text-[0.82rem]"
      href="/"
      aria-label={`${siteConfig.name} home`}
    >
      {showWebsiteLogo ? (
        <span className="relative block size-10 shrink-0 overflow-hidden max-[560px]:size-8">
          <Image
            alt=""
            className="absolute top-[-39px] left-[-32px] h-[108px] w-[192px] max-w-none max-[560px]:top-[-31px] max-[560px]:left-[-26px] max-[560px]:h-[86px] max-[560px]:w-[153px]"
            height={941}
            src="/images/logo.png"
            unoptimized
            width={1672}
          />
        </span>
      ) : (
        <span className="grid size-[31px] place-items-center rounded-full border border-[#35fbe0]/30 bg-[radial-gradient(circle_at_38%_20%,#cffff8,#1ee8c2_45%,#06332d_100%)] text-[0.7rem] font-black text-[#00110d] shadow-[0_0_22px_rgba(35,251,224,0.22)] max-[560px]:size-7 max-[560px]:text-[0.66rem]">
          V
        </span>
      )}
      <span>{siteConfig.name}</span>
    </Link>
  );
}
