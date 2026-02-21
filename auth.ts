import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "")
          .toLowerCase()
          .trim();
        const password = String(credentials?.password || "");

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        // ✅ include id + role so JWT/session can carry them
        return {
          id: user.id,
          email: user.email,
          username: user.username,
          image: user.image ?? null,
          role: (user as any).role ?? "STUDENT",
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // ✅ runs on sign in (user exists), then on future requests (user is undefined)
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role ?? "STUDENT";
        token.username = (user as any).username;
        token.image = (user as any).image ?? null;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        // ✅ expose to session.user
        (session.user as any).id = token.id ?? token.sub;
        (session.user as any).role = token.role ?? "STUDENT";
        (session.user as any).username = token.username as string;
        (session.user as any).image = (token.image as string | null) ?? null;
      }
      return session;
    },
  },
});