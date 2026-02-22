import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/require-admin";
import ChartsClient, { type AnalyticsPoint } from "./ChartsClient";

import owl from "@/public/owl.png";

export const metadata = { title: "Analytics" };

/* ---------- date helpers ---------- */

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function fmtDate(d: Date) {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function dayKey(d: Date) {
  const x = startOfDay(d);
  // Use local day keys to match how users perceive days
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const day = String(x.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* ---------- page ---------- */

export default async function AdminAnalyticsPage() {
  await requireAdmin();

  const now = new Date();
  const todayStart = startOfDay(now);
  const last7Start = addDays(todayStart, -7);
  const last30Start = addDays(todayStart, -30);

  // --- KPI counts ---
  const [
    totalUsers,
    newUsers7,
    newUsers30,
    totalCourses,
    totalLessons,
    publishedLessons,
    previewLessons,
    totalEnrollments,
    newEnrollments7,
    newEnrollments30,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: last7Start } } }).catch(() => 0),
    prisma.user.count({ where: { createdAt: { gte: last30Start } } }).catch(() => 0),

    prisma.course.count(),
    prisma.lesson.count(),
    prisma.lesson.count({ where: { isPublished: true } }),
    prisma.lesson.count({ where: { isPreview: true } }).catch(() => 0),

    prisma.enrollment.count(),
    prisma.enrollment.count({ where: { createdAt: { gte: last7Start } } }),
    prisma.enrollment.count({ where: { createdAt: { gte: last30Start } } }),
  ]);

  const publishedPct = totalLessons ? Math.round((publishedLessons / totalLessons) * 100) : 0;

  // --- Top courses by enrollments ---
  const topCoursesByEnroll = await prisma.course.findMany({
    take: 10,
    orderBy: { enrollments: { _count: "desc" } },
    select: {
      id: true,
      name: true,
      code: true,
      _count: { select: { enrollments: true } },
    },
  });

  // --- Top courses by study minutes ---
  const topByMinutesAgg = await prisma.studySession.groupBy({
    by: ["courseId"],
    _sum: { durationMin: true },
    orderBy: { _sum: { durationMin: "desc" } },
    take: 10,
  } as const);

  const isString = (v: unknown): v is string => typeof v === "string" && v.length > 0;

  const courseIds = topByMinutesAgg.map((x) => x.courseId).filter(isString);

  const coursesForMinutes = await prisma.course.findMany({
    where: { id: { in: courseIds } },
    select: { id: true, name: true, code: true },
  });

  const courseMap = new Map(coursesForMinutes.map((c) => [c.id, c]));

  const topCoursesByMinutes = topByMinutesAgg
    .filter((row): row is typeof row & { courseId: string } => isString(row.courseId))
    .map((row) => ({
      courseId: row.courseId,
      minutes: row._sum.durationMin ?? 0,
      course: courseMap.get(row.courseId),
    }));

  // --- Recent enrollments ---
  const recentEnrollments = await prisma.enrollment.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      user: { select: { id: true, email: true, username: true } },
      course: { select: { id: true, name: true, code: true } },
    },
  });

  // --- Recent lessons ---
  const recentLessons = await prisma.lesson.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      createdAt: true,
      isPublished: true,
      isPreview: true,
      course: { select: { id: true, name: true, code: true } },
    },
  });

  /* ------------------- CHART DATA (last 14 days) ------------------- */

  const chartStart = addDays(todayStart, -13); // 14 days including today

  const [users14, enrollments14, study14] = await Promise.all([
    prisma.user.findMany({
      where: { createdAt: { gte: chartStart } },
      select: { createdAt: true },
    }),
    prisma.enrollment.findMany({
      where: { createdAt: { gte: chartStart } },
      select: { createdAt: true },
    }),
    prisma.studySession.findMany({
      where: { startedAt: { gte: chartStart } },
      select: { startedAt: true, durationMin: true },
    }),
  ]);

  // init buckets for each day
  const buckets = new Map<string, AnalyticsPoint>();
  for (let i = 0; i < 14; i++) {
    const d = addDays(chartStart, i);
    const key = dayKey(d);
    buckets.set(key, {
      date: fmtDate(d),
      users: 0,
      enrollments: 0,
      studyMinutes: 0,
    });
  }

  for (const u of users14) {
    const key = dayKey(u.createdAt);
    const b = buckets.get(key);
    if (b) b.users += 1;
  }

  for (const e of enrollments14) {
    const key = dayKey(e.createdAt);
    const b = buckets.get(key);
    if (b) b.enrollments += 1;
  }

  for (const s of study14) {
    const key = dayKey(s.startedAt);
    const b = buckets.get(key);
    if (b) b.studyMinutes += s.durationMin ?? 0;
  }

  const chartData = Array.from(buckets.values());

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-10 pt-24 pb-12">
        {/* Hero */}
        <section
          className="
            relative overflow-hidden rounded-3xl
            border border-black/10 dark:border-white/10
            bg-white dark:bg-zinc-900/50
            shadow-sm
          "
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-sky-500/5 to-transparent dark:from-emerald-400/10 dark:via-sky-400/5" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="relative p-6 sm:p-10 flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl">
                <Image src={owl} alt="StudySmart" fill className="object-cover" sizes="64px" priority />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-100">
                  Analytics
                </h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  Quick KPIs + activity snapshots — now with charts.
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/admin/courses"
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium
                           bg-zinc-900 text-white hover:bg-zinc-800
                           dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
              >
                Manage courses
              </Link>
            </div>
          </div>
        </section>

        {/* KPI Grid */}
        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Users" value={`${totalUsers}`} sub={`+${newUsers7} (7d) • +${newUsers30} (30d)`} tone="emerald" />
          <KpiCard title="Enrollments" value={`${totalEnrollments}`} sub={`+${newEnrollments7} (7d) • +${newEnrollments30} (30d)`} tone="blue" />
          <KpiCard title="Courses" value={`${totalCourses}`} sub="Total published catalog" tone="violet" />
          <KpiCard title="Lessons" value={`${totalLessons}`} sub={`${publishedPct}% published • ${previewLessons} preview`} tone="orange" />
        </section>

        {/* ✅ CHARTS (NEW) */}
        <ChartsClient data={chartData} />

        {/* Top tables */}
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-emerald-600/10 to-transparent dark:from-emerald-500/10">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Top Courses by Enrollments
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Which courses are getting picked most.
              </p>
            </div>

            <div className="p-6">
              {topCoursesByEnroll.length === 0 ? (
                <EmptyNote text="No enrollment data yet." />
              ) : (
                <div className="space-y-2">
                  {topCoursesByEnroll.map((c, idx) => (
                    <RowLink
                      key={c.id}
                      href={`/admin/courses/${c.id}/edit`}
                      left={`${idx + 1}. ${c.name}`}
                      right={`${c._count.enrollments}`}
                      meta={c.code ?? ""}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-sky-600/10 to-transparent dark:from-sky-500/10">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Top Courses by Study Minutes
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Based on StudySession.durationMin totals.
              </p>
            </div>

            <div className="p-6">
              {topCoursesByMinutes.length === 0 ? (
                <EmptyNote text="No study sessions yet." />
              ) : (
                <div className="space-y-2">
                  {topCoursesByMinutes.map((row, idx) => (
                    <RowLink
                      key={row.courseId}
                      href={row.course?.id ? `/admin/courses/${row.course.id}/edit` : "/admin/courses"}
                      left={`${idx + 1}. ${row.course?.name ?? "Unknown course"}`}
                      right={`${row.minutes}m`}
                      meta={row.course?.code ?? ""}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Recent activity */}
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-violet-600/10 to-transparent dark:from-violet-500/10">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Recent Enrollments
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Latest users adding courses.
              </p>
            </div>

            <div className="p-6">
              {recentEnrollments.length === 0 ? (
                <EmptyNote text="No enrollments yet." />
              ) : (
                <div className="space-y-2">
                  {recentEnrollments.map((e) => (
                    <div
                      key={e.id}
                      className="rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3
                                 bg-white/60 dark:bg-white/5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                            {e.course.name}{" "}
                            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                              {e.course.code ? `• ${e.course.code}` : ""}
                            </span>
                          </p>
                          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 truncate">
                            {e.user.username ?? e.user.email} • {fmtDate(e.createdAt)}
                          </p>
                        </div>

                        <Link
                          href={`/admin/courses/${e.course.id}/edit`}
                          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Open →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-orange-600/10 to-transparent dark:from-orange-500/10">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Recent Lessons
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                New lesson creation activity.
              </p>
            </div>

            <div className="p-6">
              {recentLessons.length === 0 ? (
                <EmptyNote text="No lessons yet." />
              ) : (
                <div className="space-y-2">
                  {recentLessons.map((l) => (
                    <Link
                      key={l.id}
                      href={`/courses/${l.course.id}/lessons/${l.id}`}
                      className="block rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3
                                 hover:bg-black/5 dark:hover:bg-white/10 transition"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                            {l.name}
                          </p>
                          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 truncate">
                            {l.course.name}
                            {l.isPreview ? " • Preview" : ""}
                            {l.isPublished ? "" : " • Draft"}
                            {" • "}
                            {fmtDate(l.createdAt)}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          Open →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ---------- UI bits ---------- */

function KpiCard({
  title,
  value,
  sub,
  tone,
}: {
  title: string;
  value: string;
  sub: string;
  tone: "emerald" | "blue" | "violet" | "orange";
}) {
  const toneBg =
    tone === "emerald"
      ? "from-emerald-500/16 via-emerald-400/10 to-transparent dark:from-emerald-400/14"
      : tone === "blue"
      ? "from-sky-500/16 via-sky-400/10 to-transparent dark:from-sky-400/14"
      : tone === "violet"
      ? "from-violet-500/16 via-violet-400/10 to-transparent dark:from-violet-400/14"
      : "from-orange-500/16 via-orange-400/10 to-transparent dark:from-orange-400/14";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm">
      <div className={`absolute inset-0 bg-gradient-to-br ${toneBg}`} />
      <div className="relative p-6">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-100">{value}</p>
        <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{sub}</p>
      </div>
    </div>
  );
}

function RowLink({
  href,
  left,
  right,
  meta,
}: {
  href: string;
  left: string;
  right: string;
  meta?: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3 hover:bg-black/5 dark:hover:bg-white/10 transition"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{left}</p>
          {meta ? <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 truncate">{meta}</p> : null}
        </div>
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{right}</div>
      </div>
    </Link>
  );
}

function EmptyNote({ text }: { text: string }) {
  return <p className="text-sm text-zinc-500 dark:text-zinc-400">{text}</p>;
}