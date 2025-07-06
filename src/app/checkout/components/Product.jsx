"use client";
import { useEffect, useState } from "react";

export default function useBuyNowProducts() {
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem("buyNow") || "[]");

    async function fetchData() {
      try {
        const productRes = await fetch("/api/product");
        const allProducts = await productRes.json();

        const ids = local.map((item) => item.productId);
        const filteredProducts = allProducts.filter((p) => ids.includes(p._id));

        const finalProducts = filteredProducts.map((product) => {
          const localItem = local.find((i) => i.productId === product._id);
          return {
            ...product,
            quantity: localItem?.quantity || 1,
            color: localItem?.color || null,
            size: localItem?.size || null,
            image: localItem?.image || product.images?.[0],
          };
        });

        setFetchedProducts(finalProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setFetchedProducts([]);
      } finally {
        setLoading(false);
      }
    }

    if (local.length > 0) fetchData();
    else setLoading(false);
  }, []);

  return {
    items: fetchedProducts,
    loading,
  };
}
