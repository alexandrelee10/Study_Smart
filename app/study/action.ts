"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prisma";

async function requireUserId() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

export async function saveStudySession(formData: FormData) {
  const userId = await requireUserId();

  const courseIdRaw = String(formData.get("courseId") ?? "");
  const courseId = courseIdRaw && courseIdRaw !== "none" ? courseIdRaw : null;

  const startedAtStr = String(formData.get("startedAt") ?? "");
  const endedAtStr = String(formData.get("endedAt") ?? "");
  const minutesStr = String(formData.get("minutes") ?? "0");
  const notes = String(formData.get("notes") ?? "").trim() || null;

  const startedAt = startedAtStr ? new Date(startedAtStr) : new Date();
  const endedAt = endedAtStr ? new Date(endedAtStr) : new Date();

  const minutes = Math.max(0, Math.round(Number(minutesStr) || 0));
  const durationMin = minutes; // keep it simple + consistent with your dashboard

  // If a course is chosen, optionally enforce enrollment
  if (courseId) {
    const enrolled = await prisma.enrollment.findFirst({
      where: { userId, courseId },
      select: { id: true },
    });
    if (!enrolled) throw new Error("Not enrolled in that course.");
  }

  await prisma.studySession.create({
    data: {
      userId,
      courseId,
      startedAt,
      endedAt,
      durationMin,
      minutes,
      notes,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/history");
  revalidatePath("/study");
}
