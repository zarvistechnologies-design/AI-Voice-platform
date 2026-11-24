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

type StatusFilter = "ALL" | "COMPLETED" | "SCHEDULED" | "RUNNING" | "FAILED";

export function WhatsAppCampaignsView({
  campaigns,
  templates,
  groups,
  accounts = [],
  onRefresh,
  defaultGroupId,
}: WhatsAppCampaignsViewProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [groupFilter, setGroupFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(Boolean(defaultGroupId));
  const [inspectCampaignId, setInspectCampaignId] = useState<string>("");
  const [inspectTab, setInspectTab] = useState<"preview" | "funnel">("preview");
  const [showTestModal, setShowTestModal] = useState(false);

  // Test send state
  const [testPhoneNumber, setTestPhoneNumber] = useState("");
  const [busyTest, setBusyTest] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  // Create campaign form state
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
  const [variableMappings, setVariableMappings] = useState<Record<string, string>>({});
  const [busyCreate, setBusyCreate] = useState(false);
  const [createNotice, setCreateNotice] = useState("");

  useEffect(() => {
    if (!selectedTemplateId && templates.length > 0) {
      setSelectedTemplateId(templates[0]._id);
    }
  }, [templates, selectedTemplateId]);

  useEffect(() => {
    if (defaultGroupId) {
      setSelectedGroupId(defaultGroupId);
      setShowCreateModal(true);
    } else if (!selectedGroupId && groups.length > 0) {
      setSelectedGroupId(groups[0]._id);
    }
  }, [groups, selectedGroupId, defaultGroupId]);

  useEffect(() => {
    if (!selectedSenderNumberId && accounts.length > 0) {
      setSelectedSenderNumberId(accounts.find((a) => a.isPrimary)?.accountId || accounts[0].accountId);
    }
  }, [accounts, selectedSenderNumberId]);

  const inspectedCampaign = useMemo(
    () => campaigns.find((c) => c._id === inspectCampaignId) || null,
    [campaigns, inspectCampaignId],
  );

  const composerTemplate = useMemo(
    () => templates.find((t) => t._id === selectedTemplateId) || templates[0] || null,
    [templates, selectedTemplateId],
  );

  const inspectedTemplate = useMemo(() => {
    if (!inspectedCampaign) return composerTemplate;
    return (
      templates.find((t) => t._id === inspectedCampaign.templateId || t.name === inspectedCampaign.templateName) ||
      templates[0] ||
      null
    );
  }, [inspectedCampaign, composerTemplate, templates]);

  const activeTestTemplate = showCreateModal ? composerTemplate : inspectedTemplate || templates[0] || null;
  const composerVariableIndices = useMemo(() => {
    const matches = composerTemplate?.bodyText.match(/\{\{(\d+)\}\}/g) || [];
    return Array.from(new Set(matches.map((match) => match.replace(/\D/g, ""))))
      .sort((a, b) => Number(a) - Number(b));
  }, [composerTemplate?.bodyText]);

  useEffect(() => {
    setVariableMappings(Object.fromEntries(composerVariableIndices.map((index) => [
      index,
      index === "1" ? "name" : index === "2" ? "phone" : index === "3" ? "email" : "",
    ])));
  }, [composerTemplate?._id, composerVariableIndices]);

  const filteredCampaigns = useMemo(() => {
    const q = search.trim().toLowerCase();
    return campaigns.filter((c) => {
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.templateName.toLowerCase().includes(q) ||
        (c.groupName && c.groupName.toLowerCase().includes(q));
      const matchesStatus =
        statusFilter === "ALL" || c.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesGroup =
        groupFilter === "ALL" || c.groupId === groupFilter;
      return matchesSearch && matchesStatus && matchesGroup;
    });
  }, [campaigns, search, statusFilter, groupFilter]);

  const statusCounts = useMemo(() => ({
    ALL: campaigns.length,
    COMPLETED: campaigns.filter((c) => c.status.toLowerCase() === "completed").length,
    SCHEDULED: campaigns.filter((c) => c.status.toLowerCase() === "scheduled").length,
    RUNNING: campaigns.filter((c) => c.status.toLowerCase() === "running").length,
    FAILED: campaigns.filter((c) => c.status.toLowerCase() === "failed").length,
  }), [campaigns]);

  const totals = useMemo(() => {
    const delivered = filteredCampaigns.reduce((sum, c) => sum + (c.stats.delivered || 0), 0);
    const read = filteredCampaigns.reduce((sum, c) => sum + (c.stats.read || 0), 0);
    const replied = filteredCampaigns.reduce((sum, c) => sum + (c.stats.replied || 0), 0);
    return { delivered, read, replied };
  }, [filteredCampaigns]);

  async function handleCreateCampaign(e: React.FormEvent) {
    e.preventDefault();
    if (!campaignName.trim() || !selectedTemplateId || !selectedGroupId) {
      setCreateNotice("Please specify campaign name, target group, and template.");
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
        scheduledAt: scheduleType === "later" && scheduledDate ? new Date(scheduledDate).toISOString() : undefined,
        senderPhoneNumberId: selectedSenderNumberId || undefined,
        variableMappings,
      });
      setShowCreateModal(false);
      setCampaignName("");
      setScheduledDate("");
      if (res.ok && res.campaign) {
        setInspectCampaignId(res.campaign._id);
        setInspectTab("funnel");
      }
      onRefresh();
    } catch (err) {
      setCreateNotice(err instanceof Error ? err.message : "Failed to launch campaign");
    } finally {
      setBusyCreate(false);
    }
  }

  async function handleDeleteCampaign(id: string, name: string) {
    if (!window.confirm(`Delete campaign "${name}"?`)) return;
    try {
      await whatsappApi.deleteCampaign(id);
      if (inspectCampaignId === id) setInspectCampaignId("");
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete campaign");
    }
  }

  async function handleSendTestMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!testPhoneNumber.trim() || !activeTestTemplate) return;
    setBusyTest(true);
    setTestResult(null);

    try {
      const renderedText = activeTestTemplate.bodyText
        .replace(/{{1}}/g, sampleVar1 || "Alex")
        .replace(/{{2}}/g, sampleVar2 || "Acme Corp")
        .replace(/{{name}}/gi, sampleVar1 || "Alex");

      const res = await whatsappApi.sendTestMessage(testPhoneNumber.trim(), renderedText);
      if (res.ok) {
        setTestResult({ ok: true, msg: "Test message sent via Meta Cloud API." });
      } else {
        setTestResult({ ok: false, msg: res.error || "Failed to send test message." });
      }
    } catch (err) {
      setTestResult({ ok: false, msg: err instanceof Error ? err.message : "Network error" });
    } finally {
      setBusyTest(false);
    }
  }

  function renderTemplateBody(body: string) {
    if (!body) return "No message content configured.";
    const parts = body.split(/(\{\{[^}]+\}\})/g);
    return parts.map((part, index) => {
      if (/^\{\{.*\}\}$/.test(part)) {
        const fallback =
          part === "{{1}}" || part.toLowerCase().includes("name") ? sampleVar1 : sampleVar2;
        return (
          <span
            key={index}
            className="inline-flex items-center rounded bg-[#f4f4f5] px-1 py-0.2 font-mono text-[11px] font-medium text-[#171717]"
            title={`Variable: ${part}`}
          >
            {fallback || part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  }

  function statusDotClass(status: string) {
    const s = status.toLowerCase();
    if (s === "completed") return "bg-emerald-600";
    if (s === "scheduled") return "bg-blue-600";
    if (s === "running") return "bg-amber-500";
    if (s === "failed") return "bg-rose-600";
    return "bg-[#171717]";
  }

  return (
    <div className="whatsapp-campaigns space-y-4">
      {/* Compact Top Toolbar (matches Contact Groups) */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns by name, template, group..."
            className="h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[13px] text-[#171717] placeholder:text-[#71717a] focus:border-[#171717] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setTestResult(null);
              setShowTestModal(true);
            }}
            className="inline-flex h-8 items-center rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] font-medium text-[#171717] transition hover:bg-[#f4f4f5]"
          >
            Test Phone
          </button>
          <button
            type="button"
            onClick={() => {
              setCreateNotice("");
              setShowCreateModal(true);
            }}
            className="inline-flex h-8 items-center rounded-md bg-[#2563eb] px-3 text-[12.5px] font-medium text-white transition hover:bg-[#1d4ed8]"
          >
            + New Campaign
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout: Left Filter Sidebar + Right Campaigns Table */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Left: Status & Audience Group Filters */}
        <aside className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between px-0.5">
              <h2 className="m-0 text-[13px] font-semibold text-[#171717]">
                Status <span className="ml-1 font-normal text-[#71717a]">{campaigns.length}</span>
              </h2>
            </div>

            <div className="overflow-hidden rounded-lg border border-[#eaeaea] bg-white divide-y divide-[#eaeaea]">
              {(
                [
                  { id: "ALL", label: "All Campaigns" },
                  { id: "COMPLETED", label: "Completed" },
                  { id: "SCHEDULED", label: "Scheduled" },
                  { id: "RUNNING", label: "Running" },
                  { id: "FAILED", label: "Failed" },
                ] as const
              ).map((item) => {
                const isSelected = statusFilter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStatusFilter(item.id)}
                    className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-[12.5px] transition ${
                      isSelected
                        ? "border-l-2 border-l-[#2563eb] bg-[#eff6ff] font-semibold text-[#1d4ed8]"
                        : "text-[#171717] hover:bg-[#fafafa]"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`tabular-nums text-[11.5px] ${
                        isSelected ? "text-[#2563eb]" : "text-[#71717a]"
                      }`}
                    >
                      {statusCounts[item.id]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {groups.length > 0 && (
            <div className="grid gap-2">
              <div className="flex items-center justify-between px-0.5">
                <h2 className="m-0 text-[13px] font-semibold text-[#171717]">
                  Audience Groups <span className="ml-1 font-normal text-[#71717a]">{groups.length}</span>
                </h2>
              </div>

              <div className="overflow-hidden rounded-lg border border-[#eaeaea] bg-white divide-y divide-[#eaeaea]">
                <button
                  type="button"
                  onClick={() => setGroupFilter("ALL")}
                  className={`flex w-full items-center justify-between px-3.5 py-2 text-left text-[12.5px] transition ${
                    groupFilter === "ALL"
                      ? "border-l-2 border-l-[#2563eb] bg-[#eff6ff] font-semibold text-[#1d4ed8]"
                      : "text-[#171717] hover:bg-[#fafafa]"
                  }`}
                >
                  <span>All Groups</span>
                  <span
                    className={`tabular-nums text-[11.5px] ${
                      groupFilter === "ALL" ? "text-[#2563eb]" : "text-[#71717a]"
                    }`}
                  >
                    {campaigns.length}
                  </span>
                </button>
                {groups.map((grp) => {
                  const isSelected = groupFilter === grp._id;
                  const count = campaigns.filter((c) => c.groupId === grp._id).length;
                  return (
                    <button
                      key={grp._id}
                      type="button"
                      onClick={() => setGroupFilter(isSelected ? "ALL" : grp._id)}
                      className={`flex w-full items-center justify-between gap-2 px-3.5 py-2 text-left text-[12.5px] transition ${
                        isSelected
                          ? "border-l-2 border-l-[#2563eb] bg-[#eff6ff] font-semibold text-[#1d4ed8]"
                          : "text-[#171717] hover:bg-[#fafafa]"
                      }`}
                    >
                      <span className="truncate">{grp.name}</span>
                      <span
                        className={`tabular-nums text-[11.5px] ${
                          isSelected ? "text-[#2563eb]" : "text-[#71717a]"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </aside>

        {/* Right: Clean Campaigns Table */}
        <div className="grid gap-2 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
            <h2 className="m-0 text-[13px] font-semibold text-[#171717]">
              Campaigns <span className="ml-1 font-normal text-[#71717a]">{filteredCampaigns.length}</span>
            </h2>
            <div className="flex items-center gap-3 text-[11.5px] text-[#71717a] tabular-nums">
              <span>{totals.delivered.toLocaleString()} delivered</span>
              <span>·</span>
              <span>{totals.read.toLocaleString()} read</span>
              <span>·</span>
              <span>{totals.replied.toLocaleString()} replied</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-[#eaeaea] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12.5px]">
                <thead className="border-b border-[#eaeaea] bg-[#fafafa] text-[11px] font-semibold uppercase tracking-[0.06em] text-[#71717a]">
                  <tr>
                    <th className="px-4 py-2.5">Campaign</th>
                    <th className="px-4 py-2.5">Audience &amp; Template</th>
                    <th className="px-4 py-2.5">Delivery</th>
                    <th className="px-4 py-2.5">Engagement</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaeaea]">
                  {filteredCampaigns.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-[12.5px] text-[#71717a]">
                        No campaigns found. Click{" "}
                        <button
                          type="button"
                          onClick={() => setShowCreateModal(true)}
                          className="font-medium text-[#171717] underline"
                        >
                          + New Campaign
                        </button>{" "}
                        to launch one.
                      </td>
                    </tr>
                  ) : (
                    filteredCampaigns.map((camp) => {
                      const deliveredPct =
                        camp.stats.recipients > 0
                          ? Math.round((camp.stats.delivered / camp.stats.recipients) * 100)
                          : 0;
                      const readPct =
                        camp.stats.delivered > 0
                          ? Math.round((camp.stats.read / camp.stats.delivered) * 100)
                          : 0;

                      return (
                        <tr
                          key={camp._id}
                          onClick={() => {
                            setInspectCampaignId(camp._id);
                            setInspectTab("preview");
                          }}
                          className="cursor-pointer transition hover:bg-[#fafafa]"
                        >
                          <td className="px-4 py-2.5">
                            <strong className="block font-medium text-[#171717]">{camp.name}</strong>
                            <span className="block text-[11px] text-[#71717a]">
                              {camp.sentAt
                                ? `Sent ${new Date(camp.sentAt).toLocaleDateString()}`
                                : camp.scheduledAt
                                  ? `Scheduled ${new Date(camp.scheduledAt).toLocaleString()}`
                                  : "Draft / Queued"}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="inline-block rounded border border-[#eaeaea] bg-[#fafafa] px-1.5 py-0.2 text-[11px] text-[#52525b]">
                              {camp.groupName || "Audience"} ({camp.stats.recipients})
                            </span>
                            <span className="mt-0.5 block font-mono text-[11px] text-[#71717a]">
                              {camp.templateName}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 tabular-nums">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-[#171717]">
                                {camp.stats.delivered}/{camp.stats.recipients}
                              </span>
                              <span className="text-[11px] text-[#71717a]">{deliveredPct}%</span>
                            </div>
                            <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-[#eaeaea]">
                              <div
                                className="h-full rounded-full bg-[#2563eb]"
                                style={{ width: `${deliveredPct}%` }}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-2.5 tabular-nums text-[12px] text-[#52525b]">
                            <div>{camp.stats.read} read ({readPct}%)</div>
                            <div className="text-[11px] text-[#71717a]">{camp.stats.replied} replied</div>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#eaeaea] bg-[#fafafa] px-2 py-0.5 text-[11px] font-medium capitalize text-[#171717]">
                              <span className={`size-1.5 rounded-full ${statusDotClass(camp.status)}`} />
                              {camp.status}
                            </span>
                            {camp.failureReason && <span className="mt-1 block max-w-48 text-[10.5px] leading-snug text-rose-700">{camp.failureReason}</span>}
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setInspectCampaignId(camp._id);
                                  setInspectTab("preview");
                                }}
                                className="inline-flex h-7 items-center rounded-md border border-[#eaeaea] bg-white px-2 text-[11.5px] font-medium text-[#171717] hover:bg-[#f4f4f5]"
                              >
                                View
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  void handleDeleteCampaign(camp._id, camp.name);
                                }}
                                className="grid size-7 place-items-center rounded-md border border-transparent text-[#71717a] hover:border-[#eaeaea] hover:bg-white hover:text-[#171717]"
                                title="Delete campaign"
                              >
                                ✕
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* New Campaign Modal (with live preview) */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-[2px]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowCreateModal(false);
          }}
        >
          <div className="w-full max-w-2xl rounded-lg border border-[#eaeaea] bg-white p-5 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#eaeaea] pb-3">
              <div>
                <h3 className="m-0 text-[15px] font-semibold text-[#171717]">New WhatsApp Campaign</h3>
                <p className="m-0 mt-0.5 text-[12px] text-[#71717a]">
                  Choose an audience group, approved template, and send timing.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-[#71717a] hover:text-[#171717]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-[1.2fr_1fr]">
              <div className="space-y-3.5">
                {createNotice && (
                  <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] text-rose-800">
                    {createNotice}
                  </div>
                )}

                <div>
                  <label className="block text-[12px] font-medium text-[#171717]">Campaign Name</label>
                  <input
                    type="text"
                    required
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="e.g. Monthly Follow-up Broadcast"
                    className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[13px] text-[#171717] focus:border-[#171717] focus:outline-none"
                  />
                </div>

                {accounts.length > 0 && (
                  <div>
                    <label className="block text-[12px] font-medium text-[#171717]">Send From Number</label>
                    <select
                      value={selectedSenderNumberId}
                      onChange={(e) => setSelectedSenderNumberId(e.target.value)}
                      className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-2.5 text-[13px] text-[#171717] focus:border-[#171717] focus:outline-none"
                    >
                      {accounts.map((acc) => (
                        <option key={acc.accountId} value={acc.accountId}>
                          {acc.displayPhoneNumber} — {acc.label || acc.verifiedName} {acc.isPrimary ? "(Default)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-[12px] font-medium text-[#171717]">Target Contact Group</label>
                  <select
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-2.5 text-[13px] text-[#171717] focus:border-[#171717] focus:outline-none"
                  >
                    {groups.map((g) => (
                      <option key={g._id} value={g._id}>
                        {g.name} ({g.contactCount || 0} contacts)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#171717]">Approved Template</label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                    className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-2.5 text-[13px] text-[#171717] focus:border-[#171717] focus:outline-none"
                  >
                    {templates.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name} ({t.category} · {t.language})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-[#71717a]">Preview {"{{1}}"}</label>
                    <input
                      type="text"
                      value={sampleVar1}
                      onChange={(e) => setSampleVar1(e.target.value)}
                      className="mt-1 h-8 w-full rounded-md border border-[#eaeaea] bg-white px-2.5 text-[12px] text-[#171717]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#71717a]">Preview {"{{2}}"}</label>
                    <input
                      type="text"
                      value={sampleVar2}
                      onChange={(e) => setSampleVar2(e.target.value)}
                      className="mt-1 h-8 w-full rounded-md border border-[#eaeaea] bg-white px-2.5 text-[12px] text-[#171717]"
                    />
                  </div>
                </div>

                {composerVariableIndices.length > 0 && (
                  <div className="space-y-2 rounded-md border border-[#eaeaea] bg-[#fafafa] p-3">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-[#71717a]">Personalize template variables</div>
                    {composerVariableIndices.map((index) => {
                      const mapping = variableMappings[index] || "";
                      const mappingKind = mapping.startsWith("attribute:") ? "attribute" : mapping.startsWith("static:") ? "static" : mapping;
                      return (
                        <div key={index} className="grid grid-cols-[90px_1fr] gap-2 items-center">
                          <label className="text-[11.5px] text-[#52525b]">{"{{"}{index}{"}}"}</label>
                          <select
                            value={mappingKind}
                            onChange={(e) => {
                              const kind = e.target.value;
                              setVariableMappings((prev) => ({ ...prev, [index]: kind === "attribute" ? "attribute:" : kind === "static" ? "static:" : kind }));
                            }}
                            className="h-8 rounded border border-[#eaeaea] bg-white px-2 text-[11.5px] text-[#171717]"
                          >
                            <option value="">Choose a contact field…</option>
                            <option value="name">Contact name</option>
                            <option value="phone">WhatsApp number</option>
                            <option value="email">Email address</option>
                            <option value="attribute">Custom contact attribute</option>
                            <option value="static">Same text for everyone</option>
                          </select>
                          {(mappingKind === "attribute" || mappingKind === "static") && (
                            <input
                              type="text"
                              required
                              value={mapping.slice(mapping.indexOf(":") + 1)}
                              onChange={(e) => setVariableMappings((prev) => ({ ...prev, [index]: `${mappingKind}:${e.target.value}` }))}
                              placeholder={mappingKind === "attribute" ? "Attribute key, e.g. appointmentDate" : "Value to send to every contact"}
                              maxLength={mappingKind === "static" ? 500 : 80}
                              className="col-start-2 h-8 rounded border border-[#eaeaea] bg-white px-2.5 text-[11.5px] text-[#171717]"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div>
                  <label className="block text-[12px] font-medium text-[#171717]">Schedule</label>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setScheduleType("now")}
                      className={`h-8 rounded-md border text-[12px] font-medium transition ${
                        scheduleType === "now"
                          ? "border-[#2563eb] bg-[#2563eb] text-white"
                          : "border-[#eaeaea] bg-white text-[#52525b] hover:bg-[#fafafa]"
                      }`}
                    >
                      Send Now
                    </button>
                    <button
                      type="button"
                      onClick={() => setScheduleType("later")}
                      className={`h-8 rounded-md border text-[12px] font-medium transition ${
                        scheduleType === "later"
                          ? "border-[#2563eb] bg-[#2563eb] text-white"
                          : "border-[#eaeaea] bg-white text-[#52525b] hover:bg-[#fafafa]"
                      }`}
                    >
                      Schedule Later
                    </button>
                  </div>
                  {scheduleType === "later" && (
                    <input
                      type="datetime-local"
                      required
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="mt-2 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] text-[#171717]"
                    />
                  )}
                </div>
              </div>

              {/* Right: Clean Compact Preview */}
              <div className="flex flex-col justify-between rounded-lg border border-[#eaeaea] bg-[#fafafa] p-3.5">
                <div>
                  <div className="flex items-center justify-between border-b border-[#eaeaea] pb-2">
                    <span className="text-[11.5px] font-semibold text-[#171717]">Message Preview</span>
                    {composerTemplate?.category && (
                      <span className="rounded border border-[#eaeaea] bg-white px-1.5 py-0.2 text-[10px] font-medium text-[#52525b]">
                        {composerTemplate.category}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 rounded-lg border border-[#eaeaea] bg-white p-3 space-y-2">
                    {composerTemplate?.headerText && (
                      <div className="text-[12px] font-semibold text-[#171717] border-b border-[#f4f4f5] pb-1">
                        {composerTemplate.headerText}
                      </div>
                    )}
                    <div className="whitespace-pre-line text-[12px] leading-relaxed text-[#171717]">
                      {renderTemplateBody(composerTemplate?.bodyText || "")}
                    </div>
                    {composerTemplate?.footerText && (
                      <div className="text-[10.5px] text-[#71717a]">{composerTemplate.footerText}</div>
                    )}
                    {composerTemplate?.buttons && composerTemplate.buttons.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 border-t border-[#f4f4f5] pt-2">
                        {composerTemplate.buttons.map((btn, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded border border-[#eaeaea] bg-[#fafafa] px-2 py-0.5 text-[11px] font-medium text-[#171717]"
                          >
                            {btn.text}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#eaeaea] pt-2.5 text-[11px] text-[#71717a]">
                  <span className="truncate font-mono">{composerTemplate?.name || "No template"}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setTestResult(null);
                      setShowTestModal(true);
                    }}
                    className="shrink-0 font-medium text-[#2563eb] hover:text-[#1d4ed8] hover:underline"
                  >
                    Test →
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-[#eaeaea] pt-3 md:col-span-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="inline-flex h-8 items-center rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] font-medium text-[#52525b]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busyCreate}
                  className="inline-flex h-8 items-center rounded-md bg-[#2563eb] px-3.5 text-[12.5px] font-medium text-white hover:bg-[#1d4ed8] disabled:opacity-50"
                >
                  {busyCreate ? "Launching..." : scheduleType === "now" ? "Launch Campaign" : "Schedule Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Campaign Inspector Modal (Preview + Delivery Funnel) */}
      {inspectedCampaign && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-[2px]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setInspectCampaignId("");
          }}
        >
          <div className="w-full max-w-lg rounded-lg border border-[#eaeaea] bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3 border-b border-[#eaeaea] pb-3">
              <div className="min-w-0">
                <h3 className="m-0 truncate text-[15px] font-semibold text-[#171717]">
                  {inspectedCampaign.name}
                </h3>
                <p className="m-0 mt-0.5 text-[12px] text-[#71717a]">
                  {inspectedCampaign.groupName || "Audience"} ·{" "}
                  <span className="font-mono text-[11px]">{inspectedCampaign.templateName}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInspectCampaignId("")}
                className="text-[#71717a] hover:text-[#171717]"
              >
                ✕
              </button>
            </div>

            {/* Segmented Tab */}
            <div className="mt-3.5 flex gap-1 rounded-md border border-[#eaeaea] bg-[#fafafa] p-0.5">
              <button
                type="button"
                onClick={() => setInspectTab("preview")}
                className={`flex-1 rounded py-1.5 text-[12px] font-medium transition ${
                  inspectTab === "preview"
                    ? "bg-white text-[#171717] shadow-2xs"
                    : "text-[#71717a] hover:text-[#171717]"
                }`}
              >
                Message Preview
              </button>
              <button
                type="button"
                onClick={() => setInspectTab("funnel")}
                className={`flex-1 rounded py-1.5 text-[12px] font-medium transition ${
                  inspectTab === "funnel"
                    ? "bg-white text-[#171717] shadow-2xs"
                    : "text-[#71717a] hover:text-[#171717]"
                }`}
              >
                Delivery Funnel
              </button>
            </div>

            {inspectTab === "preview" ? (
              <div className="mt-4 rounded-lg border border-[#eaeaea] bg-[#fafafa] p-3.5">
                <div className="rounded-md border border-[#eaeaea] bg-white p-3.5 space-y-2">
                  {inspectedTemplate?.headerText && (
                    <div className="text-[12.5px] font-semibold text-[#171717] border-b border-[#f4f4f5] pb-1">
                      {inspectedTemplate.headerText}
                    </div>
                  )}
                  <div className="whitespace-pre-line text-[12.5px] leading-relaxed text-[#171717]">
                    {renderTemplateBody(inspectedTemplate?.bodyText || "")}
                  </div>
                  {inspectedTemplate?.footerText && (
                    <div className="text-[11px] text-[#71717a]">{inspectedTemplate.footerText}</div>
                  )}
                  {inspectedTemplate?.buttons && inspectedTemplate.buttons.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 border-t border-[#f4f4f5] pt-2">
                      {inspectedTemplate.buttons.map((btn, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded border border-[#eaeaea] bg-[#fafafa] px-2.5 py-0.5 text-[11px] font-medium text-[#171717]"
                        >
                          {btn.text}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3 rounded-lg border border-[#eaeaea] bg-[#fafafa] p-4">
                {(() => {
                  const rec = inspectedCampaign.stats.recipients || 0;
                  const del = inspectedCampaign.stats.delivered || 0;
                  const read = inspectedCampaign.stats.read || 0;
                  const rep = inspectedCampaign.stats.replied || 0;
                  const delPct = rec > 0 ? Math.round((del / rec) * 100) : 0;
                  const readPct = del > 0 ? Math.round((read / del) * 100) : 0;
                  const repPct = read > 0 ? Math.min(100, Math.round((rep / read) * 100)) : 0;
                  return [
                    { label: "Targeted Contacts", value: `${rec}`, pct: 100 },
                    { label: "Delivered", value: `${del} (${delPct}%)`, pct: delPct },
                    { label: "Read", value: `${read} (${readPct}%)`, pct: readPct },
                    { label: "Replied", value: `${rep} (${repPct}%)`, pct: repPct },
                  ].map((row) => (
                    <div key={row.label} className="space-y-1">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-[#52525b]">{row.label}</span>
                        <span className="font-medium tabular-nums text-[#171717]">{row.value}</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#eaeaea]">
                        <div className="h-full rounded-full bg-[#2563eb]" style={{ width: `${row.pct}%` }} />
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-[#eaeaea] pt-3">
              <button
                type="button"
                onClick={() => {
                  setTestResult(null);
                  setShowTestModal(true);
                }}
                className="inline-flex h-8 items-center rounded-md border border-[#eaeaea] bg-white px-3 text-[12px] font-medium text-[#171717] hover:bg-[#f4f4f5]"
              >
                Test on Phone
              </button>
              <button
                type="button"
                onClick={() => setInspectCampaignId("")}
                className="inline-flex h-8 items-center rounded-md bg-[#171717] px-3.5 text-[12px] font-medium text-white hover:bg-black"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Message on Phone Modal */}
      {showTestModal && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-[2px]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowTestModal(false);
              setTestResult(null);
            }
          }}
        >
          <div className="w-full max-w-md rounded-lg border border-[#eaeaea] bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#eaeaea] pb-3">
              <h3 className="m-0 text-[15px] font-semibold text-[#171717]">Send Test Message</h3>
              <button
                type="button"
                onClick={() => {
                  setShowTestModal(false);
                  setTestResult(null);
                }}
                className="text-[#71717a] hover:text-[#171717]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendTestMessage} className="mt-4 space-y-3.5">
              <p className="m-0 text-[12px] text-[#71717a]">
                Send a live test using template{" "}
                <strong className="font-mono text-[#171717]">
                  {activeTestTemplate?.name || "Selected Template"}
                </strong>{" "}
                via Meta Cloud API.
              </p>

              {testResult && (
                <div
                  className={`rounded-md border px-3 py-2 text-[12px] ${
                    testResult.ok
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-rose-200 bg-rose-50 text-rose-800"
                  }`}
                >
                  {testResult.msg}
                </div>
              )}

              <div>
                <label className="block text-[12px] font-medium text-[#171717]">
                  Phone Number (with country code)
                </label>
                <input
                  type="tel"
                  required
                  value={testPhoneNumber}
                  onChange={(e) => setTestPhoneNumber(e.target.value)}
                  placeholder="e.g. +919876543210"
                  className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[13px] text-[#171717] focus:border-[#171717] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-[#eaeaea] pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowTestModal(false);
                    setTestResult(null);
                  }}
                  className="inline-flex h-8 items-center rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] font-medium text-[#52525b]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busyTest}
                  className="inline-flex h-8 items-center rounded-md bg-[#2563eb] px-3.5 text-[12.5px] font-medium text-white hover:bg-[#1d4ed8] disabled:opacity-50"
                >
                  {busyTest ? "Sending..." : "Send Test"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
