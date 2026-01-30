"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";

export async function signup(_: any, formData: FormData) {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!firstName || !lastName || !username || !email || !password) {
    return { ok: false, error: "Please fill out all required fields." };
  }
  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }
  if (password !== confirmPassword) {
    return { ok: false, error: "Passwords do not match." };
  }

  // unique checks
  const emailExists = await prisma.user.findUnique({ where: { email } });
  if (emailExists) return { ok: false, error: "Email already in use." };

  const usernameExists = await prisma.user.findUnique({ where: { username } });
  if (usernameExists) return { ok: false, error: "Username already taken." };

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { firstName, lastName, username, email, password: hashed },
  });

  // ✅ return creds so client can sign in immediately
  return { ok: true, email, password };
}
