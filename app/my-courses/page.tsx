import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prisma";
import FooterPage from "../components/Footer";

export const metadata = { title: "Study Smart | My Courses" };

export default async function MyCoursesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signin");

  const userId = (session.user as any).id as string;
  if (!userId) redirect("/signin");

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          name: true,
          image: true,
          type: true,
          edLevel: true,
          difficulty: true,
          description: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const courses = enrollments.map((e) => e.course);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-10 pt-24 pb-12">
        {/* Top row */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to dashboard
          </Link>

          {/* ✅ switch back to general courses */}
          <Link
            href="/courses"
            className="rounded-xl border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-medium
                       hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            View all courses →
          </Link>
        </div>

        {/* Header */}
        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-black/10 dark:border-white/10">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              My Courses
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              These are the courses you’re enrolled in.
            </p>
          </div>

          <div className="p-6">
            {courses.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  You’re not enrolled in any courses yet.
                </p>
                <div className="mt-4 flex gap-2">
                  <Link
                    href="/courses"
                    className="rounded-xl px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Browse all courses
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((c) => (
                  <Link
                    key={c.id}
                    href={`/courses/${c.id}`}
                    className="group rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950/40 shadow-sm overflow-hidden hover:shadow-md transition"
                  >
                    <div className="relative h-40 bg-zinc-100 dark:bg-zinc-900">
                      {c.image ? (
                        <Image
                          src={c.image}
                          alt={c.name}
                          fill
                          className="object-cover group-hover:scale-[1.02] transition"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-zinc-400 dark:text-zinc-500 text-sm">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        {c.name}
                      </h3>

                      {c.description ? (
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                          {c.description}
                        </p>
                      ) : (
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                          No description yet.
                        </p>
                      )}

                      <div className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
                        Open →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <FooterPage />
    </main>
  );
}
