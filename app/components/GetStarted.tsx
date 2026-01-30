import React from "react";
import Image from "next/image";
import Link from "next/link";

import getStarted1 from "@/public/assets/get_started/getStarted1.png";
import getStarted2 from "@/public/assets/get_started/getStarted2.png";
import getStarted3 from "@/public/assets/get_started/getStarted3.png";
import getStarted4 from "@/public/assets/get_started/getStarted4.png";

const GetStartedPage = () => {
  const cardInfo = [
    {
      name: "simple",
      image: getStarted1,
      title: "Simple",
      description:
        "Designed for simplicity: Study Smart is fast, clean, and intuitive—making it easy to track study sessions, manage assignments, and stay focused without distractions.",
    },
    {
      name: "personalized",
      image: getStarted2,
      title: "Personalized",
      description:
        "Make it yours: Customize your Study Smart dashboard with themes, subject colors, and flexible layouts—so your study space works the way you do.",
    },
    {
      name: "motivating",
      image: getStarted3,
      title: "Motivating",
      description:
        "Stay consistent, stay accountable: Study Smart helps you study more effectively with streaks, progress tracking, and a clear dashboard.",
    },
    {
      name: "refined",
      image: getStarted4,
      title: "Refined",
      description:
        "Built with students in mind: Study Smart is shaped by real student feedback and modern web technology for a smooth, reliable experience.",
    },
  ];

  return (
    <section className="py-20 dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Header */}
        <div className="mb-12 space-y-3">
          <h2 className="text-sm font-semibold tracking-wide text-blue-600 uppercase dark:text-blue-400">
            Get started now
          </h2>

          <h1 className="text-4xl font-bold dark:text-zinc-100">
            Start your journey here!
          </h1>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cardInfo.map((c) => (
            <Link
              key={c.name}
              href="#"
              className="group rounded-2xl p-6 hover:shadow-lg transition text-left
                         dark:bg-white/5 dark:border dark:border-white/10 dark:hover:bg-white/10 dark:hover:shadow-none"
            >
              {/* Image */}
              <div className="mb-4 flex justify-center">
                <Image
                  src={c.image}
                  alt={c.title}
                  width={80}
                  height={80}
                  className="group-hover:scale-105 transition"
                />
              </div>

              {/* Text */}
              <h3 className="text-xl font-semibold mb-2 text-center dark:text-zinc-100">
                {c.title}
              </h3>

              <p className="text-sm text-zinc-600 leading-relaxed text-center dark:text-zinc-400">
                {c.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GetStartedPage;
