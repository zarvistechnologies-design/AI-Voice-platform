import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { integrations } from "@/config/integrationCatalog";
import { integrationEditorial, layerDescriptions } from "@/config/integrationEditorial";
import { integrationGuides } from "@/config/integrationGuides";

type PageProps = { params: Promise<{ slug: string }> };
const sectionClass = "px-5 py-10 sm:px-7 sm:py-12 lg:py-14";
const headingClass = "text-[clamp(2rem,3.3vw,3.2rem)] font-semibold leading-[1.06] tracking-[-0.055em] text-[#111312]";
const eyebrowClass = "text-xs font-bold uppercase tracking-[0.16em] text-[#5b4ce6]";

export function generateStaticParams() {
  return integrations.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const integration = integrations.find((item) => item.slug === slug);
  if (!integration) return {};
  return {
    title: `${integration.name} Integration | Vozon`,
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
        <section className="relative overflow-hidden border-b border-[#dedfe2] bg-white px-5 pb-16 pt-36 sm:px-7 sm:pt-40">
          <div className="mx-auto max-w-[1340px]">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#777b82]">
              <Link className="hover:text-[#4d3ec9]" href="/integrations">Integrations</Link>
              <span aria-hidden="true">/</span>
              <span>{integration.category}</span>
              <span aria-hidden="true">/</span>
              <span className="text-[#171719]">{integration.name}</span>
            </nav>

            <div className="mt-5 grid gap-10 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:gap-12">
              <div>
                <span className="inline-flex rounded-full border border-[#dedafc] bg-[#f3f1ff] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#4d3ec9]">
                  {integration.category}
                </span>
                <h1 className="mt-6 max-w-[620px] text-[clamp(3rem,5.6vw,5.8rem)] font-semibold leading-[0.99] tracking-[-0.065em] text-[#111312]">
                  {integration.name} for voice workflows
                </h1>
                <p className="mt-6 max-w-[570px] text-[15px] leading-7 text-[#55585f] sm:text-base">
                  {integration.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link className="inline-flex min-h-12 items-center rounded-full bg-[#5b4ce6] px-6 text-sm font-bold text-white transition hover:bg-[#4d3ec9]" href={primaryAction.href}>
                    {primaryAction.label}
                  </Link>
                  <Link className="inline-flex min-h-12 items-center rounded-full border border-[#dedfe2] bg-white px-6 text-sm font-bold text-[#171719] transition hover:border-[#5b4ce6]" href="/integrations">
                    Explore all integrations
                  </Link>
                </div>
              </div>

              <aside aria-label={`${integration.name} workflow example`} className="w-full max-w-[520px] justify-self-center rounded-2xl border border-[#dedfe2] bg-[#f8f9f9] p-5 shadow-[0_18px_42px_rgba(20,35,31,0.07)] sm:p-6 lg:justify-self-end">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5e6e8] pb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5b4ce6]">In a Vozon call</p>
                    <h2 className="mt-1 text-lg font-semibold text-[#171719]">{integration.name} workflow</h2>
                  </div>
                  <span className="rounded-full bg-[#f3f1ff] px-3 py-1 text-xs font-semibold text-[#4d3ec9]">{integration.category}</span>
                </div>
                <ol className="mt-5 space-y-3">
                  <li className="grid grid-cols-[32px_1fr] gap-3 rounded-xl bg-[#f8f9f9] p-3">
                    <span className="grid size-8 place-items-center rounded-full bg-white text-xs font-bold text-[#5b4ce6]">01</span>
                    <div><h3 className="text-sm font-semibold text-[#171719]">Example use case</h3><p className="mt-1 text-sm leading-6 text-[#55585f]">{editorial.scenarios[0]}</p></div>
                  </li>
                  <li className="grid grid-cols-[32px_1fr] gap-3 rounded-xl bg-[#f3f1ff] p-3">
                    <span className="grid size-8 place-items-center rounded-full bg-white text-xs font-bold text-[#5b4ce6]">02</span>
                    <div><h3 className="text-sm font-semibold text-[#171719]">Role in the call</h3><p className="mt-1 text-sm leading-6 text-[#55585f]">{editorial.why}</p></div>
                  </li>
                  <li className="grid grid-cols-[32px_1fr] gap-3 rounded-xl bg-[#f8f9f9] p-3">
                    <span className="grid size-8 place-items-center rounded-full bg-white text-xs font-bold text-[#5b4ce6]">03</span>
                    <div><h3 className="text-sm font-semibold text-[#171719]">Setup path</h3><p className="mt-1 text-sm leading-6 text-[#55585f]">{guide.setup}</p></div>
                  </li>
                </ol>
              </aside>
            </div>
          </div>
        </section>

        <section aria-label="Integration at a glance" className="border-b border-[#dedfe2] bg-[#f8f9f9] px-5 py-5 sm:px-7 sm:py-6">
          <div className="mx-auto grid max-w-[1340px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div><p className="text-xs uppercase tracking-[0.13em] text-[#777b82]">Layer</p><p className="mt-1 font-semibold">{integration.category}</p></div>
            {integration.capabilities.map((capability, index) => <div key={capability}><p className="text-xs uppercase tracking-[0.13em] text-[#777b82]">Focus 0{index + 1}</p><p className="mt-1 font-semibold">{capability}</p></div>)}
          </div>
        </section>

        <section className={`${sectionClass} bg-white`}>
          <div className="mx-auto grid max-w-[1340px] gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-10">
            <div><p className={eyebrowClass}>The role</p><h2 className={`${headingClass} mt-4`}>What {integration.name} brings to a call</h2><p className="mt-4 text-[15px] leading-7 text-[#55585f]">{editorial.why}</p></div>
            <div className="rounded-2xl border border-[#dedfe2] bg-[#f8f9f9] p-6"><p className={eyebrowClass}>In the voice stack</p><h3 className="mt-4 text-lg font-semibold">{integration.category}</h3><p className="mt-3 text-sm leading-6 text-[#666a70]">{layerDescriptions[integration.category]}</p></div>
          </div>
        </section>

        <section className={`${sectionClass} border-y border-[#dedfe2] bg-[#f8f9f9]`}>
          <div className="mx-auto max-w-[1340px]"><p className={eyebrowClass}>Use cases</p><h2 className={`${headingClass} mt-4`}>Where teams use {integration.name}</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">{editorial.scenarios.map((scenario, index) => <article className="rounded-2xl border border-[#dedfe2] bg-white p-6" key={scenario}><span className="text-xs font-bold text-[#5b4ce6]">0{index + 1}</span><p className="mt-4 text-sm leading-6 text-[#666a70]">{scenario}</p></article>)}</div>
          </div>
        </section>

        <section className={`${sectionClass} bg-white`}>
          <div className="mx-auto max-w-[1340px]"><p className={eyebrowClass}>Implementation</p><h2 className={`${headingClass} mt-4`}>From setup to a real call</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <article className="rounded-2xl border border-[#dedfe2] bg-[#f8f9f9] p-6"><span className="text-xs font-bold text-[#5b4ce6]">01 / PLAN</span><h3 className="mt-4 text-lg font-semibold">Define the outcome</h3><p className="mt-3 text-sm leading-7 text-[#55585f]">Choose the call scenario and decide which of {integration.name}&apos;s capabilities the agent needs.</p></article>
              <article className="rounded-2xl border border-[#dedfe2] bg-[#f8f9f9] p-6"><span className="text-xs font-bold text-[#5b4ce6]">02 / CONNECT</span><h3 className="mt-4 text-lg font-semibold">Configure the path</h3><p className="mt-3 text-sm leading-7 text-[#55585f]">{guide.setup}</p></article>
              <article className="rounded-2xl border border-[#dedfe2] bg-[#f8f9f9] p-6"><span className="text-xs font-bold text-[#5b4ce6]">03 / VALIDATE</span><h3 className="mt-4 text-lg font-semibold">Test before launch</h3><p className="mt-3 text-sm leading-7 text-[#55585f]">{guide.check}</p></article>
            </div>
          </div>
        </section>

        <section className={`${sectionClass} border-y border-[#dedfe2] bg-[#f8f9f9]`}>
          <div className="mx-auto grid max-w-[1340px] gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-14"><div><p className={eyebrowClass}>Frequently asked questions</p><h2 className={`${headingClass} mt-4`}>{integration.name} questions</h2></div><div className="space-y-3">
            <details className="group rounded-xl border border-[#dedfe2] bg-white p-5"><summary className="cursor-pointer list-none font-semibold">What does {integration.name} add to a Vozon workflow?<span className="float-right text-[#5b4ce6] group-open:rotate-45">+</span></summary><p className="mt-4 text-sm leading-7 text-[#55585f]">{editorial.why}</p></details>
            <details className="group rounded-xl border border-[#dedfe2] bg-white p-5"><summary className="cursor-pointer list-none font-semibold">How do I set up {integration.name}?<span className="float-right text-[#5b4ce6] group-open:rotate-45">+</span></summary><p className="mt-4 text-sm leading-7 text-[#55585f]">{guide.setup}</p></details>
            <details className="group rounded-xl border border-[#dedfe2] bg-white p-5"><summary className="cursor-pointer list-none font-semibold">What should I verify before launch?<span className="float-right text-[#5b4ce6] group-open:rotate-45">+</span></summary><p className="mt-4 text-sm leading-7 text-[#55585f]">{guide.check}</p></details>
          </div></div>
        </section>

        {related.length ? <section className={`${sectionClass} bg-white`}><div className="mx-auto max-w-[1340px]"><h2 className={headingClass}>More in {integration.category}</h2><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <Link className="rounded-xl border border-[#dedfe2] bg-white p-5 text-sm font-semibold text-[#171719] transition hover:border-[#5b4ce6] hover:text-[#4d3ec9]" href={`/integrations/${item.slug}`} key={item.slug}>{item.name} <span aria-hidden="true">&rarr;</span></Link>)}</div></div></section> : null}
        <section className="border-t border-[#dedfe2] bg-white px-5 py-12 sm:px-7 sm:py-14"><div className="mx-auto max-w-[850px] text-center"><p className={eyebrowClass}>Build your workflow</p><h2 className="mt-5 text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.055em]">Put {integration.name} to work in the right call flow.</h2><p className="mx-auto mt-4 max-w-[650px] text-[15px] leading-7 text-[#55585f] sm:text-base">{isDigitalBot ? "Connect the right clinic workspace to a Vozon agent, activate only the appointment tools it needs, and test the complete booking flow before launch." : "Tell us what your agent needs to hear, say, read, or update. We'll help map the connection and test it with your call scenarios."}</p><Link className="mt-7 inline-flex min-h-12 items-center rounded-full bg-[#5b4ce6] px-7 text-sm font-bold text-white hover:bg-[#4d3ec9]" href={primaryAction.href}>{primaryAction.label} <span aria-hidden="true" className="ml-2">&rarr;</span></Link></div></section>
      </div>
    </SiteLayout>
  );
}
