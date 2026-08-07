import type { Metadata } from "next";
import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata: Metadata = {
  title: "Careers at vozon.ai | Build the Future of Voice AI",
  description:
    "Join vozon.ai and help build the conversation layer that turns business calls into clear, connected action.",
};

const workAreas = [
  {
    number: "01",
    title: "Real-time intelligence",
    body: "Solve the hard problems behind natural voice interaction: latency, interruptions, context, multilingual speech, and reliable reasoning while a call is live.",
    accent: "#45ddce",
  },
  {
    number: "02",
    title: "Product and platform",
    body: "Create the tools teams use to design, test, launch, connect, and understand voice agents without losing sight of the caller experience.",
    accent: "#67e8f9",
  },
  {
    number: "03",
    title: "Trust and operations",
    body: "Make automation observable and dependable through clear boundaries, thoughtful handoffs, actionable call records, and quality feedback loops.",
    accent: "#a78bfa",
  },
] as const;

const workingPrinciples = [
  {
    title: "Own the outcome",
    body: "Understand the problem, make the trade-offs visible, and stay close to the result—not just the task that was assigned.",
    accent: "#45ddce",
  },
  {
    title: "Build from real conversations",
    body: "The best product decisions come from listening carefully to callers, customers, and the operational teams using what we build.",
    accent: "#67e8f9",
  },
  {
    title: "Move with clarity",
    body: "We value thoughtful speed: focused decisions, direct communication, small iterations, and fast learning from evidence.",
    accent: "#a78bfa",
  },
  {
    title: "Care about the details",
    body: "A pause, a handoff, or one unclear sentence can shape an entire call. Craft and reliability matter at every layer.",
    accent: "#f6c76e",
  },
] as const;

const candidateExperience = [
  {
    title: "Meaningful scope",
    body: "Work on problems that connect speech, intelligence, software, and real business operations.",
  },
  {
    title: "Close collaboration",
    body: "Share context early and work across product, engineering, design, and customer conversations.",
  },
  {
    title: "Room for judgment",
    body: "Bring a point of view, challenge assumptions constructively, and help shape how the product evolves.",
  },
  {
    title: "Respect for craft",
    body: "Do work you can explain clearly, test honestly, and improve continuously after it reaches people.",
  },
] as const;

const faqs = [
  {
    question: "What roles are currently open?",
    answer:
      "We do not have public role listings on this page yet. New opportunities will appear here as they open. You can still introduce yourself through a general applications.",
  },
  {
    question: "What should I include in a general application?",
    answer:
      "Tell us what you are especially good at, the kind of problems you want to solve, and why voice AI interests you. Links to relevant work, products, writing, or technical projects are helpful.",
  },
  {
    question: "Where is the team based?",
    answer:
      "Location and working arrangements will be stated clearly on each future role. If location is important to your application, include your current location and preferences when you contact us.",
  },
  {
    question: "What does vozon.ai look for?",
    answer:
      "We value strong problem-solving, clear communication, product judgment, evidence of craft, and genuine care for the people who experience the systems we build.",
  },
] as const;

const waveform = [24, 42, 68, 36, 82, 54, 94, 62, 44, 76, 56, 88, 48, 70, 32, 52, 28];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 20 20">
      <path d="M4 10h12m-4.5-4.5L16 10l-4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function PrincipleIcon({ color }: { color: string }) {
  return (
    <span className="grid size-10 place-items-center rounded-xl border" style={{ borderColor: `${color}2e`, backgroundColor: `${color}12`, color }} aria-hidden="true">
      <svg className="size-4" fill="none" viewBox="0 0 20 20">
        <path d="M10 2.75 12 8l5.25 2L12 12l-2 5.25L8 12l-5.25-2L8 8l2-5.25Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    </span>
  );
}

export default function CareerPage() {
  return (
    <SiteLayout>
      <main className="overflow-hidden bg-black text-white">
        <section className="relative border-b border-white/[0.08] px-5 pb-20 pt-36 sm:px-8 sm:pt-40 lg:px-12 lg:pb-28">
          <div className="pointer-events-none absolute left-1/2 top-28 h-px w-[min(1040px,86vw)] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#45ddce]/35 to-transparent" aria-hidden="true" />
          <div className="pointer-events-none absolute right-[-12rem] top-24 size-[32rem] rounded-full bg-[#67e8f9]/[0.055] blur-3xl" aria-hidden="true" />

          <div className="relative mx-auto grid max-w-[1180px] gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#45ddce]/20 bg-[#45ddce]/[0.07] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#75fff0]">
                <span className="size-1.5 rounded-full bg-[#45ddce] shadow-[0_0_10px_#45ddce]" aria-hidden="true" />
                Careers at vozon.ai
              </span>
              <h1 className="mt-7 max-w-4xl text-[clamp(3rem,6.5vw,5.7rem)] font-medium leading-[0.98] tracking-[-0.055em]">
                Build the future of <span className="bg-gradient-to-r from-[#75fff0] via-[#67e8f9] to-[#b9a5ff] bg-clip-text text-transparent">business conversations.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
                We are building the conversation layer that helps businesses understand callers, take action across their systems, and learn from every interaction. Join us in making voice AI useful, accountable, and genuinely better to talk to.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#45ddce] to-[#67e8f9] px-6 text-sm font-bold text-[#02110d] shadow-[0_14px_40px_rgba(69,221,206,0.18)] transition hover:-translate-y-0.5" href="#open-roles">
                  Explore opportunities <ArrowIcon />
                </Link>
                <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.035] px-6 text-sm font-bold text-white transition hover:border-white/25 hover:bg-white/[0.07]" href="/about">
                  Why vozon.ai <ArrowIcon />
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[500px] lg:mx-0 lg:justify-self-end">
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#030404] p-6 shadow-[0_32px_100px_rgba(0,0,0,0.48)] sm:p-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">A problem worth solving</span>
                    <strong className="mt-1.5 block text-sm">Make every conversation count</strong>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-200">
                    <span className="size-1.5 rounded-full bg-emerald-300" /> Live
                  </span>
                </div>

                <div className="my-9 flex h-28 items-center justify-center gap-1.5" aria-label="Decorative voice waveform">
                  {waveform.map((height, index) => (
                    <span className="w-1.5 rounded-full bg-gradient-to-t from-[#45ddce] via-[#67e8f9] to-[#b9a5ff] opacity-85" key={`${height}-${index}`} style={{ height: `${height}%` }} />
                  ))}
                </div>

                <div className="space-y-2.5">
                  {[
                    ["01", "Understand people", "#45ddce"],
                    ["02", "Connect the right context", "#67e8f9"],
                    ["03", "Move work forward", "#a78bfa"],
                  ].map(([number, label, color]) => (
                    <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3" key={number}>
                      <span className="text-[10px] font-bold" style={{ color }}>{number}</span>
                      <strong className="text-xs font-medium text-white/75">{label}</strong>
                      <span className="ml-auto size-1.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-[1180px]">
            <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#75fff0]">The work</p>
                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Voice looks simple. Making it work beautifully is not.</h2>
              </div>
              <div className="max-w-xl text-sm leading-7 text-white/50 sm:text-base sm:leading-8 lg:justify-self-end">
                <p>A useful voice agent has to listen, reason, respond, use tools, respect boundaries, and recover gracefully—all in the rhythm of a real conversation. That creates meaningful problems across AI, infrastructure, product, design, and operations.</p>
              </div>
            </div>

            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {workAreas.map((area) => (
                <article className="relative min-h-80 overflow-hidden rounded-[24px] border p-7" key={area.title} style={{ borderColor: `${area.accent}2a`, background: `radial-gradient(circle at 90% 0%, ${area.accent}18, transparent 42%), #000` }}>
                  <span className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ backgroundColor: `${area.accent}16`, color: area.accent }}>{area.number}</span>
                  <h3 className="mt-20 text-2xl font-semibold tracking-[-0.03em]">{area.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/45">{area.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/[0.08] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[0.68fr_1.32fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#b9a5ff]">How we work</p>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Principles for building work that matters.</h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-white/45">These principles describe the kind of team we are creating and how we approach difficult, fast-moving product problems together.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {workingPrinciples.map((principle) => (
                <article className="min-h-64 rounded-[22px] border p-6 sm:p-7" key={principle.title} style={{ borderColor: `${principle.accent}28`, background: `linear-gradient(145deg, ${principle.accent}0d, #000 62%)` }}>
                  <PrincipleIcon color={principle.accent} />
                  <h3 className="mt-10 text-xl font-semibold tracking-[-0.025em]">{principle.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/45">{principle.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-[1180px]">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#f6c76e]">What you can expect</p>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">A place to think deeply, build carefully, and make a visible difference.</h2>
            </div>

            <div className="mt-12 grid overflow-hidden rounded-[24px] border border-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {candidateExperience.map((item, index) => (
                <article className="relative min-h-56 border-white/10 p-6 sm:border-r sm:[&:nth-child(2)]:border-r-0 lg:[&:nth-child(2)]:border-r lg:last:border-r-0" key={item.title}>
                  <span className="text-[10px] font-bold text-white/25">0{index + 1}</span>
                  <h3 className="mt-10 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/45">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/[0.08] px-5 py-20 sm:px-8 lg:px-12 lg:py-28" id="open-roles">
          <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#75fff0]">Open roles</p>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Find your place in the conversation.</h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-white/45">We are growing thoughtfully. Published opportunities will appear here as they become available.</p>
            </div>

            <div className="relative overflow-hidden rounded-[24px] border border-[#45ddce]/20 bg-[#45ddce]/[0.035] p-7 sm:p-9">
              <div className="absolute right-[-4rem] top-[-5rem] size-52 rounded-full bg-[#45ddce]/10 blur-3xl" aria-hidden="true" />
              <div className="relative">
                <span className="inline-flex rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">General interest</span>
                <h3 className="mt-8 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">No public openings listed right now.</h3>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">If our mission feels closely connected to your work, we would still like to hear from you. Share what you do best, the problems you want to solve, and a few examples of work you are proud of.</p>
                <a className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#45ddce] to-[#67e8f9] px-6 text-sm font-bold text-[#02110d] transition hover:-translate-y-0.5" href="mailto:hello@vozon.ai?subject=Careers%20at%20vozon.ai">
                  Introduce yourself <ArrowIcon />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#b9a5ff]">Careers FAQ</p>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Before you apply.</h2>
              <p className="mt-6 max-w-sm text-sm leading-7 text-white/45">A few clear answers about opportunities at vozon.ai.</p>
            </div>

            <div className="divide-y divide-white/10 border-y border-white/10">
              {faqs.map((faq, index) => (
                <details className="group py-1" key={faq.question} open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-center gap-5 py-6 text-left [&::-webkit-details-marker]:hidden">
                    <span className="text-[10px] font-bold text-[#75fff0]/70">0{index + 1}</span>
                    <span className="text-base font-semibold sm:text-lg">{faq.question}</span>
                    <span className="ml-auto grid size-8 shrink-0 place-items-center rounded-full border border-white/10 text-lg font-light text-white/50 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="max-w-2xl pb-7 pl-10 pr-12 text-sm leading-7 text-white/45">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-8 lg:px-12">
          <div className="relative mx-auto overflow-hidden rounded-[28px] border border-[#67e8f9]/15 bg-black px-6 py-14 sm:px-10 lg:px-14 lg:py-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(103,232,249,0.12),transparent_32%),radial-gradient(circle_at_10%_100%,rgba(167,139,250,0.1),transparent_34%)]" aria-hidden="true" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#75fff0]">Build what comes next</p>
                <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Help make every business conversation more capable.</h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/50">If you care about ambitious technology and the people who ultimately experience it, there may be a place for you at vozon.ai.</p>
              </div>
              <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#45ddce] to-[#67e8f9] px-6 text-sm font-bold text-[#02110d] transition hover:-translate-y-0.5" href="mailto:hello@vozon.ai?subject=Careers%20at%20vozon.ai">
                Start a conversation <ArrowIcon />
              </a>
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
