import React from "react";
import ProductGrid from "@/components/Product/ProductGrid";
import Slider from "@/components/Slider/Slider";
import SliderCollection from "@/components/Colleaction/SliderCollection";

export default function Home() {
  return (
    <div>
      <div className="mt-1">
        <Slider />
      </div>
      <div className="mt-8">
        <SliderCollection />
      </div>
      <ProductGrid />
    </div>
  );
}
