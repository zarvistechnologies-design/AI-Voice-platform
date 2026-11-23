"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { integrationCategories, integrations, type IntegrationCategory } from "@/config/integrationCatalog";

type Category = "All" | IntegrationCategory;

export function IntegrationDirectory() {
  const [category, setCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return integrations
      .filter(
        (integration) =>
          (category === "All" || integration.category === category) &&
          (!term ||
            `${integration.name} ${integration.category} ${integration.description} ${integration.capabilities.join(" ")}`
              .toLocaleLowerCase()
              .includes(term))
      )
      .sort((a, b) => integrationCategories.indexOf(a.category) - integrationCategories.indexOf(b.category));
  }, [category, query]);

  return (
    <section className="scroll-mt-20 bg-white px-5 py-10 sm:px-7 sm:py-14" id="integration-directory">
      <div className="mx-auto max-w-[1340px]">
        {/* Section Heading & Search */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[720px]">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#64748b]">
              INTEGRATION CATALOG
            </span>
            <h2 className="mt-2 text-[clamp(1.8rem,3vw,2.8rem)] font-medium leading-[1.08] tracking-[-0.045em] text-[#0f172a]">
              Explore by category
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#64748b]">
              Every integration includes bi-directional event webhooks, real-time context streaming, and zero-code workflow actions.
            </p>
          </div>

          <label className="flex w-full max-w-sm flex-col gap-2 text-xs font-semibold text-[#64748b]">
            Search integrations
            <div className="relative">
              <input
                className="w-full rounded-full border border-[#cbd5e1] bg-white px-4 py-2.5 pl-9 text-sm text-[#0f172a] outline-none placeholder:text-[#94a3b8] transition focus:border-[#0f172a] focus:ring-2 focus:ring-slate-900/5"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, category, or capability..."
                type="search"
                value={query}
              />
              <svg
                className="pointer-events-none absolute left-3 top-3 size-4 text-[#94a3b8]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </label>
        </div>

        {/* Category Pills (Product & Solution Style) */}
        <div aria-label="Filter integrations by category" className="mt-8 flex flex-wrap gap-2">
          {(["All", ...integrationCategories] as const).map((item) => (
            <button
              aria-pressed={category === item}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                category === item
                  ? "border-[#0f172a] bg-[#0f172a] text-white shadow-sm"
                  : "border-[#e2e8f0] bg-white text-[#64748b] hover:border-[#94a3b8] hover:text-[#0f172a]"
              }`}
              key={item}
              onClick={() => setCategory(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Count */}
        <p aria-live="polite" className="mt-6 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
          Showing {filtered.length} {filtered.length === 1 ? "integration" : "integrations"}
        </p>

        {/* Grid of Clean Cards */}
        {filtered.length ? (
          <div className="mt-5 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {filtered.map((integration) => (
              <Link
                className="group flex min-h-[170px] flex-col justify-between rounded-2xl border border-[#e2e8f0] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#cbd5e1] hover:shadow-[0_12px_28px_-8px_rgba(15,23,42,0.06)] focus-visible:outline-2 focus-visible:outline-[#0f172a]"
                href={`/integrations/${integration.slug}`}
                key={integration.slug}
                role="listitem"
              >
                <div className="flex items-start gap-4">
                  {integration.slug !== "vozon-ai" && (
                    <span className="relative grid size-12 shrink-0 place-items-center rounded-xl border border-[#edf0f5] bg-[#f8fafc]">
                      <Image alt="" className="object-contain p-2" fill sizes="48px" src={integration.logo} />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-semibold leading-tight text-[#0f172a] group-hover:text-[#2563eb] transition-colors">
                        {integration.name}
                      </h3>
                      <span
                        aria-hidden="true"
                        className="shrink-0 text-sm font-semibold text-[#94a3b8] transition group-hover:translate-x-1 group-hover:text-[#0f172a]"
                      >
                        &rarr;
                      </span>
                    </div>
                    <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
                      {integration.category}
                    </span>
                  </div>
                </div>

                <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-[#64748b]">
                  {integration.description}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-[#f1f5f9] pt-3 text-[11px] font-semibold text-[#2563eb]">
                  <span>Explore documentation &amp; triggers</span>
                  <span aria-hidden="true">&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-[#cbd5e1] p-12 text-center">
            <p className="text-sm font-semibold text-[#64748b]">No integrations match &ldquo;{query}&rdquo;</p>
            <button
              className="mt-3 text-xs font-bold text-[#2563eb] hover:underline"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
              type="button"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
