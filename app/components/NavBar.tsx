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

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <nav className="fixed top-0 w-full z-50">
      <div className="bg-[#FAFAFA] shadow-md dark:bg-zinc-950/90 dark:backdrop-blur dark:border-b dark:border-white/10">
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
                        : "text-zinc-700 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}

            {/* Desktop Sign In */}
            <Link
              href="/signin"
              className="hidden md:inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-zinc-700 hover:text-blue-600 hover:bg-black/5 transition
                         dark:text-zinc-200 dark:hover:text-blue-400 dark:hover:bg-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                <path d="M14 14s-1-4-6-4-6 4-6 4 1 1 6 1 6-1 6-1z" />
              </svg>
              Sign in
            </Link>
          </ul>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-xl p-2 text-zinc-800 hover:bg-black/5 transition
                       dark:text-zinc-100 dark:hover:bg-white/10"
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
          } dark:bg-zinc-950 dark:border-l dark:border-white/10`}
          role="dialog"
          aria-modal="true"
        >
          <div className="h-20 px-4 flex items-center justify-between border-b border-black/10 dark:border-white/10">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Menu
            </span>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl p-2 text-zinc-800 hover:bg-black/5 transition
                         dark:text-zinc-100 dark:hover:bg-white/10"
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
                          ? "bg-orange-50 text-orange-500 dark:bg-orange-500/15 dark:text-orange-300"
                          : "text-zinc-800 hover:bg-black/5 dark:text-zinc-100 dark:hover:bg-white/10"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}

              {/* Sign In (Mobile) */}
              <div className="mt-4">
                <Link
                  href="/signin"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-zinc-800 hover:bg-black/5 transition
                             dark:text-zinc-100 dark:hover:bg-white/10"
                  onClick={() => setMobileOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                    <path d="M14 14s-1-4-6-4-6 4-6 4 1 1 6 1 6-1 6-1z" />
                  </svg>
                  Sign in
                </Link>
              </div>
            </ul>

            {/* Optional: CTA */}
            <div className="mt-6 rounded-2xl border border-black/10 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
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
