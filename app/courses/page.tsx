import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prisma";
import CoursesClient from "./CourseClient";

export const metadata = { title: "Study Smart | Courses" };

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;

  const { view } = await searchParams;
  const showExplore = view === "explore";

  // mode
  const mode: "my" | "explore" = userId && !showExplore ? "my" : "explore";

  // Fetch courses
  const courseContent =
    mode === "my"
      ? (
          await prisma.enrollment.findMany({
            where: { userId },
            include: { course: true },
            orderBy: { createdAt: "desc" },
          })
        ).map((e) => e.course)
      : await prisma.course.findMany({
          orderBy: { createdAt: "desc" },
        });

  //  always fetch enrolled ids for UI state
  const enrolledCourseIds = userId
    ? (
        await prisma.enrollment.findMany({
          where: { userId },
          select: { courseId: true },
        })
      ).map((e) => e.courseId)
    : [];

  // Toggle buttons
  const topRight =
    userId ? (
      <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 p-1 shadow-sm">
        <Link
          href="/courses"
          className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition ${
            mode === "my"
              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
              : "text-zinc-700 hover:bg-black/5 dark:text-zinc-200 dark:hover:bg-white/10"
          }`}
        >
          My Courses
        </Link>
        <Link
          href="/courses?view=explore"
          className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition ${
            mode === "explore"
              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
              : "text-zinc-700 hover:bg-black/5 dark:text-zinc-200 dark:hover:bg-white/10"
          }`}
        >
          Explore
        </Link>
      </div>
    ) : null;

  const title = mode === "my" ? "My courses" : "Explore our courses";
  const subtitle =
    mode === "my"
      ? "Courses you’re enrolled in."
      : "Boost your knowledge with our expert-led courses";

  return (
    <CoursesClient
      courseContent={courseContent as any}
      title={title}
      subtitle={subtitle}
      topRight={topRight}
      mode={mode}                      
      enrolledCourseIds={enrolledCourseIds}
    />
  );
}