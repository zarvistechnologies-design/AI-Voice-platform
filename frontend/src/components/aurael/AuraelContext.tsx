"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Scene = "morning" | "night";

interface AuraelContextType {
  scene: Scene;
  setScene: (scene: Scene) => void;
  toggleScene: () => void;
}

const AuraelContext = createContext<AuraelContextType>({
  scene: "night",
  setScene: () => {},
  toggleScene: () => {},
});

export function AuraelProvider({ children }: { children: React.ReactNode }) {
  const [scene, setSceneState] = useState<Scene>("night");

  useEffect(() => {
    // Check initial preference or default to night (AI voice platform standard)
    const stored = typeof window !== "undefined" ? localStorage.getItem("vozon-scene") : null;
    if (stored === "morning" || stored === "night") {
      setSceneState(stored);
      document.documentElement.setAttribute("data-scene", stored);
    } else {
      document.documentElement.setAttribute("data-scene", "night");
    }
  }, []);

  const setScene = (newScene: Scene) => {
    setSceneState(newScene);
    document.documentElement.setAttribute("data-scene", newScene);
    try {
      localStorage.setItem("vozon-scene", newScene);
    } catch {
      // ignore
    }
  };

  const toggleScene = () => {
    setScene(scene === "night" ? "morning" : "night");
  };

  return (
    <AuraelContext.Provider value={{ scene, setScene, toggleScene }}>
      {children}
    </AuraelContext.Provider>
  );
}

export function useAurael() {
  return useContext(AuraelContext);
}
