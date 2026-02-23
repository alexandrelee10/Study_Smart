"use client";

import React from "react";
import { Users, Timer, Clock } from "lucide-react";

type StatColor = "blue" | "purple" | "green";

const stats: Array<{
  color: StatColor;
  value: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
}> = [
  {
    color: "blue",
    value: "30k+",
    label: "Students",
    desc: "Use StudySmart to study more focused and achieve their goals.",
    icon: <Users className="h-6 w-6" aria-hidden="true" />,
  },
  {
    color: "purple",
    value: "120k+",
    label: "Sessions Logged",
    desc: "Track study time, build streaks, and stay consistent week to week.",
    icon: <Timer className="h-6 w-6" aria-hidden="true" />,
  },
  {
    color: "green",
    value: "600k+",
    label: "Minutes Studied",
    desc: "Build momentum and stay consistent with time tracking and goals.",
    icon: <Clock className="h-6 w-6" aria-hidden="true" />,
  },
];

const colorMap: Record<StatColor, { iconBg: string; number: string }> = {
  blue: {
    iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    number: "text-blue-600 dark:text-blue-400",
  },
  purple: {
    iconBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
    number: "text-purple-600 dark:text-purple-400",
  },
  green: {
    iconBg: "bg-green-500/15 text-green-600 dark:text-green-400",
    number: "text-green-600 dark:text-green-400",
  },
};

export default function TrustedByPage() {
  return (
    <section className="py-16 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            TRUSTED BY STUDENTS WORLDWIDE
          </p>

          <h2 className="mt-3 text-3xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            Your success in numbers!
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            Real progress, tracked over time — built for consistency.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s) => {
            const c = colorMap[s.color];
            return (
              <div
                key={s.label}
                className="rounded-3xl p-8 text-center
                           dark:border-zinc-800 dark:bg-zinc-900/40"
              >
                <div
                  className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${c.iconBg}`}
                >
                  {s.icon}
                </div>

                <div className={`mt-6 text-5xl font-extrabold ${c.number}`}>
                  {s.value}
                </div>

                <div className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {s.label}
                </div>

                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}