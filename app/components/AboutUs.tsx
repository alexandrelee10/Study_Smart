import React from "react";
import Image from "next/image";

import About1 from "@/public/assets/aboutus/About1.png";
import About2 from "@/public/assets/aboutus/About2.png";
import About3 from "@/public/assets/aboutus/About3.png";

const AboutUsPage = () => {
  return (
    <section className="py-20 space-y-28 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center text-center">
        {/* Top */}
        <div className="mb-12">
          <h2 className="text-2xl text-zinc-600 font-light dark:text-zinc-400">
            What is StudySmart?
          </h2>

          <h1 className="text-6xl font-bold pb-4 dark:text-zinc-100">
            Assignment tracker & Study helper
          </h1>

          <h2
            className="text-sm uppercase tracking-wide w-fit mx-auto px-4 py-2
                       bg-radial from-blue-400 to-blue-500
                       rounded-full text-white font-semibold
                       shadow-lg shadow-blue-400/50
                       dark:shadow-blue-500/20"
          >
            Super charged
          </h2>
        </div>

        {/* Middle */}
        <div className="justify-center">
          {/* First Block */}
          <div className="flex items-center gap-10">
            <Image
              src={About1}
              alt="StudySmart dashboard preview"
              width={140}
              height={140}
            />

            <p className="text-lg text-zinc-700 leading-relaxed max-w-xl text-left dark:text-zinc-300">
              Study Smart is a{" "}
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                simple, powerful study tracker designed for students
              </span>{" "}
              who want clarity and consistency. Track your{" "}
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                study time
              </span>
              , build better habits, and{" "}
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                stay focused with an immersive fullscreen focus timer—
              </span>
              perfect for college, university, or everyday schoolwork.
            </p>
          </div>

          {/* Second Block */}
          <div className="flex items-center gap-10 py-9">
            <p className="text-lg text-zinc-700 leading-relaxed max-w-xl text-right dark:text-zinc-300">
              Study Smart{" "}
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                combines study time tracking with a distraction-free focus timer.
              </span>{" "}
              Use Pomodoro sessions to stay locked in, or start a timer and flow
              through longer study sessions without interruptions. Everything
              you need to stay{" "}
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                productive
              </span>{" "}
              lives in one intuitive dashboard.
            </p>

            <Image
              src={About2}
              alt="Study smart dashboard"
              width={140}
              height={140}
            />
          </div>

          {/* Third Block */}
          <div className="flex items-center gap-10 py-9">
            <Image
              src={About3}
              alt="Motivation tools"
              width={140}
              height={140}
            />

            <p className="text-lg text-left text-zinc-700 leading-relaxed max-w-xl dark:text-zinc-300">
              Beyond tracking time, Study Smart{" "}
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                keeps you motivated
              </span>{" "}
              with built-in accountability tools like{" "}
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                🔥 streaks, 🏆 achievements, and 📊 progress insights
              </span>{" "}
              so you can see your effort add up, day after day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsPage;
