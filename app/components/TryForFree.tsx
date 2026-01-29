import React from "react";
import Image from "next/image";

const TryForFree = () => {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-4xl font-bold">Try StudySmart for free</h2>
              <p className="text-lg text-zinc-600">
                Kickstart your most productive semester. Start with 14 days free
                and build a study routine that actually sticks.
              </p>
            </div>

            <ul className="space-y-3 text-zinc-700">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                <span>User-friendly study tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                <span>Stay motivated with streaks and progress insights</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                <span>Analyze habits and improve week by week</span>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <button className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                Get Started Now
              </button>
              <p className="text-sm text-zinc-500">No credit card required.</p>
            </div>
          </div>

          {/* Right */}
          <div className="relative w-full aspect-[16/10] rounded-2xl bg-white overflow-hidden shadow-sm">
            <Image
              src="/assets/hero/hero_1.png"
              alt="Study Smart dashboard"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={95}
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TryForFree;
