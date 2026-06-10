"use client";

import { useCallback, useSyncExternalStore } from "react";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const storageKey = "theme-preference";
const themeChangeEvent = "theme-preference-change";
const preferences: ThemePreference[] = ["light", "dark", "system"];

function isThemePreference(value: string | null): value is ThemePreference {
  return preferences.includes(value as ThemePreference);
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getThemePreference(): ThemePreference {
  if (typeof window === "undefined") {
    return "system";
  }

  const savedPreference = window.localStorage.getItem(storageKey);

  return isThemePreference(savedPreference) ? savedPreference : "system";
}

function resolveTheme(preference: ThemePreference): ResolvedTheme {
  return preference === "system" ? getSystemTheme() : preference;
}

function getSnapshot() {
  const preference = getThemePreference();
  const resolvedTheme = resolveTheme(preference);

  return `${preference}:${resolvedTheme}`;
}

function getServerSnapshot() {
  return "system:light";
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  window.addEventListener("storage", callback);
  window.addEventListener(themeChangeEvent, callback);
  mediaQuery.addEventListener("change", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(themeChangeEvent, callback);
    mediaQuery.removeEventListener("change", callback);
  };
}

export function useTheme() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [preference, resolvedTheme] = snapshot.split(":") as [
    ThemePreference,
    ResolvedTheme,
  ];

  const setThemePreference = useCallback((nextPreference: ThemePreference) => {
    window.localStorage.setItem(storageKey, nextPreference);
    window.dispatchEvent(new Event(themeChangeEvent));
  }, []);

  return {
    preference,
    resolvedTheme,
    setThemePreference,
  };
}
