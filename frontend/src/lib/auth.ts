export type AuthSession = {
  id: string;
  email: string;
  name: string;
  signedInAt: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  organization?: {
    id: string;
    name: string;
    slug: string;
    role: string;
  };
};

type AuthResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    twoFactorEnabled: boolean;
    createdAt: string;
  };
  organization?: {
    id: string;
    name: string;
    slug: string;
    role: string;
  };
};

const SESSION_KEY = "ai_voice_platform_session";
const SESSION_EVENT = "ai-voice-platform-session";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

let cachedRawSession: string | null = null;
let cachedSession: AuthSession | null = null;

function notifySessionChange() {
  window.dispatchEvent(new Event(SESSION_EVENT));
}

function createSession(authResponse: AuthResponse): AuthSession {
  return {
    id: authResponse.user.id,
    email: authResponse.user.email,
    name: authResponse.user.name,
    signedInAt: new Date().toISOString(),
    emailVerified: authResponse.user.emailVerified,
    twoFactorEnabled: authResponse.user.twoFactorEnabled,
    organization: authResponse.organization,
  };
}

async function requestAuth(path: string, init: RequestInit) {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  const data = (await response.json().catch(() => null)) as
    | (AuthResponse & { message?: string })
    | null;

  if (!response.ok) {
    throw new Error(data?.message ?? "Authentication failed.");
  }

  if (!data?.user) {
    throw new Error("Invalid response from authentication server.");
  }

  return createSession(data);
}

function saveSession(session: AuthSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  cachedRawSession = null;
  notifySessionChange();
}

export async function loginWithPassword(email: string, password: string, twoFactorCode = "") {
  const session = await requestAuth("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, twoFactorCode }),
  });

  saveSession(session);
  return session;
}

export async function registerWithPassword(
  name: string,
  email: string,
  password: string,
) {
  const session = await requestAuth("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  saveSession(session);
  return session;
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawSession = window.localStorage.getItem(SESSION_KEY);

  if (rawSession === cachedRawSession) {
    return cachedSession;
  }

  cachedRawSession = rawSession;

  if (!rawSession) {
    cachedSession = null;
    return null;
  }

  try {
    const parsed = JSON.parse(rawSession) as AuthSession & { token?: string };
    cachedSession = {
      id: parsed.id,
      email: parsed.email,
      name: parsed.name,
      signedInAt: parsed.signedInAt,
      emailVerified: parsed.emailVerified ?? false,
      twoFactorEnabled: parsed.twoFactorEnabled ?? false,
      organization: parsed.organization,
    };
    if (parsed.token) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(cachedSession));
      cachedRawSession = JSON.stringify(cachedSession);
    }
    return cachedSession;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    cachedRawSession = null;
    cachedSession = null;
    return null;
  }
}

export function getServerSession(): AuthSession | null {
  return null;
}

export async function validateStoredSession() {
  const session = getSession();

  if (!session) {
    return null;
  }

  const response = await fetch(`${API_URL}/api/auth/me`, {
    credentials: "include",
  });

  if (!response.ok) {
    try {
      const refreshed = await requestAuth("/api/auth/refresh", { method: "POST" });
      saveSession(refreshed);
      return refreshed;
    } catch {
      clearSession();
      return null;
    }
  }

  const data = (await response.json()) as {
    user?: {
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      twoFactorEnabled: boolean;
      createdAt: string;
    };
    organization?: AuthSession["organization"];
  };

  if (!data.user) {
    clearSession();
    return null;
  }

  if (
    session.id === data.user.id &&
    session.name === data.user.name &&
    session.email === data.user.email
    && session.emailVerified === data.user.emailVerified
    && session.twoFactorEnabled === data.user.twoFactorEnabled
    && session.organization?.id === data.organization?.id
    && session.organization?.name === data.organization?.name
    && session.organization?.slug === data.organization?.slug
    && session.organization?.role === data.organization?.role
  ) {
    return session;
  }

  const updatedSession = {
    ...session,
    id: data.user.id,
    name: data.user.name,
    email: data.user.email,
    emailVerified: data.user.emailVerified,
    twoFactorEnabled: data.user.twoFactorEnabled,
    organization: data.organization,
  };

  saveSession(updatedSession);
  return updatedSession;
}

export function subscribeToSession(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  function handleStorage(event: StorageEvent) {
    if (event.key === SESSION_KEY) {
      cachedRawSession = null;
      onStoreChange();
    }
  }

  function handleSessionEvent() {
    cachedRawSession = null;
    onStoreChange();
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(SESSION_EVENT, handleSessionEvent);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(SESSION_EVENT, handleSessionEvent);
  };
}

export function clearSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
  cachedRawSession = null;
  cachedSession = null;
  notifySessionChange();
}

export async function logoutSession() {
  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } finally {
    clearSession();
  }
}

async function accountRequest<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${API_URL}/api/auth${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init.headers },
  });
  const data = (await response.json().catch(() => null)) as (T & { message?: string }) | null;
  if (!response.ok) throw new Error(data?.message ?? "Account request failed.");
  return (data ?? {}) as T;
}

export const accountApi = {
  forgotPassword: (email: string) =>
    accountRequest<{ sent: boolean; resetUrl?: string }>("/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
  resetPassword: (token: string, password: string) =>
    accountRequest<Record<string, never>>("/reset-password", { method: "POST", body: JSON.stringify({ token, password }) }),
  verifyEmail: (token: string) =>
    accountRequest<Record<string, never>>("/verify-email", { method: "POST", body: JSON.stringify({ token }) }),
  resendVerification: () => accountRequest<{ sent: boolean; verificationUrl?: string }>("/resend-verification", { method: "POST" }),
  refresh: () => accountRequest<AuthResponse>("/refresh", { method: "POST" }),
  changePassword: (currentPassword: string, password: string) =>
    accountRequest<Record<string, never>>("/change-password", { method: "POST", body: JSON.stringify({ currentPassword, password }) }),
  sessions: () => accountRequest<{ sessions: { _id: string; device: string; ip: string; lastSeenAt: string; expiresAt: string; current: boolean }[] }>("/sessions"),
  revokeSession: (id: string) => accountRequest<Record<string, never>>(`/sessions/${id}`, { method: "DELETE" }),
  setupTwoFactor: () => accountRequest<{ secret: string; otpauthUrl: string }>("/2fa/setup", { method: "POST" }),
  verifyTwoFactor: (code: string) => accountRequest<Record<string, never>>("/2fa/verify", { method: "POST", body: JSON.stringify({ code }) }),
  disableTwoFactor: (code: string) => accountRequest<Record<string, never>>("/2fa/disable", { method: "POST", body: JSON.stringify({ code }) }),
};
