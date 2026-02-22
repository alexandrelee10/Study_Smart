import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth-options";

export async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/signin"); 

    const role = (session.user as any).role as string | undefined;
    if (role !== "ADMIN") redirect("/dashboard");

    return session;
}