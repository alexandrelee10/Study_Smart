"use client";

import Image from "next/image";
import Link from "next/link";
import study from "@/public/assets/signin/study.png";
import owlLogo from "@/public/owl.png";
import { signup } from "@/app/signup/actions";

export default function SignupForm() {
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

        <form action={signup} className="space-y-4">
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
            className="w-full rounded-xl bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-sm text-center text-gray-600 dark:text-zinc-400">
          Already have an account?{" "}
          <Link className="text-blue-600 dark:text-blue-400 hover:underline" href="/signin">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
