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
  },
  {
    number: "02",
    title: "Product & Engineering",
    description:
      "Create reliable products and infrastructure that help businesses build, deploy, monitor, and scale intelligent voice agents.",
    tags: ["Product", "Engineering", "Infrastructure", "APIs"],
  },
  {
    number: "03",
    title: "Design & Experience",
    description:
      "Design intuitive experiences that make sophisticated voice technology feel simple, useful, and effortless for businesses and their customers.",
    tags: ["UX", "UI", "Research", "Systems"],
  },
];

const principles = [
  {
    number: "01",
    title: "Own the outcome",
    description:
      "Take responsibility beyond your task. Understand the problem, make thoughtful decisions, and stay close to the result.",
  },
  {
    number: "02",
    title: "Move with purpose",
    description:
      "We value momentum without sacrificing quality. Make decisions, test ideas, learn quickly, and keep moving forward.",
  },
  {
    number: "03",
    title: "Stay curious",
    description:
      "Voice AI is evolving quickly. We ask questions, challenge assumptions, experiment often, and keep learning.",
  },
  {
    number: "04",
    title: "Build for people",
    description:
      "Technology matters when it creates a better experience. We care deeply about the people who use what we build.",
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
      className="size-4 shrink-0"
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

function SparkIcon() {
  return (
    <span
      className="grid size-11 shrink-0 place-items-center rounded-xl border border-[#3e75ff]/15 bg-[#3e75ff]/5 text-[#3e75ff]"
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
  kind,
}: {
  kind: "spark" | "trend" | "check";
}) {
  return (
    <span
      className="mx-auto grid size-12 place-items-center rounded-2xl border border-[#3e75ff]/15 bg-[#3e75ff]/5 text-[#3e75ff] transition duration-300 group-hover:bg-[#3e75ff] group-hover:text-white"
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
    <span className="grid size-5 shrink-0 place-items-center rounded-full border border-[#3e75ff]/20 bg-[#3e75ff]/5 text-[#3e75ff]">
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
      <main className="min-h-screen overflow-hidden bg-white text-black">

        {/* =========================================================
            HERO
        ========================================================== */}
        <section className="relative overflow-hidden bg-white px-5 pb-8 pt-32 sm:px-8 sm:pb-10 sm:pt-40 lg:px-12 lg:pb-12">

          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-[#3e75ff]/5 blur-[110px]"
          />

          <div className="relative mx-auto max-w-[1000px] text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#3e75ff]/20 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#3e75ff] shadow-sm">
              <span className="size-1.5 rounded-full bg-[#3e75ff]" />
              Careers at vozon.ai
            </div>

            {/* Heading */}
            <h1 className="mx-auto mt-7 max-w-5xl text-[clamp(2.5rem,5vw,5rem)] font-medium leading-[0.94] tracking-[-0.065em] text-black">
              Build your career.
              <br />
              <span className="text-[#3e75ff]">
                Build what matters.
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
              We are building the intelligence layer for business
              conversations. Join us to make voice AI more natural, useful,
              reliable, and capable of turning conversations into meaningful
              action.
            </p>

            {/* Hero Buttons */}
            <div className="mt-9 flex flex-wrap justify-center gap-3">

              <Link
                href="#open-roles"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#3e75ff] px-6 text-sm font-bold text-white shadow-[0_12px_30px_rgba(62,117,255,0.2)] transition duration-300 hover:-translate-y-1 hover:bg-[#3268ed] hover:shadow-[0_18px_40px_rgba(62,117,255,0.25)]"
              >
                Explore opportunities
                <ArrowIcon />
              </Link>

              <Link
                href="/about"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 text-sm font-bold text-black shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#3e75ff]/40 hover:text-[#3e75ff] hover:shadow-md"
              >
                Meet vozon.ai
                <ArrowIcon />
              </Link>

            </div>
          </div>

          {/* Hero bottom line */}
          <div className="mx-auto mt-8 h-px max-w-[1180px] bg-gray-100 sm:mt-10" />

        </section>


        {/* =========================================================
            WHY WORK WITH US
        ========================================================== */}
        <section className="bg-white px-5 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-20">

          <div className="mx-auto max-w-[1180px]">

            <div className="mx-auto max-w-3xl text-center">

              <div className="mx-auto flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-[#3e75ff]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#3e75ff]">
                  Why work with us
                </p>

                <span className="h-px w-8 bg-[#3e75ff]" />
              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] text-black sm:text-4xl">
                Build something that genuinely matters.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-gray-600">
                We are building technology that changes business communication
                and creates better experiences for the people on both sides of
                every conversation.
              </p>

            </div>


            {/* Cards */}
            <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-3">

              <article className="group relative overflow-hidden rounded-[24px] border border-gray-200 bg-white px-7 py-9 text-center shadow-[0_12px_35px_rgba(0,0,0,0.04)] transition duration-500 hover:-translate-y-2 hover:border-[#3e75ff]/25 hover:shadow-[0_20px_50px_rgba(62,117,255,0.10)] sm:px-8">

                <WorkCardIcon kind="spark" />

                <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em] text-black">
                  Purposeful innovation
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  Build technology that solves complex problems, improves
                  experiences, and creates meaningful value for businesses.
                </p>

              </article>


              <article className="group relative overflow-hidden rounded-[24px] border border-gray-200 bg-white px-7 py-9 text-center shadow-[0_12px_35px_rgba(0,0,0,0.04)] transition duration-500 hover:-translate-y-2 hover:border-[#3e75ff]/25 hover:shadow-[0_20px_50px_rgba(62,117,255,0.10)] sm:px-8">

                <WorkCardIcon kind="trend" />

                <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em] text-black">
                  Continuous growth
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  Learn, experiment, and collaborate with a team that values
                  curiosity, technical excellence, and continuous improvement.
                </p>

              </article>


              <article className="group relative overflow-hidden rounded-[24px] border border-gray-200 bg-white px-7 py-9 text-center shadow-[0_12px_35px_rgba(0,0,0,0.04)] transition duration-500 hover:-translate-y-2 hover:border-[#3e75ff]/25 hover:shadow-[0_20px_50px_rgba(62,117,255,0.10)] sm:px-8">

                <WorkCardIcon kind="check" />

                <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em] text-black">
                  Meaningful ownership
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  Take responsibility from idea to execution and make a
                  tangible contribution to products built for real-world
                  impact.
                </p>

              </article>

            </div>

          </div>
        </section>


        {/* =========================================================
            OPEN ROLES
        ========================================================== */}
        <section
          className="bg-white px-5 py-14 sm:px-8 lg:px-12 lg:py-20"
          id="open-roles"
        >

          <div className="mx-auto max-w-[1180px]">

            <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">

              <div>

                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-[#3e75ff]" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#3e75ff]">
                    Open roles
                  </p>
                </div>

                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] text-black sm:text-4xl">
                  Find your place at vozon.ai.
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
                  We are hiring for the core roles that help shape the website,
                  platform, and voice technology behind vozon.ai.
                </p>

              </div>

              <div className="hidden h-12 w-12 items-center justify-center rounded-full border border-[#3e75ff]/20 bg-[#3e75ff]/5 text-[#3e75ff] sm:flex">
                <ArrowIcon />
              </div>

            </div>


            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {openRoles.map((role, index) => (

                <article
                  key={role.title}
                  className="group relative flex h-full min-h-[285px] flex-col overflow-hidden rounded-[24px] border border-gray-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:border-[#3e75ff]/30 hover:shadow-[0_22px_55px_rgba(62,117,255,0.10)]"
                >

                  <div className="absolute inset-x-0 top-0 h-0.5 bg-[#3e75ff] opacity-0 transition duration-300 group-hover:opacity-100" />

                  <div className="flex flex-1 flex-col">

                    <div className="flex items-start justify-between gap-4">

                      <span className="flex size-9 items-center justify-center rounded-lg bg-[#3e75ff]/5 text-[10px] font-bold text-[#3e75ff]">
                        0{index + 1}
                      </span>

                      <span className="text-gray-300 transition duration-300 group-hover:text-[#3e75ff]">
                        <ArrowIcon />
                      </span>

                    </div>


                    <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em] text-black">
                      {role.title}
                    </h3>


                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {role.description}
                    </p>


                    <div className="mt-5 flex flex-wrap gap-2">

                      {role.tags.map((tag) => (

                        <span
                          key={tag}
                          className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[9px] font-medium text-gray-600 transition duration-300 group-hover:border-[#3e75ff]/20"
                        >
                          {tag}
                        </span>

                      ))}

                    </div>


                    <a
                      href={`mailto:hello@vozon.ai?subject=Apply%20now%20-%20${encodeURIComponent(
                        role.title
                      )}%20at%20vozon.ai`}
                      className="mt-auto inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-[11px] font-bold text-black transition duration-300 hover:border-[#3e75ff] hover:bg-[#3e75ff] hover:text-white"
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
            WORK AREAS
        ========================================================== */}
        <section className="bg-white px-5 py-14 sm:px-8 lg:px-12 lg:py-20">

          <div className="mx-auto max-w-[1180px]">

            <div className="mx-auto max-w-3xl text-center">

              <div className="flex items-center justify-center gap-3">

                <span className="h-px w-8 bg-[#3e75ff]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#3e75ff]">
                  Where you can contribute
                </p>

                <span className="h-px w-8 bg-[#3e75ff]" />

              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] text-black sm:text-4xl">
                Build across the voice AI stack.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
                Bring your expertise to the part of the product where you can
                make the biggest impact.
              </p>

            </div>


            <div className="mt-11 grid gap-5 md:grid-cols-3">

              {workAreas.map((area) => (

                <article
                  key={area.number}
                  className="group relative overflow-hidden rounded-[24px] border border-gray-200 bg-white p-7 shadow-[0_12px_35px_rgba(0,0,0,0.04)] transition duration-500 hover:-translate-y-2 hover:border-[#3e75ff]/30 hover:shadow-[0_20px_50px_rgba(62,117,255,0.09)]"
                >

                  <div className="flex items-center justify-between">

                    <span className="flex size-9 items-center justify-center rounded-lg bg-[#3e75ff]/5 text-[10px] font-bold text-[#3e75ff]">
                      {area.number}
                    </span>

                    <SparkIcon />

                  </div>


                  <h3 className="mt-7 text-xl font-semibold tracking-[-0.03em] text-black">
                    {area.title}
                  </h3>


                  <p className="mt-4 text-sm leading-7 text-gray-600">
                    {area.description}
                  </p>


                  <div className="mt-6 flex flex-wrap gap-2">

                    {area.tags.map((tag) => (

                      <span
                        key={tag}
                        className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-medium text-gray-600"
                      >
                        {tag}
                      </span>

                    ))}

                  </div>

                </article>

              ))}

            </div>

          </div>
        </section>


        {/* =========================================================
            PRINCIPLES
        ========================================================== */}
        <section className="bg-white px-5 py-14 sm:px-8 lg:px-12 lg:py-20">

          <div className="mx-auto max-w-[1180px]">

            <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">

              <div>

                <div className="flex items-center gap-3">

                  <span className="h-px w-8 bg-[#3e75ff]" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#3e75ff]">
                    How we work
                  </p>

                </div>

                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] text-black sm:text-4xl">
                  Principles that guide us.
                </h2>

                <p className="mt-5 max-w-md text-sm leading-7 text-gray-600">
                  We want people to do their best work while building
                  technology that creates meaningful impact.
                </p>

              </div>


              <div className="divide-y divide-gray-200 border-y border-gray-200">

                {principles.map((principle) => (

                  <article
                    key={principle.number}
                    className="group grid gap-4 py-7 sm:grid-cols-[60px_1fr]"
                  >

                    <span className="flex size-9 items-center justify-center rounded-lg bg-[#3e75ff]/5 text-[10px] font-bold text-[#3e75ff]">
                      {principle.number}
                    </span>

                    <div>

                      <h3 className="text-xl font-semibold tracking-[-0.03em] text-black">
                        {principle.title}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-gray-600">
                        {principle.description}
                      </p>

                    </div>

                  </article>

                ))}

              </div>

            </div>

          </div>
        </section>


        {/* =========================================================
            BENEFITS
        ========================================================== */}
        <section className="bg-white px-5 py-14 sm:px-8 lg:px-12 lg:py-20">

          <div className="mx-auto max-w-[1180px]">

            <div className="mx-auto max-w-3xl text-center">

              <div className="flex items-center justify-center gap-3">

                <span className="h-px w-8 bg-[#3e75ff]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#3e75ff]">
                  What you can expect
                </p>

                <span className="h-px w-8 bg-[#3e75ff]" />

              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] text-black sm:text-4xl">
                A place to learn, build, and grow.
              </h2>

            </div>


            <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {benefits.map((benefit) => (

                <article
                  key={benefit.title}
                  className="group rounded-[22px] border border-gray-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)] transition duration-500 hover:-translate-y-2 hover:border-[#3e75ff]/25 hover:shadow-[0_20px_50px_rgba(62,117,255,0.09)]"
                >

                  <div className="grid size-11 place-items-center rounded-xl border border-[#3e75ff]/15 bg-[#3e75ff]/5 text-lg text-[#3e75ff] transition duration-300 group-hover:bg-[#3e75ff] group-hover:text-white">
                    {benefit.icon}
                  </div>

                  <h3 className="mt-6 text-lg font-semibold tracking-[-0.03em] text-black">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    {benefit.description}
                  </p>

                </article>

              ))}

            </div>

          </div>
        </section>


        {/* =========================================================
            QUALITIES + PROCESS
        ========================================================== */}
        <section className="bg-white px-5 py-14 sm:px-8 lg:px-12 lg:py-20">

          <div className="mx-auto grid max-w-[1180px] gap-14 lg:grid-cols-2">

            {/* Qualities */}
            <div>

              <div className="flex items-center gap-3">

                <span className="h-px w-8 bg-[#3e75ff]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#3e75ff]">
                  What we value
                </p>

              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] text-black sm:text-4xl">
                Bring your strengths.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-gray-600">
                You do not need to know everything. We care about how you
                think, how you learn, and how you approach difficult problems.
              </p>


              <div className="mt-8 grid gap-3 sm:grid-cols-2">

                {qualities.map((quality) => (

                  <div
                    key={quality}
                    className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-4 transition duration-300 hover:border-[#3e75ff]/25 hover:shadow-sm"
                  >

                    <CheckIcon />

                    <span className="text-sm font-medium text-gray-700">
                      {quality}
                    </span>

                  </div>

                ))}

              </div>

            </div>


            {/* Process */}
            <div>

              <div className="flex items-center gap-3">

                <span className="h-px w-8 bg-[#3e75ff]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#3e75ff]">
                  Our process
                </p>

              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] text-black sm:text-4xl">
                From application to impact.
              </h2>


              <div className="mt-8 divide-y divide-gray-200 border-y border-gray-200">

                {process.map((step) => (

                  <article
                    key={step.number}
                    className="group grid gap-4 py-6 sm:grid-cols-[55px_1fr]"
                  >

                    <span className="flex size-8 items-center justify-center rounded-lg bg-[#3e75ff]/5 text-[10px] font-bold text-[#3e75ff]">
                      {step.number}
                    </span>

                    <div>

                      <h3 className="text-lg font-semibold tracking-[-0.02em] text-black">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-sm leading-7 text-gray-600">
                        {step.description}
                      </p>

                    </div>

                  </article>

                ))}

              </div>

            </div>

          </div>
        </section>


        {/* =========================================================
            FAQ
        ========================================================== */}
        <section className="bg-white px-5 py-14 sm:px-8 lg:px-12 lg:py-20">

          <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[0.65fr_1.35fr]">

            <div>

              <div className="flex items-center gap-3">

                <span className="h-px w-8 bg-[#3e75ff]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#3e75ff]">
                  Careers FAQ
                </p>

              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] text-black sm:text-[2.8rem]">
                Before you apply.
              </h2>

              <p className="mt-6 max-w-sm text-sm leading-7 text-gray-600">
                A few answers to help you understand what it is like to
                explore a career at vozon.ai.
              </p>

            </div>


            <div className="divide-y divide-gray-200 border-y border-gray-200">

              {faqs.map((faq, index) => (

                <details
                  key={faq.question}
                  className="group"
                  open={index === 0}
                >

                  <summary className="flex cursor-pointer list-none items-center gap-5 py-6 text-left [&::-webkit-details-marker]:hidden">

                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#3e75ff]/5 text-[9px] font-bold text-[#3e75ff]">
                      0{index + 1}
                    </span>

                    <span className="text-base font-semibold tracking-[-0.02em] text-black sm:text-lg">
                      {faq.question}
                    </span>

                    <span className="ml-auto grid size-8 shrink-0 place-items-center rounded-full border border-gray-300 bg-white text-lg font-light text-black transition duration-300 group-open:rotate-45 group-open:border-[#3e75ff] group-open:text-[#3e75ff]">
                      +
                    </span>

                  </summary>

                  <p className="max-w-2xl pb-7 pl-12 pr-8 text-sm leading-7 text-gray-600">
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
        <section className="bg-white px-5 pb-14 pt-2 sm:px-8 lg:px-12 lg:pb-20">

          <div className="relative mx-auto max-w-[1120px] overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.06)]">

            {/* Blue top line */}
            <div className="absolute inset-x-0 top-0 h-1 bg-[#3e75ff]" />

            <div className="relative flex flex-col items-start justify-between gap-7 px-6 py-9 sm:px-9 sm:py-10 md:flex-row md:items-center md:px-10">

              <div>

                <div className="inline-flex items-center gap-2 rounded-full border border-[#3e75ff]/20 bg-[#3e75ff]/5 px-3 py-1.5">

                  <span className="size-1.5 rounded-full bg-[#3e75ff]" />

                  <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#3e75ff]">
                    Join vozon.ai
                  </span>

                </div>

                <h2 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-black md:text-2xl">
                  Ready to help shape the future of voice AI?
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">
                  Meaningful work, real ownership, and a chance to shape how
                  businesses use voice AI.
                </p>

              </div>


              {/* =====================================================
                  CONTACT BUTTON
                  Explicit white text + white arrow
              ====================================================== */}
              <a
                href="mailto:hello@vozon.ai?subject=Careers%20at%20vozon.ai"
                className="relative z-10 inline-flex min-h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-black !bg-black px-6 text-sm font-bold !text-white shadow-[0_10px_25px_rgba(0,0,0,0.15)] transition duration-300 hover:-translate-y-1 hover:!bg-gray-800 hover:!text-white hover:shadow-[0_15px_35px_rgba(0,0,0,0.2)]"
              >
                <span className="!text-white">
                  Contact Us
                </span>

                <span className="!text-white">
                  <ArrowIcon />
                </span>
              </a>

            </div>

          </div>

        </section>

      </main>
    </SiteLayout>
  );
}

