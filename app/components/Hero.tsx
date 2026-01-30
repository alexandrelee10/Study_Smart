"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, BarChart3, Trophy, GraduationCap, Star } from "lucide-react";
import TypewriterWords from "./TypewriterWords";

const HeroPage = () => {
  const features = [
    { name: "Streaks", description: "Track your progress", icon: Flame },
    { name: "Statistics", description: "Beautiful graphs coming soon!", icon: BarChart3 },
    { name: "Motivating", description: "Badges and streaks!", icon: Trophy },
    { name: "Test Helper", description: "Assist with tests!", icon: GraduationCap },
  ];

  const wordBank = [
    "unrivaled",
    "greatest",
    "finest",
    "optimal",
    "premier",
    "leading",
    "elite",
    "superior",
    "prime",
    "preeminent",
  ];

  return (
    <section
      id="dashboard"
      className="relative overflow-hidden dark:bg-zinc-950"
    >
      {/* Dark-only subtle backdrop */}
      <div className="pointer-events-none absolute inset-0 hidden dark:block">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-10 pt-28 pb-16">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          {/* Left */}
          <div className="flex-1">
            <div>
              <p className="text-sm font-medium text-blue-700 bg-blue-100 inline-flex items-center gap-2 px-3 py-1 rounded-full dark:bg-blue-500/15 dark:text-blue-200 dark:border dark:border-blue-400/20">
                <Star className="w-4 h-4" />
                Study smarter, not harder
              </p>

              <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight leading-tight dark:text-zinc-100">
                The{" "}
                <TypewriterWords
                  words={wordBank}
                  className="text-blue-600 font-semibold dark:text-blue-400"
                  typingSpeedMs={70}
                  deletingSpeedMs={45}
                  pauseMs={900}
                />{" "}
                <br />
                way to track your studying
              </h1>

              <h2 className="mt-4 text-lg sm:text-xl text-zinc-600 leading-relaxed dark:text-zinc-300">
                Focus better. Study longer. See results.
              </h2>

              <p className="mt-6 text-zinc-700 leading-relaxed dark:text-zinc-300">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Study Smart is a simple, powerful study tracker built for
                  students who want clarity and consistency
                </span>
                . Track your study sessions with precision, review your progress
                in real time, and understand exactly where your time is going.
                Stay motivated with streaks, goals, and habit tracking designed
                to help you build better study routines over time. Everything is
                brought together in one intuitive dashboard, so you can focus
                less on planning and more on actually getting work done.
              </p>
            </div>

            {/* Feature chips */}
            <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <Link
                    key={feature.name}
                    href=""
                    title={feature.description}
                    className="
                      rounded-xl border border-zinc-200 bg-white/70 p-3 hover:bg-white transition
                      dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10
                    "
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-[#2563EB] mt-0.5 dark:text-blue-400" />
                      <div className="flex flex-col">
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {feature.name}
                        </span>
                        <span className="text-sm text-zinc-600 dark:text-zinc-300">
                          {feature.description}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <Link
              href="/signup"
              className="
                inline-flex items-center justify-center
                rounded-xl px-6 py-3 mt-7
                text-sm font-semibold text-white
                bg-blue-600 shadow-sm transition-all
                hover:bg-blue-700 hover:shadow-md
                active:scale-[0.98]
                focus:outline-none focus:ring-2 focus:ring-blue-500/50
                dark:shadow-blue-500/10
              "
            >
              Get started →
            </Link>
          </div>

          {/* Right */}
          <div className="flex-1 w-full mt-10">
            <div className="relative w-full aspect-16/10 rounded-2xl bg-white overflow-hidden dark:bg-white/5 dark:border dark:border-white/10">
              <Image
                src="/assets/hero/hero_1.png"
                alt="Study Smart dashboard"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={95}
                className="object-cover"
                priority
              />
              {/* Dark-only subtle overlay to reduce glare */}
              <div className="pointer-events-none absolute inset-0 hidden dark:block bg-black/10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroPage;
