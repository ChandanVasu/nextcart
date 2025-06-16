"use client";
import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@heroui/react";
import { Switch } from "@heroui/switch";
import { RiEditCircleFill } from "react-icons/ri";

const collection = "paymentMethods";

const paymentGateways = [
  {
    id: "razorpay",
    name: "Razorpay",
    logo: "/Razorpay_logo.svg",
    fields: ["keyId", "keySecret"], // Renamed for real Razorpay keys
  },
  {
    id: "stripe",
    name: "Stripe",
    logo: "/stripe_logo.png",
    fields: ["publishableKey", "secretKey"],
  },
  {
    id: "paypal",
    name: "PayPal",
    logo: "/PayPal.svg",
    fields: ["clientId", "clientSecret"],
  },
  {
    id: "flutterwave",
    name: "Flutterwave",
    logo: "/Flutterwave.webp",
    fields: ["publicKey", "secretKey"],
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    logo: "/COD.png",
    fields: [],
  },
];

const Payment = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState({});
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [formData, setFormData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [configId, setConfigId] = useState(null);

  // Fetch existing settings
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const res = await fetch(`/api/data?collection=${collection}`);
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setPaymentMethods(data[0].methods || {});
          setFormData(data[0].methods || {});
          setConfigId(data[0]._id);
        }
      } catch (err) {
        console.error("Error fetching payment settings:", err);
      }
    };

    fetchPaymentMethods();
  }, []);

  const handleEdit = (method) => {
    setSelectedMethod(method);
    setFormData(paymentMethods[method] || {});
    setIsOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSwitchChange = (id, isSelected) => {
    const gateway = paymentGateways.find((gw) => gw.id === id);
    const missingFields = gateway.fields.filter((field) => !formData[field] && !paymentMethods[id]?.[field]);

    if (isSelected && missingFields.length > 0) {
      setErrors((prev) => ({
        ...prev,
        [id]: `Please fill in the required fields: ${missingFields.join(", ")}`,
      }));
      return;
    }

    setPaymentMethods((prev) => ({
      ...prev,
      [id]: { ...prev[id], active: isSelected },
    }));

    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSave = async () => {
    setSaveLoading(true);

    const updatedMethods = {
      ...paymentMethods,
      ...(selectedMethod
        ? {
            [selectedMethod]: {
              ...formData,
              active: paymentMethods[selectedMethod]?.active,
            },
          }
        : {}),
    };

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
        setIsOpen(false);
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
          <p className="text-xs md:text-sm text-gray-500">Manage and update your payment details to ensure smooth transactions.</p>
        </div>
        <Button isLoading={saveLoading} size="sm" className="bg-black text-white" onPress={handleSave}>
          Save All Changes
        </Button>
      </header>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentGateways.map(({ id, name, logo, fields }) => {
          const isDisabled = fields.some((field) => !formData[field] && !paymentMethods[id]?.[field]);

          return (
            <div key={id} className="bg-gray-100 p-4 mt-5 rounded-md flex justify-between items-center">
              <img className="w-[150px] h-[30px]" src={logo} alt={name} />
              <div className="flex items-center gap-2">
                <Switch
                  size="sm"
                  isSelected={!!paymentMethods[id]?.active}
                  isDisabled={isDisabled}
                  onValueChange={(isSelected) => handleSwitchChange(id, isSelected)}
                />
                {fields.length > 0 && (
                  <button
                    onClick={() => handleEdit(id)}
                    className="bg-blue-100 p-2 rounded-md hover:bg-blue-200 flex items-center justify-center outline-none cursor-pointer"
                  >
                    <RiEditCircleFill className="text-blue-600 text-lg" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {Object.values(errors).some((error) => error) && (
        <div className="mt-4 p-4 bg-red-100 text-red-600 rounded-md">
          <ul>{Object.keys(errors).map((key) => errors[key] && <li key={key}>{errors[key]}</li>)}</ul>
        </div>
      )}

      {selectedMethod && (
        <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
          <ModalContent>
            <ModalHeader>Edit {selectedMethod} Payment Method</ModalHeader>
            <ModalBody>
              {paymentGateways
                .find((gateway) => gateway.id === selectedMethod)
                ?.fields.map((field) => (
                  <Input
                    key={field}
                    size="sm"
                    label={field.replace(/([A-Z])/g, " $1")}
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    placeholder={`Enter ${field}`}
                    isRequired
                    labelPlacement="outside"
                    description={`Enter your ${field} for ${selectedMethod}`}
                  />
                ))}
            </ModalBody>
            <ModalFooter>
              <Button className="bg-black text-white" size="sm" onPress={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button isLoading={saveLoading} size="sm" className="bg-blue-500 text-white" onPress={handleSave}>
                Save changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default Payment;
