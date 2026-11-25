"use client";

import { useEffect, useMemo, useState } from "react";
import type { WhatsAppForm, WhatsAppFormField, WhatsAppFormSubmission } from "@/lib/whatsapp";
import { whatsappApi } from "@/lib/whatsapp";

interface WhatsAppMetaFormsViewProps {
  forms: WhatsAppForm[];
  onRefresh: () => void;
}

const PRESET_FORM_BLUEPRINTS = [
  {
    title: "Clinic Patient Triage & Appointment Booking",
    description: "Captures patient clinical department, doctor selection, preferred date, and primary symptoms.",
    triggerKeyword: "BOOK",
    fields: [
      { id: "full_name", label: "Patient Full Name", type: "text" as const, required: true },
      {
        id: "department",
        label: "Clinical Department",
        type: "dropdown" as const,
        required: true,
        options: ["General Medicine", "Cardiology", "Dentistry", "Pediatrics"],
      },
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
      {
        id: "budget",
        label: "Monthly Budget Range",
        type: "dropdown" as const,
        required: true,
        options: ["Under $1,000", "$1,000 - $5,000", "$5,000 - $15,000", "Enterprise $15k+"],
      },
      { id: "use_case", label: "Voice AI Use Case", type: "text" as const, required: true },
    ],
  },
  {
    title: "Real Estate Property Inquiry & Site Visit",
    description: "Captures buyer preferences: property type, budget, location, and site tour booking.",
    triggerKeyword: "PROPERTY",
    fields: [
      { id: "full_name", label: "Full Name", type: "text" as const, required: true },
      {
        id: "property_type",
        label: "Property Type",
        type: "dropdown" as const,
        required: true,
        options: ["2 BHK Luxury Apartment", "3 BHK Villa", "Commercial Space", "Plot / Land"],
      },
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

  const [submissions, setSubmissions] = useState<WhatsAppFormSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submissionsSearch, setSubmissionsSearch] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newKeyword, setNewKeyword] = useState("INTAKE");
  const [newFields, setNewFields] = useState<WhatsAppFormField[]>([
    { id: "full_name", label: "Full Name", type: "text", required: true },
    { id: "email", label: "Email Address", type: "email", required: true },
    {
      id: "service",
      label: "Service Needed",
      type: "dropdown",
      required: true,
      options: ["Voice AI Consultation", "Clinic Booking", "Customer Support"],
    },
  ]);
  const [creating, setCreating] = useState(false);

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

  const filteredForms = useMemo(() => {
    return forms.filter(
      (f) =>
        f.title.toLowerCase().includes(search.toLowerCase()) ||
        (f.triggerKeyword && f.triggerKeyword.toLowerCase().includes(search.toLowerCase())),
    );
  }, [forms, search]);

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

  function handleAddField() {
    const id = `field_${Date.now().toString().slice(-4)}`;
    setNewFields([...newFields, { id, label: "New Question", type: "text", required: true }]);
  }

  function handleRemoveField(idx: number) {
    if (newFields.length <= 1) {
      alert("A form must have at least one field.");
      return;
    }
    setNewFields(newFields.filter((_, i) => i !== idx));
  }

  function handleApplyBlueprint(blueprint: (typeof PRESET_FORM_BLUEPRINTS)[number]) {
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
      {/* Control Toolbar */}
      <div className="whatsapp-meta-toolbar flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#dfe1e8] bg-white p-3 shadow-[0_8px_24px_rgba(37,99,235,0.07)] dark:border-[#303038] dark:bg-[#141418]">
        <div className="relative min-w-[240px] flex-1 max-w-sm">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#a1a1aa]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search forms by title or keyword..."
            className="whatsapp-search-field h-9 w-full rounded-md border border-[#eaeaea] bg-white pl-8 pr-3 text-[12.5px] text-[#171717] placeholder-[#a1a1aa] focus:border-[#171717] focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#1d4ed8] bg-[#2563eb] px-3.5 text-[12px] font-medium text-white transition hover:bg-[#1d4ed8]"
        >
          <span>+ Create Meta Form</span>
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
        {/* Left Column: Form List */}
        <div className="lg:col-span-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-[#171717]">
              Forms{" "}
              <span className="ml-1 font-normal text-[#71717a]">{filteredForms.length}</span>
            </h2>
          </div>

          <div className="grid gap-2 rounded-xl border border-[#eaeaea] bg-[#fafafa] p-2 dark:border-[#303038] dark:bg-[#111114]">
            {filteredForms.length === 0 ? (
              <div className="p-10 text-center">
                <h4 className="text-[13px] font-semibold text-[#171717]">No Meta Forms Found</h4>
                <p className="mt-1 text-[12px] text-[#71717a]">
                  Create a new in-chat form or choose a blueprint to start capturing leads.
                </p>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="mt-3 inline-flex h-8 items-center rounded-md bg-[#171717] px-3 text-[12px] font-medium text-white hover:bg-black"
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
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedFormId(form._id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedFormId(form._id);
                      }
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left cursor-pointer transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 ${
                      isSelected
                        ? "border-[#2563eb] bg-[#eff6ff] shadow-[0_8px_22px_rgba(37,99,235,0.14)] dark:bg-[#172554]"
                        : "border-[#eaeaea] bg-white hover:border-[#bfdbfe] hover:bg-[#f8fbff] dark:border-[#303038] dark:bg-[#18181b] dark:hover:border-[#3b82f6] dark:hover:bg-[#1b1b20]"

                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`grid size-7 shrink-0 place-items-center rounded-md border text-[11px] font-medium ${
                          isSelected
                            ? "border-[#171717] bg-[#171717] text-white"
                            : "border-[#eaeaea] bg-[#fafafa] text-[#52525b]"
                        }`}
                      >
                        F
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-[13px] font-semibold text-[#171717]">
                            {form.title}
                          </span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-[11.5px] text-[#71717a]">
                          <span className="font-mono text-[11px] text-[#171717]">
                            {form.triggerKeyword || "DIRECT"}
                          </span>
                          <span>·</span>
                          <span>{form.fields?.length || 0} fields</span>
                          <span>·</span>
                          <span className="font-medium text-[#171717]">
                            {form.submissionCount ?? (isSelected ? submissions.length : 0)} leads
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full border border-[#eaeaea] bg-white px-2 py-0.5 text-[10.5px] font-medium text-[#171717]">
                      <span className="size-1.5 rounded-full bg-[#171717]" />
                      Live
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Form Inspector */}
        <div className="lg:col-span-6">
          <div className="mb-2">
            <h2 className="text-[13px] font-semibold text-[#171717]">Form Inspector</h2>
          </div>

          {selectedForm ? (
            <div className="rounded-lg border border-[#eaeaea] bg-white p-4 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eaeaea] pb-3">
                <div className="min-w-0">
                  <h3 className="truncate text-[13.5px] font-semibold text-[#171717]">
                    {selectedForm.title}
                  </h3>
                  <p className="text-[11.5px] text-[#71717a]">
                    {selectedForm.description || "Native WhatsApp in-chat questionnaire"}
                  </p>
                </div>

                <div className="flex rounded-md border border-[#eaeaea] bg-[#fafafa] p-0.5 text-[11.5px] font-medium">
                  <button
                    type="button"
                    onClick={() => setActiveTab("fields")}
                    className={`rounded px-2.5 py-1 transition ${
                      activeTab === "fields"
                        ? "bg-[#171717] text-white"
                        : "text-[#52525b] hover:text-[#171717]"
                    }`}
                  >
                    Fields ({selectedForm.fields?.length || 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("submissions")}
                    className={`rounded px-2.5 py-1 transition ${
                      activeTab === "submissions"
                        ? "bg-[#171717] text-white"
                        : "text-[#52525b] hover:text-[#171717]"
                    }`}
                  >
                    Leads ({submissions.length})
                  </button>
                </div>
              </div>

              {activeTab === "fields" && (
                <div className="space-y-3">
                  <div className="rounded-md border border-[#eaeaea] bg-[#fafafa] p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-[#eaeaea] pb-2">
                      <span className="text-[12px] font-semibold text-[#171717]">
                        Interactive Flow Questions
                      </span>
                      <span className="rounded border border-[#eaeaea] bg-white px-2 py-0.5 text-[10px] font-medium text-[#52525b]">
                        Trigger: {selectedForm.triggerKeyword || "DIRECT"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {selectedForm.fields && selectedForm.fields.length > 0 ? (
                        selectedForm.fields.map((field, idx) => (
                          <div
                            key={field.id || idx}
                            className="rounded-md border border-[#eaeaea] bg-white p-2.5 space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] font-medium text-[#171717]">
                                {idx + 1}. {field.label}
                                {field.required && <span className="ml-1 text-[#71717a]">*</span>}
                              </span>
                              <span className="rounded bg-[#f4f4f5] px-1.5 py-0.5 font-mono text-[10px] uppercase text-[#52525b]">
                                {field.type}
                              </span>
                            </div>

                            {field.type === "dropdown" && field.options && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {field.options.map((opt, i) => (
                                  <span
                                    key={i}
                                    className="rounded border border-[#eaeaea] bg-[#fafafa] px-2 py-0.5 text-[10.5px] text-[#52525b]"
                                  >
                                    {opt}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="py-4 text-center text-[12px] text-[#71717a]">
                          No fields configured for this form.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "submissions" && (
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <input
                      type="text"
                      value={submissionsSearch}
                      onChange={(e) => setSubmissionsSearch(e.target.value)}
                      placeholder="Filter leads..."
                      className="whatsapp-search-field h-8 flex-1 rounded-md border border-[#eaeaea] bg-white px-2.5 text-[12px] text-[#171717] placeholder-[#a1a1aa] focus:border-[#171717] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleExportCSV}
                      disabled={submissions.length === 0}
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#eaeaea] bg-white px-2.5 text-[11.5px] font-medium text-[#171717] hover:bg-[#fafafa] disabled:opacity-50"
                    >
                      Export CSV ({submissions.length})
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-md border border-[#eaeaea]">
                    <table className="w-full text-left text-[12px]">
                      <thead className="border-b border-[#eaeaea] bg-[#fafafa] text-[10.5px] font-semibold uppercase tracking-wider text-[#71717a]">
                        <tr>
                          <th className="px-3 py-2">Lead</th>
                          <th className="px-3 py-2">Phone</th>
                          <th className="px-3 py-2">Answers</th>
                          <th className="px-3 py-2 text-right">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eaeaea]">
                        {loadingSubmissions ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-6 text-center text-[#71717a]">
                              Loading leads...
                            </td>
                          </tr>
                        ) : filteredSubmissions.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-6 text-center text-[#71717a]">
                              No submissions found.
                            </td>
                          </tr>
                        ) : (
                          filteredSubmissions.map((sub) => (
                            <tr key={sub._id} className="hover:bg-[#fafafa]">
                              <td className="px-3 py-2.5 font-medium text-[#171717]">
                                {sub.contactName || "Anonymous"}
                              </td>
                              <td className="px-3 py-2.5 font-mono text-[11px] text-[#52525b]">
                                +{sub.contactPhone}
                              </td>
                              <td className="px-3 py-2.5">
                                <div className="flex flex-wrap gap-1">
                                  {Object.entries(sub.data || {}).map(([key, val]) => (
                                    <span
                                      key={key}
                                      className="rounded border border-[#eaeaea] bg-[#fafafa] px-1.5 py-0.5 text-[10.5px] text-[#52525b]"
                                    >
                                      <span className="font-semibold text-[#171717]">{key}:</span>{" "}
                                      {String(val)}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-3 py-2.5 text-right text-[11px] text-[#71717a] whitespace-nowrap">
                                {new Date(sub.submittedAt).toLocaleDateString([], {
                                  month: "short",
                                  day: "numeric",
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
            <div className="rounded-lg border border-[#eaeaea] bg-white p-10 text-center text-[12px] text-[#71717a]">
              Select a form on the left to inspect fields and leads.
            </div>
          )}
        </div>
      </div>

      {/* Create Meta Form Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-lg border border-[#eaeaea] bg-white p-5 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#eaeaea] pb-3">
              <h3 className="text-[14px] font-semibold text-[#171717]">Create WhatsApp Meta Form</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-md p-1 text-[#71717a] hover:bg-[#f4f4f5]"
              >
                ✕
              </button>
            </div>

            <div className="mt-3.5 space-y-1.5">
              <span className="block text-[11px] font-medium text-[#71717a]">
                Quick-Start Blueprints
              </span>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {PRESET_FORM_BLUEPRINTS.map((bp) => (
                  <button
                    key={bp.title}
                    type="button"
                    onClick={() => handleApplyBlueprint(bp)}
                    className="rounded-md border border-[#eaeaea] bg-[#fafafa] p-2.5 text-left transition hover:border-[#171717] hover:bg-white"
                  >
                    <span className="block truncate text-[12px] font-semibold text-[#171717]">
                      {bp.title.split("&")[0]}
                    </span>
                    <span className="block text-[10.5px] text-[#71717a]">
                      {bp.fields.length} questions
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateForm} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-[11.5px] font-medium text-[#171717]">Form Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Clinic Appointment Registration"
                  className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] text-[#171717] focus:border-[#171717] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11.5px] font-medium text-[#171717]">
                    Trigger Keyword
                  </label>
                  <input
                    type="text"
                    required
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value.toUpperCase())}
                    placeholder="e.g. INTAKE, BOOK"
                    className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 font-mono text-[12.5px] uppercase text-[#171717] focus:border-[#171717] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] font-medium text-[#171717]">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Short form purpose"
                    className="mt-1 h-9 w-full rounded-md border border-[#eaeaea] bg-white px-3 text-[12.5px] text-[#171717] focus:border-[#171717] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between border-b border-[#eaeaea] pb-1.5">
                  <span className="text-[11.5px] font-medium text-[#171717]">
                    Questions ({newFields.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddField}
                    className="text-[11.5px] font-semibold text-[#171717] hover:underline"
                  >
                    + Add Question
                  </button>
                </div>

                <div className="mt-2.5 space-y-2 max-h-52 overflow-y-auto pr-1">
                  {newFields.map((field, idx) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-2 rounded-md border border-[#eaeaea] bg-[#fafafa] p-2"
                    >
                      <span className="grid size-6 shrink-0 place-items-center rounded border border-[#eaeaea] bg-white text-[10.5px] font-medium text-[#71717a]">
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
                        className="h-8 flex-1 rounded-md border border-[#eaeaea] bg-white px-2.5 text-[12px] text-[#171717] focus:border-[#171717] focus:outline-none"
                      />
                      <select
                        value={field.type}
                        onChange={(e) => {
                          const updated = [...newFields];
                          updated[idx].type = e.target.value as WhatsAppFormField["type"];
                          setNewFields(updated);
                        }}
                        className="h-8 rounded-md border border-[#eaeaea] bg-white px-2 text-[12px] text-[#171717] focus:border-[#171717] focus:outline-none"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="dropdown">Dropdown</option>
                        <option value="date">Date</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveField(idx)}
                        className="p-1 text-[#71717a] hover:text-[#171717]"
                        title="Remove field"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-[#eaeaea] pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="h-8 rounded-md border border-[#eaeaea] bg-white px-3.5 text-[12px] font-medium text-[#52525b] hover:bg-[#fafafa]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="h-8 rounded-md bg-[#171717] px-4 text-[12px] font-medium text-white hover:bg-black disabled:opacity-50"
                >
                  {creating ? "Publishing..." : "Publish Meta Form"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
