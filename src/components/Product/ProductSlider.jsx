"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProductSlider() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/product");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setProducts(data.slice(0, 12)); // Adjust the number of products
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) return null;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Trending Products</h2>
      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        spaceBetween={16}
        slidesPerView={2}
        className="hide-swiper-dots"
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        loop
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="sha-one rounded-lg overflow-hidden bg-white hover:shadow-sm transition mb-10">
              <div className="relative aspect-[4/5] w-full bg-gray-50">
                <img src={product.images?.[0]?.src} alt={product.images?.[0]?.altText || product.title} className="object-cover w-full h-full" />
                {!product.availableForSale && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">Out of Stock</div>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-lg font-medium text-black truncate">{product.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
                <div className="mt-2">
                  {product.variants?.[0] && (
                    <>
                      <span className="text-base font-semibold text-gray-800">${product.variants[0].price.amount}</span>
                      {product.variants[0].compareAtPrice && (
                        <span className="ml-2 line-through text-sm text-gray-400">${product.variants[0].compareAtPrice.amount}</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
