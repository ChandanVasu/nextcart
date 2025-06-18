import React from "react";
import ProductGrid from "@/components/Product/ProductGrid";
import Slider from "@/components/Slider/Slider";
import SliderCollection from "@/components/Colleaction/SliderCollection";
import SupportBenefits from "@/components/SupportBenefits";

export default function Home() {
  return (
    <div className="pb-10">
      <div className="mt-1">
        <Slider />
      </div>
      <div className="mt-8">
        <SliderCollection />
      </div>
      <div className="mt-8">
        <ProductGrid />
      </div>
      <div className="mt-8">
        <SupportBenefits />
      </div>
    </div>
  );
}
