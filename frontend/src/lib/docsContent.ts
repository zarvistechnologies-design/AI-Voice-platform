export type DocsBlock =
  | { type: "text"; body: string }
  | { type: "steps"; items: { title: string; body: string }[] }
  | { type: "list"; items: string[] }
  | { type: "note"; body: string; tone?: "info" | "warning" }
  | { type: "code"; language: string; body: string }
  | { type: "table"; headers: string[]; rows: string[][] };

export type DocsTopic = {
  slug: string;
  group: string;
  title: string;
  description: string;
  sections: { title: string; blocks: DocsBlock[] }[];
};

const authHeader = `Authorization: Bearer avp_your_api_key`;
const baseUrl = "https://api.vozon.ai/api/v1";

export const docsTopics: DocsTopic[] = [
  {
    slug: "quickstart",
    group: "Start here",
    title: "Quickstart",
    description: "Create, test, and deploy your first Vozon voice agent.",
    sections: [
      { title: "Before you begin", blocks: [{ type: "list", items: ["A Vozon organization and an Owner, Admin, or Member account.", "A clear business outcome such as qualification, support triage, or appointment booking.", "A test phone number and permission to call it.", "Approved script and knowledge content without credentials or unnecessary personal data."] }] },
      { title: "Launch your first agent", blocks: [{ type: "steps", items: [
        { title: "Create the agent", body: "Open Agents, choose New agent, select a template or start from scratch, and assign a descriptive name." },
        { title: "Configure the conversation", body: "Choose the primary language and voice. Add a first message, goals, boundaries, escalation rules, and a clear completion condition." },
        { title: "Test in the browser", body: "Run realistic conversations. Test interruptions, names, phone numbers, dates, tool failures, and how the agent ends the call." },
        { title: "Connect a number", body: "Import or purchase a number, set its direction, assign the agent, and wait until its status is Ready." },
        { title: "Place a controlled call", body: "Call one approved recipient, then inspect the transcript, recording, latency, outcome, and charge in Call Logs." },
      ] }] },
      { title: "Production gate", blocks: [{ type: "note", tone: "warning", body: "Do not launch a campaign after one happy-path test. Validate silence, interruptions, voicemail, wrong numbers, tool timeouts, language switching, and escalation first." }] },
    ],
  },
  {
    slug: "agents",
    group: "Build",
    title: "Agents",
    description: "Configure voice, language, conversation behavior, tools, and deployment state.",
    sections: [
      { title: "Core configuration", blocks: [{ type: "table", headers: ["Field", "Purpose", "Recommendation"], rows: [
        ["Name", "Identifies the agent in the dashboard and logs.", "Use a purpose-based name such as Hindi Lead Qualifier."],
        ["First message", "The opening message for a new conversation.", "Identify the business, purpose, and expected next step."],
        ["Instructions", "Defines goals, rules, tone, and boundaries.", "Use headings and ordered priorities."],
        ["Language", "Sets primary recognition and speech behavior.", "Match the actual caller language and test mixed-language content."],
        ["Voice", "Controls the audible identity of the agent.", "Preview numbers, names, abbreviations, and domain terms."],
        ["Temperature", "Controls response variability.", "Use lower values for regulated or deterministic workflows."],
      ] }] },
      { title: "Lifecycle", blocks: [{ type: "text", body: "Keep an agent in a non-live state while editing and testing. Move it to Live only after the prompt, knowledge, tools, and phone assignment pass acceptance testing." }, { type: "note", body: "Clone a stable agent before a large prompt or voice change. This preserves a known-good configuration for rollback." }] },
    ],
  },
  {
    slug: "prompting",
    group: "Build",
    title: "Prompting guide",
    description: "Write reliable instructions for natural, controlled calls.",
    sections: [
      { title: "Recommended structure", blocks: [{ type: "code", language: "text", body: `ROLE
You are the appointment coordinator for Example Clinic.

GOAL
Identify the requested service and offer an available appointment.

RULES
1. Confirm the caller's name before booking.
2. Never invent availability, pricing, or medical advice.
3. Ask one question at a time.
4. Read dates and times back for confirmation.

ESCALATION
Transfer or arrange a callback when the caller requests a clinician.

COMPLETION
Summarize the confirmed appointment and the next step.` }] },
      { title: "Reliable behavior", blocks: [{ type: "list", items: ["State business facts explicitly instead of expecting the model to infer them.", "Separate mandatory rules from preferred style.", "Describe when each tool may be called and what must be confirmed first.", "Define a fallback for missing knowledge and failed actions.", "Tell the agent how to handle silence, interruptions, corrections, and voicemail.", "Keep examples fictional and free of customer data."] }] },
    ],
  },
  {
    slug: "languages-and-voices",
    group: "Build",
    title: "Languages and voices",
    description: "Select and validate speech behavior for multilingual deployments.",
    sections: [
      { title: "Selection workflow", blocks: [{ type: "steps", items: [
        { title: "Choose the real conversation language", body: "Select the language callers will actually use, not the language used to write the dashboard prompt." },
        { title: "Preview the voice", body: "Test representative names, addresses, currency, dates, abbreviations, and industry terminology." },
        { title: "Match script and voice", body: "Write native-script content where it improves pronunciation. Avoid inconsistent transliteration." },
        { title: "Run phone-quality tests", body: "Browser previews are useful, but final acceptance must use real calls and realistic background noise." },
      ] }] },
      { title: "Quality checklist", blocks: [{ type: "table", headers: ["Check", "Pass condition"], rows: [["Accent", "Natural and appropriate for the target audience."], ["Numbers", "Phone numbers, prices, dates, and times are unambiguous."], ["Code switching", "Language changes happen only when requested or clearly needed."], ["Pacing", "The caller has enough time to respond without long silence."], ["Pronunciation", "Brand and domain-specific words remain consistent."]] }] },
    ],
  },
  {
    slug: "knowledge",
    group: "Build",
    title: "Knowledge bases",
    description: "Ground agent answers in approved text, documents, and web sources.",
    sections: [
      { title: "Source workflow", blocks: [{ type: "steps", items: [
        { title: "Prepare", body: "Remove outdated content, duplicate sections, credentials, private notes, and data the agent should never disclose." },
        { title: "Add", body: "Attach text, upload a supported file, or provide a public URL from the agent Knowledge section." },
        { title: "Index", body: "Wait for the source to become Ready. Failed sources should be corrected and reindexed." },
        { title: "Test retrieval", body: "Search with real customer wording and confirm the returned passages directly answer the question." },
      ] }, { type: "note", tone: "warning", body: "Knowledge improves grounding but does not replace prompt boundaries. Explicitly instruct the agent not to guess when approved information is absent." }] },
    ],
  },
  {
    slug: "tools-and-integrations",
    group: "Build",
    title: "Tools and integrations",
    description: "Connect approved business actions and data sources to an agent.",
    sections: [
      { title: "Tool contract", blocks: [{ type: "list", items: ["Use a precise action name and description.", "Define required and optional inputs with their expected format.", "Specify what the agent must confirm before invoking the action.", "Return a short success result that can be read naturally.", "Return safe, actionable failures without raw system details.", "Test success, validation failure, timeout, and duplicate execution."] }] },
      { title: "Google Workspace", blocks: [{ type: "steps", items: [
        { title: "Connect", body: "Open Integrations and authorize the organization’s approved Google account." },
        { title: "Choose resources", body: "Select the intended calendar or verify the spreadsheet and worksheet." },
        { title: "Assign to the agent", body: "Enable only the native actions the agent needs and provide the selected resource identifiers." },
        { title: "Test", body: "Create a test event or row, inspect it in Google, then remove the test data." },
      ] }, { type: "note", body: "Use a dedicated business account with the minimum required access. Never place OAuth credentials inside agent instructions." }] },
    ],
  },
  {
    slug: "phone-numbers",
    group: "Deploy",
    title: "Phone numbers",
    description: "Import, purchase, assign, and operate inbound and outbound numbers.",
    sections: [
      { title: "Direction and readiness", blocks: [{ type: "table", headers: ["Direction", "Inbound", "Outbound"], rows: [["Inbound", "Allowed", "Not allowed"], ["Outbound", "Not allowed", "Allowed"], ["Both", "Allowed", "Allowed"]] }, { type: "text", body: "A number must show Ready and be assigned to the intended agent. Changing the assigned agent affects subsequent calls, not calls already in progress." }] },
      { title: "Troubleshooting", blocks: [{ type: "list", items: ["Refresh or synchronize after making changes in the connected phone provider.", "Confirm the number uses E.164 format, for example +919876543210.", "Confirm the assigned agent is Live.", "Confirm outbound direction before triggering an outbound call.", "If a number is already in use, wait for the active call to end before retrying."] }] },
    ],
  },
  {
    slug: "campaigns",
    group: "Deploy",
    title: "Campaigns",
    description: "Create controlled outbound campaigns from lead lists.",
    sections: [
      { title: "Launch workflow", blocks: [{ type: "steps", items: [
        { title: "Prepare leads", body: "Use E.164 phone numbers and include only the metadata needed by the agent." },
        { title: "Create campaign", body: "Select a Live agent and an outbound-ready assigned number." },
        { title: "Apply suppressions", body: "Exclude recipients who opted out, are invalid, or must not be contacted." },
        { title: "Review and launch", body: "Confirm calling permissions, local hours, concurrency, script, and wallet balance." },
        { title: "Monitor", body: "Track queued, active, completed, failed, and suppressed leads. Pause when quality needs review." },
      ] }] },
      { title: "Controls", blocks: [{ type: "table", headers: ["Action", "Effect"], rows: [["Pause", "Stops new calls from starting; active calls continue."], ["Resume", "Continues eligible queued leads."], ["Cancel", "Permanently stops remaining campaign work."], ["Suppress", "Prevents a matching recipient from being called."]] }] },
    ],
  },
  {
    slug: "call-logs",
    group: "Observe",
    title: "Call logs",
    description: "Inspect conversation records, outcomes, performance, and charges.",
    sections: [
      { title: "Call record", blocks: [{ type: "table", headers: ["Area", "Contains"], rows: [["Summary", "Status, direction, participants, duration, timestamps."], ["Conversation", "Transcript and authorized recording access."], ["Performance", "Latency and metered model/speech usage."], ["Outcome", "Structured output, campaign context, and custom metadata."], ["Billing", "Customer charge deducted for the completed call."]] }] },
      { title: "Operational review", blocks: [{ type: "list", items: ["Review failed and unusually short calls first.", "Compare latency changes using similar call types and languages.", "Inspect the transcript before changing voice or recognition settings.", "Export filtered records for offline business analysis.", "Protect recording URLs and downloaded files as customer data."] }] },
    ],
  },
  {
    slug: "billing",
    group: "Observe",
    title: "Billing and invoices",
    description: "Understand the wallet, call charges, payments, and invoice downloads.",
    sections: [
      { title: "Customer charge", blocks: [{ type: "text", body: "Each completed call is charged from the organization wallet. The customer total combines metered call usage and the Vozon platform fee." }, { type: "code", language: "text", body: `customer total = metered call usage + Vozon platform fee
platform fee = call duration in minutes × ₹2

Example:
2-minute metered usage = ₹5.00
Vozon platform fee       = ₹4.00
Customer total           = ₹9.00` }, { type: "note", body: "Dashboard wallet values are stored and displayed in USD credits. Conversion uses the configured billing exchange rate at settlement." }] },
      { title: "Invoices", blocks: [{ type: "steps", items: [{ title: "Open Billing", body: "Go to Dashboard → Billing and find Invoices." }, { title: "Select a payment", body: "Review the invoice number, status, amount, and date." }, { title: "Download", body: "Choose Download invoice. Open the file and use Print / Save PDF when a PDF copy is required." }] }] },
    ],
  },
  {
    slug: "api-authentication",
    group: "API",
    title: "API authentication",
    description: "Create scoped API keys and authenticate server-side requests.",
    sections: [
      { title: "Create a key", blocks: [{ type: "steps", items: [{ title: "Open Developers", body: "Only an Owner or Admin can manage organization API keys." }, { title: "Choose scopes", body: "Use read for retrieval, calls:trigger for outbound calls, and agents:write only when configuration changes are required." }, { title: "Store once", body: "Copy the new key into a secrets manager. The full value should not be shown again." }] }] },
      { title: "Request header", blocks: [{ type: "code", language: "http", body: authHeader }, { type: "note", tone: "warning", body: "API keys are for trusted server environments. Never embed them in browser JavaScript, mobile bundles, public repositories, screenshots, or support messages." }] },
    ],
  },
  {
    slug: "api-calls",
    group: "API",
    title: "Calls API",
    description: "Start outbound calls and retrieve normalized call records.",
    sections: [
      { title: "Endpoints", blocks: [{ type: "table", headers: ["Method", "Path", "Scope"], rows: [["GET", "/agents", "read"], ["POST", "/calls/outbound", "calls:trigger"], ["GET", "/calls", "read"], ["GET", "/calls/{callId}", "read"], ["GET", "/calls/{callId}/recording", "read"], ["GET", "/calls/export.csv", "read"], ["GET", "/calls/stream", "read"]] }] },
      { title: "List-call filters", blocks: [{ type: "table", headers: ["Query", "Description"], rows: [["page", "Page number beginning at 1."], ["limit", "Rows per page from 1 to 100; default 20."], ["agentId", "Return calls for one agent."], ["status", "Return calls with the selected status."], ["direction", "Filter inbound, outbound, or web calls."], ["from", "Earliest start timestamp in ISO 8601 format."], ["to", "Latest start timestamp in ISO 8601 format."]] }] },
      { title: "Create outbound call", blocks: [{ type: "code", language: "curl", body: `curl -X POST "${baseUrl}/calls/outbound" \\
  -H "${authHeader}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agentId": "agent_id",
    "phoneNumber": "+919876543210",
    "metadata": { "customerId": "customer_123" }
  }'` }, { type: "table", headers: ["Field", "Type", "Required", "Description"], rows: [["agentId", "string", "Yes", "A Live agent belonging to the active organization."], ["phoneNumber", "string", "Yes", "Destination in E.164 format."], ["phoneNumberId", "string", "No", "Specific assigned outbound number; otherwise the latest eligible number is used."], ["metadata", "object", "No", "Fictional or business-safe correlation data returned with the call."]] }] },
      { title: "JavaScript", blocks: [{ type: "code", language: "javascript", body: `const response = await fetch("${baseUrl}/calls/outbound", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.VOZON_API_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    agentId: "agent_id",
    phoneNumber: "+919876543210",
    metadata: { customerId: "customer_123" },
  }),
});

if (!response.ok) throw new Error(\`Vozon request failed: \${response.status}\`);
const call = await response.json();` }] },
      { title: "Python", blocks: [{ type: "code", language: "python", body: `import os
import requests

response = requests.post(
    "${baseUrl}/calls/outbound",
    headers={"Authorization": f"Bearer {os.environ['VOZON_API_KEY']}"},
    json={
        "agentId": "agent_id",
        "phoneNumber": "+919876543210",
        "metadata": {"customerId": "customer_123"},
    },
    timeout=30,
)
response.raise_for_status()
call = response.json()` }] },
    ],
  },
  {
    slug: "api-call-object",
    group: "API",
    title: "Call object",
    description: "Reference for normalized call records returned by the API and webhooks.",
    sections: [
      { title: "Example", blocks: [{ type: "code", language: "json", body: `{
  "call": {
    "id": "call_id",
    "call_status": "completed",
    "direction": "outbound",
    "duration": 92,
    "voip": {
      "from": "+918000000001",
      "to": "+919876543210",
      "direction": "outbound"
    },
    "transcription_text": "Customer: Hello\\nAgent: How may I help?",
    "usage": {
      "llmTokens": 1240,
      "sttSeconds": 92,
      "ttsCharacters": 680
    },
    "billing": { "chargedCredits": 0.0842 },
    "structuredOutput": {},
    "metadata": { "customerId": "customer_123" }
  }
}` }] },
      { title: "Fields", blocks: [{ type: "table", headers: ["Field", "Description"], rows: [["id", "Stable Vozon call identifier."], ["call_status", "Current or terminal status."], ["direction", "inbound, outbound, or web."], ["duration", "Connected duration in seconds."], ["voip", "Normalized caller, recipient, and direction."], ["transcription_text", "Final readable transcript when available."], ["usage", "Metered language and speech usage."], ["billing.chargedCredits", "Final customer wallet deduction."], ["structuredOutput", "Agent-defined extracted result."], ["metadata", "Caller-provided safe correlation values."]] }] },
    ],
  },
  {
    slug: "webhooks",
    group: "API",
    title: "Webhooks",
    description: "Receive signed call lifecycle events with safe retry handling.",
    sections: [
      { title: "Events", blocks: [{ type: "table", headers: ["Event", "When sent"], rows: [["call.started", "A call has started."], ["call.ended", "A call reached a completed terminal state."], ["call.failed", "A call reached a failed terminal state."], ["transcript.ready", "The finalized transcript is available."]] }] },
      { title: "Delivery handling", blocks: [{ type: "steps", items: [{ title: "Verify", body: "Validate X-AI-Voice-Signature using the endpoint secret and the unmodified request body before processing the payload." }, { title: "Acknowledge", body: "Return a successful 2xx status promptly and perform slower work asynchronously." }, { title: "Deduplicate", body: "Persist X-AI-Voice-Delivery or the payload event id and ignore a previously processed id." }, { title: "Retry safely", body: "Make downstream work idempotent because failed deliveries can be retried." }] }, { type: "code", language: "javascript", body: `import { createHmac, timingSafeEqual } from "node:crypto";

function validVozonSignature(rawBody, signatureHeader, endpointSecret) {
  const expected = createHmac("sha256", endpointSecret)
    .update(rawBody)
    .digest("hex");
  const received = signatureHeader.replace(/^v1=/, "");
  return expected.length === received.length &&
    timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}` }, { type: "code", language: "json", body: `{
  "id": "call.ended:call_id",
  "event": "call.ended",
  "createdAt": "2026-07-30T12:00:00.000Z",
  "data": {
    "id": "call_id",
    "call_status": "completed",
    "direction": "outbound",
    "duration": 92,
    "billing": { "chargedCredits": 0.0842 }
  }
}` }] },
    ],
  },
  {
    slug: "web-widget",
    group: "Deploy",
    title: "Web voice widget",
    description: "Add an agent-powered voice experience to an approved website.",
    sections: [
      { title: "Configure", blocks: [{ type: "steps", items: [{ title: "Enable widget access", body: "Open the agent Widget settings, generate a public widget key, and save the agent." }, { title: "Set appearance", body: "Choose theme, position, button text, and accent color." }, { title: "Allow the website", body: "Add the production website origin exactly, including https and the intended subdomain." }, { title: "Copy the generated snippet", body: "Use the embed code shown by the dashboard. Do not construct private call credentials yourself." }] }, { type: "note", tone: "warning", body: "The widget key is public by design but must be restricted to approved origins. API keys must never be included in widget code." }] },
    ],
  },
  {
    slug: "errors",
    group: "API",
    title: "Errors and retries",
    description: "Handle validation, authorization, conflicts, limits, and temporary failures.",
    sections: [
      { title: "Status codes", blocks: [{ type: "table", headers: ["Status", "Meaning", "Action"], rows: [["400", "Invalid request", "Correct the input; do not retry unchanged."], ["401", "Authentication failed", "Check the key and Bearer header."], ["403", "Scope or role denied", "Use an authorized role and the required scope."], ["404", "Resource not found", "Confirm the id and active organization."], ["409", "State conflict", "Refresh state and resolve the conflict."], ["429", "Rate limited", "Retry with exponential backoff and jitter."], ["5xx", "Temporary service failure", "Retry idempotent work with bounded backoff."]] }] },
      { title: "Safe retry policy", blocks: [{ type: "code", language: "text", body: `attempt 1: wait about 1 second
attempt 2: wait about 2 seconds
attempt 3: wait about 4 seconds
add random jitter to each delay
stop after a bounded number of attempts` }, { type: "note", body: "Do not automatically retry a call-trigger request unless your application can prove that a call was not already accepted." }] },
    ],
  },
  {
    slug: "troubleshooting",
    group: "Operations",
    title: "Troubleshooting",
    description: "Resolve common authentication, calling, speech, latency, and billing issues.",
    sections: [
      { title: "Common issues", blocks: [{ type: "table", headers: ["Symptom", "Checks"], rows: [
        ["Google origin_mismatch", "Register the exact production origin, including scheme and subdomain, against the deployed client id."],
        ["Outbound call cannot start", "Check wallet minimum, Live agent, assigned Ready number, outbound direction, E.164 destination, and active-call capacity."],
        ["Poor pronunciation", "Confirm language, native script, selected voice, speed, and domain-word prompting; test over a real call."],
        ["High latency", "Compare similar calls; inspect model choice, prompt size, tool time, endpointing, and network conditions."],
        ["Unexpected charge", "Compare duration, usage, customer total, and the wallet transaction for the same call id."],
        ["Widget unavailable", "Check Live status, saved public key, exact allowed origin, microphone permission, and HTTPS."],
        ["Webhook not received", "Check endpoint HTTPS availability, selected events, signature verification, response time, and delivery history."],
      ] }] },
      { title: "Support bundle", blocks: [{ type: "list", items: ["Call id or request id.", "UTC timestamp and affected organization.", "Expected result and actual result.", "HTTP status and sanitized error message.", "Browser and operating system when relevant.", "Reproduction steps without credentials or customer conversation data."] }] },
    ],
  },
  {
    slug: "security",
    group: "Operations",
    title: "Security and privacy",
    description: "Operate Vozon with least privilege and responsible data handling.",
    sections: [
      { title: "Production checklist", blocks: [{ type: "list", items: ["Keep API and integration credentials in a secrets manager.", "Use separate credentials for development and production.", "Apply least-privilege organization roles and API scopes.", "Rotate exposed or departing-user credentials immediately.", "Verify webhook signatures and deduplicate events.", "Limit collection and retention of transcripts, recordings, and metadata.", "Never put personal data or credentials in prompts, source code, logs, screenshots, or documentation.", "Review consent, disclosure, calling hours, suppression, and retention rules for every operating market."] }] },
    ],
  },
];

export function docsTopic(slug: string) {
  return docsTopics.find((topic) => topic.slug === slug);
}
