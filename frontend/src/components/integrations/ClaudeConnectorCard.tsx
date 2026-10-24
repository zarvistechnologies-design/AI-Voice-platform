"use client";

import { useCallback, useEffect, useState } from "react";

import { disconnectMcpClient, getMcpConnectionSetup, type McpConnection } from "@/lib/assistant";

function ClaudeSparkIcon({ className = "size-8" }: { className?: string }) {
  return (
    <svg fill="#D97757" role="img" viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <title>Claude</title>
      <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889z"/>
    </svg>
  );
}

export function ClaudeConnectorCard() {
  const [serverUrl, setServerUrl] = useState("");
  const [connections, setConnections] = useState<McpConnection[]>([]);
  const [busyId, setBusyId] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isConnected = connections.length > 0;

  const isLocalUrl = (() => {
    try {
      return ["localhost", "127.0.0.1", "::1"].includes(new URL(serverUrl).hostname);
    } catch {
      return false;
    }
  })();

  const load = useCallback(async () => {
    try {
      const result = await getMcpConnectionSetup();
      setServerUrl(result.serverUrl);
      setConnections(result.connections);
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load Claude connection details.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function copyUrl() {
    if (!serverUrl) return;
    try {
      await navigator.clipboard.writeText(serverUrl);
      setCopied(true);
      setNotice("MCP server URL copied to clipboard.");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setNotice("Select the URL below to copy it manually.");
    }
  }

  async function disconnect(connection: McpConnection) {
    if (!window.confirm(`Disconnect ${connection.clientName} from this Vozon user and workspace?`)) return;
    setBusyId(connection.clientId);
    setError("");
    setNotice("");
    try {
      await disconnectMcpClient(connection.clientId);
      setConnections((current) => current.filter((item) => item.clientId !== connection.clientId));
      setNotice(`${connection.clientName} disconnected.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not disconnect Claude.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <>
      <article className="min-h-[300px] overflow-hidden rounded-xl border border-[#dfe7e4] bg-white transition hover:border-[#9fcfc3] hover:shadow-[0_14px_34px_rgba(17,62,53,.08)]">
        <div className="flex h-full flex-col p-5">
          <div className="flex items-start justify-between gap-4">
            <span className="grid h-12 min-w-12 place-items-start">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#FBF7F4] p-1.5 border border-[#F0E6DE]">
                <ClaudeSparkIcon className="size-full" />
              </span>
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                isConnected ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
              }`}
            >
              {isConnected ? "Connected" : "Available"}
            </span>
          </div>

          <span className="mt-5 text-[10px] font-bold uppercase tracking-[.14em] text-[#71817d]">
            AI & MCP Connector
          </span>

          <h2 className="mt-1 text-xl font-semibold tracking-[-.02em] text-slate-950">
            Claude
          </h2>

          <p className="mt-1 min-h-12 text-sm leading-6 text-slate-600">
            Connect Claude Desktop or Claude.ai to query voice agents and call activity directly from Claude chat.
          </p>

          {isConnected ? (
            <details className="group mt-3 text-xs text-slate-600">
              <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold text-[#0e6f62] marker:content-none">
                {connections.length} connected client{connections.length === 1 ? "" : "s"}
                <span className="transition group-open:rotate-180">⌄</span>
              </summary>
              <div className="mt-2 rounded-xl bg-[#f7f9f8] p-3 space-y-2">
                {connections.map((c) => (
                  <div key={c.clientId} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">{c.clientName}</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(c.connectedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          ) : null}

          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            <button
              className="rounded-lg bg-[#118778] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0e6f62] transition"
              type="button"
              onClick={() => {
                setNotice("");
                setError("");
                setIsModalOpen(true);
              }}
            >
              {isConnected ? "Manage Claude" : "Connect Claude"}
            </button>
          </div>
        </div>
      </article>

      {/* Claude Configuration Modal */}
      {isModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-xl rounded-2xl border border-[#dfe7e4] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-[#FBF7F4] p-1 border border-[#F0E6DE]">
                  <ClaudeSparkIcon className="size-full" />
                </span>
                <div>
                  <h3 className="m-0 text-lg font-semibold text-slate-900">Claude MCP Connector</h3>
                  <p className="m-0 text-xs text-slate-500">Connect Claude to your Vozon workspace via Model Context Protocol</p>
                </div>
              </div>
              <button
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[.1em] text-[#60736c]" htmlFor="modal-mcp-url">
                  Vozon MCP Server URL
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    className="h-10 flex-1 rounded-xl border border-[#dce7e3] bg-[#f8fbfa] px-3 font-mono text-xs text-[#1e443b] outline-none focus:border-[#75b6a5]"
                    id="modal-mcp-url"
                    readOnly
                    value={serverUrl || "Loading connector URL…"}
                  />
                  <button
                    className={`h-10 shrink-0 rounded-xl px-4 font-semibold text-xs transition ${
                      copied
                        ? "bg-emerald-600 text-white"
                        : "border border-[#cbdcd6] bg-white text-[#31564c] hover:bg-[#edf7f4]"
                    }`}
                    type="button"
                    disabled={!serverUrl}
                    onClick={() => void copyUrl()}
                  >
                    {copied ? "Copied!" : "Copy URL"}
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-[#e2ece8] bg-[#fbfdfc] p-4 text-slate-700 space-y-2">
                <p className="font-semibold text-slate-900">How to connect:</p>
                <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                  <li>In Claude Desktop or Claude.ai, open <strong>Settings → Connectors</strong>.</li>
                  <li>Click <strong>Add custom connector</strong> and paste the URL above.</li>
                  <li>Sign in with your Vozon account when prompted to authorize access.</li>
                </ol>
                <div className="pt-2">
                  <a
                    className="inline-flex items-center gap-1.5 font-semibold text-[#0e6f62] hover:underline"
                    href="https://claude.ai/settings/connectors"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Claude Connectors settings ↗
                  </a>
                </div>
              </div>

              {isLocalUrl ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-amber-900 text-[11px] leading-5">
                  <strong>Development mode:</strong> This URL is on localhost. The local Claude Desktop application can connect directly. For Claude.ai cloud connectors, deploy with HTTPS or use an HTTPS tunnel.
                </div>
              ) : null}

              {connections.length ? (
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-800">Connected Claude clients ({connections.length})</strong>
                    <button className="text-[11px] font-semibold text-[#0e6f62] hover:underline" type="button" onClick={() => void load()}>
                      Refresh
                    </button>
                  </div>
                  <ul className="mt-2.5 divide-y divide-slate-100">
                    {connections.map((c) => (
                      <li key={c.clientId} className="flex items-center justify-between py-2">
                        <div>
                          <p className="m-0 font-medium text-slate-800">{c.clientName}</p>
                          <p className="m-0 text-[10px] text-slate-500">Connected on {new Date(c.connectedAt).toLocaleDateString()}</p>
                        </div>
                        <button
                          className="text-xs font-semibold text-rose-600 hover:text-rose-700 disabled:opacity-50"
                          type="button"
                          disabled={busyId === c.clientId}
                          onClick={() => void disconnect(c)}
                        >
                          {busyId === c.clientId ? "Disconnecting…" : "Disconnect"}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {notice ? (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-emerald-800 text-xs">
                  {notice}
                </div>
              ) : null}
              {error ? (
                <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-rose-800 text-xs">
                  {error}
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                type="button"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
