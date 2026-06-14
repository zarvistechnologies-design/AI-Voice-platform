import { RoomAgentDispatch, RoomConfiguration } from "@livekit/protocol";
import { AccessToken, RoomServiceClient, SipClient } from "livekit-server-sdk";

import { env } from "../config/env.js";
import type { VoiceAgentDocument } from "../models/VoiceAgent.js";
import { HttpError } from "../utils/httpError.js";
import { modelCatalog } from "./modelCatalog.js";

export const providerCatalog = [
  {
    id: "openai",
    label: "OpenAI",
    detail: "Realtime, LLM, speech-to-text, text-to-speech, and multiple voices.",
    configured: Boolean(env.openaiApiKey),
  },
  {
    id: "gemini",
    label: "Google Gemini",
    detail: "Gemini Live, LLM models, Gemini text-to-speech, and native voices.",
    configured: Boolean(env.googleApiKey),
  },
  {
    id: "sarvam",
    label: "Sarvam AI",
    detail: "Sarvam LLM, streaming speech-to-text, text-to-speech, and Indic voices.",
    configured: Boolean(env.sarvamApiKey),
  },
] as const;

function requireLiveKit() {
  if (!env.livekitUrl || !env.livekitApiKey || !env.livekitApiSecret) {
    throw new HttpError(503, "Platform voice routing is not configured.");
  }
}

function apiUrl() {
  return env.livekitUrl.replace(/^wss:/, "https:").replace(/^ws:/, "http:");
}

function metadataForAgent(agent: VoiceAgentDocument) {
  return JSON.stringify({
    agentId: agent.id,
    name: agent.name,
    providerModel: agent.providerModel,
    pipelineMode: agent.pipelineMode,
    realtimeProvider: agent.realtimeProvider,
    realtimeModel: agent.realtimeModel,
    llmProvider: agent.llmProvider,
    llmModel: agent.llmModel,
    sttProvider: agent.sttProvider,
    sttModel: agent.sttModel,
    ttsProvider: agent.ttsProvider,
    ttsModel: agent.ttsModel,
    temperature: agent.temperature,
    prompt: agent.prompt,
    firstMessage: agent.firstMessage,
    language: agent.language,
    voice: agent.voice,
  });
}

function dispatchForAgent(agent: VoiceAgentDocument) {
  return new RoomAgentDispatch({
    agentName: env.livekitAgentName,
    metadata: metadataForAgent(agent),
  });
}

function roomName(prefix: string, ownerId: string) {
  const safeOwner = ownerId.replace(/[^a-zA-Z0-9_-]/g, "").slice(-12);
  return `${prefix}-${safeOwner}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
}

export function livekitConfiguration() {
  return {
    configured: Boolean(env.livekitUrl && env.livekitApiKey && env.livekitApiSecret),
    url: env.livekitUrl,
    agentName: env.livekitAgentName,
    sip: {
      inboundConfigured: Boolean(env.livekitSipInboundTrunkId),
      outboundConfigured: Boolean(env.livekitSipOutboundTrunkId && env.livekitSipCallerId),
      callerId: env.livekitSipCallerId,
    },
    providers: providerCatalog,
    modelCatalog,
  };
}

export async function createWebCallToken(agent: VoiceAgentDocument, ownerId: string) {
  requireLiveKit();
  const name = roomName("web-call", ownerId);
  const metadata = metadataForAgent(agent);
  const token = new AccessToken(env.livekitApiKey, env.livekitApiSecret, {
    identity: `web-${crypto.randomUUID()}`,
    name: "Dashboard test caller",
    metadata,
    ttl: "15m",
  });

  token.addGrant({
    roomJoin: true,
    room: name,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });
  token.roomConfig = new RoomConfiguration({
    agents: [dispatchForAgent(agent)],
    emptyTimeout: 60,
    departureTimeout: 30,
  });

  return {
    roomName: name,
    serverUrl: env.livekitUrl,
    participantToken: await token.toJwt(),
  };
}

export async function startOutboundCall(
  agent: VoiceAgentDocument,
  ownerId: string,
  destination: string,
) {
  requireLiveKit();
  if (!env.livekitSipOutboundTrunkId || !env.livekitSipCallerId) {
    throw new HttpError(503, "Outbound phone routing and caller ID are not configured.");
  }

  const name = roomName("outbound-call", ownerId);
  const metadata = metadataForAgent(agent);
  const rooms = new RoomServiceClient(apiUrl(), env.livekitApiKey, env.livekitApiSecret);
  const sip = new SipClient(apiUrl(), env.livekitApiKey, env.livekitApiSecret);

  await rooms.createRoom({
    name,
    emptyTimeout: 60,
    departureTimeout: 30,
    metadata,
    agents: [dispatchForAgent(agent)],
  });

  const participant = await sip.createSipParticipant(
    env.livekitSipOutboundTrunkId,
    destination,
    name,
    {
      fromNumber: env.livekitSipCallerId,
      participantIdentity: `phone-${destination.replace(/\D/g, "")}-${Date.now()}`,
      participantName: destination,
      participantMetadata: metadata,
      waitUntilAnswered: false,
      playDialtone: true,
      krispEnabled: true,
      maxCallDuration: 1800,
    },
  );

  return {
    roomName: name,
    participantId: participant.participantId,
  };
}

export async function createInboundRoute(agent: VoiceAgentDocument, number: string) {
  requireLiveKit();
  if (!env.livekitSipInboundTrunkId) {
    throw new HttpError(503, "Inbound phone routing is not configured.");
  }

  const sip = new SipClient(apiUrl(), env.livekitApiKey, env.livekitApiSecret);
  return sip.createSipDispatchRule(
    { type: "individual", roomPrefix: `inbound-${number.replace(/\D/g, "")}-` },
    {
      name: `${agent.name} - ${number}`,
      trunkIds: [env.livekitSipInboundTrunkId],
      metadata: metadataForAgent(agent),
      roomConfig: new RoomConfiguration({
        agents: [dispatchForAgent(agent)],
        departureTimeout: 30,
      }),
    },
  );
}

export async function listLiveKitTrunks() {
  requireLiveKit();
  const sip = new SipClient(apiUrl(), env.livekitApiKey, env.livekitApiSecret);
  const [inbound, outbound] = await Promise.all([
    sip.listSipInboundTrunk(),
    sip.listSipOutboundTrunk(),
  ]);

  return {
    inbound: inbound.map((trunk) => ({
      id: trunk.sipTrunkId,
      name: trunk.name,
      numbers: trunk.numbers,
    })),
    outbound: outbound.map((trunk) => ({
      id: trunk.sipTrunkId,
      name: trunk.name,
      numbers: trunk.numbers,
    })),
  };
}
