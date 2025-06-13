"use client";
import React from "react";
import Footer from "./Footer";
import { usePathname } from "next/navigation";

const MainHeader = () => {
  const pathname = usePathname();

  if (pathname === "/admin" || pathname === "/login") {
    return null;
  }

  return <Footer />;
};

export default MainHeader;
