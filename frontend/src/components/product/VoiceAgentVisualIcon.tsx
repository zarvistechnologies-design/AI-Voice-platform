export type IconName =
  | "phone"
  | "arrow"
  | "users"
  | "calendar"
  | "check"
  | "message"
  | "headset"
  | "file"
  | "spark"
  | "branch"
  | "clock"
  | "database"
  | "globe"
  | "bolt"
  | "shield"
  | "mic"
  | "waveform"
  | "code"
  | "terminal"
  | "play"
  | "sliders"
  | "layers"
  | "lock"
  | "send"
  | "cpu"
  | "activity"
  | "refresh"
  | "webhook"
  | "grid";

export function VoiceAgentVisualIcon({ name, className = "" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    phone: <path d="M6.6 3.5 9 6.8 7.5 9c1.2 2.7 3.2 4.8 5.9 6l2.2-1.5 3.3 2.4-1 3.5c-.2.6-.8 1-1.5 1C9.1 20 4 14.9 3.6 7.2c0-.7.4-1.3 1-1.5l2-2.2Z" />,
    arrow: <><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3.5 19v-1.3c0-2.6 2.3-4.7 5.5-4.7s5.5 2.1 5.5 4.7V19H3.5Z" /><path d="M16 5.2a3 3 0 0 1 0 5.7M17 13.4c2.2.3 3.5 2 3.5 4.3V19h-3" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18" /><path d="m8.5 15 2.2 2.2 4.8-4.8" /></>,
    check: <path d="m5 12 4.3 4.3L19 6.7" />,
    message: <><path d="M4 4h16v12H9l-5 4V4Z" /><path d="M8 9h8M8 12h5" /></>,
    headset: <><path d="M4 13v-2a8 8 0 0 1 16 0v2M4 13h3v6H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 1-2ZM20 13h-3v6h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-1-2Z" /><path d="M17 19c0 2-2 3-5 3" /></>,
    file: <><path d="M6 2h8l4 4v16H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" /><path d="M14 2v5h5M8 12h7M8 16h7" /></>,
    spark: <><path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2ZM19 17l.7 2.3L22 20l-2.3.7L19 23l-.7-2.3L16 20l2.3-.7L19 17Z" /></>,
    branch: <><circle cx="6" cy="5" r="2" /><circle cx="18" cy="8" r="2" /><circle cx="18" cy="18" r="2" /><path d="M6 7v7a4 4 0 0 0 4 4h6M6 7v1a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
    database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9Z" /></>,
    bolt: <path d="M13.4 2 5 13h6l-.4 9L19 11h-6l.4-9Z" />,
    shield: <><path d="m12 2 8 3v6c0 5-3.2 8.8-8 11-4.8-2.2-8-6-8-11V5l8-3Z" /><path d="m8.5 12 2.4 2.4 4.8-4.8" /></>,
    mic: <><rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8" /></>,
    waveform: <path d="M3 12h2m3-6v12m4-9v6m4-10v14m4-7v2" />,
    code: <><path d="m8 6-6 6 6 6M16 6l6 6-6 6" /></>,
    terminal: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m7 9 3 3-3 3M13 15h4" /></>,
    play: <path d="m7 5 12 7-12 7V5Z" fill="currentColor" />,
    sliders: <><path d="M4 7h9M17 7h3M4 17h3M11 17h9" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
    lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4 20-7Z" /><path d="M22 2 11 13" /></>,
    cpu: <><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></>,
    activity: <path d="M2 12h4l3-8 6 16 3-8h4" />,
    refresh: <><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" /></>,
    webhook: <><circle cx="12" cy="6" r="3" /><circle cx="6" cy="17" r="3" /><circle cx="18" cy="17" r="3" /><path d="M10.5 8.5 7.5 14.5M13.5 8.5l3 6M9 17h6" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  };

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
