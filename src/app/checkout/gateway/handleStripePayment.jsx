import orderCreate from "./orderCreate";

export default async function handleStripePayment({ products, paymentDetails, billingDetails, setOrderCreatedLoading }) {
  try {
    const createOrder = orderCreate(); // ✅ call the exported function to get handler

    setOrderCreatedLoading(true);

    // ✅ Step 1: Pre-create order
    const orderId = await createOrder({
      products,
      paymentDetails,
      billingDetails,
    });

    if (!orderId) throw new Error("Order creation failed");

    // ✅ Step 2: Create Stripe session with orderId as metadata
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
        metadata: {
          orderId,
        },
      }),
    });

    if (!res.ok) throw new Error("Failed to create Stripe session");

    const { sessionId } = await res.json();

    const stripe = await import("@stripe/stripe-js").then((m) => m.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY));

    if (!stripe) throw new Error("Stripe failed to load");

    // await stripe.redirectToCheckout({ sessionId });
    setOrderCreatedLoading(false);
  } catch (error) {
    console.error("Stripe payment error:", error.message || error);
  }
}
