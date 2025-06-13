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

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

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

  if (loading) {
    return <div className="p-6 text-center">Loading products...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Shopify Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="border rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 bg-white">
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <img src={product.images?.[0]?.src} alt={product.images?.[0]?.altText || product.title} className="object-cover w-full h-full" />
              {!product.availableForSale && <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Out of Stock</div>}
            </div>
            <div className="p-4 space-y-2">
              <h2 className="text-lg font-semibold line-clamp-1">{product.title}</h2>
              <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">Vendor: {product.vendor}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">Type: {product.productType}</span>
              </div>

              {/* Pricing */}
              <div className="mt-2">
                {product.variants?.[0] && (
                  <>
                    <span className="text-lg font-bold text-gray-900">${product.variants[0].price.amount}</span>
                    {product.variants[0].compareAtPrice && (
                      <>
                        <span className="line-through text-gray-400 ml-2">${product.variants[0].compareAtPrice.amount}</span>
                        <span className="ml-2 text-sm text-green-600 font-medium">
                          Save ${(product.variants[0].compareAtPrice.amount - product.variants[0].price.amount).toFixed(2)}
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Color & Size Options */}
              <div className="mt-2 text-sm">
                {product.options.map((option) => (
                  <div key={option.name} className="mt-1">
                    <span className="font-medium">{option.name}:</span> {option.values.slice(0, 3).join(", ")}
                    {option.values.length > 3 && "..."}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
