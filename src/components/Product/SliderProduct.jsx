"use client";

import { useEffect, useState } from "react";
import ProductLabel from "@/components/ProductLabel";
import Link from "next/link";
import { Skeleton } from "@heroui/skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// 👇 Fallback sample data
const SAMPLE_PRODUCTS = Array.from({ length: 10 }).map((_, i) => ({
  _id: `sample-${i}`,
  title: `Sample Product ${i + 1}`,
  shortDescription: "This is a sample product description.",
  salePrice: i % 2 === 0 ? 19.99 : null,
  regularPrice: 29.99,
  productLabel: i % 2 === 0 ? "New" : "Sale",
  images: [`https://placehold.co/400x500?text=Product+${i + 1}`],
}));

export default function StyleOne() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/product");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setProducts(Array.isArray(data) && data.length > 0 ? data : SAMPLE_PRODUCTS);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products");
        setProducts(SAMPLE_PRODUCTS); // Use fallback
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="px-4 md:px-20 container mx-auto">
      <h2 className="text-xl font-semibold mb-4">Featured Products</h2>

      {/* 🦴 Skeleton loading */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="bg-white sha-one rounded-xl overflow-hidden mb-10">
              <Skeleton className="w-full aspect-[4/5] rounded-none" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ❌ Error message */}
      {!loading && error && <div className="p-6 text-red-500 text-center">{error}</div>}

      {/* 🛒 Product Swiper */}
      {!loading && products.length > 0 && (
        <Swiper
          key="loaded"
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          loop
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          className="pb-10 hide-swiper-dots"
          breakpoints={{
            0: { slidesPerView: 2 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product._id}>
              <Link href={"#"}>
                <div className="bg-white border border-gray-50 rounded-xl overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.images?.[0] || "https://placehold.co/400x500?text=No+Image"}
                      alt={product.title}
                      className="w-full aspect-[4/5] object-cover"
                    />
                    <ProductLabel label={product.productLabel} />
                  </div>
                  <div className="p-4 text-center">
                    <h2 className="text-sm font-semibold text-gray-800 leading-tight line-clamp-1 mb-2 md:mb-3">{product.title}</h2>
                    <p className="text-xs line-clamp-2 mb-2 md:mb-3">{product.shortDescription}</p>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      {product.salePrice ? (
                        <>
                          <span className="text-base font-bold text-black">${product.salePrice}</span>
                          <span className="text-sm line-through text-gray-400">${product.regularPrice}</span>
                        </>
                      ) : (
                        <span className="text-base font-bold text-gray-800">${product.regularPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
