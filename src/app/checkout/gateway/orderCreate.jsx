import React from "react";

export default function orderCreate() {
  const handlePreOrder = async ({ products, paymentDetails, billingDetails, status }) => {
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
          // products,
          paymentDetails: {
            method: paymentDetails?.paymentMethod?.id || "",
            amount: paymentDetails?.costDetails?.total || 0,
            currency: process.env.NEXT_PUBLIC_STORE_CURRENCY || "USD",
            status: status || "PENDING",
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to create pre-order");

      const data = await res.json();

      return data?._id || null; // ✅ Expecting `id` in response
    } catch (error) {
      console.error("Pre-order error:", error.message || error);
      return null;
    }
  };

  return handlePreOrder;
}
