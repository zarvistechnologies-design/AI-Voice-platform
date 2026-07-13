"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
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
  publicVoiceMessage,
  voiceApi,
  type AgentSummary,
  type BackendPhoneNumber,
  type PhoneNumberImportInput,
  type VobizNumber,
} from "@/lib/voice";

const loadPhoneNumberModals = () => import("@/components/dashboard/PhoneNumberModals");
const PhoneNumberModals = dynamic(
  () => loadPhoneNumberModals().then((module) => module.PhoneNumberModals),
  { ssr: false },
);

function preloadPhoneNumberModals() {
  void loadPhoneNumberModals().catch(() => undefined);
}

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

const buttonClass =
  "app-button-text inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 transition disabled:cursor-not-allowed disabled:opacity-50";

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

function searchVobizInventory(input: { country: string; search?: string }) {
  return voiceApi.vobizInventory(input);
}

export function PhoneNumberShell() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [numbers, setNumbers] = useState<BackendPhoneNumber[]>([]);
  const [agents, setAgents] = useState<AgentSummary[]>([]);
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
    void Promise.all([voiceApi.phoneNumbers(), voiceApi.agentSummaries()])
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
        showMessage(publicVoiceMessage(result.routingWarning, "Agent linked, but phone routing still needs setup."), true);
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
      const [numberResponse, agentResponse] = await Promise.all([voiceApi.phoneNumbers(), voiceApi.agentSummaries()]);
      setNumbers(numberResponse.numbers);
      setAgents(agentResponse.agents);
      const suffix = result.routes.errors.length
        ? ` First issue: ${result.routes.errors[0].number} - ${publicVoiceMessage(result.routes.errors[0].message, "Phone routing needs setup.")}`
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
      `Delete ${number.number}?\n\nThis will unlink the agent, remove call routing and phone-provider assignments, and delete it from this workspace inventory.`,
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
          ? `${number.number} deleted. ${publicVoiceMessage(result.routingWarning, "Some phone routing cleanup still needs attention.")}`
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
                onFocus={preloadPhoneNumberModals}
                onPointerDown={preloadPhoneNumberModals}
                onPointerEnter={preloadPhoneNumberModals}
                type="button"
              >
                <Icon icon="import" />
                Import number
              </button>
              <button
                className={`${buttonClass} border-0 bg-[#00b8c4] text-white shadow-[0_12px_28px_rgba(0,184,196,0.28)] hover:bg-[#008996]`}
                onClick={() => { setShowBuy(true); showMessage(""); }}
                onFocus={preloadPhoneNumberModals}
                onPointerDown={preloadPhoneNumberModals}
                onPointerEnter={preloadPhoneNumberModals}
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
                    <button className={`${buttonClass} border border-[#99f6e8] bg-white text-[#00b8c4]`} onClick={() => setShowImport(true)} onFocus={preloadPhoneNumberModals} onPointerDown={preloadPhoneNumberModals} onPointerEnter={preloadPhoneNumberModals} type="button">
                      <Icon icon="import" /> Import number
                    </button>
                    <button className={`${buttonClass} bg-[#00b8c4] text-white`} onClick={() => setShowBuy(true)} onFocus={preloadPhoneNumberModals} onPointerDown={preloadPhoneNumberModals} onPointerEnter={preloadPhoneNumberModals} type="button">
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

      {showImport || showBuy || assignmentNumber ? (
        <PhoneNumberModals
          agents={agents}
          assignmentNumber={assignmentNumber}
          busy={busy}
          requestError={error}
          showBuy={showBuy}
          showImport={showImport}
          onAssign={(agentId) => void assignAgent(agentId)}
          onCloseAgent={() => setAssignmentNumber(null)}
          onCloseBuy={() => setShowBuy(false)}
          onCloseImport={() => setShowImport(false)}
          onImport={(input) => void importNumber(input)}
          onPurchase={(number, label) => void purchaseNumber(number, label)}
          onSearchInventory={searchVobizInventory}
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
          onFocus={preloadPhoneNumberModals}
          onPointerDown={preloadPhoneNumberModals}
          onPointerEnter={preloadPhoneNumberModals}
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
          <button className="grid size-9 place-items-center rounded-lg text-[#64748b] transition hover:bg-[#ecfeff] hover:text-[#00b8c4]" disabled={busy} onClick={onManage} onFocus={preloadPhoneNumberModals} onPointerDown={preloadPhoneNumberModals} onPointerEnter={preloadPhoneNumberModals} type="button" aria-label={`Manage ${number.number}`}>
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
  return publicVoiceMessage(error, "The request could not be completed.");
}
