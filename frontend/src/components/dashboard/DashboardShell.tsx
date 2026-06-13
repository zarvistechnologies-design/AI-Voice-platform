"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { BrandLogo } from "@/components/ui/BrandLogo";
import {
  clearSession,
  getServerSession,
  getSession,
  subscribeToSession,
  validateStoredSession,
} from "@/lib/auth";

const navItems = ["Dashboard", "Agents", "Calls", "Workflows", "Knowledge", "Settings"];

const metrics = [
  { label: "Total calls", value: "1,248", detail: "+12% this week" },
  { label: "Active agents", value: "8", detail: "3 live now" },
  { label: "Avg response", value: "620ms", detail: "Stable" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function DashboardShell() {
  const router = useRouter();
  const session = useSyncExternalStore(
    subscribeToSession,
    getSession,
    getServerSession,
  );

  useEffect(() => {
    if (!session) {
      router.replace("/login?next=/dashboard");
      return;
    }

    void validateStoredSession();
  }, [router, session]);

  function handleLogout() {
    clearSession();
    router.replace("/login");
  }

  if (!session) {
    return (
      <main className="grid min-h-screen place-items-center gap-3 bg-[#f8f6ff] font-black text-[#342d42]">
        <span className="size-9 animate-spin rounded-full border-3 border-[#ded6f2] border-t-[#6b35e8]" />
        Loading dashboard
      </main>
    );
  }

  return (
    <main className="grid min-h-screen bg-[#f8f6ff] text-[#171321] lg:grid-cols-[276px_minmax(0,1fr)]">
      <aside className="grid gap-7 border-b border-[#ded6f2] bg-white/85 p-4 backdrop-blur-lg lg:sticky lg:top-0 lg:h-screen lg:grid-rows-[auto_1fr_auto] lg:border-r lg:border-b-0 lg:p-5">
        <div className="flex items-center">
          <BrandLogo />
        </div>

        <nav
          className="flex gap-2 overflow-x-auto pb-1 lg:grid lg:content-start lg:overflow-visible"
          aria-label="Dashboard navigation"
        >
          {navItems.map((item) => (
            <Link
              className={`flex min-h-11 min-w-max items-center gap-2.5 rounded-lg border px-3 font-extrabold transition ${
                item === "Dashboard"
                  ? "border-[#ded6f2] bg-[#f1edff] text-[#43208f]"
                  : "border-transparent text-[#6d647d] hover:border-[#ded6f2] hover:bg-[#f1edff] hover:text-[#43208f]"
              }`}
              href="/dashboard"
              key={item}
            >
              <span
                className="grid size-7 place-items-center rounded-lg bg-[#f1edff] text-xs font-black text-[#6b35e8]"
                aria-hidden="true"
              >
                {item.slice(0, 1)}
              </span>
              {item}
            </Link>
          ))}
        </nav>

        <div className="grid gap-1.5 rounded-lg border border-[#ded6f2] bg-white p-4">
          <span className="text-xs font-black uppercase text-[#6d647d]">Workspace</span>
          <strong className="text-[#171321]">Demo environment</strong>
        </div>
      </aside>

      <section className="grid content-start gap-5 p-4 sm:p-6">
        <header className="flex flex-col items-stretch justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <span className="text-xs font-black uppercase text-[#6b35e8]">Overview</span>
            <h1 className="mt-1 mb-0 text-[clamp(2.2rem,4vw,3.6rem)] leading-none font-black">
              Dashboard
            </h1>
          </div>

          <div className="flex w-full min-w-0 flex-wrap items-center gap-2.5 rounded-lg border border-[#ded6f2] bg-white p-2 shadow-[0_12px_38px_rgba(69,37,143,0.08)] lg:w-auto lg:min-w-[360px] lg:flex-nowrap">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#171321] text-xs font-black text-white">
              {getInitials(session.name)}
            </span>
            <div className="min-w-0 flex-1">
              <strong className="block truncate">{session.name}</strong>
              <small className="block truncate text-[#6d647d]">{session.email}</small>
            </div>
            <button
              className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border-0 bg-[#6b35e8] px-3 font-black text-white sm:w-auto"
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <section
          className="grid grid-cols-1 gap-3.5 md:grid-cols-3"
          aria-label="Workspace metrics"
        >
          {metrics.map((metric) => (
            <article
              className="grid min-h-32 gap-2 rounded-lg border border-[#ded6f2] bg-white/90 p-4.5 shadow-[0_16px_50px_rgba(69,37,143,0.08)]"
              key={metric.label}
            >
              <span className="font-extrabold text-[#6d647d]">{metric.label}</span>
              <strong className="text-[clamp(1.8rem,3vw,2.6rem)] leading-none font-black">
                {metric.value}
              </strong>
              <small className="self-end font-extrabold text-[#1d9b6c]">{metric.detail}</small>
            </article>
          ))}
        </section>

        <section className="grid items-stretch gap-4.5 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.75fr)]">
          <article className="grid min-h-[340px] content-start items-center gap-5.5 rounded-lg border border-[#ded6f2] bg-white/90 p-5.5 shadow-[0_16px_50px_rgba(69,37,143,0.08)] md:grid-cols-[minmax(0,0.95fr)_minmax(260px,0.78fr)]">
            <div>
              <span className="text-xs font-black uppercase text-[#6b35e8]">Voice Agent</span>
              <h2 className="mt-1 mb-2.5 text-[clamp(1.45rem,2.4vw,2.1rem)] leading-tight font-black">
                Starter workspace
              </h2>
              <p className="m-0 leading-7 text-[#6d647d]">
                Your dashboard shell is ready. Add agent lists, call logs, billing,
                analytics, and settings pages from the sidebar when you are ready.
              </p>
            </div>

            <div className="grid min-h-[230px] gap-4.5 rounded-lg border border-[#ded6f2] bg-gradient-to-br from-[#f1edff] to-white p-4.5">
              <div className="grid grid-cols-[12px_minmax(0,1fr)_auto] items-center gap-2.5">
                <span className="size-2.5 rounded-full bg-[#1d9b6c] ring-4 ring-[#1d9b6c]/15" />
                <strong>Sales Assistant</strong>
                <small className="inline-flex min-h-7 items-center rounded-full bg-emerald-50 px-2.5 font-black text-[#1d9b6c]">
                  Live
                </small>
              </div>
              <div className="grid content-center gap-3">
                <span className="block h-11 rounded-lg bg-[#f1edff]" />
                <span className="block h-11 w-4/5 rounded-lg bg-[#f1edff]" />
                <span className="block h-11 w-3/5 rounded-lg bg-[#f1edff]" />
              </div>
            </div>
          </article>

          <article className="grid content-start gap-4.5 rounded-lg border border-[#ded6f2] bg-white/90 p-5.5 shadow-[0_16px_50px_rgba(69,37,143,0.08)]">
            <span className="text-xs font-black uppercase text-[#6b35e8]">Next step</span>
            <h2 className="m-0 text-[clamp(1.45rem,2.4vw,2.1rem)] leading-tight font-black">
              Build pages later
            </h2>
            <p className="m-0 leading-7 text-[#6d647d]">
              For now this page stays intentionally simple: sidebar, account state,
              metrics, and one clean content area.
            </p>
          </article>
        </section>
      </section>
    </main>
  );
}
