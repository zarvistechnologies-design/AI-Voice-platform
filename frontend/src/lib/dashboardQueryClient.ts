import { QueryClient } from "@tanstack/react-query";

const DASHBOARD_QUERY_GC_TIME_MS = 60 * 60_000;

function createDashboardQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: DASHBOARD_QUERY_GC_TIME_MS,
        networkMode: "always",
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        retry: false,
      },
      mutations: {
        networkMode: "always",
        retry: false,
      },
    },
  });
}

let browserDashboardQueryClient: QueryClient | undefined;

export function getDashboardQueryClient() {
  if (typeof window === "undefined") return createDashboardQueryClient();
  browserDashboardQueryClient ??= createDashboardQueryClient();
  return browserDashboardQueryClient;
}
