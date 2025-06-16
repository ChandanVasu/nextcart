"use client";
import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function FullHeader() {
  const storeTitle = "NEXTCART";

  const menuItems = [
    { title: "HOME", url: "/" },
    { title: "SHOP", url: "/shop" },
    { title: "COLLECTION", url: "/collections" },
    { title: "PRODUCT", url: "/about" },
    { title: "ABOUT", url: "/contact" },
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, url: "#" },
    { icon: <FaTwitter />, url: "#" },
    { icon: <FaInstagram />, url: "#" },
    { icon: <FaLinkedinIn />, url: "#" },
  ];

  return (
    <header className="w-full text-sm bg-white shadow sticky top-0 z-50">
      <div className="mx-auto container flex items-center justify-between h-12 px-4">
        {/* Logo */}
        <div className="text-xl sm:text-2xl font-bold tracking-wide text-black">{storeTitle}</div>

        {/* Navigation */}
        <nav className="flex flex-wrap gap-4 items-center text-xs font-medium text-gray-700">
          {menuItems.map(({ title, url }, i) => (
            <a key={i} href={url} className="relative text-black transition">
              {title}
            </a>
          ))}
        </nav>

        {/* Social Media */}
        <div className="flex items-center gap-3 text-gray-600">
          {socialLinks.map(({ icon, url }, i) => (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-black bg-yellow-400 p-2 rounded-full transition">
              {icon}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
