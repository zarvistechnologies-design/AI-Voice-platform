import type { Metadata } from "next";
import { MarketingOverviewPage } from "@/components/layout/MarketingOverviewPage";
import { integrationPages } from "@/config/seoPages";

export const metadata: Metadata = { title: "AI Voice Agent Integrations | Vozon", description: "Connect Vozon AI phone agents with CRM, calendar, telephony, and automation tools.", alternates: { canonical: "/integrations" } };

export default function IntegrationsPage() {
  return <MarketingOverviewPage eyebrow="Integrations" title="Connect every call to the tools that move work forward." summary="Give voice agents the approved context and actions required to update records, schedule appointments, route calls, and trigger follow-up." proof={[{ value: "8", label: "Featured integration guides" }, { value: "API", label: "Custom actions and webhooks" }, { value: "Live", label: "Actions during calls" }, { value: "Clear", label: "Traceable outcomes" }]} groups={[{ title: "Featured voice AI integrations", description: "Explore practical connection patterns, supported outcomes, testing considerations, and safe failure handling.", items: integrationPages.map((page) => ({ title: page.title.replace(" Voice AI Integration", ""), summary: page.description, href: `/integrations/${page.slug}`, meta: "Integration guide" })) }]} />;
}
