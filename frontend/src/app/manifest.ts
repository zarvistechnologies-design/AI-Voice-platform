import type { MetadataRoute } from "next";
import { requestBrandConfig } from "@/lib/brandServer";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const brand = await requestBrandConfig();
  if (brand.source === "platform") {
    return {
      name: "Vozon AI Voice Agent Platform",
      short_name: "Vozon",
      description: "Build multilingual AI phone agents for sales, support, scheduling, and workflow automation.",
      start_url: "/",
      display: "standalone",
      background_color: "#020d0b",
      theme_color: "#020d0b",
      icons: [
        { src: "/icons/vozon-mark-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icons/vozon-mark-512.png", sizes: "512x512", type: "image/png" },
      ],
    };
  }
  return {
    name: `${brand.productName} AI Voice Agent Platform`,
    short_name: brand.productName,
    description: "Build multilingual AI phone agents for sales, support, scheduling, and workflow automation.",
    start_url: "/",
    display: "standalone",
    background_color: brand.colors.surface,
    theme_color: brand.colors.primary,
    icons: brand.iconUrl ? [{ src: brand.iconUrl, sizes: "any" }] : [],
  };
}
