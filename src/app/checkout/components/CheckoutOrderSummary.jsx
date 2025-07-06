"use client";
import React, { useState } from "react";
import ProductData from "./Product";
import StripeCardForm from "./StripeCardForm";

export default function CheckoutOrderSummary({ billingDetails, setErrors }) {
  const { items: products, loading } = ProductData();

  const costDetails = {
    subtotal: products.reduce((acc, p) => acc + Number(p.salePrice || p.regularPrice) * p.quantity, 0),
    shipping: 0,
    tax: 0,
    get total() {
      return this.subtotal + this.shipping + this.tax;
    },
  };

  // const validateBillingDetails = () => {
  //   const newErrors = {};

  //   if (!billingDetails.customer.fullName.trim()) {
  //     newErrors.fullNameError = true;
  //   }

  //   if (!billingDetails.customer.email.trim()) {
  //     newErrors.emailError = true;
  //   }

  //   if (!billingDetails.address.address1.trim()) {
  //     newErrors.address1Error = true;
  //   }

  //   if (!billingDetails.address.country.trim()) {
  //     newErrors.countryError = true;
  //   }

  //   if (!billingDetails.address.zip.trim()) {
  //     newErrors.zipError = true;
  //   }

  //   return newErrors;
  // };

  return (
    <div className="w-full md:w-2/5 rounded-2xl p-6 border border-indigo-100 h-min">
      <h3 className="text-xl font-semibold mb-6 text-indigo-900">Your Order</h3>

      {/* Product Summary */}
      <div className="border-b pb-4 text-sm text-gray-700 space-y-4">
        <div className="flex justify-between font-medium text-gray-900">
          <span>Product</span>
          <span>Subtotal</span>
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500 text-sm">No products in cart.</p>
        ) : (
          products.map((item) => (
            <div key={item._id} className="flex justify-between items-start gap-4">
              <div className="flex gap-3 items-start">
                <img src={item.image} alt={item.title} className="w-16 rounded-md" />
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  {item.color && <p className="text-xs text-gray-500">Color: {item.color}</p>}
                  {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                </div>
              </div>
              <div className="text-right font-medium text-gray-900">
                {item.currencySymbol || "$"}
                {(item.salePrice || item.regularPrice) * item.quantity}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cost Summary */}
      <div className="py-4 border-b text-sm text-gray-700 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>
            {products[0]?.currencySymbol || "$"}
            {costDetails.subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>
            {products[0]?.currencySymbol || "$"}
            {costDetails.shipping.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between font-bold text-gray-900 text-base">
          <span>Total</span>
          <span>
            {products[0]?.currencySymbol || "$"}
            {costDetails.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mt-5 space-y-4">
        <h1 className="text-sm font-semibold">Payment Method</h1>

        <StripeCardForm
          billingDetails={billingDetails}
          amount={costDetails.total}
          currency="USD"
          onSuccess={(paymentIntent) => {
            console.log("Payment successful:", paymentIntent);
          }}
          onError={(msg) => {
            setErrors((prev) => ({ ...prev, paymentError: msg }));
          }}
        />
      </div>
    </div>
  );
}
