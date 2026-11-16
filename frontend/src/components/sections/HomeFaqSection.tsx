import "./HomeFaqSection.css";

const questions = [
  {
    question: "What is Vozon AI?",
    answer: "Vozon is an AI agent platform for customer conversations. Agents can respond across voice, WhatsApp, and website chat, use connected tools, and move the result into a workflow or human handoff.",
  },
  {
    question: "Which channels can one agent use?",
    answer: "Vozon supports phone conversations, WhatsApp, and website chat. Workflows and integrations connect those conversations to the tools your team uses.",
  },
  {
    question: "Can the agent speak different languages?",
    answer: "Yes. Vozon supports multilingual voice conversations, so you can choose a language that suits the people you are speaking with.",
  },
  {
    question: "Can Vozon qualify leads and book appointments?",
    answer: "Yes. A workflow can start with a new lead, let an agent handle the conversation, and route an interested person to an appointment or another follow-up step.",
  },
  {
    question: "What happens after a conversation ends?",
    answer: "The result can show the outcome, a summary, and the next action for your team, such as a booking, follow-up, or human handoff.",
  },
  {
    question: "Can I connect Vozon to the tools we already use?",
    answer: "Yes. Vozon can connect conversations to your workflow through integrations and custom API connections, so the right information reaches the right place.",
  },
  {
    question: "Can I choose what happens next in a workflow?",
    answer: "Yes. You can set a starting event, define what the agent should do, and route the result based on the outcome of the conversation.",
  },
  {
    question: "How can I try an agent?",
    answer: "Choose a language to try the live voice demo at the top of this page. Contact our team to explore WhatsApp, web chat, and workflows for your business.",
  },
] as const;

export function HomeFaqSection() {
  return (
    <section className="home-faq-section" id="faq" aria-labelledby="home-faq-title">
      <div className="home-faq-inner">
        <div className="home-faq-intro">
          <span className="home-faq-eyebrow"><i aria-hidden="true" /> FAQ</span>
          <h2 id="home-faq-title">Common questions</h2>
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
