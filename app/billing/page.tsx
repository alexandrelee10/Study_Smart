import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import FooterPage from "../components/Footer";
import { startCheckout } from "./action";

export const metadata = { title: "Study Smart | Billing" };

function PlanCard({
  name,
  price,
  period,
  features,
  highlight,
  button,
}: {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlight?: boolean;
  button: React.ReactNode;
}) {
  return (
    <div
      className={[
        "rounded-3xl border shadow-sm overflow-hidden",
        "border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50",
        highlight ? "ring-2 ring-blue-600/40 dark:ring-blue-400/30" : "",
      ].join(" ")}
    >
      <div
        className={[
          "p-6 border-b border-black/10 dark:border-white/10",
          highlight
            ? "bg-gradient-to-r from-blue-600/15 to-transparent dark:from-blue-500/15"
            : "bg-gradient-to-r from-zinc-500/10 to-transparent dark:from-white/5",
        ].join(" ")}
      >
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{name}</p>
        <div className="mt-2 flex items-end gap-2">
          <p className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">{price}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{period}</p>
        </div>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{period}</p>
      </div>

      <div className="p-6">
        <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <span className="mt-0.5">-</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5">{button}</div>
      </div>
    </div>
  );
}

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signin?next=/billing");

  const user = session.user;

  const priceMonthly = process.env.STRIPE_PRICE_PRO_MONTHLY;
  const priceYearly = process.env.STRIPE_PRICE_PRO_YEARLY;

  const checkoutMonthly = priceMonthly ? startCheckout.bind(null, priceMonthly) : null;
  const checkoutYearly = priceYearly ? startCheckout.bind(null, priceYearly) : null;

  const showSuccess = false; // you can read searchParams if you want later

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-10 pt-24 pb-12">


        {/* Header */}
        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-blue-600/10 to-transparent dark:from-blue-500/10">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Billing
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Manage your plan, payment method, and invoices.
            </p>
          </div>

          {/* Plans */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Plans
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Upgrade anytime. Cancel anytime.
            </p>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
              <PlanCard
                name="Free"
                price="$0"
                period="Forever"
                features={[
                  "Courses & enrollments",
                  "Study sessions",
                  "Calendar (basic)",
                  "Streak tracking",
                ]}
                button={
                  <button
                    className="w-full rounded-2xl px-4 py-3 text-sm font-medium
                               border border-zinc-200 dark:border-zinc-800
                               text-zinc-600 dark:text-zinc-300"
                    disabled
                  >
                    Current plan
                  </button>
                }
              />

              <PlanCard
                name="Pro"
                price="$9"
                period="/ month"
                highlight
                features={[
                  "Unlimited plans & tasks",
                  "Advanced analytics",
                  "Cloud sync for events",
                  "Export study history",
                  "Priority support",
                ]}
                button={
                  checkoutMonthly ? (
                    <form action={checkoutMonthly}>
                      <button
                        type="submit"
                        className="w-full rounded-2xl px-4 py-3 text-sm font-medium
                                   bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        Upgrade to Pro Monthly
                      </button>
                    </form>
                  ) : (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                      Add <code>STRIPE_PRICE_PRO_MONTHLY</code> to enable.
                    </div>
                  )
                }
              />

              <PlanCard
                name="Pro Annual"
                price="$79"
                period="/ year"
                features={[
                  "Everything in Pro",
                  "Cheaper than monthly",
                  "Best value plan",
                  "Early access features",
                ]}
                button={
                  checkoutYearly ? (
                    <form action={checkoutYearly}>
                      <button
                        type="submit"
                        className="w-full rounded-2xl px-4 py-3 text-sm font-medium
                                   bg-zinc-900 text-white hover:bg-zinc-800
                                   dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
                      >
                        Upgrade to Pro Yearly
                      </button>
                    </form>
                  ) : (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                      Add <code>STRIPE_PRICE_PRO_YEARLY</code> to enable.
                    </div>
                  )
                }
              />
            </div>
          </div>

          {/* Payment method shortcut */}
          <div className="px-6 pb-6">
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950/40 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Payment method
                  </p>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Save a card for upgrades. Stored securely with Stripe.
                  </p>
                </div>

                <Link
                  href="/billing/payment-method"
                  className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium
                             bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Add card
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Invoices (still placeholder) */}
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

        {/* Account */}
        <div className="mt-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-black/10 dark:border-white/10">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Account
            </h2>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Billing email</p>
              <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                {user.email ?? "No email"}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Customer</p>
              <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {user.name ?? "Student"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <FooterPage />
    </main>
  );
}
