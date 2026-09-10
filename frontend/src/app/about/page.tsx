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
  },
  {
    title: "Innovation First",
    description:
      "We push the boundaries of AI voice technology to deliver cutting-edge experiences.",
    icon: "✧",
  },
  {
    title: "Excellence",
    description:
      "We maintain the highest standards in accuracy, security, and performance.",
    icon: "◇",
  },
  {
    title: "Collaboration",
    description:
      "We believe in the power of human-AI collaboration to transform businesses.",
    icon: "♡",
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
      <main id="about-page" className="min-h-screen overflow-hidden bg-white text-black">

        {/* =========================================================
            HERO
        ========================================================= */}
        <section className="about-hero relative overflow-hidden px-5 pb-12 pt-24 sm:px-8 sm:pb-14 sm:pt-28 lg:px-10 lg:pb-16 lg:pt-32">

          <div className="relative mx-auto max-w-[1250px] text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#108D82]/20 bg-white px-4 py-2 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#108D82]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#108D82]">
                About vozon.ai
              </span>
            </div>

            {/* Heading */}
            <h1 className="about-hero-heading mx-auto mt-6 max-w-5xl text-[clamp(1.8rem,4vw,3.6rem)] font-medium leading-[0.97] tracking-[-0.06em] text-black">
              Building the future of intelligent communication.
            </h1>

            {/* Description */}
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600">
              Vozon.ai is building intelligent voice experiences that help
              businesses create better conversations, automate meaningful
              work, and connect people with outcomes.
            </p>

            {/* =====================================================
                HERO BUTTONS
                Talk to us = VIOLET
                Join our team = WHITE
            ===================================================== */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">

              {/* TALK TO US — VIOLET */}
              <Link
                href="/contact"
                className="about-primary-button inline-flex min-h-11 items-center gap-2 rounded-xl px-6 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1"
              >
                Talk to us
                <ArrowIcon />
              </Link>

              {/* JOIN OUR TEAM — WHITE */}
              <Link
                href="/career"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 text-sm font-bold text-black shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md"
              >
                Join our team
                <ArrowIcon />
              </Link>

            </div>

            {/* Hero Image */}
            <div className="relative mx-auto mt-9 max-w-[1100px]">

              <div className="relative overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                <img
                  src="/images/about_vozon.png"
                  alt="Vozon.ai AI voice agents platform"
                  className="block h-auto w-full object-cover"
                />
              </div>

            </div>

          </div>
        </section>


        {/* =========================================================
            MISSION
        ========================================================= */}
        <section className="relative bg-white px-5 py-10 sm:px-8 lg:px-10 lg:py-12">

          <div className="mx-auto max-w-[1200px]">

            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#108D82]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#108D82]">
                Our mission
              </span>
            </div>

            <div className="about-mission-card relative overflow-hidden rounded-[24px] border border-gray-200 px-6 py-7 shadow-[0_14px_45px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_18px_50px_rgba(0,0,0,0.07)] sm:px-9 sm:py-8 lg:px-11 lg:py-9">

              <div className="about-color-bar absolute inset-x-0 top-0 h-1" />

              <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-12">

                <div className="lg:max-w-[540px]">

                  <div className="mb-4 flex items-center gap-2">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-[#108D82] shadow-sm">
                      <SparkIcon />
                    </div>

                    <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#108D82]">
                      What we believe
                    </span>

                  </div>

                  <h2 className="text-[clamp(1.8rem,3vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.045em] text-black">
                    Make every conversation{" "}
                    <span className="text-[#108D82]">
                      more intelligent.
                    </span>
                  </h2>

                </div>

                <div className="hidden h-20 w-px bg-gray-200 lg:block" />

                <div className="lg:max-w-[470px]">

                  <p className="text-sm leading-7 text-gray-600 sm:text-base sm:leading-7">
                    We believe conversations contain enormous potential. Our
                    mission is to help businesses unlock that potential through
                    voice AI that understands, responds, acts, and learns.
                  </p>

                  <div className="mt-5 flex items-center gap-3">
                    <span className="h-px w-8 bg-[#108D82]" />

                    <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#108D82]">
                      vozon.ai
                    </span>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </section>


        {/* =========================================================
            VALUES
        ========================================================= */}
        <section className="about-values-section relative overflow-hidden px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">

          <div aria-hidden="true" className="about-values-glow about-values-glow-left" />
          <div aria-hidden="true" className="about-values-glow about-values-glow-right" />

          <div className="relative mx-auto max-w-[1380px]">

            <div className="grid gap-6 lg:grid-cols-[1fr_0.55fr] lg:items-end">

              <div>

                <div className="flex items-center gap-3">
                  <span className="h-0.5 w-8 rounded-full bg-[#108D82]" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#108D82]">
                    Our values
                  </p>
                </div>

                <h2 className="mt-4 max-w-3xl text-[clamp(1.8rem,3vw,2.8rem)] font-semibold leading-[1.03] tracking-[-0.05em] text-[#102a56]">
                  What Guides Us Ahead
                </h2>

              </div>

              <p className="max-w-md text-sm leading-7 text-[#425b7f] lg:justify-self-end">
                The principles behind our products, decisions, partnerships,
                and the way we work together.
              </p>

            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {values.map((value) => (

                <article
                  key={value.title}
                  className="about-values-card group relative overflow-hidden rounded-[22px] border bg-white/90 p-7 shadow-[0_12px_36px_rgba(26,79,150,0.08)] transition-all duration-300 hover:-translate-y-1 sm:p-8"
                >

                  <div className="about-values-card-bar absolute inset-x-0 top-0 h-1" />

                  <div className="relative flex min-h-[260px] flex-col">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#108D82]/20 bg-[#edf4ff] text-2xl text-[#108D82] transition duration-300 group-hover:border-[#108D82]/40 group-hover:bg-[#108D82] group-hover:text-white">
                      <span className="font-light leading-none">
                        {value.icon}
                      </span>
                    </div>

                    <div className="mt-auto pt-10">

                      <h3 className="text-[1.35rem] font-semibold tracking-[-0.035em] text-[#102a56]">
                        {value.title}
                      </h3>

                      <p className="mt-3 text-[0.95rem] leading-7 text-[#526987]">
                        {value.description}
                      </p>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          </div>
        </section>


        {/* =========================================================
            MANIFESTO
        ========================================================= */}
        <section className="relative overflow-hidden bg-white px-5 py-10 sm:px-8 lg:px-10 lg:py-12">

          <div className="relative mx-auto w-full max-w-[1380px]">

            <div className="mb-8 max-w-3xl">

              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#108D82]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#108D82]">
                  Our manifesto
                </p>
              </div>

              <h2 className="mt-4 text-[clamp(1.8rem,3vw,2.8rem)] font-medium leading-[1.03] tracking-[-0.045em] text-black">
                What we believe.
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
                The ideas that shape every product decision, interaction, and
                outcome we build toward.
              </p>

            </div>

            <div className="grid gap-4 md:grid-cols-2">

              {manifesto.map((line, index) => (

                <article
                  key={line}
                  className="about-manifesto-card group relative overflow-hidden rounded-[22px] border border-gray-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-1 sm:p-7"
                >

                  <div className="relative">

                    <div className="flex items-center gap-3">

                      <span className="about-manifesto-number flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold">
                        0{index + 1}
                      </span>

                    </div>

                    <p className="mt-4 max-w-xl text-[1.05rem] font-medium leading-[1.3] tracking-[-0.025em] text-black sm:text-[1.15rem]">
                      {line}
                    </p>

                    <p className="mt-2 max-w-lg text-sm leading-6 text-gray-600">
                      {manifestoNotes[index]}
                    </p>

                  </div>

                </article>

              ))}

            </div>

          </div>
        </section>


        {/* =========================================================
            TEAM
        ========================================================= */}
        <section className="relative overflow-hidden bg-white px-5 py-10 sm:px-8 lg:px-10 lg:py-12">

          <div className="relative mx-auto max-w-[1380px]">

            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

              <div>

                <div className="flex items-center gap-3">

                  <span className="h-px w-8 bg-[#108D82]" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#108D82]">
                    Our Team
                  </p>

                </div>

                <h2 className="mt-4 max-w-3xl text-[clamp(1.8rem,3.3vw,3rem)] font-medium leading-[1.02] tracking-[-0.05em] text-black">
                  The people behind the vision.
                </h2>

              </div>

              <p className="max-w-xl text-sm leading-7 text-gray-600">
                Great technology starts with people who care deeply about the
                problems they are solving. Our team brings together
                technology, product thinking, creativity, and ambition.
              </p>

            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:gap-16">

              {/* Team Image */}
              <div className="group relative min-h-[340px] overflow-hidden rounded-[24px] border border-gray-200 bg-black shadow-[0_18px_50px_rgba(0,0,0,0.08)] sm:min-h-[400px] lg:min-h-[470px]">

                <img
                  src="/images/leadership.png"
                  alt="The vozon.ai team"
                  className="absolute inset-0 h-full w-full object-cover object-center grayscale-[15%] transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />

                <div className="absolute left-5 top-5 rounded-lg border border-white/15 bg-black/50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-xl">
                  Our Team
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">

                  <div className="mb-4 h-px w-16 bg-[#108D82]" />

                  <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    One team.
                  </h3>

                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
                    One shared vision.
                  </p>

                </div>

              </div>


              {/* Team Content */}
              <div className="relative flex flex-col justify-between py-3 lg:translate-x-4 lg:py-6 xl:translate-x-6">

                <div className="relative">

                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-[#108D82]/20 bg-white text-[#108D82]">
                    <SparkIcon />
                  </div>

                  <h3 className="max-w-xl text-[clamp(1.8rem,3vw,2.5rem)] font-medium leading-[1.08] tracking-[-0.04em] text-black">
                    Different expertise.
                    <br />
                    <span className="text-[#108D82]">
                      Shared purpose.
                    </span>
                  </h3>

                  <p className="mt-5 max-w-xl text-justify text-sm leading-7 text-gray-600">
                    At vozon.ai, we believe the best technology is created when
                    different perspectives come together. Our team works across
                    AI, engineering, product, design, and customer experience
                    to turn complex ideas into simple and powerful solutions.
                  </p>

                  <p className="mt-6 max-w-xl text-justify text-sm leading-7 text-gray-600">
                    From building intelligent voice systems to creating
                    thoughtful user experiences, every part of the team
                    contributes to our mission of making business communication
                    more natural, useful, and effective.
                  </p>

                </div>

                <div className="relative mt-8 border-l-2 border-[#108D82] pl-5 sm:pl-6">

                  <div className="mb-2 text-2xl leading-none text-[#108D82]">
                    “
                  </div>

                  <p className="max-w-xl text-sm leading-6 text-gray-600">
                    Great products are built together — through ideas,
                    collaboration, and a shared commitment to solving real
                    problems.
                  </p>

                  <div className="mt-5 flex items-center gap-3">

                    <div className="h-px w-8 bg-[#108D82]" />

                    <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#108D82]">
                      Built together
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>


        {/* =========================================================
            JOURNEY
        ========================================================= */}
        <section className="relative overflow-hidden bg-white px-5 py-10 sm:px-8 lg:px-10 lg:py-12">

          <div className="relative mx-auto max-w-[1120px]">

            <div className="mx-auto max-w-3xl text-center">

              <div className="flex items-center justify-center gap-3">

                <span className="h-px w-8 bg-[#108D82]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#108D82]">
                  Our journey
                </p>

                <span className="h-px w-8 bg-[#108D82]" />

              </div>

              <h2 className="mt-4 text-[clamp(1.8rem,3.3vw,3rem)] font-medium leading-[1.05] tracking-[-0.04em] text-black">
                Milestones and Achievements
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600">
                Every milestone moves us closer to our vision of making
                business conversations more intelligent, more natural, and
                more human.
              </p>

            </div>

            <div className="relative mt-10">

              <div
                aria-hidden="true"
                className="about-milestone-line absolute bottom-0 left-5 top-0 bg-[#108D82] sm:left-1/2 sm:-translate-x-1/2"
              />

              <div className="space-y-7 sm:space-y-9">

                {journey.map((item, index) => (

                  <article
                    key={`${item.label}-${index}`}
                    className="about-journey-item group relative grid sm:grid-cols-2"
                  >

                    <div
                      className={`pl-12 sm:pl-0 ${
                        index % 2 === 0
                          ? "sm:pr-16 sm:text-right"
                          : "sm:col-start-2 sm:pl-16"
                      }`}
                    >

                      <div
                        className={`relative py-3 ${
                          index % 2 === 0 ? "sm:ml-auto" : ""
                        }`}
                      >

                        <div className="relative">

                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#108D82]">
                            {item.label}
                          </p>

                          <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-black sm:text-2xl">
                            {item.title}
                          </h3>

                          <p className="mt-3 text-base leading-7 text-gray-600">
                            {item.description}
                          </p>

                        </div>

                      </div>

                    </div>

                    <div
                      aria-hidden="true"
                      className="about-milestone-dot absolute left-5 top-8 flex h-3 w-3 -translate-x-1/2 items-center justify-center rounded-full bg-[#108D82] sm:left-1/2"
                    >
                    </div>

                  </article>

                ))}

              </div>

            </div>

          </div>
        </section>


        {/* =========================================================
            CONTACT
        ========================================================= */}
        <section className="about-contact-section bg-white px-6 pb-10 pt-3 lg:px-8">

          <div className="about-contact mx-auto flex flex-col items-center justify-between gap-5 overflow-hidden rounded-[20px] border border-[#d7c8e8] bg-[#f1e9fa] p-6 text-center text-black shadow-[0_14px_36px_rgba(91,54,123,0.09)] md:flex-row md:text-left">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7a3e9d]">
                  Ready to get started?
                </p>

                <h2 className="mt-2 max-w-2xl text-xl font-semibold tracking-[-0.02em] text-black md:text-2xl">
                  Build what comes next.
                </h2>

                <p className="mt-2 max-w-lg text-sm leading-6 text-gray-700">
                  We are building technology that can change how businesses
                  communicate and operate. If you want to help shape that
                  future, we&apos;d love to meet you.
                </p>

              </div>


              <Link
                href="/contact"
                className="inline-flex min-h-11 shrink-0 items-center rounded-lg bg-[#7a3e9d] px-6 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#683486]"
              >
                CONTACT US <span className="ml-3">&rarr;</span>
              </Link>

          </div>
        </section>

        <style>{`
          #about-page {
            background: #fff;
          }

          #about-page .about-hero {
            background: linear-gradient(180deg, #fbf9ff 0%, #f5f2ff 68%, #fff 100%);
          }

          #about-page .about-gradient-text {
            background: none !important;
            color: #000 !important;
            -webkit-text-fill-color: #000 !important;
          }

          #about-page .about-hero-heading,
          #about-page .about-hero-heading span {
            background: none !important;
            color: #000 !important;
            -webkit-text-fill-color: #000 !important;
          }

          #about-page .about-primary-button {
            background: #108D82;
          }

          #about-page .about-primary-button:hover {
            background: #108D82;
          }

          #about-page .about-color-bar {
            background: linear-gradient(90deg, #df4f82, #a45ee8, #108D82);
          }

          #about-page [class*="text-[#108D82]"] {
            color: #805bd8;
          }

          #about-page [class*="bg-[#108D82]"] {
            background-color: #805bd8;
          }

          #about-page [class*="border-[#108D82]"] {
            border-color: rgba(128, 91, 216, .36);
          }

          #about-page > section:nth-of-type(2) {
            background: #fff;
          }

          #about-page .about-mission-card {
            background: #f1edff;
            border-color: #ddd5ff;
          }

          #about-page .about-values-section {
            background: linear-gradient(135deg, #f4f8ff 0%, #eaf2ff 55%, #f8fbff 100%);
            border-top: 1px solid #dce9fb;
            border-bottom: 1px solid #dce9fb;
          }

          #about-page .about-values-glow {
            position: absolute;
            width: 24rem;
            height: 24rem;
            border-radius: 9999px;
            background: rgba(16, 141, 130, .11);
            filter: blur(90px);
            pointer-events: none;
          }

          #about-page .about-values-glow-left {
            left: -12rem;
            top: -10rem;
          }

          #about-page .about-values-glow-right {
            right: -12rem;
            bottom: -12rem;
          }

          #about-page > section:nth-of-type(4) {
            background: #fcf8ff;
          }

          #about-page > section:nth-of-type(5) {
            background: linear-gradient(145deg, #ffffff 0%, #f4f1ff 100%);
          }

          #about-page > section:nth-of-type(6) {
            background: #fff;
          }

          #about-page .about-journey-item {
            z-index: 2;
            border: 0 !important;
            background: transparent !important;
            box-shadow: none !important;
          }

          #about-page .about-milestone-line {
            top: 2rem !important;
            bottom: 2rem !important;
            z-index: 10 !important;
            width: 3px !important;
            background: #108D82 !important;
            opacity: 1 !important;
          }

          #about-page .about-milestone-dot {
            z-index: 20 !important;
            width: 16px !important;
            height: 16px !important;
            border: 3px solid #fff !important;
            background: #108D82 !important;
            box-shadow: 0 0 0 2px #108D82 !important;
          }

          #about-page .about-manifesto-card {
            border-color: rgba(128, 91, 216, .18);
          }

          #about-page .about-values-card {
            border-color: #cfe0f7;
          }

          #about-page .about-values-section [class*="text-[#108D82]"] {
            color: #108D82;
          }

          #about-page .about-values-section [class*="bg-[#108D82]"] {
            background-color: #108D82;
          }

          #about-page .about-values-card:hover [class*="text-[#108D82]"] {
            color: #fff;
          }

          #about-page .about-values-card-bar {
            background: linear-gradient(90deg, #108D82, #108D82);
            opacity: .9;
          }

          #about-page .about-values-card:hover {
            border-color: #108D82;
            box-shadow: 0 18px 44px rgba(26, 79, 150, .14);
          }

          #about-page .about-manifesto-card:nth-child(4n + 2) [class*="text-[#108D82]"] {
            color: #c64f7c;
          }

          #about-page .about-manifesto-card:nth-child(4n + 3) [class*="text-[#108D82]"] {
            color: #9b5274;
          }

          #about-page .about-manifesto-card:nth-child(4n) [class*="text-[#108D82]"] {
            color: #d98a00;
          }

          #about-page .about-manifesto-number {
            background: #f5e7ed;
            color: #a85370;
          }

          #about-page .about-manifesto-card:hover {
            border-color: rgba(128, 91, 216, .42);
          }

          #about-page .about-manifesto-card:nth-child(4n + 2) {
            border-color: rgba(16, 141, 130, .2);
          }

          #about-page .about-contact {
            width: min(100%, 980px);
            border-color: #d7c8e8;
            background: linear-gradient(120deg, #f1e9fa 0%, #e9e7ff 100%);
            box-shadow: 0 14px 36px rgba(91, 54, 123, .09);
            padding: 1.5rem;
          }

          #about-page .about-contact a {
            border-color: #7a3e9d;
            background: #7a3e9d;
            color: #fff;
          }

          #about-page .about-contact a:hover {
            background: #683486;
          }
        `}</style>

      </main>
    </SiteLayout>
  );
}

