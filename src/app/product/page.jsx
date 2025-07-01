"use client";

import React, { useState, useEffect } from "react";
import SliderCollection from "@/components/Colleaction/SliderCollection";
import SupportBenefits from "@/components/SupportBenefits";
import VideoReels from "@/components/VideoReels";
import SliderProduct from "@/components/Product/SliderProduct";
import { ShoppingCart, Zap, ShieldCheck, Truck, Repeat, BadgeCheck } from "lucide-react";
import { Skeleton } from "@heroui/skeleton";

export default function SingleProductPage() {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("/api/product/68531673e7ad2e0dcc54999e");
        const data = await res.json();
        if (!res.ok || !data || !data._id) {
          throw new Error("Product not found");
        }
        setProduct(data);
        setSelectedImage(data.images?.[0] || "");
      } catch (err) {
        console.error("Failed to fetch product", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  const handleQuantityChange = (type) => {
    setQuantity((prev) => {
      if (type === "inc") return prev + 1;
      if (type === "dec" && prev > 1) return prev - 1;
      return prev;
    });
  };

  return (
    <div>
      {/* Product Section */}
      <section className="container mx-auto px-4 md:px-20 md:py-10 py-4 grid grid-cols-1 md:grid-cols-2 gap-10">
        {loading ? (
          <>
            {/* Skeleton Gallery */}
            <div className="flex flex-col md:flex-row gap-4">
              <Skeleton className="flex-1 w-full h-[400px] md:h-[500px] rounded-xl" />
              <div className="flex gap-2 mt-4 md:mt-0 overflow-x-auto md:overflow-visible md:flex-col">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-20 h-20 rounded-lg flex-shrink-0" />
                ))}
              </div>
            </div>

            {/* Skeleton Info */}
            <div className="flex flex-col justify-start gap-6">
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-6 w-1/2 mb-2" />
              <Skeleton className="h-5 w-1/4 mb-4" />
              <div className="flex items-center gap-4 mb-6">
                <Skeleton className="w-20 h-6" />
                <div className="flex gap-2">
                  <Skeleton className="w-8 h-8" />
                  <Skeleton className="w-10 h-8" />
                  <Skeleton className="w-8 h-8" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Skeleton className="w-full sm:w-40 h-12 rounded-lg" />
                <Skeleton className="w-full sm:w-40 h-12 rounded-lg" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-full h-14 rounded-lg" />
                ))}
              </div>
            </div>
          </>
        ) : error || !product ? (
          <>
            <div className="col-span-2 flex flex-col items-center justify-center text-center py-20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Product Not Found</h2>
              <p className="text-gray-500 max-w-md">
                The product you're looking for doesn't exist or has been removed. Please check the link or browse other items.
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Product Gallery */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="bg-white rounded-xl flex-1 h-min">
                <img src={selectedImage} alt={product.title} className="w-full h-[400px] md:h-[500px] object-cover object-top rounded-xl" />
              </div>
              <div className="flex gap-2 mt-4 md:mt-0 overflow-x-auto md:overflow-visible md:flex-col hide-scrollbar">
                {product.images?.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Thumb ${i}`}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 object-cover rounded-lg border-2 cursor-pointer flex-shrink-0 transition ${
                      selectedImage === img ? "border-indigo-500" : "border-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-start gap-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-2xl font-bold text-red-600">₹{product.salePrice}</span>
                  <span className="text-lg text-gray-400 line-through">₹{product.regularPrice}</span>
                  <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                    {Math.round(((+product.regularPrice - +product.salePrice) / +product.regularPrice) * 100)}% OFF
                  </span>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border rounded overflow-hidden">
                    <button onClick={() => handleQuantityChange("dec")} className="w-8 h-8 text-lg font-bold hover:bg-gray-100">
                      −
                    </button>
                    <span className="w-10 text-center border-x">{quantity}</span>
                    <button onClick={() => handleQuantityChange("inc")} className="w-8 h-8 text-lg font-bold hover:bg-gray-100">
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition">
                  <Zap className="w-5 h-5" />
                  Buy Now
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm text-gray-700">
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                  <ShieldCheck className="text-green-600 w-5 h-5" />
                  <span>100% Secure Payment</span>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                  <Truck className="text-blue-600 w-5 h-5" />
                  <span>Free Shipping Available</span>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                  <Repeat className="text-yellow-600 w-5 h-5" />
                  <span>7-Day Easy Returns</span>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                  <BadgeCheck className="text-purple-600 w-5 h-5" />
                  <span>Verified Quality Product</span>
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Product Description */}
      {!loading && product?.description && (
        <div className="container mx-auto px-4 md:px-20 py-10">
          <div className="text-black text-base leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      )}

      {/* Related Sections */}
      <div className="mt-6 md:mt-12">
        <SliderProduct />
      </div>
      <div className="mt-6 md:mt-12">
        <SliderCollection isTitle={false} />
      </div>
      <div className="mt-6 md:mt-12">
        <VideoReels />
      </div>
      <div className="mt-4 md:mt-8">
        <SupportBenefits />
      </div>
    </div>
  );
}
