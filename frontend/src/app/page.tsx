
import type { Metadata } from "next";
import { NexStudioPage } from "@/components/nexstudio/NexStudioPage";
import { EnquiryChatbot } from "@/components/sections/EnquiryChatbot";

export const metadata: Metadata = {
  title: "Vozon AI — Voice that answers back | Conversational Voice AI Platform",
  description:
    "Deploy human-sounding conversational voice AI for inbound customer support, lead qualification, and outbound campaigns. Built-in telephony and native fluency in 22+ languages.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <NexStudioPage />
      <EnquiryChatbot />
    </>
  );
}
