import React from "react";
import ProducteOne from "@/components/Product/ProductOne";
import SliderOne from "@/components/Slider/SliderOne";
import SliderCollection from "@/components/Colleaction/SliderCollection";

export default function Home() {
  return (
    <div>
      <SliderOne />
      <div className="mt-8">
        <SliderCollection />
      </div>
      <ProducteOne />
    </div>
  );
}
