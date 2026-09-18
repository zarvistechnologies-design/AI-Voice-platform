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
platform fee = call duration in minutes × ₹1.50

Example:
2-minute metered usage = ₹5.00
Vozon platform fee       = ₹4.00
Customer total           = ₹9.00` }, { type: "note", body: "Dashboard balances, usage, recharges, and customer-facing totals are displayed in INR. Provider costs are converted using the configured billing exchange rate." }] },
      { title: "Invoices", blocks: [{ type: "steps", items: [{ title: "Open Billing", body: "Go to Dashboard → Billing and find Invoices." }, { title: "Select a payment", body: "Review the invoice number, status, amount, and date." }, { title: "Download", body: "Choose Download invoice. Open the file and use Print / Save PDF when a PDF copy is required." }] }] },
    ],
  },
  {
    slug: "api-authentication",
    group: "API",
    title: "API authentication",
    description: "Create scoped API keys and authenticate server-side requests with zero ambiguity.",
    sections: [
      { title: "Interactive Explorer", blocks: [{ type: "note", tone: "info", body: "Try our live interactive API Explorer at /docs/api to test endpoints, generate multi-language code snippets, and verify webhook signatures directly in your browser." }] },
      { title: "Generate an API key", blocks: [{ type: "steps", items: [
        { title: "Access Developers settings", body: "Navigate to Dashboard → Developers → API Keys. Only organization Owners and Admins can create or revoke API keys." },
        { title: "Select least-privilege scopes", body: "Choose 'read' for logs/analytics, 'calls:trigger' for outbound calling, 'agents:write' for programmatic prompt updates, or 'full-access' for unconstrained automation." },
        { title: "Save and protect", body: "Store the generated key prefixed with 'avp_' in an encrypted secrets manager (e.g. AWS Secrets Manager, Doppler, or HashiCorp Vault). The key is shown only once." },
      ] }] },
      { title: "Authentication headers", blocks: [
        { type: "text", body: "Vozon supports two authentication headers. You can pass the standard HTTP Bearer header or the x-api-key header:" },
        { type: "code", language: "http", body: `Authorization: Bearer avp_live_your_api_key_here\n# or\nx-api-key: avp_live_your_api_key_here` },
        { type: "table", headers: ["Scope", "Permitted actions", "Recommended for"], rows: [
          ["read", "GET /agents, GET /calls, GET /calls/{id}, GET /calls/stream", "Dashboards, CRM sync, and reporting"],
          ["calls:trigger", "POST /calls/outbound, POST /outbound-calls", "Backend servers triggering automated voice calls"],
          ["agents:write", "Create, update, and publish voice agent configurations", "CI/CD and agent prompt synchronization"],
          ["full-access", "All external API actions", "Internal administrative tooling"],
        ] },
        { type: "note", tone: "warning", body: "Never embed API keys in client-side code (Next.js client components, mobile apps, or frontend scripts). Always make requests from your secure backend server." },
      ] },
    ],
  },
  {
    slug: "api-calls",
    group: "API",
    title: "Calls API",
    description: "Trigger outbound calls, stream real-time events, download recordings, and export call records.",
    sections: [
      { title: "Live Sandbox", blocks: [{ type: "note", tone: "info", body: "Explore and test these endpoints live in the Vozon Interactive API Playground: /docs/api." }] },
      { title: "Endpoints catalog", blocks: [{ type: "table", headers: ["Method", "Endpoint path", "Required scope", "Description"], rows: [
        ["POST", "/calls/outbound", "calls:trigger", "Queue and trigger an outbound voice agent call"],
        ["GET", "/calls", "read", "Query paginated call history with 11 filter parameters"],
        ["GET", "/calls/{callId}", "read", "Retrieve complete normalized call details and transcripts"],
        ["GET", "/calls/{callId}/recording", "read", "Stream or download audio recording file (Range support)"],
        ["GET", "/calls/stream", "read", "Server-Sent Events (SSE) stream of live call state changes"],
        ["GET", "/calls/export.csv", "read", "Download filtered historical calls as a CSV spreadsheet"],
        ["GET", "/agents", "read", "List all organization voice agents and their active models"],
      ] }] },
      { title: "Pre-flight calling checklist", blocks: [{ type: "steps", items: [
        { title: "Agent Live status", body: "Confirm your agent is in 'Live' status in the dashboard. Agents in 'Draft' or 'Review' cannot place outbound calls." },
        { title: "Ready phone number", body: "Ensure your organization has at least one phone number in 'Ready' status with direction 'Outbound' or 'Both' assigned to the agent." },
        { title: "E.164 phone format", body: "The recipient phoneNumber must strictly follow international E.164 format: '+[country_code][number]' with no dashes or spaces (e.g. +919876543210)." },
        { title: "Wallet balance", body: "Verify your organization wallet has sufficient credit balance before triggering calls." },
      ] }] },
      { title: "Create outbound call", blocks: [
        { type: "code", language: "curl", body: `curl -X POST "https://api.vozon.ai/api/v1/calls/outbound" \\
  -H "Authorization: Bearer avp_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agentId": "6701a2b3c4d5e6f7a8b9c0d1",
    "phoneNumber": "+919876543210",
    "metadata": {
      "customerId": "cust_8829",
      "leadSource": "website_demo"
    }
  }'` },
        { type: "table", headers: ["Field", "Type", "Required", "Description"], rows: [
          ["agentId", "string", "Yes", "ID of the Live agent belonging to your organization."],
          ["phoneNumber", "string", "Yes", "Destination phone number in international E.164 format."],
          ["phoneNumberId", "string", "No", "Specific outbound number ID. Defaults to the latest ready number assigned to the agent."],
          ["metadata", "object", "No", "Custom JSON correlation object returned in call logs, transcripts, and webhooks."],
        ] },
        { type: "text", body: "Response (202 Accepted):" },
        { type: "code", language: "json", body: `{
  "callId": "6702b3c4d5e6f7a8b9c0d1e2",
  "roomName": "outbound-call-6701a2b3-1726650000-abcd",
  "participantId": "sip_part_88921",
  "dispatchId": "dispatch_99210"
}` },
      ] },
      { title: "Node.js (TypeScript)", blocks: [{ type: "code", language: "typescript", body: `const response = await fetch("https://api.vozon.ai/api/v1/calls/outbound", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.VOZON_API_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    agentId: "6701a2b3c4d5e6f7a8b9c0d1",
    phoneNumber: "+919876543210",
    metadata: { customerId: "cust_8829" },
  }),
});

if (!response.ok) {
  const err = await response.json();
  throw new Error(\`Vozon API Error \${response.status}: \${err.message}\`);
}

const call = await response.json();
console.log("Call queued:", call.callId);` }] },
      { title: "Python", blocks: [{ type: "code", language: "python", body: `import os
import requests

response = requests.post(
    "https://api.vozon.ai/api/v1/calls/outbound",
    headers={"Authorization": f"Bearer {os.environ['VOZON_API_KEY']}"},
    json={
        "agentId": "6701a2b3c4d5e6f7a8b9c0d1",
        "phoneNumber": "+919876543210",
        "metadata": {"customerId": "cust_8829"},
    },
    timeout=30,
)
response.raise_for_status()
print("Call accepted:", response.json()["callId"])` }] },
      { title: "Real-time streaming (SSE)", blocks: [
        { type: "text", body: "Connect to GET /calls/stream to receive real-time notifications whenever calls start, finish, or error, avoiding unnecessary database polling:" },
        { type: "code", language: "javascript", body: `const eventSource = new EventSource("https://api.vozon.ai/api/v1/calls/stream", {
  headers: { Authorization: \`Bearer \${process.env.VOZON_API_KEY}\` }
});

eventSource.addEventListener("ready", (e) => console.log("Stream connected:", e.data));
eventSource.addEventListener("calls_changed", (e) => {
  console.log("Call update event:", JSON.parse(e.data));
  // Fetch fresh call details or update your UI
});` },
      ] },
    ],
  },
  {
    slug: "api-call-object",
    group: "API",
    title: "Call object reference",
    description: "Normalized call record structure returned by REST endpoints and webhooks.",
    sections: [
      { title: "Complete payload example", blocks: [{ type: "code", language: "json", body: `{
  "call": {
    "id": "6702b3c4d5e6f7a8b9c0d1e2",
    "agentId": "6701a2b3c4d5e6f7a8b9c0d1",
    "agentName": "Clinical Appointment Coordinator",
    "direction": "outbound",
    "status": "completed",
    "callerNumber": "+918000000001",
    "calledNumber": "+919876543210",
    "voip": {
      "from": "+918000000001",
      "to": "+919876543210",
      "direction": "outbound"
    },
    "startedAt": "2026-09-18T10:15:00.000Z",
    "endedAt": "2026-09-18T10:16:32.000Z",
    "durationSeconds": 92,
    "transcription_text": "Customer: Hello?\\n\\nAgent: Hi, this is Dr. Patel's clinic calling to confirm your appointment for tomorrow at 4 PM.\\n\\nCustomer: Yes, I will be there.\\n\\nAgent: Great, thank you!",
    "transcript": [
      {
        "role": "assistant",
        "text": "Hi, this is Dr. Patel's clinic calling to confirm your appointment for tomorrow at 4 PM.",
        "timestamp": "2026-09-18T10:15:02.000Z",
        "interrupted": false
      },
      {
        "role": "user",
        "text": "Yes, I will be there.",
        "timestamp": "2026-09-18T10:15:12.000Z",
        "interrupted": false
      }
    ],
    "recordingUrl": "https://api.vozon.ai/api/v1/calls/6702b3c4d5e6f7a8b9c0d1e2/recording",
    "providers": {
      "llm": { "provider": "openai", "model": "gpt-4o-mini", "totalTokens": 1240 },
      "stt": { "provider": "sarvam", "model": "saarika:v2", "seconds": 92 },
      "tts": { "provider": "sarvam", "model": "bulbul:v1", "characters": 540 }
    },
    "usage": {
      "llmTokens": 1240,
      "sttSeconds": 92,
      "ttsCharacters": 540,
      "avgResponseLatencyMs": 410,
      "responseLatencyP50Ms": 380,
      "responseLatencyP90Ms": 590,
      "responseLatencyP95Ms": 680,
      "responseLatencyP99Ms": 820
    },
    "billing": {
      "chargedCredits": 4.5,
      "providerCost": 2.1,
      "platformFee": 2.4,
      "currency": "INR"
    },
    "sentiment": { "score": 0.88, "label": "positive" },
    "endReason": "agent_completed",
    "structuredOutput": {
      "confirmed": true,
      "rescheduled": false,
      "appointmentTime": "2026-09-19T16:00:00Z"
    },
    "metadata": { "customerId": "cust_8829" }
  }
}` }] },
      { title: "Detailed field reference", blocks: [{ type: "table", headers: ["Field", "Type", "Description"], rows: [
        ["id", "string", "Stable unique call identifier."],
        ["direction", "string", "'inbound', 'outbound', or 'web'."],
        ["status", "string", "'completed', 'failed', 'in-progress', 'ringing', 'busy', 'no-answer', 'canceled'."],
        ["durationSeconds", "integer", "Total connected call duration in seconds."],
        ["voip", "object", "Caller and called numbers with E.164 formatting."],
        ["transcription_text", "string", "Full concatenated conversation transcript."],
        ["transcript", "array", "Timestamped dialog turns with role, content, and interruption flags."],
        ["recordingUrl", "string", "Direct streaming URL for call audio recording with Range header support."],
        ["usage", "object", "LLM tokens, STT seconds, TTS characters, and latency percentiles (p50/p90/p95/p99)."],
        ["billing.chargedCredits", "number", "Exact wallet deduction in organization currency (e.g. INR)."],
        ["sentiment", "object", "Sentiment score (-1.0 to 1.0) and label (positive, neutral, negative)."],
        ["structuredOutput", "object", "Data extracted by the agent (e.g. dates, booking status, custom entities)."],
        ["metadata", "object", "Arbitrary correlation keys provided when triggering the call."],
      ] }] },
    ],
  },
  {
    slug: "webhooks",
    group: "API",
    title: "Webhooks",
    description: "Receive signed call lifecycle events with automatic retry and HMAC SHA-256 validation.",
    sections: [
      { title: "Interactive Signature Verifier", blocks: [{ type: "note", tone: "info", body: "Test and verify your HMAC signature calculation in real time using the interactive sandbox at /docs/api." }] },
      { title: "Subscribed events", blocks: [{ type: "table", headers: ["Event", "Trigger condition", "Key payload data"], rows: [
        ["call.started", "Recipient answers and telephony connects", "callId, agentId, direction, callerNumber, calledNumber"],
        ["call.ended", "Call reaches terminal completed state", "Complete call record with duration, transcript, and charges"],
        ["call.failed", "Call fails to connect or times out", "Error message, destination, endReason"],
        ["transcript.ready", "Post-call speech and structured processing finishes", "Final sanitized transcript and structured JSON extraction"],
      ] }] },
      { title: "Signature verification (Node.js)", blocks: [
        { type: "text", body: "Vozon signs every webhook using your secret (whsec_...). Validate X-AI-Voice-Signature before processing the body:" },
        { type: "code", language: "javascript", body: `import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyVozonSignature(rawBodyBuffer, signatureHeader, endpointSecret) {
  const expected = createHmac("sha256", endpointSecret)
    .update(rawBodyBuffer)
    .digest("hex");
  const received = signatureHeader.replace(/^v1=/, "");
  return (
    expected.length === received.length &&
    timingSafeEqual(Buffer.from(expected), Buffer.from(received))
  );
}` },
      ] },
      { title: "Signature verification (Python)", blocks: [{ type: "code", language: "python", body: `import hmac
import hashlib

def verify_vozon_signature(raw_body_bytes, signature_header, endpoint_secret):
    expected = hmac.new(
        endpoint_secret.encode('utf-8'),
        raw_body_bytes,
        hashlib.sha256
    ).hexdigest()
    received = signature_header.removeprefix("v1=")
    return hmac.compare_digest(expected, received)` }] },
      { title: "Signature verification (Go)", blocks: [{ type: "code", language: "go", body: `package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"strings"
)

func VerifyVozonSignature(rawBody []byte, signatureHeader string, secret string) bool {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(rawBody)
	expected := hex.EncodeToString(mac.Sum(nil))
	received := strings.TrimPrefix(signatureHeader, "v1=")
	return hmac.Equal([]byte(expected), []byte(received))
}` }] },
      { title: "Delivery best practices", blocks: [{ type: "steps", items: [
        { title: "Return HTTP 200 promptly", body: "Acknowledge the webhook with a 2xx status code in under 5 seconds. Offload slow operations (database writes, emails) to background queues." },
        { title: "Deduplicate with X-AI-Voice-Delivery", body: "Vozon includes a unique delivery UUID in the X-AI-Voice-Delivery header. Store this ID to guarantee idempotent handling." },
        { title: "Automatic retry policy", body: "If your server fails or returns non-2xx, deliveries are retried at +1m, +5m, +30m, +2h, and +12h." },
      ] }] },
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
    title: "Errors and troubleshooting matrix",
    description: "Resolve all HTTP status codes and operational error messages without contacting support.",
    sections: [
      { title: "Interactive Troubleshooting", blocks: [{ type: "note", tone: "info", body: "For live interactive testing and zero-contact troubleshooting, visit the interactive explorer at /docs/api." }] },
      { title: "HTTP status code reference", blocks: [{ type: "table", headers: ["Status", "Meaning", "Immediate action"], rows: [
        ["400", "Bad Request", "Fix parameter types or phone formatting (ensure E.164 format with + country code)."],
        ["401", "Unauthorized", "Verify API key in 'Authorization: Bearer avp_...' or regenerate a fresh key."],
        ["403", "Forbidden", "API key lacks required scope (e.g. 'calls:trigger' required for outbound calling)."],
        ["404", "Not Found", "Resource ID does not exist or belongs to a different organization."],
        ["409", "Conflict", "Telephony or capacity conflict (outbound number not ready or wallet balance low)."],
        ["429", "Rate Limited", "Retry with exponential backoff and jitter."],
        ["5xx", "Server Error", "Temporary gateway issue. Retry idempotent requests after a delay."],
      ] }] },
      { title: "Zero-contact error resolution matrix", blocks: [{ type: "table", headers: ["Error message", "Root cause", "Exact 3-step fix"], rows: [
        [
          "Import or buy a phone number with Outbound or Both direction...",
          "Agent has no Ready phone number configured for outbound calling.",
          "1. Open Dashboard → Phone Numbers.\n2. Ensure your number has Direction 'Outbound' or 'Both'.\n3. Assign it to this agent and click Save.",
        ],
        [
          "Destination must be formatted as an E.164 phone number",
          "Phone number is missing country code or plus sign.",
          "1. Format with '+' and country code (e.g. '+919876543210' for India, '+14155552671' for US).\n2. Strip spaces, dashes, and parentheses.\n3. Validate with libphonenumber or regex before calling.",
        ],
        [
          "The selected outbound number changed. Refresh phone numbers before calling.",
          "Channel admission lock due to active concurrent call on the same number.",
          "1. Wait 5 seconds for the active call to complete.\n2. Or purchase additional phone numbers in Dashboard → Phone Numbers.\n3. Or enable multi-channel SIP trunking.",
        ],
        [
          "Invalid or expired API key.",
          "The API key was revoked, expired, or mistyped.",
          "1. Go to Dashboard → Developers → API Keys.\n2. Create a new key.\n3. Update your environment variable and restart your server.",
        ],
        [
          "API key lacks 'calls:trigger' scope",
          "The key was issued with 'read' scope only.",
          "1. Go to Dashboard → Developers.\n2. Create an API key with 'calls:trigger' or 'full-access' scope.\n3. Replace the token in your backend.",
        ],
      ] }] },
      { title: "Exponential backoff implementation", blocks: [
        { type: "text", body: "For 429 and temporary 5xx errors, implement bounded exponential backoff with jitter:" },
        { type: "code", language: "javascript", body: `async function fetchWithRetry(url, options, maxRetries = 4) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.status !== 429 && response.status < 500) {
        return response;
      }
    } catch (err) {
      if (attempt === maxRetries) throw err;
    }
    const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
    await new Promise((r) => setTimeout(r, delay));
  }
}` },
      ] },
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
