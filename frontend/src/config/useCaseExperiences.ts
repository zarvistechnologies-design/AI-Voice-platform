export type UseCaseExperience = {
  label: string;
  heroAccent: string;
  demo: {
    status: string;
    caller: string;
    agent: string;
    action: string;
  };
  proof: Array<{ value: string; label: string }>;
  capabilities: Array<{ eyebrow: string; title: string; body: string; points: string[] }>;
  workflow: Array<{ title: string; body: string }>;
  scenarios: Array<{ title: string; body: string; outcome: string }>;
  integrations: string[];
  faqs: Array<{ question: string; answer: string }>;
};

export const useCaseExperiences: Record<string, UseCaseExperience> = {
  "lead-qualification": {
    label: "Revenue workflow",
    heroAccent: "that reaches the right next step.",
    demo: {
      status: "Lead call active",
      caller: "We need a voice solution for our support team before the next quarter.",
      agent: "I can help with that. How many customer calls does your team handle in a typical month?",
      action: "Intent and implementation timeline captured",
    },
    proof: [
      { value: "24/7", label: "inbound and outbound qualification" },
      { value: "Live", label: "CRM-ready context capture" },
      { value: "Warm", label: "sales handoffs with full context" },
    ],
    capabilities: [
      { eyebrow: "Discovery", title: "Ask the questions your sales team needs", body: "Guide natural conversations around need, fit, timing, authority, and the problem the prospect wants to solve.", points: ["Custom qualification criteria", "Natural follow-up questions", "Required-field validation"] },
      { eyebrow: "Scoring and routing", title: "Move high-intent leads faster", body: "Use captured answers to route qualified prospects, schedule the right meeting, or place other leads into an appropriate follow-up path.", points: ["Intent-based routing", "Priority signals", "Calendar booking"] },
      { eyebrow: "Connected context", title: "Give sales a useful record, not another raw call", body: "Send contact details, qualification answers, summaries, and promised next steps into the systems your team already checks.", points: ["CRM field updates", "Conversation summaries", "Sales notifications"] },
    ],
    workflow: [
      { title: "Define a qualified lead", body: "Choose the questions, positive signals, exclusions, and human handoff conditions for the workflow." },
      { title: "Connect lead context", body: "Make approved campaign, account, product, and CRM information available during the conversation." },
      { title: "Test real conversations", body: "Exercise short answers, objections, uncertainty, interruptions, and requests to speak with sales." },
      { title: "Launch and improve", body: "Review conversion outcomes and refine questions, routing, and follow-up from real call evidence." },
    ],
    scenarios: [
      { title: "Inbound qualification", body: "Answer new inquiries immediately and collect the information needed to determine fit.", outcome: "Faster speed to lead" },
      { title: "Outbound follow-up", body: "Reconnect with interested prospects using campaign and CRM context.", outcome: "More consistent outreach" },
      { title: "Consultation booking", body: "Match qualified callers with the right specialist and schedule the next conversation.", outcome: "Cleaner sales handoffs" },
    ],
    integrations: ["Salesforce", "HubSpot", "Calendly", "Google Calendar", "Slack", "Webhooks"],
    faqs: [
      { question: "Which qualification questions can the agent ask?", answer: "You choose the criteria. Common fields include need, timing, company size, current process, location, product interest, decision process, and preferred next step." },
      { question: "Can qualified leads be transferred immediately?", answer: "Yes. Routing can use qualification answers, urgency, territory, availability, or caller preference to initiate a warm or direct handoff." },
      { question: "Can the results update our CRM?", answer: "Supported integrations and webhooks can create or update records with contact details, structured qualification fields, summaries, and follow-up tasks." },
      { question: "What happens to leads that are not ready?", answer: "The workflow can record the outcome, offer relevant information, schedule a later follow-up, or place the contact into an approved nurture path." },
    ],
  },
  "customer-support": {
    label: "Service workflow",
    heroAccent: "that resolves routine calls clearly.",
    demo: {
      status: "Support call active",
      caller: "My delivery shows completed, but I haven’t received the package.",
      agent: "I’ll check the delivery details and collect what support needs if we have to escalate this.",
      action: "Order context retrieved · exception workflow opened",
    },
    proof: [
      { value: "24/7", label: "routine support coverage" },
      { value: "One", label: "continuous conversation record" },
      { value: "Clear", label: "escalations with useful context" },
    ],
    capabilities: [
      { eyebrow: "Issue triage", title: "Understand the problem before routing it", body: "Identify the product, account, request, urgency, and prior troubleshooting so the right support path starts with context.", points: ["Intent recognition", "Structured issue capture", "Priority detection"] },
      { eyebrow: "Routine resolution", title: "Handle repeatable requests during the call", body: "Use approved knowledge and scoped tools to answer common questions, look up status, and complete permitted support actions.", points: ["Knowledge-grounded answers", "Status lookups", "Approved tool actions"] },
      { eyebrow: "Human escalation", title: "Bring in support when judgment is needed", body: "Transfer sensitive, complex, or unresolved requests with the transcript, collected details, and concise summary attached.", points: ["Warm transfers", "Fallback rules", "Summary-rich tickets"] },
    ],
    workflow: [
      { title: "Choose support intents", body: "Start with high-volume requests that have clear answers, actions, and escalation boundaries." },
      { title: "Connect knowledge and tools", body: "Add approved help content and only the systems required to resolve the selected requests." },
      { title: "Exercise difficult paths", body: "Test missing data, tool failures, angry callers, ambiguous requests, and human escalation." },
      { title: "Review support outcomes", body: "Track resolution, transfer, repeat-contact, and failure patterns to improve the workflow." },
    ],
    scenarios: [
      { title: "Order and account status", body: "Answer repeatable status questions using connected customer and operational data.", outcome: "Shorter support queues" },
      { title: "FAQ resolution", body: "Give consistent answers from approved policies, help content, and service information.", outcome: "More immediate answers" },
      { title: "Complex issue escalation", body: "Collect useful context before moving the customer to the appropriate support specialist.", outcome: "Less caller repetition" },
    ],
    integrations: ["Zendesk", "Intercom", "Salesforce", "HubSpot", "Slack", "Webhooks"],
    faqs: [
      { question: "Which support calls should be automated first?", answer: "Start with frequent, low-risk requests that have clear approved answers or actions, such as status checks, FAQs, basic troubleshooting, and routing." },
      { question: "Can customers still ask for a person?", answer: "Yes. You can define immediate transfer conditions for customer requests, sensitive topics, urgent issues, low confidence, or failed resolution attempts." },
      { question: "How does the agent know our support policies?", answer: "Approved knowledge sources and workflow instructions provide the information the agent may use. Keep them current and test representative questions before launch." },
      { question: "What information is included in a handoff?", answer: "A handoff can include the caller’s intent, account or order context, troubleshooting already attempted, urgency, transcript, and a concise summary." },
    ],
  },
  receptionists: {
    label: "Front-desk workflow",
    heroAccent: "that gives every caller a next step.",
    demo: {
      status: "Inbound call active",
      caller: "I’d like to book a consultation and ask whether you serve my area.",
      agent: "I can check your location first, then show you the available consultation times.",
      action: "Service area confirmed · calendar checked",
    },
    proof: [
      { value: "24/7", label: "front-desk call coverage" },
      { value: "Live", label: "routing and appointment actions" },
      { value: "Never", label: "send a valuable call straight to voicemail" },
    ],
    capabilities: [
      { eyebrow: "First response", title: "Answer immediately with a consistent welcome", body: "Greet callers in your business voice, understand why they called, and start the correct workflow without a rigid phone menu.", points: ["Custom greeting", "Natural intent capture", "Multilingual readiness"] },
      { eyebrow: "Front-desk actions", title: "Handle the routine work behind the call", body: "Answer approved questions, book appointments, take complete messages, and collect the information each department needs.", points: ["Calendar booking", "Message taking", "Business FAQs"] },
      { eyebrow: "Smart routing", title: "Reach the right person without starting over", body: "Transfer callers using department, location, availability, urgency, or the details collected during the conversation.", points: ["Department routing", "Warm handoffs", "After-hours rules"] },
    ],
    workflow: [
      { title: "Map incoming call types", body: "List the questions, bookings, messages, departments, and urgent requests the front desk receives." },
      { title: "Connect business information", body: "Add approved hours, locations, service details, calendars, contacts, and routing rules." },
      { title: "Test the front-desk experience", body: "Call through common, unusual, urgent, and after-hours scenarios before publishing." },
      { title: "Start with overflow or full coverage", body: "Route the desired calls and improve answers and actions from reviewed conversations." },
    ],
    scenarios: [
      { title: "Appointment scheduling", body: "Book, reschedule, and cancel against connected availability during the conversation.", outcome: "More completed bookings" },
      { title: "Call and message routing", body: "Understand the request and send callers or complete messages to the right team.", outcome: "Fewer missed requests" },
      { title: "After-hours coverage", body: "Answer common questions and capture urgent context after the office closes.", outcome: "Always-available front desk" },
    ],
    integrations: ["Google Calendar", "Outlook", "Cal.com", "HubSpot", "Twilio", "Slack"],
    faqs: [
      { question: "What can an AI receptionist do?", answer: "It can greet callers, answer approved questions, schedule appointments, take messages, qualify requests, route calls, and trigger follow-up workflows." },
      { question: "Can it use our existing phone number?", answer: "Deployment options depend on your telephony setup. Existing numbers can often be connected through supported providers or SIP routing." },
      { question: "What happens after business hours?", answer: "You decide which questions and actions remain available, which messages are collected, and which urgent requests reach an on-call destination." },
      { question: "Can different locations have different routing?", answer: "Yes. Workflows can use caller choice, phone number, service area, department, language, operating hours, or captured details to select a location-specific path." },
    ],
  },
  "dispatch-service": {
    label: "Operations workflow",
    heroAccent: "that keeps field work moving.",
    demo: {
      status: "Dispatch call active",
      caller: "The unit stopped cooling and there’s a medical office opening in two hours.",
      agent: "I’ve marked this urgent. I’ll collect the site access details and alert the on-call technician.",
      action: "Priority raised · field alert prepared",
    },
    proof: [
      { value: "Live", label: "urgency and job-detail capture" },
      { value: "Fast", label: "field-team alerts and routing" },
      { value: "One", label: "structured dispatch record" },
    ],
    capabilities: [
      { eyebrow: "Job intake", title: "Capture what dispatch needs on the first call", body: "Collect location, service type, symptoms, access instructions, availability, contact details, and any safety concerns.", points: ["Structured job details", "Address confirmation", "Required-question flows"] },
      { eyebrow: "Priority and routing", title: "Recognize urgent work and alert the right team", body: "Apply service-area, skill, schedule, severity, and on-call rules to choose the next operational action.", points: ["Urgency detection", "Team selection", "On-call escalation"] },
      { eyebrow: "Field coordination", title: "Keep customers and field teams aligned", body: "Send job summaries and alerts, capture changing arrival information, and record each dispatch outcome for review.", points: ["Field notifications", "Customer updates", "Outcome tracking"] },
    ],
    workflow: [
      { title: "Define job types and priorities", body: "Map routine, urgent, unsupported, and safety-sensitive calls to clear operational paths." },
      { title: "Connect teams and service data", body: "Add coverage areas, schedules, skills, on-call contacts, and the tools required to create work." },
      { title: "Test operational exceptions", body: "Exercise missing addresses, unsafe conditions, unavailable crews, duplicate jobs, and escalation failures." },
      { title: "Launch and monitor outcomes", body: "Review intake completeness, response time, routing accuracy, and unresolved dispatch requests." },
    ],
    scenarios: [
      { title: "Emergency service intake", body: "Identify urgent conditions and gather the information an on-call technician needs.", outcome: "Faster escalation" },
      { title: "Routine job scheduling", body: "Collect service details and reserve the appropriate visit or callback window.", outcome: "Cleaner job intake" },
      { title: "Driver and technician updates", body: "Capture arrival changes, access issues, and completed-work outcomes by phone.", outcome: "Better field coordination" },
    ],
    integrations: ["ServiceTitan", "Housecall Pro", "Jobber", "Twilio", "Slack", "Webhooks"],
    faqs: [
      { question: "How does the agent determine urgency?", answer: "You define the signals, questions, keywords, conditions, and safety boundaries for each job type. High-risk or uncertain calls should escalate to a person." },
      { question: "Can jobs be routed by service area or skill?", answer: "Yes. Routing can use location, requested service, required skill, schedule, customer type, priority, or connected operational data." },
      { question: "Can the workflow create a job in our dispatch system?", answer: "Supported integrations and APIs can create or update jobs with the captured details, subject to your system access and validation rules." },
      { question: "What if no field team is available?", answer: "Configure fallback behavior such as an alternate queue, on-call escalation, callback commitment, customer notification, or human dispatch review." },
    ],
  },
};
