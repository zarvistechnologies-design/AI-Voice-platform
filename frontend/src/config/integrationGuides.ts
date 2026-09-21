import { integrations } from "@/config/integrationCatalog";

type Guide = { setup: string; check: string };
type Slug = (typeof integrations)[number]["slug"];

export const integrationGuides: Record<Slug, Guide> = {
  twilio: { setup: "Connect a Twilio number, select the receiving agent, and test outbound caller ID before launch.", check: "Verify number ownership, call routing, and transfer behavior in every country you call." },
  exotel: { setup: "Import the Exotel number and assign it to the correct agent and approved call flow.", check: "Test inbound routing, caller ID, and escalation on a real Indian number." },
  vobiz: { setup: "Connect the Vobiz account in the dashboard, then choose the number and agent used for calls.", check: "Verify connection status and place a test call before using the route in production." },
  elevenlabs: { setup: "Select an ElevenLabs voice and speech model in the agent voice settings, then preview your real script.", check: "Review pronunciation, language coverage, and consent for cloned voices." },
  cartesia: { setup: "Choose Cartesia in the voice provider settings, select a voice, and test live turn-taking.", check: "Compare latency and voice quality on the languages and phone routes you expect to use." },
  "sarvam-voice": { setup: "Choose Sarvam text to speech and an available voice for the agent language.", check: "Review local names, numbers, and code switching with speakers of the target language." },
  openai: { setup: "Select an available OpenAI model, add approved instructions, and test the agent with real call scenarios.", check: "Review response quality, latency, and tool-use boundaries before publishing." },
  "google-gemini": { setup: "Choose a Gemini model in the agent settings and test it against representative call cases.", check: "Review output consistency, language behavior, and long-call context handling." },
  "sarvam-models": { setup: "Select an available Sarvam model for the pipeline and test it with approved prompts.", check: "Validate regional language quality and the accuracy of business-specific terms." },
  "sip-trunking": { setup: "Map the trunk route and agent destination with your telephony team, then run inbound and transfer tests.", check: "Confirm codec support, caller ID, concurrency, and failure routing with the carrier." },
  "openai-realtime": { setup: "Choose OpenAI Realtime as the agent mode, select a supported voice, and test interruptions and handoffs.", check: "Measure perceived delay, barge-in behavior, and recovery after a dropped audio session." },
  "gemini-live": { setup: "Select Gemini Live as the agent mode and test the selected model and voice with your call script.", check: "Check mixed-language turns, interruptions, and tool calls during live audio." },
  deepgram: { setup: "Choose Deepgram for speech input and select a recognition model that fits your language and call audio.", check: "Test accents, background noise, names, and short utterances on real phone calls." },
  "sarvam-speech": { setup: "Select Sarvam speech input and the caller language before testing the agent.", check: "Check code switching, local names, and numerals in the transcript." },
  "openai-transcription": { setup: "Choose OpenAI as the speech input provider and test an available transcription model.", check: "Compare accuracy and response delay on noisy calls and specialist terms." },
  "elevenlabs-scribe": { setup: "Select ElevenLabs speech input and a Scribe model that matches the agent language.", check: "Review transcript quality on accents, proper names, and overlapping speech." },
  hubspot: { setup: "Connect HubSpot, map the contact fields you need, and decide when a call creates or updates a record.", check: "Avoid duplicate contacts and test missing or stale CRM records." },
  salesforce: { setup: "Map agent outcomes to Salesforce leads or activities and set the permitted write actions.", check: "Review field permissions, duplicate rules, and the fallback when Salesforce is unavailable." },
  zoho: { setup: "Choose the Zoho fields to read and write, then test lead creation and updates with sample calls.", check: "Check duplicate matching, required fields, and authorization expiry." },
  "google-calendar": { setup: "Authorize Google Calendar, choose the calendar, and define appointment duration and booking rules.", check: "Test time zones, double bookings, cancellation rules, and expired access." },
  calendly: { setup: "Connect Calendly, select an event type, and decide when the agent shares a booking link.", check: "Confirm the link matches the right service, duration, and staff availability." },
  "cal-com": { setup: "Create the relevant Cal.com event type and add its booking link to the approved follow-up for the agent's workflow.", check: "Test the link, event duration, time zone, and available slots. Booking through Cal.com occurs on its booking page." },
  digitalbot: { setup: "Create a connection key in DigitalBot, choose the Vozon agent for that clinic workflow, connect the workspace, and then enable Connector tools for that agent.", check: "Verify the workspace and branch, then test doctor availability and appointment creation. Each connection belongs to one Vozon agent, and connecting alone does not enable its tools." },
  "google-sheets": { setup: "Authorize Google, select a spreadsheet and sheet, and map the fields captured by the agent.", check: "Check write permissions, column changes, and duplicate rows after retries." },
  zapier: { setup: "Create an event-based handoff through a webhook or API workflow, then map the data in Zapier.", check: "Test retries, duplicate events, and which customer fields leave the workspace." },
  gmail: { setup: "Decide which outcomes should create an email and pass only the fields needed by the email workflow.", check: "Review recipient selection, sensitive details, and duplicate messages." },
  slack: { setup: "Connect Slack, choose a destination channel, and define which call events should post there.", check: "Limit personal data in messages and test channel access and delivery failures." },
  razorpay: { setup: "Choose a Vozon plan or top-up in billing and complete the secure Razorpay checkout.", check: "This checkout covers Vozon account billing. Customer payment collection needs a separate business workflow." },
  "order-workflows": { setup: "Expose only the order fields and actions the agent needs through a scoped API tool.", check: "Verify caller identity before sharing order details or making a change." },
  "custom-api": { setup: "Define the request and response contract, authenticate the tool, and test successful and failed actions.", check: "Apply narrow permissions, timeouts, and idempotency for writes." },
  "vozon-ai": { setup: "Create a Vozon agent, define its call instructions and permitted native actions, then test the complete conversation.", check: "Review action permissions, handoff behavior, and saved call outcomes before publishing." },
  webhooks: { setup: "Create a webhook endpoint, choose events, verify signatures, and test delivery in the developer workspace.", check: "Deduplicate retries, respond promptly, and rotate an exposed signing secret." },
};
