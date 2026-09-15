"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";

import { getSession, subscribeToSession } from "@/lib/auth";
import { getDashboardQueryClient } from "@/lib/dashboardQueryClient";

function sessionCacheScope() {
  const session = getSession();
  return session
    ? JSON.stringify([session.id, session.signedInAt, session.organization?.id ?? ""])
    : "";
}

export function DashboardQueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getDashboardQueryClient();

  useEffect(() => {
    let activeScope = sessionCacheScope();
    return subscribeToSession(() => {
      const nextScope = sessionCacheScope();
      if (nextScope !== activeScope) queryClient.clear();
      activeScope = nextScope;
    });
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
