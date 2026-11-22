import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";
import type { SeoPage } from "@/config/seoPages";

export function ArticleDetailPage({ article }: { article: SeoPage }) {
  return (
    <SiteLayout>
      <main id="blog-article-page" className="min-h-screen bg-white text-[#14231f]">
        <section className="bg-white px-5 pb-14 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-10">
          <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center lg:gap-16">
            <div className="max-w-[760px]">
              <p className="m-0 text-xs font-bold uppercase tracking-[0.18em] text-[#118778]">
                {article.kicker}
              </p>
              <h1 className="m-0 mt-5 text-[clamp(2.15rem,4vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.05em] text-[#14231f]">
                {article.title}
              </h1>
              <p className="m-0 mt-6 max-w-[700px] text-base leading-8 text-[#52645f] sm:text-lg">
                {article.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  className="inline-flex min-h-12 items-center rounded-xl bg-[#118778] px-6 text-sm font-bold text-white shadow-[0_10px_24px_rgba(17,135,120,0.18)] transition hover:-translate-y-0.5 hover:bg-[#0e6f62]"
                  href="/contact"
                >
                  Plan your implementation
                </Link>
                <Link
                  className="inline-flex min-h-12 items-center rounded-xl border border-[#ccd8d4] bg-white px-6 text-sm font-bold text-[#243a34] transition hover:border-[#118778]/45 hover:text-[#118778]"
                  href="/services/voice-agents"
                >
                  Explore voice agents
                </Link>
              </div>
            </div>

            <aside className="rounded-[22px] border border-[#dfe6e3] bg-white p-6 shadow-[0_16px_42px_rgba(29,54,47,0.08)] sm:p-7">
              <p className="m-0 text-[10px] font-bold uppercase tracking-[0.18em] text-[#118778]">
                In this guide
              </p>
              <div className="mt-4 divide-y divide-[#e5ebe9]">
                {article.highlights.map((highlight, index) => (
                  <div className="grid grid-cols-[34px_1fr] items-center gap-3 py-4 first:pt-2 last:pb-1" key={highlight}>
                    <span className="grid size-8 place-items-center rounded-lg bg-[#e9f5f2] text-[10px] font-bold text-[#118778]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-semibold leading-6 text-[#30443e]">{highlight}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="border-y border-[#e8eeec] bg-white px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
          <div className="mx-auto max-w-[1240px]">
            <div className="max-w-[720px]">
              <p className="m-0 text-xs font-bold uppercase tracking-[0.18em] text-[#118778]">Practical framework</p>
              <h2 className="m-0 mt-4 text-[clamp(1.75rem,3vw,2.45rem)] font-semibold leading-[1.1] tracking-[-0.04em] text-[#14231f]">
                What you need to know
              </h2>
              <p className="m-0 mt-4 text-base leading-7 text-[#60716c]">
                Use these four areas to evaluate the topic, make informed decisions, and plan the next step.
              </p>
            </div>

            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {article.sections.map((section, index) => (
                <article className="rounded-[20px] border border-[#dfe6e3] bg-white p-6 shadow-[0_8px_24px_rgba(29,54,47,0.05)] sm:p-7" key={section.title}>
                  <span className="grid size-9 place-items-center rounded-lg bg-[#e9f5f2] text-[10px] font-bold text-[#118778]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="m-0 mt-5 text-xl font-semibold tracking-[-0.025em] text-[#14231f]">{section.title}</h3>
                  <p className="m-0 mt-3 text-[15px] leading-7 text-[#60716c]">{section.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-12 sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-6 rounded-[22px] border border-[#dfe6e3] bg-white p-7 shadow-[0_12px_34px_rgba(29,54,47,0.06)] sm:p-9 md:flex-row md:items-center">
            <div>
              <p className="m-0 text-xs font-bold uppercase tracking-[0.16em] text-[#118778]">Ready for the next step?</p>
              <h2 className="m-0 mt-3 max-w-2xl text-2xl font-semibold tracking-[-0.035em] text-[#14231f]">
                Turn the guide into a focused voice AI workflow.
              </h2>
            </div>
            <Link
              className="inline-flex min-h-12 shrink-0 items-center rounded-xl bg-[#118778] px-7 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0e6f62]"
              href="/contact"
            >
              Contact us
            </Link>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
