"use server";

import { getUserByEmail } from "@/db/data/user";
import { sendPasswordResetEmail } from "@/lib/auth/mail";
import { generatePasswordResetToken } from "@/lib/auth/tokens";
import { ResetSchema } from "@/validation/auth";
import { z } from "zod";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) return { error: "invalid email" };

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  console.log("reset existingUser", existingUser);

  if (!existingUser) return { error: "email not valid" };

  const passwordResetToken = await generatePasswordResetToken(email);

  if (!passwordResetToken) return { error: "error while trying to create the token" };

  await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

  return { success: "Reset email sent!" };
};
