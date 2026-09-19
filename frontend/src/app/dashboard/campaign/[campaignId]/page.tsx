import { CampaignResultsPageShell } from "@/components/dashboard/CampaignShell";

type CampaignResultsPageProps = {
  params: Promise<{
    campaignId: string;
  }>;
};

export default async function CampaignResultsPage({
  params,
}: CampaignResultsPageProps) {
  const { campaignId } = await params;
  return <CampaignResultsPageShell campaignId={campaignId} />;
}
