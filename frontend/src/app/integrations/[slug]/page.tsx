import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { integrations } from "@/config/integrationCatalog";
import { integrationEditorial, layerDescriptions } from "@/config/integrationEditorial";
import { integrationGuides } from "@/config/integrationGuides";

type PageProps = { params: Promise<{ slug: string }> };
const sectionClass = "px-5 py-12 sm:px-7 sm:py-16";
const headingClass = "text-[clamp(1.9rem,3.2vw,3rem)] font-medium leading-[1.08] tracking-[-0.045em] text-[#0f172a]";
const eyebrowClass = "text-[10px] font-bold uppercase tracking-[0.16em] text-[#64748b]";

export function generateStaticParams() {
  return integrations.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const integration = integrations.find((item) => item.slug === slug);
  if (!integration) return {};
  return {
    title: `${integration.name} Integration for AI Voice & WhatsApp | Vozon`,
    description: integration.description,
    alternates: { canonical: `/integrations/${slug}` },
  };
}

export default async function IntegrationPage({ params }: PageProps) {
  const { slug } = await params;
  const integration = integrations.find((item) => item.slug === slug);
  if (!integration) notFound();

  const guide = integrationGuides[integration.slug];
  const editorial = integrationEditorial[integration.slug];
  const isDigitalBot = integration.slug === "digitalbot";
  const primaryAction = isDigitalBot
    ? { href: "/dashboard/integrations", label: "Connect DigitalBot" }
    : { href: "/contact", label: "Plan this integration" };
  const related = integrations
    .filter((item) => item.category === integration.category && item.slug !== slug)
    .slice(0, 3);

  return (
    <SiteLayout>
      <div id="integration-detail-page" className="min-h-screen bg-[#f8f9f9] text-[#171719]">
        {/* Detail Hero */}
        <section className="relative overflow-hidden border-b border-[#e2e8f0] bg-white px-5 pb-16 pt-36 sm:px-7 sm:pt-40">
          <div className="mx-auto max-w-[1340px]">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#94a3b8]">
              <Link className="hover:text-[#0f172a] transition-colors" href="/integrations">Integrations</Link>
              <span aria-hidden="true">/</span>
              <span>{integration.category}</span>
              <span aria-hidden="true">/</span>
              <span className="text-[#0f172a]">{integration.name}</span>
            </nav>

            <div className="mt-6 grid gap-10 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:gap-14">
              <div>
                <span className="inline-flex rounded-full border border-[#e2e8f0] bg-[#f8fafc] px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#2563eb]">
                  {integration.category}
                </span>
                <h1 className="mt-5 max-w-[640px] text-[clamp(2.7rem,5vw,5rem)] font-medium leading-[1.04] tracking-[-0.055em] text-[#0f172a]">
                  {integration.name} for AI voice workflows
                </h1>
                <p className="mt-5 max-w-[570px] text-[16px] leading-7 text-[#64748b]">
                  {integration.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    className="inline-flex min-h-11 items-center rounded-full bg-[#0f172a] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-black"
                    href={primaryAction.href}
                  >
                    {primaryAction.label} <span aria-hidden="true" className="ml-2">&#8599;</span>
                  </Link>
                  <Link
                    className="inline-flex min-h-11 items-center rounded-full border border-[#cbd5e1] bg-white px-6 text-sm font-semibold text-[#0f172a] transition hover:border-[#0f172a]"
                    href="/integrations"
                  >
                    Explore all integrations
                  </Link>
                </div>
              </div>

              {/* Aside Live Workflow Card */}
              <aside
                aria-label={`${integration.name} workflow example`}
                className="w-full max-w-[500px] justify-self-center rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-6 shadow-[0_14px_34px_-10px_rgba(15,23,42,0.06)] sm:p-7 lg:justify-self-end"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e2e8f0] pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#2563eb]">
                      IN A VOZON CALL
                    </span>
                    <h2 className="mt-1 text-base font-semibold text-[#0f172a]">{integration.name} live workflow</h2>
                  </div>
                  <span className="rounded-full bg-white border border-[#e2e8f0] px-3 py-1 text-xs font-semibold text-[#64748b]">
                    {integration.category}
                  </span>
                </div>

                <ol className="mt-5 space-y-3">
                  <li className="grid grid-cols-[30px_1fr] gap-3 rounded-xl bg-white border border-[#e2e8f0] p-3.5">
                    <span className="grid size-7 place-items-center rounded-full bg-[#0f172a] text-[11px] font-bold text-white">01</span>
                    <div>
                      <h3 className="text-sm font-semibold text-[#0f172a]">Example use case</h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#64748b]">{editorial.scenarios[0]}</p>
                    </div>
                  </li>
                  <li className="grid grid-cols-[30px_1fr] gap-3 rounded-xl bg-[#eff6ff] border border-[#dbeafe] p-3.5">
                    <span className="grid size-7 place-items-center rounded-full bg-[#2563eb] text-[11px] font-bold text-white">02</span>
                    <div>
                      <h3 className="text-sm font-semibold text-[#0f172a]">Role in the call</h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#3b82f6] font-medium">{editorial.why}</p>
                    </div>
                  </li>
                  <li className="grid grid-cols-[30px_1fr] gap-3 rounded-xl bg-white border border-[#e2e8f0] p-3.5">
                    <span className="grid size-7 place-items-center rounded-full bg-[#0f172a] text-[11px] font-bold text-white">03</span>
                    <div>
                      <h3 className="text-sm font-semibold text-[#0f172a]">Setup path</h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#64748b]">{guide.setup}</p>
                    </div>
                  </li>
                </ol>
              </aside>
            </div>
          </div>
        </section>

        {/* Integration at a glance bar */}
        <section aria-label="Integration at a glance" className="border-b border-[#e2e8f0] bg-[#fafafc] px-5 py-6 sm:px-7">
          <div className="mx-auto grid max-w-[1340px] gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">Layer</p>
              <p className="mt-1 text-sm font-semibold text-[#0f172a]">{integration.category}</p>
            </div>
            {integration.capabilities.map((capability, index) => (
              <div key={capability}>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">Focus 0{index + 1}</p>
                <p className="mt-1 text-sm font-semibold text-[#0f172a]">{capability}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Role in Voice Stack */}
        <section className={`${sectionClass} bg-white`}>
          <div className="mx-auto grid max-w-[1340px] gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-12">
            <div>
              <p className={eyebrowClass}>THE CAPABILITY</p>
              <h2 className={`${headingClass} mt-3`}>What {integration.name} brings to a conversation</h2>
              <p className="mt-4 text-[15px] leading-7 text-[#64748b]">{editorial.why}</p>
            </div>
            <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-7">
              <p className={eyebrowClass}>IN THE VOZON STACK</p>
              <h3 className="mt-3 text-lg font-semibold text-[#0f172a]">{integration.category}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#64748b]">{layerDescriptions[integration.category]}</p>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className={`${sectionClass} border-y border-[#e2e8f0] bg-[#f8fafc]`}>
          <div className="mx-auto max-w-[1340px]">
            <p className={eyebrowClass}>PRODUCTION USE CASES</p>
            <h2 className={`${headingClass} mt-3`}>Where enterprise teams run {integration.name}</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {editorial.scenarios.map((scenario, index) => (
                <article className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm" key={scenario}>
                  <span className="text-xs font-bold text-[#2563eb]">0{index + 1}</span>
                  <p className="mt-3 text-sm leading-relaxed text-[#475569]">{scenario}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 3 Step Implementation */}
        <section className={`${sectionClass} bg-white`}>
          <div className="mx-auto max-w-[1340px]">
            <p className={eyebrowClass}>IMPLEMENTATION PATH</p>
            <h2 className={`${headingClass} mt-3`}>From initial setup to a live call</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <article className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">01 / PLAN</span>
                <h3 className="mt-3 text-base font-semibold text-[#0f172a]">Define the business outcome</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#64748b]">
                  Choose the conversation scenario and map exactly which variables {integration.name} reads or writes.
                </p>
              </article>
              <article className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563eb]">02 / CONNECT</span>
                <h3 className="mt-3 text-base font-semibold text-[#0f172a]">Configure credential &amp; webhooks</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#64748b]">{guide.setup}</p>
              </article>
              <article className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#059669]">03 / VALIDATE</span>
                <h3 className="mt-3 text-base font-semibold text-[#0f172a]">Test in staging</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#64748b]">{guide.check}</p>
              </article>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className={`${sectionClass} border-y border-[#e2e8f0] bg-[#f8fafc]`}>
          <div className="mx-auto grid max-w-[1340px] gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-14">
            <div>
              <p className={eyebrowClass}>FREQUENTLY ASKED QUESTIONS</p>
              <h2 className={`${headingClass} mt-3`}>{integration.name} setup guidance</h2>
            </div>
            <div className="space-y-3">
              <details className="group rounded-xl border border-[#e2e8f0] bg-white p-5">
                <summary className="cursor-pointer list-none font-semibold text-[#0f172a]">
                  What does {integration.name} add to a Vozon workflow?
                  <span className="float-right text-[#94a3b8] group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[#64748b]">{editorial.why}</p>
              </details>
              <details className="group rounded-xl border border-[#e2e8f0] bg-white p-5">
                <summary className="cursor-pointer list-none font-semibold text-[#0f172a]">
                  How do I set up {integration.name}?
                  <span className="float-right text-[#94a3b8] group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[#64748b]">{guide.setup}</p>
              </details>
              <details className="group rounded-xl border border-[#e2e8f0] bg-white p-5">
                <summary className="cursor-pointer list-none font-semibold text-[#0f172a]">
                  What should I verify before launch?
                  <span className="float-right text-[#94a3b8] group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[#64748b]">{guide.check}</p>
              </details>
            </div>
          </div>
        </section>

        {/* Related Integrations */}
        {related.length ? (
          <section className={`${sectionClass} bg-white`}>
            <div className="mx-auto max-w-[1340px]">
              <h2 className={headingClass}>More in {integration.category}</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <Link
                    className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-white p-5 text-sm font-semibold text-[#0f172a] transition hover:border-[#0f172a] hover:shadow-sm"
                    href={`/integrations/${item.slug}`}
                    key={item.slug}
                  >
                    <span>{item.name}</span>
                    <span aria-hidden="true" className="text-[#94a3b8]">&rarr;</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* Bottom CTA */}
        <section className="border-t border-[#e2e8f0] bg-white px-5 py-14 sm:px-7 sm:py-16">
          <div className="mx-auto max-w-[850px] text-center">
            <p className={eyebrowClass}>PRODUCTION DEPLOYMENT</p>
            <h2 className="mt-4 text-[clamp(2rem,3.8vw,3.2rem)] font-medium leading-[1.08] tracking-[-0.05em] text-[#0f172a]">
              Put {integration.name} to work in your live call flow.
            </h2>
            <p className="mx-auto mt-4 max-w-[620px] text-[15px] leading-7 text-[#64748b]">
              {isDigitalBot
                ? "Connect your clinic workspace to a Vozon agent, activate only the tools it needs, and test the complete booking flow before launch."
                : "Tell us what your agent needs to hear, say, read, or update. We'll help map the connection and test it with your call scenarios."}
            </p>
            <div className="mt-7 flex justify-center gap-3">
              <Link
                className="inline-flex min-h-11 items-center rounded-full bg-[#0f172a] px-7 text-sm font-semibold text-white transition hover:bg-black"
                href={primaryAction.href}
              >
                {primaryAction.label} <span aria-hidden="true" className="ml-2">&#8599;</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
