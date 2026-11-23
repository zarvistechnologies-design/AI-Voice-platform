import type { Metadata } from "next";
import { HomeDesignFour } from "@/components/sections/HomeDesignFour";
import { EnquiryChatbot } from "@/components/sections/EnquiryChatbot";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: { absolute: "Vozon | Multichannel Agentic AI Platform (Voice, WhatsApp & Web)" },
  description: "The multichannel agentic platform for autonomous AI agents across voice, WhatsApp, and web chat. Reason over context, call live tools, and execute end-to-end workflows.",
  keywords: ["multichannel agentic platform", "agentic AI platform", "autonomous AI agents", "AI voice agents", "WhatsApp AI agent", "web chatbot", "agentic workflows"],
  openGraph: {
    type: "website",
    siteName: "Vozon",
    title: "Vozon | Multichannel Agentic AI Platform",
    description: "Autonomous AI agents that reason, call business tools, and complete tasks across voice, WhatsApp, and web chat.",
    url: "/",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Vozon multichannel agentic AI platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vozon | Multichannel Agentic AI Platform",
    description: "One multichannel agentic platform for autonomous AI across voice, WhatsApp, web chat, and workflows.",
    images: ["/opengraph-image"],
  },
};

export default function Home() {
  return (
    <>
      <HomeDesignFour />
      <EnquiryChatbot />
    </>
  );
}
