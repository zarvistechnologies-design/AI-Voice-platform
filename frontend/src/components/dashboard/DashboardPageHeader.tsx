"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { billingApi } from "@/lib/billing";
import { getServerSession, getSession, subscribeToSession } from "@/lib/auth";

type DashboardPageHeaderProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  bordered?: boolean;
};

function creditLabel(balance: number | null, currency: string) {
  if (balance === null) return "Credits";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: balance % 1 === 0 ? 0 : 2,
    }).format(balance);
  } catch {
    return `${balance.toFixed(2)} credits`;
  }
}

function DashboardWorkspaceBar() {
  const session = useSyncExternalStore(
    subscribeToSession,
    getSession,
    getServerSession,
  );
  const [credit, setCredit] = useState<{
    balance: number;
    currency: string;
  } | null>(null);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    void billingApi
      .summary()
      .then((summary) => {
        if (!cancelled)
          setCredit({
            balance: summary.wallet.balanceCredits,
            currency: summary.wallet.currency,
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

  return (
    <div className="dashboard-workspace-bar border-b border-[#dbe4e1] bg-white px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-12 w-full max-w-[1500px] items-center justify-between gap-4">
        <Link
          className="group flex min-w-0 items-center gap-2 text-sm font-semibold text-[#20342e]"
          href="/dashboard/settings"
          title="Workspace settings"
        >
          <span className="truncate">{workspaceName}</span>
          <svg
            className="size-4 shrink-0 fill-none stroke-current stroke-2 text-[#8b8e9f] transition group-hover:text-[#0e6f62]"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="m7 10 5 5 5-5" />
          </svg>
        </Link>
        <Link
          className="group inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#dfe7e4] bg-[#f7f9f8] px-3 py-1.5 text-sm font-bold text-[#123d35] transition hover:border-[#9fcfc3] hover:bg-[#edf7f4]"
          href="/dashboard/billing"
          title="Open billing"
        >
          <span
            className="grid size-5 place-items-center rounded-md bg-white text-[#0e6f62] shadow-sm"
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
            {creditLabel(credit?.balance ?? null, credit?.currency ?? "USD")}
          </span>
        </Link>
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
}: DashboardPageHeaderProps) {
  return (
    <header
      className={`dashboard-page-header sticky top-0 z-30 bg-white ${bordered ? "border-b border-[#dbe4e1]" : ""}`}
    >
      <DashboardWorkspaceBar />
      <div className="dashboard-page-header-inner mx-auto w-full max-w-[1500px] px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-h-16 flex-col justify-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            {eyebrow ? (
              <div className="text-[10px] font-bold uppercase leading-4 tracking-[0.18em] text-[#0e6f62]">
                {eyebrow}
              </div>
            ) : null}
            <h1 className="m-0 mt-1 min-w-0 text-2xl font-semibold leading-8 tracking-[-0.02em] text-[#171821]">
              {title}
            </h1>
            {description ? (
              <p className="m-0 mt-1 max-w-3xl text-sm leading-5 text-[#60716c]">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2 [&>a]:min-h-10 [&>a]:rounded-xl [&>button]:min-h-10 [&>button]:rounded-xl">
              {actions}
            </div>
          ) : null}
        </div>
        {meta ? (
          <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2">
            {meta}
          </div>
        ) : null}
      </div>
    </header>
  );
}
