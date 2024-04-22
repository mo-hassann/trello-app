"use server";

import { db } from "@/db";
import { validateMyData } from "@/lib/validate-data";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { newBoardFromSchema } from "../_schemas";

type dataType = z.infer<typeof newBoardFromSchema>;

export const createNewBoard = async (data: dataType, workspaceId: string) => {
  try {
    const { userId } = auth();
    if (!userId) return { error: "unauthorized" };

    const { name, boardColor } = validateMyData(newBoardFromSchema, data);

    const curWorkspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      select: { id: true, AdminMemberId: true },
    });
    if (!curWorkspace) return { error: "workspace does not exist" };
    if (curWorkspace.AdminMemberId !== userId) return { error: "unauthorized" };

    const newBoard = await db.board.create({
      data: { name, workspaceId, backroundColor: boardColor },
    });

    revalidatePath(`/workspaces/${workspaceId}`);

    return { success: `${newBoard.name} created successfully`, data: newBoard };
  } catch (error: any) {
    return { error: error.message || "server error" };
  }
};
