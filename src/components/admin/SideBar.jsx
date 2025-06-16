"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CiHome } from "react-icons/ci";
import { IoMdPricetag } from "react-icons/io";
import { MdPostAdd, MdOutlineSettings, MdLogout } from "react-icons/md";
import { BiSolidCollection } from "react-icons/bi";
import { FaCcMastercard, FaUserFriends, FaChartLine } from "react-icons/fa";
import { BsCartCheckFill } from "react-icons/bs";

const SideBar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/admin", icon: <CiHome />, label: "Home" },
    { href: "/admin/product", icon: <IoMdPricetag />, label: "Product" },
    { href: "/admin/collection", icon: <BiSolidCollection />, label: "Collection" },
    { href: "/admin/payment", icon: <FaCcMastercard />, label: "Payment" },
    { href: "/admin/post", icon: <MdPostAdd />, label: "Post" },
    { href: "/admin/orders", icon: <BsCartCheckFill />, label: "Orders" },
    { href: "/admin/customers", icon: <FaUserFriends />, label: "Customers" },
    { href: "/admin/analytics", icon: <FaChartLine />, label: "Analytics" },
    { href: "/admin/settings", icon: <MdOutlineSettings />, label: "Settings" },
  ];

  const handleLogout = async () => {
    await fetch("/api/login", { method: "DELETE" });
    router.push("/login");
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <ul className="flex flex-col gap-2">
        {links.map(({ href, icon, label }) => {
          const isActive = pathname === href || (pathname.startsWith(href) && href !== "/admin");

          return (
            <Link key={href} href={href}>
              <li
                className={`flex gap-2 items-center px-3 py-1 rounded-md text-base transition-colors ${isActive ? "bg-white" : "hover:bg-white/60"}`}
              >
                {icon}
                <p className="font-medium text-sm">{label}</p>
              </li>
            </Link>
          );
        })}
        <button onClick={handleLogout} className="flex gap-2 items-center px-3 py-1 rounded-md text-base transition-colors hover:bg-white/60 cursor-pointer">
          <MdLogout />
          <p className="font-medium text-sm">Logout</p>
        </button>
      </ul>
    </div>
  );
};

export default SideBar;
