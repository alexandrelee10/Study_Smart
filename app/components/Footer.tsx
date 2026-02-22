"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";


const FooterPage = () => {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const { data: session } = useSession();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const logoSrc =
    mounted && resolvedTheme === "dark"
      ? "/assets/logo/logo_dark.svg"
      : "/assets/logo/logo.svg";

  // hide CTA on dashboard routes
  const isDashboard = pathname.startsWith("/dashboard");

  const products = [
    {name: "Features", href: "/components/features"},
    {name: "Pricing", href: "/components/pricing"},
    {name: "FAQ", href: "/components/faq"}
  ];

  const company = [
    {name: "About", href: "/components/about"},
    {name: "Contact Us", href: "/components/contact"},
    {name: "Privacy", href: "/components/privacy"},
    {name: "Terms of Service", href: "/components/terms"},
  ];


  // hide CTA if logged in
  const isLoggedIn = !!session?.user;

  const showCTA = !isDashboard && !isLoggedIn;

  return (
    <footer className="bg-white text-zinc-600 dark:bg-zinc-800 dark:text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="relative h-20 w-70">
              {mounted && (
                <Image
                  src={logoSrc}
                  alt="StudySmart logo"
                  fill
                  className="object-contain"
                  priority
                />
              )}
            </div>

            <p className="text-sm leading-relaxed dark:text-white/80">
              StudySmart helps students build better study habits, stay
              consistent, and track progress with clarity.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-zinc-900 font-semibold mb-4 dark:text-white">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              {products.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-zinc-900 dark:hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-zinc-900 font-semibold mb-4 dark:text-white">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              {company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-zinc-900 dark:hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA (ONLY when not logged in + not dashboard) */}
          {showCTA && (
            <div className="space-y-4">
              <h4 className="text-zinc-900 font-semibold dark:text-white">
                Get started
              </h4>
              <p className="text-sm dark:text-white/80">
                Start building better study habits today.
              </p>

              <Link
                href="/signup"
                className="inline-block px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Try for free
              </Link>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between text-sm">
          <p className="dark:text-white/80">
            © {new Date().getFullYear()} StudySmart. All rights reserved.
          </p>
          <p className="mt-2 sm:mt-0 dark:text-white/80">
            Built for students
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterPage;