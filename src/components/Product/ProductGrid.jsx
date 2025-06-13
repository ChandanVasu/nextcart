"use client";
import { useEffect, useState } from "react";

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
        setProducts(data.slice(0, 8)); // Limit to 12 products
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
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Latest Product</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="sha-one rounded-lg overflow-hidden bg-white hover:shadow-sm transition">
            <div className="relative aspect-[4/5] w-full bg-gray-50">
              <img src={product.images?.[0]?.src} alt={product.images?.[0]?.altText || product.title} className="object-cover w-full h-full" />
              {!product.availableForSale && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">Out of Stock</div>
              )}
            </div>
            <div className="p-3">
              <h2 className="text-lg font-medium text-black truncate">{product.title}</h2>
              <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>

              <div className="mt-2">
                {product.variants?.[0] && (
                  <>
                    <span className="text-base font-semibold text-gray-800">${product.variants[0].price.amount}</span>
                    {product.variants[0].compareAtPrice && (
                      <>
                        <span className="ml-2 line-through text-sm text-gray-400">${product.variants[0].compareAtPrice.amount}</span>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
