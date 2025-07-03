export default async function handlePaypalPayment({ products, paymentDetails, billingDetails }) {
  try {
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
      }),
    });

    if (!res.ok) throw new Error("Failed to create PayPal order");

    const { approvalUrl } = await res.json();

    if (!approvalUrl) throw new Error("Missing PayPal approval URL");

    window.location.href = approvalUrl; // Redirect to PayPal
  } catch (error) {
    console.error("PayPal payment error:", error.message || error);
  }
}
