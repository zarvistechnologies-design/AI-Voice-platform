import type { ReactNode } from "react";

import { DashboardNavigationFeedback } from "@/components/dashboard/DashboardNavigationFeedback";
import { DashboardQueryProvider } from "@/components/dashboard/DashboardQueryProvider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardQueryProvider>
      <DashboardNavigationFeedback />
      {children}
    </DashboardQueryProvider>
  );
}
