"use client";
import { useEffect, useState } from "react";
import ProductLabel from "@/components/ProductLabel";
import Link from "next/link";
import { Skeleton } from "@heroui/skeleton";

// 🔄 Sample fallback products (in case API fails or is empty)
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
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(SAMPLE_PRODUCTS); // 👉 Use sample fallback
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products");
        setProducts(SAMPLE_PRODUCTS); // 👉 Fallback on error
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // 🦴 Skeleton loading
  if (loading) {
    return (
      <div className="px-4 md:px-20 container mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 md:gap-6 gap-3">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div key={idx} className="bg-white  rounded-xl overflow-hidden">
              <Skeleton className="w-full aspect-[4/5] rounded-none" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-20 container mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 md:gap-6 gap-3">
        {products.map((product) => (
          <Link href={`/product/${product._id}`} key={product._id}>
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
        ))}
      </div>
    </div>
  );
}
