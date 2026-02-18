"use client";

import * as React from "react";
import { unenrollFromCourse } from "../courses/action";

export default function RemoveButton({ courseId }: { courseId: string }) {
  const [pending, startTransition] = React.useTransition();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        startTransition(() => unenrollFromCourse(courseId));
      }}
      disabled={pending}
      className="
        w-full rounded-2xl px-4 py-3 text-sm font-medium
        border border-zinc-200 dark:border-zinc-800
        hover:bg-zinc-50 dark:hover:bg-zinc-900 transition
        disabled:opacity-60
      "
    >
      {pending ? "Removing…" : "Remove"}
    </button>
  );
}
