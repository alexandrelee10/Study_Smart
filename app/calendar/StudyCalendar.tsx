"use client";

import React, { useEffect, useMemo, useState } from "react";

type CalendarEvent = {
  id: string;
  title: string;
  type: string;
  startAt: string; // ISO
  courseId?: string | null;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toLocalInputValue(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function monthLabel(d: Date) {
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}

// 6-row grid starting Sunday
function buildMonthGrid(viewDate: Date) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const first = new Date(year, month, 1);
  const firstDow = first.getDay(); // 0=Sun
  const gridStart = new Date(year, month, 1 - firstDow);

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function CalendarClient() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const monthStart = useMemo(
    () => new Date(viewDate.getFullYear(), viewDate.getMonth(), 1),
    [viewDate]
  );
  const monthEnd = useMemo(
    () => new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1),
    [viewDate]
  );

  // form
  const [title, setTitle] = useState("");
  const [type, setType] = useState("STUDY");
  const [startAt, setStartAt] = useState(() => toLocalInputValue(new Date()));
  const [saving, setSaving] = useState(false);

  const today = useMemo(() => startOfDay(new Date()), []);
  const monthGrid = useMemo(() => buildMonthGrid(viewDate), [viewDate]);

  function dayKey(d: Date) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  const dayCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const ev of events) {
      const d = new Date(ev.startAt);
      map.set(dayKey(d), (map.get(dayKey(d)) ?? 0) + 1);
    }
    return map;
  }, [events]);

  async function load() {
    setLoading(true);
    try {
      const qs = `?from=${monthStart.toISOString()}&to=${monthEnd.toISOString()}`;
      const res = await fetch(`/api/calendar/events${qs}`, { cache: "no-store" });
      const data = await res.json();
      setEvents(Array.isArray(data?.events) ? data.events : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthStart.toISOString(), monthEnd.toISOString()]);

  function onPickDay(d: Date) {
    const current = new Date(startAt);
    if (Number.isNaN(current.getTime())) {
      const x = new Date(d);
      x.setHours(18, 0, 0, 0);
      setStartAt(toLocalInputValue(x));
      return;
    }
    const picked = new Date(d);
    picked.setHours(current.getHours(), current.getMinutes(), 0, 0);
    setStartAt(toLocalInputValue(picked));
  }

  async function addEvent(e: React.FormEvent) {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    setSaving(true);
    try {
      const iso = new Date(startAt).toISOString();
      const res = await fetch("/api/calendar/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: cleanTitle, type, startAt: iso }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err?.error ?? "Failed to create event");
        return;
      }

      setTitle("");
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function removeEvent(id: string) {
    const ok = confirm("Remove this event?");
    if (!ok) return;

    const res = await fetch(`/api/calendar/events/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Failed to delete event");
      return;
    }
    await load();
  }

  const selectedDay = useMemo(() => {
    const d = new Date(startAt);
    return Number.isNaN(d.getTime()) ? null : startOfDay(d);
  }, [startAt]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDay) return [];
    return events
      .filter((ev) => sameDay(new Date(ev.startAt), selectedDay))
      .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
  }, [events, selectedDay]);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-10 pt-24 pb-12">
        <section className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
          {/* Page header */}
          <div className="p-6 border-b border-black/10 dark:border-white/10">
            <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
              Calendar
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Add events, pick dates, and remove them anytime.
            </p>
          </div>

          {/* Calendar card */}
          <div className="p-5 sm:p-6">
            <div className="rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950/40 shadow-sm">
              {/* Month header */}
              <div className="relative p-5 sm:p-6">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/40 via-blue-400/35 to-cyan-300/35 dark:from-indigo-500/30 dark:via-blue-400/25 dark:to-cyan-300/25" />
                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

                <div className="relative flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
                    }
                    className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 text-sm font-semibold
                               text-zinc-800 dark:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/10 transition"
                  >
                    ← Prev
                  </button>

                  <div className="text-center">
                    <p className="text-xs font-semibold tracking-wide text-zinc-600 dark:text-zinc-300">
                      Monthly View
                    </p>
                    <h2 className="mt-1 text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                      {monthLabel(viewDate)}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
                    }
                    className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 text-sm font-semibold
                               text-zinc-800 dark:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/10 transition"
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* Month body */}
              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-7 gap-2 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="px-1 text-center">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-7 gap-2">
                  {monthGrid.map((d) => {
                    const inMonth = d.getMonth() === viewDate.getMonth();
                    const isToday = sameDay(d, today);
                    const isSelected = selectedDay ? sameDay(d, selectedDay) : false;
                    const count = dayCounts.get(dayKey(d)) ?? 0;

                    const base = "relative h-14 sm:h-16 rounded-2xl border transition overflow-hidden";
                    const border = "border-black/10 dark:border-white/10";
                    const bg = inMonth
                      ? "bg-white dark:bg-zinc-950/30"
                      : "bg-zinc-50 dark:bg-white/5 opacity-70";
                    const selected = isSelected
                      ? "ring-2 ring-blue-500/40 dark:ring-blue-400/40 bg-blue-50/60 dark:bg-blue-500/10"
                      : "hover:bg-black/5 dark:hover:bg-white/10";

                    const todays = events.filter((ev) => sameDay(new Date(ev.startAt), d));

                    return (
                      <button
                        key={d.toISOString()}
                        type="button"
                        onClick={() => onPickDay(d)}
                        className={[base, border, bg, selected].join(" ")}
                      >
                        <div className="absolute left-2 top-2">
                          <span
                            className={[
                              "inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-semibold",
                              isToday
                                ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-sm"
                                : isSelected
                                ? "bg-blue-600/10 text-blue-700 dark:text-blue-200 dark:bg-blue-500/15"
                                : "text-zinc-800 dark:text-zinc-100",
                            ].join(" ")}
                          >
                            {d.getDate()}
                          </span>
                        </div>

                        {count > 0 ? (
                          <div className="absolute left-2 right-2 bottom-2 flex flex-wrap gap-1">
                            {todays.slice(0, 2).map((ev) => (
                              <span
                                key={ev.id}
                                className={[
                                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                  ev.type === "STUDY"
                                    ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-200 dark:bg-emerald-400/15"
                                    : ev.type === "EXAM"
                                    ? "bg-rose-500/12 text-rose-700 dark:text-rose-200 dark:bg-rose-400/15"
                                    : ev.type === "ASSIGNMENT"
                                    ? "bg-orange-500/12 text-orange-700 dark:text-orange-200 dark:bg-orange-400/15"
                                    : ev.type === "CLASS"
                                    ? "bg-blue-500/12 text-blue-700 dark:text-blue-200 dark:bg-blue-400/15"
                                    : "bg-zinc-500/10 text-zinc-700 dark:text-zinc-200 dark:bg-white/10",
                                ].join(" ")}
                              >
                                {ev.type}
                              </span>
                            ))}

                            {count > 2 ? (
                              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                                +{count - 2}
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                {/* Day drawer */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
                  <div className="lg:col-span-7 rounded-3xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Selected Day
                    </p>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {selectedDay ? selectedDay.toLocaleDateString() : "No date selected"}
                    </p>

                    <div className="mt-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950/40 p-3">
                      <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                        Tip
                      </p>
                      <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                        Click a day to auto-fill your date. Use the time picker below to dial it in.
                      </p>
                    </div>
                  </div>

                  <div className="lg:col-span-5 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950/40 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Events
                      </p>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {loading ? "…" : `${selectedDayEvents.length}`}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      {loading ? (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading…</p>
                      ) : selectedDayEvents.length === 0 ? (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          Nothing scheduled. Add one 👇
                        </p>
                      ) : (
                        selectedDayEvents.map((ev) => (
                          <div
                            key={ev.id}
                            className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950/30 px-3 py-2 flex items-center justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                {ev.title}
                              </p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                {new Date(ev.startAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}{" "}
                                • {ev.type}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeEvent(ev.id)}
                              className="rounded-xl px-3 py-2 text-sm font-semibold
                                         text-red-600 hover:bg-red-50
                                         dark:text-red-400 dark:hover:bg-red-500/10 transition"
                            >
                              Remove
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add form */}
          <form onSubmit={addEvent} className="p-6 pt-0 grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5">
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Study Block"
                className="mt-2 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800
                           bg-white dark:bg-zinc-950 px-3 py-3 text-sm text-zinc-900 dark:text-zinc-100
                           outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800
                           bg-white dark:bg-zinc-950 px-3 py-3 text-sm text-zinc-900 dark:text-zinc-100
                           outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
              >
                <option value="STUDY">Study</option>
                <option value="CLASS">Class</option>
                <option value="ASSIGNMENT">Assignment</option>
                <option value="EXAM">Exam</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="md:col-span-4">
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Date & time
              </label>
              <input
                type="datetime-local"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800
                           bg-white dark:bg-zinc-950 px-3 py-3 text-sm text-zinc-900 dark:text-zinc-100
                           outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
              />
            </div>

            <div className="md:col-span-12 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl px-5 py-3 text-sm font-medium
                           bg-zinc-900 text-white hover:bg-zinc-800
                           dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition
                           disabled:opacity-60"
              >
                {saving ? "Adding..." : "+ Add to calendar"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}