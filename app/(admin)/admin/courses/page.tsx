import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/require-admin";
import SavedToast from "@/app/components/SavedToast";

export const metadata = { title: "Manage Courses" };

export default async function AdminCoursesPage() {
  await requireAdmin();

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <SavedToast message="Changes saved ✓" />

      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-10 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
              Manage Courses
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Create, edit, and organize your course library.
            </p>
          </div>

          <Link
            href="/admin/courses/new"
            className="
              inline-flex items-center justify-center
              rounded-2xl px-5 py-3 text-sm font-semibold
              bg-zinc-900 text-white hover:bg-zinc-800
              dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200
              transition
            "
          >
            + New Course
          </Link>
        </div>

        {/* List */}
        <div className="mt-8 space-y-3">
          {courses.length === 0 ? (
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 p-8 text-center">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                No courses yet. Create one to get started.
              </p>
            </div>
          ) : (
            courses.map((course) => (
              <div
                key={course.id}
                className="
                  rounded-3xl border border-black/10 dark:border-white/10
                  bg-white dark:bg-zinc-900/50
                  shadow-sm
                  px-5 py-4
                  flex items-center justify-between gap-4
                  hover:shadow-md transition
                "
              >
                {/* Left */}
                <div className="min-w-0">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {course.name}
                  </p>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {course.code} • {course.type ?? "Other"} • {course.edLevel ?? "Other"}
                  </p>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/courses/${course.id}`}
                    className="
                      rounded-xl px-4 py-2 text-sm font-medium
                      border border-black/10 dark:border-white/10
                      hover:bg-black/5 dark:hover:bg-white/10
                      transition
                    "
                  >
                    View
                  </Link>

                  <Link
                    href={`/admin/courses/${course.id}/edit`}
                    className="
                      rounded-xl px-4 py-2 text-sm font-medium
                      bg-blue-600 text-white hover:bg-blue-500
                      transition
                    "
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}