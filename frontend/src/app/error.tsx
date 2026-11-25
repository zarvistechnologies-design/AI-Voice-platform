"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 py-16 text-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
          Something went wrong
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
          This page hit an unexpected error
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Try reloading this view. If the issue persists after a deployment, refresh the browser tab to load the latest bundle.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Try again
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Reload page
          </button>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-lg px-3 text-sm font-semibold text-slate-600 hover:text-slate-950"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
