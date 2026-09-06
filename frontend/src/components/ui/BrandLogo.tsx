"use client";

import Link from "next/link";
import Image from "next/image";

import { useBrand } from "@/components/branding/BrandProvider";

export function BrandLogo({
  compact = false,
  showWebsiteLogo = false,
}: {
  compact?: boolean;
  showWebsiteLogo?: boolean;
}) {
  const brand = useBrand();
  const logoUrl = brand.logoDarkUrl || brand.logoUrl;
  return (
    <Link
      className="inline-flex min-w-max items-center gap-2 text-[0.9rem] font-extrabold text-inherit no-underline max-[560px]:text-[0.82rem]"
      href="/"
      aria-label={`${brand.productName} home`}
    >
      {showWebsiteLogo && logoUrl ? (
        <span
          className={`relative block shrink-0 overflow-hidden ${
            compact
              ? "h-8 w-[112px] max-[560px]:h-7 max-[560px]:w-[98px]"
              : "h-10 w-[140px] max-[560px]:h-8 max-[560px]:w-[112px]"
          }`}
        >
          {logoUrl.startsWith("/") ? (
            <Image alt={brand.productName} className="h-full w-full object-contain" height={350} loading="eager" src={logoUrl} width={1160} />
          ) : (
            // Partner assets are already served by the approved asset/domain pipeline.
            // eslint-disable-next-line @next/next/no-img-element
            <img alt={brand.productName} className="h-full w-full object-contain" src={logoUrl} />
          )}
        </span>
      ) : (
        <>
          <span className="grid size-[31px] place-items-center rounded-full border border-[#35fbe0]/30 bg-[radial-gradient(circle_at_38%_20%,#cffff8,#1ee8c2_45%,#06332d_100%)] text-[0.7rem] font-black text-[#00110d] shadow-[0_0_22px_rgba(35,251,224,0.22)] max-[560px]:size-7 max-[560px]:text-[0.66rem]">
            {brand.productName.slice(0, 1).toUpperCase()}
          </span>
          <span>{brand.productName}</span>
        </>
      )}
    </Link>
  );
}
