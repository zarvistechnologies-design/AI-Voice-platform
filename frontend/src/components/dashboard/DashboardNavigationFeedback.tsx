"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigationEvent = "dashboard-navigation-start";

export function announceDashboardNavigation(href: string, from: string) {
  window.dispatchEvent(new CustomEvent(navigationEvent, { detail: { href, from } }));
}

export function DashboardNavigationFeedback() {
  const pathname = usePathname();
  const [pending, setPending] = useState({ href: "", from: "" });

  useEffect(() => {
    function handleNavigation(event: Event) {
      const detail = (event as CustomEvent<{ href?: string; from?: string }>).detail;
      setPending({
        href: detail?.href ?? "dashboard page",
        from: detail?.from ?? pathname,
      });
    }

    window.addEventListener(navigationEvent, handleNavigation);
    return () => window.removeEventListener(navigationEvent, handleNavigation);
  }, [pathname]);

  useEffect(() => {
    if (!pending.href) return undefined;
    const timeout = window.setTimeout(() => setPending({ href: "", from: "" }), 10_000);
    return () => window.clearTimeout(timeout);
  }, [pending]);

  if (!pending.href || pending.from !== pathname) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100]" role="status" aria-live="polite">
      <div className="h-1 overflow-hidden bg-cyan-100">
        <div className="h-full w-2/3 animate-pulse rounded-r-full bg-[#06b6c8] shadow-[0_0_12px_rgba(6,182,200,0.65)]" />
      </div>
      <span className="sr-only">Loading {pending.href}</span>
    </div>
  );
}
