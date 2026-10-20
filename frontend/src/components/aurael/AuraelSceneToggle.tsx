"use client";

import React from "react";
import { useAurael } from "./AuraelContext";

export function AuraelSceneToggle({ className = "" }: { className?: string }) {
  const { scene, setScene } = useAurael();

  return (
    <div className={`aurael-scene-switcher ${className}`} role="radiogroup" aria-label="Day or night scene">
      <button
        type="button"
        role="radio"
        aria-checked={scene === "morning"}
        className={`aurael-scene-btn ${scene === "morning" ? "is-active" : ""}`}
        onClick={() => setScene("morning")}
      >
        <span aria-hidden="true">☀</span>
        <span>Morning</span>
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={scene === "night"}
        className={`aurael-scene-btn ${scene === "night" ? "is-active" : ""}`}
        onClick={() => setScene("night")}
      >
        <span aria-hidden="true">🌙</span>
        <span>Night</span>
      </button>
    </div>
  );
}

export default AuraelSceneToggle;
