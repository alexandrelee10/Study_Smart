import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | StudySmart",
  description: "Learn what StudySmart is and why it exists.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-800 dark:bg-zinc-900 dark:text-white">
      <section className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12 pt-28 pb-16">
        <div className="space-y-3">
          <p className="text-sm font-medium text-zinc-500 dark:text-white/60">
            Company
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            About StudySmart
          </h1>
          <p className="max-w-2xl text-zinc-600 dark:text-white/70">
            StudySmart is built to help students stay consistent, track progress,
            and make studying feel less chaotic.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
            <h3 className="font-semibold">The mission</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-white/70">
              Build better habits through simplicity, structure, and momentum.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
            <h3 className="font-semibold">The problem</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-white/70">
              Students get overwhelmed by tools that are either too complex or
              not focused on studying.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
            <h3 className="font-semibold">The approach</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-white/70">
              Keep it clean, keep it motivating, keep it consistent.
            </p>
          </div>
        </div>

        <div className="mt-12 flex gap-3 flex-wrap">
          <Link
            href="/components/features"
            className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Explore features
          </Link>
          <Link
            href="/components/contact"
            className="px-5 py-2 rounded-xl border border-zinc-200 hover:border-zinc-300 dark:border-white/10 dark:hover:border-white/20 transition"
          >
            Contact us
          </Link>
        </div>
      </section>
    </main>
  );
}