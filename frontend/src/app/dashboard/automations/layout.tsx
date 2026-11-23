import type { ReactNode } from "react";
import { DashboardAuthBoundary } from "@/components/dashboard/DashboardAuthBoundary";
import "./automation.css";
import "./theme.css";
export default function Layout({ children }: { children: ReactNode }) {
  return <DashboardAuthBoundary>{children}</DashboardAuthBoundary>;
}
