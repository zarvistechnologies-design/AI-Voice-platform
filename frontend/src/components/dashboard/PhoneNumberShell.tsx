"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  clearSession,
  getServerSession,
  getSession,
  subscribeToSession,
  validateStoredSession,
} from "@/lib/auth";
import {
  voiceApi,
  type BackendAgent,
  type BackendPhoneNumber,
  type VobizNumber,
} from "@/lib/voice";

type ActionMode = "import" | "buy" | null;
type Direction = BackendPhoneNumber["direction"];

type ConnectedNumber = {
  id: string;
  number: string;
  label: string;
  direction: Direction;
  agent: string;
  status: BackendPhoneNumber["status"];
  region: string;
  trunkId: string;
  provider: string;
  monthlyFee: number;
  currency: string;
  lastSync: string;
};

type IconName = "plus" | "refresh" | "phone" | "route" | "store" | "close" | "check";

const controlClass =
  "app-control-text min-h-10 rounded-lg border border-[#dfe3ea] bg-white px-3 text-black outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10";
const buttonClass =
  "app-button-text inline-flex min-h-9 items-center justify-center gap-2 rounded-lg px-3 transition disabled:cursor-not-allowed disabled:opacity-50";

function Icon({ icon }: { icon: IconName }) {
  const iconClass = "size-4 fill-none stroke-current stroke-2";

  if (icon === "plus") return <svg className={iconClass} viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>;
  if (icon === "refresh") return <svg className={iconClass} viewBox="0 0 24 24"><path d="M20 6v5h-5M4 18v-5h5" /><path d="M18 9a7 7 0 0 0-11.5-2.5M6 15a7 7 0 0 0 11.5 2.5" /></svg>;
  if (icon === "phone") return <svg className={iconClass} viewBox="0 0 24 24"><path d="M6.6 4.8 9 7.2a2 2 0 0 1 .4 2.2l-.8 1.7a12 12 0 0 0 5.3 5.3l1.7-.8a2 2 0 0 1 2.2.4l2.4 2.4a1.8 1.8 0 0 1-.2 2.7c-1 .7-2.2 1-3.6.8C9.4 20.7 3.3 14.6 2.1 7.6 1.9 6.2 2.2 5 2.9 4a1.8 1.8 0 0 1 2.7-.2Z" /></svg>;
  if (icon === "route") return <svg className={iconClass} viewBox="0 0 24 24"><path d="M6 5a3 3 0 1 0 0 6h12a3 3 0 1 1 0 6H8" /><path d="M8 15 5 18l3 3" /></svg>;
  if (icon === "store") return <svg className={iconClass} viewBox="0 0 24 24"><path d="M4 9h16l-1-5H5L4 9Z" /><path d="M5 9v11h14V9M9 20v-6h6v6" /><path d="M4 9a3 3 0 0 0 5 2 3 3 0 0 0 6 0 3 3 0 0 0 5-2" /></svg>;
  if (icon === "close") return <svg className={iconClass} viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" /></svg>;
  if (icon === "check") return <svg className={iconClass} viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" /></svg>;
  return null;
}

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function money(value?: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value ?? 0);
}

export function PhoneNumberShell() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [numbers, setNumbers] = useState<ConnectedNumber[]>([]);
  const [agents, setAgents] = useState<BackendAgent[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [vobizConfigured, setVobizConfigured] = useState(false);
  const [vobizAccountId, setVobizAccountId] = useState("");
  const [vobizAuthId, setVobizAuthId] = useState("");
  const [vobizAuthToken, setVobizAuthToken] = useState("");
  const [action, setAction] = useState<ActionMode>(null);
  const [candidates, setCandidates] = useState<VobizNumber[]>([]);
  const [candidate, setCandidate] = useState<VobizNumber | null>(null);
  const [agentId, setAgentId] = useState("");
  const [direction, setDirection] = useState<Direction>("Both");
  const [label, setLabel] = useState("");
  const [country, setCountry] = useState("IN");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const selected = numbers.find((item) => item.id === selectedId) ?? numbers[0];
  const connectedSet = useMemo(() => new Set(numbers.map((item) => item.number)), [numbers]);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/dashboard/phone-number");
      return;
    }
    void validateStoredSession();
    void Promise.all([voiceApi.phoneNumbers(), voiceApi.agents(), voiceApi.config()])
      .then(([numberResponse, agentResponse, config]) => {
        const mapped = numberResponse.numbers.map(mapBackendNumber);
        setNumbers(mapped);
        setSelectedId(mapped[0]?.id ?? "");
        setAgents(agentResponse.agents);
        setAgentId(agentResponse.agents[0]?._id ?? "");
        setVobizConfigured(config.vobiz.configured);
        setVobizAccountId(config.vobiz.accountId);
      })
      .catch(showError);
  }, [router, session]);

  function showError(error: unknown) {
    setMessage(error instanceof Error ? error.message : "The request could not be completed.");
  }

  async function openAction(mode: Exclude<ActionMode, null>) {
    setAction(mode);
    setCandidate(null);
    setCandidates([]);
    setMessage("");
    if (!vobizConfigured) return;
    await loadCandidates(mode);
  }

  async function loadCandidates(mode = action) {
    if (!mode) return;
    setBusy(true);
    setMessage(mode === "import" ? "Loading your Vobiz numbers..." : "Searching Vobiz inventory...");
    try {
      const result =
        mode === "import"
          ? await voiceApi.vobizNumbers()
          : await voiceApi.vobizInventory({ country, search });
      setCandidates(result.items);
      setMessage(result.items.length ? "" : "No matching Vobiz numbers found.");
    } catch (error) {
      showError(error);
    } finally {
      setBusy(false);
    }
  }

  async function connectCandidate() {
    if (!candidate || !agentId || !action) return;
    setBusy(true);
    setMessage(action === "buy" ? "Purchasing from Vobiz and connecting your agent..." : "Connecting this number to your agent...");
    try {
      const input = {
        agentId,
        phoneNumber: candidate.e164,
        label: label.trim() || `${candidate.region || candidate.country} line`,
        direction,
      };
      const response =
        action === "buy"
          ? await voiceApi.purchasePhoneNumber({ ...input, currency: candidate.currency })
          : await voiceApi.importPhoneNumber({ ...input, region: candidate.region || candidate.country });
      const mapped = mapBackendNumber(response.number);
      setNumbers((current) => [mapped, ...current.filter((item) => item.id !== mapped.id)]);
      setSelectedId(mapped.id);
      setMessage("");
      setAction(null);
    } catch (error) {
      showError(error);
    } finally {
      setBusy(false);
    }
  }

  async function connectVobiz() {
    setBusy(true);
    setMessage("Verifying your Vobiz account...");
    try {
      const connection = await voiceApi.connectVobiz(vobizAuthId.trim(), vobizAuthToken.trim());
      setVobizConfigured(true);
      setVobizAccountId(connection.accountId);
      setVobizAuthToken("");
      const result =
        action === "buy"
          ? await voiceApi.vobizInventory({ country, search })
          : await voiceApi.vobizNumbers();
      setCandidates(result.items);
      setMessage(`Vobiz account ${connection.accountId} connected.`);
    } catch (error) {
      showError(error);
    } finally {
      setBusy(false);
    }
  }

  async function disconnectVobiz() {
    setBusy(true);
    try {
      await voiceApi.disconnectVobiz();
      setVobizConfigured(false);
      setVobizAccountId("");
      setCandidates([]);
      setCandidate(null);
      setMessage("Vobiz account disconnected.");
    } catch (error) {
      showError(error);
    } finally {
      setBusy(false);
    }
  }

  async function sync() {
    setBusy(true);
    setMessage("Syncing Vobiz numbers and platform voice routes...");
    try {
      const response = await voiceApi.syncPhoneNumbers();
      setMessage(
        `Synced ${response.vobiz.total} Vobiz numbers and ${response.routes.total} connected platform routes.`,
      );
    } catch (error) {
      showError(error);
    } finally {
      setBusy(false);
    }
  }

  if (!session) {
    return <main className="app-strong grid min-h-screen place-items-center bg-[#f7f8fb]">Loading phone numbers</main>;
  }

  return (
    <main className="grid min-h-screen bg-[#f7f8fb] text-[#111827] lg:h-screen lg:grid-cols-[64px_minmax(0,1fr)] lg:overflow-hidden">
      <DashboardSidebar activeLabel="Phone Number" userInitials={initials(session.name)} onLogout={() => { clearSession(); router.replace("/login"); }} />

      <section className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)]">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e7eb] bg-white px-4 py-3 sm:px-5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="app-page-title m-0">Phone numbers</h1>
              <span className={`size-2 rounded-full ${vobizConfigured ? "bg-[#10b981]" : "bg-[#f59e0b]"}`} />
              {vobizAccountId ? <span className="app-label rounded-full bg-[#ecfdf5] px-2 py-0.5 text-[#047857]">{vobizAccountId}</span> : null}
            </div>
            <p className="app-caption m-0">Import or buy from Vobiz, then connect the number to your AI Voice Platform agent.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className={`${buttonClass} border border-[#d5d8df] bg-white text-[#111827]`} disabled={busy} onClick={() => void sync()} type="button"><Icon icon="refresh" />Sync</button>
            <button className={`${buttonClass} border border-[#c7d2fe] bg-[#eef2ff] text-[#3730a3]`} onClick={() => void openAction("import")} type="button"><Icon icon="route" />Import from Vobiz</button>
            <button className={`${buttonClass} border-0 bg-[#1438f5] text-white shadow-sm`} onClick={() => void openAction("buy")} type="button"><Icon icon="plus" />Buy number</button>
          </div>
        </header>

        <section className="grid min-h-0 gap-3 p-3 lg:grid-cols-[330px_minmax(0,1fr)]">
          <aside className="grid min-h-[280px] grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-xl border border-[#dfe3ea] bg-white">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3">
              <div>
                <h2 className="app-section-title m-0">Connected lines</h2>
                <span className="app-caption">{numbers.length} routed to this platform</span>
              </div>
              <span className="app-label rounded-full bg-[#eff6ff] px-2.5 py-1 text-[#2563eb]">{numbers.length}</span>
            </div>
            <div className="overflow-y-auto p-2">
              {numbers.length ? numbers.map((item) => (
                <button className={`mb-1 grid w-full grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg p-2.5 text-left transition ${item.id === selected?.id ? "bg-[#eef4ff]" : "hover:bg-[#f8fafc]"}`} key={item.id} onClick={() => setSelectedId(item.id)} type="button">
                  <span className="grid size-9 place-items-center rounded-lg bg-white text-[#2563eb] shadow-sm"><Icon icon="phone" /></span>
                  <span className="min-w-0"><strong className="app-strong block truncate">{item.number}</strong><span className="app-caption block truncate">{item.agent} / {item.direction}</span></span>
                  <span className="size-2.5 rounded-full bg-[#10b981]" />
                </button>
              )) : (
                <div className="grid h-full place-items-center p-6 text-center">
                  <div><span className="mx-auto mb-3 grid size-11 place-items-center rounded-xl bg-[#eff6ff] text-[#2563eb]"><Icon icon="phone" /></span><strong className="app-strong block">No connected numbers</strong><span className="app-caption">Import one already owned in Vobiz.</span></div>
                </div>
              )}
            </div>
          </aside>

          <section className="grid min-h-0 content-start gap-3">
            <article className="rounded-xl border border-[#dfe3ea] bg-white p-4">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div><span className="app-label">Selected line</span><h2 className="app-value mt-1 mb-0">{selected?.number ?? "No line selected"}</h2><span className="app-caption">{selected?.label ?? "Choose Import from Vobiz to connect a number."}</span></div>
                {selected ? <span className="app-label rounded-full bg-[#ecfdf5] px-2.5 py-1 text-[#047857]">{selected.status}</span> : null}
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Provider" value={selected?.provider ?? "Vobiz"} />
                <Metric label="Agent" value={selected?.agent ?? "Unassigned"} />
                <Metric label="Direction" value={selected?.direction ?? "-"} />
                <Metric label="Monthly number fee" value={selected ? money(selected.monthlyFee, selected.currency) : "-"} />
              </div>
            </article>

            <article className="rounded-xl border border-[#dfe3ea] bg-white p-4">
              <div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="app-section-title m-0">How this line works</h2><span className="app-caption">Each service has one clear responsibility</span></div><span className="grid size-9 place-items-center rounded-lg bg-[#eef2ff] text-[#4338ca]"><Icon icon="route" /></span></div>
              <div className="grid gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
                <FlowCard icon="store" title="Vobiz number" body="Owns the DID, receives PSTN calls, and handles telephony billing." />
                <FlowArrow />
                <FlowCard icon="route" title="Platform voice routing" body="Securely moves realtime call audio between Vobiz and your agent." />
                <FlowArrow />
                <FlowCard icon="phone" title="Voice agent" body="Listens, reasons, speaks, and performs configured tools." />
              </div>
            </article>

            {message ? <p className="app-control-text m-0 rounded-lg border border-[#bfdbfe] bg-[#eff6ff] px-3 py-2 text-[#1d4ed8]">{message}</p> : null}
          </section>
        </section>
      </section>

      {action ? (
        <NumberActionPanel
          action={action}
          agents={agents}
          agentId={agentId}
          busy={busy}
          candidate={candidate}
          candidates={candidates}
          connectedSet={connectedSet}
          country={country}
          direction={direction}
          label={label}
          message={message}
          search={search}
          vobizConfigured={vobizConfigured}
          vobizAccountId={vobizAccountId}
          vobizAuthId={vobizAuthId}
          vobizAuthToken={vobizAuthToken}
          onAgentChange={setAgentId}
          onCandidateChange={setCandidate}
          onClose={() => { setAction(null); setMessage(""); }}
          onConnect={() => void connectCandidate()}
          onConnectVobiz={() => void connectVobiz()}
          onCountryChange={setCountry}
          onDirectionChange={setDirection}
          onDisconnectVobiz={() => void disconnectVobiz()}
          onLabelChange={setLabel}
          onSearchChange={setSearch}
          onVobizAuthIdChange={setVobizAuthId}
          onVobizAuthTokenChange={setVobizAuthToken}
          onSearch={() => void loadCandidates(action)}
        />
      ) : null}
    </main>
  );
}

function NumberActionPanel(props: {
  action: Exclude<ActionMode, null>;
  agents: BackendAgent[];
  agentId: string;
  busy: boolean;
  candidate: VobizNumber | null;
  candidates: VobizNumber[];
  connectedSet: Set<string>;
  country: string;
  direction: Direction;
  label: string;
  message: string;
  search: string;
  vobizConfigured: boolean;
  vobizAccountId: string;
  vobizAuthId: string;
  vobizAuthToken: string;
  onAgentChange: (value: string) => void;
  onCandidateChange: (value: VobizNumber) => void;
  onClose: () => void;
  onConnect: () => void;
  onConnectVobiz: () => void;
  onCountryChange: (value: string) => void;
  onDirectionChange: (value: Direction) => void;
  onDisconnectVobiz: () => void;
  onLabelChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onVobizAuthIdChange: (value: string) => void;
  onVobizAuthTokenChange: (value: string) => void;
  onSearch: () => void;
}) {
  const isBuy = props.action === "buy";
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#0f172a]/45 p-3 backdrop-blur-sm" role="dialog" aria-modal="true">
      <section className="grid max-h-[calc(100vh-24px)] w-full max-w-4xl grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-2xl border border-white/60 bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-[#e5e7eb] px-4 py-3">
          <div><span className="app-label text-[#2563eb]">Vobiz phone numbers</span><h2 className="app-page-title mt-0.5 mb-0">{isBuy ? "Buy and connect a number" : "Import an owned number"}</h2><p className="app-caption m-0">{isBuy ? "Purchase directly from Vobiz inventory, then route it to an agent." : "Choose a number already purchased in your Vobiz account."}</p></div>
          <button className="grid size-9 place-items-center rounded-lg border border-[#dfe3ea] bg-white text-[#475569]" onClick={props.onClose} type="button" aria-label="Close"><Icon icon="close" /></button>
        </header>

        {!props.vobizConfigured ? (
          <div className="grid place-items-center p-4 sm:p-8">
            <div className="grid w-full max-w-lg gap-4 rounded-xl border border-[#dbeafe] bg-[#f8fafc] p-5">
              <div>
                <span className="app-label text-[#2563eb]">Secure provider connection</span>
                <h3 className="app-page-title mt-1 mb-0">Connect your Vobiz account</h3>
                <p className="app-body mb-0">Use the API Credentials card in your Vobiz console. Your token is encrypted and never displayed again.</p>
              </div>
              <label className="app-label grid gap-1.5">Auth ID<input className={controlClass} autoComplete="off" placeholder="MA_XXXXXXXX" value={props.vobizAuthId} onChange={(event) => props.onVobizAuthIdChange(event.target.value)} /></label>
              <label className="app-label grid gap-1.5">Auth Token<input className={controlClass} autoComplete="new-password" placeholder="Paste your Vobiz Auth Token" type="password" value={props.vobizAuthToken} onChange={(event) => props.onVobizAuthTokenChange(event.target.value)} /></label>
              <button className={`${buttonClass} border-0 bg-[#1438f5] px-4 text-white shadow-sm`} disabled={props.busy || !props.vobizAuthId.trim() || !props.vobizAuthToken.trim()} onClick={props.onConnectVobiz} type="button">{props.busy ? "Verifying..." : "Connect Vobiz account"}</button>
              <span className="app-caption">Each signed-in user connects and manages only their own Vobiz account.</span>
            </div>
          </div>
        ) : (
          <div className="grid min-h-0 gap-3 overflow-hidden p-3 md:grid-cols-[minmax(0,1fr)_290px]">
            <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-xl border border-[#e5e7eb]">
              <div className="grid gap-2 border-b border-[#e5e7eb] bg-[#f8fafc] p-2 sm:grid-cols-[110px_minmax(0,1fr)_auto]">
                <select className={controlClass} disabled={!isBuy} value={props.country} onChange={(event) => props.onCountryChange(event.target.value)}><option value="IN">India</option><option value="US">United States</option><option value="GB">United Kingdom</option><option value="CA">Canada</option></select>
                <input className={controlClass} disabled={!isBuy} placeholder="Search number or area code" value={props.search} onChange={(event) => props.onSearchChange(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") props.onSearch(); }} />
                <button className={`${buttonClass} border border-[#d5d8df] bg-white`} disabled={props.busy} onClick={props.onSearch} type="button"><Icon icon="refresh" />{isBuy ? "Search" : "Refresh"}</button>
              </div>
              <div className="overflow-y-auto p-2">
                {props.candidates.map((item) => {
                  const selected = props.candidate?.id === item.id;
                  const alreadyConnected = props.connectedSet.has(item.e164);
                  return <button className={`mb-1 grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border p-3 text-left transition ${selected ? "border-[#2563eb] bg-[#eff6ff]" : "border-transparent hover:bg-[#f8fafc]"}`} disabled={alreadyConnected} key={item.id} onClick={() => props.onCandidateChange(item)} type="button"><span><strong className="app-strong block">{item.e164}</strong><span className="app-caption">{[item.region, item.country].filter(Boolean).join(", ")} / {item.status}</span></span><span className="text-right">{alreadyConnected ? <span className="app-label text-[#059669]">Connected</span> : isBuy ? <><strong className="app-strong block">{money(item.monthly_fee, item.currency)}</strong><span className="app-caption">per month</span></> : <span className={`grid size-6 place-items-center rounded-full ${selected ? "bg-[#2563eb] text-white" : "border border-[#cbd5e1]"}`}>{selected ? <Icon icon="check" /> : null}</span>}</span></button>;
                })}
                {!props.candidates.length && !props.busy ? <p className="app-caption m-0 p-5 text-center">No Vobiz numbers found.</p> : null}
              </div>
            </div>

            <aside className="grid content-start gap-3 rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-3">
              <div className="flex items-start justify-between gap-2"><div><span className="app-label">Connected account</span><strong className="app-strong mt-1 block">{props.vobizAccountId}</strong></div><button className="app-label border-0 bg-transparent p-0 text-[#dc2626]" disabled={props.busy} onClick={props.onDisconnectVobiz} type="button">Disconnect</button></div>
              <div><span className="app-label">Selected number</span><strong className="app-value mt-1 block">{props.candidate?.e164 ?? "Choose a number"}</strong>{props.candidate && isBuy ? <span className="app-caption">Setup {money(props.candidate.setup_fee, props.candidate.currency)} / Monthly {money(props.candidate.monthly_fee, props.candidate.currency)}</span> : null}</div>
              <label className="app-label grid gap-1.5">Assign agent<select className={controlClass} value={props.agentId} onChange={(event) => props.onAgentChange(event.target.value)}>{props.agents.map((agent) => <option key={agent._id} value={agent._id}>{agent.name}</option>)}</select></label>
              <label className="app-label grid gap-1.5">Route direction<select className={controlClass} value={props.direction} onChange={(event) => props.onDirectionChange(event.target.value as Direction)}><option>Both</option><option>Inbound</option><option>Outbound</option></select></label>
              <label className="app-label grid gap-1.5">Line label<input className={controlClass} placeholder="Support main line" value={props.label} onChange={(event) => props.onLabelChange(event.target.value)} /></label>
              <div className="rounded-lg border border-[#dbeafe] bg-white p-3"><span className="app-label block text-[#2563eb]">After confirmation</span><span className="app-caption">{isBuy ? "Vobiz charges the displayed fees. " : ""}AI Voice Platform connects the number and assigns this agent.</span></div>
            </aside>
          </div>
        )}

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e7eb] px-4 py-3">
          <span className="app-caption">{props.message}</span>
          <button className={`${buttonClass} border-0 bg-[#1438f5] px-4 text-white shadow-sm`} disabled={!props.vobizConfigured || !props.candidate || !props.agentId || props.busy} onClick={props.onConnect} type="button">{props.busy ? "Working..." : isBuy ? "Buy and connect" : "Connect to agent"}<Icon icon="route" /></button>
        </footer>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[#e5e7eb] bg-[#f8fafc] p-3"><span className="app-label block">{label}</span><strong className="app-strong mt-1 block truncate">{value}</strong></div>;
}

function FlowCard({ icon, title, body }: { icon: IconName; title: string; body: string }) {
  return <div className="rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-3"><span className="mb-2 grid size-8 place-items-center rounded-lg bg-white text-[#2563eb] shadow-sm"><Icon icon={icon} /></span><strong className="app-strong block">{title}</strong><span className="app-caption">{body}</span></div>;
}

function FlowArrow() {
  return <span className="hidden text-center text-[#94a3b8] md:block">&gt;</span>;
}

function mapBackendNumber(number: BackendPhoneNumber): ConnectedNumber {
  return {
    id: number._id,
    number: number.number,
    label: number.label,
    direction: number.direction,
    agent: number.agentId?.name ?? "Unassigned",
    status: number.status,
    region: number.region,
    trunkId: number.inboundTrunkId || number.outboundTrunkId || "-",
    provider: number.provider || "Vobiz",
    monthlyFee: number.monthlyFee ?? 0,
    currency: number.currency || "INR",
    lastSync: new Date(number.updatedAt).toLocaleString(),
  };
}
