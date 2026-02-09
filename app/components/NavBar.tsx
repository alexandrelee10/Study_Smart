"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";

const NavBar = () => {
  const [profileOpen, setProfileOpen] = useState(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Calendar", href: "/calendar" },
  ];

  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ Auth session
  const { data: session, status } = useSession();

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false); // ✅ close dropdown on navigation
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Logo
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const logoSrc =
    mounted && resolvedTheme === "dark"
      ? "/assets/logo/logo_dark.svg"
      : "/assets/logo/logo.svg";

  const user = session?.user;
  const userLabel =
    (user?.name as string | undefined) ||
    (user?.email ? user.email.split("@")[0] : "");

  const userImage = user?.image ?? "";

  const PersonIcon = ({ size = 18 }: { size?: number }) => (
    // Person icon
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="currentColor"
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
      <path
        fillRule="evenodd"
        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
      />
    </svg>
  );

  const doSignOut = async () => {
    setProfileOpen(false);
    setMobileOpen(false);
    await signOut({ callbackUrl: "/signin?signedOut=1" });
  };

  return (
    <nav className="fixed top-0 w-full z-50">
      <div className="bg-[#FAFAFA] shadow-md dark:bg-zinc-950/90 dark:backdrop-blur dark:border-b dark:border-white/10">
        <div className="max-w-6xl mx-auto h-20 px-4 sm:px-8 lg:px-10 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="relative w-60 h-24">
            <Image
              src={logoSrc}
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

            {/* Desktop Right Slot: user OR sign in */}
            {status === "loading" ? (
              <div className="hidden md:flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-zinc-500 dark:text-zinc-400">
                Loading…
              </div>
            ) : user ? (
              <div className="relative hidden md:block">
                {/* User pill button */}
                <button
                  type="button"
                  onClick={() => setProfileOpen((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium
                             text-zinc-800 hover:bg-black/5 transition
                             dark:text-zinc-100 dark:hover:bg-white/10"
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full overflow-hidden border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5">
                    {userImage ? (
                      <Image
                        src={userImage}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="h-8 w-8 object-cover"
                      />
                    ) : (
                      <PersonIcon size={18} />
                    )}
                  </span>
                  <span className="max-w-[160px] truncate">{userLabel}</span>
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-xl border border-black/10 bg-white shadow-lg
                               dark:bg-zinc-950 dark:border-white/10 overflow-hidden"
                    role="menu"
                  >
                    <Link
                      href="/dashboard"
                      className="block px-4 py-3 text-sm text-zinc-800 hover:bg-black/5 transition
                                 dark:text-zinc-100 dark:hover:bg-white/10"
                      onClick={() => setProfileOpen(false)}
                      role="menuitem"
                    >
                      Dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={doSignOut}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition
                                 dark:text-red-400 dark:hover:bg-red-500/10"
                      role="menuitem"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/signin"
                className="hidden md:inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-zinc-700 hover:text-blue-600 hover:bg-black/5 transition
                           dark:text-zinc-200 dark:hover:text-blue-400 dark:hover:bg-white/10"
              >
                <PersonIcon size={18} />
                Sign in
              </Link>
            )}
          </ul>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-xl p-2 text-zinc-800 hover:bg-black/5 transition
                       dark:text-zinc-100 dark:hover:bg-white/10"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => {
              setProfileOpen(false);
              setMobileOpen(true);
            }}
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
            {/* ✅ User header (mobile) */}
            {status === "loading" ? (
              <div className="mb-4 rounded-2xl border border-black/10 px-4 py-3 text-sm text-zinc-600 dark:border-white/10 dark:text-zinc-300">
                Loading profile…
              </div>
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="mb-2 flex items-center gap-3 rounded-2xl border border-black/10 px-4 py-3
                             hover:bg-black/5 transition
                             dark:border-white/10 dark:hover:bg-white/10"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full overflow-hidden border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5">
                    {userImage ? (
                      <Image
                        src={userImage}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="h-10 w-10 object-cover"
                      />
                    ) : (
                      <PersonIcon size={20} />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {userLabel}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      {user.email ?? ""}
                    </p>
                  </div>
                </Link>

                {/* ✅ Mobile sign out */}
                <button
                  type="button"
                  onClick={doSignOut}
                  className="mb-4 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-medium
                             text-red-600 hover:bg-red-50 transition
                             dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  <PersonIcon size={20} />
                  Sign out
                </button>
              </>
            ) : null}

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

              {/* Mobile Sign In if logged out */}
              {!user && status !== "loading" && (
                <div className="mt-4">
                  <Link
                    href="/signin"
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-zinc-800 hover:bg-black/5 transition
                               dark:text-zinc-100 dark:hover:bg-white/10"
                    onClick={() => setMobileOpen(false)}
                  >
                    <PersonIcon size={20} />
                    Sign in
                  </Link>
                </div>
              )}
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
