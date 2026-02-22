// app/(admin)/admin/courses/[id]/edit/page.tsx
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/require-admin";
import { revalidatePath } from "next/cache";
import { CourseType, EducationLevel, CourseDifficulty } from "@prisma/client";

export const metadata = { title: "Admin | Edit Course" };

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  await requireAdmin();

  // ✅ Next.js: params is a Promise in your setup
  const { id } = await params;
  if (!id) return notFound();

  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) return notFound();

  // ✅ Server Action
  async function onUpdateCourse(formData: FormData) {
    "use server";
    await requireAdmin();

    const name = String(formData.get("name") ?? "").trim();
    const code = String(formData.get("code") ?? "").trim();
    const image = String(formData.get("image") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    const type = String(formData.get("type") ?? "OTHER") as CourseType;
    const edLevel = String(formData.get("edLevel") ?? "OTHER") as EducationLevel;
    const difficulty = String(
      formData.get("difficulty") ?? "MEDIUM"
    ) as CourseDifficulty;

    if (!name || !code) return;

    await prisma.course.update({
      where: { id },
      data: {
        name,
        code,
        image: image || null,
        description: description || null,
        type,
        edLevel,
        difficulty,
      },
    });

    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${id}/edit`);
    revalidatePath(`/courses/${id}`);

    redirect("/admin/courses");
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 lg:px-10 pt-24 pb-12">
        <Link
          href="/admin/courses"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back
        </Link>

        <div className="mt-4 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm p-6">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Edit Course
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            ID: {course.id}
          </p>

          <form action={onUpdateCourse} className="mt-6 grid grid-cols-1 gap-4">
            <input
              name="name"
              defaultValue={course.name}
              className="rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3 bg-white dark:bg-zinc-950/40"
              placeholder="Course name"
              required
            />

            <input
              name="code"
              defaultValue={course.code}
              className="rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3 bg-white dark:bg-zinc-950/40"
              placeholder="Course code"
              required
            />

            <input
              name="image"
              defaultValue={course.image ?? ""}
              className="rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3 bg-white dark:bg-zinc-950/40"
              placeholder="Image URL"
            />

            <textarea
              name="description"
              defaultValue={course.description ?? ""}
              className="rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3 bg-white dark:bg-zinc-950/40 min-h-[120px]"
              placeholder="Description"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                name="type"
                defaultValue={course.type ?? "OTHER"}
                className="rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3 bg-white dark:bg-zinc-950/40"
              >
                <option value="OTHER">Other</option>
                <option value="COMPUTER_SCIENCE">Computer Science</option>
                <option value="MATH">Math</option>
                <option value="SCIENCE">Science</option>
                <option value="ENGLISH">English</option>
                <option value="READING">Reading</option>
                <option value="HISTORY">History</option>
                <option value="NURSING">Nursing</option>
                <option value="SOCIAL_MEDIA">Social Media</option>
              </select>

              <select
                name="edLevel"
                defaultValue={course.edLevel ?? "OTHER"}
                className="rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3 bg-white dark:bg-zinc-950/40"
              >
                <option value="OTHER">Other</option>
                <option value="MIDDLE_SCHOOL">Middle School</option>
                <option value="HIGH_SCHOOL">High School</option>
                <option value="COLLEGE">College</option>
              </select>

              <select
                name="difficulty"
                defaultValue={course.difficulty ?? "MEDIUM"}
                className="rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3 bg-white dark:bg-zinc-950/40"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <button className="rounded-2xl px-5 py-3 text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}