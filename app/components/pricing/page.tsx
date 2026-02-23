import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple pricing for students who want better study habits.",
};

const plans = [
  {
    name: "Free",
    price: "$0",
    subtitle: "Start building habits",
    features: ["3 lesson previews", "Basic streak tracking", "Limited insights"],
    cta: { label: "Get started", href: "/signup" },
    highlight: false,
  },
  {
    name: "Pro",
    price: "$7",
    subtitle: "Per month (student-friendly)",
    features: [
      "Unlimited lessons",
      "Full progress analytics",
      "Study session tracking",
      "Goal setting",
    ],
    cta: { label: "Go Pro", href: "/signup" },
    highlight: true,
  },
  {
    name: "Team",
    price: "$19",
    subtitle: "For small groups",
    features: ["Shared courses", "Group insights", "Admin tools (coming soon)"],
    cta: { label: "Contact us", href: "/components/contact" },
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-800 dark:bg-zinc-900 dark:text-white">
      <section className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12 pt-28 pb-16">
        <div className="space-y-3">
          <p className="text-sm font-medium text-zinc-500 dark:text-white/60">
            Pricing
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Simple plans. No weird stuff.
          </h1>
          <p className="max-w-2xl text-zinc-600 dark:text-white/70">
            Pick what fits you right now — you can upgrade anytime.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className={[
                "rounded-2xl border p-6 shadow-sm",
                p.highlight
                  ? "border-blue-600/40 bg-blue-50 dark:bg-blue-950/30"
                  : "border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-white/70">
                    {p.subtitle}
                  </p>
                </div>
                {p.highlight && (
                  <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-blue-600 text-white">
                    Popular
                  </span>
                )}
              </div>

              <div className="mt-6">
                <p className="text-4xl font-bold tracking-tight">
                  {p.price}
                  {p.name === "Pro" && (
                    <span className="text-base font-medium text-zinc-600 dark:text-white/70">
                      /mo
                    </span>
                  )}
                </p>
              </div>

              <ul className="mt-6 space-y-2 text-sm text-zinc-700 dark:text-white/75">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-white/40" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={p.cta.href}
                className={[
                  "mt-8 inline-block w-full text-center px-5 py-2 rounded-xl font-semibold transition",
                  p.highlight
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-zinc-200 hover:border-zinc-300 dark:border-white/10 dark:hover:border-white/20",
                ].join(" ")}
              >
                {p.cta.label}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-zinc-500 dark:text-white/60">
          *Pricing is a placeholder — update anytime.
        </p>
      </section>
    </main>
  );
}