import { headers } from "next/headers";

import { defaultBrand, type BrandConfig } from "@/lib/brand";
import { cleanRequestHostname, isConfiguredPlatformHostname, whiteLabelFrontendEnabled } from "@/lib/platformHosts";

function backendUrl() {
  return (process.env.BACKEND_URL ?? process.env.RENDER_BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
}

function isPlatformHostname(hostname: string) {
  return isConfiguredPlatformHostname(hostname, {
    platformHosts: process.env.PLATFORM_HOSTS,
    clientUrl: process.env.CLIENT_URL,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  });
}

function unavailableBrand(hostname: string): BrandConfig {
  return {
    ...defaultBrand,
    source: "white_label",
    hostname,
    productName: "Voice Platform",
    companyName: "Service provider",
    logoUrl: "",
    logoDarkUrl: "",
    iconUrl: "",
    urls: { app: `https://${hostname}`, api: "", links: "" },
    support: { email: "", phone: "", websiteUrl: "", helpCenterUrl: "", statusPageUrl: "" },
    legal: { termsUrl: "", privacyUrl: "", cookiePolicyUrl: "", legalBusinessName: "", businessAddress: "" },
    authentication: { registrationMode: "invite_only", googleSignIn: false },
  };
}

export async function requestBrandConfig() {
  const requestHeaders = await headers();
  const hostname = cleanRequestHostname(
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? defaultBrand.hostname,
  ) || defaultBrand.hostname;
  if (!whiteLabelFrontendEnabled()) return { ...defaultBrand, hostname };
  if (isPlatformHostname(hostname)) return { ...defaultBrand, hostname };
  const api = backendUrl();
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return { ...defaultBrand, hostname: hostname || defaultBrand.hostname };
  }
  if (!api) return unavailableBrand(hostname);
  try {
    const response = await fetch(`${api}/api/public/brand?hostname=${encodeURIComponent(hostname)}`, {
      next: { revalidate: 30 },
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return unavailableBrand(hostname);
    const data = (await response.json()) as { brand?: BrandConfig };
    return data.brand ?? { ...defaultBrand, hostname };
  } catch {
    return unavailableBrand(hostname);
  }
}
