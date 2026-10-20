"use client";

import Link from "next/link";
import { useState } from "react";

interface NexStudioHeaderProps {
  theme?: "dark" | "light";
  onToggleTheme?: () => void;
}

export function NexStudioHeader({ theme = "dark", onToggleTheme }: NexStudioHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = theme === "dark";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isDark
          ? "bg-[#08080a]/85 backdrop-blur-md border-b border-white/10 text-white"
          : "bg-white/90 backdrop-blur-md border-b border-gray-100 text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-decoration-none group">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF5500] to-[#E04000] text-white flex items-center justify-center font-bold text-sm tracking-tighter shadow-sm shadow-[#FF5500]/30">
            V
          </span>
          <span className={`text-xl font-normal tracking-tight ${isDark ? "text-white" : "text-black"}`}>
            vozon<span className="font-semibold text-[#FF5500]">.ai</span>
          </span>
          <span
            className={`hidden sm:inline-block ml-2 px-2.5 py-0.5 rounded text-[10px] nexstudio-mono uppercase tracking-wider ${
              isDark ? "text-neutral-400 bg-white/5 border border-white/10" : "text-gray-500 bg-gray-100"
            }`}
          >
            AI VOICE STUDIO
          </span>
        </Link>

        {/* Center Desktop Navigation */}
        <nav
          className={`hidden md:flex items-center gap-8 text-xs nexstudio-mono uppercase tracking-wider ${
            isDark ? "text-neutral-400" : "text-gray-700"
          }`}
        >
          <Link href="#services" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}>
            Services
          </Link>
          <Link href="#platform" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}>
            Platform
          </Link>
          <Link href="#cases" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}>
            Selected Work
          </Link>
          <Link href="#insights" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}>
            Insights
          </Link>
          <Link href="#testimonials" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}>
            Reviews
          </Link>
          <Link href="/pricing" className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}>
            Pricing
          </Link>
        </nav>

        {/* Right CTA & Theme Switcher Button */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Day / Night Theme Switcher */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              title={`Switch to ${isDark ? "light" : "dark"} mode`}
              className={`px-3 py-2 rounded-full flex items-center gap-1.5 text-xs nexstudio-mono transition-all duration-200 ${
                isDark
                  ? "bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white"
                  : "bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {isDark ? (
                <>
                  <span className="text-amber-400 text-sm">☀️</span>
                  <span className="text-[11px]">Light</span>
                </>
              ) : (
                <>
                  <span className="text-indigo-400 text-sm">🌙</span>
                  <span className="text-[11px]">Dark</span>
                </>
              )}
            </button>
          )}

          <Link
            href="/contact"
            className="group px-5 py-2.5 flex items-center gap-2 bg-[#FF5500] hover:bg-[#ff6a1a] text-xs nexstudio-mono font-medium tracking-wider text-white rounded-full transition-all duration-300 shadow-md shadow-[#FF5500]/25 hover:shadow-lg hover:shadow-[#FF5500]/40"
          >
            <span>BOOK A CALL</span>
            <svg
              className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className={`p-2 rounded-lg text-sm ${isDark ? "text-neutral-300 bg-white/5" : "text-gray-700 bg-gray-100"}`}
              aria-label="Toggle theme"
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg ${isDark ? "text-white hover:bg-white/10" : "text-black hover:bg-gray-100"}`}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-b px-6 py-6 flex flex-col gap-4 text-xs nexstudio-mono uppercase tracking-wider ${
            isDark ? "bg-[#0c0c11] border-white/10 text-neutral-300" : "bg-white border-gray-200 text-gray-800"
          }`}
        >
          <Link href="#services" onClick={() => setMobileMenuOpen(false)} className={isDark ? "hover:text-white" : "hover:text-black"}>
            Services
          </Link>
          <Link href="#platform" onClick={() => setMobileMenuOpen(false)} className={isDark ? "hover:text-white" : "hover:text-black"}>
            Platform
          </Link>
          <Link href="#cases" onClick={() => setMobileMenuOpen(false)} className={isDark ? "hover:text-white" : "hover:text-black"}>
            Selected Work
          </Link>
          <Link href="#insights" onClick={() => setMobileMenuOpen(false)} className={isDark ? "hover:text-white" : "hover:text-black"}>
            Insights
          </Link>
          <Link href="#testimonials" onClick={() => setMobileMenuOpen(false)} className={isDark ? "hover:text-white" : "hover:text-black"}>
            Reviews
          </Link>
          <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className={isDark ? "hover:text-white" : "hover:text-black"}>
            Pricing
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 py-3 text-center bg-[#FF5500] text-white rounded-full font-medium"
          >
            BOOK A CALL →
          </Link>
        </div>
      )}
    </header>
  );
}

export default NexStudioHeader;
