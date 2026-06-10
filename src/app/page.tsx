"use client";

import { useEffect, useState } from "react";

const navItems = ["Product", "Pricing", "For Business", "Resources", "Company"];

const features = [
  {
    title: "Voice Agents",
    copy: "Launch AI assistants that answer calls, qualify leads, and route urgent requests."
  },
  {
    title: "Speech Analytics",
    copy: "Detect sentiment, key topics, and action items from every voice conversation."
  },
  {
    title: "Business Ready",
    copy: "Manage teams, workflows, integrations, and privacy controls from one workspace."
  }
];

export default function Home() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    setIsDark(savedTheme === "dark");
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDark);
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#" aria-label="Ai Voice Platform home">
          <span className="brand-mark">AI</span>
          <span>Ai Voice Platform</span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`}>
              {item}
            </a>
          ))}
        </nav>

        <button
          className="theme-toggle"
          type="button"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          onClick={() => setIsDark((current) => !current)}
        >
          <span className="toggle-icon" aria-hidden="true">
            {isDark ? "L" : "D"}
          </span>
          <span className="toggle-text">{isDark ? "Light" : "Dark"}</span>
        </button>
      </header>

      <main>
        <section className="hero" id="product">
          <div className="hero-content">
            <p className="eyebrow">Realtime speech intelligence</p>
            <h1>Build natural AI voice experiences for every customer conversation.</h1>
            <p className="hero-copy">
              Ai Voice Platform helps teams create responsive voice agents, automate calls,
              transcribe conversations, and turn spoken interactions into useful business insight.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#pricing">
                View Pricing
              </a>
              <a className="secondary-button" href="#for-business">
                Explore Business Tools
              </a>
            </div>
          </div>

          <div className="voice-panel" aria-label="Voice platform preview">
            <div className="panel-top">
              <span className="status-dot" />
              <span>Live voice session</span>
            </div>
            <div className="waveform" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, index) => (
                <span key={index} />
              ))}
            </div>
            <div className="transcript">
              <p>
                <strong>Customer:</strong> Can I reschedule my appointment?
              </p>
              <p>
                <strong>AI Agent:</strong> Absolutely. I found three open times for you today.
              </p>
            </div>
          </div>
        </section>

        <section className="feature-grid" aria-label="Platform highlights">
          {features.map((feature) => (
            <article key={feature.title}>
              <h2>{feature.title}</h2>
              <p>{feature.copy}</p>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
