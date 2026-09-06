import { API_URL } from "@/lib/apiBase";
import { getAuthHeaders } from "@/lib/auth";

export type WhiteLabelModelCategory = "stt" | "llm" | "tts";
export type WhiteLabelModelAccess = Record<WhiteLabelModelCategory, string[]>;
export type WhiteLabelModelOption = {
  key: string;
  category: WhiteLabelModelCategory;
  provider: string;
  model: string;
  label: string;
  kind: "realtime" | "pipeline";
};
export type WhiteLabelModelCatalog = Record<WhiteLabelModelCategory, WhiteLabelModelOption[]>;

export type WhiteLabelAccount = {
  _id: string;
  id?: string;
  ownerOrgId: string | { _id: string; id?: string; name: string; slug: string; lifecycleStatus?: string };
  name: string;
  slug: string;
  status: "draft" | "onboarding" | "active" | "suspended" | "terminated";
  billingStatus: "not_configured" | "trialing" | "active" | "past_due" | "suspended" | "cancelled";
  contract: {
    currency: "USD" | "INR";
    billingInterval: "month" | "year";
    platformFeeMinor: number;
    minimumCommitmentMinor: number;
    includedCredits: number;
    wholesaleMarkupBps: number;
    platformFeePerMinuteCredits: number;
    paymentTermsDays: number;
    creditLimitCredits: number;
    autoSuspendOnPastDue: boolean;
  };
  limits: {
    brands: number;
    customerOrganizations: number;
    agentsPerCustomer: number;
    membersPerCustomer: number;
    phoneNumbersPerCustomer: number;
    concurrentCallsPerCustomer: number;
    monthlyMinutesPerCustomer: number;
  };
  entitlements: Record<string, boolean>;
  modelAccess?: WhiteLabelModelAccess;
  usage?: { customerOrganizations?: number };
  customerOnboarding?: {
    registrationMode: "invite_only" | "open";
    allowGoogleSignIn: boolean;
    requireEmailVerification: boolean;
  };
  retailBilling?: {
    enabled: boolean;
    provider: "razorpay" | "internal";
    razorpayLinkedAccountId: string;
    transferMode: "disabled" | "full_amount";
    taxRateBps: number;
    taxLabel: string;
    taxRegistrationId: string;
    gracePeriodDays: number;
  };
  createdAt: string;
};

export type WhiteLabelBrand = {
  _id: string;
  id?: string;
  accountId: string;
  key: string;
  status: "draft" | "published" | "disabled";
  isDefault: boolean;
  branding: {
    productName: string;
    companyName: string;
    logoUrl: string;
    logoDarkUrl: string;
    iconUrl: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    surfaceColor: string;
    defaultTheme: "light" | "dark" | "system";
    poweredByText: string;
  };
  support: { email: string; phone: string; websiteUrl: string; helpCenterUrl: string; statusPageUrl: string };
  legal: { termsUrl: string; privacyUrl: string; cookiePolicyUrl: string; legalBusinessName: string; businessAddress: string };
  email: { fromName: string; fromAddress: string; replyTo: string; sendingDomainStatus: string };
};

export type WhiteLabelDomain = {
  _id: string;
  id?: string;
  brandId: string;
  hostname: string;
  kind: "app" | "api" | "link";
  status: "pending" | "verifying" | "awaiting_dns" | "awaiting_certificate" | "active" | "failed" | "disabled";
  requiredRecords: Array<{ type: "TXT" | "CNAME"; name: string; value: string; purpose: string }>;
  failureReason?: string;
  tls?: { status: string; issuer?: string; expiresAt?: string };
  lastCheckedAt?: string;
};

export type WhiteLabelPlan = {
  _id: string;
  id?: string;
  key: string;
  version: number;
  name: string;
  description: string;
  status: "draft" | "published" | "archived";
  isPublic: boolean;
  price: { currency: "USD" | "INR"; recurringAmountMinor: number; interval: "month" | "year"; setupFeeMinor: number; trialDays: number; taxBehavior: string };
  usagePricing: { mode: "cost_markup" | "fixed_per_minute" | "included_only"; markupBps: number; perMinuteAmountMinor: number; minimumCallAmountMinor: number; overageEnabled: boolean };
  allowances: { includedCredits: number; includedMinutes: number };
  limits: { agents: number; members: number; phoneNumbers: number; concurrentCalls: number; monthlyMinutes: number; knowledgeSources: number; apiKeys: number };
  features: Record<string, boolean>;
  modelAccess?: WhiteLabelModelAccess;
  publishedAt?: string;
};

export type WhiteLabelCustomer = {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  lifecycleStatus: "active" | "suspended" | "archived";
  externalCustomerId?: string;
  ownerUserId?: { _id: string; name: string; email: string; emailVerified: boolean; lastLoginAt?: string };
  whiteLabelBrandId?: { _id: string; key: string; branding?: { productName?: string } };
  subscription?: { status: string; planKey: string; planVersion: number; currentPeriodEnd?: string; priceSnapshot?: { currency?: string; recurringAmountMinor?: number; interval?: string } };
  createdAt: string;
};

export type PartnerOverview = {
  account: WhiteLabelAccount;
  brands: WhiteLabelBrand[];
  domains: WhiteLabelDomain[];
  plans: WhiteLabelPlan[];
  metrics: { customerCount: number; activeSubscriptions: number };
  modelAccessCatalog: WhiteLabelModelCatalog;
};

export type PartnerEconomics = {
  from: string;
  activeSubscriptionCount: number;
  economics: Array<{
    currency: "USD" | "INR";
    projectedMonthlyRecurringMinor: number;
    customerUsageCharges: number;
    wholesaleCost: number;
    partnerMargin: number;
    calls: number;
  }>;
};

export type WhiteLabelPartnerInvoice = {
  _id: string;
  id?: string;
  invoiceNumber: string;
  status: "open" | "paid" | "past_due" | "void";
  provider: "razorpay" | "internal";
  currency: "USD" | "INR";
  periodStart: string;
  periodEnd: string;
  usageStart: string;
  usageEnd: string;
  dueAt: string;
  platformFeeMinor: number;
  minimumCommitmentMinor: number;
  usageWholesaleMinor: number;
  includedCreditDiscountMinor: number;
  usageMarkupMinor: number;
  committedUsageMinor: number;
  totalMinor: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paymentMethod?: string;
  paidAt?: string;
  createdAt: string;
};

export type PartnerBilling = {
  billingModel: "white_label_partner_to_platform";
  paymentReadiness: { ready: boolean; provider: "razorpay"; reason: string };
  currentInvoice: WhiteLabelPartnerInvoice;
  invoices: WhiteLabelPartnerInvoice[];
};

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

async function request<T>(path: string, options: RequestOptions = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(options.body === undefined ? {} : { "Content-Type": "application/json" }),
      ...getAuthHeaders(),
      ...options.headers,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const data = (await response.json().catch(() => null)) as (T & { message?: string }) | null;
  if (!response.ok) throw new Error(data?.message ?? `Request failed (${response.status}).`);
  return (data ?? {}) as T;
}

export const partnerWhiteLabelApi = {
  overview: () => request<PartnerOverview>("/api/partner/white-label"),
  economics: () => request<PartnerEconomics>("/api/partner/white-label/economics"),
  billing: () => request<PartnerBilling>("/api/partner/white-label/billing"),
  createBillingCheckout: (invoiceId: string) => request<{
    settled: boolean;
    provider?: "razorpay";
    kind?: "order";
    keyId?: string;
    orderId?: string;
    amount?: number;
    currency?: "USD" | "INR";
    name?: string;
    description?: string;
    prefill?: { name?: string; email?: string };
    invoice: WhiteLabelPartnerInvoice;
  }>("/api/partner/white-label/billing/checkout", { method: "POST", body: { invoiceId } }),
  verifyBillingCheckout: (body: {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature: string;
  }) => request<{ success: true; invoice: WhiteLabelPartnerInvoice }>("/api/partner/white-label/billing/verify", { method: "POST", body }),
  updateBrand: (brandId: string, body: unknown) => request<{ brand: WhiteLabelBrand }>(`/api/partner/white-label/brands/${brandId}`, { method: "PATCH", body }),
  uploadBrandAsset: async (brandId: string, role: "logo" | "logoDark" | "icon", file: File) => {
    const form = new FormData();
    form.set("role", role);
    form.set("file", file);
    const response = await fetch(`${API_URL}/api/partner/white-label/brands/${encodeURIComponent(brandId)}/assets`, {
      method: "POST",
      credentials: "include",
      headers: getAuthHeaders(),
      body: form,
    });
    const data = (await response.json().catch(() => null)) as { brand?: WhiteLabelBrand; assetUrl?: string; message?: string } | null;
    if (!response.ok || !data?.assetUrl || !data.brand) throw new Error(data?.message ?? "Brand asset upload failed.");
    return { brand: data.brand, assetUrl: data.assetUrl };
  },
  publishBrand: (brandId: string) => request<{ brand: WhiteLabelBrand }>(`/api/partner/white-label/brands/${brandId}/publish`, { method: "POST" }),
  verifyEmailDomain: (brandId: string) => request<{ brand: WhiteLabelBrand }>(`/api/partner/white-label/brands/${brandId}/verify-email-domain`, { method: "POST" }),
  addDomain: (body: { brandId: string; hostname: string; kind: string }) => request<{ domain: WhiteLabelDomain }>("/api/partner/white-label/domains", { method: "POST", body }),
  verifyDomain: (domainId: string) => request<{ domain: WhiteLabelDomain }>(`/api/partner/white-label/domains/${domainId}/verify`, { method: "POST" }),
  disableDomain: (domainId: string, reason: string) => request<{ domain: WhiteLabelDomain }>(`/api/partner/white-label/domains/${domainId}/status`, { method: "PATCH", body: { reason } }),
  createPlan: (body: unknown) => request<{ plan: WhiteLabelPlan }>("/api/partner/white-label/plans", { method: "POST", body }),
  updatePlan: (planId: string, body: unknown) => request<{ plan: WhiteLabelPlan }>(`/api/partner/white-label/plans/${planId}`, { method: "PATCH", body }),
  publishPlan: (planId: string) => request<{ plan: WhiteLabelPlan }>(`/api/partner/white-label/plans/${planId}/publish`, { method: "POST" }),
  revisePlan: (planId: string) => request<{ plan: WhiteLabelPlan }>(`/api/partner/white-label/plans/${planId}/revise`, { method: "POST" }),
  archivePlan: (planId: string) => request<{ plan: WhiteLabelPlan }>(`/api/partner/white-label/plans/${planId}/archive`, { method: "POST" }),
  customers: () => request<{ customers: WhiteLabelCustomer[]; pagination: { total: number } }>("/api/partner/white-label/customers?limit=100"),
  provisionCustomer: (body: unknown) => request<{ organization: WhiteLabelCustomer; emailDeliveryStatus: string; activationUrl?: string }>("/api/partner/white-label/customers", { method: "POST", body }),
  updateCustomerStatus: (orgId: string, status: "active" | "suspended", reason: string) => request<{ organization: WhiteLabelCustomer }>(`/api/partner/white-label/customers/${orgId}/status`, { method: "PATCH", body: { status, reason } }),
  updateCustomerSubscription: (orgId: string, status: "active" | "past_due" | "paused" | "cancelled", reason: string) => request<{ subscription: WhiteLabelCustomer["subscription"] }>(`/api/partner/white-label/customers/${orgId}/subscription`, { method: "PATCH", body: { status, reason } }),
};

export const platformWhiteLabelApi = {
  eligibleOrganizations: (search = "") => request<{ organizations: Array<{ _id: string; id?: string; name: string; slug: string; ownerUserId?: { name: string; email: string; emailVerified: boolean; twoFactorEnabled: boolean } }> }>(`/api/platform/white-label/eligible-organizations${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  accounts: (search = "") => request<{ accounts: WhiteLabelAccount[]; pagination: { total: number } }>(`/api/platform/white-label/accounts?limit=100${search ? `&search=${encodeURIComponent(search)}` : ""}`),
  account: (accountId: string) => request<PartnerOverview & { customerCount: number; subscriptions: Array<{ _id: string; count: number }> }>(`/api/platform/white-label/accounts/${accountId}`),
  createAccount: (body: unknown) => request<{ account: WhiteLabelAccount; defaultBrand: WhiteLabelBrand }>("/api/platform/white-label/accounts", { method: "POST", body }),
  updateStatus: (accountId: string, body: { status: string; billingStatus?: string; reason: string }) => request<{ account: WhiteLabelAccount }>(`/api/platform/white-label/accounts/${accountId}/status`, { method: "PATCH", body }),
  updateCommercials: (accountId: string, body: unknown) => request<{ account: WhiteLabelAccount }>(`/api/platform/white-label/accounts/${accountId}/commercials`, { method: "PATCH", body }),
  audit: (accountId = "") => request<{ auditLogs: Array<{ _id: string; action: string; actorEmail: string; reason?: string; createdAt: string; resource: string }>; pagination: { total: number } }>(`/api/platform/audit-log?limit=50${accountId ? `&accountId=${encodeURIComponent(accountId)}` : ""}`),
};

export function documentId(value: { _id: string; id?: string }) {
  return value.id || value._id;
}
