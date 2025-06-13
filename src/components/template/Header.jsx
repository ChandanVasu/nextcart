"use client";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function FullHeader() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    async function fetchMenus() {
      try {
        const res = await fetch("/api/admin/menu"); // Adjust this to your actual API route
        if (!res.ok) throw new Error("Failed to fetch menus");
        const menus = await res.json();

        // Find the menu named "Main Menu"
        const mainMenu = menus.find((menu) => menu.name === "Main Menu");
        if (mainMenu && Array.isArray(mainMenu.items)) {
          setMenuItems(mainMenu.items);
        } else {
          setMenuItems([]); // fallback empty
        }
      } catch (err) {
        console.error("Error loading menus:", err);
        setMenuItems([]); // fallback empty
      }
    }

    fetchMenus();
  }, []);

  return (
    <header className="w-full text-sm font-sans">
      {/* Top Scroll Bar */}
      <div className="bg-purple-600 overflow-hidden text-white py-2">
        <div className="marquee-wrapper whitespace-nowrap animate-marquee">
          {Array(100)
            .fill("⚡ SUMMER SALE: UP TO 70% OFF SELECTED ITEMS")
            .map((text, index) => (
              <span key={index} className="mx-4 font-medium">
                {text}
              </span>
            ))}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white shadow sticky top-0 z-50">
        <div className="mx-auto flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <div className="text-xl sm:text-2xl font-bold tracking-wide text-black">NextCart</div>

          {/* Navigation */}
          <nav className="flex flex-wrap gap-4 items-center text-sm font-medium text-gray-700">
            {menuItems.length > 0 ? (
              menuItems.map(({ title, url }, i) => (
                <a key={i} href={url} className="relative hover:text-black transition">
                  {title}
                </a>
              ))
            ) : (
              <div className="text-gray-400">Loading menu...</div>
            )}
          </nav>

          {/* Search */}
          <div className="hidden sm:flex items-center border border-gray-300 rounded overflow-hidden">
            <input type="text" placeholder="Search the store" className="px-3 py-1 outline-none text-sm w-40" />
            <button className="bg-black text-white p-2">
              <FaSearch />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
