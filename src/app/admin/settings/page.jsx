"use client";

import React, { useState, useEffect } from "react";
import { Input, Select, SelectItem, Textarea } from "@heroui/react";
import CustomButton from "@/components/block/CustomButton";

const countries = [
  { code: "US", name: "United States", currencyCode: "USD", currencySymbol: "$" },
  { code: "IN", name: "India", currencyCode: "INR", currencySymbol: "₹" },
  { code: "GB", name: "United Kingdom", currencyCode: "GBP", currencySymbol: "£" },
  { code: "EU", name: "Europe", currencyCode: "EUR", currencySymbol: "€" },
  { code: "JP", name: "Japan", currencyCode: "JPY", currencySymbol: "¥" },
  { code: "CA", name: "Canada", currencyCode: "CAD", currencySymbol: "C$" },
  { code: "AU", name: "Australia", currencyCode: "AUD", currencySymbol: "A$" },
  { code: "CN", name: "China", currencyCode: "CNY", currencySymbol: "¥" },
  { code: "BR", name: "Brazil", currencyCode: "BRL", currencySymbol: "R$" },
  { code: "ZA", name: "South Africa", currencyCode: "ZAR", currencySymbol: "R" },
  { code: "DE", name: "Germany", currencyCode: "EUR", currencySymbol: "€" },
  { code: "FR", name: "France", currencyCode: "EUR", currencySymbol: "€" },
  { code: "IT", name: "Italy", currencyCode: "EUR", currencySymbol: "€" },
  { code: "ES", name: "Spain", currencyCode: "EUR", currencySymbol: "€" },
  { code: "RU", name: "Russia", currencyCode: "RUB", currencySymbol: "₽" },
  { code: "KR", name: "South Korea", currencyCode: "KRW", currencySymbol: "₩" },
  { code: "MX", name: "Mexico", currencyCode: "MXN", currencySymbol: "$" },
  { code: "AE", name: "United Arab Emirates", currencyCode: "AED", currencySymbol: "د.إ" },
  { code: "NG", name: "Nigeria", currencyCode: "NGN", currencySymbol: "₦" },
  { code: "AR", name: "Argentina", currencyCode: "ARS", currencySymbol: "$" },
  { code: "ID", name: "Indonesia", currencyCode: "IDR", currencySymbol: "Rp" },
  { code: "SG", name: "Singapore", currencyCode: "SGD", currencySymbol: "S$" },
  { code: "TH", name: "Thailand", currencyCode: "THB", currencySymbol: "฿" },
  { code: "TR", name: "Turkey", currencyCode: "TRY", currencySymbol: "₺" },
];

export default function StoreSettingsForm() {
  const [loading, setLoading] = useState(false);
  const [storeSettings, setStoreSettings] = useState({
    storeTitle: "",
    storeDescription: "",
    country: "",
    currencyCode: "",
    currencySymbol: "",
  });

  const [isInvalid, setIsInvalid] = useState(false);

  // ✅ Auto-load store settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/setting");
        const data = await res.json();

        if (data) {
          setStoreSettings({
            storeTitle: data.storeTitle || "",
            storeDescription: data.storeDescription || "",
            country: data.country || "",
            currencyCode: data.currencyCode || "",
            currencySymbol: data.currencySymbol || "",
          });
        }
      } catch (err) {
        console.error("❌ Failed to load settings:", err);
      }
    };

    fetchSettings();
  }, []);

  const handleCountryChange = (keys) => {
    const selectedCode = Array.from(keys)[0];
    const country = countries.find((c) => c.code === selectedCode);
    if (country) {
      setStoreSettings((prev) => ({
        ...prev,
        country: country.code,
        currencyCode: country.currencyCode,
        currencySymbol: country.currencySymbol,
      }));
    }
  };

  const handleSave = async () => {
    if (!storeSettings.storeTitle) {
      setIsInvalid(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/setting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "store",
          ...storeSettings,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save settings");
      }
    } catch (err) {
      console.error("❌ Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Store Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Store Title"
          labelPlacement="outside"
          size="sm"
          placeholder="My Awesome Store"
          value={storeSettings.storeTitle}
          isInvalid={isInvalid && !storeSettings.storeTitle}
          errorMessage="Store title is required"
          onChange={(e) => setStoreSettings({ ...storeSettings, storeTitle: e.target.value })}
        />

        <Select
          label="Store Country"
          labelPlacement="outside"
          placeholder="Select a country"
          size="sm"
          selectedKeys={[storeSettings.country]}
          onSelectionChange={handleCountryChange}
        >
          {countries.map((country) => (
            <SelectItem key={country.code}>{country.name}</SelectItem>
          ))}
        </Select>

        <Input
          label="Currency Code"
          labelPlacement="outside"
          size="sm"
          placeholder="e.g. USD, INR"
          value={storeSettings.currencyCode}
          onChange={(e) => setStoreSettings({ ...storeSettings, currencyCode: e.target.value })}
        />

        <Input
          label="Currency Symbol"
          labelPlacement="outside"
          size="sm"
          placeholder="e.g. $, ₹"
          value={storeSettings.currencySymbol}
          onChange={(e) => setStoreSettings({ ...storeSettings, currencySymbol: e.target.value })}
        />
        <Textarea
          label="Store Description"
          labelPlacement="outside"
          placeholder="Short description of your store"
          value={storeSettings.storeDescription}
          onChange={(e) => setStoreSettings({ ...storeSettings, storeDescription: e.target.value })}
        />
      </div>

      <div className="mt-6">
        <CustomButton onPress={handleSave} isLoading={loading} className="bg-black text-white" size="sm">
          Save Settings
        </CustomButton>
      </div>
    </div>
  );
}
