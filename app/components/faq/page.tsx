import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ | StudySmart",
  description: "Frequently asked questions about StudySmart.",
};

const faqs = [
  {
    q: "Is StudySmart free?",
    a: "Yes — there’s a free plan you can use to get started and preview content. You can upgrade anytime.",
  },
  {
    q: "Do I need an account?",
    a: "You can browse some areas, but creating an account unlocks your dashboard and tracking features.",
  },
  {
    q: "Can I use this for multiple courses?",
    a: "Yep. StudySmart is built to organize multiple courses and lessons.",
  },
  {
    q: "Does it work on mobile?",
    a: "Yes — the UI is responsive and designed to feel good on smaller screens.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-800 dark:bg-zinc-900 dark:text-white">
      <section className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12 pt-28 pb-16">
        <div className="space-y-3">
          <p className="text-sm font-medium text-zinc-500 dark:text-white/60">
            Support
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">FAQ</h1>
          <p className="max-w-2xl text-zinc-600 dark:text-white/70">
            Quick answers to common questions.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950"
            >
              <summary className="cursor-pointer font-semibold text-zinc-900 dark:text-white">
                {item.q}
              </summary>
              <p className="mt-3 text-sm text-zinc-600 dark:text-white/70">
                {item.a}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/components/contact"
            className="inline-block px-5 py-2 rounded-xl border border-zinc-200 hover:border-zinc-300 dark:border-white/10 dark:hover:border-white/20 transition"
          >
            Still need help? Contact us
          </Link>
        </div>
      </section>
    </main>
  );
}