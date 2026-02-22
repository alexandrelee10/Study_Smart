import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/require-admin";
import { createLesson } from "../action";

export const metadata = { title: "Admin | New Lesson" };

export default async function NewLessonPage() {
  await requireAdmin();

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, code: true },
  });

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 lg:px-10 pt-24 pb-12">
        <Link
          href="/admin/lessons"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back
        </Link>

        <div className="mt-4 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm p-6">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Create Lesson
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Add lesson content and attach it to a course.
          </p>

          <form action={createLesson} className="mt-6 grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Course
              </label>
              <select
                name="courseId"
                required
                className="mt-2 w-full rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3
                           bg-white dark:bg-zinc-950/40"
              >
                <option value="">Select a course…</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <input
              name="name"
              placeholder="Lesson name"
              required
              className="rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3 bg-white dark:bg-zinc-950/40"
            />

            <textarea
              name="description"
              placeholder="Description"
              className="rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3 bg-white dark:bg-zinc-950/40 min-h-[140px]"
            />

            {/* remove if your Lesson model doesn't have these */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                name="order"
                type="number"
                min={1}
                placeholder="Order (1,2,3...)"
                className="rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3 bg-white dark:bg-zinc-950/40"
              />

              <label className="rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3 bg-white dark:bg-zinc-950/40 flex items-center gap-3">
                <input type="checkbox" name="isPreview" className="h-4 w-4" />
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Preview
                </span>
              </label>

              <label className="rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3 bg-white dark:bg-zinc-950/40 flex items-center gap-3">
                <input type="checkbox" name="isPublished" className="h-4 w-4" />
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Published
                </span>
              </label>
            </div>

            <button
              className="rounded-2xl px-5 py-3 text-sm font-semibold
                         bg-zinc-900 text-white hover:bg-zinc-800
                         dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
            >
              Create Lesson
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}