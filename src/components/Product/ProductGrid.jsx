"use client";
import { useEffect, useState } from "react";
import ProductLabel from "@/components/ProductLabel";

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

  if (loading) return <div className="p-6 text-center">Loading products...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;
  if (!products.length) return <div className="p-6 text-center">No products available</div>;

  return (
    <div className="px-4 md:px-20 container mx-auto">
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="relative">
              <img src={product.images?.[0]} alt={product.title} className="w-full aspect-[4/5] object-cover" />
              <ProductLabel label={product.productLabel} />
            </div>
            <div className="p-4">
              <h2 className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2 mb-2">{product.title}</h2>
              <div className="flex items-center gap-2 mb-1">
                {product.salePrice ? (
                  <>
                    <span className="text-base font-bold text-red-600">₹{product.salePrice}</span>
                    <span className="text-sm line-through text-gray-400">₹{product.regularPrice}</span>
                  </>
                ) : (
                  <span className="text-base font-bold text-gray-800">₹{product.regularPrice}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
