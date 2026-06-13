"use client";

import { FormEvent, useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  clearSession,
  getServerSession,
  getSession,
  subscribeToSession,
  validateStoredSession,
} from "@/lib/auth";

type ImportedNumber = {
  id: string;
  number: string;
  label: string;
  direction: "Inbound" | "Outbound" | "Both";
  agent: string;
  status: "Ready" | "Pending" | "Needs setup";
  region: string;
  trunkId: string;
  lastSync: string;
  callsToday: number;
};

const initialNumbers: ImportedNumber[] = [
  {
    id: "num-1",
    number: "+1 415 555 0198",
    label: "Growth Desk main",
    direction: "Both",
    agent: "Maya",
    status: "Ready",
    region: "United States",
    trunkId: "vbz-us-west-01",
    lastSync: "2 min ago",
    callsToday: 84,
  },
  {
    id: "num-2",
    number: "+1 212 555 0144",
    label: "Support queue",
    direction: "Inbound",
    agent: "Ava",
    status: "Pending",
    region: "United States",
    trunkId: "vbz-us-east-02",
    lastSync: "14 min ago",
    callsToday: 19,
  },
  {
    id: "num-3",
    number: "+44 20 7946 0182",
    label: "London sales",
    direction: "Outbound",
    agent: "Noah",
    status: "Needs setup",
    region: "United Kingdom",
    trunkId: "vbz-eu-03",
    lastSync: "1 hr ago",
    callsToday: 7,
  },
];

const checklistItems = [
  "Number exists in Vobiz AI",
  "Inbound route connected",
  "Caller ID approved",
  "Agent assigned",
];

type IconName = "plus" | "refresh" | "phone" | "route" | "shield";

function PanelIcon({ icon }: { icon: IconName }) {
  const iconClass = "size-4 fill-none stroke-current stroke-2";

  if (icon === "plus") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  }

  if (icon === "refresh") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 6v5h-5M4 18v-5h5" />
        <path d="M18 9a7 7 0 0 0-11.5-2.5M6 15a7 7 0 0 0 11.5 2.5" />
      </svg>
    );
  }

  if (icon === "phone") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.6 4.8 9 7.2a2 2 0 0 1 .4 2.2l-.8 1.7a12 12 0 0 0 5.3 5.3l1.7-.8a2 2 0 0 1 2.2.4l2.4 2.4a1.8 1.8 0 0 1-.2 2.7c-1 .7-2.2 1-3.6.8C9.4 20.7 3.3 14.6 2.1 7.6 1.9 6.2 2.2 5 2.9 4a1.8 1.8 0 0 1 2.7-.2Z" />
      </svg>
    );
  }

  if (icon === "route") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 5a3 3 0 1 0 0 6h12a3 3 0 1 1 0 6H8" />
        <path d="M8 15 5 18l3 3" />
      </svg>
    );
  }

  return (
    <svg className={iconClass} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 5 6v5c0 4.4 2.8 8.4 7 10 4.2-1.6 7-5.6 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-5" />
    </svg>
  );
}

function getStatusTone(status: ImportedNumber["status"]) {
  if (status === "Ready") {
    return {
      dot: "bg-[#059669]",
      badge: "bg-[#ecfdf5] text-[#047857]",
      text: "text-[#059669]",
    };
  }

  if (status === "Pending") {
    return {
      dot: "bg-[#d97706]",
      badge: "bg-[#fff7ed] text-[#c2410c]",
      text: "text-[#d97706]",
    };
  }

  return {
    dot: "bg-[#dc2626]",
    badge: "bg-[#fef2f2] text-[#b91c1c]",
    text: "text-[#dc2626]",
  };
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function PhoneNumberShell() {
  const router = useRouter();
  const session = useSyncExternalStore(
    subscribeToSession,
    getSession,
    getServerSession,
  );

  const [numbers, setNumbers] = useState(initialNumbers);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accountId, setAccountId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [region, setRegion] = useState("United States");
  const [direction, setDirection] = useState<ImportedNumber["direction"]>("Both");
  const [agent, setAgent] = useState("Maya");
  const [message, setMessage] = useState("");
  const [selectedNumberId, setSelectedNumberId] = useState(initialNumbers[0].id);

  const selectedNumber =
    numbers.find((item) => item.id === selectedNumberId) ??
    numbers[0] ??
    initialNumbers[0];
  const selectedTone = getStatusTone(selectedNumber.status);
  const readyCount = numbers.filter((item) => item.status === "Ready").length;

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/dashboard/phone-number");
      return;
    }

    void validateStoredSession();
  }, [router, session]);

  function handleLogout() {
    clearSession();
    router.replace("/login");
  }

  function handleImport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedNumber = phoneNumber.trim();

    if (!normalizedNumber) {
      setMessage("Enter a phone number to import.");
      return;
    }

    if (!accountId.trim() || !apiKey.trim()) {
      setMessage("Add Vobiz AI account ID and API key.");
      return;
    }

    const regionCode = region.toLowerCase().replace(/[^a-z]/g, "").slice(0, 2);
    const nextNumberId = `num-${Date.now()}`;
    const nextNumber: ImportedNumber = {
      id: nextNumberId,
      number: normalizedNumber,
      label: `${region} Vobiz line`,
      direction,
      agent,
      status: "Pending",
      region,
      trunkId: `vbz-${regionCode}-${numbers.length + 1}`,
      lastSync: "Just now",
      callsToday: 0,
    };

    setNumbers((current) => [nextNumber, ...current]);
    setSelectedNumberId(nextNumberId);
    setPhoneNumber("");
    setMessage("Number queued for import from Vobiz AI.");
  }

  if (!session) {
    return (
      <main className="app-strong grid min-h-screen place-items-center gap-3 bg-[#f8f6ff]">
        <span className="size-9 animate-spin rounded-full border-3 border-[#ded6f2] border-t-[#2563eb]" />
        Loading phone numbers
      </main>
    );
  }

  return (
    <main className="grid min-h-screen bg-[#f7f8fb] text-[#111827] lg:grid-cols-[64px_minmax(0,1fr)]">
      <DashboardSidebar
        activeLabel="Phone Number"
        userInitials={getInitials(session.name)}
        onLogout={handleLogout}
      />

      <section className="grid content-start gap-4 p-3 sm:p-4">
        <header className="-mx-3 -mt-3 flex flex-col items-stretch justify-between gap-4 border-b border-[#e5e7eb] bg-white px-4 py-4 sm:-mx-4 sm:-mt-4 sm:px-6 lg:flex-row lg:items-center">
          <div>
            <span className="app-kicker">Voice Platform</span>
            <h1 className="app-page-title mt-1 mb-0">Phone Number</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              className="app-button-text inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-[#d5d8df] bg-white px-3 text-[#111827] shadow-sm"
              type="button"
            >
              <PanelIcon icon="refresh" />
              Sync Vobiz
            </button>
            <button
              className="app-button-text inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border-0 bg-[#1438f5] px-3 text-white shadow-sm"
              type="button"
            >
              <PanelIcon icon="plus" />
              Import number
            </button>
          </div>
        </header>

        <section className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="overflow-hidden rounded-lg border border-[#dfe3ea] bg-white">
            <div className="flex min-h-[58px] items-center justify-between border-b border-[#e5e7eb] px-4">
              <div>
                <h2 className="app-section-title m-0">Phone numbers</h2>
                <span className="app-caption">Imported from Vobiz AI</span>
              </div>
              <span className="app-label rounded-full bg-[#eff6ff] px-2.5 py-1 text-[#2563eb]">
                {numbers.length}
              </span>
            </div>

            <div className="grid gap-1.5 p-2">
              {numbers.map((item) => {
                const isActive = item.id === selectedNumber.id;
                const tone = getStatusTone(item.status);

                return (
                  <button
                    className={`grid w-full grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg p-2.5 text-left transition ${
                      isActive ? "bg-[#eef4ff]" : "hover:bg-[#f8fafc]"
                    }`}
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedNumberId(item.id)}
                  >
                    <span className="grid size-9 place-items-center rounded-lg bg-white text-[#2563eb] shadow-sm">
                      <PanelIcon icon="phone" />
                    </span>
                    <span className="min-w-0">
                      <strong className="app-strong block truncate">
                        {item.number}
                      </strong>
                      <span className="app-caption block truncate">{item.label}</span>
                    </span>
                    <span className={`size-2.5 rounded-full ${tone.dot}`} />
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="grid gap-4">
            <form
              className="rounded-lg border border-[#dfe3ea] bg-white"
              onSubmit={handleImport}
            >
              <div className="flex min-h-[58px] items-center justify-between border-b border-[#e5e7eb] px-4">
                <div>
                  <h2 className="app-section-title m-0">Import number</h2>
                  <span className="app-caption">Connect a Vobiz line to an agent</span>
                </div>
                <span className="grid size-9 place-items-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
                  <PanelIcon icon="route" />
                </span>
              </div>

              <div className="grid gap-4 p-4">
                <div className="grid gap-3 lg:grid-cols-2">
                  <label className="app-label grid gap-2">
                    <span>Vobiz account ID</span>
                    <input
                      className="app-control-text min-h-10 rounded-lg border border-[#dfe3ea] px-3 text-black outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
                      placeholder="vbz_acc_..."
                      value={accountId}
                      onChange={(event) => setAccountId(event.target.value)}
                    />
                  </label>

                  <label className="app-label grid gap-2">
                    <span>Vobiz API key</span>
                    <input
                      className="app-control-text min-h-10 rounded-lg border border-[#dfe3ea] px-3 text-black outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
                      placeholder="Paste API key"
                      type="password"
                      value={apiKey}
                      onChange={(event) => setApiKey(event.target.value)}
                    />
                  </label>
                </div>

                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_170px_150px_150px]">
                  <label className="app-label grid gap-2">
                    <span>Phone number</span>
                    <input
                      className="app-control-text min-h-10 rounded-lg border border-[#dfe3ea] px-3 text-black outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
                      inputMode="tel"
                      placeholder="+14155550123"
                      value={phoneNumber}
                      onChange={(event) => setPhoneNumber(event.target.value)}
                    />
                  </label>

                  <label className="app-label grid gap-2">
                    <span>Region</span>
                    <select
                      className="app-control-text min-h-10 rounded-lg border border-[#dfe3ea] px-3 text-black outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
                      value={region}
                      onChange={(event) => setRegion(event.target.value)}
                    >
                      <option>United States</option>
                      <option>India</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                    </select>
                  </label>

                  <label className="app-label grid gap-2">
                    <span>Direction</span>
                    <select
                      className="app-control-text min-h-10 rounded-lg border border-[#dfe3ea] px-3 text-black outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
                      value={direction}
                      onChange={(event) =>
                        setDirection(event.target.value as ImportedNumber["direction"])
                      }
                    >
                      <option>Both</option>
                      <option>Inbound</option>
                      <option>Outbound</option>
                    </select>
                  </label>

                  <label className="app-label grid gap-2">
                    <span>Agent</span>
                    <select
                      className="app-control-text min-h-10 rounded-lg border border-[#dfe3ea] px-3 text-black outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
                      value={agent}
                      onChange={(event) => setAgent(event.target.value)}
                    >
                      <option>Maya</option>
                      <option>Ava</option>
                      <option>Noah</option>
                    </select>
                  </label>
                </div>

                <div className="flex flex-col justify-between gap-3 border-t border-[#e5e7eb] pt-4 sm:flex-row sm:items-center">
                  {message ? (
                    <p className="app-control-text m-0 text-[#1d4ed8]">
                      {message}
                    </p>
                  ) : (
                    <p className="app-caption m-0">
                      New numbers stay pending until backend import is connected.
                    </p>
                  )}

                  <button
                    className="app-button-text inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border-0 bg-[#1438f5] px-4 text-white shadow-sm"
                    type="submit"
                  >
                    <PanelIcon icon="plus" />
                    Import from Vobiz AI
                  </button>
                </div>
              </div>
            </form>

            <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
              <article className="rounded-lg border border-[#dfe3ea] bg-white">
                <div className="flex min-h-[58px] items-center justify-between border-b border-[#e5e7eb] px-4">
                  <div>
                    <h2 className="app-section-title m-0">Selected line</h2>
                    <span className="app-caption">Routing and sync details</span>
                  </div>
                  <span
                    className={`app-label rounded-full px-2.5 py-1 ${selectedTone.badge}`}
                  >
                    {selectedNumber.status}
                  </span>
                </div>

                <div className="grid gap-4 p-4">
                  <div>
                    <strong className="app-value block">{selectedNumber.number}</strong>
                    <span className="app-caption">{selectedNumber.label}</span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-4">
                    <span>
                      <span className="app-label block">Direction</span>
                      <strong className="app-strong">{selectedNumber.direction}</strong>
                    </span>
                    <span>
                      <span className="app-label block">Agent</span>
                      <strong className="app-strong">{selectedNumber.agent}</strong>
                    </span>
                    <span>
                      <span className="app-label block">Calls today</span>
                      <strong className="app-strong">{selectedNumber.callsToday}</strong>
                    </span>
                    <span>
                      <span className="app-label block">Last sync</span>
                      <strong className="app-strong">{selectedNumber.lastSync}</strong>
                    </span>
                  </div>

                  <div className="rounded-lg border border-[#e5e7eb] bg-[#f8fafc] p-3">
                    <span className="app-label block">Route</span>
                    <strong className="app-strong block truncate">
                      Vobiz AI / {selectedNumber.trunkId} / {selectedNumber.agent}
                    </strong>
                  </div>
                </div>
              </article>

              <article className="rounded-lg border border-[#dfe3ea] bg-white p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="app-section-title m-0">Status</h2>
                    <span className="app-caption">{readyCount} ready lines</span>
                  </div>
                  <span className="grid size-8 place-items-center rounded-lg bg-[#ecfdf5] text-[#059669]">
                    <PanelIcon icon="shield" />
                  </span>
                </div>

                <div className="grid gap-3">
                  {checklistItems.map((item) => (
                    <div className="flex items-center gap-3" key={item}>
                      <span className="size-2 rounded-full bg-[#059669]" />
                      <span className="app-body">{item}</span>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </section>
        </section>
      </section>
    </main>
  );
}
