"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { accountApi } from "@/lib/auth";

export function AuthRecoveryShell({ mode }: { mode: "forgot" | "reset" | "verify" }) {
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
    <main className="grid min-h-screen place-items-center bg-[#f8f6ff] p-4 text-[#171321]">
      <form className="grid w-full max-w-md gap-5 rounded-2xl border border-[#ded6f2] bg-white p-7 shadow-[0_24px_70px_rgba(69,37,143,0.16)]" onSubmit={submit}>
        <div><span className="app-label text-[#6b35e8]">Account security</span><h1 className="app-page-title mt-2 mb-0">{title}</h1></div>
        {mode === "forgot" ? <label className="app-label grid gap-2">Email<input className="min-h-12 rounded-lg border border-[#d8ceef] px-3.5 text-sm" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label> : null}
        {mode === "reset" ? <label className="app-label grid gap-2">New password<input className="min-h-12 rounded-lg border border-[#d8ceef] px-3.5 text-sm" type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} /></label> : null}
        {notice ? <p className="m-0 break-words rounded-lg bg-blue-50 px-3.5 py-3 text-sm text-blue-800">{notice}</p> : null}
        <button className="min-h-12 rounded-lg bg-[#6b35e8] px-4 text-sm font-semibold text-white disabled:opacity-50" disabled={busy || ((mode === "reset" || mode === "verify") && !token)} type="submit">{busy ? "Working..." : mode === "forgot" ? "Send reset link" : mode === "reset" ? "Reset password" : "Verify email"}</button>
        <Link className="text-center text-sm font-semibold text-[#6b35e8]" href="/login">Back to sign in</Link>
      </form>
    </main>
  );
}
