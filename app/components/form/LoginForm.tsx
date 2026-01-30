"use client";

import Image from "next/image";
import study from "@/public/assets/signin/study.png";
import owlLogo from "@/public/owl.png";
import Link from "next/link";

const LoginForm = () => {
  return (
    <section className="relative isolate min-h-screen flex items-center justify-center">
      {/* Background (no negative z-index) */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src={study}
          alt="Study background"
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-75 dark:brightness-50"
        />
        <div className="absolute inset-0 bg-white/40 dark:bg-black/60" />
      </div>

      {/* Login Card (on top) */}
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
          Welcome back
        </h2>

        <p className="text-sm text-center text-gray-500 dark:text-zinc-400 mb-6">
          Log in to continue studying smarter
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
              Email
            </label>
            <input
              type="email"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="
                w-full rounded-xl px-4 py-2
                border border-gray-300 bg-white text-gray-900
                focus:outline-none focus:ring-2 focus:ring-blue-500
                dark:bg-zinc-800 dark:border-white/10 dark:text-zinc-100
              "
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl py-2 font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600 dark:text-zinc-400">
          Don’t have an account?{" "}
          <Link className="text-blue-600 dark:text-blue-400 hover:underline" href="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginForm;
