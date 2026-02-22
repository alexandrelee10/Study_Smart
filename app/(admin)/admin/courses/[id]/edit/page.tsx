import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/require-admin";
import { updateCourse } from "../../action";

export const metadata = { title: "Admin | Edit Course" };

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  await requireAdmin();

  const course = await prisma.course.findUnique({ where: { id: params.id } });
  if (!course) return <div className="p-10">Not found</div>;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 lg:px-10 pt-24 pb-12">
        <Link href="/admin/courses" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          ← Back
        </Link>

        <div className="mt-4 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm p-6">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Edit Course
          </h1>

          <form action={async (fd) => { "use server"; await updateCourse(course.id, fd); }}
                className="mt-6 grid grid-cols-1 gap-4">
            <input name="name" defaultValue={course.name} className="rounded-2xl border px-4 py-3 bg-white dark:bg-zinc-950/40" />
            <input name="code" defaultValue={course.code} className="rounded-2xl border px-4 py-3 bg-white dark:bg-zinc-950/40" />
            <input name="image" defaultValue={course.image ?? ""} className="rounded-2xl border px-4 py-3 bg-white dark:bg-zinc-950/40" />
            <textarea name="description" defaultValue={course.description ?? ""} className="rounded-2xl border px-4 py-3 bg-white dark:bg-zinc-950/40 min-h-[120px]" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select name="type" defaultValue={course.type ?? "OTHER"} className="rounded-2xl border px-4 py-3 bg-white dark:bg-zinc-950/40">
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

              <select name="edLevel" defaultValue={course.edLevel ?? "OTHER"} className="rounded-2xl border px-4 py-3 bg-white dark:bg-zinc-950/40">
                <option value="OTHER">Other</option>
                <option value="MIDDLE_SCHOOL">Middle School</option>
                <option value="HIGH_SCHOOL">High School</option>
                <option value="COLLEGE">College</option>
              </select>

              <select name="difficulty" defaultValue={course.difficulty ?? "MEDIUM"} className="rounded-2xl border px-4 py-3 bg-white dark:bg-zinc-950/40">
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <button className="rounded-2xl px-5 py-3 text-sm font-medium bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}