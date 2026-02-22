import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/require-admin";
import Link from "next/link";
import { deleteCourse } from "./action";



export default async function AdminCoursePage() {
    await requireAdmin();

    const courses = await prisma.course.findMany({
        orderBy: {createdAt: "desc"},
        select: {id: true, name: true, code: true, type: true, edLevel: true},
    });

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-10 pt-24 pb-12">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
              Manage Courses
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Create, edit, and remove courses.
            </p>
          </div>

          <Link
            href="/admin/courses/new"
            className="rounded-2xl px-5 py-3 text-sm font-medium
                       bg-zinc-900 text-white hover:bg-zinc-800
                       dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
          >
            + New Course
          </Link>
        </div>

        <div className="mt-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
          {courses.length === 0 ? (
            <div className="p-6 text-sm text-zinc-600 dark:text-zinc-400">
              No courses yet.
            </div>
          ) : (
            <div className="divide-y divide-black/10 dark:divide-white/10">
              {courses.map((c) => (
                <div key={c.id} className="p-5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {c.name} <span className="text-zinc-500">({c.code})</span>
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {c.type} • {c.edLevel}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/courses/${c.id}/edit`}
                      className="rounded-xl px-4 py-2 text-sm font-medium
                                 border border-black/10 dark:border-white/10
                                 hover:bg-black/5 dark:hover:bg-white/10 transition"
                    >
                      Edit
                    </Link>

                    <form action={async () => { "use server"; await deleteCourse(c.id); }}>
                      <button
                        type="submit"
                        className="rounded-xl px-4 py-2 text-sm font-medium
                                   text-red-600 hover:bg-red-50
                                   dark:text-red-400 dark:hover:bg-red-500/10 transition"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}