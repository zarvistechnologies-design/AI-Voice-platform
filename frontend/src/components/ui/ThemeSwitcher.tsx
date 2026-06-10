"use client";

import { type ThemePreference } from "@/hooks/useTheme";

type ThemeSwitcherProps = {
  preference: ThemePreference;
  onPreferenceChange: (preference: ThemePreference) => void;
};

const themeOptions: Array<{
  label: string;
  value: ThemePreference;
  icon: "moon" | "sun" | "monitor";
}> = [
  { label: "Dark theme", value: "dark", icon: "moon" },
  { label: "Light theme", value: "light", icon: "sun" },
  { label: "System theme", value: "system", icon: "monitor" },
];

function ThemeIcon({ icon }: { icon: "moon" | "sun" | "monitor" }) {
  if (icon === "moon") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.4 14.5A8.2 8.2 0 0 1 9.5 3.6 8.8 8.8 0 1 0 20.4 14.5Z" />
      </svg>
    );
  }

  if (icon === "sun") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2 12h2.2M19.8 12H22M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="11" rx="2" />
      <path d="M9 20h6M12 16v4" />
    </svg>
  );
}

export function ThemeSwitcher({
  preference,
  onPreferenceChange,
}: ThemeSwitcherProps) {
  return (
    <div className="theme-switcher" aria-label="Theme preference">
      {themeOptions.map((option) => (
        <button
          className={`theme-switcher-button${
            preference === option.value ? " theme-switcher-button--active" : ""
          }`}
          type="button"
          key={option.value}
          aria-label={option.label}
          aria-pressed={preference === option.value}
          title={option.label}
          onClick={() => onPreferenceChange(option.value)}
        >
          <ThemeIcon icon={option.icon} />
        </button>
      ))}
    </div>
  );
}
