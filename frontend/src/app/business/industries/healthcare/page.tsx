/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata = {
  title: "AI Phone Agents for Healthcare | vozon.ai",
  description:
    "AI phone agents for healthcare calls, routing, IVR navigation, appointment booking, EHR integrations, pricing, and FAQs.",
};

const photoCards = [
  {
    title: "Healthcare Frontdesk",
    image: "/images/healthcare/marquee-frontdesk.jpg",
  },
  {
    title: "Healthcare Back Office",
    image: "/images/healthcare/marquee-back-office.jpg",
  },
  {
    title: "Patient Management",
    image: "/images/healthcare/marquee-patient-management.jpg",
  },
  {
    title: "Appointment Support",
    image: "/images/healthcare/marquee-appointment.jpg",
  },
];

const healthcareCompanies = [
  { name: "Epic", color: "#35fbe0" },
  { name: "Cerner", color: "#9b8cff" },
  { name: "Athenahealth", color: "#ff9f5a" },
  { name: "DrChrono", color: "#58a6ff" },
  { name: "Dentrix", color: "#ff6f91" },
  { name: "Jane App", color: "#b8f65b" },
];

const reviews = [
  {
    quote:
      "Routine appointment questions are handled immediately, so our front desk can give in-person patients their full attention.",
    name: "Aarav Mehta",
    role: "Clinic Operations Lead",
    metric: "Less call waiting",
  },
  {
    quote:
      "The call summary gives our coordinators the context they need without asking patients to repeat the entire conversation.",
    name: "Nina Thomas",
    role: "Patient Experience Manager",
    metric: "Clearer handoffs",
  },
  {
    quote:
      "After-hours callers still receive a calm, consistent response, and urgent requests reach the right on-call workflow.",
    name: "Daniel Brooks",
    role: "Healthcare Network Director",
    metric: "24/7 coverage",
  },
];

const workflowSections = [
  {
    eyebrow: "Call Routing",
    title: "Route every call to the right department",
    button: "Explore call routing",
    visual: "routing",
    image: "/images/healthcare/feature-call-routing.png",
    points: [
      {
        title: "Dynamic Routing To Different Departments",
        body: "Automatically connect callers to the appropriate department based on their needs.",
      },
      {
        title: "Smart Routing To Assigned Contacts",
        body: "Seamlessly route calls to a user's designated contact, such as their primary doctor, using dynamic variables instead of fixed department numbers.",
      },
      {
        title: "Warm Transfer To A Human Agent With Context",
        body: "Ensure smooth handovers by transferring calls to human agents with full conversation history.",
      },
    ],
  },
  {
    eyebrow: "Handle IVR",
    title: "Navigate IVR systems and retrieve clinic information",
    button: "Explore IVR navigation",
    visual: "ivr",
    image: "/images/healthcare/feature-ivr-navigation.png",
    reverse: true,
    points: [
      {
        title: "Press Digits To Navigate To Right Department",
        body: "Seamlessly press digits and navigate to the correct department.",
      },
      {
        title: "Retrieve Information From Pharmacy/Clinic",
        body: "Gather essential details directly from clinic or pharmacy systems.",
      },
    ],
  },
  {
    eyebrow: "Patient Management",
    title: "Support patients with reliable appointment workflows",
    button: "Explore appointment support",
    visual: "calendar",
    image: "/images/healthcare/feature-appointment-support.png",
    points: [
      {
        title: "Seamless Appointment Booking",
        body: "Effortlessly schedule and manage patient appointments with automated call handling.",
      },
      {
        title: "Smart Notifications & Check-Ins",
        body: "Keep patients informed with reminders and updates, while leveraging HIPAA compliant AI note taking to automatically log call details and update records securely.",
      },
      {
        title: "Prescreening & Surveys",
        body: "Ensure smooth handovers by transferring calls to human agents with full conversation history.",
      },
    ],
  },
];

const integrations = [
  "Keragon",
  "Jane App",
  "Dentrix",
  "OpenDental",
  "Epic",
  "Cerner",
  "Athenahealth",
  "DrChrono",
  "NextGen",
  "Kareo",
  "eClinicalWorks",
  "AdvancedMD",
  "Practice Fusion",
  "SimplePractice",
  "TheraNest",
];

const integrationHighlights = [
  {
    label: "Scheduling",
    title: "Keep appointments in sync",
    body: "Check availability, create bookings, and return clear confirmation details during the call.",
    accent: "text-[#75fff0] bg-[#35fbe0]/10 border-[#35fbe0]/20",
    icon: "01",
  },
  {
    label: "Patient systems",
    title: "Share useful call outcomes",
    body: "Send structured summaries and next steps into the tools your care team already checks.",
    accent: "text-[#c5bdff] bg-[#8f83e8]/10 border-[#8f83e8]/20",
    icon: "02",
  },
  {
    label: "Custom workflows",
    title: "Connect through APIs",
    body: "Use supported integrations and webhooks to fit existing operational and routing processes.",
    accent: "text-[#ffb17e] bg-[#ff9655]/10 border-[#ff9655]/20",
    icon: "03",
  },
];

const faqs = [
  {
    question: "Which healthcare calls can an AI voice agent handle?",
    answer:
      "It can manage common requests such as appointment booking, office information, reminders, basic FAQs, call routing, and after-hours intake while escalating sensitive cases to your team.",
  },
  {
    question: "Can patients schedule, reschedule, or cancel appointments by phone?",
    answer:
      "Yes. The agent can check connected calendar availability, confirm patient preferences, update the booking, and send the outcome to the appropriate workflow.",
  },
  {
    question: "What happens when a call is urgent or needs a staff member?",
    answer:
      "You can define routing and escalation rules so urgent, complex, or sensitive conversations are transferred to the correct department with a concise call summary.",
  },
  {
    question: "How can patient information be handled securely?",
    answer:
      "Workflows can be configured to collect only necessary information, control access, and limit what appears in summaries. Your team should review each setup against its privacy and compliance requirements.",
  },
  {
    question: "Will it work with our current EHR and phone tools?",
    answer:
      "The voice agent can connect with supported EHR, scheduling, CRM, and telephony tools through available integrations or APIs. Compatibility depends on your existing system and workflow needs.",
  },
];

function CheckIcon() {
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-[#35fbe0]/25 bg-[#35fbe0]/10 text-xs font-bold text-[#75fff0]">
      &#10003;
    </span>
  );
}

function Pill({ children }: { children: string }) {
  return (
    <span className="inline-flex rounded-full border border-[#35fbe0]/25 bg-[#35fbe0]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#75fff0]">
      {children}
    </span>
  );
}

function WorkflowVisual({ type, image }: { type: string; image?: string }) {
  if (image) {
    const callout =
      type === "routing"
        ? ["Smart routing", "Connected to Cardiology"]
        : type === "ivr"
          ? ["IVR navigation", "Clinic information retrieved"]
          : ["Appointment support", "Visit confirmed for Tuesday"];
    const accent =
      type === "routing"
        ? {
            border: "border-[#35fbe0]/30",
            label: "text-[#75fff0]",
            badge: "bg-[#35fbe0] text-[#031310]",
          }
        : type === "ivr"
          ? {
              border: "border-[#ff9655]/35",
              label: "text-[#ffb17e]",
              badge: "bg-[#ff9655] text-[#241006]",
            }
          : {
              border: "border-[#8f83e8]/35",
              label: "text-[#c5bdff]",
              badge: "bg-[#8f83e8] text-white",
            };

    return (
      <div className={`group relative overflow-hidden rounded-2xl border bg-[#07100d] shadow-sm ${accent.border}`}>
        <img
          alt={`${callout[0]} healthcare workflow`}
          className="block h-[390px] w-full object-cover transition duration-700 group-hover:scale-[1.025] sm:h-[410px]"
          decoding="sync"
          loading="lazy"
          src={image}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(0,0,0,0.68)_100%)]" />
        <div className="absolute inset-x-5 bottom-5 rounded-xl border border-white/10 bg-black/85 p-4 backdrop-blur-md sm:inset-x-6 sm:bottom-6">
          <div className="flex items-center justify-between gap-5">
            <div>
              <p className={`text-xs font-bold uppercase tracking-[0.14em] ${accent.label}`}>{callout[0]}</p>
              <p className="mt-2 text-base font-semibold text-white sm:text-lg">{callout[1]}</p>
            </div>
            <span className={`grid size-9 shrink-0 place-items-center rounded-full text-base font-bold ${accent.badge}`}>&#10003;</span>
          </div>
        </div>
      </div>
    );
  }

  const visualBackground =
    type === "routing"
      ? "bg-[radial-gradient(circle_at_22%_18%,#ccfbf1_0,#5eead4_24%,transparent_42%),radial-gradient(circle_at_82%_26%,#35fbe0_0,#0f766e_32%,transparent_56%),linear-gradient(135deg,#000,#07100d_45%,#35fbe0)]"
      : type === "ivr"
        ? "bg-[radial-gradient(circle_at_22%_18%,#ccfbf1_0,#5eead4_24%,transparent_42%),radial-gradient(circle_at_82%_26%,#35fbe0_0,#0f766e_32%,transparent_56%),linear-gradient(135deg,#000,#07100d_45%,#35fbe0)]"
        : "bg-[radial-gradient(circle_at_22%_18%,#ccfbf1_0,#5eead4_24%,transparent_42%),radial-gradient(circle_at_82%_26%,#35fbe0_0,#0f766e_32%,transparent_56%),linear-gradient(135deg,#000,#07100d_45%,#35fbe0)]";

  return (
    <div className={`relative min-h-[500px] overflow-hidden rounded-[24px] ${visualBackground} p-6 shadow-sm sm:p-10`}>
      <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle,#111827_0.75px,transparent_0.9px)] [background-size:3px_3px]" />
      {type === "routing" ? (
        <div className="relative mx-auto min-h-[420px] max-w-[620px] text-sm text-slate-950">
          <div className="absolute left-1/2 top-[34px] z-10 -translate-x-1/2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-lg">
            <span className="mr-2">&#9742;</span>customer call in
          </div>
          <div className="absolute left-1/2 top-[72px] h-[144px] w-px -translate-x-1/2 bg-white/90" />
          <div className="absolute left-[19%] top-[216px] h-px w-[62%] bg-white/90" />
          <div className="absolute left-[19%] top-[216px] h-[72px] w-px bg-white/90" />
          <div className="absolute right-[19%] top-[216px] h-[72px] w-px bg-white/90" />
          <div className="absolute left-1/2 top-[186px] size-2 -translate-x-1/2 rounded-full bg-white" />
          <div className="absolute left-[19%] top-[214px] size-1.5 -translate-x-1/2 rounded-full bg-white" />
          <div className="absolute right-[19%] top-[214px] size-1.5 translate-x-1/2 rounded-full bg-white" />
          <div className="absolute left-1/2 top-[112px] z-10 flex w-[188px] -translate-x-1/2 items-center gap-3 rounded-lg bg-white p-4 shadow-xl">
            <span className="grid size-10 shrink-0 place-items-center rounded-md bg-pink-100 text-xl font-bold text-pink-500">
              #
            </span>
            <div>
              <strong className="block text-lg font-medium leading-tight">Introduction</strong>
              <p className="mt-1 text-sm text-slate-500">Ask their inquiry</p>
            </div>
          </div>
          <div className="absolute left-[3%] top-[198px] z-10 rounded-full bg-slate-950 px-3 py-2 text-xs font-medium text-white shadow-lg">
            User has basic question
          </div>
          <div className="absolute right-[3%] top-[198px] z-10 rounded-full bg-slate-950 px-3 py-2 text-xs font-medium text-white shadow-lg">
            User has billing issues
          </div>
          <div className="absolute left-0 top-[288px] z-10 flex w-[208px] items-center gap-3 rounded-lg bg-white p-4 shadow-xl sm:left-[1%]">
            <span className="grid size-10 shrink-0 place-items-center rounded-md bg-pink-100 text-xl font-bold text-pink-500">
              #
            </span>
            <div>
              <strong className="block text-lg font-medium leading-tight">FAQ</strong>
              <p className="mt-1 text-sm text-slate-500">Answer their inquiry</p>
            </div>
          </div>
          <div className="absolute right-0 top-[288px] z-10 flex w-[250px] items-center gap-3 rounded-lg bg-white p-4 shadow-xl sm:right-[1%]">
            <span className="grid size-10 shrink-0 place-items-center rounded-md bg-cyan-100 text-lg font-bold text-[#0f766e]">
              &#9742;
            </span>
            <div>
              <strong className="block text-base font-medium leading-tight sm:text-lg">Transfer to Department</strong>
              <p className="mt-1 text-sm text-slate-500">Ask their inquiry</p>
            </div>
          </div>
        </div>
      ) : null}
      {type === "ivr" ? (
        <div className="relative mx-auto min-h-[420px] max-w-[590px] text-slate-950">
          <div className="absolute left-0 top-[184px] w-[330px] rounded-lg bg-white p-5 shadow-xl sm:left-2">
            <p className="mb-5 flex items-center gap-3 text-sm font-medium">
              <span className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 9 }, (_, index) => (
                  <span className="size-1.5 rounded-full bg-slate-400" key={index} />
                ))}
              </span>
              Press Digit
            </p>
            <label className="grid gap-2 text-sm font-medium">
              Name
              <span className="truncate rounded-md border border-slate-200 px-3 py-2 font-normal text-slate-700">
                Navigate IVR
              </span>
            </label>
            <label className="mt-3 grid gap-2 text-sm font-medium">
              Description
              <span className="truncate rounded-md border border-slate-200 px-3 py-2 font-normal text-slate-700">
                Press the correct digit to billing department.
              </span>
            </label>
          </div>
          <div className="absolute right-8 top-[80px] z-10 w-[240px] rounded-t-[28px] border-4 border-[#d8d5ff] border-b-0 bg-white px-8 pb-7 pt-3 shadow-2xl">
            <div className="mb-12 flex items-center justify-between text-[10px] font-semibold">
              <span>9:41</span>
              <span className="h-6 w-20 rounded-full bg-black" />
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-1 rounded-sm bg-black" />
                <span className="h-2.5 w-1 rounded-sm bg-black" />
                <span className="h-1.5 w-3 rounded-sm bg-black" />
              </span>
            </div>
            <div className="mb-9 text-center text-3xl font-medium">0</div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                ["1", ""],
                ["2", "A B C"],
                ["3", "D E F"],
                ["4", "G H I"],
                ["5", "J K L"],
                ["6", "M N O"],
                ["7", "P Q R S"],
                ["8", "T U V"],
                ["9", "W X Y Z"],
                ["*", ""],
                ["0", "+"],
                ["#", ""],
              ].map(([key, letters]) => (
                <span className="grid size-12 place-items-center rounded-full bg-slate-200 text-2xl leading-none" key={key}>
                  <span>
                    {key}
                    {letters ? <small className="block text-[5px] font-bold tracking-[0.22em]">{letters}</small> : null}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      {type === "calendar" ? (
        <div className="relative mx-auto min-h-[420px] max-w-[610px] text-slate-950">
          <div className="absolute left-0 top-[112px] w-[420px] rounded-lg bg-white p-5 shadow-xl">
            <p className="mb-7 flex items-center gap-4 text-sm font-medium">
              <span className="grid size-4 place-items-center rounded-sm border border-slate-400">
                <span className="h-px w-2 bg-slate-400" />
              </span>
              Book on the Calendar (Cal.com)
            </p>
            <div className="mb-3">
              <p className="mb-1 text-sm font-medium">Description</p>
              <div className="rounded-md border border-slate-200 px-3 py-2 text-sm leading-5 text-slate-700">
                When users ask for availability, check the calendar and provide available slots.
              </div>
            </div>
            {[
              ["API key (Cal.com)", "**********"],
              ["Event Type ID (Cal.com)", "042011"],
              ["Timezone", "America/Los_Angeles"],
            ].map(([label, value]) => (
              <div className="mb-3" key={label}>
                <p className="mb-1 text-sm font-medium">
                  {label}
                  {label === "Timezone" ? <span className="font-normal text-slate-500"> (Optional)</span> : null}
                </p>
                <div className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700">
                  {value}
                </div>
              </div>
            ))}
          </div>
          <div className="absolute right-0 top-[82px] z-20 rounded-lg bg-emerald-100 px-4 py-3 text-lg font-medium text-slate-950 shadow-sm">
            <span className="mr-3 inline-grid size-5 place-items-center rounded-full bg-emerald-500 text-xs text-white">
              &#10003;
            </span>
            A new event has been scheduled.
          </div>
          <div className="absolute right-6 top-[146px] z-10 rounded-xl bg-white p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-10">
              <button className="grid size-6 place-items-center rounded-md border border-slate-200 text-slate-400" type="button">
                &lsaquo;
              </button>
              <p className="text-sm font-semibold">November 2023</p>
              <button className="grid size-6 place-items-center rounded-md border border-slate-200 text-slate-400" type="button">
                &rsaquo;
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1.5 text-center text-sm">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <span className="grid size-7 place-items-center text-slate-500" key={day}>
                  {day}
                </span>
              ))}
              {["29", "30", "31", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "1", "2"].map((date, index) => (
                <span
                  className={`grid size-7 place-items-center rounded-md ${
                    index === 3 ? "bg-slate-950 text-white" : index < 3 || index > 32 ? "text-slate-300" : "text-slate-950"
                  }`}
                  key={`${date}-${index}`}
                >
                  {date}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function HealthcarePage() {
  return (
    <SiteLayout>
      <div className="healthcare-page min-h-screen bg-black text-slate-50">
        <section className="healthcare-hero-grid relative mx-auto min-h-[82vh] max-w-7xl items-center gap-12 px-6 pb-14 pt-32 lg:px-8">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
              <span className="size-2 rounded-full bg-[#35fbe0] shadow-[0_0_12px_rgba(53,251,224,0.8)]" />
              Built for modern healthcare teams
            </div>
            <h1 className="healthcare-hero-heading max-w-3xl font-semibold text-white">
              AI Voice Agents for{" "}
              <span className="healthcare-heading-accent block">
                Healthcare
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-slate-300 md:text-lg md:leading-8">
              Give patients a fast, natural way to schedule visits, get routine
              answers, and reach the right care team—without adding more pressure
              to your front desk.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                className="healthcare-demo-button inline-flex min-h-12 items-center rounded-lg border px-7 text-sm font-black transition hover:-translate-y-0.5"
                href="/#demo"
              >
                BOOK A FREE DEMO
              </Link>
              <Link
                className="inline-flex min-h-12 items-center rounded-lg border border-white/15 bg-white/[0.05] px-6 text-sm font-bold text-slate-50 shadow-sm transition hover:-translate-y-0.5 hover:bg-white/10"
                href="/#contact"
              >
                CONTACT SALES
              </Link>
            </div>
          </div>
          <div className="healthcare-hero-card relative overflow-hidden rounded-2xl border border-white/10 bg-[#07100d] shadow-[0_24px_70px_rgba(0,0,0,0.4)]">
            <div className="relative">
              <img
                alt="Healthcare voice agent assisting a patient call"
                className="healthcare-hero-image block w-full object-cover object-center"
                decoding="sync"
                loading="eager"
                src="/images/healthcare/voice-agent-hero.png"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(17,24,39,0.9)_100%)]" />
              <div className="absolute left-5 top-5 flex items-center gap-3 rounded-full border border-white/20 bg-black/80 px-4 py-2.5 backdrop-blur-md">
                <span className="size-2.5 rounded-full bg-[#35fbe0] shadow-[0_0_12px_#35fbe0]" />
                <span className="text-xs font-bold uppercase tracking-[0.12em]">Voice agent active</span>
              </div>
            </div>
          </div>
        </section>

        <section
          className="border-y border-white/[0.07] bg-black py-8"
          aria-label="Healthcare platforms"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 lg:px-8">
            <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
              Seamless connections across leading healthcare platforms
            </p>
            <div className="w-full overflow-hidden">
              <div className="healthcare-company-marquee flex w-max items-center gap-14 py-1">
                {[...healthcareCompanies, ...healthcareCompanies].map((company, index) => (
                  <span
                    aria-hidden={index >= healthcareCompanies.length}
                    className="shrink-0 text-xl font-bold tracking-[-0.02em] md:text-2xl"
                    key={`${company.name}-${index}`}
                    style={{ color: company.color }}
                  >
                    {company.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-black py-14" aria-label="Healthcare use cases">
          <div className="healthcare-marquee flex w-max gap-5">
            {[...photoCards, ...photoCards].map((card, index) => (
              <article
                aria-hidden={index >= photoCards.length}
                className="relative h-52 w-[380px] overflow-hidden rounded-xl border border-white/10 bg-slate-900 sm:h-56 sm:w-[430px]"
                key={`${card.title}-${index}`}
              >
                <img
                  alt={card.title}
                  className="absolute inset-0 size-full object-cover object-center"
                  loading="lazy"
                  src={card.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <h2 className="absolute bottom-5 left-5 text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">
                  {card.title}
                </h2>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-white/[0.06] bg-black">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <Pill>Reviews</Pill>
            <div className="mt-6 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-[-0.02em] md:text-4xl">
                Better conversations for patients and care teams
              </h2>
              <p className="max-w-lg text-base leading-7 text-slate-300">
                Designed to make routine calls easier while keeping your staff in
                control of sensitive and complex conversations.
              </p>
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {reviews.map((review, index) => (
                <article
                  className={`flex min-h-[275px] flex-col justify-between rounded-xl border p-6 transition duration-300 hover:-translate-y-1 ${
                    index === 0
                      ? "border-[#35fbe0]/25 bg-[#35fbe0]/[0.045]"
                      : index === 1
                        ? "border-[#8f83e8]/25 bg-[#8f83e8]/[0.045]"
                        : "border-[#ff9655]/25 bg-[#ff9655]/[0.045]"
                  }`}
                  key={review.name}
                >
                  <div>
                    <span className="inline-flex rounded-full bg-white/[0.07] px-3 py-1.5 text-xs font-bold text-white/75">{review.metric}</span>
                    <p className="mt-6 text-base font-medium leading-7 text-slate-100">&quot;{review.quote}&quot;</p>
                  </div>
                  <div className="mt-7 border-t border-white/10 pt-4">
                    <h3 className="font-bold text-white">{review.name}</h3>
                    <p className="mt-1 text-sm text-slate-400">{review.role}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="healthcare-features relative border-t border-white/[0.06] bg-black">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <Pill>Healthcare features</Pill>
          <h2 className="mt-6 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.02em] md:text-4xl">
            Support every patient call with a clear next step
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            Keep the same proven healthcare workflows, presented in a simpler and
            more visual way for patients, front desks, and care coordinators.
          </p>
          <div className="mt-12 grid gap-12">
            {workflowSections.map((section, index) => (
              <div
                className={`healthcare-feature-row items-center gap-10 lg:gap-14 ${
                  index % 2 === 0 ? "feature-content-left" : "feature-image-left"
                }`}
                key={section.title}
              >
                <WorkflowVisual image={section.image} type={section.visual} />
                <div>
                  <p
                    className={`text-xs font-bold uppercase tracking-[0.14em] ${
                      section.visual === "routing"
                        ? "text-[#75fff0]"
                        : section.visual === "ivr"
                          ? "text-[#ffb17e]"
                          : "text-[#c5bdff]"
                    }`}
                  >
                    {section.eyebrow}
                  </p>
                  <h3 className="mt-4 max-w-xl text-2xl font-semibold leading-snug md:text-3xl">
                    {section.title}
                  </h3>
                  <div className="mt-7 border-t border-white/10 pt-7">
                    <div className="grid gap-6">
                      {section.points.map((point) => (
                        <div className="flex gap-4" key={point.title}>
                          <CheckIcon />
                          <div>
                            <h4 className="text-base font-bold leading-snug">
                              {point.title}
                            </h4>
                            <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-300">
                              {point.body}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link
                    className={`mt-8 inline-flex min-h-11 items-center justify-center rounded-lg border px-6 text-sm font-bold transition ${
                      section.visual === "routing"
                        ? "border-[#35fbe0]/25 bg-[#35fbe0]/[0.06] text-[#75fff0] hover:bg-[#35fbe0]/10"
                        : section.visual === "ivr"
                          ? "border-[#ff9655]/25 bg-[#ff9655]/[0.06] text-[#ffb17e] hover:bg-[#ff9655]/10"
                          : "border-[#8f83e8]/25 bg-[#8f83e8]/[0.06] text-[#c5bdff] hover:bg-[#8f83e8]/10"
                    }`}
                    href="/#demo"
                  >
                    {section.button}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          </div>
        </section>

        <section className="healthcare-integrations overflow-hidden border-t border-white/[0.06] bg-black">
          <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-20 lg:px-8">
            <div className="grid gap-7 md:grid-cols-[minmax(0,1fr)_minmax(280px,0.65fr)] md:items-end">
              <div>
                <Pill>Integrations</Pill>
                <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.02em] md:text-4xl">
                  Your healthcare stack, connected
                </h2>
              </div>
              <p className="text-base leading-7 text-slate-300 md:pb-1">
                Link scheduling, patient management, and provider coordination tools
                while keeping every voice workflow secure and organized.
              </p>
            </div>

            <div className="mt-9 grid gap-3 md:grid-cols-3">
              {integrationHighlights.map((highlight) => (
                <article
                  className="rounded-xl border border-white/10 bg-white/[0.025] p-5"
                  key={highlight.title}
                >
                  <div className="flex items-center gap-3">
                    <span className={`grid size-9 place-items-center rounded-lg border text-[11px] font-extrabold ${highlight.accent}`}>
                      {highlight.icon}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                      {highlight.label}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">{highlight.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{highlight.body}</p>
                </article>
              ))}
            </div>

            <div className="healthcare-marquee-fade mt-9 overflow-hidden py-1">
              <div className="healthcare-integration-marquee flex w-max gap-4">
                {[...integrations, ...integrations].map((integration, index) => (
                  <div
                    aria-hidden={index >= integrations.length}
                    className="healthcare-integration-card flex h-20 w-60 shrink-0 items-center gap-3 rounded-xl border border-[#35fbe0]/20 bg-black/80 px-4 shadow-[0_12px_35px_rgba(0,0,0,0.18)] backdrop-blur-sm"
                    key={`${integration}-${index}`}
                  >
                    <span className="healthcare-integration-icon grid size-10 shrink-0 place-items-center rounded-lg bg-[#35fbe0]/10 text-xs font-extrabold uppercase text-[#75fff0]">
                      {integration.slice(0, 2)}
                    </span>
                    <strong className="text-base leading-tight text-slate-100">{integration}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-11 grid items-center gap-6 overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(115deg,rgba(53,251,224,0.12),rgba(143,131,232,0.08)_55%,rgba(255,150,85,0.09))] p-6 sm:p-8 md:grid-cols-[auto_1fr_auto]">
              <span className="grid size-12 place-items-center rounded-xl border border-[#35fbe0]/25 bg-black text-xl text-[#75fff0] shadow-[0_0_30px_rgba(53,251,224,0.12)]">
                &#8644;
              </span>
              <div>
                <h3 className="text-xl font-semibold leading-tight text-white">
                  Need help connecting your systems?
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Work with a certified partner for setup, migration, and workflow design.
                </p>
              </div>
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#35fbe0] px-6 text-sm font-extrabold text-[#031310] transition hover:-translate-y-0.5 hover:bg-[#75fff0]"
                href="/#contact"
              >
                Find a partner <span className="ml-2">&#8594;</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] bg-black">
          <div className="mx-auto max-w-6xl px-6 pb-0 pt-8 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <Pill>Pricing</Pill>
              <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.02em] md:text-4xl">
                Simple plans that scale with your calls
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-300">
                Start with usage-based pricing, then move to a tailored plan as your
                care team, call volume, and deployment needs grow.
              </p>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              <article className="relative overflow-hidden rounded-2xl border border-[#35fbe0]/25 bg-[#07100d] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-7">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#35fbe0] to-transparent" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#75fff0]">Start small</span>
                    <h3 className="mt-2 text-xl font-bold">Pay as you go</h3>
                  </div>
                  <span className="rounded-full border border-[#35fbe0]/20 bg-[#35fbe0]/10 px-3 py-1.5 text-xs font-bold text-[#75fff0]">
                    No setup fee
                  </span>
                </div>
                <div className="mt-5 flex items-end gap-2 border-b border-white/10 pb-5">
                  <strong className="text-3xl font-semibold tracking-[-0.04em] text-white">$0.07–$0.12</strong>
                  <span className="pb-1 text-sm text-slate-400">per minute</span>
                </div>
                <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-200">
                  {["$0 to start and pay only for usage.", "60 minutes of free access.", "20 concurrent calls.", "10 free Knowledge Bases."].map((item) => (
                    <li className="flex items-start gap-3" key={item}>
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#35fbe0]/15 text-xs text-[#75fff0]">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  className="mt-7 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-[#35fbe0]/30 bg-[#35fbe0]/10 text-sm font-bold text-[#75fff0] transition hover:bg-[#35fbe0]/15"
                  href="/#demo"
                >
                  Get started
                </Link>
              </article>

              <article className="relative overflow-hidden rounded-2xl border border-[#8f83e8]/30 bg-[radial-gradient(circle_at_95%_0%,rgba(143,131,232,0.22),transparent_42%),#0a0b0d] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-7">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8f83e8] to-transparent" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#c5bdff]">For growing teams</span>
                    <h3 className="mt-2 text-xl font-bold">Enterprise</h3>
                  </div>
                  <span className="rounded-full border border-[#ff9655]/25 bg-[#ff9655]/10 px-3 py-1.5 text-xs font-bold text-[#ffb17e]">
                    Custom plan
                  </span>
                </div>
                <div className="mt-5 border-b border-white/10 pb-5">
                  <strong className="text-3xl font-semibold tracking-[-0.04em] text-white">Let&apos;s talk</strong>
                  <p className="mt-1 text-sm text-slate-400">Built around your volume and deployment.</p>
                </div>
                <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-200">
                  {["White-glove setup for your use case.", "Dedicated solutions and premium support.", "Custom concurrency, pricing, and workflows.", "Deployment guidance for larger care teams."].map((item) => (
                    <li className="flex items-start gap-3" key={item}>
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#8f83e8]/15 text-xs text-[#c5bdff]">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  className="mt-7 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[linear-gradient(90deg,#35fbe0,#8f83e8)] text-sm font-extrabold text-[#031310] transition hover:brightness-110"
                  href="/#contact"
                >
                  Talk to sales
                </Link>
              </article>
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] bg-black">
          <div className="mx-auto max-w-4xl px-6 pb-20 pt-8 text-center lg:px-8">
          <div className="mx-auto max-w-2xl">
            <Pill>F.A.Q</Pill>
            <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.02em] md:text-4xl">Questions &amp; answers</h2>
            <p className="mt-3 text-slate-300">Practical answers for planning your healthcare voice agent.</p>
          </div>
          <div className="mt-7 grid gap-2 text-left">
            {faqs.map((faq) => (
              <details className="group rounded-xl border border-white/10 bg-black px-5 py-4 transition hover:bg-white/[0.02] open:border-[#35fbe0]/25 open:bg-[#35fbe0]/[0.025]" key={faq.question}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium">
                  {faq.question}
                  <span className="text-[#75fff0] transition group-open:rotate-180">&#8964;</span>
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                  {faq.answer}
                </p>
              </details>
            ))}
            <p className="mt-5 text-center text-sm text-slate-300">
              More questions? Visit our{" "}
              <Link className="rounded-md bg-black px-2 py-1 font-bold text-[#75fff0]" href="/#resources">
                docs
              </Link>
            </p>
          </div>
          </div>
        </section>

        <section className="bg-black px-6 pb-16 pt-4 lg:px-8">
          <div className="healthcare-contact mx-auto flex max-w-6xl flex-col items-center justify-between gap-7 overflow-hidden rounded-[24px] border border-[#35fbe0]/35 bg-[#07100d] p-8 text-center shadow-[0_24px_70px_rgba(53,251,224,0.08)] sm:p-10 md:flex-row md:text-left">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#75fff0]">Ready to get started?</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] md:text-3xl">Let&apos;s improve every patient call.</h2>
            </div>
            <Link
              className="inline-flex min-h-12 shrink-0 items-center rounded-lg bg-[#35fbe0] px-7 text-sm font-bold text-[#031310] transition hover:-translate-y-0.5 hover:bg-[#75fff0]"
              href="/#contact"
            >
              CONTACT US <span className="ml-3">&rarr;</span>
            </Link>
          </div>
        </section>

      </div>
      <style>{`
        .healthcare-page {
          background: #000;
        }

        .healthcare-hero-grid,
        .healthcare-feature-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
        }

        .healthcare-hero-heading {
          font-size: clamp(3.25rem, 5.6vw, 5.2rem);
          line-height: 0.98;
          letter-spacing: -0.05em;
        }

        .healthcare-heading-accent {
          color: #35fbe0;
        }

        .healthcare-demo-button {
          border-color: rgba(117, 255, 240, 0.5);
          background: #35fbe0;
          color: #031310;
          box-shadow: 0 14px 35px rgba(53, 251, 224, 0.2);
        }

        .healthcare-demo-button:hover {
          background: #75fff0;
        }

        .healthcare-hero-card {
          width: min(100%, 560px);
          justify-self: center;
          box-shadow:
            0 24px 70px rgba(0, 0, 0, 0.45),
            0 0 0 1px rgba(53, 251, 224, 0.08),
            22px -18px 80px rgba(143, 131, 232, 0.1);
        }

        .healthcare-hero-image {
          height: clamp(360px, 44vw, 440px);
        }

        .healthcare-features::before {
          content: none;
        }

        .healthcare-features > div {
          position: relative;
          z-index: 1;
        }

        .healthcare-integrations {
          background: #000;
        }

        .healthcare-marquee-fade {
          -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
          mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
        }

        @media (min-width: 1024px) {
          .healthcare-hero-grid {
            grid-template-columns: minmax(0, 1fr) minmax(380px, 0.82fr);
          }

          .healthcare-hero-card {
            justify-self: end;
          }

          .healthcare-feature-row {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .healthcare-feature-row.feature-content-left > :first-child {
            order: 2;
          }

          .healthcare-feature-row.feature-content-left > :nth-child(2) {
            order: 1;
          }
        }

        .healthcare-integration-card:nth-child(3n + 2) {
          border-color: rgba(143, 131, 232, 0.3);
        }

        .healthcare-integration-card:nth-child(3n + 2) .healthcare-integration-icon {
          background: rgba(143, 131, 232, 0.12);
          color: #c5bdff;
        }

        .healthcare-integration-card:nth-child(3n) {
          border-color: rgba(255, 150, 85, 0.28);
        }

        .healthcare-integration-card:nth-child(3n) .healthcare-integration-icon {
          background: rgba(255, 150, 85, 0.11);
          color: #ffb17e;
        }

        .healthcare-contact {
          background:
            radial-gradient(circle at 8% 0%, rgba(53, 251, 224, 0.22), transparent 38%),
            radial-gradient(circle at 92% 100%, rgba(72, 219, 139, 0.16), transparent 38%),
            #07100d;
        }

        @keyframes healthcare-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .healthcare-marquee {
          animation: healthcare-marquee 26s linear infinite;
          will-change: transform;
        }

        .healthcare-company-marquee {
          animation: healthcare-marquee 22s linear infinite;
        }

        .healthcare-integration-marquee {
          animation: healthcare-marquee 38s linear infinite;
        }

        .healthcare-marquee:hover,
        .healthcare-company-marquee:hover,
        .healthcare-integration-marquee:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .healthcare-marquee,
          .healthcare-company-marquee,
          .healthcare-integration-marquee {
            animation: none;
          }
        }
      `}</style>
    </SiteLayout>
  );
}
