"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prisma";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

async function requireUserId() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

export async function addPlanItem(formData: FormData) {
  const userId = await requireUserId();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const today = startOfDay(new Date());

  // put new items at the bottom
  const last = await prisma.planItem.findFirst({
    where: { userId, date: today },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const nextOrder = (last?.order ?? -1) + 1;

  await prisma.planItem.create({
    data: {
      userId,
      date: today,
      title,
      done: false,
      order: nextOrder,
    },
  });

  revalidatePath("/goals");
  revalidatePath("/dashboard");
}

export async function togglePlanItem(id: string) {
  const userId = await requireUserId();

  const item = await prisma.planItem.findFirst({
    where: { id, userId },
    select: { done: true },
  });
  if (!item) return;

  await prisma.planItem.update({
    where: { id },
    data: { done: !item.done },
  });

  revalidatePath("/goals");
  revalidatePath("/dashboard");
}

export async function deletePlanItem(id: string) {
  const userId = await requireUserId();

  await prisma.planItem.deleteMany({
    where: { id, userId },
  });

  revalidatePath("/goals");
  revalidatePath("/dashboard");
}

export async function movePlanItem(id: string, direction: "up" | "down") {
  const userId = await requireUserId();
  const today = startOfDay(new Date());

  const items = await prisma.planItem.findMany({
    where: { userId, date: today },
    orderBy: { order: "asc" },
    select: { id: true, order: true },
  });

  const idx = items.findIndex((x) => x.id === id);
  if (idx === -1) return;

  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= items.length) return;

  const a = items[idx];
  const b = items[swapWith];

  // swap order values
  await prisma.$transaction([
    prisma.planItem.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.planItem.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);

  revalidatePath("/goals");
  revalidatePath("/dashboard");
}
