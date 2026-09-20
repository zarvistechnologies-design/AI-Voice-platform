import Link from "next/link";
import type { ReactNode } from "react";

import { ProductServiceHeroPhoto } from "@/components/layout/ProductServiceHeroPhoto";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { productPageDesigns } from "@/config/productPageDesigns";
import type { ProductServiceExperience } from "@/config/productServiceExperiences";

type Product = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  highlights: readonly string[];
};

const sectionClass = "px-5 py-10 sm:px-7 sm:py-12 lg:py-14";
const headingClass = "text-[clamp(1.6rem,2.35vw,2.25rem)] font-semibold leading-[1.12] tracking-[-0.04em] text-[#111312]";

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0f8777]">{children}</p>;
}

export function ProductDetailPage({ service, experience }: { service: Product; experience: ProductServiceExperience }) {
  const design = productPageDesigns[service.slug];

  return (
    <SiteLayout>
      <main className="overflow-hidden bg-white text-[#111312]" id="product-detail-page">
        <section className="relative overflow-hidden border-b border-[#e3ebe8] bg-white px-5 pb-6 pt-20 sm:px-7 sm:pb-8 sm:pt-24 lg:pb-8">
          <div className="mx-auto grid w-full max-w-[1340px] items-center gap-10 lg:grid-cols-[.96fr_1.04fr] lg:gap-12">
            <div className="max-w-[620px]">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d8d0e5] bg-[#faf8fc] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#625b7d] shadow-sm">
                <span aria-hidden="true" className="size-2 rounded-full bg-[#0f8777]" />
                {service.kicker} / {experience.label}
              </span>
              <h1 className="mt-6 text-[clamp(1.85rem,3.8vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.05em]">
                {experience.heroTitle} <span className="block text-[#0f8777]">{experience.heroAccent}</span>
              </h1>
              <p className="mt-6 max-w-[570px] text-[15px] leading-7 text-[#53605d] sm:text-base">{service.summary}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="inline-flex min-h-12 items-center rounded-full bg-[#0f8777] px-6 text-sm font-bold text-white shadow-[0_15px_35px_rgba(13,148,136,.18)] transition hover:bg-[#0a685c]" href="/#demo">Try a demo <span aria-hidden="true" className="ml-2">→</span></Link>
                <Link className="inline-flex min-h-12 items-center rounded-full border border-[#d8d0e5] bg-white px-6 text-sm font-bold text-[#173b35] transition hover:border-[#0f8777]" href="/contact">Contact sales</Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-[#60706a]">
                {service.highlights.map((item) => <span className="inline-flex items-center gap-2" key={item}><span aria-hidden="true" className="size-1.5 rounded-full bg-[#0f8777]" />{item}</span>)}
              </div>
            </div>
            <ProductServiceHeroPhoto plain slug={service.slug} title={service.title} />
          </div>
        </section>

        <section aria-labelledby="product-integrations-strip-title" className="overflow-hidden border-b border-[#e3ebe8] bg-[#f7f9f8] py-5 sm:py-6">
          <div className="mx-auto w-full max-w-[1340px]">
            <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[.16em] text-[#60706a]" id="product-integrations-strip-title">Connect {service.title.toLowerCase()} to your existing tools</p>
            <div className="product-detail-marquee-window overflow-hidden">
              <div className="product-detail-marquee flex w-max items-center gap-3 px-1">
                {[...experience.integrations, ...experience.integrations].map((item, index) => <div aria-hidden={index >= experience.integrations.length} className="flex min-h-14 w-48 shrink-0 items-center justify-center rounded-xl border border-[#dfe7e4] bg-white px-3 text-center text-sm font-semibold text-[#40514c]" key={`${item}-${index}`}><span aria-hidden="true" className="mr-2 size-2 rounded-full bg-[#0f8777]" />{item}</div>)}
              </div>
            </div>
          </div>
        </section>

        <section className={sectionClass} id="product-workflow">
          <div className="mx-auto w-full max-w-[1340px]">
            <div className="max-w-[720px]"><Eyebrow>{design.workflowLabel}</Eyebrow><h2 className={`${headingClass} mt-4`}>{design.workflowTitle}</h2><p className="mt-4 text-[15px] leading-7 text-[#5b6964]">{design.workflowIntro}</p></div>
            <ol className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
              {experience.workflow.map((step, index) => <li className="rounded-2xl border border-[#d8d0e5] border-t-2 border-t-[#0f8777] bg-white p-6 shadow-[0_8px_24px_rgba(109,106,156,.05)]" key={step.title}><span className="font-mono text-xs font-bold text-[#625b7d]">{String(index + 1).padStart(2, "0")}</span><h3 className="mt-5 text-lg font-semibold">{step.title}</h3><p className="mt-3 text-sm leading-6 text-[#60706a]">{step.body}</p></li>)}
            </ol>
          </div>
        </section>

        <section className={`${sectionClass} border-y border-[#e8e2f1] bg-[#faf8fc]/60`} id="product-capabilities">
          <div className="mx-auto w-full max-w-[1340px]">
            <Eyebrow>{design.blueprintLabel}</Eyebrow><h2 className={`${headingClass} mt-4 max-w-[780px]`}>{design.blueprintTitle}</h2><p className="mt-4 max-w-[780px] text-[15px] leading-7 text-[#5b6964]">{design.blueprintIntro}</p>
            <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2 lg:grid-cols-3">
              {experience.capabilities.map((item, index) => <article className="flex min-h-[190px] gap-4 rounded-2xl border border-[#e8e2f1] bg-white p-5" key={item.title}><span className="grid size-11 shrink-0 place-items-center rounded-xl border border-[#c9ddd8] text-xs font-bold text-[#0f8777]">0{index + 1}</span><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#625b7d]">{item.eyebrow}</p><h3 className="mt-2 text-base font-bold leading-snug">{item.title}</h3><p className="mt-2 text-sm leading-6 text-[#60706a]">{item.body}</p></div></article>)}
            </div>
          </div>
        </section>

        <section className={sectionClass} id="product-connected-workflow">
          <div className="mx-auto grid w-full max-w-[1340px] gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-10">
            <div><Eyebrow>{design.visualLabel}</Eyebrow><h2 className={`${headingClass} mt-4`}>{design.visualTitle}</h2><p className="mt-5 max-w-[500px] text-[15px] leading-7 text-[#5b6964]">{design.integrationsTitle}</p><Link className="mt-7 inline-flex text-sm font-bold text-[#0f8777] underline underline-offset-4" href="/contact">Plan your integration <span aria-hidden="true" className="ml-2">→</span></Link></div>
            <div className="overflow-hidden rounded-2xl border border-[#d8d0e5] bg-[#faf8fc] p-5 shadow-[0_18px_42px_rgba(109,106,156,.09)] sm:p-6">
              <div className="flex items-center justify-between gap-3 border-b border-[#d8d0e5] pb-4"><span className="text-xs font-bold uppercase tracking-[.14em] text-[#625b7d]">{service.title} example</span><span className="rounded-full bg-[#e8e2f1] px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#625b7d]">{experience.demo.status}</span></div>
              <ol className="mt-5 space-y-3">{[["Customer", experience.demo.caller], [service.title, experience.demo.agent], ["Connected action", experience.demo.action]].map(([speaker, message], index) => <li className="flex gap-3" key={speaker}><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#e8e2f1] text-[11px] font-bold text-[#625b7d]">{index + 1}</span><div className="rounded-xl border border-[#e8e2f1] bg-white px-4 py-3 text-sm leading-6 text-[#40514c]"><strong className="mr-2 text-[#173b35]">{speaker}</strong>{message}</div></li>)}</ol>
              <p className="mt-5 border-t border-[#d8d0e5] pt-4 text-xs leading-5 text-[#60706a]">{design.blueprintCoreBody}</p>
            </div>
          </div>
        </section>

        <section className={`${sectionClass} border-y border-[#e8e2f1] bg-white`} id="product-use-cases">
          <div className="mx-auto w-full max-w-[1340px]"><Eyebrow>Use cases</Eyebrow><h2 className={`${headingClass} mt-4 max-w-[780px]`}>Where {service.title.toLowerCase()} helps your team.</h2><div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">{experience.useCases.map((item, index) => <article className="flex min-h-[235px] flex-col rounded-2xl border border-[#d8d0e5] bg-white p-5 shadow-[0_8px_24px_rgba(109,106,156,.05)] sm:p-6" key={item.title}><span className="grid size-10 place-items-center rounded-xl border border-[#d1e2dd] text-xs font-bold text-[#0f8777]">0{index + 1}</span><h3 className="mt-6 text-lg font-semibold">{item.title}</h3><p className="mt-3 text-sm leading-6 text-[#60706a]">{item.body}</p><Link className="mt-auto inline-flex pt-6 text-sm font-bold text-[#118778] transition hover:text-[#0e6f62]" href="/contact">{item.outcome} <span aria-hidden="true" className="ml-2">→</span></Link></article>)}</div></div>
        </section>

        <section className={sectionClass} id="product-performance">
          <div className="mx-auto w-full max-w-[1340px]"><div className="text-center"><Eyebrow>{service.title} at a glance</Eyebrow><h2 className={`${headingClass} mt-4`}>The details your team can evaluate.</h2></div><div className="mt-8 grid gap-4 py-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">{experience.proof.map((item) => <article className="rounded-2xl border border-black/20 bg-white p-5 text-center shadow-[0_8px_24px_rgba(20,35,31,.04)] sm:p-6" key={item.label}><p className="text-3xl font-semibold tracking-[-.05em] text-[#0f8777]">{item.value}</p><h3 className="mt-4 text-sm font-bold">{item.label}</h3></article>)}</div></div>
        </section>

        <section className={`${sectionClass} border-y border-[#e8e2f1] bg-[#faf8fc]/60`} id="product-control">
          <div className="mx-auto grid w-full max-w-[1340px] gap-8 lg:grid-cols-2"><article className="border-l-4 border-[#0f8777] bg-white pl-6"><Eyebrow>{design.blueprintCoreLabel}</Eyebrow><h2 className="mt-4 text-[clamp(1.75rem,2.5vw,2.4rem)] font-semibold leading-[1.1] tracking-[-.04em]">{design.blueprintCoreTitle}</h2><p className="mt-5 max-w-[480px] text-[15px] leading-7 text-[#5b6964]">{design.blueprintCoreBody}</p></article><article className="rounded-2xl border border-[#d8d0e5] bg-white p-7 shadow-[0_12px_30px_rgba(109,106,156,.07)]"><Eyebrow>{experience.capabilities[0]?.eyebrow ?? service.title}</Eyebrow><h3 className="mt-4 text-lg font-semibold leading-7 text-[#183b35]">{experience.capabilities[0]?.title}</h3><p className="mt-3 text-[15px] leading-7 text-[#5b6964]">{experience.capabilities[0]?.body}</p><p className="mt-6 text-sm font-bold text-[#0f8777]">{design.blueprintCoreBadge}</p></article></div>
        </section>

        <section className="border-t border-[#e3ebe8] px-5 py-10 sm:px-7 sm:py-12 lg:py-14" id="product-faq">
          <div className="mx-auto grid w-full max-w-[1340px] gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-14"><div><Eyebrow>Frequently asked questions</Eyebrow><h2 className="mt-4 text-[clamp(1.5rem,2.15vw,2.1rem)] font-semibold leading-[1.12] tracking-[-.035em]">{design.faqTitle}</h2><p className="mt-4 max-w-[440px] text-[15px] leading-7 text-[#5b6964]">A practical overview of {service.title.toLowerCase()}, setup, and how your team stays in control.</p></div><div className="divide-y divide-[#dce6e3] border-y border-[#dce6e3]">{experience.faqs.map((faq, index) => <details className="group py-5" key={faq.question} open={index === 0}><summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-bold text-[#173b35]"><span>{faq.question}</span><span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full border border-[#c9ddd8] text-lg font-normal text-[#0f8777] transition group-open:rotate-45">+</span></summary><p className="max-w-[650px] pt-4 text-sm leading-7 text-[#60706a]">{faq.answer}</p></details>)}</div></div>
        </section>

        <section className="relative w-full overflow-hidden border-t border-[#e3ebe8] bg-white px-5 py-12 sm:px-7 sm:py-14 lg:py-16" id="product-build-today">
          <div className="relative mx-auto w-full max-w-[850px] text-center"><span className="inline-flex items-center rounded-full border border-[#c9ddd8] bg-[#f7fdfb] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#0f8777]">Start building</span><h2 className="mt-5 text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-[-.055em] text-[#111312]">{design.ctaTitle}</h2><p className="mx-auto mt-4 max-w-[650px] text-[15px] leading-7 text-[#5b6964] sm:text-base">Start with one {service.title.toLowerCase()} workflow, connect the tools it needs, and expand from real results.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Link className="inline-flex min-h-12 items-center rounded-full bg-[#0f8777] px-7 text-sm font-bold text-white shadow-[0_15px_35px_rgba(13,148,136,.16)] transition hover:bg-[#0a685c]" href="/dashboard">Build your workflow <span aria-hidden="true" className="ml-2">→</span></Link><Link className="inline-flex min-h-12 items-center rounded-full border border-[#b9c9c4] bg-white px-7 text-sm font-bold text-[#173b35] transition hover:border-[#0f8777]" href="/contact">Talk to our team</Link></div><div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-[#71807b]">{service.highlights.map((item) => <span key={item}>✓ {item}</span>)}</div></div>
        </section>

        <style>{`
          .product-detail-marquee-window { mask-image: linear-gradient(to right, transparent, #000 7%, #000 93%, transparent); -webkit-mask-image: linear-gradient(to right, transparent, #000 7%, #000 93%, transparent); }
          .product-detail-marquee { animation: product-detail-marquee 28s linear infinite; }
          .product-detail-marquee:hover { animation-play-state: paused; }
          @keyframes product-detail-marquee { to { transform: translateX(-50%); } }

          .marketing-site:has(#product-detail-page) .site-pre-footer-cta { margin-top: 165px; overflow: visible; position: relative; }
          .marketing-site:has(#product-detail-page) .site-pre-footer-cta::before { content: ""; position: absolute; z-index: 1; left: 50%; top: -165px; width: 540px; height: 540px; border-radius: 50%; background: #000; transform: translateX(-50%); pointer-events: none; }
          .marketing-site:has(#product-detail-page) .site-pre-footer-cta::after { content: "↓"; position: absolute; z-index: 2; left: 50%; top: -125px; color: #fff; font-size: 46px; font-weight: 300; line-height: 1; transform: translateX(-50%); pointer-events: none; }
          .marketing-site:has(#product-detail-page) .site-pre-footer-cta > * { position: relative; z-index: 3; }
          .marketing-site:has(#product-detail-page) .site-pre-footer-cta > div { position: static; }
          .marketing-site:has(#product-detail-page) .site-pre-footer-cta > div::after { content: ""; position: absolute; z-index: 4; right: 0; bottom: 0; left: 0; height: 1px; background: #3a3a3a; pointer-events: none; }
          .marketing-site:has(#product-detail-page) .site-pre-footer-cta > div > * { position: relative; z-index: 3; }
          @media (max-width: 640px) { .marketing-site:has(#product-detail-page) .site-pre-footer-cta { margin-top: 155px; } .marketing-site:has(#product-detail-page) .site-pre-footer-cta::before { top: -155px; } .marketing-site:has(#product-detail-page) .site-pre-footer-cta::after { top: -115px; font-size: 46px; } }
        `}</style>
      </main>
    </SiteLayout>
  );
}
