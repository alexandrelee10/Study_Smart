"use client";

import * as React from "react";

export type CalendarEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  kind?: "study" | "assignment" | "exam" | "other";
};

export type WeekStart = 0 | 1;

type StudyCalendarProps = {
  events?: CalendarEvent[];
  weekStartsOnDefault?: WeekStart;
  className?: string;
};

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}
function toISODate(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function addMonths(d: Date, delta: number) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}
function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function monthLabel(d: Date) {
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}
function getCalendarGrid(monthDate: Date, weekStartsOn: WeekStart = 0) {
  const start = startOfMonth(monthDate);
  const end = endOfMonth(monthDate);

  const firstDow = start.getDay();
  const offset = (firstDow - weekStartsOn + 7) % 7;

  const gridStart = new Date(start);
  gridStart.setDate(start.getDate() - offset);

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    days.push(d);
  }

  return { days, monthStart: start, monthEnd: end };
}

function kindDotClass(kind?: CalendarEvent["kind"]) {
  switch (kind) {
    case "study":
      return "bg-emerald-500";
    case "assignment":
      return "bg-blue-500";
    case "exam":
      return "bg-rose-500";
    default:
      return "bg-zinc-500";
  }
}

const WEEKDAYS_SUN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_MON = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const demoEvents: CalendarEvent[] = [
  { id: "1", title: "COP2210 — Arrays Practice", date: toISODate(new Date()), kind: "study" },
  { id: "2", title: "Math Quiz Review", date: toISODate(new Date()), kind: "assignment" },
  {
    id: "3",
    title: "Midterm (Practice)",
    date: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 3);
      return toISODate(d);
    })(),
    kind: "exam",
  },
];

export default function StudyCalendar({
  events = demoEvents,
  weekStartsOnDefault = 0,
  className = "",
}: StudyCalendarProps) {
  const [weekStartsOn] = React.useState<WeekStart>(weekStartsOnDefault);

  const today = React.useMemo(() => new Date(), []);
  const [viewMonth, setViewMonth] = React.useState<Date>(startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = React.useState<Date>(new Date());

  const weekdayLabels = weekStartsOn === 1 ? WEEKDAYS_MON : WEEKDAYS_SUN;

  const { days, monthStart, monthEnd } = React.useMemo(
    () => getCalendarGrid(viewMonth, weekStartsOn),
    [viewMonth, weekStartsOn]
  );

  const selectedISO = toISODate(selectedDay);

  const eventsByDate = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const arr = map.get(e.date) ?? [];
      arr.push(e);
      map.set(e.date, arr);
    }
    return map;
  }, [events]);

  const selectedEvents = eventsByDate.get(selectedISO) ?? [];
  const isInCurrentMonth = (d: Date) => d >= monthStart && d <= monthEnd;

  return (
    <section className={`w-full ${className}`}>
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-zinc-950">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMonth((m) => addMonths(m, -1))}
              className="rounded-xl border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              ←
            </button>
            <button
              onClick={() => setViewMonth((m) => addMonths(m, 1))}
              className="rounded-xl border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              →
            </button>

            <div className="ml-2">
              <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {monthLabel(viewMonth)}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Select a day to view tasks/sessions
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setViewMonth(startOfMonth(new Date()));
              setSelectedDay(new Date());
            }}
            className="rounded-xl border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
          >
            Today
          </button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-2 px-1">
          {weekdayLabels.map((w) => (
            <div
              key={w}
              className="text-center text-xs font-medium text-zinc-500 dark:text-zinc-400"
            >
              {w}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((d) => {
            const iso = toISODate(d);
            const inMonth = isInCurrentMonth(d);
            const isToday = isSameDay(d, today);
            const isSelected = isSameDay(d, selectedDay);
            const dayEvents = eventsByDate.get(iso) ?? [];

            return (
              <button
                key={iso}
                onClick={() => setSelectedDay(d)}
                className={[
                  "group flex h-20 flex-col justify-between rounded-2xl border p-2 text-left transition",
                  "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900",
                  !inMonth ? "opacity-50" : "",
                  isSelected ? "ring-2 ring-zinc-900 dark:ring-zinc-100" : "",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={[
                      "text-sm font-semibold",
                      inMonth ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-500 dark:text-zinc-400",
                    ].join(" ")}
                  >
                    {d.getDate()}
                  </div>

                  {isToday && (
                    <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-[10px] text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
                      today
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {dayEvents.slice(0, 4).map((e) => (
                    <span
                      key={e.id}
                      className={["h-2 w-2 rounded-full", kindDotClass(e.kind)].join(" ")}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Optional: Selected day list (kept minimal) */}
        {selectedEvents.length > 0 && (
          <div className="rounded-2xl border border-zinc-200 p-3 text-sm dark:border-zinc-800">
            <div className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
              {selectedDay.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
            </div>
            <ul className="space-y-2">
              {selectedEvents.map((e) => (
                <li key={e.id} className="flex items-center gap-2">
                  <span className={["h-2.5 w-2.5 rounded-full", kindDotClass(e.kind)].join(" ")} />
                  <span className="text-zinc-800 dark:text-zinc-200">{e.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
