"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

import { voiceApi, type AgentTemplate, type GuidedAgentInput, type GuidedAgentPreview } from "@/lib/voice";

type Step = "choose" | "details" | "review";
type Props = { onClose: () => void; onCreated: (agentId: string) => void };

const integrationChoices: { mode: GuidedAgentInput["mode"]; title: string; detail: string }[] = [
  { mode: "native", title: "Vozon managed workflow", detail: "The template's built-in action tools are added automatically and results are stored in Vozon with API access." },
  { mode: "collect", title: "Collect details", detail: "Start with call outcomes. Configure staff notifications or a webhook later." },
  { mode: "external", title: "My existing software", detail: "Create a draft, then connect API or webhook tools in the agent's Tools tab." },
  { mode: "digitalbot", title: "DigitalBot", detail: "Create a draft, then connect DigitalBot to attach its available tools." },
];

const fieldClass = "min-h-11 w-full rounded-lg border border-[#d5e2dd] bg-white px-3 text-sm text-[#14231f] outline-none transition focus:border-[#118778] focus:ring-4 focus:ring-[#118778]/10";

export function GuidedAgentCreateDialog({ onClose, onCreated }: Props) {
  const [step, setStep] = useState<Step>("choose");
  const [templates, setTemplates] = useState<AgentTemplate[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<GuidedAgentInput["mode"]>("collect");
  const [language, setLanguage] = useState("English");
  const [name, setName] = useState("");
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
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Could not load templates."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const selected = useMemo(() => templates.find((template) => template.id === selectedId), [templates, selectedId]);

  function selectTemplate(template: AgentTemplate) {
    setSelectedId(template.id);
    setAnswers({});
    setName("");
    setPreview(null);
    setPrompt("");
    setError("");
    setMode("native");
    setStep("details");
  }

  function draftInput(override?: string): GuidedAgentInput {
    return { answers, mode, language: language.trim(), name: name.trim(), ...(override ? { promptOverride: override } : {}) };
  }

  async function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    setBusy(true);
    setError("");
    try {
      const result = await voiceApi.previewAgentTemplate(selected.id, draftInput());
      setPreview(result);
      setPrompt(result.generatedPrompt);
      setShowAdvanced(false);
      setStep("review");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not generate this agent.");
    } finally {
      setBusy(false);
    }
  }

  async function create() {
    if (!selected || !preview) return;
    setBusy(true);
    setError("");
    try {
      const { agent } = await voiceApi.createAgentFromTemplate(
        selected.id,
        draftInput(prompt.trim() !== preview.generatedPrompt ? prompt : undefined),
      );
      onCreated(agent._id);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not create this agent.");
    } finally {
      setBusy(false);
    }
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
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#14231f]/40 p-3 backdrop-blur-[6px] sm:p-6" role="dialog" aria-modal="true" aria-labelledby="guided-agent-title">
      <div className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#dfe7e4] bg-white shadow-[0_28px_80px_rgba(34,38,74,0.24)]">
        <header className="flex items-start justify-between gap-4 border-b border-[#e5ece9] px-5 py-4 sm:px-7">
          <div>
            <p className="m-0 text-[11px] font-bold uppercase tracking-[0.15em] text-[#118778]">Guided agent setup</p>
            <h2 className="mt-1 text-xl font-bold text-[#14231f]" id="guided-agent-title">
              {step === "choose" ? "What should your agent do?" : step === "details" ? selected?.name : "Review your agent"}
            </h2>
            <p className="mt-1 text-sm text-[#71817d]">Choose a workflow, answer a few questions, then review a focused prompt.</p>
          </div>
          <button className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#dfe7e4] text-xl text-[#52645f] hover:bg-[#f7f9f8]" type="button" aria-label="Close agent setup" disabled={busy} onClick={onClose}>×</button>
        </header>

        <div className="overflow-y-auto px-5 py-5 sm:px-7">
          {error ? <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{error}</div> : null}
          {step === "choose" ? (
            <div>
              {loading ? <p className="text-sm text-[#71817d]" role="status">Loading workflows…</p> : null}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                  <button className="group min-h-36 rounded-xl border border-[#dce7e3] bg-white p-4 text-left transition hover:border-[#118778] hover:bg-[#f1f9f6] hover:shadow-sm" key={template.id} type="button" onClick={() => selectTemplate(template)}>
                    <span className="mb-3 grid size-9 place-items-center rounded-lg bg-[#e7f5f0] text-sm font-bold text-[#0e6f62]">{template.name.slice(0, 1)}</span>
                    <strong className="block text-sm text-[#14231f]">{template.name}</strong>
                    <span className="mt-1.5 block text-xs leading-5 text-[#71817d]">{template.description}</span>
                  </button>
                ))}
              </div>
              <div className="mt-5 rounded-xl border border-[#dce7e3] bg-[#f8fbfa] p-4">
                <strong className="block text-sm text-[#14231f]">Need full control?</strong>
                <p className="mt-1 text-xs leading-5 text-[#71817d]">Create a blank draft and configure its prompt, voice, tools, and knowledge yourself.</p>
                <button className="mt-3 text-sm font-semibold text-[#0e6f62] hover:underline" type="button" onClick={() => { setSelectedId(""); setAnswers({}); setPreview(null); setStep("details"); }}>Start with a blank agent →</button>
              </div>
            </div>
          ) : null}

          {step === "details" && !selected ? (
            <form className="grid gap-4" onSubmit={(event) => void createBlank(event)}>
              <label className="grid gap-1.5 text-xs font-semibold text-[#52645f]">Agent name
                <input className={fieldClass} autoFocus required maxLength={80} placeholder="Example: Customer support" value={name} onChange={(event) => setName(event.target.value)} />
              </label>
              <div className="flex justify-between gap-2"><button className="text-sm font-semibold text-[#0e6f62]" type="button" disabled={busy} onClick={() => setStep("choose")}>← Back</button><button className="rounded-lg bg-[#118778] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50" disabled={busy || !name.trim()} type="submit">{busy ? "Creating…" : "Create blank draft"}</button></div>
            </form>
          ) : null}

          {step === "details" && selected ? (
            <form className="grid gap-5" onSubmit={(event) => void review(event)}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-xs font-semibold text-[#52645f]">Agent name <span className="font-normal text-[#8a9894]">Optional</span>
                  <input className={fieldClass} maxLength={80} placeholder={`${selected.name}`} value={name} onChange={(event) => setName(event.target.value)} />
                </label>
                <label className="grid gap-1.5 text-xs font-semibold text-[#52645f]">Conversation language
                  <input className={fieldClass} required maxLength={60} value={language} onChange={(event) => setLanguage(event.target.value)} />
                </label>
                {selected.questions.map((question) => (
                  <label className="grid gap-1.5 text-xs font-semibold text-[#52645f]" key={question.id}>{question.label}{question.required ? " *" : ""}
                    <input className={fieldClass} maxLength={300} required={question.required} placeholder={question.hint} value={answers[question.id] ?? ""} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))} />
                    {question.hint ? <span className="font-normal leading-4 text-[#8a9894]">{question.hint}</span> : null}
                  </label>
                ))}
              </div>
              <fieldset className="grid gap-2 border-0 p-0">
                <legend className="mb-2 text-sm font-bold text-[#14231f]">Where should business results go?</legend>
                {integrationChoices.map((choice) => (
                  <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${mode === choice.mode ? "border-[#118778] bg-[#f1f9f6]" : "border-[#dce7e3]"}`} key={choice.mode}>
                    <input className="mt-0.5 accent-[#118778]" type="radio" name="integration-mode" checked={mode === choice.mode} onChange={() => setMode(choice.mode)} />
                    <span><strong className="block text-sm text-[#14231f]">{choice.title}</strong><span className="mt-0.5 block text-xs leading-5 text-[#71817d]">{choice.detail}</span></span>
                  </label>
                ))}
              </fieldset>
              <div className="flex justify-between gap-2"><button className="text-sm font-semibold text-[#0e6f62]" type="button" onClick={() => setStep("choose")}>← Templates</button><button className="rounded-lg bg-[#118778] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50" type="submit" disabled={busy}>{busy ? "Generating…" : "Review agent →"}</button></div>
            </form>
          ) : null}

          {step === "review" && preview && selected ? (
            <div className="grid gap-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[#dce7e3] bg-[#f8fbfa] p-4"><span className="text-[11px] font-bold uppercase tracking-wider text-[#71817d]">Draft agent</span><strong className="mt-1 block text-sm text-[#14231f]">{preview.name}</strong><p className="mt-2 text-xs text-[#52645f]">Greeting: {preview.firstMessage}</p></div>
                <div className="rounded-xl border border-[#dce7e3] bg-[#f8fbfa] p-4"><span className="text-[11px] font-bold uppercase tracking-wider text-[#71817d]">Result destination</span><strong className="mt-1 block text-sm text-[#14231f]">{integrationChoices.find((choice) => choice.mode === mode)?.title}</strong><p className="mt-2 text-xs text-[#52645f]">{mode === "native" ? "Vozon adds the correct managed tools for this workflow when the draft is created." : "Tools are connected and tested after the draft is created."}</p></div>
              </div>
              <div className="rounded-xl border border-[#dce7e3] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2"><div><strong className="text-sm text-[#14231f]">Generated instructions</strong><p className="mt-0.5 text-xs text-[#71817d]">Approx. {Math.ceil(prompt.length / 4)} tokens. Detailed services and policies belong in Knowledge.</p></div><button className="text-xs font-semibold text-[#0e6f62] hover:underline" type="button" onClick={() => setShowAdvanced((current) => !current)}>{showAdvanced ? "Close editor" : "Advanced: edit prompt"}</button></div>
                {showAdvanced ? <textarea className={`${fieldClass} mt-3 min-h-64 resize-y p-3 font-mono leading-5`} maxLength={5000} value={prompt} onChange={(event) => setPrompt(event.target.value)} /> : <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-[#f7f9f8] p-3 text-xs leading-5 text-[#40564f]">{prompt}</pre>}
                {showAdvanced && prompt !== preview.generatedPrompt ? <button className="mt-2 text-xs font-semibold text-[#0e6f62] hover:underline" type="button" onClick={() => setPrompt(preview.generatedPrompt)}>Restore generated instructions</button> : null}
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">{mode === "native" ? "This creates a Draft with Vozon-managed tools for the selected workflow. Inventory-dependent requests remain pending until staff or connected software confirms them." : "This creates a Draft. Connect and test any booking, CRM, payment, or DigitalBot tools before publishing. The agent will not claim an action is confirmed without a successful tool result."}</div>
              <div className="flex justify-between gap-2"><button className="text-sm font-semibold text-[#0e6f62]" type="button" disabled={busy} onClick={() => setStep("details")}>← Edit answers</button><button className="rounded-lg bg-[#118778] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50" type="button" disabled={busy || !prompt.trim()} onClick={() => void create()}>{busy ? "Creating…" : "Create draft agent"}</button></div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
