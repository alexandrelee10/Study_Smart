"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const sp = useSearchParams();
  const token = sp.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  const canSubmit = useMemo(() => {
    if (!token) return false;
    if (password.length < 8) return false;
    if (password !== confirm) return false;
    return true;
  }, [token, password, confirm]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("loading");
    setMsg("");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    if (res.ok) {
      setStatus("done");
      setMsg("Password updated. You can sign in now.");
      return;
    }

    const data = await res.json().catch(() => ({}));
    setStatus("error");
    setMsg(data?.error ?? "Invalid or expired link. Please request a new one.");
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-md px-4 sm:px-8 pt-24 pb-12">
        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm p-6">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Choose a new password
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Make it strong (8+ characters). This link may expire.
          </p>

          {!token ? (
            <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200">
              Missing token. Go back and request a new reset link.
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 grid gap-4">
              <div>
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  New password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-black/10 dark:border-white/10
                             bg-white dark:bg-zinc-950/40 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100
                             outline-none focus:ring-2 focus:ring-blue-500/30"
                  required
                />
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Minimum 8 characters.
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-black/10 dark:border-white/10
                             bg-white dark:bg-zinc-950/40 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100
                             outline-none focus:ring-2 focus:ring-blue-500/30"
                  required
                />
              </div>

              <button
                disabled={status === "loading" || !canSubmit}
                className="rounded-2xl px-5 py-3 text-sm font-semibold
                           bg-zinc-900 text-white hover:bg-zinc-800
                           dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200
                           transition disabled:opacity-60"
              >
                {status === "loading" ? "Saving…" : "Update password"}
              </button>

              {msg ? (
                <div
                  className={[
                    "rounded-2xl px-4 py-3 text-sm border",
                    status === "done"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
                      : "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-200",
                  ].join(" ")}
                >
                  {msg}
                </div>
              ) : null}

              <div className="flex items-center justify-between text-sm">
                <Link
                  href="/signin"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Go to sign in →
                </Link>
                <Link
                  href="/forgot-password"
                  className="font-medium text-zinc-700 hover:underline dark:text-zinc-200"
                >
                  Get a new link
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}