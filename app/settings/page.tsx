// app/settings/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prisma";
import FooterPage from "../components/Footer";
import SettingsClient from "./SettingsClient";
import ProfileImageUpload from "./ProfileImageUpload";
import PricingPage from "../components/pricing/page";

export const metadata = { title: "Study Smart | Settings" };

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signin");

  const userId = (session.user as any).id as string;
  if (!userId) redirect("/signin");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true, email: true, image: true },
  });

  if (!user) redirect("/signin");

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-8 lg:px-10 pt-24 pb-12">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to dashboard
          </Link>

          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Account Settings
          </div>
        </div>

        <div className="space-y-6">
          <ProfileImageUpload currentImage={user.image} />

          {/* Username/Email/Password settings */}
          <SettingsClient
            initial={{
              username: user.username,
              email: user.email,
              image: user.image,
            }}
          />
        </div>
      </div>

      <FooterPage />
    </main>
  );
}
