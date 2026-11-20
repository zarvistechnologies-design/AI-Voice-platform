import "./HomeFaqSection.css";

const questions = [
  {
    question: "What is Vozon AI?",
    answer: "Vozon is a multichannel agentic AI platform. Autonomous agents reason over context, call connected tools, and complete tasks across voice, WhatsApp, and website chat—or hand off seamlessly to your team.",
  },
  {
    question: "Which channels can one agentic workflow run on?",
    answer: "One agentic brain operates across phone voice calls, WhatsApp, and website chat. Shared memory, tools, and workflows keep every customer journey connected across channels.",
  },
  {
    question: "Can agents speak and act in different languages?",
    answer: "Yes. Vozon supports multilingual voice and chat execution across Indian and global languages, so agents can reason, converse, and trigger workflows in your customer's preferred language.",
  },
  {
    question: "How do Vozon agents qualify leads and book appointments?",
    answer: "When a lead arrives, an autonomous agent engages by voice or chat, evaluates intent against your criteria, checks live calendar availability, books the slot, and syncs the outcome to your CRM.",
  },
  {
    question: "What happens after an agent finishes a conversation?",
    answer: "Vozon logs the full execution trace—tool calls, criteria met, structured summary, and latency—then automatically triggers downstream webhooks, CRM updates, WhatsApp confirmations, or human handoffs.",
  },
  {
    question: "Can agents connect to the tools and APIs we already use?",
    answer: "Yes. Agents can natively invoke integrations, MCP tools, and custom REST APIs mid-conversation to fetch records, create tickets, or update databases in real time.",
  },
  {
    question: "Can I control guardrails and next steps in a workflow?",
    answer: "Yes. You define the trigger, system instructions, tool permissions, and conditional branches so agents act autonomously within your exact business rules.",
  },
  {
    question: "How can I test a live agent?",
    answer: "Select a language and launch the live voice agent demo at the top of this page, or contact our team to deploy multichannel agentic workflows across WhatsApp, web chat, and voice.",
  },
] as const;

export function HomeFaqSection() {
  return (
    <section className="home-faq-section" id="faq" aria-labelledby="home-faq-title">
      <div className="home-faq-inner">
        <div className="home-faq-intro">
          <span className="home-faq-eyebrow"><i aria-hidden="true" /> FREQUENTLY ASKED QUESTIONS</span>
          <h2 id="home-faq-title">Common questions.</h2>
          <p>Everything you need to know about Vozon AI agents, security, and multichannel automation.</p>
        </div>
        <div className="home-faq-list">
          {questions.map(({ question, answer }, index) => (
            <details key={question} open={index === 0}>
              <summary>
                <span>{question}</span>
                <span className="home-faq-toggle" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none"><path d="m5 7.5 5 5 5-5" /></svg>
                </span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
