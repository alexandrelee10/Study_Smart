import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prisma";
import FooterPage from "../components/Footer";

export const metadata = { title: "My Courses" };

function prettyEnum(v?: string | null) {
  if (!v) return "Other";
  return v
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/(^|\s)\S/g, (t) => t.toUpperCase());
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 dark:border-white/10 px-2.5 py-1 text-[11px] font-medium text-zinc-700 dark:text-zinc-200 bg-white/70 dark:bg-white/5 backdrop-blur">
      {children}
    </span>
  );
}

export default async function MyCoursesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signin?next=/my-courses");

  const userId = (session.user as any).id as string | undefined;
  if (!userId) redirect("/signin?next=/my-courses");

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
          createdAt: true,
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

          <Link
            href="/courses"
            className="rounded-2xl border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-medium
                       hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            Explore courses →
          </Link>
        </div>

        {/* Header */}
        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-blue-600/10 to-transparent dark:from-blue-500/10">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              My Courses
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Courses you’ve added to your dashboard.
            </p>
          </div>

          <div className="p-6">
            {courses.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 p-8 text-center">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  No courses yet
                </h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Go explore courses and add a few to start tracking progress.
                </p>

                <div className="mt-5 flex justify-center">
                  <Link
                    href="/courses"
                    className="rounded-2xl px-5 py-3 text-sm font-medium
                               bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Browse courses
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>
                    You’re enrolled in{" "}
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {courses.length}
                    </span>{" "}
                    course{courses.length === 1 ? "" : "s"}.
                  </span>
                  <span className="hidden sm:inline">
                    Tip: Open a course to view lessons and track sessions.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((c) => (
                    <Link
                      key={c.id}
                      href={`/courses/${c.id}`}
                      className="group rounded-3xl border border-black/10 dark:border-white/10
                                 bg-white dark:bg-zinc-950/40 shadow-sm overflow-hidden
                                 hover:shadow-md hover:-translate-y-0.5 transition"
                    >
                      {/* Image */}
                      <div className="relative h-44 w-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                        {c.image ? (
                          <Image
                            src={c.image}
                            alt={c.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-zinc-400 dark:text-zinc-500 text-sm">
                            No image
                          </div>
                        )}

                        {/* Badges */}
                        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                          <Badge>{prettyEnum(c.type)}</Badge>
                          <Badge>{prettyEnum(c.edLevel)}</Badge>
                          <Badge>Added ✓</Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                          {c.name}
                        </h3>

                        {c.description ? (
                          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                            {c.description}
                          </p>
                        ) : (
                          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            Open this course to see lessons and your progress.
                          </p>
                        )}

                        <div className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
                          Open →
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <FooterPage />
    </main>
  );
}
