"use client";

import { useEffect, useRef, useState } from "react";
import type { WhatsAppConnectionStatus } from "@/lib/whatsapp";
import { whatsappApi } from "@/lib/whatsapp";

interface WhatsAppEmbeddedSignupModalProps {
  status: WhatsAppConnectionStatus | null;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export function WhatsAppEmbeddedSignupModal({
  status,
  onClose,
  onSuccess,
  onError,
}: WhatsAppEmbeddedSignupModalProps) {
  const isConnected = status?.connected ?? false;
  const metadata = status?.metadata || {};
  const accounts = status?.accounts && status.accounts.length > 0
    ? status.accounts
    : isConnected && status?.accountId
      ? [
          {
            accountId: status.accountId,
            phoneNumberId: metadata.phoneNumberId || status.accountId,
            wabaId: metadata.wabaId || "",
            displayPhoneNumber: metadata.displayPhoneNumber || status.accountId,
            verifiedName: metadata.verifiedName || "WhatsApp Business",
            qualityRating: metadata.qualityRating || "GREEN",
            codeVerificationStatus: metadata.codeVerificationStatus || "VERIFIED",
            label: metadata.label || "Primary Line",
            isPrimary: true,
          },
        ]
      : [];

  const [activeTab, setActiveTab] = useState<"embedded" | "manual" | "test">("embedded");
  const [showAddAnother, setShowAddAnother] = useState(!isConnected);
  const [busy, setBusy] = useState(false);
  const [, setSdkStatus] = useState<"loading" | "ready" | "error">("loading");

  const metaAppId = process.env.NEXT_PUBLIC_META_APP_ID?.trim();
  const metaConfigId = process.env.NEXT_PUBLIC_META_CONFIG_ID?.trim();
  const hasValidMetaIds = /^\d+$/.test(metaAppId ?? "") && /^\d+$/.test(metaConfigId ?? "");

  // Manual credentials state
  const [numberLabel, setNumberLabel] = useState("");
  const [manualPhoneId, setManualPhoneId] = useState("");
  const [manualWabaId, setManualWabaId] = useState("");
  const [manualAccessToken, setManualAccessToken] = useState("");
  const [twoStepPin, setTwoStepPin] = useState("");

  // Test message state
  const [selectedTestSenderId, setSelectedTestSenderId] = useState(
    accounts.find((a) => a.isPrimary)?.accountId || accounts[0]?.accountId || "",
  );
  const [testPhone, setTestPhone] = useState("");
  const [testText, setTestText] = useState(
    "✅ *Vozon AI WhatsApp Integration Live!*\n\nYour WhatsApp Cloud API account is connected and ready for inbound AI agents, broadcast campaigns, and automated flows.",
  );
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const sessionInfoRef = useRef<{
    waba_id?: string;
    phone_number_id?: string;
    business_id?: string;
  }>({});

  // Initialize FB SDK
  useEffect(() => {
    if (!hasValidMetaIds) {
      setSdkStatus("ready");
      return;
    }

    const initSdk = () => {
      if (!window.FB) {
        setSdkStatus("error");
        return;
      }
      window.FB.init({
        appId: metaAppId,
        autoLogAppEvents: true,
        xfbml: true,
        version: "v21.0",
      });
      setSdkStatus("ready");
    };

    window.fbAsyncInit = initSdk;
    let script = document.getElementById("facebook-jssdk") as HTMLScriptElement | null;
    if (window.FB) {
      initSdk();
    } else if (!script) {
      script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin !== "https://www.facebook.com" &&
        event.origin !== "https://web.facebook.com" &&
        event.origin !== window.location.origin
      ) {
        return;
      }

      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data.type === "WA_EMBEDDED_SIGNUP") {
          const info = data.data as {
            waba_id?: string;
            phone_number_id?: string;
            business_id?: string;
          };
          if (info) sessionInfoRef.current = info;
        }
      } catch {
        /* Ignore other messages */
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [metaAppId, hasValidMetaIds]);

  async function handleLaunchMetaSignup() {
    if (!hasValidMetaIds) {
      onError("Please configure META_APP_ID and META_CONFIG_ID in environment settings.");
      return;
    }
    if (!window.FB) {
      onError("Facebook SDK is not loaded. Please allow popups or use manual setup.");
      return;
    }

    sessionInfoRef.current = {};
    setBusy(true);

    try {
      window.FB.login(
        (response) => {
          if (response.authResponse?.code) {
            void processAuthCode(response.authResponse.code);
          } else {
            setBusy(false);
            const err = response.error_message || response.error_description || response.error;
            onError(err ? `Meta signup: ${err}` : "Signup was cancelled or did not return a code.");
          }
        },
        {
          config_id: metaConfigId,
          response_type: "code",
          override_default_response_type: true,
          extras: {
            setup: {},
            featureType: "whatsapp_business_app_onboarding",
            sessionInfoVersion: "3",
          },
        },
      );
    } catch (err) {
      setBusy(false);
      onError(err instanceof Error ? err.message : "Could not open Meta popup");
    }
  }

  async function processAuthCode(code: string) {
    try {
      const res = await whatsappApi.completeEmbeddedSignup({
        code,
        wabaId: sessionInfoRef.current.waba_id,
        phoneNumberId: sessionInfoRef.current.phone_number_id,
        businessId: sessionInfoRef.current.business_id,
        pin: twoStepPin.trim() || undefined,
        label: numberLabel.trim() || undefined,
      });
      onSuccess(res.message || "WhatsApp Business connected successfully!");
      onClose();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to complete signup with backend");
    } finally {
      setBusy(false);
    }
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!manualPhoneId.trim() || !manualWabaId.trim() || !manualAccessToken.trim()) {
      onError("Please provide Phone ID, WABA ID, and Permanent Access Token.");
      return;
    }

    setBusy(true);
    try {
      const res = await whatsappApi.completeEmbeddedSignup({
        phoneNumberId: manualPhoneId.trim(),
        wabaId: manualWabaId.trim(),
        accessToken: manualAccessToken.trim(),
        pin: twoStepPin.trim() || undefined,
        label: numberLabel.trim() || undefined,
      });
      onSuccess(res.message || "Credentials verified and connected!");
      onClose();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to connect credentials");
    } finally {
      setBusy(false);
    }
  }

  async function handleSetPrimary(phoneNumberId: string) {
    setBusy(true);
    try {
      await whatsappApi.updateAccount(phoneNumberId, { isPrimary: true });
      onSuccess("Primary WhatsApp number updated.");
      onClose();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Could not update primary number");
    } finally {
      setBusy(false);
    }
  }

  async function handleSendTest(e: React.FormEvent) {
    e.preventDefault();
    if (!testPhone.trim()) return;
    setBusy(true);
    setTestResult(null);
    try {
      const res = await whatsappApi.sendTestMessage(
        testPhone.trim(),
        testText.trim(),
        selectedTestSenderId || undefined,
      );
      setTestResult({ ok: true, msg: `Delivered! Meta Message ID: ${res.messageId || "simulated"}` });
    } catch (err) {
      setTestResult({ ok: false, msg: err instanceof Error ? err.message : "Test message delivery failed" });
    } finally {
      setBusy(false);
    }
  }

  async function handleDisconnect(phoneNumberId?: string, displayLabel?: string) {
    const confirmMsg = phoneNumberId
      ? `Disconnect WhatsApp number ${displayLabel || phoneNumberId}?`
      : "Disconnect all WhatsApp Business numbers from Vozon?";
    if (!window.confirm(confirmMsg)) return;
    setBusy(true);
    try {
      await whatsappApi.disconnect(phoneNumberId);
      onSuccess(phoneNumberId ? "WhatsApp number disconnected." : "WhatsApp disconnected.");
      onClose();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Disconnect failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[#dbe4e1] bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5e7ef] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-[#25D366] text-white grid place-items-center shadow-xs">
              <svg className="size-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#14231f]">Meta WhatsApp Numbers</h3>
              <span className="text-[10px] text-[#60716c]">
                Connect & manage one or multiple WhatsApp Business numbers
              </span>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-[#84938f] hover:bg-[#f4f7f6]">
            ✕
          </button>
        </div>

        {/* Status Strip */}
        <div className="my-4 flex items-center justify-between rounded-2xl border border-[#dbe4e1] bg-[#f9fbfa] p-3">
          <div className="flex items-center gap-2">
            <span className={`size-2.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
            <span className="text-xs font-bold text-[#14231f]">
              {isConnected
                ? `${accounts.length} WhatsApp ${accounts.length === 1 ? "Number" : "Numbers"} Connected`
                : "Not Connected / Setup Required"}
            </span>
          </div>
          {isConnected && (
            <button
              type="button"
              onClick={() => {
                setShowAddAnother(true);
                setActiveTab("embedded");
              }}
              className="rounded-lg bg-[#118778] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#0e7467]"
            >
              + Add Another Number
            </button>
          )}
        </div>

        {/* Connected Numbers List */}
        {isConnected && accounts.length > 0 && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#60716c]">
              <span>Connected WhatsApp Lines ({accounts.length})</span>
              <button
                type="button"
                onClick={() => setActiveTab("test")}
                className="font-semibold text-[#118778] hover:underline normal-case"
              >
                Send Test Message →
              </button>
            </div>
            <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
              {accounts.map((acc) => (
                <div
                  key={acc.accountId}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#cde0dc] bg-[#f4faf8] p-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#14231f]">{acc.displayPhoneNumber}</span>
                      <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-semibold text-[#315248] border border-[#dbe4e1]">
                        {acc.label || "WhatsApp Line"}
                      </span>
                      {acc.isPrimary && (
                        <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          Default
                        </span>
                      )}
                      <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                        {acc.qualityRating || "GREEN"}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#52645f]">
                      {acc.verifiedName || "Verified Business"} · Phone ID: <span className="font-mono">{acc.phoneNumberId}</span>
                      {acc.wabaId ? <> · WABA: <span className="font-mono">{acc.wabaId}</span></> : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!acc.isPrimary && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void handleSetPrimary(acc.accountId)}
                        className="rounded-lg border border-[#118778]/30 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#118778] hover:bg-[#eef8f5]"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleDisconnect(acc.accountId, acc.displayPhoneNumber)}
                      className="rounded-lg border border-rose-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Pills */}
        {(showAddAnother || !isConnected || activeTab === "test") && (
          <>
            <div className="mb-4 flex gap-1 rounded-xl bg-[#f0f4f3] p-1 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("embedded")}
                className={`flex-1 rounded-lg py-1.5 transition ${activeTab === "embedded" ? "bg-white text-[#118778] shadow-xs" : "text-[#52645f]"}`}
              >
                {isConnected ? "+ 1-Click Add Number" : "1-Click Meta Signup"}
              </button>
              <button
                onClick={() => setActiveTab("manual")}
                className={`flex-1 rounded-lg py-1.5 transition ${activeTab === "manual" ? "bg-white text-[#118778] shadow-xs" : "text-[#52645f]"}`}
              >
                {isConnected ? "+ Add by Token" : "Manual Tokens"}
              </button>
              {isConnected && (
                <button
                  onClick={() => setActiveTab("test")}
                  className={`flex-1 rounded-lg py-1.5 transition ${activeTab === "test" ? "bg-white text-[#118778] shadow-xs" : "text-[#52645f]"}`}
                >
                  Test Delivery
                </button>
              )}
            </div>

            {/* Tab 1: Embedded Signup (Add 1st or Additional Number) */}
            {activeTab === "embedded" && (
              <div className="space-y-3 text-center">
                <p className="text-xs text-[#60716c]">
                  {isConnected
                    ? "Connect an additional WhatsApp Business number to this workspace. Existing connected numbers will remain active."
                    : "Connect your Meta WhatsApp Business Account in seconds with official Meta Embedded Signup. We handle webhook subscriptions, permanent tokens, and phone registration automatically."}
                </p>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-2.5 text-left text-[11px] text-emerald-900 flex items-start gap-2">
                  <span className="text-emerald-600 text-xs mt-0.5 font-bold">✓</span>
                  <div>
                    <span className="font-bold">Multi-Number & Coexistence Supported:</span> Connect 2 or more WhatsApp numbers (e.g., Sales, Support, Clinic) and use them across Campaigns, Live Chat, AI Bots, and Workflows.
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-left">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#445550]">
                      Line Label <span className="text-[10px] font-normal text-[#60716c]">(e.g. Sales, Support)</span>
                    </label>
                    <input
                      type="text"
                      value={numberLabel}
                      onChange={(e) => setNumberLabel(e.target.value)}
                      placeholder="e.g. Sales WhatsApp"
                      className="w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] px-3.5 py-2 text-xs text-[#20342e] focus:border-[#118778] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#445550]">
                      Mobile 2-Step PIN <span className="text-[10px] font-normal text-[#60716c]">(Optional)</span>
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      value={twoStepPin}
                      onChange={(e) => setTwoStepPin(e.target.value.replace(/\D/g, ""))}
                      placeholder="6-digit PIN"
                      className="w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] px-3.5 py-2 text-xs font-mono text-[#20342e] focus:border-[#118778] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLaunchMetaSignup}
                  disabled={busy}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#1877F2] p-3 text-xs font-bold text-white shadow-md transition hover:bg-[#166fe5] disabled:opacity-50"
                >
                  <svg className="size-4 fill-white" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  {busy
                    ? "Opening Meta Secure Popup..."
                    : isConnected
                      ? "Connect Additional WhatsApp Number with Facebook"
                      : "Log in with Facebook / WhatsApp Embedded Signup"}
                </button>
              </div>
            )}

            {/* Tab 2: Manual Credentials */}
            {activeTab === "manual" && (
              <form onSubmit={handleManualSubmit} className="space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#445550]">
                      Line Label <span className="text-[10px] font-normal text-[#60716c]">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={numberLabel}
                      onChange={(e) => setNumberLabel(e.target.value)}
                      placeholder="e.g. Support Line 2"
                      className="mt-1 w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] px-3.5 py-2 text-xs text-[#20342e] focus:border-[#118778] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#445550]">Phone Number ID</label>
                    <input
                      type="text"
                      required
                      value={manualPhoneId}
                      onChange={(e) => setManualPhoneId(e.target.value)}
                      placeholder="e.g. 109823746592834"
                      className="mt-1 w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] px-3.5 py-2 text-xs text-[#20342e] focus:border-[#118778] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#445550]">WABA ID (WhatsApp Business Account)</label>
                  <input
                    type="text"
                    required
                    value={manualWabaId}
                    onChange={(e) => setManualWabaId(e.target.value)}
                    placeholder="e.g. 102938475610293"
                    className="mt-1 w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] px-3.5 py-2 text-xs text-[#20342e] focus:border-[#118778] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#445550]">System User Permanent Access Token</label>
                  <input
                    type="password"
                    required
                    value={manualAccessToken}
                    onChange={(e) => setManualAccessToken(e.target.value)}
                    placeholder="EAAG..."
                    className="mt-1 w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] px-3.5 py-2 text-xs text-[#20342e] focus:border-[#118778] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#445550]">
                    2-Step Verification PIN <span className="text-[10px] font-normal text-[#60716c]">(Optional)</span>
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={twoStepPin}
                    onChange={(e) => setTwoStepPin(e.target.value.replace(/\D/g, ""))}
                    placeholder="6-digit PIN (default 123456 if none)"
                    className="mt-1 w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] px-3.5 py-2 text-xs font-mono text-[#20342e] focus:border-[#118778] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 border-t border-[#e5e7ef] pt-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-[#dbe4e1] px-4 py-2 text-xs font-semibold text-[#52645f]"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={busy}
                    className="rounded-xl bg-[#118778] px-5 py-2 text-xs font-semibold text-white hover:bg-[#0e7467] disabled:opacity-50"
                  >
                    {busy ? "Verifying..." : isConnected ? "Add Number" : "Save Credentials"}
                  </button>
                </div>
              </form>
            )}

            {/* Tab 3: Test Delivery */}
            {activeTab === "test" && (
              <form onSubmit={handleSendTest} className="space-y-3">
                {accounts.length > 1 && (
                  <div>
                    <label className="block text-xs font-semibold text-[#445550]">
                      Send From WhatsApp Number
                    </label>
                    <select
                      value={selectedTestSenderId}
                      onChange={(e) => setSelectedTestSenderId(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] px-3.5 py-2 text-xs text-[#20342e] focus:border-[#118778] focus:bg-white focus:outline-none"
                    >
                      {accounts.map((acc) => (
                        <option key={acc.accountId} value={acc.accountId}>
                          {acc.displayPhoneNumber} — {acc.label || acc.verifiedName} {acc.isPrimary ? "(Default)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#445550]">
                    Recipient Phone Number (with Country Code)
                  </label>
                  <input
                    type="tel"
                    required
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="e.g. 919876543210"
                    className="mt-1 w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] px-3.5 py-2 text-xs text-[#20342e] focus:border-[#118778] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#445550]">Message Content</label>
                  <textarea
                    rows={3}
                    value={testText}
                    onChange={(e) => setTestText(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] p-3 text-xs text-[#20342e] focus:border-[#118778] focus:bg-white focus:outline-none"
                  />
                </div>

                {testResult && (
                  <div className={`rounded-xl p-3 text-xs ${testResult.ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
                    {testResult.msg}
                  </div>
                )}

                <div className="flex justify-end gap-2 border-t border-[#e5e7ef] pt-3">
                  <button
                    type="submit"
                    disabled={busy}
                    className="rounded-xl bg-[#118778] px-5 py-2 text-xs font-semibold text-white hover:bg-[#0e7467] disabled:opacity-50"
                  >
                    {busy ? "Sending..." : "Send Test WhatsApp Message"}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

