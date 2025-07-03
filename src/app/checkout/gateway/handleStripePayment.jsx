
export default async function handleStripePayment({ products, paymentDetails, billingDetails }) {
  try {
    const res = await fetch("/api/payment/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: paymentDetails?.costDetails?.total || 699,
        currency: process.env.NEXT_PUBLIC_STORE_CURRENCY || "USD",
        customer: {
          name: billingDetails?.customer?.fullName,
          email: billingDetails?.customer?.email,
        },
      }),
    });

    if (!res.ok) throw new Error("Failed to create Stripe session");

    const { sessionId } = await res.json();

    // Use public key from NEXT_PUBLIC env variable
    const stripe = await import("@stripe/stripe-js").then((m) => m.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY));

    if (!stripe) throw new Error("Stripe failed to load");

    await stripe.redirectToCheckout({ sessionId });
  } catch (error) {
    console.error("Stripe payment error:", error.message || error);
  }
}
