import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";

type OverviewItem = { title: string; summary: string; href: string; meta: string };
type OverviewGroup = { title: string; description: string; items: readonly OverviewItem[] };
type MarketingOverviewPageProps = {
  eyebrow: string;
  title: string;
  summary: string;
  groups: readonly OverviewGroup[];
  proof: readonly { value: string; label: string }[];
};

const callRows = [
  ["Inbound support", "Answering", "00:42"],
  ["Lead qualification", "Collecting details", "01:18"],
  ["Appointment reminder", "Connected", "00:27"],
];

export function MarketingOverviewPage({ eyebrow, title, summary, groups, proof }: MarketingOverviewPageProps) {
  return (
    <SiteLayout>
      <div className="bg-[#111827] text-white">
        <section className="relative overflow-hidden bg-[#111827] px-4 pt-36 pb-20 sm:px-6 lg:px-8 lg:pt-40">
          <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:64px_64px]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,24,39,0.15)_0%,rgba(17,24,39,0.78)_68%,#111827_100%)]" />

          <div className="relative mx-auto grid min-h-[540px] max-w-[1500px] gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(480px,1.05fr)] lg:items-center">
            <div className="max-w-3xl">
              <p className="m-0 text-sm font-extrabold text-cyan-200">{eyebrow}</p>
              <h1 className="m-0 mt-8 text-4xl leading-tight font-semibold text-white sm:text-6xl sm:leading-none 2xl:text-7xl">
                {title}
              </h1>
              <p className="m-0 mt-8 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">{summary}</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link className="inline-flex min-h-14 items-center justify-center rounded-lg bg-[#08b8c8] px-8 font-extrabold text-slate-950 shadow-[0_18px_48px_rgba(8,184,200,0.24)] hover:bg-cyan-300" href="/dashboard">
                  Try for free
                </Link>
                <Link className="inline-flex min-h-14 items-center justify-center rounded-lg border border-white/16 bg-white/5 px-8 font-extrabold text-white hover:bg-white/10" href="/#contact">
                  Contact sales
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-[#0b1120]/90 p-4 shadow-[0_26px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="m-0 text-sm font-semibold">Live voice operations</p>
                  <p className="m-0 mt-1 text-xs text-slate-400">Calls, outcomes, and handoffs</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-300/10 px-3 py-1.5 text-xs font-extrabold text-emerald-200">
                  <span className="size-2 rounded-full bg-emerald-300" /> Online
                </span>
              </div>
              <div className="mt-4 grid gap-3">
                {callRows.map(([name, status, time], index) => (
                  <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4" key={name}>
                    <span className={`size-10 rounded-lg ${index === 1 ? "bg-sky-300/15" : "bg-cyan-300/15"}`}>
                      <span className="grid h-full place-items-center text-xs font-extrabold text-cyan-200">{name.slice(0, 2)}</span>
                    </span>
                    <div className="min-w-0">
                      <strong className="block truncate text-sm">{name}</strong>
                      <span className="mt-1 block text-xs text-slate-400">{status}</span>
                    </div>
                    <span className="font-mono text-xs text-slate-500">{time}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[["96%", "resolved"], ["412", "calls today"], ["4.8", "CSAT"]].map(([value, label]) => (
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4" key={label}>
                    <strong className="block text-xl">{value}</strong>
                    <span className="mt-1 block text-xs text-slate-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#111827] px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1500px] overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4">
            {proof.map((item) => (
              <div className="border-b border-white/10 p-6 last:border-b-0 sm:border-r sm:last:border-r-0 lg:border-b-0" key={item.label}>
                <strong className="block text-4xl font-semibold">{item.value}</strong>
                <span className="mt-2 block text-sm font-semibold text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {groups.map((group, groupIndex) => {
          const dark = groupIndex % 2 === 1;
          return (
            <section className={`${dark ? "bg-[#111827] text-white" : "bg-[#f7fafc] text-slate-950"} px-4 py-20 sm:px-6 lg:px-8`} key={group.title}>
              <div className="mx-auto max-w-3xl text-center">
                <p className={`m-0 text-sm font-extrabold ${dark ? "text-cyan-200" : "text-cyan-700"}`}>0{groupIndex + 1} / {eyebrow}</p>
                <h2 className="m-0 mt-4 text-4xl leading-tight font-semibold sm:text-5xl">{group.title}</h2>
                <p className={`m-0 mt-5 text-base leading-7 sm:text-lg ${dark ? "text-slate-300" : "text-slate-600"}`}>{group.description}</p>
              </div>

              <div className={`mx-auto mt-12 grid max-w-[1240px] gap-4 ${group.items.length <= 4 ? "lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
                {group.items.map((item, index) => (
                  <Link
                    className={`group min-h-[270px] rounded-lg border p-6 shadow-sm ${dark ? "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]" : "border-slate-200 bg-white hover:border-cyan-300"}`}
                    href={item.href}
                    key={item.title}
                  >
                    <span className={`grid size-11 place-items-center rounded-lg text-sm font-extrabold ${
                      index % 4 === 0
                        ? "bg-cyan-100 text-cyan-800"
                        : index % 4 === 1
                          ? "bg-sky-100 text-sky-800"
                          : index % 4 === 2
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                    }`}>{item.title.slice(0, 2)}</span>
                    <p className={`m-0 mt-6 text-xs font-extrabold ${dark ? "text-cyan-200" : "text-cyan-700"}`}>{item.meta}</p>
                    <h3 className="m-0 mt-2 flex items-start justify-between gap-4 text-xl font-semibold">
                      {item.title}<span className="transition group-hover:translate-x-1" aria-hidden="true">-&gt;</span>
                    </h3>
                    <p className={`m-0 mt-4 text-sm leading-6 ${dark ? "text-slate-400" : "text-slate-600"}`}>{item.summary}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <section className="bg-[#111827] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1120px] rounded-lg border border-cyan-300/20 bg-[#08b8c8] p-8 text-center text-slate-950 shadow-[0_26px_90px_rgba(8,184,200,0.22)] sm:p-12">
            <p className="m-0 text-sm font-extrabold">Ready for production voice agents?</p>
            <h2 className="m-0 mx-auto mt-4 max-w-3xl text-4xl leading-tight font-semibold sm:text-5xl">Launch a phone agent that answers, acts, and improves with every call.</h2>
            <p className="m-0 mx-auto mt-5 max-w-2xl leading-7 text-slate-800">Start with one focused workflow, then scale across teams, locations, and customer journeys.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link className="inline-flex min-h-12 items-center rounded-lg bg-[#111827] px-7 font-extrabold text-white" href="/dashboard">Try for free</Link>
              <Link className="inline-flex min-h-12 items-center rounded-lg border border-slate-900/20 bg-white px-7 font-extrabold" href="/#contact">Contact sales</Link>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
