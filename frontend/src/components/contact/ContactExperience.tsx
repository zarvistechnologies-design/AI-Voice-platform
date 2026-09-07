"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { API_URL } from "@/lib/apiBase";

const salesEmail = "hello@vozon.ai";

type IconName = "arrow" | "calendar" | "chat" | "clock" | "email" | "headset" | "phone" | "send" | "shield" | "team";

function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <path d="M4 10h12m-4.5-4.5L16 10l-4.5 4.5" />,
    calendar: <path d="M6 2v3m8-3v3M3.5 8h13M5 4h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />,
    chat: <path d="M4 4.5h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4.5 3v-3H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" />,
    clock: <path d="M10 2.5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15Zm0 3v4.7l3 1.8" />,
    email: <path d="M3 5.5h14a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 17 16.5H3A1.5 1.5 0 0 1 1.5 15V7A1.5 1.5 0 0 1 3 5.5Zm-.5 1 7.5 6 7.5-6" />,
    headset: <path d="M3 11v-1a7 7 0 0 1 14 0v1M3 11h2.5v5H4.8A1.8 1.8 0 0 1 3 14.2V11Zm14 0h-2.5v5H17v.5a1.5 1.5 0 0 1-1.5 1.5H12" />,
    phone: <path d="M5.2 2.5 8 6.1 6.3 8a12.2 12.2 0 0 0 5.7 5.7l1.9-1.7 3.6 2.8-.8 2.3c-.3.8-1.1 1.3-2 1.2C7.8 17.4 2.6 12.2 1.7 5.3c-.1-.9.4-1.7 1.2-2l2.3-.8Z" />,
    send: <path d="m2.5 9.2 15-6.7-5.8 15-2.2-6.9-7-1.4Zm7 1.4 8-8.1" />,
    shield: <path d="M10 2.2 16.5 5v4.2c0 4.1-2.8 7.2-6.5 8.6-3.7-1.4-6.5-4.5-6.5-8.6V5L10 2.2Z" />,
    team: <path d="M7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm6.5-1a2.5 2.5 0 1 0 0-5M1.8 17a5.2 5.2 0 0 1 10.4 0m1.3-5.3A4.6 4.6 0 0 1 18.2 16" />,
  };

  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 20 20">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6">
        {paths[name]}
      </g>
    </svg>
  );
}

const contactChannels = [
  {
    icon: "phone" as const,
    eyebrow: "Speak with our team",
    title: "Call us",
    body: "Talk directly with our team about your voice AI requirements and next steps.",
    href: "tel:+917892518414",
    action: "+91 78925 18414",
  },
  {
    icon: "email" as const,
    eyebrow: "Email our team",
    title: "Sales enquiries",
    body: "Tell us about your use case and the conversations you want to automate.",
    href: `mailto:${salesEmail}?subject=Sales%20enquiry`,
    action: salesEmail,
  },
  {
    icon: "calendar" as const,
    eyebrow: "Launch under your brand",
    title: "White-label partnerships",
    body: "Tell us about your customers, expected usage, and brand so our team can review the right partner setup.",
    href: "#contact-form",
    action: "Request partner review",
  },
  {
    icon: "headset" as const,
    eyebrow: "Already using vozon.ai?",
    title: "Product support",
    body: "Sign in to your workspace for help with an existing account or deployment.",
    href: "/login",
    action: "Go to your account",
  },
] as const;

const nextSteps = [
  {
    number: "01",
    title: "We learn about your calls",
    body: "We review your call volume, customer journey, languages, integrations, and success criteria.",
  },
  {
    number: "02",
    title: "We map a practical rollout",
    body: "Together, we define the first workflow, required guardrails, human handoffs, and launch plan.",
  },
  {
    number: "03",
    title: "You see the platform in action",
    body: "We tailor the conversation around your use case so your team can evaluate the right capabilities.",
  },
] as const;

export function ContactExperience() {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) return;

    const values = new FormData(form);
    const payload = {
      firstName: String(values.get("firstName") ?? "").trim(),
      lastName: String(values.get("lastName") ?? "").trim(),
      email: String(values.get("email") ?? "").trim(),
      phone: String(values.get("phone") ?? "").trim(),
      company: String(values.get("company") ?? "").trim(),
      inquiry: String(values.get("inquiry") ?? "").trim(),
      message: String(values.get("message") ?? "").trim(),
      website: String(values.get("website") ?? "").trim(),
    };

    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "We could not send your message. Please try again.");
      }

      form.reset();
      setStatus(result.message || "Thanks — your message has been sent to our sales team.");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : `We could not send your message. Please email ${salesEmail} directly.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div id="contact-page" className="overflow-hidden bg-white text-black">
      <section className="relative bg-white px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:min-h-screen lg:px-12 lg:pb-14 lg:pt-24">
        <div className="relative mx-auto max-w-[1240px]">
          <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-xs font-medium text-black lg:mb-5">
            <Link className="transition hover:text-black" href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-black">Contact</span>
          </nav>

          <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-start xl:gap-20">
            <div className="lg:sticky lg:top-32">
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-black">
                <span className="size-1.5 rounded-full bg-teal-500" aria-hidden="true" />
                Get in touch
              </span>

              <h1 className="mt-7 text-[clamp(3rem,6.2vw,5.65rem)] font-medium leading-[0.96] tracking-[-0.058em]">
                Let&apos;s start a{" "}
                <span className="text-black">
                  conversation.
                </span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-black sm:text-lg sm:leading-8">
                Tell us about your voice AI goals or plans to offer the platform under your own brand. We&apos;ll help you understand the right workflow, integrations, and rollout.
              </p>

              <div className="mt-8 flex flex-wrap gap-2.5">
                {[
                  ["clock", "Fast response"],
                  ["shield", "Secure by design"],
                  ["team", "Dedicated guidance"],
                ].map(([icon, label]) => (
                  <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-black shadow-sm" key={label}>
                    <Icon className="size-4 text-teal-600" name={icon as IconName} />
                    {label}
                  </span>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link className="contact-primary-button inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-6 text-sm font-bold shadow-sm transition hover:-translate-y-0.5" href="#contact-form">
                  Send a message <Icon className="size-4" name="arrow" />
                </Link>
                <a className="contact-secondary-button inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-6 text-sm font-bold shadow-sm transition" href={`mailto:${salesEmail}`}>
                  <Icon className="size-4" name="email" /> Email sales
                </a>
              </div>
            </div>

            <form aria-busy={isSubmitting} className="scroll-mt-24 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_28px_80px_rgba(15,23,42,0.10)] sm:p-7 lg:translate-x-8 lg:p-6 xl:translate-x-12" id="contact-form" onSubmit={handleSubmit}>
              <div className="mb-6 flex items-center gap-4 border-b border-slate-200 pb-5 lg:mb-5 lg:pb-4">
                <span className="grid size-13 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-black shadow-[0_12px_30px_rgba(13,148,136,0.2)] lg:size-11 lg:rounded-xl">
                  <Icon className="size-6" name="send" />
                </span>
                <div>
                  <h2 className="text-xl font-semibold tracking-[-0.025em] sm:text-2xl">Send us a message</h2>
                  <p className="mt-1 text-sm text-black">We&apos;ll reply as soon as possible.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:gap-3">
                <label className="grid gap-2 text-sm font-semibold text-black lg:gap-1.5">
                  First name <span className="sr-only">(required)</span>
                  <input className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 font-normal text-black placeholder:text-black/50 focus:border-teal-500 focus:bg-teal-50/30 lg:min-h-11" name="firstName" placeholder="First name" required />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-black lg:gap-1.5">
                  Last name <span className="sr-only">(required)</span>
                  <input className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 font-normal text-black placeholder:text-black/50 focus:border-teal-500 focus:bg-teal-50/30 lg:min-h-11" name="lastName" placeholder="Last name" required />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-black lg:gap-1.5">
                  Work email <span className="sr-only">(required)</span>
                  <input autoComplete="email" className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 font-normal text-black placeholder:text-black/50 focus:border-teal-500 focus:bg-teal-50/30 lg:min-h-11" name="email" placeholder="you@company.com" required type="email" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-black lg:gap-1.5">
                  Phone number <span className="font-normal text-black">(optional)</span>
                  <input
                    autoComplete="tel"
                    className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 font-normal text-black placeholder:text-black/50 focus:border-teal-500 focus:bg-teal-50/30 lg:min-h-11"
                    inputMode="numeric"
                    maxLength={15}
                    minLength={10}
                    name="phone"
                    onInput={(event) => {
                      event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "");
                    }}
                    pattern="[0-9]{10,15}"
                    placeholder="9876543210"
                    title="Enter a phone number containing 10 to 15 digits"
                    type="tel"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-black lg:gap-1.5">
                  Company <span className="sr-only">(required)</span>
                  <input autoComplete="organization" className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 font-normal text-black placeholder:text-black/50 focus:border-teal-500 focus:bg-teal-50/30 lg:min-h-11" name="company" placeholder="Your company" required />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-black lg:gap-1.5">
                  Inquiry type <span className="sr-only">(required)</span>
                  <select className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 font-normal text-black focus:border-teal-500 lg:min-h-11" defaultValue="" name="inquiry" required>
                    <option disabled value="">Select an option</option>
                    <option>Product demo</option>
                    <option>Enterprise rollout</option>
                    <option>Pricing and plans</option>
                    <option>White-label partnership</option>
                    <option>Partnership</option>
                    <option>Other</option>
                  </select>
                </label>
              </div>

              <label className="mt-4 grid gap-2 text-sm font-semibold text-black lg:mt-3 lg:gap-1.5">
                Message <span className="sr-only">(required)</span>
                <textarea className="min-h-32 resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal leading-6 text-black placeholder:text-black/50 focus:border-teal-500 focus:bg-teal-50/30 lg:min-h-24" name="message" placeholder="Tell us about your team, use case, expected customers or call volume, and what you would like to achieve..." required />
              </label>

              <label aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
                Website
                <input autoComplete="off" name="website" tabIndex={-1} />
              </label>

              <button className="contact-submit-button mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border px-6 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-65 disabled:hover:translate-y-0 lg:mt-4 lg:min-h-11" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Sending message..." : "Send message"}
                {!isSubmitting ? <Icon className="size-4" name="arrow" /> : null}
              </button>
              <p className="mt-4 text-center text-xs leading-5 text-black">
                Your message will be sent securely to {salesEmail}. By continuing, you agree to our{" "}
                <Link className="font-medium text-black hover:underline" href="/resources/trust-center">privacy practices</Link>.
              </p>
              <p aria-live="polite" className="mt-2 min-h-5 text-center text-xs font-medium text-black">
                {status}
              </p>
            </form>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.17em] text-black">
              <Icon className="size-4" name="chat" /> Multiple ways to reach us
            </span>
            <h2 className="mt-6 text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[1.02] tracking-[-0.05em]">Choose the right channel.</h2>
            <p className="mt-5 text-base leading-7 text-black sm:text-lg">Whether you&apos;re exploring voice AI or already building with vozon.ai, we&apos;ll point you to the right next step.</p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {contactChannels.map((channel) => (
              <a className="group flex min-h-72 flex-col rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-8" href={channel.href} key={channel.title}>
                <span className="grid size-13 place-items-center rounded-2xl bg-teal-50 text-black ring-1 ring-inset ring-teal-200 transition group-hover:bg-teal-500 group-hover:text-black">
                  <Icon className="size-6" name={channel.icon} />
                </span>
                <span className="mt-8 text-[10px] font-bold uppercase tracking-[0.16em] text-black">{channel.eyebrow}</span>
                <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em]">{channel.title}</h3>
                <p className="mt-3 text-sm leading-6 text-black">{channel.body}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-black transition group-hover:text-black">
                  {channel.action} <Icon className="size-4 transition group-hover:translate-x-1" name="arrow" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-black">What happens next</p>
              <h2 className="mt-5 text-[clamp(2.25rem,4.6vw,3.8rem)] font-medium leading-[1.02] tracking-[-0.05em]">From first message to a clear plan.</h2>
            </div>
            <div className="grid gap-4">
              {nextSteps.map((step) => (
                <article className="grid gap-4 rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-[52px_1fr] sm:items-start sm:p-7" key={step.number}>
                  <span className="grid size-11 place-items-center rounded-xl border border-teal-200 bg-teal-50 text-xs font-bold text-black">{step.number}</span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-[-0.02em]">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-black">{step.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        #contact-page .contact-primary-button {
          border-color: #6268ff !important;
          background: #6268ff !important;
          color: #fff !important;
          -webkit-text-fill-color: #fff !important;
        }

        #contact-page .contact-primary-button:hover {
          border-color: #565dcc !important;
          background: #565dcc !important;
        }

        #contact-page .contact-secondary-button {
          border-color: #d7c8e8 !important;
          background: #f1e9fa !important;
          color: #6d3b8d !important;
          -webkit-text-fill-color: #6d3b8d !important;
        }

        #contact-page .contact-secondary-button:hover {
          border-color: #b99dce !important;
          background: #e9ddf4 !important;
        }

        #contact-page .contact-submit-button {
          border-color: #7a3e9d !important;
          background: #7a3e9d !important;
          color: #fff !important;
          -webkit-text-fill-color: #fff !important;
        }

        #contact-page .contact-submit-button:hover {
          border-color: #683486 !important;
          background: #683486 !important;
        }

        #contact-page .contact-primary-button *,
        #contact-page .contact-submit-button * {
          color: #fff !important;
          -webkit-text-fill-color: #fff !important;
        }
      `}</style>
    </div>
  );
}
