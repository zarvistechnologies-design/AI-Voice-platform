import type { Metadata } from "next";
import { HomeDesignFour } from "@/components/sections/HomeDesignFour";
import { EnquiryChatbot } from "@/components/sections/EnquiryChatbot";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: { absolute: "Vozon AI Agent Platform | Voice, WhatsApp & Web Chat" },
  description: "Build AI agents for voice, WhatsApp, and web chat. Connect conversations to business tools and turn customer requests into actions with workflows.",
  keywords: ["AI agent platform", "AI voice agents", "WhatsApp AI agent", "web chatbot", "AI workflows", "customer conversation automation"],
  openGraph: {
    type: "website",
    siteName: "Vozon",
    title: "Vozon AI Agent Platform | Voice, WhatsApp & Web Chat",
    description: "AI agents that handle customer conversations across voice, WhatsApp, and web chat, then move the work forward through connected workflows.",
    url: "/",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Vozon AI agent platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vozon AI Agent Platform | Voice, WhatsApp & Web Chat",
    description: "One platform for AI agents across voice, WhatsApp, web chat, and workflows.",
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
