"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import FooterPage from "../components/Footer";

type Course = {
  id: string;
  name: string;
  image?: string | null;

  // Your UI expects these:
  type?: string | null;
  edLevel?: string | null;

  // But many schemas use these names instead:
  courseType?: string | null;
  educationLevel?: string | null;

  createdAt?: Date | string | null;
};

export default function CoursesClient({
  courseContent,
}: {
  courseContent: Course[];
}) {
  const [courseType, setCourseType] = useState("");
  const [level, setLevel] = useState("");
  const [sort, setSort] = useState("");

  // Normalize data so UI always reads consistent keys
  const normalizedCourses = useMemo(() => {
    const list = (courseContent ?? []).map((c) => {
      const normalizedType = (c.type ?? c.courseType ?? "OTHER") as string;
      const normalizedLevel = (c.edLevel ??
        c.educationLevel ??
        "OTHER") as string;

      const createdAtISO =
        c.createdAt instanceof Date
          ? c.createdAt.toISOString()
          : (c.createdAt ?? null);

      return {
        ...c,
        type: normalizedType,
        level: normalizedLevel,
        createdAt: createdAtISO,
      };
    });

    // Helpful debug (dev only)
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("CoursesClient sample:", list[0]);
    }

    return list;
  }, [courseContent]);

  const filteredCourses = useMemo(() => {
    let list = [...normalizedCourses];

    if (courseType) list = list.filter((c) => c.type === courseType);
    if (level) list = list.filter((c) => c.level === level);

    if (sort === "NEWEST") {
      list.sort((a, b) => {
        const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bd - ad;
      });
    }

    return list;
  }, [normalizedCourses, courseType, level, sort]);

  return (
    <div className="pt-32 p-6 min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="flex flex-col gap-8 ">
        {/* Heading */}
        <div>
          <h2 className="text-4xl sm:text-5xl text-center">
            Explore our <span className="font-bold">courses</span>
          </h2>
          <p className="text-center font-light pt-5">
            Boost your knowledge with our expert-led courses
          </p>
        </div>

        {/* Filters */}
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center py-4 border-t border-b border-zinc-200 dark:border-zinc-800">
            {/* Course */}
            <select
              id="all_courses"
              value={courseType}
              onChange={(e) => setCourseType(e.target.value)}
              className="w-full sm:w-64 bg-transparent border-none px-1 py-2 text-sm text-zinc-900 outline-none focus:ring-0 dark:text-white"
            >
              <option value="">Course</option>
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

            <div className="hidden sm:block h-6 w-px bg-zinc-300 dark:bg-zinc-700" />

            {/* Level */}
            <select
              id="grades"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full sm:w-52 bg-transparent border-none px-1 py-2 text-sm text-zinc-900 outline-none focus:ring-0 dark:text-white"
            >
              <option value="">Level</option>
              <option value="MIDDLE_SCHOOL">Middle School</option>
              <option value="HIGH_SCHOOL">High School</option>
              <option value="COLLEGE">College</option>
              <option value="OTHER">Other</option>
            </select>

            <div className="hidden sm:block h-6 w-px bg-zinc-300 dark:bg-zinc-700" />

            {/* Sort */}
            <select
              id="sort_type"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full sm:w-44 bg-transparent border-none px-1 py-2 text-sm text-zinc-900 outline-none focus:ring-0 dark:text-white"
            >
              <option value="">Sort</option>
              <option value="POPULAR">Popular</option>
              <option value="NEWEST">Newest</option>
            </select>

            <div className="flex-1" />

            <button
              type="button"
              onClick={() => {}}
              className="w-full sm:w-auto text-sm font-medium text-blue-600 hover:underline"
            >
              Browse Courses
            </button>

            <button
              type="button"
              onClick={() => {
                setCourseType("");
                setLevel("");
                setSort("");
              }}
              className="w-full sm:w-auto text-sm font-medium text-zinc-600 hover:underline dark:text-zinc-300"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="mx-auto w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((c) => (
            <Link
              key={c.id}
              href={`/courses/${c.id}`}
              className="group rounded-xl border border-zinc-200 bg-white p-4 transition hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              {/* Image on top */}
              <div className="relative mb-4 h-40 w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={c.image || "/assets/courses/ca.png"}
                  alt={c.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Course name */}
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white text-center">
                {c.name}
              </h3>

              {/* Divider */}
              <div className="my-2 h-px w-full bg-zinc-200 dark:bg-zinc-700" />

              {/* Level */}
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                {String(c.level ?? "OTHER").replaceAll("_", " ")}
              </p>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {filteredCourses.length === 0 && (
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-300">
            No courses match your filters.
          </p>
        )}
        <FooterPage />
      </div>
    </div>
  );
}
