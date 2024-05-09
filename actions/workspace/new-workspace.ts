"use server";

import { db } from "@/db";
import { validateMyData } from "@/lib/validate-data";
import { newWorkspaceFormSchema } from "@/validation";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { currentUser } from "@/lib/auth";

type dataType = z.infer<typeof newWorkspaceFormSchema>;

export const createWorkspace = async (data: dataType) => {
  try {
    const curUser = await currentUser();
    if (!curUser || !curUser.id) return { error: "unauthorized" };

    const { name } = validateMyData(newWorkspaceFormSchema, data);
    const workspace = await db.workspace.create({
      data: { name, adminId: curUser.id, members: { connect: { id: curUser.id } } },
    });

    revalidatePath("/");
    revalidatePath(`/workspaces/${workspace.id}`);

    return { success: `${curUser.name} created ${workspace.name} successfully`, data: workspace };
  } catch (error: any) {
    return { error: error.message || "server error" };
  }
};
