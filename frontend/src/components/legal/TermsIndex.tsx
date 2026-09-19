"use client";

import { type MouseEvent, useEffect, useRef, useState } from "react";

type TermsSection = {
  id: string;
  title: string;
};

type TermsIndexProps = {
  sections: readonly TermsSection[];
};

export function TermsIndex({ sections }: TermsIndexProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const mobileIndexRef = useRef<HTMLDetailsElement>(null);
  const selectedClauseLockUntil = useRef(0);

  useEffect(() => {
    const setHashSection = () => {
      const hashId = window.location.hash.slice(1);
      if (sections.some((section) => section.id === hashId)) {
        selectedClauseLockUntil.current = Date.now() + 1000;
        setActiveId(hashId);
      }
    };

    setHashSection();
    window.addEventListener("hashchange", setHashSection);

    let animationFrame = 0;
    const updateActiveSection = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        if (Date.now() < selectedClauseLockUntil.current) return;

        const readingLine = 132;
        const currentSection = sections.reduce((currentId, section) => {
          const element = document.getElementById(section.id);
          return element && element.getBoundingClientRect().top <= readingLine
            ? section.id
            : currentId;
        }, sections[0]?.id ?? "");

        setActiveId(currentSection);
      });
    };

    window.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => {
      window.removeEventListener("hashchange", setHashSection);
      window.removeEventListener("scroll", updateActiveSection);
      cancelAnimationFrame(animationFrame);
    };
  }, [sections]);

  const handleClauseClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    setActiveId(id);

    const target = document.getElementById(id);
    if (!target) return;

    // Avoid the browser's default hash jump, which can land beneath the fixed header.
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    selectedClauseLockUntil.current = Date.now() + (reducedMotion ? 100 : 1000);
    window.history.replaceState(null, "", `${window.location.pathname}#${id}`);
    const headerOffset = 112;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion ? "auto" : "smooth" });
    if (mobileIndexRef.current) mobileIndexRef.current.open = false;
  };

  const links = (
    <nav aria-label="Terms and Conditions sections" className="grid gap-1">
      {sections.map((section, index) => {
        const isActive = activeId === section.id;

        return (
          <a
            aria-current={isActive ? "location" : undefined}
            className={`group relative flex min-h-8 items-center gap-2 rounded-md px-2 py-1.5 text-[13px] leading-4 transition-colors duration-200 ${
              isActive
                ? "bg-[#EAF7F4] font-semibold text-[#17233B]"
                : "text-[#60718C] hover:bg-[#F4FAF8] hover:text-[#17233B]"
            }`}
            href={`#${section.id}`}
            key={section.id}
            onClick={(event) => handleClauseClick(event, section.id)}
          >
            <span
              className={`flex size-[18px] shrink-0 items-center justify-center rounded-full text-[8px] font-bold ${
                isActive ? "bg-[#108D82] text-white" : "bg-[#F0F5F5] text-[#71819C]"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{section.title}</span>
          </a>
        );
      })}
    </nav>
  );

  return (
    <aside className="lg:sticky lg:top-28 lg:h-fit">
      <div className="overflow-hidden rounded-xl border border-[#DCE8E5] bg-white/80 shadow-[0_4px_18px_rgba(16,141,130,0.04)] backdrop-blur-[12px] lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
        <details className="group lg:hidden" ref={mobileIndexRef}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 marker:hidden">
            <span>
              <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#26344D]">Agreement index</span>
              <span className="mt-1 block text-xs text-[#60718C]">Choose a clause to jump to it</span>
            </span>
            <span aria-hidden="true" className="text-xl text-[#108D82] transition-transform group-open:rotate-45">+</span>
          </summary>
          <div className="border-t border-[#EEF0F6] px-3 pb-3 pt-2">{links}</div>
        </details>

        <div className="hidden px-3.5 pb-4 pt-4 lg:block">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#26344D]">Agreement index</p>
          <p className="mt-1 text-xs leading-4 text-[#60718C]">Select a clause to move directly to that part of the agreement.</p>
          <div className="mt-3">{links}</div>
        </div>

        <div className="hidden mx-3.5 border-t border-[#EEF0F6] lg:block" />

        <div className="hidden px-3.5 pb-4 pt-4 lg:block">
          <div className="flex size-7 items-center justify-center rounded-full bg-[#EAF7F4] text-[#108D82]">?</div>
          <p className="mt-3 text-xs font-medium text-[#26344D]">Questions about this agreement?</p>
          <a className="mt-2 inline-block text-sm font-semibold text-[#0B756C] underline underline-offset-4 transition hover:opacity-60" href="mailto:hello@vozon.ai">hello@vozon.ai</a>
        </div>
      </div>
    </aside>
  );
}
