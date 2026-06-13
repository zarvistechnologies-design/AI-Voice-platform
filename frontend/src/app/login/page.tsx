import { Suspense } from "react";
import Link from "next/link";

import { LoginForm } from "@/components/auth/LoginForm";
import { BrandLogo } from "@/components/ui/BrandLogo";

export default function LoginPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f6ff] px-4 py-5 text-[#171321] sm:px-6">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <BrandLogo />
        <Link
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#ded6f2] bg-white/80 px-3.5 text-sm font-extrabold"
          href="/"
        >
          Back home
        </Link>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-6xl items-center gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)] lg:gap-20">
        <div className="grid max-w-2xl gap-5">
          <span className="text-xs font-black uppercase text-[#6b35e8]">
            AI Voice Platform
          </span>
          <h2 className="m-0 text-[clamp(2.65rem,6vw,5.1rem)] leading-[0.98] font-black">
            Manage calls, agents, and workflows from one clean workspace.
          </h2>
          <p className="m-0 leading-7 text-[#6d647d]">
            Your account is now saved in MongoDB and protected with a backend
            login endpoint.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="min-h-[430px] w-full rounded-lg border border-[#ded6f2] bg-white/90 shadow-[0_24px_70px_rgba(69,37,143,0.16)]" />
          }
        >
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
