import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import FooterPage from "../components/Footer";

export const metadata = {title: "Study Smart | Dashboard"};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signin");

  const username =
    session.user.name ||
    (session.user.email ? session.user.email.split("@")[0] : "Student");

  const image = session.user.image || "/avatar-placeholder.png";

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-10 pt-24 pb-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-100">
              Welcome back, {username}
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Track your progress, stay consistent, and keep your streak alive.
            </p>
          </div>
        </header>

        {/* Quick actions */}
        <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionCard
            title="Start a Study Session"
            subtitle="Log your time and build your streak."
            href="/study"
            cta="Start"
          />
          <ActionCard
            title="Browse Courses"
            subtitle="Pick a course and set your goals."
            href="/courses"
            cta="View courses"
          />
          <ActionCard
            title="View Calendar"
            subtitle="Plan your week and stay consistent."
            href="/calendar"
            cta="Open calendar"
          />
        </section>

        {/* Stats row */}
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <StatCard label="Current Streak" value="7 days" hint="Keep it going!" />
          <StatCard label="This Week" value="4h 20m" hint="Total study time" />
          <StatCard label="Courses Enrolled" value="3" hint="Active courses" />
        </section>

        {/* Main grid */}
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Today plan */}
          <div className="lg:col-span-2 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm">
            <div className="p-6 border-b border-black/10 dark:border-white/10">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Today’s Plan
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                A simple checklist to keep you moving.
              </p>
            </div>

            <div className="p-6 space-y-3">
              <ChecklistItem title="Complete 1 Pomodoro (25 min)" done />
              <ChecklistItem title="Review flashcards (10 min)" />
              <ChecklistItem title="Practice problems (30 min)" />
              <ChecklistItem title="Plan tomorrow’s focus" />
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
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm">
            <div className="p-6 border-b border-black/10 dark:border-white/10">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Recent Activity
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Your latest study sessions.
              </p>
            </div>

            <div className="p-6 space-y-4">
              <ActivityRow title="Math — Algebra practice" meta="45 min • Today" />
              <ActivityRow title="CS — Arrays & hashing" meta="30 min • Yesterday" />
              <ActivityRow title="English — Essay outline" meta="25 min • Yesterday" />
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

        {/* Bottom: Motivation */}
        <section className="mt-8 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm">
          <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Keep the momentum
              </h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Small wins stack up. Show up today, even if it’s just 10 minutes.
              </p>
            </div>

            <Link
              href="/study"
              className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium
                         bg-blue-600 text-white hover:bg-blue-700 transition"
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
  title,
  subtitle,
  href,
  cta,
}: {
  title: string;
  subtitle: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="
        rounded-2xl border border-black/10 dark:border-white/10
        bg-white dark:bg-zinc-900/50 shadow-sm
        p-6 hover:shadow-md transition
        group
      "
    >
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
      <div className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
        {cta} →
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
    <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm p-6">
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
      <div>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {title}
        </p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{meta}</p>
      </div>
      <span className="text-xs text-zinc-400">•</span>
    </div>
  );
}
