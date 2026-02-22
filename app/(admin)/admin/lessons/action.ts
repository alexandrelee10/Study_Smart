"use server";

import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/require-admin";
import { redirect } from "next/navigation";

function str(fd: FormData, key: string) {
  return String(fd.get(key) ?? "").trim();
}
function bool(fd: FormData, key: string) {
  // checkbox returns "on" when checked
  return fd.get(key) === "on";
}
function intOrNull(fd: FormData, key: string) {
  const raw = String(fd.get(key) ?? "").trim();
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export async function createLesson(fd: FormData) {
  await requireAdmin();

  const name = str(fd, "name");
  const description = str(fd, "description");
  const courseId = str(fd, "courseId");
  const order = intOrNull(fd, "order");

  if (!name || !courseId) {
    redirect("/admin/lessons/new?error=1");
  }

  await prisma.lesson.create({
    data: {
      name,
      description: description || "",
      courseId,
      // If your Lesson model doesn't have these fields, delete them:
      order: order ?? 1,
      isPublished: bool(fd, "isPublished"),
      isPreview: bool(fd, "isPreview"),
    } as any,
  });

  redirect("/admin/lessons?saved=1");
}

export async function updateLesson(lessonId: string, fd: FormData) {
  await requireAdmin();

  const name = str(fd, "name");
  const description = str(fd, "description");
  const courseId = str(fd, "courseId");
  const order = intOrNull(fd, "order");

  if (!lessonId || !name || !courseId) {
    redirect(`/admin/lessons/${lessonId}/edit?error=1`);
  }

  await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      name,
      description: description || "",
      courseId,
      order: order ?? 1,
      isPublished: bool(fd, "isPublished"),
      isPreview: bool(fd, "isPreview"),
    } as any,
  });

  redirect("/admin/lessons?saved=1");
}

export async function deleteLesson(lessonId: string) {
  await requireAdmin();

  if (!lessonId) redirect("/admin/lessons");

  await prisma.lesson.delete({ where: { id: lessonId } });
  redirect("/admin/lessons?deleted=1");
}