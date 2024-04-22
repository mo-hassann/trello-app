"use server";

import { workspaceFormSchema } from "../_schemas";
import { db } from "@/db";
import { validateMyData } from "@/lib/validate-data";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type dataType = z.infer<typeof workspaceFormSchema>;

export const createWorkspace = async (data: dataType) => {
  try {
    const { userId } = auth();
    if (!userId) return { error: "unauthorized" };

    const { name } = validateMyData(workspaceFormSchema, data);
    const workspace = await db.workspace.create({ data: { name, AdminMemberId: userId } });
    revalidatePath("/");
    return { success: `${workspace.name} created successfully`, data: workspace };
  } catch (error: any) {
    return { error: error.message || "server error" };
  }
};
