import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/dashboard/", "/login", "/forgot-password", "/reset-password", "/verify-email", "/invite/", "/agents/embedded"] }, sitemap: "https://www.vozon.ai/sitemap.xml", host: "https://www.vozon.ai" };
}
