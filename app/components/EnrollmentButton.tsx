"use client";

import * as React from "react";
import { enrollInCourse } from "../courses/action";

export default function EnrollButton({
  courseId,
  onAdded,
}: {
  courseId: string;
  onAdded?: (courseId: string) => void;
}) {
  const [pending, startTransition] = React.useTransition();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();     // prevent Link navigation
        e.stopPropagation();    // prevent click bubbling to <Link>

        startTransition(() => {
          enrollInCourse(courseId).then(() => {
            onAdded?.(courseId);
          });
        });
      }}
      disabled={pending}
      className="
        w-full rounded-2xl px-4 py-3 text-sm font-medium
        bg-blue-600 text-white hover:bg-blue-700 transition
        disabled:opacity-60
      "
    >
      {pending ? "Adding…" : "Add to My Courses"}
    </button>
  );
}
