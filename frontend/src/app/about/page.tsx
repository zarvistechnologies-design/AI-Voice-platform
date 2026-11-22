import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata: Metadata = {
  title: "About Us | vozon.ai",
  description: "Discover the people, principles, and vision behind vozon.ai.",
};

const values = [
  { title: "Customer-Centric", description: "Every feature we build solves real customer problems and drives measurable business value." },
  { title: "Innovation First", description: "We push the boundaries of AI voice technology to deliver cutting-edge experiences." },
  { title: "Excellence", description: "We maintain the highest standards in accuracy, security, and performance." },
  { title: "Collaboration", description: "We believe in the power of human-AI collaboration to transform businesses." },
];

const manifesto = [
  { title: "Technology should feel natural.", note: "Clear, calm, and easy to use." },
  { title: "AI should understand before it acts.", note: "Context first, action second." },
  { title: "Automation should create time, not distance.", note: "Less friction for the people doing the work." },
  { title: "Every conversation should move something forward.", note: "Every interaction should help progress something meaningful." },
];

const journey = [
  { label: "The beginning", title: "An idea worth building", description: "Vozon started with a simple belief: business conversations could become more intelligent, natural, and useful." },
  { label: "Building the foundation", title: "Turning the idea into reality", description: "We began building voice AI experiences designed to understand conversations and respond naturally in real time." },
  { label: "Expanding the vision", title: "From conversations to action", description: "Our vision grew beyond conversation — connecting voice interactions with workflows, systems, and meaningful outcomes." },
  { label: "Today", title: "Building what comes next", description: "We continue building intelligent voice systems that help businesses scale conversations while keeping people at the center." },
];

function ArrowIcon() {
  return (
    <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h12m-4.5-4.5L16 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2.8 13.7 9 20 11l-6.3 1.9-1.7 6.3-1.7-6.3L4 11l6.3-2L12 2.8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-700">
      <span className="h-px w-7 bg-teal-600" />
      {children}
    </p>
  );
}

const headingClass = "text-[clamp(1.8rem,3vw,2.8rem)] font-semibold leading-[1.06] tracking-[-0.045em] text-[#14231f]";

export default function AboutPage() {
  return (
    <SiteLayout>
      <main id="about-page" className="overflow-hidden bg-white text-slate-950">
        <section className="relative border-b border-[#eee9f5] bg-white px-5 pb-12 pt-24 sm:px-8 sm:pb-14 sm:pt-28 lg:pt-32">
          <div className="mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d8d0e5] bg-white px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#625b7d] shadow-sm">
                <span className="size-2 rounded-full bg-teal-600" /> About vozon.ai
              </div>
              <h1 className="mt-6 text-[clamp(1.85rem,3.8vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.05em] text-[#14231f]">
                Building the future of <span className="text-teal-700">intelligent communication.</span>
              </h1>
              <p className="mt-6 max-w-xl text-[15px] leading-7 text-slate-700 sm:text-base">
                Vozon.ai is building intelligent voice experiences that help businesses create better conversations, automate meaningful work, and connect people with outcomes.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-teal-700 px-6 text-sm font-bold text-white shadow-[0_15px_35px_rgba(13,148,136,.2)] transition hover:-translate-y-0.5 hover:bg-teal-800">
                  Talk to us <ArrowIcon />
                </Link>
                <Link href="/career" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#d8d0e5] bg-white px-6 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-teal-300">
                  Join our team <ArrowIcon />
                </Link>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[700px] overflow-hidden bg-white">
              <Image src="/images/vozon_ai.png" alt="Vozon.ai team building better voice experiences" width={1536} height={1024} priority className="block h-auto w-full object-contain" />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to right, #fff 0%, transparent 4%, transparent 96%, #fff 100%), linear-gradient(to bottom, #fff 0%, transparent 4%, transparent 92%, #fff 100%)",
                }}
              />
            </div>
          </div>
        </section>

        <section className="px-5 py-10 sm:px-8 sm:py-12 lg:py-14">
          <div className="mx-auto grid max-w-[1200px] gap-8 rounded-[28px] border border-[#dbe4e1] bg-[#f7fbfa] p-6 sm:p-9 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-16 lg:p-11">
            <div>
              <SectionLabel>Our mission</SectionLabel>
              <h2 className={`${headingClass} mt-5`}>Make every conversation <span className="text-teal-700">more intelligent.</span></h2>
            </div>
            <div className="border-t border-[#dbe4e1] pt-7 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              <div className="grid size-11 place-items-center rounded-xl border border-teal-200 bg-white text-teal-700 shadow-sm"><SparkIcon /></div>
              <p className="mt-5 text-[15px] leading-7 text-slate-700 sm:text-base">
                We believe conversations contain enormous potential. Our mission is to help businesses unlock that potential through voice AI that understands, responds, acts, and learns.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-[#eee9f5] bg-[#faf8fc] px-5 py-10 sm:px-8 sm:py-12 lg:py-14">
          <div className="mx-auto max-w-[1280px]">
            <div className="grid gap-5 lg:grid-cols-[1fr_.55fr] lg:items-end">
              <div><SectionLabel>Our values</SectionLabel><h2 className={`${headingClass} mt-4`}>What guides us ahead.</h2></div>
              <p className="m-0 max-w-md text-sm leading-7 text-slate-700 lg:justify-self-end">The principles behind our products, decisions, partnerships, and the way we work together.</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <article key={value.title} className="group flex min-h-[250px] flex-col rounded-[22px] border border-[#e4deed] bg-white p-6 shadow-[0_8px_24px_rgba(109,106,156,.06)] transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-[0_16px_38px_rgba(13,148,136,.09)]">
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-xl bg-teal-50 text-xs font-bold text-teal-700">0{index + 1}</span>
                    <span className="text-teal-600 transition group-hover:rotate-12"><SparkIcon /></span>
                  </div>
                  <div className="mt-auto pt-10">
                    <h3 className="text-lg font-semibold tracking-[-0.025em] text-[#14231f]">{value.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{value.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-10 sm:px-8 sm:py-12 lg:py-14">
          <div className="mx-auto max-w-[1200px]">
            <div className="mx-auto max-w-3xl text-center">
              <div className="flex justify-center"><SectionLabel>Our manifesto</SectionLabel></div>
              <h2 className={`${headingClass} mt-4`}>The beliefs behind what we build.</h2>
              <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-slate-700">The ideas that shape every product decision, interaction, and outcome we build toward.</p>
            </div>
            <div className="mt-10 grid overflow-hidden rounded-[24px] border border-[#e4deed] bg-white md:grid-cols-2">
              {manifesto.map((item, index) => (
                <article key={item.title} className="border-b border-[#eee9f5] p-6 last:border-b-0 md:min-h-[180px] md:border-r md:p-8 md:[&:nth-child(2n)]:border-r-0 md:[&:nth-child(n+3)]:border-b-0">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-700">0{index + 1}</span>
                  <h3 className="mt-6 text-lg font-semibold leading-6 tracking-[-0.025em] text-[#14231f] sm:text-xl">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#eee9f5] bg-[#faf8fc] px-5 py-10 sm:px-8 sm:py-12 lg:py-14">
          <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[1.03fr_.97fr] lg:items-center lg:gap-16">
            <div className="relative overflow-hidden rounded-[28px] border border-[#d8d0e5] bg-slate-950 shadow-[0_20px_50px_rgba(15,23,42,.12)]">
              <Image src="/images/leadership.png" alt="The vozon.ai team" width={1200} height={900} className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-[1.025]" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-6 pt-20 sm:p-8 sm:pt-24">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-300">Our team</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">One team. One shared vision.</p>
              </div>
            </div>
            <div>
              <SectionLabel>Our team</SectionLabel>
              <h2 className={`${headingClass} mt-4`}>Different expertise. <span className="text-teal-700">Shared purpose.</span></h2>
              <p className="mt-5 text-[15px] leading-7 text-slate-700">At vozon.ai, we believe the best technology is created when different perspectives come together. Our team works across AI, engineering, product, design, and customer experience to turn complex ideas into simple and powerful solutions.</p>
              <p className="mt-4 text-[15px] leading-7 text-slate-700">From building intelligent voice systems to creating thoughtful user experiences, every part of the team contributes to our mission of making business communication more natural, useful, and effective.</p>
              <blockquote className="mt-7 border-l-2 border-teal-600 pl-5 text-sm leading-6 text-slate-600">“Great products are built together — through ideas, collaboration, and a shared commitment to solving real problems.”</blockquote>
            </div>
          </div>
        </section>

        <section className="px-5 py-10 sm:px-8 sm:py-12 lg:py-14">
          <div className="mx-auto max-w-[1120px]">
            <div className="mx-auto max-w-3xl text-center">
              <div className="flex justify-center"><SectionLabel>Our journey</SectionLabel></div>
              <h2 className={`${headingClass} mt-4`}>Milestones and achievements.</h2>
              <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-slate-700">Every milestone moves us closer to our vision of making business conversations more intelligent, more natural, and more human.</p>
            </div>
            <div className="relative mt-10 grid gap-4 md:grid-cols-2">
              <div className="absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-px -translate-x-1/2 bg-[#d8d0e5] md:block" aria-hidden="true" />
              {journey.map((item, index) => (
                <article key={item.label} className={`relative rounded-[22px] border border-[#e4deed] bg-white p-6 shadow-[0_8px_24px_rgba(109,106,156,.05)] sm:p-7 ${index % 2 ? "md:translate-y-12" : ""}`}>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700">{item.label}</p>
                    <span className="grid size-8 place-items-center rounded-full bg-teal-50 text-[10px] font-bold text-teal-700">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-[#14231f]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-14 pt-20 sm:px-8 sm:pb-16 lg:pt-24">
          <div className="mx-auto grid max-w-[1100px] gap-6 rounded-[24px] border border-[#cfc7df] bg-[#faf8fc] px-6 py-8 shadow-[0_16px_42px_rgba(109,106,156,.1)] sm:px-9 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-700">Ready to get started?</p>
              <h2 className="mt-3 text-[clamp(1.6rem,2.3vw,2.1rem)] font-semibold tracking-[-0.04em] text-[#14231f]">Build what comes next.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">We are building technology that can change how businesses communicate and operate. If you want to help shape that future, we&apos;d love to meet you.</p>
            </div>
            <Link href="/contact" className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-teal-700 px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-teal-800">Contact us <ArrowIcon /></Link>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
