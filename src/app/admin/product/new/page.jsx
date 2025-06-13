"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Input, Button, Select, SelectItem } from "@heroui/react";

function ProductForm() {
  const searchParams = useSearchParams();
  const productId = searchParams?.get("productId") || "";
  const isUpdate = searchParams?.get("isUpdate") === "true";

  const [addLoading, setAddLoading] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [categories, setCategories] = useState(new Set());
  const [fetchingCollection, setFetchingCollection] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState("₹");
  const [isInvalid, setIsInvalid] = useState(false);

  const visibilityOptions = ["Active", "Inactive"];
  const stockStatusOptions = ["In Stock", "Out of Stock"];
  const productLabelOptions = ["Trending", "New", "Hot", "Best Seller", "Limited Edition", "Sale", "Exclusive"];

  const [productData, setProductData] = useState({
    title: "",
    description: "",
    regularPrice: "",
    salePrice: "",
    sku: "",
    stockQuantity: "",
    brand: "",
    barcode: "",
    productLabel: "",
    tags: "",
    supplier: "",
    status: "Active",
    stockStatus: "In Stock",
    costPerItem: "",
  });

  const handleCategoryChange = (keys) => {
    setCategories(new Set(keys));
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setProductData((prevData) => ({ ...prevData, description: data }));
  };

  const addOrUpdateProduct = async () => {
    setAddLoading(true);

    if (!productData.title || !productData.description || !productData.regularPrice) {
      setIsInvalid(true);
      setAddLoading(false);
      return;
    }

    const method = isUpdate ? "PUT" : "POST";
    const url = `/api/product`;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productData,
          collections: Array.from(categories),
        }),
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isUpdate ? "Update Product" : "Add New Product"}</h1>
        <Button isLoading={addLoading} onPress={addOrUpdateProduct} className="bg-black text-white" size="sm">
          {isUpdate ? "Update Product" : "Publish Product"}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel */}
        <div className="flex-1 bg-white p-5 rounded-lg flex flex-col gap-5 sha-one">
          <Input
            label="Product Name"
            labelPlacement="outside"
            size="sm"
            isDisabled={inputDisabled}
            placeholder="Enter product name"
            value={productData.title}
            isInvalid={isInvalid && !productData.title}
            errorMessage="Product name is required"
            onChange={(e) => setProductData({ ...productData, title: e.target.value })}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Input
              label="Regular Price"
              labelPlacement="outside"
              size="sm"
              type="number"
              placeholder="Enter regular price"
              startContent={<span>{currencySymbol}</span>}
              value={productData.regularPrice}
              isInvalid={isInvalid && !productData.regularPrice}
              errorMessage="Price is required"
              onChange={(e) => setProductData({ ...productData, regularPrice: e.target.value })}
            />
            <Input
              label="Sale Price"
              labelPlacement="outside"
              size="sm"
              type="number"
              placeholder="Enter sale price"
              startContent={<span>{currencySymbol}</span>}
              value={productData.salePrice}
              onChange={(e) => setProductData({ ...productData, salePrice: e.target.value })}
            />
            <Input
              label="SKU"
              labelPlacement="outside"
              size="sm"
              placeholder="Enter SKU"
              value={productData.sku}
              onChange={(e) => setProductData({ ...productData, sku: e.target.value })}
            />
            <Input
              label="Stock Quantity"
              labelPlacement="outside"
              size="sm"
              type="number"
              placeholder="Enter quantity"
              value={productData.stockQuantity}
              onChange={(e) => setProductData({ ...productData, stockQuantity: e.target.value })}
            />
            <Input
              label="Cost per item"
              labelPlacement="outside"
              size="sm"
              type="number"
              placeholder="Enter cost per item"
              value={productData.costPerItem}
              onChange={(e) => setProductData({ ...productData, costPerItem: e.target.value })}
            />
            <Input
              label="Profit"
              labelPlacement="outside"
              size="sm"
              placeholder="Auto-calculated profit"
              readOnly
              value={
                productData.costPerItem
                  ? (parseFloat(productData.salePrice || productData.regularPrice || "0") - parseFloat(productData.costPerItem || "0")).toFixed(2)
                  : "---"
              }
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:w-[30%] w-full bg-white p-5 rounded-lg sha-one flex flex-col gap-5">
          <Select
            label="Product Status"
            labelPlacement="outside"
            size="sm"
            selectedKeys={[productData.status]}
            onSelectionChange={(keys) => setProductData({ ...productData, status: Array.from(keys)[0] })}
            placeholder="Select status"
          >
            {visibilityOptions.map((option) => (
              <SelectItem key={option}>{option}</SelectItem>
            ))}
          </Select>

          <Select
            label="Stock Status"
            labelPlacement="outside"
            size="sm"
            selectedKeys={[productData.stockStatus]}
            onSelectionChange={(keys) => setProductData({ ...productData, stockStatus: Array.from(keys)[0] })}
            placeholder="Select stock status"
          >
            {stockStatusOptions.map((option) => (
              <SelectItem key={option}>{option}</SelectItem>
            ))}
          </Select>

          <Select
            label="Collections"
            labelPlacement="outside"
            size="sm"
            selectionMode="multiple"
            selectedKeys={categories}
            onSelectionChange={handleCategoryChange}
            placeholder="Choose collections"
          >
            {fetchingCollection.map((c) => (
              <SelectItem key={c.title}>{c.title}</SelectItem>
            ))}
          </Select>

          <Select
            label="Product Label"
            labelPlacement="outside"
            size="sm"
            selectedKeys={[productData.productLabel]}
            onSelectionChange={(keys) => setProductData({ ...productData, productLabel: Array.from(keys)[0] })}
            placeholder="Select product label"
          >
            {productLabelOptions.map((label) => (
              <SelectItem key={label}>{label}</SelectItem>
            ))}
          </Select>

          <Input
            label="Tags"
            labelPlacement="outside"
            size="sm"
            placeholder="e.g. electronics, smart"
            value={productData.tags}
            onChange={(e) => setProductData({ ...productData, tags: e.target.value })}
          />

          <Input
            label="Supplier"
            labelPlacement="outside"
            size="sm"
            placeholder="Enter supplier name"
            value={productData.supplier}
            onChange={(e) => setProductData({ ...productData, supplier: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-lg">Loading product editor...</div>}>
      <ProductForm />
    </Suspense>
  );
}
