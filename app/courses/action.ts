"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function requireUserId(session: any) {
  const userId = session?.user?.id as string | undefined;
  if (!userId) redirect("/signin?next=/courses");
  return userId;
}

export async function enrollInCourse(courseId: string) {
  const session = await getServerSession(authOptions);
  const userId = requireUserId(session);

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: {},
    create: { userId, courseId },
  });

  revalidatePath("/courses");
  revalidatePath("/my-courses");
}

export async function unenrollFromCourse(courseId: string) {
  const session = await getServerSession(authOptions);
  const userId = requireUserId(session);

  await prisma.enrollment
    .delete({
      where: { userId_courseId: { userId, courseId } },
    })
    .catch(() => null);

  revalidatePath("/my-courses");
  revalidatePath("/courses");
}
