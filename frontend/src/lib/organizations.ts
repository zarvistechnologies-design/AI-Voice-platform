import { getAuthHeaders, getSession } from "@/lib/auth";
import { cachedApiRequest, invalidateApiCache } from "@/lib/apiCache";

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
      ...getAuthHeaders(),
      ...init.headers,
    },
  });
  const data = (await response.json().catch(() => null)) as (T & { message?: string }) | null;
  if (!response.ok) throw new Error(data?.message ?? "Organization request failed.");
  return (data ?? {}) as T;
}

export const organizationApi = {
  list: () =>
    cachedApiRequest("organizations", "/", 30_000, () => request<{ activeOrganizationId: string; organizations: Organization[] }>("/")),
  create: async (name: string) => {
    const result = await request<{ organization: Organization }>("/", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    invalidateApiCache("organizations");
    return result;
  },
  updateCurrent: async (input: { name?: string; timezone?: string; dataRetentionDays?: number }) => {
    const result = await request<{ organization: Organization }>("/current", {
      method: "PUT",
      body: JSON.stringify(input),
    });
    invalidateApiCache("organizations");
    return result;
  },
  switch: async (orgId: string) => {
    const result = await request<Record<string, never>>(`/${orgId}/switch`, { method: "POST" });
    invalidateApiCache("organizations");
    return result;
  },
  members: () =>
    cachedApiRequest("organizations", "/current/members", 15_000, () =>
      request<{ members: OrganizationMember[]; invitations: OrganizationInvitation[] }>(
        "/current/members",
      )),
  invite: async (email: string, role: Exclude<OrganizationRole, "owner">) => {
    const result = await request<{ invitation: OrganizationInvitation }>("/current/invitations", {
      method: "POST",
      body: JSON.stringify({ email, role }),
    });
    invalidateApiCache("organizations", "/current/members");
    return result;
  },
  acceptInvitation: async (token: string) => {
    const result = await request<Record<string, never>>("/invitations/accept", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
    invalidateApiCache("organizations");
    return result;
  },
  updateMember: async (memberId: string, role: Exclude<OrganizationRole, "owner">) => {
    const result = await request<{ member: OrganizationMember }>(`/current/members/${memberId}`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
    invalidateApiCache("organizations", "/current/members");
    return result;
  },
  removeMember: async (memberId: string) => {
    const result = await request<Record<string, never>>(`/current/members/${memberId}`, { method: "DELETE" });
    invalidateApiCache("organizations", "/current/members");
    return result;
  },
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
