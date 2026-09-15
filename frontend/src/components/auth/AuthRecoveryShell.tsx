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
    <main className="grid min-h-screen place-items-center bg-[#f7f9f8] p-4 text-[#14231f]">
      <form className="grid w-full max-w-md gap-5 rounded-2xl border border-[#dbe4e1] bg-white p-7 shadow-[0_20px_55px_rgba(20,35,31,0.08)]" onSubmit={submit}>
        <BrandLogo showWebsiteLogo />
        <div><span className="app-label text-[#118778]">Account security</span><h1 className="app-page-title mt-2 mb-0 text-[#14231f]">{title}</h1><p className="mt-2 text-sm text-[#71817d]">Secure access to {brand.productName}.</p></div>
        {mode === "forgot" ? <label className="app-label grid gap-2 text-[#52645f]">Email<input className="min-h-12 rounded-xl border border-[#dbe4e1] bg-white px-3.5 text-sm text-[#14231f] outline-none transition hover:border-[#b8c8c3] focus:border-[#118778] focus:ring-4 focus:ring-[#118778]/10" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label> : null}
        {mode === "reset" ? <label className="app-label grid gap-2 text-[#52645f]">New password<input className="min-h-12 rounded-xl border border-[#dbe4e1] bg-white px-3.5 text-sm text-[#14231f] outline-none transition hover:border-[#b8c8c3] focus:border-[#118778] focus:ring-4 focus:ring-[#118778]/10" type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} /></label> : null}
        {notice ? <p className="m-0 break-words rounded-xl border border-[#cdeae6] bg-[#edf7f4] px-3.5 py-3 text-sm text-[#29423b]">{notice}</p> : null}
        <button className="min-h-12 rounded-xl bg-[#118778] px-4 text-sm font-black text-white shadow-[0_8px_22px_rgba(17,135,120,0.16)] transition hover:bg-[#0e6f62] disabled:opacity-50" disabled={busy || ((mode === "reset" || mode === "verify") && !token)} type="submit">{busy ? "Working..." : mode === "forgot" ? "Send reset link" : mode === "reset" ? "Set password" : "Verify email"}</button>
        <Link className="text-center text-sm font-bold text-[#0e6f62] hover:text-[#118778]" href="/login">Back to sign in</Link>
        {brand.support.email ? <a className="text-center text-xs text-[#84938f] hover:text-[#52645f]" href={`mailto:${brand.support.email}`}>Need help? {brand.support.email}</a> : null}
      </form>
    </main>
  );
}
