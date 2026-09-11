import { API_URL } from "@/lib/apiBase";
import { cachedApiRequest, invalidateApiCache } from "@/lib/apiCache";
import { getAuthHeaders, getSession } from "@/lib/auth";

export type PlanId = "free" | "starter" | "growth" | "enterprise";

export type BillingPlan = {
  id: string;
  name: string;
  monthlyPrice: number | null;
  currency?: string;
  interval?: string;
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
  paymentProvider: "" | "internal" | "razorpay";
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
  paymentReadiness: {
    credentialsConfigured: boolean;
    webhookConfigured: boolean;
    mode: "live" | "test" | "unconfigured" | "partner_managed";
    currency: string;
  };
  enterpriseMonthlyUsd?: number;
  billingModel?: "pay_as_you_go" | "white_label_partner_managed" | "white_label_customer_checkout";
  paymentProvider?: string;
  whiteLabel?: { productName: string; supportEmail: string; managedByPartner: boolean };
  wallet: CreditWallet;
  creditSettings: {
    currency: string;
    initialCredits: number;
    minimumCallStartCredits: number;
    markupMultiplier: number;
    platformFeeInrPerMinute: number;
  };
  subscription: {
    plan?: PlanId;
    planKey?: string;
    planVersion?: number;
    provider: "internal" | "razorpay" | string;
    status: "active" | "trialing" | "past_due" | "cancelled" | "incomplete" | "paused";
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
    priceSnapshot?: { currency?: string; recurringAmountMinor?: number; interval?: string };
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
    invoiceNumber: string;
    description: string;
    status: string;
    amountDue?: number;
    amountPaid?: number;
    totalMinor?: number;
    recurringAmountMinor?: number;
    setupFeeMinor?: number;
    taxMinor?: number;
    taxLabel?: string;
    refundedMinor?: number;
    refundStatus?: "none" | "partial" | "full";
    disputeStatus?: string;
    periodStart?: string;
    periodEnd?: string;
    paidAt?: string;
    currency: string;
    hostedInvoiceUrl: string;
    invoicePdf: string;
    createdAt: string;
  }[];
  currentInvoice?: {
    _id: string;
    invoiceNumber: string;
    status: "open" | "paid" | "past_due" | "disputed" | "void" | "refunded";
    currency: "USD" | "INR";
    recurringAmountMinor: number;
    setupFeeMinor: number;
    taxMinor: number;
    taxLabel: string;
    totalMinor: number;
    dueAt: string;
    periodStart: string;
    periodEnd: string;
    paidAt?: string;
    transferStatus?: string;
    refundedMinor?: number;
    refundStatus?: "none" | "partial" | "full";
    disputeStatus?: string;
  } | null;
  transactions: BillingTransaction[];
};

export type RazorpayCheckoutPayload = {
  provider: "razorpay";
  kind: "order" | "subscription";
  keyId: string;
  orderId?: string;
  subscriptionId?: string;
  amount: number;
  currency: "USD" | "INR";
  credits?: number;
  name: string;
  description: string;
  prefill: { name?: string; email?: string };
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

async function downloadInvoice(invoiceId: string) {
  if (!getSession()) throw new Error("Sign in before downloading an invoice.");
  const response = await fetch(`${API_URL}/api/billing/invoices/${encodeURIComponent(invoiceId)}`, {
    credentials: "include",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(data?.message ?? "Invoice download failed.");
  }
  return response.blob();
}

export const billingApi = {
  summary: () => cachedApiRequest("billing", "/summary", 60_000, () => request<BillingSummary>("/summary")),
  transactions: (limit = 50) => request<{ transactions: BillingTransaction[] }>("/transactions?limit=" + limit),
  topUp: (amountCredits: number) =>
    request<RazorpayCheckoutPayload>("/top-up", {
      method: "POST",
      body: JSON.stringify({ amountCredits }),
    }),
  verifyTopUp: (result: { razorpay_order_id?: string; razorpay_payment_id: string; razorpay_signature: string }) =>
    request<{ success: boolean; credits: number; invoiceId: string }>("/razorpay/verify", {
      method: "POST",
      body: JSON.stringify(result),
    }),
  whiteLabelCheckout: () =>
    request<(RazorpayCheckoutPayload & { settled: false }) | { settled: true; invoice: BillingSummary["currentInvoice"] }>("/white-label/checkout", {
      method: "POST",
      body: JSON.stringify({}),
    }),
  verifyWhiteLabelCheckout: (result: { razorpay_order_id?: string; razorpay_payment_id: string; razorpay_signature: string }) =>
    request<{ success: boolean; invoice: BillingSummary["currentInvoice"] }>("/white-label/verify", {
      method: "POST",
      body: JSON.stringify(result),
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
    request<RazorpayCheckoutPayload>("/checkout", {
      method: "POST",
      body: JSON.stringify({ plan }),
    }),
  verifySubscription: (result: { razorpay_subscription_id?: string; razorpay_payment_id: string; razorpay_signature: string }) =>
    request<{ success: boolean; status: string }>("/razorpay/subscription/verify", {
      method: "POST",
      body: JSON.stringify(result),
    }),
  cancelSubscription: (immediate = false) =>
    request<{ subscription: { status: string } }>("/razorpay/subscription/cancel", {
      method: "POST",
      body: JSON.stringify({ immediate }),
    }),
  downloadInvoice,
  downloadWhiteLabelInvoice: async (invoiceId: string) => {
    if (!getSession()) throw new Error("Sign in before downloading an invoice.");
    const response = await fetch(`${API_URL}/api/billing/white-label/invoices/${encodeURIComponent(invoiceId)}`, {
      credentials: "include",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      throw new Error(data?.message ?? "Invoice download failed.");
    }
    return response.blob();
  },
};
