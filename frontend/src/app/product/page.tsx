import type { Metadata } from "next";

import { ProductHubPage } from "@/components/product/ProductPages";

export const metadata: Metadata = {
  title: "AI Voice, WhatsApp & Automation Products | Vozon",
  description: "Explore Vozon AI voice agents, WhatsApp API and bots, web chatbots, voice cloning, MCP, workflows, and end-to-end automation. Connect every conversation to the next step.",
  alternates: { canonical: "/product" },
  openGraph: { title: "Vozon Products | Every conversation can lead somewhere", description: "Voice, messaging, web chat, and automation connected in one platform.", type: "website" },
};

export default function ProductPage() {
  return <ProductHubPage />;
}
