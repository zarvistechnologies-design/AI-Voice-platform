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
      { title: "Define the job", body: "Choose the questions the agent should answer, what it should collect, and where a human should take over." },
      { title: "Connect the conversation", body: "Give the agent the relevant knowledge and tools so it can respond to the caller's actual request." },
      { title: "Capture the result", body: "Record the intent, important details, and next action so the conversation does not end at goodbye." },
    ],
    applications: [
      { title: "Lead qualification", body: "Ask the right questions before a sales conversation and pass along a useful summary." },
      { title: "Appointment booking", body: "Help a caller find a suitable time and confirm the next step." },
      { title: "Customer support", body: "Answer common questions and route requests that need a specialist." },
    ],
    questions: [
      { question: "What is an AI voice agent?", answer: "It is a conversational assistant that speaks with callers, understands their requests, and follows a defined process to answer or take the next step." },
      { question: "Can an agent transfer a call to a person?", answer: "A voice workflow can include a handoff rule for requests that need a human. Define the trigger and destination as part of your setup." },
      { question: "Can I use it for inbound and outbound calls?", answer: "Voice agents can support both incoming enquiries and planned follow-ups. The conversation and consent requirements should be configured for each use case." },
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
      { question: "What is the difference between WhatsApp API and a WhatsApp bot?", answer: "The API connects the business channel to software. A bot is the conversational experience that uses that connection to answer messages and follow a process." },
      { question: "Do I need a business WhatsApp account?", answer: "Business messaging generally requires an eligible WhatsApp Business setup. Account eligibility and message rules depend on Meta's current requirements." },
      { question: "Can WhatsApp follow a voice call?", answer: "Yes. A workflow can use the call outcome to decide whether a WhatsApp follow-up is appropriate, subject to your messaging permissions and setup." },
    ], related: ["whatsapp-bot", "workflows", "ai-voice-agent"],
  },
  {
    slug: "whatsapp-bot", name: "WhatsApp Bot", category: "Messaging", eyebrow: "Conversations in WhatsApp",
    headline: "A WhatsApp bot that keeps the conversation moving.",
    summary: "Answer questions, gather details, and guide customers to a useful next step inside WhatsApp.",
    description: "A Vozon WhatsApp bot turns an incoming message into a guided conversation. It can ask clarifying questions, provide information from the knowledge you give it, and pass a request to the right place. Design the bot around your real customer journeys so people can get help without starting over on another channel.",
    value: "Customers can continue where they are comfortable, while your team receives a clearer request and the context behind it.",
    steps: [
      { title: "Choose the entry point", body: "Start with a customer message, a campaign response, or a follow-up from another approved channel." },
      { title: "Guide the exchange", body: "Give the bot the questions, answers, and boundaries that match your business process." },
      { title: "Make the next step clear", body: "Route a qualified enquiry, share information, or hand the conversation to your team." },
    ],
    applications: [
      { title: "Lead intake", body: "Collect what a prospect needs and prepare the context for a sales follow-up." },
      { title: "Support triage", body: "Understand the issue before a person joins the conversation." },
      { title: "Appointment follow-up", body: "Confirm the details and keep the customer informed after booking." },
    ],
    questions: [
      { question: "Can the bot answer my company's questions?", answer: "You can provide the information and rules it should use. Review its answers against your actual policies before launch." },
      { question: "Can a person take over a conversation?", answer: "A workflow can route a conversation to your team when the request needs human attention." },
      { question: "Is this the same as WhatsApp API?", answer: "No. The WhatsApp API is the channel connection; the bot is the conversation you design on top of it." },
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
      { question: "What is a web chatbot?", answer: "It is a chat experience embedded on your website that can answer visitor questions and help them take the next step." },
      { question: "Can it pass a lead to my team?", answer: "Yes. You can define what information to collect and where a qualified enquiry should go." },
      { question: "How is it different from a WhatsApp bot?", answer: "A web chatbot lives on your site. A WhatsApp bot continues the conversation in WhatsApp. Both can be connected to a wider workflow." },
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
      { question: "What do I need to clone a voice?", answer: "You need suitable source material and the right to use the speaker's voice. The exact recording requirements depend on the voice setup." },
      { question: "Can I clone someone else's voice?", answer: "Only use a voice when you have the speaker's informed permission and the necessary rights." },
      { question: "Will it work in every language?", answer: "Language quality depends on the source voice and setup. Test the languages and phrases you intend to use before deployment." },
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
      { question: "What does MCP mean?", answer: "MCP stands for Model Context Protocol. It provides a structured way for AI applications to use external tools and context." },
      { question: "Is MCP the same as an API?", answer: "An API exposes a service. MCP gives an AI application a common way to discover and use tools, which may themselves call APIs." },
      { question: "Can I control what the agent does?", answer: "You should define the allowed tools, access, and approval rules for each use case. Start with a narrow action and test it before expanding access." },
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
      { question: "What is an AI agent workflow?", answer: "It is a defined series of triggers, conversations, decisions, and actions that moves an enquiry toward an outcome." },
      { question: "Can a workflow use more than one channel?", answer: "Yes. A journey can begin on one channel and continue on another when your setup and customer permissions support it." },
      { question: "Do I need to code every step?", answer: "The workflow is designed around configurable steps. Specific external actions may still need an API or tool connection." },
    ], related: ["create-workflows", "end-to-end-automation", "vozon-mcp"],
  },
  {
    slug: "create-workflows", name: "Create Workflows", category: "Automation", eyebrow: "Build a process you can follow",
    headline: "Create workflows that turn conversations into action.",
    summary: "Design the path from a new enquiry to an AI conversation, a decision, and the right follow-up.",
    description: "The workflow builder helps you put a customer journey on one canvas. Add a starting trigger, choose an agent, and connect the outcome to a message, a booking, an approved tool, or a person. Make the branches visible before you launch, so everyone can understand what happens after a successful conversation and what happens when the agent needs help.",
    value: "A clear workflow gives your team a shared picture of what the agent should do and what still needs a person.",
    steps: [
      { title: "Pick a starting point", body: "Begin with a lead, an incoming message, or another event your team wants to respond to." },
      { title: "Lay out the conversation", body: "Add the agent step and define the information or decision it should produce." },
      { title: "Connect each outcome", body: "Create separate paths for booking, follow-up, escalation, and requests that cannot be resolved automatically." },
    ],
    applications: [
      { title: "A new lead", body: "Start a call, understand what the prospect needs, and route a qualified enquiry." },
      { title: "A missed conversation", body: "Set a follow-up path when the first attempt does not reach the customer." },
      { title: "A support request", body: "Answer a routine question or send a complex case to the right person." },
    ],
    questions: [
      { question: "How do I create an AI workflow?", answer: "Choose a trigger, add the agent or message step, then connect the possible outcomes to the actions that should follow. Test the branches before using the workflow with customers." },
      { question: "Can I use different paths for different call results?", answer: "Yes. A workflow can branch so a booked meeting, a callback request, and an unresolved issue each lead to a different next step." },
      { question: "What should my first workflow be?", answer: "Start with a process your team already understands, such as qualifying a new enquiry and booking a suitable follow-up." },
    ], related: ["workflows", "end-to-end-automation", "ai-voice-agent"],
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
      { question: "What makes automation end to end?", answer: "It connects the starting event, the customer conversation, the decision, and the final action instead of stopping at an initial response." },
      { question: "Can people stay in the process?", answer: "Yes. Include human review and handoff wherever a decision needs judgment or a request falls outside the agent's scope." },
      { question: "Where should I begin?", answer: "Start with one repeatable journey, such as an incoming enquiry followed by qualification and booking. Define the outcome and exceptions before adding more paths." },
    ], related: ["workflows", "vozon-mcp", "ai-voice-agent"],
  },
];

export function getProduct(slug: string) {
  return productCatalog.find((product) => product.slug === slug);
}
