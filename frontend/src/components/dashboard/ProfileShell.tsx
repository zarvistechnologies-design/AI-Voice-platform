"use client";

import { FormEvent, useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { accountApi, getServerSession, getSession, logoutSession, subscribeToSession, validateStoredSession } from "@/lib/auth";

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export function ProfileShell() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const searchParams = useSearchParams();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [totpSecret, setTotpSecret] = useState("");
  const [totpUri, setTotpUri] = useState("");
  const [code, setCode] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [showUserSidebar, setShowUserSidebar] = useState(() => {
    try {
      return localStorage.getItem("showUserSidebar") === "1";
    } catch {
      return searchParams.get("showUserSidebar") === "1";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("showUserSidebar", showUserSidebar ? "1" : "0");
    } catch {}
  }, [showUserSidebar]);

  const load = useCallback(async () => {
    try {
      await validateStoredSession();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not load security settings.");
    }
  }, []);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/dashboard/profile");
      return;
    }
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load, router, session]);


  async function action(task: () => Promise<unknown>, success: string) {
    setBusy(true);
    try {
      await task();
      await load();
      setNotice(success);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Security action failed.");
    } finally {
      setBusy(false);
    }
  }

  async function changePassword(event: FormEvent) {
    event.preventDefault();
    await action(
      async () => {
        await accountApi.changePassword(currentPassword, password);
        await validateStoredSession();
      },
      "Password changed and other sessions revoked."
    );
    setCurrentPassword("");
    setPassword("");
  }

  async function setupTwoFactor() {
    setBusy(true);
    try {
      const result = await accountApi.setupTwoFactor();
      setTotpSecret(result.secret);
      setTotpUri(result.otpauthUrl);
      setNotice("Add the secret to your authenticator, then enter its current code.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not start 2FA setup.");
    } finally {
      setBusy(false);
    }
  }

  if (!session) return <main className="grid min-h-screen place-items-center bg-slate-50 text-sm font-semibold">Loading profile</main>;

  return (
    <main
      className={`grid min-h-screen w-full min-w-0 overflow-x-hidden bg-[#f7f8fb] text-[#111827]
      ${
        showUserSidebar
          ? "lg:grid-cols-[272px_minmax(0,1fr)]"
          : "lg:grid-cols-[64px_minmax(0,1fr)]"
      }`}
    >
      <DashboardSidebar 
        activeLabel="Profile" 
        userInitials={initials(session.name)} 
        userName={session.name} 
        userEmail={session.email}
        onLogout={() => void logoutSession().then(() => router.replace("/login"))} 
        showUserSidebar={showUserSidebar}
        setShowUserSidebar={setShowUserSidebar}
      />
      
      <section className="min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto grid max-w-5xl gap-6">
        <header><span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Personal security</span><h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Profile and sessions</h1><p className="mt-2 text-sm text-slate-600">{session.name} / {session.email}</p></header>
        {notice ? <div className="wrap-break-word rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">{notice}</div> : null}
        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h2 className="m-0 text-sm font-semibold">Email verification</h2><p className="mt-2 text-sm text-slate-500">{session.emailVerified ? "Your email is verified." : "Verify your email before production access."}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${session.emailVerified ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{session.emailVerified ? "Verified" : "Pending"}</span></div>{!session.emailVerified ? <button className="mt-5 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white" disabled={busy} type="button" onClick={() => void action(async () => { const result = await accountApi.resendVerification(); if (result.verificationUrl) setNotice(`Development verification link: ${result.verificationUrl}`); }, "Verification email sent.")}>Resend verification</button> : null}</article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h2 className="m-0 text-sm font-semibold">Authenticator 2FA</h2><p className="mt-2 text-sm text-slate-500">Require a six-digit TOTP code when signing in.</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${session.twoFactorEnabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{session.twoFactorEnabled ? "Enabled" : "Optional"}</span></div>{totpSecret ? <div className="mt-4 grid gap-3"><code className="break-all rounded-lg bg-slate-100 p-3 text-xs">{totpSecret}</code><a className="break-all text-xs font-semibold text-blue-600" href={totpUri}>Open authenticator setup URI</a><input className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" inputMode="numeric" maxLength={6} placeholder="Current 6-digit code" value={code} onChange={(event) => setCode(event.target.value)} /><button className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white" disabled={busy || code.length !== 6} type="button" onClick={() => void action(() => accountApi.verifyTwoFactor(code), "Two-factor authentication enabled.")}>Confirm and enable</button></div> : session.twoFactorEnabled ? <div className="mt-4 flex gap-2"><input className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm" inputMode="numeric" maxLength={6} placeholder="Current code" value={code} onChange={(event) => setCode(event.target.value)} /><button className="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700" disabled={busy || code.length !== 6} type="button" onClick={() => void action(() => accountApi.disableTwoFactor(code), "Two-factor authentication disabled.")}>Disable</button></div> : <button className="mt-5 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white" disabled={busy} type="button" onClick={() => void setupTwoFactor()}>Set up 2FA</button>}</article>
        </section>

        <form className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_1fr_auto]" onSubmit={changePassword}><div className="md:col-span-3"><h2 className="m-0 text-sm font-semibold">Change password</h2><p className="mt-1 text-xs text-slate-500">Changing your password revokes every other active session.</p></div><input className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" type="password" minLength={8} required placeholder="Current password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /><input className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" type="password" minLength={8} required placeholder="New password" value={password} onChange={(event) => setPassword(event.target.value)} /><button className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white" disabled={busy} type="submit">Change password</button></form>

        {/* <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-200 p-5"><h2 className="m-0 text-sm font-semibold">Active sessions</h2><p className="mt-1 text-xs text-slate-500">Revoke devices you no longer recognize.</p></div><div className="divide-y divide-slate-100">{sessions.map((item) => <div className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center" key={item._id}><div><strong className="block text-sm">{item.device.slice(0, 100)}</strong><span className="mt-1 block text-xs text-slate-500">{item.ip || "Unknown IP"} / Last seen {new Date(item.lastSeenAt).toLocaleString()}</span></div>{item.current ? <span className="w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Current</span> : <button className="w-fit rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700" disabled={busy} type="button" onClick={() => void action(() => accountApi.revokeSession(item._id), "Session revoked.")}>Revoke</button>}</div>)}</div></article> */}
      
        </div>
      </section>
    </main>
  );
}
