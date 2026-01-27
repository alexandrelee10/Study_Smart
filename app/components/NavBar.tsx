"use client";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NavBar = () => {
  const links = [
    { name: "Dashboard", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Calendar", href: "/calendar" },
  ];

  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50">
      <div className="bg-[#FAFAFA] shadow-md">
        {/* Lock navbar height + center content */}
        <div className="max-w-6xl mx-auto h-20 px-4 sm:px-8 lg:px-10 flex items-center justify-between gap-6">
          
          {/* Logo */}
            <Link href="/" className="relative w-60 h-24">
            <Image
              src="/assets/logo/logo.svg"
              alt="logo"
              fill
              className="object-contain"
              sizes="70px"
              priority
            />
          </Link>

          {/* Links */}
          <ul className="flex items-center gap-6">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm font-medium transition ${
                      isActive ? "text-orange-400" : "text-zinc-700 hover:text-blue-600"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

        </div>
      </div>
    </nav>
  );
};

export default NavBar;

