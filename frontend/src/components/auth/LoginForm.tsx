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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function getNextPath(path: string | null) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/dashboard/agents";
  }
  return path === "/dashboard" ? "/dashboard/agents" : path;
}

export function LoginForm() {
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
      className={`login-auth-form relative z-[1] grid w-full max-w-[420px] gap-4 text-white ${mode === "register" ? "is-register" : ""}`}
      onSubmit={handleSubmit}
    >
      <div className="auth-heading mb-2 grid gap-2 text-center">
        <div className="mx-auto mb-2 grid size-11 place-items-center rounded-xl border border-[#45ddce]/25 bg-[#45ddce]/10 shadow-[0_0_28px_rgba(69,221,206,0.11)]" aria-hidden="true">
          <span className="flex h-5 items-center gap-[3px]">
            {[9, 18, 13, 6, 11].map((height) => (
              <span className="w-[3px] rounded-full bg-[#75fff0]" key={height} style={{ height }} />
            ))}
          </span>
        </div>
        <h1 className="m-0 text-[clamp(1.9rem,4vw,2.5rem)] font-black leading-none tracking-[-0.04em] text-white">
          {mode === "login" ? "Welcome back" : mode === "register" ? "Create your account" : "Reset your password"}
        </h1>
        <p className="auth-description m-0 text-sm leading-5 text-white/42">
          {mode === "login"
            ? "Sign in to continue to your voice workspace."
            : mode === "register"
              ? "Start building your first AI voice agent today."
              : "Enter your email and we'll send you a secure reset link."}
        </p>
      </div>

      {mode === "register" ? (
        <label className="auth-field grid gap-2 text-xs font-bold text-white/65">
          <span>Name</span>
          <span className="relative block">
            <svg aria-hidden="true" className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.7" /><path d="M4.5 21a7.5 7.5 0 0115 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /></svg>
            <input
              className="auth-input min-h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 pl-11 text-sm font-medium text-white outline-none transition placeholder:text-white/22 hover:border-white/20 focus:border-[#45ddce]/55 focus:bg-[#45ddce]/[0.035] focus:ring-4 focus:ring-[#45ddce]/10"
              autoComplete="name"
              onChange={(event) => setName(event.target.value)}
              placeholder="Your full name"
              type="text"
              value={name}
            />
          </span>
        </label>
      ) : null}

      <label className="auth-field grid gap-2 text-xs font-bold text-white/65">
        <span>Email address</span>
        <span className="relative block">
          <svg aria-hidden="true" className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/28" fill="none" viewBox="0 0 24 24"><rect height="15" rx="2.5" stroke="currentColor" strokeWidth="1.7" width="19" x="2.5" y="4.5" /><path d="M4 7l8 6 8-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></svg>
          <input
            className="auth-input min-h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 pl-11 text-sm font-medium text-white outline-none transition placeholder:text-white/22 hover:border-white/20 focus:border-[#45ddce]/55 focus:bg-[#45ddce]/[0.035] focus:ring-4 focus:ring-[#45ddce]/10"
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            type="email"
            value={email}
          />
        </span>
      </label>

      {mode !== "forgot" ? <label className="auth-field grid gap-2 text-xs font-bold text-white/65">
        <span>Password</span>
        <span className="relative block">
          <svg aria-hidden="true" className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/28" fill="none" viewBox="0 0 24 24"><rect height="12" rx="2.5" stroke="currentColor" strokeWidth="1.7" width="17" x="3.5" y="9" /><path d="M7.5 9V6.5a4.5 4.5 0 019 0V9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /></svg>
          <input
            className="auth-input min-h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-11 pr-12 text-sm font-medium text-white outline-none transition placeholder:text-white/22 hover:border-white/20 focus:border-[#45ddce]/55 focus:bg-[#45ddce]/[0.035] focus:ring-4 focus:ring-[#45ddce]/10"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            value={password}
          />
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 grid w-12 place-items-center border-0 bg-transparent text-white/28 transition hover:text-[#75fff0]"
            onClick={() => setShowPassword((current) => !current)}
            type="button"
          >
            <svg aria-hidden="true" className="size-[17px]" fill="none" viewBox="0 0 24 24"><path d="M3 12c0-2.2 3.5-8 9-8s9 5.8 9 8-3.5 8-9 8-9-5.8-9-8z" stroke="currentColor" strokeWidth="1.7" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />{showPassword ? <path d="M4 4l16 16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /> : null}</svg>
          </button>
        </span>
      </label> : null}

      {mode === "login" && needsTwoFactor ? (
        <label className="auth-field grid gap-2 text-xs font-bold text-white/65">
          <span>Authenticator code</span>
          <input
            className="auth-input min-h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm font-medium text-white outline-none transition placeholder:text-white/22 focus:border-[#45ddce]/55 focus:ring-4 focus:ring-[#45ddce]/10"
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
        <p className="m-0 rounded-xl border border-rose-300/20 bg-rose-300/10 px-3.5 py-3 text-sm font-semibold text-rose-200">
          {error}
        </p>
      ) : null}

      {recoveryNotice ? (
        <div className="rounded-xl border border-[#45ddce]/20 bg-[#45ddce]/10 px-3.5 py-3 text-sm leading-5 text-[#a8fff5]">
          <p className="m-0">{recoveryNotice}</p>
          {developmentResetUrl ? <a className="mt-2 block break-all font-bold text-[#75fff0] underline underline-offset-2 hover:text-white" href={developmentResetUrl}>Open development reset link</a> : null}
        </div>
      ) : null}

      {mode === "login" ? (
        <div className="flex items-center justify-between gap-4 text-xs">
          <label className="flex cursor-pointer items-center gap-2 text-white/48">
            <input className="size-3.5 accent-[#45ddce]" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} type="checkbox" />
            Remember me
          </label>
          <button
            className="border-0 bg-transparent p-0 font-bold text-[#75fff0] transition hover:text-white"
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
        className="auth-submit inline-flex min-h-12 items-center justify-center rounded-xl border-0 bg-[#45ddce] text-sm font-black text-[#02110d] shadow-[0_14px_32px_rgba(69,221,206,0.2)] transition hover:-translate-y-0.5 hover:bg-[#75fff0] disabled:cursor-wait disabled:opacity-70"
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

      <button
        className="inline-flex min-h-9 items-center justify-center border-0 bg-transparent text-xs font-semibold text-white/40 disabled:cursor-wait disabled:opacity-70"
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
          <span>Don&apos;t have an account? <strong className="ml-1 text-[#75fff0] hover:text-white">Sign up</strong></span>
        ) : mode === "register" ? (
          <span>Already have an account? <strong className="ml-1 text-[#75fff0] hover:text-white">Sign in</strong></span>
        ) : (
          <span>Remembered your password? <strong className="ml-1 text-[#75fff0] hover:text-white">Back to sign in</strong></span>
        )}
      </button>
    </form>
  );
}
