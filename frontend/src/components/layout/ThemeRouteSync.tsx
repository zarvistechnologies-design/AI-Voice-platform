"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ThemeRouteSync() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.setAttribute("data-dashboard-theme", "light");
    document.documentElement.classList.remove("dark");
    try {
      localStorage.removeItem("vozon_dashboard_theme");
    } catch {
      /* localStorage may be unavailable */
    }
  }, [pathname]);

  return null;
}
