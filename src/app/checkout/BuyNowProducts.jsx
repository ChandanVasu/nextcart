"use client";
import { useEffect, useState } from "react";

export default function BuyNowProducts() {
  const [items, setItems] = useState([]);
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem("buyNow") || "[]");
    setItems(local);

    async function fetchLatest() {
      try {
        const res = await fetch("/api/product");
        const all = await res.json();

        const ids = local.map((item) => item.productId);
        const filtered = all.filter((p) => ids.includes(p._id));

        // Merge with quantity/color/size from local
        const final = filtered.map((product) => {
          const localItem = local.find((i) => i.productId === product._id);
          return {
            ...product,
            quantity: localItem?.quantity || 1,
            color: localItem?.color || null,
            size: localItem?.size || null,
            image: localItem?.image || product.images?.[0],
          };
        });

        setFetchedProducts(final);
      } catch (err) {
        console.error("Error fetching products:", err);
        setFetchedProducts([]);
      } finally {
        setLoading(false);
      }
    }

    if (local.length > 0) fetchLatest();
    else setLoading(false);
  }, []);

  return { items: fetchedProducts, loading };
}
