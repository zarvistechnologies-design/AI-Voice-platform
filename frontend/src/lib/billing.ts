import { getSession } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

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

export type BillingSummary = {
  configured: boolean;
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
};

async function request<T>(path: string, init: RequestInit = {}) {
  if (!getSession()) throw new Error("Sign in before managing billing.");
  const response = await fetch(`${API_URL}/api/billing${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const data = (await response.json().catch(() => null)) as (T & { message?: string }) | null;
  if (!response.ok) throw new Error(data?.message ?? "Billing request failed.");
  return (data ?? {}) as T;
}

export const billingApi = {
  summary: () => request<BillingSummary>("/summary"),
  checkout: (plan: Exclude<PlanId, "free">) =>
    request<{ url: string }>("/checkout", {
      method: "POST",
      body: JSON.stringify({ plan }),
    }),
  portal: () => request<{ url: string }>("/portal", { method: "POST" }),
};
