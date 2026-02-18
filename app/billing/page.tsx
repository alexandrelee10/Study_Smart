import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import FooterPage from "../components/Footer";

export const metadata = { title: "Study Smart | Billing" };

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signin?next=/billing");

  const user = session.user;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-10 pt-24 pb-12">
        {/* Top row */}
        <div className="mb-5 flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to dashboard
          </Link>

          <Link
            href="/settings"
            className="rounded-xl border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-medium
                       hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            Settings →
          </Link>
        </div>

        {/* Header card */}
        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-blue-600/10 to-transparent dark:from-blue-500/10">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Billing
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Manage your plan, payment method, and invoices.
            </p>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Plan */}
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950/40 p-6">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Current plan
              </p>
              <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                Free
              </p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Basic tracking, courses, calendar, and streaks.
              </p>

              <div className="mt-5 flex flex-col gap-2">
                <button
                  type="button"
                  className="rounded-2xl px-4 py-3 text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-800
                             dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
                  disabled
                  title="Stripe coming soon"
                >
                  Upgrade (coming soon)
                </button>

                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Want Pro? We’ll add Stripe checkout next.
                </p>
              </div>
            </div>

            {/* Payment method */}
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950/40 p-6">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Payment method
              </p>

              <div className="mt-3 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-4">
                <p className="text-sm text-zinc-700 dark:text-zinc-200">
                  No payment method on file.
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Add a card once subscriptions are enabled.
                </p>
              </div>

              <button
                type="button"
                className="mt-4 w-full rounded-2xl px-4 py-3 text-sm font-medium
                           border border-zinc-200 dark:border-zinc-800
                           hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
                disabled
                title="Stripe coming soon"
              >
                Add payment method (coming soon)
              </button>
            </div>

            {/* Account */}
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950/40 p-6">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Billing email
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                {user.email ?? "No email"}
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Invoices and receipts will be sent here.
              </p>

              <div className="mt-4">
                <Link
                  href="/settings"
                  className="inline-flex items-center justify-center w-full rounded-2xl px-4 py-3 text-sm font-medium
                             bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Update email in Settings
                </Link>
              </div>

              <div className="mt-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Customer
                </p>
                <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">
                  {user.name ?? "Student"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoices */}
        <div className="mt-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-black/10 dark:border-white/10">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Invoices
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Download past invoices and receipts.
            </p>
          </div>

          <div className="p-6">
            {/* For now: empty state */}
            <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-6">
              <p className="text-sm text-zinc-700 dark:text-zinc-200">
                No invoices yet.
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Once you subscribe, invoices will show up here.
              </p>
            </div>
          </div>
        </div>

        {/* Pro features preview */}
        <div className="mt-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-black/10 dark:border-white/10">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Pro (preview)
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              What you’ll get when you upgrade.
            </p>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              "Unlimited courses & plans",
              "Advanced analytics (weekly/monthly)",
              "Cloud sync for events & tasks",
              "Export study history (CSV)",
              "Priority support",
              "Custom reminders",
            ].map((f) => (
              <div
                key={f}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 text-sm text-zinc-800 dark:text-zinc-200"
              >
                ✅ {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      <FooterPage />
    </main>
  );
}
