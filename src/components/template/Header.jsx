"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaUser, FaHeart, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

export default function FullHeader() {
  const [menuItems, setMenuItems] = useState([]);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchMenus() {
      try {
        const res = await fetch("/api/admin/menu");
        if (!res.ok) throw new Error("Failed to fetch menus");
        const menus = await res.json();

        const mainMenu = menus.find((menu) => menu.name === "Main Menu");
        if (mainMenu && Array.isArray(mainMenu.items)) {
          setMenuItems(mainMenu.items);
        } else {
          setMenuItems([]);
        }
      } catch (err) {
        console.error("Error loading menus:", err);
        setMenuItems([]);
      }
    }

    fetchMenus();
  }, []);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4 md:py-3">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Shopead
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center text-sm font-medium text-gray-700">
          {menuItems.map(({ title, url }, i) => (
            <Link key={i} href={url} className="hover:text-black transition-colors duration-200">
              {title}
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-5 text-gray-600">
          <Link href="/account" className="hover:text-black">
            <FaUser size={18} />
          </Link>
          <Link href="/wishlist" className="relative hover:text-black">
            <FaHeart size={18} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">3</span>
          </Link>
          <Link href="/cart" className="relative hover:text-black">
            <FaShoppingCart size={18} />
            <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full px-1">2</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-gray-700" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          {menuItems.map(({ title, url }, i) => (
            <Link key={i} href={url} className="block text-gray-700 hover:text-black">
              {title}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
