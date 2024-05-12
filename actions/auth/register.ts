"use server";

import { RegisterSchema } from "@/validation/auth";
import { z } from "zod";
import { db } from "@/db";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/db/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { email, password, name } = validatedFields.data;

  // check if the user is already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) return { error: "this email is already exist!" };

  // hash the password and create new user
  const hashedPassword = await bcrypt.hash(password, 8);
  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // const verificationToken = await generateVerificationToken(email);

  // // send an email verification
  // if (verificationToken) {
  //   sendVerificationEmail(verificationToken.email, verificationToken.token);
  // }

  return { success: "Email sent!" };
};
