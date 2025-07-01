"use client";
import React from "react";
import { Input } from "@heroui/react";

export default function CheckoutBillingDetails({ billingDetails, setBillingDetails, errors }) {
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
  };

  const fields = [
    ["customer.fullName", "Full name"],
    ["customer.email", "Email address"],
    ["customer.company", "Company name"],
    ["address.country", "Country"],
    ["address.address1", "Street address"],
    ["address.address2", "Address line 2"],
    ["address.city", "City"],
    ["address.state", "State"],
    ["address.zip", "ZIP Code"],
    ["customer.phone", "Phone"],
  ];

  return (
    <div className="w-full md:w-3/5">
      <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(([name, label]) => (
          <Input
            key={name}
            label={label}
            name={name}
            value={name.split(".").reduce((o, k) => o[k], billingDetails)}
            onChange={handleInputChange}
            placeholder={`Enter your ${label.toLowerCase()}`}
            labelPlacement="outside"
            size="md"
          />
        ))}
      </div>
    </div>
  );
}
