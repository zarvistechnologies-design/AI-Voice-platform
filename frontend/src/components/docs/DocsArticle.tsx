"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { docsTopics, type DocsBlock, type DocsTopic } from "@/lib/docsContent";

function Code({ block }: { block: Extract<DocsBlock, { type: "code" }> }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(block.body);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1_500);
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0f172a] shadow-md my-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-4 py-2 text-xs text-slate-400">
        <span className="font-mono text-[11px] font-semibold">{block.language}</span>
        <button
          className="font-bold text-[#14b8a6] hover:text-white transition cursor-pointer"
          onClick={() => void copy()}
          type="button"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-6 text-[#75fff0]">
        <code>{block.body}</code>
      </pre>
    </div>
  );
}

function Block({ block }: { block: DocsBlock }) {
  if (block.type === "text") {
    return <p className="leading-relaxed text-slate-600 text-sm sm:text-base my-3">{block.body}</p>;
  }
  if (block.type === "note") {
    return (
      <div
        className={`my-4 flex items-start gap-3 rounded-2xl border p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
          block.tone === "warning"
            ? "border-amber-200 bg-amber-50/80 text-amber-900"
            : "border-sky-200 bg-sky-50/80 text-sky-900"
        }`}
      >
        <span className="text-base select-none mt-0.5">{block.tone === "warning" ? "⚠️" : "💡"}</span>
        <div className="min-w-0 font-medium">{block.body}</div>
      </div>
    );
  }
  if (block.type === "code") {
    return <Code block={block} />;
  }
  if (block.type === "list") {
    return (
      <ul className="my-3 grid gap-2">
        {block.items.map((item) => (
          <li className="flex items-start gap-3 text-xs sm:text-sm leading-relaxed text-slate-700" key={item}>
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#108D82]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === "steps") {
    return (
      <div className="my-4 grid gap-3">
        {block.items.map((item, index) => (
          <div
            className="grid grid-cols-[36px_minmax(0,1fr)] gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs"
            key={item.title}
          >
            <span className="grid size-9 place-items-center rounded-xl bg-teal-600 text-xs font-bold text-white shadow-xs">
              {index + 1}
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">{item.title}</h3>
              <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="my-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
      <table className="w-full min-w-[620px] border-collapse text-left text-xs sm:text-sm">
        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
          <tr>
            {block.headers.map((header) => (
              <th className="px-5 py-3 font-bold" key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {block.rows.map((row, rowIndex) => (
            <tr className="hover:bg-slate-50/60 transition" key={`${row[0]}-${rowIndex}`}>
              {row.map((cell, index) => (
                <td
                  className={`px-5 py-3.5 align-top leading-relaxed ${
                    index === 0 ? "font-bold text-slate-900" : "text-slate-600"
                  }`}
                  key={`${cell}-${index}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DocsArticle({ topic }: { topic: DocsTopic }) {
  const currentIndex = docsTopics.findIndex((item) => item.slug === topic.slug);
  const previous = docsTopics[currentIndex - 1];
  const next = docsTopics[currentIndex + 1];
  const groups = [...new Set(docsTopics.map((item) => item.group))];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-teal-500/20 font-sans">
      {/* Clean Light Developer Portal Header */}
      <header className="sticky top-0 z-40 h-16 border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex h-full max-w-[1720px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2.5">
              <BrandLogo compact showWebsiteLogo />
              <span className="hidden sm:inline-flex items-center rounded-full bg-teal-50 border border-teal-200 px-2.5 py-0.5 text-xs font-bold text-[#0e6f62]">
                Docs & Guides
              </span>
              <span className="hidden md:inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                v1.0.0 Stable
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-1 border-l border-slate-200 pl-4">
              <Link
                href="/docs"
                className="rounded-lg bg-teal-50 border border-teal-200/80 px-3 py-1.5 text-xs font-bold text-[#0e6f62]"
              >
                Guides & Concepts
              </Link>
              <Link
                href="/docs/api"
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                API Reference
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/docs/api"
              className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50/70 px-3 py-1.5 text-xs font-bold text-teal-900 transition hover:bg-teal-100 shadow-xs"
            >
              <span className="size-2 rounded-full bg-[#108D82] animate-pulse" />
              <span>Open API Sandbox</span>
            </Link>

            <a
              href="/openapi.yaml"
              download="vozon-openapi.yaml"
              className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:border-[#108D82] hover:text-[#108D82] shadow-xs cursor-pointer"
            >
              <span>↓</span> YAML
            </a>

            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-xl bg-[#108D82] hover:bg-[#0e756c] text-white px-3.5 py-1.5 text-xs font-bold shadow-xs transition cursor-pointer"
            >
              Dashboard →
            </Link>
          </div>
        </div>
      </header>

      {/* Main 3-Column Clean Light Layout */}
      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_220px]">
        {/* Left Sidebar */}
        <aside className="border-r border-slate-200/90 bg-white p-4 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] lg:overflow-y-auto lg:p-6">
          <Link
            className="mb-5 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-xs"
            href="/docs"
          >
            <span>←</span> Back to Docs Overview
          </Link>
          <nav className="grid gap-5">
            {groups.map((group) => (
              <div key={group}>
                <span className="px-2.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                  {group}
                </span>
                <div className="grid gap-1">
                  {docsTopics
                    .filter((item) => item.group === group)
                    .map((item) => {
                      const active = item.slug === topic.slug;
                      return (
                        <Link
                          className={`rounded-xl px-3 py-2 text-xs transition ${
                            active
                              ? "bg-teal-50 text-teal-950 font-bold border-l-[3px] border-[#108D82] shadow-xs"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
                          }`}
                          href={`/docs/${item.slug}`}
                          key={item.slug}
                        >
                          {item.title}
                        </Link>
                      );
                    })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Center Article Content */}
        <article className="min-w-0 bg-white px-6 py-10 sm:px-10 lg:px-14 lg:py-12 xl:px-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-bold text-[#0e6f62]">
              {topic.group}
            </span>
            <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              {topic.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">{topic.description}</p>

            <div className="mt-12 grid gap-12">
              {topic.sections.map((section, index) => (
                <section className="scroll-mt-24 border-t border-slate-100 pt-8" id={`section-${index + 1}`} key={section.title}>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{section.title}</h2>
                  <div className="mt-4 grid gap-4">
                    {section.blocks.map((block, blockIndex) => (
                      <Block block={block} key={`${block.type}-${blockIndex}`} />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Previous / Next Navigation */}
            <nav className="mt-16 grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-2">
              {previous ? (
                <Link
                  className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-teal-300 hover:shadow-xs transition"
                  href={`/docs/${previous.slug}`}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    ← Previous
                  </span>
                  <strong className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#108D82] transition block">
                    {previous.title}
                  </strong>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  className="group rounded-2xl border border-slate-200 bg-white p-5 text-right hover:border-teal-300 hover:shadow-xs transition"
                  href={`/docs/${next.slug}`}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Next →
                  </span>
                  <strong className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#108D82] transition block">
                    {next.title}
                  </strong>
                </Link>
              ) : null}
            </nav>
          </div>
        </article>

        {/* Right Sidebar: On this page */}
        <aside className="hidden border-l border-slate-200/90 bg-[#f8fafc] p-6 xl:sticky xl:top-16 xl:block xl:h-[calc(100vh-64px)]">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">
            On this page
          </span>
          <nav className="grid gap-1.5">
            {topic.sections.map((section, index) => (
              <a
                className="rounded-lg px-2.5 py-1.5 text-xs leading-5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition font-medium"
                href={`#section-${index + 1}`}
                key={section.title}
              >
                {section.title}
              </a>
            ))}
          </nav>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <a
              className="block rounded-xl border border-teal-200 bg-teal-50/70 p-3.5 text-xs font-bold text-teal-900 shadow-xs transition hover:bg-teal-100 text-center"
              href="/openapi.yaml"
              download="vozon-openapi.yaml"
            >
              Download OpenAPI Spec →
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
