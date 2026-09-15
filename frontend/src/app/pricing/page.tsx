import type { Metadata } from "next";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { PricingExperience } from "@/components/pricing/PricingExperience";

export const metadata: Metadata = {
  title: "AI Voice Agent Pricing | Vozon",
  description:
    "Simple pay-as-you-go AI voice pricing. No plans, subscriptions, or monthly commitments - pay only for the voice services you use.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <SiteLayout>
      <PricingExperience />
    </SiteLayout>
  );
}
