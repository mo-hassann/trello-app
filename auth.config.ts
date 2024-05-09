import type { NextAuthConfig } from "next-auth";
import credentials from "next-auth/providers/credentials";
import { getUserByEmail } from "@/db/data/user";
import { LoginSchema } from "@/validation/auth";
import bcrypt from "bcryptjs";
import github from "next-auth/providers/github";

export default {
  providers: [
    github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    credentials({
      // @ts-ignore
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);

          if (!user || !user.password) return null;

          const PasswordMatch = await bcrypt.compare(password, user.password);
          if (PasswordMatch) return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
