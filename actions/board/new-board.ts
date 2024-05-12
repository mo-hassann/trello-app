"use server";

import { db } from "@/db";
import { validateMyData } from "@/lib/validate-data";
import { newBoardFormSchema } from "@/validation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { currentUser } from "@/lib/auth";

type dataType = z.infer<typeof newBoardFormSchema>;

export const createNewBoard = async (data: dataType, workspaceId: string) => {
  try {
    const curUser = await currentUser();
    if (!curUser || !curUser.id) return { error: "unauthorized" };

    const { name, boardColor } = validateMyData(newBoardFormSchema, data);

    const curWorkspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      select: { id: true, adminId: true, members: { select: { id: true } } },
    });
    if (!curWorkspace) return { error: "workspace does not exist" };
    if (curWorkspace.adminId !== curUser.id) return { error: "unauthorized" };

    // get workspace members to add them to the new board
    const workspaceMembersIds = curWorkspace.members;

    const newBoard = await db.board.create({
      data: {
        name,
        workspaceId,
        backgroundColor: boardColor,
        adminId: curUser.id,
        members: { connect: workspaceMembersIds },
      },
    });

    revalidatePath(`/workspaces/${workspaceId}`);

    return { success: `${newBoard.name} created successfully`, data: newBoard };
  } catch (error: any) {
    return { error: error.message || "server error" };
  }
};
