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
      <div className="bg-black text-white">
        <section className="relative overflow-hidden bg-black px-4 pt-36 pb-20 sm:px-6 lg:px-8 lg:pt-40">
          <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(69,221,206,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(69,221,206,0.12)_1px,transparent_1px)] [background-size:64px_64px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(69,221,206,0.18),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(167,139,250,0.12),transparent_26%),linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.72)_72%,#000_100%)]" />

          <div className="relative mx-auto grid min-h-[540px] max-w-[1500px] gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(480px,1.05fr)] lg:items-center">
            <div className="max-w-3xl">
              <p className="m-0 text-sm font-extrabold text-[#75fff0]">{eyebrow}</p>
              <h1 className="m-0 mt-8 bg-gradient-to-r from-white via-[#d9fffb] to-[#75fff0] bg-clip-text text-4xl leading-tight font-semibold text-transparent sm:text-6xl sm:leading-none 2xl:text-7xl">
                {title}
              </h1>
              <p className="m-0 mt-8 max-w-2xl text-lg leading-8 text-white/58 sm:text-xl">{summary}</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link className="inline-flex min-h-14 items-center justify-center rounded-xl bg-[#45ddce] px-8 font-extrabold text-[#02110d] shadow-[0_18px_48px_rgba(69,221,206,0.22)] transition hover:bg-[#75fff0]" href="/dashboard">
                  Try for free
                </Link>
                <Link className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-8 font-extrabold text-white transition hover:border-[#45ddce]/40 hover:bg-[#45ddce]/[0.06]" href="/contact">
                  Contact sales
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-[#45ddce]/18 bg-[#071713]/90 p-4 shadow-[0_26px_90px_rgba(0,0,0,0.48)] backdrop-blur-xl">
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

        <section className="bg-black px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1500px] overflow-hidden rounded-2xl border border-[#45ddce]/15 bg-[#45ddce]/[0.035] sm:grid-cols-2 lg:grid-cols-4">
            {proof.map((item) => (
              <div className="border-b border-white/10 p-6 last:border-b-0 sm:border-r sm:last:border-r-0 lg:border-b-0" key={item.label}>
                <strong className="block bg-gradient-to-r from-white to-[#75fff0] bg-clip-text text-4xl font-semibold text-transparent">{item.value}</strong>
                <span className="mt-2 block text-sm font-semibold text-white/42">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {groups.map((group, groupIndex) => {
          return (
            <section className="bg-black px-4 py-20 text-white sm:px-6 lg:px-8" key={group.title}>
              <div className="mx-auto max-w-3xl text-center">
                <p className="m-0 text-sm font-extrabold text-[#75fff0]">0{groupIndex + 1} / {eyebrow}</p>
                <h2 className="m-0 mt-4 text-4xl leading-tight font-semibold sm:text-5xl">{group.title}</h2>
                <p className="m-0 mt-5 text-base leading-7 text-white/48 sm:text-lg">{group.description}</p>
              </div>

              <div className={`mx-auto mt-12 grid max-w-[1240px] gap-4 ${group.items.length <= 4 ? "lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
                {group.items.map((item, index) => (
                  <Link
                    className="group min-h-[270px] rounded-2xl border border-white/10 bg-white/[0.035] p-6 shadow-[0_18px_48px_rgba(0,0,0,0.22)] transition hover:-translate-y-1 hover:border-[#45ddce]/35 hover:bg-[#45ddce]/[0.055]"
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
                    <p className="m-0 mt-6 text-xs font-extrabold text-[#75fff0]">{item.meta}</p>
                    <h3 className="m-0 mt-2 flex items-start justify-between gap-4 text-xl font-semibold">
                      {item.title}<span className="transition group-hover:translate-x-1" aria-hidden="true">-&gt;</span>
                    </h3>
                    <p className="m-0 mt-4 text-sm leading-6 text-white/45">{item.summary}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <section className="bg-black px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1120px] rounded-3xl border border-[#45ddce]/20 bg-[radial-gradient(circle_at_15%_20%,rgba(69,221,206,0.16),transparent_36%),linear-gradient(135deg,#091a17,#050807)] p-8 text-center text-white shadow-[0_26px_90px_rgba(69,221,206,0.1)] sm:p-12">
            <p className="m-0 text-sm font-extrabold text-[#75fff0]">Ready for production voice agents?</p>
            <h2 className="m-0 mx-auto mt-4 max-w-3xl text-4xl leading-tight font-semibold sm:text-5xl">Launch a phone agent that answers, acts, and improves with every call.</h2>
            <p className="m-0 mx-auto mt-5 max-w-2xl leading-7 text-white/48">Start with one focused workflow, then scale across teams, locations, and customer journeys.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link className="inline-flex min-h-12 items-center rounded-xl bg-[#45ddce] px-7 font-extrabold text-[#02110d] transition hover:bg-[#75fff0]" href="/dashboard">Try for free</Link>
              <Link className="inline-flex min-h-12 items-center rounded-xl border border-white/15 bg-white/[0.05] px-7 font-extrabold text-white transition hover:border-[#45ddce]/40" href="/contact">Contact sales</Link>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
