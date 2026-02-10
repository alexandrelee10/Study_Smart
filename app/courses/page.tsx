// app/courses/page.tsx
import { prisma } from "@/app/lib/prisma";
import CoursesClient from "./CourseClient";

export const metadata = { title: "Courses | Study Smart" };

export default async function CoursesPage() {
  const courseContent = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <CoursesClient courseContent={courseContent} />;
}
