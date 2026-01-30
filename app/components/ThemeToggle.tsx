"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-xl border px-3 py-2 text-sm
                 bg-white text-zinc-900 border-zinc-200
                 dark:bg-zinc-900 dark:text-white dark:border-white/10"
    >
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
}
