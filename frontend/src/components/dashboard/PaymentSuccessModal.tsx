"use client";

import { useEffect, useState } from "react";

export type PaymentSuccessData = {
  isOpen: boolean;
  type: "topup" | "subscription";
  amountInr: number;
  creditsAdded?: number;
  paymentId?: string;
  invoiceId?: string;
  newBalanceCredits?: number;
};

type PaymentSuccessModalProps = {
  data: PaymentSuccessData | null;
  onClose: () => void;
  onDownloadInvoice?: (invoiceId: string) => void;
  money: (value: number, currency?: string) => string;
};

export function PaymentSuccessModal({
  data,
  onClose,
  onDownloadInvoice,
  money,
}: PaymentSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (data?.isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [data?.isOpen, onClose]);

  if (!data?.isOpen) return null;

  async function copyPaymentId() {
    if (!data?.paymentId) return;
    try {
      await navigator.clipboard.writeText(data.paymentId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write failed or unpermitted
    }
  }

  const isTopUp = data.type === "topup";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b211c]/45 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#dbe6e2] p-6 sm:p-7 text-[#14231f] transition-all transform animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          aria-label="Close"
          className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-[#71817d] hover:bg-[#f0f4f2] hover:text-[#14231f] transition"
          onClick={onClose}
          type="button"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Celebration Icon */}
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 ring-8 ring-emerald-50 text-emerald-600">
          <svg className="size-8 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        {/* Header */}
        <div className="mt-4 text-center">
          <h3 id="success-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Payment Successful!
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-[#52645f]">
            {isTopUp
              ? "Your recharge has been confirmed and credits are ready in your wallet."
              : "Your monthly Enterprise Autopay subscription is now active."}
          </p>
        </div>

        {/* Transaction Summary Card */}
        <div className="mt-6 rounded-xl border border-[#dce7e3] bg-[#f8fbfa] p-4 text-sm divide-y divide-[#e6ecea]">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-medium text-[#71817d]">Amount Paid</span>
            <div className="text-right">
              <span className="text-base font-bold text-[#14231f]">{money(data.amountInr)}</span>
              <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                Paid
              </span>
            </div>
          </div>

          {data.creditsAdded !== undefined && data.creditsAdded > 0 ? (
            <div className="flex items-center justify-between py-3">
              <span className="text-xs font-medium text-[#71817d]">Credits Added</span>
              <span className="font-semibold text-emerald-700">
                +{money(data.creditsAdded)}
              </span>
            </div>
          ) : null}

          {data.newBalanceCredits !== undefined ? (
            <div className="flex items-center justify-between py-3">
              <span className="text-xs font-medium text-[#71817d]">Available Balance</span>
              <span className="font-bold text-[#14231f]">
                {money(data.newBalanceCredits)}
              </span>
            </div>
          ) : null}

          {data.paymentId ? (
            <div className="flex items-center justify-between pt-3 text-xs">
              <span className="font-medium text-[#71817d]">Payment Reference</span>
              <button
                className="group flex items-center gap-1.5 font-mono text-[#52645f] hover:text-[#0e6f62] transition"
                onClick={() => void copyPaymentId()}
                title="Click to copy payment ID"
                type="button"
              >
                <span>{data.paymentId}</span>
                <span className="text-[10px] text-[#118778] font-sans font-medium">
                  {copied ? "Copied!" : "Copy"}
                </span>
              </button>
            </div>
          ) : null}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            className="w-full min-h-11 rounded-xl bg-[#118778] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#0e6f62] active:scale-[0.99] transition"
            onClick={onClose}
            type="button"
          >
            Done
          </button>

          {data.invoiceId && onDownloadInvoice ? (
            <button
              className="w-full min-h-10 rounded-xl border border-[#c6d4d0] bg-white px-4 text-xs font-semibold text-[#52645f] hover:bg-[#edf7f4] hover:text-[#0e6f62] hover:border-[#118778]/50 transition"
              onClick={() => onDownloadInvoice(data.invoiceId!)}
              type="button"
            >
              Download Tax Invoice
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
