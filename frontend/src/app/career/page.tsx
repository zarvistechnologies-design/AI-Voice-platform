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

function SparkIcon() {
  return (
    <span
      className="grid size-11 shrink-0 place-items-center rounded-xl border border-gray-200 bg-gray-50 text-black"
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
      className="mx-auto grid size-10 place-items-center rounded-full border border-gray-200 bg-gray-50 text-black"
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
    <span className="grid size-5 shrink-0 place-items-center rounded-full border border-gray-300 bg-white text-black">
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
      <main className="overflow-hidden bg-white text-black">

        {/* =========================================================
            HERO
        ========================================================== */}
        <section className="relative bg-white px-5 pb-8 pt-36 sm:px-8 sm:pt-40 lg:px-12 lg:pb-16">

          <div className="relative mx-auto max-w-[920px] text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-black shadow-sm">
              <span className="size-1.5 rounded-full bg-black" />
              Careers at vozon.ai
            </div>

            <h3 className="mt-7 max-w-4xl text-[clamp(2.35rem,4.5vw,4.9rem)] font-medium leading-[0.96] tracking-[-0.06em] text-black">
              Build career with vozon.ai
            </h3>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-black sm:text-base sm:leading-8">
              We are building the intelligence layer for business
              conversations. Join us to make voice AI more natural, useful,
              reliable, and capable of turning conversations into meaningful
              action.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">

              <Link
                href="#open-roles"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-black bg-white px-6 text-sm font-bold text-black shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-black hover:text-white hover:shadow-md"
              >
                Explore opportunities
                <ArrowIcon />
              </Link>

              <Link
                href="/about"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 text-sm font-bold text-black shadow-sm transition duration-300 hover:-translate-y-1 hover:border-black hover:bg-gray-50"
              >
                Meet vozon.ai
                <ArrowIcon />
              </Link>

            </div>

          </div>
        </section>


        {/* =========================================================
            WHY WORK WITH US
        ========================================================== */}
        <section className="bg-white px-5 pb-10 pt-4 sm:px-8 sm:pt-5 lg:px-12 lg:pb-16 lg:pt-8">

          <div className="mx-auto max-w-[1120px]">

            <div className="mx-auto max-w-3xl text-center">

              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-black">
                Why work with us
              </p>

              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-black sm:text-4xl">
                Build something that genuinely matters.
              </h3>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-black">
                We are building technology that changes business communication.
              </p>

            </div>


            <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-3">

              <article className="group relative overflow-hidden rounded-[24px] border border-gray-200 bg-white px-7 py-8 text-center shadow-[0_12px_35px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:border-gray-400 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)] sm:px-8 sm:py-10">

                <WorkCardIcon kind="spark" />

                <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em] text-black">
                  Purposeful innovation
                </h3>

                <p className="mt-3 text-sm leading-7 text-black">
                  Build technology that solves complex problems, improves
                  experiences, and creates meaningful value for businesses.
                </p>

              </article>


              <article className="group relative overflow-hidden rounded-[24px] border border-gray-200 bg-white px-7 py-8 text-center shadow-[0_12px_35px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:border-gray-400 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)] sm:px-8 sm:py-10">

                <WorkCardIcon kind="trend" />

                <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em] text-black">
                  Continuous growth
                </h3>

                <p className="mt-3 text-sm leading-7 text-black">
                  Learn, experiment, and collaborate with a team that values
                  curiosity, technical excellence, and continuous improvement.
                </p>

              </article>


              <article className="group relative overflow-hidden rounded-[24px] border border-gray-200 bg-white px-7 py-8 text-center shadow-[0_12px_35px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:border-gray-400 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)] sm:px-8 sm:py-10">

                <WorkCardIcon kind="check" />

                <h3 className="mt-6 text-xl font-semibold tracking-[-0.03em] text-black">
                  Meaningful ownership
                </h3>

                <p className="mt-3 text-sm leading-7 text-black">
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
          className="bg-white px-5 py-8 sm:px-8 lg:px-12 lg:py-12"
          id="open-roles"
        >

          <div className="mx-auto max-w-[1180px]">

            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-black">
                  Open roles
                </p>

                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-black sm:text-4xl">
                  Open roles at vozon.ai.
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-black sm:text-base sm:leading-8">
                  We are hiring for the core roles that help shape the website,
                  platform, and voice technology behind vozon.ai.
                </p>

              </div>

            </div>


            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {openRoles.map((role, index) => (

                <article
                  key={role.title}
                  className="group relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-[22px] border border-gray-200 bg-white p-4 shadow-[0_12px_35px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:border-gray-400 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
                >

                  <div className="flex flex-1 flex-col">

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-black">
                          0{index + 1}
                        </span>

                        <h3 className="mt-3 text-lg font-semibold tracking-[-0.03em] text-black">
                          {role.title}
                        </h3>

                      </div>

                    </div>


                    <p className="mt-3 text-sm leading-6 text-black">
                      {role.description}
                    </p>


                    <div className="mt-3 flex flex-wrap gap-2">

                      {role.tags.map((tag) => (

                        <span
                          key={tag}
                          className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[9px] font-medium text-black"
                        >
                          {tag}
                        </span>

                      ))}

                    </div>


                    <a
                      href={`mailto:hello@vozon.ai?subject=Apply%20now%20-%20${encodeURIComponent(
                        role.title
                      )}%20at%20vozon.ai`}
                      className="mt-2 self-end inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-black bg-white px-4 text-[11px] font-bold text-black transition duration-300 hover:-translate-y-0.5 hover:bg-black hover:text-white"
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
        <section className="bg-white px-5 py-10 sm:px-8 lg:px-12 lg:py-14">

          <div className="mx-auto max-w-[1180px]">

            <div className="mx-auto max-w-3xl text-center">

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-black">
                Where you can contribute
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-black sm:text-4xl">
                Build across the voice AI stack.
              </h2>

            </div>


            <div className="mt-10 grid gap-5 md:grid-cols-3">

              {workAreas.map((area) => (

                <article
                  key={area.number}
                  className="rounded-[24px] border border-gray-200 bg-white p-7 shadow-[0_12px_35px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:border-gray-400 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
                >

                  <div className="flex items-center justify-between">

                    <span className="text-xs font-bold tracking-[0.18em] text-black">
                      {area.number}
                    </span>

                    <SparkIcon />

                  </div>

                  <h3 className="mt-7 text-xl font-semibold tracking-[-0.03em] text-black">
                    {area.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-black">
                    {area.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">

                    {area.tags.map((tag) => (

                      <span
                        key={tag}
                        className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-medium text-black"
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
        <section className="bg-white px-5 py-10 sm:px-8 lg:px-12 lg:py-14">

          <div className="mx-auto max-w-[1180px]">

            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-black">
                  How we work
                </p>

                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-black sm:text-4xl">
                  Principles that guide us.
                </h2>

                <p className="mt-5 max-w-md text-sm leading-7 text-black">
                  We want people to do their best work while building
                  technology that creates meaningful impact.
                </p>

              </div>


              <div className="divide-y divide-gray-200 border-y border-gray-200">

                {principles.map((principle) => (

                  <article
                    key={principle.number}
                    className="grid gap-4 py-7 sm:grid-cols-[60px_1fr]"
                  >

                    <span className="text-xs font-bold tracking-[0.15em] text-black">
                      {principle.number}
                    </span>

                    <div>

                      <h3 className="text-xl font-semibold tracking-[-0.03em] text-black">
                        {principle.title}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-black">
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
        <section className="bg-white px-5 py-10 sm:px-8 lg:px-12 lg:py-14">

          <div className="mx-auto max-w-[1180px]">

            <div className="mx-auto max-w-3xl text-center">

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-black">
                What you can expect
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-black sm:text-4xl">
                A place to learn, build, and grow.
              </h2>

            </div>


            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {benefits.map((benefit) => (

                <article
                  key={benefit.title}
                  className="rounded-[22px] border border-gray-200 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:border-gray-400 hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
                >

                  <div className="grid size-11 place-items-center rounded-xl border border-gray-200 bg-gray-50 text-lg text-black">
                    {benefit.icon}
                  </div>

                  <h3 className="mt-6 text-lg font-semibold tracking-[-0.03em] text-black">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-black">
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
        <section className="bg-white px-5 py-10 sm:px-8 lg:px-12 lg:py-14">

          <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-2">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-black">
                What we value
              </p>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-black sm:text-4xl">
                Bring your strengths.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-black">
                You do not need to know everything. We care about how you
                think, how you learn, and how you approach difficult problems.
              </p>


              <div className="mt-8 grid gap-4 sm:grid-cols-2">

                {qualities.map((quality) => (

                  <div
                    key={quality}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-4"
                  >
                    <CheckIcon />

                    <span className="text-sm font-medium text-black">
                      {quality}
                    </span>
                  </div>

                ))}

              </div>

            </div>


            <div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-black">
                Our process
              </p>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-black sm:text-4xl">
                From application to impact.
              </h2>


              <div className="mt-8 divide-y divide-gray-200 border-y border-gray-200">

                {process.map((step) => (

                  <article
                    key={step.number}
                    className="grid gap-4 py-6 sm:grid-cols-[55px_1fr]"
                  >

                    <span className="text-xs font-bold tracking-[0.16em] text-black">
                      {step.number}
                    </span>

                    <div>

                      <h3 className="text-lg font-semibold text-black">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-sm leading-7 text-black">
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
        <section className="bg-white px-5 py-8 sm:px-8 lg:px-12 lg:py-12">

          <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[0.65fr_1.35fr]">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-black">
                Careers FAQ
              </p>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-black sm:text-[2.8rem]">
                Before you apply.
              </h2>

              <p className="mt-6 max-w-sm text-sm leading-7 text-black">
                A few answers to help you understand what it is like to
                explore a career at vozon.ai.
              </p>

            </div>


            <div className="divide-y divide-gray-200">

              {faqs.map((faq, index) => (

                <details
                  key={faq.question}
                  className="group"
                  open={index === 0}
                >

                  <summary className="flex cursor-pointer list-none items-center gap-5 py-6 text-left [&::-webkit-details-marker]:hidden">

                    <span className="text-[10px] font-bold text-black">
                      0{index + 1}
                    </span>

                    <span className="text-base font-semibold text-black sm:text-lg">
                      {faq.question}
                    </span>

                    <span className="ml-auto grid size-8 shrink-0 place-items-center rounded-full border border-gray-300 bg-white text-lg font-light text-black transition duration-300 group-open:rotate-45">
                      +
                    </span>

                  </summary>

                  <p className="max-w-2xl pb-7 pl-10 pr-8 text-sm leading-7 text-black">
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
        <section className="bg-white px-5 pb-10 pt-2 sm:px-8 lg:px-12 lg:pb-14">

          <div className="mx-auto flex max-w-[1120px] flex-col items-center justify-between gap-5 overflow-hidden rounded-[22px] border border-gray-200 bg-white p-6 text-center shadow-[0_15px_45px_rgba(0,0,0,0.05)] sm:p-8 md:flex-row md:text-left">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.14em] text-black">
                Ready to join the team?
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-black md:text-2xl">
                Explore a career helping shape voice AI at vozon.ai.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-black">
                Meaningful work, real ownership, and a chance to shape how
                businesses use voice AI.
              </p>

            </div>


            <a
              href="mailto:hello@vozon.ai?subject=Careers%20at%20vozon.ai"
              className="inline-flex min-h-11 shrink-0 items-center rounded-lg border border-black bg-white px-6 text-sm font-bold text-black transition duration-300 hover:-translate-y-0.5 hover:bg-black hover:text-white"
            >
              CONTACT US
              <span className="ml-3">&rarr;</span>
            </a>

          </div>

        </section>

      </main>
    </SiteLayout>
  );
}

