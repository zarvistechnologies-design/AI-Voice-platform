"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

export function SolutionJourneyCards({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      container.classList.add("is-visible");
      return;
    }

    let hasUserInteracted = false;
    const markInteraction = () => { hasUserInteracted = true; };
    const revealIfInView = () => {
      if (!hasUserInteracted || container.classList.contains("is-visible")) return;
      const bounds = container.getBoundingClientRect();
      if (bounds.top < window.innerHeight * 0.9 && bounds.bottom > window.innerHeight * 0.1) {
        container.classList.add("is-visible");
      }
    };

    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting && hasUserInteracted) container.classList.add("is-visible");
          else if (!entry.isIntersecting) container.classList.remove("is-visible");
        }, { rootMargin: "0px 0px -10%", threshold: 0.12 })
      : null;
    const events: Array<keyof WindowEventMap> = ["wheel", "touchstart", "pointerdown", "keydown"];

    events.forEach((eventName) => window.addEventListener(eventName, markInteraction, { passive: true }));
    window.addEventListener("scroll", revealIfInView, { passive: true });
    observer?.observe(container);

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, markInteraction));
      window.removeEventListener("scroll", revealIfInView);
      observer?.disconnect();
    };
  }, []);

  return <ol className="solution-journey-cards space-y-2.5" ref={containerRef}>{children}</ol>;
}
