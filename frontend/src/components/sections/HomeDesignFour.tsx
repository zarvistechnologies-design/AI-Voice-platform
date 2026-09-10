"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { customerReviews } from "@/config/customerReviews";
import { HeroVoiceVisualizer } from "./HeroVoiceVisualizer";
import { RoiCalculator } from "./RoiCalculator";
import { InteractiveAgentPlayground } from "./InteractiveAgentPlayground";

import styles from "./HomeDesignFour.module.css";
import "./HomeDesignFourGrid.css";
import "./HomeDesignFourHero.css";
import "./HomeDesignFourSections.css";
import "./HomeDesignFourEnding.css";

const voiceLanguages = [
  { label: "English (India)", voice: "Ananya", detail: "Natural Expressive", accent: "en-IN" },
  { label: "Hindi (हिन्दी)", voice: "Amit", detail: "Conversational Fluent", accent: "hi-IN" },
  { label: "Tamil (தமிழ்)", voice: "Kavya", detail: "Native Dialect", accent: "ta-IN" },
  { label: "Telugu (తెలుగు)", voice: "Arjun", detail: "Clear Articulation", accent: "te-IN" },
  { label: "Kannada (ಕನ್ನಡ)", voice: "Rohan", detail: "Expressive Tone", accent: "kn-IN" },
  { label: "Marathi (मराठी)", voice: "Aarav", detail: "Native Cadence", accent: "mr-IN" },
  { label: "Bengali (বাংলা)", voice: "Ishani", detail: "Smooth Warmth", accent: "bn-IN" },
  { label: "Gujarati (ગુજરાતી)", voice: "Nisha", detail: "Native Intonation", accent: "gu-IN" },
  { label: "English (US/UK)", voice: "Liza", detail: "Global Executive", accent: "en-US" },
  { label: "Spanish (Español)", voice: "Sofia", detail: "Native European/LATAM", accent: "es-ES" },
] as const;

const bentoFeatures = [
  {
    tag: "Sub-500ms Telephony",
    title: "Instantaneous Real-Time Latency",
    desc: "Powered by direct WebRTC WebSocket streams with Gemini 3.1 & GPT Realtime. Speak naturally with zero awkward conversational pauses.",
    metric: "380ms Avg Latency",
    type: "latency",
  },
  {
    tag: "Autonomous Actions",
    title: "Zero-Hallucination Tool Execution",
    desc: "Voice agents execute live backend APIs, check CRM records, query Postgres databases, and trigger webhooks during active calls.",
    metric: "100% Deterministic APIs",
    type: "tools",
  },
  {
    tag: "Multilingual Intelligence",
    title: "30+ Native Vernacular Accents",
    desc: "Deep integration with Sarvam AI, Deepgram Flux, and Gemini native audio for seamless code-switching in Indian and global languages.",
    metric: "30+ Dialects & Accents",
    type: "languages",
  },
  {
    tag: "Carrier-Grade Inbound/Outbound",
    title: "Enterprise SIP & Telecom Bridge",
    desc: "Deploy on dedicated virtual numbers, Exotel SIP trunks, Twilio, or embed into your iOS/Android/Web applications with 1 line of SDK code.",
    metric: "99.99% Call Delivery",
    type: "telecom",
  },
] as const;

const industries = [
  {
    title: "Healthcare & Clinics",
    tab: "Healthcare",
    image: "/images/2.png",
    headline: "Automate Patient Triage & Doctor Appointments",
    points: [
      "Zero hold time for emergency inquiries & OPD booking",
      "Instant calendar reservation & doctor schedule sync",
      "HIPAA-compliant encrypted voice communication",
    ],
  },
  {
    title: "BFSI & Fintech",
    tab: "Banking & Finance",
    image: "/images/1.png",
    headline: "Instant KYC, Loan Verification & Payment Follow-ups",
    points: [
      "AI-driven instant loan qualification in Hindi/English",
      "Automated EMI reminder calls with 4x higher recovery",
      "SOC 2 Type II certified banking security standards",
    ],
  },
  {
    title: "Hospitality & Travel",
    tab: "Hospitality",
    image: "/images/3.png",
    headline: "24/7 VIP Concierge, Room & Table Reservations",
    points: [
      "Real-time table & room availability check with POS sync",
      "Multi-course menu inquiries and dietary preference capture",
      "Instant WhatsApp confirmation pass dispatch",
    ],
  },
  {
    title: "E-Commerce & Logistics",
    tab: "B2B & Commerce",
    image: "/images/5.png",
    headline: "Automated COD Confirmation & Live Order Tracking",
    points: [
      "Drastically reduce RTO (Return to Origin) with instant voice verification",
      "Live GPS delivery status reading in regional dialects",
      "Effortless return and exchange ticket creation",
    ],
  },
  {
    title: "Education & EdTech",
    tab: "Education",
    image: "/images/4.png",
    headline: "Lead Qualification & Counseling Admissions",
    points: [
      "Instant qualification of high-intent student leads",
      "Course curriculum explanation & fee structure counseling",
      "Direct warm transfer to senior academic advisors",
    ],
  },
] as const;

const insights = [
  { title: "Gemini 3.1 Live vs GPT Realtime 2.1: The 2026 Voice AI Benchmark", meta: "SEPTEMBER 2026 • 6 MIN READ", tone: "coral" },
  { title: "How Indian Enterprises Are Slashing Call Center Costs by 85%", meta: "AUGUST 2026 • 8 MIN READ", tone: "blue" },
  { title: "Building Zero-Hallucination Tool Calling in Real-Time Voice Streams", meta: "JULY 2026 • 5 MIN READ", tone: "aqua" },
  { title: "Reducing Latency Under 400ms: WebRTC vs Traditional PSTN", meta: "JUNE 2026 • 7 MIN READ", tone: "peach" },
] as const;

const faqs = [
  ["Can I test Vozon for free?", "Yes! You can create a free account, configure your custom voice agent, and test it live right in your browser or over a phone call with complimentary test credits."],
  ["How does Vozon achieve sub-400ms latency?", "Vozon bypasses slow traditional transcription-then-synthesis pipelines by utilizing ultra-low latency WebSockets with native audio speech-to-speech models (Gemini 3.1 Flash Live & OpenAI Realtime 2.1) combined with edge telephony routing."],
  ["Which languages and Indian regional dialects are supported?", "Vozon natively supports Hindi, English (Indian/US/UK), Tamil, Telugu, Kannada, Marathi, Bengali, Gujarati, Punjabi, Malayalam, Spanish, French, Arabic, and 20+ other global languages."],
  ["Can Vozon transfer calls to my human team?", "Yes. Vozon agents perform warm transfers to your human support agents or phone numbers whenever complex escalations or requested by the caller, passing the full conversation context and metadata."],
  ["How does Vozon connect with my CRM and database?", "Vozon supports native REST APIs, webhook function calling, Google Calendar, Salesforce, HubSpot, Zoho, and custom Postgres/MySQL database connectors."],
  ["Is my enterprise data protected?", "Absolutely. Vozon is built enterprise-grade with end-to-end encryption, SOC 2 Type II compliance, ISO 27001 standards, and strict zero-data-retention options for regulated industries."],
] as const;

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="w-5 h-5">
      <path d="M4 10h11M11 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HomeDesignFour() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [activeIndustry, setActiveIndustry] = useState(0);
  const [activeLanguage, setActiveLanguage] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const selectedIndustry = industries[activeIndustry];
  const selectedVoice = voiceLanguages[activeLanguage];

  return (
    <div className={`${styles.page} home-design-four`}>
      <SiteHeader />

      <main>
        <section className={`${styles.hero} home-design-four__hero`}>
          <div className={styles.heroGlow} aria-hidden="true" />
          
          <div className="design-four-hero__features" aria-label="Platform capabilities">
            <span><i>✓</i> Sub-400ms Latency</span>
            <span><i>✓</i> 30+ Multilingual Accents</span>
            <span><i>✓</i> Gemini 3.1 & GPT Realtime</span>
          </div>

          <h1>
            Deploy Voice AI that speaks,<br className="design-four-desktop-break" />
            thinks &amp; acts like your <strong>best human agents.</strong>
          </h1>

          <p className="hero-subtext">
            Automate high-volume customer calls, appointments, and support workflows with autonomous real-time voice agents.
          </p>

          <form
            className="design-four-phone"
            onSubmit={(event) => {
              event.preventDefault();
              window.location.href = phoneNumber ? `/contact?phone=${encodeURIComponent(phoneNumber)}` : "/contact";
            }}
          >
            <span className="design-four-india-flag" aria-label="India" />
            <input
              aria-label="Phone number"
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="Enter phone number (+91...)"
              type="tel"
              value={phoneNumber}
            />
            <button type="submit">Test Call Live</button>
          </form>

          <div className="design-four-trust-pill">
            Trusted by <strong>100+</strong> innovative teams powering <strong>millions of live conversations</strong>
          </div>

          <HeroVoiceVisualizer />
        </section>

        <section className={`${styles.logoStrip} home-design-four__logos`} aria-label="Companies using modern voice workflows">
          <div className="design-four-client-marquee-track">
            <div className="design-four-client-marquee-group">
              <b className="design-four-client-logo is-deloitte">Deloitte<span>.</span></b>
              <b className="design-four-client-logo is-appsmith">appsmith_</b>
              <b className="design-four-client-logo is-vigilant">Vigilant</b>
              <b className="design-four-client-logo is-hubspot">HubSpot</b>
              <b className="design-four-client-logo is-shopify">Shopify</b>
              <b className="design-four-client-logo is-zendesk">zendesk</b>
              <b className="design-four-client-logo is-simplamo">Simplamo</b>
              <b className="design-four-client-logo is-digitalbot">DigitalBot</b>
            </div>
            <div aria-hidden="true" className="design-four-client-marquee-group">
              <b className="design-four-client-logo is-deloitte">Deloitte<span>.</span></b>
              <b className="design-four-client-logo is-appsmith">appsmith_</b>
              <b className="design-four-client-logo is-vigilant">Vigilant</b>
              <b className="design-four-client-logo is-hubspot">HubSpot</b>
              <b className="design-four-client-logo is-shopify">Shopify</b>
              <b className="design-four-client-logo is-zendesk">zendesk</b>
              <b className="design-four-client-logo is-simplamo">Simplamo</b>
              <b className="design-four-client-logo is-digitalbot">DigitalBot</b>
            </div>
          </div>
        </section>

        <section className="design-four-bento-section">
          <div className="section-head-center">
            <span className="section-eyebrow">Architected For Scale</span>
            <h2>Everything you need for mission-critical Voice AI</h2>
            <p>A unified infrastructure designed for ultra-low latency, zero hallucinations, and high concurrency.</p>
          </div>

          <div className="bento-grid-container">
            {bentoFeatures.map((feat, idx) => (
              <div key={feat.title} className={`bento-card bento-card-${idx + 1}`}>
                <div className="bento-card-top">
                  <span className="bento-tag">{feat.tag}</span>
                  <span className="bento-metric-pill">{feat.metric}</span>
                </div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
                <div className="bento-visual-slot">
                  {feat.type === "latency" && (
                    <div className="latency-bar-visual">
                      <div className="latency-row is-vozon">
                        <span>Vozon Realtime</span>
                        <div className="bar-track"><div className="bar-fill vozon-fill" /></div>
                        <strong>380ms</strong>
                      </div>
                      <div className="latency-row is-legacy">
                        <span>Traditional IVR / Pipeline</span>
                        <div className="bar-track"><div className="bar-fill legacy-fill" /></div>
                        <strong>2,400ms</strong>
                      </div>
                    </div>
                  )}
                  {feat.type === "tools" && (
                    <div className="tool-flow-visual">
                      <span className="flow-chip">1. Customer Asks</span>
                      <span className="flow-arrow">→</span>
                      <span className="flow-chip active-chip">2. API Verified</span>
                      <span className="flow-arrow">→</span>
                      <span className="flow-chip">3. Slot Booked</span>
                    </div>
                  )}
                  {feat.type === "languages" && (
                    <div className="lang-matrix-visual">
                      <span>हिन्दी</span><span>English</span><span>தமிழ்</span><span>తెలుగు</span><span>मराठी</span><span>ಕನ್ನಡ</span>
                    </div>
                  )}
                  {feat.type === "telecom" && (
                    <div className="telecom-chips-visual">
                      <span>⚡ Exotel SIP</span><span>🌐 Twilio Bridge</span><span>📡 WebRTC HD</span><span>🔒 E2E TLS</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <InteractiveAgentPlayground />

        <section className="design-four-industry-section" id="industries">
          <div className="design-four-industry-copy">
            <span className="section-eyebrow">Tailored For Your Niche</span>
            <h2>Built for <strong>businesses</strong> that run on <strong>conversations</strong></h2>
            <p>From healthcare and finance to hospitality and e-commerce, Vozon handles end-to-end caller journeys seamlessly.</p>
            
            <div className="industry-bullets">
              {selectedIndustry.points.map((pt) => (
                <div key={pt} className="industry-bullet-item">
                  <span className="bullet-check">✓</span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            <div className="industry-action-row">
              <Link href="/contact" className="btn-primary-emerald">Talk to Sales</Link>
              <Link href="/signup" className="btn-secondary-white">Deploy Agent Free</Link>
            </div>
          </div>

          <div className="design-four-industry-experience">
            <div className="design-four-industry-tabs" role="tablist" aria-label="Choose an industry">
              {industries.map((industry, index) => (
                <button
                  aria-selected={activeIndustry === index}
                  className={activeIndustry === index ? "is-active" : ""}
                  key={industry.title}
                  onClick={() => setActiveIndustry(index)}
                  role="tab"
                  type="button"
                >
                  {industry.tab}
                </button>
              ))}
            </div>
            
            <article className="design-four-industry-panel" key={selectedIndustry.title}>
              <Image
                alt={`${selectedIndustry.title} business solutions`}
                fill
                priority={activeIndustry === 0}
                sizes="(max-width: 760px) 100vw, 50vw"
                src={selectedIndustry.image}
              />
              <div className="industry-panel-overlay">
                <h4>{selectedIndustry.headline}</h4>
              </div>
            </article>
          </div>
        </section>

        <RoiCalculator />

        <section className="design-four-outcomes-section">
          <h2>Everyday Calls. Extraordinary Outcomes.</h2>
          <div className="design-four-metrics">
            <div><strong>1 Billion+</strong><span>realtime minutes</span></div>
            <div><strong>99.99%</strong><span>enterprise uptime</span></div>
            <div><strong>&lt; 400ms</strong><span>average latency</span></div>
            <div><strong>2.5M+</strong><span>calls completed</span></div>
            <div><strong>85%</strong><span>cost reduction</span></div>
          </div>
          
          <div className="design-four-agent-banner">
            <div>
              <small>Enterprise Ready Voice Stack</small>
              <h3><strong>Vozon</strong> Realtime Voice Agents</h3>
              <p>Scales from 1 to 100,000 concurrent calls without degradation in audio quality or latency.</p>
            </div>
            <Link href="/dashboard" aria-label="Explore voice agents"><Arrow /></Link>
          </div>
        </section>

        <section className="design-four-testimonials-section">
          <div className="design-four-testimonial-heading">
            <span>Verified Customer Stories</span>
            <h2>What industry leaders say</h2>
            <p><strong>4.9 / 5.0</strong> <b>★★★★★</b> rating from 100+ active enterprise deployments</p>
          </div>
          <div className="design-four-review-grid">
            {customerReviews.slice(0, 6).map((item) => (
              <article key={item.name}>
                <blockquote>{item.quote}</blockquote>
                <footer>
                  <span>{item.name.slice(0, 1)}</span>
                  <div><b>{item.name}</b><small>{item.role}</small></div>
                  <i>𝕏</i>
                </footer>
              </article>
            ))}
          </div>
          <Link className="design-four-review-button" href="/reviews">View all 100+ Reviews</Link>
        </section>

        <section className={`${styles.insights} home-design-four__section design-four-insights-section`} id="insights">
          <div className={`${styles.insightHeader} design-four-insights-header`}>
            <h2>Latest Voice AI Insights</h2>
            <Link className={`${styles.secondaryButton} design-four-insights-more`} href="/resources/blog">View All Articles</Link>
          </div>
          <div className={`${styles.insightGrid} design-four-insights-grid`}>
            <Link className={`${styles.featuredInsight} design-four-featured-insight`} href="/resources/blog">
              <div className={`${styles.abstractArt} design-four-insight-art`} aria-hidden="true"><span /><i /><b /></div>
              <div className="design-four-featured-caption">
                <small>SEPTEMBER 2026 • FEATURED</small>
                <h3>How Native Audio Realtime Models Are Changing Telephony Forever.</h3>
              </div>
            </Link>
            <div className={`${styles.insightList} design-four-insight-list`}>
              {insights.map((item) => (
                <Link className="design-four-insight-item" href="/resources/blog" key={item.title}>
                  <span className={`${styles.miniArt} ${styles[item.tone]} design-four-insight-thumb is-${item.tone}`} aria-hidden="true" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.meta}</p>
                  </div>
                  <Arrow />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="design-four-support-section" id="faq">
          <div className="design-four-security-row">
            <div>
              <h2>Enterprise-grade security</h2>
              <p>Designed with zero-compromise encryption, data governance, and compliance certifications.</p>
              <div>
                <Link href="/contact">Talk to Security Team</Link>
                <Link href="/resources/trust-center">Security Whitepaper</Link>
              </div>
            </div>
            <div className="design-four-compliance" aria-label="Security certifications">
              <span><small>Information Security</small><b>ISO</b><i>27001</i></span>
              <span><small>Health Data Privacy</small><b>⚕</b><i>HIPAA</i></span>
              <span><small>European Privacy</small><b>GDPR</b><i>READY</i></span>
              <span><small>Audited Controls</small><b>SOC 2</b><i>TYPE II</i></span>
            </div>
          </div>

          <div className="design-four-faq-row">
            <div className="design-four-faq-intro">
              <span>Got Questions?</span>
              <h2>Frequently asked <strong>questions</strong></h2>
              <aside>
                <b>Can’t find what you need?</b>
                <Link href="/contact">Speak with our engineers</Link>
              </aside>
            </div>
            <div className="design-four-faq-list">
              {faqs.map(([question, answer], index) => (
                <details
                  key={question}
                  open={activeFaq === index}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveFaq(activeFaq === index ? null : index);
                  }}
                >
                  <summary>
                    {question}
                    <span>{activeFaq === index ? "−" : "+"}</span>
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="design-four-integrations-section" id="integrations">
          <div className="design-four-integration-copy">
            <span className="section-eyebrow">Native Connectors</span>
            <h2>Don’t replace.<br /><strong>Integrate effortlessly.</strong></h2>
            <Link href="/signup">Start Free Integration</Link>
          </div>
          <div className="design-four-integration-icons" aria-label="Supported integrations">
            <span className="calendar"><Image alt="Google Calendar" height={65} src="/images/integrations/google-calendar.svg" width={65} /></span>
            <span className="crm">CRM</span>
            <span className="gmail"><Image alt="Gmail" height={72} src="/images/integrations/gmail.svg" width={72} /></span>
            <span className="twilio">Twilio</span>
            <span className="whatsapp">WhatsApp</span>
            <span className="hubspot">HubSpot</span>
            <span className="salesforce">Salesforce</span>
            <span className="slack">Slack</span>
          </div>
        </section>

        <section className="final-cta-section">
          <div className="final-cta-card">
            <span className="final-cta-badge">⚡ Instant 2-Minute Deployment</span>
            <h2>Ready to transform customer conversations with Voice AI?</h2>
            <p>Join 100+ high-growth companies deploying sub-400ms voice agents today.</p>
            <div className="final-cta-actions">
              <Link href="/signup" className="btn-final-primary">Start Building Free →</Link>
              <Link href="/contact" className="btn-final-secondary">Request Custom Enterprise Demo</Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
