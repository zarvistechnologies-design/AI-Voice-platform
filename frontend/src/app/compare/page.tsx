import type { Metadata } from "next";
import { MarketingOverviewPage } from "@/components/layout/MarketingOverviewPage";
import { comparisonPages } from "@/config/seoPages";

export const metadata: Metadata = { title: "AI Voice Platform Comparisons | Vozon", description: "Compare Vozon with voice AI platforms and traditional IVR using practical evaluation criteria.", alternates: { canonical: "/compare" } };

export default function ComparePage() {
  return <MarketingOverviewPage eyebrow="Compare" title="Choose a voice platform with evidence, not feature noise." summary="Compare the complete call stack, operating model, real cost, and production behavior using the same representative test calls." proof={[{ value: "5", label: "Focused comparison guides" }, { value: "1", label: "Shared evaluation framework" }, { value: "Real", label: "Call-path testing" }, { value: "Total", label: "Cost visibility" }]} groups={[{ title: "Voice AI comparisons", description: "Use these guides to define a fair proof of concept. Verify current vendor capabilities and pricing before making a purchasing decision.", items: comparisonPages.map((page) => ({ title: page.title, summary: page.description, href: `/compare/${page.slug}`, meta: "Buyer guide" })) }]} />;
}
