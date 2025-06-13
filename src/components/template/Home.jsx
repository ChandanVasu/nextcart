import React from "react";
import HomeStyleOne from "@/components/template/home/HomeOne";
import MainHeaderWrapper from "@/components/template/MainHeaderWrapper";
import MainFooterWrapper from "@/components/template/MainFooterWrapper";

export default function Home() {
  return (
    <div>
      <MainHeaderWrapper />
      <HomeStyleOne />
      <MainFooterWrapper />
    </div>
  );
}
