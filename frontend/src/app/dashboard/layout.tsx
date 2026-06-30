import type { ReactNode } from "react";

import { DashboardNavigationFeedback } from "@/components/dashboard/DashboardNavigationFeedback";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DashboardNavigationFeedback />
      {children}
    </>
  );
}
