import React from "react";
import Image from "next/image";
import Link from "next/link";

import logo from "@/public/assets/logo/logo_dark.svg";
import ThemeToggle from "./ThemeToggle";

const FooterPage = () => {
  return (
    <footer className="bg-white text-zinc-600 dark:bg-zinc-800 dark:text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="relative h-20 w-70">
              <Image src={logo} alt="StudySmart logo" fill className="object-contain" />
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
              <li>
                <Link
                  href="#Hero"
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-zinc-900 font-semibold mb-4 dark:text-white">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <h4 className="text-zinc-900 font-semibold dark:text-white">
              Get started
            </h4>
            <p className="text-sm dark:text-white/80">
              Start building better study habits today.
            </p>

            <button className="w-fit px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
              Try for free
            </button>

            {/* Put toggle here so it doesn't float weird */}
            <ThemeToggle />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between text-sm">
          <p className="dark:text-white/80">
            © {new Date().getFullYear()} StudySmart. All rights reserved.
          </p>
          <p className="mt-2 sm:mt-0 dark:text-white/80">Built for students 📚</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterPage;
