export type Product = {
  slug: string;
  name: string;
  category: string;
  eyebrow: string;
  headline: string;
  summary: string;
  description: string;
  value: string;
  steps: { title: string; body: string }[];
  applications: { title: string; body: string }[];
  questions: { question: string; answer: string }[];
  related: string[];
};

export const productCatalog: Product[] = [
  {
    slug: "ai-voice-agent", name: "AI Voice Agent", category: "Voice", eyebrow: "Natural voice conversations",
    headline: "An AI voice agent that can answer, understand, and act.",
    summary: "Handle calls with a voice agent that listens, responds, and moves each conversation toward a clear next step.",
    description: "Vozon AI voice agents give callers a conversational first point of contact. Set the agent's purpose, add the information it needs, and decide when it should book, follow up, or hand the call to a person. Use it for inbound questions, outbound follow-ups, and routine conversations that need a consistent answer.",
    value: "A caller gets help in the moment. Your team gets the context and outcome instead of another unstructured call to sort through.",
    steps: [
      { title: "Define the job", body: "Choose what the agent can answer, which details it should collect, and the moment a person should take over." },
      { title: "Connect the conversation", body: "Bring approved answers, available times, and team workflows into the call, then carry its outcome into the next action." },
      { title: "Capture the result", body: "Record the intent, important details, and next action so the conversation does not end at goodbye." },
    ],
    applications: [
      { title: "Lead qualification", body: "The agent asks about team size and timing, then gives sales a useful summary for their follow-up." },
      { title: "Appointment booking", body: "A caller picks a time, the agent checks availability, books the slot, and sends a confirmation." },
      { title: "Customer support", body: "The agent checks the right details, answers what it can, and passes the full context to a specialist when needed." },
    ],
    questions: [
      { question: "What is an AI voice agent?", answer: "It is a conversational assistant that speaks with callers, understands their requests, and follows a defined process to answer questions, qualify enquiries, or book appointments." },
      { question: "Can an agent transfer a call to a person?", answer: "Yes. Your voice workflow can include warm handoff rules that transfer the call—along with a structured summary of what was already discussed—to the right teammate." },
      { question: "Can I use it for both inbound and outbound calls?", answer: "Yes. Voice agents can answer incoming customer phone lines 24/7 and place scheduled outbound follow-ups or appointment reminders based on your consent and workflow rules." },
      { question: "How does the voice agent know my business policies and calendar slots?", answer: "You connect approved knowledge documents and live tools like Google Calendar, Calendly, or your CRM so the agent answers from verified information and checks real-time availability." },
      { question: "What languages and phone providers are supported?", answer: "Vozon AI Voice Agents support multilingual conversations (including English, Hindi, and regional languages) and connect with providers like Twilio, Exotel, Plivo, Telnyx, and custom SIP trunks." },
    ], related: ["voice-cloning", "workflows", "end-to-end-automation"],
  },
  {
    slug: "whatsapp-api", name: "WhatsApp API", category: "Messaging", eyebrow: "Business messaging infrastructure",
    headline: "Connect WhatsApp to the rest of your customer journey.",
    summary: "Bring WhatsApp conversations into your business processes with an API connection built for messaging, follow-ups, and handoffs.",
    description: "The WhatsApp API is the connection between a business WhatsApp channel and the systems that manage customer conversations. With Vozon, it can be part of a journey that starts with a message, continues after a call, or sends an agreed next step to the customer. Your team can keep the channel connected to the context gathered elsewhere.",
    value: "A message becomes part of the same customer journey, with the right information available for the next interaction.",
    steps: [
      { title: "Connect your channel", body: "Link an eligible business WhatsApp account and choose the conversations your workflow should handle." },
      { title: "Define message events", body: "Use incoming messages or an outcome from another channel to start the right response." },
      { title: "Route and record", body: "Send the conversation to an agent, a workflow, or your team, and keep its result connected." },
    ],
    applications: [
      { title: "After-call follow-up", body: "Send details or a confirmation after a voice conversation when the customer expects it." },
      { title: "New enquiries", body: "Respond to an incoming message and collect the information needed to help." },
      { title: "Customer updates", body: "Keep a person informed about an agreed next step through the channel they already use." },
    ],
    questions: [
      { question: "What is the difference between WhatsApp API and a WhatsApp bot?", answer: "The WhatsApp API connects your verified business number to software for reliable delivery, templates, and webhooks. A WhatsApp bot is the conversational assistant that uses that connection to reply and guide customers." },
      { question: "Do I need an official WhatsApp Business account?", answer: "Yes. Business messaging uses an eligible Meta WhatsApp Business Account (WABA) so your sender identity, message templates, and 24-hour customer care windows stay compliant." },
      { question: "Can WhatsApp messages be triggered automatically after a voice call?", answer: "Yes. A workflow can use the outcome of a phone call to immediately send a WhatsApp booking pass, order link, or written summary to the caller." },
      { question: "How do approved templates and the 24-hour reply window work?", answer: "Out-of-session notifications (such as order updates or appointment reminders) use Meta-approved templates. Once a customer replies, a 24-hour service window opens for free-form two-way conversation." },
      { question: "Can we connect WhatsApp API events to our CRM or store?", answer: "Yes. Incoming messages, delivery receipts, and customer replies can sync with Shopify, HubSpot, Salesforce, or custom webhooks so every thread stays tied to the customer record." },
    ], related: ["whatsapp-bot", "workflows", "ai-voice-agent"],
  },
  {
    slug: "whatsapp-bot", name: "WhatsApp Bot", category: "Messaging", eyebrow: "Conversations in WhatsApp",
    headline: "A WhatsApp bot that keeps the conversation moving.",
    summary: "Start approved messages, answer individual replies, and guide customers to a useful next step inside WhatsApp.",
    description: "A Vozon WhatsApp bot can continue an incoming chat or an approved business message as a guided conversation. Use it for a cart reminder, a campaign reply, or a support request. The bot can ask clarifying questions, answer from approved information, and pass the full chat context to your team when a person is needed.",
    value: "Customers can continue where they are comfortable, while your team receives a clearer request and the context behind it.",
    steps: [
      { title: "Choose the entry point", body: "Start with a customer message, a campaign response, or a follow-up from another approved channel." },
      { title: "Guide the exchange", body: "Give the bot the questions, answers, and boundaries that match your business process." },
      { title: "Make the next step clear", body: "Route a qualified enquiry, share information, or hand the conversation to your team." },
    ],
    applications: [
      { title: "Cart recovery", body: "Follow up through an approved WhatsApp message, answer a shopper's question, and guide them back to their cart." },
      { title: "Campaign broadcasts", body: "Send an approved message to your intended audience, then let the bot handle each customer's reply as a conversation." },
      { title: "Support handoff", body: "Ask for the order details and pass the full WhatsApp chat context to a specialist when needed." },
    ],
    questions: [
      { question: "Can the WhatsApp bot answer questions specific to my business?", answer: "Yes. You provide the approved help articles, product catalogs, and policy rules the bot should rely on, and test its replies before going live." },
      { question: "Can a human teammate step into a WhatsApp conversation?", answer: "Yes. When a customer asks a complex or sensitive question, the bot passes the full WhatsApp thread and collected details to your support or sales team." },
      { question: "How does the bot handle replies to a WhatsApp campaign broadcast?", answer: "When you send an approved broadcast to an opted-in audience, each person who replies enters an individual one-to-one conversation with the bot." },
      { question: "Can the bot recover abandoned carts or book appointments in chat?", answer: "Yes. It can answer product or sizing questions on a saved cart and share a direct checkout link, or check calendar availability to confirm a time." },
      { question: "Is this the same as WhatsApp API?", answer: "The WhatsApp API provides the official messaging connection and template delivery, while the WhatsApp Bot is the guided conversational experience built on top of it." },
    ], related: ["whatsapp-api", "web-chatbot", "end-to-end-automation"],
  },
  {
    slug: "web-chatbot", name: "Web Chatbot", category: "Web", eyebrow: "Help on your website",
    headline: "Turn a website question into a useful conversation.",
    summary: "Help visitors find answers, explain your offer, and leave a clear next step without leaving your website.",
    description: "The Vozon web chatbot gives visitors a direct way to ask for help while they explore your site. Instead of sending everyone to a long form, use a conversation to understand what they need. The bot can answer from the content you approve, collect relevant details, and point the visitor toward a booking or team follow-up.",
    value: "Your website becomes easier to navigate for visitors, and your team can see what they asked for before responding.",
    steps: [
      { title: "Add your knowledge", body: "Choose the pages, answers, and business information the chatbot should rely on." },
      { title: "Set its role", body: "Decide whether it should support visitors, qualify interest, or guide them to the right service." },
      { title: "Connect the outcome", body: "Pass important enquiries and their context to a workflow or a member of your team." },
    ],
    applications: [
      { title: "Product discovery", body: "Help a visitor compare options and find the page that answers their question." },
      { title: "Demo enquiries", body: "Collect the reason for their interest before offering the next step." },
      { title: "Always-available answers", body: "Give visitors a way to ask common questions outside office hours." },
    ],
    questions: [
      { question: "What is the Vozon Web Chatbot?", answer: "It is an interactive chat assistant embedded on your website that answers visitor questions from approved content, qualifies enquiries, and helps them book or reach your team." },
      { question: "How do I control what information the web chatbot uses?", answer: "You select the exact website pages, Notion docs, Google Docs, or help articles the chatbot may reference so answers stay grounded in your current offer." },
      { question: "Can visitors book a meeting or demo directly inside the chat?", answer: "Yes. After capturing a visitor's requirements, the chatbot can check available slots in Google Calendar or Calendly and confirm a walkthrough without leaving the page." },
      { question: "What happens when a visitor needs to speak with a person?", answer: "The chatbot collects their contact details and question, then routes the conversation summary to your team in Slack, HubSpot, Salesforce, or your helpdesk." },
      { question: "How is the Web Chatbot different from a WhatsApp Bot?", answer: "A Web Chatbot engages visitors directly on your website pages, while a WhatsApp Bot continues conversations on the customer's phone in WhatsApp." },
    ], related: ["whatsapp-bot", "workflows", "end-to-end-automation"],
  },
  {
    slug: "voice-cloning", name: "Voice Cloning", category: "Voice", eyebrow: "A voice that sounds like your brand",
    headline: "Give your AI agent a voice people remember.",
    summary: "Create a consistent voice experience for customer conversations, with a voice selected or developed for your brand.",
    description: "Voice cloning is the process of creating a synthetic voice from authorized voice material. In Vozon, it can help a voice agent sound consistent across the conversations it handles. Choose a voice that fits the audience, review the way it reads your key terms, and use it only with the rights and consent required for that voice.",
    value: "A familiar, carefully reviewed voice can make the experience feel more coherent across greetings, answers, and follow-ups.",
    steps: [
      { title: "Choose the voice source", body: "Use voice material you have permission to use and define the intended brand experience." },
      { title: "Review the output", body: "Test common phrases, names, and your most important customer scenarios." },
      { title: "Apply it to your agent", body: "Use the approved voice in the calls and journeys where it fits best." },
    ],
    applications: [
      { title: "Brand consistency", body: "Keep a recognizable tone across the calls your AI agent handles." },
      { title: "Localized experiences", body: "Review how the chosen voice works with the languages your customers use." },
      { title: "Clearer scripts", body: "Test pronunciation of products, places, and terms important to your business." },
    ],
    questions: [
      { question: "What do I need to create a cloned voice in Vozon?", answer: "You need clean reference audio from an authorized speaker along with verified speaker consent and permission to use that voice for your business calls." },
      { question: "How do you protect voice rights and speaker consent?", answer: "Every custom voice profile requires explicit speaker authorization and stays scoped to the approved workspace and call workflows your team configures." },
      { question: "Can I fine-tune how the cloned voice pronounces brand or product names?", answer: "Yes. You can add custom phonetic rules and test how the voice reads product names, medical or financial terms, and regional place names before deployment." },
      { question: "Will the cloned voice work across multiple languages?", answer: "Yes. You can preview and validate how your voice profile preserves tone and cadence across English, Hindi, and regional languages before assigning it to live lines." },
      { question: "How do I assign a cloned voice to my AI Voice Agent?", answer: "Once your voice profile is reviewed and approved, you can select it in one click inside your Vozon AI Voice Agent settings for inbound and outbound calls." },
    ], related: ["ai-voice-agent", "whatsapp-bot", "workflows"],
  },
  {
    slug: "vozon-mcp", name: "Vozon MCP", category: "Connect", eyebrow: "Connect tools to conversations",
    headline: "Give your agent a clear path to the tools it needs.",
    summary: "Use Vozon MCP to connect agent conversations with approved business tools and actions.",
    description: "MCP, or Model Context Protocol, is a way to make tools and context available to an AI system through a defined interface. Vozon MCP is for teams that want an agent to do more than answer from a script: look up an approved piece of information, send a request to a connected tool, or use a result to decide what comes next. Keep each action within the access and review rules your team sets.",
    value: "The agent can work with current context instead of asking a customer to repeat information already held in another system.",
    steps: [
      { title: "Choose a tool", body: "Identify the business system and the specific read or action the agent needs." },
      { title: "Set boundaries", body: "Define what the agent may access, when it may act, and which actions need a person." },
      { title: "Use the result", body: "Bring the tool's response back into the conversation or pass it to a workflow." },
    ],
    applications: [
      { title: "Look up context", body: "Retrieve approved customer or booking information before answering." },
      { title: "Create a record", body: "Send the outcome of a conversation to a connected business system." },
      { title: "Trigger the next step", body: "Use a tool result to route a request or prepare a follow-up." },
    ],
    questions: [
      { question: "What does Vozon MCP (Model Context Protocol) do?", answer: "Vozon MCP gives your voice and chat agents a structured, permissioned interface to look up live data or trigger actions in external tools like calendars, CRMs, and order databases during a conversation." },
      { question: "How is MCP different from a standard webhook or REST API?", answer: "While an API exposes an endpoint, MCP provides a standardized protocol for agents to discover allowed tools, validate parameters, and bring structured results back into the live conversation." },
      { question: "How do I control which data or actions the agent is allowed to use?", answer: "You define strict read/write scopes, field-level permissions, and human approval gates so the agent can only run approved queries or updates." },
      { question: "Can the agent use MCP during a live phone call without awkward delays?", answer: "Yes. Vozon MCP is built for low-latency tool execution so an agent can check open calendar slots or order status and respond naturally while on the call." },
      { question: "Which business tools can connect through Vozon MCP?", answer: "You can connect Google Calendar, Calendly, Salesforce, HubSpot, Shopify, Zendesk, Slack, and your own internal APIs or databases." },
    ], related: ["workflows", "end-to-end-automation", "ai-voice-agent"],
  },
  {
    slug: "workflows", name: "Workflows", category: "Automation", eyebrow: "Build the journey",
    headline: "Build a workflow around what happens next.",
    summary: "Connect a trigger, an AI conversation, a decision, and a follow-up in one clear process.",
    description: "Vozon Workflows let you design the steps around a customer conversation. Start with an event such as a new enquiry, let an agent handle the call or message, then route the outcome to the right person or tool. Set branches for different results so a booked appointment, a callback, and an unresolved question do not all receive the same follow-up.",
    value: "The result of the conversation becomes an action your team can understand and track.",
    steps: [
      { title: "Start with an event", body: "Choose the lead, message, call, or system event that should begin the journey." },
      { title: "Add the conversation", body: "Select the agent and the information it should gather or provide." },
      { title: "Branch by outcome", body: "Route different results to a booking, a message, a tool, or a human follow-up." },
    ],
    applications: [
      { title: "Qualify and book", body: "Speak to a lead, check interest, and send a suitable booking path." },
      { title: "Support and escalate", body: "Resolve a routine request or pass a complex issue with context." },
      { title: "Follow up after a call", body: "Use the call result to decide what message or task should happen next." },
    ],
    questions: [
      { question: "What is a Vozon Workflow?", answer: "It is an automated sequence that connects a starting event (like a new form lead or inbound call), an AI voice or chat conversation, outcome branching rules, and follow-up actions." },
      { question: "Can a single workflow combine voice calls and WhatsApp messages?", answer: "Yes. For example, a workflow can place an qualification call, and then immediately send a WhatsApp calendar pass or written quote based on what the caller decided." },
      { question: "How does outcome branching work after a call finishes?", answer: "Instead of treating every call the same, the workflow evaluates the outcome—such as Interested, Callback Later, or Needs Specialist—and routes each result to its own next step." },
      { question: "What happens if an outbound call is not answered?", answer: "You can configure a wait step and automatic retry call, or send an approved WhatsApp/SMS follow-up asking when the customer prefers to talk." },
      { question: "Do I need to write code to run a multi-step workflow?", answer: "No. Triggers, agent steps, delays, conditional branches, and CRM updates are configured visually so operations and sales teams can manage them together." },
    ], related: ["end-to-end-automation", "vozon-mcp", "ai-voice-agent"],
  },
  {
    slug: "end-to-end-automation", name: "End-to-End Automation", category: "Automation", eyebrow: "From enquiry to outcome",
    headline: "Connect the whole journey, not just the first reply.",
    summary: "Link conversations, decisions, follow-ups, and business tools into one complete customer journey.",
    description: "End-to-end automation uses Vozon agents and workflows together. A new lead can trigger a conversation, the agent can understand the request, and the result can create the appropriate next action. The aim is a connected process that leaves your team with a clear record and a clear responsibility, even when a person needs to step in.",
    value: "Customers experience fewer dead ends. Your team spends less time copying details between channels and systems.",
    steps: [
      { title: "Map the journey", body: "List the common entry points and what a useful outcome looks like for each." },
      { title: "Connect agents and tools", body: "Use voice, messaging, web chat, and approved system actions where they genuinely help." },
      { title: "Review every handoff", body: "Make sure an unresolved request still reaches a person with enough context to act." },
    ],
    applications: [
      { title: "Lead to meeting", body: "Respond to interest, qualify the enquiry, and prepare a booked next step." },
      { title: "Question to resolution", body: "Answer a routine question or direct a complex issue to the right team." },
      { title: "Call to follow-up", body: "Carry the conversation result into a message, task, or connected tool." },
    ],
    questions: [
      { question: "What makes automation end-to-end in Vozon?", answer: "It connects the initial customer enquiry, the voice or chat conversation, live tool lookups via MCP, outcome branching, and CRM or team handoff in one continuous system." },
      { question: "How does context stay intact when a customer moves from a call to WhatsApp?", answer: "All channels share the same workflow state and conversation summary, so a follow-up message or human specialist already has the details gathered on the call." },
      { question: "Where do human teammates fit into end-to-end automation?", answer: "Routine qualification, scheduling, and status checks are handled automatically, while complex or high-priority cases are routed to the right specialist with a complete summary." },
      { question: "Which systems stay updated at the end of a customer journey?", answer: "Confirmed meetings, call summaries, and next-step tasks are written directly to Google Calendar, HubSpot, Salesforce, Zendesk, or Slack." },
      { question: "What is the best way to roll out end-to-end automation?", answer: "Start with one high-volume journey—such as inbound lead qualification to booked calendar slot—verify the handoff rules with your team, and then expand to additional channels." },
    ], related: ["workflows", "vozon-mcp", "ai-voice-agent"],
  },
];

export function getProduct(slug: string) {
  return productCatalog.find((product) => product.slug === slug);
}
