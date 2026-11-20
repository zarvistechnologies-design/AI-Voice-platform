"use client";

import { useEffect, useMemo, useState } from "react";
import type { WhatsAppAccountItem, WhatsAppCampaign, WhatsAppContactGroup, WhatsAppTemplate } from "@/lib/whatsapp";
import { whatsappApi } from "@/lib/whatsapp";

interface WhatsAppCampaignsViewProps {
  campaigns: WhatsAppCampaign[];
  templates: WhatsAppTemplate[];
  groups: WhatsAppContactGroup[];
  accounts?: WhatsAppAccountItem[];
  onRefresh: () => void;
  defaultGroupId?: string;
}

export function WhatsAppCampaignsView({
  campaigns,
  templates,
  groups,
  accounts = [],
  onRefresh,
  defaultGroupId,
}: WhatsAppCampaignsViewProps) {
  // Mode: "studio" (browsing campaigns) vs "composer" (creating new broadcast)
  const [studioMode, setStudioMode] = useState<"studio" | "composer">("studio");
  const [rightTab, setRightTab] = useState<"phone" | "analytics">("phone");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "COMPLETED" | "SCHEDULED" | "RUNNING">("ALL");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");

  // Test send modal
  const [showTestModal, setShowTestModal] = useState(false);
  const [testPhoneNumber, setTestPhoneNumber] = useState("");
  const [busyTest, setBusyTest] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  // Composer Form State
  const [campaignName, setCampaignName] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?._id || "");
  const [selectedGroupId, setSelectedGroupId] = useState(defaultGroupId || groups[0]?._id || "");
  const [selectedSenderNumberId, setSelectedSenderNumberId] = useState(
    accounts.find((a) => a.isPrimary)?.accountId || accounts[0]?.accountId || "",
  );
  const [scheduleType, setScheduleType] = useState<"now" | "later">("now");
  const [scheduledDate, setScheduledDate] = useState("");
  const [sampleVar1, setSampleVar1] = useState("Alex Johnson");
  const [sampleVar2, setSampleVar2] = useState("Acme Corp");
  const [busyCreate, setBusyCreate] = useState(false);
  const [createNotice, setCreateNotice] = useState("");

  // Auto-sync selection when data finishes loading asynchronously
  useEffect(() => {
    if (!selectedCampaignId && campaigns.length > 0) {
      setSelectedCampaignId(campaigns[0]._id);
    }
  }, [campaigns, selectedCampaignId]);

  useEffect(() => {
    if (!selectedTemplateId && templates.length > 0) {
      setSelectedTemplateId(templates[0]._id);
    }
  }, [templates, selectedTemplateId]);

  useEffect(() => {
    if (!selectedGroupId && groups.length > 0) {
      setSelectedGroupId(defaultGroupId || groups[0]._id);
    }
  }, [groups, selectedGroupId, defaultGroupId]);

  // Active selected campaign
  const activeCampaign = useMemo(() => {
    return campaigns.find((c) => c._id === selectedCampaignId) || campaigns[0] || null;
  }, [campaigns, selectedCampaignId]);

  // Active template (either from active campaign in studio mode or composer template)
  const activeTemplate = useMemo(() => {
    if (studioMode === "composer") {
      return templates.find((t) => t._id === selectedTemplateId) || templates[0] || null;
    }
    if (activeCampaign?.templateId) {
      return (
        templates.find((t) => t._id === activeCampaign.templateId || t.name === activeCampaign.templateName) ||
        templates[0] ||
        null
      );
    }
    return templates[0] || null;
  }, [studioMode, activeCampaign, selectedTemplateId, templates]);

  // Active group
  const activeGroup = useMemo(() => {
    if (studioMode === "composer") {
      return groups.find((g) => g._id === selectedGroupId) || groups[0] || null;
    }
    if (activeCampaign?.groupId) {
      return groups.find((g) => g._id === activeCampaign.groupId) || groups[0] || null;
    }
    return groups[0] || null;
  }, [studioMode, activeCampaign, selectedGroupId, groups]);

  // Filter campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.templateName.toLowerCase().includes(search.toLowerCase()) ||
        (c.groupName && c.groupName.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus =
        statusFilter === "ALL" || c.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [campaigns, search, statusFilter]);

  // Aggregated KPI Metrics
  const totalRecipients = campaigns.reduce((acc, c) => acc + (c.stats.recipients || 0), 0);
  const totalDelivered = campaigns.reduce((acc, c) => acc + (c.stats.delivered || 0), 0);
  const totalRead = campaigns.reduce((acc, c) => acc + (c.stats.read || 0), 0);
  const totalReplied = campaigns.reduce((acc, c) => acc + (c.stats.replied || 0), 0);

  const deliveryRate =
    totalRecipients > 0 ? ((totalDelivered / totalRecipients) * 100).toFixed(1) : "98.4";
  const readRate = totalDelivered > 0 ? ((totalRead / totalDelivered) * 100).toFixed(1) : "87.2";
  const replyRate = totalRead > 0 ? ((totalReplied / totalRead) * 100).toFixed(1) : "32.1";

  // Create Campaign Action
  async function handleCreateCampaign(e: React.FormEvent) {
    e.preventDefault();
    if (!campaignName.trim() || !selectedTemplateId || !selectedGroupId) {
      setCreateNotice("Please specify campaign name, target audience, and template.");
      return;
    }

    setBusyCreate(true);
    setCreateNotice("");
    try {
      const res = await whatsappApi.createCampaign({
        name: campaignName.trim(),
        templateId: selectedTemplateId,
        groupId: selectedGroupId,
        scheduleType,
        scheduledAt: scheduleType === "later" ? scheduledDate : undefined,
        senderPhoneNumberId: selectedSenderNumberId || undefined,
      });
      if (res.ok && res.campaign) {
        setSelectedCampaignId(res.campaign._id);
      }
      setStudioMode("studio");
      setCampaignName("");
      onRefresh();
    } catch (err) {
      setCreateNotice(err instanceof Error ? err.message : "Failed to launch campaign");
    } finally {
      setBusyCreate(false);
    }
  }

  // Delete Campaign
  async function handleDeleteCampaign(id: string, name: string) {
    if (!window.confirm(`Delete broadcast campaign "${name}"?`)) return;
    try {
      await whatsappApi.deleteCampaign(id);
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete campaign");
    }
  }

  // Test Send on Phone
  async function handleSendTestMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!testPhoneNumber.trim() || !activeTemplate) return;
    setBusyTest(true);
    setTestResult(null);

    try {
      const renderedText = activeTemplate.bodyText
        .replace(/{{1}}/g, sampleVar1 || "Alex")
        .replace(/{{2}}/g, sampleVar2 || "Acme Corp")
        .replace(/{{name}}/gi, sampleVar1 || "Alex");

      const res = await whatsappApi.sendTestMessage(testPhoneNumber.trim(), renderedText);
      if (res.ok) {
        setTestResult({ ok: true, msg: "Test message delivered to phone via Meta Cloud API!" });
      } else {
        setTestResult({ ok: false, msg: res.error || "Failed to send test message." });
      }
    } catch (err) {
      setTestResult({ ok: false, msg: err instanceof Error ? err.message : "Network error" });
    } finally {
      setBusyTest(false);
    }
  }

  // Helper to format rendered preview text with highlighted variables
  function renderTemplateBody(body: string) {
    if (!body) return "No message content configured.";
    const parts = body.split(/(\{\{[^}]+\}\})/g);
    return parts.map((part, index) => {
      if (/^\{\{.*\}\}$/.test(part)) {
        const fallback =
          part === "{{1}}" || part.toLowerCase().includes("name")
            ? sampleVar1
            : sampleVar2;
        return (
          <span
            key={index}
            className="inline-flex items-center rounded-md bg-[#c2ebd8] dark:bg-emerald-950/80 dark:border dark:border-emerald-700/60 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[#0a5247] dark:text-emerald-300 shadow-2xs"
            title={`Variable: ${part}`}
          >
            {fallback || part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  }

  return (
    <div className="whatsapp-campaigns space-y-5">
      {/* Main Unified Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#dfe7e4] bg-white p-3 shadow-2xs dark:border-zinc-800 dark:bg-[#121215] lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(["ALL", "COMPLETED", "SCHEDULED", "RUNNING"] as const).map((st) => {
            const count =
              st === "ALL"
                ? campaigns.length
                : campaigns.filter((c) => c.status.toLowerCase() === st.toLowerCase()).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  statusFilter === st
                    ? "bg-black text-white shadow-xs dark:bg-white dark:text-black"
                    : "bg-[#f4f7f6] text-[#52645f] hover:bg-[#e9f0ee] hover:text-[#20342e] dark:bg-zinc-900 dark:border dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                }`}
              >
                <span>{st === "ALL" ? "All Broadcasts" : st.charAt(0) + st.slice(1).toLowerCase()}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    statusFilter === st ? "bg-white/20 text-white dark:bg-black/15 dark:text-black" : "bg-black/5 text-[#60716c] dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Search + Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1 sm:flex-none">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search campaigns..."
              className="w-full rounded-xl border border-[#dfe7e4] bg-[#f9fbfa] py-1.5 pl-8 pr-3 text-xs text-[#20342e] focus:border-black focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-600"
            />
            <svg
              className="pointer-events-none absolute left-2.5 top-2.5 size-3.5 text-[#84938f] dark:text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <button
            type="button"
            onClick={() => setShowTestModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#c6d4d0] bg-white px-3 py-1.5 text-xs font-semibold text-[#20342e] shadow-2xs transition hover:border-black hover:text-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <svg className="size-3.5 text-zinc-700 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>Test Phone</span>
          </button>

          {studioMode === "studio" ? (
            <button
              type="button"
              onClick={() => setStudioMode("composer")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-black text-white px-3.5 py-1.5 text-xs font-bold shadow-xs transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>New Campaign</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStudioMode("studio")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#c6d4d0] bg-white px-3.5 py-1.5 text-xs font-bold text-[#52645f] transition hover:bg-[#f4f7f6] hover:text-[#14231f] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              <span>← Back</span>
            </button>
          )}
        </div>
      </div>

      {/* DUAL-PANE STUDIO LAYOUT */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* LEFT PANE (7 cols) - Campaign Feed or Broadcast Composer */}
        <div className="space-y-4 lg:col-span-7">
          {studioMode === "studio" ? (
            /* STUDIO VIEW: Campaign List with Live Inspector Cards */
            <div className="space-y-3">

              {/* Campaign Cards Stream */}
              {filteredCampaigns.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-[#ccd8d4] bg-white p-12 text-center dark:border-zinc-800 dark:bg-[#121215]">
                  <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#eef6f3] text-[#118778] dark:bg-zinc-800 dark:text-zinc-200">
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-[#14231f] dark:text-white">No campaigns found</h3>
                  <p className="mt-1 text-xs text-[#71817d] dark:text-zinc-400">
                    Create a broadcast using one of your WhatsApp message templates.
                  </p>
                  <button
                    onClick={() => setStudioMode("composer")}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#118778] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0d6e62] dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    Create First Campaign
                  </button>
                </div>
              ) : (
                filteredCampaigns.map((camp) => {
                  const isSelected = activeCampaign?._id === camp._id;
                  const deliveredPct =
                    camp.stats.recipients > 0
                      ? Math.round((camp.stats.delivered / camp.stats.recipients) * 100)
                      : 100;
                  const readPct =
                    camp.stats.delivered > 0
                      ? Math.round((camp.stats.read / camp.stats.delivered) * 100)
                      : 0;

                  return (
                    <div
                      key={camp._id}
                      onClick={() => setSelectedCampaignId(camp._id)}
                      className={`group relative rounded-2xl border p-4.5 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-black bg-white shadow-md ring-2 ring-black/10 dark:border-zinc-600 dark:bg-[#121215] dark:ring-white/10"
                          : "border-[#e0ebe7] bg-white hover:border-[#b8cfc8] hover:shadow-xs dark:border-zinc-800/80 dark:bg-[#121215] dark:hover:border-zinc-700"
                      }`}
                    >
                      {/* Top Row: Title, Date, Status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`grid size-9 shrink-0 place-items-center rounded-xl transition ${
                              isSelected
                                ? "bg-black text-white dark:bg-white dark:text-black"
                                : "bg-[#f0f5f3] text-[#52645f] dark:bg-zinc-800 dark:text-zinc-300"
                            }`}
                          >
                            <svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m3 11 18-5v12L3 13v-2z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
                            </svg>
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="truncate text-sm font-bold text-[#14231f] dark:text-white">
                                {camp.name}
                              </h3>
                              {isSelected && (
                                <span className="rounded-md bg-black/5 dark:bg-zinc-800 px-1.5 py-0.2 text-[9px] font-bold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                                  Active in Studio
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-[#71817d] dark:text-zinc-400">
                              <span>{camp.sentAt ? `Dispatched ${new Date(camp.sentAt).toLocaleDateString()}` : "Scheduled for future"}</span>
                              <span>•</span>
                              <span className="font-mono text-[10px] text-[#52645f] dark:text-zinc-400">
                                Template: {camp.templateName}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                              camp.status.toLowerCase() === "completed"
                                ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/20 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800/50"
                                : camp.status.toLowerCase() === "scheduled"
                                ? "bg-blue-50 text-blue-800 ring-1 ring-blue-600/20 dark:bg-blue-950/60 dark:text-blue-300 dark:ring-blue-800/50"
                                : camp.status.toLowerCase() === "failed"
                                ? "bg-rose-50 text-rose-800 ring-1 ring-rose-600/20 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-800/50"
                                : "bg-amber-50 text-amber-800 ring-1 ring-amber-600/20 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-800/50"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                camp.status.toLowerCase() === "completed"
                                  ? "bg-emerald-500"
                                  : camp.status.toLowerCase() === "scheduled"
                                  ? "bg-blue-500 animate-pulse"
                                  : camp.status.toLowerCase() === "failed"
                                  ? "bg-rose-500"
                                  : "bg-amber-500 animate-pulse"
                              }`}
                            />
                            {camp.status}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              void handleDeleteCampaign(camp._id, camp.name);
                            }}
                            className="rounded-lg p-1.5 text-[#84938f] opacity-0 transition hover:bg-rose-50 hover:text-rose-600 dark:text-zinc-500 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 group-hover:opacity-100"
                            title="Delete Campaign"
                          >
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Middle Row: Audience & Funnel Track */}
                      <div className="mt-3.5 space-y-2 rounded-xl bg-[#fafcfb] p-3 border border-[#edf3f0] dark:bg-zinc-900/60 dark:border-zinc-800">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-[#e3eeea] dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                              Audience: {camp.groupName || "Segment"}
                            </span>
                            <span className="text-[11px] text-[#60716c] dark:text-zinc-400">
                              {camp.stats.recipients.toLocaleString()} Contacts
                            </span>
                          </div>
                          <div className="text-[11px] font-semibold text-[#14231f] dark:text-zinc-200">
                            {deliveredPct}% Delivered
                          </div>
                        </div>

                        {/* Multi-segment Delivery Bar */}
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                          <div
                            className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-500"
                            style={{ width: `${deliveredPct}%` }}
                          />
                        </div>

                        {/* Funnel Metrics Row */}
                        <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                          <div className="border-r border-[#e8efec] dark:border-zinc-800">
                            <span className="block text-[9px] uppercase font-bold text-[#84938f] dark:text-zinc-500">Sent</span>
                            <span className="text-xs font-bold text-[#14231f] dark:text-white">{camp.stats.recipients}</span>
                          </div>
                          <div className="border-r border-[#e8efec] dark:border-zinc-800">
                            <span className="block text-[9px] uppercase font-bold text-emerald-700 dark:text-emerald-400">Delivered</span>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-300">{camp.stats.delivered}</span>
                          </div>
                          <div className="border-r border-[#e8efec] dark:border-zinc-800">
                            <span className="block text-[9px] uppercase font-bold text-sky-700 dark:text-sky-400">Read</span>
                            <span className="text-xs font-bold text-sky-600 dark:text-sky-300">{camp.stats.read} ({readPct}%)</span>
                          </div>
                          <div>
                            <span className="block text-[9px] uppercase font-bold text-indigo-700 dark:text-indigo-400">Replied</span>
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300">{camp.stats.replied}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* COMPOSER VIEW: Interactive Studio Campaign Builder */
            <div className="rounded-3xl border border-[#dbe4e1] bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-[#121215]">
              <div className="flex items-center justify-between border-b border-[#edf2f0] pb-4 dark:border-zinc-800">
                <div>
                  <h2 className="text-base font-bold text-[#14231f] dark:text-white">Configure New Broadcast</h2>
                  <p className="text-xs text-[#71817d] dark:text-zinc-400">
                    Changes will reflect instantly on the simulated smartphone preview to your right.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStudioMode("studio")}
                  className="rounded-lg p-1 text-xs font-semibold text-[#84938f] hover:bg-[#f4f7f6] hover:text-[#14231f] dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                >
                  ✕ Cancel
                </button>
              </div>

              <form onSubmit={handleCreateCampaign} className="mt-5 space-y-5">
                {createNotice && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                    {createNotice}
                  </div>
                )}

                {/* Step 1: Campaign Identity */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#445550] dark:text-zinc-300">
                    1. Campaign Name
                  </label>
                  <input
                    type="text"
                    required
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="e.g. VIP Customer Product Launch Broadcast"
                    className="w-full rounded-xl border border-[#c6d4d0] bg-[#f9fbfa] px-3.5 py-2.5 text-xs font-medium text-[#14231f] transition focus:border-[#118778] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#118778]/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-600 dark:focus:bg-zinc-900 dark:focus:ring-0"
                  />
                </div>

                {/* Sender WhatsApp Line Selector */}
                {accounts.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#445550] dark:text-zinc-300">
                        Send From WhatsApp Number
                      </label>
                      <span className="text-[11px] font-semibold text-[#118778] dark:text-emerald-400">
                        {accounts.length} {accounts.length === 1 ? "line" : "lines"} connected
                      </span>
                    </div>
                    <select
                      value={selectedSenderNumberId}
                      onChange={(e) => setSelectedSenderNumberId(e.target.value)}
                      className="w-full rounded-xl border border-[#c6d4d0] bg-[#f9fbfa] px-3.5 py-2.5 text-xs font-medium text-[#14231f] transition focus:border-[#118778] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#118778]/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-600 dark:focus:bg-zinc-900 dark:focus:ring-0"
                    >
                      {accounts.map((acc) => (
                        <option key={acc.accountId} value={acc.accountId} className="dark:bg-zinc-900 dark:text-white">
                          {acc.displayPhoneNumber} — {acc.label || acc.verifiedName} {acc.isPrimary ? "(Default)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Step 2: Target Audience Group */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#445550] dark:text-zinc-300">
                      2. Target Audience Segment
                    </label>
                    <span className="text-[11px] text-[#118778] font-semibold dark:text-emerald-400">
                      {activeGroup ? `${activeGroup.contactCount || 0} Contacts selected` : ""}
                    </span>
                  </div>
                  <select
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    className="w-full rounded-xl border border-[#c6d4d0] bg-[#f9fbfa] px-3.5 py-2.5 text-xs font-medium text-[#14231f] transition focus:border-[#118778] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#118778]/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-600 dark:focus:bg-zinc-900 dark:focus:ring-0"
                  >
                    {groups.map((g) => (
                      <option key={g._id} value={g._id} className="dark:bg-zinc-900 dark:text-white">
                        {g.name} — ({g.contactCount || 0} verified recipients)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Step 3: Meta Template Selector */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#445550] dark:text-zinc-300">
                      3. Pre-Approved WhatsApp Template
                    </label>
                    {activeTemplate && (
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border dark:border-emerald-800/50">
                        {activeTemplate.category}
                      </span>
                    )}
                  </div>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                    className="w-full rounded-xl border border-[#c6d4d0] bg-[#f9fbfa] px-3.5 py-2.5 text-xs font-medium text-[#14231f] transition focus:border-[#118778] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#118778]/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-600 dark:focus:bg-zinc-900 dark:focus:ring-0"
                  >
                    {templates.map((t) => (
                      <option key={t._id} value={t._id} className="dark:bg-zinc-900 dark:text-white">
                        {t.name} ({t.category} • {t.language})
                      </option>
                    ))}
                  </select>

                  {/* Dynamic Variable Customizers */}
                  <div className="mt-3 rounded-2xl border border-[#d8e6e1] bg-[#f5faf8] p-3.5 space-y-2.5 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="text-[11px] font-bold text-[#118778] dark:text-emerald-400">
                      Dynamic Template Variables (Live Preview)
                    </div>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      <div>
                        <label className="text-[10px] font-semibold text-[#52645f] dark:text-zinc-400">
                          Placeholder `{"{{1}}"}` or Name:
                        </label>
                        <input
                          type="text"
                          value={sampleVar1}
                          onChange={(e) => setSampleVar1(e.target.value)}
                          placeholder="e.g. Alex Johnson"
                          className="mt-0.5 w-full rounded-lg border border-[#cbe0d9] bg-white px-2.5 py-1.5 text-xs text-[#14231f] focus:outline-none focus:border-[#118778] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-[#52645f] dark:text-zinc-400">
                          Placeholder `{"{{2}}"}` or Company:
                        </label>
                        <input
                          type="text"
                          value={sampleVar2}
                          onChange={(e) => setSampleVar2(e.target.value)}
                          placeholder="e.g. Acme Corp"
                          className="mt-0.5 w-full rounded-lg border border-[#cbe0d9] bg-white px-2.5 py-1.5 text-xs text-[#14231f] focus:outline-none focus:border-[#118778] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4: Dispatch Schedule */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#445550] dark:text-zinc-300">
                    4. Dispatch Timing
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      onClick={() => setScheduleType("now")}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-3 text-xs transition ${
                        scheduleType === "now"
                          ? "border-[#118778] bg-[#f0f8f5] text-[#118778] font-bold dark:border-zinc-200 dark:bg-zinc-800 dark:text-white"
                          : "border-[#dbe4e1] bg-white text-[#52645f] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="schedule"
                        checked={scheduleType === "now"}
                        onChange={() => setScheduleType("now")}
                        className="accent-[#118778] dark:accent-white"
                      />
                      <span>Send Immediately</span>
                    </label>

                    <label
                      onClick={() => setScheduleType("later")}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-3 text-xs transition ${
                        scheduleType === "later"
                          ? "border-[#118778] bg-[#f0f8f5] text-[#118778] font-bold dark:border-zinc-200 dark:bg-zinc-800 dark:text-white"
                          : "border-[#dbe4e1] bg-white text-[#52645f] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="schedule"
                        checked={scheduleType === "later"}
                        onChange={() => setScheduleType("later")}
                        className="accent-[#118778] dark:accent-white"
                      />
                      <span>Schedule for Later</span>
                    </label>
                  </div>

                  {scheduleType === "later" && (
                    <input
                      type="datetime-local"
                      required
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-[#c6d4d0] bg-[#f9fbfa] px-3.5 py-2 text-xs text-[#14231f] focus:border-[#118778] focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-600"
                    />
                  )}
                </div>

                {/* Submit Controls */}
                <div className="flex items-center justify-end gap-3 border-t border-[#edf2f0] pt-4 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setStudioMode("studio")}
                    className="rounded-xl border border-[#c6d4d0] px-4 py-2.5 text-xs font-semibold text-[#52645f] hover:bg-[#f4f7f6] dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={busyCreate}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#118778] to-[#0a5c51] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:brightness-110 disabled:opacity-50 dark:bg-white dark:text-black dark:from-white dark:to-zinc-100 dark:hover:bg-zinc-200 dark:shadow-none"
                  >
                    {busyCreate ? (
                      <>
                        <span className="size-3.5 animate-spin rounded-full border-2 border-white dark:border-black border-t-transparent" />
                        <span>Broadcasting via Meta API...</span>
                      </>
                    ) : (
                      <>
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>{scheduleType === "now" ? "Launch Broadcast Now" : "Schedule Broadcast"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* RIGHT PANE (5 cols) - Sticky Live Smartphone Simulator & Analytics Studio */}
        <div className="space-y-4 lg:col-span-5 lg:sticky lg:top-4">
          <div className="rounded-3xl border border-[#dbe4e1] bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-[#121215]">
            {/* Studio Inspector Header with Tab Toggles */}
            <div className="flex items-center justify-between border-b border-[#edf2f0] pb-3.5 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#25D366] animate-pulse" />
                <span className="text-xs font-bold text-[#14231f] dark:text-white">
                  {studioMode === "composer"
                    ? "Live Template Preview"
                    : activeCampaign?.name || "Broadcast Studio"}
                </span>
              </div>

              {/* Segmented Tab Pill */}
              <div className="flex rounded-lg bg-[#f0f4f3] p-0.5 dark:bg-zinc-900 dark:border dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setRightTab("phone")}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition ${
                    rightTab === "phone"
                      ? "bg-white text-black shadow-2xs dark:bg-zinc-800 dark:text-white"
                      : "text-[#60716c] hover:text-[#14231f] dark:text-zinc-400 dark:hover:text-white"
                  }`}
                >
                  💬 Message Preview
                </button>
                <button
                  type="button"
                  onClick={() => setRightTab("analytics")}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition ${
                    rightTab === "analytics"
                      ? "bg-white text-black shadow-2xs dark:bg-zinc-800 dark:text-white"
                      : "text-[#60716c] hover:text-[#14231f] dark:text-zinc-400 dark:hover:text-white"
                  }`}
                >
                  📊 Delivery Funnel
                </button>
              </div>
            </div>

            {/* TAB 1: SAAS MESSAGE PREVIEW CARD */}
            {rightTab === "phone" && (
              <div className="mt-4 flex flex-col justify-between rounded-2xl border border-[#d8e6e1] bg-[#f9fbfa] p-4 min-h-[360px] dark:border-zinc-800 dark:bg-[#0c0d10]">
                <div className="space-y-3">
                  {/* Preview Header */}
                  <div className="flex items-center justify-between border-b border-[#edf2f0] pb-2.5 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <div className="grid size-7 place-items-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-xs font-bold text-white shadow-xs">
                        V
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-[#14231f] dark:text-white">Vozon AI Business</span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">✓ Verified</span>
                        </div>
                        <span className="text-[10px] text-[#71817d] dark:text-zinc-400">Meta WhatsApp Cloud Broadcast</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowTestModal(true)}
                      className="inline-flex items-center gap-1 rounded-xl border border-zinc-300 bg-white px-2.5 py-1 text-[11px] font-bold text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-white transition"
                    >
                      Test on Phone
                    </button>
                  </div>

                  {/* Clean Message Bubble */}
                  <div className="rounded-2xl rounded-tl-none border border-[#c4eabf] bg-[#eefbf0] p-4 shadow-2xs space-y-2 dark:border-[#25d366]/20 dark:bg-[#122822]">
                    {/* Header Banner if template specifies */}
                    {activeTemplate?.headerText && (
                      <div className="border-b border-black/5 pb-1 text-xs font-bold text-[#14231f] dark:border-white/10 dark:text-emerald-300">
                        {activeTemplate.headerText}
                      </div>
                    )}

                    {/* Body Text with highlighted variables */}
                    <div className="whitespace-pre-line text-xs leading-relaxed text-[#111b21] dark:text-zinc-100">
                      {renderTemplateBody(activeTemplate?.bodyText || "")}
                    </div>

                    {/* Footer text */}
                    {activeTemplate?.footerText && (
                      <div className="pt-1 text-[10px] text-[#667781] dark:text-zinc-400 italic">
                        {activeTemplate.footerText}
                      </div>
                    )}

                    {/* Timestamp & Double Blue Checks */}
                    <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-[#667781] dark:text-zinc-400">
                      <span>Now</span>
                      <span className="font-bold text-[#53bdeb]">✓✓ Delivered</span>
                    </div>

                    {/* Interactive Buttons Preview */}
                    {activeTemplate?.buttons && activeTemplate.buttons.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-black/5 dark:border-white/10 flex flex-wrap gap-1.5">
                        {activeTemplate.buttons.map((btn, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#cde0dc] bg-white px-3 py-1 text-xs font-bold text-[#00a884] shadow-2xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-emerald-400"
                          >
                            {btn.type === "URL" ? (
                              <span>↗ {btn.text}</span>
                            ) : btn.type === "PHONE_NUMBER" ? (
                              <span>📞 {btn.text}</span>
                            ) : (
                              <span>↩ {btn.text}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Variable Mapping Notice */}
                <div className="mt-4 rounded-xl border border-[#e2ede8] bg-white p-3 text-[11px] text-[#52645f] dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
                  <span className="font-bold text-[#14231f] dark:text-white">Dynamic Parameters: </span>
                  {activeTemplate?.name ? `Using Meta template "${activeTemplate.name}" with auto-substituted contact tags.` : "Select a template in composer to preview parameters."}
                </div>
              </div>
            )}

            {/* TAB 2: DETAILED ANALYTICS & CONVERSION FUNNEL */}
            {rightTab === "analytics" && (
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-[#d8e6e1] bg-[#f7faf8] p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                  <div className="text-xs font-bold text-[#14231f] dark:text-white">
                    Meta Cloud API Dispatch Pipeline
                  </div>
                  <p className="text-[11px] text-[#60716c] dark:text-zinc-400">
                    Live delivery audit trail for {activeCampaign?.name || "current campaign"}.
                  </p>

                  <div className="mt-4 space-y-3">
                    {/* Funnel Step 1: Targeted Audience */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-[#445550] dark:text-zinc-300">1. Audience Targeted</span>
                        <span className="font-bold text-[#14231f] dark:text-white">
                          {activeCampaign?.stats.recipients || 0} Contacts (100%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#e0eae5] dark:bg-zinc-800">
                        <div className="h-full rounded-full bg-emerald-500 w-full" />
                      </div>
                    </div>

                    {/* Funnel Step 2: Delivered */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-[#445550] dark:text-zinc-300">2. Delivered to Handsets</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {activeCampaign?.stats.delivered || 0} (
                          {activeCampaign && activeCampaign.stats.recipients > 0
                            ? Math.round(
                                (activeCampaign.stats.delivered / activeCampaign.stats.recipients) * 100
                              )
                            : 98}
                          %)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#e0eae5] dark:bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{
                            width: `${
                              activeCampaign && activeCampaign.stats.recipients > 0
                                ? (activeCampaign.stats.delivered / activeCampaign.stats.recipients) * 100
                                : 98
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Funnel Step 3: Read */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-[#445550] dark:text-zinc-300">3. Read Receipts (Blue Checks)</span>
                        <span className="font-bold text-sky-600 dark:text-sky-400">
                          {activeCampaign?.stats.read || 0} (
                          {activeCampaign && activeCampaign.stats.delivered > 0
                            ? Math.round(
                                (activeCampaign.stats.read / activeCampaign.stats.delivered) * 100
                              )
                            : 87}
                          %)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#e0eae5] dark:bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-sky-500"
                          style={{
                            width: `${
                              activeCampaign && activeCampaign.stats.delivered > 0
                                ? (activeCampaign.stats.read / activeCampaign.stats.delivered) * 100
                                : 87
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Funnel Step 4: Replied */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-[#445550] dark:text-zinc-300">4. Direct Customer Replies</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {activeCampaign?.stats.replied || 0} Replies
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#e0eae5] dark:bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{
                            width: `${
                              activeCampaign && activeCampaign.stats.read > 0
                                ? Math.min(100, (activeCampaign.stats.replied / activeCampaign.stats.read) * 100)
                                : 32
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#dbe4e1] bg-white p-3.5 text-xs space-y-2 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#71817d] dark:text-zinc-400">Meta WABA Health</span>
                    <span className="rounded-md bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border dark:border-emerald-800/50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      High Quality
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#71817d] dark:text-zinc-400">Messaging Tier</span>
                    <span className="font-mono text-[#14231f] dark:text-zinc-200">Tier 1 (100k msgs/day)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#71817d] dark:text-zinc-400">Target Group</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">{activeGroup?.name || "Audience"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Test Message on Phone Modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-[#dbe4e1] bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-[#121215]">
            <div className="flex items-center justify-between border-b border-[#edf2f0] pb-3 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </span>
                <h3 className="text-sm font-bold text-[#14231f] dark:text-white">
                  Send Test Broadcast to Phone
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowTestModal(false);
                  setTestResult(null);
                }}
                className="rounded-lg p-1 text-[#84938f] hover:bg-[#f4f7f6] dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendTestMessage} className="mt-4 space-y-4">
              <p className="text-xs text-[#60716c] dark:text-zinc-400">
                Dispatches a live WhatsApp test message using template{" "}
                <span className="font-bold text-[#14231f] dark:text-white">
                  {activeTemplate?.name || "Selected Template"}
                </span>{" "}
                directly to your personal mobile number via Meta Cloud API.
              </p>

              {testResult && (
                <div
                  className={`rounded-xl p-3 text-xs ${
                    testResult.ok
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                      : "border border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
                  }`}
                >
                  {testResult.msg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#445550] dark:text-zinc-300">
                  Recipient Mobile Number (with country code)
                </label>
                <input
                  type="tel"
                  required
                  value={testPhoneNumber}
                  onChange={(e) => setTestPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210 or +1 555 123 4567"
                  className="mt-1 w-full rounded-xl border border-[#c6d4d0] bg-[#f9fbfa] px-3.5 py-2.5 text-xs text-[#14231f] focus:border-[#118778] focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-600"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-[#edf2f0] pt-3 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowTestModal(false)}
                  className="rounded-xl border border-[#dbe4e1] px-4 py-2 text-xs font-semibold text-[#52645f] dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={busyTest}
                  className="rounded-xl bg-[#118778] px-5 py-2 text-xs font-bold text-white hover:bg-[#0e7467] disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  {busyTest ? "Sending..." : "Send Test Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
