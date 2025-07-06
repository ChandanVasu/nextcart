"use client";
import React, { useState } from "react";
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@heroui/react";

export default function SplitCardForm({ billingDetails, amount, currency, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    const numberElement = elements.getElement(CardNumberElement);
    const expiryElement = elements.getElement(CardExpiryElement);
    const cvcElement = elements.getElement(CardCvcElement);

    if (!stripe || !numberElement || !expiryElement || !cvcElement) {
      onError("Stripe.js hasn't loaded yet.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/payment/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency,
          customer: billingDetails.customer,
        }),
      });

      const { clientSecret, error: intentError } = await res.json();

      if (intentError || !clientSecret) {
        onError(intentError || "Failed to create payment intent.");
        setLoading(false);
        return;
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: numberElement,
          billing_details: {
            name: billingDetails.customer.fullName,
            email: billingDetails.customer.email,
          },
        },
      });

      if (stripeError) {
        onError(stripeError.message);
      } else if (paymentIntent?.status === "succeeded") {
        onSuccess(paymentIntent);
      }
    } catch (error) {
      console.error("Payment error:", error);
      onError("Unexpected error occurred.");
    }

    setLoading(false);
  };

  const inputStyle = {
    base: {
      fontSize: "16px",
      color: "#1F2937",
      fontFamily: "Inter, sans-serif",
      "::placeholder": {
        color: "#9CA3AF",
      },
    },
    invalid: {
      color: "#EF4444",
    },
  };

  return (
    <div className="space-y-6">
      {/* Card Number */}
      <div>
        <label className="block text-xs text-gray-700 mb-2">Card number</label>
        <div className="p-3 border-b-1 border-indigo-200 rounded-xl  bg-white">
          <CardNumberElement options={{ style: inputStyle }} />
        </div>
      </div>

      {/* Expiration and CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-700 mb-2">Expiration date</label>
          <div className="p-3 border-b-1 border-b-blue-200 rounded-xl  bg-white">
            <CardExpiryElement options={{ style: inputStyle }} />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-700 mb-2">Security code</label>
          <div className="p-3 border-b-1 border-b-fuchsia-200 rounded-xl  bg-white">
            <CardCvcElement options={{ style: inputStyle }} />
          </div>
        </div>
      </div>

      <Button type="button" onPress={handlePayment} isLoading={loading} className="w-full bg-black text-white">
        Continue to Payment
      </Button>
    </div>
  );
}
