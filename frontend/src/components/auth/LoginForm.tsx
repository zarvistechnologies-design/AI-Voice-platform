"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  accountApi,
  getSession,
  loginWithPassword,
  registerWithPassword,
  validateStoredSession,
} from "@/lib/auth";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { useBrand } from "@/components/branding/BrandProvider";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function getNextPath(path: string | null) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/dashboard/agents";
  }
  return path === "/dashboard" ? "/dashboard/agents" : path;
}

export function LoginForm() {
  const brand = useBrand();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = getNextPath(searchParams.get("next"));

  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [needsTwoFactor, setNeedsTwoFactor] = useState(false);
  const [error, setError] = useState("");
  const [recoveryNotice, setRecoveryNotice] = useState("");
  const [developmentResetUrl, setDevelopmentResetUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    router.prefetch(nextPath);
    let cancelled = false;

    void (async () => {
      if (!getSession()) return;
      const session = await validateStoredSession();
      if (!cancelled && session) router.replace(nextPath);
    })();

    return () => {
      cancelled = true;
    };
  }, [nextPath, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setRecoveryNotice("");
    setDevelopmentResetUrl("");

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (mode === "register" && normalizedName.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    if (!emailPattern.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    if (mode !== "forgot" && password.trim().length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "forgot") {
        const result = await accountApi.forgotPassword(normalizedEmail);
        setRecoveryNotice("If an account exists for this email, password reset instructions have been sent.");
        setDevelopmentResetUrl(result.resetUrl ?? "");
        setIsSubmitting(false);
        return;
      }

      if (mode === "register") {
        await registerWithPassword(normalizedName, normalizedEmail, password);
      } else {
        await loginWithPassword(normalizedEmail, password, twoFactorCode);
      }

      const session = await validateStoredSession();
      if (!session) {
        setError("Signed in, but the session could not be verified. Please refresh and try again.");
        setIsSubmitting(false);
        return;
      }

      if (nextPath === "/dashboard" || nextPath === "/dashboard/agents") {
        void import("@/lib/voice")
          .then(({ voiceApi }) => voiceApi.agentSummaries())
          .catch(() => undefined);
      }
      router.push(nextPath);
    } catch (authError) {
      setError(
        authError instanceof Error
          ? authError.message
          : "Could not authenticate. Try again.",
      );
      if (authError instanceof Error && authError.message.includes("Two-factor code required")) setNeedsTwoFactor(true);
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className={`login-auth-form relative z-[1] grid w-full max-w-[420px] gap-4 text-slate-900 ${mode === "register" ? "is-register" : ""}`}
      onSubmit={handleSubmit}
    >
      <div className="auth-heading mb-2 grid gap-2 text-center">
        <div className="mx-auto mb-1 grid size-12 place-items-center rounded-2xl border border-teal-500/20 bg-teal-50/80 shadow-xs" aria-hidden="true">
          <span className="flex h-5 items-center gap-[3.5px]">
            {[10, 20, 14, 8, 16].map((height) => (
              <span className="w-[3px] rounded-full bg-[#108D82]" key={height} style={{ height }} />
            ))}
          </span>
        </div>
        <h1 className="m-0 text-[clamp(1.75rem,3.8vw,2.35rem)] font-extrabold leading-tight tracking-[-0.035em] text-slate-900">
          {mode === "login" ? "Welcome back" : mode === "register" ? "Create your account" : "Reset your password"}
        </h1>
        <p className="auth-description m-0 text-sm leading-5 text-slate-500">
          {mode === "login"
            ? `Sign in to continue to ${brand.productName}.`
            : mode === "register"
              ? "Start building your first AI voice agent today."
              : "Enter your email and we'll send you a secure reset link."}
        </p>
      </div>

      {mode === "register" ? (
        <label className="auth-field grid gap-1.5 text-xs font-semibold text-slate-700">
          <span>Name</span>
          <span className="relative block">
            <svg aria-hidden="true" className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.7" /><path d="M4.5 21a7.5 7.5 0 0115 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /></svg>
            <input
              className="auth-input min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 pl-10 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 hover:bg-slate-50 focus:border-[#108D82] focus:bg-white focus:ring-4 focus:ring-[#108D82]/10"
              autoComplete="name"
              onChange={(event) => setName(event.target.value)}
              placeholder="Your full name"
              type="text"
              value={name}
            />
          </span>
        </label>
      ) : null}

      <label className="auth-field grid gap-1.5 text-xs font-semibold text-slate-700">
        <span>Email address</span>
        <span className="relative block">
          <svg aria-hidden="true" className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24"><rect height="15" rx="2.5" stroke="currentColor" strokeWidth="1.7" width="19" x="2.5" y="4.5" /><path d="M4 7l8 6 8-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></svg>
          <input
            className="auth-input min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 pl-10 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 hover:bg-slate-50 focus:border-[#108D82] focus:bg-white focus:ring-4 focus:ring-[#108D82]/10"
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            type="email"
            value={email}
          />
        </span>
      </label>

      {mode !== "forgot" ? <label className="auth-field grid gap-1.5 text-xs font-semibold text-slate-700">
        <span>Password</span>
        <span className="relative block">
          <svg aria-hidden="true" className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24"><rect height="12" rx="2.5" stroke="currentColor" strokeWidth="1.7" width="17" x="3.5" y="9" /><path d="M7.5 9V6.5a4.5 4.5 0 019 0V9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /></svg>
          <input
            className="auth-input min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-10 pr-11 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 hover:bg-slate-50 focus:border-[#108D82] focus:bg-white focus:ring-4 focus:ring-[#108D82]/10"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            value={password}
          />
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center border-0 bg-transparent text-slate-400 transition hover:text-slate-700"
            onClick={() => setShowPassword((current) => !current)}
            type="button"
          >
            <svg aria-hidden="true" className="size-[17px]" fill="none" viewBox="0 0 24 24"><path d="M3 12c0-2.2 3.5-8 9-8s9 5.8 9 8-3.5 8-9 8-9-5.8-9-8z" stroke="currentColor" strokeWidth="1.7" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />{showPassword ? <path d="M4 4l16 16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /> : null}</svg>
          </button>
        </span>
      </label> : null}

      {mode === "login" && needsTwoFactor ? (
        <label className="auth-field grid gap-1.5 text-xs font-semibold text-slate-700">
          <span>Authenticator code</span>
          <input
            className="auth-input min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#108D82] focus:bg-white focus:ring-4 focus:ring-[#108D82]/10"
            autoComplete="one-time-code"
            inputMode="numeric"
            maxLength={6}
            onChange={(event) => setTwoFactorCode(event.target.value)}
            placeholder="6-digit code"
            value={twoFactorCode}
          />
        </label>
      ) : null}

      {error ? (
        <p className="m-0 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs font-semibold text-rose-700">
          {error}
        </p>
      ) : null}

      {recoveryNotice ? (
        <div className="rounded-xl border border-teal-200 bg-teal-50 px-3.5 py-3 text-xs leading-5 text-teal-900">
          <p className="m-0">{recoveryNotice}</p>
          {developmentResetUrl ? <a className="mt-2 block break-all font-bold text-[#108D82] underline underline-offset-2 hover:text-[#0b655d]" href={developmentResetUrl}>Open development reset link</a> : null}
        </div>
      ) : null}

      {mode === "login" ? (
        <div className="flex items-center justify-between gap-4 text-xs font-medium">
          <label className="flex cursor-pointer items-center gap-2 text-slate-600 hover:text-slate-800">
            <input className="size-4 rounded border-slate-300 accent-[#108D82]" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} type="checkbox" />
            Remember me
          </label>
          <button
            className="border-0 bg-transparent p-0 font-semibold text-[#108D82] transition hover:text-[#0b655d]"
            onClick={() => {
              setError("");
              setRecoveryNotice("");
              setMode("forgot");
            }}
            type="button"
          >
            Forgot password?
          </button>
        </div>
      ) : null}

      <button
        className="auth-submit inline-flex min-h-12 items-center justify-center rounded-xl border-0 bg-[#108D82] text-sm font-bold text-white shadow-md shadow-[#108D82]/20 transition-all hover:bg-[#0d7970] hover:shadow-lg hover:shadow-[#108D82]/30 active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting
          ? mode === "forgot" ? "Sending..." : "Opening..."
          : mode === "login"
            ? "Sign in"
            : mode === "register"
              ? "Create account"
              : recoveryNotice ? "Send again" : "Send reset link"}
      </button>

      {mode !== "forgot" && brand.authentication.googleSignIn ? (
        <GoogleSignInButton
          disabled={isSubmitting}
          nextPath={nextPath}
          onError={setError}
        />
      ) : null}

      {mode === "forgot" || brand.authentication.registrationMode === "open" ? (
        <button
          className="inline-flex min-h-9 items-center justify-center border-0 bg-transparent text-xs font-medium text-slate-500 transition hover:text-slate-700 disabled:cursor-wait disabled:opacity-70"
          disabled={isSubmitting}
          onClick={() => {
            setError("");
            setRecoveryNotice("");
            setDevelopmentResetUrl("");
            setMode((current) => (current === "login" ? "register" : "login"));
          }}
          type="button"
        >
          {mode === "login" ? (
            <span>Don&apos;t have an account? <strong className="ml-1 font-semibold text-[#108D82] hover:underline">Sign up</strong></span>
          ) : mode === "register" ? (
            <span>Already have an account? <strong className="ml-1 font-semibold text-[#108D82] hover:underline">Sign in</strong></span>
          ) : (
            <span>Remembered your password? <strong className="ml-1 font-semibold text-[#108D82] hover:underline">Back to sign in</strong></span>
          )}
        </button>
      ) : (
        <p className="m-0 text-center text-xs text-slate-500">
          Need access? Contact <a className="font-semibold text-[#108D82] hover:underline" href={`mailto:${brand.support.email}`}>{brand.support.email || "your account administrator"}</a>.
        </p>
      )}
      {brand.poweredBy.visible ? <p className="m-0 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">{brand.poweredBy.text}</p> : null}
    </form>
  );
}
