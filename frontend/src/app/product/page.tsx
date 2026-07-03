import type { Metadata } from "next";

import { MarketingOverviewPage } from "@/components/layout/MarketingOverviewPage";
import { servicePages } from "@/config/site";

export const metadata: Metadata = {
  title: "AI Voice Product | AI Voice Platform",
  description: "Build, deploy, and monitor production AI voice agents from one connected platform.",
};

const stages = [
  { title: "Build", description: "Create natural voices and conversations for every market." },
  { title: "Deploy", description: "Connect agents to the systems and workflows that run your business." },
  { title: "Monitor", description: "Understand quality, customer intent, and operational outcomes." },
] as const;

export default function ProductPage() {
  return (
    <MarketingOverviewPage
      eyebrow="The complete voice agent platform"
      title="Build voice agents customers can actually talk to."
      summary="Create, test, deploy, and improve AI phone agents with the controls your team needs for production customer conversations."
      proof={[
        { value: "<500ms", label: "response latency" },
        { value: "140+", label: "supported languages" },
        { value: "99.99%", label: "platform uptime" },
        { value: "24/7", label: "call coverage" },
      ]}
      groups={stages.map((stage) => ({
        ...stage,
        items: servicePages
          .filter((service) => service.kicker === stage.title)
          .map((service) => ({
            title: service.title,
            summary: service.summary,
            href: `/services/${service.slug}`,
            meta: service.highlights[0],
          })),
      }))}
    />
  );
}
