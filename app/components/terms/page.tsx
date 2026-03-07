import type { Metadata } from "next";
import FooterPage from "../Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for StudySmart.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-800 dark:bg-zinc-900 dark:text-white">
      <section className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12 pt-28 pb-16">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-white/70">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="mt-10 space-y-8 text-sm text-zinc-700 dark:text-white/75">
          <section>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
              1. Using StudySmart
            </h2>
            <p className="mt-2">
              You agree to use the product responsibly and not attempt to break,
              abuse, or misuse the service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
              2. Accounts
            </h2>
            <p className="mt-2">
              You’re responsible for maintaining the security of your account.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
              3. Content
            </h2>
            <p className="mt-2">
              You own the content you create. You give StudySmart permission to
              store and process it to provide the service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
              4. Changes
            </h2>
            <p className="mt-2">
              We may update features and policies over time. We’ll update the
              “Last updated” date when we do.
            </p>
          </section>
        </div>
      </section>
      <FooterPage />
    </main>
  );
}