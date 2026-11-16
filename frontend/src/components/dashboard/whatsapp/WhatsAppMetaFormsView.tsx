"use client";

import { useEffect, useMemo, useState } from "react";
import type { WhatsAppForm, WhatsAppFormField, WhatsAppFormSubmission } from "@/lib/whatsapp";
import { whatsappApi } from "@/lib/whatsapp";

interface WhatsAppMetaFormsViewProps {
  forms: WhatsAppForm[];
  onRefresh: () => void;
}

// Preset form templates for rapid creation
const PRESET_FORM_BLUEPRINTS = [
  {
    title: "Clinic Patient Triage & Appointment Booking",
    description: "Captures patient clinical department, doctor selection, preferred date, and primary symptoms.",
    triggerKeyword: "BOOK",
    fields: [
      { id: "full_name", label: "Patient Full Name", type: "text" as const, required: true },
      { id: "department", label: "Clinical Department", type: "dropdown" as const, required: true, options: ["General Medicine", "Cardiology", "Dentistry", "Pediatrics"] },
      { id: "appointment_date", label: "Preferred Date", type: "date" as const, required: true },
      { id: "symptoms", label: "Primary Symptoms or Reason for Visit", type: "text" as const, required: false },
    ],
  },
  {
    title: "B2B Lead Qualification & Budget Assessment",
    description: "Qualifies enterprise prospects by collecting company size, service required, and implementation budget.",
    triggerKeyword: "CONSULT",
    fields: [
      { id: "full_name", label: "Contact Name", type: "text" as const, required: true },
      { id: "company_name", label: "Company / Organization", type: "text" as const, required: true },
      { id: "budget", label: "Monthly Budget Range", type: "dropdown" as const, required: true, options: ["Under $1,000", "$1,000 - $5,000", "$5,000 - $15,000", "Enterprise $15k+"] },
      { id: "use_case", label: "Voice AI Use Case", type: "text" as const, required: true },
    ],
  },
  {
    title: "Real Estate Property Inquiry & Site Visit",
    description: "Captures buyer preferences: property type, budget, location, and site tour booking.",
    triggerKeyword: "PROPERTY",
    fields: [
      { id: "full_name", label: "Full Name", type: "text" as const, required: true },
      { id: "property_type", label: "Property Type", type: "dropdown" as const, required: true, options: ["2 BHK Luxury Apartment", "3 BHK Villa", "Commercial Space", "Plot / Land"] },
      { id: "tour_date", label: "Preferred Visit Date", type: "date" as const, required: true },
    ],
  },
];

export function WhatsAppMetaFormsView({ forms, onRefresh }: WhatsAppMetaFormsViewProps) {
  const [selectedFormId, setSelectedFormId] = useState<string>(forms[0]?._id || "");
  const [activeTab, setActiveTab] = useState<"fields" | "submissions">("fields");
  const [search, setSearch] = useState("");

  const selectedForm = useMemo(() => {
    return forms.find((f) => f._id === selectedFormId) || forms[0] || null;
  }, [forms, selectedFormId]);

  useEffect(() => {
    if (!selectedFormId && forms.length > 0) {
      setSelectedFormId(forms[0]._id);
    }
  }, [forms, selectedFormId]);

  // Submissions state
  const [submissions, setSubmissions] = useState<WhatsAppFormSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submissionsSearch, setSubmissionsSearch] = useState("");

  // Modal & Form creation state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newKeyword, setNewKeyword] = useState("INTAKE");
  const [newFields, setNewFields] = useState<WhatsAppFormField[]>([
    { id: "full_name", label: "Full Name", type: "text", required: true },
    { id: "email", label: "Email Address", type: "email", required: true },
    { id: "service", label: "Service Needed", type: "dropdown", required: true, options: ["Voice AI Consultation", "Clinic Booking", "Customer Support"] },
  ]);
  const [creating, setCreating] = useState(false);

  // Load submissions whenever selected form changes
  useEffect(() => {
    if (!selectedForm?._id) return;
    setLoadingSubmissions(true);
    whatsappApi
      .getFormSubmissions(selectedForm._id)
      .then((res) => {
        if (res.ok) setSubmissions(res.submissions || []);
      })
      .catch((err) => console.warn("Failed to load submissions:", err))
      .finally(() => setLoadingSubmissions(false));
  }, [selectedForm?._id]);

  // Filtered forms list
  const filteredForms = useMemo(() => {
    return forms.filter(
      (f) =>
        f.title.toLowerCase().includes(search.toLowerCase()) ||
        (f.triggerKeyword && f.triggerKeyword.toLowerCase().includes(search.toLowerCase())),
    );
  }, [forms, search]);

  // Filtered submissions list
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const q = submissionsSearch.toLowerCase();
      const matchName = (sub.contactName || "").toLowerCase().includes(q);
      const matchPhone = (sub.contactPhone || "").includes(q);
      const matchData = Object.values(sub.data || {}).some((v) =>
        String(v).toLowerCase().includes(q),
      );
      return matchName || matchPhone || matchData;
    });
  }, [submissions, submissionsSearch]);

  // Aggregated KPIs
  const totalSubmissionsCount = useMemo(() => {
    return forms.reduce((acc, f) => acc + (f.submissionCount || 0), submissions.length);
  }, [forms, submissions.length]);

  function handleAddField() {
    const id = `field_${Date.now().toString().slice(-4)}`;
    setNewFields([
      ...newFields,
      { id, label: "New Question", type: "text", required: true },
    ]);
  }

  function handleRemoveField(idx: number) {
    if (newFields.length <= 1) {
      alert("A form must have at least one field.");
      return;
    }
    setNewFields(newFields.filter((_, i) => i !== idx));
  }

  function handleApplyBlueprint(blueprint: typeof PRESET_FORM_BLUEPRINTS[number]) {
    setNewTitle(blueprint.title);
    setNewDesc(blueprint.description);
    setNewKeyword(blueprint.triggerKeyword);
    setNewFields(blueprint.fields);
  }

  async function handleCreateForm(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const res = await whatsappApi.createForm({
        title: newTitle.trim(),
        description: newDesc.trim() || "In-chat customer intake form",
        triggerKeyword: newKeyword.trim().toUpperCase() || "INTAKE",
        fields: newFields,
      });
      if (res.ok && res.form) {
        setShowCreateModal(false);
        setNewTitle("");
        setNewDesc("");
        setNewKeyword("INTAKE");
        onRefresh();
        setSelectedFormId(res.form._id);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create form");
    } finally {
      setCreating(false);
    }
  }

  // Real CSV Export
  function handleExportCSV() {
    if (!selectedForm || submissions.length === 0) {
      alert("No submissions available to export.");
      return;
    }

    const fieldKeys = selectedForm.fields.map((f) => f.label || f.id);
    const headers = ["Lead Name", "Phone", "Submitted At", ...fieldKeys];

    const rows = submissions.map((sub) => {
      const fieldValues = selectedForm.fields.map((f) => {
        const val = sub.data?.[f.id] ?? sub.data?.[f.label] ?? "";
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      return [
        `"${sub.contactName || "Anonymous"}"`,
        `"${sub.contactPhone || ""}"`,
        `"${new Date(sub.submittedAt).toLocaleString()}"`,
        ...fieldValues,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedForm.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_submissions.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="whatsapp-forms space-y-5">
      {/* 2. FLAT CONTROL TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dbe4e1] bg-white p-3 shadow-xs">
        <div className="relative min-w-[240px] flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search forms by title or keyword..."
            className="w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] px-3.5 py-1.5 text-xs text-[#14231f] placeholder-[#84938f] focus:border-[#118778] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#118778] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#0e7467]"
          >
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>+ Create Meta Form</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN DUAL-PANE FORMS STUDIO */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        {/* Left Column: Form Cards Stream (5 cols) */}
        <div className="space-y-3 lg:col-span-5">
          {filteredForms.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#dbe4e1] bg-white p-10 text-center">
              <span className="grid size-10 place-items-center rounded-2xl bg-[#f0f5f3] text-xl mx-auto mb-2">
                📄
              </span>
              <h4 className="text-xs font-bold text-[#14231f]">No Meta Forms Found</h4>
              <p className="mt-1 text-[11px] text-[#71817d]">
                Create a new in-chat form or choose an industry template to start capturing leads.
              </p>
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#118778] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#0e7467]"
              >
                Create First Form
              </button>
            </div>
          ) : (
            filteredForms.map((form) => {
              const isSelected = selectedForm?._id === form._id;
              return (
                <div
                  key={form._id}
                  onClick={() => setSelectedFormId(form._id)}
                  onKeyDown={(event) => {
                    if (event.target !== event.currentTarget) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedFormId(form._id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`Preview ${form.title}`}
                  className={`group relative cursor-pointer rounded-2xl border p-4 transition-all duration-150 ${
                    isSelected
                      ? "border-[#118778] bg-[#f4faf8] shadow-sm ring-1 ring-[#118778]/30"
                      : "border-[#dbe4e1] bg-white hover:border-[#b7cbcf] hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-xl text-sm transition ${
                          isSelected
                            ? "bg-[#118778] text-white shadow-2xs"
                            : "bg-[#eef5f3] text-[#118778]"
                        }`}
                      >
                        📄
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="truncate text-xs font-bold text-[#14231f] group-hover:text-[#118778]">
                            {form.title}
                          </h4>
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-[#60716c]">
                          {form.description || "In-chat customer intake form"}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-[#e8f0ec] pt-2.5 text-[11px]">
                    <div className="flex items-center gap-1.5 text-[#71817d]">
                      <span>Keyword:</span>
                      <code className="rounded-md bg-white border border-[#dbe4e1] px-1.5 py-0.2 font-mono text-[10px] font-bold text-[#118778]">
                        {form.triggerKeyword || "DIRECT"}
                      </code>
                    </div>

                    <div className="flex items-center gap-2 text-[#52645f]">
                      <span>{form.fields?.length || 0} fields</span>
                      <span>·</span>
                      <span className="font-bold text-[#14231f]">
                        {form.submissionCount ?? (isSelected ? submissions.length : 0)} leads
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Studio Inspector (7 cols) */}
        <div className="space-y-4 lg:col-span-7">
          {selectedForm ? (
            <div className="rounded-3xl border border-[#dbe4e1] bg-white p-5 shadow-xs space-y-4">
              {/* Studio Header */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#edf2f0] pb-3.5">
                <div>
                  <h3 className="text-sm font-bold text-[#14231f]">{selectedForm.title}</h3>
                  <p className="text-[11px] text-[#71817d]">
                    {selectedForm.description || "Native WhatsApp in-chat questionnaire"}
                  </p>
                </div>

                {/* Sub-Tabs: Fields & Preview vs Submissions */}
                <div className="flex rounded-xl bg-[#f0f4f3] p-1 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab("fields")}
                    className={`rounded-lg px-3 py-1 transition ${
                      activeTab === "fields"
                        ? "bg-white text-[#118778] shadow-xs"
                        : "text-[#60716c] hover:text-[#14231f]"
                    }`}
                  >
                    Form Fields ({selectedForm.fields?.length || 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("submissions")}
                    className={`rounded-lg px-3 py-1 transition ${
                      activeTab === "submissions"
                        ? "bg-white text-[#118778] shadow-xs"
                        : "text-[#60716c] hover:text-[#14231f]"
                    }`}
                  >
                    Leads Captured ({submissions.length})
                  </button>
                </div>
              </div>

              {/* TAB 1: FORM FIELDS & NATIVE CARD PREVIEW */}
              {activeTab === "fields" && (
                <div className="space-y-4">
                  {/* Meta In-Chat Flow Card Preview */}
                  <div className="rounded-2xl border border-[#cfe3dc] bg-gradient-to-b from-[#f7fbf9] to-[#ffffff] p-4 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-[#e5eee9] pb-2">
                      <div className="flex items-center gap-2">
                        <span className="grid size-6 place-items-center rounded-lg bg-[#118778] text-white text-xs font-bold">
                          ✓
                        </span>
                        <span className="text-xs font-bold text-[#14231f]">
                          Interactive WhatsApp Flow Sheet
                        </span>
                      </div>
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                        Meta In-Chat Native
                      </span>
                    </div>

                    {/* Fields List */}
                    <div className="space-y-2.5 pt-1">
                      {selectedForm.fields && selectedForm.fields.length > 0 ? (
                        selectedForm.fields.map((field, idx) => (
                          <div
                            key={field.id || idx}
                            className="rounded-xl border border-[#dfe8e5] bg-white p-3 space-y-1.5 shadow-2xs"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-[#14231f]">
                                  {idx + 1}. {field.label}
                                </span>
                                {field.required && (
                                  <span className="text-rose-500 text-[10px] font-bold">*</span>
                                )}
                              </div>
                              <span className="rounded-md bg-[#f0f5f3] px-2 py-0.5 text-[9px] font-mono uppercase text-[#52645f]">
                                {field.type}
                              </span>
                            </div>

                            {field.type === "dropdown" && field.options && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {field.options.map((opt, i) => (
                                  <span
                                    key={i}
                                    className="rounded-lg border border-[#dbe4e1] bg-[#f9fbfa] px-2 py-0.5 text-[10px] text-[#52645f]"
                                  >
                                    • {opt}
                                  </span>
                                ))}
                              </div>
                            )}

                            {field.type !== "dropdown" && (
                              <div className="rounded-lg border border-[#e5ede9] bg-[#f9fbfa] px-3 py-1.5 text-[11px] text-[#84938f] italic">
                                Customer inputs {field.type} response here...
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-xs text-[#84938f]">
                          No fields configured for this form.
                        </div>
                      )}
                    </div>

                    {/* Simulated Submit CTA */}
                    <div className="pt-2">
                      <div className="w-full rounded-xl bg-[#118778] py-2.5 text-center text-xs font-bold text-white shadow-2xs">
                        Submit Details to Business
                      </div>
                    </div>
                  </div>

                  {/* Trigger Information Pill */}
                  <div className="flex items-center justify-between rounded-xl border border-[#d8e8e1] bg-[#f3faf6] p-3 text-xs text-[#52645f]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#14231f]">WhatsApp Trigger:</span>
                      <span>Customer texts keyword</span>
                      <code className="rounded bg-white border border-[#c6ded3] px-2 py-0.5 font-mono font-bold text-[#118778]">
                        {selectedForm.triggerKeyword || "DIRECT"}
                      </code>
                    </div>
                    <span className="text-[11px] text-[#71817d]">or launch via Flow Maker</span>
                  </div>
                </div>
              )}

              {/* TAB 2: CAPTURED LEADS & SUBMISSIONS TABLE */}
              {activeTab === "submissions" && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="relative max-w-xs flex-1">
                      <input
                        type="text"
                        value={submissionsSearch}
                        onChange={(e) => setSubmissionsSearch(e.target.value)}
                        placeholder="Search submissions by lead name or phone..."
                        className="w-full rounded-xl border border-[#dbe4e1] bg-[#f9fbfa] px-3 py-1.5 text-xs text-[#14231f] placeholder-[#84938f] focus:border-[#118778] focus:bg-white focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleExportCSV}
                      disabled={submissions.length === 0}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#118778] bg-[#118778]/10 px-3 py-1.5 text-xs font-semibold text-[#118778] hover:bg-[#118778] hover:text-white transition disabled:opacity-50"
                    >
                      <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Export CSV ({submissions.length})</span>
                    </button>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto rounded-2xl border border-[#e5eee9]">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-[#e5eee9] bg-[#f8faf9] text-[10px] font-bold uppercase tracking-wider text-[#60716c]">
                        <tr>
                          <th className="px-3.5 py-2.5">Lead / Contact</th>
                          <th className="px-3.5 py-2.5">Phone Number</th>
                          <th className="px-3.5 py-2.5">Captured Answers</th>
                          <th className="px-3.5 py-2.5 text-right">Submitted</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#edf3f0]">
                        {loadingSubmissions ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-[#84938f]">
                              <div className="flex items-center justify-center gap-2">
                                <span className="size-4 animate-spin rounded-full border-2 border-[#118778] border-t-transparent" />
                                <span>Loading verified leads...</span>
                              </div>
                            </td>
                          </tr>
                        ) : filteredSubmissions.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-[#84938f]">
                              No submissions found.
                            </td>
                          </tr>
                        ) : (
                          filteredSubmissions.map((sub) => (
                            <tr key={sub._id} className="hover:bg-[#f9fcfa] transition-colors">
                              <td className="px-3.5 py-3">
                                <div className="flex items-center gap-2">
                                  <span className="grid size-7 shrink-0 place-items-center rounded-xl bg-[#eef7f4] font-bold text-[10px] text-[#118778]">
                                    {(sub.contactName || "L")[0].toUpperCase()}
                                  </span>
                                  <span className="font-bold text-[#14231f]">
                                    {sub.contactName || "Anonymous Lead"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-3.5 py-3 font-mono text-[11px] text-[#52645f]">
                                +{sub.contactPhone}
                              </td>
                              <td className="px-3.5 py-3">
                                <div className="flex flex-wrap gap-1 max-w-sm">
                                  {Object.entries(sub.data || {}).map(([key, val]) => (
                                    <span
                                      key={key}
                                      className="rounded-md border border-[#e0eae6] bg-[#f9fbfa] px-1.5 py-0.5 text-[10px] text-[#445550]"
                                    >
                                      <span className="font-bold text-[#118778]">{key}:</span> {String(val)}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-3.5 py-3 text-right text-[10px] text-[#84938f] whitespace-nowrap">
                                {new Date(sub.submittedAt).toLocaleDateString([], {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#dbe4e1] bg-white p-12 text-center text-xs text-[#84938f]">
              Select a form on the left to inspect fields and captured leads.
            </div>
          )}
        </div>
      </div>

      {/* 4. MODAL: CREATE META FORM WITH PRESET BLUEPRINTS */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-3xl border border-[#dbe4e1] bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#edf2f0] pb-3">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold">
                  📄
                </span>
                <h3 className="text-sm font-bold text-[#14231f]">Create WhatsApp Meta Form</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-1 text-[#84938f] hover:bg-[#f4f7f6]"
              >
                ✕
              </button>
            </div>

            {/* Blueprint Starter Buttons */}
            <div className="mt-4 space-y-2">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#71817d]">
                Fast-Start Blueprints (1-Click)
              </span>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {PRESET_FORM_BLUEPRINTS.map((bp) => (
                  <button
                    key={bp.title}
                    type="button"
                    onClick={() => handleApplyBlueprint(bp)}
                    className="rounded-2xl border border-[#dfe8e4] bg-[#f9fbfa] p-2.5 text-left transition hover:border-[#118778] hover:bg-[#f0f8f5]"
                  >
                    <span className="block truncate text-xs font-bold text-[#14231f]">{bp.title.split("&")[0]}</span>
                    <span className="block text-[10px] text-[#71817d]">{bp.fields.length} questions</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateForm} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#445550]">
                  Form Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Clinic Appointment Registration"
                  className="mt-1 w-full rounded-xl border border-[#c6d4d0] bg-[#f9fbfa] px-3.5 py-2 text-xs text-[#14231f] focus:border-[#118778] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#445550]">
                    Trigger Keyword
                  </label>
                  <input
                    type="text"
                    required
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value.toUpperCase())}
                    placeholder="e.g. INTAKE, BOOK"
                    className="mt-1 w-full rounded-xl border border-[#c6d4d0] bg-[#f9fbfa] px-3.5 py-2 text-xs font-bold uppercase text-[#14231f] focus:border-[#118778] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#445550]">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Short form purpose"
                    className="mt-1 w-full rounded-xl border border-[#c6d4d0] bg-[#f9fbfa] px-3.5 py-2 text-xs text-[#14231f] focus:border-[#118778] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Form Fields Builder */}
              <div>
                <div className="flex items-center justify-between border-b border-[#edf2f0] pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#445550]">
                    Questions & Form Fields ({newFields.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddField}
                    className="text-xs font-bold text-[#118778] hover:underline"
                  >
                    + Add Question
                  </button>
                </div>

                <div className="mt-3 space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {newFields.map((field, idx) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-2 rounded-2xl border border-[#dbe4e1] bg-[#f9fbfa] p-2.5"
                    >
                      <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-white border border-[#dbe4e1] text-[10px] font-bold text-[#71817d]">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        required
                        value={field.label}
                        onChange={(e) => {
                          const updated = [...newFields];
                          updated[idx].label = e.target.value;
                          setNewFields(updated);
                        }}
                        placeholder="Field label..."
                        className="flex-1 rounded-xl border border-[#dbe4e1] bg-white px-3 py-1.5 text-xs text-[#14231f] focus:border-[#118778] focus:outline-none"
                      />
                      <select
                        value={field.type}
                        onChange={(e) => {
                          const updated = [...newFields];
                          updated[idx].type = e.target.value as WhatsAppFormField["type"];
                          setNewFields(updated);
                        }}
                        className="rounded-xl border border-[#dbe4e1] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#14231f] focus:border-[#118778] focus:outline-none"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="dropdown">Dropdown</option>
                        <option value="date">Date Picker</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveField(idx)}
                        className="p-1.5 text-[#84938f] hover:text-rose-600 transition"
                        title="Remove field"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 border-t border-[#edf2f0] pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-[#c6d4d0] px-4 py-2 text-xs font-semibold text-[#52645f] hover:bg-[#f4f7f6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-[#118778] px-5 py-2 text-xs font-bold text-white hover:bg-[#0e7467] disabled:opacity-50"
                >
                  {creating ? "Publishing to Meta..." : "Publish Meta Form"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
