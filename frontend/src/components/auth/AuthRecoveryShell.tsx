"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { accountApi } from "@/lib/auth";
import { useBrand } from "@/components/branding/BrandProvider";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function AuthRecoveryShell({ mode }: { mode: "forgot" | "reset" | "verify" }) {
  const brand = useBrand();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [completed, setCompleted] = useState(false);
  const token = searchParams.get("token") ?? "";

  async function submit(event: FormEvent) {
    event.preventDefault();
    setNotice(null);
    if (mode === "reset" && password.length < 8) {
      setNotice({ tone: "error", text: "Password must be at least 8 characters." });
      return;
    }
    setBusy(true);
    try {
      if (mode === "forgot") {
        const result = await accountApi.forgotPassword(email.trim().toLowerCase());
        setNotice({
          tone: "success",
          text: result.resetUrl ? `Development reset link: ${result.resetUrl}` : "If that account exists, a reset email has been sent.",
        });
      } else if (mode === "reset") {
        await accountApi.resetPassword(token, password);
        setCompleted(true);
        setNotice({
          tone: "success",
          text: "Your password is saved and your email is verified. Sign in below to open your workspace.",
        });
      } else {
        await accountApi.verifyEmail(token);
        setCompleted(true);
        setNotice({ tone: "success", text: "Email verified. Your account is ready to sign in." });
      }
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Request failed." });
    } finally {
      setBusy(false);
    }
  }

  const title = mode === "forgot" ? "Reset your password" : mode === "reset" ? "Set your workspace password" : "Verify your email";
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f9f8] p-4 text-[#14231f]">
      <form className="grid w-full max-w-md gap-5 rounded-2xl border border-[#dbe4e1] bg-white p-7 shadow-[0_20px_55px_rgba(20,35,31,0.08)]" onSubmit={submit}>
        <BrandLogo showWebsiteLogo />
        <div>
          <span className="app-label text-[#118778]">Account security</span>
          <h1 className="app-page-title mt-2 mb-0 text-[#14231f]">{title}</h1>
          <p className="mt-2 text-sm text-[#71817d]">Secure access to {brand.productName}.</p>
        </div>

        {mode === "forgot" ? (
          <div className="grid gap-1.5">
            <label className="app-label text-[#52645f]" htmlFor="recovery-email">Email</label>
            <input
              autoComplete="email"
              className="min-h-12 rounded-xl border border-[#dbe4e1] bg-white px-3.5 text-sm text-[#14231f] outline-none transition hover:border-[#b8c8c3] focus:border-[#118778] focus:ring-4 focus:ring-[#118778]/10"
              id="recovery-email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </div>
        ) : null}

        {mode === "reset" && !completed ? (
          <div className="grid gap-1.5">
            <label className="app-label text-[#52645f]" htmlFor="recovery-password">New password</label>
            <p className="m-0 text-xs text-[#647771]" id="recovery-password-hint">
              Use between 8 and 128 characters. Setting a password also verifies your email address.
            </p>
            <div className="relative">
              <input
                aria-describedby="recovery-password-hint"
                autoComplete="new-password"
                className="min-h-12 w-full rounded-xl border border-[#dbe4e1] bg-white px-3.5 pr-16 text-sm text-[#14231f] outline-none transition hover:border-[#b8c8c3] focus:border-[#118778] focus:ring-4 focus:ring-[#118778]/10"
                id="recovery-password"
                maxLength={128}
                minLength={8}
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                required
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <button
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-1 right-1 rounded-lg px-2.5 text-xs font-semibold text-[#52645f] hover:bg-[#f1f6f4] hover:text-[#14231f]"
                onClick={() => setShowPassword((value) => !value)}
                type="button"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        ) : null}

        {(mode === "reset" || mode === "verify") && !token ? (
          <p className="m-0 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-800" role="alert">
            This link is missing its security token. Request a new password setup or reset link.
          </p>
        ) : null}

        {notice ? (
          <p
            aria-live="polite"
            className={`m-0 break-words rounded-xl border px-3.5 py-3 text-sm ${notice.tone === "error" ? "border-rose-200 bg-rose-50 text-rose-800" : "border-[#cdeae6] bg-[#edf7f4] text-[#29423b]"}`}
            role={notice.tone === "error" ? "alert" : "status"}
          >
            {notice.text}
          </p>
        ) : null}

        {completed ? (
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#118778] px-4 text-sm font-black text-white shadow-[0_8px_22px_rgba(17,135,120,0.16)] transition hover:bg-[#0e6f62]"
            href="/login"
          >
            Continue to sign in
          </Link>
        ) : (
          <button
            className="min-h-12 rounded-xl bg-[#118778] px-4 text-sm font-black text-white shadow-[0_8px_22px_rgba(17,135,120,0.16)] transition hover:bg-[#0e6f62] disabled:opacity-50"
            disabled={busy || ((mode === "reset" || mode === "verify") && !token)}
            type="submit"
          >
            {busy ? "Working…" : mode === "forgot" ? "Send reset link" : mode === "reset" ? "Save password & activate" : "Verify email"}
          </button>
        )}

        <Link className="text-center text-sm font-bold text-[#0e6f62] hover:text-[#118778]" href="/login">
          Back to sign in
        </Link>
        {brand.support.email ? <a className="text-center text-xs text-[#84938f] hover:text-[#52645f]" href={`mailto:${brand.support.email}`}>Need help? {brand.support.email}</a> : null}
      </form>
    </main>
  );
}
