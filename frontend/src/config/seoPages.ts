import { integrations } from "@/config/integrationCatalog";
import { integrationGuides } from "@/config/integrationGuides";

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

export const integrationPages: SeoPage[] = integrations.map((integration) => ({
  slug: integration.slug,
  kicker: integration.category,
  title: `${integration.name} Integration`,
  description: integration.description,
  highlights: [integration.capabilities[0], integration.capabilities[1], integration.capabilities[2]],
  sections: [
    { title: `Where ${integration.name} fits`, body: integration.description },
    { title: `Set up ${integration.name}`, body: integrationGuides[integration.slug].setup },
    { title: "What to verify", body: integrationGuides[integration.slug].check },
  ],
  secondaryAction: { href: "/integrations", label: "All integrations" },
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
  {
    slug: "what-is-an-ai-voice-agent",
    kicker: "AI Voice Agent Guide",
    title: "What Is an AI Voice Agent and How Does It Work?",
    description: "Understand how speech recognition, language models, voice synthesis, business data, and actions combine to handle a live phone conversation.",
    highlights: ["Core voice AI pipeline", "Actions and integrations", "Quality and safety controls"],
    sections: [
      { title: "The core voice AI pipeline", body: "An AI voice agent listens to audio, turns speech into text or model-ready signals, interprets the caller's intent, decides on a response, and produces speech. Streaming keeps these stages moving continuously so the conversation feels responsive instead of waiting for the entire call turn to finish." },
      { title: "Conversation management", body: "A production agent also needs turn detection, interruption handling, memory for the current call, and clear instructions. These controls help it pause when the caller speaks, ask for missing information, confirm important details, and avoid inventing answers outside approved knowledge." },
      { title: "Business actions and handoffs", body: "Useful agents connect to calendars, CRMs, help desks, payment workflows, or custom APIs. Permissions should limit which records the agent can read or change, while escalation rules transfer uncertain, sensitive, or high-value conversations to a person with context attached." },
      { title: "How to evaluate one", body: "Test with real phone audio, different accents, interruptions, background noise, ambiguous requests, and tool failures. Measure task completion, transfer quality, latency, accuracy, customer effort, and whether the stored transcript and outcome match what actually happened." },
    ],
    secondaryAction: { href: "/services/voice-agents", label: "Explore voice agents" },
  },
  {
    slug: "ai-voice-agent-pricing-guide",
    kicker: "Pricing Guide",
    title: "AI Voice Agent Pricing: A Complete Cost Guide",
    description: "Build a realistic cost model across platform usage, telephony, speech services, AI models, concurrency, integrations, and ongoing operations.",
    highlights: ["Per-minute cost components", "Setup and operating costs", "Scenario-based comparison"],
    sections: [
      { title: "What contributes to per-minute cost", body: "A call may include carrier charges, speech recognition, language-model usage, text-to-speech, and the voice platform fee. Rates can vary by destination, phone-number type, language, model, voice, recording, and whether billing rounds partial minutes, so one advertised rate rarely represents the complete cost." },
      { title: "Volume, concurrency, and call shape", body: "Estimate monthly calls, average duration, peak simultaneous calls, outbound answer rates, transfers, and retries. Concurrency limits or committed-volume plans can affect capacity and price, while long hold times and failed outbound attempts may add cost without producing a completed outcome." },
      { title: "Implementation and operating costs", body: "Include conversation design, knowledge preparation, integrations, security review, testing, monitoring, quality assurance, and ongoing improvements. Complex workflows with identity checks or write access to business systems usually require more implementation and oversight than simple FAQ calls." },
      { title: "Compare vendors with one scenario", body: "Use the same representative call mix for every quote and calculate a monthly total rather than comparing one headline rate. Confirm what is included, model overage and support charges, then divide the full cost by successful bookings, resolutions, qualified leads, or another business outcome." },
    ],
    secondaryAction: { href: "/services/voice-agents", label: "Explore voice agents" },
  },
  {
    slug: "how-to-build-an-ai-phone-agent",
    kicker: "Implementation Guide",
    title: "How to Build an AI Phone Agent",
    description: "Move from a focused call outcome to a tested phone agent with clear dialogue, connected tools, safe fallbacks, and measurable launch criteria.",
    highlights: ["Outcome-first scope", "Conversation and tool design", "Testing and rollout"],
    sections: [
      { title: "Choose one measurable call outcome", body: "Start with a narrow workflow such as answering a defined set of questions, qualifying a lead, or booking one appointment type. Document who calls, what information is required, what counts as completion, and exactly when the call must move to a person." },
      { title: "Design the conversation", body: "Write the greeting, disclosure, required questions, confirmation steps, recovery prompts, and closing. Add realistic paths for silence, interruptions, corrections, voicemail, language changes, unsupported requests, and callers who do not want to continue with automation." },
      { title: "Connect knowledge and tools safely", body: "Provide approved source material and expose only the actions the workflow needs. Validate inputs before changing a CRM record or calendar, require confirmation for consequential actions, and return a clear fallback when an integration is slow or unavailable." },
      { title: "Test, launch, and improve", body: "Run scripted and unscripted calls across devices, accents, noise levels, and edge cases. Launch to controlled traffic, review transcripts and outcomes frequently, track completion and escalation rates, and publish prompt or workflow changes through an accountable owner." },
    ],
    secondaryAction: { href: "/services/voice-agents", label: "Explore voice agents" },
  },
  {
    slug: "ai-receptionist-vs-answering-service",
    kicker: "Buyer Guide",
    title: "AI Receptionist vs Traditional Answering Service",
    description: "Compare AI and human answering across availability, conversation quality, integrations, escalation, cost structure, and operational fit.",
    highlights: ["AI and human strengths", "Service and cost tradeoffs", "Hybrid operating model"],
    sections: [
      { title: "How the operating models differ", body: "An AI receptionist follows configured knowledge and workflows consistently and can handle many routine calls at once. A traditional answering service relies on trained people who can use judgment and empathy, but availability, wait time, and consistency depend on staffing and the instructions available to each operator." },
      { title: "Compare capability, not only availability", body: "Check whether each option can identify intent, answer business-specific questions, take accurate messages, schedule appointments, route urgent calls, support required languages, and write structured outcomes to your systems. Test the same scenarios with both options." },
      { title: "Understand cost and service risk", body: "AI pricing often follows usage and platform costs, while answering services may charge by minute, call, message, or plan. Include setup, integrations, overflow, after-hours coverage, quality review, and the cost of missed or incorrectly handled calls in the comparison." },
      { title: "When a hybrid model works best", body: "Automation is well suited to repetitive, clearly bounded requests; people remain important for sensitive, unusual, emotional, or high-stakes conversations. A strong hybrid design makes the transfer criteria explicit and gives the human operator the details already collected." },
    ],
    secondaryAction: { href: "/services/voice-agents", label: "Explore voice agents" },
  },
  {
    slug: "inbound-vs-outbound-voice-agents",
    kicker: "Voice AI Strategy",
    title: "Inbound vs Outbound Voice Agents",
    description: "See how call direction changes customer intent, conversation design, consent, campaign controls, metrics, and operational safeguards.",
    highlights: ["Inbound workflow design", "Outbound campaign controls", "Direction-specific metrics"],
    sections: [
      { title: "Inbound starts with customer intent", body: "Inbound callers have already chosen to contact the business, but their reasons can vary widely. The agent needs strong intent detection, fast access to approved knowledge, routing rules, identity checks where necessary, and a reliable path for urgent or unsupported requests." },
      { title: "Outbound starts with permission and purpose", body: "Outbound workflows should begin with a lawful contact basis, clear identification, an approved purpose, appropriate calling windows, and immediate handling of opt-out requests. Campaign controls also need audience selection, concurrency, retry, voicemail, and suppression rules." },
      { title: "Scripts and actions differ", body: "Inbound dialogue is usually flexible because the caller leads with a need. Outbound dialogue should establish relevance quickly and follow a narrower objective such as confirming, reminding, surveying, or qualifying, without pressuring the recipient or hiding the automated nature of the call." },
      { title: "Measure each direction correctly", body: "Inbound metrics may include answer rate, resolution, transfer quality, abandonment, and booking completion. Outbound programs should also track connection, right-party contact, opt-outs, conversion, retries, complaints, and results by list source and calling window." },
    ],
    secondaryAction: { href: "/services/voice-agents", label: "Explore voice agents" },
  },
  {
    slug: "automate-appointment-booking-with-ai",
    kicker: "Scheduling Guide",
    title: "How AI Agents Automate Appointment Booking",
    description: "Connect live availability, scheduling rules, customer details, confirmations, reminders, and exception handling in one phone workflow.",
    highlights: ["Live calendar availability", "Accurate booking confirmation", "Changes and exception handling"],
    sections: [
      { title: "Translate scheduling policy into rules", body: "Define appointment types, duration, staff or location eligibility, buffers, lead time, operating hours, time zones, holidays, and cancellation rules. The agent should offer only slots returned by the scheduling system rather than promising a time from static knowledge." },
      { title: "Collect and confirm the right details", body: "Gather the minimum information needed for the appointment, validate names and contact details, and repeat the selected service, location, date, time, and time zone before booking. Avoid collecting sensitive information that the scheduling workflow does not require." },
      { title: "Create the booking and follow-up", body: "After confirmation, create the calendar event and save the booking reference. Send an approved confirmation through the customer's chosen channel, and use reminders or preparation instructions that are linked to the same appointment record." },
      { title: "Handle changes and failures", body: "Support eligible rescheduling and cancellation with suitable identity checks. If availability changes, the calendar times out, or a policy exception appears, explain the issue, avoid duplicate bookings, and transfer or create a follow-up task with the collected context." },
    ],
    secondaryAction: { href: "/services/voice-agents", label: "Explore voice agents" },
  },
  {
    slug: "voice-ai-call-recording-consent",
    kicker: "Responsible Voice AI",
    title: "Voice AI Call Recording and Consent Guide",
    description: "Learn how to explain AI-assisted calls clearly, ask for permission, respect customer choice, and handle recordings responsibly.",
    highlights: ["Clear call disclosure", "Simple customer choices", "Responsible recording practices"],
    sections: [
      { title: "Explain the call at the beginning", body: "Start with a short introduction that names the business and tells the customer they are speaking with an AI assistant. If the call will be recorded, say so before recording begins. Keep the wording natural and easy to understand instead of hiding it inside a long scripted message." },
      { title: "Give customers a clear choice", body: "Let the customer agree, decline recording, ask for a person, or end the call without unnecessary friction. The agent should recognize these requests immediately and follow the selected path rather than continuing the original workflow." },
      { title: "Collect only what the call needs", body: "Avoid asking for information that is not required to complete the task. Restrict who can access recordings and transcripts, remove sensitive details where appropriate, and delete call data when it is no longer useful for the stated purpose." },
      { title: "Test the complete experience", body: "Before launch, test the introduction, recording notice, customer choices, human transfer, and deletion process. Review the setup whenever the call purpose or recording behavior changes, and confirm the requirements that apply to the regions where the service operates." },
    ],
    secondaryAction: { href: "/services/voice-agents", label: "Explore voice agents" },
  },
  {
    slug: "reduce-voice-agent-latency",
    kicker: "Technical Guide",
    title: "How to Reduce AI Voice Agent Latency",
    description: "Measure and improve endpoint detection, speech recognition, model response, tool execution, speech synthesis, streaming, and network time.",
    highlights: ["Stage-by-stage measurement", "Faster perceived response", "Production latency monitoring"],
    sections: [
      { title: "Measure the full latency budget", body: "Timestamp speech end, endpoint detection, transcript availability, model start, first response token, tool execution, first synthesized audio, and playback. Track median and tail latency separately because a good average can hide slow calls that damage the experience." },
      { title: "Improve turn detection and streaming", body: "Tune endpointing so the agent does not wait too long after the caller finishes or cut off natural pauses. Stream recognition, model output, and speech synthesis where supported, preconnect reusable sessions, and begin safe response segments before the complete answer is generated." },
      { title: "Optimize models, prompts, and tools", body: "Use the smallest model that reliably handles the task, keep instructions and retrieved context focused, cache stable knowledge, and avoid unnecessary model calls. Give APIs strict timeouts, return only required fields, and use a spoken fallback while a slow action is handled safely." },
      { title: "Test under production conditions", body: "Measure across real carrier routes, regions, languages, devices, background noise, concurrency levels, and integration failures. Monitor both component timing and perceived response time, then alert on regressions in high-percentile latency rather than relying only on laboratory tests." },
    ],
    secondaryAction: { href: "/services/voice-agents", label: "Explore voice agents" },
  },
  {
    slug: "voice-ai-use-cases-indian-businesses",
    kicker: "India Voice AI Guide",
    title: "AI Voice Agent Use Cases for Indian Businesses",
    description: "Apply multilingual voice automation to customer support, lead qualification, appointments, logistics, collections, and location-based services in India.",
    highlights: ["Multilingual customer journeys", "High-volume operational calls", "India-ready deployment checks"],
    sections: [
      { title: "Design for multilingual conversation", body: "Indian customer journeys may move between English, Hindi, and regional languages within one call. Test code-switching, names, addresses, local place names, numbers, dates, and industry terms with speakers from the markets you serve rather than treating language support as a translation checkbox." },
      { title: "Support, sales, and appointments", body: "Useful starting points include store or service enquiries, lead qualification, appointment booking, reminders, order status, and after-hours coverage. Keep the first workflow narrow, connect it to current business data, and transfer complex or sensitive requests with the conversation context." },
      { title: "Logistics, field service, and collections", body: "Agents can confirm delivery details, collect service availability, schedule visits, send payment reminders, or record a promised next step. Identity checks, respectful scripts, escalation, and strict limits on what the agent may disclose or negotiate are especially important in these workflows." },
      { title: "Prepare for real operating conditions", body: "Validate local telephony coverage, call quality, peak concurrency, time zones, calling windows, consent and preference handling, data access, and regional support. Pilot with representative customers and measure completion separately by language, workflow, and carrier route." },
    ],
    secondaryAction: { href: "/services/voice-agents", label: "Explore voice agents" },
  },
  {
    slug: "ai-phone-agent-implementation-checklist",
    kicker: "Launch Checklist",
    title: "AI Phone Agent Implementation Checklist",
    description: "Use a practical checklist for scope, conversation design, knowledge, integrations, consent, testing, monitoring, escalation, and controlled rollout.",
    highlights: ["Scope and ownership", "Pre-launch validation", "Monitoring and improvement"],
    sections: [
      { title: "Scope the workflow and ownership", body: "Choose one call type, document the audience and business outcome, set measurable success and stop conditions, and assign owners for content, integrations, compliance, operations, and incident response. Define which requests are supported and which always require a person." },
      { title: "Prepare conversation, data, and tools", body: "Approve the greeting, disclosure, questions, confirmations, fallback language, transfer behavior, and closing. Review knowledge sources, minimize customer data, configure credentials and permissions, validate tool inputs, and make every external action traceable." },
      { title: "Complete pre-launch testing", body: "Test happy paths and edge cases across accents, languages, silence, interruptions, corrections, noise, voicemail, invalid data, unavailable tools, transfers, and opt-outs. Confirm that summaries, recordings where permitted, structured fields, and downstream updates are accurate." },
      { title: "Roll out with monitoring and control", body: "Begin with limited traffic and clear rollback criteria. Monitor answer rate, completion, transfers, latency, errors, complaints, and business outcomes; review sampled calls; protect retention and deletion rules; and require approval before publishing material workflow changes." },
    ],
    secondaryAction: { href: "/services/voice-agents", label: "Explore voice agents" },
  },
];

export const allSeoPages = [...commercialPages, ...integrationPages, ...comparisonPages, ...articlePages];
