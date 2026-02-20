// app/courses/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import FooterPage from "@/app/components/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";

const formatEnum = (value?: string | null) =>
  (value ?? "OTHER").split("_").join(" ");

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap params
  const { id } = await params;
  if (!id) return notFound();

  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;

  const course = await prisma.course.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      image: true,
      type: true,
      edLevel: true,
      createdAt: true,
      description: true,
      difficulty: true,
      lessons: {
        where: { isPublished: true },
        orderBy: { order: "asc" },
        select: {
          id: true,
          name: true,
          description: true,
          order: true,
          isPreview: true,
        },
      },
    },
  });

  if (!course) return notFound();

  const isEnrolled = userId
    ? !!(await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: id } },
        select: { id: true },
      }))
    : false;

  // Visible lessons:
  // - if enrolled: all published lessons
  // - if not enrolled: only preview lessons (first 3)
  const visibleLessons = isEnrolled
    ? course.lessons
    : course.lessons.filter((l) => l.isPreview).slice(0, 3);

  // For showing locked cards (nice UX): show published lessons, but mark locked when not enrolled
  const allPublishedLessons = course.lessons;

  return (
    <div className="min-h-screen pt-28 px-4 pb-10">
      <div className="mx-auto max-w-6xl">
        {/* Back Button */}
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
        >
          ← Back to courses
        </Link>

        {/* Card */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {/* Header */}
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[520px_1fr]">
              {/* Left: Image */}
              <div className="relative h-64 w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                <Image
                  src={course.image || "/assets/courses/ca.png"}
                  alt={course.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Right: Info */}
              <div className="flex flex-col justify-center">
                <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
                  {course.name}
                </h1>

                {/* Pills */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                    {formatEnum(course.type)}
                  </span>
                  <span className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                    {formatEnum(course.edLevel)}
                  </span>
                  <span className="rounded-md border border-yellow-300 bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-900 dark:border-yellow-400/40 dark:bg-yellow-400/15 dark:text-yellow-200">
                    {formatEnum(course.difficulty)}
                  </span>

                  {!isEnrolled ? (
                    <span className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200">
                      Preview mode
                    </span>
                  ) : (
                    <span className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-200">
                      Enrolled ✓
                    </span>
                  )}
                </div>

                {/* Optional line */}
                <div className="mt-6 h-px w-full bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="border-t border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
              About this course
            </h2>

            <p className="mt-3 max-w-3xl text-zinc-700 dark:text-zinc-200 leading-relaxed">
              {course.description?.trim() ? course.description : "No description yet."}
            </p>

            {/* Lessons header row */}
            <div className="mt-10 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                  Lessons
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                  {isEnrolled
                    ? "All lessons unlocked."
                    : "You can preview a few lessons. Enroll to unlock everything."}
                </p>
              </div>

              {/* Keep button for later admin tooling */}
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-400
                           dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500 cursor-not-allowed"
                title="Coming soon"
              >
                + Add Lesson
              </button>
            </div>

            {/* Lessons list */}
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              {allPublishedLessons.length === 0 ? (
                <div className="md:col-span-3 rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/30 dark:text-zinc-300">
                  No lessons yet.
                </div>
              ) : (
                allPublishedLessons.map((lesson) => {
                  const locked = !isEnrolled && !lesson.isPreview;

                  const card = (
                    <div
                      className={[
                        "h-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 transition",
                        "dark:border-zinc-800 dark:bg-zinc-950/30",
                        locked
                          ? "opacity-60"
                          : "hover:bg-zinc-100 dark:hover:bg-zinc-900/40",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                            Lesson {lesson.order + 1}
                          </p>
                          <h4 className="mt-1 text-base font-semibold text-zinc-900 dark:text-white truncate">
                            {lesson.name}
                          </h4>
                        </div>

                        {lesson.isPreview && !isEnrolled ? (
                          <span className="shrink-0 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200">
                            Preview
                          </span>
                        ) : locked ? (
                          <span className="shrink-0 rounded-md border border-zinc-300 bg-white px-2 py-1 text-[11px] font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                            Locked
                          </span>
                        ) : (
                          <span className="shrink-0 rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-800 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-200">
                            Open
                          </span>
                        )}
                      </div>

                      {lesson.description ? (
                        <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-200 line-clamp-3">
                          {lesson.description}
                        </p>
                      ) : (
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                          Open this lesson to start learning.
                        </p>
                      )}

                      <div className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400">
                        {locked ? "Enroll to unlock →" : "Open →"}
                      </div>
                    </div>
                  );

                  return locked ? (
                    <div key={lesson.id}>{card}</div>
                  ) : (
                    <Link
                      key={lesson.id}
                      href={`/courses/${course.id}/lessons/${lesson.id}`}
                      className="block"
                    >
                      {card}
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <FooterPage />
        </div>
      </div>
    </div>
  );
}