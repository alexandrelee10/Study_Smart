import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/require-admin";
import AdminToast from "@/app/components/AdminToast";
import { deleteLesson } from "./action";

export const metadata = { title: "Manage Lessons" };

function fmtDate(d: Date) {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default async function AdminLessonsPage() {
  await requireAdmin();

  const lessons = await prisma.lesson.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: 60,
    select: {
      id: true,
      name: true,
      createdAt: true,
      courseId: true,
      // remove if your model doesn't have these:
      isPublished: true,
      isPreview: true,
      course: { select: { name: true } },
    },
  });

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AdminToast param="saved" message="Lesson saved ✓" variant="success" />
      <AdminToast param="deleted" message="Lesson deleted ✓" variant="danger" />

      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-10 pt-24 pb-12">
        <section className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-black/10 dark:border-white/10 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
                Manage Lessons
              </h1>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Create lessons, edit content, and publish previews.
              </p>
            </div>

            <div className="flex items-center gap-2">

              <Link
                href="/admin/lessons/new"
                className="rounded-2xl px-4 py-2 text-sm font-semibold
                           bg-zinc-900 text-white hover:bg-zinc-800
                           dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
              >
                + New Lesson
              </Link>
            </div>
          </div>

          <div className="p-6">
            {lessons.length === 0 ? (
              <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-8 text-center">
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  No lessons yet. Create your first one.
                </p>
                <Link
                  href="/admin/lessons/new"
                  className="inline-flex mt-4 rounded-2xl px-5 py-3 text-sm font-semibold
                             bg-zinc-900 text-white hover:bg-zinc-800
                             dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
                >
                  + New Lesson
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lessons.map((l) => (
                  <div
                    key={l.id}
                    className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950/30 shadow-sm p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {l.name}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 truncate">
                          {l.course?.name ?? "Course"} • {fmtDate(l.createdAt)}
                        </p>

                        {/* badges */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {"isPreview" in l && l.isPreview ? (
                            <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold bg-blue-500/12 text-blue-700 dark:bg-blue-400/15 dark:text-blue-200">
                              Preview
                            </span>
                          ) : null}

                          {"isPublished" in l && l.isPublished ? (
                            <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold bg-emerald-500/12 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200">
                              Published
                            </span>
                          ) : (
                            <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold bg-zinc-500/10 text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
                              Draft
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/admin/lessons/${l.id}/edit`}
                          className="rounded-xl px-3 py-2 text-sm font-semibold
                                     border border-black/10 dark:border-white/10
                                     hover:bg-black/5 dark:hover:bg-white/10 transition"
                        >
                          Edit
                        </Link>

                        <form action={async () => { "use server"; await deleteLesson(l.id); }}>
                          <button
                            type="submit"
                            className="rounded-xl px-3 py-2 text-sm font-semibold
                                       text-red-600 hover:bg-red-50
                                       dark:text-red-400 dark:hover:bg-red-500/10 transition"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <Link
                        href={`/courses/${l.courseId}/lessons/${l.id}`}
                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Open lesson →
                      </Link>

                      <span className="text-xs text-zinc-400">ID: {l.id.slice(0, 8)}…</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}