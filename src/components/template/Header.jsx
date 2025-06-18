"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiMenu3Line } from "react-icons/ri";
import { DynamicIcon } from "lucide-react/dynamic";
import { IoBagHandle } from "react-icons/io5";

export default function FullHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("/api/data?collection=menu-item");
        const data = await res.json();
        if (res.ok) {
          // Prepare items with unique display positions
          const prepareItems = (items) => {
            const sorted = [...items].sort((a, b) => (a.position ?? 9999) - (b.position ?? 9999));
            const seen = new Set();
            const result = [];
            let counter = 1;

            for (const item of sorted) {
              while (seen.has(counter)) counter++;
              const current = item.position ?? counter;
              const final = seen.has(current) ? counter : current;
              seen.add(final);
              result.push({ ...item, __finalPosition: final });
              counter = final + 1;
            }

            return result.sort((a, b) => a.__finalPosition - b.__finalPosition);
          };

          const isMobile = (item) => item.displayFor === "mobile" || item.displayFor === "both";
          const isDesktop = (item) => item.displayFor === "desktop" || item.displayFor === "both";

          const mobileItems = prepareItems(data.filter(isMobile));
          const desktopItems = prepareItems(data.filter(isDesktop));

          setMenuItems({ mobile: mobileItems, desktop: desktopItems });
        }
      } catch (err) {
        console.error("Failed to load menu items:", err);
      }
    };

    fetchMenu();
  }, []);

  return (
    <>
      <header className="w-full text-sm bg-white shadow sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between h-12 px-4 md:px-20">
          <div className="text-xl font-bold tracking-wide text-black">NEXTCART</div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-4 items-center">
            {menuItems?.desktop?.map(({ _id, title, url }) => (
              <a key={_id} href={url} className="flex items-center gap-1 text-sm capitalize">
                <p className="capitalize">{title}</p>
              </a>
            ))}
          </nav>

          <div className="flex gap-1 items-center justify-end">
            <button className="text-black text-xl p-2 cursor-pointer">
              <IoBagHandle />
            </button>
            <button onClick={() => setMenuOpen(true)} className="text-black text-xl p-2 cursor-pointer">
              <RiMenu3Line />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 backdrop-blur-sm bg-white/30 z-50"
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
                <button onClick={() => setMenuOpen(false)} className="absolute top-2 right-2 text-white text-xl cursor-pointer">
                  ×
                </button>
              </div>

              {/* Mobile Menu List */}
              <div className="flex flex-col px-4 py-4 gap-3">
                {menuItems?.mobile?.map(({ _id, title, url, iconName, badge }) => (
                  <a href={url} key={_id} className="flex items-center justify-between py-3 border-b" onClick={() => setMenuOpen(false)}>
                    <div className="flex items-center gap-3 text-gray-800 text-sm font-medium">
                      <span className="text-lg text-gray-600">
                        <DynamicIcon name={iconName || "help-circle"} size={18} />
                      </span>
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
