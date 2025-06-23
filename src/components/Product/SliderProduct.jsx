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
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="px-4 md:px-20 container mx-auto">
      <h2 className="text-xl font-semibold mb-4">Featured Products</h2>

      {/* Loading state - show skeletons in grid */}
      {loading && (
        <div className="grid grid-cols-2  md:grid-cols-4 lg:grid-cols-5 gap-4">
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

      {/* Error state */}
      {!loading && error && <div className="p-6 text-red-500 text-center">{error}</div>}

      {/* Empty state */}
      {!loading && !error && !products.length && <div className="p-6 text-center">No products available</div>}

      {/* Swiper after data is loaded */}
      {!loading && !error && products.length > 0 && (
        <Swiper
          key="loaded"
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          loop={true}
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
              <Link href="#">
                <div className="bg-white sha-one rounded-xl overflow-hidden mb-10">
                  <div className="relative">
                    <img src={product.images?.[0]} alt={product.title} className="w-full aspect-[4/5] object-cover" />
                    <ProductLabel label={product.productLabel} />
                  </div>
                  <div className="p-4">
                    <h2 className="text-sm font-semibold text-gray-800 leading-tight line-clamp-1 mb-2">{product.title}</h2>
                    <div className="flex items-center gap-2 mb-1">
                      {product.salePrice ? (
                        <>
                          <span className="text-base font-bold text-black">₹{product.salePrice}</span>
                          <span className="text-sm line-through text-gray-400">₹{product.regularPrice}</span>
                        </>
                      ) : (
                        <span className="text-base font-bold text-gray-800">₹{product.regularPrice}</span>
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
