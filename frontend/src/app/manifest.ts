import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
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
