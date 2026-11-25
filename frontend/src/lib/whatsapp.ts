import { getAuthHeaders, getSession } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export type WhatsAppTemplateButton = {
  type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
  text: string;
  value?: string;
};

export type WhatsAppTemplate = {
  _id: string;
  name: string;
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  language: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  headerType: "NONE" | "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT";
  headerText?: string;
  headerMediaUrl?: string;
  bodyText: string;
  footerText?: string;
  buttons: WhatsAppTemplateButton[];
  createdAt: string;
};

export type WhatsAppTemplateHeaderType = "NONE" | "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT";

export type WhatsAppContactGroup = {
  _id: string;
  name: string;
  description: string;
  color: string;
  contactCount: number;
  createdAt: string;
};

export type WhatsAppContact = {
  _id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  groupIds: Array<{ _id: string; name: string; color: string } | string>;
  tags: string[];
  status: "subscribed" | "opted_out" | "pending_consent";
  lastContactedAt?: string;
  createdAt: string;
};

export type WhatsAppCampaign = {
  _id: string;
  name: string;
  templateId?: string;
  templateName: string;
  groupId?: string;
  groupName: string;
  senderPhoneNumberId?: string;
  senderDisplayPhone?: string;
  status: "draft" | "scheduled" | "running" | "completed" | "failed";
  failureReason?: string;
  scheduledAt?: string;
  sentAt?: string;
  stats: {
    recipients: number;
    sent: number;
    delivered: number;
    read: number;
    replied: number;
    failed: number;
  };
  createdAt: string;
};

export type WhatsAppAgentConfig = {
  _id?: string;
  name: string;
  voiceAgentId?: string;
  enabled: boolean;
  autoReply: boolean;
  welcomeMessage: string;
  fallbackMessage: string;
  transferKeywords: string[];
  businessHoursOnly: boolean;
  adminDispatchPhones?: string[];
  adminDispatchAutomationId?: string;
  adminDispatchMaxBatch?: number;
};

export type WhatsAppAgentHandoffRule = {
  _id?: string;
  targetAgentId: string;
  targetAgentName?: string;
  keywords: string[];
  condition?: string;
  announceMessage?: string;
};

export type WhatsAppCustomAgent = {
  _id: string;
  name: string;
  role: string;
  status: "live" | "draft" | "paused";
  isDefault: boolean;
  phoneNumberId?: string;
  displayPhoneNumber?: string;
  language: string;
  tone: "friendly" | "professional" | "concise" | "consultative";
  welcomeMessage: string;
  systemPrompt: string;
  knowledgeText?: string;
  voiceAgentId?: string;
  autoReply: boolean;
  allowCallback: boolean;
  triggerKeywords: string[];
  handoffRules?: WhatsAppAgentHandoffRule[];
  transferKeywords: string[];
  fallbackMessage: string;
  createdAt?: string;
  updatedAt?: string;
};

export type WhatsAppConversation = {
  _id: string;
  contactPhone: string;
  contactName: string;
  recipientPhoneNumberId?: string;
  recipientDisplayPhone?: string;
  lastMessageText: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  status: "open" | "resolved";
  mode: "ai" | "human";
  tags: string[];
};

export type WhatsAppMessage = {
  _id: string;
  conversationId: string;
  direction: "inbound" | "outbound";
  senderPhone: string;
  recipientPhone: string;
  type: "text" | "template" | "image" | "document" | "interactive";
  content: string;
  status: "sent" | "delivered" | "read" | "failed";
  createdAt: string;
};

export type WhatsAppFormField = {
  id: string;
  label: string;
  type: "text" | "number" | "email" | "phone" | "dropdown" | "date";
  required: boolean;
  options?: string[];
};

export type WhatsAppForm = {
  _id: string;
  title: string;
  description?: string;
  triggerKeyword: string;
  submissionCount: number;
  status: "active" | "draft" | "paused";
  fields: WhatsAppFormField[];
  createdAt: string;
};

export type WhatsAppFormSubmission = {
  _id: string;
  formId: string;
  contactPhone: string;
  contactName?: string;
  data: Record<string, unknown>;
  submittedAt: string;
};

export type WhatsAppFlowNode = {
  id: string;
  type: "trigger" | "message" | "form" | "condition" | "action";
  title: string;
  description: string;
  mediaType?: "image" | "document";
  mediaUrl?: string;
  buttons?: string[];
  conditionMode?: "reply" | "case_status" | "case_priority";
  caseAction?: "create" | "lookup" | "update_status" | "escalate";
  caseSlaMinutes?: number;
  caseSubject?: string;
  caseCategory?: string;
  casePriority?: "low" | "medium" | "high" | "urgent";
  caseStatus?: "open" | "in_progress" | "resolved";
};

export type WhatsAppFlowEdge = {
  from: string;
  to: string;
  caseLabel?: string;
  matchKeywords?: string;
};

export type WhatsAppSupportCase = {
  _id: string;
  caseNumber: string;
  conversationId?: string;
  contactPhone: string;
  contactName: string;
  subject: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved";
  notes?: string;
  slaDueAt?: string | null;
  slaEscalatedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WhatsAppFlow = {
  _id: string;
  name: string;
  description?: string;
  triggerType: "keyword" | "new_contact" | "campaign_response" | "manual";
  triggerKeyword?: string;
  /** Connected WhatsApp phone number for this flow; empty means all lines. */
  phoneNumberId?: string;
  status: "active" | "draft" | "paused";
  nodes: WhatsAppFlowNode[];
  edges: WhatsAppFlowEdge[];
  executionCount: number;
  createdAt: string;
};

export type WhatsAppAccountItem = {
  accountId: string;
  phoneNumberId: string;
  wabaId: string;
  displayPhoneNumber: string;
  verifiedName: string;
  qualityRating: string;
  codeVerificationStatus: string;
  businessId?: string;
  businessName?: string;
  label?: string;
  isPrimary: boolean;
  lastVerifiedAt?: string;
};

export type WhatsAppConnectionStatus = {
  connected: boolean;
  status: string;
  accountId?: string;
  lastVerifiedAt?: string;
  metadata?: {
    wabaId?: string;
    phoneNumberId?: string;
    displayPhoneNumber?: string;
    verifiedName?: string;
    qualityRating?: string;
    codeVerificationStatus?: string;
    businessId?: string;
    businessName?: string;
    label?: string;
    isPrimary?: boolean;
  };
  accounts?: WhatsAppAccountItem[];
  webhook?: {
    subscribed: boolean;
    receiverReady: boolean;
  };
};

async function req<T>(path: string, options: RequestInit = {}): Promise<T> {
  const session = getSession();
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (session?.token) {
    headers.set("Authorization", `Bearer ${session.token}`);
  }
  const authHeaders = getAuthHeaders();
  for (const [key, val] of Object.entries(authHeaders)) {
    if (val && !headers.has(key)) headers.set(key, val);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `Request failed (${response.status})`;
    throw new Error(errorMsg);
  }
  return data as T;
}

export const whatsappApi = {
  // Connection / Embedded Signup (Multi-Number Supported)
  getStatus: () => req<WhatsAppConnectionStatus>("/api/integrations/whatsapp/status"),
  completeEmbeddedSignup: (payload: {
    code?: string;
    wabaId?: string;
    phoneNumberId?: string;
    businessId?: string;
    accessToken?: string;
    pin?: string;
    label?: string;
    setAsPrimary?: boolean;
  }) => req<{ ok: boolean; message: string; phoneDetails: Record<string, unknown> }>("/api/integrations/whatsapp/embedded-signup", {
    method: "POST",
    body: JSON.stringify(payload),
  }),
  updateAccount: (phoneNumberId: string, payload: { label?: string; isPrimary?: boolean }) =>
    req<{ ok: boolean; message: string; accountId: string; metadata: Record<string, unknown> }>(
      `/api/integrations/whatsapp/accounts/${encodeURIComponent(phoneNumberId)}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    ),
  sendTestMessage: (to: string, message?: string, fromPhoneNumberId?: string) => req<{ ok: boolean; messageId?: string; sentTo?: string; sentFromPhoneNumberId?: string; error?: string }>("/api/integrations/whatsapp/test-message", {
    method: "POST",
    body: JSON.stringify({ to, message, fromPhoneNumberId }),
  }),
  disconnect: (phoneNumberId?: string) => {
    const qs = phoneNumberId ? `?phoneNumberId=${encodeURIComponent(phoneNumberId)}` : "";
    return req<{ ok: boolean; message: string }>(`/api/integrations/whatsapp${qs}`, {
      method: "DELETE",
    });
  },

  // Templates
  listTemplates: () => req<{ ok: boolean; templates: WhatsAppTemplate[] }>("/api/whatsapp/templates"),
  uploadTemplateHeaderSample: async (file: File) => {
    const session = getSession();
    const headers = new Headers();
    if (session?.token) headers.set("Authorization", `Bearer ${session.token}`);
    for (const [key, val] of Object.entries(getAuthHeaders())) {
      if (val && !headers.has(key)) headers.set(key, val);
    }
    const form = new FormData();
    form.append("file", file);
    const response = await fetch(`${API_BASE}/api/whatsapp/templates/header-sample`, {
      method: "POST",
      credentials: "include",
      headers,
      body: form,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.message || data?.error || `Upload failed (${response.status})`);
    return data as { ok: boolean; handle: string };
  },
  createTemplate: (data: Partial<WhatsAppTemplate> & { headerMediaHandle?: string }) => req<{ ok: boolean; template: WhatsAppTemplate }>("/api/whatsapp/templates", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  syncTemplates: () => req<{ ok: boolean; synced: number; templates: WhatsAppTemplate[] }>("/api/whatsapp/templates/sync", {
    method: "POST",
  }),
  deleteTemplate: (id: string) => req<{ ok: boolean }>("/api/whatsapp/templates/" + id, {
    method: "DELETE",
  }),

  // Contact Groups & Contacts
  listContactGroups: () => req<{ ok: boolean; groups: WhatsAppContactGroup[] }>("/api/whatsapp/contact-groups"),
  createContactGroup: (data: { name: string; description?: string; color?: string }) => req<{ ok: boolean; group: WhatsAppContactGroup }>("/api/whatsapp/contact-groups", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  deleteContactGroup: (id: string) => req<{ ok: boolean }>("/api/whatsapp/contact-groups/" + id, {
    method: "DELETE",
  }),

  listContacts: (params?: { groupId?: string; search?: string; tag?: string }) => {
    const query = new URLSearchParams();
    if (params?.groupId) query.set("groupId", params.groupId);
    if (params?.search) query.set("search", params.search);
    if (params?.tag) query.set("tag", params.tag);
    const qs = query.toString() ? `?${query.toString()}` : "";
    return req<{ ok: boolean; contacts: WhatsAppContact[] }>(`/api/whatsapp/contacts${qs}`);
  },
  createContact: (data: { name: string; phoneNumber: string; email?: string; groupIds?: string[]; tags?: string[]; marketingOptIn?: boolean }) => req<{ ok: boolean; contact: WhatsAppContact }>("/api/whatsapp/contacts", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  importContacts: (contacts: Array<{ name: string; phoneNumber: string; email?: string; tags?: string[] }>, defaultGroupId?: string, optInConfirmed = false) => req<{ ok: boolean; count: number }>("/api/whatsapp/contacts/import", {
    method: "POST",
    body: JSON.stringify({ contacts, defaultGroupId, optInConfirmed }),
  }),
  deleteContact: (id: string) => req<{ ok: boolean }>("/api/whatsapp/contacts/" + id, {
    method: "DELETE",
  }),

  // Campaigns
  listCampaigns: () => req<{ ok: boolean; campaigns: WhatsAppCampaign[] }>("/api/whatsapp/campaigns"),
  createCampaign: (data: {
    name: string;
    templateId: string;
    groupId: string;
    scheduleType: "now" | "later";
    scheduledAt?: string;
    senderPhoneNumberId?: string;
    variableMappings?: Record<string, string>;
  }) => req<{ ok: boolean; campaign: WhatsAppCampaign }>("/api/whatsapp/campaigns", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  deleteCampaign: (id: string) => req<{ ok: boolean }>("/api/whatsapp/campaigns/" + id, {
    method: "DELETE",
  }),

  // Agents
  getAgentConfig: () => req<{ ok: boolean; config: WhatsAppAgentConfig }>("/api/whatsapp/agents"),
  updateAgentConfig: (data: Partial<WhatsAppAgentConfig>) => req<{ ok: boolean; config: WhatsAppAgentConfig }>("/api/whatsapp/agents", {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  listCustomAgents: () => req<{ ok: boolean; agents: WhatsAppCustomAgent[] }>("/api/whatsapp/agents/list"),
  createCustomAgent: (data: Partial<WhatsAppCustomAgent>) =>
    req<{ ok: boolean; agent: WhatsAppCustomAgent }>("/api/whatsapp/agents/list", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateCustomAgent: (id: string, data: Partial<WhatsAppCustomAgent>) =>
    req<{ ok: boolean; agent: WhatsAppCustomAgent }>(`/api/whatsapp/agents/list/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteCustomAgent: (id: string) =>
    req<{ ok: boolean; message: string }>(`/api/whatsapp/agents/list/${id}`, {
      method: "DELETE",
    }),
  simulateCustomAgent: (
    id: string,
    payload: {
      message: string;
      contactName?: string;
      history?: Array<{ role: "user" | "assistant"; content: string }>;
      draft?: Partial<WhatsAppCustomAgent>;
    },
  ) =>
    req<{
      ok: boolean;
      reply: string;
      tag?: string;
      handedOffToAgentId?: string;
      handedOffToAgentName?: string;
    }>(`/api/whatsapp/agents/list/${id}/simulate`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Live Chat
  listConversations: () => req<{ ok: boolean; conversations: WhatsAppConversation[] }>("/api/whatsapp/conversations"),
  getMessages: (conversationId: string) => req<{ ok: boolean; messages: WhatsAppMessage[] }>(`/api/whatsapp/conversations/${conversationId}/messages`),
  sendChatMessage: (
    conversationId: string,
    content: string,
    type?: "text" | "image" | "document",
    fromPhoneNumberId?: string,
    mediaUrl?: string,
    filename?: string,
  ) =>
    req<{ ok: boolean; message: WhatsAppMessage }>(`/api/whatsapp/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content, type, fromPhoneNumberId, mediaUrl, filename }),
    }),
  toggleMode: (conversationId: string, mode: "ai" | "human") => req<{ ok: boolean; conversation: WhatsAppConversation }>(`/api/whatsapp/conversations/${conversationId}/mode`, {
    method: "PUT",
    body: JSON.stringify({ mode }),
  }),
  triggerIntegrationAction: (
    conversationId: string,
    payload: {
      action: "razorpay_payment_link" | "calendar_booking" | "crm_sync" | "slack_alert";
      amount?: number;
      currency?: string;
      description?: string;
      title?: string;
      stage?: string;
    },
  ) =>
    req<{ ok: boolean; summary: string; message?: WhatsAppMessage | null }>(
      `/api/whatsapp/conversations/${conversationId}/integration-action`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    ),
  callConversationContact: (conversationId: string, voiceAgentId?: string) =>
    req<{ ok: boolean; callId: string; agentName: string; fromNumber: string; message?: WhatsAppMessage }>(
      `/api/whatsapp/conversations/${conversationId}/call`,
      {
        method: "POST",
        body: JSON.stringify(voiceAgentId ? { voiceAgentId } : {}),
      },
    ),
  listConversationCases: (conversationId: string) =>
    req<{ ok: boolean; cases: WhatsAppSupportCase[] }>(`/api/whatsapp/conversations/${conversationId}/cases`),
  createConversationCase: (
    conversationId: string,
    payload: { subject: string; category?: string; priority?: "low" | "medium" | "high" | "urgent" },
  ) =>
    req<{ ok: boolean; supportCase: WhatsAppSupportCase; message?: WhatsAppMessage | null }>(
      `/api/whatsapp/conversations/${conversationId}/cases`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    ),
  updateSupportCaseStatus: (caseId: string, status: "open" | "in_progress" | "resolved") =>
    req<{ ok: boolean; supportCase: WhatsAppSupportCase; message?: WhatsAppMessage | null }>(
      `/api/whatsapp/cases/${caseId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
    ),

  // Forms
  listForms: () => req<{ ok: boolean; forms: WhatsAppForm[] }>("/api/whatsapp/forms"),
  createForm: (data: { title: string; description?: string; triggerKeyword?: string; fields: WhatsAppFormField[] }) => req<{ ok: boolean; form: WhatsAppForm }>("/api/whatsapp/forms", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  getFormSubmissions: (formId: string) => req<{ ok: boolean; submissions: WhatsAppFormSubmission[] }>(`/api/whatsapp/forms/${formId}/submissions`),

  // Flow Maker
  listFlows: () => req<{ ok: boolean; flows: WhatsAppFlow[] }>("/api/whatsapp/flows"),
  saveFlow: (data: Partial<WhatsAppFlow>) => req<{ ok: boolean; flow: WhatsAppFlow }>("/api/whatsapp/flows", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  deleteFlow: (id: string) => req<{ ok: boolean }>("/api/whatsapp/flows/" + id, {
    method: "DELETE",
  }),
};

