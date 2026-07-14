import { developerApi } from "@/lib/developer";
import { integrationsApi } from "@/lib/integrations";
import { voiceApi } from "@/lib/voice";

/** Warms only idempotent dashboard reads after explicit navigation intent. */
export async function prefetchDashboardData(href: string) {
  if (href === "/dashboard/agents") {
    await voiceApi.agentSummaries();
    return;
  }
  if (href === "/dashboard/phone-number") {
    await Promise.all([voiceApi.phoneNumbers(), voiceApi.agentSummaries()]);
    return;
  }
  if (href === "/dashboard/campaign") {
    await Promise.all([voiceApi.campaigns(), voiceApi.phoneNumbers(), voiceApi.agentSummaries()]);
    return;
  }
  if (href === "/dashboard/calls") {
    await Promise.all([voiceApi.calls(), voiceApi.agentSummaries()]);
    return;
  }
  if (href === "/dashboard/integrations") {
    await integrationsApi.list();
    return;
  }
  if (href === "/dashboard/developers") {
    await Promise.all([developerApi.apiKeys(), developerApi.webhooks()]);
  }
}
