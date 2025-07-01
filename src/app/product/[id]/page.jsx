import React from "react";
import SliderCollection from "@/components/Colleaction/SliderCollection";
import SupportBenefits from "@/components/SupportBenefits";
import VideoReels from "@/components/VideoReels";
import SliderProduct from "@/components/Product/SliderProduct";
import { ShoppingCart, Zap, ShieldCheck, Truck, Repeat, BadgeCheck } from "lucide-react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";

export default async function SingleProductPage({ params }) {
  const { id } = params;
  const headersList = await headers(); // ✅ Await headers
  const host = headersList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";

  let product = null;

  try {
    const res = await fetch(`${protocol}://${host}/api/product/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Product not found");
    product = await res.json();
  } catch (err) {
    console.error("Failed to load product:", err.message);
    notFound();
  }

  return (
    <div>
      <section className="container mx-auto px-4 md:px-20 md:py-10 py-4 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Gallery as Client Component */}
        <ProductGallery images={product.images} title={product.title} />

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
            <p className="text-sm text-gray-600 mb-4">{product.shortDescription}</p>
          </div>

          <div className="flex flex-col w-full sm:flex-row gap-4 mt-4">
            <button className="w-full cursor-pointer  flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition">
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button className="w-full cursor-pointer  flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition">
              <Zap className="w-5 h-5" />
              Buy Now
            </button>
          </div>

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

      {product.description && (
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
