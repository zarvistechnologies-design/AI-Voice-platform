export type AuthSession = {
  id: string;
  email: string;
  name: string;
  token: string;
  signedInAt: string;
};

type AuthResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
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
    token: authResponse.token,
    signedInAt: new Date().toISOString(),
  };
}

async function requestAuth(path: string, init: RequestInit) {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
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

  if (!data?.token || !data.user) {
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

export async function loginWithPassword(email: string, password: string) {
  const session = await requestAuth("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
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
    cachedSession = JSON.parse(rawSession) as AuthSession;
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
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
  });

  if (!response.ok) {
    clearSession();
    return null;
  }

  const data = (await response.json()) as {
    user?: {
      id: string;
      name: string;
      email: string;
      createdAt: string;
    };
  };

  if (!data.user) {
    clearSession();
    return null;
  }

  if (
    session.id === data.user.id &&
    session.name === data.user.name &&
    session.email === data.user.email
  ) {
    return session;
  }

  const updatedSession = {
    ...session,
    id: data.user.id,
    name: data.user.name,
    email: data.user.email,
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
