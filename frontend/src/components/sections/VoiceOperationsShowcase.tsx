import Link from "next/link";
import { TalkToAgentWidget } from "./TalkToAgentWidget";
import styles from "./VoiceOperationsShowcase.module.css";

function VoiceMark({
  className = ""
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 52 44" fill="none" aria-hidden="true" className={className || "w-7 h-6"}>
      <path d="M3 5h12l13 25L39 5h10L31 40h-9L3 5Z" fill="currentColor" />
      <path d="M24 6v8m5-12v17m5-12v7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// Device artwork with modern Zippee phone mockup
function VoicePhone() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[280px] rounded-[36px] border-4 border-purple-500/30 bg-[#120516] p-4 shadow-2xl backdrop-blur-xl">
      <div className="flex justify-between items-center text-[10px] text-purple-300 font-mono mb-4 px-2">
        <span>9:41</span>
        <span>••• ▰</span>
      </div>
      <div className="flex flex-col items-center text-center space-y-3 py-4">
        <div className="size-14 rounded-2xl bg-gradient-to-tr from-[#9F3DA8] to-[#c084fc] flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
          <VoiceMark className="w-8 h-7 text-white" />
        </div>
        <span className="font-mono text-xs uppercase tracking-widest text-purple-300">vozon voice ai</span>
        <div>
          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block">YOUR PERSONAL VOICE AGENT</span>
          <p className="text-sm font-bold text-white mt-1">How can I<br />help you today?</p>
        </div>
        <div className="flex items-center gap-1.5 py-2">
          <span className="w-1.5 h-4 bg-purple-400 rounded-full animate-equalizer" style={{ animationDelay: '0.1s' }} />
          <span className="w-1.5 h-6 bg-pink-400 rounded-full animate-equalizer" style={{ animationDelay: '0.3s' }} />
          <span className="w-1.5 h-8 bg-[#9F3DA8] rounded-full animate-equalizer" style={{ animationDelay: '0.2s' }} />
          <span className="w-1.5 h-5 bg-purple-300 rounded-full animate-equalizer" style={{ animationDelay: '0.4s' }} />
          <span className="w-1.5 h-3 bg-purple-500 rounded-full animate-equalizer" style={{ animationDelay: '0.15s' }} />
        </div>
      </div>
    </div>
  );
}

function VoiceTags() {
  return (
    <div className="space-y-2 font-mono text-xs">
      <p className="text-purple-300 font-semibold mb-2">Voice <span className="text-white">AI Capabilities</span></p>
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-white/10 px-3 py-1 text-purple-200 border border-white/10 hover:border-purple-400 transition-colors">Inbound Support</span>
        <span className="rounded-full bg-white/10 px-3 py-1 text-purple-200 border border-white/10 hover:border-purple-400 transition-colors">Lead Qualification</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-white/10 px-3 py-1 text-purple-200 border border-white/10 hover:border-purple-400 transition-colors">Appointment Booking</span>
        <span className="rounded-full bg-white/10 px-3 py-1 text-purple-200 border border-white/10 hover:border-purple-400 transition-colors">Outbound Calls</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-white/10 px-3 py-1 text-purple-200 border border-white/10 hover:border-purple-400 transition-colors">Hindi &amp; Indic Langs</span>
        <span className="rounded-full bg-white/10 px-3 py-1 text-purple-200 border border-white/10 hover:border-purple-400 transition-colors">CRM Sync</span>
      </div>
    </div>
  );
}

export function VoiceOperationsShowcase() {
  return (
    <section aria-label="Vozon voice agents on phone and web" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className={styles.wrapper}>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className={styles.badge}>
                <VoiceMark className="w-4 h-3.5 text-purple-300" />
                Vozon Platform
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 font-mono text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                AI Voice Agents
              </span>
              <Link href="#platform" className="text-xs font-semibold text-purple-300 hover:text-white transition-colors">
                Get in touch ↗
              </Link>
            </div>

            <h2 className={styles.title}>
              Your voice agents,<br />
              <span className="bg-gradient-to-r from-purple-300 via-pink-200 to-white bg-clip-text text-transparent">always ready</span><br />
              <span>for a conversation.</span>
            </h2>

            <p className={styles.description}>
              Turn every call into a helpful conversation. Let your AI agents answer, book, and support—in your customers’ language.
            </p>

            <div className="pt-2">
              <Link href="#platform" className="zippee-btn-primary">
                <span>Hear an agent ↗</span>
              </Link>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white">A natural voice.<br />A human experience.</p>
                <span className="text-xs text-purple-300">Built around your business.</span>
              </div>
              <VoiceTags />
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-6">
            <VoicePhone />
            <div id="live-voice-dialer" className="w-full">
              <TalkToAgentWidget />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VoiceOperationsShowcase;