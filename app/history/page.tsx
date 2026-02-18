import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prisma";
import FooterPage from "../components/Footer";

export const metadata = { title: "Study Smart | History" };

/* ---------- helpers ---------- */

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function toISODate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function formatMinutes(totalMin: number) {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h <= 0) return `${m}m`;
  return `${h}h ${m}m`;
}

function formatWhen(d: Date) {
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/* ---------- page ---------- */

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ courseId?: string; from?: string; to?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signin");

  const userId = (session.user as any).id as string;
  if (!userId) redirect("/signin");

  const { courseId, from, to } = await searchParams;

  // Build date filters (optional)
  const whereDate: { gte?: Date; lte?: Date } = {};
  if (from) whereDate.gte = startOfDay(new Date(from));
  if (to) whereDate.lte = endOfDay(new Date(to));

  const where: any = { userId };
  if (courseId && courseId !== "all") where.courseId = courseId;
  if (from || to) where.startedAt = whereDate;

  // For filter dropdown: show enrolled courses
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: { course: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
  const courses = enrollments.map((e) => e.course);

  // Fetch sessions (recent first)
  const sessions = await prisma.studySession.findMany({
    where,
    orderBy: { startedAt: "desc" },
    take: 100,
    include: { course: { select: { id: true, name: true } } },
  });

  // Summary
  const totalMin = sessions.reduce((sum, s) => sum + (s.durationMin ?? 0), 0);

  const today = new Date();
  const defaultFrom = toISODate(new Date(today.getFullYear(), today.getMonth(), 1));
  const defaultTo = toISODate(today);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-10 pt-24 pb-12">
        {/* Top row */}
        <div className="mb-5 flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to dashboard
          </Link>

          <Link
            href="/study"
            className="rounded-xl px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Start session
          </Link>
        </div>

        {/* Header */}
        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-zinc-900/5 to-transparent dark:from-white/5">
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Study History
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Review your sessions, totals, and progress over time.
            </p>
          </div>

          {/* Filters */}
          <div className="p-6">
            <form className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Course
                </label>
                <select
                  name="courseId"
                  defaultValue={courseId ?? "all"}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800
                             bg-white dark:bg-zinc-950 px-3 py-3 text-sm text-zinc-900 dark:text-zinc-100
                             outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
                >
                  <option value="all">All courses</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  From
                </label>
                <input
                  type="date"
                  name="from"
                  defaultValue={from ?? defaultFrom}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800
                             bg-white dark:bg-zinc-950 px-3 py-3 text-sm text-zinc-900 dark:text-zinc-100
                             outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  To
                </label>
                <input
                  type="date"
                  name="to"
                  defaultValue={to ?? defaultTo}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800
                             bg-white dark:bg-zinc-950 px-3 py-3 text-sm text-zinc-900 dark:text-zinc-100
                             outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
                />
              </div>

              <div className="md:col-span-4 flex items-center gap-3 mt-2">
                <button
                  type="submit"
                  className="rounded-2xl px-5 py-3 text-sm font-medium
                             bg-zinc-900 text-white hover:bg-zinc-800
                             dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
                >
                  Apply filters
                </button>

                <Link
                  href="/history"
                  className="rounded-2xl px-5 py-3 text-sm font-medium
                             border border-zinc-200 dark:border-zinc-800
                             hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
                >
                  Reset
                </Link>

                <div className="ml-auto text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {sessions.length}
                  </span>{" "}
                  sessions •{" "}
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {formatMinutes(totalMin)}
                  </span>{" "}
                  total
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="mt-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-black/10 dark:border-white/10">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Recent Sessions
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Showing up to 100 sessions.
            </p>
          </div>

          <div className="p-6">
            {sessions.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 text-sm text-zinc-600 dark:text-zinc-400">
                No sessions found for these filters. Try widening the date range.
              </div>
            ) : (
              <ul className="space-y-3">
                {sessions.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-950 transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {s.course?.name ?? "General"}{" "}
                          <span className="text-zinc-400">•</span>{" "}
                          {s.durationMin} min
                        </p>

                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                          {formatWhen(s.startedAt)}
                        </p>

                        {s.notes?.trim() ? (
                          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">
                            {s.notes}
                          </p>
                        ) : null}
                      </div>

                      <div className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                        {s.endedAt ? "Saved" : "Logged"}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <FooterPage />
    </main>
  );
}
