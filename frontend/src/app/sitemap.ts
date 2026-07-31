import type { MetadataRoute } from "next";
import { businessPages, resourcePages, servicePages } from "@/config/site";
import { docsTopics } from "@/lib/docsContent";
import { articlePages, commercialPages, comparisonPages, integrationPages } from "@/config/seoPages";
const baseUrl = "https://www.vozon.ai";
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/product", "/pricing", "/business", "/integrations", "/compare", "/docs", "/about", "/contact", "/career", "/privacy", "/terms"];
  const services = servicePages.map((page) => `/services/${page.slug}`);
  const useCases = businessPages.filter((page) => page.kicker === "Use Cases").map((page) => `/business/${page.slug}`);
  const industries = businessPages.filter((page) => page.kicker === "Industries").map((page) => `/business/industries/${page.slug}`);
  const resources = resourcePages.map((page) => `/resources/${page.slug}`);
  const docs = docsTopics.map((page) => `/docs/${page.slug}`);
  const commercial = commercialPages.map((page) => `/${page.slug}`);
  const integrations = integrationPages.map((page) => `/integrations/${page.slug}`);
  const comparisons = comparisonPages.map((page) => `/compare/${page.slug}`);
  const articles = articlePages.map((page) => `/resources/blog/${page.slug}`);
  return [...staticRoutes, ...commercial, ...services, ...useCases, ...industries, ...integrations, ...comparisons, ...resources, ...articles, ...docs].map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date(), changeFrequency: path === "" || path === "/pricing" || path.startsWith("/docs") || path.startsWith("/resources/blog") ? "weekly" : "monthly", priority: path === "" ? 1 : path === "/product" || path === "/pricing" || commercial.includes(path) ? 0.9 : 0.7 }));
}
