import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prisma";
import { CourseType, Difficulty, EducationLevel } from "@prisma/client";

export const metadata = { title: "New Course" };

function toEnum<T extends Record<string, string>>(
  value: FormDataEntryValue | null,
  enumObj: T,
  fallback?: T[keyof T]
): T[keyof T] {
  const values = Object.values(enumObj) as T[keyof T][];
  if (!value) return (fallback ?? values[0]) as T[keyof T];

  const v = String(value) as T[keyof T];
  return values.includes(v) ? v : ((fallback ?? values[0]) as T[keyof T]);
}

export default async function NewCoursePage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session?.user) redirect("/signin");
  if (role !== "ADMIN") redirect("/dashboard");

  async function createCourse(formData: FormData) {
    "use server";

    const name = String(formData.get("name") ?? "").trim();
    const code = String(formData.get("code") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const image = String(formData.get("image") ?? "").trim();

    if (!name || !code) return;

    const type = toEnum(formData.get("type"), CourseType);
    const edLevel = toEnum(formData.get("edLevel"), EducationLevel);
    const difficulty = toEnum(formData.get("difficulty"), Difficulty);

    await prisma.course.create({
      data: {
        name,
        code,
        description: description || null,
        image: image || null,
        type,
        edLevel,
        difficulty,
      },
    });

    redirect("/admin/courses");
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 lg:px-10 pt-24 pb-12">
        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-black/10 dark:border-white/10">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Create Course
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Add a new course to StudySmart.
            </p>
          </div>

          <form action={createCourse} className="p-6 grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Name
              </label>
              <input
                name="name"
                className="mt-2 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-3 text-sm"
                placeholder="Computer Science I"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Code
              </label>
              <input
                name="code"
                className="mt-2 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-3 text-sm"
                placeholder="COP2210"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Type
                </label>
                <select
                  name="type"
                  className="mt-2 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-3 text-sm"
                  defaultValue="OTHER"
                >
                  {Object.values(CourseType).map((v) => (
                    <option key={v} value={v}>
                      {v.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Level
                </label>
                <select
                  name="edLevel"
                  className="mt-2 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-3 text-sm"
                  defaultValue="OTHER"
                >
                  {Object.values(EducationLevel).map((v) => (
                    <option key={v} value={v}>
                      {v.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  className="mt-2 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-3 text-sm"
                  defaultValue="MEDIUM"
                >
                  {Object.values(Difficulty).map((v) => (
                    <option key={v} value={v}>
                      {v.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Image URL (optional)
              </label>
              <input
                name="image"
                className="mt-2 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-3 text-sm"
                placeholder="/assets/courses/cp.png"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Description (optional)
              </label>
              <textarea
                name="description"
                className="mt-2 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-3 text-sm min-h-[120px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <a
                href="/admin/courses"
                className="rounded-2xl px-5 py-3 text-sm font-medium border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
              >
                Cancel
              </a>
              <button
                type="submit"
                className="rounded-2xl px-5 py-3 text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}