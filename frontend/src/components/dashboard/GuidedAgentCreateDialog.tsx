"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

import { voiceApi, type AgentTemplate, type GuidedAgentInput, type GuidedAgentPreview } from "@/lib/voice";

type Step = "start" | "choose" | "details" | "review";
type Props = { onClose: () => void; onCreated: (agentId: string) => void };

const integrationChoices: { mode: GuidedAgentInput["mode"]; title: string; detail: string }[] = [
  { mode: "requests", title: "Take requests for my staff", detail: "Answer questions and save requests in your dashboard. Staff confirm bookings." },
  { mode: "native", title: "Use the Vozon clinic schedule", detail: "Book new appointments using doctors and available times you manage in Vozon." },
  { mode: "external", title: "Connect existing business software", detail: "Create a draft, then configure the connection before activation." },
  { mode: "digitalbot", title: "Connect DigitalBot", detail: "Create a draft, then attach your DigitalBot connection." },
];

const scheduleFields = new Set(["appointmentTimezone", "bookingDays", "bookingStart", "bookingEnd", "appointmentDuration"]);
const requestSummaries: Record<string, string> = {
  restaurant_reservations: "Collect table requests, party size, preferred time, and special requests. Your staff confirm the reservation.",
  clinic_appointments: "Collect appointment requests, preferred doctors, and callback details. Your staff confirm the appointment.",
  hotel_reservations: "Collect stay dates, guest details, and room preferences. Your staff confirm availability and prices.",
  real_estate_qualification: "Save buyer requirements and site visit requests. Your staff confirm visit times.",
  service_booking: "Collect the service, address, and preferred time. Your staff confirm coverage, price, and availability.",
  payment_reminders: "Record promises to pay and disputes for staff review. Payments and invoice balances are not changed.",
  customer_feedback: "Save ratings and comments, and record requests for staff follow-up.",
};

const fieldClass = "min-h-11 w-full rounded-lg border border-[#d5e2dd] bg-white px-3 text-sm text-[#14231f] outline-none transition focus:border-[#118778] focus:ring-4 focus:ring-[#118778]/10";

const languageOptions = [
  ["English", "English (India)"], ["English US", "English (US)"], ["English UK", "English (UK)"],
  ["Hindi", "Hindi"], ["Bengali", "Bengali"], ["Tamil", "Tamil"], ["Telugu", "Telugu"],
  ["Kannada", "Kannada"], ["Malayalam", "Malayalam"], ["Marathi", "Marathi"], ["Gujarati", "Gujarati"],
  ["Punjabi", "Punjabi"], ["Odia", "Odia"], ["Assamese", "Assamese"], ["Urdu", "Urdu"],
  ["Nepali", "Nepali"], ["Spanish", "Spanish"], ["French", "French"], ["German", "German"],
] as const;

const timezoneOptions = [
  "Asia/Kolkata", "Asia/Dubai", "Asia/Singapore", "Asia/Kathmandu", "Asia/Dhaka", "Asia/Colombo",
  "Asia/Karachi", "Asia/Bangkok", "Asia/Hong_Kong", "Asia/Tokyo", "Australia/Sydney", "Europe/London",
  "Europe/Paris", "Europe/Berlin", "America/New_York", "America/Chicago", "America/Denver",
  "America/Los_Angeles", "America/Toronto", "America/Sao_Paulo", "Africa/Johannesburg", "UTC",
] as const;

const weekdays = [
  { value: "Sun", label: "Sunday" }, { value: "Mon", label: "Monday" },
  { value: "Tue", label: "Tuesday" }, { value: "Wed", label: "Wednesday" },
  { value: "Thu", label: "Thursday" }, { value: "Fri", label: "Friday" },
  { value: "Sat", label: "Saturday" },
] as const;

type HoursDraft = { days: string[]; start: string; end: string; timezone: string; alwaysOpen: boolean; closesNextDay: boolean };
const defaultHours: HoursDraft = {
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  start: "09:00",
  end: "18:00",
  timezone: "Asia/Kolkata",
  alwaysOpen: false,
  closesNextDay: false,
};

function readableTime(value: string) {
  const [hourText, minute = "00"] = value.split(":");
  const hour = Number(hourText);
  if (!Number.isInteger(hour)) return value;
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute} ${suffix}`;
}

function formatBusinessHours(value: HoursDraft) {
  const schedule = value.alwaysOpen
    ? "Open 24 hours"
    : `${readableTime(value.start)}–${readableTime(value.end)}${value.closesNextDay ? " next day" : ""}`;
  return `${value.days.join(", ")}, ${schedule}, ${value.timezone}`;
}

function initialAnswers(template: AgentTemplate) {
  return Object.fromEntries(template.questions.map((question) => {
    if (question.control === "business-hours") return [question.id, formatBusinessHours(defaultHours)];
    if (question.control === "timezone") return [question.id, "Asia/Kolkata"];
    if (question.control === "weekdays") return [question.id, "Mon,Tue,Wed,Thu,Fri,Sat"];
    if (question.control === "time") return [question.id, question.id === "bookingEnd" ? "17:00" : "09:00"];
    if (question.control === "duration") return [question.id, "30"];
    return [question.id, ""];
  }));
}

type GuidedQuestion = AgentTemplate["questions"][number];

function answerItems(value: string) {
  return value.split(/\s*;\s*/).map((item) => item.trim()).filter(Boolean);
}

function StructuredListField({
  question,
  value,
  onChange,
}: {
  question: GuidedQuestion;
  value: string;
  onChange: (value: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const items = answerItems(value);
  const isHandoff = question.control === "handoff";

  function update(itemsToSave: string[]) {
    onChange([...new Set(itemsToSave.map((item) => item.trim()).filter(Boolean))].join("; ").slice(0, 300));
  }

  function addDraft() {
    const next = draft.trim().replace(/[;\r\n]+/g, " ");
    if (!next) return;
    update([...items, next]);
    setDraft("");
  }

  return (
    <fieldset className="grid gap-3 rounded-xl border border-[#dce7e3] bg-[#fbfdfc] p-4 sm:col-span-2">
      <legend className="px-1 text-xs font-semibold text-[#52645f]">
        {question.label}{question.required ? " *" : ""}
      </legend>
      {question.options?.length ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {question.options.map((option) => {
            const selected = items.includes(option);
            return (
              <label className={`flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2.5 text-xs leading-5 ${selected ? "border-[#118778] bg-[#e7f5f0] text-[#0e6f62]" : "border-[#d5e2dd] bg-white text-[#52645f]"}`} key={option}>
                <input className="mt-0.5 accent-[#118778]" type="checkbox" checked={selected} onChange={() => update(selected ? items.filter((item) => item !== option) : [...items, option])} />
                <span>{option}</span>
              </label>
            );
          })}
        </div>
      ) : null}
      {items.filter((item) => !question.options?.includes(item)).length ? (
        <div className="flex flex-wrap gap-2">
          {items.filter((item) => !question.options?.includes(item)).map((item) => (
            <button className="rounded-full border border-[#b8c8c3] bg-white px-3 py-1.5 text-left text-xs font-medium text-[#29423b]" key={item} type="button" title="Remove" onClick={() => update(items.filter((current) => current !== item))}>
              {item} <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_100px]">
        <input
          className={fieldClass}
          maxLength={140}
          placeholder={isHandoff ? "Add another handoff reason" : "Add an item"}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addDraft();
            }
          }}
        />
        <button className="rounded-lg border border-[#b8c8c3] bg-white px-3 text-sm font-semibold text-[#0e6f62] disabled:opacity-40" type="button" disabled={!draft.trim() || value.length >= 300} onClick={addDraft}>Add</button>
      </div>
      <span className="text-xs font-normal leading-5 text-[#8a9894]">{question.hint}</span>
    </fieldset>
  );
}

function QuestionField({
  question,
  value,
  hours,
  onChange,
  onHoursChange,
}: {
  question: GuidedQuestion;
  value: string;
  hours: HoursDraft;
  onChange: (value: string) => void;
  onHoursChange: (value: HoursDraft) => void;
}) {
  const inputId = `guided-${question.id}`;
  const hint = question.hint ? <span className="font-normal leading-4 text-[#8a9894]">{question.hint}</span> : null;
  const label = <span>{question.label}{question.required ? " *" : ""}</span>;

  if (question.control === "list" || question.control === "handoff") {
    return <StructuredListField question={question} value={value} onChange={onChange} />;
  }

  if (question.control === "business-hours") {
    const changeHours = (next: HoursDraft) => {
      onHoursChange(next);
      onChange(formatBusinessHours(next));
    };
    return (
      <fieldset className="grid gap-2 rounded-xl border border-[#dce7e3] bg-[#fbfdfc] p-4 sm:col-span-2">
        <legend className="px-1 text-xs font-semibold text-[#52645f]">{label}</legend>
        <div className="flex flex-wrap gap-2" aria-label="Opening days">
          {weekdays.map((day) => {
            const selected = hours.days.includes(day.value);
            return <button className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${selected ? "border-[#118778] bg-[#e7f5f0] text-[#0e6f62]" : "border-[#d5e2dd] bg-white text-[#71817d]"}`} key={day.value} type="button" aria-pressed={selected} onClick={() => changeHours({ ...hours, days: selected ? hours.days.filter((item) => item !== day.value) : [...hours.days, day.value] })}>{day.value}</button>;
          })}
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="grid gap-1 text-xs font-medium text-[#52645f]">Opens
            <input className={fieldClass} type="time" step={300} required disabled={hours.alwaysOpen} value={hours.start} onChange={(event) => changeHours({ ...hours, start: event.target.value })} />
          </label>
          <label className="grid gap-1 text-xs font-medium text-[#52645f]">Closes
            <input className={fieldClass} type="time" step={300} required disabled={hours.alwaysOpen} value={hours.end} onChange={(event) => changeHours({ ...hours, end: event.target.value })} />
          </label>
          <label className="grid gap-1 text-xs font-medium text-[#52645f]">Timezone
            <select className={fieldClass} required value={hours.timezone} onChange={(event) => changeHours({ ...hours, timezone: event.target.value })}>
              {timezoneOptions.map((timezone) => <option key={timezone} value={timezone}>{timezone}</option>)}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#52645f]">
          <label className="flex items-center gap-2"><input className="accent-[#118778]" type="checkbox" checked={hours.alwaysOpen} onChange={(event) => changeHours({ ...hours, alwaysOpen: event.target.checked, closesNextDay: false })} />Open 24 hours</label>
          {!hours.alwaysOpen ? <label className="flex items-center gap-2"><input className="accent-[#118778]" type="checkbox" checked={hours.closesNextDay} onChange={(event) => changeHours({ ...hours, closesNextDay: event.target.checked })} />Closing time is next day</label> : null}
        </div>
        {hint}
      </fieldset>
    );
  }

  if (question.control === "weekdays") {
    const selectedDays = value.split(",").filter(Boolean);
    return (
      <fieldset className="grid gap-2 rounded-xl border border-[#dce7e3] bg-[#fbfdfc] p-4 sm:col-span-2">
        <legend className="px-1 text-xs font-semibold text-[#52645f]">{label}</legend>
        <div className="flex flex-wrap gap-2">
          {weekdays.map((day) => {
            const selected = selectedDays.includes(day.value);
            return <button className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${selected ? "border-[#118778] bg-[#e7f5f0] text-[#0e6f62]" : "border-[#d5e2dd] bg-white text-[#71817d]"}`} key={day.value} type="button" aria-pressed={selected} onClick={() => onChange((selected ? selectedDays.filter((item) => item !== day.value) : [...selectedDays, day.value]).join(","))}>{day.value}</button>;
          })}
        </div>
        {hint}
      </fieldset>
    );
  }

  if (question.control === "timezone") {
    return <label className="grid gap-1.5 text-xs font-semibold text-[#52645f]" htmlFor={inputId}>{label}<select className={fieldClass} id={inputId} required={question.required} value={value} onChange={(event) => onChange(event.target.value)}>{timezoneOptions.map((timezone) => <option key={timezone} value={timezone}>{timezone}</option>)}</select>{hint}</label>;
  }

  if (question.control === "time") {
    return <label className="grid gap-1.5 text-xs font-semibold text-[#52645f]" htmlFor={inputId}>{label}<input className={fieldClass} id={inputId} type="time" step={300} required={question.required} value={value} onChange={(event) => onChange(event.target.value)} />{hint}</label>;
  }

  if (question.control === "duration") {
    return <label className="grid gap-1.5 text-xs font-semibold text-[#52645f]" htmlFor={inputId}>{label}<select className={fieldClass} id={inputId} required={question.required} value={value} onChange={(event) => onChange(event.target.value)}>{[15, 20, 30, 45, 60, 90, 120].map((minutes) => <option key={minutes} value={minutes}>{minutes} minutes</option>)}</select>{hint}</label>;
  }

  if (question.control === "textarea") {
    return <label className="grid gap-1.5 text-xs font-semibold text-[#52645f] sm:col-span-2" htmlFor={inputId}>{label}<textarea className={`${fieldClass} min-h-24 py-3`} id={inputId} maxLength={300} required={question.required} placeholder={question.hint} value={value} onChange={(event) => onChange(event.target.value)} />{hint}</label>;
  }

  return <label className="grid gap-1.5 text-xs font-semibold text-[#52645f]" htmlFor={inputId}>{label}<input className={fieldClass} id={inputId} maxLength={300} required={question.required} placeholder={question.hint} value={value} onChange={(event) => onChange(event.target.value)} />{hint}</label>;
}

export function GuidedAgentCreateDialog({ onClose, onCreated }: Props) {
  const [step, setStep] = useState<Step>("start");
  const [templates, setTemplates] = useState<AgentTemplate[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [hours, setHours] = useState<HoursDraft>(defaultHours);
  const [mode, setMode] = useState<GuidedAgentInput["mode"]>("requests");
  const [language, setLanguage] = useState("English");
  const [name, setName] = useState("");
  const [staffPhone, setStaffPhone] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [prompt, setPrompt] = useState("");
  const [preview, setPreview] = useState<GuidedAgentPreview | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void voiceApi.agentTemplates()
      .then(({ templates: loaded }) => { if (active) setTemplates(loaded); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Could not load business types."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const selected = useMemo(() => templates.find((template) => template.id === selectedId), [templates, selectedId]);
  const questions = (selected?.questions ?? [])
    .filter((question) => mode !== "requests" || (!scheduleFields.has(question.id) && question.id !== "handoff"))
    .map((question) => ({ ...question, required: mode === "requests" ? question.requestRequired ?? question.required : question.required }));

  function selectTemplate(template: AgentTemplate) {
    setSelectedId(template.id);
    setHours(defaultHours);
    setAnswers(initialAnswers(template));
    setName("");
    setStaffPhone("");
    setStaffEmail("");
    setPreview(null);
    setPrompt("");
    setError("");
    setMode("requests");
    setShowAdvanced(false);
    setStep("details");
  }

  function draftInput(override?: string): GuidedAgentInput {
    return { answers, mode, language, name: name.trim(), timezone: hours.timezone, staffPhone: staffPhone.trim(), staffEmail: staffEmail.trim(), ...(override ? { promptOverride: override } : {}) };
  }

  async function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || busy) return;
    const missing = questions.find((question) => question.required && !answers[question.id]?.trim());
    if (missing) { setError(`${missing.label} is required.`); return; }
    if (!hours.days.length || (!hours.alwaysOpen && !hours.closesNextDay && hours.end <= hours.start)) {
      setError(!hours.days.length ? "Select at least one opening day." : "Closing time must be after opening time, or mark it as next day.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const result = await voiceApi.previewAgentTemplate(selected.id, draftInput());
      setPreview(result);
      setPrompt(result.generatedPrompt);
      setShowAdvanced(false);
      setStep("review");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not check your setup. Please try again.");
    } finally { setBusy(false); }
  }

  async function create() {
    if (!selected || !preview || busy) return;
    setBusy(true);
    setError("");
    try {
      const { agent } = await voiceApi.createAgentFromTemplate(selected.id, {
        ...draftInput(prompt.trim() !== preview.generatedPrompt ? prompt : undefined),
        activate: mode === "requests",
      });
      onCreated(agent._id);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not create your receptionist. Please try again.");
    } finally { setBusy(false); }
  }

  async function createBlank(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || busy) return;
    setBusy(true);
    setError("");
    try {
      const { agent } = await voiceApi.createAgent({ name: name.trim() });
      onCreated(agent._id);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not create agent.");
    } finally { setBusy(false); }
  }

  const renderQuestion = (question: GuidedQuestion) => <QuestionField key={question.id} question={question} value={answers[question.id] ?? ""} hours={hours} onChange={(value) => setAnswers((current) => ({ ...current, [question.id]: value }))} onHoursChange={setHours} />;
  const blankPath = step === "details" && !selected;
  const progressLabels = blankPath ? ["Setup", "Agent details"] : ["Setup", "Template", "Your details", "Activate"];
  const stepNumber = step === "start" ? 1 : step === "choose" ? 2 : step === "details" ? (selected ? 3 : 2) : 4;
  const primaryButton = "rounded-lg bg-[#118778] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#14231f]/40 p-3 backdrop-blur-[6px] sm:p-6" role="dialog" aria-modal="true" aria-labelledby="guided-agent-title">
      <div className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#dfe7e4] bg-white shadow-[0_28px_80px_rgba(34,38,74,0.24)]">
        <header className="flex items-start justify-between gap-4 border-b border-[#e5ece9] px-5 py-4 sm:px-7">
          <div>
            <p className="m-0 text-[11px] font-bold uppercase tracking-[0.15em] text-[#118778]">Your business receptionist</p>
            <h2 className="mt-1 text-xl font-bold text-[#14231f]" id="guided-agent-title">{step === "start" ? "How would you like to begin?" : step === "choose" ? "Choose a ready template" : step === "details" ? selected ? "Tell us about your business" : "Create a blank agent" : "Your receptionist is prepared"}</h2>
            <p className="mt-1 text-sm text-[#71817d]">{step === "start" ? "Choose the setup that fits you. You can change everything later." : "Add your details. Vozon prepares the conversation and request capture for you."}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2" aria-label={`Step ${stepNumber} of ${progressLabels.length}`}>
              {progressLabels.map((label, index) => <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${index + 1 === stepNumber ? "bg-[#118778] text-white" : "bg-[#f2f5f4] text-[#71817d]"}`} key={label}>{index + 1}. {label}</span>)}
            </div>
          </div>
          <button className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#dfe7e4] text-xl text-[#52645f]" type="button" aria-label="Close receptionist setup" disabled={busy} onClick={onClose}>&times;</button>
        </header>
        <div className="overflow-y-auto px-5 py-5 sm:px-7">
          {error ? <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{error}</div> : null}
          {step === "start" ? <div className="grid gap-4 sm:grid-cols-2">
            <button className="group min-h-52 rounded-2xl border-2 border-[#b8d9d1] bg-[#f1f9f6] p-6 text-left transition hover:border-[#118778] hover:shadow-lg" type="button" onClick={() => { setError(""); setStep("choose"); }}>
              <span className="inline-flex rounded-full bg-[#118778] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Recommended</span>
              <strong className="mt-5 block text-xl text-[#14231f]">Use a ready template</strong>
              <span className="mt-3 block text-sm leading-6 text-[#52645f]">Choose your business type. Vozon prepares the receptionist, questions, and request tools automatically.</span>
              <span className="mt-5 block text-sm font-bold text-[#0e6f62]">Choose a template &rarr;</span>
            </button>
            <button className="group min-h-52 rounded-2xl border-2 border-[#dce7e3] bg-white p-6 text-left transition hover:border-[#118778] hover:bg-[#fbfdfc] hover:shadow-lg" type="button" onClick={() => { setSelectedId(""); setName(""); setPreview(null); setPrompt(""); setError(""); setStep("details"); }}>
              <span className="inline-flex rounded-full bg-[#f2f5f4] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#52645f]">Advanced</span>
              <strong className="mt-5 block text-xl text-[#14231f]">Start from scratch</strong>
              <span className="mt-3 block text-sm leading-6 text-[#52645f]">Create a blank agent and configure its conversation, voice, tools, and integrations yourself.</span>
              <span className="mt-5 block text-sm font-bold text-[#0e6f62]">Create a blank agent &rarr;</span>
            </button>
          </div> : null}
          {step === "choose" ? <div>
            {loading ? <p className="text-sm text-[#71817d]" role="status">Loading business types...</p> : null}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{templates.map((template) => <button className="min-h-36 rounded-xl border border-[#dce7e3] bg-white p-4 text-left transition hover:border-[#118778] hover:bg-[#f1f9f6]" key={template.id} type="button" onClick={() => selectTemplate(template)}><strong className="block text-base text-[#14231f]">{template.name}</strong><span className="mt-2 block text-xs leading-5 text-[#71817d]">{template.description}</span></button>)}</div>
            <button className="mt-5 text-sm font-semibold text-[#0e6f62]" type="button" onClick={() => { setError(""); setStep("start"); }}>&larr; Back to setup options</button>
          </div> : null}
          {step === "details" && !selected ? <form className="grid gap-4" onSubmit={(event) => void createBlank(event)}>
            <label className="grid gap-2 text-sm">Agent name<input className={fieldClass} required maxLength={80} value={name} onChange={(event) => setName(event.target.value)} /></label>
            <div className="flex justify-between gap-3"><button type="button" disabled={busy} onClick={() => setStep("start")}>Back</button><button className={primaryButton} disabled={busy} type="submit">{busy ? "Creating..." : "Create blank draft"}</button></div>
          </form> : null}
          {step === "details" && selected ? <form className="grid gap-5" onSubmit={(event) => void review(event)}>
            <fieldset disabled={busy} className="grid gap-5">
              <div className="rounded-xl bg-[#f1f9f6] p-4 text-sm leading-6 text-[#29423b]">{mode === "requests" ? requestSummaries[selected.id] : integrationChoices.find((choice) => choice.mode === mode)?.detail}</div>
              <div className="grid gap-4 sm:grid-cols-2">
                {questions.filter((question) => question.required).map(renderQuestion)}
                <label className="grid gap-1.5 text-xs font-semibold text-[#52645f]">Conversation language<select className={fieldClass} value={language} onChange={(event) => setLanguage(event.target.value)}>{languageOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                <label className="grid gap-1.5 text-xs font-semibold text-[#52645f]">Staff phone (optional)<input className={fieldClass} type="tel" maxLength={40} placeholder="+919876543210" value={staffPhone} onChange={(event) => setStaffPhone(event.target.value)} /><span className="font-normal text-[#8a9894]">Use a separate staff number for callers who need a person.</span></label>
                <label className="grid gap-1.5 text-xs font-semibold text-[#52645f]">Staff email (optional)<input className={fieldClass} type="email" maxLength={160} placeholder="reception@yourbusiness.com" value={staffEmail} onChange={(event) => setStaffEmail(event.target.value)} /><span className="font-normal text-[#8a9894]">Receive follow-up notifications after calls. Saved requests are also in your dashboard.</span></label>
              </div>
              {questions.some((question) => !question.required) ? <details className="rounded-xl border border-[#dce7e3] p-4"><summary className="cursor-pointer text-sm font-semibold text-[#52645f]">Add prices, policies, or other details (optional)</summary><div className="mt-4 grid gap-4 sm:grid-cols-2">{questions.filter((question) => !question.required).map(renderQuestion)}</div></details> : null}
              <details className="rounded-xl border border-[#dce7e3] p-4"><summary className="cursor-pointer text-sm font-semibold text-[#52645f]">Advanced setup</summary><div className="mt-4 grid gap-3">
                <label className="grid gap-2 text-xs font-semibold text-[#52645f]">Receptionist name (optional)<input className={fieldClass} maxLength={80} value={name} onChange={(event) => setName(event.target.value)} /></label>
                {integrationChoices.filter((choice) => choice.mode !== "native" || selected.id === "clinic_appointments").map((choice) => <label className="flex items-start gap-3 rounded-lg border border-[#dce7e3] p-3" key={choice.mode}><input className="mt-1 accent-[#118778]" type="radio" name="integration-mode" checked={mode === choice.mode} onChange={() => setMode(choice.mode)} /><span><strong className="block text-sm">{choice.title}</strong><span className="mt-1 block text-xs leading-5 text-[#71817d]">{choice.detail}</span></span></label>)}
              </div></details>
            </fieldset>
            <div className="flex justify-between gap-3"><button className="text-sm font-semibold text-[#0e6f62]" type="button" disabled={busy} onClick={() => setStep("choose")}>Back</button><button className={primaryButton} type="submit" disabled={busy}>{busy ? "Checking your setup..." : "Continue"}</button></div>
          </form> : null}
          {step === "review" && preview && selected ? <div className="grid gap-5">
            <section className="rounded-xl border border-[#c5ded5] bg-[#f1f9f6] p-5">
              <h3 className="text-lg font-bold text-[#14231f]">{preview.name}</h3>
              <p className="mt-2 text-sm leading-6 text-[#40564f]">{mode === "requests" ? requestSummaries[selected.id] : mode === "native" ? "Check the Vozon clinic schedule and book new appointments. Staff handle changes and cancellations." : "Your conversation is prepared. Connect the selected business software before activating automatic actions."}</p>
              <ul className="mt-4 grid gap-2 text-sm text-[#29423b]"><li>Business details checked</li><li>Conversation prepared in {language}</li>{preview.tools.length ? <li>{mode === "requests" ? "Request capture configured" : "Appointment actions configured"}</li> : null}<li>Call results configured</li></ul>
              <p className="mt-4 border-t border-[#c5ded5] pt-3 text-xs leading-5 text-[#52645f]">{staffPhone ? `Staff contact: ${staffPhone}. If a transfer fails, the receptionist offers to take a request.` : "When a caller needs a person, the receptionist offers to take a staff request."}</p>
            </section>
            <section className="rounded-xl border border-[#dce7e3] p-4"><h3 className="text-sm font-bold text-[#14231f]">What happens next?</h3><p className="mt-2 text-sm leading-6 text-[#52645f]">{mode === "requests" ? "Activate your receptionist, then connect a phone number to receive calls. Requests will appear in your dashboard. You can listen to your receptionist whenever you like; a test call is optional." : "Save your draft and finish the selected scheduling or software setup before turning on phone calls."}</p></section>
            <details className="rounded-xl border border-[#dce7e3] p-4" open={showAdvanced}><summary className="cursor-pointer text-sm font-semibold text-[#52645f]" onClick={(event) => { event.preventDefault(); setShowAdvanced((current) => !current); }}>Advanced: conversation and actions</summary>{showAdvanced ? <div className="mt-3 grid gap-3"><label className="grid gap-2 text-sm">Conversation instructions<textarea className={`${fieldClass} min-h-64 p-3 font-mono`} maxLength={5000} value={prompt} onChange={(event) => setPrompt(event.target.value)} /></label><button className="w-fit text-xs font-semibold text-[#0e6f62]" type="button" onClick={() => setPrompt(preview.generatedPrompt)}>Restore prepared instructions</button><ul className="grid gap-2 text-xs text-[#52645f]">{preview.tools.map((tool) => <li key={tool.name}><strong>{tool.name}</strong>: {tool.description}</li>)}</ul></div> : null}</details>
            <div className="flex justify-between gap-3"><button className="text-sm font-semibold text-[#0e6f62]" type="button" disabled={busy} onClick={() => { setError(""); setStep("details"); }}>Edit details</button><button className={primaryButton} type="button" disabled={busy || !prompt.trim()} onClick={() => void create()}>{busy ? "Preparing..." : mode === "requests" ? "Activate receptionist" : "Create draft"}</button></div>
          </div> : null}
        </div>
      </div>
    </div>
  );
}
