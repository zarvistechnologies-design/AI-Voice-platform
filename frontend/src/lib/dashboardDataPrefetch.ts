import { developerApi } from "@/lib/developer";
import { billingApi } from "@/lib/billing";
import { integrationsApi } from "@/lib/integrations";
import { organizationApi } from "@/lib/organizations";
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
  if (href === "/dashboard/analytics") {
    await Promise.all([
      voiceApi.analytics({ days: 30 }),
      voiceApi.agentSummaries(),
      voiceApi.calls({ status: "active", limit: 100 }),
    ]);
    return;
  }
  if (href === "/dashboard/knowledge") {
    await voiceApi.workspaceKnowledge();
    return;
  }
  if (href === "/dashboard/integrations") {
    await integrationsApi.list();
    return;
  }
  if (href === "/dashboard/billing") {
    await billingApi.summary();
    return;
  }
  if (href.startsWith("/dashboard/settings")) {
    await Promise.all([organizationApi.list(), organizationApi.members()]);
    return;
  }
  if (href === "/dashboard/developers") {
    await Promise.all([developerApi.apiKeys(), developerApi.webhooks()]);
  }
}
