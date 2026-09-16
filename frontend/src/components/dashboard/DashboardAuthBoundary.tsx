"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";

import {
  getServerSession,
  getSession,
  subscribeToSession,
} from "@/lib/auth";

const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export function DashboardAuthBoundary({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const session = useSyncExternalStore(
    subscribeToSession,
    getSession,
    getServerSession,
  );

  useEffect(() => {
    if (!hydrated || session) return;
    const nextPath = pathname === "/dashboard" ? "/dashboard/agents" : pathname;
    router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
  }, [hydrated, pathname, router, session]);

  // Keep the server and first hydrated client render identical. Dashboard
  // pages then mount only after localStorage has supplied its real snapshot,
  // preventing a hard refresh from racing to the login page.
  if (!hydrated || !session) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f9f8] text-sm font-semibold text-[#60716c]">
        Loading your workspace…
      </main>
    );
  }

  return children;
}
