import { platformFeatures } from "@/config/site";

const workflowSteps = [
  {
    title: "Write",
    body: "Paste a script or stream text from your product.",
  },
  {
    title: "Tune",
    body: "Choose voice, pacing, language, and emotion.",
  },
  {
    title: "Preview",
    body: "Generate low-latency speech and review the transcript.",
  },
  {
    title: "Deploy",
    body: "Export audio or call the API from your workflow.",
  },
];

const useCases = [
  {
    title: "For Support Teams",
    body: "Resolve routine calls with voice agents that understand context, detect urgency, and hand off cleanly when a human should step in.",
  },
  {
    title: "For Creators",
    body: "Produce narration, ads, lessons, and localized clips with consistent tone across every language and channel.",
  },
  {
    title: "For Developers",
    body: "Connect text-to-speech, voice cloning, and live preview workflows through stable APIs with clear usage controls.",
  },
];

export function FeaturesSection() {
  return (
    <div className="homepage-flow">
      <section className="live-demo" id="demo" aria-label="Live voice demo">
        <div>
          <p className="section-kicker">Live voice demo</p>
          <h2>Turn any script into polished audio before you ship.</h2>
        </div>
        <form className="demo-console">
          <div className="demo-field">
            <label htmlFor="demo-text">Script</label>
            <input
              id="demo-text"
              type="text"
              placeholder="Type any text here..."
              defaultValue="Welcome back. Your appointment is confirmed for tomorrow at 10 AM."
            />
          </div>
          <button type="button">Generate</button>
          <div className="mini-wave" aria-hidden="true">
            {Array.from({ length: 12 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
        </form>
      </section>

      <section className="feature-section" id="features">
        <div className="section-heading">
          <p className="section-kicker">Features</p>
          <h2>Everything needed to build clear, natural voice experiences.</h2>
        </div>

        <div className="feature-grid" aria-label="Platform highlights">
          {platformFeatures.map((feature) => (
            <article key={feature.title}>
              <span className="feature-icon" aria-hidden="true">
                {feature.icon}
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="workflow-section" aria-label="How it works">
        <div className="section-heading">
          <p className="section-kicker">How it works</p>
          <h2>From text to finished voice in four simple moves.</h2>
        </div>

        <div className="workflow-steps">
          {workflowSteps.map((step, index) => (
            <article key={step.title}>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="use-case-section" id="business">
        <div className="use-case-heading">
          <p className="section-kicker">Built for teams</p>
          <h2>One voice layer for every workflow that needs to speak.</h2>
        </div>
        <div className="use-case-grid">
          {useCases.map((useCase) => (
            <article key={useCase.title}>
              <h3>{useCase.title}</h3>
              <p>{useCase.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="api-section" id="developers">
        <div>
          <p className="section-kicker">API access</p>
          <h2>Ship voice into your product with controls your team can trust.</h2>
          <p>
            Manage voices, generate speech, review usage, and embed previews in
            your app while keeping performance and privacy settings visible.
          </p>
        </div>
        <div className="api-panel" aria-label="API example">
          <span>POST /v1/audio/speech</span>
          <code>{`{ voice: "aria", language: "en", speed: 1.0 }`}</code>
        </div>
      </section>
    </div>
  );
}
