"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`h-10 w-full sha-one flex justify-between px-2 md:px-6  items-center z-30 top-0 sticky transition-all duration-300 bg-white ${
        isScrolled ? "bg-white/60 backdrop-blur-md" : "bg-white/60 backdrop-blur-md"
      }`}
    >
      <div className="flex items-center gap-2">
        <Link href={"/admin"}>
          <h1 className="text-xl font-bold">Admin Penal</h1>
        </Link>
      </div>
      <div className=""></div>
      <div></div>
    </div>
  );
};

export default Header;
