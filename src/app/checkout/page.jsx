"use client";
import React, { useState } from "react";
import { Button, Input, Alert } from "@heroui/react";

export default function CheckoutPage() {
  const [billingDetails, setBillingDetails] = useState({
    customer: {
      fullName: "",
      company: "",
      phone: "",
      email: "",
    },
    address: {
      country: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
    },
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const mockProducts = [
    {
      product_id: "2",
      title: "Product B",
      image: "https://res.cloudinary.com/ddmqg3fec/image/upload/v1750275541/store-images/aybigyzvgtx2hvcvem9h.webp",
      quantity: 1,
      salePrice: 499,
    },
  ];

  const costDetails = {
    subtotal: 1097,
    shipping: 0,
    tax: 0,
    total: 1097,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [group, field] = name.split(".");

    setBillingDetails((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [field]: value,
      },
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePlaceOrder = () => {
    alert("Order placed! (UI only, no API logic)");
    console.log("Billing Details:", errors);
  };

  const availablePaymentMethods = ["Cash on Delivery", "Stripe", "PayPal", "Razorpay"];

  return (
    <div className="container mx-auto  px-4 md:px-20 my-14">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <p className="text-sm text-gray-600 mb-4">Please fill your details to place the order.</p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Billing Section */}
        <div className="w-full md:w-3/5">
          <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full name"
              name="customer.fullName"
              value={billingDetails.customer.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              labelPlacement="outside"
              size="md"
            />
            <Input
              label="Email address"
              name="customer.email"
              value={billingDetails.customer.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              labelPlacement="outside"
              size="md"
            />
            <Input
              label="Company name"
              name="customer.company"
              value={billingDetails.customer.company}
              onChange={handleInputChange}
              placeholder="Enter your company name"
              labelPlacement="outside"
              size="md"
            />
            <Input
              label="Country"
              name="address.country"
              value={billingDetails.address.country}
              onChange={handleInputChange}
              placeholder="Enter your country"
              labelPlacement="outside"
              size="md"
            />
            <Input
              label="Street address"
              name="address.address1"
              value={billingDetails.address.address1}
              onChange={handleInputChange}
              placeholder="Enter your street address"
              labelPlacement="outside"
              size="md"
            />
            <Input
              label="Address line 2"
              name="address.address2"
              value={billingDetails.address.address2}
              onChange={handleInputChange}
              placeholder="Enter your address line 2"
              labelPlacement="outside"
              size="md"
            />
            <Input
              label="City"
              name="address.city"
              value={billingDetails.address.city}
              onChange={handleInputChange}
              placeholder="Enter your city"
              labelPlacement="outside"
              size="md"
            />
            <Input
              label="State"
              name="address.state"
              value={billingDetails.address.state}
              onChange={handleInputChange}
              placeholder="Enter your state"
              labelPlacement="outside"
              size="md"
            />
            <Input
              label="ZIP Code"
              name="address.zip"
              value={billingDetails.address.zip}
              onChange={handleInputChange}
              placeholder="Enter your ZIP code"
              labelPlacement="outside"
              size="md"
            />
            <Input
              label="Phone"
              name="customer.phone"
              value={billingDetails.customer.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              labelPlacement="outside"
              size="md"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-2/5 rounded-2xl p-6 border border-indigo-100 h-min">
          <h3 className="text-xl font-semibold mb-6 text-indigo-900">Your Order</h3>
          <div className="border-b pb-4 text-sm text-gray-700 space-y-4">
            <div className="flex justify-between font-medium text-gray-900">
              <span>Product</span>
              <span>Subtotal</span>
            </div>

            {mockProducts.map((item) => (
              <div key={item.product_id} className="flex justify-between items-start gap-4">
                <div className="flex gap-3 items-start">
                  <img src={item.image} alt={item.title} className="w-16 rounded-md " />
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    {item.color && <p className="text-xs text-gray-500">Color: {item.color}</p>}
                    {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                  </div>
                </div>
                <div className="text-right font-medium text-gray-900">₹{(item.salePrice * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="py-4 border-b text-sm text-gray-700 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{costDetails.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{costDetails.shipping}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-base">
              <span>Total</span>
              <span>₹{costDetails.total}</span>
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
              isDisabled={!selectedPaymentMethod}
              className="w-full bg-black text-white py-3 rounded-xl mt-5 hover:bg-indigo-700 transition duration-200 font-medium text-sm shadow"
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
