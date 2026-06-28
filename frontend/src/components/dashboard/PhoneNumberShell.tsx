"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  getServerSession,
  getSession,
  logoutSession,
  subscribeToSession,
  validateStoredSession,
} from "@/lib/auth";
import {
  voiceApi,
  type BackendAgent,
  type BackendPhoneNumber,
  type PhoneNumberImportInput,
  type TelephonyProvider,
  type VobizNumber,
} from "@/lib/voice";

type IconName =
  | "check"
  | "close"
  | "edit"
  | "import"
  | "link"
  | "phone"
  | "plus"
  | "refresh"
  | "search"
  | "trash"
  | "unlink"
  | "user";

const providers: { id: TelephonyProvider; description: string; docs: string }[] = [
  { id: "Twilio", description: "Verify an owned number with an Account SID and production API key.", docs: "https://www.twilio.com/docs/phone-numbers/api/incomingphonenumber-resource" },
  { id: "Exotel", description: "Verify an ExoPhone with its account credentials and regional data center.", docs: "https://developer.exotel.com/docs/exophones/api-reference/list-numbers" },
  { id: "Vobiz", description: "Verify an owned number using your Vobiz Auth ID and Auth Token.", docs: "https://docs.vobiz.ai/account-phone-number/list-account-phone-numbers" },
];

const buttonClass =
  "app-button-text inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 transition disabled:cursor-not-allowed disabled:opacity-50";
const controlClass =
  "app-control-text min-h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#00b8c4] focus:ring-4 focus:ring-[#00b8c4]/10";

function Icon({ icon, className = "size-4" }: { icon: IconName; className?: string }) {
  const props = {
    className: `${className} fill-none stroke-current stroke-2`,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };
  if (icon === "check") return <svg {...props}><path d="m5 12 4 4L19 6" /></svg>;
  if (icon === "close") return <svg {...props}><path d="m6 6 12 12M18 6 6 18" /></svg>;
  if (icon === "edit") return <svg {...props}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></svg>;
  if (icon === "import") return <svg {...props}><path d="M12 3v12m0 0 4-4m-4 4-4-4" /><path d="M4 17v3h16v-3" /></svg>;
  if (icon === "link") return <svg {...props}><path d="m10 13 4-4" /><path d="M7.5 15.5 5 18a3.5 3.5 0 0 1-5-5l3-3a3.5 3.5 0 0 1 5 0" /><path d="m16.5 8.5 2.5-2.5a3.5 3.5 0 0 1 5 5l-3 3a3.5 3.5 0 0 1-5 0" /></svg>;
  if (icon === "phone") return <svg {...props}><path d="M6.6 4.8 9 7.2a2 2 0 0 1 .4 2.2l-.8 1.7a12 12 0 0 0 5.3 5.3l1.7-.8a2 2 0 0 1 2.2.4l2.4 2.4a1.8 1.8 0 0 1-.2 2.7c-1 .7-2.2 1-3.6.8C9.4 20.7 3.3 14.6 2.1 7.6 1.9 6.2 2.2 5 2.9 4a1.8 1.8 0 0 1 2.7-.2Z" /></svg>;
  if (icon === "plus") return <svg {...props}><path d="M12 5v14M5 12h14" /></svg>;
  if (icon === "refresh") return <svg {...props}><path d="M20 11a8 8 0 0 0-14.5-4.5L4 8" /><path d="M4 4v4h4" /><path d="M4 13a8 8 0 0 0 14.5 4.5L20 16" /><path d="M20 20v-4h-4" /></svg>;
  if (icon === "search") return <svg {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
  if (icon === "trash") return <svg {...props}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" /></svg>;
  if (icon === "unlink") return <svg {...props}><path d="m9 15-2 2a3.5 3.5 0 0 1-5-5l3-3" /><path d="m15 9 2-2a3.5 3.5 0 0 1 5 5l-3 3" /><path d="m3 3 18 18" /></svg>;
  return <svg {...props}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>;
}

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(value: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function providerTone(provider: string) {
  if (provider === "Twilio") return "border-[#fee2e2] bg-[#fff1f2] text-[#be123c]";
  if (provider === "Exotel") return "border-[#99f6e8] bg-[#ecfeff] text-[#008996]";
  return "border-[#d1fae5] bg-[#ecfdf5] text-[#047857]";
}

function formatMoney(value: number | undefined, currency = "INR") {
  if (typeof value !== "number") return "Not listed";
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export function PhoneNumberShell() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [numbers, setNumbers] = useState<BackendPhoneNumber[]>([]);
  const [agents, setAgents] = useState<BackendAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [showBuy, setShowBuy] = useState(false);
  const [assignmentNumber, setAssignmentNumber] = useState<BackendPhoneNumber | null>(null);
  const [showUserSidebar, setShowUserSidebar] = useState(false);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/dashboard/phone-number");
      return;
    }
    void validateStoredSession();
    void Promise.all([voiceApi.phoneNumbers(), voiceApi.agents()])
      .then(([numberResponse, agentResponse]) => {
        setNumbers(numberResponse.numbers);
        setAgents(agentResponse.agents);
      })
      .catch((caught: unknown) => setError(errorMessage(caught)))
      .finally(() => setLoading(false));
  }, [router, session]);

  function showMessage(message: string, isError = false) {
    setNotice(isError ? "" : message);
    setError(isError ? message : "");
  }

  async function importNumber(input: PhoneNumberImportInput) {
    setBusy(true);
    showMessage("");
    try {
      const result = await voiceApi.createPhoneNumber({ ...input, direction: "Both" });
      setNumbers((current) => [result.number, ...current]);
      setShowImport(false);
      setAssignmentNumber(result.number);
      showMessage(`${result.number.number} imported. You can now link an agent.`);
    } catch (caught) {
      showMessage(errorMessage(caught), true);
    } finally {
      setBusy(false);
    }
  }

  async function assignAgent(agentId: string | null) {
    if (!assignmentNumber) return;
    setBusy(true);
    showMessage("");
    try {
      const result = await voiceApi.assignPhoneNumberAgent(assignmentNumber._id, agentId);
      setNumbers((current) => current.map((item) => item._id === result.number._id ? result.number : item));
      setAssignmentNumber(null);
      if (result.routingWarning) {
        showMessage(`Agent linked, but phone routing still needs setup: ${result.routingWarning}`, true);
      } else {
        showMessage(agentId ? "Agent linked successfully." : "Agent unlinked successfully.");
      }
    } catch (caught) {
      showMessage(errorMessage(caught), true);
    } finally {
      setBusy(false);
    }
  }

  async function purchaseNumber(number: VobizNumber, label: string) {
    setBusy(true);
    showMessage("");
    try {
      const result = await voiceApi.purchasePhoneNumber({
        phoneNumber: number.e164,
        label: label.trim(),
        direction: "Both",
        currency: number.currency,
      });
      setNumbers((current) => [result.number, ...current]);
      setShowBuy(false);
      setAssignmentNumber(result.number);
      showMessage(`${result.number.number} purchased. You can now link any agent.`);
    } catch (caught) {
      showMessage(errorMessage(caught), true);
    } finally {
      setBusy(false);
    }
  }

  async function repairRoutes() {
    setBusy(true);
    showMessage("");
    try {
      const result = await voiceApi.syncPhoneNumbers();
      const [numberResponse, agentResponse] = await Promise.all([voiceApi.phoneNumbers(), voiceApi.agents()]);
      setNumbers(numberResponse.numbers);
      setAgents(agentResponse.agents);
      const suffix = result.routes.errors.length
        ? ` First issue: ${result.routes.errors[0].number} - ${result.routes.errors[0].message}`
        : "";
      showMessage(
        `Route sync complete: checked ${result.routes.total}, repaired ${result.routes.repaired}, needs setup ${result.routes.needsSetup}.${suffix}`,
        result.routes.needsSetup > 0,
      );
    } catch (caught) {
      showMessage(errorMessage(caught), true);
    } finally {
      setBusy(false);
    }
  }

  async function deleteNumber(number: BackendPhoneNumber) {
    const confirmed = window.confirm(
      `Delete ${number.number}?\n\nThis will unlink the agent, remove LiveKit routing, remove Vobiz trunk assignment when applicable, and delete it from this workspace inventory.`,
    );
    if (!confirmed) return;

    setBusy(true);
    showMessage("");
    try {
      const result = await voiceApi.deletePhoneNumber(number._id);
      setNumbers((current) => current.filter((item) => item._id !== number._id));
      setAgents((current) => current.map((agent) => agent.phone === number.number ? { ...agent, phone: "" } : agent));
      if (assignmentNumber?._id === number._id) setAssignmentNumber(null);
      showMessage(
        result.routingWarning
          ? `${number.number} deleted. Cleanup warning: ${result.routingWarning}`
          : `${number.number} deleted everywhere in this workspace.`,
      );
    } catch (caught) {
      showMessage(errorMessage(caught), true);
    } finally {
      setBusy(false);
    }
  }

  if (!session) {
    return <main className="app-strong grid min-h-screen place-items-center bg-[#f7f8fb]">Loading phone numbers</main>;
  }

  return (
    <main className={`grid min-h-screen bg-[#f7f8fb] text-[#111827] lg:h-screen lg:overflow-hidden ${
      showUserSidebar ? "lg:grid-cols-[272px_minmax(0,1fr)]" : "lg:grid-cols-[64px_minmax(0,1fr)]"
    }`}>
      <DashboardSidebar
        activeLabel="Phone Number"
        userInitials={initials(session.name)}
        userName={session.name}
        userEmail={session.email}
        onLogout={() => void logoutSession().then(() => router.replace("/login"))}
        showUserSidebar={showUserSidebar}
        setShowUserSidebar={setShowUserSidebar}
      />
      <section className="min-w-0 overflow-y-auto">
        <header className="border-b border-[#99f6e8] bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-1500px flex-wrap items-center justify-between gap-4">
            <div>
              <span className="app-label text-[#00b8c4]">Telephony</span>
              <h1 className="m-0 mt-1 text-xl font-semibold leading-7 text-[#0f172a] sm:text-2xl">Phone numbers</h1>
              <p className="app-caption mt-1 mb-0 text-[#475569]">Import or buy telephony numbers, then link them to any voice agent.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                className={`${buttonClass} border border-[#d5d8df] bg-white text-[#334155] hover:bg-[#f8fafc]`}
                disabled={busy || loading}
                onClick={() => void repairRoutes()}
                type="button"
              >
                <Icon icon="refresh" />
                Repair routes
              </button>
              <button
                className={`${buttonClass} border border-[#99f6e8] bg-[#ecfeff] text-[#008996] hover:bg-[#ccfbf1]`}
                onClick={() => { setShowImport(true); showMessage(""); }}
                type="button"
              >
                <Icon icon="import" />
                Import number
              </button>
              <button
                className={`${buttonClass} border-0 bg-[#00b8c4] text-white shadow-[0_12px_28px_rgba(0,184,196,0.28)] hover:bg-[#008996]`}
                onClick={() => { setShowBuy(true); showMessage(""); }}
                type="button"
              >
                <Icon icon="plus" />
                Buy number
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-1500px gap-4 p-4 sm:p-6 lg:p-8">
          {notice ? <Notice tone="success" message={notice} onClose={() => setNotice("")} /> : null}
          {error ? <Notice tone="error" message={error} onClose={() => setError("")} /> : null}

          <section className="overflow-hidden rounded-xl border border-[#dfe3ea] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
            <div className="flex items-center justify-between gap-4 border-b border-[#e5e7eb] px-4 py-4 sm:px-5">
              <div>
                <h2 className="app-section-title m-0">Your numbers</h2>
                <span className="app-caption">{numbers.length} {numbers.length === 1 ? "number" : "numbers"} in inventory</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#10b981]" />
                <span className="app-label text-[#475569]">Telephony</span>
              </div>
            </div>

            {loading ? (
              <div className="grid min-h-360px place-items-center">
                <span className="app-caption">Loading phone numbers...</span>
              </div>
            ) : numbers.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-860px border-collapse text-left">
                  <thead className="bg-[#f8fafc]">
                    <tr className="app-label text-[#64748b]">
                      <th className="px-5 py-3 font-medium">Phone number</th>
                      <th className="px-4 py-3 font-medium">Provider</th>
                      <th className="px-4 py-3 font-medium">Agent</th>
                      <th className="px-4 py-3 font-medium">Region</th>
                      <th className="px-4 py-3 font-medium">Created</th>
                      <th className="w-14 px-4 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {numbers.map((number) => (
                      <PhoneNumberRow
                        key={number._id}
                        busy={busy}
                        number={number}
                        onDelete={() => void deleteNumber(number)}
                        onManage={() => { setAssignmentNumber(number); showMessage(""); }}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid min-h-360px place-items-center p-6 text-center">
                <div className="max-w-sm">
                  <span className="mx-auto mb-4 grid size-12 place-items-center rounded-xl bg-[#ecfeff] text-[#00b8c4]">
                    <Icon icon="phone" className="size-5" />
                  </span>
                  <h3 className="app-section-title m-0">No phone numbers yet</h3>
                  <p className="app-caption mt-1 mb-4">Import from Twilio, Exotel, or Vobiz-or buy a new Vobiz number.</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button className={`${buttonClass} border border-[#99f6e8] bg-white text-[#00b8c4]`} onClick={() => setShowImport(true)} type="button">
                      <Icon icon="import" /> Import number
                    </button>
                    <button className={`${buttonClass} bg-[#00b8c4] text-white`} onClick={() => setShowBuy(true)} type="button">
                      <Icon icon="plus" /> Buy number
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          <p className="app-caption m-0 px-1">
            Numbers stay in your inventory independently of agents. Link, switch, or unlink an agent whenever you need.
          </p>
        </div>
      </section>

      {showImport ? (
        <ImportNumberModal
          busy={busy}
          onClose={() => setShowImport(false)}
          onImport={(input) => void importNumber(input)}
        />
      ) : null}

      {showBuy ? (
        <BuyNumberModal
          busy={busy}
          requestError={error}
          onClose={() => setShowBuy(false)}
          onPurchase={(number, label) => void purchaseNumber(number, label)}
        />
      ) : null}

      {assignmentNumber ? (
        <AgentModal
          agents={agents}
          busy={busy}
          number={assignmentNumber}
          onAssign={(agentId) => void assignAgent(agentId)}
          onClose={() => setAssignmentNumber(null)}
        />
      ) : null}
    </main>
  );
}

function PhoneNumberRow({
  busy,
  number,
  onDelete,
  onManage,
}: {
  busy: boolean;
  number: BackendPhoneNumber;
  onDelete: () => void;
  onManage: () => void;
}) {
  const agent = number.agentId;
  return (
    <tr className="border-t border-[#edf0f4] transition hover:bg-[#fbfcfe]">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#ecfeff] text-[#00b8c4]">
            <Icon icon="phone" />
          </span>
          <span className="min-w-0">
            <strong className="app-strong block whitespace-nowrap">{number.number}</strong>
            <span className="app-caption block max-w-240px truncate">{number.label}</span>
          </span>
        </div>
      </td>
      <td className="px-4 py-4">
        <span className={`app-label inline-flex rounded-full border px-2.5 py-1 ${providerTone(number.provider)}`}>
          {number.provider}
        </span>
      </td>
      <td className="px-4 py-4">
        <button
          className={`group inline-flex max-w-240px items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition ${agent ? "border-[#e5e7eb] bg-[#f8fafc] hover:border-[#99f6e8] hover:bg-[#ecfeff]" : "border-dashed border-[#cbd5e1] bg-white text-[#475569] hover:border-[#00b8c4] hover:text-[#00b8c4]"}`}
          onClick={onManage}
          type="button"
        >
          <span className={`grid size-7 shrink-0 place-items-center rounded-md ${agent ? "bg-white text-[#64748b]" : "bg-[#ecfeff] text-[#00b8c4]"}`}>
            <Icon icon={agent ? "user" : "link"} className="size-3.5" />
          </span>
          <span className="app-strong truncate">{agent?.name ?? "Link agent"}</span>
          {agent ? <Icon icon="edit" className="size-3.5 text-[#94a3b8] group-hover:text-[#00b8c4]" /> : null}
        </button>
      </td>
      <td className="app-body whitespace-nowrap px-4 py-4 text-[#475569]">{number.region || "Global"}</td>
      <td className="px-4 py-4">
        <span className="app-body block whitespace-nowrap text-[#334155]">{formatDate(number.createdAt)}</span>
        <span className={`app-caption ${number.status === "Ready" ? "text-[#059669]" : "text-[#d97706]"}`}>{number.status}</span>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center justify-end gap-1">
          <button className="grid size-9 place-items-center rounded-lg text-[#64748b] transition hover:bg-[#ecfeff] hover:text-[#00b8c4]" disabled={busy} onClick={onManage} type="button" aria-label={`Manage ${number.number}`}>
            <Icon icon="edit" />
          </button>
          <button className="grid size-9 place-items-center rounded-lg text-[#dc2626] transition hover:bg-[#fff1f2]" disabled={busy} onClick={onDelete} type="button" aria-label={`Delete ${number.number}`}>
            <Icon icon="trash" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ImportNumberModal({ busy, onClose, onImport }: {
  busy: boolean;
  onClose: () => void;
  onImport: (input: PhoneNumberImportInput) => void;
}) {
  const [provider, setProvider] = useState<TelephonyProvider>("Twilio");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [label, setLabel] = useState("");
  const [accountSid, setAccountSid] = useState("");
  const [apiKeySid, setApiKeySid] = useState("");
  const [apiKeySecret, setApiKeySecret] = useState("");
  const [apiRegion, setApiRegion] = useState<"us1" | "au1" | "ie1">("us1");
  const [exotelApiKey, setExotelApiKey] = useState("");
  const [exotelApiToken, setExotelApiToken] = useState("");
  const [dataCenter, setDataCenter] = useState<"mumbai" | "singapore">("mumbai");
  const [authId, setAuthId] = useState("");
  const [authToken, setAuthToken] = useState("");
  const validPhone = /^\+[1-9]\d{7,14}$/.test(phoneNumber.trim());
  const valid = validPhone && (
    provider === "Twilio"
      ? /^AC[0-9a-fA-F]{32}$/.test(accountSid.trim()) && /^SK[0-9a-fA-F]{32}$/.test(apiKeySid.trim()) && Boolean(apiKeySecret)
      : provider === "Exotel"
        ? Boolean(accountSid.trim() && exotelApiKey.trim() && exotelApiToken)
        : /^(MA|SA)_[A-Za-z0-9]+$/.test(authId.trim()) && authToken.length >= 20
  );

  function submit() {
    const common = { phoneNumber: phoneNumber.trim(), label: label.trim(), direction: "Both" as const };
    if (provider === "Twilio") {
      onImport({
        ...common,
        provider,
        accountSid: accountSid.trim(),
        apiKeySid: apiKeySid.trim(),
        apiKeySecret,
        apiRegion,
      });
    } else if (provider === "Exotel") {
      onImport({
        ...common,
        provider,
        accountSid: accountSid.trim(),
        apiKey: exotelApiKey.trim(),
        apiToken: exotelApiToken,
        dataCenter,
      });
    } else {
      onImport({ ...common, provider, authId: authId.trim(), authToken });
    }
  }

  return (
    <ModalFrame title="Import phone number" subtitle="Add a number from your telephony provider." onClose={onClose}>
      <form
        className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          if (!valid) return;
          submit();
        }}
      >
        <div className="grid grid-cols-3 border-b border-[#e5e7eb] px-5 sm:px-6">
          {providers.map((item) => (
            <button
              className={`relative min-h-14 border-0 bg-transparent px-2 text-center transition ${provider === item.id ? "text-[#00b8c4]" : "text-[#64748b] hover:text-[#334155]"}`}
              key={item.id}
              onClick={() => setProvider(item.id)}
              type="button"
            >
              <span className="app-strong">{item.id}</span>
              {provider === item.id ? <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#00b8c4]" /> : null}
            </button>
          ))}
        </div>

        <div className="grid gap-5 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="rounded-lg border border-[#99f6e8] bg-[#ecfeff] px-3 py-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="app-body text-[#1e40af]">{providers.find((item) => item.id === provider)?.description}</span>
              <a className="app-label text-[#00b8c4] underline underline-offset-2" href={providers.find((item) => item.id === provider)?.docs} rel="noreferrer" target="_blank">Provider docs</a>
            </div>
          </div>

          <label className="app-label grid gap-2">
            Phone number
            <input
              className={controlClass}
              inputMode="tel"
              placeholder="+919876543210"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
            />
            <span className="app-caption font-normal">Use E.164 format with country code, for example +919876543210.</span>
          </label>

          {provider === "Twilio" ? (
            <div className="grid gap-4 rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="app-label grid gap-2">
                  Twilio API region
                  <select className={controlClass} value={apiRegion} onChange={(event) => setApiRegion(event.target.value as typeof apiRegion)}>
                    <option value="us1">US1 (default)</option>
                    <option value="au1">AU1 (Australia)</option>
                    <option value="ie1">IE1 (Ireland)</option>
                  </select>
                </label>
                <label className="app-label grid gap-2">
                  Account SID
                  <input className={controlClass} autoComplete="off" placeholder="AC..." value={accountSid} onChange={(event) => setAccountSid(event.target.value)} />
                </label>
              </div>
              <label className="app-label grid gap-2">
                API Key SID
                <input className={controlClass} autoComplete="off" placeholder="SK..." value={apiKeySid} onChange={(event) => setApiKeySid(event.target.value)} />
              </label>
              <label className="app-label grid gap-2">
                API Key Secret
                <input className={controlClass} autoComplete="new-password" placeholder="Twilio API Key Secret" type="password" value={apiKeySecret} onChange={(event) => setApiKeySecret(event.target.value)} />
              </label>
            </div>
          ) : null}

          {provider === "Exotel" ? (
            <div className="grid gap-4 rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="app-label grid gap-2">
                  Exotel data center
                  <select className={controlClass} value={dataCenter} onChange={(event) => setDataCenter(event.target.value as typeof dataCenter)}>
                    <option value="mumbai">Mumbai / India</option>
                    <option value="singapore">Singapore</option>
                  </select>
                </label>
                <label className="app-label grid gap-2">
                  Account SID
                  <input className={controlClass} autoComplete="off" placeholder="Exotel Account SID" value={accountSid} onChange={(event) => setAccountSid(event.target.value)} />
                </label>
              </div>
              <label className="app-label grid gap-2">
                API Key
                <input className={controlClass} autoComplete="off" placeholder="Exotel API Key" value={exotelApiKey} onChange={(event) => setExotelApiKey(event.target.value)} />
              </label>
              <label className="app-label grid gap-2">
                API Token
                <input className={controlClass} autoComplete="new-password" placeholder="Exotel API Token" type="password" value={exotelApiToken} onChange={(event) => setExotelApiToken(event.target.value)} />
              </label>
            </div>
          ) : null}

          {provider === "Vobiz" ? (
            <div className="grid gap-4 rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4">
              <label className="app-label grid gap-2">
                Auth ID
                <input className={controlClass} autoComplete="off" placeholder="MA_... or SA_..." value={authId} onChange={(event) => setAuthId(event.target.value)} />
              </label>
              <label className="app-label grid gap-2">
                Auth Token
                <input className={controlClass} autoComplete="new-password" placeholder="Vobiz Auth Token" type="password" value={authToken} onChange={(event) => setAuthToken(event.target.value)} />
              </label>
            </div>
          ) : null}

          <label className="app-label grid gap-2">
            Label <span className="font-normal text-[#94a3b8]">(optional)</span>
            <input className={controlClass} maxLength={120} placeholder="Support main line" value={label} onChange={(event) => setLabel(event.target.value)} />
          </label>

          <div className="flex items-start gap-3 rounded-lg border border-[#e5e7eb] bg-[#f8fafc] p-3">
            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#dcfce7] text-[#059669]"><Icon icon="check" className="size-3.5" /></span>
            <p className="app-caption m-0">
              {provider === "Vobiz"
                ? "Vobiz credentials are encrypted and retained because they are required to configure inbound SIP routing."
                : `${provider} credentials are used server-side to verify that the number belongs to your account and are not stored.`}
            </p>
          </div>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-[#e5e7eb] px-5 py-4 sm:px-6">
          <button className={`${buttonClass} border border-[#d5d8df] bg-white text-[#334155] hover:bg-[#f8fafc]`} disabled={busy} onClick={onClose} type="button">Cancel</button>
          <button className={`${buttonClass} bg-[#00b8c4] text-white hover:bg-[#008996]`} disabled={busy || !valid} type="submit">
            <Icon icon="import" /> {busy ? "Importing..." : "Import number"}
          </button>
        </footer>
      </form>
    </ModalFrame>
  );
}

function BuyNumberModal({ busy, requestError, onClose, onPurchase }: {
  busy: boolean;
  requestError: string;
  onClose: () => void;
  onPurchase: (number: VobizNumber, label: string) => void;
}) {
  const [country, setCountry] = useState("IN");
  const [query, setQuery] = useState("");
  const [label, setLabel] = useState("");
  const [numbers, setNumbers] = useState<VobizNumber[]>([]);
  const [searching, setSearching] = useState(true);
  const [searched, setSearched] = useState(false);
  const [inventoryError, setInventoryError] = useState("");
  const [selected, setSelected] = useState<VobizNumber | null>(null);

  useEffect(() => {
    let active = true;
    void voiceApi.vobizInventory({ country: "IN" })
      .then((result) => {
        if (!active) return;
        setNumbers(result.items);
        setSearched(true);
      })
      .catch((caught: unknown) => {
        if (!active) return;
        setInventoryError(errorMessage(caught));
        setSearched(true);
      })
      .finally(() => {
        if (active) setSearching(false);
      });
    return () => { active = false; };
  }, []);

  async function searchInventory() {
    setSearching(true);
    setInventoryError("");
    setSelected(null);
    try {
      const result = await voiceApi.vobizInventory({ country, search: query.trim() });
      setNumbers(result.items);
      setSearched(true);
    } catch (caught) {
      setNumbers([]);
      setSearched(true);
      setInventoryError(errorMessage(caught));
    } finally {
      setSearching(false);
    }
  }

  return (
    <ModalFrame title="Buy phone number" subtitle="Purchase from your connected Vobiz account and add it to inventory." onClose={onClose} width="max-w-3xl">
      <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto]">
        <form
          className="grid gap-3 border-b border-[#e5e7eb] px-5 py-4 sm:grid-cols-[150px_minmax(0,1fr)_auto] sm:px-6"
          onSubmit={(event) => { event.preventDefault(); void searchInventory(); }}
        >
          <label className="app-label grid gap-2">
            Country
            <select className={controlClass} value={country} onChange={(event) => setCountry(event.target.value)}>
              <option value="IN">India</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
            </select>
          </label>
          <label className="app-label grid gap-2">
            Area code or digits <span className="font-normal text-[#94a3b8]">(optional)</span>
            <input className={controlClass} inputMode="tel" placeholder="For example 80 or 650" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <button className={`${buttonClass} self-end border border-[#99f6e8] bg-white text-[#00b8c4] hover:bg-[#ecfeff]`} disabled={searching || busy} type="submit">
            <Icon icon="search" /> {searching ? "Searching..." : "Search"}
          </button>
        </form>

        <div className="min-h-280px max-h-[min(460px,52vh)] overflow-y-auto px-5 py-4 sm:px-6">
          {inventoryError ? (
            <div className="rounded-lg border border-[#fecaca] bg-[#fff1f2] p-3 text-[#b91c1c]">
              <p className="app-body m-0">{inventoryError}</p>
              <p className="app-caption mt-1 mb-0 text-[#b91c1c]">Connect Vobiz by importing an owned Vobiz number first, then search again.</p>
            </div>
          ) : null}
          {requestError ? <div className="mb-3 rounded-lg border border-[#fecaca] bg-[#fff1f2] p-3 app-body text-[#b91c1c]">{requestError}</div> : null}
          {searching ? (
            <div className="grid min-h-240px place-items-center"><span className="app-caption">Loading available numbers...</span></div>
          ) : numbers.length ? (
            <div className="grid gap-2">
              {numbers.map((number) => {
                const active = selected?.id === number.id;
                const voiceAvailable = number.voice_enabled !== false && number.capabilities?.voice !== false;
                return (
                  <button
                    className={`grid w-full gap-3 rounded-xl border p-3 text-left transition sm:grid-cols-[minmax(0,1fr)_145px_145px_auto] sm:items-center ${active ? "border-[#00b8c4] bg-[#ecfeff] ring-2 ring-[#00b8c4]/10" : "border-[#e5e7eb] bg-white hover:border-[#99f6e8] hover:bg-[#fbfcff]"}`}
                    disabled={!voiceAvailable || busy}
                    key={number.id || number.e164}
                    onClick={() => setSelected(number)}
                    type="button"
                  >
                    <span>
                      <strong className="app-strong block">{number.e164}</strong>
                      <span className="app-caption">{[number.region, number.country].filter(Boolean).join(", ") || "Global"}</span>
                    </span>
                    <span><span className="app-caption block">Setup</span><strong className="app-body text-[#334155]">{formatMoney(number.setup_fee, number.currency)}</strong></span>
                    <span><span className="app-caption block">Monthly</span><strong className="app-body text-[#334155]">{formatMoney(number.monthly_fee, number.currency)}</strong></span>
                    <span className={`app-label justify-self-start rounded-full px-2.5 py-1 sm:justify-self-end ${voiceAvailable ? "bg-[#ecfdf5] text-[#047857]" : "bg-[#f1f5f9] text-[#64748b]"}`}>{voiceAvailable ? (active ? "Selected" : "Available") : "No voice"}</span>
                  </button>
                );
              })}
            </div>
          ) : searched && !inventoryError ? (
            <div className="grid min-h-240px place-items-center text-center">
              <div><Icon icon="search" className="mx-auto mb-3 size-6 text-[#94a3b8]" /><p className="app-body m-0 text-[#475569]">No available numbers matched this search.</p></div>
            </div>
          ) : null}
        </div>

        <footer className="flex flex-wrap items-end justify-between gap-3 border-t border-[#e5e7eb] px-5 py-4 sm:px-6">
          <label className="app-label grid min-w-240px flex-1 gap-2 sm:max-w-sm">
            Label <span className="font-normal text-[#94a3b8]">(optional)</span>
            <input className={controlClass} maxLength={120} placeholder="Sales main line" value={label} onChange={(event) => setLabel(event.target.value)} />
          </label>
          <div className="flex gap-2">
            <button className={`${buttonClass} border border-[#d5d8df] bg-white text-[#334155] hover:bg-[#f8fafc]`} disabled={busy} onClick={onClose} type="button">Cancel</button>
            <button className={`${buttonClass} bg-[#00b8c4] text-white hover:bg-[#008996]`} disabled={busy || !selected} onClick={() => { if (selected) onPurchase(selected, label); }} type="button">
              <Icon icon="plus" /> {busy ? "Purchasing..." : "Purchase number"}
            </button>
          </div>
        </footer>
      </div>
    </ModalFrame>
  );
}

function AgentModal({ agents, busy, number, onAssign, onClose }: {
  agents: BackendAgent[];
  busy: boolean;
  number: BackendPhoneNumber;
  onAssign: (agentId: string | null) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(number.agentId?._id ?? "");
  const filteredAgents = useMemo(() => {
    const search = query.trim().toLowerCase();
    return search ? agents.filter((agent) => `${agent.name} ${agent.team}`.toLowerCase().includes(search)) : agents;
  }, [agents, query]);

  return (
    <ModalFrame title="Link an agent" subtitle={`${number.number} / ${number.provider}`} onClose={onClose} width="max-w-xl">
      <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto]">
        <div className="border-b border-[#e5e7eb] px-5 py-4 sm:px-6">
          <label className="relative block">
            <span className="absolute inset-y-0 left-3 grid place-items-center text-[#94a3b8]"><Icon icon="search" /></span>
            <input className={`${controlClass} pl-10`} placeholder="Search agents" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
        </div>

        <div className="min-h-220px max-h-[min(430px,52vh)] overflow-y-auto p-2 sm:p-3">
          {filteredAgents.map((agent) => {
            const selected = selectedId === agent._id;
            return (
              <button
                className={`mb-1 flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${selected ? "border-[#99f6e8] bg-[#ecfeff]" : "border-transparent hover:bg-[#f8fafc]"}`}
                key={agent._id}
                onClick={() => setSelectedId(agent._id)}
                type="button"
              >
                <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${selected ? "bg-[#00b8c4] text-white" : "bg-[#ecfeff] text-[#00b8c4]"}`}><Icon icon="user" /></span>
                <span className="min-w-0 flex-1">
                  <strong className="app-strong block truncate">{agent.name}</strong>
                  <span className="app-caption block truncate">{agent.team || "Voice agent"}</span>
                </span>
                <span className={`app-label rounded-full px-2 py-1 ${agent.status === "Live" ? "bg-[#ecfdf5] text-[#047857]" : "bg-[#f1f5f9] text-[#64748b]"}`}>{agent.status}</span>
                <span className={`grid size-5 place-items-center rounded-full border ${selected ? "border-[#00b8c4] bg-[#00b8c4] text-white" : "border-[#cbd5e1]"}`}>{selected ? <Icon icon="check" className="size-3" /> : null}</span>
              </button>
            );
          })}
          {!filteredAgents.length ? <p className="app-caption m-0 p-8 text-center">No agents found.</p> : null}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e7eb] px-5 py-4 sm:px-6">
          <div>
            {number.agentId ? (
              <button className={`${buttonClass} border border-[#fecaca] bg-white text-[#dc2626] hover:bg-[#fff1f2]`} disabled={busy} onClick={() => onAssign(null)} type="button">
                <Icon icon="unlink" /> Unlink agent
              </button>
            ) : <span className="app-caption">Select one agent for this number.</span>}
          </div>
          <div className="flex gap-2">
            <button className={`${buttonClass} border border-[#d5d8df] bg-white text-[#334155] hover:bg-[#f8fafc]`} disabled={busy} onClick={onClose} type="button">Cancel</button>
            <button className={`${buttonClass} bg-[#00b8c4] text-white hover:bg-[#008996]`} disabled={busy || !selectedId} onClick={() => onAssign(selectedId)} type="button">
              <Icon icon="link" /> {busy ? "Saving..." : "Set agent"}
            </button>
          </div>
        </footer>
      </div>
    </ModalFrame>
  );
}

function ModalFrame({ children, onClose, subtitle, title, width = "max-w-2xl" }: {
  children: React.ReactNode;
  onClose: () => void;
  subtitle: string;
  title: string;
  width?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#0f172a]/45 p-3 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className={`grid max-h-[calc(100vh-24px)] w-full ${width} grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-2xl border border-white/70 bg-white shadow-2xl`}>
        <header className="flex items-start justify-between gap-4 border-b border-[#e5e7eb] px-5 py-4 sm:px-6 sm:py-5">
          <div>
            <h2 className="app-page-title m-0">{title}</h2>
            <p className="app-caption mt-1 mb-0">{subtitle}</p>
          </div>
          <button className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#e5e7eb] bg-white text-[#64748b] transition hover:bg-[#f8fafc] hover:text-[#111827]" onClick={onClose} type="button" aria-label="Close">
            <Icon icon="close" />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

function Notice({ message, onClose, tone }: { message: string; onClose: () => void; tone: "error" | "success" }) {
  const success = tone === "success";
  return (
    <div className={`flex items-start justify-between gap-3 rounded-lg border px-3 py-2.5 ${success ? "border-[#a7f3d0] bg-[#ecfdf5] text-[#047857]" : "border-[#fecaca] bg-[#fff1f2] text-[#b91c1c]"}`}>
      <span className="app-body">{message}</span>
      <button className="grid size-6 shrink-0 place-items-center rounded-md hover:bg-black/5" onClick={onClose} type="button" aria-label="Dismiss"><Icon icon="close" className="size-3.5" /></button>
    </div>
  );
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "The request could not be completed.";
}
