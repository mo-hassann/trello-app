"use server";

import { getPasswordResetTokenByToken } from "@/db/data/password-reset-token";
import { getUserByEmail } from "@/db/data/user";
import { newPasswordSchema } from "@/validation/auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/db";

export const newPassword = async (values: z.infer<typeof newPasswordSchema>, token: string) => {
  const validatedFields = newPasswordSchema.safeParse(values);

  if (!validatedFields.success) return { error: "invalid inputs." };
  if (!token) return { error: "no tokens." };

  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) return { error: "token doesn't exist" };

  const tokenExpires = new Date() > existingToken.expires;
  if (tokenExpires) return { error: "token expires." };

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) return { error: "email not found." };

  const { password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.update({ where: { id: existingUser.id }, data: { password: hashedPassword } });

  await db.passwordResetToken.delete({ where: { id: existingToken.id } });

  return { success: "Password Updated" };
};
