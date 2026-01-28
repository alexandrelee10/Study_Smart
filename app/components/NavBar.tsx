"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NavBar = () => {
  const links = [
    { name: "Dashboard", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Calendar", href: "/calendar" },
  ];

  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <nav className="fixed top-0 w-full z-50">
      <div className="bg-[#FAFAFA] shadow-md">
        <div className="max-w-6xl mx-auto h-20 px-4 sm:px-8 lg:px-10 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="relative w-60 h-24">
            <Image
              src="/assets/logo/logo.svg"
              alt="logo"
              fill
              className="object-contain"
              sizes="240px"
              priority
            />
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-6">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm font-medium transition ${
                      isActive
                        ? "text-orange-400"
                        : "text-zinc-700 hover:text-blue-600"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-xl p-2 text-zinc-800 hover:bg-black/5 transition"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-[60] transition ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
        >
          <div className="h-20 px-4 flex items-center justify-between border-b border-black/10">
            <span className="text-sm font-semibold text-zinc-900">Menu</span>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl p-2 text-zinc-800 hover:bg-black/5 transition"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4">
            <ul className="flex flex-col gap-2">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block rounded-xl px-4 py-3 text-base font-medium transition ${
                        isActive
                          ? "bg-orange-50 text-orange-500"
                          : "text-zinc-800 hover:bg-black/5"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Optional: CTA */}
            <div className="mt-6 rounded-2xl border border-black/10 p-4">
              <p className="text-sm text-zinc-600">
                Keep your streak alive — log a session today 🔥
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;


