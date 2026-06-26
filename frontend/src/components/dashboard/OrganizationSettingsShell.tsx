"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
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

const roles = ["admin", "member", "billing"] as const;

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function roleTone(role: OrganizationRole) {
  if (role === "owner") return "bg-violet-50 text-violet-700 ring-violet-200";
  if (role === "admin") return "bg-blue-50 text-blue-700 ring-blue-200";
  if (role === "billing") return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

function auditLabel(action: string) {
  return action.split(".").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function auditTarget(entry: AuditLogEntry) {
  const after = entry.after ?? {};
  const before = entry.before ?? {};
  const value = after.name ?? after.email ?? before.name ?? before.email ?? entry.resourceId;
  return typeof value === "string" && value ? value : entry.resource;
}

export function OrganizationSettingsShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeId, setActiveId] = useState("");
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [invitations, setInvitations] = useState<OrganizationInvitation[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [auditSearch, setAuditSearch] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationTimezone, setOrganizationTimezone] = useState("UTC");
  const [dataRetentionDays, setDataRetentionDays] = useState("90");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<(typeof roles)[number]>("member");
  const [lastInviteUrl, setLastInviteUrl] = useState("");
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

  const active = useMemo(
    () => organizations.find((organization) => organization._id === activeId),
    [activeId, organizations],
  );

  const canManage = active?.role === "owner" || active?.role === "admin";

  const load = useCallback(async () => {
    try {
      const [organizationResult, memberResult] = await Promise.all([
        organizationApi.list(),
        organizationApi.members(),
      ]);
      setOrganizations(organizationResult.organizations);
      setActiveId(organizationResult.activeOrganizationId);
      setMembers(memberResult.members);
      setInvitations(memberResult.invitations);
      const activeOrganization = organizationResult.organizations.find((organization) => organization._id === organizationResult.activeOrganizationId);
      setOrganizationName(activeOrganization?.name ?? "");
      setOrganizationTimezone(activeOrganization?.settings?.timezone ?? "UTC");
      setDataRetentionDays(String(activeOrganization?.settings?.dataRetentionDays ?? 90));
      if (activeOrganization?.role === "owner" || activeOrganization?.role === "admin") {
        const auditResult = await organizationApi.auditLog({ search: auditSearch, limit: 20 });
        setAuditLogs(auditResult.auditLogs);
      } else {
        setAuditLogs([]);
      }
      setNotice("");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not load organization settings.");
    }
  }, [auditSearch]);

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/dashboard/settings");
      return;
    }
    void validateStoredSession();
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load, router, session]);

  async function switchWorkspace(orgId: string) {
    if (orgId === activeId) return;
    setBusy(true);
    try {
      await organizationApi.switch(orgId);
      setActiveId(orgId);
      await load();
      setNotice("Active organization changed. Voice resources are now scoped to this workspace.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not switch organization.");
    } finally {
      setBusy(false);
    }
  }

  async function createWorkspace(event: FormEvent) {
    event.preventDefault();
    if (!workspaceName.trim()) return;
    setBusy(true);
    try {
      await organizationApi.create(workspaceName.trim());
      setWorkspaceName("");
      await load();
      setNotice("Organization created and selected.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not create organization.");
    } finally {
      setBusy(false);
    }
  }

  async function saveOrganizationSettings(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await organizationApi.updateCurrent({
        name: organizationName.trim(),
        timezone: organizationTimezone.trim(),
        dataRetentionDays: Number(dataRetentionDays) || 90,
      });
      await load();
      setNotice("Organization settings saved and audited.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save organization settings.");
    } finally {
      setBusy(false);
    }
  }

  async function invite(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await organizationApi.invite(inviteEmail.trim(), inviteRole);
      setLastInviteUrl(result.invitation.acceptUrl ?? "");
      setInviteEmail("");
      await load();
      setNotice("Invitation created. Share the secure acceptance link with the invited teammate.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not invite member.");
    } finally {
      setBusy(false);
    }
  }

  async function updateRole(memberId: string, role: Exclude<OrganizationRole, "owner">) {
    setBusy(true);
    try {
      await organizationApi.updateMember(memberId, role);
      await load();
      setNotice("Member role updated.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not update member.");
    } finally {
      setBusy(false);
    }
  }

  async function removeMember(member: OrganizationMember) {
    if (!window.confirm(`Remove ${member.userId.name} from ${active?.name ?? "this organization"}?`)) return;
    setBusy(true);
    try {
      await organizationApi.removeMember(member._id);
      await load();
      setNotice("Member removed.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not remove member.");
    } finally {
      setBusy(false);
    }
  }

  async function copyInvite() {
    if (!lastInviteUrl) return;
    await navigator.clipboard.writeText(lastInviteUrl);
    setNotice("Invitation link copied.");
  }

  if (!session) {
    return <main className="grid min-h-screen place-items-center bg-slate-50 text-sm font-semibold text-slate-700">Loading organization settings</main>;
  }

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
        activeLabel="Settings"
        userInitials={initials(session.name)}
        userName={session.name}
        userEmail={session.email}
        onLogout={() => void logoutSession().then(() => router.replace("/login"))}
        showUserSidebar={showUserSidebar}
        setShowUserSidebar={setShowUserSidebar}
      />
      <section className="min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto grid max-w-7xl gap-6">
          <header>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Workspace administration</span>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Organizations and team</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Switch tenant context, invite teammates, and control who can manage shared voice resources.</p>
          </header>

          {notice ? <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">{notice}</div> : null}

          <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
            <div className="grid content-start gap-4">
              <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 p-4">
                  <h2 className="m-0 text-sm font-semibold">Your organizations</h2>
                  <p className="mt-1 text-xs text-slate-500">Each workspace has isolated agents, calls, numbers, and integrations.</p>
                </div>
                <div className="grid gap-2 p-3">
                  {organizations.map((organization) => (
                    <button
                      className={`grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl p-3 text-left transition ${organization._id === activeId ? "bg-blue-50 ring-1 ring-blue-200" : "hover:bg-slate-50"}`}
                      disabled={busy}
                      key={organization._id}
                      onClick={() => void switchWorkspace(organization._id)}
                      type="button"
                    >
                      <span className="grid size-10 place-items-center rounded-xl bg-slate-950 text-sm font-semibold text-white">{initials(organization.name)}</span>
                      <span className="min-w-0"><strong className="block truncate text-sm">{organization.name}</strong><span className="block truncate text-xs text-slate-500">{organization.slug}</span></span>
                      <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ring-1 ${roleTone(organization.role)}`}>{organization.role}</span>
                    </button>
                  ))}
                </div>
              </article>

              <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" onSubmit={createWorkspace}>
                <div><h2 className="m-0 text-sm font-semibold">Create organization</h2><p className="mt-1 text-xs text-slate-500">Start a separate tenant with its own data boundary.</p></div>
                <input className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" onChange={(event) => setWorkspaceName(event.target.value)} placeholder="Organization name" value={workspaceName} />
                <button className="min-h-11 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white disabled:opacity-50" disabled={busy || workspaceName.trim().length < 2} type="submit">Create and switch</button>
              </form>
            </div>

            <div className="grid content-start gap-4">
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div><span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Active workspace</span><h2 className="mt-2 text-xl font-semibold">{active?.name ?? "Loading..."}</h2><p className="mt-1 text-sm text-slate-500">{active?.slug} / {active?.plan} plan</p></div>
                  {active ? <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${roleTone(active.role)}`}>{active.role} access</span> : null}
                </div>
                {canManage ? (
                  <form
                    className="mt-5 grid gap-3 border-t border-slate-100 pt-5 grid-cols-1 md:grid-cols-2"
                    onSubmit={saveOrganizationSettings}
                  >
                    <label className="grid gap-2 text-xs font-semibold text-slate-600">
                      <span>Organization name</span>
                      <input
                        className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm font-normal text-slate-950 outline-none focus:border-blue-500"
                        onChange={(event) => setOrganizationName(event.target.value)}
                        value={organizationName}
                      />
                    </label>
                    <label className="grid gap-2 text-xs font-semibold text-slate-600">
                      <span>Timezone</span>
                      <input
                        className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm font-normal text-slate-950 outline-none focus:border-blue-500"
                        onChange={(event) => setOrganizationTimezone(event.target.value)}
                        placeholder="Asia/Kolkata"
                        value={organizationTimezone}
                      />
                    </label>
                    <label className="grid gap-2 text-xs font-semibold text-slate-600">
                      <span>Retention days</span>
                      <input
                        className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm font-normal text-slate-950 outline-none focus:border-blue-500"
                        onChange={(event) => setDataRetentionDays(event.target.value)}
                        type="number"
                        value={dataRetentionDays}
                      />
                    </label>
                    <button
                      className="min-h-11 self-end rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white disabled:opacity-50 md:justify-self-end"
                      disabled={busy || organizationName.trim().length < 2}
                      type="submit"
                    >
                      Save
                    </button>
                  </form>
                ) : null}
              </article>

              {canManage ? (
                <form className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[minmax(0,1fr)_160px_auto]" onSubmit={invite}>
                  <label className="grid gap-2 text-xs font-semibold text-slate-600"><span>Teammate email</span><input className="min-h-11 rounded-xl border border-slate-200 px-3 text-sm font-normal text-slate-950 outline-none focus:border-blue-500" onChange={(event) => setInviteEmail(event.target.value)} placeholder="teammate@company.com" type="email" value={inviteEmail} /></label>
                  <label className="grid gap-2 text-xs font-semibold text-slate-600"><span>Role</span><select className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-950 outline-none" onChange={(event) => setInviteRole(event.target.value as typeof inviteRole)} value={inviteRole}>{roles.map((role) => <option key={role} value={role}>{role}</option>)}</select></label>
                  <button className="min-h-11 self-end rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white disabled:opacity-50" disabled={busy || !inviteEmail.trim()} type="submit">Invite member</button>
                  {lastInviteUrl ? <div className="flex gap-2 md:col-span-3"><input className="min-w-0 flex-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-xs text-emerald-900" readOnly value={lastInviteUrl} /><button className="rounded-xl border border-emerald-200 px-4 text-sm font-semibold text-emerald-700" onClick={() => void copyInvite()} type="button">Copy link</button></div> : null}
                </form>
              ) : null}

              <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 p-4"><div><h2 className="m-0 text-sm font-semibold">Members</h2><p className="mt-1 text-xs text-slate-500">{members.length} people in this workspace</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{members.length}</span></div>
                <div className="divide-y divide-slate-100">
                  {members.map((member) => (
                    <div className="grid gap-3 p-4 sm:grid-cols-[44px_minmax(0,1fr)_150px_auto] sm:items-center" key={member._id}>
                      <span className="grid size-11 place-items-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">{initials(member.userId.name)}</span>
                      <span className="min-w-0"><strong className="block truncate text-sm">{member.userId.name}</strong><span className="block truncate text-xs text-slate-500">{member.userId.email}</span></span>
                      {canManage && member.role !== "owner" ? (
                        <select className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium" disabled={busy} onChange={(event) => void updateRole(member._id, event.target.value as Exclude<OrganizationRole, "owner">)} value={member.role}>{roles.map((role) => <option key={role} value={role}>{role}</option>)}</select>
                      ) : <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${roleTone(member.role)}`}>{member.role}</span>}
                      {canManage && member.role !== "owner" ? <button className="text-left text-xs font-semibold text-rose-600 sm:text-center" disabled={busy} onClick={() => void removeMember(member)} type="button">Remove</button> : <span />}
                    </div>
                  ))}
                </div>
              </article>

              {invitations.length ? (
                <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 p-4"><h2 className="m-0 text-sm font-semibold">Pending invitations</h2></div>
                  <div className="divide-y divide-slate-100">{invitations.map((invitation) => <div className="flex flex-wrap items-center justify-between gap-3 p-4" key={invitation._id}><span><strong className="block text-sm">{invitation.email}</strong><span className="text-xs text-slate-500">Expires {new Date(invitation.expiresAt).toLocaleDateString()}</span></span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${roleTone(invitation.role)}`}>{invitation.role}</span></div>)}</div>
                </article>
              ) : null}

              {canManage ? (
                <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="grid gap-3 border-b border-slate-200 p-4 md:grid-cols-[minmax(0,1fr)_260px] md:items-end">
                    <div>
                      <h2 className="m-0 text-sm font-semibold">Audit log</h2>
                      <p className="mt-1 text-xs text-slate-500">Admin changes across organization, members, agents, webhooks, keys, and numbers.</p>
                    </div>
                    <input
                      className="min-h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                      onChange={(event) => setAuditSearch(event.target.value)}
                      placeholder="Search action, actor, resource..."
                      value={auditSearch}
                    />
                  </div>
                  <div className="divide-y divide-slate-100">
                    {auditLogs.map((entry) => (
                      <div className="grid gap-2 p-4 md:grid-cols-[minmax(0,1fr)_160px]" key={entry._id}>
                        <span className="min-w-0">
                          <strong className="block truncate text-sm">{auditLabel(entry.action)}</strong>
                          <span className="block truncate text-xs text-slate-500">{auditTarget(entry)} / {entry.actorEmail}</span>
                        </span>
                        <span className="text-xs text-slate-500 md:text-right">{new Date(entry.createdAt).toLocaleString()}</span>
                      </div>
                    ))}
                    {!auditLogs.length ? (
                      <div className="p-6 text-center text-sm text-slate-500">No audit events match this view yet.</div>
                    ) : null}
                  </div>
                </article>
              ) : null}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
