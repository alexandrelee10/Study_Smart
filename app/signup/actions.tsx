"use server";

import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";

export async function signup(formData: FormData) {
  const firstName = String(formData.get("firstName")).toLowerCase().trim();
  const lastName = String(formData.get("lastName")).toLowerCase().trim();
  const email = String(formData.get("email") || "").toLowerCase().trim();
  const username = String(formData.get("username")).toLowerCase().trim();
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirmPassword") || "");

  if (!email || !password) throw new Error("Missing fields");
  if (password !== confirm) throw new Error("Passwords do not match");

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already in use");

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { firstName, lastName, username, email, password: hashed },
  });

  // ✅ Auto-login (creates session) and send them to dashboard
  await signIn("credentials", {
    email,
    password,         // IMPORTANT: plain password (Credentials authorize will compare)
    redirectTo: "/dashboard",
  });
}
