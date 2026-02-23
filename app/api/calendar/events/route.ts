import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ events: [] });
    }

    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;

    const where: any = { userId };

    if (fromDate && !Number.isNaN(fromDate.getTime())) {
      where.startAt = { ...(where.startAt ?? {}), gte: fromDate };
    }
    if (toDate && !Number.isNaN(toDate.getTime())) {
      where.startAt = { ...(where.startAt ?? {}), lt: toDate };
    }

    const events = await prisma.calendarEvent.findMany({
      where,
      orderBy: { startAt: "asc" },
      select: { id: true, title: true, type: true, startAt: true, courseId: true },
    });

    return NextResponse.json({
      events: events.map((e) => ({
        ...e,
        startAt: e.startAt.toISOString(),
      })),
    });
  } catch (e: any) {
    console.error("GET /api/calendar/events error:", e);
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const title = String(body?.title ?? "").trim();
    const type = body?.type ?? "STUDY";
    const startAt = new Date(body?.startAt);

    if (!title) {
      return NextResponse.json({ error: "Title required" }, { status: 400 });
    }
    if (Number.isNaN(startAt.getTime())) {
      return NextResponse.json({ error: "Invalid startAt" }, { status: 400 });
    }

    const created = await prisma.calendarEvent.create({
      data: {
        title,
        type,
        startAt,
        userId,
        courseId: body?.courseId ?? null,
      },
      select: { id: true, title: true, type: true, startAt: true, courseId: true },
    });

    return NextResponse.json({
      event: { ...created, startAt: created.startAt.toISOString() },
    });
  } catch (e: any) {
    console.error("POST /api/calendar/events error:", e);
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}