import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";

type DetailSection = {
  title: string;
  body: string;
};

type DetailPageProps = {
  kicker: string;
  title: string;
  summary: string;
  highlights: readonly string[];
  sections: readonly DetailSection[];
  primaryAction: {
    href: string;
    label: string;
  };
  secondaryAction: {
    href: string;
    label: string;
  };
};

const waveHeights = [
  "h-8",
  "h-14",
  "h-20",
  "h-11",
  "h-24",
  "h-16",
  "h-28",
  "h-12",
  "h-20",
  "h-10",
  "h-16",
  "h-24",
  "h-14",
  "h-20",
  "h-11",
  "h-8",
];

export function DetailPage({
  kicker,
  title,
  summary,
  highlights,
  sections,
  primaryAction,
  secondaryAction,
}: DetailPageProps) {
  return (
    <SiteLayout>
      <section className="mx-auto grid min-h-[78vh] w-full max-w-[1280px] items-center gap-10 px-5 pt-32 pb-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)] lg:px-12">
        <div className="grid max-w-3xl gap-5">
          <p className="m-0 text-xs font-black uppercase text-fuchsia-300">{kicker}</p>
          <h1 className="m-0 text-[clamp(3rem,7vw,6.5rem)] leading-[0.94] font-black">
            {title}
          </h1>
          <p className="m-0 max-w-2xl text-lg leading-8 text-[#dcc6f2]">{summary}</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-5 font-black text-[#26063b] transition hover:-translate-y-0.5 hover:bg-[#f1e5ff]"
              href={primaryAction.href}
            >
              {primaryAction.label}
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/25 bg-white/5 px-5 font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10"
              href={secondaryAction.href}
            >
              {secondaryAction.label}
            </Link>
          </div>
        </div>

        <div
          className="grid min-h-[420px] content-between gap-8 rounded-lg border border-white/15 bg-[#10071d]/80 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.35)] sm:p-8"
          aria-label={`${title} highlights`}
        >
          <div className="flex min-h-52 items-center justify-center gap-1.5 overflow-hidden rounded-lg border border-white/10 bg-black/25 px-3">
            {waveHeights.map((height, index) => (
              <span
                className={`block w-2 rounded-full bg-gradient-to-t from-purple-700 to-fuchsia-300 ${height}`}
                key={`${height}-${index}`}
              />
            ))}
          </div>
          <div className="grid gap-2">
            {highlights.map((highlight) => (
              <span
                className="rounded-lg border border-white/10 bg-white/5 px-3.5 py-3 text-sm font-bold text-[#dcc6f2]"
                key={highlight}
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section
        className="mx-auto grid w-full max-w-[1280px] gap-4 px-5 pb-24 sm:px-8 lg:grid-cols-2 lg:px-12"
        aria-label={`${title} details`}
      >
        {sections.map((section, index) => (
          <article
            className="grid content-start gap-3 rounded-lg border border-white/15 bg-white/5 p-5 sm:p-7"
            key={section.title}
          >
            <span className="text-sm font-black text-fuchsia-300">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h2 className="m-0 text-2xl font-black">{section.title}</h2>
            <p className="m-0 leading-7 text-[#dcc6f2]">{section.body}</p>
          </article>
        ))}
      </section>
    </SiteLayout>
  );
}
