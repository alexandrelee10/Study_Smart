"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Variant = "success" | "danger" | "info";

const styles: Record<Variant, string> = {
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200",
  danger:
    "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200",
  info:
    "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-200",
};

export default function AdminToast({
  param,
  message,
  variant = "success",
}: {
  param: string; // e.g. "saved" or "deleted"
  message: string;
  variant?: Variant;
}) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const triggered = sp.get(param) === "1";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!triggered) return;

    setOpen(true);

    // remove param so toast doesn't repeat on refresh
    const t1 = window.setTimeout(() => {
      router.replace(pathname, { scroll: false });
    }, 150);

    // auto hide
    const t2 = window.setTimeout(() => setOpen(false), 2200);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [triggered, router, pathname]);

  if (!open) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999]">
      <div
        className={[
          "rounded-2xl border px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur",
          styles[variant],
        ].join(" ")}
      >
        {message}
      </div>
    </div>
  );
}