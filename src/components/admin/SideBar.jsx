"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CiHome } from "react-icons/ci";
import { IoMdPricetag } from "react-icons/io";
import { MdOutlineSettings, MdLogout } from "react-icons/md";
import { BiSolidCollection } from "react-icons/bi";
import { FaCcMastercard, FaUserFriends, FaChartLine, FaPlus } from "react-icons/fa";
import { BsCartCheckFill } from "react-icons/bs";
import { FaBlog } from "react-icons/fa6";
import { LuMessageSquare } from "react-icons/lu";
import { IoLayers } from "react-icons/io5";
import { TiThMenu } from "react-icons/ti";

const SideBar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/admin", icon: <CiHome />, label: "Home" },
    { href: "/admin/product", icon: <IoMdPricetag />, label: "Products" },
    { href: "/admin/product/new", icon: <FaPlus />, label: "New Product" },
    { href: "/admin/collection", icon: <BiSolidCollection />, label: "Collections" },
    { href: "/admin/payment", icon: <FaCcMastercard />, label: "Payments" },
    { href: "/admin/post", icon: <FaBlog />, label: "Posts" },
    { href: "/admin/post/new", icon: <FaPlus />, label: "New Post" },
    { href: "/admin/orders", icon: <BsCartCheckFill />, label: "Orders" },
    { href: "/admin/customers", icon: <FaUserFriends />, label: "Customers" },
    { href: "/admin/menu", icon: <TiThMenu />, label: "New Menu" },
    { href: "/admin/slider", icon: <IoLayers />, label: "Slider" },
    { href: "/admin/news-latter", icon: <LuMessageSquare />, label: "News Letter" },
    { href: "/admin/analytics", icon: <FaChartLine />, label: "Analytics" },
    { href: "/admin/settings", icon: <MdOutlineSettings />, label: "Settings" },
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
                className={`flex gap-4 items-center px-3 py-2 rounded-md text-base transition-colors ${
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
          className="flex gap-2 items-center px-3 py-1 rounded-md text-base transition-colors hover:bg-white/60 cursor-pointer"
        >
          <MdLogout />
          <p className="font-medium text-sm">Logout</p>
        </button>
      </ul>
    </div>
  );
};

export default SideBar;
