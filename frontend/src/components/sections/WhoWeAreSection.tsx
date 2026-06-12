const evolutionCards = [
  {
    title: "Before AI Voice",
    copy: "Teams handled every call manually, with long waits, missed calls, and slow follow-ups.",
  },
  {
    title: "Using Voice AI",
    copy: "Voice agents answer naturally, book appointments, support customers, and update CRM 24/7.",
  },
  {
    title: "Business Impact",
    copy: "Teams handle more calls, respond faster, and reduce repetitive phone work.",
  },
];

const industryTags = [
  "Real estate",
  "Education",
  "Healthcare",
  "Finance",
  "E-commerce",
  "Restaurants",
];

const platformSignals = [
  { label: "Always-on", value: "24/7" },
  { label: "Voice workflows", value: "CRM" },
  { label: "Human handoff", value: "Live" },
];

const workflowPills = ["Answer", "Understand", "Book", "Follow up"];

export function WhoWeAreSection() {
  return (
    <section className="who-section services-showcase" id="company">
      <div className="services-main">
        <div className="who-story-grid">
          <div className="who-block who-block--identity">
            <div className="who-heading">
              <p className="section-kicker">Company</p>
              <h2>Who We Are</h2>
            </div>

            <div className="who-content">
              <span className="who-card-glow" aria-hidden="true" />
              <p>
                We are an AI Voice Platform company helping businesses turn
                every customer call into a faster, warmer, and more intelligent
                conversation.
              </p>
              <div className="who-industries" aria-label="Industries we serve">
                {industryTags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="who-block who-block--platform">
            <div className="who-heading">
              <p className="section-kicker">Platform</p>
              <h2>What We Do</h2>
            </div>

            <div className="who-content">
              <span className="who-card-glow" aria-hidden="true" />
              <p>
                We provide AI-powered voice agents that answer calls, manage
                bookings, support customers, and follow up automatically while
                your team stays focused on the moments that need a human touch.
              </p>
              <div className="who-signal-grid" aria-label="Platform strengths">
                {platformSignals.map((signal) => (
                  <span key={signal.label}>
                    <strong>{signal.value}</strong>
                    {signal.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="who-flow-panel" aria-label="AI voice workflow">
          <div className="who-flow-copy">
            <p className="section-kicker">Call flow</p>
            <h3>From first ring to completed action.</h3>
          </div>
          <div className="who-flow-steps">
            {workflowPills.map((step, index) => (
              <span key={step}>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
                {step}
              </span>
            ))}
          </div>
          <div className="who-flow-wave" aria-hidden="true">
            {Array.from({ length: 22 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
        </div>

        <div className="voice-evolution">
          <div className="evolution-copy">
            <p className="section-kicker">Evolution</p>
            <h2>AI Voice Technology changed how businesses handle calls.</h2>

            <div className="evolution-card-list" aria-label="Voice technology stages">
              {evolutionCards.map((card, index) => (
                <article className="evolution-card-item" key={card.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{card.title}</h3>
                  <p>{card.copy}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="evolution-visual" aria-label="Evolution of AI voice technology">
            <img
              // className="evolution-preview-image"
              src="/images/ai_voice2.gif"
              className="w-[600px] scale-230 -translate-y-18 mix-blend-lighten"
              // className="w-[400px]"git push
              alt="AI voice platform preview"
            />
            {/* <div className="evolution-wave" aria-hidden="true">
              {Array.from({ length: 18 }).map((_, index) => (
                <span key={index} />
              ))}
            </div> */}
            <div className="evolution-timeline">
              <span>Manual calls</span>
              <span>Rigid IVR</span>
              <span>AI voice agents</span>
            </div>
            <strong>Voice AI Evolution</strong>
            <p>From missed calls and manual updates to always-on intelligent conversations.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
