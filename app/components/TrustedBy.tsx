import React from "react";
import Image from "next/image";

const TrustedByPage = () => {
  return (
    <section className="py-24 dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h3 className="font-light text-zinc-600 text-sm tracking-wide dark:text-zinc-400">
          TRUSTED BY STUDENTS WORLDWIDE
        </h3>

        <h2 className="text-4xl font-bold mt-2 pb-15 dark:text-zinc-100">
          Your success in numbers!
        </h2>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-7 w-16 h-16 rounded-2xl bg-blue-500 grid place-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="white"
                className="block w-7 h-7"
              >
                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 
                13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
              </svg>
            </div>

            <h2 className="text-5xl font-extrabold text-blue-500">
              30k+
            </h2>

            <h3 className="text-2xl font-semibold mt-1 dark:text-zinc-100">
              Students
            </h3>

            <p className="text-zinc-600 mt-2 leading-relaxed max-w-xs dark:text-zinc-400">
              Use StudySmart to study more focused and achieve their goals.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-7 w-16 h-16 rounded-2xl bg-purple-500 grid place-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="white"
                viewBox="0 0 16 16"
                className="block w-7 h-7"
              >
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M2.04 4.326c.325 1.329 2.532 2.54 3.717 3.19..." />
              </svg>
            </div>

            <h2 className="text-5xl font-extrabold text-purple-500">
              120k+
            </h2>

            <h3 className="text-lg font-semibold mt-1 dark:text-zinc-100">
              Sessions Logged
            </h3>

            <p className="text-zinc-600 mt-2 leading-relaxed dark:text-zinc-400">
              Track study time, build streaks, and stay consistent week to week.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-7 w-16 h-16 rounded-2xl bg-green-600 grid place-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="white"
                viewBox="0 0 16 16"
                className="block w-7 h-7"
              >
                <path d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5z" />
                <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1..." />
              </svg>
            </div>

            <h2 className="text-5xl font-extrabold text-green-600">
              600k+
            </h2>

            <h3 className="text-lg font-semibold mt-1 dark:text-zinc-100">
              Sessions Logged
            </h3>

            <p className="text-zinc-600 mt-2 leading-relaxed dark:text-zinc-400">
              Track study time, build streaks, and stay consistent week to week.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedByPage;
