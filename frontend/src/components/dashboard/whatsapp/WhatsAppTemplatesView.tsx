"use client";

import { useMemo, useState } from "react";
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
      "Hello {{1}}, your appointment with {{2}} is confirmed for {{3}} at {{4}}.\n\nLocation: {{5}}\nPlease arrive 10 minutes early.",
    footerText: "Reply RESCHEDULE if you need to change your slot",
    buttons: [
      { type: "QUICK_REPLY", text: "Confirm Attendance", value: "CONFIRM_APPT" },
      { type: "QUICK_REPLY", text: "Reschedule Slot", value: "RESCHEDULE_APPT" },
    ],
    description: "Booking confirmation with date, time, location, and 1-tap reply buttons.",
    defaultVars: {
      "1": "Sarah Jenkins",
      "2": "Dr. Miller",
      "3": "Thursday, Oct 24",
      "4": "10:30 AM",
      "5": "Suite 402",
    },
  },
  {
    name: "order_dispatched_tracking",
    category: "UTILITY",
    badge: "E-Commerce & Retail",
    headerType: "TEXT",
    headerText: "Your Order Has Shipped",
    bodyText:
      "Hi {{1}}, Order #{{2}} has shipped via {{3}}.\nEstimated delivery: {{4}}.\n\nTrack your package anytime using the button below.",
    footerText: "Thank you for shopping with us",
    buttons: [
      { type: "URL", text: "Track Package", value: "https://track.example.com/order/{{2}}" },
      { type: "QUICK_REPLY", text: "Talk to Support", value: "TALK_TO_SUPPORT" },
    ],
    description: "Order dispatch update with live tracking link and support button.",
    defaultVars: {
      "1": "Michael Chang",
      "2": "VZ-849201",
      "3": "Express Courier",
      "4": "Friday by 4:00 PM",
    },
  },
  {
    name: "support_case_opened_ack",
    category: "UTILITY",
    badge: "Support & SLA",
    headerType: "TEXT",
    headerText: "Support Ticket Opened",
    bodyText:
      "Hi {{1}}, we have created support case {{2}} for your request: {{3}}.\nOur specialist will update you within 30 minutes.",
    footerText: "Reply with your case number anytime to check status",
    buttons: [
      { type: "QUICK_REPLY", text: "Check Case Status", value: "CHECK_CASE" },
      { type: "QUICK_REPLY", text: "Request Callback", value: "REQUEST_CALLBACK" },
    ],
    description: "Automated ticket acknowledgement for Support Case SLA workflows.",
    defaultVars: {
      "1": "Aarav Patel",
      "2": "CASE-1042",
      "3": "Billing invoice update",
    },
  },
  {
    name: "razorpay_payment_link_checkout",
    category: "UTILITY",
    badge: "Payments & Billing",
    headerType: "TEXT",
    headerText: "Complete Your Booking",
    bodyText:
      "Hi {{1}}, your booking for {{2}} is ready.\nAmount due: {{3}}.\n\nComplete payment securely here: {{4}}",
    footerText: "Instant confirmation on WhatsApp once paid",
    buttons: [{ type: "QUICK_REPLY", text: "Need Help Paying", value: "PAYMENT_HELP" }],
    description: "Checkout link template for Razorpay + WhatsApp automated payment flows.",
    defaultVars: {
      "1": "Priya Nair",
      "2": "Consultation Session",
      "3": "INR 999",
      "4": "https://rzp.io/i/demo123",
    },
  },
  {
    name: "exclusive_flash_sale_vip",
    category: "MARKETING",
    badge: "Promotions & Sales",
    headerType: "TEXT",
    headerText: "Exclusive VIP Offer",
    bodyText:
      "Hi {{1}}! You have early access to our 48-hour flash sale.\n\nEnjoy {{2}}% off with code {{3}}. Offer ends {{4}}.",
    footerText: "Reply STOP to opt out of promotional messages",
    buttons: [
      { type: "URL", text: "Claim Discount", value: "https://shop.example.com/vip?code={{3}}" },
      { type: "QUICK_REPLY", text: "Browse Catalog", value: "VIEW_VIP_CATALOG" },
    ],
    description: "Promotional announcement with personalized coupon code and CTA URL.",
    defaultVars: {
      "1": "Emma Watson",
      "2": "30",
      "3": "VIPFLASH30",
      "4": "Sunday Midnight",
    },
  },
  {
    name: "two_factor_auth_security_otp",
    category: "AUTHENTICATION",
    badge: "Security & Login",
    headerType: "NONE",
    headerText: "",
    bodyText:
      "{{1}} is your verification code. Do not share this code with anyone. Valid for {{2}} minutes.",
    footerText: "If you did not request this code, ignore this message.",
    buttons: [{ type: "QUICK_REPLY", text: "Copy Code", value: "COPY_OTP" }],
    description: "One-time verification code template with expiry notice.",
    defaultVars: {
      "1": "849-210",
      "2": "5",
    },
  },
];

type CategoryFilter = "ALL" | "UTILITY" | "MARKETING" | "AUTHENTICATION";
type StatusFilter = "ALL" | "APPROVED" | "PENDING" | "REJECTED";

function extractVars(bodyText: string): string[] {
  if (!bodyText) return [];
  const matches = bodyText.match(/\{\{(\d+)\}\}/g) || [];
  const unique = Array.from(new Set(matches.map((m) => m.replace(/[{}]/g, ""))));
  return unique.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
}

export function WhatsAppTemplatesView({
  templates,
  onRefresh,
  isConnected,
}: WhatsAppTemplatesViewProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [syncingMeta, setSyncingMeta] = useState(false);

  // Modals
  const [inspectTemplateId, setInspectTemplateId] = useState<string>("");
  const [inspectTab, setInspectTab] = useState<"preview" | "payload">("preview");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBlueprintsModal, setShowBlueprintsModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);

  // Sample variables for preview & test send
  const [sampleVars, setSampleVars] = useState<Record<string, string>>({
    "1": "Alex Johnson",
    "2": "Dr. Sarah Miller",
    "3": "Tomorrow",
    "4": "10:30 AM",
    "5": "Suite 402",
  });
  const [copiedPayload, setCopiedPayload] = useState(false);

  // Create form state
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<"UTILITY" | "MARKETING" | "AUTHENTICATION">("UTILITY");
  const [newLanguage, setNewLanguage] = useState("en_US");
  const [newHeaderType, setNewHeaderType] = useState<"NONE" | "TEXT">("TEXT");
  const [newHeaderText, setNewHeaderText] = useState("Appointment Confirmed");
  const [newBodyText, setNewBodyText] = useState(
    "Hi {{1}}, your appointment with {{2}} is confirmed for {{3}} at {{4}}.",
  );
  const [newFooterText, setNewFooterText] = useState("Reply STOP to unsubscribe");
  const [newButtons, setNewButtons] = useState<WhatsAppTemplateButton[]>([
    { type: "QUICK_REPLY", text: "Confirm", value: "CONFIRM" },
  ]);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // Test send state
  const [testPhone, setTestPhone] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [testNotice, setTestNotice] = useState<{ ok: boolean; msg: string } | null>(null);

  const inspectedTemplate = useMemo(
    () => templates.find((t) => t._id === inspectTemplateId) || null,
    [templates, inspectTemplateId],
  );

  const filteredTemplates = useMemo(() => {
    const q = search.trim().toLowerCase();
    return templates.filter((tpl) => {
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

  const categoryCounts = useMemo(
    () => ({
      ALL: templates.length,
      UTILITY: templates.filter((t) => t.category === "UTILITY").length,
      MARKETING: templates.filter((t) => t.category === "MARKETING").length,
      AUTHENTICATION: templates.filter((t) => t.category === "AUTHENTICATION").length,
    }),
    [templates],
  );

  const statusCounts = useMemo(
    () => ({
      ALL: templates.length,
      APPROVED: templates.filter((t) => t.status === "APPROVED").length,
      PENDING: templates.filter((t) => t.status === "PENDING").length,
      REJECTED: templates.filter((t) => t.status === "REJECTED").length,
    }),
    [templates],
  );

  const activeVars = useMemo(
    () => extractVars(inspectedTemplate?.bodyText || ""),
    [inspectedTemplate?.bodyText],
  );

  const interpolatedInspectedBody = useMemo(() => {
    if (!inspectedTemplate?.bodyText) return "";
    let rendered = inspectedTemplate.bodyText;
    activeVars.forEach((v) => {
      rendered = rendered.replace(new RegExp(`\\{\\{${v}\\}\\}`, "g"), sampleVars[v] || `{{${v}}}`);
    });
    return rendered;
  }, [inspectedTemplate?.bodyText, activeVars, sampleVars]);

  const interpolatedCreateBody = useMemo(() => {
    let rendered = newBodyText || "";
    extractVars(rendered).forEach((v) => {
      rendered = rendered.replace(new RegExp(`\\{\\{${v}\\}\\}`, "g"), sampleVars[v] || `Sample ${v}`);
    });
    return rendered;
  }, [newBodyText, sampleVars]);

  const metaJsonPayload = useMemo(() => {
    if (!inspectedTemplate) return "";
    const components: unknown[] = [];
    if (inspectedTemplate.headerText) {
      components.push({
        type: "header",
        parameters: [{ type: "text", text: inspectedTemplate.headerText }],
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
        to: "+919876543210",
        type: "template",
        template: {
          name: inspectedTemplate.name,
          language: { code: inspectedTemplate.language || "en_US" },
          components,
        },
      },
      null,
      2,
    );
  }, [inspectedTemplate, activeVars, sampleVars]);

  function statusDotClass(status: string) {
    if (status === "APPROVED") return "bg-emerald-600";
    if (status === "PENDING") return "bg-amber-500";
    if (status === "REJECTED") return "bg-rose-600";
    return "bg-[#171717]";
  }

  function handleCopyPayload(jsonStr: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(jsonStr);
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
    setNewButtons(bp.buttons.map((b) => ({ ...b })));
    setSampleVars((prev) => ({ ...prev, ...bp.defaultVars }));
    setCreateError("");
    setShowBlueprintsModal(false);
    setShowCreateModal(true);
  }

  function handleDuplicateTemplate(tpl: WhatsAppTemplate) {
    setNewName(`${tpl.name}_copy`);
    setNewCategory(tpl.category);
    setNewLanguage(tpl.language || "en_US");
    setNewHeaderType(tpl.headerType === "TEXT" ? "TEXT" : "NONE");
    setNewHeaderText(tpl.headerText || "");
    setNewBodyText(tpl.bodyText);
    setNewFooterText(tpl.footerText || "");
    setNewButtons(tpl.buttons ? tpl.buttons.map((b) => ({ ...b })) : []);
    setCreateError("");
    setInspectTemplateId("");
    setShowCreateModal(true);
  }

  function insertNextVariable() {
    const existing = extractVars(newBodyText).map((v) => parseInt(v, 10));
    const nextNum = existing.length ? Math.max(...existing) + 1 : 1;
    setNewBodyText((prev) => `${prev}${prev && !prev.endsWith(" ") ? " " : ""}{{${nextNum}}}`);
  }

  function addButton() {
    if (newButtons.length >= 3) return;
    setNewButtons((prev) => [...prev, { type: "QUICK_REPLY", text: "", value: "" }]);
  }

  function updateButton(index: number, patch: Partial<WhatsAppTemplateButton>) {
    setNewButtons((prev) => prev.map((b, i) => (i === index ? { ...b, ...patch } : b)));
  }

  function removeButton(index: number) {
    setNewButtons((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSyncMeta() {
    setSyncingMeta(true);
    try {
      await whatsappApi.syncTemplates();
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to sync templates from Meta");
    } finally {
      setSyncingMeta(false);
    }
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
        name: newName
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9_]+/g, "_")
          .replace(/^_+|_+$/g, ""),
        category: newCategory,
        language: newLanguage.trim() || "en_US",
        headerType: newHeaderType,
        headerText: newHeaderType === "TEXT" ? newHeaderText.trim() : undefined,
        bodyText: newBodyText.trim(),
        footerText: newFooterText.trim() || undefined,
        buttons: newButtons
          .filter((b) => b.text.trim())
          .map((b) => ({
            type: b.type,
            text: b.text.trim(),
            value: b.value?.trim() || b.text.trim().toUpperCase().replace(/\s+/g, "_"),
          })),
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
    if (!testPhone.trim() || !inspectedTemplate) return;
    setSendingTest(true);
    setTestNotice(null);
    try {
      const header = inspectedTemplate.headerText ? `*${inspectedTemplate.headerText}*\n\n` : "";
      const footer = inspectedTemplate.footerText ? `\n\n_${inspectedTemplate.footerText}_` : "";
      const fullMessage = `${header}${interpolatedInspectedBody}${footer}`;
      const res = await whatsappApi.sendTestMessage(testPhone.trim(), fullMessage);
      setTestNotice({
        ok: true,
        msg: `Test sent via Meta Cloud API (${res.messageId || "confirmed"}).`,
      });
    } catch (err) {
      setTestNotice({ ok: false, msg: err instanceof Error ? err.message : "Delivery failed" });
    } finally {
      setSendingTest(false);
    }
  }

  async function handleDeleteTemplate(id: string, name: string) {
    if (!window.confirm(`Delete template "${name}"?`)) return;
    try {
      await whatsappApi.deleteTemplate(id);
      if (inspectTemplateId === id) setInspectTemplateId("");
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete template");
    }
  }

  return (
    <div className="whatsapp-templates space-y-4">
      {/* Compact Top Toolbar (matches Contact Groups & Campaigns) */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates by name, header, message..."
            aria-label="Search templates"
            className="h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[13px] text-[#171717] placeholder:text-[#71717a] focus:border-[#171717] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isConnected && (
            <button
              type="button"
              disabled={syncingMeta}
              onClick={() => void handleSyncMeta()}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] font-medium text-[#171717] transition hover:bg-[#f4f4f5] disabled:opacity-50"
            >
              <span>↻</span>
              <span>{syncingMeta ? "Syncing..." : "Sync Meta"}</span>
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
            onClick={() => {
              setCreateError("");
              setShowCreateModal(true);
            }}
            className="inline-flex h-8 items-center rounded-md bg-[#2563eb] px-3 text-[12.5px] font-medium text-white transition hover:bg-[#1d4ed8]"
          >
            + New Template
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout: Left Category/Status Sidebar + Right Templates Table */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Left Sidebar */}
        <aside className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between px-0.5">
              <h2 className="m-0 text-[13px] font-semibold text-[#171717]">
                Categories <span className="ml-1 font-normal text-[#71717a]">{templates.length}</span>
              </h2>
            </div>
            <div className="overflow-hidden rounded-lg border border-[#eaeaea] bg-white divide-y divide-[#eaeaea]">
              {(
                [
                  { id: "ALL", label: "All Templates" },
                  { id: "UTILITY", label: "Utility" },
                  { id: "MARKETING", label: "Marketing" },
                  { id: "AUTHENTICATION", label: "Authentication" },
                ] as const
              ).map((item) => {
                const isSelected = categoryFilter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategoryFilter(item.id)}
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
                      {categoryCounts[item.id]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between px-0.5">
              <h2 className="m-0 text-[13px] font-semibold text-[#171717]">Status</h2>
            </div>
            <div className="overflow-hidden rounded-lg border border-[#eaeaea] bg-white divide-y divide-[#eaeaea]">
              {(
                [
                  { id: "ALL", label: "All Statuses" },
                  { id: "APPROVED", label: "Approved" },
                  { id: "PENDING", label: "Pending" },
                  { id: "REJECTED", label: "Rejected" },
                ] as const
              ).map((item) => {
                const isSelected = statusFilter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStatusFilter(item.id)}
                    className={`flex w-full items-center justify-between px-3.5 py-2 text-left text-[12.5px] transition ${
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
        </aside>

        {/* Right: Clean Templates Table */}
        <div className="grid gap-2 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
            <h2 className="m-0 text-[13px] font-semibold text-[#171717]">
              Templates <span className="ml-1 font-normal text-[#71717a]">{filteredTemplates.length}</span>
            </h2>
            <div className="flex items-center gap-3 text-[11.5px] text-[#71717a] tabular-nums">
              <span>{statusCounts.APPROVED} approved</span>
              <span>·</span>
              <span>{statusCounts.PENDING} pending</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-[#eaeaea] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12.5px]">
                <thead className="border-b border-[#eaeaea] bg-[#fafafa] text-[11px] font-semibold uppercase tracking-[0.06em] text-[#71717a]">
                  <tr>
                    <th className="px-4 py-2.5">Template</th>
                    <th className="px-4 py-2.5">Category</th>
                    <th className="px-4 py-2.5">Structure</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaeaea]">
                  {filteredTemplates.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-[12.5px] text-[#71717a]">
                        No templates found. Start from{" "}
                        <button
                          type="button"
                          onClick={() => setShowBlueprintsModal(true)}
                          className="font-medium text-[#171717] underline"
                        >
                          Blueprints
                        </button>{" "}
                        or create a new template.
                      </td>
                    </tr>
                  ) : (
                    filteredTemplates.map((tpl) => {
                      const varCount = extractVars(tpl.bodyText).length;
                      const btnCount = tpl.buttons?.length || 0;
                      return (
                        <tr
                          key={tpl._id}
                          onClick={() => {
                            setInspectTemplateId(tpl._id);
                            setInspectTab("preview");
                          }}
                          className="cursor-pointer transition hover:bg-[#fafafa]"
                        >
                          <td className="px-4 py-2.5 max-w-md">
                            <strong className="block truncate font-mono text-[12.5px] font-medium text-[#171717]">
                              {tpl.name}
                            </strong>
                            <span className="mt-0.5 block truncate text-[11.5px] text-[#71717a]">
                              {tpl.bodyText}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 whitespace-nowrap">
                            <span className="rounded border border-[#eaeaea] bg-[#fafafa] px-1.5 py-0.2 text-[10.5px] font-medium text-[#52525b]">
                              {tpl.category}
                            </span>
                            <span className="ml-1.5 font-mono text-[11px] text-[#71717a]">
                              {tpl.language || "en_US"}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 whitespace-nowrap text-[11.5px] text-[#52525b] tabular-nums">
                            {varCount > 0 ? `${varCount} var${varCount === 1 ? "" : "s"}` : "Static"}
                            {btnCount > 0 ? ` · ${btnCount} btn${btnCount === 1 ? "" : "s"}` : ""}
                            {tpl.headerText ? " · Header" : ""}
                          </td>
                          <td className="px-4 py-2.5 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#eaeaea] bg-[#fafafa] px-2 py-0.5 text-[11px] font-medium text-[#171717]">
                              <span className={`size-1.5 rounded-full ${statusDotClass(tpl.status)}`} />
                              {tpl.status}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setInspectTemplateId(tpl._id);
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
                                  void handleDeleteTemplate(tpl._id, tpl.name);
                                }}
                                className="grid size-7 place-items-center rounded-md border border-transparent text-[#71717a] hover:border-[#eaeaea] hover:bg-white hover:text-[#171717]"
                                title="Delete template"
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

      {/* Create Template Modal (Structured Sections + Live Preview) */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-[2px]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowCreateModal(false);
          }}
        >
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg border border-[#eaeaea] bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#eaeaea] pb-3">
              <div>
                <h3 className="m-0 text-[15px] font-semibold text-[#171717]">Create WhatsApp Template</h3>
                <p className="m-0 mt-0.5 text-[12px] text-[#71717a]">
                  Configure header, message body, footer, and interactive buttons.
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

            <form onSubmit={handleCreateTemplate} className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-[1.35fr_1fr]">
              <div className="space-y-4">
                {createError && (
                  <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] text-rose-800">
                    {createError}
                  </div>
                )}

                {/* Section 1: Template Identity */}
                <div className="space-y-2.5 rounded-md border border-[#eaeaea] bg-[#fafafa] p-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#71717a]">
                    1. Details
                  </div>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-[12px] font-medium text-[#171717]">Template Name</label>
                      <input
                        type="text"
                        required
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="appointment_reminder_v1"
                        className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 font-mono text-[12.5px] text-[#171717] focus:border-[#171717] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-[#171717]">Category</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as typeof newCategory)}
                        className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-2.5 text-[12.5px] text-[#171717]"
                      >
                        <option value="UTILITY">Utility</option>
                        <option value="MARKETING">Marketing</option>
                        <option value="AUTHENTICATION">Authentication</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-[#171717]">Language</label>
                      <input
                        type="text"
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        placeholder="en_US"
                        className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 font-mono text-[12.5px] text-[#171717]"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Header & Body */}
                <div className="space-y-2.5 rounded-md border border-[#eaeaea] bg-[#fafafa] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#71717a]">
                      2. Message Content
                    </span>
                    <button
                      type="button"
                      onClick={insertNextVariable}
                      className="rounded border border-[#bfdbfe] bg-[#eff6ff] px-2 py-0.5 font-mono text-[11px] font-medium text-[#1d4ed8] hover:bg-[#dbeafe]"
                    >
                      + Add Variable
                    </button>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-[#171717]">Header (Optional)</label>
                    <input
                      type="text"
                      value={newHeaderText}
                      onChange={(e) => {
                        setNewHeaderText(e.target.value);
                        setNewHeaderType(e.target.value.trim() ? "TEXT" : "NONE");
                      }}
                      placeholder="e.g. Appointment Confirmed"
                      className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] text-[#171717]"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-[#171717]">Body Text</label>
                    <textarea
                      rows={4}
                      required
                      value={newBodyText}
                      onChange={(e) => setNewBodyText(e.target.value)}
                      placeholder="Hi {{1}}, your booking is confirmed for {{2}}."
                      className="mt-1 w-full rounded-md border border-[#eaeaea] bg-white p-2.5 text-[12.5px] text-[#171717] focus:border-[#171717] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-[#171717]">Footer (Optional)</label>
                    <input
                      type="text"
                      value={newFooterText}
                      onChange={(e) => setNewFooterText(e.target.value)}
                      placeholder="e.g. Reply STOP to unsubscribe"
                      className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] text-[#171717]"
                    />
                  </div>
                </div>

                {/* Section 3: Interactive Buttons */}
                <div className="space-y-2.5 rounded-md border border-[#eaeaea] bg-[#fafafa] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#71717a]">
                      3. Buttons ({newButtons.length}/3)
                    </span>
                    <button
                      type="button"
                      disabled={newButtons.length >= 3}
                      onClick={addButton}
                      className="rounded border border-[#bfdbfe] bg-[#eff6ff] px-2 py-0.5 text-[11px] font-medium text-[#1d4ed8] hover:bg-[#dbeafe] disabled:opacity-40"
                    >
                      + Add Button
                    </button>
                  </div>

                  {newButtons.length === 0 ? (
                    <p className="m-0 text-[11.5px] text-[#71717a]">No interactive buttons added.</p>
                  ) : (
                    <div className="space-y-2">
                      {newButtons.map((btn, idx) => (
                        <div key={idx} className="grid grid-cols-[110px_1fr_auto] gap-1.5 items-center">
                          <select
                            value={btn.type}
                            onChange={(e) =>
                              updateButton(idx, { type: e.target.value as WhatsAppTemplateButton["type"] })
                            }
                            className="h-8 rounded border border-[#eaeaea] bg-white px-2 text-[11.5px] text-[#171717]"
                          >
                            <option value="QUICK_REPLY">Quick Reply</option>
                            <option value="URL">Website URL</option>
                            <option value="PHONE_NUMBER">Call Phone</option>
                          </select>
                          <input
                            type="text"
                            value={btn.text}
                            onChange={(e) => updateButton(idx, { text: e.target.value })}
                            placeholder="Button label (max 25 chars)"
                            maxLength={25}
                            className="h-8 rounded border border-[#eaeaea] bg-white px-2.5 text-[12px] text-[#171717]"
                          />
                          <button
                            type="button"
                            onClick={() => removeButton(idx)}
                            className="grid size-8 place-items-center rounded border border-[#eaeaea] bg-white text-[11px] text-[#71717a] hover:text-[#171717]"
                            title="Remove button"
                          >
                            ✕
                          </button>
                          {btn.type !== "QUICK_REPLY" && (
                            <input
                              type="text"
                              value={btn.value || ""}
                              onChange={(e) => updateButton(idx, { value: e.target.value })}
                              placeholder={btn.type === "URL" ? "https://your-site.com" : "+919876543210"}
                              className="col-span-3 h-8 rounded border border-[#eaeaea] bg-white px-2.5 font-mono text-[11.5px] text-[#171717]"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Live Message Preview */}
              <div className="flex flex-col justify-between rounded-lg border border-[#eaeaea] bg-[#fafafa] p-3.5">
                <div>
                  <div className="flex items-center justify-between border-b border-[#eaeaea] pb-2">
                    <span className="text-[11.5px] font-semibold text-[#171717]">Live Preview</span>
                    <span className="rounded border border-[#eaeaea] bg-white px-1.5 py-0.2 text-[10px] font-medium text-[#52525b]">
                      {newCategory}
                    </span>
                  </div>

                  <div className="mt-3 rounded-lg border border-[#eaeaea] bg-white p-3.5 space-y-2">
                    {newHeaderType === "TEXT" && newHeaderText.trim() && (
                      <div className="border-b border-[#f4f4f5] pb-1 text-[12.5px] font-semibold text-[#171717]">
                        {newHeaderText}
                      </div>
                    )}
                    <div className="whitespace-pre-line text-[12.5px] leading-relaxed text-[#171717]">
                      {interpolatedCreateBody || "Start typing your message body..."}
                    </div>
                    {newFooterText.trim() && (
                      <div className="text-[11px] text-[#71717a]">{newFooterText}</div>
                    )}
                    {newButtons.filter((b) => b.text.trim()).length > 0 && (
                      <div className="grid gap-1.5 border-t border-[#f4f4f5] pt-2">
                        {newButtons
                          .filter((b) => b.text.trim())
                          .map((btn, i) => (
                            <div
                              key={i}
                              className="rounded border border-[#eaeaea] bg-[#fafafa] py-1 text-center text-[11.5px] font-medium text-[#171717]"
                            >
                              {btn.type === "URL" ? "↗ " : btn.type === "PHONE_NUMBER" ? "☎ " : ""}
                              {btn.text}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 border-t border-[#eaeaea] pt-2.5 text-[11px] text-[#71717a]">
                  Meta name:{" "}
                  <span className="font-mono text-[#171717]">
                    {newName
                      .trim()
                      .toLowerCase()
                      .replace(/[^a-z0-9_]+/g, "_")
                      .replace(/^_+|_+$/g, "") || "template_name"}
                  </span>
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
                  disabled={creating}
                  className="inline-flex h-8 items-center rounded-md bg-[#2563eb] px-3.5 text-[12.5px] font-medium text-white hover:bg-[#1d4ed8] disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Template Inspector Modal (Preview + Variables + Meta JSON) */}
      {inspectedTemplate && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-[2px]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setInspectTemplateId("");
          }}
        >
          <div className="w-full max-w-lg rounded-lg border border-[#eaeaea] bg-white p-5 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-[#eaeaea] pb-3">
              <div className="min-w-0">
                <h3 className="m-0 truncate font-mono text-[14.5px] font-semibold text-[#171717]">
                  {inspectedTemplate.name}
                </h3>
                <p className="m-0 mt-0.5 text-[12px] text-[#71717a]">
                  {inspectedTemplate.category} · {inspectedTemplate.language || "en_US"} · {inspectedTemplate.status}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInspectTemplateId("")}
                className="text-[#71717a] hover:text-[#171717]"
              >
                ✕
              </button>
            </div>

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
                onClick={() => setInspectTab("payload")}
                className={`flex-1 rounded py-1.5 text-[12px] font-medium transition ${
                  inspectTab === "payload"
                    ? "bg-white text-[#171717] shadow-2xs"
                    : "text-[#71717a] hover:text-[#171717]"
                }`}
              >
                Meta API JSON
              </button>
            </div>

            {inspectTab === "preview" ? (
              <div className="mt-4 space-y-3.5">
                <div className="rounded-lg border border-[#eaeaea] bg-[#fafafa] p-3.5">
                  <div className="rounded-md border border-[#eaeaea] bg-white p-3.5 space-y-2 text-[12.5px] leading-relaxed">
                    {inspectedTemplate.headerText && (
                      <div className="font-semibold text-[#171717] border-b border-[#f4f4f5] pb-1">
                        {inspectedTemplate.headerText}
                      </div>
                    )}
                    <div className="whitespace-pre-line text-[#171717]">{interpolatedInspectedBody}</div>
                    {inspectedTemplate.footerText && (
                      <div className="text-[11px] text-[#71717a]">{inspectedTemplate.footerText}</div>
                    )}
                    {inspectedTemplate.buttons && inspectedTemplate.buttons.length > 0 && (
                      <div className="grid gap-1.5 border-t border-[#f4f4f5] pt-2">
                        {inspectedTemplate.buttons.map((btn, i) => (
                          <div
                            key={i}
                            className="rounded border border-[#eaeaea] bg-[#fafafa] py-1 text-center text-[11.5px] font-medium text-[#171717]"
                          >
                            {btn.text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {activeVars.length > 0 && (
                  <div className="space-y-2 rounded-md border border-[#eaeaea] bg-[#fafafa] p-3">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#71717a]">
                      Sample Variables
                    </span>
                    <div className="grid gap-2 sm:grid-cols-2">
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
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] text-[#71717a]">Meta Cloud API Request Body</span>
                  <button
                    type="button"
                    onClick={() => handleCopyPayload(metaJsonPayload)}
                    className="rounded border border-[#eaeaea] bg-[#fafafa] px-2.5 py-0.5 text-[11.5px] font-medium text-[#171717]"
                  >
                    {copiedPayload ? "Copied" : "Copy JSON"}
                  </button>
                </div>
                <pre className="max-h-72 overflow-auto rounded-md border border-[#eaeaea] bg-[#fafafa] p-3 font-mono text-[11px] text-[#171717]">
                  {metaJsonPayload}
                </pre>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-[#eaeaea] pt-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTestNotice(null);
                    setShowTestModal(true);
                  }}
                  className="inline-flex h-8 items-center rounded-md border border-[#eaeaea] bg-white px-3 text-[12px] font-medium text-[#171717] hover:bg-[#f4f4f5]"
                >
                  Test Send
                </button>
                <button
                  type="button"
                  onClick={() => handleDuplicateTemplate(inspectedTemplate)}
                  className="inline-flex h-8 items-center rounded-md border border-[#eaeaea] bg-white px-3 text-[12px] font-medium text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#171717]"
                >
                  Clone
                </button>
              </div>
              <button
                type="button"
                onClick={() => setInspectTemplateId("")}
                className="inline-flex h-8 items-center rounded-md bg-[#171717] px-3.5 text-[12px] font-medium text-white hover:bg-black"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blueprints Modal */}
      {showBlueprintsModal && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-[2px]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowBlueprintsModal(false);
          }}
        >
          <div className="w-full max-w-xl rounded-lg border border-[#eaeaea] bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#eaeaea] pb-3">
              <div>
                <h3 className="m-0 text-[15px] font-semibold text-[#171717]">Template Blueprints</h3>
                <p className="m-0 mt-0.5 text-[12px] text-[#71717a]">
                  Pre-built templates ready for Voice AI, Payments, Support Cases, and Campaigns.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBlueprintsModal(false)}
                className="text-[#71717a] hover:text-[#171717]"
              >
                ✕
              </button>
            </div>
            <div className="mt-3 divide-y divide-[#eaeaea] max-h-96 overflow-y-auto">
              {TEMPLATE_BLUEPRINTS.map((bp) => (
                <div key={bp.name} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <strong className="font-mono text-[12.5px] text-[#171717]">{bp.name}</strong>
                      <span className="rounded border border-[#eaeaea] bg-[#fafafa] px-1.5 py-0.2 text-[10px] text-[#52525b]">
                        {bp.category}
                      </span>
                      <span className="text-[11px] text-[#71717a]">{bp.badge}</span>
                    </div>
                    <p className="mt-0.5 text-[12px] text-[#71717a]">{bp.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleLoadBlueprint(bp)}
                    className="inline-flex h-7 shrink-0 items-center rounded-md bg-[#2563eb] px-2.5 text-[12px] font-medium text-white hover:bg-[#1d4ed8]"
                  >
                    Use
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Test Send Modal */}
      {showTestModal && inspectedTemplate && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-[2px]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowTestModal(false);
              setTestNotice(null);
            }
          }}
        >
          <div className="w-full max-w-md rounded-lg border border-[#eaeaea] bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#eaeaea] pb-3">
              <h3 className="m-0 text-[15px] font-semibold text-[#171717]">Send Test Template</h3>
              <button
                type="button"
                onClick={() => {
                  setShowTestModal(false);
                  setTestNotice(null);
                }}
                className="text-[#71717a] hover:text-[#171717]"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSendTestMessage} className="mt-4 space-y-3.5">
              <p className="m-0 text-[12px] text-[#71717a]">
                Send a test using <strong className="font-mono text-[#171717]">{inspectedTemplate.name}</strong> via
                Meta Cloud API.
              </p>
              <div>
                <label className="block text-[12px] font-medium text-[#171717]">
                  Phone Number (with country code)
                </label>
                <input
                  type="tel"
                  required
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="e.g. +919876543210"
                  className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[13px] text-[#171717] focus:border-[#171717] focus:outline-none"
                />
              </div>
              {testNotice && (
                <div
                  className={`rounded-md border px-3 py-2 text-[12px] ${
                    testNotice.ok
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-rose-200 bg-rose-50 text-rose-800"
                  }`}
                >
                  {testNotice.msg}
                </div>
              )}
              <div className="flex justify-end gap-2 border-t border-[#eaeaea] pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowTestModal(false);
                    setTestNotice(null);
                  }}
                  className="inline-flex h-8 items-center rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] font-medium text-[#52525b]"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={sendingTest}
                  className="inline-flex h-8 items-center rounded-md bg-[#2563eb] px-3.5 text-[12.5px] font-medium text-white hover:bg-[#1d4ed8] disabled:opacity-50"
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
