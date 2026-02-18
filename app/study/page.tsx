import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prisma";
import FooterPage from "../components/Footer";
import StudyTimerClient from "./StudyTimerClient";

export const metadata = { title: "Study Smart | Study Session" };

export default async function StudyPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signin");

  const userId = (session.user as any).id as string;
  if (!userId) redirect("/signin");

  // Enrolled courses only
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: { course: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const courses = enrollments.map((e) => ({
    id: e.course.id,
    name: e.course.name,
  }));

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-8 lg:px-10 pt-24 pb-12">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to dashboard
          </Link>

          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {new Date().toLocaleDateString()}
          </div>
        </div>

        <StudyTimerClient courses={courses} />
      </div>

      <FooterPage />
    </main>
  );
}
