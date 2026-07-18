import type { Metadata } from "next";

import { BusinessOverviewExperience } from "@/components/business/BusinessOverviewExperience";

export const metadata: Metadata = {
  title: "AI Voice Agents for Business | vozon.ai",
  description:
    "Deploy production AI voice agents for sales, support, scheduling, and operations with reliable workflows, human handoffs, and conversation intelligence.",
};

export default function BusinessOverviewPage() {
  return <BusinessOverviewExperience />;
}
