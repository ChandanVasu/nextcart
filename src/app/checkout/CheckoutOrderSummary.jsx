"use client";
import React from "react";
import { Button, Alert } from "@heroui/react";

export default function CheckoutOrderSummary({
  products = [],
  loading,
  costDetails,
  availablePaymentMethods = [],
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  handlePlaceOrder,
}) {
  return (
    <div className="w-full md:w-2/5 rounded-2xl p-6 border border-indigo-100 h-min">
      <h3 className="text-xl font-semibold mb-6 text-indigo-900">Your Order</h3>

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
        {availablePaymentMethods.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-3">
            {availablePaymentMethods.map((method) => (
              <div
                key={method}
                onClick={() => setSelectedPaymentMethod(method)}
                className={`flex items-center justify-between gap-3 cursor-pointer p-3 rounded-lg border transition ${
                  selectedPaymentMethod === method ? "border-blue-400" : "border-gray-200"
                }`}
              >
                <p className="text-base font-bold">{method}</p>
              </div>
            ))}
          </div>
        ) : (
          <Alert title="No active payment gateway available." />
        )}

        <Button
          onPress={handlePlaceOrder}
          isDisabled={!selectedPaymentMethod || loading}
          className="w-full bg-black text-white py-3 rounded-xl mt-5 hover:bg-indigo-700 transition duration-200 font-medium text-sm shadow"
        >
          Place Order
        </Button>
      </div>
    </div>
  );
}
