// app/courses/[id]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import FooterPage from "@/app/components/Footer";
import Link from "next/link";
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
    },
  });

  if (!course) return notFound();

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
              {course.description?.trim()
                ? course.description
                : "No description yet."}
            </p>

            {/* Lessons header row */}
            <div className="mt-10 flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                Lessons
              </h3>

              <button className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800">
                + Add Lesson
              </button>
            </div>

            {/* Placeholder lesson cards */}
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="h-24 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/30" />
              <div className="h-24 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/30" />
              <div className="h-24 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/30" />
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
