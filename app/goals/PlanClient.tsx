"use client";

import * as React from "react";
import {
  addPlanItem,
  deletePlanItem,
  movePlanItem,
  togglePlanItem,
} from "../goals/action";

export type PlanItemDTO = {
  id: string;
  title: string;
  done: boolean;
  order: number;
};

export default function PlanClient({ items }: { items: PlanItemDTO[] }) {
  const [title, setTitle] = React.useState("");

  return (
    <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-blue-600/10 to-transparent dark:from-blue-500/10">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Today’s Plan
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Add tasks, check them off, and keep momentum.
        </p>
      </div>

      {/* Add form */}
      <form
        action={async (fd) => {
          await addPlanItem(fd);
          setTitle("");
        }}
        className="p-6 flex flex-col sm:flex-row gap-3"
      >
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task… (ex: 1 Pomodoro, review flashcards)"
          className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
        />

        <button
          type="submit"
          className="shrink-0 rounded-2xl px-5 py-3 text-sm font-medium
                     bg-zinc-900 text-white hover:bg-zinc-800
                     dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
        >
          Add
        </button>
      </form>

      {/* List */}
      <div className="px-6 pb-6">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 p-6 text-sm text-zinc-600 dark:text-zinc-400">
            No tasks yet. Add your first task above.
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item, i) => (
              <li
                key={item.id}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex items-start justify-between gap-3"
              >
                <button
                  onClick={() => togglePlanItem(item.id)}
                  className="flex items-start gap-3 text-left"
                  type="button"
                >
                  <span
                    className={[
                      "mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center text-xs",
                      item.done
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-black/20 dark:border-white/20",
                    ].join(" ")}
                  >
                    {item.done ? "✓" : ""}
                  </span>

                  <span
                    className={[
                      "text-sm",
                      item.done
                        ? "text-zinc-500 dark:text-zinc-400 line-through"
                        : "text-zinc-900 dark:text-zinc-100",
                    ].join(" ")}
                  >
                    {item.title}
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => movePlanItem(item.id, "up")}
                    disabled={i === 0}
                    className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-2 py-1 text-xs text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-40"
                    type="button"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => movePlanItem(item.id, "down")}
                    disabled={i === items.length - 1}
                    className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-2 py-1 text-xs text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-40"
                    type="button"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => deletePlanItem(item.id)}
                    className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-2 py-1 text-xs text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    type="button"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
