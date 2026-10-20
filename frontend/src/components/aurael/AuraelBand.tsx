"use client";

import React from "react";

interface AuraelBandProps {
  id?: string;
  index: string;
  label: string;
  note?: string;
  lead?: string;
  accent?: string;
  sublead?: string;
  children: React.ReactNode;
  className?: string;
}

export function AuraelBand({
  id,
  index,
  label,
  note,
  lead,
  accent,
  sublead,
  children,
  className = "",
}: AuraelBandProps) {
  return (
    <section id={id} className={`aurael-band ${className}`}>
      <div className="aurael-band-inner">
        {/* Sticky Meta Rail */}
        <aside className="aurael-meta-rail">
          <div className="aurael-meta-track">
            <span className="aurael-meta-index">{index}</span>
            <span className="aurael-meta-divider" aria-hidden="true" />
            <span className="aurael-meta-label">{label}</span>
          </div>
          {note && <p className="aurael-meta-note">{note}</p>}
        </aside>

        {/* Content Area */}
        <div className="aurael-band-content">
          {(lead || accent) && (
            <h2 className="aurael-lead">
              {lead}{" "}
              {accent && <span className="aurael-accent">{accent}</span>}
            </h2>
          )}
          {sublead && <p className="aurael-sublead">{sublead}</p>}

          {children}
        </div>
      </div>
    </section>
  );
}

export default AuraelBand;
