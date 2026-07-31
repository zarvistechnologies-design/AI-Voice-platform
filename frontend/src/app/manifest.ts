import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "Vozon AI Voice Agent Platform", short_name: "Vozon", description: "Build multilingual AI phone agents for sales, support, scheduling, and workflow automation.", start_url: "/", display: "standalone", background_color: "#111827", theme_color: "#111827", icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }] };
}
