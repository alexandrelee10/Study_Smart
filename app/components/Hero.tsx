import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, BarChart3, Trophy, GraduationCap, Star } from "lucide-react";

const HeroPage = () => {
  const features = [
    {
      name: "Streaks",
      description: "Track your progress",
      icon: Flame,
    },
    {
      name: "Statistics",
      description: "Beautiful graphs coming soon!",
      icon: BarChart3,
    },
    {
      name: "Motivating",
      description: "Badges and streaks!",
      icon: Trophy,
    },
    {
      name: "Test Helper",
      description: "Assist with tests!",
      icon: GraduationCap,
    },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-10 pt-28 pb-16">
        <div className="flex flex-col-reverse lg:flex-row items-start gap-12">
          {/* Left */}
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-700 bg-blue-100 inline-flex items-center gap-2 px-3 py-1 rounded-full">
              <Star className="w-4 h-4" />
              Study smarter, not harder
            </p>

            <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
              The easy, modern way to track your studying
            </h1>

            <h2 className="mt-4 text-lg sm:text-xl text-zinc-600 leading-relaxed">
              Focus better. Study longer. See results.
            </h2>

            <p className="mt-6 text-zinc-700 leading-relaxed">
              <span className="font-semibold text-zinc-900">
                Study Smart is a simple, powerful study tracker built for students who want clarity and consistency
              </span>
              . Track your study sessions with precision, review your progress in real time, and understand exactly where your time is going.
              Stay motivated with streaks, goals, and habit tracking designed to help you build better study routines over time.
              Everything is brought together in one intuitive dashboard, so you can focus less on planning and more on actually getting work done.
            </p>

            {/* feature chips */}
            <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
              {features.map((feature) => {
  const Icon = feature.icon;

  return (
    <Link
      key={feature.name}
      href=""
      title={feature.description}
      className="rounded-xl border border-zinc-200 bg-white/70 p-3 hover:bg-white transition"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <Icon className="w-5 h-5 text-[#2563EB] mt-0.5" />

        {/* Text */}
        <div className="flex flex-col">
          <span className="font-medium text-zinc-900">
            {feature.name}
          </span>
          <span className="text-sm text-zinc-600">
            {feature.description}
          </span>
        </div>
      </div>
    </Link>
  );
})}

            </div>
          </div>

          {/* Right */}
          <div className="flex-1 w-full">
            <div className="relative w-full aspect-[16/10] rounded-2xl bg-white overflow-hidden">
              <Image
                src="/assets/hero/hero_1.png"
                alt="Study Smart dashboard"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={95}
                className="object-cover"
                priority
              />
            </div>

            <p className="mt-3 text-xs text-zinc-500">
              Preview of your dashboard (sessions, streaks, and goals).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroPage;
