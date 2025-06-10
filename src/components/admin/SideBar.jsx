"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CiHome } from "react-icons/ci";
import { FaFileAlt } from "react-icons/fa";
import { MdPostAdd } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";

const SideBar = () => {
  const pathname = usePathname(); // Get the current path

  return (
    <div>
      <ul className="flex flex-col gap-2">
        <Link href="/admin">
          <li
            className={`flex gap-2 items-center justify-start px-3 py-1 rounded-md text-base ${
              pathname === "/admin" ? "bg-white" : "hover:bg-white/60"
            }`}
          >
            <CiHome />
            <p className="font-medium text-sm">Home</p>
          </li>
        </Link>
        <Link href="/admin/user">
          <li
            className={`flex gap-2 items-center justify-start px-3 py-1 rounded-md text-base ${
              pathname.startsWith("/admin/user") ? "bg-white" : "hover:bg-white/60"
            }`}
          >
            <FaUserAlt />
            <p className="font-medium text-sm">User</p>
          </li>
        </Link>
        <Link href="/admin/posts">
          <li
            className={`flex gap-2 items-center justify-start px-3 py-1 rounded-md text-base ${
              pathname.startsWith("/admin/posts") ? "bg-white" : "hover:bg-white/60"
            }`}
          >
            <FaFileAlt />
            <p className="font-medium text-sm">Posts</p>
          </li>
        </Link>
        <Link href="/admin/pages">
          <li
            className={`flex gap-2 items-center justify-start px-3 py-1 rounded-md text-base ${
              pathname.startsWith("/admin/pages") ? "bg-white" : "hover:bg-white/60"
            }`}
          >
            <MdPostAdd />
            <p className="font-medium text-sm">Pages</p>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default SideBar;
