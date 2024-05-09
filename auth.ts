import "next-auth";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "@/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/db/data/user";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } });
    },
  },
  callbacks: {
    async signIn({ account, user }) {
      // allow any other OAuth like google or github with out email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!);

      // if (!existingUser?.emailVerified) return false;

      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as "user" | "admin";
        session.user.name = token.name;
        session.user.email = token.email as string;
      }

      console.log({ session, token });
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.role = existingUser.role;
      token.name = existingUser.name;
      token.email = existingUser.email;

      return token;
    },
  },
  session: { strategy: "jwt" },
  adapter: PrismaAdapter(db),
  ...authConfig,
});
