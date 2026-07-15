import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";
import type { UseCaseExperience } from "@/config/useCaseExperiences";

type BusinessUseCase = {
  slug: string;
  title: string;
  summary: string;
  highlights: readonly string[];
  sections: ReadonlyArray<{ title: string; body: string }>;
};

function Pill({ children }: { children: string }) {
  return (
    <span className="inline-flex rounded-full border border-[#35fbe0]/25 bg-[#35fbe0]/10 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em] text-[#75fff0]">
      {children}
    </span>
  );
}

function CheckIcon({ tone = 0 }: { tone?: number }) {
  const color =
    tone % 3 === 1
      ? "border-[#8f83e8]/25 bg-[#8f83e8]/10 text-[#c5bdff]"
      : tone % 3 === 2
        ? "border-[#ff9655]/25 bg-[#ff9655]/10 text-[#ffb17e]"
        : "border-[#35fbe0]/25 bg-[#35fbe0]/10 text-[#75fff0]";

  return <span className={`grid size-7 shrink-0 place-items-center rounded-full border text-xs font-black ${color}`}>&#10003;</span>;
}

function WorkflowDemo({ business, experience }: { business: BusinessUseCase; experience: UseCaseExperience }) {
  const marks: Record<string, string> = {
    "lead-qualification": "LQ",
    "customer-support": "CS",
    receptionists: "RX",
    "dispatch-service": "DS",
  };

  return (
    <div className="use-case-visual relative mx-auto w-full max-w-[590px] py-5 sm:px-5 sm:py-8">
      <div className="use-case-orbit use-case-orbit-one absolute left-1/2 top-1/2 size-[108%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <div className="use-case-orbit use-case-orbit-two absolute left-1/2 top-1/2 size-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <div className="relative z-10 overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
        <div className="flex items-center justify-between gap-5 border-b border-white/[0.08] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl border border-[#35fbe0]/25 bg-[#35fbe0]/10 text-[11px] font-black text-[#75fff0]">
              {marks[business.slug] ?? "AI"}
            </span>
            <div>
              <strong className="block text-xs font-bold text-white">{business.title}</strong>
              <span className="mt-0.5 block text-[10px] text-slate-500">Live voice workflow</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#35fbe0]/20 bg-[#35fbe0]/[0.07] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#75fff0]">
            <span className="size-1.5 rounded-full bg-[#35fbe0] shadow-[0_0_8px_#35fbe0]" />
            {experience.demo.status}
          </span>
        </div>

        <div className="p-5 sm:p-7">
          <div className="flex h-16 items-center justify-center gap-1" aria-label="Live voice activity">
            {[12, 23, 17, 34, 20, 43, 25, 37, 16, 29, 13, 39, 22, 31, 18].map((height, index) => (
              <span className="use-case-wave w-1 rounded-full bg-[linear-gradient(180deg,#75fff0,#8f83e8)]" key={index} style={{ height, animationDelay: `${index * -65}ms` }} />
            ))}
          </div>
          <div className="mt-4 grid gap-3">
            <div className="mr-7 rounded-xl rounded-tl-sm border border-white/[0.08] bg-white/[0.04] p-4 sm:mr-12">
              <span className="text-[10px] font-black uppercase tracking-[0.13em] text-slate-500">Caller</span>
              <p className="mt-2 text-sm leading-6 text-slate-200">{experience.demo.caller}</p>
            </div>
            <div className="ml-7 rounded-xl rounded-tr-sm border border-[#8f83e8]/20 bg-[#8f83e8]/[0.075] p-4 sm:ml-12">
              <span className="text-[10px] font-black uppercase tracking-[0.13em] text-[#c5bdff]">vozon.ai</span>
              <p className="mt-2 text-sm leading-6 text-white">{experience.demo.agent}</p>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#35fbe0]/20 bg-[#35fbe0]/[0.06] p-4">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#35fbe0] text-sm font-black text-[#031310]">&#10003;</span>
            <div>
              <span className="block text-[9px] font-black uppercase tracking-[0.12em] text-[#75fff0]">Latest event</span>
              <strong className="mt-1 block text-xs font-semibold text-white sm:text-sm">{experience.demo.action}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UseCaseExperiencePage({ business, experience }: { business: BusinessUseCase; experience: UseCaseExperience }) {
  return (
    <SiteLayout>
      <div className="use-case-page overflow-hidden bg-black text-white">
        <section className="use-case-hero relative overflow-hidden border-b border-white/[0.06] px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-36 lg:pt-40">
          <div className="use-case-grid absolute inset-0 opacity-45" />
          <div className="absolute -left-52 top-16 size-[34rem] rounded-full bg-[#35fbe0]/[0.07] blur-[120px]" />
          <div className="absolute -right-40 top-24 size-[30rem] rounded-full bg-[#8f83e8]/[0.07] blur-[120px]" />
          <div className="relative mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.88fr)] lg:items-center">
            <div className="max-w-3xl">
              <Pill>{experience.label}</Pill>
              <h1 className="mt-7 text-[clamp(3rem,6vw,5.2rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
                AI voice agents for {business.title.toLowerCase()} <span className="use-case-heading-accent">{experience.heroAccent}</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">{business.summary}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link className="inline-flex min-h-12 items-center rounded-lg bg-[#35fbe0] px-6 text-sm font-extrabold text-[#031310] transition hover:-translate-y-0.5 hover:bg-[#75fff0]" href="/#demo">
                  Try a demo <span className="ml-3">&rarr;</span>
                </Link>
                <Link className="inline-flex min-h-12 items-center rounded-lg border border-white/15 bg-white/[0.04] px-6 text-sm font-extrabold text-white transition hover:bg-white/[0.08]" href="/#contact">
                  Contact sales
                </Link>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
                {business.highlights.map((highlight) => (
                  <span className="inline-flex items-center gap-2" key={highlight}><span className="size-1.5 rounded-full bg-[#35fbe0]" />{highlight}</span>
                ))}
              </div>
            </div>
            <WorkflowDemo business={business} experience={experience} />
          </div>
        </section>

        <section className="border-b border-white/[0.06] bg-black px-5 sm:px-8">
          <div className="mx-auto grid max-w-[1240px] sm:grid-cols-3">
            {experience.proof.map((item, index) => (
              <div className="border-b border-white/[0.08] py-7 last:border-b-0 sm:border-b-0 sm:border-r sm:px-7 sm:last:border-r-0 sm:first:pl-0" key={item.label}>
                <div className="flex items-start justify-between gap-4">
                  <strong className={`block text-2xl font-semibold tracking-[-0.03em] ${index === 1 ? "text-[#c5bdff]" : index === 2 ? "text-[#ffb17e]" : "text-[#75fff0]"}`}>{item.value}</strong>
                  <span className="text-4xl font-black leading-none text-white/[0.035]">0{index + 1}</span>
                </div>
                <span className="mt-1 block text-sm text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-[1240px]">
            <div className="max-w-3xl">
              <Pill>What it handles</Pill>
              <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">Built around the complete conversation.</h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">From the first question to the final handoff, every stage stays connected to a useful operational outcome.</p>
            </div>
            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {experience.capabilities.map((capability, index) => (
                <article className="use-case-capability group relative overflow-hidden rounded-2xl border border-white/10 bg-black p-6 transition hover:-translate-y-1 sm:p-7" key={capability.title}>
                  <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${index === 1 ? "via-[#8f83e8]" : index === 2 ? "via-[#ff9655]" : "via-[#35fbe0]"} to-transparent opacity-70`} />
                  <div className="flex items-center justify-between gap-5">
                    <span className={`text-xs font-black uppercase tracking-[0.13em] ${index === 1 ? "text-[#c5bdff]" : index === 2 ? "text-[#ffb17e]" : "text-[#75fff0]"}`}>{capability.eyebrow}</span>
                    <span className="text-4xl font-black text-white/[0.04]">0{index + 1}</span>
                  </div>
                  <h3 className="mt-7 text-2xl font-semibold leading-tight tracking-[-0.025em]">{capability.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-slate-400">{capability.body}</p>
                  <ul className="mt-7 grid gap-3 border-t border-white/[0.08] pt-6">
                    {capability.points.map((point) => <li className="flex items-start gap-3 text-sm font-medium text-slate-200" key={point}><CheckIcon tone={index} /><span>{point}</span></li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/[0.06] bg-[#030605] px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <Pill>How it works</Pill>
              <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">A clear path from workflow to live calls.</h2>
              <p className="mt-5 text-base leading-7 text-slate-400">Start with one high-value conversation, define its boundaries, and improve it from real outcomes.</p>
            </div>
            <ol className="grid gap-3">
              {experience.workflow.map((step, index) => (
                <li className="use-case-step group relative grid grid-cols-[52px_1fr] gap-4 rounded-2xl border border-white/[0.08] bg-black p-5 transition sm:grid-cols-[64px_1fr] sm:gap-6 sm:p-7" key={step.title}>
                  <span className="grid size-12 place-items-center rounded-xl border border-[#8f83e8]/25 bg-[#8f83e8]/10 text-sm font-black text-[#c5bdff] transition sm:size-14">0{index + 1}</span>
                  <div><h3 className="text-xl font-semibold tracking-[-0.02em] sm:text-2xl">{step.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">{step.body}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-[1240px]">
            <div className="mx-auto max-w-3xl text-center"><Pill>Common workflows</Pill><h2 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">Useful in the moments that matter.</h2></div>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {experience.scenarios.map((scenario, index) => (
                <article className="use-case-scenario relative overflow-hidden rounded-2xl border border-white/10 bg-black p-6 sm:p-7" key={scenario.title}>
                  <div className={`absolute -right-16 -top-16 size-40 rounded-full blur-[55px] ${index === 1 ? "bg-[#8f83e8]/15" : index === 2 ? "bg-[#ff9655]/15" : "bg-[#35fbe0]/15"}`} />
                  <span className={`relative text-xs font-black ${index === 1 ? "text-[#c5bdff]" : index === 2 ? "text-[#ffb17e]" : "text-[#75fff0]"}`}>0{index + 1}</span>
                  <h3 className="relative mt-8 text-2xl font-semibold tracking-[-0.025em]">{scenario.title}</h3>
                  <p className="relative mt-3 text-sm leading-6 text-slate-400">{scenario.body}</p>
                  <div className="relative mt-7 border-t border-white/[0.08] pt-5"><span className="text-[10px] font-black uppercase tracking-[0.13em] text-slate-500">Expected outcome</span><strong className="mt-2 block text-sm text-white">{scenario.outcome}</strong></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/[0.06] bg-[#030605] px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-[1100px] text-center">
            <Pill>Connect your stack</Pill>
            <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">Fit the workflow around the systems your team already uses.</h2>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {experience.integrations.map((integration, index) => (
                <div className="use-case-integration rounded-xl border border-white/[0.09] bg-black p-4 text-left transition" key={integration}><div className="flex items-center justify-between"><span className={`text-[10px] font-black ${index % 3 === 1 ? "text-[#c5bdff]" : index % 3 === 2 ? "text-[#ffb17e]" : "text-[#75fff0]"}`}>0{index + 1}</span><span className="size-2 rounded-sm bg-white/20" /></div><strong className="mt-7 block text-sm font-semibold text-slate-200">{integration}</strong></div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="text-center"><Pill>F.A.Q.</Pill><h2 className="mt-6 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">Questions, answered clearly.</h2></div>
            <div className="mt-10 grid gap-2">
              {experience.faqs.map((faq) => (
                <details className="group rounded-xl border border-white/[0.09] bg-black px-5 py-4 transition open:border-[#35fbe0]/25 open:bg-[#35fbe0]/[0.025] sm:px-6" key={faq.question}><summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-sm font-semibold sm:text-base">{faq.question}<span className="grid size-7 shrink-0 place-items-center rounded-full border border-white/10 text-[#75fff0] transition group-open:rotate-45">+</span></summary><p className="mt-4 max-w-3xl border-t border-white/[0.07] pt-4 text-sm leading-6 text-slate-400">{faq.answer}</p></details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-8 sm:pb-24">
          <div className="use-case-cta relative mx-auto flex max-w-[1160px] flex-col items-center justify-between gap-8 overflow-hidden rounded-3xl border border-[#35fbe0]/25 p-8 text-center sm:p-10 md:flex-row md:text-left lg:p-12">
            <div className="relative max-w-2xl"><p className="text-xs font-black uppercase tracking-[0.14em] text-[#75fff0]">Ready to get started?</p><h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">Put {business.title.toLowerCase()} to work on one real call workflow.</h2></div>
            <Link className="relative inline-flex min-h-12 shrink-0 items-center rounded-lg bg-[#35fbe0] px-7 text-sm font-extrabold text-[#031310] transition hover:-translate-y-0.5 hover:bg-[#75fff0]" href="/#contact">Contact us <span className="ml-3">&rarr;</span></Link>
          </div>
        </section>
      </div>

      <style>{`
        .use-case-grid {
          background-image: linear-gradient(rgba(255,255,255,0.032) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.032) 1px, transparent 1px);
          background-size: 52px 52px;
          -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 88%);
          mask-image: linear-gradient(to bottom, black 0%, transparent 88%);
        }
        .use-case-heading-accent { background: linear-gradient(105deg,#75fff0 5%,#35fbe0 45%,#8f83e8 100%); -webkit-background-clip:text; background-clip:text; color:transparent; }
        .use-case-orbit { border:1px dashed rgba(53,251,224,.12); animation:use-case-orbit 38s linear infinite; pointer-events:none; }
        .use-case-orbit-two { border-color:rgba(143,131,232,.12); animation-direction:reverse; animation-duration:29s; }
        .use-case-wave { transform-origin:center; animation:use-case-wave 1.1s ease-in-out infinite alternate; }
        .use-case-capability:hover { border-color:rgba(53,251,224,.24); box-shadow:0 22px 55px rgba(53,251,224,.05); }
        .use-case-step:hover { border-color:rgba(143,131,232,.32); transform:translateX(4px); }
        .use-case-step:hover > span { background:#8f83e8; color:white; }
        .use-case-integration:hover { border-color:rgba(53,251,224,.28); background:rgba(53,251,224,.035); transform:translateY(-2px); }
        .use-case-cta { background:radial-gradient(circle at 8% 0%,rgba(53,251,224,.18),transparent 38%),radial-gradient(circle at 92% 100%,rgba(143,131,232,.14),transparent 38%),#050a08; }
        @keyframes use-case-orbit { to { transform:translate(-50%,-50%) rotate(360deg); } }
        @keyframes use-case-wave { from { transform:scaleY(.55); opacity:.55; } to { transform:scaleY(1); opacity:1; } }
        @media (prefers-reduced-motion:reduce) { .use-case-page *, .use-case-page *::before, .use-case-page *::after { animation:none !important; transition-duration:.01ms !important; } }
      `}</style>
    </SiteLayout>
  );
}
