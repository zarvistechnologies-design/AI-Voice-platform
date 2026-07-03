"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";

import {
  getSession,
  loginWithGoogle,
  loginWithPassword,
  registerWithPassword,
  validateStoredSession,
} from "@/lib/auth";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

type GoogleCredentialResponse = { credential?: string };

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, string | number>,
          ) => void;
        };
      };
    };
  }
}

function getNextPath(path: string | null) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/dashboard";
  }

  return path;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = getNextPath(searchParams.get("next"));

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [needsTwoFactor, setNeedsTwoFactor] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  const handleGoogleCredential = useCallback(async (response: GoogleCredentialResponse) => {
    if (!response.credential) {
      setError("Google did not return a sign-in credential.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await loginWithGoogle(response.credential);
      const session = await validateStoredSession();
      if (!session) throw new Error("Google sign-in completed, but the session could not be verified.");
      router.push(nextPath);
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Google sign-in failed.");
      setIsSubmitting(false);
    }
  }, [nextPath, router]);

  const renderGoogleButton = useCallback(() => {
    if (!googleClientId || !window.google || !googleButtonRef.current) return;
    googleButtonRef.current.replaceChildren();
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: (response) => void handleGoogleCredential(response),
    });
    window.google.accounts.id.renderButton(googleButtonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: mode === "login" ? "signin_with" : "signup_with",
      shape: "rectangular",
      width: Math.max(240, Math.floor(googleButtonRef.current.clientWidth)),
    });
  }, [handleGoogleCredential, mode]);

  useEffect(() => {
    renderGoogleButton();
  }, [renderGoogleButton]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

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

    if (password.trim().length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
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
      className="grid w-full gap-5 rounded-lg border border-white/10 bg-[#0b1120] p-[clamp(24px,4vw,34px)] text-white shadow-[0_26px_90px_rgba(0,0,0,0.32)]"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2">
        <span className="text-xs font-bold text-cyan-200">
          {mode === "login" ? "Login" : "Create account"}
        </span>
        <h1 className="m-0 text-3xl font-semibold text-white">
          {mode === "login" ? "Access your workspace" : "Create your workspace"}
        </h1>
        <p className="m-0 text-sm leading-6 text-slate-400">
          {mode === "login"
            ? "Sign in to manage agents, calls, campaigns, and outcomes."
            : "Create your workspace and launch your first voice agent."}
        </p>
      </div>

      <Script
        onLoad={renderGoogleButton}
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
      />
      {googleClientId ? (
        <div className={isSubmitting ? "pointer-events-none opacity-70" : ""} ref={googleButtonRef} />
      ) : null}

      {googleClientId ? (
        <div className="flex items-center gap-3" aria-hidden="true">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-sm text-slate-500">or</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>
      ) : null}

      {mode === "register" ? (
        <label className="grid gap-2 text-xs font-semibold text-slate-300">
          <span>Name</span>
          <input
            className="min-h-12 w-full rounded-lg border border-white/12 bg-white/[0.05] px-3.5 text-sm font-medium text-white outline-none placeholder:text-slate-600 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10"
            autoComplete="name"
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            type="text"
            value={name}
          />
        </label>
      ) : null}

      <label className="grid gap-2 text-xs font-semibold text-slate-300">
        <span>Email</span>
        <input
          className="min-h-12 w-full rounded-lg border border-white/12 bg-white/[0.05] px-3.5 text-sm font-medium text-white outline-none placeholder:text-slate-600 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10"
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          type="email"
          value={email}
        />
      </label>

      <label className="grid gap-2 text-xs font-semibold text-slate-300">
        <span>Password</span>
        <input
          className="min-h-12 w-full rounded-lg border border-white/12 bg-white/[0.05] px-3.5 text-sm font-medium text-white outline-none placeholder:text-slate-600 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10"
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimum 8 characters"
          type="password"
          value={password}
        />
      </label>

      {mode === "login" && needsTwoFactor ? (
        <label className="grid gap-2 text-xs font-semibold text-slate-300">
          <span>Authenticator code</span>
          <input
            className="min-h-12 w-full rounded-lg border border-white/12 bg-white/[0.05] px-3.5 text-sm font-medium text-white outline-none placeholder:text-slate-600 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10"
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
        <p className="m-0 rounded-lg border border-rose-300/20 bg-rose-300/10 px-3.5 py-3 text-sm font-medium text-rose-200">
          {error}
        </p>
      ) : null}

      <button
        className="inline-flex min-h-12 items-center justify-center rounded-lg border-0 bg-[#08b8c8] text-sm font-extrabold text-slate-950 shadow-[0_16px_34px_rgba(8,184,200,0.22)] hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-70"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting
          ? "Opening..."
          : mode === "login"
            ? "Sign in"
            : "Create account"}
      </button>

      {mode === "login" ? <a className="text-center text-sm font-semibold text-cyan-200 hover:text-cyan-100" href="/forgot-password">Forgot password?</a> : null}

      <button
        className="inline-flex min-h-10 items-center justify-center border-0 bg-transparent text-sm font-semibold text-cyan-200 hover:text-cyan-100 disabled:cursor-wait disabled:opacity-70"
        disabled={isSubmitting}
        onClick={() => {
          setError("");
          setMode((current) => (current === "login" ? "register" : "login"));
        }}
        type="button"
      >
        {mode === "login"
          ? "Need an account? Create one"
          : "Already have an account? Sign in"}
      </button>
    </form>
  );
}
