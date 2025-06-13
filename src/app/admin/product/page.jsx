"use client";
import { useEffect, useState } from "react";
import CustomButton from "@/components/ui/CustomButton";

export default function Page() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/product");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="border p-4 rounded shadow hover:shadow-md">
              <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
              {product.image && <img src={product.image} alt={product.title} className="w-full h-40 object-cover rounded mb-2" />}
              <p className="text-sm text-gray-700 mb-2">Price: ₹{product.price}</p>
              <CustomButton className="w-full" >
                View Product
              </CustomButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
