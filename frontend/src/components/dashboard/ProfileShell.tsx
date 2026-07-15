"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useCallback, useEffect, useState, useSyncExternalStore } from "react";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  accountApi,
  getServerSession,
  getSession,
  logoutSession,
  subscribeToSession,
  validateStoredSession,
} from "@/lib/auth";

type AccountSession = {
  _id: string;
  device: string;
  ip: string;
  lastSeenAt: string;
  expiresAt: string;
  current: boolean;
};

type Notice = {
  tone: "success" | "error" | "info";
  message: string;
  action?: { href: string; label: string };
};

type ActionKey =
  | "verification"
  | "password"
  | "two-factor-setup"
  | "two-factor-enable"
  | "two-factor-disable"
  | "sessions-refresh"
  | `session-${string}`
  | null;

type ProfileIconName =
  | "user"
  | "shield"
  | "lock"
  | "devices"
  | "mail"
  | "workspace"
  | "check"
  | "refresh"
  | "key"
  | "alert";

const profileSections: Array<{ id: string; label: string; icon: ProfileIconName }> = [
  { id: "profile", label: "Account overview", icon: "user" },
  { id: "two-factor", label: "Two-factor authentication", icon: "shield" },
  { id: "password", label: "Password", icon: "lock" },
  { id: "sessions", label: "Active sessions", icon: "devices" },
];

function ProfileIcon({ name, className = "size-5" }: { name: ProfileIconName; className?: string }) {
  const classes = `${className} shrink-0 fill-none stroke-current stroke-[1.8]`;
  if (name === "user") {
    return <svg aria-hidden="true" className={classes} viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>;
  }
  if (name === "shield") {
    return <svg aria-hidden="true" className={classes} viewBox="0 0 24 24"><path d="M12 3 20 6v5c0 5.2-3.3 8.5-8 10-4.7-1.5-8-4.8-8-10V6l8-3Z" /><path d="m9 12 2 2 4-4" /></svg>;
  }
  if (name === "lock") {
    return <svg aria-hidden="true" className={classes} viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></svg>;
  }
  if (name === "devices") {
    return <svg aria-hidden="true" className={classes} viewBox="0 0 24 24"><rect x="3" y="4" width="15" height="11" rx="2" /><path d="M8 20h5M10.5 15v5M19 9h2a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2" /></svg>;
  }
  if (name === "mail") {
    return <svg aria-hidden="true" className={classes} viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>;
  }
  if (name === "workspace") {
    return <svg aria-hidden="true" className={classes} viewBox="0 0 24 24"><path d="M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16M9 7h3M9 11h3M9 15h3M17 9h2a2 2 0 0 1 2 2v10M2 21h20" /></svg>;
  }
  if (name === "check") {
    return <svg aria-hidden="true" className={classes} viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" /></svg>;
  }
  if (name === "refresh") {
    return <svg aria-hidden="true" className={classes} viewBox="0 0 24 24"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" /></svg>;
  }
  if (name === "key") {
    return <svg aria-hidden="true" className={classes} viewBox="0 0 24 24"><circle cx="8" cy="15" r="4" /><path d="m11 12 8-8M15 8l3 3M17 6l2 2" /></svg>;
  }
  return <svg aria-hidden="true" className={classes} viewBox="0 0 24 24"><path d="M12 3 2.8 19h18.4L12 3Z" /><path d="M12 9v4M12 17h.01" /></svg>;
}

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function friendlyDevice(userAgent: string) {
  if (!userAgent) return "Unknown device";
  let browser = "Browser";
  if (/Edg\//i.test(userAgent)) browser = "Microsoft Edge";
  else if (/OPR\//i.test(userAgent)) browser = "Opera";
  else if (/Chrome\//i.test(userAgent)) browser = "Google Chrome";
  else if (/Firefox\//i.test(userAgent)) browser = "Mozilla Firefox";
  else if (/Safari\//i.test(userAgent)) browser = "Safari";

  let platform = "Unknown device";
  if (/Windows/i.test(userAgent)) platform = "Windows";
  else if (/iPhone|iPad/i.test(userAgent)) platform = "iPhone or iPad";
  else if (/Android/i.test(userAgent)) platform = "Android";
  else if (/Macintosh|Mac OS/i.test(userAgent)) platform = "macOS";
  else if (/Linux/i.test(userAgent)) platform = "Linux";
  return `${browser} on ${platform}`;
}

function StatusBadge({ enabled, enabledText, disabledText }: { enabled: boolean; enabledText: string; disabledText: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${
      enabled
        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
        : "bg-amber-50 text-amber-700 ring-amber-200"
    }`}>
      <span className={`size-1.5 rounded-full ${enabled ? "bg-emerald-500" : "bg-amber-500"}`} />
      {enabled ? enabledText : disabledText}
    </span>
  );
}

function SectionHeading({
  icon,
  title,
  description,
  status,
}: {
  icon: ProfileIconName;
  title: string;
  description: string;
  status?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e7eef3] px-5 py-5 sm:px-6">
      <div className="flex min-w-0 items-start gap-3.5">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#eaf9f7] text-[#087f75] ring-1 ring-[#cdeae6]">
          <ProfileIcon name={icon} />
        </span>
        <div className="min-w-0">
          <h2 className="m-0 text-base font-bold tracking-[-0.01em] text-slate-950">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>
      {status}
    </div>
  );
}

export function ProfileShell() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [showUserSidebar, setShowUserSidebar] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [totpSecret, setTotpSecret] = useState("");
  const [totpUri, setTotpUri] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [sessions, setSessions] = useState<AccountSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [activeAction, setActiveAction] = useState<ActionKey>(null);

  const loadSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const result = await accountApi.sessions();
      setSessions(result.sessions);
    } catch (error) {
      setNotice({
        tone: "error",
        message: error instanceof Error ? error.message : "Could not load active sessions.",
      });
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/dashboard/profile");
      return;
    }
    let cancelled = false;
    void validateStoredSession()
      .then(() => {
        if (!cancelled) return loadSessions();
        return undefined;
      })
      .catch((error) => {
        if (!cancelled) {
          setNotice({ tone: "error", message: error instanceof Error ? error.message : "Could not validate this session." });
          setSessionsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [loadSessions, router, session]);

  async function runAction(key: Exclude<ActionKey, null>, task: () => Promise<unknown>, success: string) {
    setActiveAction(key);
    setNotice(null);
    try {
      await task();
      await validateStoredSession({ force: true });
      setNotice({ tone: "success", message: success });
      return true;
    } catch (error) {
      setNotice({ tone: "error", message: error instanceof Error ? error.message : "Account action failed." });
      return false;
    } finally {
      setActiveAction(null);
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const changed = await runAction(
      "password",
      () => accountApi.changePassword(currentPassword, newPassword),
      "Password changed. Your other active sessions were revoked.",
    );
    if (changed) {
      setCurrentPassword("");
      setNewPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      await loadSessions();
    }
  }

  async function beginTwoFactorSetup() {
    setActiveAction("two-factor-setup");
    setNotice(null);
    try {
      const result = await accountApi.setupTwoFactor();
      setTotpSecret(result.secret);
      setTotpUri(result.otpauthUrl);
      setNotice({ tone: "info", message: "Add Vozon to your authenticator, then enter the current six-digit code." });
    } catch (error) {
      setNotice({ tone: "error", message: error instanceof Error ? error.message : "Could not start two-factor setup." });
    } finally {
      setActiveAction(null);
    }
  }

  async function resendVerificationEmail() {
    setActiveAction("verification");
    setNotice(null);
    try {
      const result = await accountApi.resendVerification();
      setNotice(result.verificationUrl
        ? {
            tone: "info",
            message: "Email preview mode is active. Use the verification link to continue.",
            action: { href: result.verificationUrl, label: "Open verification link" },
          }
        : { tone: "success", message: "Verification email sent." });
    } catch (error) {
      setNotice({ tone: "error", message: error instanceof Error ? error.message : "Could not send the verification email." });
    } finally {
      setActiveAction(null);
    }
  }

  async function copyTotpSecret() {
    try {
      await navigator.clipboard.writeText(totpSecret);
      setNotice({ tone: "success", message: "Authenticator setup key copied." });
    } catch {
      setNotice({ tone: "error", message: "Could not copy the setup key. Select and copy it manually." });
    }
  }

  function updateTotpCode(value: string) {
    setTotpCode(value.replace(/\D/g, "").slice(0, 6));
  }

  if (!session) {
    return <main className="grid min-h-screen place-items-center bg-[#f5f8fb] text-sm font-semibold text-slate-600">Loading account</main>;
  }

  const protectionCount = Number(session.emailVerified) + Number(session.twoFactorEnabled);
  const securityPercent = protectionCount * 50;
  const securityLabel = securityPercent === 100 ? "Strong" : securityPercent === 50 ? "Good" : "Needs attention";
  const passwordReady = currentPassword.length >= 8 && newPassword.length >= 8;
  const noticeClasses = notice?.tone === "error"
    ? "border-rose-200 bg-rose-50 text-rose-900"
    : notice?.tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : "border-cyan-200 bg-cyan-50 text-cyan-950";

  return (
    <main className={`grid min-h-screen w-full min-w-0 overflow-x-hidden bg-[#f5f8fb] text-[#111827] ${
      showUserSidebar ? "lg:grid-cols-[272px_minmax(0,1fr)]" : "lg:grid-cols-[64px_minmax(0,1fr)]"
    }`}>
      <DashboardSidebar
        activeLabel="Profile"
        userInitials={initials(session.name)}
        userName={session.name}
        userEmail={session.email}
        onLogout={() => void logoutSession().then(() => router.replace("/login"))}
        showUserSidebar={showUserSidebar}
        setShowUserSidebar={setShowUserSidebar}
      />

      <section className="min-w-0">
        <header className="border-b border-[#e5edf2] bg-white px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1280px]">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#087f75]">Account center</span>
            <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="m-0 text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[30px]">Profile & security</h1>
                <p className="mt-1.5 text-sm leading-6 text-slate-500">Manage your identity, sign-in protection, password, and trusted devices.</p>
              </div>
              <Link className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-[#b9ddd8] hover:text-[#087f75]" href="/dashboard/settings">
                <ProfileIcon className="size-4" name="workspace" />
                Team & workspace
              </Link>
            </div>
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-[1280px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="relative overflow-hidden rounded-[26px] border border-[#183b34] bg-[radial-gradient(circle_at_12%_0%,rgba(69,221,206,0.22),transparent_38%),linear-gradient(135deg,#07110f_0%,#0a2520_62%,#103a33_100%)] p-5 text-white shadow-[0_22px_55px_rgba(7,28,24,0.20)] sm:p-7">
            <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-32 right-20 size-64 rounded-full bg-[#45ddce]/[0.07] blur-2xl" />
            <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_190px] lg:items-center">
              <div className="min-w-0">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <span className="grid size-16 shrink-0 place-items-center rounded-2xl border border-[#75fff0]/30 bg-[#45ddce] text-xl font-black text-[#05231f] shadow-[0_12px_30px_rgba(69,221,206,0.20)]">
                    {initials(session.name)}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="m-0 truncate text-2xl font-bold tracking-[-0.025em] text-white">{session.name}</h2>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${session.emailVerified ? "bg-[#45ddce]/15 text-[#75fff0] ring-1 ring-[#45ddce]/30" : "bg-amber-400/15 text-amber-200 ring-1 ring-amber-300/25"}`}>
                        {session.emailVerified ? "Verified" : "Verify email"}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-white/65">{session.email}</p>
                    <p className="mt-2 text-xs font-semibold text-white/45">
                      {session.organization?.name ?? "Personal workspace"}
                      {session.organization?.role ? ` · ${session.organization.role} access` : ""}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/45">Email</span>
                    <strong className="mt-1 flex items-center gap-2 text-sm text-white"><span className={`size-2 rounded-full ${session.emailVerified ? "bg-[#45ddce]" : "bg-amber-300"}`} />{session.emailVerified ? "Verified" : "Action needed"}</strong>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/45">Two-factor</span>
                    <strong className="mt-1 flex items-center gap-2 text-sm text-white"><span className={`size-2 rounded-full ${session.twoFactorEnabled ? "bg-[#45ddce]" : "bg-white/30"}`} />{session.twoFactorEnabled ? "Enabled" : "Not enabled"}</strong>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/45">Active sessions</span>
                    <strong className="mt-1 block text-sm text-white">{sessionsLoading ? "Checking…" : `${sessions.length} device${sessions.length === 1 ? "" : "s"}`}</strong>
                  </div>
                </div>
              </div>

              <div className="justify-self-start lg:justify-self-end">
                <div className="grid size-36 place-items-center rounded-full p-[9px]" style={{ background: `conic-gradient(#45ddce ${securityPercent}%, rgba(255,255,255,0.12) 0)` }}>
                  <div className="grid size-full place-items-center rounded-full border border-white/10 bg-[#0a211d] text-center shadow-inner">
                    <div>
                      <strong className="block text-3xl font-black tracking-[-0.04em] text-white">{securityPercent}%</strong>
                      <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#75fff0]">{securityLabel}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-center text-[11px] font-medium text-white/45">Account protection</p>
              </div>
            </div>
          </section>

          {notice ? (
            <div aria-live="polite" className={`flex items-start justify-between gap-4 rounded-xl border px-4 py-3.5 text-sm font-semibold shadow-sm ${noticeClasses}`} role={notice.tone === "error" ? "alert" : "status"}>
              <div className="flex min-w-0 items-start gap-2.5">
                <ProfileIcon className="mt-0.5 size-4.5" name={notice.tone === "error" ? "alert" : "check"} />
                <span className="min-w-0 break-words leading-6">{notice.message}{notice.action ? <a className="ml-2 underline underline-offset-2" href={notice.action.href}>{notice.action.label}</a> : null}</span>
              </div>
              <button aria-label="Dismiss message" className="shrink-0 text-lg leading-none opacity-60 transition hover:opacity-100" onClick={() => setNotice(null)} type="button">×</button>
            </div>
          ) : null}

          <section className="grid min-w-0 gap-6 xl:grid-cols-[238px_minmax(0,1fr)]">
            <aside className="min-w-0 xl:sticky xl:top-6 xl:self-start">
              <div className="overflow-hidden rounded-2xl border border-[#e2eaf0] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
                <div className="border-b border-[#edf2f5] px-4 py-4">
                  <p className="m-0 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">On this page</p>
                </div>
                <nav aria-label="Profile sections" className="flex gap-1 overflow-x-auto p-2.5 xl:grid">
                  {profileSections.map((item) => (
                    <a className="inline-flex min-w-max items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-[#edf9f7] hover:text-[#087f75]" href={`#${item.id}`} key={item.id}>
                      <ProfileIcon className="size-4" name={item.icon} />
                      {item.label}
                    </a>
                  ))}
                </nav>
                <div className="hidden border-t border-[#edf2f5] bg-[#f8fbfa] p-4 xl:block">
                  <div className="flex items-start gap-2.5 text-[#087f75]"><ProfileIcon className="mt-0.5 size-4" name="shield" /><p className="m-0 text-xs font-bold">Security recommendation</p></div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">Enable email verification and two-factor authentication for the strongest protection.</p>
                </div>
              </div>
            </aside>

            <div className="grid min-w-0 gap-5">
              <article className="scroll-mt-6 overflow-hidden rounded-2xl border border-[#e2eaf0] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]" id="profile">
                <SectionHeading description="Your sign-in identity and current workspace context." icon="user" status={<StatusBadge disabledText="Unverified" enabled={session.emailVerified} enabledText="Verified" />} title="Account overview" />
                <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                  <dl className="grid min-w-0 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-[#e8eef2] bg-[#f8fafb] p-4">
                      <dt className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Full name</dt>
                      <dd className="mt-1.5 truncate text-sm font-bold text-slate-900">{session.name}</dd>
                    </div>
                    <div className="rounded-xl border border-[#e8eef2] bg-[#f8fafb] p-4">
                      <dt className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Email address</dt>
                      <dd className="mt-1.5 truncate text-sm font-bold text-slate-900">{session.email}</dd>
                    </div>
                    <div className="rounded-xl border border-[#e8eef2] bg-[#f8fafb] p-4">
                      <dt className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Current workspace</dt>
                      <dd className="mt-1.5 truncate text-sm font-bold text-slate-900">{session.organization?.name ?? "Personal workspace"}</dd>
                    </div>
                    <div className="rounded-xl border border-[#e8eef2] bg-[#f8fafb] p-4">
                      <dt className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Signed in since</dt>
                      <dd className="mt-1.5 truncate text-sm font-bold text-slate-900">{formatDate(session.signedInAt)}</dd>
                    </div>
                  </dl>

                  <div className={`rounded-xl border p-4 ${session.emailVerified ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                    <span className={`grid size-10 place-items-center rounded-xl ${session.emailVerified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      <ProfileIcon name="mail" />
                    </span>
                    <h3 className="mt-4 text-sm font-bold text-slate-950">{session.emailVerified ? "Email verified" : "Verify your email"}</h3>
                    <p className="mt-1.5 text-xs leading-5 text-slate-600">{session.emailVerified ? "Your identity is confirmed and account recovery is available." : "Confirm your address to strengthen your account and receive security messages."}</p>
                    {!session.emailVerified ? (
                      <button className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl bg-[#071b18] px-4 text-xs font-bold text-white transition hover:bg-[#123a33] disabled:cursor-not-allowed disabled:opacity-50" disabled={activeAction !== null} onClick={() => void resendVerificationEmail()} type="button">
                        {activeAction === "verification" ? "Sending…" : "Resend verification"}
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>

              <article className="scroll-mt-6 overflow-hidden rounded-2xl border border-[#e2eaf0] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]" id="two-factor">
                <SectionHeading description="Add an authenticator code after your password when signing in." icon="shield" status={<StatusBadge disabledText="Recommended" enabled={session.twoFactorEnabled} enabledText="Enabled" />} title="Two-factor authentication" />
                <div className="p-5 sm:p-6">
                  {totpSecret ? (
                    <div className="grid gap-5">
                      <div className="grid gap-3 sm:grid-cols-3">
                        {["Add account", "Enter code", "Protection on"].map((step, index) => (
                          <div className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-xs font-bold ${index === 0 ? "border-[#b9e5df] bg-[#effaf8] text-[#087f75]" : "border-slate-200 bg-slate-50 text-slate-400"}`} key={step}>
                            <span className={`grid size-6 place-items-center rounded-full text-[10px] ${index === 0 ? "bg-[#45ddce] text-[#06231f]" : "bg-slate-200 text-slate-500"}`}>{index + 1}</span>
                            {step}
                          </div>
                        ))}
                      </div>

                      <div className="grid gap-4 rounded-2xl border border-[#dce9e6] bg-[#f7fbfa] p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_260px]">
                        <div className="min-w-0">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#087f75]">Manual setup key</span>
                          <div className="mt-2 flex min-w-0 items-center gap-2 rounded-xl border border-[#d9e8e5] bg-white p-2.5">
                            <code className="min-w-0 flex-1 break-all px-1 text-xs font-bold tracking-wider text-slate-800">{totpSecret}</code>
                            <button className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50" onClick={() => void copyTotpSecret()} type="button">Copy</button>
                          </div>
                          <a className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#087f75] underline-offset-2 hover:underline" href={totpUri}><ProfileIcon className="size-4" name="key" />Open in authenticator app</a>
                          <p className="mt-3 text-xs leading-5 text-slate-500">Add this key to Google Authenticator, Microsoft Authenticator, Authy, or another TOTP app.</p>
                        </div>
                        <div>
                          <label className="grid gap-2 text-xs font-bold text-slate-700" htmlFor="enable-two-factor-code">Current six-digit code</label>
                          <input autoComplete="one-time-code" className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 px-3 text-center text-base font-bold tracking-[0.32em] text-slate-950 outline-none transition focus:border-[#0a9f8f] focus:ring-3 focus:ring-[#45ddce]/20" id="enable-two-factor-code" inputMode="numeric" maxLength={6} pattern="[0-9]{6}" placeholder="000000" value={totpCode} onChange={(event) => updateTotpCode(event.target.value)} />
                          <button className="mt-3 min-h-11 w-full rounded-xl bg-[#45ddce] px-4 text-sm font-extrabold text-[#04231f] transition hover:bg-[#75fff0] disabled:cursor-not-allowed disabled:opacity-50" disabled={activeAction !== null || totpCode.length !== 6} onClick={() => void runAction("two-factor-enable", async () => {
                            await accountApi.verifyTwoFactor(totpCode);
                            setTotpCode("");
                            setTotpSecret("");
                            setTotpUri("");
                          }, "Two-factor authentication enabled.")} type="button">{activeAction === "two-factor-enable" ? "Confirming…" : "Confirm and enable"}</button>
                          <button className="mt-2 min-h-9 w-full text-xs font-bold text-slate-500 hover:text-slate-800" onClick={() => { setTotpSecret(""); setTotpUri(""); setTotpCode(""); }} type="button">Cancel setup</button>
                        </div>
                      </div>
                    </div>
                  ) : session.twoFactorEnabled ? (
                    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                        <span className="grid size-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><ProfileIcon name="shield" /></span>
                        <h3 className="mt-4 text-base font-bold text-emerald-950">Your account has an extra layer of protection</h3>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-800/80">A current code from your authenticator is required each time you sign in with your password.</p>
                      </div>
                      <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
                        <label className="text-xs font-bold text-rose-900" htmlFor="disable-two-factor-code">Disable using a current code</label>
                        <input autoComplete="one-time-code" className="mt-2 min-h-11 w-full rounded-xl border border-rose-200 bg-white px-3 text-center text-base font-bold tracking-[0.32em] outline-none focus:border-rose-400" id="disable-two-factor-code" inputMode="numeric" maxLength={6} pattern="[0-9]{6}" placeholder="000000" value={totpCode} onChange={(event) => updateTotpCode(event.target.value)} />
                        <button className="mt-3 min-h-10 w-full rounded-xl border border-rose-300 bg-white px-4 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50" disabled={activeAction !== null || totpCode.length !== 6} onClick={() => {
                          if (!window.confirm("Disable two-factor authentication for this account?")) return;
                          void runAction("two-factor-disable", async () => {
                            await accountApi.disableTwoFactor(totpCode);
                            setTotpCode("");
                          }, "Two-factor authentication disabled.");
                        }} type="button">{activeAction === "two-factor-disable" ? "Disabling…" : "Disable two-factor"}</button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center">
                      <div>
                        <h3 className="text-base font-bold text-slate-950">Block password-only account takeovers</h3>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Use any standard authenticator app to generate a new six-digit code every 30 seconds.</p>
                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                          {["Works without SMS", "Required on every new sign-in"].map((benefit) => <div className="flex items-center gap-2 text-xs font-semibold text-slate-600" key={benefit}><span className="grid size-5 place-items-center rounded-full bg-emerald-100 text-emerald-700"><ProfileIcon className="size-3" name="check" /></span>{benefit}</div>)}
                        </div>
                      </div>
                      <button className="min-h-11 rounded-xl bg-[#071b18] px-5 text-sm font-bold text-white transition hover:bg-[#123a33] disabled:cursor-not-allowed disabled:opacity-50" disabled={activeAction !== null} onClick={() => void beginTwoFactorSetup()} type="button">{activeAction === "two-factor-setup" ? "Preparing…" : "Set up authenticator"}</button>
                    </div>
                  )}
                </div>
              </article>

              <article className="scroll-mt-6 overflow-hidden rounded-2xl border border-[#e2eaf0] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]" id="password">
                <SectionHeading description="Update your password and sign out other devices." icon="lock" title="Change password" />
                <form className="grid gap-5 p-5 sm:p-6" onSubmit={changePassword}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-xs font-bold text-slate-700" htmlFor="current-password">
                      Current password
                      <span className="relative">
                        <input autoComplete="current-password" className="min-h-11 w-full rounded-xl border border-slate-200 px-3 pr-16 text-sm font-normal text-slate-950 outline-none transition focus:border-[#0a9f8f] focus:ring-3 focus:ring-[#45ddce]/20" id="current-password" maxLength={128} minLength={8} required type={showCurrentPassword ? "text" : "password"} value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
                        <button aria-label={`${showCurrentPassword ? "Hide" : "Show"} current password`} className="absolute inset-y-0 right-0 px-3 text-[11px] font-bold text-slate-500 hover:text-slate-800" onClick={() => setShowCurrentPassword((value) => !value)} type="button">{showCurrentPassword ? "Hide" : "Show"}</button>
                      </span>
                    </label>
                    <label className="grid gap-2 text-xs font-bold text-slate-700" htmlFor="new-password">
                      New password
                      <span className="relative">
                        <input aria-describedby="password-requirement" autoComplete="new-password" className="min-h-11 w-full rounded-xl border border-slate-200 px-3 pr-16 text-sm font-normal text-slate-950 outline-none transition focus:border-[#0a9f8f] focus:ring-3 focus:ring-[#45ddce]/20" id="new-password" maxLength={128} minLength={8} required type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
                        <button aria-label={`${showNewPassword ? "Hide" : "Show"} new password`} className="absolute inset-y-0 right-0 px-3 text-[11px] font-bold text-slate-500 hover:text-slate-800" onClick={() => setShowNewPassword((value) => !value)} type="button">{showNewPassword ? "Hide" : "Show"}</button>
                      </span>
                    </label>
                  </div>
                  <div className="flex flex-col justify-between gap-4 rounded-xl border border-[#e7eef2] bg-[#f8fafb] p-4 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-3">
                      <span className={`mt-0.5 grid size-7 place-items-center rounded-lg ${newPassword.length >= 8 ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}><ProfileIcon className="size-4" name={newPassword.length >= 8 ? "check" : "key"} /></span>
                      <div><p className="m-0 text-xs font-bold text-slate-700" id="password-requirement">Use 8–128 characters</p><p className="mt-1 text-xs leading-5 text-slate-500">Changing your password revokes every other active session.</p></div>
                    </div>
                    <button className="min-h-11 rounded-xl bg-[#45ddce] px-5 text-sm font-extrabold text-[#04231f] transition hover:bg-[#75fff0] disabled:cursor-not-allowed disabled:opacity-50" disabled={activeAction !== null || !passwordReady} type="submit">{activeAction === "password" ? "Updating…" : "Update password"}</button>
                  </div>
                </form>
              </article>

              <article className="scroll-mt-6 overflow-hidden rounded-2xl border border-[#e2eaf0] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]" id="sessions">
                <SectionHeading description="Devices and browsers currently signed in to your account." icon="devices" status={<button className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-[11px] font-bold text-slate-600 transition hover:border-[#b9ddd8] hover:text-[#087f75] disabled:opacity-50" disabled={sessionsLoading || activeAction !== null} onClick={() => {
                  setActiveAction("sessions-refresh");
                  void loadSessions().finally(() => setActiveAction(null));
                }} type="button"><ProfileIcon className={`size-3.5 ${sessionsLoading ? "animate-spin" : ""}`} name="refresh" />{sessionsLoading ? "Refreshing" : "Refresh"}</button>} title="Active sessions" />
                <div className="divide-y divide-[#edf2f5]">
                  {sessionsLoading && !sessions.length ? (
                    <div className="grid gap-3 p-5 sm:p-6">
                      {[0, 1].map((item) => <div className="h-[74px] animate-pulse rounded-xl bg-slate-100" key={item} />)}
                    </div>
                  ) : sessions.length ? sessions.map((item) => (
                    <div className={`grid min-w-0 gap-4 p-5 sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:items-center sm:px-6 ${item.current ? "bg-emerald-50/40" : "bg-white"}`} key={item._id}>
                      <span className={`grid size-11 place-items-center rounded-xl ${item.current ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}><ProfileIcon name="devices" /></span>
                      <div className="min-w-0" title={item.device}>
                        <div className="flex flex-wrap items-center gap-2">
                          <strong className="truncate text-sm font-bold text-slate-900">{friendlyDevice(item.device)}</strong>
                          {item.current ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Current</span> : null}
                        </div>
                        <p className="mt-1 truncate text-xs text-slate-500">{item.ip || "Unknown IP"} · Last active {formatDate(item.lastSeenAt)}</p>
                        <p className="mt-1 text-[11px] text-slate-400">Session expires {formatDate(item.expiresAt)}</p>
                      </div>
                      {!item.current ? (
                        <button className="w-fit rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50" disabled={activeAction !== null} onClick={() => {
                          if (!window.confirm(`Revoke the session for ${friendlyDevice(item.device)}?`)) return;
                          void runAction(`session-${item._id}`, async () => {
                            await accountApi.revokeSession(item._id);
                            await loadSessions();
                          }, "Session revoked.");
                        }} type="button">{activeAction === `session-${item._id}` ? "Revoking…" : "Revoke"}</button>
                      ) : null}
                    </div>
                  )) : <div className="p-8 text-center"><span className="mx-auto grid size-11 place-items-center rounded-xl bg-slate-100 text-slate-500"><ProfileIcon name="devices" /></span><p className="mt-3 text-sm font-bold text-slate-700">No session information available</p><p className="mt-1 text-xs text-slate-500">Refresh to check again.</p></div>}
                </div>
              </article>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
