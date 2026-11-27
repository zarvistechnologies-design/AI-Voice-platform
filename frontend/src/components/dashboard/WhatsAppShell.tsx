"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardSidebar, getDashboardSidebarInitialState } from "@/components/dashboard/DashboardSidebar";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { getServerSession, getSession, logoutSession, subscribeToSession } from "@/lib/auth";
import type {
  WhatsAppCampaign,
  WhatsAppConnectionStatus,
  WhatsAppContact,
  WhatsAppContactGroup,
  WhatsAppTemplate,
  WhatsAppAgentConfig,
  WhatsAppConversation,
  WhatsAppForm,
  WhatsAppFlow,
} from "@/lib/whatsapp";
import { whatsappApi } from "@/lib/whatsapp";

import { WhatsAppTemplatesView } from "@/components/dashboard/whatsapp/WhatsAppTemplatesView";
import { WhatsAppContactGroupsView } from "@/components/dashboard/whatsapp/WhatsAppContactGroupsView";
import { WhatsAppCampaignsView } from "@/components/dashboard/whatsapp/WhatsAppCampaignsView";
import { WhatsAppAgentsView } from "@/components/dashboard/whatsapp/WhatsAppAgentsView";
import { WhatsAppLiveChatView } from "@/components/dashboard/whatsapp/WhatsAppLiveChatView";
import { WhatsAppMetaFormsView } from "@/components/dashboard/whatsapp/WhatsAppMetaFormsView";
import { WhatsAppFlowMakerView } from "@/components/dashboard/whatsapp/WhatsAppFlowMakerView";
import { WhatsAppEmbeddedSignupModal } from "@/components/dashboard/whatsapp/WhatsAppEmbeddedSignupModal";

export type WhatsAppTab =
  | "templates"
  | "contact-groups"
  | "campaigns"
  | "agents"
  | "live-chat"
  | "meta-forms"
  | "flow-maker";

interface WhatsAppShellProps {
  initialTab?: WhatsAppTab;
}

interface WhatsAppDataCache {
  connectionStatus: WhatsAppConnectionStatus | null;
  templates: WhatsAppTemplate[];
  groups: WhatsAppContactGroup[];
  contacts: WhatsAppContact[];
  campaigns: WhatsAppCampaign[];
  agentConfig: WhatsAppAgentConfig;
  conversations: WhatsAppConversation[];
  forms: WhatsAppForm[];
  flows: WhatsAppFlow[];
  fetchedAt: number;
}

let globalWhatsAppDataCache: WhatsAppDataCache | null = null;
let globalInFlightFetch: Promise<void> | null = null;

const defaultAgentConfig: WhatsAppAgentConfig = {
  name: "Vozon WhatsApp Assistant",
  enabled: true,
  autoReply: true,
  welcomeMessage: "👋 Welcome to Vozon AI! How can our intelligent assistant help you today?",
  fallbackMessage: "I'm passing your conversation to a live specialist. They'll be with you shortly.",
  transferKeywords: ["agent", "human", "representative", "help"],
  businessHoursOnly: false,
};

function getInitials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export function WhatsAppShell({ initialTab = "campaigns" }: WhatsAppShellProps) {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [showUserSidebar, setShowUserSidebar] = useState(getDashboardSidebarInitialState);

  const [activeTab, setActiveTab] = useState<WhatsAppTab>(initialTab);
  // Only show loading spinner on the first cold mount if no cache exists yet
  const [loading, setLoading] = useState(() => !globalWhatsAppDataCache);
  const [connectionStatus, setConnectionStatus] = useState<WhatsAppConnectionStatus | null>(
    () => globalWhatsAppDataCache?.connectionStatus || null,
  );
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [webhookChecking, setWebhookChecking] = useState(false);

  // Entities state - initialized instantly from module cache so switching tabs has 0ms lag
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(
    () => globalWhatsAppDataCache?.templates || [],
  );
  const [groups, setGroups] = useState<WhatsAppContactGroup[]>(
    () => globalWhatsAppDataCache?.groups || [],
  );
  const [contacts, setContacts] = useState<WhatsAppContact[]>(
    () => globalWhatsAppDataCache?.contacts || [],
  );
  const [campaigns, setCampaigns] = useState<WhatsAppCampaign[]>(
    () => globalWhatsAppDataCache?.campaigns || [],
  );
  const [agentConfig, setAgentConfig] = useState<WhatsAppAgentConfig>(
    () => globalWhatsAppDataCache?.agentConfig || defaultAgentConfig,
  );
  const [conversations, setConversations] = useState<WhatsAppConversation[]>(
    () => globalWhatsAppDataCache?.conversations || [],
  );
  const [forms, setForms] = useState<WhatsAppForm[]>(
    () => globalWhatsAppDataCache?.forms || [],
  );
  const [flows, setFlows] = useState<WhatsAppFlow[]>(
    () => globalWhatsAppDataCache?.flows || [],
  );

  // Keep internal tab in sync if initialTab prop changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  function switchTab(tab: WhatsAppTab) {
    setActiveTab(tab);
    router.push(`/dashboard/whatsapp/${tab}`);
  }

  // Load WhatsApp data with cache & non-blocking background revalidation
  const loadData = async (force = false) => {
    // If cache is fresh (< 2 mins) and not a forced reload, keep current cache
    if (globalWhatsAppDataCache && !force && Date.now() - globalWhatsAppDataCache.fetchedAt < 120_000) {
      return;
    }

    // Only block the UI with a spinner if we don't have any data cached at all
    if (!globalWhatsAppDataCache) {
      setLoading(true);
    }

    try {
      if (globalInFlightFetch && !force) {
        await globalInFlightFetch;
        if (globalWhatsAppDataCache) {
          setConnectionStatus(globalWhatsAppDataCache.connectionStatus);
          setTemplates(globalWhatsAppDataCache.templates);
          setGroups(globalWhatsAppDataCache.groups);
          setContacts(globalWhatsAppDataCache.contacts);
          setCampaigns(globalWhatsAppDataCache.campaigns);
          setAgentConfig(globalWhatsAppDataCache.agentConfig);
          setConversations(globalWhatsAppDataCache.conversations);
          setForms(globalWhatsAppDataCache.forms);
          setFlows(globalWhatsAppDataCache.flows);
          setLoading(false);
          return;
        }
      }

      const fetchPromise = (async () => {
        const [
          statusRes,
          templatesRes,
          groupsRes,
          contactsRes,
          campaignsRes,
          agentsRes,
          conversationsRes,
          formsRes,
          flowsRes,
        ] = await Promise.allSettled([
          whatsappApi.getStatus(),
          whatsappApi.listTemplates(),
          whatsappApi.listContactGroups(),
          whatsappApi.listContacts(),
          whatsappApi.listCampaigns(),
          whatsappApi.getAgentConfig(),
          whatsappApi.listConversations(),
          whatsappApi.listForms(),
          whatsappApi.listFlows(),
        ]);

        const nextStatus =
          statusRes.status === "fulfilled"
            ? statusRes.value
            : globalWhatsAppDataCache?.connectionStatus || null;
        const nextTemplates =
          templatesRes.status === "fulfilled" && templatesRes.value.ok
            ? templatesRes.value.templates || []
            : globalWhatsAppDataCache?.templates || [];
        const nextGroups =
          groupsRes.status === "fulfilled" && groupsRes.value.ok
            ? groupsRes.value.groups || []
            : globalWhatsAppDataCache?.groups || [];
        const nextContacts =
          contactsRes.status === "fulfilled" && contactsRes.value.ok
            ? contactsRes.value.contacts || []
            : globalWhatsAppDataCache?.contacts || [];
        const nextCampaigns =
          campaignsRes.status === "fulfilled" && campaignsRes.value.ok
            ? campaignsRes.value.campaigns || []
            : globalWhatsAppDataCache?.campaigns || [];
        const nextAgentConfig =
          agentsRes.status === "fulfilled" && agentsRes.value.ok
            ? agentsRes.value.config
            : globalWhatsAppDataCache?.agentConfig || defaultAgentConfig;
        const nextConversations =
          conversationsRes.status === "fulfilled" && conversationsRes.value.ok
            ? conversationsRes.value.conversations || []
            : globalWhatsAppDataCache?.conversations || [];
        const nextForms =
          formsRes.status === "fulfilled" && formsRes.value.ok
            ? formsRes.value.forms || []
            : globalWhatsAppDataCache?.forms || [];
        const nextFlows =
          flowsRes.status === "fulfilled" && flowsRes.value.ok
            ? flowsRes.value.flows || []
            : globalWhatsAppDataCache?.flows || [];

        globalWhatsAppDataCache = {
          connectionStatus: nextStatus,
          templates: nextTemplates,
          groups: nextGroups,
          contacts: nextContacts,
          campaigns: nextCampaigns,
          agentConfig: nextAgentConfig,
          conversations: nextConversations,
          forms: nextForms,
          flows: nextFlows,
          fetchedAt: Date.now(),
        };

        setConnectionStatus(nextStatus);
        setTemplates(nextTemplates);
        setGroups(nextGroups);
        setContacts(nextContacts);
        setCampaigns(nextCampaigns);
        setAgentConfig(nextAgentConfig);
        setConversations(nextConversations);
        setForms(nextForms);
        setFlows(nextFlows);
      })();

      globalInFlightFetch = fetchPromise;
      await fetchPromise;
    } catch (err) {
      console.warn("Failed to load WhatsApp data:", err);
    } finally {
      globalInFlightFetch = null;
      setLoading(false);
    }
  };

  async function recheckWhatsAppWebhook() {
    setWebhookChecking(true);
    try {
      const status = await whatsappApi.getStatus(true);
      setConnectionStatus(status);
      if (globalWhatsAppDataCache) {
        globalWhatsAppDataCache = { ...globalWhatsAppDataCache, connectionStatus: status, fetchedAt: Date.now() };
      }
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Could not recheck the WhatsApp webhook." });
    } finally {
      setWebhookChecking(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  // Keep webhook-delivered chats visible without requiring a manual page refresh.
  useEffect(() => {
    if (activeTab !== "live-chat") return;
    const interval = window.setInterval(() => void loadData(true), 10_000);
    return () => window.clearInterval(interval);
  }, [activeTab]);

  const hasRunningCampaigns = campaigns.some((campaign) => campaign.status === "running");
  const hasScheduledCampaigns = campaigns.some((campaign) => campaign.status === "scheduled");
  useEffect(() => {
    if (activeTab !== "campaigns" || (!hasRunningCampaigns && !hasScheduledCampaigns)) return;
    const interval = window.setInterval(() => void loadData(true), hasRunningCampaigns ? 5_000 : 60_000);
    return () => window.clearInterval(interval);
  }, [activeTab, hasRunningCampaigns, hasScheduledCampaigns]);

  // Recheck pending template approvals with Meta while the template screen is open.
  const hasPendingTemplates = templates.some((template) => template.status === "PENDING");
  useEffect(() => {
    if (activeTab !== "templates" || !hasPendingTemplates) return;

    let stopped = false;
    let syncing = false;
    const syncPendingTemplates = async () => {
      if (syncing) return;
      syncing = true;
      try {
        const result = await whatsappApi.syncTemplates();
        if (stopped || !result.ok) return;
        setTemplates(result.templates);
        if (globalWhatsAppDataCache) {
          globalWhatsAppDataCache = {
            ...globalWhatsAppDataCache,
            templates: result.templates,
            fetchedAt: Date.now(),
          };
        }
      } catch {
        // Keep showing the last known Meta status if a temporary sync fails.
      } finally {
        syncing = false;
      }
    };

    void syncPendingTemplates();
    const interval = window.setInterval(() => void syncPendingTemplates(), 15_000);
    return () => {
      stopped = true;
      window.clearInterval(interval);
    };
  }, [activeTab, hasPendingTemplates]);

  const tabTitles: Record<WhatsAppTab, { title: string; desc: string }> = {
    templates: {
      title: "Templates",
      desc: "Create, review, and preview your message templates.",
    },
    "contact-groups": {
      title: "Contact Groups",
      desc: "Organize the people you message.",
    },
    campaigns: {
      title: "Campaigns",
      desc: "Plan messages for your contact groups.",
    },
    agents: {
      title: "Agents",
      desc: "Set up automatic replies and handoff.",
    },
    "live-chat": {
      title: "Live Chat",
      desc: "Read and reply to conversations.",
    },
    "meta-forms": {
      title: "Meta Forms",
      desc: "Collect information through chat forms.",
    },
    "flow-maker": {
      title: "Flow Maker",
      desc: "Build simple conversation paths.",
    },
  };

  const isConnected = connectionStatus?.connected ?? false;
  const connectedAccounts = connectionStatus?.accounts || [];
  const displayNumber = connectionStatus?.metadata?.displayPhoneNumber || connectionStatus?.accountId;
  const extraCount = Math.max(0, connectedAccounts.length - 1);

  if (!session) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fafafa] text-[13px] font-medium text-[#71717a]">
        Loading WhatsApp...
      </main>
    );
  }

  return (
    <main
      className={`dashboard-home-theme whatsapp-workspace grid min-h-screen w-full min-w-0 overflow-x-clip bg-[#f7f9f8] dark:bg-[#09090b] text-[#171717] dark:text-zinc-100 ${
        showUserSidebar ? "lg:grid-cols-[248px_minmax(0,1fr)]" : "lg:grid-cols-[64px_minmax(0,1fr)]"
      }`}
    >
      <DashboardSidebar
        activeLabel={tabTitles[activeTab].title}
        userInitials={getInitials(session.name)}
        userName={session.name}
        userEmail={session.email}
        onLogout={() => void logoutSession().then(() => router.replace("/login"))}
        showUserSidebar={showUserSidebar}
        setShowUserSidebar={setShowUserSidebar}
      />

      <section className="grid min-w-0 content-start bg-[#fafafa] dark:bg-[#09090b]">
        {/* Workspace and Header */}
        <DashboardPageHeader
          eyebrow="WhatsApp workspace"
          title={tabTitles[activeTab].title}
          description={tabTitles[activeTab].desc}
          compact
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowConnectModal(true)}
                className={`inline-flex h-8 items-center gap-2 rounded-md px-3 text-[12.5px] font-medium transition ${
                  isConnected
                    ? "border border-[#eaeaea] bg-white text-[#171717] hover:bg-[#f4f4f5] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    : "border border-[#2563eb] bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    isConnected ? "bg-emerald-600" : "bg-white/85"
                  }`}
                />
                {isConnected ? (
                  <span className="max-w-56 truncate sm:max-w-none">
                    Connected {displayNumber ? `· ${displayNumber}` : ""}{extraCount > 0 ? ` (+${extraCount} more)` : ""}
                  </span>
                ) : (
                  <span>Connect WhatsApp</span>
                )}
              </button>
            </div>
          }
        />

        <div className="dashboard-page-content mx-auto w-full max-w-[1280px] space-y-4 px-4 py-4 sm:px-6">
          <nav className="-mx-4 flex gap-1 overflow-x-auto border-b border-[#eaeaea] dark:border-zinc-800 px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0 lg:hidden" aria-label="WhatsApp sections">
            {(["templates", "contact-groups", "campaigns", "agents", "live-chat", "meta-forms", "flow-maker"] as WhatsAppTab[]).map((tab) => (
              <Link key={tab} href={`/dashboard/whatsapp/${tab}`} aria-current={activeTab === tab ? "page" : undefined} className={`shrink-0 rounded-md border px-2.5 py-1.5 text-[12px] font-medium transition ${activeTab === tab ? "border-[#2563eb] bg-[#2563eb] text-white" : "border-transparent text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#171717] dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"}`}>
                {tabTitles[tab].title}
              </Link>
            ))}
          </nav>
          {/* Global Notice Alert */}
          {notice && (
            <div
              className={`flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-[12.5px] font-medium ${
                notice.type === "success"
                  ? "border-[#eaeaea] bg-white text-[#171717] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                  : "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
              }`}
            >
              <span>{notice.text}</span>
              <button onClick={() => setNotice(null)} className="text-current font-bold">
                ✕
              </button>
            </div>
          )}

          {isConnected && connectionStatus?.webhook &&
            (!connectionStatus.webhook.receiverReady ||
              !connectionStatus.webhook.subscribed ||
              connectionStatus.webhook.coexistenceSubscribed === false) && (
              <div className="flex flex-col gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-[12px] text-amber-950 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-2.5">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-amber-200 text-[11px] font-bold text-amber-900 dark:bg-amber-900/60 dark:text-amber-100">!</span>
                  <div className="min-w-0">
                    <strong className="block text-[12px] font-bold">
                      {!connectionStatus.webhook.receiverReady
                        ? "Inbound messages are blocked"
                        : !connectionStatus.webhook.subscribed
                          ? "Inbound webhook status could not be confirmed"
                          : "Coexistence webhook fields are not all subscribed"}
                    </strong>
                    <p className="mb-0 mt-1 leading-relaxed text-amber-900/90 dark:text-amber-100/80">
                      {!connectionStatus.webhook.receiverReady
                        ? "Set META_APP_SECRET on the backend and restart it so inbound webhook signatures can be verified."
                        : !connectionStatus.webhook.subscribed
                          ? <>Your WhatsApp account is still connected. This check only affects receiving incoming chats; outbound messages can continue to work. In Meta for Developers, open your app → WhatsApp → Configuration and confirm the <strong>messages</strong> webhook field is subscribed. Callback URL: <code className="break-all rounded bg-amber-100 px-1 dark:bg-amber-900/50">{connectionStatus.webhook.callbackUrl || "the backend WhatsApp webhook URL"}</code>. Use the same verification token configured on the backend.</>
                          : <>In Meta for Developers → WhatsApp → Configuration, subscribe the missing coexistence webhook fields (<code className="rounded bg-amber-100 px-1 dark:bg-amber-900/50">{(connectionStatus.webhook.missingCoexistenceFields || ["smb_message_echoes", "smb_app_state_sync", "history"]).join(", ")}</code>) so mobile app replies, contacts, and chat history stay in sync.</>}
                    </p>
                  </div>
                </div>
                {connectionStatus.webhook.receiverReady && (
                  <div className="flex shrink-0 flex-wrap items-center gap-2 pl-8 sm:pl-0">
                    <a href="https://developers.facebook.com/apps/" target="_blank" rel="noreferrer" className="inline-flex h-8 items-center rounded-lg border border-amber-300 bg-white px-3 text-[11px] font-semibold text-amber-950 transition hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100 dark:hover:bg-amber-900/50">Open Meta app</a>
                    <button type="button" onClick={() => void recheckWhatsAppWebhook()} disabled={webhookChecking} className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-amber-900 px-3 text-[11px] font-semibold text-white transition hover:bg-amber-800 disabled:cursor-wait disabled:opacity-60 dark:bg-amber-200 dark:text-amber-950 dark:hover:bg-amber-100">
                      {webhookChecking && <span className="size-3 animate-spin rounded-full border border-current border-t-transparent" />}
                      {webhookChecking ? "Checking..." : "Recheck"}
                    </button>
                  </div>
                )}
              </div>
            )}

          {/* Sub-feature Views */}
          {loading ? (
            <div className="grid h-64 place-items-center text-[12.5px] text-[#71717a] dark:text-zinc-400">
              <div className="flex flex-col items-center gap-2">
                <span className="size-5 animate-spin rounded-full border-2 border-[#2563eb] border-t-transparent" />
                <span>Synchronizing WhatsApp data...</span>
              </div>
            </div>
          ) : (
            <div className="whatsapp-view min-w-0">
              {activeTab === "templates" && (
                <WhatsAppTemplatesView
                  templates={templates}
                  onRefresh={() => void loadData(true)}
                  onOpenConnectModal={() => setShowConnectModal(true)}
                  isConnected={isConnected}
                />
              )}

              {activeTab === "contact-groups" && (
                <WhatsAppContactGroupsView
                  groups={groups}
                  contacts={contacts}
                  onRefresh={() => void loadData(true)}
                  onNavigateToCampaign={(groupId) => {
                    setActiveTab("campaigns");
                    router.push("/dashboard/whatsapp/campaigns");
                  }}
                />
              )}

              {activeTab === "campaigns" && (
                <WhatsAppCampaignsView
                  campaigns={campaigns}
                  templates={templates}
                  groups={groups}
                  accounts={connectedAccounts}
                  onRefresh={() => void loadData(true)}
                />
              )}

              {activeTab === "agents" && (
                <WhatsAppAgentsView
                  config={agentConfig}
                  accounts={connectedAccounts}
                  onRefresh={() => void loadData(true)}
                />
              )}

              {activeTab === "live-chat" && (
                <WhatsAppLiveChatView
                  conversations={conversations}
                  templates={templates}
                  onRefresh={() => void loadData(true)}
                />
              )}

              {activeTab === "meta-forms" && (
                <WhatsAppMetaFormsView forms={forms} onRefresh={() => void loadData(true)} />
              )}

              {activeTab === "flow-maker" && (
                <WhatsAppFlowMakerView flows={flows} accounts={connectedAccounts} onRefresh={() => void loadData(true)} />
              )}
            </div>
          )}
        </div>
      </section>

      {/* Embedded Signup & Connection Modal */}
      {showConnectModal && (
        <WhatsAppEmbeddedSignupModal
          status={connectionStatus}
          onClose={() => setShowConnectModal(false)}
          onSuccess={(msg) => {
            setNotice({ type: "success", text: msg });
            void loadData(true);
          }}
          onError={(err) => setNotice({ type: "error", text: err })}
        />
      )}
    </main>
  );
}

