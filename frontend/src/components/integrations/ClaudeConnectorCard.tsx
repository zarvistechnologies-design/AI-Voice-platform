"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import { disconnectMcpClient, getMcpConnectionSetup, type McpConnection } from "@/lib/assistant";

const publicVozonMcpUrl = "https://api.vozon.ai/mcp";

function connectorServerUrl(advertisedUrl: string) {
  try {
    const url = new URL(advertisedUrl);
    if (
      ["vozon.ai", "www.vozon.ai", "vozon.onrender.com"].includes(url.hostname.toLowerCase()) &&
      url.pathname.replace(/\/$/, "") === "/mcp"
    ) {
      return publicVozonMcpUrl;
    }
  } catch {
    // Keep the backend response so a malformed value remains visible for diagnosis.
  }
  return advertisedUrl;
}

export function ClaudeConnectorCard() {
  const [serverUrl, setServerUrl] = useState("");
  const [staticClientId, setStaticClientId] = useState("vozon_claude_connector");
  const [connections, setConnections] = useState<McpConnection[]>([]);
  const [busyId, setBusyId] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedClientId, setCopiedClientId] = useState(false);

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
      setServerUrl(connectorServerUrl(result.serverUrl));
      if (result.staticClientId) {
        setStaticClientId(result.staticClientId);
      }
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

  async function copyClientId() {
    if (!staticClientId) return;
    try {
      await navigator.clipboard.writeText(staticClientId);
      setCopiedClientId(true);
      setNotice("OAuth Client ID copied to clipboard.");
      setTimeout(() => setCopiedClientId(false), 2500);
    } catch {
      setNotice("Select the Client ID below to copy it manually.");
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
                <Image alt="Claude" className="size-full object-contain" height={36} src="/images/integrations/claude.svg" width={36} />
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
              className="rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4ed8] transition"
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
                  <Image alt="Claude" className="size-full object-contain" height={32} src="/images/integrations/claude.svg" width={32} />
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
                  1. Vozon MCP Server URL
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
                    {copied ? "Copied URL!" : "Copy URL"}
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Use the API URL shown here. The website URL, www.vozon.ai/mcp, does not host this connector.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold uppercase tracking-[.1em] text-[#60736c]" htmlFor="modal-client-id">
                    2. OAuth Client ID <span className="font-normal text-slate-500">(only if automatic registration fails)</span>
                  </label>
                </div>
                <div className="mt-1.5 flex gap-2">
                  <input
                    className="h-10 flex-1 rounded-xl border border-[#dce7e3] bg-[#f8fbfa] px-3 font-mono text-xs text-[#1e443b] outline-none focus:border-[#75b6a5]"
                    id="modal-client-id"
                    readOnly
                    value={staticClientId}
                  />
                  <button
                    className={`h-10 shrink-0 rounded-xl px-4 font-semibold text-xs transition ${
                      copiedClientId
                        ? "bg-emerald-600 text-white"
                        : "border border-[#cbdcd6] bg-white text-[#31564c] hover:bg-[#edf7f4]"
                    }`}
                    type="button"
                    onClick={() => void copyClientId()}
                  >
                    {copiedClientId ? "Copied ID!" : "Copy Client ID"}
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Claude can register automatically. Use this ID only if Claude asks for an OAuth client ID; no client secret is needed.
                </p>
              </div>

              <div className="rounded-xl border border-[#e2ece8] bg-[#fbfdfc] p-4 text-slate-700 space-y-2">
                <p className="font-semibold text-slate-900">How to connect in Claude:</p>
                <ol className="list-decimal pl-4 space-y-1.5 text-slate-600">
                  <li>In Claude, open <strong>Customize → Connectors</strong> (or <strong>Organization settings → Connectors</strong> for a team).</li>
                  <li>Click <strong>Add custom connector</strong>.</li>
                  <li>Enter Name (e.g. <strong>Vozon</strong>) and paste the <strong>MCP Server URL</strong> above.</li>
                  <li>Choose <strong>Sign in now</strong> and <strong>Register automatically</strong> for OAuth.</li>
                  <li>If registration fails, choose <strong>Use your own OAuth client</strong> and paste <strong>{staticClientId}</strong> as the client ID.</li>
                  <li>Click Add and sign in with your Vozon account when prompted to authorize.</li>
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
