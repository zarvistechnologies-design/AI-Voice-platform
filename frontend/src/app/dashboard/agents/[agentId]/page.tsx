import { DashboardShell } from "@/components/dashboard/DashboardShell";

type AgentPageProps = {
  params: Promise<{
    agentId: string;
  }>;
};

export default async function AgentPage({ params }: AgentPageProps) {
  const { agentId } = await params;

  return <DashboardShell key={agentId} initialAgentId={agentId} showTemplateSection={false} />;
}
