export type RazorpayCheckoutPayload = {
  provider: "razorpay";
  kind: "order" | "subscription";
  keyId: string;
  orderId?: string;
  subscriptionId?: string;
  amount: number;
  currency: "USD";
  name: string;
  description: string;
  prefill: { name?: string; email?: string };
};

export type RazorpayPaymentResult = {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_subscription_id?: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, callback: (response: { error?: { description?: string } }) => void) => void;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Razorpay Checkout."));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export async function openRazorpayCheckout(payload: RazorpayCheckoutPayload) {
  await loadRazorpay();
  const Razorpay = window.Razorpay;
  if (!Razorpay) throw new Error("Razorpay Checkout is unavailable.");
  return new Promise<RazorpayPaymentResult>((resolve, reject) => {
    const checkout = new Razorpay({
      key: payload.keyId,
      amount: payload.amount,
      currency: payload.currency,
      name: payload.name,
      description: payload.description,
      ...(payload.kind === "order" ? { order_id: payload.orderId } : { subscription_id: payload.subscriptionId }),
      prefill: payload.prefill,
      theme: { color: "#45ddce" },
      retry: { enabled: true },
      config: {
        display: {
          blocks: {
            cards: {
              name: payload.kind === "subscription" ? "Card for monthly Autopay" : "Pay with card",
              instruments: [{ method: "card" }],
            },
          },
          sequence: ["block.cards"],
          preferences: { show_default_blocks: false },
        },
      },
      handler: (result: RazorpayPaymentResult) => resolve(result),
      modal: { ondismiss: () => reject(new Error("Payment was closed before completion.")) },
    });
    checkout.on("payment.failed", (result) => reject(new Error(result.error?.description || "Razorpay payment failed.")));
    checkout.open();
  });
}


