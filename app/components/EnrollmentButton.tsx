"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { enrollInCourse } from "@/app/server/actions/enroll";

export default function EnrollButton({
  courseId,
  onAdded,
}: {
  courseId: string;
  onAdded?: (courseId: string) => void;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={(e) => {
        // IMPORTANT: your card is a <Link>, so prevent navigation
        e.preventDefault();
        e.stopPropagation();

        startTransition(async () => {
          await enrollInCourse(courseId); // writes to DB
          onAdded?.(courseId);            // optimistic UI
          router.refresh();               // re-fetch server props
        });
      }}
      className="rounded-2xl px-4 py-3 text-sm font-medium
                 bg-zinc-900 text-white hover:bg-zinc-800
                 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200
                 disabled:opacity-60 disabled:cursor-not-allowed transition"
    >
      {pending ? "Adding..." : "Add to My Courses"}
    </button>
  );
}