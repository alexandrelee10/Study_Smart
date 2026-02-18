"use client";

import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function InnerForm({ returnUrl }: { returnUrl: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: { return_url: returnUrl },
    });

    if (error) {
      setError(error.message ?? "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 p-4">
        <PaymentElement />
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full rounded-2xl px-4 py-3 text-sm font-medium
                   bg-zinc-900 text-white hover:bg-zinc-800
                   dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200
                   disabled:opacity-60 transition"
      >
        {loading ? "Saving…" : "Save payment method"}
      </button>

      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        This securely saves your card with Stripe. We never see your card number.
      </p>
    </form>
  );
}

export default function PaymentMethodForm({
  clientSecret,
  returnUrl,
}: {
  clientSecret: string;
  returnUrl: string;
}) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <InnerForm returnUrl={returnUrl} />
    </Elements>
  );
}
