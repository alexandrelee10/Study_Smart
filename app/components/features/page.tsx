import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Features",
  description: "Explore StudySmart features designed to help students study consistently.",
};

const features = [
  {
    title: "Study Streaks",
    desc: "Stay consistent with streak tracking and gentle reminders.",
  },
  {
    title: "Progress Tracking",
    desc: "See your growth over time with clear, simple progress views.",
  },
  {
    title: "Course Organization",
    desc: "Keep courses, lessons, and sessions structured and easy to revisit.",
  },
  {
    title: "Goal Setting",
    desc: "Set weekly goals and track how close you are to hitting them.",
  },
  {
    title: "Clean Dashboard",
    desc: "No clutter — just what you need to focus and keep moving.",
  },
  {
    title: "Student-Friendly UI",
    desc: "Built to be fast, simple, and motivating.",
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-800 dark:bg-zinc-900 dark:text-white">
      <section className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12 pt-28 pb-16">
        <div className="space-y-3">
          <p className="text-sm font-medium text-zinc-500 dark:text-white/60">
            Product
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Features that keep you consistent
          </h1>
          <p className="max-w-2xl text-zinc-600 dark:text-white/70">
            StudySmart is designed to help you build habits, track progress, and
            keep your studying organized — without feeling overwhelmed.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-white">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-white/70">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Try for free
          </Link>
          <Link
            href="/components/pricing"
            className="px-5 py-2 rounded-xl border border-zinc-200 hover:border-zinc-300 dark:border-white/10 dark:hover:border-white/20 transition"
          >
            View pricing
          </Link>
        </div>
      </section>
    </main>
  );
}