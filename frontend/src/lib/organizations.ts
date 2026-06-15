import { getSession } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export type OrganizationRole = "owner" | "admin" | "member" | "billing";

export type Organization = {
  _id: string;
  name: string;
  slug: string;
  plan: "free" | "starter" | "growth" | "enterprise";
  settings?: {
    timezone: string;
    dataRetentionDays: number;
  };
  role: OrganizationRole;
  createdAt: string;
};

export type OrganizationMember = {
  _id: string;
  role: OrganizationRole;
  joinedAt: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
  };
};

export type OrganizationInvitation = {
  _id: string;
  email: string;
  role: Exclude<OrganizationRole, "owner">;
  status: "pending" | "accepted" | "revoked" | "expired";
  expiresAt: string;
  acceptUrl?: string;
};

export type AuditLogEntry = {
  _id: string;
  action: string;
  resource: string;
  resourceId: string;
  actorEmail: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  ip: string;
  userAgent: string;
  createdAt: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
  };
};

async function request<T>(path: string, init: RequestInit = {}) {
  if (!getSession()) throw new Error("Sign in before managing organizations.");
  const response = await fetch(`${API_URL}/api/organizations${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const data = (await response.json().catch(() => null)) as (T & { message?: string }) | null;
  if (!response.ok) throw new Error(data?.message ?? "Organization request failed.");
  return (data ?? {}) as T;
}

export const organizationApi = {
  list: () =>
    request<{ activeOrganizationId: string; organizations: Organization[] }>("/"),
  create: (name: string) =>
    request<{ organization: Organization }>("/", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  updateCurrent: (input: { name?: string; timezone?: string; dataRetentionDays?: number }) =>
    request<{ organization: Organization }>("/current", {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  switch: (orgId: string) =>
    request<Record<string, never>>(`/${orgId}/switch`, { method: "POST" }),
  members: () =>
    request<{ members: OrganizationMember[]; invitations: OrganizationInvitation[] }>(
      "/current/members",
    ),
  invite: (email: string, role: Exclude<OrganizationRole, "owner">) =>
    request<{ invitation: OrganizationInvitation }>("/current/invitations", {
      method: "POST",
      body: JSON.stringify({ email, role }),
    }),
  acceptInvitation: (token: string) =>
    request<Record<string, never>>("/invitations/accept", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
  updateMember: (memberId: string, role: Exclude<OrganizationRole, "owner">) =>
    request<{ member: OrganizationMember }>(`/current/members/${memberId}`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),
  removeMember: (memberId: string) =>
    request<Record<string, never>>(`/current/members/${memberId}`, { method: "DELETE" }),
  auditLog: (input: { search?: string; resource?: string; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams();
    if (input.search) query.set("search", input.search);
    if (input.resource) query.set("resource", input.resource);
    query.set("page", String(input.page ?? 1));
    query.set("limit", String(input.limit ?? 25));
    return request<{
      auditLogs: AuditLogEntry[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/current/audit-log?${query.toString()}`);
  },
};
