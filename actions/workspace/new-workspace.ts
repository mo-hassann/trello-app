"use server";

import { db } from "@/db";
import { validateMyData } from "@/lib/validate-data";
import { newWorkspaceFormSchema } from "@/validation";
import { auth } from "@clerk/nextjs";
import { revalidateTag } from "next/cache";
import { z } from "zod";

type dataType = z.infer<typeof newWorkspaceFormSchema>;

export const createWorkspace = async (data: dataType) => {
  try {
    const { userId } = auth();
    if (!userId) return { error: "unauthorized" };

    const { name } = validateMyData(newWorkspaceFormSchema, data);
    const workspace = await db.workspace.create({ data: { name, AdminMemberId: userId } });
    revalidateTag("workspaces");
    return { success: `${workspace.name} created successfully`, data: workspace };
  } catch (error: any) {
    return { error: error.message || "server error" };
  }
};
