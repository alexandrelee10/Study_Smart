"use client";

import { useState } from "react";

const faqs = [
  {
    q: "What is StudySmart?",
    a: "StudySmart is a simple study tracker + assignment helper built to help you stay consistent. Log study sessions, manage tasks, and see your progress in one clean dashboard.",
  },
  {
    q: "How do I track my study sessions?",
    a: "Start a session, pick a subject, and log your time. You can review totals by day/week and spot patterns that help you study smarter.",
  },
  {
    q: "Can I manage assignments and deadlines too?",
    a: "Yes. Add assignments, set due dates, and keep everything organized alongside your study sessions so nothing slips through the cracks.",
  },
  {
    q: "Does StudySmart support Pomodoro?",
    a: "Yep. Use Pomodoro mode for focused sprints or run longer sessions when you want to stay in a flow state.",
  },
  {
    q: "Can I customize the dashboard?",
    a: "Absolutely. Change themes, subject colors, and the way your dashboard is laid out so it fits how you study.",
  },
  {
    q: "Does it work on mobile and desktop?",
    a: "Yes—StudySmart is designed to feel great on both. Your progress stays up to date so you can switch devices without losing your place.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-10 dark:text-zinc-100">
          FAQ
        </h2>

        <div className="space-y-4">
          {faqs.map((item, i) => {
            const open = openIndex === i;

            return (
              <div
                key={item.q}
                className="rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-lg transition
                           dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:shadow-none"
              >
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="text-lg font-semibold flex-1 dark:text-zinc-100">
                    {item.q}
                  </span>

                  <span className="text-2xl leading-none shrink-0 text-zinc-700 dark:text-zinc-300">
                    {open ? "−" : "+"}
                  </span>
                </button>

                {open && (
                  <div className="px-5 pb-5 text-zinc-600 leading-relaxed dark:text-zinc-400">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
