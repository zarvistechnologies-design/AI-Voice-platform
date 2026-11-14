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
      .filter((integration) =>
        (category === "All" || integration.category === category) &&
        (!term || `${integration.name} ${integration.category} ${integration.description} ${integration.capabilities.join(" ")}`.toLocaleLowerCase().includes(term))
      )
      .sort((a, b) => integrationCategories.indexOf(a.category) - integrationCategories.indexOf(b.category));
  }, [category, query]);

  return (
    <section className="scroll-mt-20 bg-white px-5 py-9 sm:px-7 sm:py-11" id="integration-directory">
      <div className="mx-auto max-w-[1340px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[720px]">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5b4ce6]">Integration directory</p>
            <h2 className="mt-4 text-[clamp(2rem,3.3vw,3.2rem)] font-semibold leading-[1.06] tracking-[-0.055em] text-[#111312]">
              Explore by category
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-[#55585f]">
              Every card below comes from Vozon&apos;s integration catalog and opens its own detail page.
            </p>
          </div>
          <label className="flex w-full max-w-sm flex-col gap-2 text-xs font-semibold text-[#55585f]">
            Search integrations
            <input
              className="w-full rounded-lg border border-[#dedfe2] bg-white px-4 py-3.5 text-sm text-[#171719] outline-none placeholder:text-[#999ba0] focus:border-[#5b4ce6] focus:ring-2 focus:ring-[#5b4ce6]/10"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or capability"
              type="search"
              value={query}
            />
          </label>
        </div>

        <div aria-label="Filter integrations by category" className="mt-8 flex flex-wrap gap-1.5">
          {(["All", ...integrationCategories] as const).map((item) => (
            <button
              aria-pressed={category === item}
              className={`rounded-full border px-4 py-2.5 text-xs font-semibold transition ${category === item ? "border-[#5b4ce6] bg-[#5b4ce6] text-white" : "border-[#dedfe2] bg-white text-[#55585f] hover:border-[#5b4ce6] hover:text-[#4d3ec9]"}`}
              key={item}
              onClick={() => setCategory(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>

        <p aria-live="polite" className="mt-7 text-sm text-[#777b82]">
          Showing {filtered.length} {filtered.length === 1 ? "integration" : "integrations"}
        </p>

        {filtered.length ? (
          <div className="mt-5 grid items-stretch gap-3 sm:grid-cols-2 xl:grid-cols-3" role="list">
            {filtered.map((integration) => (
              <Link
                className="integration-card group flex min-h-[184px] items-start gap-4 rounded-xl border border-[#dedfe2] bg-white p-5 transition hover:border-[#c9c3fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b4ce6]"
                href={`/integrations/${integration.slug}`}
                key={integration.slug}
                role="listitem"
              >
                {integration.slug !== "vozon-ai" && (
                  <span className="integration-logo relative grid size-12 shrink-0 place-items-center rounded-xl border border-[#dedfe2] bg-[#f8f9f9]">
                    <Image alt="" className="object-contain p-2" fill sizes="48px" src={integration.logo} />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    {integration.slug === "vozon-ai" ? (
                      <>
                        <span className="relative block h-[30px] w-[100px]">
                          <Image alt="" className="object-contain" fill sizes="100px" src={integration.logo} />
                        </span>
                        <h3 className="sr-only">{integration.name}</h3>
                      </>
                    ) : (
                      <h3 className="text-base font-semibold leading-5 text-[#171719]">{integration.name}</h3>
                    )}
                    <span aria-hidden="true" className="shrink-0 text-base font-semibold leading-5 text-[#5b4ce6] transition group-hover:translate-x-1">&rarr;</span>
                  </div>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#5b4ce6]">{integration.category}</p>
                  <p className="mt-2 line-clamp-3 text-[13px] leading-[1.5] text-[#666a70]">{integration.description}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-5 rounded-2xl border border-[#dedfe2] bg-[#f8f9f9] p-7 text-sm text-[#666a70]">
            No integrations match your search. Try another name or category.
          </p>
        )}
      </div>
    </section>
  );
}
