import type { Metadata } from "next";

import { MarketingOverviewPage } from "@/components/layout/MarketingOverviewPage";
import { businessPages } from "@/config/site";

export const metadata: Metadata = {
  title: "AI Voice for Business | AI Voice Platform",
  description: "Production voice agents for revenue, support, scheduling, and operations teams.",
};

export default function BusinessOverviewPage() {
  const useCases = businessPages.filter((page) => page.kicker === "Use Cases");
  const industries = businessPages.filter((page) => page.kicker === "Industries");

  return (
    <MarketingOverviewPage
      eyebrow="Voice operations for modern teams"
      title="Put every customer call to work."
      summary="Give revenue, support, and operations teams reliable phone coverage that resolves routine work and brings people in when judgment matters."
      proof={[
        { value: "90%", label: "lower handling cost" },
        { value: "3x", label: "faster response" },
        { value: "24/7", label: "customer availability" },
        { value: "100%", label: "conversation visibility" },
      ]}
      groups={[
        {
          title: "Use cases",
          description: "Start with a high-volume workflow and connect each call to a useful business outcome.",
          items: useCases.map((page) => ({
            title: page.title,
            summary: page.summary,
            href: `/business/${page.slug}`,
            meta: page.highlights[0],
          })),
        },
        {
          title: "Industries",
          description: "Adapt voice automation to the language, urgency, and operating rules of your market.",
          items: industries.map((page) => ({
            title: page.title,
            summary: page.summary,
            href: `/business/industries/${page.slug}`,
            meta: page.highlights[0],
          })),
        },
      ]}
    />
  );
}
