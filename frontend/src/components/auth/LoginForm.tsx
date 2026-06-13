"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  getSession,
  loginWithPassword,
  registerWithPassword,
} from "@/lib/auth";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (getSession()) {
      router.replace(nextPath);
    }
  }, [nextPath, router]);

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

    if (password.trim().length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "register") {
        await registerWithPassword(normalizedName, normalizedEmail, password);
      } else {
        await loginWithPassword(normalizedEmail, password);
      }

      router.push(nextPath);
    } catch (authError) {
      setError(
        authError instanceof Error
          ? authError.message
          : "Could not authenticate. Try again.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="grid w-full gap-5 rounded-lg border border-[#ded6f2] bg-white/90 p-[clamp(24px,4vw,34px)] shadow-[0_24px_70px_rgba(69,37,143,0.16)] backdrop-blur-lg"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2">
        <span className="text-xs font-black uppercase text-[#6b35e8]">
          {mode === "login" ? "Login" : "Create account"}
        </span>
        <h1 className="m-0 text-[clamp(2rem,4vw,2.75rem)] leading-none font-black text-[#171321]">
          {mode === "login" ? "Access your workspace" : "Create your workspace"}
        </h1>
        <p className="m-0 leading-7 text-[#6d647d]">
          {mode === "login"
            ? "Sign in with an account saved in MongoDB."
            : "Create the first account in MongoDB, then continue to the dashboard."}
        </p>
      </div>

      {mode === "register" ? (
        <label className="grid gap-2 text-sm font-extrabold text-[#342d42]">
          <span>Name</span>
          <input
            className="min-h-12 w-full rounded-lg border border-[#d8ceef] bg-white px-3.5 text-[#171321] outline-none transition focus:border-[#6b35e8] focus:ring-4 focus:ring-[#6b35e8]/15"
            autoComplete="name"
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            type="text"
            value={name}
          />
        </label>
      ) : null}

      <label className="grid gap-2 text-sm font-extrabold text-[#342d42]">
        <span>Email</span>
        <input
          className="min-h-12 w-full rounded-lg border border-[#d8ceef] bg-white px-3.5 text-[#171321] outline-none transition focus:border-[#6b35e8] focus:ring-4 focus:ring-[#6b35e8]/15"
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          type="email"
          value={email}
        />
      </label>

      <label className="grid gap-2 text-sm font-extrabold text-[#342d42]">
        <span>Password</span>
        <input
          className="min-h-12 w-full rounded-lg border border-[#d8ceef] bg-white px-3.5 text-[#171321] outline-none transition focus:border-[#6b35e8] focus:ring-4 focus:ring-[#6b35e8]/15"
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimum 6 characters"
          type="password"
          value={password}
        />
      </label>

      {error ? (
        <p className="m-0 rounded-lg border border-rose-600/20 bg-rose-50 px-3.5 py-3 font-extrabold text-rose-700">
          {error}
        </p>
      ) : null}

      <button
        className="inline-flex min-h-12 items-center justify-center rounded-lg border-0 bg-[#6b35e8] font-black text-white shadow-[0_16px_34px_rgba(107,53,232,0.24)] transition hover:bg-[#43208f] disabled:cursor-wait disabled:opacity-70"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting
          ? "Opening..."
          : mode === "login"
            ? "Sign in"
            : "Create account"}
      </button>

      <button
        className="inline-flex min-h-10 items-center justify-center border-0 bg-transparent font-extrabold text-[#6b35e8] disabled:cursor-wait disabled:opacity-70"
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
