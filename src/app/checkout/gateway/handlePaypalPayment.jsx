import orderCreate from "./orderCreate";

export default async function handlePaypalPayment({ products, paymentDetails, billingDetails }) {
  try {
    // ✅ Step 1: Pre-create order in your DB
    const createOrder = orderCreate();
    const orderId = await createOrder({
      products,
      paymentDetails,
      billingDetails,
    });

    if (!orderId) throw new Error("Order creation failed");

    // ✅ Step 2: Create PayPal order
    const res = await fetch("/api/payment/paypal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: paymentDetails?.costDetails?.total || 699,
        currency: process.env.NEXT_PUBLIC_STORE_CURRENCY || "USD",
        customer: {
          name: billingDetails?.customer?.fullName,
          email: billingDetails?.customer?.email,
        },
        metadata: { orderId },
      }),
    });

    if (!res.ok) throw new Error("Failed to create PayPal order");

    const { approvalUrl } = await res.json();

    if (!approvalUrl) throw new Error("Missing PayPal approval URL");

    // ✅ Step 3: Redirect to PayPal
    window.location.href = approvalUrl;
  } catch (error) {
    console.error("PayPal payment error:", error.message || error);
  }
}
