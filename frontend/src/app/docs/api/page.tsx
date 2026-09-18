import type { Metadata } from "next";

import { ApiReferenceExperience } from "@/components/docs/ApiReferenceExperience";

export const metadata: Metadata = {
  title: "API Reference & Interactive Explorer | Vozon Voice AI",
  description:
    "Production REST and streaming API reference for Vozon voice agents. Start outbound calls, stream call events (SSE), download recordings, and verify webhooks.",
  alternates: { canonical: "/docs/api" },
  openGraph: {
    title: "Vozon Voice AI API Reference & Interactive Explorer",
    description:
      "Interactive API console, multi-language code snippets, pre-flight checklists, and complete call object schemas.",
  },
};

export default function ApiReferencePage() {
  return <ApiReferenceExperience />;
}
