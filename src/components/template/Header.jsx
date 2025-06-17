"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiMenu3Line } from "react-icons/ri";
import { FaTshirt, FaGift, FaTags, FaSun, FaGlassCheers, FaUserFriends, FaCircle, FaStoreAlt } from "react-icons/fa";

export default function FullHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { title: "Combos", icon: <FaGift />, url: "#" },
    { title: "New Arrivals", icon: <FaTags />, url: "#" },
    { title: "Replay and Rewind", icon: <FaStoreAlt />, url: "#", badge: "New Launch" },
    { title: "Topwear", icon: <FaTshirt />, url: "#" },
    { title: "Bottomwear", icon: <FaSun />, url: "#" },
    { title: "Hot Deals", icon: <FaGlassCheers />, url: "#" },
    { title: "Sunglasses", icon: <FaSun />, url: "#" },
    { title: "Shop For Women", icon: <FaUserFriends />, url: "#" },
    { title: "Offers & Deals", icon: <FaTags />, url: "#" },
    { title: "More", icon: <FaCircle />, url: "#" },
  ];

  return (
    <>
      <header className="w-full text-sm bg-white shadow sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-12 px-4">
          <div className="text-xl font-bold tracking-wide text-black">NEXTCART</div>
          <button onClick={() => setMenuOpen(true)} className="text-black text-xl p-2 md:hidden">
            <RiMenu3Line />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-50 flex flex-col overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              {/* Banner */}
              <div className="relative w-full">
                <img src="https://www.beyoung.in/api/catalog/Birthday2025/login-sing-up-mobile-10-jun.jpg" alt="Banner" className="w-full h-auto" />
                <button onClick={() => setMenuOpen(false)} className="absolute top-2 right-2 text-white text-xl">
                  ×
                </button>
              </div>

              {/* Menu List */}
              <div className="flex flex-col px-4 py-4 gap-3">
                {menuItems.map(({ title, icon, url, badge }, index) => (
                  <a href={url} key={index} className="flex items-center justify-between py-3 border-b" onClick={() => setMenuOpen(false)}>
                    <div className="flex items-center gap-3 text-gray-800 text-sm font-medium">
                      <span className="text-lg text-gray-600">{icon}</span>
                      {title}
                    </div>
                    {badge && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">{badge}</span>}
                  </a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
