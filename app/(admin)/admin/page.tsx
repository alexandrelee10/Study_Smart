// app/(admin)/admin/page.tsx
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import FooterPage from "@/app/components/Footer";
import { prisma } from "@/app/lib/prisma";

import owl from "@/public/owl.png";

import studySession from "@/public/assets/admin/dash/study-session.jpg"
import courses from "@/public/assets/admin/dash/courses.png"
import calendarImg from "@/public/assets/admin/dash/calendar-image.png"

export const metadata = { title: "Admin" };

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfWeek(d: Date) {
  const x = startOfDay(d);
  const day = x.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  x.setDate(x.getDate() + diff);
  return x;
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signin");

  const role = (session.user as any)?.role as string | undefined;
  if (role !== "ADMIN") redirect("/dashboard");

  const username =
    session.user.name ||
    (session.user.email ? session.user.email.split("@")[0] : "Admin");

  const now = new Date();
  const weekStart = startOfWeek(now);

  const totalCourses = await prisma.course.count();
  const totalLessons = await prisma.lesson.count();
  const totalEnrollments = await prisma.enrollment.count();

  const newEnrollmentsThisWeek = await prisma.enrollment.count({
    where: { createdAt: { gte: weekStart } },
  });

  const recentLessons = await prisma.lesson.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      courseId: true,
      isPublished: true,
      isPreview: true,
      createdAt: true,
      course: { select: { name: true } },
    },
  });

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-10 pt-24 pb-12">
        {/* Hero banner */}
        <section
          className="
            relative overflow-hidden rounded-3xl
            border border-black/10 dark:border-white/10
            bg-white dark:bg-zinc-900/50
            shadow-sm
          "
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-sky-500/5 to-transparent dark:from-blue-500/10 dark:via-sky-400/5" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="relative p-6 sm:p-10 flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl">
                <Image
                  src={owl}
                  alt="StudySmart"
                  fill
                  className="object-cover"
                  sizes="64px"
                  priority
                />
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-100">
                  Admin Panel
                </h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  Welcome, {username}. Manage courses, lessons, and content visibility.
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <AdminActionCard
            href="/admin/courses"
            icon={courses}
            tone="green"
            label="Manage Courses"
          />
          <AdminActionCard
            href="/admin/lessons"
            icon={studySession}
            tone="orange"
            label="Manage Lessons"
          />
          <AdminActionCard
            href="/admin/analytics"
            icon={calendarImg}
            tone="purple"
            label="Analytics (Soon)"
            disabled
          />
        </section>

        {/* Stats strip */}
        <section
          className="
            mt-6 rounded-3xl
            border border-black/10 dark:border-white/10
            bg-white dark:bg-zinc-900/50
            shadow-sm overflow-hidden
          "
        >
          <div className="grid grid-cols-1 md:grid-cols-4">
            <StatCard label="Total Courses" value={`${totalCourses}`} hint="All courses" />
            <StatCard label="Total Lessons" value={`${totalLessons}`} hint="Published + draft" />
            <StatCard label="Total Enrollments" value={`${totalEnrollments}`} hint="All users" />
            <StatCard
              label="New This Week"
              value={`${newEnrollmentsThisWeek}`}
              hint="Enrollments"
            />
          </div>
        </section>

        {/* Main grid */}
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Recent lessons */}
          <div className="lg:col-span-2 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-blue-600/10 to-transparent dark:from-blue-500/10">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Recent Lessons
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Quick access to the most recently created lessons.
              </p>
            </div>

            <div className="p-6 space-y-3">
              {recentLessons.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No lessons yet. Create some to populate your courses.
                </p>
              ) : (
                recentLessons.map((l) => (
                  <Link
                    key={l.id}
                    href={`/courses/${l.courseId}/lessons/${l.id}`}
                    className="block rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3
                               hover:bg-black/5 dark:hover:bg-white/10 transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {l.name}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 truncate">
                          {l.course?.name ?? "Course"}
                          {l.isPreview ? " • Preview" : ""}
                          {l.isPublished ? "" : " • Draft"}
                        </p>
                      </div>
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        Open →
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div className="p-6 pt-0 flex items-center gap-3">
              <Link
                href="/admin/lessons"
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium
                           bg-zinc-900 text-white hover:bg-zinc-800
                           dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
              >
                Manage lessons
              </Link>
              <Link
                href="/admin/courses"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Manage courses →
              </Link>
            </div>
          </div>

          {/* Right: Shortcuts */}
          <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-violet-600/10 to-transparent dark:from-violet-500/10">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Admin Shortcuts
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Jump to common tasks.
              </p>
            </div>

            <div className="p-6 space-y-3">
              <ShortcutRow title="Manage Courses" href="/admin/courses" />
              <ShortcutRow title="Manage Lessons" href="/admin/lessons" />
              <ShortcutRow title="Enrollments (Soon)" href="/admin/enrollments" disabled />
              <ShortcutRow title="Analytics (Soon)" href="/admin/analytics" disabled />
            </div>

            <div className="p-6 pt-0">
              <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4 dark:bg-white/5">
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  Tip: Make Lesson 1 a <span className="font-semibold">Preview</span> to
                  let users sample before enrolling.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom banner */}
        <section
          className="
            mt-8 rounded-3xl overflow-hidden
            border border-black/10 dark:border-white/10
            bg-white dark:bg-zinc-900/50
            shadow-sm relative
          "
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/15 via-pink-500/10 to-blue-500/10 dark:from-orange-400/15 dark:via-pink-400/10 dark:to-blue-400/10" />
          <div className="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Build your content library
              </h3>
              <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                Two solid lessons per course is a great start. Iterate weekly.
              </p>
            </div>

            <Link
              href="/admin/courses"
              className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium
                         bg-zinc-900 text-white hover:bg-zinc-800
                         dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
            >
              Go to Courses Admin
            </Link>
          </div>
        </section>
      </div>

      <FooterPage />
    </main>
  );
}

/* ---------- UI helpers ---------- */

function AdminActionCard({
  href,
  icon,
  tone,
  label,
  disabled,
}: {
  href: string;
  icon: StaticImageData;
  tone: "orange" | "green" | "purple";
  label: string;
  disabled?: boolean;
}) {
  const toneBg =
    tone === "orange"
      ? "bg-orange-50 dark:bg-orange-500/5"
      : tone === "green"
      ? "bg-emerald-50 dark:bg-emerald-500/5"
      : "bg-violet-50 dark:bg-violet-500/5";

  const card = (
    <div
      className={[
        "rounded-3xl overflow-hidden",
        "border border-black/10 dark:border-white/10",
        "bg-white dark:bg-zinc-900",
        "shadow-sm",
        disabled
          ? "opacity-60 cursor-not-allowed"
          : "hover:shadow-md hover:-translate-y-0.5 transition",
      ].join(" ")}
    >
      {/* IMAGE AREA */}
      <div className={`h-[180px] w-full flex items-center justify-center ${toneBg}`}>
        <div className="relative w-full h-full p-6 bg-white">
          <Image
            src={icon}
            alt=""
            fill
            className="object-contain"
            sizes="(max-width:768px) 100vw, 33vw"
            priority
          />
        </div>
      </div>

      {/* TEXT AREA */}
      <div className="px-5 py-4 text-center border-t border-black/10 dark:border-white/10">
        <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {label}
        </p>

        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {disabled ? "Coming soon" : "Open"}
        </p>
      </div>
    </div>
  );

  return disabled ? card : <Link href={href}>{card}</Link>;
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div
      className="
        relative p-6
        border-t md:border-t-0 md:border-l first:border-l-0
        border-black/10 dark:border-white/10
        bg-white/60 dark:bg-white/[0.03]
        backdrop-blur
        transition
        hover:bg-white dark:hover:bg-white/[0.06]
      "
    >
      {/* subtle glow */}
      <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-transparent" />
      </div>

      <p className="text-xs font-medium tracking-wide uppercase text-zinc-500 dark:text-zinc-400">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        {value}
      </p>

      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
    </div>
  );
}

function ShortcutRow({
  title,
  href,
  disabled,
}: {
  title: string;
  href: string;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <div className="rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3 opacity-60">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {title}
        </p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Coming soon</p>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="block rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3
                 hover:bg-black/5 dark:hover:bg-white/10 transition"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
          {title}
        </p>
        <span className="text-xs text-blue-600 dark:text-blue-400">→</span>
      </div>
    </Link>
  );
}