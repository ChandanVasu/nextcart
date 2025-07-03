import SuccessPayment from "./SuccessPayment";

export default async function handlePayment({ products, paymentDetails, billingDetails }) {
  try {
    const res = await fetch("/api/payment/rzp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: paymentDetails?.costDetails?.total,
        currency: process.env.NEXT_PUBLIC_STORE_CURRENCY || "USD",
      }),
    });

    if (!res.ok) throw new Error("Failed to create Razorpay order");

    const resData = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RZP_KEY,
      amount: resData.amount,
      currency: resData.currency,
      order_id: resData.orderId,
      handler: function (response) {
        SuccessPayment({
          paymentData: {
            transaction_id: response.razorpay_payment_id,
            payment_order_id: response.razorpay_order_id,
            payment_methods: "razorpay",
            status: "paid",
            costDetails: paymentDetails?.costDetails,
            products: products,
          },
          billingDetails,
          checkoutData,
        });
      },
      prefill: {
        name: billingDetails?.customer?.fullName,
        email: billingDetails?.customer?.email,
        contact: billingDetails?.customer?.phone,
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Error during payment process:", error);
  }
}
