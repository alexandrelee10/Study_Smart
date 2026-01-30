"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="
        inline-flex items-center gap-2
        rounded-xl px-3 py-2 text-sm font-medium
        border border-zinc-200 bg-white text-zinc-900
        hover:bg-zinc-100 transition
        dark:border-white/10 dark:bg-zinc-900 dark:text-white
        dark:hover:bg-white/10
      "
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-yellow-400" />
          Light
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-blue-500" />
          Dark
        </>
      )}
    </button>
  );
}
