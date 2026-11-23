import { AutomationBuilder } from "@/components/dashboard/AutomationBuilder";
export default async function Page({ params }: { params: Promise<{ automationId: string }> }) {
  const { automationId } = await params;
  return <AutomationBuilder automationId={automationId} />;
}
