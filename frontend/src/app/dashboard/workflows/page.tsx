import type { Metadata } from "next";

import { WorkflowBuilderShell } from "@/components/dashboard/WorkflowBuilderShell";

export const metadata: Metadata = {
  title: "Agentic Workflows",
  description: "Design, test, and publish agentic voice workflows.",
};

export default function WorkflowsPage() {
  return <WorkflowBuilderShell />;
}
