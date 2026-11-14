import type { SolutionLandingContent } from "@/components/layout/SolutionLandingPage";

type UseCaseOperations = Pick<SolutionLandingContent, "audiences" | "videoDescription" | "rollout" | "platformCards" | "launchOptions">;

export const useCaseOperations: Record<string, UseCaseOperations> = {
  "lead-qualification": {
    audiences: { heading: "Built for teams that turn interest into a conversation.", items: [
      { title: "Inbound sales teams", body: "Answer a new enquiry, ask the right discovery questions, and route a ready buyer to a salesperson." },
      { title: "Demand generation teams", body: "Follow up with campaign leads while the product or event is still fresh in their mind." },
      { title: "Account executives", body: "Start a booked meeting with the prospect's need, timing, and stated next step already available." },
    ] },
    videoDescription: "See how an enquiry can become a qualified lead, a useful CRM record, and a booked sales conversation.",
    rollout: { focused: "Start with one lead source and a short set of qualification questions. Define what makes a lead ready for a salesperson.", expanded: "Add campaigns, languages, scoring rules, and CRM updates after reviewing the quality of your first sales handoffs." },
    platformCards: [
      { title: "Ask what sales needs", body: "Collect need, timing, location, and buying context in a natural conversation.", label: "DISCOVERY" },
      { title: "Move the right lead", body: "Book a meeting or alert sales when the answers match the qualification rules you set.", label: "ROUTING" },
      { title: "Keep the record useful", body: "Send structured answers, a summary, and the promised next action to your CRM.", label: "SALES CONTEXT" },
    ],
    launchOptions: { first: "Define one lead type, the questions to ask, and the point at which an agent should offer a meeting or a human transfer.", second: "Connect your chosen lead source, calendar, and CRM so qualification answers and bookings reach the sales owner." },
  },
  "customer-support": {
    audiences: { heading: "Built for teams answering the same questions every day.", items: [
      { title: "Customer care teams", body: "Answer repeatable service questions and bring a teammate in with the issue already explained." },
      { title: "E-commerce support", body: "Check connected order details, collect delivery issues, and pass exceptions to the right queue." },
      { title: "Account service desks", body: "Handle approved account process questions and capture the context for sensitive requests." },
    ] },
    videoDescription: "See how a support call can end in an answer, a completed action, or a handoff with the customer's context.",
    rollout: { focused: "Begin with high-volume questions that have clear approved answers, such as status checks or service hours.", expanded: "Add connected actions and more support intents after testing missing data, failed tools, and requests for a person." },
    platformCards: [
      { title: "Approved answers", body: "Ground responses in the help content and policies your support team maintains.", label: "KNOWLEDGE" },
      { title: "Context before transfer", body: "Capture the issue, checks already made, and what the customer expects next.", label: "HANDOFF" },
      { title: "Clear resolution record", body: "Write the outcome or unresolved issue to the support workflow your team already uses.", label: "CASE MANAGEMENT" },
    ],
    launchOptions: { first: "Select the support questions you can answer reliably and the conditions that require a person or specialist.", second: "Connect approved help content, customer tools, and ticketing so status checks and escalations use current information." },
  },
  receptionists: {
    audiences: { heading: "Built for front desks that cannot miss a call.", items: [
      { title: "Busy offices", body: "Welcome callers, answer routine questions, and take a complete message when staff are occupied." },
      { title: "Appointment teams", body: "Check a connected calendar, offer a time, and pass booking changes to the right person." },
      { title: "Multi-location businesses", body: "Identify a caller's location and reason for contact before routing them to the correct branch." },
    ] },
    videoDescription: "See how a front-desk call can become a booked visit, a useful message, or a smooth transfer.",
    rollout: { focused: "Start with overflow or after-hours calls. Approve the greeting, hours, message fields, and urgent-transfer rules.", expanded: "Add booking, more departments, and locations once your front-desk team has reviewed real caller questions." },
    platformCards: [
      { title: "A helpful first answer", body: "Greet callers in your business voice and understand why they reached out.", label: "FIRST RESPONSE" },
      { title: "Book or take a message", body: "Capture the time or details the receiving teammate needs before the call ends.", label: "FRONT DESK ACTIONS" },
      { title: "Route with context", body: "Use location, department, hours, and urgency to find the right next step.", label: "CALL ROUTING" },
    ],
    launchOptions: { first: "List the call types your front desk receives and decide which the agent answers, books, records, or transfers.", second: "Connect business hours, phone routes, calendars, and team contacts so the promised next step is actionable." },
  },
  "dispatch-service": {
    audiences: { heading: "Built for teams coordinating work in the field.", items: [
      { title: "Service dispatchers", body: "Collect the address, issue, and timing before assigning a technician or crew." },
      { title: "On-call operations", body: "Escalate urgent or after-hours requests with the details needed to respond." },
      { title: "Field teams", body: "Receive a clearer job brief and keep updates connected to the original request." },
    ] },
    videoDescription: "See how a time-sensitive call can become a prioritized job with the right field team informed.",
    rollout: { focused: "Choose one dispatch route and define urgency signals, service areas, and the information a dispatcher needs.", expanded: "Add more job types, crews, and after-hours paths once missed calls and escalation outcomes are reviewed." },
    platformCards: [
      { title: "Complete job intake", body: "Capture location, issue, contact details, access notes, and the requested response time.", label: "INTAKE" },
      { title: "Urgency made visible", body: "Flag safety or service-critical details so on-call staff can review them immediately.", label: "PRIORITY ROUTING" },
      { title: "Field updates connected", body: "Pass the request and any follow-up to the dispatch system or team queue.", label: "OPERATIONS" },
    ],
    launchOptions: { first: "Map one field-service call type, the questions to ask, and the exact signals for an urgent human handoff.", second: "Connect approved phone routes, job schedules, and dispatch tools so a completed call creates the right team action." },
  },
};
