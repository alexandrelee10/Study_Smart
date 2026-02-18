"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

/* ---------------- helpers ---------------- */

async function requireUserId() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

function clean(v: unknown) {
  return String(v ?? "").trim();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUsername(username: string) {
  // 3–20 chars, letters/numbers/underscore only
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

function isValidUrl(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/* ---------------- actions ---------------- */

/**
 * Updates username/email (and optionally image if you still want it here).
 * NOTE: If you're using UploadThing, you can ignore image here and use setProfileImage().
 */
export async function updateProfile(formData: FormData) {
  const userId = await requireUserId();

  const username = clean(formData.get("username"));
  const email = clean(formData.get("email")).toLowerCase();
  const image = clean(formData.get("image")); // optional: keep for URL-based fallback

  const data: { username?: string; email?: string; image?: string | null } = {};

  if (username) {
    if (!isValidUsername(username)) {
      throw new Error(
        "Username must be 3–20 characters and only letters/numbers/underscore."
      );
    }
    data.username = username;
  }

  if (email) {
    if (!isValidEmail(email)) throw new Error("Invalid email format.");
    data.email = email;
  }

  // Optional: allow setting/clearing image via URL input (not required if using upload)
  if (image) {
    if (!isValidUrl(image)) {
      throw new Error("Profile image must be a valid URL (https://...).");
    }
    data.image = image;
  } else if (formData.has("image")) {
    // only clear if the field exists in the form
    data.image = null;
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data,
    });
  } catch (err: any) {
    const msg = String(err?.message ?? "");
    if (msg.includes("Unique constraint") || msg.includes("Unique constraint failed")) {
      throw new Error("That username or email is already taken.");
    }
    throw err;
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
}

/**
 * Sets/clears profile image URL (used by UploadThing flow).
 */
export async function setProfileImage(imageUrl: string | null) {
  const userId = await requireUserId();

  if (imageUrl !== null) {
    const url = clean(imageUrl);
    if (!url) throw new Error("Missing image URL.");
    if (!isValidUrl(url)) throw new Error("Invalid image URL returned from upload.");
    imageUrl = url;
  }

  await prisma.user.update({
    where: { id: userId },
    data: { image: imageUrl },
  });

  revalidatePath("/settings");
  revalidatePath("/dashboard");
}

/**
 * Change password (checks current password first).
 */
export async function changePassword(formData: FormData) {
  const userId = await requireUserId();

  const currentPassword = clean(formData.get("currentPassword"));
  const newPassword = clean(formData.get("newPassword"));
  const confirmPassword = clean(formData.get("confirmPassword"));

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Error("Fill out all password fields.");
  }
  if (newPassword !== confirmPassword) {
    throw new Error("New password and confirm password do not match.");
  }
  if (newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });

  if (!user) throw new Error("User not found.");

  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) throw new Error("Current password is incorrect.");

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });

  revalidatePath("/settings");
}
