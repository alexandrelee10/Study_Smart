import { type DefaultSession, type NextAuthOptions } from "next-auth";
import { env } from "@/app/env";
import { prisma } from "@/app/server/db";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginSchema } from "@/app/validation/auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      isAdmin: boolean;
    };
  }
}

const AdminEmails = ["example12@gmail.com", "example123@gmail.com"];

export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email!;
        token.isAdmin = AdminEmails.includes(token.email);
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const cred = await loginSchema.parseAsync(credentials);

        const user = await prisma.user.findFirst({
          where: { email: cred.email },
        });

        if (!user) return null;

        const isValidPassword = bcrypt.compareSync(cred.password, user.password);
        if (!isValidPassword) return null;

        return { id: user.id, email: user.email };
      },
    }),
  ],
};
