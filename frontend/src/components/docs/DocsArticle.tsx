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
  return <div className="overflow-hidden rounded-xl border border-white/10 bg-[#06100e]"><div className="flex justify-between border-b border-white/10 px-4 py-2 text-xs text-white/40"><span>{block.language}</span><button className="font-semibold text-[#75fff0]" onClick={() => void copy()} type="button">{copied ? "Copied" : "Copy"}</button></div><pre className="overflow-x-auto p-4 text-[13px] leading-6 text-[#c8faf2]"><code>{block.body}</code></pre></div>;
}

function Block({ block }: { block: DocsBlock }) {
  if (block.type === "text") return <p className="leading-7 text-white/58">{block.body}</p>;
  if (block.type === "note") return <div className={`rounded-xl border px-4 py-3 text-sm leading-6 ${block.tone === "warning" ? "border-amber-300/25 bg-amber-300/[0.07] text-amber-50" : "border-cyan-300/25 bg-cyan-300/[0.07] text-cyan-50"}`}>{block.body}</div>;
  if (block.type === "code") return <Code block={block} />;
  if (block.type === "list") return <ul className="grid gap-2">{block.items.map((item) => <li className="flex gap-3 text-sm leading-6 text-white/58" key={item}><span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#45ddce]" />{item}</li>)}</ul>;
  if (block.type === "steps") return <div className="grid gap-3">{block.items.map((item, index) => <div className="grid grid-cols-[34px_1fr] gap-3 rounded-xl border border-white/10 p-4" key={item.title}><span className="grid size-8 place-items-center rounded-full bg-[#45ddce] text-xs font-black text-[#02110d]">{index + 1}</span><div><h3 className="font-semibold">{item.title}</h3><p className="mt-1 text-sm leading-6 text-white/52">{item.body}</p></div></div>)}</div>;
  return <div className="overflow-x-auto rounded-xl border border-white/10"><table className="w-full min-w-[620px] border-collapse text-left text-sm"><thead className="bg-white/[0.05] text-white/45"><tr>{block.headers.map((header) => <th className="px-4 py-3 font-semibold" key={header}>{header}</th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr className="border-t border-white/10" key={`${row[0]}-${rowIndex}`}>{row.map((cell, index) => <td className={`px-4 py-3 align-top leading-6 ${index === 0 ? "font-semibold text-white" : "text-white/52"}`} key={`${cell}-${index}`}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

export function DocsArticle({ topic }: { topic: DocsTopic }) {
  const currentIndex = docsTopics.findIndex((item) => item.slug === topic.slug);
  const previous = docsTopics[currentIndex - 1];
  const next = docsTopics[currentIndex + 1];
  const groups = [...new Set(docsTopics.map((item) => item.group))];
  return <main className="min-h-screen bg-[#020706] text-white">
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020706]/92 backdrop-blur-xl"><div className="mx-auto flex h-16 max-w-[1500px] items-center gap-4 px-4 lg:px-7"><BrandLogo showWebsiteLogo /><span className="hidden h-6 w-px bg-white/15 sm:block" /><Link className="hidden text-sm font-semibold text-white/55 sm:block" href="/docs">Documentation</Link><div className="ml-auto flex gap-2"><a className="rounded-lg px-3 py-2 text-sm font-semibold text-white/55 hover:text-white" href="/openapi.yaml">OpenAPI</a><Link className="rounded-lg bg-[#45ddce] px-3 py-2 text-sm font-bold text-[#02110d]" href="/dashboard/developers">Developer portal</Link></div></div></header>
    <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_210px]">
      <aside className="border-r border-white/10 p-4 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] lg:overflow-y-auto lg:p-6"><Link className="mb-5 block rounded-lg px-2 py-2 text-sm font-semibold text-[#75fff0]" href="/docs">← Docs overview</Link><nav className="grid gap-5">{groups.map((group) => <div key={group}><span className="px-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">{group}</span><div className="mt-2 grid gap-0.5">{docsTopics.filter((item) => item.group === group).map((item) => <Link className={`rounded-lg px-2 py-2 text-sm ${item.slug === topic.slug ? "bg-[#45ddce]/10 font-semibold text-[#9ff8ee]" : "text-white/52 hover:bg-white/[0.05] hover:text-white"}`} href={`/docs/${item.slug}`} key={item.slug}>{item.title}</Link>)}</div></div>)}</nav></aside>
      <article className="min-w-0 px-5 py-12 sm:px-8 lg:px-14 lg:py-16 xl:px-16"><div className="max-w-3xl"><span className="text-xs font-black uppercase tracking-[0.18em] text-[#45ddce]">{topic.group}</span><h1 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">{topic.title}</h1><p className="mt-5 text-lg leading-8 text-white/55">{topic.description}</p><div className="mt-12 grid gap-14">{topic.sections.map((section, index) => <section className="scroll-mt-24" id={`section-${index + 1}`} key={section.title}><h2 className="text-2xl font-semibold">{section.title}</h2><div className="mt-5 grid gap-5">{section.blocks.map((block, blockIndex) => <Block block={block} key={`${block.type}-${blockIndex}`} />)}</div></section>)}</div><nav className="mt-16 grid gap-3 border-t border-white/10 pt-8 sm:grid-cols-2">{previous ? <Link className="rounded-xl border border-white/10 p-4 hover:border-[#45ddce]/30" href={`/docs/${previous.slug}`}><span className="text-xs text-white/35">Previous</span><strong className="mt-1 block">{previous.title}</strong></Link> : <span />}{next ? <Link className="rounded-xl border border-white/10 p-4 text-right hover:border-[#45ddce]/30" href={`/docs/${next.slug}`}><span className="text-xs text-white/35">Next</span><strong className="mt-1 block">{next.title}</strong></Link> : null}</nav></div></article>
      <aside className="hidden border-l border-white/10 p-6 xl:sticky xl:top-16 xl:block xl:h-[calc(100vh-64px)]"><span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">On this page</span><nav className="mt-3 grid gap-1">{topic.sections.map((section, index) => <a className="rounded-lg px-2 py-2 text-xs leading-5 text-white/45 hover:text-[#9ff8ee]" href={`#section-${index + 1}`} key={section.title}>{section.title}</a>)}</nav><a className="mt-6 block rounded-xl border border-[#45ddce]/25 bg-[#45ddce]/[0.06] p-3 text-xs font-semibold text-[#9ff8ee]" href="/openapi.yaml">Download OpenAPI spec →</a></aside>
    </div>
  </main>;
}
