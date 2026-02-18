import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import FooterPage from "@/app/components/Footer";
import PaymentMethodForm from "./PaymentMethod";
import { createSetupIntent } from "../action";

export const metadata = { title: "Study Smart | Add Payment Method" };

export default async function PaymentMethodPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signin?next=/billing/payment-method");

  const { clientSecret } = await createSetupIntent();

  // Where Stripe redirects after confirm
  const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/billing?saved=1`;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 lg:px-10 pt-24 pb-12">
        <div className="mb-5 flex items-center justify-between gap-3">
          <Link
            href="/billing"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to billing
          </Link>
        </div>

        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-black/10 dark:border-white/10">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Add a payment method
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Save a card for future upgrades and subscriptions.
            </p>
          </div>

          <div className="p-6">
            <PaymentMethodForm clientSecret={clientSecret!} returnUrl={returnUrl} />
          </div>
        </div>
      </div>

      <FooterPage />
    </main>
  );
}
