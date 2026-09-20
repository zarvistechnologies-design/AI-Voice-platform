"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

type ParameterDef = {
  name: string;
  in: "path" | "query" | "header" | "body";
  type: string;
  required: boolean;
  defaultValue?: string;
  description: string;
  example?: string;
};

type ResponseExample = {
  status: number;
  label: string;
  description: string;
  payload: unknown;
};

type ApiEndpoint = {
  id: string;
  section: string;
  title: string;
  method: HttpMethod;
  path: string;
  scope: string;
  summary: string;
  description: string;
  preflightChecks?: string[];
  parameters: ParameterDef[];
  requestBodyExample?: Record<string, unknown>;
  responses: ResponseExample[];
  troubleshooting?: { error: string; cause: string; fix: string }[];
};

const BASE_URL_DEFAULT = "https://api.vozon.ai/api/v1";

const ENDPOINTS: ApiEndpoint[] = [
  {
    id: "overview",
    section: "Getting Started",
    title: "Overview & Base URL",
    method: "GET",
    path: "/",
    scope: "public",
    summary: "API conventions, base endpoints, and regional availability.",
    description:
      "The Vozon Voice API allows you to trigger automated phone calls with AI agents, fetch real-time transcripts, stream call state changes over Server-Sent Events (SSE), download call recordings, and receive verified webhooks. All API endpoints require HTTPS and return standard JSON responses.",
    parameters: [
      {
        name: "Accept",
        in: "header",
        type: "string",
        required: false,
        defaultValue: "application/json",
        description: "Expected media type for response payloads.",
      },
    ],
    responses: [
      {
        status: 200,
        label: "200 OK",
        description: "API Gateway is operational.",
        payload: {
          status: "ok",
          service: "vozon-voice-api",
          version: "v1",
          documentation: "https://www.vozon.ai/docs/api",
        },
      },
    ],
  },
  {
    id: "auth",
    section: "Getting Started",
    title: "Authentication & Scopes",
    method: "GET",
    path: "/agents",
    scope: "read",
    summary: "Authenticate requests using scoped Bearer API keys.",
    description:
      "All requests to the Vozon API must include your organization API key prefixed with `avp_`. You can authenticate using either the standard HTTP `Authorization: Bearer avp_...` header or the `x-api-key: avp_...` header. API keys can be restricted to specific scopes to enforce least-privilege security.",
    parameters: [
      {
        name: "Authorization",
        in: "header",
        type: "string",
        required: true,
        defaultValue: "Bearer avp_live_your_key_here",
        description: "HTTP Bearer token header containing your Vozon API key.",
        example: "Bearer avp_7x8k2m9q_sample",
      },
      {
        name: "x-api-key",
        in: "header",
        type: "string",
        required: false,
        defaultValue: "",
        description: "Alternative custom header accepting the raw `avp_...` key.",
      },
    ],
    responses: [
      {
        status: 200,
        label: "200 Authorized",
        description: "Valid API key with permitted scope.",
        payload: {
          authenticated: true,
          orgId: "org_98214abc",
          scopes: ["read", "calls:trigger"],
        },
      },
      {
        status: 401,
        label: "401 Unauthorized",
        description: "Missing, expired, or invalid API key.",
        payload: {
          statusCode: 401,
          message: "Invalid or expired API key. Generate a new key in Dashboard → Developers.",
        },
      },
      {
        status: 403,
        label: "403 Forbidden",
        description: "API key does not have the required permission scope.",
        payload: {
          statusCode: 403,
          message: "API key lacks 'calls:trigger' scope required for outbound calling.",
        },
      },
    ],
    troubleshooting: [
      {
        error: "401 Invalid or expired API key",
        cause: "The API key was revoked, expired, or mistyped (must start with 'avp_').",
        fix: "Go to Dashboard → Developers → API Keys, generate a fresh key, and store it in your secrets manager.",
      },
      {
        error: "403 Missing required API scope",
        cause: "The key was created with 'read' scope only and cannot trigger outbound calls.",
        fix: "Create a new API key with the 'calls:trigger' or 'full-access' scope.",
      },
    ],
  },
  {
    id: "agents-list",
    section: "Voice Agents",
    title: "List Voice Agents",
    method: "GET",
    path: "/agents",
    scope: "read",
    summary: "Retrieve all voice agents configured in your organization.",
    description:
      "Returns a list of all voice agents belonging to the authenticated organization. Use this endpoint to discover agent IDs, active models, language configs, and current deployment status.",
    parameters: [
      {
        name: "Authorization",
        in: "header",
        type: "string",
        required: true,
        defaultValue: "Bearer avp_live_your_key_here",
        description: "API Key Bearer token.",
      },
    ],
    responses: [
      {
        status: 200,
        label: "200 Success",
        description: "Returns an array of configured agents.",
        payload: {
          agents: [
            {
              _id: "6701a2b3c4d5e6f7a8b9c0d1",
              name: "Clinical Appointment Coordinator",
              status: "Live",
              language: "Hindi",
              multilingualEnabled: true,
              voice: "sarvam-shashi",
              pipelineMode: "pipeline",
              llmProvider: "openai",
              llmModel: "gpt-4o-mini",
              sttProvider: "sarvam",
              sttModel: "saarika:v2",
              ttsProvider: "sarvam",
              ttsModel: "bulbul:v1",
            },
            {
              _id: "6701a2b3c4d5e6f7a8b9c0d2",
              name: "Outbound Qualification Assistant",
              status: "Live",
              language: "English",
              voice: "alloy",
              pipelineMode: "realtime",
              realtimeProvider: "openai",
              realtimeModel: "gpt-4o-realtime-preview",
            },
          ],
        },
      },
    ],
  },
  {
    id: "outbound-call",
    section: "Outbound Calling",
    title: "Create Outbound Call",
    method: "POST",
    path: "/calls/outbound",
    scope: "calls:trigger",
    summary: "Trigger an AI voice agent to place an outbound phone call.",
    description:
      "Dispatches an outbound SIP phone call to a recipient. Once the recipient answers, the assigned AI voice agent starts the conversation, listens to speech, executes tools, and captures transcripts and analytics.",
    preflightChecks: [
      "Agent must be published in 'Live' status (Draft/Review agents cannot dial).",
      "Organization must have a phone number in 'Ready' status with direction 'Outbound' or 'Both' assigned to this agent.",
      "Organization wallet credits must be positive.",
      "Destination phone number must be strictly formatted in international E.164 format (e.g. +919876543210).",
    ],
    parameters: [
      {
        name: "agentId",
        in: "body",
        type: "string",
        required: true,
        defaultValue: "6701a2b3c4d5e6f7a8b9c0d1",
        description: "The unique ID of the Live voice agent to execute the call.",
        example: "6701a2b3c4d5e6f7a8b9c0d1",
      },
      {
        name: "phoneNumber",
        in: "body",
        type: "string",
        required: true,
        defaultValue: "+919876543210",
        description: "Recipient phone number formatted in E.164 (country code + subscriber digits).",
        example: "+919876543210",
      },
      {
        name: "phoneNumberId",
        in: "body",
        type: "string",
        required: false,
        defaultValue: "",
        description: "Specific outbound caller ID number ID. If omitted, the latest ready number assigned to the agent is used.",
      },
      {
        name: "metadata",
        in: "body",
        type: "object",
        required: false,
        defaultValue: '{"customerId":"cust_8829","source":"lead_form"}',
        description: "Custom key-value JSON object returned in call logs, transcripts, and webhooks for correlation with your CRM.",
      },
    ],
    requestBodyExample: {
      agentId: "6701a2b3c4d5e6f7a8b9c0d1",
      phoneNumber: "+919876543210",
      metadata: {
        customerId: "cust_8829",
        leadSource: "facebook_ads",
        appointmentType: "consultation",
      },
    },
    responses: [
      {
        status: 202,
        label: "202 Accepted",
        description: "Outbound call successfully queued and telephony SIP session initialized.",
        payload: {
          callId: "6702b3c4d5e6f7a8b9c0d1e2",
          roomName: "outbound-call-6701a2b3-1726650000-abcd",
          participantId: "sip_part_88921",
          dispatchId: "dispatch_99210",
          dispatch: {
            id: "dispatch_99210",
            agentName: "vozon-voice-agent",
            state: "created",
            room: "outbound-call-6701a2b3-1726650000-abcd",
            region: "ap-south-1",
          },
        },
      },
      {
        status: 400,
        label: "400 Bad Request",
        description: "Invalid phone number format or invalid payload.",
        payload: {
          statusCode: 400,
          message: "Destination must be formatted as an E.164 phone number (e.g. +919876543210).",
        },
      },
      {
        status: 409,
        label: "409 Telephony Conflict",
        description: "No eligible outbound number, agent not Live, or capacity lock.",
        payload: {
          statusCode: 409,
          message: "Import or buy a phone number with Outbound or Both direction before starting outbound calls.",
        },
      },
    ],
    troubleshooting: [
      {
        error: "409 Import or buy a phone number with Outbound or Both direction...",
        cause: "The agent does not have an active phone number configured for Outbound calling.",
        fix: "Go to Dashboard → Phone Numbers, click on your number, ensure Direction is set to 'Outbound' or 'Both', and confirm it is assigned to this Agent.",
      },
      {
        error: "409 The selected outbound number changed / admission locked",
        cause: "Another concurrent call is already utilizing this specific single-channel phone number.",
        fix: "Wait a moment for the channel to release, or attach additional phone numbers or multi-channel trunking in Dashboard → Phone Numbers.",
      },
      {
        error: "400 Phone number must be in E.164 format",
        cause: "The destination phone number is missing a plus sign or country code (e.g. '9876543210' instead of '+919876543210').",
        fix: "Ensure all numbers start with a plus sign followed by country code, e.g., '+91' for India, '+1' for US/Canada.",
      },
    ],
  },
  {
    id: "calls-list",
    section: "Call Logs & History",
    title: "List & Filter Calls",
    method: "GET",
    path: "/calls",
    scope: "read",
    summary: "Query historical call records with pagination and multi-field filters.",
    description:
      "Retrieve normalized call records with complete support for pagination, agent filtering, call status, direction, sentiment, date ranges, and full-text search across transcripts and phone numbers.",
    parameters: [
      {
        name: "page",
        in: "query",
        type: "integer",
        required: false,
        defaultValue: "1",
        description: "Page number for pagination (starts at 1).",
      },
      {
        name: "limit",
        in: "query",
        type: "integer",
        required: false,
        defaultValue: "20",
        description: "Number of records per page (1 to 100).",
      },
      {
        name: "agentId",
        in: "query",
        type: "string",
        required: false,
        defaultValue: "",
        description: "Filter calls handled by a specific agent ID.",
      },
      {
        name: "status",
        in: "query",
        type: "string",
        required: false,
        defaultValue: "",
        description: "Filter by status: completed, in-progress, ringing, failed, busy, no-answer, canceled.",
      },
      {
        name: "direction",
        in: "query",
        type: "string",
        required: false,
        defaultValue: "",
        description: "Filter by direction: inbound, outbound, web.",
      },
      {
        name: "sentiment",
        in: "query",
        type: "string",
        required: false,
        defaultValue: "",
        description: "Filter by sentiment: positive, neutral, negative.",
      },
      {
        name: "search",
        in: "query",
        type: "string",
        required: false,
        defaultValue: "",
        description: "Full-text search query across transcripts, caller phone, and called phone.",
      },
      {
        name: "from",
        in: "query",
        type: "string",
        required: false,
        defaultValue: "",
        description: "ISO 8601 start date (e.g. 2026-09-01T00:00:00Z).",
      },
      {
        name: "to",
        in: "query",
        type: "string",
        required: false,
        defaultValue: "",
        description: "ISO 8601 end date (e.g. 2026-09-18T23:59:59Z).",
      },
    ],
    responses: [
      {
        status: 200,
        label: "200 OK",
        description: "Paginated list of normalized call records.",
        payload: {
          calls: [
            {
              id: "6702b3c4d5e6f7a8b9c0d1e2",
              agentId: "6701a2b3c4d5e6f7a8b9c0d1",
              agentName: "Clinical Appointment Coordinator",
              direction: "outbound",
              status: "completed",
              callerNumber: "+918000000001",
              calledNumber: "+919876543210",
              durationSeconds: 92,
              transcription_text: "Customer: Hello?\n\nAgent: Hi, this is Dr. Patel's clinic calling to confirm your appointment.",
              recordingUrl: "https://api.vozon.ai/api/v1/calls/6702b3c4d5e6f7a8b9c0d1e2/recording",
              sentiment: { score: 0.82, label: "positive" },
              billing: { chargedCredits: 4.5, currency: "INR" },
              startedAt: "2026-09-18T10:15:00.000Z",
              endedAt: "2026-09-18T10:16:32.000Z",
            },
          ],
          pagination: {
            page: 1,
            limit: 20,
            total: 142,
            pages: 8,
          },
        },
      },
    ],
  },
  {
    id: "call-detail",
    section: "Call Logs & History",
    title: "Get Call Details",
    method: "GET",
    path: "/calls/{callId}",
    scope: "read",
    summary: "Retrieve full details, transcripts, latencies, tokens, and billing for a call.",
    description:
      "Fetches the complete normalized call record including full timestamped dialog turns, STT/LLM/TTS token counts, response latency percentiles (p50, p90, p95, p99), billing deductions, and extracted structured JSON outputs.",
    parameters: [
      {
        name: "callId",
        in: "path",
        type: "string",
        required: true,
        defaultValue: "6702b3c4d5e6f7a8b9c0d1e2",
        description: "The unique ID of the call to retrieve.",
        example: "6702b3c4d5e6f7a8b9c0d1e2",
      },
    ],
    responses: [
      {
        status: 200,
        label: "200 OK",
        description: "Complete call object.",
        payload: {
          call: {
            id: "6702b3c4d5e6f7a8b9c0d1e2",
            agentId: "6701a2b3c4d5e6f7a8b9c0d1",
            agentName: "Clinical Appointment Coordinator",
            direction: "outbound",
            status: "completed",
            voip: {
              from: "+918000000001",
              to: "+919876543210",
              direction: "outbound",
            },
            durationSeconds: 92,
            transcription_text: "Customer: Hello?\n\nAgent: Hi, this is Dr. Patel's clinic calling to confirm your appointment for tomorrow at 4 PM.\n\nCustomer: Yes, I will be there.\n\nAgent: Great, we look forward to seeing you. Have a great day!",
            transcript: [
              {
                role: "assistant",
                text: "Hi, this is Dr. Patel's clinic calling to confirm your appointment for tomorrow at 4 PM.",
                timestamp: "2026-09-18T10:15:02.000Z",
                interrupted: false,
              },
              {
                role: "user",
                text: "Yes, I will be there.",
                timestamp: "2026-09-18T10:15:12.000Z",
                interrupted: false,
              },
            ],
            providers: {
              llm: { provider: "openai", model: "gpt-4o-mini", totalTokens: 1240 },
              stt: { provider: "sarvam", model: "saarika:v2", seconds: 92 },
              tts: { provider: "sarvam", model: "bulbul:v1", characters: 540 },
            },
            usage: {
              llmTokens: 1240,
              sttSeconds: 92,
              ttsCharacters: 540,
              avgResponseLatencyMs: 410,
              responseLatencyP50Ms: 380,
              responseLatencyP90Ms: 590,
              responseLatencyP95Ms: 680,
              responseLatencyP99Ms: 820,
            },
            billing: {
              chargedCredits: 4.5,
              providerCost: 2.1,
              platformFee: 2.4,
              currency: "INR",
            },
            sentiment: { score: 0.88, label: "positive" },
            endReason: "agent_completed",
            structuredOutput: {
              confirmed: true,
              rescheduled: false,
              notes: "Caller confirmed tomorrow 4 PM appointment.",
            },
            metadata: { customerId: "cust_8829" },
            recordingUrl: "https://api.vozon.ai/api/v1/calls/6702b3c4d5e6f7a8b9c0d1e2/recording",
            recording_url: "https://api.vozon.ai/api/v1/calls/6702b3c4d5e6f7a8b9c0d1e2/recording",
            recording: {
              url: "https://api.vozon.ai/api/v1/calls/6702b3c4d5e6f7a8b9c0d1e2/recording",
              downloadUrl: "https://api.vozon.ai/api/v1/calls/6702b3c4d5e6f7a8b9c0d1e2/recording",
              status: "completed",
              durationSeconds: 92,
              contentType: "audio/mp3",
            },
          },
        },
      },
      {
        status: 404,
        label: "404 Not Found",
        description: "Call ID does not exist or does not belong to active organization.",
        payload: {
          statusCode: 404,
          message: "Call record not found.",
        },
      },
    ],
  },
  {
    id: "recording-download",
    section: "Audio Recordings",
    title: "Download Call Recording",
    method: "GET",
    path: "/calls/{callId}/recording",
    scope: "read",
    summary: "Download or stream the audio recording file with Range header support.",
    description:
      "Streams the raw audio recording of the conversation. Supports HTTP 206 Partial Content using the standard `Range: bytes=start-end` header, allowing native HTML5 audio players and browsers to seek seamlessly without buffering the entire file.",
    parameters: [
      {
        name: "callId",
        in: "path",
        type: "string",
        required: true,
        defaultValue: "6702b3c4d5e6f7a8b9c0d1e2",
        description: "The unique ID of the call whose recording is requested.",
      },
      {
        name: "Range",
        in: "header",
        type: "string",
        required: false,
        defaultValue: "bytes=0-1048576",
        description: "Optional byte range for progressive seeking in audio players.",
      },
    ],
    responses: [
      {
        status: 200,
        label: "200 Audio Stream",
        description: "Returns binary audio file (e.g. audio/mp4, audio/mpeg, or audio/webm).",
        payload: "[Binary Audio Data - audio/mp4 (920 KB)]",
      },
      {
        status: 206,
        label: "206 Partial Content",
        description: "Returns requested byte range for progressive audio scrubbing.",
        payload: "[Binary Audio Range Content - bytes 0-1048575/942080]",
      },
      {
        status: 404,
        label: "404 Recording Not Found",
        description: "Recording is still encoding or not available for this call.",
        payload: {
          statusCode: 404,
          message: "Recording file not found.",
        },
      },
    ],
  },
  {
    id: "calls-stream",
    section: "Real-Time Streaming",
    title: "Stream Call Events (SSE)",
    method: "GET",
    path: "/calls/stream",
    scope: "read",
    summary: "Stream real-time call lifecycle changes using Server-Sent Events (SSE).",
    description:
      "Establishes a persistent Server-Sent Events stream. Whenever any call starts, updates, or completes in your organization, an event is pushed immediately. Eliminates periodic polling and ensures instant UI and webhook sync.",
    parameters: [
      {
        name: "agentId",
        in: "query",
        type: "string",
        required: false,
        defaultValue: "",
        description: "Optional filter to stream updates only for a single agent.",
      },
    ],
    responses: [
      {
        status: 200,
        label: "200 Event Stream",
        description: "Continuous text/event-stream socket.",
        payload: `event: ready\ndata: {"connectedAt":"2026-09-18T11:00:00.000Z"}\n\nevent: calls_changed\nid: 1726657205000\ndata: {"changedAt":"2026-09-18T11:00:05.000Z"}\n\n: keepalive 1726657235000`,
      },
    ],
  },
  {
    id: "calls-export",
    section: "Call Logs & History",
    title: "Export Calls to CSV",
    method: "GET",
    path: "/calls/export.csv",
    scope: "read",
    summary: "Stream an export of historical call records as a CSV spreadsheet.",
    description:
      "Streams all matching call records directly into a CSV file. Supports the exact same filtering parameters as `GET /calls` (date ranges, agent ID, status, and search).",
    parameters: [
      {
        name: "from",
        in: "query",
        type: "string",
        required: false,
        defaultValue: "",
        description: "Start date filter in ISO format.",
      },
      {
        name: "to",
        in: "query",
        type: "string",
        required: false,
        defaultValue: "",
        description: "End date filter in ISO format.",
      },
    ],
    responses: [
      {
        status: 200,
        label: "200 CSV File",
        description: "Returns stream with header Content-Type: text/csv; charset=utf-8",
        payload: `"Call ID","Started At","Duration Seconds","Direction","Status","Caller Number","Called Number","Agent","Charged Credits"\n"6702b3c4d5e6f7a8b9c0d1e2","2026-09-18T10:15:00.000Z","92","outbound","completed","+918000000001","+919876543210","Clinical Coordinator","4.50"`,
      },
    ],
  },
  {
    id: "bulk-sync-guide",
    section: "Call Logs & History",
    title: "Bulk Sync & Download Everything",
    method: "GET",
    path: "/calls?page=1&limit=100",
    scope: "read",
    summary: "Complete recipe to bulk export and download all call transcripts, telemetry, and MP3 recording files.",
    description:
      "Need to archive, backup, or sync all past call audio recordings and transcriptions into your internal data warehouse, S3 bucket, Salesforce, or HubSpot? This endpoint supports pagination up to 100 calls per request, providing direct links to signed MP3 audio files, turn-by-turn timestamps, and AI-extracted metadata.",
    parameters: [
      {
        name: "page",
        in: "query",
        type: "integer",
        required: false,
        defaultValue: "1",
        description: "The page number to retrieve (starts at 1).",
        example: "1",
      },
      {
        name: "limit",
        in: "query",
        type: "integer",
        required: false,
        defaultValue: "100",
        description: "Number of call records per page (up to 100).",
        example: "100",
      },
      {
        name: "status",
        in: "query",
        type: "string",
        required: false,
        defaultValue: "",
        description: "Filter by status (e.g. completed, failed).",
        example: "completed",
      },
    ],
    responses: [
      {
        status: 200,
        label: "200 Batch Sync",
        description: "List of calls with pagination cursor, full transcriptions, and audio links.",
        payload: {
          calls: [
            {
              id: "6702b3c4d5e6f7a8b9c0d1e2",
              call_id: "6702b3c4d5e6f7a8b9c0d1e2",
              status: "completed",
              durationSeconds: 92,
              transcription_text: "Customer: Hello...\nAgent: Hi, calling to confirm appointment tomorrow at 4 PM.\nCustomer: Yes, confirmed!",
              recording_url: "https://api.vozon.ai/api/v1/calls/6702b3c4d5e6f7a8b9c0d1e2/recording",
              recording: {
                url: "https://api.vozon.ai/api/v1/calls/6702b3c4d5e6f7a8b9c0d1e2/recording",
                downloadUrl: "https://api.vozon.ai/api/v1/calls/6702b3c4d5e6f7a8b9c0d1e2/recording",
                status: "completed",
                durationSeconds: 92,
                contentType: "audio/mp3",
              },
              structuredOutput: { confirmed: true, preferredTime: "tomorrow 4 PM" },
            },
          ],
          pagination: {
            page: 1,
            limit: 100,
            total: 340,
            pages: 4,
          },
        },
      },
    ],
  },
  {
    id: "webhooks-guide",
    section: "Webhooks",
    title: "Webhook Subscriptions & HMAC",
    method: "POST",
    path: "https://your-domain.com/webhook",
    scope: "public",
    summary: "Receive signed real-time HTTP webhooks with cryptographic HMAC SHA-256 verification.",
    description:
      "Vozon delivers secure HTTP POST webhooks for call lifecycle events. Every delivery is signed with HMAC SHA-256 using your endpoint secret `whsec_...` and passed in the `X-AI-Voice-Signature: v1=<signature>` header. If your server is down, Vozon automatically retries with exponential backoff (1m, 5m, 30m, 2h, 12h).",
    parameters: [
      {
        name: "X-AI-Voice-Signature",
        in: "header",
        type: "string",
        required: true,
        defaultValue: "v1=a1b2c3d4e5f6...32_byte_hex",
        description: "HMAC SHA-256 signature calculated over the raw request body using your endpoint secret.",
      },
      {
        name: "X-AI-Voice-Event",
        in: "header",
        type: "string",
        required: true,
        defaultValue: "call.ended",
        description: "Event type: call.started, call.ended, call.failed, or transcript.ready.",
      },
      {
        name: "X-AI-Voice-Delivery",
        in: "header",
        type: "string",
        required: true,
        defaultValue: "del_998124_uuid",
        description: "Unique delivery UUID to ensure idempotency and prevent duplicate processing.",
      },
    ],
    responses: [
      {
        status: 200,
        label: "call.ended Event Payload",
        description: "Delivered immediately upon call completion.",
        payload: {
          id: "call.ended:6702b3c4d5e6f7a8b9c0d1e2",
          event: "call.ended",
          createdAt: "2026-09-18T10:16:35.000Z",
          data: {
            id: "6702b3c4d5e6f7a8b9c0d1e2",
            agentId: "6701a2b3c4d5e6f7a8b9c0d1",
            agentName: "Clinical Appointment Coordinator",
            direction: "outbound",
            status: "completed",
            duration: 92,
            from_number: "+918000000001",
            to_number: "+919876543210",
            transcription_text: "Customer: Hello?\nAgent: Hi, this is Dr. Patel's clinic...",
            billing: { chargedCredits: 4.5, currency: "INR" },
            structuredOutput: { confirmed: true },
            metadata: { customerId: "cust_8829" },
          },
        },
      },
      {
        status: 200,
        label: "transcript.ready Event Payload",
        description: "Delivered when transcript indexing and structured extraction conclude.",
        payload: {
          id: "transcript.ready:6702b3c4d5e6f7a8b9c0d1e2",
          event: "transcript.ready",
          createdAt: "2026-09-18T10:16:38.000Z",
          data: {
            callId: "6702b3c4d5e6f7a8b9c0d1e2",
            sentiment: "positive",
            structuredOutput: { confirmed: true, notes: "Confirmed 4 PM" },
          },
        },
      },
    ],
    troubleshooting: [
      {
        error: "Signature verification failed",
        cause: "Using parsed JSON instead of the raw unmodified request body string, or omitting the 'v1=' prefix strip.",
        fix: "In Express/Node.js, ensure you use express.raw({ type: 'application/json' }) before JSON parsing. Strip 'v1=' before comparison.",
      },
      {
        error: "Deliveries showing 'Retrying' or 'Failed'",
        cause: "Your webhook endpoint took more than 10 seconds to respond, or returned an HTTP status code outside the 2xx range.",
        fix: "Return HTTP 200 immediately upon receiving the event and offload any heavy database or email tasks to a background queue.",
      },
    ],
  },
  {
    id: "create-campaign",
    section: "Campaigns & High-Volume Outbound",
    title: "Create Calling Campaign",
    method: "POST",
    path: "/campaigns",
    scope: "calls:trigger",
    summary: "Create an automated high-volume outbound calling campaign with scheduling and pacing.",
    description:
      "Sets up a batch calling campaign linked to a voice agent and dedicated caller ID. Configures daily call windows (e.g. 09:00 - 19:00), concurrency limits (e.g. 5 concurrent calls), local timezone constraints, and automated retries.",
    parameters: [
      {
        name: "name",
        in: "body",
        type: "string",
        required: true,
        defaultValue: "Q4 Customer Reactivation",
        description: "Descriptive campaign name.",
        example: "Q4 Customer Reactivation",
      },
      {
        name: "agentId",
        in: "body",
        type: "string",
        required: true,
        defaultValue: "6701a2b3c4d5e6f7a8b9c0d1",
        description: "The unique ID of the voice agent assigned to place calls.",
        example: "6701a2b3c4d5e6f7a8b9c0d1",
      },
      {
        name: "phoneNumberId",
        in: "body",
        type: "string",
        required: true,
        defaultValue: "6701a2b3c4d5e6f7a8b9c0d2",
        description: "Ready outbound phone number assigned to the selected agent.",
        example: "6701a2b3c4d5e6f7a8b9c0d2",
      },
      {
        name: "concurrency",
        in: "body",
        type: "integer",
        required: false,
        defaultValue: "3",
        description: "Maximum simultaneous calls, capped by the selected agent's capacity.",
        example: "3",
      },
      {
        name: "windowStart",
        in: "body",
        type: "string",
        required: false,
        defaultValue: "09:00",
        description: "Start of permissible calling hours in HH:mm format.",
        example: "09:00",
      },
      {
        name: "windowEnd",
        in: "body",
        type: "string",
        required: false,
        defaultValue: "19:00",
        description: "End of permissible calling hours in HH:mm format.",
        example: "19:00",
      },
      {
        name: "timezone",
        in: "body",
        type: "string",
        required: false,
        defaultValue: "Asia/Kolkata",
        description: "IANA timezone for evaluating legal calling windows.",
        example: "Asia/Kolkata",
      },
    ],
    requestBodyExample: {
      name: "Q4 Customer Reactivation",
      agentId: "6701a2b3c4d5e6f7a8b9c0d1",
      phoneNumberId: "6701a2b3c4d5e6f7a8b9c0d2",
      concurrency: 3,
      windowStart: "09:00",
      windowEnd: "19:00",
      timezone: "Asia/Kolkata",
      dailyLimit: 250,
      maxAttempts: 2,
      retryGapSeconds: 86400,
      goal: "Reconnect with inactive customers",
      successCriteria: "Customer agrees to a product demonstration",
      respectDnc: true,
      requireConsentLine: true,
      detectVoicemail: true,
      automaticCallbacks: true,
    },
    responses: [
      {
        status: 201,
        label: "201 Created",
        description: "Campaign created successfully in draft status.",
        payload: {
          campaign: {
            _id: "6702b3c4d5e6f7a8b9c0d1e2",
            name: "Q4 Customer Reactivation",
            status: "draft",
            agentId: "6701a2b3c4d5e6f7a8b9c0d1",
            phoneNumberId: "6701a2b3c4d5e6f7a8b9c0d2",
            concurrency: 3,
            windowStart: "09:00",
            windowEnd: "19:00",
            timezone: "Asia/Kolkata",
            totalLeads: 0,
            completedLeads: 0,
            createdAt: "2026-09-18T11:00:00.000Z",
          },
        },
      },
    ],
  },
  {
    id: "list-campaigns",
    section: "Campaigns & High-Volume Outbound",
    title: "List Campaigns & Progress",
    method: "GET",
    path: "/campaigns",
    scope: "read",
    summary: "Retrieve all outbound campaigns with real-time lead progress and completion statistics.",
    description:
      "Fetches all campaigns in your organization, including their current execution status (draft, running, paused, completed), total leads queued, active calls in-flight, and completion percentages.",
    parameters: [
      {
        name: "status",
        in: "query",
        type: "string",
        required: false,
        defaultValue: "",
        description: "Filter by status: running, paused, completed, or draft.",
        example: "running",
      },
    ],
    responses: [
      {
        status: 200,
        label: "200 OK",
        description: "List of campaigns with lead counts.",
        payload: {
          campaigns: [
            {
              _id: "6702b3c4d5e6f7a8b9c0d1e2",
              name: "Q4 Customer Reactivation",
              status: "running",
              agentId: "6701a2b3c4d5e6f7a8b9c0d1",
              concurrency: 3,
              stats: {
                total: 500,
                processed: 312,
                failed: 18,
                progressPercent: 62.4,
              },
              createdAt: "2026-09-18T10:00:00.000Z",
            },
          ],
        },
      },
    ],
  },
  {
    id: "add-campaign-leads",
    section: "Campaigns & High-Volume Outbound",
    title: "Upload Campaign Leads",
    method: "POST",
    path: "/campaigns/{campaignId}/leads",
    scope: "calls:trigger",
    summary: "Add phone numbers and customer metadata to an outbound calling campaign.",
    description:
      "Uploads lead phone numbers in batch. Each lead can include customer name and custom key-value metadata (e.g. account tier, pending invoice amount, personalized variables) which the AI agent dynamically references during the live phone call.",
    parameters: [
      {
        name: "campaignId",
        in: "path",
        type: "string",
        required: true,
        defaultValue: "6702b3c4d5e6f7a8b9c0d1e2",
        description: "The unique ID of the target campaign.",
        example: "6702b3c4d5e6f7a8b9c0d1e2",
      },
      {
        name: "leads",
        in: "body",
        type: "array",
        required: true,
        defaultValue: `[{"phone": "+919876543210", "name": "Aarav Sharma", "customFields": {"accountType": "enterprise", "renewalMonth": "October"}}]`,
        description: "Array of 1 to 500 lead objects with phone in E.164 format.",
      },
    ],
    requestBodyExample: {
      leads: [
        {
          phone: "+919876543210",
          name: "Aarav Sharma",
          customFields: {
            accountType: "enterprise",
            renewalMonth: "October",
          },
        },
        {
          phone: "+919876543211",
          name: "Meera Nair",
          customFields: {
            accountType: "standard",
            renewalMonth: "November",
          },
        },
      ],
    },
    responses: [
      {
        status: 201,
        label: "201 Created",
        description: "Leads queued successfully.",
        payload: {
          inserted: 2,
          duplicates: 0,
          total: 502,
          suppressed: 0,
        },
      },
    ],
  },
  {
    id: "launch-campaign",
    section: "Campaigns & High-Volume Outbound",
    title: "Launch / Start Campaign",
    method: "POST",
    path: "/campaigns/{campaignId}/launch",
    scope: "calls:trigger",
    summary: "Initiate automatic outbound dialing across queued campaign leads.",
    description:
      "Transitions a draft campaign to `running`, or to `scheduled` when a future start is supplied. The dialing scheduler respects concurrency, calling windows, daily limits, retry rules, and DNC suppression.",
    parameters: [
      {
        name: "campaignId",
        in: "path",
        type: "string",
        required: true,
        defaultValue: "6702b3c4d5e6f7a8b9c0d1e2",
        description: "The campaign ID to launch.",
        example: "6702b3c4d5e6f7a8b9c0d1e2",
      },
      {
        name: "mode",
        in: "body",
        type: "string",
        required: false,
        defaultValue: "now",
        description: "Use now to begin when eligible, or schedule with scheduledAt.",
        example: "now",
      },
    ],
    requestBodyExample: {
      mode: "now",
    },
    responses: [
      {
        status: 200,
        label: "200 OK",
        description: "Campaign launched and active.",
        payload: {
          campaign: {
            _id: "6702b3c4d5e6f7a8b9c0d1e2",
            status: "running",
            startedAt: "2026-09-18T11:30:00.000Z",
            concurrency: 3,
          },
        },
      },
    ],
  },
  {
    id: "get-campaign-results",
    section: "Campaigns & High-Volume Outbound",
    title: "Get Campaign Results",
    method: "GET",
    path: "/campaigns/{campaignId}/results",
    scope: "read",
    summary: "Retrieve campaign outcomes, funnel performance, verified business results, and INR costs.",
    description:
      "Returns campaign-level totals and a daily timeline. Use the leads endpoint for contact-level outcome, callback, evidence, transcript, and recording details.",
    parameters: [
      {
        name: "campaignId",
        in: "path",
        type: "string",
        required: true,
        defaultValue: "6702b3c4d5e6f7a8b9c0d1e2",
        description: "The campaign ID to report.",
        example: "6702b3c4d5e6f7a8b9c0d1e2",
      },
    ],
    responses: [
      {
        status: 200,
        label: "200 OK",
        description: "Campaign performance and business outcomes.",
        payload: {
          summary: {
            contacts: 1000,
            attempts: 1084,
            connected: 712,
            qualified: 164,
            resolved: 89,
            callbacksScheduled: 37,
            verifiedAppointments: 82,
            verifiedPayments: 41,
            attributedRevenue: 246000,
            totalCost: 18420.5,
            costPerGoal: 72.81,
            pickupRate: 65.7,
            goalRate: 25.3,
            analysisCoverage: 96.4,
            currency: "INR",
          },
          funnel: {
            contacts: 1000,
            attempted: 958,
            connected: 698,
            classified: 964,
            goals: 253,
            verifiedConversions: 123,
          },
          timeline: [],
        },
      },
    ],
  },
  {
    id: "list-phone-numbers",
    section: "Phone Numbers & Telephony",
    title: "List Phone Numbers",
    method: "GET",
    path: "/phone-numbers",
    scope: "read",
    summary: "List all provisioned telephony phone numbers, routing directions, and assigned agents.",
    description:
      "Retrieves your organization's acquired phone numbers. Displays telephone capabilities (inbound, outbound, or both), operational status (ready, pending), and which AI voice agent answers inbound calls on that number.",
    parameters: [
      {
        name: "direction",
        in: "query",
        type: "string",
        required: false,
        defaultValue: "",
        description: "Filter by direction: inbound, outbound, or both.",
        example: "both",
      },
    ],
    responses: [
      {
        status: 200,
        label: "200 OK",
        description: "List of telephony phone numbers.",
        payload: {
          phoneNumbers: [
            {
              id: "pn_881920",
              phoneNumber: "+918000000001",
              countryCode: "IN",
              direction: "both",
              status: "ready",
              assignedAgent: {
                id: "6701a2b3c4d5e6f7a8b9c0d1",
                name: "Customer Support Agent",
              },
              inboundEnabled: true,
              outboundEnabled: true,
              createdAt: "2026-08-01T08:00:00.000Z",
            },
          ],
        },
      },
    ],
  },
  {
    id: "list-knowledge-bases",
    section: "Knowledge Bases & RAG",
    title: "List Knowledge Bases & Sources",
    method: "GET",
    path: "/knowledge-bases",
    scope: "read",
    summary: "Retrieve grounded knowledge base documents, public URLs, and indexing statuses.",
    description:
      "Fetches all knowledge base collections attached to your voice agents. Lists uploaded files (PDF/DOCX), crawled website URLs, vector embedding statuses (ready, indexing, failed), and chunk counts used to ground AI responses with zero hallucination.",
    parameters: [
      {
        name: "agentId",
        in: "query",
        type: "string",
        required: false,
        defaultValue: "",
        description: "Filter sources attached to a specific voice agent.",
        example: "6701a2b3c4d5e6f7a8b9c0d1",
      },
    ],
    responses: [
      {
        status: 200,
        label: "200 OK",
        description: "List of knowledge base collections.",
        payload: {
          knowledgeBases: [
            {
              id: "kb_99210",
              name: "Product FAQs & Return Policy",
              agentId: "6701a2b3c4d5e6f7a8b9c0d1",
              sourcesCount: 4,
              status: "ready",
              sources: [
                {
                  id: "src_101",
                  type: "url",
                  title: "Return Policy Guide",
                  url: "https://example.com/returns",
                  status: "ready",
                  chunksCount: 28,
                  updatedAt: "2026-09-10T14:00:00.000Z",
                },
                {
                  id: "src_102",
                  type: "file",
                  title: "Pricing_Matrix_2026.pdf",
                  status: "ready",
                  chunksCount: 64,
                  updatedAt: "2026-09-12T09:30:00.000Z",
                },
              ],
            },
          ],
        },
      },
    ],
  },
];

type CodeLanguage = "curl" | "node" | "python" | "go" | "php";

function parseBodyParameter(param: ParameterDef, value: string): unknown {
  if (["array", "object", "integer", "number", "boolean"].includes(param.type)) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

function generateSnippet(
  endpoint: ApiEndpoint,
  language: CodeLanguage,
  apiKey: string,
  customParams: Record<string, string>,
  baseUrl: string,
): string {
  const token = apiKey.trim() || "avp_live_your_api_key_here";
  const url = `${baseUrl}${endpoint.path}`
    .replace("{callId}", customParams.callId || "6702b3c4d5e6f7a8b9c0d1e2")
    .replace("{campaignId}", customParams.campaignId || "6702b3c4d5e6f7a8b9c0d1e2");

  // Query string assembly
  const queryParams = endpoint.parameters.filter((p) => p.in === "query" && customParams[p.name]);
  const queryString = queryParams.length
    ? `?${queryParams.map((p) => `${p.name}=${encodeURIComponent(customParams[p.name])}`).join("&")}`
    : "";
  const fullUrl = `${url}${queryString}`;

  // Body construction
  const bodyObj: Record<string, unknown> = {};
  if (endpoint.method === "POST") {
    endpoint.parameters
      .filter((p) => p.in === "body")
      .forEach((p) => {
        const val = customParams[p.name] ?? p.defaultValue ?? "";
        bodyObj[p.name] = parseBodyParameter(p, val);
      });
  }
  const bodyJson = JSON.stringify(Object.keys(bodyObj).length ? bodyObj : endpoint.requestBodyExample || {}, null, 2);

  if (endpoint.id === "bulk-sync-guide") {
    switch (language) {
      case "python":
        return `import os, requests

API_KEY = "${token}"
BASE_URL = "${baseUrl}"
HEADERS = {"Authorization": f"Bearer {API_KEY}"}

# Create folder to save all audio recordings
os.makedirs("all_recordings", exist_ok=True)
page = 1

while True:
    res = requests.get(f"{BASE_URL}/calls?page={page}&limit=100", headers=HEADERS).json()
    calls = res.get("calls", [])
    if not calls:
        break

    for call in calls:
        call_id = call["id"]
        transcript = call.get("transcription_text", "")
        print(f"Call {call_id}: {transcript[:50]}...")

        # Download MP3 audio recording file directly
        rec_url = call.get("recording_url")
        if rec_url:
            audio = requests.get(rec_url, headers=HEADERS)
            if audio.status_code == 200:
                with open(f"all_recordings/{call_id}.mp3", "wb") as f:
                    f.write(audio.content)

    if page >= res.get("pagination", {}).get("pages", 1):
        break
    page += 1

print("All calls, transcripts, and recordings downloaded successfully!")`;

      case "node":
        return `// Full recursive sync in Node.js
import fs from "node:fs";

const API_KEY = "${token}";
const BASE_URL = "${baseUrl}";
let page = 1;
const allCalls = [];

while (true) {
  const res = await fetch(\`\${BASE_URL}/calls?page=\${page}&limit=100\`, {
    headers: { Authorization: \`Bearer \${API_KEY}\` }
  });
  const data = await res.json();
  if (!data.calls?.length) break;

  for (const call of data.calls) {
    allCalls.push(call);
    console.log(\`[\${call.id}] Transcript: \${call.transcription_text?.slice(0, 40)}...\`);
  }

  if (page >= (data.pagination?.pages || 1)) break;
  page++;
}

// Save complete dataset to JSON
fs.writeFileSync("all_calls_dump.json", JSON.stringify(allCalls, null, 2));
console.log(\`Saved \${allCalls.length} calls and transcripts to all_calls_dump.json\`);`;

      case "curl":
        return `# 1. Fetch page 1 of all calls (up to 100 calls per request):
curl -X GET "${baseUrl}/calls?page=1&limit=100" \\
  -H "Authorization: Bearer ${token}"

# 2. Or download everything in 1 file as a complete CSV spreadsheet:
curl -X GET "${baseUrl}/calls/export.csv" \\
  -H "Authorization: Bearer ${token}" \\
  --output all_vozon_calls.csv`;

      case "go":
        return `// Go bulk pagination loop
package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	client := &http.Client{}
	page := 1

	for {
		req, _ := http.NewRequest("GET", fmt.Sprintf("${baseUrl}/calls?page=%d&limit=100", page), nil)
		req.Header.Set("Authorization", "Bearer ${token}")
		resp, err := client.Do(req)
		if err != nil { break }
		defer resp.Body.Close()

		var result map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&result)
		calls, ok := result["calls"].([]interface{})
		if !ok || len(calls) == 0 { break }

		fmt.Printf("Fetched %d calls from page %d\\n", len(calls), page)
		page++
	}
}`;

      case "php":
        return `<?php
// PHP bulk sync loop
$apiKey = "${token}";
$page = 1;

do {
    $ch = curl_init("${baseUrl}/calls?page=" . $page . "&limit=100");
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer " . $apiKey]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = json_decode(curl_exec($ch), true);
    curl_close($ch);

    $calls = $response["calls"] ?? [];
    foreach ($calls as $call) {
        echo "Call ID: " . $call["id"] . " - Transcript: " . substr($call["transcription_text"] ?? "", 0, 40) . "\\n";
    }

    $totalPages = $response["pagination"]["pages"] ?? 1;
    $page++;
} while ($page <= $totalPages);
?>`;
    }
  }

  switch (language) {
    case "curl":
      if (endpoint.method === "POST") {
        return `curl -X POST "${fullUrl}" \\
  -H "Authorization: Bearer ${token}" \\
  -H "Content-Type: application/json" \\
  -d '${bodyJson.replaceAll("\n", "\n  ")}'`;
      }
      return `curl -X GET "${fullUrl}" \\
  -H "Authorization: Bearer ${token}"`;

    case "node":
      if (endpoint.method === "POST") {
        return `import fetch from "node-fetch"; // or native fetch in Node 18+

const response = await fetch("${fullUrl}", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${token}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(${bodyJson.replaceAll("\n", "\n  ")}),
});

if (!response.ok) {
  const error = await response.json();
  throw new Error(\`Vozon API Error \${response.status}: \${error.message}\`);
}

const data = await response.json();
console.log("Call created:", data);`;
      }
      return `const response = await fetch("${fullUrl}", {
  headers: {
    "Authorization": "Bearer ${token}",
  },
});

if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
const data = await response.json();
console.log(data);`;

    case "python":
      if (endpoint.method === "POST") {
        return `import requests

url = "${fullUrl}"
headers = {
    "Authorization": "Bearer ${token}",
    "Content-Type": "application/json",
}
payload = ${bodyJson.replaceAll("\n", "\n").replaceAll("true", "True").replaceAll("false", "False")}

response = requests.post(url, json=payload, headers=headers, timeout=30)
response.raise_for_status()

call_data = response.json()
print("Call accepted:", call_data)`;
      }
      return `import requests

url = "${fullUrl}"
headers = {"Authorization": "Bearer ${token}"}

response = requests.get(url, headers=headers, timeout=30)
response.raise_for_status()

print(response.json())`;

    case "go":
      if (endpoint.method === "POST") {
        return `package main

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
)

func main() {
	url := "${fullUrl}"
	payload := []byte(\`${bodyJson}\`)

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(payload))
	req.Header.Set("Authorization", "Bearer ${token}")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}`;
      }
      return `package main

import (
	"fmt"
	"io"
	"net/http"
)

func main() {
	req, _ := http.NewRequest("GET", "${fullUrl}", nil)
	req.Header.Set("Authorization", "Bearer ${token}")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}`;

    case "php":
      if (endpoint.method === "POST") {
        return `<?php
$ch = curl_init("${fullUrl}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(${bodyJson.replaceAll("\n", "\n  ")}));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer ${token}",
    "Content-Type: application/json"
]);

$response = curl_exec($ch);
curl_close($ch);
echo $response;
?>`;
      }
      return `<?php
$ch = curl_init("${fullUrl}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer ${token}"
]);

$response = curl_exec($ch);
curl_close($ch);
echo $response;
?>`;
  }
}

export function ApiReferenceExperience() {
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>("outbound-call");
  const [activeLang, setActiveLang] = useState<CodeLanguage>("curl");
  const [searchQuery, setSearchQuery] = useState("");
  const [userApiKey, setUserApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [selectedResponseIndex, setSelectedResponseIndex] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedBaseUrl, setCopiedBaseUrl] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [copiedWebhookSig, setCopiedWebhookSig] = useState(false);
  const [customParams, setCustomParams] = useState<Record<string, string>>({});
  const [isTestingLive, setIsTestingLive] = useState(false);
  const [liveTestResponse, setLiveTestResponse] = useState<string | null>(null);
  const [liveTestStatus, setLiveTestStatus] = useState<number | null>(null);
  const [liveTestDurationMs, setLiveTestDurationMs] = useState<number | null>(null);

  // Webhook signature testing sandbox state
  const [webhookSecretInput, setWebhookSecretInput] = useState("whsec_sample_secret_key_8829");
  const [webhookPayloadInput, setWebhookPayloadInput] = useState(
    JSON.stringify(
      {
        id: "call.ended:call_123",
        event: "call.ended",
        data: { id: "call_123", duration: 92, status: "completed" },
      },
      null,
      2,
    ),
  );
  const [calculatedSignature, setCalculatedSignature] = useState("");
  const [testIncomingSignature, setTestIncomingSignature] = useState("");
  const [checkedPreflight, setCheckedPreflight] = useState<Record<string, boolean>>({});

  // Load API key from local session storage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = window.sessionStorage.getItem("vozon_docs_api_key");
      if (savedKey) {
        const timer = window.setTimeout(() => setUserApiKey(savedKey), 0);
        return () => window.clearTimeout(timer);
      }
    }
  }, []);

  const handleApiKeyChange = (val: string) => {
    setUserApiKey(val);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("vozon_docs_api_key", val);
    }
  };

  const selectedEndpoint = useMemo(() => {
    return ENDPOINTS.find((e) => e.id === selectedEndpointId) || ENDPOINTS[0];
  }, [selectedEndpointId]);

  const selectEndpoint = (endpointId: string) => {
    setSelectedEndpointId(endpointId);
    setSelectedResponseIndex(0);
    setLiveTestResponse(null);
    setLiveTestStatus(null);
    setLiveTestDurationMs(null);
  };

  // Filter endpoints for left sidebar
  const filteredEndpoints = useMemo(() => {
    if (!searchQuery.trim()) return ENDPOINTS;
    const q = searchQuery.toLowerCase();
    return ENDPOINTS.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.path.toLowerCase().includes(q) ||
        e.section.toLowerCase().includes(q) ||
        e.summary.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const sections = useMemo(() => {
    return [...new Set(filteredEndpoints.map((e) => e.section))];
  }, [filteredEndpoints]);

  // Generate snippet
  const currentSnippet = useMemo(() => {
    return generateSnippet(selectedEndpoint, activeLang, userApiKey, customParams, BASE_URL_DEFAULT);
  }, [selectedEndpoint, activeLang, userApiKey, customParams]);

  // Copy helper with visual feedback
  const copyToClipboard = async (
    text: string,
    type: "code" | "url" | "baseUrl" | "response" | "webhookSig",
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "code") {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else if (type === "url") {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      } else if (type === "baseUrl") {
        setCopiedBaseUrl(true);
        setTimeout(() => setCopiedBaseUrl(false), 2000);
      } else if (type === "response") {
        setCopiedResponse(true);
        setTimeout(() => setCopiedResponse(false), 2000);
      } else if (type === "webhookSig") {
        setCopiedWebhookSig(true);
        setTimeout(() => setCopiedWebhookSig(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  // Toggle preflight checklist item
  const togglePreflight = (idx: number) => {
    const key = `${selectedEndpoint.id}-${idx}`;
    setCheckedPreflight((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Preflight satisfaction percentage
  const preflightCompletion = useMemo(() => {
    if (!selectedEndpoint.preflightChecks || selectedEndpoint.preflightChecks.length === 0) return null;
    const total = selectedEndpoint.preflightChecks.length;
    let done = 0;
    for (let i = 0; i < total; i++) {
      if (checkedPreflight[`${selectedEndpoint.id}-${i}`]) done++;
    }
    return { done, total, allDone: done === total };
  }, [selectedEndpoint, checkedPreflight]);

  // Real-time signature verification check
  const isWebhookSignatureMatch = useMemo(() => {
    if (!testIncomingSignature.trim() || !calculatedSignature) return null;
    const cleanIncoming = testIncomingSignature.trim();
    return cleanIncoming === calculatedSignature || cleanIncoming === calculatedSignature.replace("v1=", "");
  }, [testIncomingSignature, calculatedSignature]);

  // Live "Send Request" runner
  const executeApiCall = async () => {
    setIsTestingLive(true);
    setLiveTestResponse(null);
    const start = performance.now();
    try {
      if (!userApiKey.trim()) {
        // Realistic simulated response
        await new Promise((r) => setTimeout(r, 450));
        const activeExample = selectedEndpoint.responses[selectedResponseIndex];
        setLiveTestStatus(activeExample.status);
        setLiveTestResponse(
          typeof activeExample.payload === "string"
            ? activeExample.payload
            : JSON.stringify(activeExample.payload, null, 2),
        );
      } else {
        // Real browser fetch against live endpoint
        const fullUrl = `${BASE_URL_DEFAULT}${selectedEndpoint.path}`
          .replace("{callId}", customParams.callId || "6702b3c4d5e6f7a8b9c0d1e2")
          .replace("{campaignId}", customParams.campaignId || "6702b3c4d5e6f7a8b9c0d1e2");
        const headers: Record<string, string> = {
          Authorization: `Bearer ${userApiKey}`,
        };
        let body: string | undefined = undefined;
        if (selectedEndpoint.method === "POST") {
          headers["Content-Type"] = "application/json";
          const bodyObj: Record<string, unknown> = {};
          selectedEndpoint.parameters
            .filter((p) => p.in === "body")
            .forEach((p) => {
              const val = customParams[p.name] ?? p.defaultValue ?? "";
              bodyObj[p.name] = parseBodyParameter(p, val);
            });
          body = JSON.stringify(Object.keys(bodyObj).length ? bodyObj : selectedEndpoint.requestBodyExample || {});
        }
        const res = await fetch(fullUrl, {
          method: selectedEndpoint.method,
          headers,
          body,
        });
        const elapsed = Math.round(performance.now() - start);
        setLiveTestDurationMs(elapsed);
        setLiveTestStatus(res.status);
        const text = await res.text();
        try {
          setLiveTestResponse(JSON.stringify(JSON.parse(text), null, 2));
        } catch {
          setLiveTestResponse(text);
        }
      }
    } catch (err) {
      setLiveTestStatus(500);
      setLiveTestResponse(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }, null, 2));
    } finally {
      setIsTestingLive(false);
      if (!liveTestDurationMs) {
        setLiveTestDurationMs(Math.round(performance.now() - start));
      }
    }
  };

  // Real-time HMAC SHA-256 signature generator using browser Web Crypto API
  useEffect(() => {
    async function calculateHmac() {
      try {
        if (!webhookSecretInput || !webhookPayloadInput) {
          setCalculatedSignature("");
          return;
        }
        const encoder = new TextEncoder();
        const keyData = encoder.encode(webhookSecretInput);
        const cryptoKey = await window.crypto.subtle.importKey(
          "raw",
          keyData,
          { name: "HMAC", hash: { name: "SHA-256" } },
          false,
          ["sign"],
        );
        const signature = await window.crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(webhookPayloadInput));
        const hashArray = Array.from(new Uint8Array(signature));
        const hex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        setCalculatedSignature(`v1=${hex}`);
      } catch {
        setCalculatedSignature("Error computing HMAC signature");
      }
    }
    void calculateHmac();
  }, [webhookSecretInput, webhookPayloadInput]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-teal-500/20 font-sans">
      {/* Dedicated Clean Light Developer Portal Header */}
      <header className="sticky top-0 z-40 h-16 border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex h-full max-w-[1720px] items-center justify-between gap-4 px-4 sm:px-6">
          {/* Left: Brand + Navigation Tabs */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2.5">
              <BrandLogo compact showWebsiteLogo />
              <span className="hidden sm:inline-flex items-center rounded-full bg-teal-50 border border-teal-200 px-2.5 py-0.5 text-xs font-bold text-[#0e6f62]">
                API Reference
              </span>
              <span className="hidden md:inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                v1.0.0 Stable
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-1 border-l border-slate-200 pl-4">
              <Link
                href="/docs"
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Guides & Concepts
              </Link>
              <Link
                href="/docs/api"
                className="rounded-lg bg-teal-50 border border-teal-200/80 px-3 py-1.5 text-xs font-bold text-[#0e6f62]"
              >
                API Reference
              </Link>
            </div>
          </div>

          {/* Right: Base URL, Key Injector, Downloads, Dashboard */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Base URL Indicator */}
            <div className="hidden xl:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-mono text-slate-600">
              <span className="text-slate-400">Base:</span>
              <code className="font-bold text-slate-800">{BASE_URL_DEFAULT}</code>
              <button
                type="button"
                onClick={() => copyToClipboard(BASE_URL_DEFAULT, "baseUrl")}
                className="rounded px-1.5 py-0.5 text-[11px] font-bold text-[#108D82] hover:bg-teal-50 transition cursor-pointer"
                title="Copy Base URL"
              >
                {copiedBaseUrl ? "✓ Copied" : "Copy"}
              </button>
            </div>

            {/* Quick API Key Input */}
            <div className="relative flex items-center">
              <input
                type={showKey ? "text" : "password"}
                value={userApiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder="API Key (avp_...)"
                className="w-36 sm:w-52 rounded-xl border border-slate-200 bg-slate-50 pl-3 pr-12 py-1.5 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#108D82] focus:ring-2 focus:ring-teal-500/10 transition shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-1 rounded-md bg-white border border-slate-200 px-1.5 py-0.5 text-[10px] uppercase font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                {showKey ? "Hide" : "Show"}
              </button>
            </div>

            {/* OpenAPI Specs */}
            <div className="hidden sm:flex items-center gap-1.5">
              <a
                href="/openapi.yaml"
                download="vozon-openapi.yaml"
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:border-[#108D82] hover:text-[#108D82] shadow-xs cursor-pointer"
                title="Download OpenAPI 3.1 YAML"
              >
                <span>↓</span> YAML
              </a>
              <a
                href="/openapi.json"
                download="vozon-openapi.json"
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:border-[#108D82] hover:text-[#108D82] shadow-xs cursor-pointer"
                title="Download OpenAPI 3.1 JSON / Postman Collection"
              >
                <span>↓</span> JSON
              </a>
            </div>

            <Link
              href="/dashboard"
              className="hidden md:inline-flex items-center rounded-xl bg-[#108D82] hover:bg-[#0e756c] text-white px-3.5 py-1.5 text-xs font-bold shadow-xs transition cursor-pointer"
            >
              Dashboard →
            </Link>
          </div>
        </div>
      </header>

      {/* Main 3-Column Clean Light Layout */}
      <div className="mx-auto grid max-w-[1720px] lg:grid-cols-[280px_minmax(0,1fr)_440px] xl:grid-cols-[290px_minmax(0,1fr)_520px]">
        {/* Column 1: Clean Light Navigation Sidebar */}
        <aside className="border-r border-slate-200/90 bg-white p-4 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] lg:overflow-y-auto">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search API endpoints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#108D82] focus:ring-2 focus:ring-teal-500/10 transition shadow-xs"
            />
            <svg
              className="absolute left-3 top-2.5 size-3.5 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <nav className="grid gap-5">
            {sections.map((sec) => (
              <div key={sec}>
                <span className="px-2.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                  {sec}
                </span>
                <div className="grid gap-1">
                  {filteredEndpoints
                    .filter((e) => e.section === sec)
                    .map((e) => {
                      const active = e.id === selectedEndpointId;
                      return (
                        <button
                          key={e.id}
                          type="button"
                          onClick={() => selectEndpoint(e.id)}
                          className={`group flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-all duration-150 cursor-pointer ${
                            active
                              ? "bg-teal-50/90 text-teal-950 font-bold border-l-[3px] border-[#108D82] shadow-xs"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
                          }`}
                        >
                          <span className="truncate pr-2">{e.title}</span>
                          <span
                            className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${
                              e.method === "POST"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold"
                                : e.method === "GET"
                                ? "bg-sky-50 text-sky-700 border border-sky-200 font-bold"
                                : "bg-purple-50 text-purple-700 border border-purple-200 font-bold"
                            }`}
                          >
                            {e.method}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-teal-200 bg-teal-50/60 p-4 text-xs leading-5 text-slate-600 shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="size-2 rounded-full bg-[#108D82] animate-pulse" />
              <strong className="text-teal-900 font-bold text-xs">Zero-Contact Integration</strong>
            </div>
            Test live queries directly in browser, verify HMAC signatures, and dispatch AI outbound phone calls instantly.
          </div>
        </aside>

        {/* Column 2: Clean Light Documentation & Parameter Trees */}
        <main className="min-w-0 bg-white px-6 py-8 lg:px-10 lg:py-10 border-r border-slate-200/90">
          <div className="max-w-2xl xl:max-w-3xl">
            {/* Header Badge & Path */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`rounded-lg px-2.5 py-1 text-xs font-mono font-black uppercase tracking-wider ${
                  selectedEndpoint.method === "POST"
                    ? "bg-emerald-100 border border-emerald-300 text-emerald-800"
                    : "bg-sky-100 border border-sky-300 text-sky-800"
                }`}
              >
                {selectedEndpoint.method}
              </span>
              <code className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1 font-mono text-sm font-bold text-slate-800">
                {selectedEndpoint.path}
              </code>
              <button
                type="button"
                onClick={() => copyToClipboard(`${BASE_URL_DEFAULT}${selectedEndpoint.path}`, "url")}
                className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                  copiedUrl
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {copiedUrl ? "✓ Copied URL!" : "Copy Path"}
              </button>
              <span className="ml-auto rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                Scope: <b className="font-mono text-teal-800 font-bold">{selectedEndpoint.scope}</b>
              </span>
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {selectedEndpoint.title}
            </h1>
            <p className="mt-2.5 text-base leading-relaxed text-slate-600">{selectedEndpoint.description}</p>

            {/* Interactive Pre-flight Calling Checklist */}
            {selectedEndpoint.preflightChecks && (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 text-xs leading-6 shadow-xs">
                <div className="flex items-center justify-between font-bold text-amber-900 text-sm mb-1">
                  <span className="flex items-center gap-2">
                    <span className="text-base">⚠️</span>
                    <span>Pre-flight Calling Checklist</span>
                  </span>
                  {preflightCompletion && (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-mono font-bold ${
                        preflightCompletion.allDone
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {preflightCompletion.allDone
                        ? "All checks satisfied ✓"
                        : `${preflightCompletion.done}/${preflightCompletion.total} ready`}
                    </span>
                  )}
                </div>
                <div className="mt-3 grid gap-2">
                  {selectedEndpoint.preflightChecks.map((check, i) => {
                    const isDone = Boolean(checkedPreflight[`${selectedEndpoint.id}-${i}`]);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => togglePreflight(i)}
                        className={`flex items-start gap-2.5 rounded-xl p-2.5 text-left transition cursor-pointer ${
                          isDone
                            ? "bg-amber-100/70 text-amber-800 line-through opacity-80"
                            : "bg-white/80 hover:bg-white text-slate-700 border border-amber-200/60"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border font-bold text-[10px] ${
                            isDone
                              ? "border-amber-500 bg-amber-500 text-white"
                              : "border-slate-300 bg-white text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                        <span className="leading-snug">{check}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stripe / Mintlify Style Parameter Attribute Cards */}
            <div className="mt-10">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2.5 flex items-center justify-between">
                <span>Request Attributes & Parameters</span>
                <span className="text-xs font-mono font-semibold text-slate-600 lowercase">
                  {selectedEndpoint.parameters.length} parameters
                </span>
              </h2>

              <div className="divide-y divide-slate-100 mt-2">
                {selectedEndpoint.parameters.map((param) => (
                  <div key={param.name} className="py-4 hover:bg-slate-50/50 rounded-xl px-2 transition-colors">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-900">{param.name}</span>
                      <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-md">
                        {param.type}
                      </span>
                      {param.required ? (
                        <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                          required
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          optional
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-slate-600 ml-auto bg-slate-100 px-2 py-0.5 rounded">
                        in {param.in}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">{param.description}</p>

                    {param.example && (
                      <div className="mt-2 text-xs font-mono text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 inline-block">
                        <span className="text-slate-600 mr-1.5">example:</span>
                        <span className="font-bold text-slate-900">{param.example}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Troubleshooting Matrix for this endpoint */}
            {selectedEndpoint.troubleshooting && (
              <div className="mt-10">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2.5">
                  Zero-Contact Troubleshooting Matrix
                </h2>
                <div className="mt-4 grid gap-3.5">
                  {selectedEndpoint.troubleshooting.map((t, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4.5 text-xs leading-6 shadow-xs"
                    >
                      <div className="font-mono font-bold text-rose-700 flex items-center gap-2 text-sm">
                        <span className="size-2 rounded-full bg-rose-500 animate-pulse" />
                        {t.error}
                      </div>
                      <div className="mt-2 text-slate-700">
                        <strong className="text-slate-900 font-semibold">Root Cause:</strong> {t.cause}
                      </div>
                      <div className="mt-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 font-medium">
                        <strong className="text-emerald-950 font-bold mr-1">Recommended Fix:</strong> {t.fix}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Webhook Interactive Signature Sandbox if Webhooks endpoint */}
            {selectedEndpoint.id === "webhooks-guide" && (
              <div className="mt-10 rounded-2xl border border-teal-200 bg-teal-50/40 p-6 shadow-xs">
                <h3 className="text-base font-bold text-teal-950 flex items-center gap-2">
                  <span>🔐 Webhook Signature Verifier Sandbox</span>
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Test your HMAC SHA-256 signature verification logic in real time. We compute the signature below
                  using the browser’s native Web Crypto API.
                </p>

                <div className="mt-5 grid gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      Endpoint Secret (whsec_...)
                    </label>
                    <input
                      type="text"
                      value={webhookSecretInput}
                      onChange={(e) => setWebhookSecretInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-mono text-slate-900 outline-none focus:border-[#108D82] focus:ring-2 focus:ring-teal-500/10 transition"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      Raw JSON Payload Body
                    </label>
                    <textarea
                      rows={4}
                      value={webhookPayloadInput}
                      onChange={(e) => setWebhookPayloadInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-mono text-slate-900 outline-none focus:border-[#108D82] focus:ring-2 focus:ring-teal-500/10 transition"
                    />
                  </div>

                  <div className="rounded-xl border border-teal-200 bg-white p-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-900">
                        Expected Header Value (X-AI-Voice-Signature):
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(calculatedSignature, "webhookSig")}
                        className="rounded px-2.5 py-1 text-xs font-bold text-[#108D82] hover:bg-teal-50 transition cursor-pointer"
                      >
                        {copiedWebhookSig ? "✓ Copied" : "Copy Signature"}
                      </button>
                    </div>
                    <code className="mt-2 block font-mono text-xs text-teal-900 break-all bg-slate-50 p-2.5 rounded-lg border border-slate-200 select-all font-bold">
                      {calculatedSignature || "Calculating..."}
                    </code>

                    {/* Interactive Signature Match Verifier */}
                    <div className="mt-3.5 border-t border-slate-100 pt-3">
                      <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                        Verify Incoming Signature from Your Server:
                      </label>
                      <input
                        type="text"
                        placeholder="Paste received v1=... signature header here"
                        value={testIncomingSignature}
                        onChange={(e) => setTestIncomingSignature(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#108D82]"
                      />
                      {isWebhookSignatureMatch !== null && (
                        <div
                          className={`mt-2.5 flex items-center gap-2 text-xs font-bold p-2.5 rounded-lg border ${
                            isWebhookSignatureMatch
                              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                              : "border-rose-300 bg-rose-50 text-rose-800"
                          }`}
                        >
                          <span>
                            {isWebhookSignatureMatch
                              ? "✓ MATCH: Signature is authentic, verified, and safe to process!"
                              : "✗ MISMATCH: Signature does not match computed HMAC. Check your endpoint secret."}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Column 3: Sleek Code Studio & Interactive Request Runner */}
        <aside className="bg-[#f8fafc] p-5 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] lg:overflow-y-auto">
          {/* Studio Header: macOS Controls & Language Selector */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="size-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-[11px] font-mono font-semibold text-slate-400">
                  {selectedEndpoint.method} {selectedEndpoint.path}
                </span>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(currentSnippet, "code")}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                  copiedCode
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "text-[#108D82] hover:bg-teal-50"
                }`}
              >
                {copiedCode ? "✓ Copied Code!" : "Copy Code"}
              </button>
            </div>

            {/* Language Tabs */}
            <div className="flex items-center gap-1 pt-2.5">
              {(["curl", "node", "python", "go", "php"] as CodeLanguage[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLang(lang)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-mono font-bold uppercase transition-all duration-150 cursor-pointer ${
                    activeLang === lang
                      ? "bg-[#108D82] text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* High-Contrast Syntax Code Block */}
          <div className="mt-3.5 overflow-hidden rounded-2xl border border-slate-800 bg-[#0f172a] shadow-lg">
            <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-6 text-[#75fff0]">
              <code>{currentSnippet}</code>
            </pre>
          </div>

          {/* Interactive "Try It Out" Playground */}
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#108D82] animate-pulse" />
                Live Request Runner
              </span>
              <button
                type="button"
                onClick={() => void executeApiCall()}
                disabled={isTestingLive}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#108D82] hover:bg-[#0e756c] text-white px-3.5 py-1.5 text-xs font-bold transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isTestingLive ? (
                  <>
                    <span className="size-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <span>Send Request ▷</span>
                )}
              </button>
            </div>

            {/* Quick Param Inputs for Playground */}
            <div className="mt-3.5 grid gap-2.5">
              {selectedEndpoint.parameters
                .filter((p) => p.in === "path" || p.in === "body" || (p.in === "query" && p.required))
                .slice(0, 4)
                .map((param) => (
                  <div key={param.name}>
                    <label className="text-[10px] font-mono font-bold uppercase text-slate-600 block mb-1">
                      {param.name} ({param.in})
                    </label>
                    <input
                      type="text"
                      placeholder={param.defaultValue || param.example || ""}
                      value={customParams[param.name] ?? param.defaultValue ?? ""}
                      onChange={(e) =>
                        setCustomParams({
                          ...customParams,
                          [param.name]: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#108D82] focus:ring-2 focus:ring-teal-500/10 transition"
                    />
                  </div>
                ))}
            </div>

            {/* Response Preview Header */}
            <div className="mt-5 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between text-xs text-slate-600 mb-2.5">
                <span className="font-bold text-slate-900">Response Preview</span>
                <div className="flex items-center gap-1.5">
                  {selectedEndpoint.responses.map((resp, i) => (
                    <button
                      key={resp.status}
                      type="button"
                      onClick={() => {
                        setSelectedResponseIndex(i);
                        setLiveTestResponse(null);
                        setLiveTestStatus(null);
                      }}
                      className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold transition cursor-pointer ${
                        selectedResponseIndex === i && liveTestStatus === null
                          ? resp.status < 300
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold"
                            : "bg-rose-100 text-rose-800 border border-rose-300 font-bold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      {resp.status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status bar with live latency badge and Copy Payload button */}
              <div className="mb-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {liveTestStatus !== null ? (
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[11px] font-bold border ${
                        liveTestStatus < 300
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-rose-100 text-rose-800 border-rose-300"
                      }`}
                    >
                      Status: {liveTestStatus}
                    </span>
                  ) : (
                    <span className="font-mono text-[11px] text-slate-500">
                      Status: {selectedEndpoint.responses[selectedResponseIndex]?.status} (
                      {selectedEndpoint.responses[selectedResponseIndex]?.label})
                    </span>
                  )}
                  {liveTestDurationMs && (
                    <span className="font-mono text-[11px] text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded font-bold">
                      {liveTestDurationMs}ms
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const content =
                      liveTestResponse !== null
                        ? liveTestResponse
                        : typeof selectedEndpoint.responses[selectedResponseIndex]?.payload === "string"
                        ? (selectedEndpoint.responses[selectedResponseIndex]?.payload as string)
                        : JSON.stringify(
                            selectedEndpoint.responses[selectedResponseIndex]?.payload ?? {},
                            null,
                            2,
                          );
                    void copyToClipboard(content, "response");
                  }}
                  className="text-[11px] font-bold text-[#108D82] hover:underline cursor-pointer"
                >
                  {copiedResponse ? "✓ Copied" : "Copy Payload"}
                </button>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0f172a]">
                <pre className="max-h-72 overflow-auto p-3.5 font-mono text-[11px] leading-5 text-[#a7f3d0]">
                  <code>
                    {liveTestResponse !== null
                      ? liveTestResponse
                      : typeof selectedEndpoint.responses[selectedResponseIndex]?.payload === "string"
                      ? selectedEndpoint.responses[selectedResponseIndex]?.payload
                      : JSON.stringify(
                          selectedEndpoint.responses[selectedResponseIndex]?.payload ?? {},
                          null,
                          2,
                        )}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
