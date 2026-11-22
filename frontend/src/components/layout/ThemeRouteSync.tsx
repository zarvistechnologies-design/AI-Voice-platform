"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ThemeRouteSync() {
  const pathname = usePathname();

  useEffect(() => {
    const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
    let isDark = false;
    if (isDashboard) {
      try {
        const saved = localStorage.getItem("vozon_dashboard_theme");
        isDark = saved !== "light";
      } catch {
        isDark = true;
      }
    }
    document.documentElement.setAttribute("data-dashboard-theme", isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDark);
  }, [pathname]);

  return null;
}
