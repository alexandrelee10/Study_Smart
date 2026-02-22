"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!clean) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clean }),
      });

      // Always show the same success message for privacy
      if (res.ok) {
        setStatus("sent");
        setMessage("If an account exists for that email, we sent a reset link.");
        return;
      }

      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-md px-4 sm:px-8 pt-24 pb-12">
        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm p-6">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Reset your password
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Enter your email and we’ll send you a secure reset link.
          </p>

          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-2xl border border-black/10 dark:border-white/10
                           bg-white dark:bg-zinc-950/40 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100
                           outline-none focus:ring-2 focus:ring-blue-500/30"
                required
              />
            </div>

            <button
              disabled={status === "loading"}
              className="rounded-2xl px-5 py-3 text-sm font-semibold
                         bg-zinc-900 text-white hover:bg-zinc-800
                         dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200
                         transition disabled:opacity-60"
            >
              {status === "loading" ? "Sending…" : "Send reset link"}
            </button>

            {message ? (
              <div
                className={[
                  "rounded-2xl px-4 py-3 text-sm border",
                  status === "sent"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
                    : "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-200",
                ].join(" ")}
              >
                {message}
              </div>
            ) : null}

            <div className="flex items-center justify-between text-sm">
              <Link
                href="/signin"
                className="font-medium text-zinc-700 hover:underline dark:text-zinc-200"
              >
                ← Back to sign in
              </Link>
              <Link
                href="/signup"
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Create account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}