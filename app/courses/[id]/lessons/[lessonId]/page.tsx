import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";

export const metadata = { title: "Lessons" };

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  // folder is [id], so params.id is the course id
  const { id, lessonId } = await params;
  const courseId = id;

  if (!courseId || !lessonId) return notFound();

  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;

  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, courseId, isPublished: true },
    select: {
      id: true,
      name: true,
      description: true,
      order: true,
      isPreview: true,
      course: { select: { id: true, name: true } },
    },
  });

  if (!lesson) return notFound();

  const isEnrolled = userId
    ? !!(await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
        select: { id: true },
      }))
    : false;

  // If not enrolled, only allow preview lessons
  if (!isEnrolled && !lesson.isPreview) {
    redirect(`/courses/${courseId}?needEnroll=1`);
  }

  return (
    <main className="min-h-screen pt-24 px-4 sm:px-8 lg:px-10 max-w-3xl mx-auto">
      <Link
        href={`/courses/${courseId}`}
        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
      >
        ← Back to {lesson.course.name}
      </Link>

      <p className="mt-6 text-sm text-zinc-500">
        {lesson.course.name} • Lesson {lesson.order + 1}
      </p>

      <h1 className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-white">
        {lesson.name}
      </h1>

      {lesson.description ? (
        <p className="mt-4 text-zinc-700 dark:text-zinc-200 leading-relaxed">
          {lesson.description}
        </p>
      ) : null}

      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-500 dark:text-zinc-300">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis est harum fuga dolorem tempora quos maxime porro, dolores deleniti, optio fugit et sunt tempore consequuntur rerum nobis, ab unde debitis?
        </p>
      </div>
    </main>
  );
}