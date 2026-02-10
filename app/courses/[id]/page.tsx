// app/courses/[id]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma"; // adjust path if needed
import FooterPage from "@/app/components/Footer";

const formatEnum = (value?: string | null) =>
  (value ?? "OTHER").split("_").join(" ");

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap params
  const { id } = await params;

  if (!id) return notFound();

  const course = await prisma.course.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      image: true,
      type: true,
      edLevel: true, // ✅ your schema shows edLevel
      createdAt: true,
    },
  });

  if (!course) return notFound();

  return (
    <div className="min-h-screen pt-28 p-6">
      <div className="mx-auto max-w-4xl">
        <button className="p-3 underline text-zinc-500 dark:text-white hover:text-zinc-900 transition-all">Back</button>
        <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          {/* Image */}
          <div className="relative h-60 w-full bg-zinc-100 dark:bg-zinc-900">
            <Image
              src={course.image || "/assets/courses/ca.png"}
              alt={course.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="bg-white p-6 dark:bg-zinc-900">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              {course.name}
            </h1>

            <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              {formatEnum(course.type)} • {formatEnum(course.edLevel)}
            </div>

            <div className="my-6 h-px w-full bg-zinc-200 dark:bg-zinc-800" />

            <p className="text-zinc-700 dark:text-zinc-200">
              Put course description / lessons / assignments here.
            </p>
          </div>
        </div>
        <FooterPage />
      </div>
    </div>
  );
}