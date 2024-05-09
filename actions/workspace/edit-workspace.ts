"use server";

import { db } from "@/db";
import { validateMyData } from "@/lib/validate-data";
import { editWorkspaceFormSchema } from "@/validation";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { currentUser } from "@/lib/auth";

type dataType = z.infer<typeof editWorkspaceFormSchema>;

export const editWorkspace = async (data: dataType, workspaceId?: string) => {
  try {
    if (!workspaceId) return { error: "workspace id is missing" };

    const curUser = await currentUser();
    if (!curUser || !curUser.id) return { error: "unauthorized" };

    const { name, isPublic } = validateMyData(editWorkspaceFormSchema, data);

    const curWorkspace = await db.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!curWorkspace) return { error: "could not find work space" };
    if (curWorkspace.adminId !== curUser.id)
      return { error: "you do not have permission to do this action" };

    const workspace = await db.workspace.update({
      data: { name, isPublic },
      where: { id: workspaceId, adminId: curUser.id },
    });

    revalidatePath("/");
    revalidatePath(`/workspaces/${workspace.id}`);
    revalidatePath(`/workspaces/${workspace.id}/settings`);

    return { success: `${workspace.name} updated successfully`, data: workspace };
  } catch (error: any) {
    return { error: error.message || "server error" };
  }
};
