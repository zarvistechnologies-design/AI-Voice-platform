import type { Metadata } from "next";
import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata: Metadata = {
  title: "About Us | vozon.ai",
  description:
    "Discover the people, principles, and vision behind vozon.ai.",
};

const values = [
  {
    title: "Customer-Centric",
    description:
      "Every feature we build solves real customer problems and drives measurable business value.",
    icon: "◎",
    gradient: "from-[#45ddce] to-[#20c997]",
    background: "bg-[#061312]",
    text: "text-[#75fff0]",
  },
  {
    title: "Innovation First",
    description:
      "We push the boundaries of AI voice technology to deliver cutting-edge experiences.",
    icon: "✧",
    gradient: "from-[#67e8f9] to-[#45ddce]",
    background: "bg-[#061116]",
    text: "text-[#67e8f9]",
  },
  {
    title: "Excellence",
    description:
      "We maintain the highest standards in accuracy, security, and performance.",
    icon: "◇",
    gradient: "from-[#5eead4] to-[#22c55e]",
    background: "bg-[#071410]",
    text: "text-[#5eead4]",
  },
  {
    title: "Collaboration",
    description:
      "We believe in the power of human-AI collaboration to transform businesses.",
    icon: "♡",
    gradient: "from-[#38bdf8] to-[#67e8f9]",
    background: "bg-[#071116]",
    text: "text-[#67e8f9]",
  },
];

const manifesto = [
  "Technology should feel natural.",
  "AI should understand before it acts.",
  "Automation should create time, not distance.",
  "Every conversation should have the potential to move something forward.",
];

const manifestoNotes = [
  "Clear, calm, and easy to use.",
  "Context first, action second.",
  "Less friction for the people doing the work.",
  "Every interaction should help progress something meaningful.",
];

const journey = [
  {
    label: "THE BEGINNING",
    title: "An idea worth building",
    description:
      "Vozon started with a simple belief: business conversations could become more intelligent, natural, and useful.",
  },
  {
    label: "BUILDING THE FOUNDATION",
    title: "Turning the idea into reality",
    description:
      "We began building voice AI experiences designed to understand conversations and respond naturally in real time.",
  },
  {
    label: "EXPANDING THE VISION",
    title: "From conversations to action",
    description:
      "Our vision grew beyond conversation — connecting voice interactions with workflows, systems, and meaningful outcomes.",
  },
  {
    label: "TODAY",
    title: "Building what comes next",
    description:
      "We continue building intelligent voice systems that help businesses scale conversations while keeping people at the center.",
  },
];

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 10h12m-4.5-4.5L16 10l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2.8l1.7 6.2L20 11l-6.3 1.9L12 19.2l-1.7-6.3L4 11l6.3-2L12 2.8Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <SiteLayout>
      <main className="overflow-hidden bg-black text-white">

        {/*HERO*/}
        <section className="relative overflow-hidden bg-black px-5 pb-10 pt-24 sm:px-8 sm:pb-12 sm:pt-28 lg:px-10 lg:pb-14 lg:pt-28">

          <div className="relative mx-auto max-w-[1250px] text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.025] px-4 py-2 backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-[#45ddce] shadow-[0_0_14px_#45ddce]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
                About vozon.ai
              </span>
            </div>

            <h1 className="mx-auto mt-6 max-w-5xl text-[clamp(1.6rem,3.6vw,3.3rem)] font-medium leading-[0.97] tracking-[-0.06em]">
              Building the future of intelligent communication.
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/45">
              Vozon.ai is building intelligent voice experiences that help
              businesses create better conversations, automate meaningful
              work, and connect people with outcomes.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">

              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#45ddce] to-[#67e8f9] px-6 text-sm font-bold text-[#02110d] shadow-[0_18px_50px_rgba(69,221,206,0.15)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(69,221,206,0.23)]"
              >
                Talk to us
                <ArrowIcon />
              </Link>

              <Link
                href="/career"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#45ddce] to-[#67e8f9] px-6 text-sm font-bold text-[#02110d] shadow-[0_18px_50px_rgba(69,221,206,0.15)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(69,221,206,0.23)]"
              >
                Join our team
                <ArrowIcon />
              </Link>

            </div>

            {/* image*/}
            
<div className="relative mx-auto mt-7 max-w-[1100px]">
  <img
    src="/images/about_vozon.png"
    alt="Vozon.ai AI voice agents platform"
    className="block h-auto w-full rounded-[28px] object-cover"
  />
</div>
            
          </div>
        </section>


        {/*MISSION */}
        <section className="relative bg-black px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

          <div className="mx-auto max-w-[1200px]">

            <div className="mb-4 flex items-center gap-3">

              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#75fff0]">
                Our mission
              </span>

            </div>

            <div className="relative overflow-hidden rounded-[22px] border border-[#45ddce]/20 bg-[#080b0b] px-6 py-6 sm:px-9 sm:py-7 lg:px-11 lg:py-8">

              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#45ddce]/60 to-transparent" />

              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">

                <div className="lg:max-w-[540px]">

                  <div className="mb-4 flex items-center gap-2">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#45ddce]/30 bg-[#45ddce]/[0.08] text-[#75fff0]">
                      <SparkIcon />
                    </div>

                    <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#75fff0]/70">
                      What we believe
                    </span>

                  </div>

                  <h2 className="text-[clamp(1.8rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.045em] text-white">

                    Make every conversation{" "}

                    <span className="bg-gradient-to-r from-[#45ddce] via-[#67e8f9] to-[#a78bfa] bg-clip-text text-transparent">
                      more intelligent.
                    </span>

                  </h2>

                </div>

                <div className="hidden h-20 w-px bg-gradient-to-b from-transparent via-white/[0.16] to-transparent lg:block" />

                <div className="lg:max-w-[470px]">

                  <p className="text-sm leading-7 text-white/70 sm:text-base sm:leading-7">
                    We believe conversations contain enormous potential. Our
                    mission is to help businesses unlock that potential through
                    voice AI that understands, responds, acts, and learns.
                  </p>

                  <div className="mt-4 flex items-center gap-3">

                    <span className="h-px w-8 bg-gradient-to-r from-[#45ddce] to-[#67e8f9]" />

                    <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
                      vozon.ai
                    </span>

                  </div>

                </div>

              </div>
            </div>
          </div>
        </section>


        {/* VALUES */}
        <section className="relative overflow-hidden bg-black px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[-180px] top-20 h-[420px] w-[420px] rounded-full bg-[#45ddce]/[0.06] blur-[140px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[-180px] bottom-0 h-[420px] w-[420px] rounded-full bg-[#a78bfa]/[0.06] blur-[140px]"
          />

          <div className="relative mx-auto max-w-[1380px]">

            <div className="grid gap-6 lg:grid-cols-[1fr_0.55fr] lg:items-end">

              <div>

                <div className="flex items-center gap-3">

                  <span className="h-px w-8 bg-gradient-to-r from-[#45ddce] to-[#a78bfa]" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#75fff0]">
                    Our values
                  </p>

                </div>

                <h2 className="mt-4 max-w-3xl text-[clamp(1rem,3vw,2.5rem)] font-medium leading-[1.03] tracking-[-0.05em] text-white">
                  What Guides Us Ahead
                </h2>

              </div>

              <p className="max-w-md text-sm leading-7 text-white/40 lg:justify-self-end">
                The principles behind our products, decisions, partnerships,
                and the way we work together.
              </p>

            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {values.map((value) => (

                <article
                  key={value.title}
                  className={`group relative overflow-hidden rounded-[24px] border border-white/[0.08] ${value.background} p-7 shadow-[0_15px_50px_rgba(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_70px_rgba(0,0,0,0.3)] sm:p-8`}
                >

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/40 blur-[70px] opacity-40 transition duration-700 group-hover:opacity-70"
                  />

                  <div className="relative flex min-h-[300px] flex-col">

                    <div
                      className={`flex h-[68px] w-[68px] items-center justify-center rounded-[20px] bg-gradient-to-br ${value.gradient} text-3xl text-white shadow-[0_12px_25px_rgba(0,0,0,0.15)] transition duration-500 group-hover:scale-105 group-hover:-rotate-2`}
                    >
                      <span className="font-light leading-none">
                        {value.icon}
                      </span>
                    </div>

                    <div className="mt-auto min-h-[150px] pt-10">

                      <h3
                        className={`text-[1.35rem] font-semibold tracking-[-0.035em] ${value.text}`}
                      >
                        {value.title}
                      </h3>

                      <p className="mt-3 text-[0.95rem] leading-7 text-white/55">
                        {value.description}
                      </p>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          </div>
        </section>


        {/* 
            MANIFESTO
         */}
        <section className="relative overflow-hidden bg-black px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#45ddce]/[0.06] blur-[120px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 bottom-10 h-80 w-80 rounded-full bg-[#8b5cf6]/[0.06] blur-[120px]"
          />

        <div className="relative mx-auto w-full max-w-[1380px] translate-x-2 sm:translate-x-3 lg:translate-x-4">

            <div className="mb-8 max-w-3xl">

              <div className="flex items-center gap-3">

                <span className="h-px w-8 bg-gradient-to-r from-[#45ddce] to-[#a78bfa]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#75fff0]">
                  Our manifesto
                </p>

              </div>

              <h2 className="mt-4 text-[clamp(1rem,3vw,2.5rem)] font-medium leading-[1.03] tracking-[-0.045em]">
                What we believe.
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/38">
                The ideas that shape every product decision, interaction, and
                outcome we build toward.
              </p>

            </div>

            <div className="grid gap-3 md:grid-cols-2">

              {manifesto.map((line, index) => (

                <article
                  key={line}
                  className="group relative overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#050606] p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-[#070909] sm:p-6"
                >

                  <div className="relative">

                    <div className="flex items-center gap-3">

                      <span
                        className={`h-2 w-2 rounded-full ${
                          index % 4 === 0
                            ? "bg-[#45ddce] shadow-[0_0_14px_rgba(69,221,206,0.7)]"
                            : index % 4 === 1
                              ? "bg-[#67e8f9] shadow-[0_0_14px_rgba(103,232,249,0.7)]"
                              : index % 4 === 2
                                ? "bg-[#818cf8] shadow-[0_0_14px_rgba(129,140,248,0.7)]"
                                : "bg-[#a78bfa] shadow-[0_0_14px_rgba(167,139,250,0.7)]"
                        }`}
                      />

                    </div>

                    <p className="mt-3 max-w-xl text-[1.05rem] font-medium leading-[1.3] tracking-[-0.025em] text-white/72 transition duration-500 group-hover:text-white sm:text-[1.15rem]">
                      {line}
                    </p>

                    <p className="mt-2 max-w-lg text-sm leading-6 text-white/34 transition duration-500 group-hover:text-white/45">
                      {manifestoNotes[index]}
                    </p>

                  </div>

                </article>

              ))}

            </div>

          </div>
        </section>


        {/*TEAM*/}
        <section className="relative overflow-hidden bg-black px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

          <div className="relative mx-auto max-w-[1380px]">

            {/* Section heading */}
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#75fff0]">
                  Our Team
                </p>

                <h2 className="mt-4 max-w-3xl text-[clamp(1.2rem,3.3vw,3rem)] font-medium leading-[1.02] tracking-[-0.05em]">
                  The people behind the vision.
                </h2>

              </div>

              <p className="max-w-xl text-sm leading-7 text-white/40">
                Great technology starts with people who care deeply about the
                problems they are solving. Our team brings together
                technology, product thinking, creativity, and ambition.
              </p>

            </div>


            {/* Team image + content */}
            <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:gap-16">

              {/* Team Image */}
              <div className="group relative min-h-[340px] overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#050707] sm:min-h-[400px] lg:min-h-[470px]">

                <img
                  src="/images/leadership.png"
                  alt="The vozon.ai team"
                  className="absolute inset-0 h-full w-full object-cover object-center grayscale-[15%] transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />

                <div className="absolute left-5 top-5 rounded-lg bg-black/40 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white/70 backdrop-blur-xl">
                  Our Team
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">

                  <div className="mb-4 h-px w-16 bg-gradient-to-r from-[#45ddce] to-[#a78bfa]" />

                  <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    One team.
                  </h3>

                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#75fff0]">
                    One shared vision.
                  </p>

                </div>

              </div>


              {/* Right Team Content */}
              <div className="relative flex flex-col justify-between py-3 lg:translate-x-4 lg:py-6 xl:translate-x-6">

                <div className="relative">

                  <h3 className="mt-5 max-w-xl text-[clamp(1rem,3vw,2.5rem)] font-medium leading-[1.08] tracking-[-0.04em]">
                    Different expertise.
                    Shared purpose.
                  </h3>

                  <p className="mt-5 max-w-xl text-justify text-sm leading-7 text-white/60">
                    At vozon.ai, we believe the best technology is created when
                    different perspectives come together. Our team works across
                    AI, engineering, product, design, and customer experience
                    to turn complex ideas into simple and powerful solutions.
                  </p>

                  <p className="mt-6 max-w-xl text-justify text-sm leading-7 text-white/60">
                    From building intelligent voice systems to creating
                    thoughtful user experiences, every part of the team
                    contributes to our mission of making business communication
                    more natural, useful, and effective.
                  </p>

                </div>


                {/* Team Quote */}
                <div className="relative mt-8 border-l border-[#45ddce]/40 pl-5 sm:pl-6">

                  <div className="mb-3 text-2xl leading-none text-[#75fff0]/50">
                    “
                  </div>

                  <p className="max-w-xl text-sm leading-6 text-white/60">
                    Great products are built together — through ideas,
                    collaboration, and a shared commitment to solving real
                    problems.
                  </p>

                  <div className="mt-5 flex items-center gap-3">

                    <div className="h-px w-8 bg-gradient-to-r from-[#45ddce] to-[#a78bfa]" />

                    <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
                      Built together
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>


        {/*JOURNEY */}
        <section className="relative overflow-hidden bg-black px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

          <div className="relative mx-auto max-w-[1120px]">

            <div className="mx-auto max-w-3xl text-center">

              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#75fff0]">
                Our journey
              </p>

              <h2 className="mt-4 text-[clamp(1.2rem,3.3vw,3rem)] font-medium leading-[1.05] tracking-[-0.04em]">
                Milestones and Achievements
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/40">
                Every milestone moves us closer to our vision of making
                business conversations more intelligent, more natural, and
                more human.
              </p>

            </div>


            <div className="relative mt-10">

              <div
                aria-hidden="true"
                className="absolute bottom-0 left-5 top-0 w-[2px] bg-gradient-to-b from-[#45ddce] via-[#67e8f9] via-50% to-[#a78bfa] sm:left-1/2 sm:-translate-x-1/2"
              />

              <div className="space-y-7 sm:space-y-9">

                {journey.map((item, index) => (

                  <article
                    key={`${item.label}-${index}`}
                    className="group relative grid sm:grid-cols-2"
                  >

                    <div
                      className={`pl-12 sm:pl-0 ${
                        index % 2 === 0
                          ? "sm:pr-16 sm:text-right"
                          : "sm:col-start-2 sm:pl-16"
                      }`}
                    >

                      <div
                        className={`relative overflow-hidden rounded-[24px] border border-white/[0.07] bg-white/[0.025] p-6 transition duration-500 group-hover:border-[#45ddce]/20 group-hover:bg-white/[0.035] sm:p-7 ${
                          index % 2 === 0 ? "sm:ml-auto" : ""
                        }`}
                      >

                        <div className="relative">

                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#75fff0]">
                            {item.label}
                          </p>

                          <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl">
                            {item.title}
                          </h3>

                          <p className="mt-3 text-base leading-7 text-white/40">
                            {item.description}
                          </p>

                        </div>

                      </div>

                    </div>


                    <div
                      aria-hidden="true"
                      className={`absolute left-5 top-8 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border bg-black sm:left-1/2 ${
                        index % 3 === 0
                          ? "border-[#45ddce]/70"
                          : index % 3 === 1
                            ? "border-[#67e8f9]/70"
                            : "border-[#a78bfa]/70"
                      }`}
                    >

                      <span
                        className={`h-2 w-2 rounded-full ${
                          index % 3 === 0
                            ? "bg-[#45ddce] shadow-[0_0_12px_rgba(69,221,206,0.8)]"
                            : index % 3 === 1
                              ? "bg-[#67e8f9] shadow-[0_0_12px_rgba(103,232,249,0.8)]"
                              : "bg-[#a78bfa] shadow-[0_0_12px_rgba(167,139,250,0.8)]"
                        }`}
                      />

                    </div>

                  </article>

                ))}

              </div>

            </div>

          </div>
        </section>


        {/*Career*/}
        <section className="bg-black px-5 py-4 sm:px-8 lg:px-10 lg:py-6">

          <div className="relative mx-auto max-w-[1180px] overflow-hidden rounded-[24px] border border-[#45ddce]/30 bg-[#050807]">

            <div className="relative grid gap-5 px-6 py-6 sm:px-8 sm:py-7 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10 lg:py-8">

              <div>

                <div className="inline-flex items-center gap-2 rounded-full border border-[#45ddce]/20 bg-[#45ddce]/[0.05] px-3 py-1.5">

                  <span className="h-1.5 w-1.5 rounded-full bg-[#45ddce]" />

                  <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#75fff0]">
                    Careers
                  </span>

                </div>

                <h2 className="mt-3 max-w-2xl text-[clamp(1.4rem,2.4vw,2.3rem)] font-medium leading-[1.05] tracking-[-0.04em] text-white">
                  Build what comes next.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
                  We are building technology that can change how businesses
                  communicate and operate. If you want to help shape that
                  future, we&apos;d love to meet you.
                </p>

              </div>

              <Link
                href="/career"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#45ddce] to-[#67e8f9] px-5 text-xs font-bold text-[#02110d] transition duration-300 hover:-translate-y-0.5"
              >
                Explore careers
                <ArrowIcon />
              </Link>

            </div>

          </div>

        </section>

      </main>
    </SiteLayout>
  );
}