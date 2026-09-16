/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { ConnectedOperationsPanel, type ConnectedOperation } from "@/components/layout/ConnectedOperationsPanel";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SolutionJourneyCards } from "@/components/layout/SolutionJourneyCards";

export type SolutionCard = {
  title: string;
  body: string;
  eyebrow?: string;
  outcome?: string;
  points?: readonly string[];
  image?: string;
};

export type SolutionFaq = { question: string; answer: string };

export type SolutionExperienceContent = {
  id: string;
  category: string;
  title: string;
  summary: string;
  heroImage: string;
  heroAlt: string;
  highlights: readonly string[];
  showcase: readonly SolutionCard[];
  capabilities: readonly SolutionCard[];
  journey: readonly SolutionCard[];
  integrations: readonly string[];
  faqs: readonly SolutionFaq[];
  proof?: readonly { value: string; label: string }[];
  reviews?: readonly { quote: string; name: string; role: string }[];
};

const headingClass = "text-[clamp(2rem,2.8vw,2.6rem)] font-semibold leading-[1.1] tracking-[-0.04em]";

const solutionImages: Record<string, { hero: string; feature: string }> = {
  "industry-financial-services": { hero: "/images/finance_1.png", feature: "/images/usecaseimages/finance_2.png" },
  "industry-insurance": { hero: "/images/usecaseimages/insurance_1.png", feature: "/images/insurance_2.png" },
  "industry-logistics": { hero: "/images/usecaseimages/logistics_1.png", feature: "/images/usecaseimages/logistics_2.png" },
  "industry-home-services": { hero: "/images/usecaseimages/home_service_1.png", feature: "/images/usecaseimages/home_service_2.png" },
  "industry-retail-consumer": { hero: "/images/usecaseimages/retail_1.png", feature: "/images/usecaseimages/retail.png" },
  "industry-travel-hospitality": { hero: "/images/usecaseimages/hospitality_1.png", feature: "/images/usecaseimages/hosiptaility_2.png" },
  "industry-debt-collection": { hero: "/images/usecaseimages/dept_1.png", feature: "/images/usecaseimages/dept_2.png" },
  "use-case-lead-qualification": { hero: "/images/usecaseimages/lead_1.png", feature: "/images/usecaseimages/lead_2.png" },
  "use-case-customer-support": { hero: "/images/usecaseimages/customer_support_1.png", feature: "/images/usecaseimages/customer_support_2.png" },
  "use-case-receptionists": { hero: "/images/usecaseimages/receptionist_1.png", feature: "/images/usecaseimages/receptionist_2.png" },
  "use-case-dispatch-service": { hero: "/images/usecaseimages/dispatch_1.png", feature: "/images/usecaseimages/dispatch_2.png" },
};

const defaultSolutionImages = { hero: "/images/ai_voice.png", feature: "/images/dashboard.png" };

function Check() {
  return <span className="grid size-5 shrink-0 place-items-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">&#10003;</span>;
}

function Label({ children }: { children: string }) {
  return <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-700">{children}</p>;
}

export function SolutionExperienceTemplate({ content }: { content: SolutionExperienceContent }) {
  const images = solutionImages[content.id] ?? defaultSolutionImages;
  const showcase = content.showcase.length ? content.showcase : content.capabilities;
  const proof = content.proof?.length ? content.proof : [
    { value: "24/7", label: "Call availability" },
    { value: "Clear", label: "Structured outcomes" },
    { value: "Human", label: "Handoffs when needed" },
  ];
  const approvedItems = content.capabilities.slice(0, 3).map((item) => item.eyebrow ?? item.title);
  const valueCards = content.reviews?.length
    ? [
        ...content.reviews.map((review) => ({ title: review.name, body: review.quote, detail: review.role })),
        ...content.capabilities.map((item) => ({ title: item.title, body: item.body, detail: item.eyebrow ?? "Operational value" })),
      ]
    : content.capabilities.slice(0, 3).map((item) => ({ title: item.title, body: item.body, detail: item.eyebrow ?? "Operational value" }));
  const connectedOperations: ConnectedOperation[] = content.capabilities.slice(0, 3).map((item, index) => {
    const integrations = Array.from({ length: 3 }, (_, stepIndex) =>
      content.integrations[(index * 2 + stepIndex) % content.integrations.length] ?? `Workflow step ${stepIndex + 1}`,
    );
    const stepTitles = item.points?.length ? item.points : integrations;

    return {
      title: item.eyebrow ?? item.title,
      detail: item.points?.[0] ?? item.outcome ?? "Connected workflow",
      workflow: item.title,
      status: ["Completed", "Synced", "Triggered"][index] ?? "Ready",
      agentTitle: `${content.title} ${item.eyebrow?.toLowerCase() ?? "workflow"} assistant`,
      agentDetail: item.body,
      steps: integrations.map((integration, stepIndex) => ({
        title: stepTitles[stepIndex] ?? integration,
        detail: ["Checked", "Updated", "Ready"][stepIndex] ?? "Ready",
      })),
      outcome: item.outcome ?? item.points?.[item.points.length - 1] ?? "Workflow completed",
      summary: `${integrations.join(" · ")} · outcome recorded`,
    };
  });

  return (
    <SiteLayout>
      <main className="solution-shared overflow-hidden bg-white text-slate-950" id={content.id}>
        <section className="relative overflow-hidden bg-white px-5 pb-8 pt-[72px] sm:px-8 sm:pb-10 sm:pt-20 lg:pb-12 lg:pt-24">
          <div className="mx-auto grid max-w-[1280px] items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
            <div className="max-w-[610px] solution-reveal">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d8d0e5] bg-[#faf8fc]/90 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#625b7d] shadow-sm">
                <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-teal-500 opacity-50" /><span className="relative size-2 rounded-full bg-teal-600" /></span>
                {content.category}
              </div>
              <h1 className="mt-6 text-[clamp(2.5rem,4.5vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.055em] text-slate-950">AI voice agents for <span className="block text-teal-700">{content.title}</span></h1>
              <p className="mt-6 max-w-[570px] text-[15px] leading-7 text-slate-900">{content.summary}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="inline-flex min-h-12 items-center gap-2 rounded-full bg-teal-700 px-6 text-sm font-bold text-white shadow-[0_15px_35px_rgba(13,148,136,.2)] transition hover:-translate-y-0.5 hover:bg-teal-800" href={`/contact?solution=${content.id}`}>Plan your workflow <span aria-hidden="true">&rarr;</span></Link>
                <Link className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#d8d0e5] bg-[#faf8fc]/90 px-6 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-[#a89bbb] hover:bg-white" href="/login?mode=register">See how it works</Link>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-slate-600">{content.highlights.map((item) => <span className="flex items-center gap-2" key={item}><Check />{item}</span>)}</div>
            </div>
            <div className="relative mx-auto w-full max-w-[640px] bg-white solution-reveal solution-delay">
              <div className="solution-hero-stage relative h-[430px] sm:h-[530px]">
                <img alt={content.heroAlt} className="solution-hero-image absolute inset-0 size-full object-contain object-right-bottom" loading="eager" src={images.hero} />
              </div>
            </div>
          </div>
        </section>

        <section aria-label={`${content.title} focus areas`} className="border-y border-slate-200/80 bg-white py-8 sm:py-10 lg:py-12">
          <p className="mb-5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Built for the rhythm of modern {content.title.toLowerCase()} teams</p>
          <div className="solution-marquee flex w-max items-center gap-4 px-2">{[...showcase, ...showcase].map((item, index) => <article aria-hidden={index >= showcase.length} className="flex h-[86px] w-72 shrink-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-[0_8px_24px_rgba(15,23,42,.035)]" key={`${item.title}-${index}`}>{item.image ? <img alt="" className="size-12 rounded-xl object-cover" src={item.image} /> : <span className="grid size-10 place-items-center rounded-xl bg-teal-50 text-xs font-bold text-teal-700">0{index % showcase.length + 1}</span>}<div><h2 className="text-sm font-semibold text-slate-900">{item.title}</h2><p className="mt-1 line-clamp-1 text-xs text-slate-500">{item.outcome ?? item.body}</p></div></article>)}</div>
        </section>

        <section className="border-y border-[#eee9f5] bg-white px-5 py-10 sm:px-8 sm:py-12 lg:py-14" id={`${content.id}-workflows`}>
          <div className="mx-auto max-w-[1200px]">
            <div className="mx-auto max-w-3xl text-center"><Label>Everyday workflows</Label><h2 className={`${headingClass} mt-4`}>One calm voice for the calls that fill your day.</h2><p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-slate-800">Start with one high-volume {content.title.toLowerCase()} workflow, then expand using the same voice, connected tools, and operational rules.</p><div className="mt-6 flex flex-wrap justify-center gap-2.5">{["Available 24/7", "Rules-based actions", "Connected outcomes"].map((item) => <span className="rounded-full border border-[#d8d0e5] bg-[#f7f4fb] px-3.5 py-2 text-[11px] font-semibold text-[#625b7d]" key={item}>{item}</span>)}</div></div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">{content.capabilities.slice(0, 3).map((item, index) => <article className="group flex min-h-[275px] flex-col rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,.04)] transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-[0_16px_38px_rgba(13,148,136,.1)]" key={item.title}><div className="flex items-center justify-between"><span className="grid size-11 place-items-center rounded-xl bg-teal-50 text-xs font-bold text-teal-700">0{index + 1}</span><span className="text-[10px] font-bold uppercase tracking-wider text-[#8a80a2]">{item.eyebrow ?? "Workflow"}</span></div><h3 className="mt-6 text-lg font-semibold tracking-[-0.02em]">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-700">{item.body}</p><div className="mt-auto border-t border-slate-100 pt-5 text-xs font-semibold text-teal-800">{item.points?.[0] ?? item.outcome ?? "Structured outcome"}</div></article>)}</div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-white px-5 py-10 sm:px-8 sm:py-12 lg:py-14" id={`${content.id}-journey`}>
          <div className="mx-auto max-w-[1200px]">
            <div className="mx-auto max-w-2xl text-center"><Label>A call, end to end</Label><h2 className={`${headingClass} mt-3`}>From hello to a confirmed outcome.</h2><p className="mt-3 text-[15px] leading-7 text-slate-800">The agent listens, follows your approved {content.title.toLowerCase()} workflow, and records a clear result for your team.</p></div>
            <div className="mt-6 grid gap-4 lg:grid-cols-[.88fr_1.12fr] lg:items-stretch">
              <div className="solution-feature-stage relative min-h-[380px] overflow-hidden bg-white lg:min-h-0"><div className="absolute left-1/2 top-1/2 aspect-[1693/933] w-[126%] -translate-x-1/2 -translate-y-1/2 sm:w-[116%] lg:w-[112%]"><img alt={`${content.title} workflow support`} className="solution-feature-image absolute inset-0 size-full object-contain object-bottom" loading="lazy" src={images.feature} /></div></div>
              <SolutionJourneyCards>{content.journey.slice(0, 3).map((step, index) => <li className="solution-journey-card flex flex-col rounded-[16px] border border-teal-200 bg-white p-4 shadow-[0_6px_18px_rgba(15,118,110,.05)]" key={step.title}><div className="flex items-center justify-between"><span className="grid size-9 place-items-center rounded-lg bg-teal-100 text-xs font-bold text-teal-800">0{index + 1}</span><span className="rounded-full bg-teal-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-teal-800">{step.eyebrow ?? ["Listen", "Act", "Complete"][index]}</span></div><h3 className="mt-3 text-sm font-semibold">{step.title}</h3><p className="mt-1 text-xs leading-5 text-slate-700">{step.body}</p></li>)}</SolutionJourneyCards>
            </div>
          </div>
        </section>

        <section className="border-y border-[#eee9f5] bg-white px-5 py-10 sm:px-8 sm:py-12 lg:py-14" id={`${content.id}-reviews`}>
          <div className="mx-auto max-w-[1280px]"><div className="mx-auto max-w-3xl text-center"><Label>Results for your team</Label><h2 className={`${headingClass} mt-4`}>Better conversations. Clearer operational outcomes.</h2><p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-slate-800">Designed around the practical needs of {content.title.toLowerCase()} teams and the people they serve.</p></div><div className="mt-10 grid gap-5 md:grid-cols-3">{valueCards.slice(0, 3).map((card) => <article className="flex min-h-[220px] flex-col rounded-[24px] border border-[#d8d0e5] bg-white p-6 shadow-[0_8px_24px_rgba(109,106,156,.07)]" key={card.title}><span className="text-[10px] font-bold uppercase tracking-[0.15em] text-teal-700">{card.detail}</span><h3 className="mt-5 text-lg font-semibold">{card.title}</h3><p className="mt-3 text-sm leading-7 text-slate-700">{card.body}</p><div className="mt-auto pt-5"><Check /></div></article>)}</div></div>
        </section>

        <section className="border-y border-teal-100 bg-white px-5 py-10 sm:px-8 sm:py-12 lg:py-14">
          <div className="mx-auto grid max-w-[1280px] gap-14 lg:grid-cols-[1.18fr_.82fr] lg:items-center lg:gap-20">
            <div className="lg:order-2"><Label>Safety &amp; human control</Label><h2 className={`${headingClass} mt-4`}>Clear boundaries. Human judgment where it matters.</h2><p className="mt-5 max-w-xl text-[15px] leading-7 text-slate-800">Your team defines the information an agent can use, the actions it can take, and the situations that always need a person.</p><ul className="mt-8 space-y-3">{["Only approved information and connected systems", "Explicit permissions for every action", "Documented escalation paths for exceptions"].map((item) => <li className="flex items-center gap-3 rounded-xl border border-teal-100 px-4 py-3 text-sm font-medium text-slate-800 shadow-sm" key={item}><Check />{item}</li>)}</ul></div>
            <div className="rounded-[30px] border border-teal-200 bg-white p-5 shadow-[0_20px_55px_rgba(15,118,110,.12)] sm:p-7 lg:order-1"><p className="text-sm font-semibold">{content.title} boundary map</p><p className="mt-1 text-xs text-slate-600">Configured by your team</p><div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-teal-200 bg-teal-50 p-4"><span className="text-[10px] font-bold uppercase tracking-wider">Routine &amp; approved</span><div className="mt-4 space-y-2">{approvedItems.map((item) => <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs" key={item}><Check />{item}</div>)}</div></div><div className="rounded-2xl border border-amber-200 bg-amber-50 p-4"><span className="text-[10px] font-bold uppercase tracking-wider">Sensitive or uncertain</span><div className="mt-4 space-y-2">{["Outside approved workflow", "Sensitive request", "Human judgment needed"].map((item) => <div className="rounded-xl bg-white px-3 py-2.5 text-xs" key={item}>! &nbsp;{item}</div>)}</div></div></div></div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-white px-5 py-10 sm:px-8 sm:py-12 lg:py-14" id={`${content.id}-integrations`}>
          <div className="relative mx-auto max-w-[1280px]">
            <ConnectedOperationsPanel
              operations={connectedOperations}
              summary={`With the right permissions, call outcomes can move into the ${content.title.toLowerCase()} tools your team already uses—without another round of manual entry.`}
              title={content.title}
            />
          </div>
        </section>

        <section className="border-y border-[#eee9f5] bg-white px-5 py-10 sm:px-8 sm:py-12 lg:py-14" id={`${content.id}-trust`}>
          <div className="mx-auto max-w-[1280px]">
            <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-16">
              <div className="max-w-xl"><Label>Security, control &amp; proof</Label><h2 className={`${headingClass} mt-4`}>Built for trusted {content.title.toLowerCase()} operations.</h2><p className="mt-5 text-[15px] leading-7 text-slate-800">Protect important workflows with scoped access, clear oversight, and dependable infrastructure for every configured conversation.</p><div className="mt-6 flex flex-wrap gap-2.5">{["Access controls", "Protected data", "Traceable activity"].map((item) => <span className="inline-flex items-center gap-2 rounded-full border border-[#d8d0e5] bg-[#faf8fc] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#625b7d]" key={item}><Check />{item}</span>)}</div></div>
              <div className="overflow-hidden rounded-[28px] border border-[#d8d0e5] bg-white shadow-[0_18px_46px_rgba(109,106,156,.11)]"><div className="grid divide-y divide-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">{proof.slice(0, 3).map((item) => <div className="px-5 py-6 text-center" key={item.label}><strong className="block text-3xl font-semibold tracking-[-0.04em] text-teal-700">{item.value}</strong><span className="mt-1.5 block text-xs font-medium text-slate-600">{item.label}</span></div>)}</div><div className="grid gap-4 border-t border-slate-200 p-5 sm:grid-cols-3 sm:p-6">{[
                { title: "Role-based access", body: "Limit workflow and customer-data access to the right people." },
                { title: "Protected data", body: "Use scoped integrations and appropriate retention controls." },
                { title: "Traceable activity", body: "Review outcomes, handoffs, and configured actions clearly." },
              ].map((item) => <article className="rounded-2xl border border-[#eee9f5] bg-[#faf8fc] p-4" key={item.title}><span className="grid size-9 place-items-center rounded-xl bg-teal-100"><Check /></span><h3 className="mt-3 text-sm font-bold">{item.title}</h3><p className="mt-1.5 text-xs leading-5 text-slate-600">{item.body}</p></article>)}</div></div>
            </div>
            <p className="mt-5 text-[11px] leading-5 text-slate-500 lg:text-right">Controls and compliance depend on configuration and operating policies; review each deployment against applicable requirements.</p>
          </div>
        </section>

        <section className="bg-white px-5 py-10 sm:px-8 sm:py-12 lg:py-14" id={`${content.id}-faq`}>
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <Label>Questions, answered</Label>
              <h2 className={`${headingClass} mt-4`}>What {content.title.toLowerCase()} teams ask us first.</h2>
              <p className="mt-5 text-[15px] leading-7 text-slate-800">Practical details to consider before introducing voice automation.</p>
            </div>
            <div className="mt-10 space-y-3 text-left">
              {content.faqs.map((faq, index) => <details className="group rounded-2xl border border-[#e8e2f1] bg-white px-5 py-5 shadow-[0_8px_24px_rgba(109,106,156,.07)] open:border-[#a89bbb]" key={faq.question} open={index === 0}><summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-semibold"><span>{faq.question}</span><span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#eee9f5] text-lg text-[#625b7d] transition group-open:rotate-45">+</span></summary><p className="mt-4 border-t border-[#eee9f5] pt-4 text-sm leading-7 text-slate-700">{faq.answer}</p></details>)}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 pb-14 pt-5 sm:px-8 lg:pb-16"><div className="mx-auto grid max-w-[1100px] gap-5 rounded-[24px] border border-[#cfc7df] bg-white px-6 py-8 shadow-[0_16px_42px_rgba(109,106,156,.12)] sm:px-9 lg:grid-cols-[1fr_auto] lg:items-center"><div><Label>Ready when you are</Label><h2 className="mt-2.5 text-[clamp(1.6rem,2.3vw,2.1rem)] font-semibold tracking-[-0.04em]">Bring us the {content.title.toLowerCase()} call you want to improve.</h2><p className="mt-3 text-sm leading-6 text-slate-700">We&apos;ll map the workflow, integrations, boundaries, and human handoff with your team.</p></div><Link className="inline-flex min-h-11 w-fit items-center rounded-full bg-teal-700 px-6 text-sm font-bold text-white hover:bg-teal-800" href={`/contact?solution=${content.id}`}>Contact us</Link></div></section>
        <section aria-hidden="true" className="solution-footer-cap">
          <div className="solution-footer-cap-circle">
            <svg className="solution-footer-cap-arrow" fill="none" viewBox="0 0 32 32">
              <path d="M16 5v20M8 17l8 8 8-8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            </svg>
          </div>
        </section>
      </main>

      <style>{`
        .solution-shared > section:not(:first-child):not(:nth-last-child(-n+2)) { padding-block: 2rem; }
        @media (min-width:640px) { .solution-shared > section:not(:first-child):not(:nth-last-child(-n+2)) { padding-block: 2.5rem; } }
        @media (min-width:1024px) { .solution-shared > section:not(:first-child):not(:nth-last-child(-n+2)) { padding-block: 3rem; } }
        .solution-hero-image { display:block; background:#fff; opacity:.98; filter:saturate(.96) contrast(.98) drop-shadow(0 24px 34px rgba(15,118,110,.12)); transform:scale(1.08) translate(3%,-1.5%); transform-origin:right bottom; mix-blend-mode:multiply; mask-image:radial-gradient(ellipse 82% 90% at 62% 50%,#000 66%,rgba(0,0,0,.9) 76%,rgba(0,0,0,.45) 86%,transparent 100%); -webkit-mask-image:radial-gradient(ellipse 82% 90% at 62% 50%,#000 66%,rgba(0,0,0,.9) 76%,rgba(0,0,0,.45) 86%,transparent 100%); }
        .solution-feature-image { display:block; background:#fff; z-index:1; opacity:.98; filter:saturate(.96) contrast(.98) drop-shadow(0 24px 34px rgba(15,118,110,.12)); transform:scale(1.02); transform-origin:center bottom; mix-blend-mode:multiply; mask-image:linear-gradient(to bottom,#000 0%,#000 80%,rgba(0,0,0,.92) 87%,transparent 100%); -webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 80%,rgba(0,0,0,.92) 87%,transparent 100%); }
        .solution-footer-cap { position:relative; height:165px; overflow:hidden; background:#fff; }
        .solution-footer-cap-circle { position:absolute; bottom:-375px; left:50%; display:flex; width:540px; height:540px; transform:translateX(-50%); justify-content:center; border-radius:50%; background:#000; padding-top:44px; color:#fff; }
        .solution-footer-cap-arrow { width:46px; height:46px; }
        .solution-marquee { animation:solution-marquee 30s linear infinite; will-change:transform; }
        .solution-marquee:hover { animation-play-state:paused; }
        .solution-reveal { animation:solution-rise .7s cubic-bezier(.2,.75,.3,1) both; }
        .solution-delay { animation-delay:.12s; }
        .solution-journey-card { opacity:0; transform:translate3d(48px,14px,0) scale(.98); transition:border-color .3s ease,box-shadow .3s ease; will-change:opacity,transform; }
        .solution-journey-card:hover { border-color:rgba(13,148,136,.45); box-shadow:0 12px 30px rgba(13,148,136,.10); }
        .solution-journey-cards.is-visible .solution-journey-card { animation:solution-journey-rise .75s cubic-bezier(.2,.75,.3,1) forwards; }
        .solution-journey-cards.is-visible .solution-journey-card:nth-child(2) { animation-delay:.18s; }
        .solution-journey-cards.is-visible .solution-journey-card:nth-child(3) { animation-delay:.36s; }
        @keyframes solution-marquee { from { transform:translateX(0); } to { transform:translateX(calc(-50% - .5rem)); } }
        @keyframes solution-rise { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes solution-journey-rise { from { opacity:0; transform:translate3d(48px,14px,0) scale(.98); } to { opacity:1; transform:translate3d(0,0,0) scale(1); } }
        @media (max-width:640px) { .solution-hero-image { transform:scale(1.04) translate(2%,-2%); transform-origin:center bottom; } .solution-marquee { width:auto; overflow-x:auto; padding-inline:1.25rem; animation:none; } .solution-marquee > :nth-child(n+5) { display:none; } }
        @media (prefers-reduced-motion:reduce) { .solution-marquee,.solution-reveal,.solution-journey-card { opacity:1; transform:none; animation:none; transition:none; } }
      `}</style>
    </SiteLayout>
  );
}
