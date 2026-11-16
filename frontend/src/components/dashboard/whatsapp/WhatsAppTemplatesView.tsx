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

// Enterprise Pre-Approved Blueprints
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
      "Hello {{1}}, your appointment with {{2}} is confirmed for {{3}} at {{4}}.\n\n📍 Location: {{5}}\nPlease arrive 10 minutes early with your photo ID.",
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
    headerText: "Your Package is on the Way 📦",
    bodyText:
      "Great news {{1}}! Order #{{2}} has shipped via {{3}}.\nEstimated delivery date: {{4}}.\n\nTrack your package in real-time using the button below.",
    footerText: "Thank you for shopping with Vozo Store",
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
    headerText: "⚡ Exclusive VIP Flash Sale",
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
      "{{1}} is your Vozo verification code. For your security, do not share this code with anyone. Valid for {{2}} minutes.",
    footerText: "If you did not request this code, contact security immediately.",
    buttons: [
      { type: "QUICK_REPLY", text: "Copy Code", value: "COPY_OTP" },
    ],
    description: "Zero-latency two-factor authentication OTP delivery with security expiry notice.",
    defaultVars: {
      "1": "849-210",
      "2": "5",
    },
  },
  {
    name: "abandoned_cart_reminder",
    category: "MARKETING",
    badge: "Conversion Recovery",
    headerType: "TEXT",
    headerText: "Did you forget something?",
    bodyText:
      "Hi {{1}}, you left items waiting in your cart! Complete your order today and we will include free express shipping worth {{2}}.\n\nUse voucher {{3}} at checkout.",
    footerText: "Reply HELP if you had any issues during checkout",
    buttons: [
      { type: "URL", text: "Complete Checkout", value: "https://shop.example.com/cart" },
      { type: "QUICK_REPLY", text: "Chat with Stylist", value: "CHAT_STYLIST" },
    ],
    description: "Recovers abandoned shopping carts with an incentive voucher and direct checkout URL.",
    defaultVars: {
      "1": "David Miller",
      "2": "$14.99",
      "3": "FREESHIP-NOW",
    },
  },
  {
    name: "post_service_satisfaction_survey",
    category: "UTILITY",
    badge: "Customer Retention",
    headerType: "TEXT",
    headerText: "How did we do today?",
    bodyText:
      "Hi {{1}}, thanks for trusting {{2}} with your recent {{3}}.\n\nWe would love to know how your experience was today. Please tap an option below to leave your rating:",
    footerText: "Takes less than 10 seconds to respond",
    buttons: [
      { type: "QUICK_REPLY", text: "⭐⭐⭐⭐⭐ Outstanding", value: "RATING_5" },
      { type: "QUICK_REPLY", text: "👍 Good", value: "RATING_4" },
      { type: "QUICK_REPLY", text: "💬 Needs Improvement", value: "RATING_POOR" },
    ],
    description: "Post-consultation customer satisfaction poll with 1-tap feedback quick replies.",
    defaultVars: {
      "1": "Chloe Davis",
      "2": "Apex Auto Care",
      "3": "Comprehensive Annual Inspection",
    },
  },
];

export function WhatsAppTemplatesView({
  templates,
  onRefresh,
  isConnected,
}: WhatsAppTemplatesViewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate | null>(
    templates[0] || null,
  );

  useEffect(() => {
    if (!selectedTemplate && templates.length > 0) {
      setSelectedTemplate(templates[0]);
    } else if (selectedTemplate && templates.length > 0) {
      const refreshed = templates.find((t) => t._id === selectedTemplate._id);
      if (refreshed) setSelectedTemplate(refreshed);
    }
  }, [templates, selectedTemplate]);

  // Filters & Views
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [studioTab, setStudioTab] = useState<"preview" | "payload" | "compliance">("preview");

  // Modals & Drawers
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBlueprintsModal, setShowBlueprintsModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);

  // Variable Playground State
  const [sampleVars, setSampleVars] = useState<Record<string, string>>({
    "1": "Alex Johnson",
    "2": "Dr. Sarah Miller",
    "3": "Tomorrow",
    "4": "10:30 AM",
    "5": "Metropolitan Medical Center",
  });

  // Copy Feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);

  // Create Template Form State
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<"UTILITY" | "MARKETING" | "AUTHENTICATION">("UTILITY");
  const [newLanguage, setNewLanguage] = useState("en_US");
  const [newHeaderType, setNewHeaderType] = useState<"NONE" | "TEXT">("TEXT");
  const [newHeaderText, setNewHeaderText] = useState("Appointment Confirmed");
  const [newBodyText, setNewBodyText] = useState(
    "Hi {{1}}, your appointment with {{2}} is confirmed for {{3}} at {{4}}.\n📍 Location: {{5}}",
  );
  const [newFooterText, setNewFooterText] = useState("Reply STOP to unsubscribe");
  const [newButtons, setNewButtons] = useState<WhatsAppTemplateButton[]>([
    { type: "QUICK_REPLY", text: "Confirm", value: "CONFIRM" },
    { type: "QUICK_REPLY", text: "Reschedule", value: "RESCHEDULE" },
  ]);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // Test Modal State
  const [testPhone, setTestPhone] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [testNotice, setTestNotice] = useState<{ ok: boolean; msg: string } | null>(null);

  // Filter templates
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

  const activeTemplate = filteredTemplates.find((tpl) => tpl._id === selectedTemplate?._id) || filteredTemplates[0] || null;

  // Extract variables ({{1}}, {{2}}, etc.) from the active template body
  const activeVars = useMemo(() => {
    if (!activeTemplate?.bodyText) return [];
    const matches = activeTemplate.bodyText.match(/{{(\d+)}}/g) || [];
    const unique = Array.from(new Set(matches.map((m) => m.replace(/[{}]/g, ""))));
    return unique.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  }, [activeTemplate?.bodyText]);

  // Interpolated Body Text for Live Preview
  const interpolatedBody = useMemo(() => {
    if (!activeTemplate?.bodyText) return "";
    let rendered = activeTemplate.bodyText;
    activeVars.forEach((v) => {
      const val = sampleVars[v] || `[Variable {{${v}}}]`;
      rendered = rendered.replace(new RegExp(`{{${v}}}`, "g"), val);
    });
    return rendered;
  }, [activeTemplate?.bodyText, activeVars, sampleVars]);

  // Copy template name / slug
  function handleCopyName(name: string, id: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(name);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    }
  }

  // Copy API Payload
  function handleCopyPayload(jsonStr: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(jsonStr);
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 1800);
    }
  }

  // Load blueprint into create modal
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

  // Duplicate an existing template
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

  // Handle Create Template
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

  // Handle Send Test Message
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

  // Delete Template
  async function handleDeleteTemplate(id: string) {
    if (!window.confirm("Are you sure you want to delete this template from Meta Cloud API?")) return;
    try {
      await whatsappApi.deleteTemplate(id);
      if (selectedTemplate?._id === id) setSelectedTemplate(null);
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete template");
    }
  }

  // Computed Metrics
  const metrics = useMemo(() => {
    const total = templates.length;
    const approved = templates.filter((t) => t.status === "APPROVED").length;
    const utility = templates.filter((t) => t.category === "UTILITY").length;
    const marketing = templates.filter((t) => t.category === "MARKETING").length;
    return { total, approved, utility, marketing };
  }, [templates]);

  // Meta API Payload representation
  const metaJsonPayload = useMemo(() => {
    if (!activeTemplate) return "";
    const components: any[] = [];

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

    if (activeTemplate.buttons && activeTemplate.buttons.length > 0) {
      activeTemplate.buttons.forEach((btn, idx) => {
        if (btn.type === "QUICK_REPLY") {
          components.push({
            type: "button",
            sub_type: "quick_reply",
            index: String(idx),
            parameters: [{ type: "payload", payload: btn.value || btn.text }],
          });
        } else if (btn.type === "URL") {
          components.push({
            type: "button",
            sub_type: "url",
            index: String(idx),
            parameters: [{ type: "text", text: btn.value || "https://example.com" }],
          });
        }
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
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dfe7e4] bg-white p-4">
        {/* Left: Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "ALL", label: "All" },
            { id: "UTILITY", label: "Utility", count: metrics.utility },
            { id: "MARKETING", label: "Marketing", count: metrics.marketing },
            { id: "AUTHENTICATION", label: "Authentication" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                categoryFilter === cat.id
                  ? "bg-[#118778] text-white shadow-2xs"
                  : "bg-[#f4f7f6] text-[#52645f] hover:bg-[#e9f0ee] hover:text-[#14231f]"
              }`}
            >
              <span>{cat.label}</span>
              {typeof cat.count === "number" && (
                <span
                  className={`rounded-md px-1.5 py-0.2 text-[10px] font-semibold ${
                    categoryFilter === cat.id ? "bg-white/20 text-white" : "bg-[#dfe8e5] text-[#52645f]"
                  }`}
                >
                  {cat.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Right: Search, View Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          {/* Search Box */}
          <div className="relative min-w-[200px] flex-1 sm:w-56">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              aria-label="Search templates"
              className="w-full rounded-xl border border-[#c6d4d0] bg-[#f9fbfa] px-3.5 py-1.5 text-xs text-[#14231f] placeholder-[#84938f] focus:border-[#118778] focus:bg-white focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#84938f] hover:text-[#14231f]"
              >
                ✕
              </button>
            )}
          </div>

          <select aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 rounded-xl border border-[#c6d4d0] bg-white px-2 text-xs text-[#52645f] focus:border-[#118778] focus:outline-none">
            <option value="ALL">All statuses</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {/* View Mode Switcher (Cards vs Table) */}
          <div className="flex items-center rounded-xl border border-[#c6d4d0] bg-[#f9fbfa] p-0.5">
            <button
              type="button"
              title="Cards Grid View"
              aria-label="Card view"
              aria-pressed={viewMode === "cards"}
              onClick={() => setViewMode("cards")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                viewMode === "cards" ? "bg-white text-[#118778] shadow-2xs" : "text-[#71817d] hover:text-[#14231f]"
              }`}
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </button>
            <button
              type="button"
              title="Data Table View"
              aria-label="Table view"
              aria-pressed={viewMode === "table"}
              onClick={() => setViewMode("table")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                viewMode === "table" ? "bg-white text-[#118778] shadow-2xs" : "text-[#71817d] hover:text-[#14231f]"
              }`}
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Blueprints Library CTA */}
          <button
            type="button"
            onClick={() => setShowBlueprintsModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#b8cfc8] bg-white px-3 py-1.5 text-xs font-bold text-[#14231f] hover:border-[#118778] hover:bg-[#f0f8f5] transition"
          >
            <span>✨</span>
            <span className="hidden sm:inline">Examples</span>
          </button>

          {/* Primary Create Button */}
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#118778] to-[#0d6e62] px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:opacity-95 transition"
          >
            <span className="text-sm">＋</span>
            <span>New template</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE: TEMPLATE SELECTION (LEFT) & LIVE STUDIO (RIGHT) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* LEFT COLUMN: TEMPLATES DIRECTORY (7 cols) */}
        <div className="space-y-3 lg:col-span-7">
          {filteredTemplates.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#dfe7e4] bg-white p-12 text-center shadow-2xs">
              <span className="grid size-12 mx-auto place-items-center rounded-2xl bg-[#f0f7f5] text-2xl">
                📑
              </span>
              <h3 className="mt-3 text-sm font-bold text-[#14231f]">No WhatsApp templates found</h3>
              <p className="mt-1 text-xs text-[#71817d]">
                No templates matched your filter or search query.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("ALL");
                    setStatusFilter("ALL");
                  }}
                  className="rounded-xl border border-[#dfe7e4] px-3.5 py-1.5 text-xs font-bold text-[#52645f] hover:bg-[#f6f9f8]"
                >
                  Clear Filters
                </button>
                <button
                  type="button"
                  onClick={() => setShowBlueprintsModal(true)}
                  className="rounded-xl bg-[#118778] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#0d6e62]"
                >
                  Browse Ready Blueprints
                </button>
              </div>
            </div>
          ) : viewMode === "cards" ? (
            /* CARDS GRID VIEW */
            filteredTemplates.map((tpl) => {
              const isSelected = activeTemplate?._id === tpl._id;
              const hasButtons = tpl.buttons && tpl.buttons.length > 0;
              const categoryColor =
                tpl.category === "UTILITY"
                  ? "bg-sky-50 text-sky-800 border-sky-200"
                  : tpl.category === "MARKETING"
                    ? "bg-purple-50 text-purple-800 border-purple-200"
                    : "bg-amber-50 text-amber-800 border-amber-200";

              return (
                <div
                  key={tpl._id}
                  onClick={() => setSelectedTemplate(tpl)}
                  onKeyDown={(event) => {
                    if (event.target !== event.currentTarget) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedTemplate(tpl);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`Preview ${tpl.name}`}
                  className={`group relative cursor-pointer rounded-2xl border p-4 transition duration-150 ${
                    isSelected
                      ? "border-[#118778] bg-[#f2faf7] shadow-sm ring-2 ring-[#118778]/20"
                      : "border-[#dfe7e4] bg-white hover:border-[#b8cfc8] hover:bg-[#fafcfb] shadow-2xs"
                  }`}
                >
                  {/* Top Bar: Name, Category, Language, Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#14231f]">
                          {tpl.name}
                        </span>
                        <span className={`rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${categoryColor}`}>
                          {tpl.category}
                        </span>
                        <span className="rounded-md bg-[#edf2f0] px-1.5 py-0.5 text-[9px] font-mono font-medium text-[#52645f]">
                          {tpl.language || "en_US"}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 ring-1 ring-emerald-600/20">
                          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {tpl.status}
                        </span>
                      </div>

                      {/* Header Text Preview */}
                      {tpl.headerText && (
                        <p className="mt-1.5 text-xs font-bold text-[#14231f]">
                          {tpl.headerText}
                        </p>
                      )}

                      {/* Message Body Snippet */}
                      <p className="mt-1 line-clamp-2 whitespace-pre-line text-xs text-[#52645f] leading-relaxed">
                        {tpl.bodyText}
                      </p>

                      {/* Interactive Buttons Preview Tags */}
                      {hasButtons && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {tpl.buttons.map((btn, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#cde0dc] bg-white px-2 py-0.5 text-[10px] font-bold text-[#118778] shadow-3xs"
                            >
                              <span>{btn.type === "URL" ? "🔗" : "⚡"}</span>
                              <span>{btn.text}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Action Icons */}
                    <div className="flex items-center gap-1">
                      {/* Copy slug */}
                      <button
                        type="button"
                        title="Copy template name"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyName(tpl.name, tpl._id);
                        }}
                        className="rounded-lg p-1.5 text-[#84938f] hover:bg-[#edf7f4] hover:text-[#118778] transition"
                      >
                        {copiedId === tpl._id ? (
                          <span className="text-[10px] font-bold text-[#118778]">Copied!</span>
                        ) : (
                          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <rect x="9" y="9" width="13" height="13" rx="2" />
                            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                          </svg>
                        )}
                      </button>

                      {/* Duplicate Template */}
                      <button
                        type="button"
                        title="Duplicate Template"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateTemplate(tpl);
                        }}
                        className="rounded-lg p-1.5 text-[#84938f] hover:bg-[#edf7f4] hover:text-[#118778] transition"
                      >
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>

                      {/* Delete Template */}
                      <button
                        type="button"
                        title="Delete template"
                        onClick={(e) => {
                          e.stopPropagation();
                          void handleDeleteTemplate(tpl._id);
                        }}
                        className="rounded-lg p-1.5 text-[#84938f] hover:bg-rose-50 hover:text-rose-600 transition"
                      >
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            /* DATA TABLE VIEW */
            <div className="overflow-hidden rounded-2xl border border-[#dfe7e4] bg-white shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#edf2f0] bg-[#f9fbfa] text-[10px] font-bold uppercase tracking-wider text-[#71817d]">
                      <th className="px-4 py-3">Template Name</th>
                      <th className="px-3 py-3">Category</th>
                      <th className="px-3 py-3">Language</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#edf2f0] text-xs">
                    {filteredTemplates.map((tpl) => {
                      const isSelected = activeTemplate?._id === tpl._id;
                      return (
                        <tr
                          key={tpl._id}
                          onClick={() => setSelectedTemplate(tpl)}
                          className={`cursor-pointer transition ${
                            isSelected ? "bg-[#edf7f4] font-semibold" : "hover:bg-[#fafcfb]"
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div className="font-mono text-xs font-bold text-[#14231f]">
                              {tpl.name}
                            </div>
                            {tpl.headerText && (
                              <div className="text-[11px] text-[#71817d] truncate max-w-[200px]">
                                {tpl.headerText}
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-3">
                            <span className="rounded-md bg-[#edf2f0] px-2 py-0.5 text-[10px] font-bold text-[#445550]">
                              {tpl.category}
                            </span>
                          </td>
                          <td className="px-3 py-3 font-mono text-[11px] text-[#52645f]">
                            {tpl.language || "en_US"}
                          </td>
                          <td className="px-3 py-3">
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                              <span className="size-1.5 rounded-full bg-emerald-500" />
                              {tpl.status}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                title="Duplicate"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDuplicateTemplate(tpl);
                                }}
                                className="rounded p-1 text-[#84938f] hover:text-[#118778]"
                              >
                                ⎘
                              </button>
                              <button
                                type="button"
                                title="Delete"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  void handleDeleteTemplate(tpl._id);
                                }}
                                className="rounded p-1 text-[#84938f] hover:text-rose-600"
                              >
                                ✕
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: EXECUTIVE LIVE TEMPLATE STUDIO & PLAYGROUND (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 rounded-3xl border border-[#dfe7e4] bg-white p-5 shadow-2xs space-y-4">
            {/* Studio Header & Tab Switcher */}
            <div className="flex items-center justify-between border-b border-[#edf2f0] pb-3">
              <div>
                <span className="block text-xs font-bold text-[#14231f]">
                  Interactive Template Studio
                </span>
                <span className="text-[10px] text-[#71817d]">
                  Preview a message with sample values
                </span>
              </div>

              {/* Studio Tabs */}
              <div className="flex items-center rounded-xl bg-[#f0f5f3] p-0.5">
                <button
                  type="button"
                  onClick={() => setStudioTab("preview")}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                    studioTab === "preview"
                      ? "bg-white text-[#118778] shadow-2xs"
                      : "text-[#71817d] hover:text-[#14231f]"
                  }`}
                >
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() => setStudioTab("payload")}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                    studioTab === "payload"
                      ? "bg-white text-[#118778] shadow-2xs"
                      : "text-[#71817d] hover:text-[#14231f]"
                  }`}
                >
                  API JSON
                </button>
                <button
                  type="button"
                  onClick={() => setStudioTab("compliance")}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                    studioTab === "compliance"
                      ? "bg-white text-[#118778] shadow-2xs"
                      : "text-[#71817d] hover:text-[#14231f]"
                  }`}
                >
                  Rules
                </button>
              </div>
            </div>

            {/* TAB 1: LIVE INTERACTIVE PREVIEW & PLAYGROUND */}
            {studioTab === "preview" && (
              <div className="space-y-4">
                {activeTemplate ? (
                  <>
                    {/* Active Template Meta Pill */}
                    <div className="flex items-center justify-between rounded-xl bg-[#f7fbf9] p-2.5 border border-[#e2eee9]">
                      <div className="min-w-0">
                        <span className="font-mono text-xs font-bold text-[#14231f] block truncate">
                          {activeTemplate.name}
                        </span>
                        <span className="text-[10px] text-[#71817d]">
                          {activeTemplate.category} • {activeTemplate.language || "en_US"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowTestModal(true)}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#118778] px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-[#0d6e62] transition"
                      >
                        <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>Send sample</span>
                      </button>
                    </div>

                    {/* Interactive Variable Playground Inputs */}
                    {activeVars.length > 0 && (
                      <div className="rounded-2xl border border-[#dfe7e4] bg-[#f9fbfa] p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#445550]">
                            Sample values
                          </span>
                          <span className="text-[9px] text-[#71817d]">Edit to preview</span>
                        </div>
                        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                          {activeVars.map((v) => (
                            <div key={v} className="flex items-center gap-1.5">
                              <span className="rounded-md bg-[#e4eeec] px-1.5 py-1 font-mono text-[10px] font-bold text-[#118778]">
                                {`{{${v}}}`}
                              </span>
                              <input
                                type="text"
                                value={sampleVars[v] || ""}
                                onChange={(e) =>
                                  setSampleVars((prev) => ({ ...prev, [v]: e.target.value }))
                                }
                                placeholder={`Value for {{${v}}}`}
                                className="flex-1 rounded-lg border border-[#c6d4d0] bg-white px-2 py-1 text-xs text-[#14231f] focus:border-[#118778] focus:outline-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Desktop Message Bubble (SaaS Card Style - NO PHONE FRAME) */}
                    <div className="rounded-2xl border border-[#d2ebe0] bg-[#eef7f3] p-4 shadow-3xs space-y-2.5">
                      {/* Sender Profile Header */}
                      <div className="flex items-center gap-2 border-b border-[#d8ebe3] pb-2">
                        <div className="grid size-6 place-items-center rounded-full bg-[#118778] text-white text-[10px] font-bold">
                          VZ
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-[#14231f]">Your business</span>
                        </div>
                        <span className="ml-auto text-[10px] font-mono text-[#71817d]">Preview</span>
                      </div>

                      {/* Clean Message Bubble */}
                      <div className="rounded-2xl rounded-tl-xs bg-white p-4 shadow-sm border border-[#e1eae6] space-y-2">
                        {/* Header */}
                        {activeTemplate.headerText && (
                          <div className="text-xs font-bold text-[#14231f] border-b border-[#f2f6f4] pb-1.5">
                            {activeTemplate.headerText}
                          </div>
                        )}

                        {/* Body with interpolated variables */}
                        <div className="whitespace-pre-line text-xs leading-relaxed text-[#20342e]">
                          {interpolatedBody}
                        </div>

                        {/* Footer */}
                        {activeTemplate.footerText && (
                          <div className="text-[10px] text-[#71817d] pt-1">
                            {activeTemplate.footerText}
                          </div>
                        )}

                        {/* Timestamp & Double Blue Ticks */}
                        <div className="flex items-center justify-end gap-1 pt-1 text-[9px] text-[#71817d]">
                          <span>10:42 AM</span>
                          <span className="text-sky-500 font-bold">✓✓</span>
                        </div>

                        {/* Interactive Buttons */}
                        {activeTemplate.buttons && activeTemplate.buttons.length > 0 && (
                          <div className="pt-2 border-t border-[#edf4f1] space-y-1.5">
                            {activeTemplate.buttons.map((btn, i) => (
                              <div
                                key={i}
                                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#cde0dc] bg-[#f9fbfa] py-2 text-xs font-bold text-[#118778] hover:bg-[#edf7f4] transition"
                              >
                                <span>{btn.type === "URL" ? "🔗" : "⚡"}</span>
                                <span>{btn.text}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="grid h-48 place-items-center text-xs text-[#84938f]">
                    Select a template to view the interactive live studio.
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: META GRAPH API PAYLOAD (JSON) */}
            {studioTab === "payload" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#71817d]">
                    Example API payload
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyPayload(metaJsonPayload)}
                    className="inline-flex items-center gap-1 rounded-lg bg-[#f0f5f3] px-2.5 py-1 text-xs font-bold text-[#118778] hover:bg-[#e2edea] transition"
                  >
                    <span>{copiedPayload ? "✓ Copied!" : "Copy JSON"}</span>
                  </button>
                </div>
                <pre className="max-h-96 overflow-auto rounded-2xl bg-[#0d1715] p-3 text-[11px] font-mono text-emerald-400 shadow-inner">
                  {metaJsonPayload}
                </pre>
                <p className="text-[10px] text-[#71817d]">
                  Use this payload with Meta's Graph API v21.0 endpoint:{" "}
                  <code className="text-[#118778]">POST /v21.0/&#123;phone_number_id&#125;/messages</code>
                </p>
              </div>
            )}

            {/* TAB 3: META QUALITY & COMPLIANCE RULES */}
            {studioTab === "compliance" && (
              <div className="space-y-3 text-xs text-[#52645f]">
                <div className="rounded-2xl border border-[#dfe7e4] bg-[#f9fbfa] p-3.5 space-y-2">
                  <span className="font-bold text-[#14231f] block">
                    Meta 24-Hour Customer Window
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    Templates are the only way to reach customers outside the active 24-hour service window. Once a customer replies, freeform messaging is unlocked for 24 hours.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#dfe7e4] bg-[#f9fbfa] p-3.5 space-y-2">
                  <span className="font-bold text-[#14231f] block">
                    Category Pricing Guidelines
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-[11px]">
                    <li>
                      <strong className="text-[#14231f]">Utility:</strong> Confirmations, reminders, alerts (lowest Meta charge).
                    </li>
                    <li>
                      <strong className="text-[#14231f]">Marketing:</strong> Offers, promotions, VIP announcements.
                    </li>
                    <li>
                      <strong className="text-[#14231f]">Authentication:</strong> OTPs and security codes.
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-[#dfe7e4] bg-[#f9fbfa] p-3.5 space-y-2">
                  <span className="font-bold text-[#14231f] block">
                    Variable Syntax Requirements
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    Always format parameters sequentially (e.g. &#123;&#123;1&#125;&#125;, &#123;&#123;2&#125;&#125;). Do not leave floating parameters without surrounding context.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. BLUEPRINTS LIBRARY MODAL */}
      {showBlueprintsModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-3xl rounded-3xl border border-[#dfe7e4] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#edf2f0] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#14231f]">
                  Template examples
                </h3>
                <p className="text-xs text-[#71817d]">
                  Choose an example to fill the new template form.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBlueprintsModal(false)}
                className="rounded-lg p-1 text-[#84938f] hover:bg-[#f4f7f6]"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 max-h-[60vh] overflow-y-auto pr-1">
              {TEMPLATE_BLUEPRINTS.map((bp, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[#dfe7e4] bg-[#fafcfb] p-4 flex flex-col justify-between hover:border-[#118778] hover:bg-white transition shadow-3xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#14231f]">
                        {bp.name}
                      </span>
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                        {bp.category}
                      </span>
                    </div>
                    <span className="inline-block text-[10px] font-semibold text-[#118778]">
                      {bp.badge}
                    </span>
                    <p className="text-[11px] text-[#52645f] leading-relaxed">
                      {bp.description}
                    </p>
                    <div className="rounded-xl bg-white border border-[#edf2f0] p-2.5 text-[11px] font-medium text-[#20342e] line-clamp-3">
                      {bp.bodyText}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#edf2f0] flex items-center justify-between">
                    <span className="text-[10px] text-[#71817d]">
                      {bp.buttons.length} Interactive Buttons
                    </span>
                    <button
                      type="button"
                      onClick={() => handleLoadBlueprint(bp)}
                      className="inline-flex items-center gap-1 rounded-xl bg-[#118778] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#0d6e62] transition"
                    >
                      <span>Use Blueprint ➔</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. CREATE TEMPLATE MODAL WITH REAL-TIME SIDE-BY-SIDE BUILDER */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-4xl rounded-3xl border border-[#dfe7e4] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#edf2f0] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#14231f]">Create Meta WhatsApp Template</h3>
                <p className="text-xs text-[#71817d]">
                  Save a reusable message in your template library.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-1 text-[#84938f] hover:bg-[#f4f7f6]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="mt-4">
              {createError && (
                <div className="mb-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700">
                  {createError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Form Inputs (7 cols) */}
                <div className="space-y-3.5 lg:col-span-7 max-h-[65vh] overflow-y-auto pr-1">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#445550]">
                        Template Name (snake_case)
                      </label>
                      <input
                        type="text"
                        required
                        value={newName}
                        onChange={(e) => setNewName(e.target.value.toLowerCase().replace(/\s+/g, "_"))}
                        placeholder="e.g. appointment_reminder_v2"
                        className="mt-1 w-full rounded-xl border border-[#c6d4d0] bg-[#f9fbfa] px-3.5 py-2 text-xs font-mono text-[#14231f] focus:border-[#118778] focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#445550]">
                        Category
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) =>
                          setNewCategory(e.target.value as "UTILITY" | "MARKETING" | "AUTHENTICATION")
                        }
                        className="mt-1 w-full rounded-xl border border-[#c6d4d0] bg-[#f9fbfa] px-3 py-2 text-xs font-semibold text-[#14231f] focus:border-[#118778] focus:bg-white focus:outline-none"
                      >
                        <option value="UTILITY">Utility (Reminders, Confirmations)</option>
                        <option value="MARKETING">Marketing (Promotions, Discounts)</option>
                        <option value="AUTHENTICATION">Authentication (OTPs, Security)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#445550]">
                      Header Text (Optional)
                    </label>
                    <input
                      type="text"
                      value={newHeaderText}
                      onChange={(e) => {
                        setNewHeaderText(e.target.value);
                        setNewHeaderType(e.target.value.trim() ? "TEXT" : "NONE");
                      }}
                      placeholder="e.g. Priority Health Alert"
                      className="mt-1 w-full rounded-xl border border-[#c6d4d0] bg-[#f9fbfa] px-3.5 py-2 text-xs text-[#14231f] focus:border-[#118778] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#445550]">
                        Body Text (Supports &#123;&#123;1&#125;&#125;, &#123;&#123;2&#125;&#125;)
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setNewBodyText(
                            (prev) => `${prev} {{${(prev.match(/{{/g) || []).length + 1}}}`,
                          )
                        }
                        className="text-[11px] font-bold text-[#118778] hover:underline"
                      >
                        ＋ Insert Variable
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      required
                      value={newBodyText}
                      onChange={(e) => setNewBodyText(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#c6d4d0] bg-[#f9fbfa] p-3 text-xs leading-relaxed text-[#14231f] focus:border-[#118778] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#445550]">
                      Footer Text (Optional)
                    </label>
                    <input
                      type="text"
                      value={newFooterText}
                      onChange={(e) => setNewFooterText(e.target.value)}
                      placeholder="e.g. Reply STOP to opt out"
                      className="mt-1 w-full rounded-xl border border-[#c6d4d0] bg-[#f9fbfa] px-3.5 py-2 text-xs text-[#14231f] focus:border-[#118778] focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Buttons Builder */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#445550]">
                        Interactive Action Buttons
                      </label>
                      {newButtons.length < 3 && (
                        <button
                          type="button"
                          onClick={() =>
                            setNewButtons((prev) => [
                              ...prev,
                              { type: "QUICK_REPLY", text: `Button ${prev.length + 1}`, value: `ACTION_${prev.length + 1}` },
                            ])
                          }
                          className="text-[11px] font-bold text-[#118778] hover:underline"
                        >
                          ＋ Add Button
                        </button>
                      )}
                    </div>
                    <div className="mt-1.5 space-y-2">
                      {newButtons.map((btn, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <select
                            value={btn.type}
                            onChange={(e) => {
                              const t = e.target.value as "QUICK_REPLY" | "URL";
                              setNewButtons((prev) =>
                                prev.map((b, i) => (i === idx ? { ...b, type: t } : b)),
                              );
                            }}
                            className="rounded-xl border border-[#c6d4d0] bg-white px-2.5 py-1.5 text-xs text-[#14231f]"
                          >
                            <option value="QUICK_REPLY">⚡ Quick Reply</option>
                            <option value="URL">🔗 Open Website URL</option>
                          </select>
                          <input
                            type="text"
                            value={btn.text}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewButtons((prev) =>
                                prev.map((b, i) => (i === idx ? { ...b, text: val } : b)),
                              );
                            }}
                            placeholder="Button label"
                            className="flex-1 rounded-xl border border-[#c6d4d0] bg-white px-3 py-1.5 text-xs text-[#14231f]"
                          />
                          <button
                            type="button"
                            onClick={() => setNewButtons((prev) => prev.filter((_, i) => i !== idx))}
                            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Live Builder Preview (5 cols) */}
                <div className="lg:col-span-5">
                  <div className="rounded-2xl border border-[#dfe7e4] bg-[#f9fbfa] p-4 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#71817d] block">
                      Live Preview
                    </span>

                    {/* Chat Bubble */}
                    <div className="rounded-2xl rounded-tl-none border border-[#d2ebe0] bg-white p-4 shadow-sm space-y-2">
                      {newHeaderText && (
                        <div className="text-xs font-bold text-[#14231f] border-b border-[#f2f6f4] pb-1.5">
                          {newHeaderText}
                        </div>
                      )}
                      <div className="whitespace-pre-line text-xs leading-relaxed text-[#20342e]">
                        {newBodyText
                          .replace(/{{1}}/g, "Alex Johnson")
                          .replace(/{{2}}/g, "Dr. Sarah Miller")
                          .replace(/{{3}}/g, "Tomorrow")
                          .replace(/{{4}}/g, "10:30 AM")
                          .replace(/{{5}}/g, "Metropolitan Medical Center")}
                      </div>
                      {newFooterText && (
                        <div className="text-[10px] text-[#71817d] pt-1">
                          {newFooterText}
                        </div>
                      )}

                      {newButtons.length > 0 && (
                        <div className="pt-2 border-t border-[#edf4f1] space-y-1.5">
                          {newButtons.map((btn, i) => (
                            <div
                              key={i}
                              className="rounded-xl border border-[#cde0dc] bg-[#f9fbfa] py-1.5 text-center text-xs font-bold text-[#118778]"
                            >
                              {btn.text || `Button ${i + 1}`}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-5 flex justify-end gap-2 border-t border-[#edf2f0] pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-[#dfe7e4] px-4 py-2 text-xs font-bold text-[#52645f] hover:bg-[#f4f7f6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-[#118778] px-5 py-2 text-xs font-bold text-white hover:bg-[#0d6e62] disabled:opacity-50 transition"
                >
                  {creating ? "Saving..." : "Create template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. TEST MESSAGE MODAL */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-[#dfe7e4] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#edf2f0] pb-3">
              <h3 className="text-base font-bold text-[#14231f]">Dispatch WhatsApp Test Message</h3>
              <button
                type="button"
                onClick={() => setShowTestModal(false)}
                className="rounded-lg p-1 text-[#84938f] hover:bg-[#f4f7f6]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendTestMessage} className="mt-4 space-y-4">
              <p className="text-xs text-[#52645f] leading-relaxed">
                Dispatch <strong className="text-[#14231f]">{activeTemplate?.name}</strong> to your WhatsApp number with the currently interpolated playground variables.
              </p>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#445550]">
                  Recipient Mobile Number (E.164 with Country Code)
                </label>
                <input
                  type="tel"
                  required
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="e.g. +14155552671 or 919876543210"
                  className="mt-1 w-full rounded-xl border border-[#c6d4d0] bg-[#f9fbfa] px-3.5 py-2 text-xs font-mono text-[#14231f] focus:border-[#118778] focus:bg-white focus:outline-none"
                />
              </div>

              {testNotice && (
                <div
                  className={`rounded-xl p-3 text-xs ${
                    testNotice.ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
                  }`}
                >
                  {testNotice.msg}
                </div>
              )}

              <div className="flex justify-end gap-2 border-t border-[#edf2f0] pt-3">
                <button
                  type="button"
                  onClick={() => setShowTestModal(false)}
                  className="rounded-xl border border-[#dfe7e4] px-4 py-2 text-xs font-bold text-[#52645f]"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={sendingTest}
                  className="rounded-xl bg-[#118778] px-5 py-2 text-xs font-bold text-white hover:bg-[#0d6e62] disabled:opacity-50 transition"
                >
                  {sendingTest ? "Sending..." : "Send sample message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
