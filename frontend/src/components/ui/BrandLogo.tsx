"use client";

import Link from "next/link";
import Image from "next/image";

import { useBrand } from "@/components/branding/BrandProvider";

export function BrandLogo({
  compact = false,
  logoColor,
  showWebsiteLogo = false,
  surface = "light",
}: {
  compact?: boolean;
  logoColor?: string;
  showWebsiteLogo?: boolean;
  surface?: "light" | "dark";
}) {
  const brand = useBrand();
  const logoUrl = surface === "dark"
    ? (brand.logoDarkUrl || brand.logoUrl)
    : (brand.logoUrl || brand.logoDarkUrl);
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
          {logoColor ? (
            <span
              aria-hidden="true"
              className="block size-full"
              style={{
                backgroundColor: logoColor,
                WebkitMaskImage: `url("${logoUrl}")`,
                WebkitMaskPosition: "center",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskSize: "contain",
                maskImage: `url("${logoUrl}")`,
                maskPosition: "center",
                maskRepeat: "no-repeat",
                maskSize: "contain",
              }}
            />
          ) : logoUrl.startsWith("/") ? (
            <Image alt={brand.productName} className="platform-brand-logo h-full w-full object-contain" height={350} loading="eager" src={logoUrl} width={1160} />
          ) : (
            // Partner assets are already served by the approved asset/domain pipeline.
            // eslint-disable-next-line @next/next/no-img-element
            <img alt={brand.productName} className="platform-brand-logo h-full w-full object-contain" src={logoUrl} />
          )}
        </span>
      ) : (
        <>
          <span className="grid size-[31px] place-items-center rounded-full border border-blue-300/50 bg-[radial-gradient(circle_at_38%_20%,#dbeafe,#3b82f6_48%,#1d4ed8_100%)] text-[0.7rem] font-black text-white shadow-[0_0_22px_rgba(37,99,235,0.22)] max-[560px]:size-7 max-[560px]:text-[0.66rem]">
            {brand.productName.slice(0, 1).toUpperCase()}
          </span>
          <span>{brand.productName}</span>
        </>
      )}
    </Link>
  );
}

export default BrandLogo;
