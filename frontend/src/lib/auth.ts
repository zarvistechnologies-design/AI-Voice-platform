import { API_URL } from "@/lib/apiBase";

export type AuthSession = {
  id: string;
  email: string;
  name: string;
  signedInAt: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  token?: string;
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
  token?: string;
};

const SESSION_KEY = "ai_voice_platform_session";
const SESSION_EVENT = "ai-voice-platform-session";
const SESSION_VALIDATION_TTL_MS = 30_000;

let cachedRawSession: string | null = null;
let cachedSession: AuthSession | null = null;
let validatedSessionKey = "";
let validatedSessionAt = 0;
let sessionValidationPromise: Promise<AuthSession | null> | null = null;
let sessionValidationPromiseKey = "";

function validationKey(session: AuthSession) {
  return `${session.id}:${session.organization?.id ?? ""}:${session.token ?? "cookie"}`;
}

function resetSessionValidation() {
  validatedSessionKey = "";
  validatedSessionAt = 0;
  sessionValidationPromise = null;
  sessionValidationPromiseKey = "";
}

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
    token: authResponse.token,
    organization: authResponse.organization,
  };
}

function authServerUnavailableError() {
  return new Error("Could not reach the backend API. Make sure the backend is running on http://localhost:5000.");
}

async function requestAuth(path: string, init: RequestInit) {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
  } catch {
    throw authServerUnavailableError();
  }

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
  resetSessionValidation();
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

export async function loginWithGoogle(credential: string) {
  const session = await requestAuth("/api/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential }),
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
      token: parsed.token,
      organization: parsed.organization,
    };
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

export function getAuthHeaders(): Record<string, string> {
  const session = getSession();
  return session?.token ? { Authorization: `Bearer ${session.token}` } : {};
}

async function validateSessionWithServer(session: AuthSession) {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/auth/me`, {
      credentials: "include",
      headers: getAuthHeaders(),
    });
  } catch {
    return null;
  }

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

export function validateStoredSession(options: { force?: boolean } = {}) {
  const session = getSession();
  if (!session) return Promise.resolve(null);

  const key = validationKey(session);
  if (
    !options.force
    && key === validatedSessionKey
    && Date.now() - validatedSessionAt < SESSION_VALIDATION_TTL_MS
  ) {
    return Promise.resolve(session);
  }
  if (!options.force && sessionValidationPromise && sessionValidationPromiseKey === key) {
    return sessionValidationPromise;
  }

  sessionValidationPromiseKey = key;
  sessionValidationPromise = validateSessionWithServer(session)
    .then((validated) => {
      if (validated) {
        validatedSessionKey = validationKey(validated);
        validatedSessionAt = Date.now();
      }
      return validated;
    })
    .finally(() => {
      if (sessionValidationPromiseKey === key) {
        sessionValidationPromise = null;
        sessionValidationPromiseKey = "";
      }
    });
  return sessionValidationPromise;
}

export function subscribeToSession(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  function handleStorage(event: StorageEvent) {
    if (event.key === SESSION_KEY) {
      cachedRawSession = null;
      resetSessionValidation();
      onStoreChange();
    }
  }

  function handleSessionEvent() {
    cachedRawSession = null;
    resetSessionValidation();
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
  resetSessionValidation();
  notifySessionChange();
}

export async function logoutSession() {
  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: getAuthHeaders(),
    });
  } finally {
    clearSession();
  }
}

async function accountRequest<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${API_URL}/api/auth${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...getAuthHeaders(), ...init.headers },
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
