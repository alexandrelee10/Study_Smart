import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for StudySmart.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-800 dark:bg-zinc-900 dark:text-white">
      <section className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12 pt-28 pb-16">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-white/70">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="mt-10 space-y-8 text-sm text-zinc-700 dark:text-white/75">
          <section>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
              1. What we collect
            </h2>
            <p className="mt-2">
              We may collect account information (like email), course/lesson data
              you create, and basic usage data to improve the product.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
              2. How we use your data
            </h2>
            <p className="mt-2">
              We use your data to provide features (streaks, tracking), improve
              the app, and keep the service secure.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
              3. Sharing
            </h2>
            <p className="mt-2">
              We don’t sell your data. We may share limited data with service
              providers (hosting, analytics) to operate the product.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
              4. Your choices
            </h2>
            <p className="mt-2">
              You can request deletion of your account and associated data.
            </p>
          </section>
        </div>

        <p className="mt-12 text-xs text-zinc-500 dark:text-white/50">
          This is a placeholder policy — update with your real legal terms.
        </p>
      </section>
    </main>
  );
}