import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { LoginForm } from "@/components/auth/LoginForm";
import { BrandLogo } from "@/components/ui/BrandLogo";

const benefits = [
  ["0.8s", "Avg. response"],
  ["24/7", "Always available"],
  ["99.9%", "Platform uptime"],
];

export default function LoginPage() {
  return (
    <main className="h-[100svh] overflow-hidden bg-[#f8fafc] text-slate-900 supports-[height:100dvh]:h-[100dvh]">
      <div className="mx-auto grid h-full w-full max-w-[1540px] gap-4 p-3 sm:p-4 lg:grid-cols-[minmax(0,1.48fr)_minmax(390px,0.72fr)] lg:gap-5 lg:p-5">
        <section className="relative hidden min-h-0 overflow-hidden rounded-[28px] border border-slate-200/90 bg-gradient-to-br from-[#ffffff] via-[#f7faf9] to-[#edf7f5] shadow-[0_10px_35px_rgba(0,0,0,0.03)] lg:block">
          <Image
            alt="AI voice agent operating from a laptop"
            className="object-cover object-center opacity-15 mix-blend-multiply"
            fill
            priority
            sizes="(min-width: 1024px) 68vw, 0vw"
            src="/images/login-voice-agent-hero.png"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-slate-50/85 to-[#edf7f5]/80" />

          <div className="absolute inset-x-0 top-0 z-10 flex h-20 items-center justify-between px-[clamp(24px,3vw,44px)]">
            <BrandLogo showWebsiteLogo />
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-white/90 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#0d7970] shadow-xs backdrop-blur-md">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#108D82] opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-[#108D82]" />
              </span>
              Voice AI online
            </span>
          </div>

          <div className="absolute left-[clamp(24px,3vw,44px)] top-[18%] z-10 max-w-[490px]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/25 bg-teal-50/90 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#0d7970] shadow-xs backdrop-blur">
              <span className="grid size-4 place-items-center rounded bg-teal-500/15 text-xs text-[#108D82]">✦</span>
              AI Voice Agent Platform
            </div>
            <h1 className="m-0 text-[clamp(2.5rem,4.2vw,4.4rem)] font-black leading-[0.96] tracking-[-0.05em] text-slate-900">
              Build voice agents<br />
              <span className="bg-gradient-to-r from-[#108D82] to-[#0ea5e9] bg-clip-text text-transparent">
                that get things done.
              </span>
            </h1>
            <p className="mt-4 max-w-[410px] text-sm leading-6 text-slate-600 xl:text-base xl:leading-7">
              Answer every call, qualify every lead, and complete customer workflows with natural, ultra-low latency voice AI conversations.
            </p>

            <div className="login-capability-tags mt-6 flex max-w-[460px] flex-wrap gap-2">
              {["Inbound calls", "Lead qualification", "Appointment booking", "Custom tools & CRM"].map((capability) => (
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-xs backdrop-blur-md" key={capability}>
                  <span className="size-1.5 rounded-full bg-[#108D82]" />
                  {capability}
                </span>
              ))}
            </div>
          </div>

          <div className="absolute inset-x-[clamp(24px,3vw,44px)] bottom-[clamp(20px,3vh,32px)] z-10 grid grid-cols-3 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 shadow-sm backdrop-blur-xl">
            {benefits.map(([value, label], index) => (
              <div className={`px-5 py-4 text-center ${index ? "border-l border-slate-200/80" : ""}`} key={label}>
                <strong className="block text-xl font-black text-[#108D82] xl:text-2xl">{value}</strong>
                <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="relative flex min-h-0 items-center justify-center rounded-[28px] border border-slate-200/90 bg-white px-4 py-3 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.06)] sm:px-7 lg:px-[clamp(24px,3vw,42px)]">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
            <div className="absolute -right-28 -top-28 size-64 rounded-full bg-teal-100/40 blur-3xl" />
            <div className="absolute -bottom-28 -left-28 size-64 rounded-full bg-emerald-100/30 blur-3xl" />
          </div>

          <div className="absolute inset-x-5 top-4 z-10 flex items-center justify-between lg:hidden">
            <BrandLogo showWebsiteLogo />
            <Link className="text-xs font-semibold text-slate-500 hover:text-slate-900" href="/">Back home</Link>
          </div>
          <Link className="absolute right-6 top-5 z-10 hidden text-xs font-semibold text-slate-500 transition hover:text-slate-900 lg:block" href="/">← Back home</Link>

          <Suspense fallback={<div className="h-[500px] w-full max-w-[440px] rounded-2xl bg-slate-100/60 animate-pulse" />}>
            <LoginForm />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
