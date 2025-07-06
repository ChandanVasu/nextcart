export default async function orderCreate({ products, paymentDetails, billingDetails, status }) {
  try {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: billingDetails?.customer?.fullName,
        email: billingDetails?.customer?.email,
        shipping: {
          address: billingDetails?.address,
          name: billingDetails?.customer?.fullName,
          phone: billingDetails?.customer?.phone,
        },
        products,
        paymentDetails,
        status,
      }),
    });

    if (!res.ok) throw new Error("Failed to create pre-order");

    const data = await res.json();
    return data?._id || null;
  } catch (error) {
    console.error("Pre-order error:", error.message || error);
    return null;
  }
}
