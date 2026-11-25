"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

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
  publicVoiceMessage,
  voiceApi,
  type AgentSummary,
  type BackendPhoneNumber,
  type PhoneNumberImportInput,
  type VobizNumber,
} from "@/lib/voice";

const loadPhoneNumberModals = () =>
  import("@/components/dashboard/PhoneNumberModals");
const PhoneNumberModals = dynamic(
  () => loadPhoneNumberModals().then((module) => module.PhoneNumberModals),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 text-sm font-semibold text-white">
        Loading phone controls...
      </div>
    ),
  },
);

function preloadPhoneNumberModals() {
  void loadPhoneNumberModals().catch(() => undefined);
}

type IconName =
  | "check"
  | "close"
  | "copy"
  | "edit"
  | "import"
  | "link"
  | "more"
  | "phone"
  | "plus"
  | "refresh"
  | "search"
  | "trash"
  | "unlink"
  | "user";

const buttonClass =
  "app-button-text inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 transition disabled:cursor-not-allowed disabled:opacity-50";

function Icon({
  icon,
  className = "size-4",
}: {
  icon: IconName;
  className?: string;
}) {
  const props = {
    className: `${className} fill-none stroke-current stroke-2`,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };
  if (icon === "check")
    return (
      <svg {...props}>
        <path d="m5 12 4 4L19 6" />
      </svg>
    );
  if (icon === "close")
    return (
      <svg {...props}>
        <path d="m6 6 12 12M18 6 6 18" />
      </svg>
    );
  if (icon === "copy")
    return (
      <svg {...props}>
        <rect x="8" y="8" width="11" height="11" rx="2" />
        <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
      </svg>
    );
  if (icon === "edit")
    return (
      <svg {...props}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </svg>
    );
  if (icon === "import")
    return (
      <svg {...props}>
        <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
        <path d="M4 17v3h16v-3" />
      </svg>
    );
  if (icon === "link")
    return (
      <svg {...props}>
        <path d="m10 13 4-4" />
        <path d="M7.5 15.5 5 18a3.5 3.5 0 0 1-5-5l3-3a3.5 3.5 0 0 1 5 0" />
        <path d="m16.5 8.5 2.5-2.5a3.5 3.5 0 0 1 5 5l-3 3a3.5 3.5 0 0 1-5 0" />
      </svg>
    );
  if (icon === "more")
    return (
      <svg {...props}>
        <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  if (icon === "phone")
    return (
      <svg {...props}>
        <path d="M6.6 4.8 9 7.2a2 2 0 0 1 .4 2.2l-.8 1.7a12 12 0 0 0 5.3 5.3l1.7-.8a2 2 0 0 1 2.2.4l2.4 2.4a1.8 1.8 0 0 1-.2 2.7c-1 .7-2.2 1-3.6.8C9.4 20.7 3.3 14.6 2.1 7.6 1.9 6.2 2.2 5 2.9 4a1.8 1.8 0 0 1 2.7-.2Z" />
      </svg>
    );
  if (icon === "plus")
    return (
      <svg {...props}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  if (icon === "refresh")
    return (
      <svg {...props}>
        <path d="M20 11a8 8 0 0 0-14.5-4.5L4 8" />
        <path d="M4 4v4h4" />
        <path d="M4 13a8 8 0 0 0 14.5 4.5L20 16" />
        <path d="M20 20v-4h-4" />
      </svg>
    );
  if (icon === "search")
    return (
      <svg {...props}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>
    );
  if (icon === "trash")
    return (
      <svg {...props}>
        <path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" />
      </svg>
    );
  if (icon === "unlink")
    return (
      <svg {...props}>
        <path d="m9 15-2 2a3.5 3.5 0 0 1-5-5l3-3" />
        <path d="m15 9 2-2a3.5 3.5 0 0 1 5 5l-3 3" />
        <path d="m3 3 18 18" />
      </svg>
    );
  return (
    <svg {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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
  if (provider === "Twilio")
    return "border-[#eaeaea] bg-[#fafafa] text-[#171717]";
  if (provider === "Plivo")
    return "border-[#eaeaea] bg-[#fafafa] text-[#171717]";
  if (provider === "Exotel")
    return "border-[#eaeaea] bg-[#fafafa] text-[#171717]";
  if (provider === "SIP")
    return "border-[#eaeaea] bg-[#fafafa] text-[#171717]";
  return "border-[#eaeaea] bg-[#fafafa] text-[#171717]";
}

function searchVobizInventory(input: { country: string; search?: string }) {
  return voiceApi.vobizInventory(input);
}

export function PhoneNumberShell() {
  const router = useRouter();
  const session = useSyncExternalStore(
    subscribeToSession,
    getSession,
    getServerSession,
  );
  const [numbers, setNumbers] = useState<BackendPhoneNumber[]>([]);
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [showBuy, setShowBuy] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState("");
  const [readinessFilter, setReadinessFilter] = useState("");
  const [assignmentNumber, setAssignmentNumber] =
    useState<BackendPhoneNumber | null>(null);
  const [showUserSidebar, setShowUserSidebar] = useState(
    getDashboardSidebarInitialState,
  );
  const busyRef = useRef(false);
  const providerOptions = useMemo(
    () => Array.from(new Set(numbers.map((number) => number.provider))).sort(),
    [numbers],
  );
  const filteredNumbers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return numbers.filter((number) => {
      const matchesSearch =
        !query ||
        [
          number.number,
          number.label,
          number.provider,
          number.region,
          number.agentId?.name,
        ].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(query),
        );
      const matchesProvider =
        !providerFilter || number.provider === providerFilter;
      const matchesAssignment =
        !assignmentFilter ||
        (assignmentFilter === "assigned"
          ? Boolean(number.agentId)
          : !number.agentId);
      const ready =
        number.status === "Ready" && number.lifecycle !== "deleting";
      const matchesReadiness =
        !readinessFilter || (readinessFilter === "ready" ? ready : !ready);
      return (
        matchesSearch &&
        matchesProvider &&
        matchesAssignment &&
        matchesReadiness
      );
    });
  }, [assignmentFilter, numbers, providerFilter, readinessFilter, search]);
  const activeFilterCount = [
    search,
    providerFilter,
    assignmentFilter,
    readinessFilter,
  ].filter(Boolean).length;

  function beginRequest() {
    if (busyRef.current) return false;
    busyRef.current = true;
    setBusy(true);
    return true;
  }

  function finishRequest() {
    busyRef.current = false;
    setBusy(false);
  }

  useEffect(() => {
    if (!session) return undefined;

    const idleCallbacks = window as unknown as {
      requestIdleCallback?: (
        callback: () => void,
        options?: { timeout: number },
      ) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (idleCallbacks.requestIdleCallback) {
      const idleId = idleCallbacks.requestIdleCallback(
        preloadPhoneNumberModals,
        { timeout: 1_000 },
      );
      return () => idleCallbacks.cancelIdleCallback?.(idleId);
    }

    const timer = window.setTimeout(preloadPhoneNumberModals, 0);
    return () => window.clearTimeout(timer);
  }, [session]);

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
    if (!beginRequest()) return;
    showMessage("");
    try {
      const result = await voiceApi.createPhoneNumber({
        ...input,
        direction: "Both",
      });
      setNumbers((current) => [result.number, ...current]);
      setShowImport(false);
      setAssignmentNumber(result.number);
      showMessage(
        `${result.number.number} imported. You can now link an agent.`,
      );
    } catch (caught) {
      showMessage(errorMessage(caught), true);
    } finally {
      finishRequest();
    }
  }

  async function assignAgent(agentId: string | null) {
    if (!assignmentNumber || !beginRequest()) return;
    showMessage("");
    try {
      const result = await voiceApi.assignPhoneNumberAgent(
        assignmentNumber._id,
        agentId,
      );
      setNumbers((current) =>
        current.map((item) =>
          item._id === result.number._id ? result.number : item,
        ),
      );
      setAssignmentNumber(null);
      if (result.routingWarning) {
        showMessage(
          publicVoiceMessage(
            result.routingWarning,
            "Agent linked, but phone routing still needs setup.",
          ),
          true,
        );
      } else {
        showMessage(
          agentId
            ? "Agent linked successfully."
            : "Agent unlinked successfully.",
        );
      }
    } catch (caught) {
      showMessage(errorMessage(caught), true);
    } finally {
      finishRequest();
    }
  }

  async function purchaseNumber(number: VobizNumber, label: string) {
    if (!beginRequest()) return;
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
      showMessage(
        `${result.number.number} purchased. You can now link any agent.`,
      );
    } catch (caught) {
      showMessage(errorMessage(caught), true);
    } finally {
      finishRequest();
    }
  }

  async function repairRoutes() {
    if (!beginRequest()) return;
    showMessage("");
    try {
      const result = await voiceApi.syncPhoneNumbers();
      const [numberResponse, agentResponse] = await Promise.all([
        voiceApi.phoneNumbers(),
        voiceApi.agentSummaries(),
      ]);
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
      finishRequest();
    }
  }

  async function deleteNumber(number: BackendPhoneNumber) {
    const deletionPending = number.lifecycle === "deleting";
    const confirmed = window.confirm(
      deletionPending
        ? `Retry deletion of ${number.number}?\n\nThe previous cleanup did not finish. This will safely resume it.`
        : `Delete ${number.number}?\n\nThis will unlink the agent, remove call routing and phone-provider assignments, and delete it from this workspace inventory.`,
    );
    if (!confirmed) return;

    if (!beginRequest()) return;
    showMessage("");
    try {
      const result = await voiceApi.deletePhoneNumber(number._id);
      setNumbers((current) =>
        current.filter((item) => item._id !== number._id),
      );
      setAgents((current) =>
        current.map((agent) =>
          agent.phone === number.number ? { ...agent, phone: "" } : agent,
        ),
      );
      if (assignmentNumber?._id === number._id) setAssignmentNumber(null);
      showMessage(
        result.routingWarning
          ? `${number.number} deleted. ${publicVoiceMessage(result.routingWarning, "Some phone routing cleanup still needs attention.")}`
          : `${number.number} deleted everywhere in this workspace.`,
      );
    } catch (caught) {
      showMessage(errorMessage(caught), true);
    } finally {
      finishRequest();
    }
  }

  async function copyNumber(number: BackendPhoneNumber) {
    try {
      await navigator.clipboard.writeText(number.number);
      showMessage(`${number.number} copied to the clipboard.`);
    } catch {
      showMessage("Could not copy the phone number.", true);
    }
  }

  if (!session) {
    return (
      <main className="app-strong grid min-h-screen place-items-center bg-[#f7f9f8]">
        Loading phone numbers
      </main>
    );
  }

  return (
    <main
      className={`dashboard-home-theme phone-number-workspace grid min-h-screen w-full min-w-0 bg-white text-[#111827] ${

        showUserSidebar
          ? "lg:grid-cols-[248px_minmax(0,1fr)]"
          : "lg:grid-cols-[64px_minmax(0,1fr)]"
      }`}
    >
      <DashboardSidebar
        activeLabel="Phone Numbers"
        userInitials={initials(session.name)}
        userName={session.name}
        userEmail={session.email}
        onLogout={() =>
          void logoutSession().then(() => router.replace("/login"))
        }
        showUserSidebar={showUserSidebar}
        setShowUserSidebar={setShowUserSidebar}
      />
      <section className="grid min-w-0 content-start">
        <DashboardPageHeader
          eyebrow="Telephony"
          title="Phone numbers"
          description="Import or buy telephony numbers, then link them to any voice agent."
          actions={
            <div className="flex items-center gap-2">
              <button
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] font-medium text-[#171717] transition hover:bg-[#fafafa] disabled:opacity-50"
                disabled={busy || loading}
                onClick={() => {
                  setShowImport(true);
                  showMessage("");
                }}
                onFocus={preloadPhoneNumberModals}
                onPointerDown={preloadPhoneNumberModals}
                onPointerEnter={preloadPhoneNumberModals}
                type="button"
              >
                <Icon icon="import" className="size-3.5" />
                Import number
              </button>
              <button
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#2563eb] px-3.5 text-[12.5px] font-medium text-white transition hover:bg-[#1d4ed8] disabled:opacity-50"
                disabled={busy || loading}
                onClick={() => {
                  setShowBuy(true);
                  showMessage("");
                }}
                onFocus={preloadPhoneNumberModals}
                onPointerDown={preloadPhoneNumberModals}
                onPointerEnter={preloadPhoneNumberModals}
                type="button"
              >
                <Icon icon="plus" className="size-3.5" />
                Buy number
              </button>
              <div className="relative">
                <button
                  className="grid h-8 w-8 place-items-center rounded-md border border-[#eaeaea] bg-white text-[13px] font-semibold text-[#52525b] hover:bg-[#fafafa] hover:text-[#171717]"
                  aria-expanded={showMoreActions}
                  aria-label="More phone number actions"
                  type="button"
                  onClick={() => setShowMoreActions((current) => !current)}
                >
                  •••
                </button>
                {showMoreActions ? (
                  <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-48 rounded-md border border-[#eaeaea] bg-white p-1 shadow-lg">
                    <button
                      className="flex h-8 w-full items-center gap-2 rounded px-2.5 text-left text-[12px] font-medium text-[#171717] hover:bg-[#fafafa]"
                      disabled={busy || loading}
                      onClick={() => {
                        setShowMoreActions(false);
                        void repairRoutes();
                      }}
                      type="button"
                    >
                      <Icon icon="refresh" className="size-3.5" />
                      Repair number routes
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          }
        />

        <div className="grid w-full gap-4 px-5 py-5 sm:px-6 lg:px-7">
          {notice ? (
            <Notice
              tone="success"
              message={notice}
              onClose={() => setNotice("")}
            />
          ) : null}
          {error ? (
            <Notice tone="error" message={error} onClose={() => setError("")} />
          ) : null}

          <section className="overflow-hidden rounded-xl border border-[#eaeaea] bg-white">
            <div className="flex flex-col gap-2 border-b border-[#eaeaea] bg-white p-3 sm:flex-row sm:items-center">
              <div className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-md border border-[#eaeaea] bg-white px-2.5 transition focus-within:border-black">
                <Icon
                  icon="search"
                  className="pointer-events-none size-3.5 text-[#71717a]"
                />
                <input
                  className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-[12.5px] text-[#171717] placeholder-[#71717a] outline-none"
                  placeholder="Search number, label, agent, or region..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                {search && (
                  <button
                    className="text-[11.5px] font-medium text-[#71717a] hover:text-black"
                    type="button"
                    onClick={() => setSearch("")}
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  aria-label="Filter by provider"
                  className="h-8 rounded-md border border-[#eaeaea] bg-white px-2.5 text-[12.5px] font-medium text-[#171717] outline-none transition hover:border-[#a1a1aa] focus:border-black"
                  value={providerFilter}
                  onChange={(event) => setProviderFilter(event.target.value)}
                >
                  <option value="">All providers</option>
                  {providerOptions.map((provider) => (
                    <option key={provider} value={provider}>
                      {provider}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Filter by agent assignment"
                  className="h-8 rounded-md border border-[#eaeaea] bg-white px-2.5 text-[12.5px] font-medium text-[#171717] outline-none transition hover:border-[#a1a1aa] focus:border-black"
                  value={assignmentFilter}
                  onChange={(event) => setAssignmentFilter(event.target.value)}
                >
                  <option value="">All assignments</option>
                  <option value="assigned">Assigned</option>
                  <option value="unassigned">Unassigned</option>
                </select>
                <select
                  aria-label="Filter by readiness"
                  className="h-8 rounded-md border border-[#eaeaea] bg-white px-2.5 text-[12.5px] font-medium text-[#171717] outline-none transition hover:border-[#a1a1aa] focus:border-black"
                  value={readinessFilter}
                  onChange={(event) => setReadinessFilter(event.target.value)}
                >
                  <option value="">All readiness</option>
                  <option value="ready">Ready</option>
                  <option value="attention">Needs attention</option>
                </select>
                {activeFilterCount > 0 && (
                  <button
                    className="h-8 rounded-md border border-[#eaeaea] bg-white px-2.5 text-[12px] font-medium text-[#71717a] transition hover:bg-[#fafafa] hover:text-[#171717]"
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setProviderFilter("");
                      setAssignmentFilter("");
                      setReadinessFilter("");
                    }}
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="grid min-h-[260px] place-items-center text-[12.5px] text-[#71717a]">
                Loading phone numbers...
              </div>
            ) : filteredNumbers.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] border-collapse text-left">
                  <thead className="border-b border-[#eaeaea] bg-[#fafafa]">
                    <tr className="text-[11px] font-semibold uppercase tracking-wider text-[#71717a]">
                      <th className="px-4 py-2.5 font-medium">Phone number</th>
                      <th className="px-4 py-2.5 font-medium">Provider</th>
                      <th className="w-[30%] px-4 py-2.5 font-medium">Agent</th>
                      <th className="w-[14%] px-4 py-2.5 font-medium">Region</th>
                      <th className="px-4 py-2.5 font-medium">Created</th>
                      <th className="w-12 px-4 py-2.5">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eaeaea]">
                    {filteredNumbers.map((number) => (
                      <PhoneNumberRow
                        key={number._id}
                        busy={busy}
                        number={number}
                        onDelete={() => void deleteNumber(number)}
                        onCopy={() => void copyNumber(number)}
                        onManage={() => {
                          setAssignmentNumber(number);
                          showMessage("");
                        }}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : numbers.length ? (
              <div className="grid min-h-[240px] place-items-center p-6 text-center">
                <div className="max-w-sm">
                  <h3 className="m-0 text-[13.5px] font-semibold text-[#171717]">No matching numbers</h3>
                  <p className="mt-1 mb-3 text-[12px] text-[#71717a]">
                    Try another search or reset the active filters.
                  </p>
                  <button
                    className="inline-flex h-8 items-center rounded-md border border-[#eaeaea] bg-white px-3 text-[12px] font-medium text-[#171717] hover:bg-[#fafafa]"
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setProviderFilter("");
                      setAssignmentFilter("");
                      setReadinessFilter("");
                    }}
                  >
                    Reset filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid min-h-[260px] place-items-center p-6 text-center">
                <div className="max-w-sm">
                  <h3 className="m-0 text-[13.5px] font-semibold text-[#171717]">
                    No phone numbers yet
                  </h3>
                  <p className="mt-1 mb-4 text-[12px] text-[#71717a]">
                    Import from Twilio, Plivo, Exotel, Vobiz, or Custom SIP Trunk—or buy a new number.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#eaeaea] bg-white px-3 text-[12px] font-medium text-[#171717] hover:bg-[#fafafa]"
                      disabled={busy || loading}
                      onClick={() => {
                        setShowImport(true);
                        showMessage("");
                      }}
                      onFocus={preloadPhoneNumberModals}
                      onPointerDown={preloadPhoneNumberModals}
                      onPointerEnter={preloadPhoneNumberModals}
                      type="button"
                    >
                      <Icon icon="import" className="size-3.5" /> Import number
                    </button>
                    <button
                      className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#2563eb] px-3.5 text-[12px] font-medium text-white hover:bg-[#1d4ed8]"
                      disabled={busy || loading}
                      onClick={() => {
                        setShowBuy(true);
                        showMessage("");
                      }}
                      onFocus={preloadPhoneNumberModals}
                      onPointerDown={preloadPhoneNumberModals}
                      onPointerEnter={preloadPhoneNumberModals}
                      type="button"
                    >
                      <Icon icon="plus" className="size-3.5" /> Buy number
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          <p className="app-caption m-0 px-1">
            Numbers stay in your inventory independently of agents. Link,
            switch, or unlink an agent whenever you need.
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
          onCloseAgent={() => {
            if (!busyRef.current) setAssignmentNumber(null);
          }}
          onCloseBuy={() => {
            if (!busyRef.current) setShowBuy(false);
          }}
          onCloseImport={() => {
            if (!busyRef.current) setShowImport(false);
          }}
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
  onCopy,
  onDelete,
  onManage,
}: {
  busy: boolean;
  number: BackendPhoneNumber;
  onCopy: () => void;
  onDelete: () => void;
  onManage: () => void;
}) {
  const agent = number.agentId;
  const deletionPending = number.lifecycle === "deleting";
  const actionButtonRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    if (!menuPosition) return undefined;
    const close = () => setMenuPosition(null);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuPosition(null);
      actionButtonRef.current?.focus();
    };
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuPosition]);

  function toggleActionMenu() {
    if (menuPosition) {
      setMenuPosition(null);
      return;
    }
    const rect = actionButtonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMenuPosition({
      top: Math.min(rect.bottom + 6, window.innerHeight - 174),
      left: Math.max(12, rect.right - 192),
    });
  }

  return (
    <tr className="dashboard-data-row border-b border-[#eaeaea] transition hover:bg-[#fafafa]">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 shrink-0 place-items-center rounded-md border border-[#eaeaea] bg-[#f4f4f5] text-[#171717]">
            <Icon icon="phone" className="size-3.5" />
          </span>
          <span className="min-w-0">
            <strong className="block text-[13px] font-medium text-[#171717] whitespace-nowrap">
              {number.number}
            </strong>
            <span className="block max-w-[240px] truncate text-[11px] text-[#71717a]">
              {number.label || (number.sipConfig?.inboundSipUri ? number.sipConfig.inboundSipUri : "")}
            </span>
            {number.sipConfig?.inboundSipUri && number.label ? (
              <span className="block max-w-[240px] truncate font-mono text-[11px] text-[#52525b]">
                {number.sipConfig.inboundSipUri}
              </span>
            ) : null}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className="inline-flex items-center rounded border border-[#eaeaea] bg-[#fafafa] px-2 py-0.5 text-[11px] font-medium text-[#52525b]"
        >
          {number.provider === "SIP" ? "Custom SIP" : number.provider}
        </span>
      </td>
      <td className="px-4 py-3">
        <button
          className={`dashboard-agent-assignment group inline-flex max-w-full items-center gap-1.5 rounded-md border px-2.5 py-1 text-left text-[12px] transition ${agent ? "border-[#eaeaea] bg-white text-[#171717] hover:border-black" : "border-dashed border-[#d4d4d8] bg-white text-[#71717a] hover:border-black hover:text-[#171717]"}`}
          disabled={busy || deletionPending}
          onClick={onManage}
          onFocus={preloadPhoneNumberModals}
          onPointerDown={preloadPhoneNumberModals}
          onPointerEnter={preloadPhoneNumberModals}
          type="button"
        >
          <span
            className="grid size-5 shrink-0 place-items-center rounded bg-[#f4f4f5] text-[#52525b]"
          >
            <Icon icon={agent ? "user" : "link"} className="size-3" />
          </span>
          <span className="truncate font-medium">
            {deletionPending
              ? "Deletion pending"
              : (agent?.name ?? "Link agent")}
          </span>
          <span className="ml-auto text-[10px] font-medium uppercase tracking-wider text-[#a1a1aa] group-hover:text-[#171717]">
            {agent ? "Change" : "Assign"}
          </span>
        </button>
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-[12px] text-[#52525b]">
        {number.region || "Global"}
      </td>
      <td className="px-4 py-3">
        <span className="block whitespace-nowrap text-[12px] text-[#171717]">
          {formatDate(number.createdAt)}
        </span>
        <span
          className={`text-[11px] ${!deletionPending && number.status === "Ready" ? "text-[#52525b]" : "text-[#71717a]"}`}
        >
          {deletionPending ? "Deletion pending - retry" : number.status}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="ml-auto w-fit">
          <button
            ref={actionButtonRef}
            className="grid size-7 place-items-center rounded-md border border-[#eaeaea] bg-white text-[#52525b] transition hover:bg-[#f4f4f5] hover:text-[#171717]"
            aria-expanded={Boolean(menuPosition)}
            aria-haspopup="menu"
            aria-label={`Actions for ${number.number}`}
            type="button"
            onClick={toggleActionMenu}
          >
            <Icon icon="more" className="size-3.5" />
          </button>
          {menuPosition
            ? createPortal(
                <>
                  <button
                    className="fixed inset-0 z-40 cursor-default"
                    aria-label="Close phone number actions"
                    type="button"
                    onClick={() => setMenuPosition(null)}
                  />
                  <div
                    className="fixed z-50 w-44 overflow-hidden rounded-md border border-[#eaeaea] bg-white p-1 shadow-lg"
                    role="menu"
                    aria-label={`Actions for ${number.number}`}
                    style={{ top: menuPosition.top, left: menuPosition.left }}
                  >
                    <button
                      className="flex h-8 w-full items-center gap-2 rounded px-2.5 text-left text-[12px] text-[#171717] transition hover:bg-[#f4f4f5] disabled:opacity-40"
                      disabled={busy || deletionPending}
                      role="menuitem"
                      type="button"
                      onClick={() => {
                        setMenuPosition(null);
                        onManage();
                      }}
                    >
                      <Icon icon="user" className="size-3.5" />
                      {agent ? "Change agent" : "Assign agent"}
                    </button>
                    <button
                      className="flex h-8 w-full items-center gap-2 rounded px-2.5 text-left text-[12px] text-[#171717] transition hover:bg-[#f4f4f5]"
                      role="menuitem"
                      type="button"
                      onClick={() => {
                        setMenuPosition(null);
                        onCopy();
                      }}
                    >
                      <Icon icon="copy" className="size-3.5" />
                      Copy number
                    </button>
                    {number.sipConfig?.inboundSipUri ? (
                      <button
                        className="flex h-8 w-full items-center gap-2 rounded px-2.5 text-left text-[12px] text-[#171717] transition hover:bg-[#f4f4f5]"
                        role="menuitem"
                        type="button"
                        onClick={() => {
                          setMenuPosition(null);
                          if (typeof navigator !== "undefined" && navigator.clipboard) {
                            navigator.clipboard.writeText(number.sipConfig?.inboundSipUri || "");
                          }
                        }}
                      >
                        <Icon icon="link" className="size-3.5" />
                        Copy SIP URI
                      </button>
                    ) : null}
                    <div className="my-1 h-px bg-[#eaeaea]" />
                    <button
                      className="flex h-8 w-full items-center gap-2 rounded px-2.5 text-left text-[12px] text-rose-600 transition hover:bg-rose-50 disabled:opacity-40"
                      disabled={busy}
                      role="menuitem"
                      type="button"
                      onClick={() => {
                        setMenuPosition(null);
                        onDelete();
                      }}
                    >
                      <Icon icon="trash" className="size-3.5" />
                      {deletionPending ? "Retry deletion" : "Delete number"}
                    </button>
                  </div>
                </>,
                document.body,
              )
            : null}
        </div>
      </td>
    </tr>
  );
}

function Notice({
  message,
  onClose,
  tone,
}: {
  message: string;
  onClose: () => void;
  tone: "error" | "success";
}) {
  const success = tone === "success";
  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-lg border px-3 py-2.5 ${success ? "border-[#a7f3d0] bg-[#ecfdf5] text-[#047857]" : "border-[#fecaca] bg-[#fff1f2] text-[#b91c1c]"}`}
    >
      <span className="app-body">{message}</span>
      <button
        className="grid size-6 shrink-0 place-items-center rounded-md hover:bg-black/5"
        onClick={onClose}
        type="button"
        aria-label="Dismiss"
      >
        <Icon icon="close" className="size-3.5" />
      </button>
    </div>
  );
}

function errorMessage(error: unknown) {
  return publicVoiceMessage(error, "The request could not be completed.");
}
