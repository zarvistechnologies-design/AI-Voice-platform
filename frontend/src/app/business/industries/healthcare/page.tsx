import Link from "next/link";

import { SiteLayout } from "@/components/layout/SiteLayout";

export const metadata = {
  title: "AI Phone Agents for Healthcare | AI Voice Platform",
  description:
    "AI phone agents for healthcare calls, routing, IVR navigation, appointment booking, EHR integrations, pricing, and FAQs.",
};

const logos = [
  "CAPSULE",
  "doxy.me",
  "rely.",
  "gifthealth",
  "vivian",
  "ANALYTE HEALTH",
  "PINE PARK HEALTH",
  "sword",
  "waymark",
];

const photoCards = [
  {
    title: "Healthcare Frontdesk",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Healthcare Back Office",
    image:
      "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Patient Management",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Appointment Support",
    image:
      "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?auto=format&fit=crop&w=900&q=80",
  },
];

const reviewBenefits = [
  {
    title: "Faster Patient Front Desk",
    body: "Patients can ask appointment, intake, and follow-up questions without waiting through rigid phone menus.",
  },
  {
    title: "HIPAA-Conscious Call Handling",
    body: "Healthcare calls stay focused on approved workflows, secure summaries, and careful routing for sensitive patient details.",
  },
  {
    title: "Care Team Handoffs",
    body: "Complex requests move to clinic staff with patient context, appointment notes, and the next step already organized.",
  },
];

const workflowSections = [
  {
    eyebrow: "Call Routing",
    title: "Seamless Routing To The Right Department",
    button: "Check Call Transfer Feature",
    visual: "routing",
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
    title: "AI Agent Navigates IVR To Retrieve Clinic Information",
    button: "Check Navigate IVR Feature",
    visual: "ivr",
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
    title:
      "Reliable And Efficient AI Agent For Patient Support - Including HIPAA-Compliant For Appointment Reminders",
    button: "Check Appointment Booking Feature",
    visual: "calendar",
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

const faqs = [
  "What is a Voice AI Agent, and how does it improve healthcare call management?",
  "How do voice AI agents compare to traditional IVR systems in healthcare?",
  "Can voice AI agents support HIPAA-conscious patient workflows?",
  "Can AI-powered voice agents handle patient appointment scheduling and follow-ups?",
  "How do voice AI agents integrate with EHR systems like Epic and OpenDental?",
];

function CheckIcon() {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-dashed border-[#00ADB5] bg-[#00ADB5]/10 text-sm font-bold text-[#00ADB5]">
      &#10003;
    </span>
  );
}

function Pill({ children }: { children: string }) {
  return (
    <span className="inline-flex rounded-full border border-[#00ADB5]/30 bg-[#00ADB5]/10 px-4 py-2 text-sm font-medium text-[#00ADB5] shadow-sm">
      {children}
    </span>
  );
}

function WorkflowVisual({ type }: { type: string }) {
  const visualBackground =
    type === "routing"
      ? "bg-[radial-gradient(circle_at_22%_18%,#ccfbf1_0,#5eead4_24%,transparent_42%),radial-gradient(circle_at_82%_26%,#00ADB5_0,#0f766e_32%,transparent_56%),linear-gradient(135deg,#111827,#1f2937_45%,#00ADB5)]"
      : type === "ivr"
        ? "bg-[radial-gradient(circle_at_22%_18%,#ccfbf1_0,#5eead4_24%,transparent_42%),radial-gradient(circle_at_82%_26%,#00ADB5_0,#0f766e_32%,transparent_56%),linear-gradient(135deg,#111827,#1f2937_45%,#00ADB5)]"
        : "bg-[radial-gradient(circle_at_22%_18%,#ccfbf1_0,#5eead4_24%,transparent_42%),radial-gradient(circle_at_82%_26%,#00ADB5_0,#0f766e_32%,transparent_56%),linear-gradient(135deg,#111827,#1f2937_45%,#00ADB5)]";

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
            <span className="grid size-10 shrink-0 place-items-center rounded-md bg-cyan-100 text-lg font-bold text-[#00ADB5]">
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
      <div className="min-h-screen bg-[linear-gradient(180deg,#111827_0%,#1f2937_48%,#111827_100%)] text-slate-50">
        <section className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-16 px-6 pb-20 pt-32 lg:grid-cols-[0.95fr_1fr] lg:px-8">
          <div>
            <div className="mb-7 text-sm font-medium text-slate-400">
              5/5 in G2 <span className="ml-2 text-[#00ADB5]">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            </div>
            <h1 className="max-w-3xl text-5xl font-light leading-tight tracking-normal text-white md:text-6xl">
              AI Phone Agents for{" "}
              <span className="bg-gradient-to-r from-[#00ADB5] via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                Healthcare
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">
              Streamline customer calls with fast, context-rich, and personalized
              AI-powered call transfer options built with HIPAA compliant AI to
              ensure patient data security.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                className="inline-flex min-h-12 items-center rounded-lg bg-[#00ADB5] px-6 text-sm font-bold text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:bg-cyan-300"
                href="/#demo"
              >
                TRY FOR FREE
              </Link>
              <Link
                className="inline-flex min-h-12 items-center rounded-lg border border-[#374151] bg-[#1f2937] px-6 text-sm font-bold text-slate-50 shadow-sm transition hover:-translate-y-0.5 hover:bg-[#374151]"
                href="/#contact"
              >
                CONTACT SALES
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-x-8 gap-y-12 text-center text-2xl font-bold text-slate-400 lg:pl-10">
            {logos.map((logo) => (
              <span className="opacity-80" key={logo}>
                {logo}
              </span>
            ))}
          </div>
        </section>

        <section className="overflow-hidden bg-[#111827] pb-28" aria-label="Healthcare use cases">
          <div className="healthcare-marquee flex w-max gap-8">
            {[...photoCards, ...photoCards].map((card, index) => (
              <article
                className="relative h-72 w-[560px] overflow-hidden rounded-lg bg-slate-200"
                key={`${card.title}-${index}`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${card.image})` }}
                />
                <div className="absolute inset-0 bg-blue-950/10" />
                <h2 className="absolute bottom-10 left-10 text-5xl font-light text-white">
                  {card.title}
                </h2>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#1f2937]">
          <div className="mx-auto grid max-w-7xl items-stretch gap-10 px-6 py-24 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:px-8">
          <div>
            <Pill>Reviews</Pill>
            <h2 className="mt-6 max-w-[11ch] text-5xl font-light leading-tight md:text-6xl">
              See What Customers
              <br />
              Say About Us
            </h2>
            <div className="mt-16 grid gap-9">
              {reviewBenefits.map((benefit) => (
                <div className="flex gap-6" key={benefit.title}>
                  <CheckIcon />
                  <div>
                    <h3 className="text-2xl font-bold">{benefit.title}</h3>
                    <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">
                      {benefit.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid w-full max-w-[760px] auto-rows-fr gap-7 self-center justify-self-end sm:grid-cols-2">
            <article className="flex aspect-square h-full flex-col justify-between rounded-lg bg-[#00ADB5] p-8 text-slate-950 lg:p-9">
              <p className="text-xl font-medium leading-8 md:text-[1.35rem] md:leading-9">
                &quot;Our numbers show that 45-50% of calls are completely resolved by
                the voice agent without ever touching a human.&quot;
              </p>
              <div className="border-t border-slate-950/20 pt-6">
                <h3 className="text-xl font-bold md:text-2xl">Dr. Maya Patel</h3>
                <p className="mt-1 text-slate-800">Senior Engineer, GiftHealth</p>
              </div>
            </article>
            <article className="flex aspect-square h-full flex-col justify-between rounded-lg border border-dashed border-[#374151] bg-[#111827] p-8 lg:p-9">
              <p className="text-xl font-medium leading-8 md:text-[1.35rem] md:leading-9">
                &quot;The voice agent became our first point of contact for free users,
                significantly relieving our customer service workload.&quot;
              </p>
              <div className="border-t border-[#374151] pt-6">
                <h3 className="text-xl font-bold md:text-2xl">Sofia Reynolds</h3>
                <p className="mt-1 text-slate-300">Product Manager at Doxy.me</p>
              </div>
            </article>
          </div>
          </div>
        </section>

        <section className="bg-[#111827]">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <h2 className="max-w-5xl text-5xl font-light leading-tight md:text-6xl">
            Enhance Patient Service And Offload Tasks With AI Phone Agents.
          </h2>
          <div className="mt-20 grid gap-24">
            {workflowSections.map((section) => (
              <div
                className={`grid items-center gap-14 lg:grid-cols-2 ${
                  section.reverse ? "lg:[&>*:first-child]:order-2" : ""
                }`}
                key={section.title}
              >
                <WorkflowVisual type={section.visual} />
                <div>
                  <p className="text-sm font-bold text-[#00ADB5]">{section.eyebrow}</p>
                  <h3 className="mt-4 max-w-xl text-3xl font-medium leading-snug">
                    {section.title}
                  </h3>
                  <div className="mt-8 border-t border-[#374151] pt-8">
                    <div className="grid gap-9">
                      {section.points.map((point) => (
                        <div className="flex gap-6" key={point.title}>
                          <CheckIcon />
                          <div>
                            <h4 className="text-2xl font-bold leading-snug">
                              {point.title}
                            </h4>
                            <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">
                              {point.body}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link
                    className="mt-10 inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-[#374151] bg-[#1f2937] px-6 text-sm font-bold text-[#00ADB5] shadow-sm hover:bg-[#374151]"
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

        <section className="bg-[#1f2937]">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <Pill>Integrations</Pill>
          <h2 className="mt-6 text-5xl font-light leading-tight md:text-6xl">Integrate With Your EHR</h2>
          <p className="mt-6 max-w-6xl text-lg leading-8 text-slate-300">
            Seamless AI automation for patient scheduling, management, and provider
            coordination powered by HIPAA compliant AI to protect sensitive data
            across every interaction.
          </p>
          <div className="mt-16 overflow-hidden">
            <div className="healthcare-integration-marquee flex w-max gap-5">
              {[...integrations, ...integrations].map((integration, index) => (
                <div
                  className="flex min-h-24 w-72 shrink-0 items-center gap-4 rounded-xl border border-[#374151] bg-[#111827] px-6 shadow-sm"
                  key={`${integration}-${index}`}
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-[#1f2937] text-sm font-bold text-[#00ADB5] shadow-sm">
                    {integration.slice(0, 2)}
                  </span>
                  <strong className="text-2xl leading-tight">{integration}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-20 rounded-2xl border border-[#374151] bg-[#111827] p-10">
            <h3 className="max-w-xl text-3xl font-bold leading-tight">
              Don&apos;t have developer resources? Find a certified partner to help.
            </h3>
            <Link
              className="mt-8 inline-flex min-h-14 items-center rounded-lg bg-[#00ADB5] px-8 text-sm font-bold tracking-[0.2em] text-slate-950 hover:bg-cyan-300"
              href="/#contact"
            >
              FIND A PARTNER
            </Link>
          </div>
          </div>
        </section>

        <section className="bg-[#111827]">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <Pill>Pricing</Pill>
          <h2 className="mt-6 text-5xl font-light leading-tight md:text-6xl">
            Cut Costs By 90% With AI Phone Agents
          </h2>
          <p className="mt-6 max-w-5xl text-base leading-7 text-slate-300">
            Scalable AI phone agents at a fraction of the cost, without compromising
            quality. Freeing your medical staff for higher-value tasks, while
            replacing outdated workflows with modern HIPAA compliant AI tools.
          </p>
          <div className="mt-28 grid gap-8 rounded-[28px] border border-[#374151] bg-[#1f2937] p-8 lg:grid-cols-2">
            <article className="p-8">
              <h3 className="mt-10 text-2xl font-bold">Pay as you go</h3>
              <p className="mt-4 text-slate-300">$0 to start.</p>
              <ul className="mt-12 grid gap-6 text-lg">
                {[
                  "$0.07-$0.12 per minute - Pay only for what you use.",
                  "60 mins of free access.",
                  "20 concurrent calls.",
                  "10 Free Knowledge Bases.",
                ].map((item) => (
                  <li className="flex gap-4" key={item}>
                    <span className="grid size-5 place-items-center rounded-full bg-[#00ADB5] text-xs text-slate-950">
                      &#10003;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                className="mt-12 inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-[#374151] bg-[#111827] text-sm font-bold text-[#00ADB5] hover:bg-[#374151]"
                href="/#demo"
              >
                Get Started
              </Link>
            </article>
            <article className="rounded-xl bg-[#00ADB5] p-10 text-slate-950">
              <div className="grid size-12 place-items-center rounded-lg bg-slate-950 text-[#00ADB5]">
                $
              </div>
              <h3 className="mt-8 text-2xl font-medium">Enterprise Plan</h3>
              <p className="mt-3 max-w-md leading-7 text-slate-800">
                For companies with large volumes, data or deployment requirements,
                or support needs.
              </p>
              <ul className="mt-10 grid gap-7 font-medium leading-7">
                {[
                  "White glove service for your use case.",
                  "Premium support with dedicated solution engineer teams.",
                  "Custom pricing and concurrent calls based on your needs",
                ].map((item) => (
                  <li className="flex gap-4" key={item}>
                    <span className="grid size-5 place-items-center rounded-full bg-slate-950 text-xs text-[#00ADB5]">
                      &#10003;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                className="mt-12 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white"
                href="/#contact"
              >
                Talk To Sales
              </Link>
            </article>
          </div>
          </div>
        </section>

        <section className="bg-[#1f2937]">
          <div className="mx-auto grid max-w-7xl gap-16 px-6 py-28 lg:grid-cols-[0.8fr_1fr] lg:px-8">
          <div>
            <Pill>F.A.Q</Pill>
            <h2 className="mt-6 text-5xl font-light leading-tight md:text-6xl">Questions & Answers</h2>
            <p className="mt-6 text-slate-300">All account has a 60-minutes ($10) free trial.</p>
          </div>
          <div className="grid gap-2">
            {faqs.map((faq) => (
              <details className="group rounded-xl border border-[#374151] bg-[#111827] p-6" key={faq}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium">
                  {faq}
                  <span className="text-[#00ADB5] transition group-open:rotate-180">&#8964;</span>
                </summary>
                <p className="mt-4 leading-7 text-slate-300">
                  AI Voice Platform can automate routine healthcare calls, collect
                  context, and hand off complex requests to your team with clear
                  summaries and routing rules.
                </p>
              </details>
            ))}
            <p className="mt-5 text-sm text-slate-300">
              More questions? Visit our{" "}
              <Link className="rounded-md bg-[#111827] px-2 py-1 font-bold text-[#00ADB5]" href="/#resources">
                docs
              </Link>
            </p>
          </div>
          </div>
        </section>

      </div>
      <style>{`
        @keyframes healthcare-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .healthcare-marquee {
          animation: healthcare-marquee 30s linear infinite;
        }

        .healthcare-integration-marquee {
          animation: healthcare-marquee 38s linear infinite;
        }
      `}</style>
    </SiteLayout>
  );
}
