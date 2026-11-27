"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { completeAuthSession, getSession, refreshStoredSession } from "@/lib/auth";
import { organizationApi } from "@/lib/organizations";
import { useBrand } from "@/components/branding/BrandProvider";
import { BrandLogo } from "@/components/ui/BrandLogo";

type InvitePreview = {
  email: string;
  role: string;
  organizationName: string;
  hasAccount: boolean;
  whiteLabel: boolean;
  productName: string;
};

export function InviteAccept({ token }: { token: string }) {
  const brand = useBrand();
  const router = useRouter();
  const [message, setMessage] = useState("Checking your organization invitation...");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<InvitePreview | null>(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (getSession()) {
      void organizationApi
        .acceptInvitation(token)
        .then(async () => {
          await refreshStoredSession();
          if (!cancelled) {
            setMessage("Invitation accepted. Opening your new workspace...");
            router.replace("/dashboard/agents");
          }
        })
        .catch((err) => {
          if (!cancelled) {
            setMessage("");
            setError(err instanceof Error ? err.message : "Could not accept invitation.");
          }
        });
      return () => {
        cancelled = true;
      };
    }

    void organizationApi
      .previewInvitation(token)
      .then((data) => {
        if (cancelled) return;
        if (data.hasAccount) {
          router.replace(`/login?next=${encodeURIComponent(`/invite/${token}`)}`);
          return;
        }
        setPreview(data);
        setMessage("");
      })
      .catch((err) => {
        if (!cancelled) {
          setMessage("");
          setError(err instanceof Error ? err.message : "This invitation is invalid or expired.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [router, token]);

  async function handleCompleteInvite(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (name.trim().length < 2) {
      setError("Enter your full name (at least 2 characters).");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await organizationApi.completeInvitation({
        token,
        name: name.trim(),
        password,
      });
      completeAuthSession(result);
      router.replace("/dashboard/agents");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not complete your invitation.");
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f9f8] p-6 text-[#14231f]">
      <section className="w-full max-w-md rounded-3xl border border-[#dbe4e1] bg-white p-8 shadow-[0_20px_55px_rgba(20,35,31,0.08)]">
        <div className="mb-5 flex justify-center"><BrandLogo showWebsiteLogo /></div>
        <h1 className="m-0 text-center text-xl font-semibold">
          {preview ? `Join ${preview.organizationName}` : `${brand.productName} invitation`}
        </h1>

        {preview ? (
          <form className="mt-5 grid gap-4 text-left" onSubmit={(event) => void handleCompleteInvite(event)}>
            <p className="m-0 text-center text-xs leading-5 text-[#52645f]">
              Create your account as <strong className="capitalize">{preview.role}</strong> for{" "}
              <strong>{preview.email}</strong> on {brand.productName}.
            </p>
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-[#52645f]" htmlFor="invite-full-name">Full name</label>
              <input
                autoComplete="name"
                className="min-h-11 rounded-xl border border-[#dbe4e1] bg-white px-3.5 text-sm text-[#14231f] outline-none transition focus:border-[#118778] focus:ring-4 focus:ring-[#118778]/10"
                id="invite-full-name"
                maxLength={80}
                minLength={2}
                name="name"
                onChange={(event) => setName(event.target.value)}
                required
                type="text"
                value={name}
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-[#52645f]" htmlFor="invite-password">Create password</label>
              <p className="m-0 text-xs text-[#647771]" id="invite-password-hint">Use at least 8 characters.</p>
              <div className="relative">
                <input
                  aria-describedby="invite-password-hint"
                  autoComplete="new-password"
                  className="min-h-11 w-full rounded-xl border border-[#dbe4e1] bg-white px-3.5 pr-16 text-sm text-[#14231f] outline-none transition focus:border-[#118778] focus:ring-4 focus:ring-[#118778]/10"
                  id="invite-password"
                  maxLength={128}
                  minLength={8}
                  name="password"
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute inset-y-1 right-1 rounded-lg px-2.5 text-xs font-semibold text-[#52645f] hover:bg-[#f1f6f4]"
                  onClick={() => setShowPassword((current) => !current)}
                  type="button"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {error ? (
              <p className="m-0 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-800" role="alert">
                {error}
              </p>
            ) : null}
            <button
              className="min-h-11 rounded-xl bg-[#118778] px-4 text-sm font-bold text-white shadow-[0_8px_22px_rgba(17,135,120,0.16)] transition hover:bg-[#0e6f62] disabled:opacity-50"
              disabled={submitting}
              type="submit"
            >
              {submitting ? "Creating account…" : "Create account & join workspace"}
            </button>
            <Link
              className="text-center text-xs font-semibold text-[#0e6f62] hover:underline"
              href={`/login?next=${encodeURIComponent(`/invite/${token}`)}`}
            >
              Already have an account? Sign in
            </Link>
          </form>
        ) : (
          <div className="mt-3 text-center">
            {message ? <p className="m-0 text-sm leading-6 text-[#71817d]">{message}</p> : null}
            {error ? (
              <div className="mt-3 grid gap-3">
                <p className="m-0 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-800" role="alert">
                  {error}
                </p>
                <Link className="text-sm font-semibold text-[#0e6f62] hover:underline" href="/login">
                  Go to sign in
                </Link>
              </div>
            ) : null}
          </div>
        )}
      </section>
    </main>
  );
}
