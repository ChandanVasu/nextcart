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

  if (error) {
    return <div className="p-6 text-red-500 text-center">{error}</div>;
  }
  if (!products.length) {
    return <div className="p-6 text-center">No products available</div>;
  }

  return (
    <div className="px-4 md:px-20 container mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product._id} className="bg-white sha-one rounded-lg p-4">
            <img src={product.images[0]} alt={product.title} className="w-full aspect-[4/5] object-cover rounded-t-lg mb-4" />
            <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
            <p className="text-lg font-bold text-gray-900">${product.regularPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
