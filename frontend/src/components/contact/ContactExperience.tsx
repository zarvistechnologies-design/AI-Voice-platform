"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

import { API_URL } from "@/lib/apiBase";
import "@/app/business/industries/healthcare/healthcare.css";
import "@/components/company/CompanyEditorial.css";

const salesEmail = "hello@vozon.ai";
const officeLocations = [
  { name: "Bengaluru", label: "Head office", address: "Behind Manyata Tech Park, Hebbal, Bangalore 560077." },
  { name: "Lucknow", label: "India office", address: "Experion, V296+9MM, AV 7, Vibhuti Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010." },
  { name: "Ada, Michigan", label: "United States office", address: "300 Quail Ridge Dr NE, Ada, MI 49301, United States." },
] as const;

type IconName =
| "arrow"
| "calendar"
| "chat"
| "clock"
| "email"
| "headset"
| "location"
| "phone"
| "send"
| "shield"
| "team";

function Icon({
name,
className = "size-5",
}: {
name: IconName;
className?: string;
}) {
const paths: Record<IconName, React.ReactNode> = {
arrow: ( <path d="M4 10h12m-4.5-4.5L16 10l-4.5 4.5" />
),
calendar: ( <path d="M6 2v3m8-3v3M3.5 8h13M5 4h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
),
chat: ( <path d="M4 4.5h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4.5 3v-3H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" />
),
clock: ( <path d="M10 2.5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15Zm0 3v4.7l3 1.8" />
),
email: ( <path d="M3 5.5h14a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 17 16.5H3A1.5 1.5 0 0 1 1.5 15V7A1.5 1.5 0 0 1 3 5.5Zm-.5 1 7.5 6 7.5-6" />
),
headset: ( <path d="M3 11v-1a7 7 0 0 1 14 0v1M3 11h2.5v5H4.8A1.8 1.8 0 0 1 3 14.2V11Zm14 0h-2.5v5H17v.5a1.5 1.5 0 0 1-1.5 1.5H12" />
),
location: ( <path d="M16.5 8.5c0 4.8-6.5 9.2-6.5 9.2S3.5 13.3 3.5 8.5a6.5 6.5 0 1 1 13 0ZM10 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
),
phone: ( <path d="M5.2 2.5 8 6.1 6.3 8a12.2 12.2 0 0 0 5.7 5.7l1.9-1.7 3.6 2.8-.8 2.3c-.3.8-1.1 1.3-2 1.2C7.8 17.4 2.6 12.2 1.7 5.3c-.1-.9.4-1.7 1.2-2l2.3-.8Z" />
),
send: ( <path d="m2.5 9.2 15-6.7-5.8 15-2.2-6.9-7-1.4Zm7 1.4 8-8.1" />
),
shield: ( <path d="M10 2.2 16.5 5v4.2c0 4.1-2.8 7.2-6.5 8.6-3.7-1.4-6.5-4.5-6.5-8.6V5L10 2.2Z" />
),
team: ( <path d="M7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm6.5-1a2.5 2.5 0 1 0 0-5M1.8 17a5.2 5.2 0 0 1 10.4 0m1.3-5.3A4.6 4.6 0 0 1 18.2 16" />
),
};

return ( <svg
   aria-hidden="true"
   className={className}
   fill="none"
   viewBox="0 0 20 20"
 > <g
     stroke="currentColor"
     strokeLinecap="round"
     strokeLinejoin="round"
     strokeWidth="1.6"
   >
{paths[name]} </g> </svg>
);
}

export function ContactExperience() {
const [status, setStatus] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);
const phoneInputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
const suppliedPhone = new URLSearchParams(window.location.search).get(
"phone",
);


if (suppliedPhone && phoneInputRef.current) {
  phoneInputRef.current.value = suppliedPhone
    .replace(/\D/g, "")
    .slice(0, 15);
}

}, []);

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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json().catch(() => ({}))) as {
    message?: string;
  };

  if (!response.ok) {
    throw new Error(
      result.message ||
        "We could not send your message. Please try again.",
    );
  }

  form.reset();

  setStatus(
    result.message ||
      "Thanks - your message has been sent to our sales team.",
  );
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

const contactForm = (
        <form
          aria-busy={isSubmitting}
          className="contact-page-form scroll-mt-24 rounded-xl border border-[#dedfe2] bg-white p-5 shadow-[0_20px_55px_rgba(23,23,25,0.07)] sm:p-7 lg:p-8"
          id="contact-form"
          onSubmit={handleSubmit}
        >
          <div className="mb-6 flex items-center gap-4 border-b border-slate-200 pb-5 lg:mb-5 lg:pb-4">
            <span className="grid size-13 shrink-0 place-items-center rounded-2xl border border-[#dedfe2] bg-[#f1f1f2] shadow-sm lg:size-11 lg:rounded-xl">
              <Icon className="size-6 text-[#171719]" name="send" />
            </span>

            <div>
              <h2 className="text-xl font-semibold tracking-[-0.025em] sm:text-2xl">
                Send us a message
              </h2>

              <p className="mt-1 text-sm text-black">
                We&apos;ll reply as soon as possible.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:gap-3">
            <label className="grid gap-2 text-sm font-semibold text-black lg:gap-1.5">
              <span>
                First name{" "}
                <span aria-hidden="true" className="text-[#6b6e73]">
                  *
                </span>
                <span className="sr-only"> (required)</span>
              </span>

              <input
                className="contact-form-field min-h-12 rounded-xl border px-4 font-normal text-black placeholder:text-slate-400 focus:outline-none lg:min-h-11"
                name="firstName"
                placeholder="First name"
                required
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-black lg:gap-1.5">
              <span>
                Last name{" "}
                <span aria-hidden="true" className="text-[#6b6e73]">
                  *
                </span>
                <span className="sr-only"> (required)</span>
              </span>

              <input
                className="contact-form-field min-h-12 rounded-xl border px-4 font-normal text-black placeholder:text-slate-400 focus:outline-none lg:min-h-11"
                name="lastName"
                placeholder="Last name"
                required
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-black lg:gap-1.5">
              <span>
                Work email{" "}
                <span aria-hidden="true" className="text-[#6b6e73]">
                  *
                </span>
                <span className="sr-only"> (required)</span>
              </span>

              <input
                autoComplete="email"
                className="contact-form-field min-h-12 rounded-xl border px-4 font-normal text-black placeholder:text-slate-400 focus:outline-none lg:min-h-11"
                name="email"
                placeholder="you@company.com"
                required
                type="email"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-black lg:gap-1.5">
              Phone number{" "}

              <input
                autoComplete="tel"
                className="contact-form-field min-h-12 rounded-xl border px-4 font-normal text-black placeholder:text-slate-400 focus:outline-none lg:min-h-11"
                inputMode="numeric"
                maxLength={15}
                minLength={10}
                name="phone"
                onInput={(event) => {
                  event.currentTarget.value =
                    event.currentTarget.value.replace(/\D/g, "");
                }}
                pattern="[0-9]{10,15}"
                placeholder="9876543210"
                title="Enter a phone number containing 10 to 15 digits"
                type="tel"
                ref={phoneInputRef}
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-black lg:gap-1.5">
              <span>
                Company{" "}
                <span aria-hidden="true" className="text-[#6b6e73]">
                  *
                </span>
                <span className="sr-only"> (required)</span>
              </span>

              <input
                autoComplete="organization"
                className="contact-form-field min-h-12 rounded-xl border px-4 font-normal text-black placeholder:text-slate-400 focus:outline-none lg:min-h-11"
                name="company"
                placeholder="Your company"
                required
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-black lg:gap-1.5">
              <span>
                Inquiry type{" "}
                <span aria-hidden="true" className="text-[#6b6e73]">
                  *
                </span>
                <span className="sr-only"> (required)</span>
              </span>

              <select
                className="contact-form-field min-h-12 rounded-xl border px-4 font-normal text-black focus:outline-none lg:min-h-11"
                defaultValue=""
                name="inquiry"
                required
              >
                <option disabled value="">
                  Select an option
                </option>

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
            <span>
              Message{" "}
              <span aria-hidden="true" className="text-[#6b6e73]">
                *
              </span>
              <span className="sr-only"> (required)</span>
            </span>

            <textarea
              className="contact-form-field min-h-32 resize-y rounded-xl border px-4 py-3 font-normal leading-6 text-black placeholder:text-slate-400 focus:outline-none lg:min-h-24"
              name="message"
              placeholder="Tell us about your needs..."
              required
            />
          </label>

          <label
            aria-hidden="true"
            className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
          >
            Website

            <input
              autoComplete="off"
              name="website"
              tabIndex={-1}
            />
          </label>

          <button
            className="contact-submit-button mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl border px-6 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-65 disabled:hover:translate-y-0 lg:mt-4 lg:min-h-11"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Sending message..." : "Send message"}
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-black">
            Your message will be sent securely to {salesEmail}. By
            continuing, you agree to our{" "}
            <Link
              className="font-medium text-black hover:underline"
              href="/resources/trust-center"
            >
              privacy practices
            </Link>
            .
          </p>

          <p
            aria-live="polite"
            className="mt-2 min-h-5 text-center text-xs font-medium text-black"
          >
            {status}
          </p>
        </form>
  );

return (
  <div id="contact-page" className="cmp-page contact-page-v2">
    <section className="contact-hero-section">
      <div className="contact-page-shell">
        <nav aria-label="Breadcrumb" className="contact-breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">/</span><span>Contact</span>
        </nav>
        <div className="contact-hero-grid">
          <div className="contact-intro">
            <span className="contact-eyebrow"><Icon name="phone" /> Contact us</span>
            <h1><span>Get In Touch</span><br />With Our Team</h1>
            <p>Fill out the form below and our team will get back to you within 1-2 business days.</p>
            <div className="contact-info-grid">
              <a className="contact-info-card" href="https://maps.google.com/?q=Manyata+Tech+Park+Bengaluru" target="_blank" rel="noreferrer">
                <span><Icon name="location" /></span><strong>Head Office</strong><small>Bengaluru, India</small>
              </a>
              <a className="contact-info-card" href="tel:+918423655336">
                <span><Icon name="phone" /></span><strong>Call Center</strong><small>+91 78925 18414</small>
              </a>
              <a className="contact-info-card" href={`mailto:${salesEmail}`}>
                <span><Icon name="email" /></span><strong>Email</strong><small>{salesEmail}</small>
              </a>
              <div className="contact-info-card">
                <span><Icon name="clock" /></span><strong>Response Time</strong><small>Within 1–2 business days</small>
              </div>
            </div>
          </div>
          {contactForm}
        </div>
      </div>
    </section>

    <section className="contact-proof-section">
      <div className="contact-page-shell">
        <p className="contact-section-eyebrow">VOICE AI, BUILT FOR REAL WORK</p>
        <h2>Move every conversation forward.</h2>
        <div className="contact-proof-grid">
          <article><span>01</span><h3>Answer with context</h3><p>Voice agents handle common questions with your approved business information.</p></article>
          <article><span>02</span><h3>Take the next step</h3><p>Connect calls to calendars, CRM records, and the tools your team already uses.</p></article>
          <article><span>03</span><h3>Keep people in control</h3><p>Set clear handoffs, guardrails, and workflows around every customer journey.</p></article>
        </div>
      </div>
    </section>

    <section className="contact-social-section">
      <div className="contact-page-shell">
        <p className="contact-section-eyebrow">FOLLOW ALONG</p>
        <h2>Keep up with Vozon.</h2>
        <div className="contact-social-grid">
          <a href="https://linkedin.com/company/vozon-ai-india/" target="_blank" rel="noreferrer"><span>in</span><strong>LinkedIn</strong><small>Company updates and ideas</small></a>
          <a href="https://x.com/vozonai_" target="_blank" rel="noreferrer"><span>𝕏</span><strong>Follow on X</strong><small>News and product updates</small></a>
          <a href="https://www.instagram.com/vozonai" target="_blank" rel="noreferrer"><span>◎</span><strong>Instagram</strong><small>See what we’re building</small></a>
          <a href="mailto:hello@vozon.ai"><span><Icon name="email" /></span><strong>Write to us</strong><small>{salesEmail}</small></a>
        </div>
      </div>
    </section>

    <section className="contact-offices-section" id="office-locations">
      <div className="contact-page-shell">
        <p className="contact-section-eyebrow">OUR OFFICES</p>
        <h2>Find our teams.</h2>
        <div className="contact-offices-grid">
          {officeLocations.map((office) => (
            <a
              className="contact-office-card"
              href={`https://maps.google.com/?q=${encodeURIComponent(office.address)}`}
              key={office.name}
              rel="noreferrer"
              target="_blank"
            >
              <span><Icon name="location" /></span>
              <small>{office.label}</small>
              <strong>{office.name}</strong>
              <p>{office.address}</p>
              <b>Open in Maps <Icon name="arrow" /></b>
            </a>
          ))}
        </div>
      </div>
    </section>

    <section className="contact-faq-section" id="contact-faq">
      <div className="contact-page-shell contact-faq-layout">
        <div><p className="contact-section-eyebrow">FAQ</p><h2>Frequently Asked Questions</h2><p>Quick answers before you get in touch.</p></div>
        <div className="contact-faq-list">
          <details open><summary>What happens after I send the form?<span aria-hidden="true">+</span></summary><p>Our team reviews your requirements and replies by email within 1–2 business days.</p></details>
          <details><summary>Can I book a product demo?<span aria-hidden="true">+</span></summary><p>Yes. Select “Product demo” in the form and tell us what you would like to explore.</p></details>
          <details><summary>Can Vozon connect to our existing phone system?<span aria-hidden="true">+</span></summary><p>Vozon supports phone and SIP integrations. Share your current setup so our team can confirm the right connection.</p></details>
          <details><summary>Where can I get help with an existing account?<span aria-hidden="true">+</span></summary><p>Email <a href={`mailto:${salesEmail}`}>{salesEmail}</a> and include your workspace name and a short description of the issue.</p></details>
        </div>
      </div>
    </section>

    <style>{`
      #contact-page.contact-page-v2 { --contact-blue:#2563eb; --contact-ink:#111827; --contact-muted:#617084; background:#fff!important; color:var(--contact-ink); font-family:var(--font-site-sans),Roboto,Arial,sans-serif; }
      #contact-page.contact-page-v2 :is(h1,h2,h3,p) { font-family:inherit; }
      #contact-page .contact-page-shell { width:min(1180px,calc(100% - 48px)); margin-inline:auto; }
      #contact-page .contact-hero-section { padding:120px 0 58px; background:#fff!important; }
      #contact-page .contact-breadcrumb { display:flex; gap:12px; align-items:center; margin:0 0 24px; color:#758195; font-size:13px; }
      #contact-page .contact-breadcrumb a { color:inherit; text-decoration:none; }
      #contact-page .contact-hero-grid { display:grid; grid-template-columns:minmax(0,1fr) minmax(420px,.92fr); align-items:center; gap:clamp(32px,6vw,84px); }
      #contact-page .contact-intro { min-width:0; }
      #contact-page .contact-eyebrow { display:inline-flex; align-items:center; gap:7px; border-radius:999px; padding:7px 12px; background:#eff5ff; color:#111827; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.04em; }
      #contact-page .contact-eyebrow svg { width:14px;height:14px; }
      #contact-page .contact-intro h1 { margin:18px 0 16px!important; max-width:12ch; color:var(--contact-ink)!important; font-size:clamp(34px,4.4vw,54px)!important; font-weight:600!important; letter-spacing:-.055em!important; line-height:1.08!important; }
      #contact-page .contact-intro h1 span { color:#111827!important; }
      #contact-page .contact-intro>p { max-width:440px; margin:0; color:#111827!important; font-size:16px; line-height:1.65; }
      #contact-page .contact-info-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; margin-top:36px; }
      #contact-page .contact-info-card { min-width:0; min-height:88px; display:grid; grid-template-columns:24px minmax(0,1fr); align-content:center; column-gap:10px; row-gap:4px; padding:14px 15px; border:1px solid #e2e8f0; border-radius:14px; background:#fff; color:inherit; text-decoration:none; box-shadow:0 3px 12px rgb(15 23 42 / 3%); }
      #contact-page .contact-info-card>span { grid-row:span 2; color:var(--contact-blue); align-self:center; }
      #contact-page .contact-info-card svg { width:18px;height:18px; }
      #contact-page .contact-info-card strong { font-size:13px; font-weight:600; }
      #contact-page .contact-info-card small { overflow-wrap:anywhere; color:#111827; font-size:11px; line-height:1.4; }
      #contact-page .contact-info-card[href]:hover { border-color:#a9c5ff; background:#f8fbff; }
      #contact-page .contact-page-form { position:relative; overflow:hidden; width:100%; min-width:0; margin:0; padding:30px 26px 24px!important; border:1px solid #dbe5f5!important; border-radius:18px!important; background:linear-gradient(180deg,#2563eb 0 16px,#fff 16px)!important; box-shadow:0 18px 48px rgb(24 55 108 / 10%)!important; }
      #contact-page .contact-page-form>div:first-child { margin-top:4px; border-color:#e6ebf2!important; }
      #contact-page .contact-page-form>div:first-child>span { background:#eff5ff!important; border-color:#dce8ff!important; }
      #contact-page .contact-page-form>div:first-child>span svg { color:var(--contact-blue)!important; }
      #contact-page .contact-page-form h2 { color:#111827!important; font-size:18px!important; }
      #contact-page .contact-page-form label { color:#293548!important; font-size:12px!important; }
      #contact-page .contact-page-form label p,#contact-page .contact-page-form>p { color:#111827!important; }
      #contact-page .contact-form-field { min-height:42px!important; border-color:#dce3ec!important; border-radius:8px!important; background:#fff!important; color:#111827!important; font-size:13px!important; }
      #contact-page textarea.contact-form-field { min-height:92px!important; }
      #contact-page .contact-form-field:focus { border-color:var(--contact-blue)!important; box-shadow:0 0 0 3px rgb(37 99 235 / 13%)!important; outline:none!important; }
      #contact-page .contact-form-field::placeholder { color:#8793a3!important; opacity:1!important; }
      #contact-page select.contact-form-field option { color:#111827!important; background:#fff!important; }
      #contact-page .contact-submit-button { min-height:44px!important; border:1px solid var(--contact-blue)!important; border-radius:999px!important; background:var(--contact-blue)!important; color:#fff!important; -webkit-text-fill-color:#fff!important; }
      #contact-page .contact-submit-button:hover { background:#1d4ed8!important; }
      #contact-page .contact-submit-button * { color:#fff!important; -webkit-text-fill-color:#fff!important; }
      #contact-page .contact-proof-section,#contact-page .contact-social-section,#contact-page .contact-faq-section { padding:64px 0; border-top:1px solid #edf0f4; background:#fff!important; }
      #contact-page .contact-proof-section { background:#f8faff!important; }
      #contact-page .contact-section-eyebrow { margin:0 0 10px; color:#111827!important; font-size:11px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; }
      #contact-page .contact-proof-section h2,#contact-page .contact-social-section h2,#contact-page .contact-faq-section h2 { margin:0; color:#111827!important; font-size:clamp(25px,3vw,36px)!important; font-weight:600!important; letter-spacing:-.04em!important; line-height:1.15!important; }
      #contact-page .contact-proof-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:16px; margin-top:28px; }
      #contact-page .contact-proof-grid article { padding:24px; border:1px solid #e2e8f0; border-radius:16px; background:#fff; }
      #contact-page .contact-proof-grid article>span { color:var(--contact-blue); font-size:12px; font-weight:700; }
      #contact-page .contact-proof-grid h3 { margin:18px 0 8px; color:#172033!important; font-size:16px!important; font-weight:600!important; }
      #contact-page .contact-proof-grid p,#contact-page .contact-faq-layout>div:first-child>p:last-child { margin:0; color:#111827!important; font-size:13px; line-height:1.65; }
      #contact-page .contact-social-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:14px; margin-top:26px; }
      #contact-page .contact-social-grid a { display:grid; gap:7px; justify-items:start; min-width:0; padding:20px; border:1px solid #e2e8f0; border-radius:14px; color:#111827; text-decoration:none; }
      #contact-page .contact-social-grid a:hover { border-color:#a9c5ff; background:#f8fbff; }
      #contact-page .contact-social-grid a>span { display:grid; place-items:center; width:30px;height:30px; margin-bottom:4px; border-radius:9px; background:#eff5ff; color:var(--contact-blue); font-size:16px; font-weight:700; }
      #contact-page .contact-social-grid svg { width:16px;height:16px; }
      #contact-page .contact-social-grid strong { font-size:13px; }
      #contact-page .contact-social-grid small { color:#111827; font-size:11px; }
      #contact-page .contact-offices-section { padding:58px 0; border-top:1px solid #edf0f4; background:#f8faff!important; }
      #contact-page .contact-offices-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:16px; margin-top:24px; }
      #contact-page .contact-office-card { display:flex; flex-direction:column; min-width:0; min-height:210px; padding:22px; border:1px solid #e2e8f0; border-radius:16px; background:#fff; color:#111827; text-decoration:none; transition:border-color .18s ease,transform .18s ease; }
      #contact-page .contact-office-card:hover { transform:translateY(-2px); border-color:#a9c5ff; }
      #contact-page .contact-office-card>span { display:grid; place-items:center; width:34px;height:34px; margin-bottom:16px; border-radius:10px; background:#eff5ff; color:var(--contact-blue); }
      #contact-page .contact-office-card>span svg { width:18px;height:18px; }
      #contact-page .contact-office-card small { color:#111827; font-size:11px; }
      #contact-page .contact-office-card strong { margin-top:4px; font-size:16px; }
      #contact-page .contact-office-card p { margin:8px 0 18px; color:#111827!important; font-size:12px; line-height:1.55; }
      #contact-page .contact-office-card>b { display:flex; align-items:center; gap:6px; margin-top:auto; color:var(--contact-blue); font-size:12px; }
      #contact-page .contact-office-card>b svg { width:14px;height:14px; }
      #contact-page .contact-faq-layout { display:grid; grid-template-columns:.7fr 1.3fr; gap:48px; align-items:start; }
      #contact-page .contact-faq-layout>div:first-child>p:last-child { margin-top:12px; }
      #contact-page .contact-faq-list { border-top:1px solid #e2e8f0; }
      #contact-page .contact-faq-list details { padding:17px 0; border-bottom:1px solid #e2e8f0; }
      #contact-page .contact-faq-list summary { display:flex; justify-content:space-between; gap:18px; cursor:pointer; color:#182235; font-size:14px; font-weight:600; list-style:none; }
      #contact-page .contact-faq-list summary::-webkit-details-marker { display:none; }
      #contact-page .contact-faq-list summary span { color:var(--contact-blue); font-size:20px; line-height:1; }
      #contact-page .contact-faq-list details[open] summary span { transform:rotate(45deg); }
      #contact-page .contact-faq-list details p { margin:10px 28px 0 0; color:#111827!important; font-size:13px; line-height:1.65; }
      #contact-page .contact-faq-list a { color:var(--contact-blue); }
      #contact-page.contact-page-v2 :is(.contact-breadcrumb,.contact-breadcrumb a,.contact-breadcrumb span,.contact-page-form label,.contact-page-form label p,.contact-page-form>p,.contact-info-card small,.contact-proof-grid p,.contact-social-grid small,.contact-office-card small,.contact-office-card p,.contact-faq-list details p,.contact-faq-layout>div:first-child>p:last-child) { color:#111827!important; }
      #contact-page .contact-faq-list a { color:#111827!important; }
      @media(max-width:900px) { #contact-page .contact-hero-grid { grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:26px; } #contact-page .contact-info-grid { gap:8px; } #contact-page .contact-info-card { padding:12px; } }
      @media(max-width:900px) { #contact-page .contact-offices-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
      @media(max-width:700px) { #contact-page .contact-page-shell { width:min(100% - 32px,560px); } #contact-page .contact-hero-section { padding:100px 0 42px; } #contact-page .contact-hero-grid,#contact-page .contact-faq-layout { grid-template-columns:1fr; gap:28px; } #contact-page .contact-intro h1 { font-size:clamp(34px,9vw,46px)!important; } #contact-page .contact-page-form { padding:26px 18px 20px!important; } #contact-page .contact-proof-section,#contact-page .contact-social-section,#contact-page .contact-offices-section,#contact-page .contact-faq-section { padding:44px 0; } #contact-page .contact-proof-grid { grid-template-columns:1fr; } #contact-page .contact-social-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } #contact-page .contact-offices-grid { grid-template-columns:1fr; } }
      @media(max-width:380px) { #contact-page .contact-info-grid { grid-template-columns:1fr; } #contact-page .contact-social-grid { grid-template-columns:1fr; } }
    `}</style>
  </div>
);
}
