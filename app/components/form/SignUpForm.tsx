"use client";

import React, { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import study from "@/public/assets/signin/study.png";
import owlLogo from "@/public/owl.png";
import { signup } from "@/app/signup/actions";
import { signIn } from "next-auth/react";

type SignupState =
  | { ok: false; error?: string }
  | { ok: true; email: string; password: string }
  | null;

const initialState: SignupState = null;

export default function SignupForm() {
  const [state, formAction] = useActionState(signup as any, initialState);
  const [loading, setLoading] = useState(false);

  // ✅ Auto-login + redirect after successful signup
  useEffect(() => {
    if (!state || state.ok !== true) return;

    const run = async () => {
      setLoading(true);

      const res = await signIn("credentials", {
        email: state.email,
        password: state.password,
        redirect: false,
      });

      if (res?.error) {
        setLoading(false);
        // fallback if login fails for any reason
        window.location.href = "/signin?created=1";
        return;
      }

      window.location.href = "/dashboard";
    };

    run();
  }, [state]);

  return (
    <section className="relative isolate min-h-screen flex items-center justify-center pt-25">
      {/* Background Image (stable stacking, no flashing) */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src={study}
          alt="Study background"
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-75 dark:brightness-50"
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-white/40 dark:bg-black/60" />
      </div>

      {/* Signup Card */}
      <div
        className="
          relative z-10 w-full max-w-md rounded-2xl p-8
          bg-white shadow-xl
          dark:bg-zinc-900/80 dark:backdrop-blur
          dark:border dark:border-white/10
        "
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src={owlLogo}
            alt="Owl logo"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-zinc-100 mb-2">
          Create your account
        </h2>
        <p className="text-sm text-center text-gray-500 dark:text-zinc-400 mb-6">
          Start tracking your study progress
        </p>

        {/* ✅ Error (minimal visual addition) */}
        {state && state.ok === false && state.error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </div>
        )}

        {/* ✅ Loading message (minimal visual addition) */}
        {loading && (
          <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Creating your account… signing you in…
          </div>
        )}

        <form action={formAction} className="space-y-4">
          {/* Name row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                First name
              </label>
              <input
                name="firstName"
                required
                placeholder="John"
                disabled={loading}
                className="
                  w-full rounded-xl px-4 py-2
                  border border-gray-300 bg-white text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  dark:bg-zinc-800 dark:border-white/10 dark:text-zinc-100
                  dark:placeholder-zinc-400
                "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                Last name
              </label>
              <input
                name="lastName"
                required
                placeholder="Doe"
                disabled={loading}
                className="
                  w-full rounded-xl px-4 py-2
                  border border-gray-300 bg-white text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  dark:bg-zinc-800 dark:border-white/10 dark:text-zinc-100
                  dark:placeholder-zinc-400
                "
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
              Username
            </label>
            <input
              name="username"
              required
              placeholder="newlearner"
              disabled={loading}
              className="
                w-full rounded-xl px-4 py-2
                border border-gray-300 bg-white text-gray-900
                focus:outline-none focus:ring-2 focus:ring-blue-500
                dark:bg-zinc-800 dark:border-white/10 dark:text-zinc-100
                dark:placeholder-zinc-400
              "
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              disabled={loading}
              className="
                w-full rounded-xl px-4 py-2
                border border-gray-300 bg-white text-gray-900
                focus:outline-none focus:ring-2 focus:ring-blue-500
                dark:bg-zinc-800 dark:border-white/10 dark:text-zinc-100
                dark:placeholder-zinc-400
              "
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="••••••••"
              disabled={loading}
              className="
                w-full rounded-xl px-4 py-2
                border border-gray-300 bg-white text-gray-900
                focus:outline-none focus:ring-2 focus:ring-blue-500
                dark:bg-zinc-800 dark:border-white/10 dark:text-zinc-100
              "
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
              At least 8 characters
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
              Confirm password
            </label>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              placeholder="••••••••"
              disabled={loading}
              className="
                w-full rounded-xl px-4 py-2
                border border-gray-300 bg-white text-gray-900
                focus:outline-none focus:ring-2 focus:ring-blue-500
                dark:bg-zinc-800 dark:border-white/10 dark:text-zinc-100
              "
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing you in..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-sm text-center text-gray-600 dark:text-zinc-400">
          Already have an account?{" "}
          <Link
            className="text-blue-600 dark:text-blue-400 hover:underline"
            href="/signin"
          >
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
