"use client";

import { useEffect, useMemo, useState } from "react";
import type { WhatsAppTemplate, WhatsAppTemplateButton } from "@/lib/whatsapp";
import { whatsappApi } from "@/lib/whatsapp";

interface WhatsAppTemplatesViewProps {
  templates: WhatsAppTemplate[];
  onRefresh: () => void;
  onOpenConnectModal?: () => void;
  isConnected: boolean;
}

interface TemplateBlueprint {
  name: string;
  category: "UTILITY" | "MARKETING" | "AUTHENTICATION";
  badge: string;
  headerType: "NONE" | "TEXT";
  headerText: string;
  bodyText: string;
  footerText: string;
  buttons: WhatsAppTemplateButton[];
  description: string;
  defaultVars: Record<string, string>;
}

const TEMPLATE_BLUEPRINTS: TemplateBlueprint[] = [
  {
    name: "appointment_confirmation_v2",
    category: "UTILITY",
    badge: "Healthcare & Services",
    headerType: "TEXT",
    headerText: "Appointment Confirmed",
    bodyText:
      "Hello {{1}}, your appointment with {{2}} is confirmed for {{3}} at {{4}}.\n\nLocation: {{5}}\nPlease arrive 10 minutes early with your photo ID.",
    footerText: "Reply RESCHEDULE if you need to change your slot",
    buttons: [
      { type: "QUICK_REPLY", text: "Confirm Attendance", value: "CONFIRM_APPT" },
      { type: "QUICK_REPLY", text: "Reschedule Slot", value: "RESCHEDULE_APPT" },
    ],
    description: "Instant booking confirmation with location, timing, and 1-tap confirmation buttons.",
    defaultVars: {
      "1": "Sarah Jenkins",
      "2": "Dr. Miller (Cardiology)",
      "3": "Thursday, Oct 24",
      "4": "10:30 AM",
      "5": "Metropolitan Medical Center, Suite 402",
    },
  },
  {
    name: "order_dispatched_tracking",
    category: "UTILITY",
    badge: "E-Commerce & Retail",
    headerType: "TEXT",
    headerText: "Your Package is on the Way",
    bodyText:
      "Great news {{1}}! Order #{{2}} has shipped via {{3}}.\nEstimated delivery date: {{4}}.\n\nTrack your package in real-time using the button below.",
    footerText: "Thank you for shopping with us",
    buttons: [
      { type: "URL", text: "Track Package", value: "https://track.example.com/order/{{2}}" },
      { type: "QUICK_REPLY", text: "Support Specialist", value: "TALK_TO_SUPPORT" },
    ],
    description: "Live order dispatch notification with interactive package tracking link.",
    defaultVars: {
      "1": "Michael Chang",
      "2": "VZ-849201",
      "3": "FedEx Express Priority",
      "4": "Friday by 4:00 PM",
    },
  },
  {
    name: "exclusive_flash_sale_vip",
    category: "MARKETING",
    badge: "Promotions & Sales",
    headerType: "TEXT",
    headerText: "Exclusive VIP Flash Sale",
    bodyText:
      "Hi {{1}}! You have early access to our exclusive 48-hour flash sale.\n\nEnjoy {{2}}% off your entire cart with code: {{3}}.\nOffer expires {{4}}.",
    footerText: "Reply STOP to unsubscribe from marketing broadcasts",
    buttons: [
      { type: "URL", text: "Claim Discount", value: "https://shop.example.com/vip?code={{3}}" },
      { type: "QUICK_REPLY", text: "Browse Catalog", value: "VIEW_VIP_CATALOG" },
    ],
    description: "High-conversion marketing announcement with personalized discount code and CTA link.",
    defaultVars: {
      "1": "Emma Watson",
      "2": "30",
      "3": "VIPFLASH30",
      "4": "Sunday at Midnight",
    },
  },
  {
    name: "two_factor_auth_security_otp",
    category: "AUTHENTICATION",
    badge: "Security & Login",
    headerType: "NONE",
    headerText: "",
    bodyText:
      "{{1}} is your verification code. For your security, do not share this code with anyone. Valid for {{2}} minutes.",
    footerText: "If you did not request this code, contact security immediately.",
    buttons: [{ type: "QUICK_REPLY", text: "Copy Code", value: "COPY_OTP" }],
    description: "Zero-latency two-factor authentication OTP delivery with security expiry notice.",
    defaultVars: {
      "1": "849-210",
      "2": "5",
    },
  },
];

export function WhatsAppTemplatesView({
  templates,
  onRefresh,
  isConnected,
}: WhatsAppTemplatesViewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate | null>(templates[0] || null);

  useEffect(() => {
    if (!selectedTemplate && templates.length > 0) {
      setSelectedTemplate(templates[0]);
    } else if (selectedTemplate && templates.length > 0) {
      const refreshed = templates.find((t) => t._id === selectedTemplate._id);
      if (refreshed) setSelectedTemplate(refreshed);
    }
  }, [templates, selectedTemplate]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [studioTab, setStudioTab] = useState<"preview" | "payload">("preview");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBlueprintsModal, setShowBlueprintsModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);

  const [sampleVars, setSampleVars] = useState<Record<string, string>>({
    "1": "Alex Johnson",
    "2": "Dr. Sarah Miller",
    "3": "Tomorrow",
    "4": "10:30 AM",
    "5": "Metropolitan Medical Center",
  });

  const [copiedPayload, setCopiedPayload] = useState(false);

  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<"UTILITY" | "MARKETING" | "AUTHENTICATION">("UTILITY");
  const [newLanguage, setNewLanguage] = useState("en_US");
  const [newHeaderType, setNewHeaderType] = useState<"NONE" | "TEXT">("TEXT");
  const [newHeaderText, setNewHeaderText] = useState("Appointment Confirmed");
  const [newBodyText, setNewBodyText] = useState(
    "Hi {{1}}, your appointment with {{2}} is confirmed for {{3}} at {{4}}.\nLocation: {{5}}",
  );
  const [newFooterText, setNewFooterText] = useState("Reply STOP to unsubscribe");
  const [newButtons, setNewButtons] = useState<WhatsAppTemplateButton[]>([
    { type: "QUICK_REPLY", text: "Confirm", value: "CONFIRM" },
    { type: "QUICK_REPLY", text: "Reschedule", value: "RESCHEDULE" },
  ]);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [testPhone, setTestPhone] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [testNotice, setTestNotice] = useState<{ ok: boolean; msg: string } | null>(null);

  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        tpl.name.toLowerCase().includes(q) ||
        tpl.bodyText.toLowerCase().includes(q) ||
        (tpl.headerText && tpl.headerText.toLowerCase().includes(q));

      const matchesCat = categoryFilter === "ALL" || tpl.category === categoryFilter;
      const matchesStatus = statusFilter === "ALL" || tpl.status === statusFilter;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [templates, search, categoryFilter, statusFilter]);

  const activeTemplate =
    filteredTemplates.find((tpl) => tpl._id === selectedTemplate?._id) || filteredTemplates[0] || null;

  const activeVars = useMemo(() => {
    if (!activeTemplate?.bodyText) return [];
    const matches = activeTemplate.bodyText.match(/{{(\d+)}}/g) || [];
    const unique = Array.from(new Set(matches.map((m) => m.replace(/[{}]/g, ""))));
    return unique.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  }, [activeTemplate?.bodyText]);

  const interpolatedBody = useMemo(() => {
    if (!activeTemplate?.bodyText) return "";
    let rendered = activeTemplate.bodyText;
    activeVars.forEach((v) => {
      const val = sampleVars[v] || `[Variable {{${v}}}]`;
      rendered = rendered.replace(new RegExp(`{{${v}}}`, "g"), val);
    });
    return rendered;
  }, [activeTemplate?.bodyText, activeVars, sampleVars]);

  function handleCopyPayload(jsonStr: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(jsonStr);
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 1800);
    }
  }

  function handleLoadBlueprint(bp: TemplateBlueprint) {
    setNewName(bp.name);
    setNewCategory(bp.category);
    setNewHeaderType(bp.headerType);
    setNewHeaderText(bp.headerText);
    setNewBodyText(bp.bodyText);
    setNewFooterText(bp.footerText);
    setNewButtons(bp.buttons);
    setSampleVars((prev) => ({ ...prev, ...bp.defaultVars }));
    setShowBlueprintsModal(false);
    setShowCreateModal(true);
  }

  function handleDuplicateTemplate(tpl: WhatsAppTemplate) {
    setNewName(`${tpl.name}_copy`);
    setNewCategory(tpl.category);
    setNewHeaderType(tpl.headerType === "TEXT" ? "TEXT" : "NONE");
    setNewHeaderText(tpl.headerText || "");
    setNewBodyText(tpl.bodyText);
    setNewFooterText(tpl.footerText || "");
    setNewButtons(tpl.buttons ? [...tpl.buttons] : []);
    setShowCreateModal(true);
  }

  async function handleCreateTemplate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || !newBodyText.trim()) {
      setCreateError("Template name and body text are required.");
      return;
    }
    setCreating(true);
    setCreateError("");
    try {
      await whatsappApi.createTemplate({
        name: newName.trim().toLowerCase().replace(/\s+/g, "_"),
        category: newCategory,
        language: newLanguage,
        headerType: newHeaderType,
        headerText: newHeaderType === "TEXT" ? newHeaderText.trim() : undefined,
        bodyText: newBodyText.trim(),
        footerText: newFooterText.trim() || undefined,
        buttons: newButtons.filter((b) => b.text.trim()),
      });
      setShowCreateModal(false);
      setNewName("");
      onRefresh();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create template");
    } finally {
      setCreating(false);
    }
  }

  async function handleSendTestMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!testPhone.trim() || !activeTemplate) return;
    setSendingTest(true);
    setTestNotice(null);
    try {
      const header = activeTemplate.headerText ? `*${activeTemplate.headerText}*\n\n` : "";
      const footer = activeTemplate.footerText ? `\n\n_${activeTemplate.footerText}_` : "";
      const fullMessage = `${header}${interpolatedBody}${footer}`;

      const res = await whatsappApi.sendTestMessage(testPhone.trim(), fullMessage);
      setTestNotice({
        ok: true,
        msg: `Delivered! Message ID: ${res.messageId || "wamid.HBgLMTE4Nzc4..."}`,
      });
    } catch (err) {
      setTestNotice({ ok: false, msg: err instanceof Error ? err.message : "Delivery failed" });
    } finally {
      setSendingTest(false);
    }
  }

  async function handleDeleteTemplate(id: string) {
    if (!window.confirm("Delete this template from Meta Cloud API?")) return;
    try {
      await whatsappApi.deleteTemplate(id);
      if (selectedTemplate?._id === id) setSelectedTemplate(null);
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete template");
    }
  }

  const metaJsonPayload = useMemo(() => {
    if (!activeTemplate) return "";
    const components: unknown[] = [];

    if (activeTemplate.headerText) {
      components.push({
        type: "header",
        parameters: [{ type: "text", text: activeTemplate.headerText }],
      });
    }

    if (activeVars.length > 0) {
      components.push({
        type: "body",
        parameters: activeVars.map((v) => ({
          type: "text",
          text: sampleVars[v] || `Val_${v}`,
        })),
      });
    }

    return JSON.stringify(
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "+1234567890",
        type: "template",
        template: {
          name: activeTemplate.name,
          language: { code: activeTemplate.language || "en_US" },
          components,
        },
      },
      null,
      2,
    );
  }, [activeTemplate, activeVars, sampleVars]);

  return (
    <div className="whatsapp-templates space-y-4">
      {/* Compact Filter & Action Bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            aria-label="Search templates"
            className="h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[13px] text-[#171717] placeholder:text-[#71717a] focus:border-[#171717] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filter by category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-8 rounded-md border border-[#eaeaea] bg-white px-2.5 text-[12.5px] font-medium text-[#171717]"
          >
            <option value="ALL">All Categories ({templates.length})</option>
            <option value="UTILITY">Utility</option>
            <option value="MARKETING">Marketing</option>
            <option value="AUTHENTICATION">Authentication</option>
          </select>

          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 rounded-md border border-[#eaeaea] bg-white px-2.5 text-[12.5px] font-medium text-[#171717]"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {/* Sync from Meta WABA */}
          {isConnected && (
            <button
              type="button"
              onClick={async () => {
                try {
                  await whatsappApi.syncTemplates();
                  onRefresh();
                } catch (err) {
                  alert(err instanceof Error ? err.message : "Failed to sync templates from Meta");
                }
              }}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] font-medium text-[#171717] transition hover:bg-[#f4f4f5]"
            >
              <span>↻</span>
              <span className="hidden sm:inline">Sync Meta</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowBlueprintsModal(true)}
            className="inline-flex h-8 items-center rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] font-medium text-[#171717] transition hover:bg-[#f4f4f5]"
          >
            Blueprints
          </button>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex h-8 items-center rounded-md bg-[#171717] px-3 text-[12.5px] font-medium text-white transition hover:bg-black"
          >
            + New Template
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Left: Compact Templates List */}
        <div className="grid gap-2 min-w-0">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="m-0 text-[13px] font-semibold text-[#171717]">
              Templates <span className="ml-1 font-normal text-[#71717a]">{filteredTemplates.length}</span>
            </h2>
          </div>

          <div className="overflow-hidden rounded-lg border border-[#eaeaea] bg-white">
            {filteredTemplates.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <strong className="block text-[13px] font-semibold text-[#171717]">No templates found</strong>
                <p className="mt-1 text-[12px] text-[#71717a]">
                  No templates matched your filter or search query.
                </p>
                <div className="mt-3 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBlueprintsModal(true)}
                    className="inline-flex h-8 items-center rounded-md bg-[#171717] px-3 text-[12.5px] font-medium text-white"
                  >
                    Browse Blueprints
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-[#eaeaea]">
                {filteredTemplates.map((tpl) => {
                  const isSelected = activeTemplate?._id === tpl._id;
                  return (
                    <div
                      key={tpl._id}
                      onClick={() => setSelectedTemplate(tpl)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.target !== event.currentTarget) return;
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedTemplate(tpl);
                        }
                      }}
                      className={`flex min-h-[58px] cursor-pointer items-center justify-between gap-4 px-4 py-2.5 transition ${
                        isSelected ? "bg-[#fafafa]" : "hover:bg-[#fafafa]"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[13px] font-semibold text-[#171717]">
                            {tpl.name}
                          </span>
                          <span className="rounded border border-[#eaeaea] bg-[#fafafa] px-1.5 py-0.2 text-[10px] font-medium uppercase text-[#52525b]">
                            {tpl.category}
                          </span>
                          <span className="font-mono text-[11px] text-[#71717a]">
                            {tpl.language || "en_US"}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-[12px] text-[#71717a]">
                          {tpl.bodyText}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#eaeaea] bg-[#fafafa] px-2.5 py-0.5 text-[11px] font-medium text-[#171717]">
                          <span className={`size-1.5 rounded-full ${tpl.status === "APPROVED" ? "bg-[#171717]" : "bg-[#71717a]"}`} />
                          {tpl.status}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateTemplate(tpl);
                          }}
                          className="inline-flex h-7 items-center rounded-md border border-[#eaeaea] bg-white px-2 text-[11.5px] font-medium text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#171717]"
                        >
                          Clone
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            void handleDeleteTemplate(tpl._id);
                          }}
                          className="grid size-7 place-items-center rounded-md border border-transparent text-[#71717a] hover:border-[#eaeaea] hover:bg-white hover:text-[#171717]"
                          title="Delete Template"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Clean Template Preview & Payload Inspector */}
        <aside className="grid gap-3">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="m-0 text-[13px] font-semibold text-[#171717]">Preview</h2>
            <div className="flex rounded-md border border-[#eaeaea] bg-white p-0.5 text-[11px] font-medium">
              <button
                type="button"
                onClick={() => setStudioTab("preview")}
                className={`rounded px-2 py-0.5 transition ${
                  studioTab === "preview" ? "bg-[#171717] text-white" : "text-[#71717a] hover:text-[#171717]"
                }`}
              >
                Message
              </button>
              <button
                type="button"
                onClick={() => setStudioTab("payload")}
                className={`rounded px-2 py-0.5 transition ${
                  studioTab === "payload" ? "bg-[#171717] text-white" : "text-[#71717a] hover:text-[#171717]"
                }`}
              >
                JSON
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-[#eaeaea] bg-white p-4 space-y-3">
            {activeTemplate ? (
              studioTab === "preview" ? (
                <>
                  <div className="flex items-center justify-between border-b border-[#eaeaea] pb-2.5">
                    <span className="font-mono text-[12px] font-semibold text-[#171717]">
                      {activeTemplate.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowTestModal(true)}
                      className="inline-flex h-7 items-center rounded-md border border-[#eaeaea] bg-white px-2.5 text-[11.5px] font-medium text-[#171717] hover:bg-[#f4f4f5]"
                    >
                      Test Send
                    </button>
                  </div>

                  <div className="rounded-md border border-[#eaeaea] bg-[#fafafa] p-3.5 space-y-2 text-[12.5px] leading-relaxed">
                    {activeTemplate.headerText && (
                      <div className="font-semibold text-[#171717]">{activeTemplate.headerText}</div>
                    )}
                    <div className="whitespace-pre-line text-[#52525b]">{interpolatedBody}</div>
                    {activeTemplate.footerText && (
                      <div className="pt-1 text-[11px] text-[#71717a]">{activeTemplate.footerText}</div>
                    )}
                  </div>

                  {activeTemplate.buttons && activeTemplate.buttons.length > 0 && (
                    <div className="grid gap-1.5">
                      {activeTemplate.buttons.map((btn, i) => (
                        <div
                          key={i}
                          className="rounded-md border border-[#eaeaea] bg-white py-1.5 text-center text-[12px] font-medium text-[#171717]"
                        >
                          {btn.text}
                        </div>
                      ))}
                    </div>
                  )}

                  {activeVars.length > 0 && (
                    <div className="border-t border-[#eaeaea] pt-3 space-y-2">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#71717a]">
                        Sample Variables
                      </span>
                      {activeVars.map((v) => (
                        <div key={v} className="flex items-center gap-2">
                          <span className="w-10 font-mono text-[11px] text-[#71717a]">{`{{${v}}}`}</span>
                          <input
                            type="text"
                            value={sampleVars[v] || ""}
                            onChange={(e) => setSampleVars((prev) => ({ ...prev, [v]: e.target.value }))}
                            className="h-7 flex-1 rounded border border-[#eaeaea] bg-white px-2 text-[12px] text-[#171717]"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-[#71717a]">Meta Cloud API Payload</span>
                    <button
                      type="button"
                      onClick={() => handleCopyPayload(metaJsonPayload)}
                      className="rounded border border-[#eaeaea] bg-[#fafafa] px-2 py-0.5 text-[11px] font-medium text-[#171717]"
                    >
                      {copiedPayload ? "Copied" : "Copy JSON"}
                    </button>
                  </div>
                  <pre className="max-h-72 overflow-auto rounded-md border border-[#eaeaea] bg-[#fafafa] p-3 font-mono text-[11px] text-[#171717]">
                    {metaJsonPayload}
                  </pre>
                </div>
              )
            ) : (
              <div className="py-8 text-center text-[12px] text-[#71717a]">
                Select a template to inspect.
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-lg rounded-lg border border-[#eaeaea] bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#eaeaea] pb-3">
              <h3 className="m-0 text-[15px] font-semibold text-[#171717]">Create WhatsApp Template</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[#71717a] hover:text-[#171717]">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateTemplate} className="mt-4 space-y-3.5">
              {createError && (
                <div className="rounded-md border border-[#eaeaea] bg-[#fafafa] px-3 py-2 text-[12px] text-[#171717]">
                  {createError}
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[12px] font-medium text-[#171717]">Template Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="appointment_reminder"
                    className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 font-mono text-[12.5px] text-[#171717]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#171717]">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as typeof newCategory)}
                    className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-2.5 text-[12.5px] text-[#171717]"
                  >
                    <option value="UTILITY">UTILITY</option>
                    <option value="MARKETING">MARKETING</option>
                    <option value="AUTHENTICATION">AUTHENTICATION</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#171717]">Language</label>
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] text-[#171717]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#171717]">Header Text (Optional)</label>
                  <input
                    type="text"
                    value={newHeaderText}
                    onChange={(e) => {
                      setNewHeaderText(e.target.value);
                      setNewHeaderType(e.target.value.trim() ? "TEXT" : "NONE");
                    }}
                    className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] text-[#171717]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#171717]">Body Text</label>
                <textarea
                  rows={4}
                  required
                  value={newBodyText}
                  onChange={(e) => setNewBodyText(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[#eaeaea] bg-white p-3 text-[12.5px] text-[#171717]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#171717]">Footer Text (Optional)</label>
                <input
                  type="text"
                  value={newFooterText}
                  onChange={(e) => setNewFooterText(e.target.value)}
                  className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] text-[#171717]"
                />
              </div>
              <div className="flex justify-end gap-2 border-t border-[#eaeaea] pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="inline-flex h-8 items-center rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] font-medium text-[#52525b]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex h-8 items-center rounded-md bg-[#171717] px-3.5 text-[12.5px] font-medium text-white hover:bg-black disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blueprints Modal */}
      {showBlueprintsModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-xl rounded-lg border border-[#eaeaea] bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#eaeaea] pb-3">
              <h3 className="m-0 text-[15px] font-semibold text-[#171717]">Template Blueprints</h3>
              <button onClick={() => setShowBlueprintsModal(false)} className="text-[#71717a] hover:text-[#171717]">
                ✕
              </button>
            </div>
            <div className="mt-3 divide-y divide-[#eaeaea] max-h-96 overflow-y-auto">
              {TEMPLATE_BLUEPRINTS.map((bp) => (
                <div key={bp.name} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <strong className="font-mono text-[12.5px] text-[#171717]">{bp.name}</strong>
                      <span className="rounded border border-[#eaeaea] bg-[#fafafa] px-1.5 py-0.2 text-[10px] text-[#52525b]">
                        {bp.category}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[12px] text-[#71717a]">{bp.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleLoadBlueprint(bp)}
                    className="inline-flex h-7 shrink-0 items-center rounded-md bg-[#171717] px-2.5 text-[12px] font-medium text-white hover:bg-black"
                  >
                    Use Blueprint
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Test Send Modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-lg border border-[#eaeaea] bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#eaeaea] pb-3">
              <h3 className="m-0 text-[15px] font-semibold text-[#171717]">Send Test Template</h3>
              <button onClick={() => setShowTestModal(false)} className="text-[#71717a] hover:text-[#171717]">
                ✕
              </button>
            </div>
            <form onSubmit={handleSendTestMessage} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[12px] font-medium text-[#171717]">
                  Recipient Phone Number (with Country Code)
                </label>
                <input
                  type="tel"
                  required
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="e.g. 919876543210"
                  className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[13px] text-[#171717]"
                />
              </div>
              {testNotice && (
                <div className="rounded-md border border-[#eaeaea] bg-[#fafafa] px-3 py-2 text-[12px] text-[#171717]">
                  {testNotice.msg}
                </div>
              )}
              <div className="flex justify-end gap-2 border-t border-[#eaeaea] pt-3">
                <button
                  type="button"
                  onClick={() => setShowTestModal(false)}
                  className="inline-flex h-8 items-center rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] font-medium text-[#52525b]"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={sendingTest}
                  className="inline-flex h-8 items-center rounded-md bg-[#171717] px-3.5 text-[12.5px] font-medium text-white hover:bg-black disabled:opacity-50"
                >
                  {sendingTest ? "Sending..." : "Send Test"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
