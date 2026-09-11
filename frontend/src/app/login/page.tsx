import Link from "next/link";
import { Suspense } from "react";

import { LoginForm } from "@/components/auth/LoginForm";
import { BrandLogo } from "@/components/ui/BrandLogo";

const capabilities = [
  "Answer every customer call",
  "Qualify and route every lead",
  "Complete work in connected tools",
];

const benefits = [
  ["0.8s", "Average response"],
  ["24/7", "Always available"],
  ["99.9%", "Platform uptime"],
];

export default function LoginPage() {
  return (
    <main className="min-h-[100svh] overflow-x-hidden bg-[#f3f7f6] text-[#14231f] lg:h-[100svh] lg:overflow-y-hidden supports-[height:100dvh]:lg:h-[100dvh]">
      <div className="mx-auto grid min-h-[100svh] w-full min-w-0 max-w-[1440px] gap-4 p-3 sm:p-5 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1.06fr)_minmax(440px,0.94fr)] lg:gap-5 lg:p-6">
        <section className="relative hidden min-h-0 overflow-hidden rounded-[28px] border border-[#d7e5e1] bg-[#eaf5f2] lg:flex lg:flex-col">
          <div className="pointer-events-none absolute -right-32 -top-40 size-[34rem] rounded-full border-[90px] border-white/35" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-56 -left-40 size-[38rem] rounded-full border-[110px] border-[#118778]/[0.045]" aria-hidden="true" />

          <header className="relative z-10 flex min-h-20 items-center justify-between px-[clamp(28px,3vw,48px)]">
            <BrandLogo showWebsiteLogo />
            <span className="rounded-full border border-[#bddbd4] bg-white/75 px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#0e6f62]">
              AI voice platform
            </span>
          </header>

          <div className="relative z-10 flex flex-1 items-center px-[clamp(28px,4vw,64px)] py-8">
            <div className="max-w-[590px]">
              <p className="m-0 text-[11px] font-black uppercase tracking-[0.18em] text-[#0e6f62]">
                Voice automation, simplified
              </p>
              <h1 className="mt-5 max-w-[570px] text-[clamp(2.8rem,4vw,4.35rem)] font-black leading-[0.98] tracking-[-0.055em] text-[#14231f]">
                Build voice agents that <span className="text-[#118778]">move work forward.</span>
              </h1>
              <p className="mt-6 max-w-[520px] text-base leading-7 text-[#52645f] xl:text-lg xl:leading-8">
                Create natural phone conversations that answer questions, qualify customers, and complete the next action.
              </p>

              <ul className="mt-8 grid max-w-[520px] gap-3" aria-label="Platform capabilities">
                {capabilities.map((capability) => (
                  <li className="flex items-center gap-3 text-sm font-bold text-[#30443e]" key={capability}>
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#118778] text-[11px] text-white" aria-hidden="true">&#10003;</span>
                    {capability}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative z-10 mx-[clamp(28px,3vw,48px)] mb-[clamp(28px,4vh,44px)] grid grid-cols-3 overflow-hidden rounded-2xl border border-[#cfe0dc] bg-white/80 shadow-[0_10px_30px_rgba(20,35,31,0.04)] backdrop-blur">
            {benefits.map(([value, label], index) => (
              <div className={`px-4 py-4 ${index ? "border-l border-[#dce8e5]" : ""}`} key={label}>
                <strong className="block text-xl font-black tracking-[-0.03em] text-[#118778] xl:text-2xl">{value}</strong>
                <span className="mt-1 block text-[9px] font-black uppercase tracking-[0.12em] text-[#71817d] xl:text-[10px]">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="relative flex min-h-[calc(100svh-1.5rem)] min-w-0 items-center justify-center overflow-hidden rounded-[24px] border border-[#dbe4e1] bg-white px-5 py-24 shadow-[0_20px_65px_-28px_rgba(20,35,31,0.18)] sm:px-8 lg:min-h-0 lg:rounded-[28px] lg:px-[clamp(38px,4vw,68px)] lg:py-14">
          <div className="absolute inset-x-5 top-5 z-10 flex items-center justify-between lg:inset-x-7 lg:top-6">
            <div className="lg:hidden"><BrandLogo showWebsiteLogo /></div>
            <Link className="ml-auto inline-flex min-h-9 items-center gap-2 rounded-full border border-[#dbe4e1] bg-white px-3.5 text-xs font-bold text-[#52645f] transition hover:border-[#b9d6cf] hover:text-[#14231f]" href="/">
              <span aria-hidden="true">&larr;</span> Back home
            </Link>
          </div>

          <div className="w-full min-w-0 max-w-[440px]">
            <Suspense fallback={<div className="h-[500px] w-full animate-pulse rounded-2xl bg-[#f3f7f6]" />}>
              <LoginForm />
            </Suspense>
          </div>
        </section>
      </div>
    </main>
  );
}
