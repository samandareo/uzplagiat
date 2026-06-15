import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-05-27.dahlia",
});

export async function POST(req: Request) {
  if (stripeSecretKey === "sk_test_placeholder" || !webhookSecret) {
      return NextResponse.json({ received: true, note: "Webhook simulated/skipped due to missing keys" });
  }

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Here you would typically look up the user by email or client reference ID
    // and update their subscription status in your database.
    console.log(`Payment successful for session ID: ${session.id}`);
    // e.g., db.users.update({ email: session.customer_details.email }, { isPremium: true })
  }

  return NextResponse.json({ received: true });
}
