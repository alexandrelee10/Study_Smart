import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prisma";

// GET /api/calendar/events?from=2026-02-01&to=2026-02-29
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const fromDate = from ? new Date(from) : null;
  const toDate = to ? new Date(to) : null;

  const events = await prisma.calendarEvent.findMany({
    where: {
      userId,
      ...(fromDate && toDate
        ? { startAt: { gte: fromDate, lt: toDate } }
        : {}),
    },
    orderBy: { startAt: "asc" },
  });

  return NextResponse.json({ events });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);

  const title = String(body?.title ?? "").trim();
  const type = String(body?.type ?? "STUDY").trim(); // must match your enum
  const startAtRaw = String(body?.startAt ?? "").trim();
  const courseId = body?.courseId ? String(body.courseId) : null;

  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });
  if (!startAtRaw) return NextResponse.json({ error: "startAt required" }, { status: 400 });

  const startAt = new Date(startAtRaw);
  if (Number.isNaN(startAt.getTime())) {
    return NextResponse.json({ error: "Invalid startAt" }, { status: 400 });
  }

  const created = await prisma.calendarEvent.create({
    data: {
      userId,
      title,
      type: type as any,
      startAt,
      courseId,
      isRecurring: false,
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: created.id });
}