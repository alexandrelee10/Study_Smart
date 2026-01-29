import React from "react";
import Image from "next/image";

import people from "@/public/assets/icons/people_fill.svg";

const TrustedByPage = () => {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h3 className="font-light text-zinc-600 text-sm tracking-wide">
          TRUSTED BY STUDENTS WORLDWIDE
        </h3>
        <h2 className="text-4xl font-bold mt-2 pb-15">Your success in numbers!</h2>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
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

            {/* Text */}
            <h2 className="text-5xl font-extrabold text-blue-500">30k+</h2>
            <h3 className="text-2xl font-semibold mt-1">Students</h3>
            <p className="text-zinc-600 mt-2 leading-relaxed max-w-xs">
              Use StudySmart to study more focused and achieve their goals.
            </p>
          </div>


          {/* Card 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-7 w-16 h-16 rounded-2xl bg-purple-500 grid place-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16" className="block w-7 h-7">
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M2.04 4.326c.325 1.329 2.532 2.54 3.717 3.19.48.263.793.434.743.484q-.121.12-.242.234c-.416.396-.787.749-.758 1.266.035.634.618.824 1.214 1.017.577.188 1.168.38 1.286.983.082.417-.075.988-.22 1.52-.215.782-.406 1.48.22 1.48 1.5-.5 3.798-3.186 4-5 .138-1.243-2-2-3.5-2.5-.478-.16-.755.081-.99.284-.172.15-.322.279-.51.216-.445-.148-2.5-2-1.5-2.5.78-.39.952-.171 1.227.182.078.099.163.208.273.318.609.304.662-.132.723-.633.039-.322.081-.671.277-.867.434-.434 1.265-.791 2.028-1.12.712-.306 1.365-.587 1.579-.88A7 7 0 1 1 2.04 4.327Z" />
              </svg>
            </div>

            <h2 className="text-5xl font-extrabold text-purple-500">120k+</h2>
            <h3 className="text-lg font-semibold mt-1">Sessions Logged</h3>
            <p className="text-zinc-600 mt-2 leading-relaxed">
              Track study time, build streaks, and stay consistent week to week.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-7 w-16 h-16 rounded-2xl bg-green-600 grid place-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16" className="block w-7 h-7">
                <path d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5z" />
                <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64l.012-.013.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354-.013.012A7 7 0 1 1 7 2.071V1.5a.5.5 0 0 1-.5-.5M8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3" />
              </svg>
            </div>

            <h2 className="text-5xl font-extrabold text-green-600">600k+</h2>
            <h3 className="text-lg font-semibold mt-1">Sessions Logged</h3>
            <p className="text-zinc-600 mt-2 leading-relaxed">
              Track study time, build streaks, and stay consistent week to week.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedByPage;
