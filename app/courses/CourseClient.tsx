"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import FooterPage from "../components/Footer";
import EnrollButton from "../components/EnrollmentButton";

type Course = {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;

  type?: string | null;
  edLevel?: string | null;

  courseType?: string | null;
  educationLevel?: string | null;

  createdAt?: Date | string | null;
};

function prettyEnum(v: string) {
  return v
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/(^|\s)\S/g, (t) => t.toUpperCase());
}

function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success";
}) {
  const toneClass =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200"
      : "border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-200 bg-white/70 dark:bg-white/5";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium backdrop-blur",
        toneClass,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
// Display nonuser page for courses
export default function CoursesClient({
  courseContent,
  title = "Explore our courses",
  subtitle = "Boost your knowledge with our expert-led courses",
  topRight,
  mode = "explore",
  enrolledCourseIds = [],
}: {
  courseContent: Course[];
  title?: string;
  subtitle?: string;
  topRight?: React.ReactNode;
  mode?: "my" | "explore";
  enrolledCourseIds?: string[]; // ✅ NEW
}) {
  const [courseType, setCourseType] = useState("");
  const [level, setLevel] = useState("");
  const [sort, setSort] = useState("");

  // local enrolled set for instant UI updates (optimistic)
  const [enrolledSet, setEnrolledSet] = useState<Set<string>>(
    () => new Set(enrolledCourseIds)
  );

  // tiny toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(null), 2200);
  };

  const normalizedCourses = useMemo(() => {
    return (courseContent ?? []).map((c) => {
      const normalizedType = (c.type ?? c.courseType ?? "OTHER") as string;
      const normalizedLevel = (c.edLevel ?? c.educationLevel ?? "OTHER") as string;

      const createdAtISO =
        c.createdAt instanceof Date ? c.createdAt.toISOString() : (c.createdAt ?? null);

      return {
        ...c,
        type: normalizedType,
        level: normalizedLevel,
        createdAt: createdAtISO,
      };
    });
  }, [courseContent]);

  const filteredCourses = useMemo(() => {
    let list = [...normalizedCourses];

    if (courseType) list = list.filter((c: any) => c.type === courseType);
    if (level) list = list.filter((c: any) => c.level === level);

    if (sort === "NEWEST") {
      list.sort((a: any, b: any) => {
        const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bd - ad;
      });
    }

    return list;
  }, [normalizedCourses, courseType, level, sort]);

  const clearAll = () => {
    setCourseType("");
    setLevel("");
    setSort("");
  };

  const handleAdded = (courseId: string) => {
    setEnrolledSet((prev) => {
      const next = new Set(prev);
      next.add(courseId);
      return next;
    });
    showToast("Added to My Courses ✓");
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-10 pt-24 pb-12">
        {/* Toast */}
        {toast && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[80]">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200">
              {toast}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-100">
                {title}
              </h1>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
            </div>
            {topRight ? <div className="shrink-0">{topRight}</div> : null}
          </div>

          {/* Filters */}
          <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:items-center">
              <div className="sm:col-span-4">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Course
                </label>
                <select
                  value={courseType}
                  onChange={(e) => setCourseType(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800
                             bg-white dark:bg-zinc-950 px-3 py-3 text-sm text-zinc-900 dark:text-zinc-100
                             outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
                >
                  <option value="">All</option>
                  <option value="MATH">Math</option>
                  <option value="SCIENCE">Science</option>
                  <option value="READING">Reading</option>
                  <option value="ENGLISH">English</option>
                  <option value="HISTORY">History</option>
                  <option value="COMPUTER_SCIENCE">Computer Science</option>
                  <option value="NURSING">Nursing</option>
                  <option value="SOCIAL_MEDIA">Social Media</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="sm:col-span-4">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800
                             bg-white dark:bg-zinc-950 px-3 py-3 text-sm text-zinc-900 dark:text-zinc-100
                             outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
                >
                  <option value="">All</option>
                  <option value="MIDDLE_SCHOOL">Middle School</option>
                  <option value="HIGH_SCHOOL">High School</option>
                  <option value="COLLEGE">College</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Sort
                </label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800
                             bg-white dark:bg-zinc-950 px-3 py-3 text-sm text-zinc-900 dark:text-zinc-100
                             outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
                >
                  <option value="">Default</option>
                  <option value="NEWEST">Newest</option>
                </select>
              </div>

              <div className="sm:col-span-1 sm:flex sm:justify-end">
                <button
                  type="button"
                  onClick={clearAll}
                  className="w-full sm:w-auto rounded-2xl px-4 py-3 text-sm font-medium
                             border border-zinc-200 dark:border-zinc-800
                             hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>
                Showing{" "}
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {filteredCourses.length}
                </span>{" "}
                course{filteredCourses.length === 1 ? "" : "s"}
              </span>
              <span className="hidden sm:inline">
                Tip: Add courses to build your own dashboard.
              </span>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-8">
          {filteredCourses.length === 0 ? (
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm p-8 text-center">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                No courses found
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {mode === "my"
                  ? "You aren’t enrolled in anything yet. Switch to Explore to find courses."
                  : "Try adjusting your filters or clearing them."}
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={clearAll}
                  className="rounded-2xl px-5 py-3 text-sm font-medium
                             bg-zinc-900 text-white hover:bg-zinc-800
                             dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
                >
                  Clear filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((c: any) => {
                const isEnrolled = enrolledSet.has(c.id);

                return (
                  <Link
                    key={c.id}
                    href={`/courses/${c.id}`}
                    className="group rounded-3xl border border-black/10 dark:border-white/10
                               bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden
                               hover:shadow-md hover:-translate-y-0.5 transition"
                  >
                    <div className="relative h-44 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <img
                        src={c.image || "/assets/courses/ca.png"}
                        alt={c.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                        <Badge>{prettyEnum(String(c.type ?? "OTHER"))}</Badge>
                        <Badge>{prettyEnum(String(c.level ?? "OTHER"))}</Badge>
                        {mode === "explore" && isEnrolled ? (
                          <Badge tone="success">Added ✓</Badge>
                        ) : null}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        {c.name}
                      </h3>

                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                        {c.description ?? "Open this course to see lessons and your progress."}
                      </p>

                      <div className="mt-4 grid grid-cols-1 gap-2">
                        {/* ✅ Only show Add button on Explore AND only if not already enrolled */}
                        {mode === "explore" && !isEnrolled ? (
                          <EnrollButton courseId={c.id} onAdded={handleAdded} />
                        ) : null}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-10">
          <FooterPage />
        </div>
      </div>
    </main>
  );
}
