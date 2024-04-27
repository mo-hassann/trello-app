"use server";

import { db } from "@/db";
import { validateMyData } from "@/lib/validate-data";
import { editWorkspaceFormSchema } from "@/validation";
import { auth } from "@clerk/nextjs";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

type dataType = z.infer<typeof editWorkspaceFormSchema>;

export const editWorkspace = async (data: dataType, workspaceId?: string) => {
  try {
    const { userId } = auth();
    if (!userId) return { error: "unauthorized" };

    const { name, isPublic } = validateMyData(editWorkspaceFormSchema, data);
    if (!workspaceId) return { error: "workspace id is missing" };
    const curWorkspace = await db.workspace.findUnique({
      where: { id: workspaceId, AdminMemberId: userId },
    });
    if (!curWorkspace) return { error: "could not find work space" };
    const workspace = await db.workspace.update({
      data: { name, isPublic },
      where: { id: workspaceId, AdminMemberId: userId },
    });
    revalidatePath(`/workspaces/${workspace.id}`);
    revalidatePath(`/workspaces/${workspace.id}/settings`);
    revalidateTag("workspaces");
    return { success: `${workspace.name} updated successfully`, data: workspace };
  } catch (error: any) {
    return { error: error.message || "server error" };
  }
};
