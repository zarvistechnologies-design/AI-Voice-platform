"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  DashboardSidebar,
  getDashboardSidebarInitialState,
} from "@/components/dashboard/DashboardSidebar";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import {
  getServerSession,
  getSession,
  logoutSession,
  subscribeToSession,
  validateStoredSession,
} from "@/lib/auth";
import {
  integrationsApi,
  type AgentSummary,
  type DigitalBotConnection,
  type IntegrationProvider,
} from "@/lib/integrations";
import { WhatsAppModal } from "@/components/integrations/WhatsAppModal";
import { ClaudeConnectorCard } from "@/components/integrations/ClaudeConnectorCard";
import { RequestedIntegrationsSection } from "@/components/integrations/RequestedIntegrationsSection";

const catalog = {
  vobiz: {
    name: "Vobiz",
    category: "Telephony",
    description: "Buy, import, and route phone numbers to your voice agents.",
    logo: "/images/integrations/vobiz.svg",
    color: "from-[#118778] to-[#25b39f]",
  },
  hubspot: {
    name: "HubSpot",
    category: "CRM",
    description:
      "Create callers as contacts and log completed calls as CRM notes.",
    logo: "/images/company-logos/hubspot.svg",
    color: "from-[#118778] to-[#25b39f]",
    flow: "After every finalized call",
  },
  calendly: {
    name: "Calendly",
    category: "Scheduling",
    description:
      "Let agents discover event types and create one-time booking links during calls.",
    logo: "/images/integrations/calendly.svg",
    color: "from-[#118778] to-[#25b39f]",
    flow: "Used live by the agent during a call",
  },
  slack: {
    name: "Slack",
    category: "Notifications",
    description:
      "Send automatic call completion notifications to a Slack channel.",
    logo: "/images/integrations/slack.svg",
    color: "from-[#118778] to-[#25b39f]",
    flow: "After every finalized call",
  },
  razorpay_api: {
    name: "Razorpay API",
    category: "Payments",
    description: "Connect your merchant keys and inspect recent payment status.",
    logo: "/images/integrations/razorpay.png",
    color: "from-[#118778] to-[#25b39f]",
  },
  razorpay_oauth: {
    name: "Razorpay OAuth",
    category: "Payments",
    description: "Authorize a merchant account and inspect recent payments.",
    logo: "/images/integrations/razorpay.png",
    color: "from-[#118778] to-[#25b39f]",
  },
  asana: {
    name: "Asana",
    category: "Work management",
    description: "Connect your account and browse accessible projects.",
    logo: "/images/integrations/asana.svg",
    color: "from-[#118778] to-[#25b39f]",
  },
  clickup: {
    name: "ClickUp",
    category: "Work management",
    description: "Connect your account and browse authorized workspaces.",
    logo: "/images/integrations/clickup.svg",
    color: "from-[#118778] to-[#25b39f]",
  },
  linear: {
    name: "Linear",
    category: "Work management",
    description: "Connect your account and browse recent issues.",
    logo: "/images/integrations/linear.svg",
    color: "from-[#118778] to-[#25b39f]",
  },
  freshsales: {
    name: "Freshsales",
    category: "CRM",
    description: "Connect your Freshsales account and browse contact views.",
    logo: "/images/integrations/freshsales.ico",
    color: "from-[#118778] to-[#25b39f]",
  },
  highlevel: {
    name: "GoHighLevel",
    category: "CRM",
    description: "Connect a HighLevel location and browse its CRM contacts.",
    logo: "/images/integrations/highlevel.svg",
    color: "from-[#118778] to-[#25b39f]",
  },
  zoho: {
    name: "Zoho CRM",
    category: "CRM",
    description: "Authorize your CRM account and browse accessible contacts.",
    logo: "/images/integrations/zoho.svg",
    color: "from-[#118778] to-[#25b39f]",
  },
  salesforce: {
    name: "Salesforce",
    category: "CRM",
    description: "Authorize your Salesforce account and browse accessible contacts.",
    logo: "/images/integrations/salesforce.svg",
    color: "from-[#118778] to-[#25b39f]",
  },
  google_calendar: {
    name: "Google Calendar",
    category: "Scheduling",
    description:
      "Check live availability and let selected voice agents create appointments during calls.",
    logo: "/images/integrations/google-calendar.svg",
    color: "from-[#0e6f62] to-[#25b39f]",
    flow: "Used live by enabled agents",
  },
  google_sheets: {
    name: "Google Sheets",
    category: "Data & leads",
    description:
      "Append qualified leads and call outcomes to a spreadsheet and sheet tab you select.",
    logo: "/images/integrations/google-sheets.svg",
    color: "from-[#118778] to-[#25b39f]",
    flow: "Used live by enabled agents",
  },
  google_docs: {
    name: "Google Docs",
    category: "Documents",
    description: "Browse accessible documents and preview their content.",
    logo: "/images/integrations/googledocs.svg",
    color: "from-[#118778] to-[#25b39f]",
  },
  google_drive: {
    name: "Google Drive",
    category: "Documents",
    description: "Browse files in the connected Google Drive account.",
    logo: "/images/integrations/googledrive.svg",
    color: "from-[#118778] to-[#25b39f]",
  },
  google_gmail: {
    name: "Gmail",
    category: "Messaging",
    description: "Read recent message subjects from the connected Gmail account.",
    logo: "/images/integrations/gmail.svg",
    color: "from-[#118778] to-[#25b39f]",
  },
  google: {
    name: "Google",
    category: "Google Workspace",
    description: "Shared authorization for Google Calendar and Google Sheets.",
    logo: "/images/integrations/google-calendar.svg",
    color: "from-[#118778] to-[#25b39f]",
    flow: "OAuth authorization",
  },
  digitalbot: {
    name: "DigitalBot",
    category: "Clinic operations",
    description:
      "Connect a DigitalBot workspace so agents can check doctor availability and create appointments.",
    logo: "/images/company-logos/digitalbot.png",
    color: "from-[#118778] to-emerald-400",
    flow: "Used live by attached agents",
  },
  whatsapp: {
    name: "WhatsApp Business",
    category: "Messaging",
    description:
      "Send automated appointment confirmations, slips, and notifications via WhatsApp.",
    logo: "/images/integrations/whatsapp.svg",
    color: "from-[#25D366] to-[#128C7E]",
    flow: "Meta Embedded Signup",
  },
} as const;

const tokenProviderIds = ["asana", "clickup", "linear", "freshsales", "highlevel"] as const;
const voiceReadProviderIds: string[] = [...tokenProviderIds, "zoho", "salesforce", "razorpay_api", "razorpay_oauth", "google_calendar", "google_drive", "google_docs", "google_gmail"];
type TokenProviderId = (typeof tokenProviderIds)[number];

function isTokenProviderId(id: IntegrationProvider["id"]): id is TokenProviderId {
  return tokenProviderIds.includes(id as TokenProviderId);
}

function isCatalogId(id: string): id is keyof typeof catalog {
  return Object.prototype.hasOwnProperty.call(catalog, id);
}

const googleScopeRequirements: Partial<Record<keyof typeof catalog, string[]>> = {
  google_calendar: ["https://www.googleapis.com/auth/calendar"],
  google_sheets: ["https://www.googleapis.com/auth/spreadsheets"],
  google_drive: ["https://www.googleapis.com/auth/drive.readonly"],
  google_docs: ["https://www.googleapis.com/auth/drive.metadata.readonly", "https://www.googleapis.com/auth/documents.readonly"],
  google_gmail: ["https://www.googleapis.com/auth/gmail.readonly"],
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function digitalBotConnections(provider: IntegrationProvider) {
  const connections = provider.metadata?.connections;
  return Array.isArray(connections)
    ? (connections as DigitalBotConnection[])
    : [];
}

function digitalBotAgentLabel(agent: AgentSummary) {
  return `${agent.name} - ${agent.status}${agent.phone ? ` - ${agent.phone}` : " - no phone assigned"}`;
}

export function IntegrationsShell() {
  const router = useRouter();
  const session = useSyncExternalStore(
    subscribeToSession,
    getSession,
    getServerSession,
  );
  const [providers, setProviders] = useState<IntegrationProvider[]>([]);
  const [selected, setSelected] = useState<Exclude<
    IntegrationProvider["id"],
    "vobiz"
  > | null>(null);
  const [credential, setCredential] = useState("");
  const [razorpayKeyId, setRazorpayKeyId] = useState("");
  const [freshsalesSite, setFreshsalesSite] = useState("");
  const [highlevelLocationId, setHighlevelLocationId] = useState("");
  const [razorpayPayments, setRazorpayPayments] = useState<Awaited<ReturnType<typeof integrationsApi.razorpayPayments>> | null>(null);
  const [razorpayOAuthPayments, setRazorpayOAuthPayments] = useState<Awaited<ReturnType<typeof integrationsApi.razorpayOAuthPayments>> | null>(null);
  const [providerPreviews, setProviderPreviews] = useState<Partial<Record<TokenProviderId, Awaited<ReturnType<typeof integrationsApi.tokenProviderPreview>>>>>({});
  const [crmPreviews, setCrmPreviews] = useState<Partial<Record<"zoho" | "salesforce", Awaited<ReturnType<typeof integrationsApi.crmPreview>>>>>({});
  const [agentAccess, setAgentAccess] = useState<Array<{ id: string; name: string; status: string; providers: string[] }>>([]);
  const [googlePreviews, setGooglePreviews] = useState<Partial<Record<"drive" | "docs" | "gmail", Awaited<ReturnType<typeof integrationsApi.googlePreview>>>>>({});
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [showUserSidebar, setShowUserSidebar] = useState(
    getDashboardSidebarInitialState,
  );
  const [manageGoogle, setManageGoogle] = useState(false);
  const [calendars, setCalendars] = useState<
    Array<{ id: string; name: string; primary: boolean; timezone: string }>
  >([]);
  const [spreadsheetInput, setSpreadsheetInput] = useState("");
  const [spreadsheet, setSpreadsheet] = useState<{
    id: string;
    name: string;
    sheets: string[];
  } | null>(null);
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [digitalBotAgentId, setDigitalBotAgentId] = useState("");
  const [digitalBotConnectionName, setDigitalBotConnectionName] = useState("");
  const [modalError, setModalError] = useState("");

  const load = useCallback(async () => {
    try {
      setProviders((await integrationsApi.list()).providers);
      const access = await integrationsApi.agentAccess().catch(() => ({ agents: [] }));
      setAgentAccess(access.agents);
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Could not load integrations.",
      );
    }
  }, []);

  async function toggleAgentAccess(agentId: string, provider: string, enabled: boolean) {
    setBusy(true);
    try {
      const result = await integrationsApi.setAgentAccess(agentId, provider, enabled);
      setAgentAccess((current) => current.map((agent) => agent.id === agentId ? { ...agent, providers: result.providers } : agent));
      setNotice(`${catalog[provider as keyof typeof catalog].name} ${enabled ? "enabled" : "disabled"} for this voice agent.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not change agent integration access.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/dashboard/integrations");
      return;
    }
    void validateStoredSession();
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load, router, session]);

  async function connect() {
    if (!selected || selected === "google") return;
    if (selected === "digitalbot" && !digitalBotAgentId) {
      const message =
        "Choose the Vozon agent this DigitalBot dashboard belongs to.";
      setModalError(message);
      setNotice(message);
      return;
    }
    setModalError("");
    setBusy(true);
    try {
      if (selected === "digitalbot") {
        await integrationsApi.connectDigitalBot({
          agentId: digitalBotAgentId,
          connectorToken: credential,
          name: digitalBotConnectionName,
        });
        setCredential("");
        setDigitalBotConnectionName("");
        setSelected(null);
        await load();
        setNotice(
          "DigitalBot connected. Turn on Connector tools when you want to add them to this agent.",
        );
      } else {
        await integrationsApi.connect(
          selected,
          selected === "razorpay_api"
            ? JSON.stringify({ keyId: razorpayKeyId.trim(), keySecret: credential.trim() })
            : selected === "freshsales"
              ? JSON.stringify({ site: freshsalesSite.trim(), apiKey: credential.trim() })
            : selected === "highlevel"
              ? JSON.stringify({ locationId: highlevelLocationId.trim(), token: credential.trim() })
            : credential,
        );
        setCredential("");
        setRazorpayKeyId("");
        setFreshsalesSite("");
        setHighlevelLocationId("");
        setSelected(null);
        await load();
        setNotice(`${catalog[selected].name} connected and verified.`);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not connect integration.";
      setModalError(message);
      setNotice(message);
    } finally {
      setBusy(false);
    }
  }

  async function disconnect(
    provider: Exclude<IntegrationProvider["id"], "vobiz">,
  ) {
    const providerName =
      provider === "google"
        ? "Google Calendar and Sheets"
        : catalog[provider].name;
    if (!window.confirm(`Disconnect ${providerName}?`)) return;
    setBusy(true);
    try {
      if (provider === "google") await integrationsApi.disconnectGoogle();
      else if (provider === "whatsapp") await integrationsApi.disconnectWhatsApp();
      else await integrationsApi.disconnect(provider);
      if (provider === "google") setGooglePreviews({});
      if (provider === "razorpay_api") setRazorpayPayments(null);
      if (provider === "razorpay_oauth") setRazorpayOAuthPayments(null);
      if (provider === "zoho" || provider === "salesforce") setCrmPreviews((current) => ({ ...current, [provider]: undefined }));
      if (isTokenProviderId(provider)) setProviderPreviews((current) => ({ ...current, [provider]: undefined }));
      await load();
      setNotice(`${providerName} disconnected.`);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Could not disconnect integration.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function connectGoogle(feature: "core" | "drive" | "docs" | "gmail" = "core") {
    setBusy(true);
    try {
      const { url } = await integrationsApi.googleOAuthUrl(feature);
      window.location.assign(url);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Could not start Google authorization.",
      );
      setBusy(false);
    }
  }

  async function connectCrm(provider: "zoho" | "salesforce", sandbox = false) {
    setBusy(true);
    try {
      const { url } = await integrationsApi.crmOAuthUrl(provider, sandbox);
      window.location.assign(url);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : `Could not start ${catalog[provider].name} authorization.`);
      setBusy(false);
    }
  }

  async function connectRazorpayOAuth(mode: "live" | "test" = "live") {
    setBusy(true);
    try {
      const { url } = await integrationsApi.razorpayOAuthUrl(mode);
      window.location.assign(url);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not start Razorpay authorization.");
      setBusy(false);
    }
  }

  async function previewRazorpayOAuth() {
    setBusy(true);
    try { setRazorpayOAuthPayments(await integrationsApi.razorpayOAuthPayments()); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Could not read Razorpay payments."); }
    finally { setBusy(false); }
  }

  async function previewCrm(provider: "zoho" | "salesforce") {
    setBusy(true);
    try {
      const preview = await integrationsApi.crmPreview(provider);
      setCrmPreviews((current) => ({ ...current, [provider]: preview }));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : `Could not read ${catalog[provider].name} contacts.`);
    } finally {
      setBusy(false);
    }
  }

  async function previewGoogle(feature: "drive" | "docs" | "gmail") {
    setBusy(true);
    try {
      const preview = await integrationsApi.googlePreview(feature);
      setGooglePreviews((current) => ({ ...current, [feature]: preview }));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not read Google resources.");
    } finally {
      setBusy(false);
    }
  }

  async function previewRazorpayPayments() {
    setBusy(true);
    try {
      setRazorpayPayments(await integrationsApi.razorpayPayments());
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not read Razorpay payments.");
    } finally {
      setBusy(false);
    }
  }

  async function previewTokenProvider(provider: TokenProviderId) {
    setBusy(true);
    try {
      const preview = await integrationsApi.tokenProviderPreview(provider);
      setProviderPreviews((current) => ({ ...current, [provider]: preview }));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not read provider resources.");
    } finally {
      setBusy(false);
    }
  }

  async function openGoogleManager(view: "calendar" | "sheets") {
    setBusy(true);
    try {
      if (view === "calendar") {
        setCalendars((await integrationsApi.googleCalendars()).calendars);
      }
      setManageGoogle(true);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Could not load Google resources.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function inspectSpreadsheet() {
    setBusy(true);
    try {
      setSpreadsheet(
        (await integrationsApi.inspectSpreadsheet(spreadsheetInput))
          .spreadsheet,
      );
      setNotice(
        "Spreadsheet verified. Copy its ID and tab into the agent’s Native Google tools.",
      );
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Could not access that spreadsheet.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function loadAgentsForDigitalBot() {
    setAgentsLoading(true);
    setModalError("");
    try {
      const result = await integrationsApi.agentSummaries();
      setAgents(result.agents);
      setDigitalBotAgentId((current) => current || result.agents[0]?._id || "");
      if (result.agents.length === 0) {
        setModalError(
          "Create a Vozon agent before adding a DigitalBot connection.",
        );
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not load agents.";
      setModalError(message);
      setNotice(message);
    } finally {
      setAgentsLoading(false);
    }
  }

  async function verifyDigitalBot(agentId = digitalBotAgentId) {
    if (!agentId) {
      setNotice("Choose a DigitalBot connection to verify.");
      return;
    }
    setBusy(true);
    try {
      await integrationsApi.verifyDigitalBot(agentId);
      await load();
      setNotice("DigitalBot connection verified.");
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Could not verify DigitalBot.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function disconnectDigitalBot(agentId: string, label: string) {
    if (!window.confirm(`Disconnect DigitalBot from ${label}?`)) return;
    setBusy(true);
    try {
      await integrationsApi.disconnectDigitalBot(agentId);
      await load();
      setNotice(`DigitalBot disconnected from ${label}.`);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Could not disconnect DigitalBot.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function setDigitalBotTools(agentId: string, enabled: boolean) {
    if (!agentId) {
      setNotice("Choose an agent before changing DigitalBot tools.");
      return;
    }
    setBusy(true);
    try {
      await integrationsApi.setDigitalBotTools(agentId, enabled);
      await load();
      setNotice(
        enabled
          ? "DigitalBot connector tools activated."
          : "DigitalBot connector tools deactivated. Manual tools were not changed.",
      );
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Could not update DigitalBot tools.",
      );
    } finally {
      setBusy(false);
    }
  }

  const displayProviders = providers.reduce<
    Array<{
      provider: IntegrationProvider;
      displayId: keyof typeof catalog;
    }>
  >((items, provider) => {
    // Keep both CRM replacements visible so administrators can see their
    // setup state. Other unfinished OAuth connectors stay hidden.
    if (!["zoho", "salesforce"].includes(provider.id) && provider.metadata?.platformConfigured === false && !provider.connected) {
      return items;
    }
    if (provider.id === "google") {
      items.push(
        { provider, displayId: "google_calendar" },
        { provider, displayId: "google_sheets" },
        { provider, displayId: "google_docs" },
        { provider, displayId: "google_drive" },
        { provider, displayId: "google_gmail" },
      );
    } else if (isCatalogId(provider.id)) {
      items.push({ provider, displayId: provider.id });
    }
    return items;
  }, []);

  if (!session)
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 text-sm font-semibold">
        Loading integrations
      </main>
    );

  return (
    <main
      className={`dashboard-home-theme grid min-h-screen bg-white text-slate-950 ${
        showUserSidebar
          ? "lg:grid-cols-[248px_minmax(0,1fr)]"
          : "lg:grid-cols-[64px_minmax(0,1fr)]"
      }`}
    >
      <DashboardSidebar
        activeLabel="Integrations"
        userInitials={initials(session.name)}
        userName={session.name}
        userEmail={session.email}
        onLogout={() =>
          void logoutSession().then(() => router.replace("/login"))
        }
        showUserSidebar={showUserSidebar}
        setShowUserSidebar={setShowUserSidebar}
      />
      <section className="min-w-0">
        <DashboardPageHeader
          eyebrow="Native connections"
          title="Integrations"
          description="Connect telephony, CRM, scheduling, and notification providers. Credentials are encrypted and never displayed again."
        />
        <div className="grid w-full gap-5 px-4 py-4 sm:px-5 lg:px-6">
          {notice ? (
            <div className="rounded-xl border border-[#b8c8c3] bg-[#edf7f4] px-4 py-3 text-sm text-[#123d35]">
              {notice}
            </div>
          ) : null}
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ClaudeConnectorCard />
            {displayProviders.map(({ provider, displayId }) => {
              const item = catalog[displayId];
              const googleView =
                displayId === "google_calendar" ? "calendar" : "sheets";
              const googleExtraFeature = displayId === "google_drive" ? "drive"
                : displayId === "google_docs" ? "docs"
                : displayId === "google_gmail" ? "gmail" : null;
              const grantedScopes = Array.isArray(provider.metadata.scopes)
                ? provider.metadata.scopes.filter((scope): scope is string => typeof scope === "string")
                : [];
              const displayConnected = provider.id === "google"
                ? provider.connected && (googleScopeRequirements[displayId] ?? []).every((scope) => grantedScopes.includes(scope))
                : provider.connected;
              const setupNeeded = !displayConnected && provider.metadata?.platformConfigured === false;
              const displayDelivery = googleExtraFeature ? null : provider.delivery;
              const voiceReadId = provider.id === "google" ? displayId : provider.id;
              const dbConnections =
                provider.id === "digitalbot"
                  ? digitalBotConnections(provider)
                  : [];
              return (
                <article
                  className="min-h-[300px] overflow-hidden rounded-xl border border-[#dfe7e4] bg-white transition hover:border-[#9fcfc3] hover:shadow-[0_14px_34px_rgba(17,62,53,.08)]"
                  key={displayId}
                  id={`integration-${displayId}`}
                >
                  <div className="flex h-full flex-col p-5">
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid h-12 min-w-12 place-items-start">
                        <Image
                          alt={`${item.name} logo`}
                          className={`h-12 w-auto object-contain object-left ${displayId === "digitalbot" ? "max-w-14" : "max-w-28"}`}
                          height={48}
                          src={item.logo}
                          unoptimized={item.logo.endsWith(".ico")}
                          width={112}
                        />
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${setupNeeded ? "bg-amber-50 text-amber-800" : displayConnected ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                      >
                        {setupNeeded ? "Setup needed" : displayConnected ? "Connected" : "Available"}
                      </span>
                    </div>
                    <span className="mt-5 text-[10px] font-bold uppercase tracking-[.14em] text-[#71817d]">
                      {item.category}
                    </span>
                    <h2 className="mt-1 text-xl font-semibold tracking-[-.02em] text-slate-950">
                      {item.name}
                    </h2>
                    <p className="mt-1 min-h-12 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                    {setupNeeded ? <p className="mt-2 text-xs leading-5 text-amber-800">Vozon must configure its OAuth application before customers can authorize this provider.</p> : null}
                    {displayConnected || displayDelivery ? (
                      <details className="group mt-3 text-xs text-slate-600">
                        <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold text-[#0e6f62] marker:content-none">
                          Connection details
                          <span className="transition group-open:rotate-180">⌄</span>
                        </summary>
                        <div className="mt-2 rounded-xl bg-[#f7f9f8] p-3">
                          {displayConnected ? (
                            <>
                              <strong className="block text-sm text-slate-900">
                                {provider.accountId}
                              </strong>
                              <span className="mt-1 block text-slate-500">
                                Verified{" "}
                                {provider.lastVerifiedAt
                                  ? new Date(provider.lastVerifiedAt).toLocaleString()
                                  : "recently"}
                              </span>
                            </>
                          ) : null}
                          {displayDelivery ? (
                            <div className={`mt-2 rounded-lg border p-2 ${displayDelivery.status === "delivered" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : displayDelivery.status === "failed" ? "border-rose-200 bg-rose-50 text-rose-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
                              <strong className="block uppercase tracking-wide">
                                Last delivery: {displayDelivery.status}
                              </strong>
                              <span className="mt-1 block">
                                Attempts: {displayDelivery.attempts} · Updated{" "}
                                {new Date(displayDelivery.updatedAt).toLocaleString()}
                              </span>
                              {displayDelivery.errorMessage ? <span className="mt-1 block">{displayDelivery.errorMessage}</span> : null}
                            </div>
                          ) : null}
                        </div>
                      </details>
                    ) : null}
                    {provider.id === "digitalbot" ? (
                      <details className="group mt-3 text-xs leading-5 text-slate-700">
                        <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold text-[#0e6f62] marker:content-none">
                          Manage agent connections
                          <span className="transition group-open:rotate-180">⌄</span>
                        </summary>
                        <div className="mt-2 rounded-xl border border-[#dfe7e4] bg-[#edf7f4]/60 p-3">
                        <strong className="block text-slate-900">
                          One connection belongs to one selected Vozon agent.
                        </strong>
                        <span>
                          Connecting does not add tools. Turn on Connector tools
                          for the selected agent when you want the DigitalBot
                          appointment tools; manual tools and other agents stay
                          unchanged.
                        </span>
                        {dbConnections.length ? (
                          <div className="mt-3 grid gap-2">
                            {dbConnections.map((connection) => (
                              <div
                                key={
                                  connection.targetAgentId ||
                                  connection.connectionId
                                }
                                className="rounded-xl border border-[#dfe7e4] bg-white p-3"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                  <div>
                                    <strong className="block text-sm text-slate-900">
                                      {connection.displayName ||
                                        connection.targetAgentName ||
                                        "DigitalBot connection"}
                                    </strong>
                                    <span className="block text-slate-500">
                                      Agent:{" "}
                                      {connection.targetAgentName ||
                                        connection.targetAgentId}
                                    </span>
                                    <span className="block text-slate-500">
                                      Workspace:{" "}
                                      {connection.metadata.workspaceName ||
                                        connection.accountId}
                                    </span>
                                  </div>
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${connection.connected ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
                                  >
                                    {connection.status}
                                  </span>
                                </div>
                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                  <button
                                    className="rounded-lg border border-[#b8c8c3] px-3 py-1.5 font-semibold text-[#123d35]"
                                    disabled={busy}
                                    type="button"
                                    onClick={() =>
                                      void verifyDigitalBot(
                                        connection.targetAgentId,
                                      )
                                    }
                                  >
                                    Verify
                                  </button>
                                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700">
                                    <input
                                      className="h-4 w-4 accent-[#118778]"
                                      type="checkbox"
                                      role="switch"
                                      checked={connection.toolsActive}
                                      disabled={busy}
                                      onChange={(event) =>
                                        void setDigitalBotTools(
                                          connection.targetAgentId,
                                          event.target.checked,
                                        )
                                      }
                                    />
                                    Connector tools
                                  </label>
                                  <button
                                    className="rounded-lg px-3 py-1.5 font-semibold text-rose-700"
                                    disabled={busy}
                                    type="button"
                                    onClick={() =>
                                      void disconnectDigitalBot(
                                        connection.targetAgentId,
                                        connection.targetAgentName ||
                                          connection.displayName ||
                                          "this agent",
                                      )
                                    }
                                  >
                                    Disconnect
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-3 rounded-lg bg-white/70 p-3 text-slate-600">
                            No DigitalBot agent connections yet.
                          </p>
                        )}
                        </div>
                      </details>
                    ) : null}
                    {displayConnected && provider.id === "razorpay_api" && razorpayPayments ? (
                      <div className="mt-3 rounded-xl bg-[#f7f9f8] p-3 text-xs text-slate-700">
                        <strong className="block text-slate-900">Recent payments</strong>
                        {razorpayPayments.payments.length ? razorpayPayments.payments.map((payment) => (
                          <div key={payment.id} className="mt-2 flex justify-between gap-2 border-t border-[#dfe7e4] pt-2">
                            <span className="truncate">{payment.status}</span>
                            <span>{payment.currency} {(payment.amount / 100).toFixed(2)}</span>
                          </div>
                        )) : <span className="mt-2 block">No recent payments found.</span>}
                      </div>
                    ) : null}
                    {displayConnected && provider.id === "razorpay_oauth" && razorpayOAuthPayments ? (
                      <div className="mt-3 rounded-xl bg-[#f7f9f8] p-3 text-xs text-slate-700">
                        <strong className="block text-slate-900">Recent merchant payments</strong>
                        {razorpayOAuthPayments.payments.length ? razorpayOAuthPayments.payments.map((payment) => (
                          <div key={payment.id} className="mt-2 flex justify-between gap-2 border-t border-[#dfe7e4] pt-2"><span>{payment.status}</span><span>{payment.currency} {(payment.amount / 100).toFixed(2)}</span></div>
                        )) : <span className="mt-2 block">No recent payments found.</span>}
                      </div>
                    ) : null}
                    {displayConnected && isTokenProviderId(provider.id) && providerPreviews[provider.id] ? (
                      <div className="mt-3 rounded-xl bg-[#f7f9f8] p-3 text-xs text-slate-700">
                        <strong className="block text-slate-900">Accessible resources</strong>
                        {providerPreviews[provider.id]?.items.length ? providerPreviews[provider.id]?.items.map((resource) => (
                          <div key={resource.id} className="mt-2 flex justify-between gap-2 border-t border-[#dfe7e4] pt-2">
                            <span className="truncate">{resource.name}</span>
                            <span className="shrink-0 text-slate-500">{resource.type}</span>
                          </div>
                        )) : <span className="mt-2 block">No accessible resources found.</span>}
                      </div>
                    ) : null}
                    {displayConnected && (provider.id === "zoho" || provider.id === "salesforce") && crmPreviews[provider.id] ? (
                      <div className="mt-3 rounded-xl bg-[#f7f9f8] p-3 text-xs text-slate-700">
                        <strong className="block text-slate-900">Accessible contacts</strong>
                        {crmPreviews[provider.id]?.items.length ? crmPreviews[provider.id]?.items.map((contact) => (
                          <div key={contact.id} className="mt-2 border-t border-[#dfe7e4] pt-2">{contact.name}</div>
                        )) : <span className="mt-2 block">No accessible contacts found.</span>}
                      </div>
                    ) : null}
                    {displayConnected && googleExtraFeature && googlePreviews[googleExtraFeature] ? (
                      <div className="mt-3 rounded-xl bg-[#f7f9f8] p-3 text-xs text-slate-700">
                        <strong className="block text-slate-900">Recent {item.name} resources</strong>
                        {googlePreviews[googleExtraFeature]?.items.length ? googlePreviews[googleExtraFeature]?.items.map((resource) => (
                          <div key={resource.id} className="mt-2 border-t border-[#dfe7e4] pt-2">
                            <span className="block truncate font-medium">{resource.name}</span>
                            {resource.excerpt ? <span className="mt-1 block line-clamp-2 text-slate-500">{resource.excerpt}</span> : null}
                          </div>
                        )) : <span className="mt-2 block">No accessible resources found.</span>}
                      </div>
                    ) : null}
                    {displayConnected && voiceReadProviderIds.includes(voiceReadId) && agentAccess.length ? (
                      <details className="group mt-3 rounded-xl border border-[#dfe7e4] bg-[#f7f9f8] p-3 text-xs text-slate-700">
                        <summary className="cursor-pointer font-semibold text-[#0e6f62]">Voice agent access</summary>
                        <p className="mt-2 leading-5 text-slate-600">Enable read-only access for selected agents during calls. Callers may ask about this provider&apos;s data.</p>
                        <div className="mt-2 grid gap-2">
                          {agentAccess.map((agent) => (
                            <label key={agent.id} className="flex items-center gap-2">
                              <input type="checkbox" className="accent-[#118778]" checked={agent.providers.includes(voiceReadId)} disabled={busy} onChange={(event) => void toggleAgentAccess(agent.id, voiceReadId, event.target.checked)} />
                              <span>{agent.name} · {agent.status}</span>
                            </label>
                          ))}
                        </div>
                      </details>
                    ) : null}
                    <div className="mt-auto flex flex-wrap gap-2 pt-5">
                      {provider.id === "vobiz" ? (
                        <Link
                          className="rounded-lg bg-[#118778] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0e6f62]"
                          href="/dashboard/phone-number"
                          prefetch={false}
                          onFocus={() =>
                            router.prefetch("/dashboard/phone-number")
                          }
                          onMouseEnter={() =>
                            router.prefetch("/dashboard/phone-number")
                          }
                          onPointerDown={() =>
                            router.prefetch("/dashboard/phone-number")
                          }
                        >
                          Manage Vobiz
                        </Link>
                      ) : provider.id === "google" ? (
                        displayConnected ? (
                          <>
                            {googleExtraFeature ? (
                              <button
                                className="rounded-lg bg-[#118778] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0e6f62]"
                                disabled={busy}
                                type="button"
                                onClick={() => void previewGoogle(googleExtraFeature)}
                              >
                                View {item.name}
                              </button>
                            ) : (
                              <button
                                className="rounded-lg bg-[#118778] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0e6f62]"
                                disabled={busy}
                                type="button"
                                onClick={() => void openGoogleManager(googleView)}
                              >
                                Configure {item.name}
                              </button>
                            )}
                            <button
                              className="rounded-lg border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700"
                              disabled={busy}
                              type="button"
                              onClick={() => void disconnect("google")}
                            >
                              Disconnect all Google
                            </button>
                          </>
                        ) : (
                          <button
                            className="rounded-lg bg-[#118778] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0e6f62]"
                            disabled={busy}
                            type="button"
                            onClick={() => void connectGoogle(googleExtraFeature ?? "core")}
                          >
                            Connect {item.name}
                          </button>
                        )
                      ) : provider.id === "razorpay_oauth" ? (
                        displayConnected ? (
                          <>
                            <button className="rounded-lg bg-[#118778] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0e6f62]" disabled={busy} type="button" onClick={() => void previewRazorpayOAuth()}>Check payments</button>
                            <button className="rounded-lg border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700" disabled={busy} type="button" onClick={() => void disconnect("razorpay_oauth")}>Disconnect</button>
                          </>
                        ) : (
                          <>
                            <button className="rounded-lg bg-[#118778] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0e6f62]" disabled={busy} type="button" onClick={() => void connectRazorpayOAuth()}>Connect {item.name}</button>
                            {provider.metadata?.testConfigured === true ? <button className="rounded-lg border border-[#dfe7e4] px-4 py-2.5 text-sm font-semibold text-[#0e6f62]" disabled={busy} type="button" onClick={() => void connectRazorpayOAuth("test")}>Use test mode</button> : null}
                          </>
                        )
                      ) : provider.id === "zoho" || provider.id === "salesforce" ? (
                        displayConnected ? (
                          <>
                            <button className="rounded-lg bg-[#118778] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0e6f62]" disabled={busy} type="button" onClick={() => void previewCrm(provider.id as "zoho" | "salesforce")}>View contacts</button>
                            <button className="rounded-lg border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700" disabled={busy} type="button" onClick={() => void disconnect(provider.id as "zoho" | "salesforce")}>Disconnect</button>
                          </>
                        ) : (
                          <>
                            <button className="rounded-lg bg-[#118778] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0e6f62] disabled:cursor-not-allowed disabled:bg-slate-300" disabled={busy || setupNeeded} type="button" onClick={() => void connectCrm(provider.id as "zoho" | "salesforce")}>Connect {item.name}</button>
                            {provider.id === "salesforce" ? <button className="rounded-lg border border-[#dfe7e4] px-4 py-2.5 text-sm font-semibold text-[#0e6f62]" disabled={busy} type="button" onClick={() => void connectCrm("salesforce", true)}>Use sandbox</button> : null}
                          </>
                        )
                      ) : provider.id === "whatsapp" ? (
                        <button
                          className="rounded-lg bg-[#118778] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0e6f62] transition"
                          type="button"
                          onClick={() => {
                            setSelected("whatsapp");
                            setModalError("");
                          }}
                        >
                          {provider.connected ? "Manage WhatsApp" : "Connect WhatsApp"}
                        </button>
                      ) : provider.id === "digitalbot" ? (
                        <button
                          className="rounded-lg bg-[#118778] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0e6f62]"
                          type="button"
                          onClick={() => {
                            setSelected("digitalbot");
                            setCredential("");
                            setDigitalBotConnectionName("");
                            setModalError("");
                            void loadAgentsForDigitalBot();
                          }}
                        >
                          Add DigitalBot connection
                        </button>
                      ) : provider.connected ? (
                        <>
                        {provider.id === "razorpay_api" ? (
                          <button
                            className="rounded-lg bg-[#118778] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0e6f62]"
                            disabled={busy}
                            type="button"
                            onClick={() => void previewRazorpayPayments()}
                          >
                            Check payments
                          </button>
                        ) : null}
                        {isTokenProviderId(provider.id) ? (
                          <button
                            className="rounded-lg bg-[#118778] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0e6f62]"
                            disabled={busy}
                            type="button"
                            onClick={() => void previewTokenProvider(provider.id as TokenProviderId)}
                          >
                            View resources
                          </button>
                        ) : null}
                        <button
                          className="rounded-lg border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700"
                          disabled={busy}
                          type="button"
                          onClick={() =>
                            void disconnect(
                              provider.id as Exclude<
                                IntegrationProvider["id"],
                                "vobiz"
                              >,
                            )
                          }
                        >
                          Disconnect
                        </button>
                        </>
                      ) : (
                        <button
                          className="rounded-lg bg-[#118778] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0e6f62]"
                          type="button"
                          onClick={() => {
                            setSelected(
                              provider.id as Exclude<
                                IntegrationProvider["id"],
                                "vobiz"
                              >,
                            );
                            setCredential("");
                            setRazorpayKeyId("");
                            setFreshsalesSite("");
                            setHighlevelLocationId("");
                            setModalError("");
                          }}
                        >
                          Connect {item.name}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
            <RequestedIntegrationsSection />
          </section>
        </div>
      </section>

      {selected &&
      (modalError || (selected === "digitalbot" && agentsLoading)) ? (
        <div
          className={`fixed left-1/2 top-4 z-[60] w-[min(92vw,32rem)] -translate-x-1/2 rounded-xl border px-4 py-3 text-sm font-medium shadow-xl ${agentsLoading ? "border-[#9fcfc3] bg-[#edf7f4] text-[#123d35]" : "border-rose-300 bg-rose-50 text-rose-800"}`}
          role={agentsLoading ? "status" : "alert"}
        >
          {agentsLoading ? "Loading your Vozon agents..." : modalError}
        </div>
      ) : null}
      {selected === "whatsapp" ? (
        <WhatsAppModal
          integration={providers.find((p) => p.id === "whatsapp")}
          onClose={() => {
            setSelected(null);
            void load();
          }}
          onSuccess={(msg) => {
            setNotice(msg);
            void load();
          }}
          onError={(err) => setNotice(err)}
        />
      ) : selected ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4 backdrop-blur-[6px]"
          onMouseDown={() => !busy && setSelected(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-[#dfe7e4] bg-white p-6 shadow-[0_28px_80px_rgba(34,38,74,0.24)]"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0e6f62]">
                  {catalog[selected].category}
                </span>
                <h2 className="mt-2 text-xl font-semibold">
                  Connect {catalog[selected].name}
                </h2>
              </div>
              <button
                className="rounded-lg px-2 py-1 text-slate-500"
                type="button"
                disabled={busy}
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {selected === "slack"
                ? "Create an incoming webhook in Slack and paste its URL. A verification message will be sent immediately."
                : selected === "hubspot"
                  ? "Create a HubSpot private app with CRM contacts and notes permissions, then paste its access token."
                  : selected === "razorpay_api"
                    ? "Enter your own merchant Key ID and Key Secret. Vozon verifies them with a read-only payment request and stores them encrypted for this workspace."
                  : selected === "freshsales"
                    ? "Enter your Freshsales bundle site and API key. Vozon verifies your contact views before saving the connection."
                  : selected === "highlevel"
                    ? "Enter a HighLevel Location ID and a Private Integration Token with locations.readonly and contacts.readonly scopes. Vozon verifies the location before saving the encrypted token."
                  : isTokenProviderId(selected)
                    ? "Paste a personal API token or internal integration token. Vozon verifies the account and stores the token encrypted for this workspace."
                  : selected === "digitalbot"
                    ? "Create a connection key in the DigitalBot workspace, select the Vozon agent, then paste the key here."
                    : "Create a Calendly personal access token and paste it here."}
            </p>
            {selected === "digitalbot" ? (
              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                <strong className="block text-slate-900">
                  One connection, one Vozon agent
                </strong>
                <span>
                  Connecting only links the workspace and Agent ID. It does not
                  add tools. After connecting, use the Connector tools switch on
                  the connection card whenever you want to activate the
                  DigitalBot appointment tools.
                </span>
                <label className="mt-4 grid gap-2 text-xs font-semibold text-slate-600">
                  Connection name
                  <input
                    className="rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal text-slate-950"
                    value={digitalBotConnectionName}
                    onChange={(event) =>
                      setDigitalBotConnectionName(event.target.value)
                    }
                    placeholder="Main clinic DigitalBot"
                  />
                </label>
                <label className="mt-4 grid gap-2 text-xs font-semibold text-slate-600">
                  Vozon agent
                  <select
                    className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal text-slate-950"
                    value={digitalBotAgentId}
                    onFocus={() => void loadAgentsForDigitalBot()}
                    onChange={(event) =>
                      setDigitalBotAgentId(event.target.value)
                    }
                  >
                    <option value="">Select Vozon agent</option>
                    {agents.map((agent) => (
                      <option key={agent._id} value={agent._id}>
                        {digitalBotAgentLabel(agent)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ) : null}
            {selected === "razorpay_api" ? (
              <label className="mt-4 grid gap-2 text-xs font-semibold text-slate-600">
                Razorpay Key ID
                <input
                  className="rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal text-slate-950"
                  autoComplete="off"
                  value={razorpayKeyId}
                  onChange={(event) => setRazorpayKeyId(event.target.value)}
                  placeholder="rzp_test_... or rzp_live_..."
                />
              </label>
            ) : null}
            {selected === "freshsales" ? (
              <label className="mt-4 grid gap-2 text-xs font-semibold text-slate-600">
                Freshsales site
                <input className="rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal text-slate-950" value={freshsalesSite} onChange={(event) => setFreshsalesSite(event.target.value)} placeholder="acme.myfreshworks.com" />
              </label>
            ) : null}
            {selected === "highlevel" ? (
              <label className="mt-4 grid gap-2 text-xs font-semibold text-slate-600">
                HighLevel Location ID
                <input
                  className="rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal text-slate-950"
                  value={highlevelLocationId}
                  onChange={(event) => setHighlevelLocationId(event.target.value)}
                  placeholder="ve9EPM428h8vShlRW1KT"
                />
              </label>
            ) : null}
            <label className="mt-5 grid gap-2 text-xs font-semibold text-slate-600">
              {selected === "slack"
                ? "Incoming webhook URL"
                : selected === "razorpay_api"
                  ? "Razorpay Key Secret"
                : selected === "freshsales"
                  ? "API key"
                : selected === "highlevel"
                  ? "Private Integration Token"
                : selected === "digitalbot"
                  ? "DigitalBot connection key"
                  : "Access token"}
              <input
                className="rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal text-slate-950"
                autoComplete="new-password"
                type="password"
                value={credential}
                onChange={(event) => setCredential(event.target.value)}
                placeholder={
                  selected === "slack"
                    ? "https://hooks.slack.com/services/..."
                    : selected === "digitalbot"
                      ? "db_conn_..."
                      : selected === "razorpay_api"
                        ? "Paste merchant key secret"
                      : selected === "highlevel"
                        ? "Paste HighLevel private integration token"
                      : "Paste provider token"
                }
              />
            </label>
            <button
              className="mt-5 w-full rounded-lg bg-[#118778] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0e6f62] disabled:opacity-50"
              type="button"
              disabled={
                busy ||
                !credential.trim() ||
                (selected === "razorpay_api" && !razorpayKeyId.trim()) ||
                (selected === "freshsales" && !freshsalesSite.trim()) ||
                (selected === "highlevel" && !highlevelLocationId.trim()) ||
                (selected === "digitalbot" && !digitalBotAgentId)
              }
              onClick={() => void connect()}
            >
              {busy
                ? "Verifying..."
                : selected === "digitalbot"
                  ? "Connect DigitalBot"
                  : "Connect and verify"}
            </button>
          </div>
        </div>
      ) : null}
      {manageGoogle ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/35 p-4 backdrop-blur-[6px]"
          onMouseDown={() => !busy && setManageGoogle(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0e6f62]">
                  Google Workspace
                </span>
                <h2 className="mt-2 text-xl font-semibold">
                  Available resources
                </h2>
              </div>
              <button type="button" onClick={() => setManageGoogle(false)}>
                Close
              </button>
            </div>
            <h3 className="mt-6 font-semibold">Calendars</h3>
            <div className="mt-2 grid gap-2">
              {calendars.map((calendar) => (
                <div
                  className="rounded-xl border border-slate-200 p-3"
                  key={calendar.id}
                >
                  <strong className="block text-sm">
                    {calendar.name}
                    {calendar.primary ? " (Primary)" : ""}
                  </strong>
                  <code className="mt-1 block break-all text-xs text-slate-500">
                    {calendar.id}
                  </code>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {calendar.timezone}
                    </span>
                    <button
                      className="rounded-lg border border-[#b8c8c3] px-3 py-1.5 text-xs font-semibold text-[#123d35]"
                      type="button"
                      onClick={() =>
                        void integrationsApi
                          .testCalendar(calendar.id, calendar.timezone)
                          .then(() =>
                            setNotice("Test appointment created successfully."),
                          )
                          .catch((error) =>
                            setNotice(
                              error instanceof Error
                                ? error.message
                                : "Calendar test failed.",
                            ),
                          )
                      }
                    >
                      Create test event
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <h3 className="mt-6 font-semibold">Spreadsheet</h3>
            <p className="mt-1 text-sm text-slate-600">
              Paste a spreadsheet URL or ID. The Google account must have edit
              access.
            </p>
            <div className="mt-3 flex gap-2">
              <input
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                value={spreadsheetInput}
                onChange={(event) => setSpreadsheetInput(event.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
              />
              <button
                className="rounded-lg bg-[#118778] px-4 text-sm font-semibold text-white transition hover:bg-[#0e6f62] disabled:opacity-50"
                disabled={busy || !spreadsheetInput.trim()}
                type="button"
                onClick={() => void inspectSpreadsheet()}
              >
                Verify
              </button>
            </div>
            {spreadsheet ? (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <strong className="block">{spreadsheet.name}</strong>
                <code className="mt-1 block break-all text-xs">
                  {spreadsheet.id}
                </code>
                <div className="mt-2 flex flex-wrap gap-2">
                  {spreadsheet.sheets.map((sheet) => (
                    <button
                      className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold"
                      key={sheet}
                      type="button"
                      onClick={() =>
                        void integrationsApi
                          .testSheet(spreadsheet.id, sheet)
                          .then(() => setNotice(`Test row added to ${sheet}.`))
                          .catch((error) =>
                            setNotice(
                              error instanceof Error
                                ? error.message
                                : "Sheet test failed.",
                            ),
                          )
                      }
                    >
                      {sheet} · test row
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <p className="mt-5 text-xs leading-5 text-slate-500">
              Next: open an agent → Tools → Native Google tools, enter the
              selected resource IDs, enable them, and save the agent.
            </p>
          </div>
        </div>
      ) : null}
    </main>
  );
}
