"use client";

import { useEffect, useSyncExternalStore } from "react";

import { API_URL } from "@/lib/apiBase";
import { getAuthHeaders, getServerSession, getSession, subscribeToSession, validateStoredSession } from "@/lib/auth";

const REFRESH_INTERVAL_MS = 15_000;

export function WhiteLabelWorkspaceSync() {
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const organizationId = session?.organization?.whiteLabelAccountId ? session.organization.id : "";
  const token = session?.token;

  useEffect(() => {
    if (!organizationId) return;
    let active = true;
    let inFlight = false;
    let revision: string | null = null;

    async function refresh() {
      if (!active || inFlight || document.visibilityState !== "visible") return;
      inFlight = true;
      try {
        const response = await fetch(`${API_URL}/api/organizations/current/white-label-revision`, {
          cache: "no-store",
          credentials: "include",
          headers: getAuthHeaders(),
        });
        if (!active) return;
        if (response.status === 401 || response.status === 403) {
          await validateStoredSession({ force: true });
          return;
        }
        if (!response.ok) return;
        const data = await response.json() as { revision?: string };
        if (!active || !data.revision) return;
        if (revision && revision !== data.revision) {
          window.location.reload();
          return;
        }
        revision = data.revision;
      } catch {
        // A temporary network failure keeps the current workspace visible.
      } finally {
        inFlight = false;
      }
    }

    void refresh();
    const timer = window.setInterval(() => void refresh(), REFRESH_INTERVAL_MS);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [organizationId, token]);

  return null;
}
