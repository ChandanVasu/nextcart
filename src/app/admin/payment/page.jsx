"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { Switch } from "@heroui/switch";

const collection = "paymentMethods";

const paymentGateways = [
  {
    id: "razorpay",
    name: "Razorpay",
    logo: "/Razorpay_logo.svg",
  },
  {
    id: "stripe",
    name: "Stripe",
    logo: "/stripe_logo.png",
  },
  {
    id: "paypal",
    name: "PayPal",
    logo: "/PayPal.svg",
  },
  // {
  //   id: "flutterwave",
  //   name: "Flutterwave",
  //   logo: "/Flutterwave.webp",
  // },
  {
    id: "cod",
    name: "Cash on Delivery",
    logo: "/COD.png",
  },
];

const Payment = () => {
  const [paymentMethods, setPaymentMethods] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [configId, setConfigId] = useState(null);

  // Fetch existing settings
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const res = await fetch(`/api/data?collection=${collection}`);
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setPaymentMethods(data[0].methods || {});
          setConfigId(data[0]._id);
        }
      } catch (err) {
        console.error("Error fetching payment settings:", err);
      }
    };

    fetchPaymentMethods();
  }, []);

  const handleSwitchChange = (id, isSelected) => {
    setPaymentMethods((prev) => ({
      ...prev,
      [id]: { active: isSelected },
    }));
  };

  const handleSave = async () => {
    setSaveLoading(true);

    const updatedMethods = {};
    for (const { id, name } of paymentGateways) {
      updatedMethods[id] = {
        id,
        name,
        active: !!paymentMethods[id]?.active,
      };
    }

    const payload = {
      collection,
      methods: updatedMethods,
    };

    if (configId) {
      payload._id = configId;
    }

    try {
      const response = await fetch("/api/data", {
        method: configId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setPaymentMethods(result.methods);
        setConfigId(result._id || configId);
      }
    } catch (err) {
      console.error("Save failed", err);
    }

    setSaveLoading(false);
  };

  return (
    <div className="p-4">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-lg md:text-xl font-bold">Payment Settings</h1>
          <p className="text-xs md:text-sm text-gray-500">Enable or disable payment gateways to control what your customers can use.</p>
        </div>
        <Button isLoading={saveLoading} size="sm" className="bg-black text-white" onPress={handleSave}>
          Save All Changes
        </Button>
      </header>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentGateways.map(({ id, name, logo }) => (
          <div key={id} className="bg-gray-100 p-4 mt-5 rounded-md flex justify-between items-center">
            <img className="w-[150px] h-[30px]" src={logo} alt={name} />
            <Switch size="sm" isSelected={!!paymentMethods[id]?.active} onValueChange={(isSelected) => handleSwitchChange(id, isSelected)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Payment;
