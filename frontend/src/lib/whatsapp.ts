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
  status: "subscribed" | "opted_out";
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
  status: "draft" | "scheduled" | "running" | "completed" | "failed";
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
};

export type WhatsAppConversation = {
  _id: string;
  contactPhone: string;
  contactName: string;
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
};

export type WhatsAppFlowEdge = {
  from: string;
  to: string;
};

export type WhatsAppFlow = {
  _id: string;
  name: string;
  description?: string;
  triggerType: "keyword" | "new_contact" | "campaign_response" | "manual";
  triggerKeyword?: string;
  status: "active" | "draft" | "paused";
  nodes: WhatsAppFlowNode[];
  edges: WhatsAppFlowEdge[];
  executionCount: number;
  createdAt: string;
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
  // Connection / Embedded Signup
  getStatus: () => req<WhatsAppConnectionStatus>("/api/integrations/whatsapp/status"),
  completeEmbeddedSignup: (payload: {
    code?: string;
    wabaId?: string;
    phoneNumberId?: string;
    businessId?: string;
    accessToken?: string;
    pin?: string;
  }) => req<{ ok: boolean; message: string; phoneDetails: Record<string, unknown> }>("/api/integrations/whatsapp/embedded-signup", {
    method: "POST",
    body: JSON.stringify(payload),
  }),
  sendTestMessage: (to: string, message?: string) => req<{ ok: boolean; messageId?: string; sentTo?: string; error?: string }>("/api/integrations/whatsapp/test-message", {
    method: "POST",
    body: JSON.stringify({ to, message }),
  }),
  disconnect: () => req<{ ok: boolean; message: string }>("/api/integrations/whatsapp", {
    method: "DELETE",
  }),

  // Templates
  listTemplates: () => req<{ ok: boolean; templates: WhatsAppTemplate[] }>("/api/whatsapp/templates"),
  createTemplate: (data: Partial<WhatsAppTemplate>) => req<{ ok: boolean; template: WhatsAppTemplate }>("/api/whatsapp/templates", {
    method: "POST",
    body: JSON.stringify(data),
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
  createContact: (data: { name: string; phoneNumber: string; email?: string; groupIds?: string[]; tags?: string[] }) => req<{ ok: boolean; contact: WhatsAppContact }>("/api/whatsapp/contacts", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  importContacts: (contacts: Array<{ name: string; phoneNumber: string; email?: string; tags?: string[] }>, defaultGroupId?: string) => req<{ ok: boolean; count: number }>("/api/whatsapp/contacts/import", {
    method: "POST",
    body: JSON.stringify({ contacts, defaultGroupId }),
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

  // Live Chat
  listConversations: () => req<{ ok: boolean; conversations: WhatsAppConversation[] }>("/api/whatsapp/conversations"),
  getMessages: (conversationId: string) => req<{ ok: boolean; messages: WhatsAppMessage[] }>(`/api/whatsapp/conversations/${conversationId}/messages`),
  sendChatMessage: (conversationId: string, content: string, type?: string) => req<{ ok: boolean; message: WhatsAppMessage }>(`/api/whatsapp/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content, type }),
  }),
  toggleMode: (conversationId: string, mode: "ai" | "human") => req<{ ok: boolean; conversation: WhatsAppConversation }>(`/api/whatsapp/conversations/${conversationId}/mode`, {
    method: "PUT",
    body: JSON.stringify({ mode }),
  }),

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

