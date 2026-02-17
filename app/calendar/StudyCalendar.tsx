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

  /**
   * Optional: persist new events to a parent component / DB.
   * If not provided, events are stored in local state only.
   */
  onAddEvent?: (event: CalendarEvent) => void;
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

function kindBadgeClass(kind?: CalendarEvent["kind"]) {
  switch (kind) {
    case "study":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200";
    case "assignment":
      return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200";
    case "exam":
      return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200";
    default:
      return "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200";
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

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function StudyCalendar({
  events = demoEvents,
  weekStartsOnDefault = 0,
  className = "",
  onAddEvent,
}: StudyCalendarProps) {
  const [weekStartsOn] = React.useState<WeekStart>(weekStartsOnDefault);

  const today = React.useMemo(() => new Date(), []);
  const [viewMonth, setViewMonth] = React.useState<Date>(startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = React.useState<Date>(new Date());

  // ✅ local events state so you can add events in the UI
  const [localEvents, setLocalEvents] = React.useState<CalendarEvent[]>(events);

  // keep local state in sync if parent changes props
  React.useEffect(() => {
    setLocalEvents(events);
  }, [events]);

  // "Add event" UI state
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");
  const [newKind, setNewKind] = React.useState<CalendarEvent["kind"]>("study");

  const weekdayLabels = weekStartsOn === 1 ? WEEKDAYS_MON : WEEKDAYS_SUN;

  const { days, monthStart, monthEnd } = React.useMemo(
    () => getCalendarGrid(viewMonth, weekStartsOn),
    [viewMonth, weekStartsOn]
  );

  const selectedISO = toISODate(selectedDay);

  const eventsByDate = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of localEvents) {
      const arr = map.get(e.date) ?? [];
      arr.push(e);
      map.set(e.date, arr);
    }
    return map;
  }, [localEvents]);

  const selectedEvents = eventsByDate.get(selectedISO) ?? [];
  const isInCurrentMonth = (d: Date) => d >= monthStart && d <= monthEnd;

  function handleAdd() {
    const title = newTitle.trim();
    if (!title) return;

    const created: CalendarEvent = {
      id: uid(),
      title,
      date: selectedISO,
      kind: newKind ?? "other",
    };

    setLocalEvents((prev) => [created, ...prev]);
    onAddEvent?.(created);

    setNewTitle("");
    setNewKind("study");
    setIsAddOpen(false);
  }

  function handleDelete(id: string) {
    setLocalEvents((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <section className={`w-full ${className}`}>
      <div
        className="
          rounded-3xl border border-black/10 dark:border-white/10
          bg-white dark:bg-zinc-950
          shadow-sm
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-blue-600/10 to-transparent dark:from-blue-500/10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMonth((m) => addMonths(m, -1))}
                className="rounded-xl border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                aria-label="Previous month"
              >
                ←
              </button>
              <button
                onClick={() => setViewMonth((m) => addMonths(m, 1))}
                className="rounded-xl border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                aria-label="Next month"
              >
                →
              </button>

              <div className="ml-2">
                <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {monthLabel(viewMonth)}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  Pick a day • add events • keep track
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddOpen(true)}
                className="
                  rounded-xl px-3 py-2 text-sm font-medium
                  bg-zinc-900 text-white hover:bg-zinc-800
                  dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200
                  transition
                "
              >
                + Add event
              </button>

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
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
          {/* Calendar */}
          <div>
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
            <div className="mt-2 grid grid-cols-7 gap-2">
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
                      "group relative flex h-24 flex-col justify-between rounded-2xl border p-2 text-left transition",
                      "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900",
                      !inMonth ? "opacity-45" : "",
                      isSelected ? "ring-2 ring-zinc-900 dark:ring-zinc-100" : "",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={[
                          "text-sm font-semibold",
                          inMonth
                            ? "text-zinc-900 dark:text-zinc-50"
                            : "text-zinc-500 dark:text-zinc-400",
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
                      {dayEvents.slice(0, 5).map((e) => (
                        <span
                          key={e.id}
                          className={["h-2 w-2 rounded-full", kindDotClass(e.kind)].join(" ")}
                        />
                      ))}
                      {dayEvents.length > 5 && (
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                          +{dayEvents.length - 5}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right panel: Selected day */}
          <aside
            className="
              rounded-3xl border border-black/10 dark:border-white/10
              bg-white dark:bg-zinc-950
              shadow-sm overflow-hidden
            "
          >
            <div className="p-4 border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-violet-600/10 to-transparent dark:from-violet-500/10">
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Selected day</div>
              <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {selectedDay.toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className={`rounded-full border px-2 py-0.5 ${kindBadgeClass("study")}`}>
                  Study
                </span>
                <span className={`rounded-full border px-2 py-0.5 ${kindBadgeClass("assignment")}`}>
                  Assignment
                </span>
                <span className={`rounded-full border px-2 py-0.5 ${kindBadgeClass("exam")}`}>
                  Exam
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Events
                </div>
                <button
                  onClick={() => setIsAddOpen(true)}
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  + Add
                </button>
              </div>

              {selectedEvents.length === 0 ? (
                <div className="mt-3 rounded-2xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                  No events for this day. Add one to stay on track.
                </div>
              ) : (
                <ul className="mt-3 space-y-2">
                  {selectedEvents.map((e) => (
                    <li
                      key={e.id}
                      className="flex items-start justify-between gap-3 rounded-2xl border border-zinc-200 p-3 dark:border-zinc-800"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={["h-2.5 w-2.5 rounded-full", kindDotClass(e.kind)].join(" ")} />
                          <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                            {e.title}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                          {e.kind ?? "other"}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(e.id)}
                        className="rounded-lg border border-zinc-200 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                        aria-label="Delete event"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>

        {/* Add Event Modal */}
        {isAddOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <button
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsAddOpen(false)}
              aria-label="Close modal"
            />

            <div className="relative w-full max-w-md rounded-3xl border border-black/10 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-zinc-950">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    Add Event
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    For {selectedDay.toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-xl border border-zinc-200 px-2 py-1 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    Title
                  </label>
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. COP2210 — Linked Lists"
                    className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:ring-zinc-100/20"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    Type
                  </label>
                  <select
                    value={newKind}
                    onChange={(e) => setNewKind(e.target.value as CalendarEvent["kind"])}
                    className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:ring-zinc-100/20"
                  >
                    <option value="study">Study</option>
                    <option value="assignment">Assignment</option>
                    <option value="exam">Exam</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsAddOpen(false)}
                    className="rounded-xl border border-zinc-200 px-4 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdd}
                    className="
                      rounded-xl px-4 py-2 text-sm font-medium
                      bg-zinc-900 text-white hover:bg-zinc-800
                      dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200
                      transition
                    "
                  >
                    Add event
                  </button>
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Tip: This version stores new events in local state. If you pass <code>onAddEvent</code>,
                  you can save them to your database.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
