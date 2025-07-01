"use client";
import React, { useState } from "react";
import BuyNowProducts from "./BuyNowProducts";
import CheckoutBillingDetails from "./CheckoutBillingDetails";
import CheckoutOrderSummary from "./CheckoutOrderSummary";

export default function CheckoutPage() {
  const { items: products, loading } = BuyNowProducts();

  const [billingDetails, setBillingDetails] = useState({
    customer: { fullName: "", company: "", phone: "", email: "" },
    address: { country: "", address1: "", address2: "", city: "", state: "", zip: "" },
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const availablePaymentMethods = ["Cash on Delivery", "Stripe", "PayPal", "Razorpay"];

  const costDetails = {
    subtotal: products.reduce((acc, p) => acc + Number(p.salePrice || p.regularPrice) * p.quantity, 0),
    shipping: 0,
    tax: 0,
    get total() {
      return this.subtotal + this.shipping + this.tax;
    },
  };

  const handlePlaceOrder = () => {
    alert("Order placed! (UI only, no backend)");
    console.log("Billing Details:", billingDetails);
  };

  return (
    <div className="container mx-auto px-4 md:px-20 my-14">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <p className="text-sm text-gray-600 mb-4">Please fill your details to place the order.</p>

      <div className="flex flex-col md:flex-row gap-8">
        
        <CheckoutBillingDetails billingDetails={billingDetails} setBillingDetails={setBillingDetails} errors={errors} />

        <CheckoutOrderSummary
          products={products}
          loading={loading}
          costDetails={costDetails}
          availablePaymentMethods={availablePaymentMethods}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          handlePlaceOrder={handlePlaceOrder}
        />
      </div>
    </div>
  );
}
