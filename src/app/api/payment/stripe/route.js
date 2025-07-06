// app/api/payment/stripe/route.js
import Stripe from "stripe";
import { NextResponse } from "next/server";
import getDomainName from "@/lib/getServerDomainName";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export async function POST(request) {
  const domainName = await getDomainName();

  try {
    const { amount, currency, customer, metadata } = await request.json();

    if (!amount || !currency || !customer?.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: "Order Payment",
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: customer.email,
      success_url: `${domainName}/success?session_id={CHECKOUT_SESSION_ID}&source=stripe`,
      cancel_url: `${domainName}/cancel`,
      metadata,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe Checkout Error:", error.message);
    return NextResponse.json({ error: "Stripe session creation failed", details: error.message }, { status: 500 });
  }
}
