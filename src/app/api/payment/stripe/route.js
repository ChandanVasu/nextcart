// app/api/payment/stripe/route.js
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export async function POST(request) {
  try {
    const { amount, currency, customer } = await request.json();

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
            unit_amount: Math.round(amount * 100), // Stripe requires cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: customer.email,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe Checkout Error:", error.message);
    return NextResponse.json({ error: "Stripe session creation failed", details: error.message }, { status: 500 });
  }
}
