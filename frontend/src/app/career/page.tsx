import type { Metadata } from "next";
import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata: Metadata = {
  title: "Careers at vozon.ai | Build the Future of Voice AI",
  description:
    "Join vozon.ai and help build intelligent voice experiences that make business conversations faster, more natural, and more useful.",
};

const workAreas = [
  {
    number: "01",
    title: "AI & Voice",
    description:
      "Build the intelligence behind natural conversations—from speech recognition and reasoning to real-time responses and multilingual experiences.",
    tags: ["Voice AI", "LLMs", "Speech", "Real-time"],
    accent: "#45ddce",
  },
  {
    number: "02",
    title: "Product & Engineering",
    description:
      "Create reliable products and infrastructure that help businesses build, deploy, monitor, and scale intelligent voice agents.",
    tags: ["Product", "Engineering", "Infrastructure", "APIs"],
    accent: "#67e8f9",
  },
  {
    number: "03",
    title: "Design & Experience",
    description:
      "Design intuitive experiences that make sophisticated voice technology feel simple, useful, and effortless for businesses and their customers.",
    tags: ["UX", "UI", "Research", "Systems"],
    accent: "#a78bfa",
  },
];

const principles = [
  {
    number: "01",
    title: "Own the outcome",
    description:
      "Take responsibility beyond your task. Understand the problem, make thoughtful decisions, and stay close to the result.",
    accent: "#45ddce",
  },
  {
    number: "02",
    title: "Move with purpose",
    description:
      "We value momentum without sacrificing quality. Make decisions, test ideas, learn quickly, and keep moving forward.",
    accent: "#67e8f9",
  },
  {
    number: "03",
    title: "Stay curious",
    description:
      "Voice AI is evolving quickly. We ask questions, challenge assumptions, experiment often, and keep learning.",
    accent: "#a78bfa",
  },
  {
    number: "04",
    title: "Build for people",
    description:
      "Technology matters when it creates a better experience. We care deeply about the people who use what we build.",
    accent: "#f6c76e",
  },
];

const benefits = [
  {
    icon: "✦",
    title: "Meaningful problems",
    description:
      "Work on real challenges at the intersection of AI, voice, software, and business.",
  },
  {
    icon: "↗",
    title: "Real ownership",
    description:
      "Take ideas from problem to execution and see your work make a visible difference.",
  },
  {
    icon: "◎",
    title: "Cross-functional work",
    description:
      "Collaborate closely across engineering, product, design, and customer-facing teams.",
  },
  {
    icon: "⌁",
    title: "Continuous learning",
    description:
      "Explore new technologies, experiment with ideas, and grow alongside a rapidly evolving field.",
  },
];

const openRoles = [
  {
    title: "Frontend Engineer",
    
    description:
      "Shape the interfaces people use to build, launch, and monitor voice experiences with clarity and speed.",
    tags: ["Next.js", "TypeScript", "Design systems"],
  },
  {
    title: "Backend Engineer",
    
    description:
      "Build reliable APIs, integrations, and internal services that keep voice workflows fast and dependable.",
    tags: ["APIs", "Infrastructure", "Reliability"],
  },
  {
    title: "AI / ML Engineer",
    
    description:
      "Build speech, reasoning, and real-time systems that make conversations feel natural and useful.",
    tags: ["LLMs", "Speech", "Realtime"],
  },
  {
    title: "Product Designer",
    
    description:
      "Design intuitive flows that make sophisticated voice technology feel simple for teams and end users.",
    tags: ["UX", "UI", "Research"],
  },
  {
    title: "DevOps / Platform Engineer",
    
    description:
      "Support deployment, observability, and scale so the product stays stable as usage and complexity grow.",
    tags: ["Cloud", "Monitoring", "Automation"],
  },
] as const;

const qualities = [
  "Strong problem-solving mindset",
  "Curiosity about AI and emerging technology",
  "Clear and thoughtful communication",
  "Ability to take ownership",
  "Attention to detail",
  "Willingness to learn and experiment",
];

const process = [
  {
    number: "01",
    title: "Explore",
    description:
      "Find a role that matches your strengths, interests, and the problems you want to solve.",
  },
  {
    number: "02",
    title: "Apply",
    description:
      "Share your experience, projects, and what makes you excited about building with voice AI.",
  },
  {
    number: "03",
    title: "Connect",
    description:
      "Meet the people behind vozon.ai and get a better understanding of the team and the work.",
  },
  {
    number: "04",
    title: "Build",
    description:
      "If there is a strong fit, join us and start building the future of business conversations.",
  },
];

const faqs = [
  {
    question: "What roles are currently open?",
    answer:
      "Our public openings will be listed on this page as positions become available. If you don't see a role that matches your profile, you can still introduce yourself through a general application.",
  },
  {
    question: "Can I apply even if there isn't a matching role?",
    answer:
      "Yes. We are always interested in meeting thoughtful builders. Tell us what you are good at, what you want to work on, and why vozon.ai interests you.",
  },
  {
    question: "What should I include in my application?",
    answer:
      "Share your background, relevant experience, projects you are proud of, and what interests you about voice AI. Links to GitHub, a portfolio, products, writing, or other work are welcome.",
  },
  {
    question: "What does vozon.ai look for?",
    answer:
      "We look for people who are curious, thoughtful, collaborative, accountable, and excited to solve difficult problems. Strong technical or creative ability matters, but so does the way you approach problems.",
  },
];

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        d="M4 10h12m-4.5-4.5L16 10l-4.5 4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function SparkIcon({ color }: { color: string }) {
  return (
    <span
      className="grid size-11 shrink-0 place-items-center rounded-xl border"
      style={{
        borderColor: `${color}30`,
        backgroundColor: `${color}10`,
        color,
      }}
      aria-hidden="true"
    >
      <svg className="size-5" fill="none" viewBox="0 0 20 20">
        <path
          d="M10 2.5 12 8l5.5 2-5.5 2-2 5.5L8 12l-5.5-2L8 8l2-5.5Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.4"
        />
      </svg>
    </span>
  );
}

function WorkCardIcon({
  color,
  kind,
}: {
  color: string;
  kind: "spark" | "trend" | "check";
}) {
  return (
    <span
      className="mx-auto grid size-10 place-items-center rounded-full border"
      style={{
        borderColor: `${color}30`,
        backgroundColor: `${color}10`,
        color,
      }}
      aria-hidden="true"
    >
      {kind === "spark" ? (
        <svg className="size-5" fill="none" viewBox="0 0 20 20">
          <path
            d="M10 2.75 12 8l5.25 2L12 12l-2 5.25L8 12l-5.25-2L8 8l2-5.25Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      ) : kind === "trend" ? (
        <svg className="size-5" fill="none" viewBox="0 0 20 20">
          <path
            d="M4 13.5 8.2 9.3l2.9 2.9L16 7.4"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
          />
          <path
            d="M12.8 7.4H16v3.2"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
          />
        </svg>
      ) : (
        <svg className="size-5" fill="none" viewBox="0 0 20 20">
          <path
            d="M10 3.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M10 7.2v5.6M7.2 10h5.6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      )}
    </span>
  );
}

function CheckIcon() {
  return (
    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#45ddce]/10 text-[#45ddce]">
      <svg className="size-3" fill="none" viewBox="0 0 16 16">
        <path
          d="m3.5 8 3 3 6-6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
      </svg>
    </span>
  );
}

export default function CareerPage() {
  return (
    <SiteLayout>
      <main className="overflow-hidden bg-black text-white">
        {/* HERO*/}
        <section className="relative px-5 pb-8 pt-36 sm:px-8 sm:pt-40 lg:px-12 lg:pb-16">
          <div
            className="pointer-events-none absolute left-[-12rem] top-20 size-[34rem] rounded-full bg-[#45ddce]/[0.055] blur-3xl"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute right-[-10rem] top-32 size-[30rem] rounded-full bg-[#a78bfa]/[0.06] blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-[920px] text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#45ddce]/20 bg-[#45ddce]/[0.06] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#75fff0]">
              <span className="size-1.5 rounded-full bg-[#45ddce] shadow-[0_0_12px_#45ddce]" />
              Careers at vozon.ai
            </div>

            <h3 className="mt-7 max-w-4xl text-[clamp(2.35rem,4.5vw,4.9rem)] font-medium leading-[0.96] tracking-[-0.06em]">
              Build career with vozon.ai</h3>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/55 sm:text-base sm:leading-8">
              We are building the intelligence layer for business
              conversations. Join us to make voice AI more natural, useful,
              reliable, and capable of turning conversations into meaningful
              action.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href="#open-roles"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#93c5fd] px-6 text-sm font-bold text-[#02110d] shadow-[0_15px_45px_rgba(69,221,206,0.16)] transition duration-300 hover:-translate-y-1"
              >
                Explore opportunities
                <ArrowIcon />
              </Link>

              <Link
                href="/about"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#93c5fd] px-6 text-sm font-bold text-[#02110d] shadow-[0_15px_45px_rgba(69,221,206,0.16)] transition duration-300 hover:-translate-y-1"
                >
                Meet vozon.ai
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>

        

        <section className="px-5 pt-4 pb-10 sm:px-8 sm:pt-5 lg:px-12 lg:pt-8 lg:pb-16">
          <div className="mx-auto max-w-[1120px]">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#75fff0]">
                Why work with us
              </p>

              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Build something that genuinely matters.
              </h3>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/50 sm:text-base sm:leading-8">
                We are building technology that changes business communication.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-3">
              <article className="group relative overflow-hidden rounded-[24px] border border-white/20 bg-[#030303] px-7 py-8 text-center shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-[#45ddce]/60 sm:px-8 sm:py-10">
                <WorkCardIcon color="#45ddce" kind="spark" />

                <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em]">
                  Purposeful innovation
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/45">
                  Build technology that solves complex problems, improves experiences, and creates meaningful value for businesses.
                </p>
              </article>

              <article className="group relative overflow-hidden rounded-[24px] border border-white/20 bg-[#030303] px-7 py-8 text-center shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-[#67e8f9]/60 sm:px-8 sm:py-10">
                <WorkCardIcon color="#67e8f9" kind="trend" />

                <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em]">
                  Continuous growth
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/45">
                  Learn, experiment, and collaborate with a team that values curiosity, technical excellence, and continuous improvement.
                </p>
              </article>

              <article className="group relative overflow-hidden rounded-[24px] border border-white/20 bg-[#030303] px-7 py-8 text-center shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-[#a78bfa]/60 sm:px-8 sm:py-10">
                <WorkCardIcon color="#a78bfa" kind="check" />

                <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em]">
                  Meaningful ownership
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/45">
                  Take responsibility from idea to execution and make a tangible contribution to products built for real-world impact.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/*open role*/}
        <section
          className="px-5 py-8 sm:px-8 lg:px-12 lg:py-12"
          id="open-roles"
        >
          <div className="mx-auto max-w-[1180px]">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#75fff0]">
                  Open roles
                </p>

                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04.3em] sm:text-4xl">
                  Open roles at vozon.ai.
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/45 sm:text-base sm:leading-8">
                  We are hiring for the core roles that help shape the website,
                  platform, and voice technology behind vozon.ai.
                </p>
              </div>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {openRoles.map((role, index) => (
                <article
                  key={role.title}
                  className="group relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.025] p-4 transition duration-300 hover:-translate-y-1 hover:border-[#45ddce]/30 hover:bg-white/[0.04]"
                >
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">
                          0{index + 1}
                        </span>
                        <h3 className="mt-3 text-lg font-semibold tracking-[-0.03em]">
                          {role.title}
                        </h3>
                      </div>

                    </div>

                    <p className="mt-3 text-sm leading-6 text-white/45">
                      {role.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {role.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/[0.08] bg-black/30 px-2.5 py-1 text-[9px] font-medium text-white/40"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <a
                      href={`mailto:hello@vozon.ai?subject=Apply%20now%20-%20${encodeURIComponent(role.title)}%20at%20vozon.ai`}
                      className="mt-2 self-end inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#2faea1] to-[#4db6ca] px-4 text-[11px] font-bold text-[#031310] shadow-[0_10px_24px_rgba(47,174,161,0.12)] transition duration-300 hover:-translate-y-0.5 hover:brightness-105"
                    >
                      Apply now
                      <ArrowIcon />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            FAQ
        ========================================================== */}
        <section className="px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
          <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[0.65fr_1.35fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b9a5ff]">
                Careers FAQ
              </p>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04.4em] sm:text-4.5xl">
                Before you apply.
              </h2>

              <p className="mt-6 max-w-sm text-sm leading-7 text-white/40">
                A few answers to help you understand what it is like to
                explore a career at vozon.ai.
              </p>
            </div>

            <div className="divide-y divide-white/10">
              {faqs.map((faq, index) => (
                <details
                  key={faq.question}
                  className="group"
                  open={index === 0}
                >
                  <summary className="flex cursor-pointer list-none items-center gap-5 py-6 text-left [&::-webkit-details-marker]:hidden">
                    <span className="text-[10px] font-bold text-[#75fff0]/70">
                      0{index + 1}
                    </span>

                    <span className="text-base font-semibold sm:text-lg">
                      {faq.question}
                    </span>

                    <span className="ml-auto grid size-8 shrink-0 place-items-center rounded-full border border-white/10 text-lg font-light text-white/45 transition duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <p className="max-w-2xl pb-7 pl-10 pr-8 text-sm leading-7 text-white/40">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            FINAL CTA
        ========================================================== */}
        <section className="bg-black px-5 pb-10 pt-2 sm:px-8 lg:px-12 lg:pb-14">
          <div className="mx-auto flex max-w-[1120px] flex-col items-center justify-between gap-5 overflow-hidden rounded-[22px] border border-[#45ddce]/30 bg-[#07100d] p-6 text-center shadow-[0_20px_56px_rgba(69,221,206,0.07)] sm:p-8 md:flex-row md:text-left">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#75fff0]">
                Ready to join the team?
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] md:text-2xl">
                Explore a career helping shape voice AI at vozon.ai.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
                Meaningful work, real ownership, and a chance to shape how
                businesses use voice AI.
              </p>
            </div>

            <a
              href="mailto:hello@vozon.ai?subject=Careers%20at%20vozon.ai"
              className="inline-flex min-h-11 shrink-0 items-center rounded-lg bg-[#45ddce] px-6 text-sm font-bold text-[#031310] transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
            >
              CONTACT US <span className="ml-3">&rarr;</span>
            </a>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
