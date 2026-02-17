// app/dashboard/page.tsx (or wherever your DashboardPage lives)

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import FooterPage from "../components/Footer";
import { prisma } from "@/app/lib/prisma";

import owl from "@/public/owl.png";

import studySessionIcon from "@/public/assets/dashboard/study_session.png";
import coursesIcon from "@/public/assets/dashboard/courses.png";
import calendarIcon from "@/public/assets/dashboard/calendar.png";

export const metadata = { title: "Study Smart | Dashboard" };

/* ---------- date/helpers (server safe) ---------- */

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfWeek(d: Date) {
  // Monday start
  const x = startOfDay(d);
  const day = x.getDay(); // 0=Sun
  const diff = (day === 0 ? -6 : 1) - day;
  x.setDate(x.getDate() + diff);
  return x;
}

function formatMinutes(totalMin: number) {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

function formatRelativeDay(date: Date) {
  const now = new Date();
  const today = startOfDay(now).getTime();
  const that = startOfDay(date).getTime();
  const diffDays = Math.round((today - that) / (24 * 60 * 60 * 1000));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString();
}

function calcStreak(uniqueDaysDesc: Date[], now = new Date()) {
  const today = startOfDay(now).getTime();
  let streak = 0;
  let expected = today;

  for (const d of uniqueDaysDesc) {
    const t = startOfDay(d).getTime();
    if (t === expected) {
      streak += 1;
      expected -= 24 * 60 * 60 * 1000;
    } else if (t < expected) {
      break;
    }
  }
  return streak;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signin");

  // IMPORTANT: your NextAuth session must include user.id
  const userId = (session.user as any).id as string;
  if (!userId) redirect("/signin");

  const username =
    session.user.name ||
    (session.user.email ? session.user.email.split("@")[0] : "Student");

  const avatar = session.user.image || "/avatar-placeholder.png";

  const now = new Date();
  const weekStart = startOfWeek(now);
  const todayStart = startOfDay(now);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  // Courses Enrolled
  const coursesEnrolled = await prisma.enrollment.count({
    where: { userId },
  });

  // This Week total minutes
  const weekAgg = await prisma.studySession.aggregate({
    where: { userId, startedAt: { gte: weekStart } },
    _sum: { durationMin: true },
  });
  const thisWeekMin = weekAgg._sum.durationMin ?? 0;

  // Recent Activity (last 3)
  const recentSessions = await prisma.studySession.findMany({
    where: { userId },
    orderBy: { startedAt: "desc" },
    take: 3,
    include: { course: true },
  });

  // Today's plan
  const todaysPlan = await prisma.planItem.findMany({
    where: { userId, date: { gte: todayStart, lt: tomorrowStart } },
    orderBy: { order: "asc" },
  });

  // Streak (unique days with sessions)
  const streakSessions = await prisma.studySession.findMany({
    where: { userId },
    orderBy: { startedAt: "desc" },
    take: 180,
    select: { startedAt: true },
  });

  const dayMap = new Map<number, Date>();
  for (const s of streakSessions) {
    const k = startOfDay(s.startedAt).getTime();
    if (!dayMap.has(k)) dayMap.set(k, startOfDay(s.startedAt));
  }
  const uniqueDaysDesc = Array.from(dayMap.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([, d]) => d);

  const streakDays = calcStreak(uniqueDaysDesc, now);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-10 pt-24 pb-12">
        {/* Hero banner (mock-style layout, keeps your colors) */}
        <section
          className="
            relative overflow-hidden rounded-3xl
            border border-black/10 dark:border-white/10
            bg-white dark:bg-zinc-900/50
            shadow-sm
          "
        >
          {/* Color Overlays */}
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
                  Welcome back, {username}
                </h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  Track your progress, stay consistent, and keep your streak alive.
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
            </div>
          </div>
        </section>

        {/* Quick actions (big image cards like the mock) */}
        <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionCard href="/study" icon={studySessionIcon} tone="orange" />
          <ActionCard href="/courses" icon={coursesIcon} tone="green" />
          <ActionCard href="/calendar" icon={calendarIcon} tone="purple" />
        </section>

        {/* Stats strip (mock-style bar) */}
        <section
          className="
            mt-6 rounded-3xl
            border border-black/10 dark:border-white/10
            bg-white dark:bg-zinc-900/50
            shadow-sm overflow-hidden
          "
        >
          <div className="grid grid-cols-1 md:grid-cols-3">
            <StatCard
              label="Current Streak"
              value={`${streakDays} day${streakDays === 1 ? "" : "s"}`}
              hint="Keep it going!"
            />
            <StatCard
              label="This Week"
              value={formatMinutes(thisWeekMin)}
              hint="Total study time"
            />
            <StatCard
              label="Courses Enrolled"
              value={`${coursesEnrolled}`}
              hint="Active courses"
            />
          </div>
        </section>

        {/* Main grid */}
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Today plan */}
          <div className="lg:col-span-2 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-blue-600/10 to-transparent dark:from-blue-500/10">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Today’s Plan
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                A simple checklist to keep you moving.
              </p>
            </div>

            <div className="p-6 space-y-3">
              {todaysPlan.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No plan yet for today. Add a few tasks to get momentum.
                </p>
              ) : (
                todaysPlan.map((item) => (
                  <ChecklistItem key={item.id} title={item.title} done={item.done} />
                ))
              )}
            </div>

            <div className="p-6 pt-0">
              <Link
                href="/goals"
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium
                           bg-zinc-900 text-white hover:bg-zinc-800
                           dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
              >
                Edit today’s plan
              </Link>
            </div>
          </div>

          {/* Right: Recent activity */}
          <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-violet-600/10 to-transparent dark:from-violet-500/10">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Recent Activity
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Your latest study sessions.
              </p>
            </div>

            <div className="p-6 space-y-4">
              {recentSessions.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No sessions yet. Start one to see your activity here.
                </p>
              ) : (
                recentSessions.map((s) => (
                  <ActivityRow
                    key={s.id}
                    title={`${s.course?.name ?? "General"} — ${
                      s.notes?.trim()
                        ? s.notes.trim().slice(0, 40) + (s.notes.trim().length > 40 ? "…" : "")
                        : "Study session"
                    }`}
                    meta={`${s.durationMin} min • ${formatRelativeDay(s.startedAt)}`}
                  />
                ))
              )}
            </div>

            <div className="p-6 pt-0">
              <Link
                href="/history"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                View full history →
              </Link>
            </div>
          </div>
        </section>

        {/* Bottom: Motivation banner (mock-style) */}
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
                Keep the momentum
              </h3>
              <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                Small wins stack up. Show up today, even if it’s just 10 minutes.
              </p>
            </div>

            <Link
              href="/study"
              className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium
                         bg-zinc-900 text-white hover:bg-zinc-800
                         dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
            >
              Start a quick session
            </Link>
          </div>
        </section>
      </div>

      <FooterPage />
    </main>
  );
}

/* ---------- UI helpers ---------- */

function ActionCard({
  href,
  icon,
  tone,
}: {
  href: string;
  icon: StaticImageData;
  tone: "orange" | "green" | "purple";
}) {
  const toneBg =
    tone === "orange"
      ? "from-orange-500/18 via-orange-400/10 to-transparent dark:from-orange-400/16"
      : tone === "green"
      ? "from-emerald-500/18 via-emerald-400/10 to-transparent dark:from-emerald-400/16"
      : "from-violet-500/18 via-violet-400/10 to-transparent dark:from-violet-400/16";

  return (
    <Link
      href={href}
      className="
        relative h-[220px] w-full
        rounded-3xl overflow-hidden
        border border-black/10 dark:border-white/10
        bg-white dark:bg-zinc-900/50
        shadow-sm
        hover:shadow-md hover:-translate-y-0.5
        transition
        group
      "
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${toneBg}`} />
      <div className="absolute inset-0 p-3">
        <Image
          src={icon}
          alt=""
          fill
          className="object-contain transition group-hover:scale-105"
          sizes="(max-width:1068px) 400vw, 43vw"
          priority
        />
      </div>
    </Link>
  );
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
    <div className="p-6 border-t md:border-t-0 md:border-l first:border-l-0 border-black/10 dark:border-white/10">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        {value}
      </p>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
    </div>
  );
}

function ChecklistItem({ title, done = false }: { title: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={[
          "h-5 w-5 rounded-md border flex items-center justify-center",
          done
            ? "bg-blue-600 border-blue-600 text-white"
            : "border-black/20 dark:border-white/20",
        ].join(" ")}
      >
        {done ? "✓" : ""}
      </div>
      <p
        className={[
          "text-sm",
          done
            ? "text-zinc-500 dark:text-zinc-400 line-through"
            : "text-zinc-800 dark:text-zinc-200",
        ].join(" ")}
      >
        {title}
      </p>
    </div>
  );
}

function ActivityRow({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
          {title}
        </p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{meta}</p>
      </div>
      <span className="text-xs text-zinc-400">•</span>
    </div>
  );
}
