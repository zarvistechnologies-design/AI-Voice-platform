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
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const token = searchParams.get("token") ?? "";

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "forgot") {
        const result = await accountApi.forgotPassword(email.trim().toLowerCase());
        setNotice(result.resetUrl ? `Development reset link: ${result.resetUrl}` : "If that account exists, a reset email has been sent.");
      } else if (mode === "reset") {
        await accountApi.resetPassword(token, password);
        setNotice("Password reset. All existing sessions were revoked; you can sign in now.");
      } else {
        await accountApi.verifyEmail(token);
        setNotice("Email verified. Your account is ready.");
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Request failed.");
    } finally {
      setBusy(false);
    }
  }

  const title = mode === "forgot" ? "Reset your password" : mode === "reset" ? "Choose a new password" : "Verify your email";
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--brand-surface)] p-4 text-white">
      <form className="grid w-full max-w-md gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-7 shadow-[0_24px_70px_rgba(0,0,0,0.35)]" onSubmit={submit}>
        <BrandLogo showWebsiteLogo />
        <div><span className="app-label text-[var(--brand-accent)]">Account security</span><h1 className="app-page-title mt-2 mb-0 text-white">{title}</h1><p className="mt-2 text-sm text-white/45">Secure access to {brand.productName}.</p></div>
        {mode === "forgot" ? <label className="app-label grid gap-2 text-white/60">Email<input className="min-h-12 rounded-lg border border-white/10 bg-black/25 px-3.5 text-sm text-white outline-none focus:border-[var(--brand-primary)]" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label> : null}
        {mode === "reset" ? <label className="app-label grid gap-2 text-white/60">New password<input className="min-h-12 rounded-lg border border-white/10 bg-black/25 px-3.5 text-sm text-white outline-none focus:border-[var(--brand-primary)]" type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} /></label> : null}
        {notice ? <p className="m-0 break-words rounded-lg border border-white/10 bg-white/[0.05] px-3.5 py-3 text-sm text-white/75">{notice}</p> : null}
        <button className="min-h-12 rounded-lg bg-[var(--brand-primary)] px-4 text-sm font-black text-black hover:brightness-110 disabled:opacity-50" disabled={busy || ((mode === "reset" || mode === "verify") && !token)} type="submit">{busy ? "Working..." : mode === "forgot" ? "Send reset link" : mode === "reset" ? "Set password" : "Verify email"}</button>
        <Link className="text-center text-sm font-bold text-[var(--brand-accent)]" href="/login">Back to sign in</Link>
        {brand.support.email ? <a className="text-center text-xs text-white/35 hover:text-white/60" href={`mailto:${brand.support.email}`}>Need help? {brand.support.email}</a> : null}
      </form>
    </main>
  );
}
