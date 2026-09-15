export type SeoPage = {
  slug: string;
  kicker: string;
  title: string;
  description: string;
  highlights: readonly [string, string, string];
  sections: readonly { title: string; body: string }[];
  primaryAction?: { href: string; label: string };
  secondaryAction?: { href: string; label: string };
};

export const commercialPages: SeoPage[] = [
  {
    slug: "ai-phone-agent",
    kicker: "AI Phone Agent",
    title: "AI Phone Agent",
    description: "Answer inbound calls, run outbound conversations, qualify leads, book appointments, and update business systems with a multilingual AI phone agent.",
    highlights: ["Inbound and outbound calls", "Natural multilingual speech", "CRM-ready call outcomes"],
    sections: [
      { title: "Answer every inbound call", body: "Give callers an immediate, natural response during busy hours, after hours, and demand spikes. Vozon can identify intent, answer approved questions, collect details, route the call, or transfer the caller to a person with a concise summary." },
      { title: "Run useful outbound conversations", body: "Use approved call flows for lead qualification, reminders, confirmations, surveys, and follow-up. Retry rules, campaign controls, voicemail handling, and clear completion outcomes keep outreach organized." },
      { title: "Complete work during the call", body: "Connect calendars, CRMs, help desks, and custom APIs so the phone agent can check availability, create appointments, record dispositions, open tickets, and notify the right team." },
      { title: "Stay in control", body: "Define what the agent may say, which actions require confirmation, and when a human must take over. Review transcripts, recordings where permitted, latency, summaries, and outcomes after every call." },
    ],
  },
  {
    slug: "ai-receptionist",
    kicker: "AI Receptionist",
    title: "AI Receptionist",
    description: "Use a 24/7 AI receptionist to answer calls, take messages, route callers, schedule appointments, and cover front-desk overflow.",
    highlights: ["24/7 call answering", "Smart routing and messages", "Calendar booking"],
    sections: [
      { title: "A helpful first response", body: "Welcome every caller with a consistent business greeting, understand why they called, and guide them to the right answer, person, or next step without forcing them through a rigid phone tree." },
      { title: "Cover after-hours and overflow calls", body: "Keep important opportunities from reaching voicemail when the front desk is busy or closed. Capture names, contact details, urgency, and requested services for fast follow-up." },
      { title: "Book and manage appointments", body: "Connect the receptionist to your calendar so callers can hear available times, confirm a slot, reschedule, or cancel. Send confirmations and keep the booking attached to the call record." },
      { title: "Transfer with context", body: "Route calls by department, service area, language, customer type, or urgency. When a person joins, they receive the reason for the call and the details already collected." },
    ],
  },
  {
    slug: "inbound-ai-call-agent",
    kicker: "Inbound Call Automation",
    title: "Inbound AI Call Agent",
    description: "Automate inbound support, booking, qualification, routing, and after-hours calls without making customers repeat themselves.",
    highlights: ["Immediate call response", "Intent-based workflows", "Context-rich handoffs"],
    sections: [
      { title: "Resolve routine requests immediately", body: "Answer common product, policy, order, availability, and account questions using approved business knowledge while keeping uncertain or sensitive requests out of automation." },
      { title: "Capture structured caller intent", body: "Collect the exact fields each workflow needs, including contact details, service requested, location, urgency, budget, or preferred appointment time." },
      { title: "Route based on real context", body: "Use the conversation—not only keypad input—to select the right department, agent, location, language, or escalation path." },
      { title: "Measure every outcome", body: "Review answer rate, containment, transfers, bookings, call reasons, sentiment, and unresolved topics to improve the workflow over time." },
    ],
  },
  {
    slug: "outbound-ai-calling",
    kicker: "Outbound Call Automation",
    title: "Outbound AI Calling",
    description: "Launch controlled AI calling campaigns for qualification, reminders, confirmations, surveys, collections, and customer follow-up.",
    highlights: ["Campaign controls", "Live business actions", "Clear consent handling"],
    sections: [
      { title: "Reach the right contacts at the right time", body: "Upload an approved audience, choose calling windows and time zones, control concurrency, and define retry and voicemail behavior for each campaign." },
      { title: "Hold goal-driven conversations", body: "Qualify interest, confirm details, collect responses, schedule the next step, or route a ready contact to your team using a clear script and completion condition." },
      { title: "Respect consent and opt-outs", body: "Use lawful contact lists, disclose the business and purpose, honor do-not-call and opt-out requests, and configure the workflow for applicable local calling and recording rules." },
      { title: "Turn results into action", body: "Write dispositions, summaries, appointments, promised follow-ups, and structured fields back to the CRM or operational system your team already uses." },
    ],
  },
  {
    slug: "ai-appointment-booking",
    kicker: "Appointment Automation",
    title: "AI Appointment Booking",
    description: "Let callers book, confirm, reschedule, and cancel appointments by phone with real-time calendar availability and automated follow-up.",
    highlights: ["Real-time availability", "Booking confirmations", "Rescheduling and reminders"],
    sections: [
      { title: "Offer only available times", body: "Connect supported calendars and scheduling tools so the agent checks current availability, applies service or staff rules, and presents suitable slots in the caller's time zone." },
      { title: "Confirm every important detail", body: "Collect the caller's name, contact information, requested service, location, and selected time, then read the details back before creating the appointment." },
      { title: "Handle changes without front-desk work", body: "Allow eligible callers to reschedule or cancel using the same phone workflow, with identity and policy checks configured for your business." },
      { title: "Keep no-shows and confusion down", body: "Send confirmation messages, trigger reminder calls, and save a clear call summary so both the customer and team know what was agreed." },
    ],
  },
];

export const integrationPages: SeoPage[] = [
  ["hubspot", "HubSpot", "qualify leads, create or update contacts, record call outcomes, and schedule sales follow-up"],
  ["salesforce", "Salesforce", "look up customer context, update records, create tasks, and route qualified opportunities"],
  ["twilio", "Twilio", "connect phone numbers and telephony routes to inbound and outbound Vozon voice workflows"],
  ["calendly", "Calendly", "check scheduling availability and book confirmed appointments during a live phone call"],
  ["google-calendar", "Google Calendar", "find available time, create events, reschedule bookings, and send calendar-ready call outcomes"],
  ["zapier", "Zapier", "trigger thousands of app workflows from call events, summaries, structured fields, and dispositions"],
  ["zoho", "Zoho CRM", "capture leads, update customer records, create follow-up tasks, and keep call notes synchronized"],
  ["exotel", "Exotel", "connect business telephony in India with multilingual AI agents and structured call workflows"],
].map(([slug, name, outcome]) => ({
  slug,
  kicker: "Voice AI Integration",
  title: `${name} Voice AI Integration`,
  description: `Connect Vozon with ${name} to ${outcome}.`,
  highlights: ["Connected customer context", "Automated business actions", "Traceable call outcomes"] as [string, string, string],
  sections: [
    { title: `Connect ${name} to every call`, body: `Give approved Vozon agents access to the ${name} context and actions required for the conversation. Keep authentication, field mapping, and workflow ownership explicit before moving from testing to production.` },
    { title: "Read context before responding", body: "Use known customer, lead, appointment, or workflow data to reduce repeated questions and select the right conversation path without exposing unnecessary information." },
    { title: "Write clean outcomes automatically", body: `After confirmation, the agent can ${outcome}. Store structured fields alongside the transcript and summary so teams can verify what happened.` },
    { title: "Test failures and permissions", body: "Validate missing records, duplicate contacts, expired authorization, rate limits, timeouts, and unavailable actions. Configure a safe fallback or human handoff for every failure path." },
  ],
  secondaryAction: { href: "/docs", label: "Read documentation" },
}));

export const comparisonPages: SeoPage[] = [
  ["vozon-vs-vapi", "Vapi", "developer-focused voice orchestration"],
  ["vozon-vs-retell-ai", "Retell AI", "managed conversational phone agents"],
  ["vozon-vs-bland-ai", "Bland AI", "programmable AI phone-call automation"],
  ["vozon-vs-elevenlabs", "ElevenLabs", "voice generation and conversational AI"],
  ["vozon-vs-traditional-ivr", "Traditional IVR", "keypad menus and scripted call routing"],
].map(([slug, competitor, category]) => ({
  slug,
  kicker: "Voice AI Comparison",
  title: `Vozon vs ${competitor}`,
  description: `Compare Vozon with ${competitor} for voice agents, telephony, languages, integrations, workflow control, analytics, and deployment needs.`,
  highlights: ["Capabilities and fit", "Operational tradeoffs", "Evaluation checklist"] as [string, string, string],
  sections: [
    { title: "Start with the workflow, not a feature count", body: `Vozon and ${competitor} may both support parts of ${category}, but the best fit depends on your call direction, markets, telephony, required actions, review process, and the team that will operate the system.` },
    { title: "Compare the complete call stack", body: "Evaluate speech recognition, language models, text-to-speech, phone-number coverage, latency, interruption handling, transfers, knowledge grounding, tools, webhooks, analytics, and environment controls using the same test script." },
    { title: "Model the real operating cost", body: "Compare platform, carrier, transcription, model, voice, concurrency, support, and implementation costs. Run representative calls instead of relying on a single advertised per-minute number." },
    { title: "Run a controlled proof of concept", body: `Test Vozon and ${competitor} with background noise, silence, corrections, voicemail, mixed languages, tool failures, sensitive questions, and human escalation. Choose using verified outcomes and operator effort.` },
  ],
  secondaryAction: { href: "/resources/comparison-overview", label: "Comparison guide" },
}));

export const articlePages: SeoPage[] = [
  ["what-is-an-ai-voice-agent", "What Is an AI Voice Agent and How Does It Work?", "AI Voice Agent Guide", "speech recognition, reasoning, business tools, and natural speech work together during a phone conversation"],
  ["ai-voice-agent-pricing-guide", "AI Voice Agent Pricing: A Complete Cost Guide", "Pricing Guide", "platform, telephony, transcription, model, text-to-speech, concurrency, and implementation costs affect the final price"],
  ["how-to-build-an-ai-phone-agent", "How to Build an AI Phone Agent", "Implementation Guide", "define the outcome, design the call flow, connect knowledge and tools, test difficult paths, and launch gradually"],
  ["ai-receptionist-vs-answering-service", "AI Receptionist vs Traditional Answering Service", "Buyer Guide", "compare availability, conversation quality, escalation, integrations, cost, and the situations where people remain essential"],
  ["inbound-vs-outbound-voice-agents", "Inbound vs Outbound Voice Agents", "Voice AI Strategy", "understand how call direction changes consent, scripts, campaign controls, success metrics, and operational design"],
  ["automate-appointment-booking-with-ai", "How AI Agents Automate Appointment Booking", "Scheduling Guide", "connect live availability, collect customer details, confirm bookings, handle changes, and reduce manual front-desk work"],
  ["voice-ai-call-recording-consent", "Voice AI Call Recording and Consent Guide", "Responsible Voice AI", "plan disclosure, consent, retention, access, opt-outs, and regional review before recording automated calls"],
  ["reduce-voice-agent-latency", "How to Reduce AI Voice Agent Latency", "Technical Guide", "measure each stage of the audio pipeline and improve endpointing, model routing, tool calls, streaming, and network placement"],
  ["voice-ai-use-cases-indian-businesses", "AI Voice Agent Use Cases for Indian Businesses", "India Voice AI Guide", "apply multilingual phone automation to support, lead qualification, appointment booking, logistics, collections, and local services"],
  ["ai-phone-agent-implementation-checklist", "AI Phone Agent Implementation Checklist", "Launch Checklist", "move from use-case selection to compliant data, testing, monitoring, escalation, rollout, and continuous improvement"],
].map(([slug, title, kicker, focus]) => ({
  slug,
  kicker,
  title,
  description: `A practical guide to ${focus}.`,
  highlights: ["Practical framework", "Production considerations", "Clear next steps"] as [string, string, string],
  sections: [
    { title: "Begin with a measurable customer outcome", body: `This guide explains how to ${focus}. Start with one call type, a defined completion condition, and a baseline such as answer rate, booking rate, resolution, handling time, or qualified opportunities.` },
    { title: "Design the complete conversation", body: "Map the opening, required questions, knowledge boundaries, confirmations, business actions, failure paths, human escalation, and closing. Include silence, interruptions, corrections, voicemail, and language changes." },
    { title: "Test with representative calls", body: "Use real phone audio and realistic scenarios. Verify names, numbers, dates, prices, domain terms, background noise, tool failures, unsupported requests, and the evidence stored after the call." },
    { title: "Launch gradually and learn", body: "Start with controlled traffic, review calls frequently, protect opt-outs and sensitive data, measure business outcomes, and publish changes through a clear owner and approval process." },
  ],
  secondaryAction: { href: "/services/voice-agents", label: "Explore voice agents" },
}));

export const allSeoPages = [...commercialPages, ...integrationPages, ...comparisonPages, ...articlePages];
