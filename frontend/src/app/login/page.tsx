"use client";

import Link from "next/link";
import { Suspense } from "react";

import { LoginForm } from "@/components/auth/LoginForm";
import { useBrand } from "@/components/branding/BrandProvider";
import { BrandLogo } from "@/components/ui/BrandLogo";
import "@/components/auth/LoginPageTheme.css";

const capabilities = [
  "Answer every customer call without wait times",
  "Qualify and route every lead with context",
  "Complete work across CRM, WhatsApp & calendars",
];

const benefits = [
  ["0.8s", "Average response"],
  ["24/7", "Always available"],
  ["99.9%", "Platform uptime"],
];

export default function LoginPage() {
  const brand = useBrand();
  const isWhiteLabel = brand.source === "white_label";
  const websiteHref = isWhiteLabel ? brand.support.websiteUrl : "";

  return (
    <main className="login-page-theme min-h-[100svh] overflow-x-hidden bg-[#f8f9fb] text-[#111113] lg:h-[100svh] lg:overflow-y-hidden supports-[height:100dvh]:lg:h-[100dvh]">
      <div className="mx-auto grid min-h-[100svh] w-full min-w-0 max-w-[1440px] gap-4 p-3 sm:p-5 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] lg:gap-5 lg:p-6">
        {/* Left Editorial Showcase Stage (Clean B&W Theme, No Dots, No Blue) */}
        <section className="relative hidden min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_16px_40px_rgba(15,23,42,0.04)] lg:flex lg:flex-col lg:justify-between lg:p-10">
          <header className="relative z-10 flex items-center justify-between">
            <div className="landing-header-logo flex items-center shrink-0">
              <BrandLogo showWebsiteLogo />
            </div>
            <span className="rounded-full border border-black bg-white px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-black shadow-2xs">
              AI voice platform
            </span>
          </header>

          <div className="relative z-10 my-auto py-6">
            <div className="max-w-[560px]">
              <p className="m-0 text-[11px] font-bold uppercase tracking-[0.18em] text-black">
                Voice automation, simplified
              </p>
              <h1 className="mt-4 max-w-[540px] text-[clamp(2.2rem,3.2vw,3.3rem)] font-bold leading-[1.1] tracking-[-0.04em] text-black">
                Build voice agents that move work forward.
              </h1>
              <p className="mt-4 max-w-[490px] text-[15px] leading-relaxed text-slate-600">
                Create natural phone conversations that answer questions, qualify customers, and complete the next action in real time.
              </p>

              <ul className="mt-7 grid max-w-[500px] gap-3" aria-label="Platform capabilities">
                {capabilities.map((capability) => (
                  <li className="flex items-center gap-3 text-sm font-semibold text-slate-800" key={capability}>
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-black text-[10px] font-bold text-white shadow-2xs" aria-hidden="true">&#10003;</span>
                    {capability}
                  </li>
                ))}
              </ul>

              <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-2xs">
                <span className="flex h-3.5 items-center gap-1" aria-hidden="true">
                  {[10, 16, 12, 18, 14, 8].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 animate-pulse rounded-full bg-black"
                      style={{ height: h, animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  Multichannel Agent Engine <span className="font-normal text-slate-500">· Sub-88ms Latency</span>
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-3 divide-x divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            {benefits.map(([value, label]) => (
              <div className="px-4 py-2 first:pl-2" key={label}>
                <strong className="block text-xl font-bold tracking-tight text-black">{value}</strong>
                <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Right Form Card */}
        <section className="relative flex min-h-[calc(100svh-1.5rem)] min-w-0 items-center justify-center overflow-y-auto rounded-2xl border border-slate-200 bg-white px-6 py-14 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:px-10 lg:min-h-0 lg:p-12">
          <div className="absolute inset-x-6 top-6 z-10 flex items-center justify-between sm:inset-x-8">
            <div className="landing-header-logo lg:hidden"><BrandLogo showWebsiteLogo /></div>
            {!isWhiteLabel ? (
              <Link className="ml-auto inline-flex min-h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-100 hover:text-slate-900" href="/">
                <span aria-hidden="true">&larr;</span> Back home
              </Link>
            ) : websiteHref ? (
              <a className="ml-auto inline-flex min-h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-100 hover:text-slate-900" href={websiteHref} rel="noopener noreferrer" target="_blank">
                Visit website <span aria-hidden="true">&rarr;</span>
              </a>
            ) : null}
          </div>

          <div className="mx-auto my-auto w-full min-w-0 max-w-[420px]">
            <Suspense fallback={<div className="h-[460px] w-full animate-pulse rounded-2xl bg-slate-100" />}>
              <LoginForm />
            </Suspense>
          </div>
        </section>
      </div>
    </main>
  );
}
