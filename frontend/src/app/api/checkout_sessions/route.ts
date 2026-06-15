import { NextResponse } from "next/server";
import Stripe from "stripe";

// Check if Stripe key is available, use placeholder for development if not
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-05-27.dahlia", // Use the latest supported stable API version
});

export async function POST(request: Request) {
  try {
    // In production, we'd get the user ID from the session/JWT
    // For this prototype, we're building a simple success redirect
    
    // Determine the host for success/cancel URLs
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // If using the placeholder key, just simulate success redirect
    if (stripeSecretKey === "sk_test_placeholder") {
      console.warn("Using placeholder Stripe key. Simulating success.");
      return NextResponse.json({ url: `${baseUrl}/?success=true` });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "UzPlagiat Premium",
              description: "Cheksiz matn tekshirish imkoniyati (Unlimited checks)",
            },
            unit_amount: 499, // $4.99
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/?success=true`,
      cancel_url: `${baseUrl}/?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Error creating checkout session:", err);
    return NextResponse.json(
      { error: "Error creating checkout session", details: err.message },
      { status: 500 }
    );
  }
}
