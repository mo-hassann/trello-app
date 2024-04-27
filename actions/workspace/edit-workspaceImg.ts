"use server";

import { db } from "@/db";
import { validateMyData } from "@/lib/validate-data";
import { editWorkspaceImgSchema } from "@/validation";
import { auth } from "@clerk/nextjs";
import { revalidatePath, revalidateTag } from "next/cache";
import { UTApi } from "uploadthing/server";
import { z } from "zod";

type dataType = z.infer<typeof editWorkspaceImgSchema>;

export const editWorkspaceImgAction = async (data: dataType, workspaceId?: string) => {
  try {
    const { userId } = auth();
    if (!userId) return { error: "unauthorized" };

    const { url } = validateMyData(editWorkspaceImgSchema, data);
    if (!workspaceId) return { error: "workspace id is missing" };
    const curWorkspace = await db.workspace.findUnique({
      where: { id: workspaceId, AdminMemberId: userId },
    });
    if (!curWorkspace) return { error: "could not find work space" };

    // if there is any img delete it in upload thing
    try {
      if (curWorkspace.icon) {
        const fileName = curWorkspace.icon.substring(curWorkspace.icon.lastIndexOf("/") + 1);
        console.log(fileName, "fileName");
        const utapi = new UTApi();
        const res = await utapi.deleteFiles(fileName);
        console.log(res.success, "result from uploadthing");
      }
    } catch (error: any) {
      console.log("error in deleting cur file:", error.message);
    }

    const workspace = await db.workspace.update({
      data: { icon: url },
      where: { id: workspaceId, AdminMemberId: userId },
    });
    revalidatePath(`/workspaces/${workspace.id}`);
    revalidatePath(`/workspaces/${workspace.id}/settings`);
    revalidateTag("workspaces");
    return { success: `${workspace.name} image updated successfully`, data: workspace };
  } catch (error: any) {
    console.log("SERVER ERROR: " + error.message);
    return { error: error.message || "server error" };
  }
};
