"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled dashboard error:", error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f9f8] px-6 py-16 text-[#1b1b22]">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
          Workspace error
        </p>
        <h1 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
          This dashboard view ran into an error
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Your session is safe. Retry loading this section or return to your agents list.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Retry view
          </button>
          <Link
            href="/dashboard/agents"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Back to agents
          </Link>
        </div>
      </div>
    </main>
  );
}
