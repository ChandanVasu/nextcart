"use client";

import React, { useState, useEffect } from "react";
import ProductGallery from "@/components/ProductGallery";
import SliderProduct from "@/components/Product/SliderProduct";
import SliderCollection from "@/components/Colleaction/SliderCollection";
import VideoReels from "@/components/VideoReels";
import SupportBenefits from "@/components/SupportBenefits";
import { ShoppingCart, Zap, ShieldCheck, Truck, Repeat, BadgeCheck, Eye } from "lucide-react";
import { Button } from "@heroui/react";

export default function Product({ data }) {
  const [quantity, setQuantity] = useState(1);
  const [addCartLoading, setAddCartLoading] = useState(false);

  const [viewerCount, setViewerCount] = useState(null);

  useEffect(() => {
    setViewerCount(Math.floor(Math.random() * 1000) + 30);
  }, []);

  const handleAddToCart = () => {
    setAddCartLoading(true);

    setTimeout(() => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingIndex = cart.findIndex((item) => item.productId === data._id);

      if (existingIndex !== -1) {
        cart[existingIndex].quantity += quantity;
      } else {
        cart.push({
          productId: data._id, // ✅ fixed
          title: data.title,
          quantity: quantity,
          color: null,
          size: null,
          image: data.images[0]?.url,
          price: data.salePrice || data.regularPrice,
          currency: data.currencySymbol || "₹",
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      setAddCartLoading(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    const buyNowData = {
      productId: data._id,
      title: data.title,
      quantity: quantity,
      color: null,
      size: null,
      image: data.images[0]?.url,
      price: data.salePrice || data.regularPrice,
      currency: data.currencySymbol || "₹",
    };

    localStorage.setItem("buyNow", JSON.stringify([buyNowData]));
    window.location.href = "/checkout";
  };

  return (
    <div>
      <section className="container mx-auto px-4 md:px-20 md:py-10 py-4 grid grid-cols-1 md:grid-cols-2 gap-10">
        <ProductGallery images={data.images} title={data.title} />

        <div className="flex flex-col justify-start gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-4">{data.title}</h1>
            <div className="flex items-center gap-4 mb-5">
              <span className="text-2xl font-bold text-blue-600">
                {data.currencySymbol}
                {data.salePrice ? data.salePrice : data.regularPrice}
              </span>

              {data.salePrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    {data.currencySymbol}
                    {data.regularPrice}
                  </span>
                  <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                    {Math.round(((+data.regularPrice - +data.salePrice) / +data.regularPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-gray-600 ">{data.shortDescription}</p>
          </div>

          {viewerCount !== null && (
            <div className="flex items-center gap-1 mt-4 ">
              <Eye className="w-5 h-5 text-blue-400 " />
              <p className="line-clamp-1 flex-1">{viewerCount} people are viewing this product right now</p>
            </div>
          )}

          {/* Add to Cart / Buy Now */}
          <div className="flex flex-col w-full sm:flex-row gap-4 mt-4">
            <Button
              size="md"
              isLoading={addCartLoading}
              onPress={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </Button>
            <Button
              onPress={handleBuyNow}
              size="md"
              className="w-full flex items-center justify-center gap-2 bg-blue-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition"
            >
              <Zap className="w-5 h-5" />
              Buy Now
            </Button>
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
      </section>

      {data.description && (
        <div className="container mx-auto px-4 md:px-20 pt-3 md:pt-5">
          <div className="text-black md:text-base text-sm leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: data.description }} />
        </div>
      )}

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
