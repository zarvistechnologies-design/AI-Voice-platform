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
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0f8777]">Integration directory</p>
            <h2 className="mt-4 text-[clamp(1.6rem,2.35vw,2.25rem)] font-semibold leading-[1.12] tracking-[-0.04em] text-[#111312]">
              Explore by category
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-[#5b6964]">
              Every card below comes from Vozon&apos;s integration catalog and opens its own detail page.
            </p>
          </div>
          <label className="flex w-full max-w-sm flex-col gap-2 text-xs font-semibold text-[#52645f]">
            Search integrations
            <input
              className="w-full rounded-xl border border-[#dbe4e1] bg-white px-4 py-3 text-sm text-[#14231f] outline-none placeholder:text-[#8b9b95] focus:border-[#0f8777] focus:ring-2 focus:ring-[#0f8777]/10"
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
              className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition ${category === item ? "border-[#0f8777] bg-[#0f8777] text-white" : "border-[#dbe4e1] bg-white text-[#52645f] hover:border-[#0f8777] hover:text-[#0e6f62]"}`}
              key={item}
              onClick={() => setCategory(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>

        <p aria-live="polite" className="mt-7 text-sm text-[#71817d]">
          Showing {filtered.length} {filtered.length === 1 ? "integration" : "integrations"}
        </p>

        {filtered.length ? (
          <div className="mt-4 grid items-start gap-2 sm:grid-cols-2 xl:grid-cols-3" role="list">
            {filtered.map((integration) => (
              <Link
                className="group flex items-start gap-2.5 self-start rounded-xl border border-[#dbe4e1] bg-white p-3 transition hover:border-[#0f8777] hover:bg-[#f9fcfb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8777]"
                href={`/integrations/${integration.slug}`}
                key={integration.slug}
                role="listitem"
              >
                {integration.slug !== "vozon-ai" && (
                  <span className="relative grid size-9 shrink-0 place-items-center rounded-lg border border-[#e3ebe8] bg-[#f7f9f8]">
                    <Image alt="" className="object-contain p-1.5" fill sizes="36px" src={integration.logo} />
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
                      <h3 className="text-sm font-semibold leading-5 text-[#14231f]">{integration.name}</h3>
                    )}
                    <span aria-hidden="true" className="shrink-0 text-base font-semibold leading-5 text-[#0f8777] transition group-hover:translate-x-1">&rarr;</span>
                  </div>
                  <p className="mt-0.5 text-[11px] font-medium text-[#71817d]">{integration.category}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-[1.4] text-[#60706a]">{integration.description}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-5 rounded-2xl border border-[#dbe4e1] bg-[#f7f9f8] p-7 text-sm text-[#60706a]">
            No integrations match your search. Try another name or category.
          </p>
        )}
      </div>
    </section>
  );
}
