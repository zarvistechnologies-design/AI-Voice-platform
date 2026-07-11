import { API_URL } from "@/lib/apiBase";
import { cachedApiRequest, invalidateApiCache } from "@/lib/apiCache";
import { getAuthHeaders, getSession } from "@/lib/auth";

export type PlanId = "free" | "starter" | "growth" | "enterprise";

export type BillingPlan = {
  id: PlanId;
  name: string;
  monthlyPrice: number | null;
  limits: {
    agents: number | null;
    members: number | null;
    phoneNumbers: number | null;
    monthlyMinutes: number | null;
  };
};

export type CreditWallet = {
  _id: string;
  orgId: string;
  balanceCredits: number;
  lifetimePurchasedCredits: number;
  currency: string;
  autoReloadEnabled: boolean;
  reloadThresholdCredits: number;
  reloadAmountCredits: number;
  paymentProvider: "" | "internal" | "stripe";
  stripeCustomerId: string;
  stripePaymentMethodId: string;
  lastPaymentStatus: "none" | "pending" | "success" | "failed";
  lastPaymentAmountCredits: number;
  lastPaymentAt?: string;
  lastCheckedAt?: string;
  updatedAt: string;
};

export type BillingTransaction = {
  _id: string;
  orgId: string;
  type: "topup" | "deduction" | "refund" | "auto_reload";
  category: "payment" | "call" | "adjustment" | "auto_reload";
  amountCredits: number;
  currency: string;
  description: string;
  callId: string;
  stripeSessionId?: string;
  stripePaymentIntentId: string;
  balanceAfterCredits: number;
  breakdown: {
    llm: number;
    stt: number;
    tts: number;
    telephony: number;
    providerCost: number;
    platformFee: number;
    customerCost: number;
    markupMultiplier: number;
    total: number;
  };
  createdAt: string;
};

export type BillingSummary = {
  configured: boolean;
  wallet: CreditWallet;
  creditSettings: {
    currency: string;
    initialCredits: number;
    minimumCallStartCredits: number;
    markupMultiplier: number;
    platformFeeInrPerCall: number;
  };
  subscription: {
    plan: PlanId;
    provider: "internal" | "stripe";
    status: "active" | "trialing" | "past_due" | "cancelled" | "incomplete";
    stripeCustomerId: string;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd: boolean;
  };
  currentPlan: BillingPlan;
  plans: BillingPlan[];
  usage: {
    agents: number;
    members: number;
    phoneNumbers: number;
    calls: number;
    minutes: number;
    providerCost: number;
    customerCost: number;
    chargedCredits: number;
    llmTokens: number;
    sttSeconds: number;
    ttsCharacters: number;
  };
  invoices: {
    _id: string;
    status: string;
    amountDue: number;
    amountPaid: number;
    currency: string;
    hostedInvoiceUrl: string;
    invoicePdf: string;
    createdAt: string;
  }[];
  transactions: BillingTransaction[];
};

async function request<T>(path: string, init: RequestInit = {}) {
  if (!getSession()) throw new Error("Sign in before managing billing.");
  const response = await fetch(`${API_URL}/api/billing${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...init.headers,
    },
  });
  const data = (await response.json().catch(() => null)) as (T & { message?: string }) | null;
  if (!response.ok) throw new Error(data?.message ?? "Billing request failed.");
  return (data ?? {}) as T;
}

export const billingApi = {
  summary: () => cachedApiRequest("billing", "/summary", 15_000, () => request<BillingSummary>("/summary")),
  transactions: (limit = 50) => request<{ transactions: BillingTransaction[] }>(`/transactions?limit=${limit}`),
  topUp: (amountCredits: number) =>
    request<{ url: string }>("/top-up", {
      method: "POST",
      body: JSON.stringify({ amountCredits }),
    }),
  updateAutoReload: async (input: { enabled: boolean; thresholdCredits: number; reloadAmountCredits: number }) => {
    const result = await request<{ wallet: CreditWallet }>("/auto-reload", {
      method: "PUT",
      body: JSON.stringify(input),
    });
    invalidateApiCache("billing");
    return result;
  },
  checkout: (plan: Exclude<PlanId, "free">) =>
    request<{ url: string }>("/checkout", {
      method: "POST",
      body: JSON.stringify({ plan }),
    }),
  portal: () => request<{ url: string }>("/portal", { method: "POST" }),
};
