import type { Metadata } from "next";
import { MarketingOverviewPage } from "@/components/layout/MarketingOverviewPage";
import { articlePages } from "@/config/seoPages";

export const metadata: Metadata = { title: "AI Voice Agent Guides and Resources | Vozon", description: "Practical guides to AI voice agents, phone automation, pricing, latency, compliance, appointment booking, and production rollout.", alternates: { canonical: "/resources/blog" } };

export default function BlogPage() {
  return <MarketingOverviewPage eyebrow="Resources" title="Practical guidance for production voice AI." summary="Plan, evaluate, launch, and improve AI phone agents with clear frameworks for customer experience, operations, technology, and responsible deployment." proof={[{ value: "10", label: "In-depth launch guides" }, { value: "Calls", label: "Real workflow focus" }, { value: "Ops", label: "Production considerations" }, { value: "Clear", label: "Actionable checklists" }]} groups={[{ title: "Voice AI guides", description: "Start with the topic closest to the customer workflow or implementation decision in front of you.", items: articlePages.map((page) => ({ title: page.title, summary: page.description, href: `/resources/blog/${page.slug}`, meta: page.kicker })) }]} />;
}
