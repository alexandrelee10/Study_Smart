"use client";
import React, { useState } from "react";

const selectClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition-all " +
  "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 " +
  "dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400/30";

export default function CoursesPage() {
  const [courseType, setCourseType] = useState("");
  const [level, setLevel] = useState("");
  const [sort, setSort] = useState("");

  return (
    <div className="pt-32 p-6 min-h-screen">
      <div className="flex flex-col gap-8">
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
        <div className="mx-auto w-full max-w-5xl pt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              id="all_courses"
              value={courseType}
              onChange={(e) => setCourseType(e.target.value)}
              className={`${selectClass} sm:w-64`}
            >
              <option value="">Select a course</option>
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

            <select
              id="grades"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className={`${selectClass} sm:w-56`}
            >
              <option value="">Select level</option>
              <option value="MIDDLE_SCHOOL">Middle School</option>
              <option value="HIGH_SCHOOL">High School</option>
              <option value="COLLEGE">College</option>
              <option value="OTHER">Other</option>
            </select>

            <select
              id="sort_type"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className={`${selectClass} sm:w-44`}
            >
              <option value="">Sort by</option>
              <option value="POPULAR">Popular</option>
              <option value="NEWEST">Newest</option>
            </select>

            <button className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99] sm:ml-auto">
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}