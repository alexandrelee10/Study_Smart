"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from "recharts";

export type AnalyticsPoint = {
  date: string; // "Feb 22"
  users: number;
  enrollments: number;
  studyMinutes: number;
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-700 dark:text-zinc-200">
      {children}
    </span>
  );
}

function Card({
  title,
  subtitle,
  tone,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  tone: "emerald" | "sky" | "violet";
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  const toneBg =
    tone === "emerald"
      ? "from-emerald-500/14 via-emerald-400/8 to-transparent dark:from-emerald-400/12"
      : tone === "sky"
      ? "from-sky-500/14 via-sky-400/8 to-transparent dark:from-sky-400/12"
      : "from-violet-500/14 via-violet-400/8 to-transparent dark:from-violet-400/12";

  const toneBlob =
    tone === "emerald"
      ? "bg-emerald-500/10"
      : tone === "sky"
      ? "bg-sky-500/10"
      : "bg-violet-500/10";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm">
      {/* soft gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${toneBg}`} />
      {/* blobs */}
      <div className={`absolute -right-24 -top-24 h-72 w-72 rounded-full ${toneBlob} blur-3xl`} />
      <div className="absolute -left-28 -bottom-28 h-72 w-72 rounded-full bg-blue-500/8 blur-3xl" />

      <div className="relative p-6 border-b border-black/10 dark:border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {title}
            </h3>
            {subtitle ? (
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {subtitle}
              </p>
            ) : null}
          </div>

          {right ? <div className="shrink-0">{right}</div> : null}
        </div>
      </div>

      <div className="relative p-6">{children}</div>
    </div>
  );
}

function NiceTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-xs shadow-lg dark:border-white/10 dark:bg-zinc-950">
      <div className="font-semibold text-zinc-900 dark:text-zinc-100">{label}</div>
      <div className="mt-2 space-y-1.5">
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: p.color }}
              />
              <span className="text-zinc-600 dark:text-zinc-300">{p.name}</span>
            </div>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6">
      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        No chart data yet
      </p>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Once users start enrolling and logging sessions, you’ll see trends here.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Pill>Tip: add seed enrollments</Pill>
        <Pill>Tip: log StudySessions</Pill>
      </div>
    </div>
  );
}

export default function ChartsClient({ data }: { data: AnalyticsPoint[] }) {
  const hasAny =
    Array.isArray(data) &&
    data.some((d) => (d.users ?? 0) > 0 || (d.enrollments ?? 0) > 0 || (d.studyMinutes ?? 0) > 0);

  // Color palette (clean “middle brightness”, not too dark)
  const C = {
    users: "#22c55e", // green
    enrollments: "#3b82f6", // blue
    minutes: "#a855f7", // violet
    grid: "rgba(0,0,0,0.08)",
  };

  return (
    <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Users + Enrollments */}
      <Card
        title="Users & Enrollments"
        subtitle="Last 14 days (daily totals)"
        tone="emerald"
        right={<Pill>Trend</Pill>}
      >
        {!hasAny ? (
          <EmptyState />
        ) : (
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke={C.grid} />
                <XAxis
                  dataKey="date"
                  tickMargin={10}
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<NiceTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12 }}
                  iconType="circle"
                />

                <Line
                  type="monotone"
                  dataKey="users"
                  name="New Users"
                  stroke={C.users}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="enrollments"
                  name="New Enrollments"
                  stroke={C.enrollments}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* tiny footer chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Pill>Auto-updates from DB</Pill>
          <Pill>14-day window</Pill>
        </div>
      </Card>

      {/* Study Minutes */}
      <Card
        title="Study Minutes"
        subtitle="Last 14 days (sum of durationMin)"
        tone="violet"
        right={<Pill>Volume</Pill>}
      >
        {!hasAny ? (
          <EmptyState />
        ) : (
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke={C.grid} />
                <XAxis
                  dataKey="date"
                  tickMargin={10}
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<NiceTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />

                <Bar
                  dataKey="studyMinutes"
                  name="Minutes"
                  fill={C.minutes}
                  radius={[14, 14, 14, 14]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Pill>Based on StudySessions</Pill>
          <Pill>durationMin sum</Pill>
        </div>
      </Card>
    </section>
  );
}