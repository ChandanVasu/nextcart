import React from "react";
import ProductGrid from "@/components/Product/ProductGrid";
import SliderOne from "@/components/Slider/SliderOne";
import SliderCollection from "@/components/Colleaction/SliderCollection";
import ProductSlider from "@/components/Product/ProductSlider";

export default function Home() {
  return (
    <div>
      <SliderOne />
      <div className="mt-8">
        <SliderCollection />
      </div>
      <ProductGrid />
      <div className="mt-8">
        <ProductSlider />
      </div>
    </div>
  );
}
