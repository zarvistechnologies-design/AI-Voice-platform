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
    <main className="h-[100svh] overflow-hidden bg-black text-white supports-[height:100dvh]:h-[100dvh]">
      <div className="mx-auto grid h-full w-full max-w-[1540px] gap-4 p-3 sm:p-4 lg:grid-cols-[minmax(0,1.48fr)_minmax(390px,0.72fr)] lg:gap-5 lg:p-5">
        <section className="relative hidden min-h-0 overflow-hidden rounded-[28px] border border-white/10 bg-[#020706] lg:block">
          <Image
            alt="AI voice agent operating from a laptop"
            className="object-cover object-center opacity-90"
            fill
            priority
            sizes="(min-width: 1024px) 68vw, 0vw"
            src="/images/login-voice-agent-hero.png"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.68)_32%,rgba(0,0,0,0.06)_68%),linear-gradient(0deg,rgba(0,0,0,0.86)_0%,transparent_38%)]" />

          <div className="absolute inset-x-0 top-0 z-10 flex h-20 items-center justify-between px-[clamp(24px,3vw,44px)]">
            <BrandLogo showWebsiteLogo />
            <span className="inline-flex items-center gap-2 rounded-full border border-[#45ddce]/20 bg-black/40 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-[#75fff0] backdrop-blur-md">
              <span className="size-1.5 rounded-full bg-[#45ddce] shadow-[0_0_10px_#45ddce]" />
              Voice AI online
            </span>
          </div>

          <div className="absolute left-[clamp(24px,3vw,44px)] top-[20%] z-10 max-w-[470px]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#45ddce]/25 bg-[#45ddce]/[0.07] px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#75fff0] backdrop-blur">
              <span className="grid size-5 place-items-center rounded-md bg-[#45ddce]/15 text-xs">✦</span>
              AI voice agent builder
            </div>
            <h1 className="m-0 text-[clamp(2.6rem,4.5vw,4.8rem)] font-black leading-[0.94] tracking-[-0.055em]">
              Build voice agents<br />
              <span className="text-[#45ddce]">that get things done.</span>
            </h1>
            <p className="mt-5 max-w-[390px] text-sm leading-6 text-white/52 xl:text-base xl:leading-7">
              Answer every call, qualify every lead, and complete customer workflows with natural AI conversations.
            </p>

            <div className="login-capability-tags mt-6 flex max-w-[450px] flex-wrap gap-2">
              {["Inbound calls", "Lead qualification", "Appointment booking"].map((capability) => (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/45 px-3 py-2 text-[10px] font-bold text-white/62 backdrop-blur-md" key={capability}>
                  <span className="size-1.5 rounded-full bg-[#45ddce] shadow-[0_0_8px_#45ddce]" />
                  {capability}
                </span>
              ))}
            </div>
          </div>

          <div className="absolute inset-x-[clamp(24px,3vw,44px)] bottom-[clamp(20px,3vh,32px)] z-10 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10 bg-black/65 backdrop-blur-xl">
            {benefits.map(([value, label], index) => (
              <div className={`px-5 py-4 text-center ${index ? "border-l border-white/10" : ""}`} key={label}>
                <strong className="block text-xl font-black text-[#75fff0] xl:text-2xl">{value}</strong>
                <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.12em] text-white/38">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="relative flex min-h-0 items-center justify-center rounded-[28px] border border-white/10 bg-[#050908] px-4 py-3 sm:px-7 lg:px-[clamp(24px,3vw,42px)]">
          <div className="absolute inset-0 overflow-hidden rounded-[28px]">
            <div className="absolute -right-32 -top-32 size-72 rounded-full bg-[#45ddce]/[0.06] blur-3xl" />
          </div>

          <div className="absolute inset-x-5 top-4 z-10 flex items-center justify-between lg:hidden">
            <BrandLogo showWebsiteLogo />
            <Link className="text-xs font-bold text-white/45 hover:text-white" href="/">Back home</Link>
          </div>
          <Link className="absolute right-6 top-5 z-10 hidden text-xs font-bold text-white/38 transition hover:text-white lg:block" href="/">← Back home</Link>

          <Suspense fallback={<div className="h-[500px] w-full max-w-[440px] rounded-2xl bg-white/[0.025]" />}>
            <LoginForm />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
