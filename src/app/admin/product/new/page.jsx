"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Input, Select, SelectItem, Textarea } from "@heroui/react";
import CustomButton from "@/components/block/CustomButton";
import ImageSelector from "@/components/block/ImageSelector";
import { FaPlus } from "react-icons/fa";

const TextEditor = dynamic(() => import("@/components/block/TextEditor"), { ssr: false });

function ProductForm() {
  const searchParams = useSearchParams();

  const productId = searchParams?.get("productId") || "";
  const isUpdate = searchParams?.get("isUpdate") === "true";

  const [addLoading, setAddLoading] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [categories, setCategories] = useState(new Set());
  const [fetchingCollection, setFetchingCollection] = useState([]);
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const [currencyCode, setCurrencyCode] = useState("USD");
  const [currencySymbol, setCurrencySymbol] = useState("$");

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const res = await fetch("/api/setting");
        const data = await res.json();

        if (data) {
          setCurrencyCode(data.currencyCode || "");
          setCurrencySymbol(data.currencySymbol || "");
        }
      } catch (err) {
        console.error("❌ Failed to fetch currency:", err);
      }
    };

    fetchCurrency();
  }, []);

  const [variantInput, setVariantInput] = useState({ name: "", options: "" });

  const fetchCollection = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(`/api/collection`, { cache: "reload" });
      const data = await response.json();
      if (response.ok) {
        setFetchingCollection(data);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, []);

  const [productData, setProductData] = useState({
    title: "",
    description: "",
    shortDescription: "",
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
    variants: [], // ✅ New: variants
  });

  const visibilityOptions = ["Active", "Inactive"];
  const stockStatusOptions = ["In Stock", "Out of Stock"];
  const productLabelOptions = ["Trending", "New", "Hot", "Best Seller", "Limited Edition", "Sale", "Exclusive", "None"];

  useEffect(() => {
    const fetchProductById = async () => {
      if (!isUpdate || !productId) return;

      try {
        const res = await fetch(`/api/product/${productId}`);
        const data = await res.json();

        setProductData({
          title: data.title || "",
          description: data.description || "",
          shortDescription: data.shortDescription || "",
          regularPrice: data.regularPrice || "",
          salePrice: data.salePrice || "",
          sku: data.sku || "",
          stockQuantity: data.stockQuantity || "",
          brand: data.brand || "",
          barcode: data.barcode || "",
          productLabel: data.productLabel || "",
          tags: data.tags || "",
          supplier: data.supplier || "",
          status: data.status || "Active",
          stockStatus: data.stockStatus || "In Stock",
          costPerItem: data.costPerItem || "",
          variants: data.variants || [], // ✅ load existing variants
        });

        setSelectedImages(data.images || []);
        setCategories(new Set(data.collections || []));
      } catch (error) {
        console.error("❌ Failed to fetch product:", error);
      }
    };

    fetchProductById();
  }, [isUpdate, productId]);

  const handleCategoryChange = (keys) => setCategories(new Set(keys));

  const addVariant = () => {
    if (!variantInput.name || !variantInput.options) return;

    const newVariant = {
      name: variantInput.name,
      options: variantInput.options.split(",").map((opt) => opt.trim()),
    };

    setProductData((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant],
    }));

    setVariantInput({ name: "", options: "" });
  };

  const removeVariant = (index) => {
    setProductData((prev) => {
      const updated = [...prev.variants];
      updated.splice(index, 1);
      return { ...prev, variants: updated };
    });
  };

  const addOrUpdateProduct = async () => {
    setAddLoading(true);

    if (!productData.title || !productData.regularPrice) {
      setIsInvalid(true);
      setAddLoading(false);
      return;
    }

    try {
      const method = isUpdate ? "PUT" : "POST";
      const response = await fetch("/api/product", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(isUpdate && { _id: productId }),
          ...productData,
          currencyCode,
          currencySymbol,
          collections: Array.from(categories),
          images: selectedImages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ API Error:", errorData);
        throw new Error(`Error: ${response.statusText}`);
      }

      // Optional: toast.success("Product saved"); router.push("/admin/products");
    } catch (error) {
      console.error("❌ Error saving product:", error);
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isUpdate ? "Update Product" : "Add New Product"}</h1>
        <CustomButton isLoading={addLoading} onPress={addOrUpdateProduct} className="bg-black text-white" size="sm">
          {isUpdate ? "Update Product" : "Publish Product"}
        </CustomButton>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel */}
        <div className="flex-1 bg-white p-5 rounded-lg flex flex-col gap-5 sha-one">
          <Input
            label="Product Name"
            labelPlacement="outside"
            isDisabled={isFetching}
            size="sm"
            placeholder="Enter product name"
            value={productData.title}
            isInvalid={isInvalid && !productData.title}
            errorMessage="Product name is required"
            onChange={(e) => setProductData({ ...productData, title: e.target.value })}
          />

          <div>
            <h2 className="text-base font-medium mb-2">Product Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              {selectedImages.map((img, index) => (
                <div key={index} className="relative group">
                  <img src={img} alt={`Selected ${index}`} className="w-full h-40 object-cover rounded-lg shadow-sm" />
                </div>
              ))}
              <div
                className="flex items-center justify-center w-full h-40 rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-100"
                onClick={() => setIsImageSelectorOpen(true)}
              >
                <FaPlus className="text-gray-500" />
              </div>
            </div>
            <ImageSelector
              isOpen={isImageSelectorOpen}
              onClose={() => setIsImageSelectorOpen(false)}
              onSelectImages={(urls) => setSelectedImages(urls)}
              selectType="multiple"
            />
          </div>

          <Textarea
            label="Short Description"
            isDisabled={isFetching}
            labelPlacement="outside"
            placeholder="Enter short product summary"
            value={productData.shortDescription}
            onChange={(e) => setProductData({ ...productData, shortDescription: e.target.value })}
          />

          <TextEditor value={productData.description} onChange={(value) => setProductData((prev) => ({ ...prev, description: value }))} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Input
              label="Regular Price"
              labelPlacement="outside"
              size="sm"
              type="number"
              isDisabled={isFetching}
              startContent={<span>{currencySymbol}</span>}
              placeholder="Enter regular price"
              value={productData.regularPrice}
              isInvalid={isInvalid && !productData.regularPrice}
              errorMessage="Price is required"
              onChange={(e) => setProductData({ ...productData, regularPrice: e.target.value })}
            />
            <Input
              label="Sale Price"
              labelPlacement="outside"
              size="sm"
              isDisabled={isFetching}
              type="number"
              startContent={<span>{currencySymbol}</span>}
              placeholder="Enter sale price"
              value={productData.salePrice}
              onChange={(e) => setProductData({ ...productData, salePrice: e.target.value })}
            />
            <Input
              label="SKU"
              labelPlacement="outside"
              size="sm"
              isDisabled={isFetching}
              placeholder="Enter SKU"
              value={productData.sku}
              onChange={(e) => setProductData({ ...productData, sku: e.target.value })}
            />
            <Input
              label="Stock Quantity"
              labelPlacement="outside"
              size="sm"
              isDisabled={isFetching}
              type="number"
              placeholder="Enter quantity"
              value={productData.stockQuantity}
              onChange={(e) => setProductData({ ...productData, stockQuantity: e.target.value })}
            />
            <Input
              label="Cost per item"
              labelPlacement="outside"
              size="sm"
              isDisabled={isFetching}
              type="number"
              placeholder="Enter cost per item"
              value={productData.costPerItem}
              onChange={(e) => setProductData({ ...productData, costPerItem: e.target.value })}
            />
            <Input
              label="Profit"
              labelPlacement="outside"
              size="sm"
              isDisabled={isFetching}
              placeholder="Auto-calculated profit"
              readOnly
              value={
                productData.costPerItem
                  ? (parseFloat(productData.salePrice || productData.regularPrice || "0") - parseFloat(productData.costPerItem || "0")).toFixed(2)
                  : "---"
              }
            />
          </div>

          {/* ✅ Variant Section */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold">Product Variants</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Variant Name"
                labelPlacement="outside"
                size="sm"
                isDisabled={isFetching}
                placeholder="e.g., Size, Color"
                value={variantInput.name}
                onChange={(e) => setVariantInput({ ...variantInput, name: e.target.value })}
                className="text-sm"
              />
              <Input
                label="Options"
                labelPlacement="outside"
                size="sm"
                isDisabled={isFetching}
                placeholder="e.g., Small, Medium, Large"
                value={variantInput.options}
                onChange={(e) => setVariantInput({ ...variantInput, options: e.target.value })}
                className="text-sm"
              />
            </div>

            <div>
              <CustomButton onPress={addVariant} size="sm" className="bg-gray-900 text-white hover:bg-gray-700 rounded px-4 py-1.5 text-sm">
                + Add Variant
              </CustomButton>
            </div>

            {productData.variants.length > 0 && (
              <div className="space-y-2">
                {productData.variants.map((variant, index) => (
                  <div key={index} className="flex justify-between items-center border border-gray-100 rounded-md px-3 py-2 text-sm text-gray-700">
                    <div className="truncate">
                      <strong className="font-medium">{variant.name}:</strong> {variant.options.join(", ")}
                    </div>
                    <button onClick={() => removeVariant(index)} className="text-xs text-red-500 hover:underline">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:w-[30%] w-full bg-white p-5 rounded-lg sha-one flex flex-col gap-5">
          <Select
            label="Product Status"
            labelPlacement="outside"
            isDisabled={isFetching}
            placeholder="Select product status"
            size="sm"
            selectedKeys={[productData.status]}
            onSelectionChange={(keys) => setProductData({ ...productData, status: Array.from(keys)[0] })}
          >
            {visibilityOptions.map((option) => (
              <SelectItem key={option}>{option}</SelectItem>
            ))}
          </Select>

          <Select
            label="Stock Status"
            labelPlacement="outside"
            placeholder="Select stock status"
            isDisabled={isFetching}
            size="sm"
            selectedKeys={[productData.stockStatus]}
            onSelectionChange={(keys) => setProductData({ ...productData, stockStatus: Array.from(keys)[0] })}
          >
            {stockStatusOptions.map((option) => (
              <SelectItem key={option}>{option}</SelectItem>
            ))}
          </Select>

          <Select
            label="Collections"
            labelPlacement="outside"
            isDisabled={isFetching}
            size="sm"
            selectionMode="multiple"
            placeholder="Select collections"
            selectedKeys={categories}
            onSelectionChange={handleCategoryChange}
          >
            {fetchingCollection.map((c) => (
              <SelectItem key={c.title}>{c.title}</SelectItem>
            ))}
          </Select>

          <Select
            label="Product Label"
            labelPlacement="outside"
            placeholder="Select label"
            isDisabled={isFetching}
            size="sm"
            selectedKeys={[productData.productLabel]}
            onSelectionChange={(keys) => setProductData({ ...productData, productLabel: Array.from(keys)[0] })}
          >
            {productLabelOptions.map((label) => (
              <SelectItem key={label}>{label}</SelectItem>
            ))}
          </Select>

          <Input
            label="Tags"
            labelPlacement="outside"
            isDisabled={isFetching}
            size="sm"
            placeholder="e.g. electronics, smart"
            value={productData.tags}
            onChange={(e) => setProductData({ ...productData, tags: e.target.value })}
          />

          <Input
            label="Supplier"
            labelPlacement="outside"
            size="sm"
            isDisabled={isFetching}
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
