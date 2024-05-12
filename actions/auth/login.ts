"use server";

import { LoginSchema } from "@/validation/auth";
import { z } from "zod";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/db/data/user";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "email does not exist!" };
  }

  // if (!existingUser.emailVerified) {
  //   const verificationToken = await generateVerificationToken(existingUser.email);
  //   if (verificationToken) {
  //     sendVerificationEmail(verificationToken.email, verificationToken.token);
  //     return { success: "Confirmation email sent!" };
  //   }
  //   return { error: "failed to send email verification!" };
  // }

  try {
    await signIn("credentials", { email, password, redirectTo: DEFAULT_LOGIN_REDIRECT });
    return { success: "Email sent!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "credentials error!" };
        default:
          return { error: "something went wrong!" };
      }
    }
    throw error; // to redirect with next auth
  }
};
