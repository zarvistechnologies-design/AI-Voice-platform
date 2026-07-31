import type { MetadataRoute } from "next";
import { businessPages, resourcePages, servicePages } from "@/config/site";
import { docsTopics } from "@/lib/docsContent";
const baseUrl = "https://www.vozon.ai";
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/product", "/pricing", "/business", "/docs", "/about", "/contact", "/career", "/privacy", "/terms"];
  const services = servicePages.map((page) => `/services/${page.slug}`);
  const useCases = businessPages.filter((page) => page.kicker === "Use Cases").map((page) => `/business/${page.slug}`);
  const industries = businessPages.filter((page) => page.kicker === "Industries").map((page) => `/business/industries/${page.slug}`);
  const resources = resourcePages.map((page) => `/resources/${page.slug}`);
  const docs = docsTopics.map((page) => `/docs/${page.slug}`);
  return [...staticRoutes, ...services, ...useCases, ...industries, ...resources, ...docs].map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date(), changeFrequency: path === "" || path === "/pricing" || path.startsWith("/docs") ? "weekly" : "monthly", priority: path === "" ? 1 : path === "/product" || path === "/pricing" ? 0.9 : 0.7 }));
}
