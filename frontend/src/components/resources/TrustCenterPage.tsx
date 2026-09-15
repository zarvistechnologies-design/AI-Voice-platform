import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";

const trustAreas = [
  {
    number: "01",
    title: "Access and identity",
    body: "Use workspace roles, controlled permissions, and protected credentials to limit who can configure agents, tools, and customer workflows.",
  },
  {
    number: "02",
    title: "Data protection",
    body: "Apply appropriate controls to voice recordings, transcripts, knowledge sources, and connected-service data throughout the workflow.",
  },
  {
    number: "03",
    title: "Platform reliability",
    body: "Build production workflows with monitoring, tested fallbacks, human escalation paths, and clear handling for provider interruptions.",
  },
  {
    number: "04",
    title: "Operational monitoring",
    body: "Review platform activity, call outcomes, failures, and configuration changes so teams can investigate issues and improve controls.",
  },
  {
    number: "05",
    title: "Third-party services",
    body: "Evaluate the permissions and data practices of telephony, speech, AI, payment, and business tools connected to your workspace.",
  },
  {
    number: "06",
    title: "Responsible voice AI",
    body: "Use approved voices and knowledge, disclose automation when required, test sensitive paths, and keep people involved in higher-risk decisions.",
  },
] as const;

const trustAreaAccents = [
  {
    card: "border-[#45ddce]/25 bg-[linear-gradient(145deg,rgba(69,221,206,0.085),rgba(69,221,206,0.018)_48%,#040605)] hover:border-[#45ddce]/50",
    badge: "border-[#45ddce]/30 bg-[#45ddce]/10 text-[#75fff0]",
    glow: "bg-[#45ddce]/16",
  },
  {
    card: "border-[#9d8cff]/25 bg-[linear-gradient(145deg,rgba(157,140,255,0.09),rgba(157,140,255,0.018)_48%,#040605)] hover:border-[#9d8cff]/50",
    badge: "border-[#9d8cff]/30 bg-[#9d8cff]/10 text-[#c4b5fd]",
    glow: "bg-[#9d8cff]/16",
  },
  {
    card: "border-[#ff9f6e]/25 bg-[linear-gradient(145deg,rgba(255,159,110,0.09),rgba(255,159,110,0.018)_48%,#040605)] hover:border-[#ff9f6e]/50",
    badge: "border-[#ff9f6e]/30 bg-[#ff9f6e]/10 text-[#ffba96]",
    glow: "bg-[#ff9f6e]/16",
  },
  {
    card: "border-[#f6d365]/25 bg-[linear-gradient(145deg,rgba(246,211,101,0.085),rgba(246,211,101,0.018)_48%,#040605)] hover:border-[#f6d365]/50",
    badge: "border-[#f6d365]/30 bg-[#f6d365]/10 text-[#ffe69a]",
    glow: "bg-[#f6d365]/14",
  },
  {
    card: "border-[#58a6e7]/25 bg-[linear-gradient(145deg,rgba(88,166,231,0.09),rgba(88,166,231,0.018)_48%,#040605)] hover:border-[#58a6e7]/50",
    badge: "border-[#58a6e7]/30 bg-[#58a6e7]/10 text-[#8dccff]",
    glow: "bg-[#58a6e7]/16",
  },
  {
    card: "border-[#ff78b7]/25 bg-[linear-gradient(145deg,rgba(255,120,183,0.085),rgba(255,120,183,0.018)_48%,#040605)] hover:border-[#ff78b7]/50",
    badge: "border-[#ff78b7]/30 bg-[#ff78b7]/10 text-[#ff9fcb]",
    glow: "bg-[#ff78b7]/15",
  },
] as const;

const reviewItems = [
  "Voice-agent permissions and connected tools",
  "Call recording, transcript, and retention settings",
  "Fallback, transfer, and human-review workflows",
  "Third-party integrations and provider access",
] as const;

function ShieldIcon() {
  return (
    <svg aria-hidden="true" className="size-10" fill="none" viewBox="0 0 48 48">
      <path d="M24 5 39 11v11c0 10.5-5.9 17.5-15 21-9.1-3.5-15-10.5-15-21V11L24 5Z" stroke="currentColor" strokeWidth="2" />
      <path d="m17.5 24 4.3 4.3 9-9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

export function TrustCenterPage() {
  return (
    <SiteLayout>
      <div className="min-h-screen bg-black text-white">
        <section className="relative overflow-hidden bg-black px-5 pb-20 pt-32 sm:px-8 sm:pt-36 lg:px-12 lg:pb-24 lg:pt-40">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(69,221,206,0.11),transparent_30%),linear-gradient(rgba(69,221,206,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(69,221,206,0.025)_1px,transparent_1px)] [background-size:auto,56px_56px,56px_56px]" />
          <div className="relative mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center">
            <div>
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/34">
                <Link className="transition hover:text-[#75fff0]" href="/">Home</Link>
                <span aria-hidden="true">/</span>
                <span className="text-[#75fff0]">Security</span>
              </nav>
              <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-[#75fff0]">Vozon Trust Center</p>
              <h1 className="mt-4 max-w-[820px] text-5xl font-semibold tracking-[-0.055em] sm:text-7xl">
                Security built into every voice workflow.
              </h1>
              <p className="mt-7 max-w-[760px] text-base leading-8 text-white/52 sm:text-lg">
                Review the security, privacy, reliability, and governance practices that help
                teams operate AI voice agents with greater control.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link className="inline-flex min-h-12 items-center rounded-lg bg-[#45ddce] px-6 text-sm font-bold text-[#02110e] transition hover:-translate-y-0.5 hover:bg-[#75fff0]" href="/contact">
                  Request a security review
                </Link>
                <Link className="inline-flex min-h-12 items-center rounded-lg border border-white/12 bg-white/[0.035] px-6 text-sm font-bold text-white/78 transition hover:border-[#45ddce]/45 hover:text-[#75fff0]" href="/privacy">
                  View Privacy Policy
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-[#45ddce]/20 bg-[#050a09] p-7 shadow-[0_28px_85px_rgba(0,0,0,0.42),0_0_36px_rgba(69,221,206,0.06)] sm:p-9">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#75fff0] via-[#45ddce]/35 to-transparent" />
              <span className="grid size-16 place-items-center rounded-xl border border-[#45ddce]/25 bg-[#45ddce]/[0.07] text-[#75fff0]">
                <ShieldIcon />
              </span>
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.17em] text-[#75fff0]">Security posture</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">Controls that follow the workflow</h3>
              <p className="mt-4 text-sm leading-7 text-white/46">
                Security depends on the platform, your configuration, connected providers, and
                the way your team operates each agent.
              </p>
              <div className="mt-7 grid gap-3">
                {["Controlled access", "Observable workflows", "Human escalation"].map((item) => (
                  <div className="flex items-center gap-3 border-t border-white/[0.08] pt-3 text-sm font-semibold text-white/68" key={item}>
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-[#45ddce] shadow-[0_0_8px_#45ddce]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-black px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-[1320px]">
            <div className="max-w-[760px]">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#75fff0]">Security areas</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">A practical foundation for trusted conversations.</h2>
              <p className="mt-5 text-base leading-8 text-white/46">Review the controls around access, data, connected systems, operations, and responsible AI use.</p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trustAreas.map((area, index) => {
                const accent = trustAreaAccents[index];

                return (
                  <article className={`group relative min-h-[290px] overflow-hidden rounded-xl border p-6 shadow-[0_20px_55px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(0,0,0,0.34)] sm:p-8 ${accent.card}`} key={area.number}>
                    <span aria-hidden="true" className={`absolute -right-12 -top-12 size-36 rounded-full blur-[52px] transition duration-300 group-hover:opacity-90 ${accent.glow}`} />
                    <div className="relative flex items-center">
                      <span className={`inline-flex size-10 items-center justify-center rounded-lg border font-mono text-xs font-semibold tracking-[0.1em] ${accent.badge}`}>
                        {area.number}
                      </span>
                    </div>
                    <div className="relative mt-10">
                      <h3 className="text-[1.35rem] font-semibold tracking-[-0.025em] text-white/90 sm:text-2xl">{area.title}</h3>
                      <p className="mt-4 text-[15px] leading-7 text-white/46 sm:text-base sm:leading-8">{area.body}</p>
                    </div>
                    <div className="relative mt-7 border-t border-white/[0.07] pt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-white/28">
                      Security control area
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#030504] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-[1180px]">
            <div className="mx-auto max-w-[820px] text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#75fff0]">Shared responsibility</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Security works best when every layer is reviewed.</h2>
              <p className="mt-6 text-base leading-8 text-white/46">
                Vozon supports the platform layer. Customers remain responsible for their users,
                agent instructions, contact permissions, integrations, and deployment choices.
              </p>
            </div>
            <div className="mx-auto mt-12 max-w-[900px] overflow-hidden rounded-xl border border-white/[0.1] bg-black">
              <div className="border-b border-white/[0.09] px-6 py-5">
                <p className="text-sm font-semibold text-white/76">Before production launch, review:</p>
              </div>
              <div className="divide-y divide-white/[0.08]">
                {reviewItems.map((item, index) => (
                  <div className="grid grid-cols-[40px_1fr] items-center gap-4 px-6 py-5" key={item}>
                    <span className="font-mono text-xs text-[#45ddce]">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-sm font-semibold text-white/58">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-black px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto flex max-w-[1120px] flex-col items-start justify-between gap-8 rounded-2xl border border-[#45ddce]/20 bg-[linear-gradient(115deg,rgba(69,221,206,0.11),rgba(69,221,206,0.025)_46%,transparent)] p-7 sm:p-10 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#75fff0]">Security questions</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Review Vozon for your deployment.</h2>
              <p className="mt-3 max-w-[650px] text-sm leading-7 text-white/46">Tell us about your workflow, data, integrations, and review requirements.</p>
            </div>
            <Link className="inline-flex min-h-12 shrink-0 items-center rounded-lg bg-[#45ddce] px-6 text-sm font-bold text-[#02110e] transition hover:bg-[#75fff0]" href="/contact">
              Contact our team
            </Link>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
