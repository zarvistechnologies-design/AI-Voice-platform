"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type FormEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  accountApi,
  getServerSession,
  getSession,
  logoutSession,
  subscribeToSession,
  validateStoredSession,
} from "@/lib/auth";
import {
  organizationApi,
  type AuditLogEntry,
  type Organization,
  type OrganizationInvitation,
  type OrganizationMember,
  type OrganizationRole,
} from "@/lib/organizations";

const assignableRoles = ["admin", "member", "billing"] as const;

type Notice = {
  tone: "success" | "error" | "info";
  message: string;
};

type ActionKey =
  | "switch-workspace"
  | "create-workspace"
  | "save-workspace"
  | "invite-member"
  | `member-role-${string}`
  | `remove-member-${string}`
  | null;

type WorkspaceIconName =
  | "workspace"
  | "users"
  | "settings"
  | "invite"
  | "audit"
  | "profile"
  | "plus"
  | "check"
  | "copy"
  | "shield"
  | "alert";

const workspaceSections: Array<{ id: string; label: string; icon: WorkspaceIconName; managerOnly?: boolean }> = [
  { id: "workspace", label: "Workspace settings", icon: "settings" },
  { id: "team", label: "Team access", icon: "users" },
  { id: "invitations", label: "Pending invitations", icon: "invite" },
  { id: "audit", label: "Audit log", icon: "audit", managerOnly: true },
];

function WorkspaceIcon({ name, className = "size-5" }: { name: WorkspaceIconName; className?: string }) {
  const classes = `${className} shrink-0 fill-none stroke-current stroke-[1.8]`;
  if (name === "workspace") {
    return <svg aria-hidden="true" className={classes} viewBox="0 0 24 24"><path d="M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16M9 7h3M9 11h3M9 15h3M17 9h2a2 2 0 0 1 2 2v10M2 21h20" /></svg>;
  }
  if (name === "users") {
    return <svg aria-hidden="true" className={classes} viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
  }
  if (name === "settings") {
    return <svg aria-hidden="true" className={classes} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V21h-4v-.08a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3v-4h.08a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3h4v.08a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.55 1H21v4h-.08a1.7 1.7 0 0 0-1.52 1Z" /></svg>;
  }
  if (name === "invite") {
    return <svg aria-hidden="true" className={classes} viewBox="0 0 24 24"><path d="M15 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8" cy="7" r="4" /><path d="M19 8v6M16 11h6" /></svg>;
  }
  if (name === "audit") {
    return <svg aria-hidden="true" className={classes} viewBox="0 0 24 24"><path d="M9 5h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1" /><path d="M9 3h6v4H9zM7 12h2M12 12h5M7 16h2M12 16h5" /></svg>;
  }
  if (name === "profile") {
    return <svg aria-hidden="true" className={classes} viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>;
  }
  if (name === "plus") {
    return <svg aria-hidden="true" className={classes} viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>;
  }
  if (name === "check") {
    return <svg aria-hidden="true" className={classes} viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" /></svg>;
  }
  if (name === "copy") {
    return <svg aria-hidden="true" className={classes} viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>;
  }
  if (name === "shield") {
    return <svg aria-hidden="true" className={classes} viewBox="0 0 24 24"><path d="M12 3 20 6v5c0 5.2-3.3 8.5-8 10-4.7-1.5-8-4.8-8-10V6l8-3Z" /><path d="m9 12 2 2 4-4" /></svg>;
  }
  return <svg aria-hidden="true" className={classes} viewBox="0 0 24 24"><path d="M12 3 2.8 19h18.4L12 3Z" /><path d="M12 9v4M12 17h.01" /></svg>;
}

function initials(name?: string | null) {
  const value = (name ?? "").trim();
  if (!value) return "VO";
  return value.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(value?: string | null, dateOnly = false) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return dateOnly
    ? date.toLocaleDateString([], { dateStyle: "medium" })
    : date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function roleTone(role: OrganizationRole) {
  if (role === "owner") return "bg-violet-50 text-violet-700 ring-violet-200";
  if (role === "admin") return "bg-cyan-50 text-cyan-700 ring-cyan-200";
  if (role === "billing") return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

function roleDescription(role: OrganizationRole) {
  if (role === "owner") return "Full workspace ownership and administrative control.";
  if (role === "admin") return "Can manage workspace settings, members, and invitations.";
  if (role === "billing") return "Can access billing-related workspace information.";
  return "Can use shared workspace resources and assigned features.";
}

function auditLabel(action: string) {
  return action.split(".").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function SectionHeading({
  icon,
  title,
  description,
  status,
}: {
  icon: WorkspaceIconName;
  title: string;
  description: string;
  status?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e7eef3] px-5 py-5 sm:px-6">
      <div className="flex min-w-0 items-start gap-3.5">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#eaf9f7] text-[#087f75] ring-1 ring-[#cdeae6]">
          <WorkspaceIcon name={icon} />
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

export function OrganizationSettingsShell() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [showUserSidebar, setShowUserSidebar] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeId, setActiveId] = useState("");
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [invitations, setInvitations] = useState<OrganizationInvitation[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [workspaceName, setWorkspaceName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationTimezone, setOrganizationTimezone] = useState("UTC");
  const [dataRetentionDays, setDataRetentionDays] = useState("90");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<(typeof assignableRoles)[number]>("member");
  const [inviteUrl, setInviteUrl] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [activeAction, setActiveAction] = useState<ActionKey>(null);
  const [loading, setLoading] = useState(true);

  const activeOrganization = useMemo(
    () => organizations.find((organization) => organization._id === activeId),
    [activeId, organizations],
  );
  const canManage = activeOrganization?.role === "owner" || activeOrganization?.role === "admin";
  const pendingInvitations = invitations.filter((invitation) => invitation.status === "pending");
  const busy = activeAction !== null;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const organizationResult = await organizationApi.list();
      const active = organizationResult.organizations.find(
        (organization) => organization._id === organizationResult.activeOrganizationId,
      );
      const memberResult = await organizationApi.members();
      let nextAuditLogs: AuditLogEntry[] = [];
      if (active?.role === "owner" || active?.role === "admin") {
        const auditResult = await organizationApi.auditLog({ limit: 20 });
        nextAuditLogs = auditResult.auditLogs;
      }

      setOrganizations(organizationResult.organizations);
      setActiveId(organizationResult.activeOrganizationId);
      setOrganizationName(active?.name ?? "");
      setOrganizationTimezone(active?.settings?.timezone ?? "UTC");
      setDataRetentionDays(String(active?.settings?.dataRetentionDays ?? 90));
      setMembers(memberResult.members);
      setInvitations(memberResult.invitations);
      setAuditLogs(nextAuditLogs);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/dashboard/settings");
      return;
    }
    let cancelled = false;
    void validateStoredSession()
      .then(() => {
        if (!cancelled) return load();
        return undefined;
      })
      .catch((error) => {
        if (!cancelled) {
          setLoading(false);
          setNotice({
            tone: "error",
            message: error instanceof Error ? error.message : "Could not load workspace settings.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [load, router, session]);

  async function runAction(
    key: Exclude<ActionKey, null>,
    task: () => Promise<unknown>,
    success: string,
  ) {
    setActiveAction(key);
    setNotice(null);
    try {
      await task();
      await load();
      setNotice({ tone: "success", message: success });
      return true;
    } catch (error) {
      setNotice({
        tone: "error",
        message: error instanceof Error ? error.message : "Workspace action failed.",
      });
      return false;
    } finally {
      setActiveAction(null);
    }
  }

  async function switchWorkspace(orgId: string) {
    if (orgId === activeId) return;
    await runAction("switch-workspace", async () => {
      await organizationApi.switch(orgId);
      await accountApi.refresh();
    }, "Active workspace changed.");
  }

  async function createWorkspace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const created = await runAction("create-workspace", async () => {
      await organizationApi.create(workspaceName.trim());
      await accountApi.refresh();
    }, "Workspace created and selected.");
    if (created) setWorkspaceName("");
  }

  async function saveWorkspace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runAction("save-workspace", () => organizationApi.updateCurrent({
      name: organizationName.trim(),
      timezone: organizationTimezone.trim(),
      dataRetentionDays: Number(dataRetentionDays) || 90,
    }), "Workspace settings saved.");
  }

  async function inviteMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActiveAction("invite-member");
    setNotice(null);
    setInviteUrl("");
    try {
      const result = await organizationApi.invite(inviteEmail.trim(), inviteRole);
      setInviteEmail("");
      setInviteUrl(result.emailDeliveryStatus === "sent" ? "" : (result.invitation.acceptUrl ?? ""));
      await load();
      if (result.emailDeliveryStatus === "sent") {
        setNotice({ tone: "success", message: "Invitation email sent." });
      } else if (result.emailDeliveryStatus === "preview") {
        setNotice({ tone: "info", message: "Email preview mode is active. Share the invitation link below." });
      } else {
        setNotice({ tone: "error", message: "Invitation created, but the email could not be sent. Share the link below." });
      }
    } catch (error) {
      setNotice({
        tone: "error",
        message: error instanceof Error ? error.message : "Could not invite this member.",
      });
    } finally {
      setActiveAction(null);
    }
  }

  async function copyInviteLink() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setNotice({ tone: "success", message: "Invitation link copied." });
    } catch {
      setNotice({ tone: "error", message: "Could not copy the link. Select and copy it manually." });
    }
  }

  if (!session) {
    return <main className="grid min-h-screen place-items-center bg-[#f5f8fb] text-sm font-semibold text-slate-600">Loading workspace</main>;
  }

  const noticeClasses = notice?.tone === "error"
    ? "border-rose-200 bg-rose-50 text-rose-900"
    : notice?.tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : "border-cyan-200 bg-cyan-50 text-cyan-950";
  const visibleSections = workspaceSections.filter((section) => !section.managerOnly || canManage);

  return (
    <main className={`grid min-h-screen w-full min-w-0 overflow-x-hidden bg-[#f5f8fb] text-[#111827] ${
      showUserSidebar ? "lg:grid-cols-[272px_minmax(0,1fr)]" : "lg:grid-cols-[64px_minmax(0,1fr)]"
    }`}>
      <DashboardSidebar
        activeLabel="Settings"
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
            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#087f75]">Workspace administration</span>
            <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="m-0 text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-[30px]">Team &amp; workspace</h1>
                <p className="mt-1.5 text-sm leading-6 text-slate-500">Manage organizations, teammates, permissions, invitations, and activity.</p>
              </div>
              <Link className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-[#b9ddd8] hover:text-[#087f75]" href="/dashboard/profile">
                <WorkspaceIcon className="size-4" name="profile" />
                Profile &amp; security
              </Link>
            </div>
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-[1280px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="relative overflow-hidden rounded-[26px] border border-[#183b34] bg-[radial-gradient(circle_at_12%_0%,rgba(69,221,206,0.22),transparent_38%),linear-gradient(135deg,#07110f_0%,#0a2520_62%,#103a33_100%)] p-5 text-white shadow-[0_22px_55px_rgba(7,28,24,0.20)] sm:p-7">
            <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-32 right-20 size-64 rounded-full bg-[#45ddce]/[0.07] blur-2xl" />
            <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_230px] lg:items-center">
              <div className="min-w-0">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <span className="grid size-16 shrink-0 place-items-center rounded-2xl border border-[#75fff0]/30 bg-[#45ddce] text-xl font-black text-[#05231f] shadow-[0_12px_30px_rgba(69,221,206,0.20)]">
                    {initials(activeOrganization?.name)}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="m-0 truncate text-2xl font-bold tracking-[-0.025em] text-white">
                        {activeOrganization?.name ?? (loading ? "Loading workspace..." : "No active workspace")}
                      </h2>
                      {activeOrganization ? (
                        <span className="rounded-full bg-[#45ddce]/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#75fff0] ring-1 ring-[#45ddce]/30">
                          {activeOrganization.plan} plan
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 truncate text-sm text-white/65">{activeOrganization?.slug ?? "Workspace details will appear here."}</p>
                    <p className="mt-2 text-xs font-semibold text-white/45">Voice agents, calls, numbers, and team access stay isolated per workspace.</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/45">Workspaces</span>
                    <strong className="mt-1 block text-sm text-white">{loading && !organizations.length ? "Checking..." : organizations.length}</strong>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/45">Team members</span>
                    <strong className="mt-1 block text-sm text-white">{loading && !members.length ? "Checking..." : members.length}</strong>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/45">Pending invites</span>
                    <strong className="mt-1 block text-sm text-white">{loading && !invitations.length ? "Checking..." : pendingInvitations.length}</strong>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm">
                <span className="grid size-10 place-items-center rounded-xl bg-[#45ddce]/15 text-[#75fff0] ring-1 ring-[#45ddce]/25"><WorkspaceIcon name="shield" /></span>
                <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/45">Your access</p>
                <strong className="mt-1 block text-xl font-bold capitalize text-white">{activeOrganization?.role ?? "Loading"}</strong>
                <p className="mt-2 text-xs leading-5 text-white/55">{activeOrganization ? roleDescription(activeOrganization.role) : "Checking your workspace permissions."}</p>
              </div>
            </div>
          </section>

          {notice ? (
            <div aria-live="polite" className={`flex items-start justify-between gap-4 rounded-xl border px-4 py-3.5 text-sm font-semibold shadow-sm ${noticeClasses}`} role={notice.tone === "error" ? "alert" : "status"}>
              <div className="flex min-w-0 items-start gap-2.5">
                <WorkspaceIcon className="mt-0.5 size-4.5" name={notice.tone === "error" ? "alert" : "check"} />
                <span className="min-w-0 break-words leading-6">{notice.message}</span>
              </div>
              <button aria-label="Dismiss message" className="shrink-0 text-lg leading-none opacity-60 transition hover:opacity-100" onClick={() => setNotice(null)} type="button">&times;</button>
            </div>
          ) : null}

          <section className="grid min-w-0 gap-6 xl:grid-cols-[286px_minmax(0,1fr)]">
            <aside className="grid min-w-0 content-start gap-4 xl:sticky xl:top-6 xl:self-start">
              <article className="overflow-hidden rounded-2xl border border-[#e2eaf0] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
                <div className="border-b border-[#edf2f5] px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="m-0 text-sm font-bold text-slate-950">Your workspaces</h2>
                      <p className="mt-1 text-xs leading-5 text-slate-500">Switch your active data boundary.</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">{organizations.length}</span>
                  </div>
                </div>
                <div className="grid max-h-[326px] gap-1.5 overflow-y-auto p-2.5">
                  {loading && !organizations.length ? [0, 1].map((item) => <div className="h-[66px] animate-pulse rounded-xl bg-slate-100" key={item} />) : organizations.map((organization) => {
                    const active = organization._id === activeId;
                    return (
                      <button aria-current={active ? "true" : undefined} className={`grid w-full grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border p-2.5 text-left transition ${active ? "border-[#b9e5df] bg-[#edf9f7]" : "border-transparent hover:border-slate-200 hover:bg-slate-50"}`} disabled={busy} key={organization._id} onClick={() => void switchWorkspace(organization._id)} type="button">
                        <span className={`grid size-10 place-items-center rounded-xl text-xs font-black ${active ? "bg-[#071b18] text-[#75fff0]" : "bg-slate-100 text-slate-700"}`}>{initials(organization.name)}</span>
                        <span className="min-w-0"><strong className="block truncate text-xs font-bold text-slate-900">{organization.name}</strong><span className="mt-0.5 block truncate text-[10px] font-medium capitalize text-slate-500">{organization.role} / {organization.plan}</span></span>
                        {active ? <span className="grid size-6 place-items-center rounded-full bg-[#45ddce] text-[#05231f]"><WorkspaceIcon className="size-3.5" name="check" /></span> : null}
                      </button>
                    );
                  })}
                  {!loading && !organizations.length ? <p className="p-4 text-center text-xs text-slate-500">No workspaces available.</p> : null}
                </div>
              </article>

              <form className="grid gap-3 rounded-2xl border border-[#e2eaf0] bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.06)]" onSubmit={createWorkspace}>
                <span className="grid size-9 place-items-center rounded-xl bg-[#eaf9f7] text-[#087f75] ring-1 ring-[#cdeae6]"><WorkspaceIcon className="size-4.5" name="plus" /></span>
                <div><h2 className="m-0 text-sm font-bold text-slate-950">Create workspace</h2><p className="mt-1 text-xs leading-5 text-slate-500">Start a separate organization for another team or client.</p></div>
                <label className="sr-only" htmlFor="new-workspace-name">Workspace name</label>
                <input autoComplete="organization" className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm text-slate-950 outline-none transition focus:border-[#0a9f8f] focus:ring-3 focus:ring-[#45ddce]/20" id="new-workspace-name" minLength={2} placeholder="Workspace name" required value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} />
                <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#071b18] px-4 text-sm font-bold text-white transition hover:bg-[#123a33] disabled:cursor-not-allowed disabled:opacity-50" disabled={busy || workspaceName.trim().length < 2} type="submit"><WorkspaceIcon className="size-4" name="plus" />{activeAction === "create-workspace" ? "Creating..." : "Create workspace"}</button>
              </form>

              <nav aria-label="Workspace settings sections" className="flex gap-1 overflow-x-auto rounded-2xl border border-[#e2eaf0] bg-white p-2.5 shadow-[0_14px_34px_rgba(15,23,42,0.06)] xl:grid">
                {visibleSections.map((item) => (
                  <a className="inline-flex min-w-max items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-[#edf9f7] hover:text-[#087f75]" href={`#${item.id}`} key={item.id}><WorkspaceIcon className="size-4" name={item.icon} />{item.label}</a>
                ))}
              </nav>
            </aside>

            <div className="grid min-w-0 content-start gap-5">
              <article className="scroll-mt-6 overflow-hidden rounded-2xl border border-[#e2eaf0] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]" id="workspace">
                <SectionHeading description="Update the name, timezone, and data retention policy for this workspace." icon="settings" status={activeOrganization ? <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ring-1 ${roleTone(activeOrganization.role)}`}>{activeOrganization.role} access</span> : null} title="Workspace settings" />
                {canManage ? (
                  <form className="grid gap-5 p-5 sm:p-6" onSubmit={saveWorkspace}>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="grid gap-2 text-xs font-bold text-slate-700" htmlFor="organization-name">Organization name<input autoComplete="organization" className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm font-normal text-slate-950 outline-none transition focus:border-[#0a9f8f] focus:ring-3 focus:ring-[#45ddce]/20" id="organization-name" minLength={2} required value={organizationName} onChange={(event) => setOrganizationName(event.target.value)} /></label>
                      <label className="grid gap-2 text-xs font-bold text-slate-700" htmlFor="organization-timezone">Timezone<input className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm font-normal text-slate-950 outline-none transition focus:border-[#0a9f8f] focus:ring-3 focus:ring-[#45ddce]/20" id="organization-timezone" placeholder="Asia/Kolkata" required value={organizationTimezone} onChange={(event) => setOrganizationTimezone(event.target.value)} /></label>
                      <label className="grid gap-2 text-xs font-bold text-slate-700" htmlFor="retention-days">Data retention<input className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm font-normal text-slate-950 outline-none transition focus:border-[#0a9f8f] focus:ring-3 focus:ring-[#45ddce]/20" id="retention-days" min={1} required type="number" value={dataRetentionDays} onChange={(event) => setDataRetentionDays(event.target.value)} /><span className="font-normal leading-5 text-slate-500">Number of days workspace data is retained.</span></label>
                      <div className="rounded-xl border border-[#dce9e6] bg-[#f7fbfa] p-4">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#087f75]">Workspace identity</span>
                        <p className="mt-2 truncate text-sm font-bold text-slate-900">{activeOrganization?.slug ?? "Not available"}</p>
                        <p className="mt-1 text-xs capitalize text-slate-500">{activeOrganization?.plan ?? "Free"} plan</p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between gap-3 rounded-xl border border-[#e7eef2] bg-[#f8fafb] p-4 sm:flex-row sm:items-center">
                      <p className="m-0 max-w-xl text-xs leading-5 text-slate-500">These settings apply only to the active workspace and do not affect your other organizations.</p>
                      <button className="min-h-11 shrink-0 rounded-xl bg-[#45ddce] px-5 text-sm font-extrabold text-[#04231f] transition hover:bg-[#75fff0] disabled:cursor-not-allowed disabled:opacity-50" disabled={busy || organizationName.trim().length < 2} type="submit">{activeAction === "save-workspace" ? "Saving..." : "Save settings"}</button>
                    </div>
                  </form>
                ) : (
                  <div className="grid gap-4 p-5 sm:p-6">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border border-[#e8eef2] bg-[#f8fafb] p-4"><span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Workspace</span><strong className="mt-1.5 block truncate text-sm text-slate-900">{activeOrganization?.name ?? "Not available"}</strong></div>
                      <div className="rounded-xl border border-[#e8eef2] bg-[#f8fafb] p-4"><span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Timezone</span><strong className="mt-1.5 block truncate text-sm text-slate-900">{activeOrganization?.settings?.timezone ?? "UTC"}</strong></div>
                      <div className="rounded-xl border border-[#e8eef2] bg-[#f8fafb] p-4"><span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Retention</span><strong className="mt-1.5 block truncate text-sm text-slate-900">{activeOrganization?.settings?.dataRetentionDays ?? 90} days</strong></div>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900"><WorkspaceIcon className="mt-0.5 size-4.5" name="shield" /><p className="m-0 text-xs leading-5"><strong className="block">Read-only workspace access</strong>Only owners and admins can change workspace settings.</p></div>
                  </div>
                )}
              </article>

              <article className="scroll-mt-6 overflow-hidden rounded-2xl border border-[#e2eaf0] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]" id="team">
                <SectionHeading description="Invite teammates and control what each person can do in this workspace." icon="users" status={<span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">{members.length} member{members.length === 1 ? "" : "s"}</span>} title="Team access" />
                {canManage ? (
                  <form className="m-5 grid gap-4 rounded-2xl border border-[#dce9e6] bg-[#f7fbfa] p-4 sm:m-6 sm:p-5 lg:grid-cols-[minmax(0,1fr)_170px_auto] lg:items-end" onSubmit={inviteMember}>
                    <div className="lg:col-span-3"><span className="grid size-9 place-items-center rounded-xl bg-[#dff5f1] text-[#087f75]"><WorkspaceIcon className="size-4.5" name="invite" /></span><h3 className="mt-3 text-sm font-bold text-slate-950">Invite a teammate</h3><p className="mt-1 text-xs leading-5 text-slate-500">They will receive a secure email link to join this workspace.</p></div>
                    <label className="grid gap-2 text-xs font-bold text-slate-700" htmlFor="invite-email">Email address<input autoComplete="email" className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal text-slate-950 outline-none transition focus:border-[#0a9f8f] focus:ring-3 focus:ring-[#45ddce]/20" id="invite-email" placeholder="teammate@company.com" required type="email" value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} /></label>
                    <label className="grid gap-2 text-xs font-bold text-slate-700" htmlFor="invite-role">Workspace role<select className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold capitalize text-slate-950 outline-none focus:border-[#0a9f8f]" id="invite-role" value={inviteRole} onChange={(event) => setInviteRole(event.target.value as typeof inviteRole)}>{assignableRoles.map((role) => <option key={role} value={role}>{role}</option>)}</select></label>
                    <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#45ddce] px-5 text-sm font-extrabold text-[#04231f] transition hover:bg-[#75fff0] disabled:cursor-not-allowed disabled:opacity-50" disabled={busy || !inviteEmail.trim()} type="submit"><WorkspaceIcon className="size-4" name="invite" />{activeAction === "invite-member" ? "Sending..." : "Send invite"}</button>
                    <p className="text-xs leading-5 text-slate-500 lg:col-span-3"><strong className="capitalize text-slate-700">{inviteRole}:</strong> {roleDescription(inviteRole)}</p>
                    {inviteUrl ? (
                      <div className="grid min-w-0 gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center lg:col-span-3">
                        <input aria-label="Invitation link" className="min-h-10 min-w-0 rounded-lg border border-amber-200 bg-white px-3 text-xs text-amber-950" onFocus={(event) => event.currentTarget.select()} readOnly value={inviteUrl} />
                        <button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-amber-300 bg-white px-4 text-xs font-bold text-amber-800 transition hover:bg-amber-100" onClick={() => void copyInviteLink()} type="button"><WorkspaceIcon className="size-3.5" name="copy" />Copy link</button>
                      </div>
                    ) : null}
                  </form>
                ) : (
                  <div className="mx-5 mt-5 rounded-xl border border-[#e8eef2] bg-[#f8fafb] p-4 text-xs leading-5 text-slate-500 sm:mx-6 sm:mt-6">You can view everyone in this workspace. An owner or admin can invite people and change roles.</div>
                )}

                <div className="border-t border-[#edf2f5]">
                  {loading && !members.length ? (
                    <div className="grid gap-3 p-5 sm:p-6">{[0, 1].map((item) => <div className="h-[72px] animate-pulse rounded-xl bg-slate-100" key={item} />)}</div>
                  ) : members.length ? members.map((member) => {
                    const roleAction = `member-role-${member._id}` as const;
                    const removeAction = `remove-member-${member._id}` as const;
                    return (
                      <div className="grid min-w-0 gap-4 border-b border-[#edf2f5] p-5 last:border-b-0 sm:grid-cols-[46px_minmax(0,1fr)_170px_auto] sm:items-center sm:px-6" key={member._id}>
                        <span className="grid size-11 place-items-center rounded-xl bg-slate-100 text-sm font-black text-slate-700">{initials(member.userId.name)}</span>
                        <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><strong className="truncate text-sm font-bold text-slate-900">{member.userId.name}</strong>{member.userId._id === session.id ? <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200">You</span> : null}</div><p className="mt-1 truncate text-xs text-slate-500">{member.userId.email}</p><p className="mt-1 text-[10px] text-slate-400">Joined {formatDate(member.joinedAt, true)}</p></div>
                        {canManage && member.role !== "owner" ? (
                          <label className="grid gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Role<select aria-label={`Role for ${member.userId.name}`} className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold capitalize text-slate-800 outline-none focus:border-[#0a9f8f]" disabled={busy} value={member.role} onChange={(event) => void runAction(roleAction, () => organizationApi.updateMember(member._id, event.target.value as Exclude<OrganizationRole, "owner">), "Member role updated.")}>{assignableRoles.map((role) => <option key={role} value={role}>{role}</option>)}</select></label>
                        ) : <span className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ring-1 ${roleTone(member.role)}`}>{member.role}</span>}
                        {canManage && member.role !== "owner" ? (
                          <button className="w-fit rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50" disabled={busy} onClick={() => {
                            if (!window.confirm(`Remove ${member.userId.name} from this workspace?`)) return;
                            void runAction(removeAction, () => organizationApi.removeMember(member._id), "Member removed from this workspace.");
                          }} type="button">{activeAction === removeAction ? "Removing..." : "Remove"}</button>
                        ) : <span />}
                      </div>
                    );
                  }) : <div className="p-8 text-center"><span className="mx-auto grid size-11 place-items-center rounded-xl bg-slate-100 text-slate-500"><WorkspaceIcon name="users" /></span><p className="mt-3 text-sm font-bold text-slate-700">No members found</p><p className="mt-1 text-xs text-slate-500">Invite a teammate to start collaborating.</p></div>}
                </div>
              </article>

              <article className="scroll-mt-6 overflow-hidden rounded-2xl border border-[#e2eaf0] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]" id="invitations">
                <SectionHeading description="Invitations waiting for a teammate to join this workspace." icon="invite" status={<span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200">{pendingInvitations.length} pending</span>} title="Pending invitations" />
                {pendingInvitations.length ? (
                  <div className="divide-y divide-[#edf2f5]">{pendingInvitations.map((invitation) => (
                    <div className="grid min-w-0 gap-3 p-5 sm:grid-cols-[42px_minmax(0,1fr)_auto] sm:items-center sm:px-6" key={invitation._id}>
                      <span className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-200"><WorkspaceIcon className="size-4.5" name="invite" /></span>
                      <div className="min-w-0"><strong className="block truncate text-sm font-bold text-slate-900">{invitation.email}</strong><p className="mt-1 text-xs text-slate-500">Expires {formatDate(invitation.expiresAt, true)}</p></div>
                      <span className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ring-1 ${roleTone(invitation.role)}`}>{invitation.role}</span>
                    </div>
                  ))}</div>
                ) : (
                  <div className="p-8 text-center"><span className="mx-auto grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"><WorkspaceIcon name="check" /></span><p className="mt-3 text-sm font-bold text-slate-700">No pending invitations</p><p className="mt-1 text-xs text-slate-500">Your invitation queue is clear.</p></div>
                )}
              </article>

              {canManage ? (
                <article className="scroll-mt-6 overflow-hidden rounded-2xl border border-[#e2eaf0] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]" id="audit">
                  <SectionHeading description="Recent administrative changes in the active workspace." icon="audit" status={<span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">Latest {auditLogs.length}</span>} title="Audit log" />
                  {auditLogs.length ? (
                    <div className="divide-y divide-[#edf2f5]">{auditLogs.map((entry) => (
                      <div className="grid min-w-0 gap-3 p-5 sm:grid-cols-[42px_minmax(0,1fr)_180px] sm:items-center sm:px-6" key={entry._id}>
                        <span className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-600"><WorkspaceIcon className="size-4.5" name="audit" /></span>
                        <div className="min-w-0"><strong className="block truncate text-sm font-bold text-slate-900">{auditLabel(entry.action)}</strong><p className="mt-1 truncate text-xs text-slate-500">{entry.actorEmail || "System"} / {entry.resource}</p>{entry.ip ? <p className="mt-1 truncate text-[10px] text-slate-400">IP {entry.ip}</p> : null}</div>
                        <time className="text-xs text-slate-500 sm:text-right" dateTime={entry.createdAt}>{formatDate(entry.createdAt)}</time>
                      </div>
                    ))}</div>
                  ) : (
                    <div className="p-8 text-center"><span className="mx-auto grid size-11 place-items-center rounded-xl bg-slate-100 text-slate-500"><WorkspaceIcon name="audit" /></span><p className="mt-3 text-sm font-bold text-slate-700">No audit activity yet</p><p className="mt-1 text-xs text-slate-500">Administrative changes will appear here.</p></div>
                  )}
                </article>
              ) : null}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
