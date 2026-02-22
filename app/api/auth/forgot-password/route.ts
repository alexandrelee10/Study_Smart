import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/app/lib/prisma";

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as { email?: string };
    const cleanEmail = (email ?? "").trim().toLowerCase();

    // Always respond OK to prevent email enumeration
    if (!cleanEmail) return NextResponse.json({ ok: true });

    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user) {
      return NextResponse.json({ ok: true });
    }

    // Create token + expiry
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = sha256(token);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

    // You need these fields in your User model:
    // resetTokenHash String?  resetTokenExpiresAt DateTime?
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetTokenHash: tokenHash,
        resetTokenExpiresAt: expiresAt,
      },
    });

    // For now: print link. In production: email this link.
    const resetLink = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/reset-password?token=${token}`;
    console.log("🔐 Password reset link:", resetLink);

    return NextResponse.json({ ok: true });
  } catch {
    // still return OK to avoid leaking anything
    return NextResponse.json({ ok: true });
  }
}