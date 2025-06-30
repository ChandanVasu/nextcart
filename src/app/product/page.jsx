"use client";

import React, { useState } from "react";
import SliderCollection from "@/components/Colleaction/SliderCollection";
import SupportBenefits from "@/components/SupportBenefits";
import VideoReels from "@/components/VideoReels";
import SliderProduct from "@/components/Product/SliderProduct";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import {
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  Repeat,
  BadgeCheck,
} from "lucide-react";

export default function SingleProductPage() {
  const product = {
    title: "Modern Leather Office Chair",
    price: 14999,
    salePrice: 9999,
    image: [
      "https://res.cloudinary.com/ddmqg3fec/image/upload/v1750275538/store-images/bru3nmbgbkqrns6kbc7t.webp",
      "https://res.cloudinary.com/ddmqg3fec/image/upload/v1750275539/store-images/pjz8qvtn21cqqpsoaru8.webp",
      "https://res.cloudinary.com/ddmqg3fec/image/upload/v1750319407/store-images/syqnexr3krfertfrfaut.avif",
      "https://res.cloudinary.com/ddmqg3fec/image/upload/v1750319459/store-images/z3hys6qntl7qljlhd5sg.avif",
      "https://res.cloudinary.com/ddmqg3fec/image/upload/v1750275542/store-images/fk0l1oqf87bngqjgfd3j.webp",
      "https://res.cloudinary.com/ddmqg3fec/image/upload/v1750095494/shop-images/nronfzerix5n4mm72b3c.jpg",
    ],
    description:
      "Experience unmatched comfort with our ergonomic leather office chair. Perfect for long work sessions with a stylish touch.",
  };

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.image[0]);

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
        {/* Left: Gallery */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-[400px] md:h-[500px] object-cover object-top rounded-xl"
            />
          </div>
          <div className="w-full pt-2 px-1">
            <Swiper
              spaceBetween={20}
              slidesPerView={3.5}
              breakpoints={{
                0: { slidesPerView: 3.5 },
                640: { slidesPerView: 3.5 },
                768: { slidesPerView: 3.5 },
                1024: { slidesPerView: 5.5 },
              }}
            >
              {product.image.map((img, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={img}
                    alt={`Thumb ${i}`}
                    onClick={() => setSelectedImage(img)}
                    className={`w-28 h-28 object-cover border-b-2 rounded-lg cursor-pointer transition ${
                      selectedImage === img
                        ? "border-indigo-500"
                        : "border-gray-200"
                    }`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col justify-start gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-5">
              <span className="text-2xl font-bold text-red-600">
                ₹{product.salePrice}
              </span>
              <span className="text-lg text-gray-400 line-through">
                ₹{product.price}
              </span>
              <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                33% OFF
              </span>
            </div>

            <p className="text-gray-600 text-base leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border rounded overflow-hidden">
                <button
                  onClick={() => handleQuantityChange("dec")}
                  className="w-8 h-8 text-lg font-bold hover:bg-gray-100"
                >
                  −
                </button>
                <span className="w-10 text-center border-x">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("inc")}
                  className="w-8 h-8 text-lg font-bold hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Buttons */}
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
      </section>

      {/* Additional Sections */}
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
