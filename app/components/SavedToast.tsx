"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SavedToast({
  param = "saved",
  message = "Changes saved ✓",
}: {
  param?: string;
  message?: string;
}) {
  const sp = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const shouldShow = sp.get(param) === "1";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!shouldShow) return;

    setOpen(true);

    const t = window.setTimeout(() => setOpen(false), 2200);

    // Remove ?saved=1 from URL so it doesn't re-show on refresh
    const clean = new URLSearchParams(sp.toString());
    clean.delete(param);
    clean.delete("what");
    router.replace(`${pathname}${clean.toString() ? `?${clean}` : ""}`);

    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldShow]);

  if (!open) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-9999 pt-45">
      <div
        className="
          rounded-2xl border border-emerald-200
          bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900
          shadow-sm
          dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200
        "
      >
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {message}
        </span>
      </div>
    </div>
  );
}