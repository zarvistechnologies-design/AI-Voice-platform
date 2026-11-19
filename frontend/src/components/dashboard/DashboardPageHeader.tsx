"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { billingApi } from "@/lib/billing";
import { getServerSession, getSession, logoutSession, subscribeToSession } from "@/lib/auth";

export type DashboardPageHeaderProps = {
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  bordered?: boolean;
  compact?: boolean;
  workspaceBarOnly?: boolean;
};

function creditLabel(balance: number | null) {
  if (balance === null) return "Credits";
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: balance % 1 === 0 ? 0 : 2,
    }).format(balance);
  } catch {
    return `${balance.toFixed(2)} credits`;
  }
}

export function DashboardWorkspaceBar() {
  const router = useRouter();
  const session = useSyncExternalStore(
    subscribeToSession,
    getSession,
    getServerSession,
  );
  const [credit, setCredit] = useState<{
    balance: number;
  } | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("vozon_dashboard_theme");
      const isDark = saved === "dark";
      setDarkMode(isDark);
      document.documentElement.setAttribute("data-dashboard-theme", isDark ? "dark" : "light");
    } catch {
      /* localStorage may be unavailable */
    }
  }, []);

  function toggleTheme() {
    setDarkMode((prev) => {
      const next = !prev;
      const value = next ? "dark" : "light";
      document.documentElement.setAttribute("data-dashboard-theme", value);
      try {
        localStorage.setItem("vozon_dashboard_theme", value);
      } catch {
        /* localStorage may be unavailable */
      }
      return next;
    });
  }

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    void billingApi
      .summary()
      .then((summary) => {
        if (!cancelled)
          setCredit({
            balance: summary.wallet.currency.toUpperCase() === "INR"
              ? summary.wallet.balanceCredits
              : summary.wallet.balanceCredits * (summary.inrPerUsd ?? 96.5),
          });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [session]);

  if (!session) return null;
  const workspaceName =
    session.organization?.name || `${session.name}'s workspace`;
  const userInitials = session.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  return (
    <div className="dashboard-workspace-bar border-b border-[#eaeaea] bg-white px-5 sm:px-6 lg:px-7">
      <div className="flex h-12 w-full items-center justify-between gap-4">
        <div className="flex min-w-0 items-center">
          <Link
            className="group flex min-w-0 items-center gap-1.5 py-1 text-[13px] font-semibold text-[#171717] transition hover:opacity-70"
            href="/dashboard/settings"
            title="Workspace settings"
          >
            <span className="truncate max-w-[180px] sm:max-w-[320px]">
              {workspaceName}
            </span>
            <svg
              className="size-3.5 shrink-0 fill-none stroke-current stroke-2 text-[#71717a] transition group-hover:text-[#171717]"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="m7 10 5 5 5-5" />
            </svg>
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[#eaeaea] bg-[#fafafa] px-2.5 py-1 text-[12px] font-medium tabular-nums text-[#171717] transition hover:border-[#d4d4d8] hover:bg-[#f4f4f5]"
            href="/dashboard/billing"
            title="Open billing"
          >
            <span
              className="grid size-3.5 place-items-center text-[#2563eb]"
              aria-hidden="true"
            >
              <svg
                className="size-3.5 fill-none stroke-current stroke-[1.8]"
                viewBox="0 0 24 24"
              >
                <path d="M4 7.5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
                <path d="M4 9V6.5a2 2 0 0 1 2-2h10" />
                <path d="M16 13.5h.01" />
              </svg>
            </span>
            <span>
              {creditLabel(credit?.balance ?? null)}
            </span>
          </Link>

          <span className="hidden h-4 w-px bg-[#eaeaea] sm:block" aria-hidden="true" />

          <button
            type="button"
            onClick={toggleTheme}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="grid size-7 shrink-0 place-items-center rounded-md border border-[#eaeaea] bg-white text-[#52525b] transition hover:border-[#d4d4d8] hover:bg-[#f4f4f5] hover:text-[#171717]"
          >
            {darkMode ? (
              <svg className="size-3.5 fill-none stroke-current stroke-[1.9]" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg className="size-3.5 fill-none stroke-current stroke-[1.9]" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>

          <Link
            href="/dashboard/profile"
            title={`${session.name} (${session.email})`}
            className="group inline-flex items-center gap-2 rounded-md px-1.5 py-1 transition hover:bg-[#f4f4f5]"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#171717] text-[10px] font-semibold text-white transition group-hover:bg-[#2563eb]">
              {userInitials}
            </span>
            <span className="hidden max-w-[140px] truncate text-[12.5px] font-medium text-[#171717] sm:inline">
              {session.name}
            </span>
          </Link>

          <button
            type="button"
            title="Log out"
            aria-label="Log out"
            onClick={() => void logoutSession().then(() => router.replace("/login"))}
            className="grid size-7 shrink-0 place-items-center rounded-md border border-[#eaeaea] bg-white text-[#71717a] transition hover:border-[#d4d4d8] hover:bg-[#f4f4f5] hover:text-[#171717]"
          >
            <svg
              className="size-3.5 fill-none stroke-current stroke-[1.9]"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M10 17l5-5-5-5M15 12H3" />
              <path d="M13 3h5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function DashboardPageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta,
  bordered = true,
  compact = false,
  workspaceBarOnly = false,
}: DashboardPageHeaderProps) {
  if (workspaceBarOnly) {
    return (
      <header
        className="dashboard-page-header sticky top-0 z-30 bg-white"
      >
        <DashboardWorkspaceBar />
      </header>
    );
  }

  return (
    <header
      className="dashboard-page-header sticky top-0 z-30 bg-[#fafafa]"
    >
      <DashboardWorkspaceBar />
      <div className={`dashboard-page-header-inner w-full px-5 sm:px-6 lg:px-7 ${compact ? "pt-3 pb-1" : "pt-4 pb-1"}`}>
        <div className={`flex flex-col justify-center gap-3 sm:flex-row sm:items-center sm:justify-between ${compact ? "min-h-10" : "min-h-12"}`}>
          <div className="min-w-0">
            {eyebrow ? (
              <div className="text-[10px] font-semibold uppercase leading-4 tracking-[0.14em] text-[#71717a]">
                {eyebrow}
              </div>
            ) : null}
            <h1 className="m-0 mt-0.5 min-w-0 text-[18px] font-semibold leading-6 tracking-[-0.025em] text-[#171717]">
              {title}
            </h1>
            {description ? (
              <p className="m-0 mt-0.5 max-w-3xl text-[12.5px] leading-4.5 text-[#666666]">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2 [&>a]:h-8 [&>a]:min-h-8 [&>a]:rounded-md [&>a]:px-3 [&>a]:text-[12.5px] [&>button]:h-8 [&>button]:min-h-8 [&>button]:rounded-md [&>button]:px-3 [&>button]:text-[12.5px]">
              {actions}
            </div>
          ) : null}
        </div>
        {meta ? (
          <div className="mt-2.5 flex min-w-0 flex-wrap items-center gap-2">
            {meta}
          </div>
        ) : null}
      </div>
    </header>
  );
}
