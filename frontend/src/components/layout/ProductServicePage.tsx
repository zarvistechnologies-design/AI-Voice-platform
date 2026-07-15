import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { SiteLayout } from "@/components/layout/SiteLayout";
import type { ProductServiceExperience } from "@/config/productServiceExperiences";

type ServiceOverview = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  highlights: readonly string[];
};

type ProductServicePageProps = {
  service: ServiceOverview;
  experience: ProductServiceExperience;
};

const waveform = [16, 26, 42, 22, 54, 34, 66, 28, 48, 72, 38, 58, 24, 46, 30, 62, 36, 20, 44, 28];

const pageThemes = {
  Build: {
    "--service-accent": "#35fbe0",
    "--service-accent-soft": "#75fff0",
    "--service-accent-rgb": "53, 251, 224",
    "--service-secondary": "#8f83e8",
    "--service-secondary-rgb": "143, 131, 232",
    "--service-tertiary": "#ffad73",
    "--service-tertiary-rgb": "255, 173, 115",
  },
  Deploy: {
    "--service-accent": "#a99cff",
    "--service-accent-soft": "#d3ccff",
    "--service-accent-rgb": "169, 156, 255",
    "--service-secondary": "#35fbe0",
    "--service-secondary-rgb": "53, 251, 224",
    "--service-tertiary": "#ffad73",
    "--service-tertiary-rgb": "255, 173, 115",
  },
  Monitor: {
    "--service-accent": "#ffad73",
    "--service-accent-soft": "#ffd0ae",
    "--service-accent-rgb": "255, 173, 115",
    "--service-secondary": "#35fbe0",
    "--service-secondary-rgb": "53, 251, 224",
    "--service-tertiary": "#8f83e8",
    "--service-tertiary-rgb": "143, 131, 232",
  },
} as const;

const serviceMarks: Record<string, string> = {
};

const capabilityMarks = ["✦", "⌁", "↗"];

function CheckIcon() {
  return (
    <span className="service-check mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs font-black">
      &#10003;
    </span>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="service-pill inline-flex rounded-full px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em]">
      {children}
    </span>
  );
}

function ProductDemo({ experience, service }: { experience: ProductServiceExperience; service: ServiceOverview }) {
  const mark = serviceMarks[service.slug] ?? "AI";

  return (
    <div className="product-service-visual relative mx-auto w-full max-w-[600px] py-5 sm:px-6 sm:py-8">
      <div className="product-orbit product-orbit-one absolute left-1/2 top-1/2 size-[108%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <div className="product-orbit product-orbit-two absolute left-1/2 top-1/2 size-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <div className="service-float-chip service-float-chip-one absolute -left-2 top-0 z-20 hidden items-center gap-2 rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] sm:flex">
        <span className="service-live-dot size-1.5 rounded-full" /> Listen
      </div>
      <div className="service-float-chip service-float-chip-two absolute -right-2 bottom-2 z-20 hidden items-center gap-2 rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] sm:flex">
        Act <span aria-hidden="true">↗</span>
      </div>

      <div className="product-service-console relative z-10 overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
      <div className="flex items-center justify-between gap-5 border-b border-white/[0.08] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="service-mark grid size-9 place-items-center rounded-lg text-[11px] font-black" aria-hidden="true">{mark}</span>
          <div>
            <strong className="block text-xs font-bold text-white">{service.title}</strong>
            <span className="mt-0.5 block text-[10px] text-slate-500">Live workflow canvas</span>
          </div>
        </div>
        <span className="service-status inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] sm:text-[11px]">
          <span className="service-live-dot size-1.5 rounded-full" />
          {experience.demo.status}
        </span>
      </div>

      <div className="p-5 sm:p-7">
        <div className="flex h-24 items-center justify-center gap-1" aria-label="Voice activity waveform">
          {waveform.map((height, index) => (
            <span
              className="service-waveform-bar w-1 rounded-full opacity-90"
              key={`${height}-${index}`}
              style={{ animationDelay: `${index * -70}ms`, height }}
            />
          ))}
        </div>

        <div className="mt-3 grid gap-3">
          <div className="mr-8 rounded-xl rounded-tl-sm border border-white/[0.08] bg-white/[0.04] p-4 sm:mr-14">
            <span className="text-[10px] font-black uppercase tracking-[0.13em] text-slate-500">Input</span>
            <p className="mt-2 text-sm leading-6 text-slate-200">{experience.demo.caller}</p>
          </div>
          <div className="service-response ml-8 rounded-xl rounded-tr-sm p-4 sm:ml-14">
            <span className="service-accent-text text-[10px] font-black uppercase tracking-[0.13em]">vozon.ai</span>
            <p className="mt-2 text-sm leading-6 text-white">{experience.demo.agent}</p>
          </div>
        </div>

        <div className="service-event mt-5 flex items-center justify-between gap-4 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="service-solid grid size-8 shrink-0 place-items-center rounded-lg text-sm font-black">&#10003;</span>
            <div>
              <span className="service-accent-text block text-[10px] font-black uppercase tracking-[0.12em]">Latest event</span>
              <strong className="mt-1 block text-xs font-semibold text-white sm:text-sm">{experience.demo.action}</strong>
            </div>
          </div>
          <span className="service-accent-text hidden text-lg sm:block">&rarr;</span>
        </div>
      </div>
      </div>
    </div>
  );
}

export function ProductServicePage({ service, experience }: ProductServicePageProps) {
  const theme = pageThemes[service.kicker as keyof typeof pageThemes] ?? pageThemes.Build;

  return (
    <SiteLayout>
      <div className="product-service-page bg-black text-white" style={theme as CSSProperties}>
        <section className="product-service-hero relative overflow-hidden border-b border-white/[0.06] px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-36 lg:pt-40">
          <div className="product-service-grid absolute inset-0 opacity-50" />
          <div className="service-ambient service-ambient-one absolute left-[-12rem] top-12 size-[30rem] rounded-full blur-[120px]" />
          <div className="service-ambient service-ambient-two absolute right-[-9rem] top-24 size-[28rem] rounded-full blur-[120px]" />
          <span className="pointer-events-none absolute -bottom-8 left-1/2 hidden -translate-x-1/2 select-none text-[10rem] font-black uppercase leading-none tracking-[-0.08em] text-white/[0.018] lg:block">
            {service.kicker}
          </span>

          <div className="relative mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.88fr)] lg:items-center">
            <div className="max-w-3xl">
              <Pill>{service.kicker} / {experience.label}</Pill>
              <h1 className="mt-7 text-[clamp(3rem,6vw,5.2rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
                {experience.heroTitle}{" "}
                <span className="product-service-heading-accent">{experience.heroAccent}</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">{service.summary}</p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  className="service-primary-button inline-flex min-h-12 items-center rounded-lg px-6 text-sm font-extrabold transition hover:-translate-y-0.5"
                  href="/#demo"
                >
                  Try a demo <span className="ml-3">&rarr;</span>
                </Link>
                <Link
                  className="service-secondary-button inline-flex min-h-12 items-center rounded-lg border border-white/15 bg-white/[0.04] px-6 text-sm font-extrabold text-white transition"
                  href="/#contact"
                >
                  Contact sales
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
                {service.highlights.map((highlight) => (
                  <span className="inline-flex items-center gap-2" key={highlight}>
                    <span className="service-live-dot size-1.5 rounded-full" />
                    {highlight}
                  </span>
                ))}
              </div>
            </div>

            <ProductDemo experience={experience} service={service} />
          </div>
        </section>

        <section className="border-b border-white/[0.06] bg-black px-5 sm:px-8">
          <div className="mx-auto grid max-w-[1240px] sm:grid-cols-3">
            {experience.proof.map((item, index) => (
              <div
                className="service-proof-item border-b border-white/[0.08] py-7 last:border-b-0 sm:border-b-0 sm:border-r sm:px-7 sm:last:border-r-0 sm:first:pl-0"
                key={item.label}
              >
                <div className="flex items-start justify-between gap-4">
                  <strong className="service-accent-text block text-2xl font-semibold tracking-[-0.03em]">{item.value}</strong>
                  <span className="text-4xl font-black leading-none text-white/[0.035]">0{index + 1}</span>
                </div>
                <span className="mt-1 block text-sm text-slate-400">{item.label}</span>
                <span className="sr-only">Item {index + 1}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-[1240px]">
            <div className="max-w-3xl">
              <Pill>What you can do</Pill>
              <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">
                Built for the full workflow, not a single feature.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                Configure {service.title.toLowerCase()} around the way your team already works, with clear boundaries and useful outcomes at every stage.
              </p>
            </div>

            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {experience.capabilities.map((capability, index) => (
                <article
                  className="product-service-capability group relative overflow-hidden rounded-2xl border border-white/10 bg-black p-6 transition hover:-translate-y-1 sm:p-7"
                  key={capability.title}
                >
                  <div className="service-card-line absolute inset-x-0 top-0 h-px opacity-0 transition group-hover:opacity-100" />
                  <div className="flex items-center justify-between gap-5">
                    <span className="service-accent-text text-xs font-black uppercase tracking-[0.13em]">{capability.eyebrow}</span>
                    <span className="service-capability-mark grid size-11 place-items-center rounded-xl text-lg" aria-hidden="true">{capabilityMarks[index]}</span>
                  </div>
                  <h3 className="mt-8 text-2xl font-semibold leading-tight tracking-[-0.025em]">{capability.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-slate-400">{capability.body}</p>
                  <ul className="mt-7 grid gap-3 border-t border-white/[0.08] pt-6">
                    {capability.points.map((point) => (
                      <li className="flex items-start gap-3 text-sm font-medium text-slate-200" key={point}>
                        <CheckIcon />
                        <span className="pt-0.5">{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/[0.06] bg-black px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <Pill>How it works</Pill>
              <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">
                A clear path from setup to improvement.
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-400">
                Start with the outcome, connect only what the workflow needs, and keep your team involved as it evolves.
              </p>
              <Link className="service-accent-text mt-7 inline-flex items-center text-sm font-extrabold" href="/#contact">
                Plan your workflow <span className="ml-2">&rarr;</span>
              </Link>
            </div>

            <ol className="product-workflow-list grid gap-3">
              {experience.workflow.map((step, index) => (
                <li className="service-workflow-step group relative grid grid-cols-[48px_1fr] gap-4 rounded-2xl border border-white/[0.08] bg-black p-5 transition sm:grid-cols-[64px_1fr] sm:gap-6 sm:p-7" key={step.title}>
                  <span className="service-step-number grid size-12 place-items-center rounded-xl text-sm font-black transition sm:size-14">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.02em] sm:text-2xl">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-[1240px]">
            <div className="mx-auto max-w-3xl text-center">
              <Pill>Use cases</Pill>
              <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">
                Useful across the moments that matter.
              </h2>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {experience.useCases.map((useCase, index) => (
                <article className="service-use-case group relative overflow-hidden rounded-2xl border border-white/10 p-6 transition hover:-translate-y-1 sm:p-7" key={useCase.title}>
                  <div className="service-use-case-orb absolute -right-14 -top-14 size-36 rounded-full blur-[2px] transition duration-500 group-hover:scale-125" />
                  <span className="service-capability-mark relative grid size-10 place-items-center rounded-lg text-sm font-black">0{index + 1}</span>
                  <h3 className="mt-7 text-2xl font-semibold tracking-[-0.025em]">{useCase.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{useCase.body}</p>
                  <div className="mt-7 border-t border-white/[0.08] pt-5">
                    <span className="text-[10px] font-black uppercase tracking-[0.13em] text-slate-500">Designed outcome</span>
                    <strong className="service-accent-text mt-2 block text-sm">{useCase.outcome}</strong>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/[0.06] bg-black px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-[1100px] text-center">
            <Pill>Connect your stack</Pill>
            <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">
              Designed to fit the systems around your conversations.
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {experience.integrations.map((integration, index) => (
                <div className="service-integration-card group rounded-xl border border-white/[0.09] bg-black p-4 text-left transition" key={integration}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="service-accent-text text-[10px] font-black opacity-60">0{index + 1}</span>
                    <span className="service-integration-dot size-2 rounded-[2px] transition group-hover:rotate-45 group-hover:scale-125" />
                  </div>
                  <strong className="mt-7 block text-sm font-semibold text-slate-200 group-hover:text-white">{integration}</strong>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-7 max-w-2xl text-xs leading-5 text-slate-500">
              Available connections depend on your plan, selected providers, and the access permitted by each external system.
            </p>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <Pill>F.A.Q.</Pill>
              <h2 className="mt-6 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">Questions, answered clearly.</h2>
            </div>
            <div className="mt-10 grid gap-2">
              {experience.faqs.map((faq) => (
                <details className="service-faq group rounded-xl border border-white/[0.09] bg-black px-5 py-4 transition sm:px-6" key={faq.question}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-sm font-semibold sm:text-base">
                    {faq.question}
                    <span className="service-accent-text grid size-7 shrink-0 place-items-center rounded-full border border-white/10 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 max-w-3xl border-t border-white/[0.07] pt-4 text-sm leading-6 text-slate-400">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-8 sm:pb-24">
          <div className="product-service-cta relative mx-auto flex max-w-[1160px] flex-col items-center justify-between gap-8 overflow-hidden rounded-3xl p-8 text-center sm:p-10 md:flex-row md:text-left lg:p-12">
            <div className="service-ambient service-ambient-one absolute -left-20 -top-24 size-64 rounded-full blur-[80px]" />
            <div className="service-ambient service-ambient-two absolute -bottom-24 right-0 size-64 rounded-full blur-[80px]" />
            <div className="product-cta-rings pointer-events-none absolute right-[18%] top-1/2 hidden size-56 -translate-y-1/2 rounded-full lg:block" />
            <div className="relative max-w-2xl">
              <p className="service-accent-text text-xs font-black uppercase tracking-[0.14em]">Ready to get started?</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">
                Put {service.title.toLowerCase()} to work on one real customer workflow.
              </h2>
            </div>
            <Link className="service-primary-button relative inline-flex min-h-12 shrink-0 items-center rounded-lg px-7 text-sm font-extrabold transition hover:-translate-y-0.5" href="/#contact">
              Contact us <span className="ml-3">&rarr;</span>
            </Link>
          </div>
        </section>
      </div>

      <style>{`
        .product-service-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 52px 52px;
          -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 88%);
          mask-image: linear-gradient(to bottom, black 0%, transparent 88%);
        }

        .product-service-page {
          --service-accent: #35fbe0;
          --service-accent-soft: #75fff0;
          --service-accent-rgb: 53, 251, 224;
          --service-secondary: #8f83e8;
          --service-secondary-rgb: 143, 131, 232;
          --service-tertiary: #ffad73;
          --service-tertiary-rgb: 255, 173, 115;
        }

        .service-accent-text {
          color: var(--service-accent-soft);
        }

        .product-service-heading-accent {
          background: linear-gradient(105deg, var(--service-accent-soft) 5%, var(--service-accent) 45%, var(--service-secondary) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .service-pill,
        .service-check,
        .service-status,
        .service-float-chip {
          border: 1px solid rgba(var(--service-accent-rgb), 0.24);
          background: rgba(var(--service-accent-rgb), 0.08);
          color: var(--service-accent-soft);
        }

        .service-live-dot,
        .service-integration-dot {
          background: var(--service-accent);
          box-shadow: 0 0 10px rgba(var(--service-accent-rgb), 0.42);
        }

        .service-primary-button,
        .service-solid {
          background: var(--service-accent);
          color: #07100d;
        }

        .service-primary-button {
          box-shadow: 0 12px 32px rgba(var(--service-accent-rgb), 0.12);
        }

        .service-primary-button:hover {
          background: var(--service-accent-soft);
          box-shadow: 0 15px 38px rgba(var(--service-accent-rgb), 0.18);
        }

        .service-secondary-button:hover {
          border-color: rgba(var(--service-accent-rgb), 0.42);
          background: rgba(var(--service-accent-rgb), 0.07);
        }

        .service-ambient-one {
          background: rgba(var(--service-accent-rgb), 0.065);
        }

        .service-ambient-two {
          background: rgba(var(--service-secondary-rgb), 0.07);
        }

        .product-service-visual {
          isolation: isolate;
          perspective: 1200px;
        }

        .product-orbit {
          pointer-events: none;
          border: 1px dashed rgba(var(--service-accent-rgb), 0.12);
          animation: service-orbit 38s linear infinite;
        }

        .product-orbit::after {
          content: "";
          position: absolute;
          left: 50%;
          top: -4px;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--service-accent);
          box-shadow: 0 0 12px rgba(var(--service-accent-rgb), 0.48);
        }

        .product-orbit-two {
          border-color: rgba(var(--service-secondary-rgb), 0.11);
          animation-direction: reverse;
          animation-duration: 29s;
        }

        .product-orbit-two::after {
          background: var(--service-secondary);
          box-shadow: 0 0 12px rgba(var(--service-secondary-rgb), 0.42);
        }

        .service-float-chip {
          background: rgba(5, 8, 7, 0.88);
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.38);
          backdrop-filter: blur(12px);
        }

        .product-service-console {
          transition: transform 500ms ease, border-color 500ms ease;
        }

        .product-service-visual:hover .product-service-console {
          border-color: rgba(var(--service-accent-rgb), 0.28);
          transform: translateY(-2px);
        }

        .product-service-console::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(110deg, transparent 20%, rgba(var(--service-accent-rgb), 0.035) 44%, transparent 66%),
            radial-gradient(circle at 80% 0%, rgba(var(--service-secondary-rgb), 0.13), transparent 38%);
        }

        .service-mark {
          border: 1px solid rgba(var(--service-accent-rgb), 0.24);
          background: linear-gradient(135deg, rgba(var(--service-accent-rgb), 0.18), rgba(var(--service-secondary-rgb), 0.12));
          color: var(--service-accent-soft);
        }

        .service-waveform-bar {
          background: linear-gradient(180deg, var(--service-accent-soft), var(--service-secondary));
          transform-origin: center;
          animation: service-wave 1.15s ease-in-out infinite alternate;
        }

        .service-response {
          border: 1px solid rgba(var(--service-secondary-rgb), 0.23);
          background: linear-gradient(135deg, rgba(var(--service-secondary-rgb), 0.11), rgba(var(--service-accent-rgb), 0.035));
        }

        .service-event {
          border: 1px solid rgba(var(--service-accent-rgb), 0.22);
          background: rgba(var(--service-accent-rgb), 0.06);
        }

        .product-service-capability:hover {
          border-color: rgba(var(--service-accent-rgb), 0.28);
          box-shadow: 0 22px 55px rgba(var(--service-accent-rgb), 0.055);
        }

        .service-card-line {
          background-image: linear-gradient(to right, transparent, rgba(var(--service-accent-rgb), 0.72), transparent);
        }

        .service-capability-mark {
          border: 1px solid rgba(var(--service-accent-rgb), 0.18);
          background: rgba(var(--service-accent-rgb), 0.075);
          color: var(--service-accent-soft);
        }

        .product-service-capability:nth-child(2) .service-card-line {
          background-image: linear-gradient(to right, transparent, rgba(var(--service-secondary-rgb), 0.72), transparent);
        }

        .product-service-capability:nth-child(2) .service-accent-text,
        .product-service-capability:nth-child(2) .service-capability-mark {
          color: var(--service-secondary);
        }

        .product-service-capability:nth-child(2) .service-capability-mark {
          border-color: rgba(var(--service-secondary-rgb), 0.18);
          background: rgba(var(--service-secondary-rgb), 0.07);
        }

        .product-service-capability:nth-child(3) .service-card-line {
          background-image: linear-gradient(to right, transparent, rgba(var(--service-tertiary-rgb), 0.72), transparent);
        }

        .product-service-capability:nth-child(3) .service-accent-text,
        .product-service-capability:nth-child(3) .service-capability-mark {
          color: var(--service-tertiary);
        }

        .product-service-capability:nth-child(3) .service-capability-mark {
          border-color: rgba(var(--service-tertiary-rgb), 0.18);
          background: rgba(var(--service-tertiary-rgb), 0.07);
        }

        .service-workflow-step:hover {
          border-color: rgba(var(--service-secondary-rgb), 0.34);
          background: #000;
          transform: translateX(4px);
        }

        .service-step-number {
          border: 1px solid rgba(var(--service-secondary-rgb), 0.25);
          background: rgba(var(--service-secondary-rgb), 0.10);
          color: var(--service-secondary);
        }

        .service-workflow-step:hover .service-step-number {
          background: var(--service-secondary);
          color: #080b0a;
          box-shadow: 0 10px 30px rgba(var(--service-secondary-rgb), 0.16);
        }

        .service-use-case {
          background: #000;
        }

        .service-use-case:hover {
          border-color: rgba(var(--service-accent-rgb), 0.24);
        }

        .service-use-case:nth-child(2) .service-capability-mark,
        .service-use-case:nth-child(2) .service-accent-text {
          color: var(--service-secondary);
        }

        .service-use-case:nth-child(2) .service-use-case-orb {
          border-color: rgba(var(--service-secondary-rgb), 0.12);
          background: radial-gradient(circle at 35% 35%, rgba(var(--service-secondary-rgb), 0.15), transparent 68%);
        }

        .service-use-case:nth-child(3) .service-capability-mark,
        .service-use-case:nth-child(3) .service-accent-text {
          color: var(--service-tertiary);
        }

        .service-use-case:nth-child(3) .service-use-case-orb {
          border-color: rgba(var(--service-tertiary-rgb), 0.12);
          background: radial-gradient(circle at 35% 35%, rgba(var(--service-tertiary-rgb), 0.15), transparent 68%);
        }

        .service-use-case-orb {
          border: 1px solid rgba(var(--service-accent-rgb), 0.12);
          background: radial-gradient(circle at 35% 35%, rgba(var(--service-accent-rgb), 0.18), transparent 68%);
          box-shadow: inset 0 0 30px rgba(var(--service-secondary-rgb), 0.05);
        }

        .service-integration-card:hover {
          border-color: rgba(var(--service-accent-rgb), 0.32);
          background: rgba(var(--service-accent-rgb), 0.04);
          transform: translateY(-2px);
        }

        .service-integration-card:nth-child(3n + 2) .service-integration-dot {
          background: var(--service-secondary);
          box-shadow: none;
        }

        .service-integration-card:nth-child(3n) .service-integration-dot {
          background: var(--service-tertiary);
          box-shadow: none;
        }

        .service-proof-item:nth-child(2) .service-accent-text {
          color: var(--service-secondary);
        }

        .service-proof-item:nth-child(3) .service-accent-text {
          color: var(--service-tertiary);
        }

        .service-faq[open] {
          border-color: rgba(var(--service-accent-rgb), 0.27);
          background: rgba(var(--service-accent-rgb), 0.028);
        }

        .product-service-cta {
          border: 1px solid rgba(var(--service-accent-rgb), 0.28);
          background: #000;
        }

        .product-cta-rings {
          border: 1px solid rgba(var(--service-accent-rgb), 0.12);
          box-shadow:
            0 0 0 24px rgba(var(--service-accent-rgb), 0.025),
            0 0 0 54px rgba(var(--service-secondary-rgb), 0.025);
        }

        @keyframes service-orbit {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes service-wave {
          from { transform: scaleY(0.58); opacity: 0.55; }
          to { transform: scaleY(1); opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .product-service-page *,
          .product-service-page *::before,
          .product-service-page *::after {
            animation: none !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </SiteLayout>
  );
}
