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

export function WhoWeAreSection() {
  return (
    <section className="who-section services-showcase" id="company">
      <div className="services-main">
        <div className="who-block">
          <div className="who-heading">
            <p className="section-kicker">Company</p>
            <h2>Who We Are</h2>
          </div>

          <div className="who-content">
            <p>
              We are an AI Voice Platform company helping businesses automate
              and enhance customer communication through intelligent voice AI
              agents.
            </p>
            <div className="who-industries" aria-label="Industries we serve">
              <span>Real estate</span>
              <span>Education</span>
              <span>Healthcare</span>
              <span>Finance</span>
              <span>E-commerce</span>
              <span>Restaurants</span>
            </div>
          </div>
        </div>

        <div className="who-block">
          <div className="who-heading">
            <p className="section-kicker">Platform</p>
            <h2>What We Do</h2>
          </div>

          <div className="who-content">
            <p>
              We provide AI-powered voice agents that handle calls, bookings,
              support queries, follow-ups, and customer interactions 24/7,
              replacing manual, repetitive phone work with smart automation.
            </p>
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
              className="evolution-preview-image"
              src="/images/ai_voice.png"
              alt="AI voice platform preview"
            />
            <div className="evolution-wave" aria-hidden="true">
              {Array.from({ length: 18 }).map((_, index) => (
                <span key={index} />
              ))}
            </div>
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
