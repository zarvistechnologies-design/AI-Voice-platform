"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { integrationsApi, type IntegrationProvider } from "@/lib/integrations";

declare global {
  interface Window {
    FB?: {
      init: (options: Record<string, unknown>) => void;
      login: (
        callback: (response: {
          authResponse?: { code?: string; accessToken?: string };
          status?: string;
        }) => void,
        options?: Record<string, unknown>,
      ) => void;
    };
    fbAsyncInit?: () => void;
  }
}

interface WhatsAppModalProps {
  integration: IntegrationProvider | undefined;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function WhatsAppModal({
  integration,
  onClose,
  onSuccess,
  onError,
}: WhatsAppModalProps) {
  const isConnected = integration?.connected ?? false;
  const metadata = (integration?.metadata ?? {}) as Record<string, unknown>;

  const [busy, setBusy] = useState(false);
  const [connectMode, setConnectMode] = useState<"popup" | "manual">("popup");
  const [useCoexistence, setUseCoexistence] = useState(true);

  // Manual / Sandbox credentials state
  const [manualPhoneId, setManualPhoneId] = useState("");
  const [manualWabaId, setManualWabaId] = useState("");
  const [manualAccessToken, setManualAccessToken] = useState("");

  const [sessionInfo, setSessionInfo] = useState<{
    waba_id?: string;
    phone_number_id?: string;
  }>({
    waba_id: (metadata.wabaId as string) || undefined,
    phone_number_id: (metadata.phoneNumberId as string) || undefined,
  });

  const sessionInfoRef = useRef<{
    waba_id?: string;
    phone_number_id?: string;
  }>({
    waba_id: (metadata.wabaId as string) || undefined,
    phone_number_id: (metadata.phoneNumberId as string) || undefined,
  });

  // Test message state
  const [recipientPhone, setRecipientPhone] = useState("");
  const [testMessage, setTestMessage] = useState(
    "✅ *Appointment Confirmed - Vozon Health*\n\nHello! Your appointment is confirmed for tomorrow at 11:30 AM with Dr. Saroya.\n📍 Location: City Branch\n\nPlease arrive 10 minutes prior.",
  );
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    messageId?: string;
    error?: string;
  } | null>(null);

  // Initialize Facebook SDK or listen for OAuth messages
  useEffect(() => {
    const appId = process.env.NEXT_PUBLIC_META_APP_ID || "28018370021167662";
    const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
    const isLocalhost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    const canLoadSdk = isHttps || isLocalhost;

    if (canLoadSdk && !document.getElementById("facebook-jssdk")) {
      window.fbAsyncInit = function () {
        window.FB?.init({
          appId,
          autoLogAppEvents: true,
          xfbml: true,
          version: "v21.0",
        });
      };

      const script = document.createElement("script");
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
          const info = data.data as { waba_id?: string; phone_number_id?: string };
          if (info) {
            setSessionInfo(info);
            sessionInfoRef.current = info;
          }
        } else if (data.type === "WA_EMBEDDED_SIGNUP_CODE" && data.code) {
          void handleProcessCode(data.code);
        }
      } catch {
        // Non-JSON message from other extensions, ignore safely
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleProcessCode = async (code: string) => {
    const wabaId = sessionInfoRef.current.waba_id || sessionInfo.waba_id || manualWabaId.trim();
    const phoneNumberId =
      sessionInfoRef.current.phone_number_id || sessionInfo.phone_number_id || manualPhoneId.trim();

    try {
      setBusy(true);
      const res = await integrationsApi.completeWhatsAppEmbeddedSignup({
        code,
        wabaId: wabaId || undefined,
        phoneNumberId: phoneNumberId || undefined,
      });
      onSuccess(res.message || "WhatsApp Business connected successfully!");
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to connect WhatsApp account.");
    } finally {
      setBusy(false);
    }
  };

  // Launch Meta Embedded Signup Popup
  const handleLaunchSignup = () => {
    const appId = process.env.NEXT_PUBLIC_META_APP_ID || "28018370021167662";
    const configId = process.env.NEXT_PUBLIC_META_CONFIG_ID || "28702795139354514";

    setBusy(true);

    const extras: Record<string, unknown> = {
      sessionInfoVersion: "3",
    };
    if (useCoexistence) {
      extras.featureType = "whatsapp_business_app_onboarding";
    }

    // If FB SDK is available, use FB.login with sessionInfoVersion and coexistence
    if (window.FB) {
      window.FB.login(
        function (response) {
          void (async () => {
            if (response.authResponse?.code) {
              await handleProcessCode(response.authResponse.code);
            } else {
              setBusy(false);
            }
          })();
        },
        {
          config_id: configId,
          response_type: "code",
          override_default_response_type: true,
          extras,
        },
      );
      return;
    }

    // Direct Meta OAuth popup for non-SDK or custom redirect environments
    const redirectUri = `${window.location.origin}/dashboard/integrations`;
    const oauthUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&config_id=${configId}&response_type=code`;

    const popup = window.open(
      oauthUrl,
      "WhatsAppEmbeddedSignup",
      "width=640,height=760,scrollbars=yes,status=yes",
    );

    if (!popup) {
      setBusy(false);
      onError("Popup was blocked by your browser. Please allow popups for this site.");
      return;
    }

    setBusy(false);
  };

  // Direct manual connect for developer testing / sandbox credentials
  const handleManualConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualPhoneId.trim() || !manualWabaId.trim() || !manualAccessToken.trim()) {
      onError("Please fill in Phone Number ID, WABA ID, and Access Token.");
      return;
    }

    setBusy(true);
    try {
      const res = await integrationsApi.completeWhatsAppEmbeddedSignup({
        wabaId: manualWabaId.trim(),
        phoneNumberId: manualPhoneId.trim(),
        accessToken: manualAccessToken.trim(),
      });
      onSuccess(res.message || "WhatsApp connected successfully!");
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to connect credentials.");
    } finally {
      setBusy(false);
    }
  };

  // Send a test WhatsApp message to phone
  const handleSendTestMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientPhone.trim()) {
      onError("Please enter a recipient phone number.");
      return;
    }

    setBusy(true);
    setTestResult(null);

    try {
      const res = await integrationsApi.sendWhatsAppTestMessage(
        recipientPhone.trim(),
        testMessage.trim(),
      );
      setTestResult({ ok: true, messageId: res.messageId });
      onSuccess(`Test message sent successfully to ${res.sentTo}!`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send test message.";
      setTestResult({ ok: false, error: message });
      onError(message);
    } finally {
      setBusy(false);
    }
  };

  // Disconnect integration
  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect WhatsApp?")) return;
    setBusy(true);
    try {
      await integrationsApi.disconnectWhatsApp();
      onSuccess("WhatsApp disconnected.");
      onClose();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to disconnect.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/35 p-4 backdrop-blur-[6px]">
      <div className="w-full max-w-xl rounded-2xl border border-[#dfe7e4] bg-white p-6 shadow-[0_28px_80px_rgba(34,38,74,0.24)] text-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#dfe7e4]">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#edf7f4] border border-[#b8c8c3] p-2.5 shadow-xs">
              <Image
                src="/images/integrations/whatsapp.svg"
                alt="WhatsApp logo"
                width={32}
                height={32}
                className="h-7 w-7 object-contain"
              />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0e6f62]">
                  Messaging
                </span>
                {isConnected ? (
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase">
                    Connected
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-600 uppercase">
                    Available
                  </span>
                )}
              </div>
              <h2 className="mt-0.5 text-xl font-semibold text-slate-950">
                WhatsApp Business Platform
              </h2>
            </div>
          </div>
          <button
            className="rounded-lg px-2.5 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            type="button"
            disabled={busy}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-5 space-y-5">
          {!isConnected ? (
            /* Disconnected State - Choice between Meta Popup or Developer Token */
            <div className="space-y-4">
              {/* Tab Selector */}
              <div className="flex border-b border-[#dfe7e4] gap-6 text-sm font-medium">
                <button
                  type="button"
                  onClick={() => setConnectMode("popup")}
                  className={`pb-2.5 transition -mb-px cursor-pointer ${
                    connectMode === "popup"
                      ? "text-[#118778] border-b-2 border-[#118778] font-semibold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Meta Embedded Popup
                </button>
                <button
                  type="button"
                  onClick={() => setConnectMode("manual")}
                  className={`pb-2.5 transition -mb-px cursor-pointer ${
                    connectMode === "manual"
                      ? "text-[#118778] border-b-2 border-[#118778] font-semibold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Developer Token (Test Number)
                </button>
              </div>

              {connectMode === "popup" ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-[#dfe7e4] bg-[#edf7f4]/70 p-4 space-y-2 text-xs leading-5 text-slate-700">
                    <strong className="block text-sm font-semibold text-[#123d35]">
                      Automated WhatsApp Messaging for Vozon Voice Agents
                    </strong>
                    <p className="text-slate-600">
                      Connect your WhatsApp Business number to send automated appointment slips,
                      clinic directions, doctor consultation reminders, and post-call notifications
                      directly to patient phones.
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-semibold text-[#0e6f62]">
                      <span>✓ Zero middleman markup</span>
                      <span>✓ Official Meta Cloud API</span>
                      <span>✓ Instant appointment slips</span>
                    </div>
                  </div>

                  {/* Coexistence Option */}
                  <div className="flex items-start gap-3 rounded-xl border border-[#dfe7e4] bg-[#f7f9f8] p-3.5 text-xs text-slate-700 transition hover:bg-[#edf7f4]/40">
                    <input
                      type="checkbox"
                      id="coexistenceToggle"
                      checked={useCoexistence}
                      onChange={(e) => setUseCoexistence(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#118778] accent-[#118778] focus:ring-[#118778] cursor-pointer"
                    />
                    <label htmlFor="coexistenceToggle" className="cursor-pointer space-y-0.5 select-none">
                      <strong className="block font-semibold text-slate-900 flex items-center gap-1.5">
                        <span>📲</span> WhatsApp Business App Coexistence
                      </strong>
                      <span className="text-slate-600 block text-[11px] leading-relaxed">
                        Keep using your existing WhatsApp Business mobile app on your phone for daily chats, while Vozon uses Cloud API simultaneously for voice call follow-ups.
                      </span>
                    </label>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleLaunchSignup()}
                      className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-semibold text-white bg-[#118778] hover:bg-[#0e6f62] shadow-sm transition disabled:opacity-50 text-sm cursor-pointer"
                    >
                      {busy ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Connecting with Meta...
                        </span>
                      ) : (
                        <>
                          <Image
                            src="/images/integrations/whatsapp.svg"
                            alt="WhatsApp logo"
                            width={20}
                            height={20}
                            className="h-5 w-5 object-contain"
                          />
                          <span>Connect WhatsApp with Meta</span>
                        </>
                      )}
                    </button>
                    <p className="mt-2 text-center text-xs text-slate-500">
                      Opens Meta&apos;s official Embedded Signup dialog to register your number.
                    </p>
                  </div>
                </div>
              ) : (
                /* Developer / Sandbox Direct Connect */
                <form onSubmit={handleManualConnect} className="space-y-3 text-xs">
                  <div className="rounded-xl border border-[#b8c8c3] bg-[#edf7f4] p-3 text-[#123d35]">
                    💡 <strong>Developer / Sandbox Testing</strong>: Enter your test credentials from
                    Meta Developer Console (<em>WhatsApp &gt; Basic setup &gt; Step 1. Try it out</em>).
                  </div>

                  <label className="grid gap-1.5 font-semibold text-slate-700">
                    Phone Number ID
                    <input
                      type="text"
                      placeholder="e.g. 523674827493021"
                      value={manualPhoneId}
                      onChange={(e) => setManualPhoneId(e.target.value)}
                      required
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:border-[#118778] focus:outline-none"
                    />
                  </label>

                  <label className="grid gap-1.5 font-semibold text-slate-700">
                    WhatsApp Business Account ID (WABA ID)
                    <input
                      type="text"
                      placeholder="e.g. 102938475610293"
                      value={manualWabaId}
                      onChange={(e) => setManualWabaId(e.target.value)}
                      required
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:border-[#118778] focus:outline-none"
                    />
                  </label>

                  <label className="grid gap-1.5 font-semibold text-slate-700">
                    Meta Access Token
                    <input
                      type="password"
                      placeholder="EAAG..."
                      value={manualAccessToken}
                      onChange={(e) => setManualAccessToken(e.target.value)}
                      required
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:border-[#118778] focus:outline-none"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={busy}
                    className="mt-2 w-full rounded-xl bg-[#118778] py-2.5 px-4 text-sm font-semibold text-white hover:bg-[#0e6f62] shadow-sm transition disabled:opacity-50 cursor-pointer"
                  >
                    {busy ? "Verifying..." : "Connect Credentials"}
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Connected State - Management & Test Message */
            <div className="space-y-4">
              {/* Account Details */}
              <div className="rounded-xl border border-[#dfe7e4] bg-[#f7f9f8] p-4 text-xs leading-5 text-slate-700 space-y-2">
                <div className="flex items-center justify-between border-b border-[#dfe7e4] pb-2">
                  <strong className="text-sm font-semibold text-slate-900">
                    Connected Account Information
                  </strong>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase">
                    Active WABA
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Phone Number ID</span>
                    <span className="font-mono text-slate-900 text-xs font-semibold">
                      {String(metadata.phoneNumberId || integration?.accountId || "—")}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">WABA ID</span>
                    <span className="font-mono text-slate-900 text-xs font-semibold">
                      {String(metadata.wabaId || "—")}
                    </span>
                  </div>
                  {metadata.displayPhoneNumber ? (
                    <div>
                      <span className="text-slate-500 block text-[11px]">Display Number</span>
                      <span className="text-[#0e6f62] font-semibold text-xs">
                        {String(metadata.displayPhoneNumber)}
                      </span>
                    </div>
                  ) : null}
                  {metadata.verifiedName ? (
                    <div>
                      <span className="text-slate-500 block text-[11px]">Verified Name</span>
                      <span className="text-slate-900 font-medium text-xs">
                        {String(metadata.verifiedName)}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Test Message Form (For Meta App Review Video!) */}
              <form
                onSubmit={handleSendTestMessage}
                className="rounded-xl border border-[#b8c8c3] bg-[#edf7f4] p-4 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-semibold text-[#123d35] flex items-center gap-1.5">
                    <span>⚡</span> Send Test Message (App Review Demo)
                  </strong>
                  <span className="rounded-full bg-emerald-100 border border-emerald-300 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
                    Ready
                  </span>
                </div>
                <p className="text-slate-600">
                  Send a real WhatsApp appointment confirmation slip to verify your integration and
                  record the demo video for Meta App Review.
                </p>

                <label className="grid gap-1.5 font-semibold text-slate-700">
                  Recipient Phone Number (with Country Code)
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    required
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:border-[#118778] focus:outline-none"
                  />
                </label>

                <label className="grid gap-1.5 font-semibold text-slate-700">
                  Message Body
                  <textarea
                    rows={3}
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#118778] focus:outline-none"
                  />
                </label>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-xl bg-[#118778] py-2.5 px-4 text-sm font-semibold text-white hover:bg-[#0e6f62] shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  {busy ? "Sending Message..." : "Send Test Message Now"}
                </button>

                {testResult?.ok && (
                  <div className="rounded-xl border border-emerald-300 bg-emerald-100/80 p-3 text-xs text-emerald-900 flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <div>
                      <strong className="block">Message Dispatched Successfully!</strong>
                      <span className="font-mono text-[11px] text-emerald-800">
                        Message ID: {testResult.messageId}
                      </span>
                    </div>
                  </div>
                )}

                {testResult?.error && (
                  <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800">
                    {testResult.error}
                  </div>
                )}
              </form>

              {/* Disconnect Button */}
              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleDisconnect}
                  className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                >
                  Disconnect WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#dfe7e4] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#dfe7e4] px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
