"use server";

import Stripe from "stripe";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

/**
 * Get or create a Stripe customer for the signed-in user.
 * Stores stripeCustomerId on the User row (recommended).
 */
async function getOrCreateStripeCustomerId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/signin?next=/billing");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true, username: true, stripeCustomerId: true },
  });

  if (!user) throw new Error("User not found");

  if (user.stripeCustomerId) return user.stripeCustomerId;

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.username,
    metadata: { userId: user.id },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

/**
 * ✅ Save card flow (Stripe SetupIntent)
 * Used by /billing/payment-method page.
 */
export async function createSetupIntent() {
  const customerId = await getOrCreateStripeCustomerId();

  const intent = await stripe.setupIntents.create({
    customer: customerId,
    usage: "off_session",
    automatic_payment_methods: { enabled: true },
  });

  return { clientSecret: intent.client_secret };
}

/**
 * ✅ Upgrade plan flow (Stripe Checkout subscription)
 * Used by Billing page upgrade buttons.
 */
export async function startCheckout(priceId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signin?next=/billing");

  const customerId = await getOrCreateStripeCustomerId();
  const appUrl = getAppUrl();

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/billing?success=1`,
    cancel_url: `${appUrl}/billing?canceled=1`,
    metadata: {
      userId: (session.user as any).id ?? "",
    },
  });

  redirect(checkout.url!);
}
