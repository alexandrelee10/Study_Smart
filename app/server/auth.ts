import NextAuth, { type DefaultSession, type NextAuthOptions } from "next-auth";
import { env } from "@/app/env"
import { db } from "@/app/server/db";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginSchema } from "@/app/validation/auth";
/**
 * Module augmentation for `next-auth` types to add custom properties to the `session` object.
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      isAdmin: boolean;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

const AdminEmails = [
  "example12@gmail.com",
  "example123@gmail.com",
  // Add more admin emails here as needed
];

export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email!;
        token.isAdmin = AdminEmails.includes(token.email); // Assigns `isAdmin` based on email
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean; // Ensures admin status is in the session
      }
      return session;
    },
  },
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
    newUser: "/signup",
    error: "/signin",
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

        // Find user in the database
        const user = await db.user.findFirst({
          where: { email: cred.email },
        });

        if (!user) return null;

        // Verify password
        const isValidPassword = bcrypt.compareSync(cred.password, user.password);
        if (!isValidPassword) return null;

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
};

export default NextAuth(authOptions);