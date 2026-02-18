"use client";

import * as React from "react";
import { saveStudySession } from "./action";

type CourseOption = { id: string; name: string };

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}
function formatClock(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (h > 0) return `${h}:${pad2(m)}:${pad2(r)}`;
  return `${m}:${pad2(r)}`;
}

export default function StudyTimerClient({ courses }: { courses: CourseOption[] }) {
  const [courseId, setCourseId] = React.useState<string>("none");
  const [notes, setNotes] = React.useState("");

  const [startedAt, setStartedAt] = React.useState<Date | null>(null);
  const [isRunning, setIsRunning] = React.useState(false);
  const [elapsedSec, setElapsedSec] = React.useState(0);

  // tick
  React.useEffect(() => {
    if (!isRunning) return;
    const t = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [isRunning]);

  const canStart = !startedAt;
  const canPause = !!startedAt && isRunning;
  const canResume = !!startedAt && !isRunning;
  const canFinish = !!startedAt && elapsedSec > 0;

  function handleStart() {
    setStartedAt(new Date());
    setElapsedSec(0);
    setIsRunning(true);
  }

  function handlePause() {
    setIsRunning(false);
  }

  function handleResume() {
    setIsRunning(true);
  }

  function handleReset() {
    setStartedAt(null);
    setIsRunning(false);
    setElapsedSec(0);
    setNotes("");
    setCourseId("none");
  }

  async function handleFinish() {
    if (!startedAt) return;

    const endedAt = new Date();
    const minutes = Math.max(1, Math.round(elapsedSec / 60)); // minimum 1 minute

    const fd = new FormData();
    fd.set("courseId", courseId);
    fd.set("startedAt", startedAt.toISOString());
    fd.set("endedAt", endedAt.toISOString());
    fd.set("minutes", String(minutes));
    fd.set("notes", notes);

    await saveStudySession(fd);
    handleReset();
    alert("Session saved ✅");
  }

  return (
    <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-orange-500/15 to-transparent dark:from-orange-400/15">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Start Study Session
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Track your time, build streaks, and log notes.
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Timer */}
        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 p-6">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Timer</div>

          <div className="mt-3 flex items-baseline gap-3">
            <div className="text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {formatClock(elapsedSec)}
            </div>
            {startedAt && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                started {startedAt.toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={handleStart}
              disabled={!canStart}
              className="rounded-2xl px-4 py-2 text-sm font-medium
                         bg-zinc-900 text-white hover:bg-zinc-800
                         dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200
                         disabled:opacity-40 disabled:hover:bg-zinc-900 dark:disabled:hover:bg-white transition"
            >
              Start
            </button>

            <button
              onClick={handlePause}
              disabled={!canPause}
              className="rounded-2xl px-4 py-2 text-sm font-medium
                         border border-zinc-200 dark:border-zinc-800
                         hover:bg-zinc-50 dark:hover:bg-zinc-900
                         disabled:opacity-40 transition"
            >
              Pause
            </button>

            <button
              onClick={handleResume}
              disabled={!canResume}
              className="rounded-2xl px-4 py-2 text-sm font-medium
                         border border-zinc-200 dark:border-zinc-800
                         hover:bg-zinc-50 dark:hover:bg-zinc-900
                         disabled:opacity-40 transition"
            >
              Resume
            </button>

            <button
              onClick={handleFinish}
              disabled={!canFinish}
              className="rounded-2xl px-4 py-2 text-sm font-medium
                         bg-blue-600 text-white hover:bg-blue-700
                         disabled:opacity-40 transition"
            >
              Finish & Save
            </button>

            <button
              onClick={handleReset}
              className="ml-auto rounded-2xl px-4 py-2 text-sm font-medium
                         border border-zinc-200 dark:border-zinc-800
                         hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
            >
              Reset
            </button>
          </div>

          <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
            Saving rounds to minutes (minimum 1 minute).
          </div>
        </div>

        {/* Right: Details */}
        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 p-6">
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Session Details
          </div>

          <label className="mt-4 block text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Course (optional)
          </label>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
          >
            <option value="none">General (no course)</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <label className="mt-4 block text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What did you work on? Any blockers?"
            rows={6}
            className="mt-2 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20 resize-none"
          />

          <div className="mt-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-3 text-xs text-zinc-600 dark:text-zinc-300">
            <div className="font-medium">Tip</div>
            <div className="mt-1">
              Try one focused block: 25 minutes work, 5 minutes break.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
