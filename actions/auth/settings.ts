"use server";

import { getUserById } from "@/db/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/db";
import { SettingsSchema } from "@/validation/auth";
import { z } from "zod";

export const settings = async (data: z.infer<typeof SettingsSchema>) => {
  const validatedData = SettingsSchema.safeParse(data);

  if (!validatedData.success) return { error: "data not valid" };

  const authUser = await currentUser();
  if (!authUser || !authUser.id) return { error: "not authorized" };

  const existingUser = await getUserById(authUser.id);

  if (!existingUser) return { error: "not authorized" };

  const newData = validatedData.data;

  try {
    await db.user.update({ where: { id: existingUser.id }, data: { ...newData } });
    return { success: "data updated successfully" };
  } catch {
    return { error: "error while trying to update user to: " + validatedData.data.name };
  }
};
