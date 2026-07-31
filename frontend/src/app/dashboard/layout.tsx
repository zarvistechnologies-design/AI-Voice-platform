import type { Metadata } from "next";
import type { ReactNode } from "react";

import { DashboardNavigationFeedback } from "@/components/dashboard/DashboardNavigationFeedback";
import { DashboardQueryProvider } from "@/components/dashboard/DashboardQueryProvider";

export const metadata: Metadata = {
  title: "Dashboard | Vozon",
  description: "Manage your Vozon voice agents, calls, campaigns, and workspace.",
  robots: { index: false, follow: false, nocache: true },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardQueryProvider>
      <div className="dashboard-home-theme min-h-screen bg-black text-white">
        <DashboardNavigationFeedback />
        {children}
      </div>
    </DashboardQueryProvider>
  );
}
