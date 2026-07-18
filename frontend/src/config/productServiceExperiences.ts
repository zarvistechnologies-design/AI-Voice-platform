export type ProductServiceExperience = {
  label: string;
  heroTitle: string;
  heroAccent: string;
  proof: Array<{ value: string; label: string }>;
  demo: {
    status: string;
    caller: string;
    agent: string;
    action: string;
  };
  capabilities: Array<{
    eyebrow: string;
    title: string;
    body: string;
    points: string[];
  }>;
  workflow: Array<{ title: string; body: string }>;
  useCases: Array<{ title: string; body: string; outcome: string }>;
  integrations: string[];
  faqs: Array<{ question: string; answer: string }>;
};
export const productServiceExperiences: Record<string, ProductServiceExperience> = {
  "voice-agents": {
    label: "Conversational AI",
    heroTitle: "AI voice agents that handle the call,",
    heroAccent: "not just the greeting.",
    proof: [
      { value: "24/7", label: "inbound and outbound coverage" },
      { value: "Live", label: "tool use during conversations" },
      { value: "Warm", label: "human handoffs with context" },
    ],
    demo: {
      status: "Call in progress",
      caller: "I need to move my appointment to Friday afternoon.",
      agent: "I found two available times. Would 2:30 PM work for you?",
      action: "Calendar availability checked",
    },
    capabilities: [
      {
        eyebrow: "Natural conversation",
        title: "Listen, respond, and recover like a capable teammate",
        body: "Agents follow open-ended speech, interruptions, and changes of mind without forcing callers through a rigid menu.",
        points: ["Intent-aware responses", "Interruption handling", "Configurable voice and speaking style"],
      },
      {
        eyebrow: "Connected actions",
        title: "Complete useful work while the caller is still on the line",
        body: "Connect approved tools so an agent can find information, create records, schedule time, and trigger follow-up workflows.",
        points: ["Calendar and CRM actions", "Knowledge-grounded answers", "Webhooks for custom workflows"],
      },
      {
        eyebrow: "Human escalation",
        title: "Bring in your team when judgment matters",
        body: "Define transfer conditions by intent, urgency, confidence, or customer request and include a concise summary with every handoff.",
        points: ["Warm and cold transfers", "Department-based routing", "Transcript and summary context"],
      },
    ],
    workflow: [
      { title: "Define the job", body: "Choose the calls, outcomes, tone, and boundaries for the agent." },
      { title: "Connect knowledge", body: "Add approved answers, business data, and the tools needed to act." },
      { title: "Test real paths", body: "Review common requests, interruptions, edge cases, and escalation rules." },
      { title: "Launch and improve", body: "Route calls, monitor outcomes, and refine the workflow from real conversations." },
    ],
    useCases: [
      { title: "Customer support", body: "Answer routine questions, look up requests, and escalate complex issues.", outcome: "Shorter wait times" },
      { title: "Lead qualification", body: "Capture intent, fit, timing, and the right next step before sales follows up.", outcome: "Cleaner sales handoffs" },
      { title: "Scheduling", body: "Book, reschedule, or cancel appointments against live availability.", outcome: "Fewer missed opportunities" },
    ],
    integrations: ["Telephony", "CRM", "Calendars", "Help desks", "Knowledge bases", "Webhooks"],
    faqs: [
      { question: "What kinds of calls can a voice agent handle?", answer: "Voice agents work well for repeatable inbound and outbound conversations such as FAQs, qualification, scheduling, status updates, reminders, and routing. Sensitive or unusual requests can be transferred to a person." },
      { question: "Can callers interrupt or speak naturally?", answer: "Yes. The conversation can be configured for natural turn-taking, including interruptions, pauses, and follow-up questions rather than a fixed IVR-style sequence." },
      { question: "Can the agent take actions in our systems?", answer: "Yes. Approved integrations and APIs can let the agent read relevant data or perform scoped actions such as creating a ticket, checking availability, or updating a record." },
      { question: "How are difficult calls handed to a person?", answer: "You define the transfer rules and destination. The receiving teammate can get the caller's intent, collected details, and conversation summary so the customer does not have to start again." },
    ],
  },
  "voice-cloning": {
    label: "Voice creation",
    heroTitle: "Create a recognizable voice,",
    heroAccent: "then keep it under control.",
    proof: [
      { value: "One", label: "consistent voice identity" },
      { value: "Fast", label: "script-to-speech iteration" },
      { value: "Scoped", label: "access and publishing controls" },
    ],
    demo: {
      status: "Voice sample ready",
      caller: "New support greeting Â· Version 04",
      agent: "Warm, clear delivery with the approved brand pronunciation.",
      action: "Awaiting reviewer approval",
    },
    capabilities: [
      {
        eyebrow: "Voice identity",
        title: "Build a reusable voice from an approved recording",
        body: "Create a consistent synthetic voice for authorized speakers and use it across changing scripts without recording every line again.",
        points: ["Guided sample preparation", "Consistent tone across scripts", "Named voice profiles"],
      },
      {
        eyebrow: "Creative control",
        title: "Shape delivery for the message and channel",
        body: "Preview variations and adjust pacing, emphasis, and pronunciation so generated speech fits support, training, or campaign content.",
        points: ["Rapid script previews", "Pronunciation guidance", "Delivery and pacing review"],
      },
      {
        eyebrow: "Responsible use",
        title: "Keep consent and access visible",
        body: "Use documented authorization, limited workspace access, and review steps to keep cloned voices within their approved purpose.",
        points: ["Consent-first setup", "Role-based access", "Review before publishing"],
      },
    ],
    workflow: [
      { title: "Confirm authorization", body: "Document the speaker's consent and the intended uses for the voice." },
      { title: "Prepare a clean sample", body: "Record clear, representative speech with minimal background noise." },
      { title: "Generate and review", body: "Test varied scripts, names, numbers, and important brand terms." },
      { title: "Publish with limits", body: "Give access only to approved teams, projects, and channels." },
    ],
    useCases: [
      { title: "Brand narration", body: "Keep product explainers and announcements in one familiar voice.", outcome: "Consistent brand delivery" },
      { title: "Training content", body: "Update lessons and internal guidance without returning to the studio.", outcome: "Faster content updates" },
      { title: "Localized campaigns", body: "Extend authorized voice content into supported languages and markets.", outcome: "Broader campaign reuse" },
    ],
    integrations: ["Content tools", "Learning platforms", "Campaign systems", "Media libraries", "APIs", "Review workflows"],
    faqs: [
      { question: "What recording is needed to clone a voice?", answer: "A clean recording of the authorized speaker is required. The ideal length and format depend on the voice model and quality target, but clear, varied speech without music or background noise produces the best review sample." },
      { question: "Do I need permission from the speaker?", answer: "Yes. Only clone a voice with explicit authorization from the speaker or the rights holder, and define the permitted use before generating or publishing content." },
      { question: "Can a cloned voice be used for different scripts?", answer: "Yes. Once an approved voice profile is ready, teams can generate new authorized scripts while reviewing pronunciation, tone, and delivery before release." },
      { question: "How do teams prevent unauthorized use?", answer: "Limit access by role and workspace, document allowed use, require review for publishing, and remove access when a project or authorization ends." },
    ],
  },
  "realtime-tts": {
    label: "Text to speech",
    heroTitle: "Turn text into responsive speech,",
    heroAccent: "as the conversation happens.",
    proof: [
      { value: "Stream", label: "audio as text is generated" },
      { value: "Tune", label: "voice, pace, and pronunciation" },
      { value: "Scale", label: "from preview to live workflows" },
    ],
    demo: {
      status: "Audio streaming",
      caller: "Your order is ready for collection at the Indiranagar location.",
      agent: "First audio received while the remaining response is generated.",
      action: "Playback buffer healthy",
    },
    capabilities: [
      {
        eyebrow: "Streaming delivery",
        title: "Start speaking before the full response is complete",
        body: "Stream generated audio in chunks to reduce perceived delay in agents, assistants, IVR flows, and interactive applications.",
        points: ["Incremental audio output", "Conversation-ready playback", "Configurable audio formats"],
      },
      {
        eyebrow: "Speech control",
        title: "Make important words sound right",
        body: "Choose an appropriate voice and guide pace, pronunciation, pauses, and delivery for names, numbers, and domain language.",
        points: ["Voice selection", "Pronunciation handling", "Pace and expression tuning"],
      },
      {
        eyebrow: "Developer workflow",
        title: "Move from a script preview to a live experience",
        body: "Use the same speech layer for prototypes and production, with predictable request handling, observability, and fallback behavior.",
        points: ["API and SDK integration", "Usage visibility", "Retry and fallback design"],
      },
    ],
    workflow: [
      { title: "Send text", body: "Provide complete text or stream response tokens from your application." },
      { title: "Apply voice settings", body: "Select the voice, language, format, and delivery controls." },
      { title: "Receive audio", body: "Begin playback as audio chunks arrive instead of waiting for the full file." },
      { title: "Observe delivery", body: "Track timing, errors, usage, and the experience callers receive." },
    ],
    useCases: [
      { title: "Live AI agents", body: "Speak dynamic responses without breaking the flow of conversation.", outcome: "More responsive calls" },
      { title: "Voice interfaces", body: "Add spoken output to apps, kiosks, and connected experiences.", outcome: "Accessible interaction" },
      { title: "IVR and alerts", body: "Generate changing prompts, status messages, and notifications on demand.", outcome: "Current information" },
    ],
    integrations: ["REST APIs", "WebSockets", "Voice agents", "Telephony", "Web apps", "Mobile apps"],
    faqs: [
      { question: "What makes realtime TTS different from standard TTS?", answer: "Realtime TTS is designed to return playable audio incrementally, which reduces the wait before speech begins and makes it better suited to live conversations and interactive products." },
      { question: "Can pronunciation be customized?", answer: "Pronunciation can be guided for names, acronyms, numbers, and specialist terms. Important scripts should still be previewed with the selected voice and language before launch." },
      { question: "Which audio format should an application use?", answer: "Choose a format supported by the playback or telephony environment, balancing quality, bandwidth, and transcoding needs. The right choice depends on where the audio will be used." },
      { question: "Can it be used outside phone calls?", answer: "Yes. Realtime speech can power web and mobile assistants, accessibility features, kiosks, games, training tools, and other responsive voice interfaces." },
    ],
  },
  "multilingual-speech": {
    label: "Global speech",
    heroTitle: "Speak across markets,",
    heroAccent: "without losing the meaning.",
    proof: [
      { value: "Global", label: "language-ready workflows" },
      { value: "Local", label: "terms and pronunciation" },
      { value: "One", label: "shared operating model" },
    ],
    demo: {
      status: "Language detected",
      caller: "à¤•à¥à¤¯à¤¾ à¤®à¥ˆà¤‚ à¤…à¤ªà¤¨à¥€ à¤¡à¤¿à¤²à¥€à¤µà¤°à¥€ à¤•à¤¾ à¤¸à¤®à¤¯ à¤¬à¤¦à¤² à¤¸à¤•à¤¤à¤¾ à¤¹à¥‚à¤?",
      agent: "à¤¹à¤¾à¤à¥¤ à¤®à¥ˆà¤‚ à¤‰à¤ªà¤²à¤¬à¥à¤§ à¤¸à¤®à¤¯ à¤¦à¥‡à¤– à¤°à¤¹à¥€ à¤¹à¥‚à¤â€”à¤†à¤ª à¤•à¤¿à¤¸ à¤¸à¤®à¤¯ à¤•à¥‹ à¤ªà¥à¤°à¤¾à¤¥à¤®à¤¿à¤•à¤¤à¤¾ à¤¦à¥‡à¤‚à¤—à¥‡?",
      action: "Hindi workflow selected",
    },
    capabilities: [
      {
        eyebrow: "Language experience",
        title: "Let customers use the language that feels natural",
        body: "Recognize the caller's preferred language and continue with the right speech, knowledge, and workflow configuration.",
        points: ["Language-aware routing", "Natural localized speech", "Language switching where supported"],
      },
      {
        eyebrow: "Localized meaning",
        title: "Protect names, policies, and business terminology",
        body: "Review translated prompts and important domain terms so the localized conversation reflects the intended policy rather than a literal script conversion.",
        points: ["Approved localized prompts", "Brand and product terms", "Regional date and number formats"],
      },
      {
        eyebrow: "Shared operations",
        title: "Manage every language from one workflow",
        body: "Reuse business logic and escalation rules across markets while letting local teams review the language and customer experience.",
        points: ["Reusable core logic", "Local reviewer access", "Cross-language reporting"],
      },
    ],
    workflow: [
      { title: "Choose markets", body: "Prioritize languages by customer demand, call type, and operational readiness." },
      { title: "Localize the experience", body: "Adapt prompts, terminology, pronunciations, and regional conventions." },
      { title: "Review with speakers", body: "Test natural calls with fluent reviewers and representative scenarios." },
      { title: "Route and measure", body: "Launch language-aware paths and compare outcomes by market." },
    ],
    useCases: [
      { title: "Regional support", body: "Answer common questions and collect details in a caller's preferred language.", outcome: "More accessible service" },
      { title: "Global scheduling", body: "Handle bookings using local dates, times, locations, and confirmations.", outcome: "Clearer appointments" },
      { title: "Multimarket campaigns", body: "Run consistent outreach while adapting the message for each audience.", outcome: "Faster localization" },
    ],
    integrations: ["Language detection", "Knowledge bases", "CRM", "Telephony", "Translation workflows", "Analytics"],
    faqs: [
      { question: "How should we choose which languages to launch first?", answer: "Start with the languages that represent meaningful call demand and where your team can review scripts, pronunciation, policies, and escalation coverage before going live." },
      { question: "Can one call switch between languages?", answer: "Language switching can be supported depending on the selected speech and agent setup. It should be tested with the actual language pair, voice, terminology, and call environment." },
      { question: "Is translating the original script enough?", answer: "Usually not. Strong localization also adapts tone, dates, numbers, names, policies, and culturally specific phrasing while keeping the underlying business rule consistent." },
      { question: "How are language-specific calls escalated?", answer: "Calls can route by detected or selected language to an appropriate queue or teammate, with the transcript and summary available for a more informed handoff." },
    ],
  },
  "api-access": {
    label: "Developer platform",
    heroTitle: "Put voice workflows inside",
    heroAccent: "the products you already build.",
    proof: [
      { value: "API", label: "agent and speech primitives" },
      { value: "Events", label: "webhooks for workflow state" },
      { value: "Keys", label: "scoped environment access" },
    ],
    demo: {
      status: "Request completed",
      caller: "POST /v1/calls",
      agent: "201 Created Â· call_id: call_7f31",
      action: "Webhook endpoint notified",
    },
    capabilities: [
      {
        eyebrow: "Composable primitives",
        title: "Build around the voice capabilities you need",
        body: "Create agents, initiate calls, generate speech, and retrieve outcomes using focused endpoints that fit an existing backend or application.",
        points: ["Agent and call APIs", "Speech generation", "Structured call results"],
      },
      {
        eyebrow: "Event-driven workflows",
        title: "Respond when the conversation changes state",
        body: "Use signed webhook events to connect call starts, completions, transfers, and outcomes to the rest of your product workflow.",
        points: ["Lifecycle webhooks", "Retry-aware handlers", "Custom outcome processing"],
      },
      {
        eyebrow: "Production controls",
        title: "Separate environments and observe usage",
        body: "Scope credentials, protect server-side secrets, handle errors, and monitor request volume as the integration moves into production.",
        points: ["Environment-specific keys", "Usage and error visibility", "Idempotent integration patterns"],
      },
    ],
    workflow: [
      { title: "Create credentials", body: "Use a server-side key for the appropriate test or production environment." },
      { title: "Make a request", body: "Call the required agent, call, or speech endpoint from your backend." },
      { title: "Handle events", body: "Verify webhook requests and process state changes idempotently." },
      { title: "Monitor and scale", body: "Track latency, failures, limits, and usage as traffic grows." },
    ],
    useCases: [
      { title: "Embedded calling", body: "Start and manage voice workflows from an existing application.", outcome: "One product experience" },
      { title: "Workflow automation", body: "Trigger calls from CRM, support, or operational events.", outcome: "Less manual coordination" },
      { title: "Custom voice UI", body: "Generate and stream speech within a branded interface.", outcome: "Flexible implementation" },
    ],
    integrations: ["REST", "Webhooks", "Backend services", "CRM", "Data platforms", "Observability"],
    faqs: [
      { question: "Where should API keys be stored?", answer: "Keep API keys in a server-side secret store and never expose them in browser or mobile client code. Use separate credentials and least-privilege access for each environment." },
      { question: "How should webhook events be processed?", answer: "Verify the request signature, acknowledge events quickly, queue slower work, and process event identifiers idempotently so retries do not create duplicate actions." },
      { question: "Can we test before making live calls?", answer: "Use a separate development environment, test data, and approved destination numbers where available. Validate the complete event and error path before enabling a production workflow." },
      { question: "What should we monitor in production?", answer: "Track request errors, call outcomes, webhook delivery, end-to-end latency, usage, and any downstream system failures that affect the customer experience." },
    ],
  },
  "team-workflows": {
    label: "Voice operations",
    heroTitle: "Give every team one place",
    heroAccent: "to build and govern agents.",
    proof: [
      { value: "Shared", label: "templates and knowledge" },
      { value: "Clear", label: "review and publishing roles" },
      { value: "Visible", label: "changes and call outcomes" },
    ],
    demo: {
      status: "Ready for review",
      caller: "Renewal reminder agent Â· Draft 12",
      agent: "Legal wording updated and escalation path tested.",
      action: "2 approvals remaining",
    },
    capabilities: [
      {
        eyebrow: "Reusable systems",
        title: "Turn successful call flows into shared templates",
        body: "Standardize prompts, tools, knowledge sources, and transfer rules so teams can launch new agents without rebuilding the operating model.",
        points: ["Agent templates", "Shared knowledge sources", "Reusable escalation patterns"],
      },
      {
        eyebrow: "Review and publishing",
        title: "Make ownership clear before changes go live",
        body: "Assign contributors and reviewers, document the reason for a change, and test the affected paths before publishing a new version.",
        points: ["Defined workspace roles", "Approval checkpoints", "Version-aware releases"],
      },
      {
        eyebrow: "Cross-team visibility",
        title: "Share outcomes without sharing unnecessary access",
        body: "Give operations, support, sales, and leadership the views they need while keeping configuration and sensitive data limited to the right roles.",
        points: ["Role-based workspaces", "Outcome reporting", "Scoped configuration access"],
      },
    ],
    workflow: [
      { title: "Start from a standard", body: "Select an approved template for the call type and business unit." },
      { title: "Adapt the workflow", body: "Update the script, knowledge, actions, routing, and success criteria." },
      { title: "Review and test", body: "Ask the designated owners to evaluate changes and edge cases." },
      { title: "Publish visibly", body: "Launch the approved version and monitor outcomes with stakeholders." },
    ],
    useCases: [
      { title: "Support operations", body: "Keep answers, routing, and ticket actions aligned across queues.", outcome: "Consistent service" },
      { title: "Campaign launches", body: "Reuse reviewed outreach patterns for new segments and regions.", outcome: "Faster launches" },
      { title: "Quality governance", body: "Coordinate reviewers and track the changes made after call findings.", outcome: "Clear accountability" },
    ],
    integrations: ["Identity providers", "Knowledge bases", "CRM", "Help desks", "Messaging", "Analytics"],
    faqs: [
      { question: "Who should be able to publish an agent?", answer: "Publishing should be limited to named owners who understand the workflow, policy, integrations, and test results. Contributors can prepare changes without automatically receiving production access." },
      { question: "Can different teams reuse the same agent setup?", answer: "Shared templates can provide a common starting point for prompts, tools, and guardrails while each team adapts the content and routing required for its workflow." },
      { question: "How should changes be reviewed?", answer: "Review the reason for the change, affected conversations, policy wording, data access, tool actions, fallback behavior, and representative test calls before publishing." },
      { question: "Can access be separated by workspace or role?", answer: "Yes. Use role and workspace boundaries so people can view outcomes or contribute content without receiving unnecessary access to credentials, sensitive data, or production publishing." },
    ],
  },
  "speech-analytics": {
    label: "Call intelligence",
    heroTitle: "Turn every conversation",
    heroAccent: "into structured, useful data.",
    proof: [
      { value: "Search", label: "transcripts and call topics" },
      { value: "Track", label: "outcomes and action items" },
      { value: "Learn", label: "patterns across calls" },
    ],
    demo: {
      status: "Analysis complete",
      caller: "184 calls Â· Returns workflow",
      agent: "Top topic: delivery delay Â· 31% of analyzed calls",
      action: "12 follow-up tasks identified",
    },
    capabilities: [
      {
        eyebrow: "Conversation structure",
        title: "Move beyond a folder of recordings",
        body: "Turn audio into transcripts, summaries, detected topics, outcomes, and action items that teams can search and use.",
        points: ["Transcripts and summaries", "Topic and intent labels", "Outcome extraction"],
      },
      {
        eyebrow: "Operational trends",
        title: "See what is happening across many calls",
        body: "Compare recurring questions, objections, resolution patterns, and call drivers by workflow, team, campaign, or time period.",
        points: ["Trend views", "Workflow comparisons", "Filterable call evidence"],
      },
      {
        eyebrow: "Actionable output",
        title: "Send the finding to the team that can act on it",
        body: "Route structured summaries and follow-up items into customer systems instead of leaving insights isolated in an analytics dashboard.",
        points: ["CRM-ready fields", "Ticket and task creation", "Exports and webhooks"],
      },
    ],
    workflow: [
      { title: "Capture the call", body: "Ingest the recording and relevant metadata under the appropriate policy." },
      { title: "Structure the content", body: "Create a transcript, summary, topics, outcomes, and action items." },
      { title: "Review patterns", body: "Filter trends and open the underlying calls to validate the finding." },
      { title: "Close the loop", body: "Send next steps to owners and measure whether the workflow improves." },
    ],
    useCases: [
      { title: "Support analysis", body: "Find common contact drivers, repeat issues, and unresolved requests.", outcome: "Better service design" },
      { title: "Sales intelligence", body: "Track objections, competitor mentions, intent, and promised follow-ups.", outcome: "Stronger coaching" },
      { title: "Operations reporting", body: "Compare call outcomes and demand across locations or workflows.", outcome: "Clearer priorities" },
    ],
    integrations: ["Call recordings", "CRM", "Help desks", "Data warehouses", "BI tools", "Webhooks"],
    faqs: [
      { question: "What can be extracted from a call?", answer: "Depending on the configured analysis, a call can produce a transcript, summary, topics, intent, outcome, named action items, and workflow-specific fields." },
      { question: "Can teams verify an analytics finding?", answer: "Yes. Trend views should link back to the relevant calls, transcript segments, and metadata so reviewers can validate a pattern rather than relying only on an aggregate label." },
      { question: "How is call data sent to other tools?", answer: "Structured fields, summaries, and action items can be sent through supported integrations, exports, or webhooks to CRM, support, and data systems." },
      { question: "What privacy controls should we consider?", answer: "Define a lawful recording and analysis policy, limit collected data, set appropriate access and retention, redact sensitive information where needed, and review requirements for every operating region." },
    ],
  },
  "sentiment-detection": {
    label: "Conversation signals",
    heroTitle: "Know when a call",
    heroAccent: "needs more care.",
    proof: [
      { value: "Live", label: "conversation signals" },
      { value: "Flag", label: "calls for focused review" },
      { value: "Trend", label: "changes over time" },
    ],
    demo: {
      status: "Escalation suggested",
      caller: "I have already called twice and still do not have an update.",
      agent: "Frustration signal increased after repeated-contact mention.",
      action: "Priority support route prepared",
    },
    capabilities: [
      {
        eyebrow: "Contextual signals",
        title: "Evaluate tone together with what was said",
        body: "Use acoustic and conversational context to identify possible frustration, urgency, confusion, satisfaction, or high intent.",
        points: ["Conversation-level signals", "Changes during the call", "Configurable signal thresholds"],
      },
      {
        eyebrow: "Timely escalation",
        title: "Turn a signal into an appropriate response",
        body: "Combine sentiment with intent, account context, and business rules before prioritizing a call or inviting a human teammate.",
        points: ["Priority routing", "Supervisor notifications", "Context-rich handoffs"],
      },
      {
        eyebrow: "Quality learning",
        title: "Find the moments worth reviewing",
        body: "Focus quality review on calls with meaningful changes and compare the underlying evidence to improve prompts, coaching, and service design.",
        points: ["Flagged-call queues", "Transcript evidence", "Sentiment trend reporting"],
      },
    ],
    workflow: [
      { title: "Choose useful signals", body: "Define which emotional or urgency patterns matter for the workflow." },
      { title: "Set context rules", body: "Combine signals with intent, phrases, customer status, and call history." },
      { title: "Define the response", body: "Route, notify, flag, or continue based on the strength and risk." },
      { title: "Review accuracy", body: "Sample the underlying calls and tune thresholds with human reviewers." },
    ],
    useCases: [
      { title: "Service recovery", body: "Identify calls that may need faster help or a supervisor response.", outcome: "Earlier intervention" },
      { title: "Quality assurance", body: "Prioritize reviews around frustration, confusion, or major tone changes.", outcome: "Focused QA effort" },
      { title: "Sales coaching", body: "Review moments where interest rose, objections appeared, or confidence fell.", outcome: "Better coaching context" },
    ],
    integrations: ["Voice agents", "Contact center", "Help desks", "CRM", "QA workflows", "Notifications"],
    faqs: [
      { question: "Does sentiment detection know exactly how a caller feels?", answer: "No. Sentiment is a probabilistic signal, not a certain reading of a person's internal state. It should support human judgment and workflow rules rather than make high-impact decisions by itself." },
      { question: "Can sentiment trigger a live transfer?", answer: "It can contribute to an escalation rule, ideally alongside conversation content, intent, customer context, and clear thresholds to reduce unnecessary transfers." },
      { question: "How should accuracy be evaluated?", answer: "Use representative calls, human-reviewed labels, different languages and call conditions, and error analysis. Review false positives and false negatives for each intended workflow." },
      { question: "Can sentiment be compared over time?", answer: "Yes. Teams can aggregate configured signals by workflow or period, then inspect the relevant calls to understand what changed and whether the trend is meaningful." },
    ],
  },
  "conversation-insights": {
    label: "Customer intelligence",
    heroTitle: "Find the themes hiding",
    heroAccent: "across every customer call.",
    proof: [
      { value: "Group", label: "calls by intent and theme" },
      { value: "Compare", label: "segments and workflows" },
      { value: "Trace", label: "insights to call evidence" },
    ],
    demo: {
      status: "New pattern detected",
      caller: "Delivery questions Â· Last 30 days",
      agent: "Weekend availability mentioned 2.4Ã— more often.",
      action: "View 38 supporting conversations",
    },
    capabilities: [
      {
        eyebrow: "Theme discovery",
        title: "Group related needs without reading every transcript",
        body: "Cluster conversations around recurring questions, objections, requests, and outcomes while preserving access to the source evidence.",
        points: ["Intent and theme grouping", "Emerging topic discovery", "Evidence-linked summaries"],
      },
      {
        eyebrow: "Meaningful comparison",
        title: "Understand where and when a pattern occurs",
        body: "Compare themes by customer segment, product, campaign, team, region, channel, or time period using the metadata relevant to your business.",
        points: ["Segment filters", "Period-over-period views", "Workflow comparisons"],
      },
      {
        eyebrow: "Decision support",
        title: "Turn customer language into prioritized work",
        body: "Share concise findings with product, support, revenue, and operations teams and track the changes those findings inspire.",
        points: ["Shareable insight views", "Finding ownership", "Follow-up workflow connections"],
      },
    ],
    workflow: [
      { title: "Define the question", body: "Choose a business decision, customer segment, and useful call set." },
      { title: "Discover patterns", body: "Group themes, compare frequency, and identify changes or anomalies." },
      { title: "Validate the evidence", body: "Read representative transcripts and listen where necessary." },
      { title: "Assign the response", body: "Give the finding an owner, next action, and way to measure impact." },
    ],
    useCases: [
      { title: "Voice of customer", body: "Surface the features, issues, and language customers repeat most.", outcome: "Evidence-backed priorities" },
      { title: "Campaign learning", body: "Compare objections and questions across audiences and messages.", outcome: "Sharper positioning" },
      { title: "Process discovery", body: "Find policies or handoffs that repeatedly create customer effort.", outcome: "Smoother operations" },
    ],
    integrations: ["Transcripts", "CRM", "Product analytics", "Data warehouses", "BI tools", "Collaboration tools"],
    faqs: [
      { question: "How are conversation insights different from call summaries?", answer: "A summary describes one conversation. Conversation insights examine patterns across a set of calls, such as recurring topics, changes over time, or differences between customer segments." },
      { question: "Can a team inspect the calls behind a finding?", answer: "Yes. Useful insights should remain traceable to representative transcripts, recordings where permitted, and call metadata so teams can validate the interpretation." },
      { question: "Which teams can use conversation insights?", answer: "Product, support, sales, marketing, and operations teams can use the same conversation data for different questions while working from controlled, role-appropriate views." },
      { question: "How do we avoid misleading trends?", answer: "Use a representative call set, compare absolute volume as well as percentages, inspect examples, account for workflow changes, and avoid treating a small or biased sample as the whole customer base." },
    ],
  },
  "quality-controls": {
    label: "AI governance",
    heroTitle: "Keep every voice workflow",
    heroAccent: "inside the boundaries you approve.",
    proof: [
      { value: "Test", label: "critical paths before launch" },
      { value: "Limit", label: "answers, actions, and access" },
      { value: "Review", label: "the calls that need attention" },
    ],
    demo: {
      status: "Guardrail activated",
      caller: "Can you make an exception and approve this today?",
      agent: "This request requires an authorized teammate. I can connect you now.",
      action: "Restricted action blocked",
    },
    capabilities: [
      {
        eyebrow: "Behavior boundaries",
        title: "Define what an agent may say and do",
        body: "Ground answers in approved sources, restrict tool permissions, and specify when the agent should decline, clarify, or bring in a person.",
        points: ["Approved knowledge scope", "Least-privilege tools", "Fallback and transfer rules"],
      },
      {
        eyebrow: "Pre-launch testing",
        title: "Exercise the difficult paths before callers do",
        body: "Build tests around common requests, sensitive topics, ambiguous language, integration failures, and attempts to move the agent outside its role.",
        points: ["Scenario-based test sets", "Edge-case review", "Release checkpoints"],
      },
      {
        eyebrow: "Focused oversight",
        title: "Review evidence and feed improvements back",
        body: "Flag conversations by risk, uncertainty, outcome, or sampling rules and turn findings into tracked prompt, policy, or workflow changes.",
        points: ["Targeted review queues", "Call-level evidence", "Documented remediation"],
      },
    ],
    workflow: [
      { title: "Classify the risk", body: "Identify sensitive data, high-impact actions, and calls requiring human judgment." },
      { title: "Set boundaries", body: "Limit knowledge, permissions, responses, and escalation behavior." },
      { title: "Test and approve", body: "Run representative and adversarial scenarios before publishing." },
      { title: "Monitor and revise", body: "Review calls, investigate failures, and ship controlled improvements." },
    ],
    useCases: [
      { title: "Policy adherence", body: "Keep answers aligned with current approved guidance and escalation rules.", outcome: "More consistent calls" },
      { title: "Action safety", body: "Restrict which records, bookings, or workflow changes an agent can make.", outcome: "Controlled automation" },
      { title: "Quality review", body: "Sample routine calls and prioritize uncertain or high-risk conversations.", outcome: "Efficient oversight" },
    ],
    integrations: ["Identity and access", "Knowledge bases", "Audit data", "QA workflows", "Alerts", "Reporting"],
    faqs: [
      { question: "What should be tested before an agent launches?", answer: "Test common tasks, ambiguous requests, prohibited topics, sensitive data, tool failures, escalation paths, interruptions, silence, and realistic attempts to move the agent beyond its approved role." },
      { question: "How can agent actions be limited?", answer: "Give tools the minimum permissions required, validate inputs in downstream systems, require confirmation for consequential actions, and route higher-impact decisions to authorized people." },
      { question: "Which calls should humans review?", answer: "Use a mix of random sampling and targeted review based on failed outcomes, low confidence, escalation, sensitive topics, complaints, unusual duration, or other workflow-specific risk signals." },
      { question: "Do quality controls guarantee compliance?", answer: "No. They help teams implement and observe boundaries, but each organization remains responsible for legal, regulatory, security, and policy review for its specific data, industry, and operating regions." },
    ],
  },
};
