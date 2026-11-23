import type { SolutionLandingContent } from "@/components/layout/SolutionLandingPage";

type IndustryOperations = Pick<SolutionLandingContent, "audiences" | "videoDescription" | "rollout" | "platformCards" | "launchOptions" | "faqs"> & { connections: readonly string[] };

export const industryOperations: Record<string, IndustryOperations> = {
  "financial-services": {
    audiences: { heading: "Built for the teams behind every financial conversation.", items: [
      { title: "Banks and credit unions", body: "Answer branch questions, guide appointment requests, and collect the reason for a callback before a banker joins." },
      { title: "Lenders and loan teams", body: "Follow up on missing application details and route product or eligibility questions to authorized staff." },
      { title: "Advisory and wealth teams", body: "Schedule consultations, confirm meeting details, and prepare an advisor with the client's stated interests." },
    ] },
    connections: ["Phone systems", "Calendars", "CRM", "Client service tools"],
    videoDescription: "See how a client request can become a booked advisor conversation with the caller's context already attached.",
    rollout: { focused: "Start with consultation booking or branch call routing. Set approved answers, verification steps, and escalation rules with your service team.", expanded: "Add document follow-ups, client service questions, and more locations after reviewing real calls and advisor handoffs." },
    platformCards: [
      { title: "The right advisor, sooner", body: "Use the caller's reason, location, and preferred time to prepare a suitable consultation handoff.", label: "ADVISOR ROUTING" },
      { title: "A useful client record", body: "Send the requested action, contact details, and call summary to the team and system that own the relationship.", label: "CLIENT CONTEXT" },
      { title: "Clear boundaries", body: "Keep financial advice, eligibility decisions, and sensitive exceptions with authorized people.", label: "TEAM OVERSIGHT" },
    ],
    launchOptions: { first: "Pick one call type, such as consultation requests. Define what the agent can say, what information it can collect, and when a banker takes over.", second: "Connect approved phone routes, calendars, and client systems so a booked meeting or callback appears where your team already works." },
    faqs: [
      { question: "Can a bank use an AI agent to book branch appointments?", answer: "Yes. With a connected calendar, the agent can collect the visit reason, offer available times, and confirm the next step. A banker can review the context before the meeting." },
      { question: "Can it answer questions about a customer's account?", answer: "Only within the access and verification rules you configure. Start with approved general information and route account-specific, sensitive, or uncertain questions to your staff." },
      { question: "Will it make loan or investment recommendations?", answer: "The recommended setup keeps advice, eligibility, and product decisions with authorized professionals. The agent can gather the question and arrange the right conversation." },
      { question: "How does an advisor receive a call summary?", answer: "A supported integration or webhook can send the caller's request, contact details, and agreed next action to your CRM or team workflow, subject to your configuration." },
      { question: "Can we start with one branch or one service line?", answer: "Yes. Start with a defined route and a small set of approved tasks, review test calls, and expand once the team is comfortable with the handoffs." },
    ],
  },
  insurance: {
    audiences: { heading: "Built for policy, claims, and service teams.", items: [
      { title: "Carriers and service centers", body: "Answer routine policy servicing calls, find the right department, and capture a customer's reason for contact." },
      { title: "Claims teams", body: "Collect first-notice facts, confirm references, and prepare a structured handoff for an adjuster or claims specialist." },
      { title: "Agents and brokers", body: "Handle renewal questions, appointment requests, and callbacks while keeping licensed staff close to complex decisions." },
    ] },
    connections: ["Phone systems", "Policy systems", "Claims tools", "CRM"],
    videoDescription: "See how a first claim call can turn into a clear intake record and a timely handoff to the claims team.",
    rollout: { focused: "Begin with one journey, such as first-notice intake or renewal callbacks. Approve the questions, disclosures, and staff handoff rules.", expanded: "Connect policy, claims, and service workflows only after testing references, missing data, and exceptions with the teams that own them." },
    platformCards: [
      { title: "Consistent first notice", body: "Ask for the incident date, location, policy reference, and preferred callback path in a consistent order.", label: "CLAIMS INTAKE" },
      { title: "Policy context together", body: "Attach the customer's stated need and conversation summary to the case for the next specialist.", label: "CASE CONTEXT" },
      { title: "Licensed decisions stay human", body: "Route coverage interpretations, settlements, disputes, and unusual claims to authorized staff.", label: "REVIEW CONTROLS" },
    ],
    launchOptions: { first: "Choose one servicing call type and its approved script. Test confusing policy terms, caller uncertainty, and requests for a licensed agent.", second: "Connect the phone route and supported policy or claims system so intake details and callback tasks reach the right queue." },
    faqs: [
      { question: "Can an AI agent take the first details of a claim?", answer: "Yes. It can collect the incident facts you specify and send them for staff review. It should not decide coverage or the claim outcome." },
      { question: "Can it remind customers about renewals?", answer: "An approved outreach workflow can place reminders, capture whether the customer wants a callback, and record the result for your renewal team." },
      { question: "Can it explain a policy?", answer: "It can share approved policy servicing information. Questions that require interpretation, advice, or an exception should go to a licensed or authorized teammate." },
      { question: "What happens if a caller has an urgent claim?", answer: "Define urgency signals and a direct escalation path. The agent can collect essential details and transfer or notify the appropriate claims team." },
      { question: "Can our agents see what the customer already said?", answer: "With a supported integration, the conversation summary and structured intake fields can be attached to a case or team workflow before the handoff." },
    ],
  },
  logistics: {
    audiences: { heading: "Built for the people who keep deliveries moving.", items: [
      { title: "Parcel and courier teams", body: "Answer tracking calls and capture a recipient's new delivery instructions from connected shipment data." },
      { title: "Dispatch and field operations", body: "Triage driver calls, failed attempts, access issues, and requests that need a dispatcher now." },
      { title: "Retail fulfillment teams", body: "Keep order, delivery, and customer support conversations connected when an exception occurs." },
    ] },
    connections: ["Phone systems", "Tracking systems", "Dispatch tools", "Customer support"],
    videoDescription: "See how a delivery question can become a current status update, an instruction, or an exception task for dispatch.",
    rollout: { focused: "Start with shipment-status calls or failed-delivery follow-up. Connect a reliable tracking source and define which changes need a dispatcher.", expanded: "Add driver coordination and proactive delivery calls after testing missing tracking data, address changes, and urgent exceptions." },
    platformCards: [
      { title: "Latest shipment context", body: "Use connected order and tracking references to ground the response in the current delivery state.", label: "TRACKING" },
      { title: "Dispatch-ready details", body: "Capture location, shipment number, access issue, and the action requested before the handoff.", label: "EXCEPTION ROUTING" },
      { title: "A visible next task", body: "Log a reschedule request or failed attempt so operations and support can see what was promised.", label: "OPERATIONS" },
    ],
    launchOptions: { first: "Map the most frequent recipient and driver calls, then decide which the agent can answer from tracking data and which require dispatch.", second: "Connect your carrier phone route and supported tracking or dispatch system so status updates and exception tasks stay synchronized." },
    faqs: [
      { question: "Can the agent tell a customer where a package is?", answer: "When connected to your tracking system, it can share the latest available status and expected next step. Missing or conflicting data should route to operations." },
      { question: "Can it change a delivery address?", answer: "It can collect the requested address and follow your rules. Whether it updates a shipment automatically depends on the connected system and the stage of delivery." },
      { question: "What if a driver cannot complete a delivery?", answer: "The agent can capture the shipment reference, location, and reason for the failed attempt, then alert the dispatcher with that context." },
      { question: "Can it make proactive delivery calls?", answer: "A configured workflow can confirm a window, request access details, or arrange another attempt using approved calling rules." },
      { question: "Will support see the delivery conversation?", answer: "A supported integration can attach the call summary and recorded next action to the order or support case for the next teammate." },
    ],
  },
  "home-services": {
    audiences: { heading: "Built for busy service businesses and field teams.", items: [
      { title: "Plumbing and electrical teams", body: "Catch urgent calls, collect the problem and address, and alert the person on call." },
      { title: "HVAC and maintenance teams", body: "Book visits, confirm access details, and manage maintenance reminders while technicians are on site." },
      { title: "Multi-location service brands", body: "Route a caller by service area, trade, and availability while keeping job details in one record." },
    ] },
    connections: ["Phone systems", "Job calendars", "Field service tools", "CRM"],
    videoDescription: "See how a missed-call risk becomes a captured job request, a scheduled visit, or an on-call alert.",
    rollout: { focused: "Start with after-hours booking or one urgent-call route. Define service area, information to collect, and who receives an escalation.", expanded: "Add visit reminders, more trades, and multiple locations once your dispatchers and technicians have reviewed the first calls." },
    platformCards: [
      { title: "Every job starts with detail", body: "Capture address, service type, timing, and access notes before the office or technician calls back.", label: "JOB INTAKE" },
      { title: "Route by service area", body: "Use the caller's location and issue to reach the right branch, trade, or on-call team.", label: "DISPATCH" },
      { title: "Keep the schedule current", body: "Pass a booking request or changed visit detail into the calendar and job workflow your team checks.", label: "FIELD OPERATIONS" },
    ],
    launchOptions: { first: "Choose the jobs and areas you cover. Set booking questions, urgent-call triggers, hours, and the handoff to your office or on-call technician.", second: "Connect approved calendars and field-service tools so new jobs, visit changes, and callback requests reach the right crew." },
    faqs: [
      { question: "Can an AI receptionist answer calls while my team is on a job?", answer: "Yes. It can collect the customer's address, issue, and preferred time, then send a booking or callback request to your office." },
      { question: "How does it handle emergency service calls?", answer: "Set the words and situations that trigger an immediate handoff or alert to your on-call team. The agent can collect the location and issue first." },
      { question: "Can it book a technician directly?", answer: "With a suitable scheduling connection, it can check eligible availability and confirm a time. Otherwise it can take a complete request for dispatcher review." },
      { question: "Can it tell callers whether we serve their address?", answer: "Yes, if you provide an approved service-area list or connected lookup. Ambiguous addresses can go to staff for confirmation." },
      { question: "Can customers change an existing appointment?", answer: "A connected workflow can capture or make an allowed schedule change, then notify the assigned team with the new details." },
    ],
  },
  "retail-consumer": {
    audiences: { heading: "Built for brands, stores, and shopper support teams.", items: [
      { title: "E-commerce brands", body: "Answer order-status and return questions from connected storefront and fulfillment data." },
      { title: "Store and pickup teams", body: "Help callers check hours, pickup instructions, or local availability before they visit." },
      { title: "Customer care teams", body: "Triage missing orders, exchange requests, and product questions with a clear support handoff." },
    ] },
    connections: ["Phone systems", "Commerce platforms", "Order systems", "Help desk"],
    videoDescription: "See how an order question can become a useful answer or a support case with the order context already attached.",
    rollout: { focused: "Start with order status or store information. Connect the right source of truth and approve what the agent should say when an order is delayed.", expanded: "Add returns, pickup, and product questions as your team reviews common shopper requests and exceptions." },
    platformCards: [
      { title: "Order-aware answers", body: "Use a connected order reference to explain the latest available status and next delivery step.", label: "ORDER SUPPORT" },
      { title: "Store information at hand", body: "Share approved hours, pickup instructions, availability, and policies without sending shoppers through a phone menu.", label: "SHOPPER EXPERIENCE" },
      { title: "Exceptions reach people", body: "Pass missing parcels, damaged goods, and policy exceptions to care agents with a concise summary.", label: "HUMAN HANDOFF" },
    ],
    launchOptions: { first: "Select the shopper questions you can answer confidently. Test late orders, partial shipments, returns, and callers without an order number.", second: "Connect supported commerce, fulfillment, and help-desk tools so the answer and any support task use the same order context." },
    faqs: [
      { question: "Can shoppers ask where their order is?", answer: "Yes. With a connected order or fulfillment system, the agent can share the latest available status and route exceptions to support." },
      { question: "Can it handle returns and exchanges?", answer: "It can explain approved policy steps, collect the order reference and reason, and create a request. Exceptions or eligibility decisions can go to staff." },
      { question: "Can it check store availability?", answer: "If a reliable inventory source is connected, it can provide the available information for a selected store or offer a staff callback." },
      { question: "Will it use our brand's tone?", answer: "You can set the voice, greeting, approved wording, and escalation behavior, then review test conversations before launch." },
      { question: "Can an unresolved call become a support ticket?", answer: "A supported integration can create a case containing the order reference, issue, conversation summary, and promised next step." },
    ],
  },
  "travel-hospitality": {
    audiences: { heading: "Built for every team in the guest journey.", items: [
      { title: "Hotels and resorts", body: "Handle reservation questions, check-in requests, and front-desk overflow when staff are serving guests in person." },
      { title: "Travel operators", body: "Answer itinerary questions, capture changes, and route exceptional requests to the right trip specialist." },
      { title: "Guest service teams", body: "Log transport, room, and service requests with the booking context needed to follow through." },
    ] },
    connections: ["Phone systems", "Booking systems", "Guest calendars", "Service tools"],
    videoDescription: "See how a guest request can become a confirmed reservation detail or a front-desk task before arrival.",
    rollout: { focused: "Start with one property or reservation line. Approve hours, amenities, booking information, and the requests that require a staff member.", expanded: "Add pre-arrival outreach, more properties, and guest-service requests once your front desk has reviewed the first handoffs." },
    platformCards: [
      { title: "Reservation context", body: "Use available booking dates and guest details to make the next response relevant.", label: "BOOKING SUPPORT" },
      { title: "Requests reach staff", body: "Pass a late arrival, room request, or transport question to the right team with the conversation attached.", label: "GUEST SERVICE" },
      { title: "A familiar welcome", body: "Configure languages and greetings suited to the guests and locations you serve.", label: "MULTILINGUAL CALLS" },
    ],
    launchOptions: { first: "Choose one guest journey, such as booking questions or pre-arrival calls. Test cancellations, unavailable dates, special requests, and urgent issues.", second: "Connect supported reservation, property, and guest-service systems so updates and staff tasks remain visible in existing operations." },
    faqs: [
      { question: "Can guests change a reservation by phone?", answer: "With an appropriate booking connection and your rules, the agent can offer eligible options or capture the requested change for staff confirmation." },
      { question: "Can it answer questions about hotel amenities?", answer: "Yes. Provide approved, current property information such as hours, parking, accessibility details, and check-in instructions." },
      { question: "What if a guest has a special request?", answer: "The agent can record the request with the booking context and route it to a front-desk or guest-service teammate for confirmation." },
      { question: "Can it call guests before arrival?", answer: "A configured workflow can confirm arrival details or collect preferences using approved calling rules and a connected guest list." },
      { question: "Can it speak to international guests?", answer: "You can configure supported languages and voices, then test local names, directions, and important property instructions." },
    ],
  },
  "debt-collection": {
    audiences: { heading: "Built for teams managing sensitive account contact.", items: [
      { title: "Loan servicers", body: "Handle approved reminder and callback workflows while preserving account context for authorized staff." },
      { title: "In-house recovery teams", body: "Record contact outcomes and route disputes or hardship requests for human review." },
      { title: "Collection operations", body: "Keep scripts, timing, escalation, and opt-out rules aligned with the program approved by your organization." },
    ] },
    connections: ["Phone systems", "Account systems", "Case management", "Team queues"],
    videoDescription: "See how an approved reminder can end with a documented response and the right specialist owning the next step.",
    rollout: { focused: "Start with one approved reminder type. Confirm calling rules, identity steps, disclosures, opt-out handling, and human review with your compliance team.", expanded: "Add callback and dispute intake only after testing difficult conversations, inaccurate account data, and staff escalation." },
    platformCards: [
      { title: "Approved language", body: "Keep messages within the scripts and boundaries your organization has reviewed for each contact type.", label: "SCRIPT CONTROL" },
      { title: "Every outcome recorded", body: "Capture a callback request, dispute, or no-answer outcome for the authorized account team.", label: "CASE CONTEXT" },
      { title: "Human review when needed", body: "Move hardship, negotiation, disputed balances, and legal questions to trained staff.", label: "ESCALATION" },
    ],
    launchOptions: { first: "Have your compliance and operations teams approve one contact journey, including the exact script, calling window, verification, and stop conditions.", second: "Connect approved account and case systems so disposition codes, callbacks, and review tasks reach the authorized team." },
    faqs: [
      { question: "Can an AI agent make payment reminder calls?", answer: "A configured agent can place reminders under the scripts, timing, and consent rules your organization approves. Your legal and compliance teams should review the final workflow before launch." },
      { question: "What if someone disputes a balance?", answer: "The agent should record the dispute and route it to an authorized person, without arguing the claim or deciding the outcome." },
      { question: "Can it arrange a callback with a specialist?", answer: "Yes. It can capture a preferred time and the stated reason, then create a callback task for your account team." },
      { question: "How are opt-out or wrong-number requests handled?", answer: "Define explicit stop and review rules. The agent can flag the request and update the connected case workflow according to the process your team approves." },
      { question: "Can it negotiate repayment terms?", answer: "The safer starting point is to leave negotiation, hardship, and legal questions with trained staff. The agent can collect the request and arrange a handoff." },
    ],
  },
};
