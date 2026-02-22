import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function POST(req: Request) {
  try {
    const { token, password } = (await req.json()) as {
      token?: string;
      password?: string;
    };

    const cleanToken = (token ?? "").trim();
    const cleanPass = (password ?? "").trim();

    if (!cleanToken || cleanPass.length < 8) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const tokenHash = sha256(cleanToken);

    const user = await prisma.user.findFirst({
      where: {
        resetTokenHash: tokenHash,
        resetTokenExpiresAt: { gt: new Date() },
      },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired link. Please request a new one." },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(cleanPass, 10);

    // You need a passwordHash field on your user model (or whatever you use)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashed,
        resetTokenHash: null,
        resetTokenExpiresAt: null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}