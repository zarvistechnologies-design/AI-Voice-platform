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

  const [activeTab, setActiveTab] = useState<"embedded" | "manual" | "test">("embedded");
  const [busy, setBusy] = useState(false);
  const [sdkStatus, setSdkStatus] = useState<"loading" | "ready" | "error">("loading");

  const metaAppId = process.env.NEXT_PUBLIC_META_APP_ID?.trim();
  const metaConfigId = process.env.NEXT_PUBLIC_META_CONFIG_ID?.trim();
  const hasValidMetaIds = /^\d+$/.test(metaAppId ?? "") && /^\d+$/.test(metaConfigId ?? "");

  // Manual credentials state
  const [manualPhoneId, setManualPhoneId] = useState("");
  const [manualWabaId, setManualWabaId] = useState("");
  const [manualAccessToken, setManualAccessToken] = useState("");
  const [twoStepPin, setTwoStepPin] = useState("");

  // Test message state
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
      });
      onSuccess(res.message || "Credentials verified and connected!");
      onClose();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to connect credentials");
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
      const res = await whatsappApi.sendTestMessage(testPhone.trim(), testText.trim());
      setTestResult({ ok: true, msg: `Delivered! Meta Message ID: ${res.messageId || "simulated"}` });
    } catch (err) {
      setTestResult({ ok: false, msg: err instanceof Error ? err.message : "Test message delivery failed" });
    } finally {
      setBusy(false);
    }
  }

  async function handleDisconnect() {
    if (!window.confirm("Disconnect your WhatsApp Business account from Vozon?")) return;
    setBusy(true);
    try {
      await whatsappApi.disconnect();
      onSuccess("WhatsApp disconnected.");
      onClose();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Disconnect failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-3xl border border-[#dbe4e1] bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5e7ef] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-[#25D366] text-white grid place-items-center shadow-xs">
              <svg className="size-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#14231f]">Meta WhatsApp Connection</h3>
              <span className="text-[10px] text-[#60716c]">
                Official Meta WhatsApp Cloud API & Embedded Signup
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
              {isConnected ? "Connected & Registered" : "Not Connected / Setup Required"}
            </span>
          </div>
          {isConnected && (
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              Quality: {metadata.qualityRating || "GREEN / HIGH"}
            </span>
          )}
        </div>

        {/* Tab Pills */}
        <div className="mb-4 flex gap-1 rounded-xl bg-[#f0f4f3] p-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("embedded")}
            className={`flex-1 rounded-lg py-1.5 transition ${activeTab === "embedded" ? "bg-white text-[#118778] shadow-xs" : "text-[#52645f]"}`}
          >
            1-Click Meta Signup
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex-1 rounded-lg py-1.5 transition ${activeTab === "manual" ? "bg-white text-[#118778] shadow-xs" : "text-[#52645f]"}`}
          >
            Manual Tokens
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

        {/* Tab 1: Embedded Signup */}
        {activeTab === "embedded" && (
          <div className="space-y-4">
            {isConnected ? (
              <div className="rounded-2xl border border-[#cde0dc] bg-[#f4faf8] p-4 text-xs space-y-2">
                <div className="font-bold text-[#118778]">Connected Account Details:</div>
                <div className="grid grid-cols-2 gap-2 text-[#445550]">
                  <div>Display Number: <span className="font-mono font-bold text-[#14231f]">{metadata.displayPhoneNumber || status?.accountId}</span></div>
                  <div>Verified Name: <span className="font-bold text-[#14231f]">{metadata.verifiedName || "Vozon AI Business"}</span></div>
                  <div>WABA ID: <span className="font-mono">{metadata.wabaId || "Managed"}</span></div>
                  <div>Phone ID: <span className="font-mono">{metadata.phoneNumberId || status?.accountId}</span></div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#cde0dc] flex justify-between items-center">
                  <button
                    onClick={handleDisconnect}
                    disabled={busy}
                    className="text-xs font-semibold text-rose-600 hover:underline"
                  >
                    Disconnect WhatsApp
                  </button>
                  <button
                    onClick={() => setActiveTab("test")}
                    className="rounded-xl bg-[#118778] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#0e7467]"
                  >
                    Send Test Message →
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <p className="text-xs text-[#60716c]">
                  Connect your Meta WhatsApp Business Account in seconds with official Meta Embedded Signup. We handle webhook subscriptions, permanent tokens, and phone registration automatically.
                </p>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-2.5 text-left text-[11px] text-emerald-900 flex items-start gap-2">
                  <span className="text-emerald-600 text-xs mt-0.5 font-bold">✓</span>
                  <div>
                    <span className="font-bold">Coexistence Supported:</span> You can use the same phone number on both your mobile WhatsApp Business phone app and the Vozon Cloud API simultaneously. No need to delete your mobile app.
                  </div>
                </div>

                <div className="text-left space-y-1">
                  <label className="block text-xs font-semibold text-[#445550]">
                    Existing Mobile 2-Step PIN <span className="text-[10px] font-normal text-[#60716c]">(Optional for Coexistence)</span>
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={twoStepPin}
                    onChange={(e) => setTwoStepPin(e.target.value.replace(/\D/g, ""))}
                    placeholder="6-digit PIN (if active on mobile WhatsApp Business app)"
                    className="w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] px-3.5 py-2 text-xs font-mono text-[#20342e] focus:border-[#118778] focus:bg-white focus:outline-none"
                  />
                  <p className="text-[10px] text-[#71827e]">
                    If your number is active on WhatsApp Business mobile app with 2-step verification, enter the 6 digits to keep mobile access without interruption.
                  </p>
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
                  {busy ? "Opening Meta Secure Popup..." : "Log in with Facebook / WhatsApp Embedded Signup"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Manual Credentials */}
        {activeTab === "manual" && (
          <form onSubmit={handleManualSubmit} className="space-y-3">
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
                {busy ? "Verifying..." : "Save Credentials"}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Test Delivery */}
        {activeTab === "test" && (
          <form onSubmit={handleSendTest} className="space-y-3">
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
      </div>
    </div>
  );
}

