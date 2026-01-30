"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";

function slugifyUsername(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 18);
}

export async function signup(formData: FormData) {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  // ✅ required fields
  if (!firstName || !lastName) {
    return { error: "First and last name are required." };
  }
  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  // ✅ unique email check
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return { error: "An account with that email already exists." };
  }

  // ✅ generate a unique username (since your schema requires it)
  const base = slugifyUsername(`${firstName}${lastName}`) || "user";
  let username = base;

  // try a few times to avoid collisions
  for (let i = 0; i < 5; i++) {
    const taken = await prisma.user.findUnique({ where: { username } });
    if (!taken) break;
    username = `${base}${Math.floor(1000 + Math.random() * 9000)}`; // user1234
  }

  // final safety: if still taken, bail
  const stillTaken = await prisma.user.findUnique({ where: { username } });
  if (stillTaken) {
    return { error: "Please try again (username collision)." };
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      username,
      firstName,
      lastName,
      email,
      password: hashed,
      // role defaults to STUDENT in schema, no need to set
    },
  });

  redirect("/signin?created=1");
}
