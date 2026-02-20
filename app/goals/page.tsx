import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prisma";
import FooterPage from "../components/Footer";
import PlanClient, { type PlanItemDTO } from "./PlanClient";

export const metadata = { title: "Today's Plan" };

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export default async function GoalsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signin");

  const userId = (session.user as any).id as string;
  if (!userId) redirect("/signin");

  const today = startOfDay(new Date());

  const items = await prisma.planItem.findMany({
    where: { userId, date: today },
    orderBy: { order: "asc" },
    select: { id: true, title: true, done: true, order: true },
  });

  const dto: PlanItemDTO[] = items;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-4 sm:px-8 lg:px-10 pt-24 pb-12">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to dashboard
          </Link>

          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {new Date().toLocaleDateString()}
          </div>
        </div>

        <PlanClient items={dto} />
      </div>

      <FooterPage />
    </main>
  );
}
