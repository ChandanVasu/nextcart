"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import ProductLabel from "@/components/ProductLabel";
import { Skeleton } from "@heroui/skeleton";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(localCart);

    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/product");
        if (!res.ok) throw new Error("Failed to fetch products");

        const allProducts = await res.json();
        const cartProductIds = localCart.map((item) => item.productId);
        const matchedProducts = allProducts.filter((p) => cartProductIds.includes(p._id));

        setProducts(matchedProducts);
      } catch (error) {
        console.error("Error loading cart products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getProductDetails = (productId) => products.find((p) => p._id === productId);

  const handleRemove = (productId) => {
    const updatedCart = cartItems.filter((item) => item.productId !== productId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  const handleBuyNow = () => {
    const buyNowData = cartItems.map((item) => ({
      productId: item.productId,
      title: item.title,
      quantity: item.quantity,
      color: item.color || null,
      size: item.size || null,
      image: item.image,
      price: item.price,
      currency: item.currency || "₹",
    }));

    localStorage.setItem("buyNow", JSON.stringify(buyNowData));
    window.location.href = "/checkout";
  };

  return (
    <div className="container mx-auto px-4 md:px-20 py-8 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">Your Shopping Cart</h2>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 md:gap-6 gap-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="bg-white rounded-xl overflow-hidden border border-gray-200">
              <Skeleton className="w-full aspect-[4/5] rounded-none" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <img src="/empty.svg" alt="Empty Cart" className="w-60 mb-6" />
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven’t added anything yet.</p>
          <Link href="/">
            <Button className="bg-black text-white px-6 py-3 rounded-xl  transition text-sm font-medium">Shopping Now</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 md:gap-6 gap-4">
          {cartItems.map((item, index) => {
            const product = getProductDetails(item.productId);
            if (!product) return null;

            const imageUrl = item.image || product.images?.[0] || "https://placehold.co/400x500?text=No+Image";

            return (
              <div key={`${item.productId}-${index}`} className="bg-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                <div className="relative">
                  <img src={imageUrl} alt={item.title} className="w-full aspect-[4/5] object-cover" />
                  <ProductLabel label={product.productLabel} />
                </div>

                <div className="p-4 text-center bg-white">
                  <h3 className="text-sm font-semibold text-gray-800 leading-tight line-clamp-1 mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 mb-1">Quantity: {item.quantity}</p>
                  <p className="text-sm font-semibold text-gray-800 mb-3">
                    {item.currency} {item.price}
                  </p>

                  <div className="flex flex-col gap-2">
                    <Button size="sm" className="bg-black text-white w-full" onPress={() => handleRemove(item.productId)}>
                      Remove
                    </Button>
                    <Link href={`/product/${item.productId}`}>
                      <Button size="sm" variant="outline" className="w-full">
                        View Product
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && cartItems.length > 0 && (
        <div className="mt-8 text-right">
          <Button className="bg-black text-white px-6 py-3 rounded-md" onClick={handleBuyNow}>
            Proceed to Checkout
          </Button>
        </div>
      )}
    </div>
  );
}
