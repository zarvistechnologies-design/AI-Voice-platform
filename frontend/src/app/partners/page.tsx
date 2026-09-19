import type { Metadata } from "next";
import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";
import { PartnerConsolePreview } from "@/components/partners/PartnerConsolePreview";

export const metadata: Metadata = {
  title: "White Label Partner Programme | Vozon",
  description:
    "Launch and grow your own AI voice business with Vozon's white-label platform, branded customer workspaces, flexible plans, and partner controls.",
  alternates: { canonical: "/partners" },
};

const benefits = [
  {
    eyebrow: "Brand experience",
    title: "Build under your brand",
    body: "Put your product name, logo, colours, support details, legal links, and customer experience at the centre of every workspace.",
  },
  {
    eyebrow: "Commercial control",
    title: "Control your offer",
    body: "Create your own plans, choose included usage, set customer limits, and decide how your voice AI service reaches the market.",
  },
  {
    eyebrow: "Customer ownership",
    title: "Own the relationship",
    body: "Provision isolated customer organisations, manage subscriptions, and support each account through one partner console.",
  },
  {
    eyebrow: "Partner operations",
    title: "See the business clearly",
    body: "Follow active customers, subscriptions, usage economics, partner billing, and launch readiness from one operating view.",
  },
] as const;

const platformFeatures = [
  { number: "01", title: "Customer-facing brand", body: "Configure logos, product identity, colours, support information, legal links, and branded email settings." },
  { number: "02", title: "Custom domains", body: "Connect customer app and public-link domains with guided DNS verification and managed TLS status." },
  { number: "03", title: "Your plans and pricing", body: "Publish recurring plans with included minutes, usage pricing, trials, feature access, and customer limits." },
  { number: "04", title: "Isolated customer workspaces", body: "Provision each client into a separate organisation with its own owner, brand, plan, and subscription state." },
  { number: "05", title: "Voice model access", body: "Package approved speech, language, and voice models into offers that fit the customers you serve." },
  { number: "06", title: "Economics and billing", body: "Review recurring revenue, customer usage charges, wholesale usage, contribution, and partner invoices." },
] as const;

const launchSteps = [
  { title: "Shape the offer", body: "Tell us about your market, customers, expected usage, and the services you want to sell." },
  { title: "Configure your brand", body: "Set your visual identity, support details, legal links, email settings, and customer-facing domains." },
  { title: "Publish your plans", body: "Choose model access, allowances, limits, recurring prices, and the usage structure for your clients." },
  { title: "Launch customers", body: "Provision secure workspaces, invite customer owners, and manage the relationship from your console." },
] as const;

const faqs = [
  { question: "What is a white-label AI voice platform?", answer: "It lets you deliver AI voice services through a platform carrying your own product identity. Your clients use branded workspaces while you manage their plans, access, and service relationship." },
  { question: "What can I customise?", answer: "You can configure product and company names, logos, colours, support details, legal links, branded email settings, and approved customer-facing domains." },
  { question: "Can I create my own customer plans?", answer: "Yes. Partner controls support recurring prices, setup fees, trials, included minutes, usage pricing, feature access, model access, and per-customer limits within your contract." },
  { question: "How are customers managed?", answer: "Each customer is provisioned into an isolated organisation with its own owner, selected brand, plan snapshot, and subscription status. You can manage customer and subscription states from the partner console." },
  { question: "How do I apply?", answer: "Contact the Vozon team with your market, expected usage, and customer profile. We will review the right partner setup and walk you through the commercial and launch requirements." },
] as const;

function CheckIcon() {
  return (
    <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="m5 10.2 3.1 3.1L15.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-700">
      <span className="h-px w-7 bg-teal-600" />
      {children}
    </p>
  );
}

const headingClass = "text-[clamp(1.85rem,3.3vw,3.2rem)] font-semibold leading-[1.04] tracking-[-0.045em]";

export default function PartnersPage() {
  return (
    <SiteLayout>
      <main id="partners-page" className="overflow-hidden bg-white text-slate-950">
        <section className="relative overflow-hidden border-b border-[#e2e8e5] bg-white px-5 pb-14 pt-24 text-[#14231f] sm:px-8 sm:pb-16 sm:pt-28 lg:pt-32">
          <div className="relative mx-auto grid max-w-[1280px] items-center gap-12 lg:grid-cols-[.92fr_1.08fr] lg:gap-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#dbe4e1] bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.17em] text-teal-700 shadow-sm">
                <span className="size-2 rounded-full bg-teal-600" />
                Vozon white-label programme
              </div>
              <h1 className="mt-6 max-w-2xl text-[clamp(1.85rem,3.8vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.05em]">
                Build your own <span className="text-teal-700">AI voice business.</span>
              </h1>
              <p className="mt-6 max-w-xl text-[15px] leading-7 text-slate-700">
                Launch voice AI under your brand with customer-ready workspaces, your own plans, flexible model access, and the controls to grow every account.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact?topic=white-label-partnership" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-teal-700 px-6 text-sm font-bold text-white shadow-[0_14px_32px_rgba(15,118,110,.2)] transition hover:-translate-y-0.5 hover:bg-teal-800">
                  Apply as a partner
                </Link>
                <Link href="#programme" className="inline-flex min-h-12 items-center rounded-full border border-[#dbe4e1] bg-white px-6 text-sm font-bold text-[#29423b] transition hover:-translate-y-0.5 hover:border-teal-400">
                  Explore the programme
                </Link>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-slate-600">
                {["Your brand", "Your plans", "Your customer relationships"].map((item) => (
                  <span className="flex items-center gap-2" key={item}><span className="text-teal-700"><CheckIcon /></span>{item}</span>
                ))}
              </div>
            </div>

            <PartnerConsolePreview />
          </div>
        </section>

        <section className="border-b border-[#e2e8e5] bg-white px-5 sm:px-8">
          <div className="mx-auto grid max-w-[1280px] sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["Your brand", "Across every screen"],
              ["Your pricing", "Plans you control"],
              ["Your customers", "Isolated workspaces"],
              ["Your domains", "Branded destinations"],
              ["One console", "End-to-end control"],
            ].map(([value, label]) => (
              <div className="border-b border-[#e2e8e5] px-4 py-6 sm:border-r sm:px-6 sm:py-7 lg:border-b-0 lg:last:border-r-0" key={value}>
                <strong className="block text-lg font-semibold tracking-[-.03em] text-teal-700">{value}</strong>
                <span className="mt-1.5 block text-xs text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="programme" className="px-5 py-12 sm:px-8 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-[1280px]">
            <div className="grid gap-8 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
              <div><Eyebrow>What you get</Eyebrow><h2 className={`${headingClass} mt-4 text-[#14231f]`}>A complete white-label operating layer.</h2></div>
              <p className="m-0 max-w-2xl text-[15px] leading-7 text-slate-700 lg:justify-self-end">More than a logo switch, the programme gives you the customer-facing brand, commercial controls, isolated client workspaces, and partner operations needed to run your own voice AI service.</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <article className="group rounded-[20px] border border-[#dfe7e4] bg-white p-6 shadow-[0_8px_24px_rgba(18,61,53,.05)] transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-[0_16px_38px_rgba(13,148,136,.09)]" key={benefit.title}>
                  <div className="flex items-center"><span className="grid size-10 place-items-center rounded-xl bg-teal-50 text-xs font-bold text-teal-700">0{index + 1}</span></div>
                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[.17em] text-teal-700">{benefit.eyebrow}</p>
                  <h3 className="mt-2 text-xl font-semibold tracking-[-.03em] text-[#14231f]">{benefit.title}</h3>
                  <p className="mt-2.5 text-sm leading-6 text-slate-600">{benefit.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#e2e8e5] bg-white px-5 py-12 sm:px-8 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-[1280px]">
            <div className="mx-auto max-w-3xl text-center">
              <div className="flex justify-center"><Eyebrow>The platform</Eyebrow></div>
              <h2 className={`${headingClass} mt-4 text-[#14231f]`}>Everything you need to run a branded voice AI service.</h2>
              <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-slate-700">Vozon handles the platform foundations so your team can focus on packaging the right offer and helping customers succeed.</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {platformFeatures.map((feature) => (
                <article className="rounded-[20px] border border-[#dfe7e4] bg-white p-6 shadow-[0_8px_22px_rgba(18,61,53,.04)]" key={feature.number}>
                  <span className="text-[10px] font-bold uppercase tracking-[.17em] text-teal-700">Platform / {feature.number}</span>
                  <h3 className="mt-5 text-lg font-semibold tracking-[-.025em] text-[#14231f]">{feature.title}</h3>
                  <p className="mt-2.5 text-sm leading-6 text-slate-600">{feature.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-black !bg-black px-5 py-12 text-white sm:px-8 sm:py-14 lg:py-16" style={{ backgroundColor: "#000000" }}>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#34d399] to-transparent" aria-hidden="true" />
          <div className="mx-auto max-w-[1180px]">
            <div className="grid gap-8 lg:grid-cols-[.78fr_1.22fr] lg:items-end">
              <div>
                <p className="m-0 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] !text-[#5eead4]"><span className="h-px w-7 bg-[#34d399]" />From application to launch</p>
                <h2 className={`${headingClass} mt-4 !text-white`}>A clear path to your first customer.</h2>
              </div>
              <p className="m-0 max-w-2xl text-sm leading-7 !text-[#d1e5df] lg:justify-self-end">Start with the market you know. We&apos;ll align the partner setup, then your team can configure the brand, commercial offer, and customer workspaces.</p>
            </div>
            <ol className="mt-10 grid overflow-hidden rounded-[24px] border border-emerald-300/25 !bg-black shadow-[0_18px_48px_rgba(0,0,0,.3)] md:grid-cols-4" style={{ backgroundColor: "#000000" }}>
              {launchSteps.map((step, index) => (
                <li className="border-b border-emerald-300/20 !bg-black p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0" key={step.title} style={{ backgroundColor: "#000000" }}>
                  <span className="grid size-9 place-items-center rounded-full border border-emerald-300/35 bg-emerald-400/10 text-[10px] font-bold !text-[#5eead4]">0{index + 1}</span>
                  <h3 className="mt-6 text-lg font-semibold !text-white">{step.title}</h3>
                  <p className="mt-2.5 text-sm leading-6 !text-[#bcd0ca]">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="px-5 py-12 sm:px-8 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <div className="flex justify-center"><Eyebrow>Partner programme questions</Eyebrow></div>
              <h2 className={`${headingClass} mt-4 text-[#14231f]`}>What partners ask us first.</h2>
            </div>
            <div className="mt-10 space-y-3">
              {faqs.map((faq, index) => (
                <details className="group rounded-2xl border border-[#dfe7e4] bg-white px-5 py-5 shadow-[0_8px_24px_rgba(18,61,53,.05)] open:border-teal-300" key={faq.question} open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-semibold text-[#14231f]"><span>{faq.question}</span><span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#edf7f4] text-lg text-teal-700 transition group-open:rotate-45">+</span></summary>
                  <p className="mt-4 border-t border-[#e2e8e5] pt-4 text-sm leading-7 text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-16 pt-2 sm:px-8">
          <div className="relative mx-auto max-w-[1100px] overflow-hidden rounded-[28px] border border-[#dbe4e1] bg-white px-6 py-10 text-center shadow-[0_16px_42px_rgba(18,61,53,.07)] sm:px-10 sm:py-12">
            <div className="absolute left-1/2 top-0 h-1 w-28 -translate-x-1/2 bg-teal-600" />
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-teal-700">Your brand. Vozon&apos;s engine.</p>
            <h2 className="mx-auto mt-4 max-w-2xl text-[clamp(1.8rem,3vw,2.8rem)] font-semibold leading-[1.05] tracking-[-.045em] text-[#14231f]">Let&apos;s build your voice AI business together.</h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-700">Tell us who you serve and what you want to launch. We&apos;ll help you review the right white-label partner setup.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/contact?topic=white-label-partnership" className="inline-flex min-h-12 items-center rounded-full bg-teal-700 px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-teal-800">Apply as a partner</Link>
              <Link href="/contact" className="inline-flex min-h-12 items-center rounded-full border border-teal-700/20 bg-white px-6 text-sm font-bold text-teal-800 transition hover:-translate-y-0.5 hover:border-teal-500">Talk to our team</Link>
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
