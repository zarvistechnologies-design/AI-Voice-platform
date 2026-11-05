"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getServerSession, getSession, subscribeToSession, validateStoredSession } from "@/lib/auth";

export function BusinessDetailsGate({ children }: { children: ReactNode }) {
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (!session?.organization?.businessDetailsRequired) return;
    void validateStoredSession({ force: true }).then((checked) => {
      if (checked?.organization?.businessDetailsRequired) router.replace(`/signup/business?next=${encodeURIComponent(pathname)}`);
    });
  }, [pathname, router, session?.organization?.businessDetailsRequired]);
  if (session?.organization?.businessDetailsRequired) return <div className="grid min-h-screen place-items-center text-sm text-slate-600">Opening business details…</div>;
  return children;
}
