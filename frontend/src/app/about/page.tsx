import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata: Metadata = {
  title: "About Us | AI Voice Platform",
  description: "Meet the team building a more useful, accountable future for customer conversations.",
};

const principles = [
  {
    title: "Useful before impressive",
    body: "A great voice agent resolves the customer's need. We optimize for clear outcomes, not novelty for its own sake.",
  },
  {
    title: "People stay in control",
    body: "Teams define the policies, escalation rules, and review process. Automation should increase judgment, not hide it.",
  },
  {
    title: "Trust is a product feature",
    body: "Reliability, transparency, and careful handling of customer data belong in the core experience from day one.",
  },
  {
    title: "Learn from every call",
    body: "Conversation quality improves when teams can see what happened, understand why, and make the next interaction better.",
  },
] as const;

export default function AboutPage() {
  return (
    <SiteLayout>
      <div className="bg-[#111827] text-white">
        <section className="mx-auto grid min-h-[760px] max-w-[1280px] items-center gap-16 px-5 pt-32 pb-20 sm:px-8 lg:grid-cols-[1fr_0.8fr] lg:px-12">
          <div>
            <p className="m-0 text-sm font-bold text-cyan-300">About AI Voice Platform</p>
            <h1 className="mt-7 mb-0 max-w-4xl text-5xl leading-[1.02] font-semibold sm:text-6xl lg:text-7xl">
              We are making every customer conversation more useful.
            </h1>
            <p className="mt-7 mb-0 max-w-2xl text-lg leading-8 text-slate-300">
              We build AI phone agents that help businesses answer faster, complete routine work, and give human teams the context to handle what matters most.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#0b1220] p-6 shadow-[0_28px_80px_rgba(2,6,23,0.45)] sm:p-8">
            <p className="m-0 text-xs font-bold text-slate-500">OUR MISSION</p>
            <p className="mt-6 mb-0 text-3xl leading-snug font-medium">
              Make reliable voice automation accessible to every team that serves customers by phone.
            </p>
            <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-md bg-white/10">
              {[["24/7", "availability"], ["140+", "languages"], ["One", "connected platform"], ["Human", "control built in"]].map(([value, label]) => (
                <div className="bg-[#111827] p-5" key={label}>
                  <strong className="block text-xl text-cyan-300">{value}</strong>
                  <span className="mt-1 block text-xs text-slate-500">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f4f7f8] text-[#111827]">
          <div className="mx-auto grid max-w-[1280px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:px-12">
            <div>
              <p className="m-0 text-sm font-bold text-[#007f88]">Why we are here</p>
              <h2 className="mt-5 mb-0 text-4xl leading-tight font-semibold sm:text-5xl">The phone is still where urgent work happens.</h2>
              <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-lg bg-slate-200">
                <Image
                  alt="Team collaborating on the future of customer conversations"
                  className="object-cover"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  src="/service-images/team-workflow.jpg"
                />
              </div>
            </div>
            <div className="grid content-start gap-7 text-lg leading-8 text-slate-600">
              <p className="m-0">
                Customers call when a form is too slow, a request is too important, or they simply need an answer now. Yet many businesses still have to choose between long queues, missed calls, and expensive manual coverage.
              </p>
              <p className="m-0">
                We believe voice AI can change that without turning conversations into rigid menus. The right platform understands intent, acts inside clear boundaries, and knows when to bring in a person.
              </p>
              <p className="m-0 font-medium text-[#111827]">
                That is the standard we are building toward: responsive for customers, operationally useful for teams, and accountable by design.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="m-0 text-sm font-bold text-cyan-300">How we work</p>
            <h2 className="mt-5 mb-0 text-4xl font-semibold sm:text-5xl">Principles behind the platform.</h2>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2">
            {principles.map((principle, index) => (
              <article className="min-h-72 bg-[#111827] p-7 sm:p-9" key={principle.title}>
                <span className="text-sm font-bold text-cyan-300">0{index + 1}</span>
                <h3 className="mt-14 mb-0 text-2xl font-semibold">{principle.title}</h3>
                <p className="mt-4 mb-0 max-w-lg leading-7 text-slate-400">{principle.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#0b1220]">
          <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
            <div>
              <p className="m-0 text-sm font-bold text-cyan-300">Built as one platform</p>
              <h2 className="mt-5 mb-0 text-4xl font-semibold sm:text-5xl">Conversation quality and business outcomes belong together.</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {["Natural speech", "Workflow execution", "Quality review", "Operational analytics"].map((item, index) => (
                <div className="border-t border-white/15 pt-5" key={item}>
                  <span className="text-xs font-bold text-slate-500">CAPABILITY 0{index + 1}</span>
                  <h3 className="mt-4 mb-0 text-xl font-semibold">{item}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1280px] gap-8 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-12">
          <div>
            <p className="m-0 text-sm font-bold text-cyan-300">Build with us</p>
            <h2 className="mt-4 mb-0 max-w-3xl text-4xl font-semibold sm:text-5xl">Help shape the future of customer conversations.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="inline-flex min-h-12 items-center rounded-md border border-white/20 px-5 font-bold hover:bg-white/5" href="/career">View careers</Link>
            <Link className="inline-flex min-h-12 items-center rounded-md bg-cyan-400 px-5 font-bold text-[#07111f]" href="/#contact">Contact us</Link>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
