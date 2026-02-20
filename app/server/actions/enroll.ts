"use server";

import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { revalidatePath } from "next/cache";

export async function enrollInCourse(courseId: string) {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id as string | undefined;
  if (!userId) throw new Error("Unauthorized");

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: {},
    create: { userId, courseId },
  });

  // Pages that show “Added ✓”
  revalidatePath("/courses");
  revalidatePath("/my-courses");
}

export async function removeEnrollment(courseId: string) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) throw new Error("Unauthorized");

  await prisma.enrollment.delete({
    where: { userId_courseId: { userId, courseId } },
  });

  revalidatePath("/courses");
}