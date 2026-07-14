"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import {
  publicVoiceMessage,
  type AgentSummary,
  type BackendPhoneNumber,
  type PhoneNumberImportInput,
  type TelephonyProvider,
  type VobizNumber,
} from "@/lib/voice";

type IconName =
  | "check"
  | "close"
  | "import"
  | "link"
  | "plus"
  | "search"
  | "unlink"
  | "user";

type InventorySearchInput = {
  country: string;
  search?: string;
};

type InventorySearchResult = {
  items: VobizNumber[];
};

type PhoneNumberModalsProps = {
  agents: AgentSummary[];
  assignmentNumber: BackendPhoneNumber | null;
  busy: boolean;
  requestError: string;
  showBuy: boolean;
  showImport: boolean;
  onAssign: (agentId: string | null) => void;
  onCloseAgent: () => void;
  onCloseBuy: () => void;
  onCloseImport: () => void;
  onImport: (input: PhoneNumberImportInput) => void;
  onPurchase: (number: VobizNumber, label: string) => void;
  onSearchInventory: (input: InventorySearchInput) => Promise<InventorySearchResult>;
};

const providers: { id: TelephonyProvider; description: string; docs: string }[] = [
  { id: "Twilio", description: "Verify an owned number with an Account SID and production API key.", docs: "https://www.twilio.com/docs/phone-numbers/api/incomingphonenumber-resource" },
  { id: "Exotel", description: "Verify an ExoPhone with its account credentials and regional data center.", docs: "https://developer.exotel.com/docs/exophones/api-reference/list-numbers" },
  { id: "Vobiz", description: "Verify an owned number using your Vobiz Auth ID and Auth Token.", docs: "https://docs.vobiz.ai/account-phone-number/list-account-phone-numbers" },
];

const buttonClass =
  "app-button-text inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 transition disabled:cursor-not-allowed disabled:opacity-50";
const controlClass =
  "app-control-text min-h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#00b8c4] focus:ring-4 focus:ring-[#00b8c4]/10";

export function PhoneNumberModals({
  agents,
  assignmentNumber,
  busy,
  requestError,
  showBuy,
  showImport,
  onAssign,
  onCloseAgent,
  onCloseBuy,
  onCloseImport,
  onImport,
  onPurchase,
  onSearchInventory,
}: PhoneNumberModalsProps) {
  return (
    <>
      {showImport ? (
        <ImportNumberModal busy={busy} requestError={requestError} onClose={onCloseImport} onImport={onImport} />
      ) : null}

      {showBuy ? (
        <BuyNumberModal
          busy={busy}
          requestError={requestError}
          onClose={onCloseBuy}
          onPurchase={onPurchase}
          onSearchInventory={onSearchInventory}
        />
      ) : null}

      {assignmentNumber ? (
        <AgentModal
          agents={agents}
          busy={busy}
          number={assignmentNumber}
          requestError={requestError}
          onAssign={onAssign}
          onClose={onCloseAgent}
        />
      ) : null}
    </>
  );
}

function Icon({ icon, className = "size-4" }: { icon: IconName; className?: string }) {
  const props = {
    className: `${className} fill-none stroke-current stroke-2`,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };
  if (icon === "check") return <svg {...props}><path d="m5 12 4 4L19 6" /></svg>;
  if (icon === "close") return <svg {...props}><path d="m6 6 12 12M18 6 6 18" /></svg>;
  if (icon === "import") return <svg {...props}><path d="M12 3v12m0 0 4-4m-4 4-4-4" /><path d="M4 17v3h16v-3" /></svg>;
  if (icon === "link") return <svg {...props}><path d="m10 13 4-4" /><path d="M7.5 15.5 5 18a3.5 3.5 0 0 1-5-5l3-3a3.5 3.5 0 0 1 5 0" /><path d="m16.5 8.5 2.5-2.5a3.5 3.5 0 0 1 5 5l-3 3a3.5 3.5 0 0 1-5 0" /></svg>;
  if (icon === "plus") return <svg {...props}><path d="M12 5v14M5 12h14" /></svg>;
  if (icon === "search") return <svg {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
  if (icon === "unlink") return <svg {...props}><path d="m9 15-2 2a3.5 3.5 0 0 1-5-5l3-3" /><path d="m15 9 2-2a3.5 3.5 0 0 1 5 5l-3 3" /><path d="m3 3 18 18" /></svg>;
  return <svg {...props}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>;
}

function formatMoney(value: number | undefined, currency = "INR") {
  if (typeof value !== "number") return "Not listed";
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

function RequestError({ message, className = "" }: { message: string; className?: string }) {
  if (!message) return null;
  return (
    <div className={`rounded-lg border border-[#fecaca] bg-[#fff1f2] p-3 text-[#b91c1c] ${className}`} role="alert" aria-live="assertive">
      <p className="app-body m-0 text-current">{message}</p>
    </div>
  );
}

function ImportNumberModal({ busy, requestError, onClose, onImport }: {
  busy: boolean;
  requestError: string;
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
  const normalizedPhoneNumber = phoneNumber.trim();
  const normalizedApiKeySecret = apiKeySecret.trim();
  const normalizedExotelApiToken = exotelApiToken.trim();
  const normalizedAuthToken = authToken.trim();
  const validationReason = (() => {
    if (!normalizedPhoneNumber) return "Enter the phone number you own.";
    if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhoneNumber)) {
      return "Use E.164 format: + followed by the country code and 7 to 15 digits.";
    }
    if (provider === "Twilio") {
      if (!/^AC[0-9a-fA-F]{32}$/.test(accountSid.trim())) return "Enter a valid Twilio Account SID beginning with AC.";
      if (!/^SK[0-9a-fA-F]{32}$/.test(apiKeySid.trim())) return "Enter a valid Twilio API Key SID beginning with SK.";
      if (!normalizedApiKeySecret) return "Enter the Twilio API Key Secret.";
      return "";
    }
    if (provider === "Exotel") {
      if (!accountSid.trim()) return "Enter the Exotel Account SID.";
      if (!exotelApiKey.trim()) return "Enter the Exotel API Key.";
      if (!normalizedExotelApiToken) return "Enter the Exotel API Token.";
      return "";
    }
    if (!/^(MA|SA)_[A-Za-z0-9]+$/.test(authId.trim())) return "Enter a valid Vobiz Auth ID beginning with MA_ or SA_.";
    if (normalizedAuthToken.length < 20) return "Enter the Vobiz Auth Token (at least 20 characters).";
    return "";
  })();
  const valid = !validationReason;

  function submit() {
    const common = { phoneNumber: phoneNumber.trim(), label: label.trim(), direction: "Both" as const };
    if (provider === "Twilio") {
      onImport({
        ...common,
        provider,
        accountSid: accountSid.trim(),
        apiKeySid: apiKeySid.trim(),
        apiKeySecret: normalizedApiKeySecret,
        apiRegion,
      });
    } else if (provider === "Exotel") {
      onImport({
        ...common,
        provider,
        accountSid: accountSid.trim(),
        apiKey: exotelApiKey.trim(),
        apiToken: normalizedExotelApiToken,
        dataCenter,
      });
    } else {
      onImport({ ...common, provider, authId: authId.trim(), authToken: normalizedAuthToken });
    }
  }

  return (
    <ModalFrame busy={busy} title="Import phone number" subtitle="Add a number from your telephony provider." onClose={onClose}>
      <form
        className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto]"
        aria-busy={busy}
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
              disabled={busy}
              key={item.id}
              onClick={() => setProvider(item.id)}
              type="button"
              aria-pressed={provider === item.id}
            >
              <span className="app-strong">{item.id}</span>
              {provider === item.id ? <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#00b8c4]" /> : null}
            </button>
          ))}
        </div>

        <div className="grid gap-5 overflow-y-auto px-5 py-5 sm:px-6">
          <RequestError message={requestError} />
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
              disabled={busy}
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
                  <select className={controlClass} disabled={busy} value={apiRegion} onChange={(event) => setApiRegion(event.target.value as typeof apiRegion)}>
                    <option value="us1">US1 (default)</option>
                    <option value="au1">AU1 (Australia)</option>
                    <option value="ie1">IE1 (Ireland)</option>
                  </select>
                </label>
                <label className="app-label grid gap-2">
                  Account SID
                  <input className={controlClass} autoComplete="off" disabled={busy} placeholder="AC..." value={accountSid} onChange={(event) => setAccountSid(event.target.value)} />
                </label>
              </div>
              <label className="app-label grid gap-2">
                API Key SID
                <input className={controlClass} autoComplete="off" disabled={busy} placeholder="SK..." value={apiKeySid} onChange={(event) => setApiKeySid(event.target.value)} />
              </label>
              <label className="app-label grid gap-2">
                API Key Secret
                <input className={controlClass} autoComplete="new-password" disabled={busy} placeholder="Twilio API Key Secret" type="password" value={apiKeySecret} onChange={(event) => setApiKeySecret(event.target.value)} />
              </label>
            </div>
          ) : null}

          {provider === "Exotel" ? (
            <div className="grid gap-4 rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="app-label grid gap-2">
                  Exotel data center
                  <select className={controlClass} disabled={busy} value={dataCenter} onChange={(event) => setDataCenter(event.target.value as typeof dataCenter)}>
                    <option value="mumbai">Mumbai / India</option>
                    <option value="singapore">Singapore</option>
                  </select>
                </label>
                <label className="app-label grid gap-2">
                  Account SID
                  <input className={controlClass} autoComplete="off" disabled={busy} placeholder="Exotel Account SID" value={accountSid} onChange={(event) => setAccountSid(event.target.value)} />
                </label>
              </div>
              <label className="app-label grid gap-2">
                API Key
                <input className={controlClass} autoComplete="off" disabled={busy} placeholder="Exotel API Key" value={exotelApiKey} onChange={(event) => setExotelApiKey(event.target.value)} />
              </label>
              <label className="app-label grid gap-2">
                API Token
                <input className={controlClass} autoComplete="new-password" disabled={busy} placeholder="Exotel API Token" type="password" value={exotelApiToken} onChange={(event) => setExotelApiToken(event.target.value)} />
              </label>
            </div>
          ) : null}

          {provider === "Vobiz" ? (
            <div className="grid gap-4 rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4">
              <label className="app-label grid gap-2">
                Auth ID
                <input className={controlClass} autoComplete="off" disabled={busy} placeholder="MA_... or SA_..." value={authId} onChange={(event) => setAuthId(event.target.value)} />
              </label>
              <label className="app-label grid gap-2">
                Auth Token
                <input className={controlClass} autoComplete="new-password" disabled={busy} placeholder="Vobiz Auth Token" type="password" value={authToken} onChange={(event) => setAuthToken(event.target.value)} />
              </label>
            </div>
          ) : null}

          <label className="app-label grid gap-2">
            Label <span className="font-normal text-[#94a3b8]">(optional)</span>
            <input className={controlClass} disabled={busy} maxLength={120} placeholder="Support main line" value={label} onChange={(event) => setLabel(event.target.value)} />
          </label>

          <div className="flex items-start gap-3 rounded-lg border border-[#e5e7eb] bg-[#f8fafc] p-3">
            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#dcfce7] text-[#059669]"><Icon icon="check" className="size-3.5" /></span>
            <p className="app-caption m-0">
              {provider === "Vobiz"
                ? "Vobiz credentials are encrypted and retained because they are required to configure inbound SIP routing."
                : `${provider} credentials are used server-side to verify that the number belongs to your account and are not stored.`}
            </p>
          </div>

          {validationReason ? (
            <div className="rounded-lg border border-[#fde68a] bg-[#fffbeb] px-3 py-2.5 text-[#92400e]" id="phone-import-validation" role="status" aria-live="polite">
              <p className="app-caption m-0 text-current">{validationReason}</p>
            </div>
          ) : (
            <div className="rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2.5 text-[#166534]" id="phone-import-validation" role="status" aria-live="polite">
              <p className="app-caption m-0 text-current">Details are ready to verify with {provider}.</p>
            </div>
          )}
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-[#e5e7eb] px-5 py-4 sm:px-6">
          <button className={`${buttonClass} border border-[#d5d8df] bg-white text-[#334155] hover:bg-[#f8fafc]`} disabled={busy} onClick={onClose} type="button">Cancel</button>
          <button className={`${buttonClass} bg-[#00b8c4] text-white hover:bg-[#008996]`} aria-describedby="phone-import-validation" disabled={busy || !valid} type="submit">
            <Icon icon="import" /> {busy ? "Importing..." : "Import number"}
          </button>
        </footer>
      </form>
    </ModalFrame>
  );
}

function BuyNumberModal({ busy, requestError, onClose, onPurchase, onSearchInventory }: {
  busy: boolean;
  requestError: string;
  onClose: () => void;
  onPurchase: (number: VobizNumber, label: string) => void;
  onSearchInventory: (input: InventorySearchInput) => Promise<InventorySearchResult>;
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
    void onSearchInventory({ country: "IN" })
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
  }, [onSearchInventory]);

  async function searchInventory() {
    setSearching(true);
    setInventoryError("");
    setSelected(null);
    try {
      const result = await onSearchInventory({ country, search: query.trim() });
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
    <ModalFrame busy={busy} title="Buy phone number" subtitle="Purchase from your connected Vobiz account and add it to inventory." onClose={onClose} width="max-w-3xl">
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
                    aria-pressed={active}
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

function AgentModal({ agents, busy, number, requestError, onAssign, onClose }: {
  agents: AgentSummary[];
  busy: boolean;
  number: BackendPhoneNumber;
  requestError: string;
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
    <ModalFrame busy={busy} title="Link an agent" subtitle={`${number.number} / ${number.provider}`} onClose={onClose} width="max-w-xl">
      <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto]">
        <div className="grid gap-3 border-b border-[#e5e7eb] px-5 py-4 sm:px-6">
          <RequestError message={requestError} />
          <label className="relative block">
            <span className="absolute inset-y-0 left-3 grid place-items-center text-[#94a3b8]"><Icon icon="search" /></span>
            <input className={`${controlClass} pl-10`} disabled={busy} placeholder="Search agents" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
        </div>

        <div className="min-h-220px max-h-[min(430px,52vh)] overflow-y-auto p-2 sm:p-3">
          {filteredAgents.map((agent) => {
            const selected = selectedId === agent._id;
            return (
              <button
                className={`mb-1 flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${selected ? "border-[#99f6e8] bg-[#ecfeff]" : "border-transparent hover:bg-[#f8fafc]"}`}
                disabled={busy}
                key={agent._id}
                onClick={() => setSelectedId(agent._id)}
                type="button"
                aria-pressed={selected}
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

function ModalFrame({ busy = false, children, onClose, subtitle, title, width = "max-w-2xl" }: {
  busy?: boolean;
  children: ReactNode;
  onClose: () => void;
  subtitle: string;
  title: string;
  width?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#0f172a]/45 p-3 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-label={title} aria-busy={busy} onMouseDown={(event) => { if (!busy && event.target === event.currentTarget) onClose(); }}>
      <section className={`grid max-h-[calc(100vh-24px)] w-full ${width} grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-2xl border border-white/70 bg-white shadow-2xl`}>
        <header className="flex items-start justify-between gap-4 border-b border-[#e5e7eb] px-5 py-4 sm:px-6 sm:py-5">
          <div>
            <h2 className="app-page-title m-0">{title}</h2>
            <p className="app-caption mt-1 mb-0">{subtitle}</p>
          </div>
          <button className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#e5e7eb] bg-white text-[#64748b] transition hover:bg-[#f8fafc] hover:text-[#111827] disabled:cursor-wait disabled:opacity-50" disabled={busy} onClick={onClose} type="button" aria-label={busy ? "Please wait for the current request to finish" : "Close"}>
            <Icon icon="close" />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

function errorMessage(error: unknown) {
  return publicVoiceMessage(error, "The request could not be completed.");
}
