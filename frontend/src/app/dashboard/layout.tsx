import type { Metadata } from "next";
import type { ReactNode } from "react";

import { DashboardNavigationFeedback } from "@/components/dashboard/DashboardNavigationFeedback";
import { DashboardQueryProvider } from "@/components/dashboard/DashboardQueryProvider";

import { requestBrandConfig } from "@/lib/brandServer";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await requestBrandConfig();
  const iconTarget = brand.iconUrl || brand.logoDarkUrl || brand.logoUrl;
  return {
    title: "Dashboard",
    description: `Manage your ${brand.productName} voice agents, calls, campaigns, and workspace.`,
    robots: { index: false, follow: false, nocache: true },
    ...(iconTarget
      ? {
          icons: {
            icon: [{ url: iconTarget }],
            apple: [{ url: iconTarget }],
            shortcut: [{ url: iconTarget }],
          },
        }
      : {}),
  };
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardQueryProvider>
      <div className="dashboard-home-theme min-h-screen bg-[#f7f9f8] text-[#1b1b22]">
        <DashboardNavigationFeedback />
        {children}
      </div>
    </DashboardQueryProvider>
  );
}
