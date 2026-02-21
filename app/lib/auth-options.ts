import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "").toLowerCase().trim();
        const password = String(credentials?.password || "");

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        // ✅ Include role (and keep id/email/name/image)
        return {
          id: user.id,
          email: user.email,
          name: user.username,
          image: user.image ?? null,
          role: (user as any).role ?? "STUDENT",
        } as any;
      },
    }),
  ],

  callbacks: {
    // ✅ Put id + role into the token (JWT)
    async jwt({ token, user }) {
      if (user) {
        (token as any).id = (user as any).id;
        (token as any).role = (user as any).role ?? "STUDENT";

        // optional: keep these if you ever want them in token too
        (token as any).name = (user as any).name ?? (token as any).name;
        (token as any).email = (user as any).email ?? (token as any).email;
        (token as any).image = (user as any).image ?? (token as any).image;
      }
      return token;
    },

    // ✅ Put token.id + token.role into session.user
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token as any).id ?? token.sub;
        (session.user as any).role = (token as any).role ?? "STUDENT";
      }
      return session;
    },
  },
};