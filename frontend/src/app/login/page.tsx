import { Suspense } from "react";
import Link from "next/link";

import { LoginForm } from "@/components/auth/LoginForm";
import { BrandLogo } from "@/components/ui/BrandLogo";

export default function LoginPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#111827] px-4 text-white sm:px-6">
      <header className="mx-auto flex min-h-[72px] w-full max-w-[1280px] items-center justify-between gap-4">
        <BrandLogo />
        <Link className="text-sm font-semibold text-slate-300 hover:text-white" href="/">
          Back to website
        </Link>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-6xl items-center gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)] lg:gap-20">
        <div className="grid max-w-2xl gap-5">
          <span className="app-label text-[var(--app-color-purple)]">
            vozon.ai
          </span>
          <h2 className="app-display-title m-0">
            Manage calls, agents, and workflows from one clean workspace.
          </h2>
          <p className="mt-6 mb-0 max-w-xl text-lg leading-8 text-slate-300">
            Build agents, monitor live calls, review outcomes, and improve every customer conversation from one secure workspace.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {[["Live", "call monitoring"], ["Clear", "handoff context"], ["One", "operating view"]].map(([value, label]) => (
              <div className="border-t border-white/15 pt-4" key={label}>
                <strong className="block text-lg text-cyan-300">{value}</strong>
                <span className="mt-1 block text-sm text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <Suspense fallback={<div className="min-h-[520px] w-full rounded-lg bg-[#0b1220]" />}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
