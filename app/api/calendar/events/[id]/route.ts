import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = params.id;

  // ensure user owns it
  const event = await prisma.calendarEvent.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });

  if (!event || event.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.calendarEvent.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}