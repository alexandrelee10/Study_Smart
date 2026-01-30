import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      email?: string | null;
      username?: string;
      image?: string | null;
    };
  }

  interface User {
    username?: string;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
    image?: string | null;
  }
}
