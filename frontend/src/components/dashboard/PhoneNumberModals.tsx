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
  { id: "Plivo", description: "Verify an owned number with your Plivo Auth ID and Auth Token via Zentrunk SIP trunking.", docs: "https://www.plivo.com/docs/sip-trunking/api/overview/" },
  { id: "Exotel", description: "Verify an ExoPhone with its account credentials and regional data center.", docs: "https://developer.exotel.com/docs/exophones/api-reference/list-numbers" },
  { id: "Vobiz", description: "Verify an owned number using your Vobiz Auth ID and Auth Token.", docs: "https://docs.vobiz.ai/account-phone-number/list-account-phone-numbers" },
  { id: "SIP", description: "Connect any carrier or PBX (Tata, Airtel, Telnyx, Twilio, Asterisk, FreePBX, etc.) via Custom SIP Trunking (BYOC).", docs: "" },
];

const buttonClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";
const controlClass =
  "min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-[#171717] outline-none transition placeholder:text-[#a1a1aa] focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/10";

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
  const [trunkSid, setTrunkSid] = useState("");
  const [apiRegion, setApiRegion] = useState<"us1" | "au1" | "ie1">("us1");
  const [exotelApiKey, setExotelApiKey] = useState("");
  const [exotelApiToken, setExotelApiToken] = useState("");
  const [dataCenter, setDataCenter] = useState<"mumbai" | "singapore">("mumbai");
  const [authId, setAuthId] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [vobizSipUsername, setVobizSipUsername] = useState("");
  const [vobizSipPassword, setVobizSipPassword] = useState("");
  const [plivoAuthId, setPlivoAuthId] = useState("");
  const [plivoAuthToken, setPlivoAuthToken] = useState("");
  const [plivoTrunkId, setPlivoTrunkId] = useState("");
  const [direction, setDirection] = useState<"Both" | "Inbound" | "Outbound">("Both");
  const [sipTerminationUri, setSipTerminationUri] = useState("");
  const [sipUsername, setSipUsername] = useState("");
  const [sipPassword, setSipPassword] = useState("");
  const [sipTransport, setSipTransport] = useState<"auto" | "udp" | "tcp" | "tls">("auto");
  const normalizedPhoneNumber = phoneNumber.trim();
  const normalizedApiKeySecret = apiKeySecret.trim();
  const normalizedExotelApiToken = exotelApiToken.trim();
  const normalizedAuthToken = authToken.trim();
  const normalizedPlivoAuthToken = plivoAuthToken.trim();
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
    if (provider === "Plivo") {
      if (!plivoAuthId.trim()) return "Enter the Plivo Auth ID.";
      if (!normalizedPlivoAuthToken) return "Enter the Plivo Auth Token.";
      return "";
    }
    if (provider === "Exotel") {
      if (!accountSid.trim()) return "Enter the Exotel Account SID.";
      if (!exotelApiKey.trim()) return "Enter the Exotel API Key.";
      if (!normalizedExotelApiToken) return "Enter the Exotel API Token.";
      return "";
    }
    if (provider === "SIP") {
      if (direction !== "Inbound") {
        if (!sipTerminationUri.trim()) return "Enter the outbound SIP termination host or URI (e.g. sip.carrier.com).";
      }
      return "";
    }
    if (!/^(MA|SA)_[A-Za-z0-9]+$/.test(authId.trim())) return "Enter a valid Vobiz Auth ID beginning with MA_ or SA_.";
    if (normalizedAuthToken.length < 20) return "Enter the Vobiz Auth Token (at least 20 characters).";
    if (!vobizSipUsername.trim() || !vobizSipPassword.trim()) return "Enter the SIP username and password attached to your Vobiz outbound trunk.";
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
        trunkSid: trunkSid.trim() || undefined,
      });
    } else if (provider === "Plivo") {
      onImport({
        ...common,
        provider,
        authId: plivoAuthId.trim(),
        authToken: normalizedPlivoAuthToken,
        trunkId: plivoTrunkId.trim() || undefined,
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
    } else if (provider === "SIP") {
      onImport({
        phoneNumber: phoneNumber.trim(),
        label: label.trim(),
        provider: "SIP",
        direction,
        terminationUri: sipTerminationUri.trim() || undefined,
        authUsername: sipUsername.trim() || undefined,
        authPassword: sipPassword.trim() || undefined,
        transport: sipTransport,
      });
    } else {
      onImport({ ...common, provider, authId: authId.trim(), authToken: normalizedAuthToken, sipUsername: vobizSipUsername.trim(), sipPassword: vobizSipPassword.trim() });
    }
  }

  return (
    <ModalFrame busy={busy} title="Import phone number" subtitle="Connect a number you already own." width="max-w-3xl" onClose={onClose}>
      <form
        className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto]"
        aria-busy={busy}
        onSubmit={(event) => {
          event.preventDefault();
          if (!valid) return;
          submit();
        }}
      >
        <div className="grid gap-5 overflow-y-auto px-5 py-5 sm:px-6">
          <RequestError message={requestError} />

          <section className="grid gap-3">
            <div><span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Step 1</span><h3 className="text-base font-semibold text-slate-900 dark:text-white mt-0.5 mb-0">Choose provider</h3></div>
            <div className="grid grid-cols-2 gap-1 rounded-xl border border-blue-200 bg-blue-50 p-1 dark:border-blue-950 dark:bg-blue-950/30 sm:grid-cols-5">
              {providers.map((item) => (
                <button
                  className={`min-h-10 rounded-lg px-2 text-center text-xs transition outline-none focus:outline-none focus:ring-0 ${
                    provider === item.id
                      ? "border border-blue-600 bg-blue-600 font-semibold text-white shadow-sm dark:border-blue-500 dark:bg-blue-500"
                      : "border border-transparent text-zinc-600 hover:bg-blue-100 hover:text-blue-800 dark:text-zinc-400 dark:hover:bg-blue-950/60 dark:hover:text-blue-200"
                  }`}
                  disabled={busy}
                  key={item.id}
                  onClick={() => setProvider(item.id)}
                  type="button"
                  aria-pressed={provider === item.id}
                >
                  <span className="font-semibold">{item.id === "SIP" ? "Custom SIP" : item.id}</span>
                </button>
              ))}
            </div>
          </section>

          <div className="rounded-lg border border-blue-200 bg-blue-50/70 px-3.5 py-2.5 dark:border-blue-950 dark:bg-blue-950/20">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-slate-600 dark:text-zinc-300">{providers.find((item) => item.id === provider)?.description}</span>
              {providers.find((item) => item.id === provider)?.docs ? (<a className="text-xs font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200" href={providers.find((item) => item.id === provider)?.docs} rel="noreferrer" target="_blank">Provider docs</a>) : null}
            </div>
          </div>

          <section className="grid gap-3">
            <div><span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Step 2</span><h3 className="text-base font-semibold text-slate-900 dark:text-white mt-0.5 mb-0">Number details</h3></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 grid gap-2">
                Phone number
                <input className={controlClass} disabled={busy} inputMode="tel" placeholder="+919876543210" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} />
                <span className="text-[11px] font-normal text-slate-400 dark:text-zinc-500">Use E.164 format with country code.</span>
              </label>
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 grid content-start gap-2">
                <span>Label <span className="font-normal text-slate-400 dark:text-zinc-500">(optional)</span></span>
                <input className={controlClass} disabled={busy} maxLength={120} placeholder="Support main line" value={label} onChange={(event) => setLabel(event.target.value)} />
              </label>
            </div>
          </section>

          <div><span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Step 3</span><h3 className="text-base font-semibold text-slate-900 dark:text-white mt-0.5 mb-0">Provider credentials</h3><p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 mb-0">Used securely to verify ownership of this number.</p></div>

          {provider === "Twilio" ? (
            <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/90">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 grid gap-2">
                  Twilio API region
                  <select className={controlClass} disabled={busy} value={apiRegion} onChange={(event) => setApiRegion(event.target.value as typeof apiRegion)}>
                    <option value="us1">US1 (default)</option>
                    <option value="au1">AU1 (Australia)</option>
                    <option value="ie1">IE1 (Ireland)</option>
                  </select>
                </label>
                <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 grid gap-2">
                  Account SID
                  <input className={controlClass} autoComplete="off" disabled={busy} placeholder="AC..." value={accountSid} onChange={(event) => setAccountSid(event.target.value)} />
                </label>
              </div>
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 grid gap-2">
                API Key SID
                <input className={controlClass} autoComplete="off" disabled={busy} placeholder="SK..." value={apiKeySid} onChange={(event) => setApiKeySid(event.target.value)} />
              </label>
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 grid gap-2">
                API Key Secret
                <input className={controlClass} autoComplete="new-password" disabled={busy} placeholder="Twilio API Key Secret" type="password" value={apiKeySecret} onChange={(event) => setApiKeySecret(event.target.value)} />
              </label>
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 grid gap-2">
                <span>Twilio SIP Trunk SID <span className="font-normal text-slate-400 dark:text-zinc-500">(optional)</span></span>
                <input className={controlClass} autoComplete="off" disabled={busy} placeholder="TK... (optional Elastic SIP Trunk)" value={trunkSid} onChange={(event) => setTrunkSid(event.target.value)} />
                <span className="text-[11px] font-normal text-slate-400 dark:text-zinc-500">If provided, the number maps directly to your Twilio Elastic SIP Trunk. Otherwise, automatic TwiML SIP forwarding is configured.</span>
              </label>
            </div>
          ) : null}

          {provider === "Plivo" ? (
            <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/90">
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 grid gap-2">
                Plivo Auth ID
                <input className={controlClass} autoComplete="off" disabled={busy} placeholder="MA... or SA..." value={plivoAuthId} onChange={(event) => setPlivoAuthId(event.target.value)} />
              </label>
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 grid gap-2">
                Plivo Auth Token
                <input className={controlClass} autoComplete="new-password" disabled={busy} placeholder="Plivo Auth Token" type="password" value={plivoAuthToken} onChange={(event) => setPlivoAuthToken(event.target.value)} />
              </label>
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 grid gap-2">
                <span>Plivo Zentrunk Inbound Trunk ID <span className="font-normal text-slate-400 dark:text-zinc-500">(optional)</span></span>
                <input className={controlClass} autoComplete="off" disabled={busy} placeholder="Zentrunk Inbound Trunk ID" value={plivoTrunkId} onChange={(event) => setPlivoTrunkId(event.target.value)} />
                <span className="text-[11px] font-normal text-slate-400 dark:text-zinc-500">If provided, your number maps directly to your Plivo Zentrunk inbound SIP trunk. Otherwise, automatic XML SIP forwarding is configured.</span>
              </label>
            </div>
          ) : null}

          {provider === "Exotel" ? (
            <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/90">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 grid gap-2">
                  Exotel data center
                  <select className={controlClass} disabled={busy} value={dataCenter} onChange={(event) => setDataCenter(event.target.value as typeof dataCenter)}>
                    <option value="mumbai">Mumbai / India</option>
                    <option value="singapore">Singapore</option>
                  </select>
                </label>
                <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 grid gap-2">
                  Account SID
                  <input className={controlClass} autoComplete="off" disabled={busy} placeholder="Exotel Account SID" value={accountSid} onChange={(event) => setAccountSid(event.target.value)} />
                </label>
              </div>
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 grid gap-2">
                API Key
                <input className={controlClass} autoComplete="off" disabled={busy} placeholder="Exotel API Key" value={exotelApiKey} onChange={(event) => setExotelApiKey(event.target.value)} />
              </label>
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 grid gap-2">
                API Token
                <input className={controlClass} autoComplete="new-password" disabled={busy} placeholder="Exotel API Token" type="password" value={exotelApiToken} onChange={(event) => setExotelApiToken(event.target.value)} />
              </label>
            </div>
          ) : null}

          {provider === "Vobiz" ? (
            <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/90">
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 grid gap-2">
                Auth ID
                <input className={controlClass} autoComplete="off" disabled={busy} placeholder="MA_... or SA_..." value={authId} onChange={(event) => setAuthId(event.target.value)} />
              </label>
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 grid gap-2">
                Auth Token
                <input className={controlClass} autoComplete="new-password" disabled={busy} placeholder="Vobiz Auth Token" type="password" value={authToken} onChange={(event) => setAuthToken(event.target.value)} />
              </label>
              <p className="m-0 text-xs text-slate-600 dark:text-zinc-400">Outbound calls need the separate SIP credential attached to your Vobiz outbound trunk.</p>
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 grid gap-2">
                SIP username
                <input className={controlClass} autoComplete="off" disabled={busy} value={vobizSipUsername} onChange={(event) => setVobizSipUsername(event.target.value)} />
              </label>
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 grid gap-2">
                SIP password
                <input className={controlClass} autoComplete="new-password" disabled={busy} type="password" value={vobizSipPassword} onChange={(event) => setVobizSipPassword(event.target.value)} />
              </label>
            </div>
          ) : null}

          {provider === "SIP" ? (
            <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/90">
              <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 grid gap-2">
                Trunk direction
                <select
                  className={controlClass}
                  disabled={busy}
                  value={direction}
                  onChange={(event) => setDirection(event.target.value as typeof direction)}
                >
                  <option value="Both">Both (Inbound &amp; Outbound)</option>
                  <option value="Inbound">Inbound only (Receive calls via SIP forwarding)</option>
                  <option value="Outbound">Outbound only (AI calls out through carrier)</option>
                </select>
                <span className="text-[11px] font-normal text-slate-400 dark:text-zinc-500">
                  Choose whether this number handles incoming calls, outbound campaigns/calls, or both.
                </span>
              </label>

              {direction !== "Outbound" ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700 dark:border-zinc-800 dark:bg-zinc-800/70 dark:text-zinc-200">
                  <strong className="block font-semibold text-slate-900 dark:text-white">Inbound SIP Forwarding</strong>
                  <p className="mt-1 mb-2 text-slate-600 dark:text-zinc-300">
                    Point your carrier or PBX inbound forwarding to our SIP URI:
                  </p>
                  <code className="block rounded bg-white px-2.5 py-1.5 font-mono text-xs text-black dark:bg-zinc-900 dark:text-white border border-slate-300 dark:border-zinc-700 select-all">
                    sip:{phoneNumber.trim() || "+<your-number>"}@sip.vozon.ai:5060
                  </code>
                </div>
              ) : null}

              {direction !== "Inbound" ? (
                <>
                  <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 grid gap-2">
                    Outbound SIP termination host / IP
                    <input
                      className={controlClass}
                      autoComplete="off"
                      disabled={busy}
                      placeholder="e.g. sip.telnyx.com or 198.51.100.1:5060"
                      value={sipTerminationUri}
                      onChange={(event) => setSipTerminationUri(event.target.value)}
                    />
                    <span className="text-[11px] font-normal text-slate-400 dark:text-zinc-500">
                      The SIP server host where our system routes outbound calls to reach your carrier.
                    </span>
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 grid gap-2">
                      <span>SIP auth username <span className="font-normal text-slate-400 dark:text-zinc-500">(optional)</span></span>
                      <input
                        className={controlClass}
                        autoComplete="off"
                        disabled={busy}
                        placeholder="Username for digest auth"
                        value={sipUsername}
                        onChange={(event) => setSipUsername(event.target.value)}
                      />
                    </label>
                    <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 grid gap-2">
                      <span>SIP auth password <span className="font-normal text-slate-400 dark:text-zinc-500">(optional)</span></span>
                      <input
                        className={controlClass}
                        autoComplete="new-password"
                        disabled={busy}
                        placeholder="Password for digest auth"
                        type="password"
                        value={sipPassword}
                        onChange={(event) => setSipPassword(event.target.value)}
                      />
                    </label>
                  </div>

                  <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 grid gap-2">
                    SIP transport protocol
                    <select
                      className={controlClass}
                      disabled={busy}
                      value={sipTransport}
                      onChange={(event) => setSipTransport(event.target.value as typeof sipTransport)}
                    >
                      <option value="auto">Auto (Recommended)</option>
                      <option value="udp">UDP (Standard SIP)</option>
                      <option value="tcp">TCP</option>
                      <option value="tls">TLS (Secure SIP)</option>
                    </select>
                  </label>
                </>
              ) : null}
            </div>
          ) : null}

          <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/90">
            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"><Icon icon="check" className="size-3.5" /></span>
            <p className="text-xs text-slate-600 dark:text-zinc-300 m-0">
              {provider === "Vobiz"
                ? "Vobiz credentials are encrypted and retained because they are required to configure inbound SIP routing."
                : `${provider} credentials are used server-side to verify that the number belongs to your account and configure SIP trunk routing.`}
            </p>
          </div>

          {validationReason ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-amber-900 dark:border-amber-800/40 dark:bg-amber-950/30 dark:text-amber-300" id="phone-import-validation" role="status" aria-live="polite">
              <p className="text-xs m-0 text-current">{validationReason}</p>
            </div>
          ) : (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-300" id="phone-import-validation" role="status" aria-live="polite">
              <p className="text-xs m-0 text-current">Details are ready to verify with {provider}.</p>
            </div>
          )}
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50/50 px-5 py-4 sm:px-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <button className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700" disabled={busy} onClick={onClose} type="button">Cancel</button>
          <button className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-400 disabled:opacity-50 shadow-sm" aria-describedby="phone-import-validation" disabled={busy || !valid} type="submit">
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
          className="grid gap-3 border-b border-slate-200 dark:border-zinc-800 px-5 py-4 sm:grid-cols-[150px_minmax(0,1fr)_auto] sm:px-6"
          onSubmit={(event) => { event.preventDefault(); void searchInventory(); }}
        >
          <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 grid gap-2">
            Country
            <select className={controlClass} value={country} onChange={(event) => setCountry(event.target.value)}>
              <option value="IN">India</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
            </select>
          </label>
          <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 grid gap-2">
            Area code or digits <span className="font-normal text-slate-400 dark:text-zinc-500">(optional)</span>
            <input className={controlClass} inputMode="tel" placeholder="For example 80 or 650" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <button className="inline-flex h-11 items-center justify-center gap-1.5 self-end rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-400 shadow-sm" disabled={searching || busy} type="submit">
            <Icon icon="search" /> {searching ? "Searching..." : "Search"}
          </button>
        </form>

        <div className="min-h-280px max-h-[min(460px,52vh)] overflow-y-auto px-5 py-4 sm:px-6">
          {inventoryError ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
              <p className="text-xs font-semibold m-0">{inventoryError}</p>
              <p className="text-xs mt-1 mb-0 text-rose-700 dark:text-rose-400">Connect Vobiz by importing an owned Vobiz number first, then search again.</p>
            </div>
          ) : null}
          {requestError ? <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">{requestError}</div> : null}
          {searching ? (
            <div className="grid min-h-240px place-items-center"><span className="text-xs text-slate-500 dark:text-zinc-400">Loading available numbers...</span></div>
          ) : numbers.length ? (
            <div className="grid gap-2">
              {numbers.map((number) => {
                const active = selected?.id === number.id;
                const voiceAvailable = number.voice_enabled !== false && number.capabilities?.voice !== false;
                return (
                  <button
                    className={`grid w-full gap-3 rounded-xl border p-3 text-left transition sm:grid-cols-[minmax(0,1fr)_145px_145px_auto] sm:items-center ${
                      active
                        ? "border-blue-600 bg-blue-50 ring-2 ring-blue-500/15 dark:border-blue-500 dark:bg-blue-950/30 dark:ring-blue-500/20"
                        : "border-slate-200 bg-white hover:border-blue-400 dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-blue-500"
                    }`}
                    disabled={!voiceAvailable || busy}
                    key={number.id || number.e164}
                    onClick={() => setSelected(number)}
                    type="button"
                    aria-pressed={active}
                  >
                    <span>
                      <strong className="block text-sm font-semibold text-slate-900 dark:text-white">{number.e164}</strong>
                      <span className="block text-xs text-slate-500 dark:text-zinc-400">{[number.region, number.country].filter(Boolean).join(", ") || "Global"}</span>
                    </span>
                    <span><span className="block text-[11px] text-slate-400 dark:text-zinc-500">Setup</span><strong className="text-xs font-semibold text-slate-800 dark:text-zinc-200">{formatMoney(number.setup_fee, number.currency)}</strong></span>
                    <span><span className="block text-[11px] text-slate-400 dark:text-zinc-500">Monthly</span><strong className="text-xs font-semibold text-slate-800 dark:text-zinc-200">{formatMoney(number.monthly_fee, number.currency)}</strong></span>
                    <span className={`justify-self-start rounded-full px-2.5 py-1 text-[11px] font-medium sm:justify-self-end ${voiceAvailable ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40" : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>{voiceAvailable ? (active ? "Selected" : "Available") : "No voice"}</span>
                  </button>
                );
              })}
            </div>
          ) : searched && !inventoryError ? (
            <div className="grid min-h-240px place-items-center text-center">
              <div><Icon icon="search" className="mx-auto mb-3 size-6 text-slate-400 dark:text-zinc-500" /><p className="text-xs text-slate-600 dark:text-zinc-400 m-0">No available numbers matched this search.</p></div>
            </div>
          ) : null}
        </div>

        <footer className="flex flex-wrap items-end justify-between gap-3 border-t border-slate-200 px-5 py-4 sm:px-6 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
          <label className="grid min-w-[240px] flex-1 gap-2 text-xs font-medium text-slate-700 dark:text-zinc-300 sm:max-w-sm">
            Label <span className="font-normal text-slate-400 dark:text-zinc-500">(optional)</span>
            <input className={controlClass} maxLength={120} placeholder="Sales main line" value={label} onChange={(event) => setLabel(event.target.value)} />
          </label>
          <div className="flex gap-2">
            <button className={`${buttonClass} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700`} disabled={busy} onClick={onClose} type="button">Cancel</button>
            <button className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-400 shadow-sm`} disabled={busy || !selected} onClick={() => { if (selected) onPurchase(selected, label); }} type="button">
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
        <div className="grid gap-3 border-b border-slate-200 dark:border-zinc-800 px-5 py-4 sm:px-6">
          <RequestError message={requestError} />
          <label className="relative block">
            <span className="absolute inset-y-0 left-3 grid place-items-center text-slate-400 dark:text-zinc-500"><Icon icon="search" /></span>
            <input className={`${controlClass} pl-10`} disabled={busy} placeholder="Search agents" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
        </div>

        <div className="min-h-220px max-h-[min(430px,52vh)] overflow-y-auto p-2 sm:p-3">
          {filteredAgents.map((agent) => {
            const selected = selectedId === agent._id;
            return (
              <button
                className={`mb-1 flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                  selected
                  ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/30"
                    : "border-transparent hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                }`}
                disabled={busy}
                key={agent._id}
                onClick={() => setSelectedId(agent._id)}
                type="button"
                aria-pressed={selected}
              >
                <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${selected ? "bg-blue-600 text-white dark:bg-blue-500" : "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300"}`}><Icon icon="user" /></span>
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-sm font-semibold text-slate-900 dark:text-white">{agent.name}</strong>
                  <span className="block truncate text-xs text-slate-500 dark:text-zinc-400">{agent.team || "Voice agent"}</span>
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${agent.status === "Live" ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40" : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>{agent.status}</span>
                <span className={`grid size-5 place-items-center rounded-full border ${selected ? "border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500" : "border-slate-300 dark:border-zinc-700"}`}>{selected ? <Icon icon="check" className="size-3" /> : null}</span>
              </button>
            );
          })}
          {!filteredAgents.length ? <p className="m-0 p-8 text-center text-xs text-slate-500 dark:text-zinc-400">No agents found.</p> : null}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 sm:px-6 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
          <div>
            {number.agentId ? (
              <button className={`${buttonClass} border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:bg-zinc-900 dark:text-rose-400 dark:hover:bg-rose-950/30`} disabled={busy} onClick={() => onAssign(null)} type="button">
                <Icon icon="unlink" /> Unlink agent
              </button>
            ) : <span className="text-xs text-slate-500 dark:text-zinc-400">Select one agent for this number.</span>}
          </div>
          <div className="flex gap-2">
            <button className={`${buttonClass} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700`} disabled={busy} onClick={onClose} type="button">Cancel</button>
            <button className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-400 shadow-sm`} disabled={busy || !selectedId} onClick={() => onAssign(selectedId)} type="button">
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
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-3 backdrop-blur-md sm:p-5" role="dialog" aria-modal="true" aria-label={title} aria-busy={busy} onMouseDown={(event) => { if (!busy && event.target === event.currentTarget) onClose(); }}>
      <section className={`grid max-h-[calc(100dvh-2rem)] w-full ${width} grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-2xl`}>
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur-sm sm:px-6 sm:py-5 dark:border-zinc-800 dark:bg-zinc-900/95">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white m-0">{title}</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 mb-0">{subtitle}</p>
          </div>
          <button className="grid size-9 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-blue-500 dark:hover:bg-blue-950/30 dark:hover:text-blue-300 disabled:cursor-wait disabled:opacity-50" disabled={busy} onClick={onClose} type="button" aria-label={busy ? "Please wait for the current request to finish" : "Close"}>
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
