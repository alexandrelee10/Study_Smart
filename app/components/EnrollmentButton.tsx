"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { enrollInCourse, removeEnrollment } from "@/app/server/actions/enroll";

export default function EnrollButton({
  courseId,
  isEnrolled,
  onAdded,
  onRemoved,
}: {
  courseId: string;
  isEnrolled: boolean;
  onAdded?: (courseId: string) => void;
  onRemoved?: (courseId: string) => void;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // IMPORTANT: card is a <Link>
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      if (isEnrolled) {
        await removeEnrollment(courseId);
        onRemoved?.(courseId);
      } else {
        await enrollInCourse(courseId);
        onAdded?.(courseId);
      }
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleClick}
      className={
        isEnrolled
          ? "rounded-2xl px-4 py-3 text-sm font-medium border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition disabled:opacity-60"
          : "rounded-2xl px-4 py-3 text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition disabled:opacity-60"
      }
    >
      {pending ? (isEnrolled ? "Removing..." : "Adding...") : isEnrolled ? "Remove" : "Add to My Courses"}
    </button>
  );
}