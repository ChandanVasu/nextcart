"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Home,
  Tags,
  Plus,
  LayoutGrid,
  CreditCard,
  FileText,
  ShoppingCart,
  Users,
  Menu,
  Layers,
  Mail,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";

const SideBar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/admin", icon: <Home size={18} />, label: "Home" },
    { href: "/admin/product", icon: <Tags size={18} />, label: "Products" },
    { href: "/admin/product/new", icon: <Plus size={18} />, label: "New Product" },
    { href: "/admin/collection", icon: <LayoutGrid size={18} />, label: "Collections" },
    { href: "/admin/payment", icon: <CreditCard size={18} />, label: "Payments" },
    { href: "/admin/post", icon: <FileText size={18} />, label: "Posts" },
    { href: "/admin/post/new", icon: <Plus size={18} />, label: "New Post" },
    { href: "/admin/orders", icon: <ShoppingCart size={18} />, label: "Orders" },
    { href: "/admin/customers", icon: <Users size={18} />, label: "Customers" },
    { href: "/admin/menu", icon: <Menu size={18} />, label: "New Menu" },
    { href: "/admin/slider", icon: <Layers size={18} />, label: "Slider" },
    { href: "/admin/news-latter", icon: <Mail size={18} />, label: "News Letter" },
    { href: "/admin/analytics", icon: <BarChart2 size={18} />, label: "Analytics" },
    { href: "/admin/settings", icon: <Settings size={18} />, label: "Settings" },
  ];

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "DELETE" });
    router.push("/login");
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <ul className="flex flex-col gap-3">
        {links.map(({ href, icon, label }) => {
          const isActive = pathname === href;

          return (
            <Link key={href} href={href}>
              <li
                className={`flex gap-3 items-center px-3 py-2 rounded-md text-base transition-colors ${
                  isActive ? "bg-black text-white" : "hover:bg-white/60"
                }`}
              >
                {icon}
                <p className="font-medium text-sm">{label}</p>
              </li>
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className="flex gap-3 items-center px-3 py-2 rounded-md text-base transition-colors hover:bg-white/60 cursor-pointer"
        >
          <LogOut size={18} />
          <p className="font-medium text-sm">Logout</p>
        </button>
      </ul>
    </div>
  );
};

export default SideBar;
