import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      role: string;
      image?: string;
      name?: string;
    };
  }

  interface User {
    role: string;
    image?: string;
    name?: string;
  }

  interface JWT {
    role: string;
    image?: string;
    name?: string;
  }
}
