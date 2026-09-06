import { NextResponse, type NextRequest } from "next/server";

import { cleanRequestHostname, configuredPlatformHosts, whiteLabelFrontendEnabled } from "@/lib/platformHosts";

const appPrefixes = [
  "/login",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/invite/",
  "/dashboard",
  "/agents/embedded",
  "/api/",
  "/_next/",
];

export function proxy(request: NextRequest) {
  if (!whiteLabelFrontendEnabled()) return NextResponse.next();
  const hostname = cleanRequestHostname(request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "");
  const platformHosts = configuredPlatformHosts({
    platformHosts: process.env.PLATFORM_HOSTS,
    clientUrl: process.env.CLIENT_URL,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  });
  if (platformHosts.has(hostname)) return NextResponse.next();
  const pathname = request.nextUrl.pathname;
  const isAppPath = appPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(prefix));
  const isStaticAsset = /\.[a-z0-9]{2,8}$/i.test(pathname);
  if (isAppPath || isStaticAsset) return NextResponse.next();
  return NextResponse.redirect(new URL("/login", request.url), 307);
}

export const config = {
  matcher: "/:path*",
};
