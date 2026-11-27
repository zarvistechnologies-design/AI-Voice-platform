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
            coexistence: Boolean(metadata.coexistence),
          },
        ]
      : [];

  const [activeTab, setActiveTab] = useState<"embedded" | "manual" | "test">("embedded");
  const [showAddAnother, setShowAddAnother] = useState(!isConnected);
  const [useCoexistence, setUseCoexistence] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sdkStatus, setSdkStatus] = useState<"loading" | "ready" | "error">("loading");

  const metaAppId = process.env.NEXT_PUBLIC_META_APP_ID?.trim();
  const metaConfigId = process.env.NEXT_PUBLIC_META_CONFIG_ID?.trim();
  const hasValidMetaIds = /^\d+$/.test(metaAppId ?? "") && /^\d+$/.test(metaConfigId ?? "");
  const canUseMetaSdk = typeof window === "undefined" ||
    window.location.protocol === "https:" ||
    ["localhost", "127.0.0.1"].includes(window.location.hostname);

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
    event?: string;
    isCoexistence?: boolean;
  }>({});

  // Initialize FB SDK
  useEffect(() => {
    if (!hasValidMetaIds || !canUseMetaSdk) {
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
        version: "v22.0",
      });
      setSdkStatus("ready");
    };

    window.fbAsyncInit = initSdk;
    let script = document.getElementById("facebook-jssdk") as HTMLScriptElement | null;
    const handleSdkError = () => setSdkStatus("error");
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
    script?.addEventListener("error", handleSdkError);

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
        if (data?.type === "WA_EMBEDDED_SIGNUP") {
          const signupEvent = typeof data.event === "string" ? data.event : "";
          if (signupEvent === "CANCEL" || signupEvent === "ERROR") {
            return;
          }
          const info = data.data as {
            waba_id?: string;
            phone_number_id?: string;
            business_id?: string;
          } | undefined;
          if (info) {
            sessionInfoRef.current = {
              ...info,
              event: signupEvent || undefined,
              isCoexistence: signupEvent === "FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING",
            };
          }
        }
      } catch {
        /* Ignore other messages */
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      script?.removeEventListener("error", handleSdkError);
      window.removeEventListener("message", handleMessage);
    };
  }, [metaAppId, hasValidMetaIds, canUseMetaSdk]);

  async function handleLaunchMetaSignup() {
    if (!hasValidMetaIds) {
      onError("Please configure NEXT_PUBLIC_META_APP_ID and NEXT_PUBLIC_META_CONFIG_ID in the frontend environment.");
      return;
    }
    if (!canUseMetaSdk || sdkStatus !== "ready" || !window.FB) {
      onError("Facebook SDK is not ready. Use HTTPS (or localhost) and allow popups, or use Manual Tokens.");
      return;
    }

    sessionInfoRef.current = {};
    setBusy(true);

    const extras: Record<string, unknown> = {
      setup: {},
      sessionInfoVersion: "3",
    };
    if (useCoexistence) {
      extras.featureType = "whatsapp_business_app_onboarding";
    }

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
          extras,
        },
      );
    } catch (err) {
      setBusy(false);
      onError(err instanceof Error ? err.message : "Could not open Meta popup");
    }
  }

  async function processAuthCode(code: string) {
    try {
      const detectedCoexistence = sessionInfoRef.current.isCoexistence ?? useCoexistence;
      const res = await whatsappApi.completeEmbeddedSignup({
        code,
        wabaId: sessionInfoRef.current.waba_id,
        phoneNumberId: sessionInfoRef.current.phone_number_id,
        businessId: sessionInfoRef.current.business_id,
        pin: detectedCoexistence ? undefined : twoStepPin.trim() || undefined,
        label: numberLabel.trim() || undefined,
        isCoexistence: detectedCoexistence,
        signupEvent: sessionInfoRef.current.event,
      });
      onSuccess(res.message || "WhatsApp Business connected successfully!");
      onClose();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to complete signup with backend");
    } finally {
      setBusy(false);
    }
  }

  async function handleCoexistenceSync(phoneNumberId: string) {
    setBusy(true);
    try {
      const res = await whatsappApi.syncCoexistence(phoneNumberId);
      if (res.ok) {
        onSuccess("Coexistence contact & 180-day chat history sync requested from Meta. Chats will arrive shortly via webhook.");
      } else {
        onError(res.errors?.join("; ") || "Coexistence sync request was rejected by Meta (available within 24h of onboarding).");
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : "Coexistence sync failed");
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
      setTestResult({ ok: true, msg: `Delivered via Meta Cloud API (${res.messageId || "confirmed"}).` });
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
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-[#eaeaea] bg-white p-5 shadow-xl">
        {/* Clean Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#eaeaea] pb-3.5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="m-0 text-[15px] font-semibold text-[#171717]">WhatsApp Numbers</h3>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#eaeaea] bg-[#fafafa] px-2 py-0.5 text-[11px] font-medium text-[#171717]">
                <span className={`size-1.5 rounded-full ${isConnected ? "bg-emerald-600" : "bg-amber-500"}`} />
                {isConnected ? `${accounts.length} Connected` : "Setup Required"}
              </span>
            </div>
            <p className="m-0 mt-0.5 text-[12px] text-[#71717a]">
              Connect and manage one or more Meta WhatsApp Business lines.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-[#71717a] hover:text-[#171717]"
          >
            ✕
          </button>
        </div>

        {/* Connected Lines List */}
        {isConnected && accounts.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#71717a]">
                Connected Lines ({accounts.length})
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("test")}
                  className="text-[11.5px] font-medium text-[#52525b] hover:text-[#171717] hover:underline"
                >
                  Test Delivery
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddAnother((prev) => !prev);
                    setActiveTab("embedded");
                  }}
                  className="text-[11.5px] font-medium text-[#2563eb] hover:text-[#1d4ed8] hover:underline"
                >
                  {showAddAnother ? "Hide Add Form" : "+ Add Number"}
                </button>
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto rounded-md border border-[#eaeaea] bg-white divide-y divide-[#eaeaea]">
              {accounts.map((acc) => (
                <div
                  key={acc.accountId}
                  className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 text-[12px]"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-mono font-semibold text-[#171717]">
                        {acc.displayPhoneNumber}
                      </span>
                      <span className="rounded border border-[#eaeaea] bg-[#fafafa] px-1.5 py-0.2 text-[10.5px] text-[#52525b]">
                        {acc.label || "WhatsApp Line"}
                      </span>
                      {acc.isPrimary && (
                        <span className="rounded border border-[#bfdbfe] bg-[#eff6ff] px-1.5 py-0.2 text-[10px] font-semibold text-[#1d4ed8]">
                          Default
                        </span>
                      )}
                      {acc.coexistence && (
                        <span className="rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-700">
                          Coexistence
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-[10.5px] text-[#71717a]">
                        <span className="size-1.5 rounded-full bg-emerald-600" />
                        {acc.qualityRating || "GREEN"}
                      </span>
                    </div>
                    <div className="truncate text-[11px] text-[#71717a]">
                      {acc.verifiedName || "Verified Business"} · ID{" "}
                      <span className="font-mono">{acc.phoneNumberId}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {acc.coexistence && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void handleCoexistenceSync(acc.accountId)}
                        title="Sync mobile app contacts & 180-day chat history (within 24h of onboarding)"
                        className="inline-flex h-7 items-center rounded-md border border-emerald-200 bg-emerald-50 px-2 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100"
                      >
                        Sync History
                      </button>
                    )}
                    {!acc.isPrimary && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void handleSetPrimary(acc.accountId)}
                        className="inline-flex h-7 items-center rounded-md border border-[#bfdbfe] bg-[#eff6ff] px-2 text-[11px] font-medium text-[#1d4ed8] hover:bg-[#dbeafe]"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleDisconnect(acc.accountId, acc.displayPhoneNumber)}
                      className="inline-flex h-7 items-center rounded-md border border-[#eaeaea] bg-white px-2 text-[11px] font-medium text-rose-700 hover:bg-rose-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Setup / Add / Test Tabs */}
        {(showAddAnother || !isConnected || activeTab === "test") && (
          <div className="mt-4">
            <div className="flex gap-1 rounded-md border border-[#eaeaea] bg-[#fafafa] p-0.5 text-[12px] font-medium">
              <button
                type="button"
                onClick={() => setActiveTab("embedded")}
                className={`flex-1 rounded py-1.5 transition ${
                  activeTab === "embedded"
                    ? "bg-white text-[#171717] shadow-2xs"
                    : "text-[#71717a] hover:text-[#171717]"
                }`}
              >
                {isConnected ? "Add via Meta" : "1-Click Meta Signup"}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("manual")}
                className={`flex-1 rounded py-1.5 transition ${
                  activeTab === "manual"
                    ? "bg-white text-[#171717] shadow-2xs"
                    : "text-[#71717a] hover:text-[#171717]"
                }`}
              >
                Manual Tokens
              </button>
              {isConnected && (
                <button
                  type="button"
                  onClick={() => setActiveTab("test")}
                  className={`flex-1 rounded py-1.5 transition ${
                    activeTab === "test"
                      ? "bg-white text-[#171717] shadow-2xs"
                      : "text-[#71717a] hover:text-[#171717]"
                  }`}
                >
                  Test Delivery
                </button>
              )}
            </div>

            {/* Tab 1: Embedded Signup */}
            {activeTab === "embedded" && (
              <div className="mt-4 space-y-4">
                <div className="rounded-md border border-[#eaeaea] bg-[#fafafa] p-3.5 text-[12px] text-[#52525b] space-y-1.5">
                  <div className="font-medium text-[#171717]">
                    {isConnected
                      ? "Add another WhatsApp Business line"
                      : "Official Meta Embedded Signup"}
                  </div>
                  <p className="m-0 text-[12px] leading-relaxed text-[#71717a]">
                    Automatically configures webhook subscriptions, permanent access tokens, and phone registration.
                    Supports multiple numbers (e.g. Sales, Support) with coexistence across Campaigns, Live Chat, and Workflows.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 rounded-md border border-[#eaeaea] bg-[#fafafa] p-3 text-[12px]">
                  <input
                    id="embeddedCoexistenceToggle"
                    type="checkbox"
                    checked={useCoexistence}
                    onChange={(e) => setUseCoexistence(e.target.checked)}
                    className="mt-0.5 size-4 rounded border-[#d4d4d8] accent-[#2563eb] cursor-pointer"
                  />
                  <label htmlFor="embeddedCoexistenceToggle" className="cursor-pointer space-y-0.5 select-none">
                    <span className="block font-medium text-[#171717]">
                      WhatsApp Business App Coexistence
                    </span>
                    <span className="block text-[11.5px] leading-relaxed text-[#71717a]">
                      Keep using the WhatsApp Business mobile app on your phone alongside Vozon Cloud API and sync mobile replies &amp; chat history. Leave unchecked for standard Cloud API signup.
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[12px] font-medium text-[#171717]">
                      Line Label <span className="font-normal text-[#71717a]">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={numberLabel}
                      onChange={(e) => setNumberLabel(e.target.value)}
                      placeholder="e.g. Sales WhatsApp"
                      className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[13px] text-[#171717] placeholder:text-[#71717a] focus:border-[#171717] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#171717]">
                      2-Step PIN <span className="font-normal text-[#71717a]">({useCoexistence ? "Managed by Mobile App" : "Optional"})</span>
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      disabled={useCoexistence}
                      value={twoStepPin}
                      onChange={(e) => setTwoStepPin(e.target.value.replace(/\D/g, ""))}
                      placeholder={useCoexistence ? "Not used in Coexistence" : "6-digit PIN"}
                      className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 font-mono text-[13px] text-[#171717] placeholder:text-[#71717a] focus:border-[#171717] focus:outline-none disabled:bg-[#f4f4f5] disabled:text-[#a1a1aa]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-[#eaeaea] pt-3.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex h-9 items-center rounded-md border border-[#eaeaea] bg-white px-3.5 text-[12.5px] font-medium text-[#52525b] hover:bg-[#f4f4f5]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleLaunchMetaSignup()}
                    disabled={busy}
                    className="inline-flex h-9 items-center gap-2 rounded-md bg-[#2563eb] px-4 text-[12.5px] font-medium text-white transition hover:bg-[#1d4ed8] disabled:opacity-50"
                  >
                    <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>
                      {busy
                        ? "Opening Meta..."
                        : isConnected
                          ? "Add Number via Meta"
                          : "Continue with Meta"}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Manual Credentials */}
            {activeTab === "manual" && (
              <form onSubmit={handleManualSubmit} className="mt-4 space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[12px] font-medium text-[#171717]">
                      Line Label <span className="font-normal text-[#71717a]">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={numberLabel}
                      onChange={(e) => setNumberLabel(e.target.value)}
                      placeholder="e.g. Support Line"
                      className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[13px] text-[#171717] focus:border-[#171717] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#171717]">Phone Number ID</label>
                    <input
                      type="text"
                      required
                      value={manualPhoneId}
                      onChange={(e) => setManualPhoneId(e.target.value)}
                      placeholder="109823746592834"
                      className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 font-mono text-[12.5px] text-[#171717] focus:border-[#171717] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#171717]">
                    WhatsApp Business Account (WABA) ID
                  </label>
                  <input
                    type="text"
                    required
                    value={manualWabaId}
                    onChange={(e) => setManualWabaId(e.target.value)}
                    placeholder="102938475610293"
                    className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 font-mono text-[12.5px] text-[#171717] focus:border-[#171717] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#171717]">
                    Permanent System User Access Token
                  </label>
                  <input
                    type="password"
                    required
                    value={manualAccessToken}
                    onChange={(e) => setManualAccessToken(e.target.value)}
                    placeholder="EAAG..."
                    className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 font-mono text-[12.5px] text-[#171717] focus:border-[#171717] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#171717]">
                    2-Step Verification PIN <span className="font-normal text-[#71717a]">(Optional)</span>
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={twoStepPin}
                    onChange={(e) => setTwoStepPin(e.target.value.replace(/\D/g, ""))}
                    placeholder="6-digit PIN"
                    className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 font-mono text-[12.5px] text-[#171717] focus:border-[#171717] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 border-t border-[#eaeaea] pt-3.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex h-8 items-center rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] font-medium text-[#52525b] hover:bg-[#f4f4f5]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex h-8 items-center rounded-md bg-[#2563eb] px-3.5 text-[12.5px] font-medium text-white hover:bg-[#1d4ed8] disabled:opacity-50"
                  >
                    {busy ? "Verifying..." : isConnected ? "Add Number" : "Save & Connect"}
                  </button>
                </div>
              </form>
            )}

            {/* Tab 3: Test Delivery */}
            {activeTab === "test" && (
              <form onSubmit={handleSendTest} className="mt-4 space-y-3">
                {accounts.length > 1 && (
                  <div>
                    <label className="block text-[12px] font-medium text-[#171717]">Send From Number</label>
                    <select
                      value={selectedTestSenderId}
                      onChange={(e) => setSelectedTestSenderId(e.target.value)}
                      className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-2.5 text-[13px] text-[#171717] focus:border-[#171717] focus:outline-none"
                    >
                      {accounts.map((acc) => (
                        <option key={acc.accountId} value={acc.accountId}>
                          {acc.displayPhoneNumber} — {acc.label || acc.verifiedName}{" "}
                          {acc.isPrimary ? "(Default)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-[12px] font-medium text-[#171717]">
                    Recipient Phone Number (with country code)
                  </label>
                  <input
                    type="tel"
                    required
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="e.g. +919876543210"
                    className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[13px] text-[#171717] focus:border-[#171717] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#171717]">Message</label>
                  <textarea
                    rows={3}
                    value={testText}
                    onChange={(e) => setTestText(e.target.value)}
                    className="mt-1 w-full rounded-md border border-[#eaeaea] bg-white p-2.5 text-[12.5px] text-[#171717] focus:border-[#171717] focus:outline-none"
                  />
                </div>

                {testResult && (
                  <div
                    className={`rounded-md border px-3 py-2 text-[12px] ${
                      testResult.ok
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-rose-200 bg-rose-50 text-rose-800"
                    }`}
                  >
                    {testResult.msg}
                  </div>
                )}

                <div className="flex justify-end gap-2 border-t border-[#eaeaea] pt-3.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex h-8 items-center rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] font-medium text-[#52525b] hover:bg-[#f4f4f5]"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex h-8 items-center rounded-md bg-[#2563eb] px-3.5 text-[12.5px] font-medium text-white hover:bg-[#1d4ed8] disabled:opacity-50"
                  >
                    {busy ? "Sending..." : "Send Test"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
