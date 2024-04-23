"use server";

import { db } from "@/db";
import { validateMyData } from "@/lib/validate-data";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { listsToUpdateSchema } from "../_schemas";

type dataType = z.infer<typeof listsToUpdateSchema>;

export const reorderListsAction = async (data: dataType, boardId: string) => {
  try {
    const { userId } = auth();
    if (!userId) return { error: "unauthorized" };

    const itemsToUpdate = validateMyData(listsToUpdateSchema, data);

    const curBoard = await db.board.findUnique({
      where: { id: boardId },
      select: { id: true, name: true, workspace: { select: { AdminMemberId: true } } },
    });
    if (!curBoard) return { error: "board does not exist" };
    if (curBoard.workspace?.AdminMemberId !== userId) return { error: "unauthorized" };

    await Promise.all(
      itemsToUpdate.map(async (item) => {
        await db.list.update({
          where: { id: item.id },
          data: { index: item.newIndex },
        });
      })
    );

    revalidatePath(`/boards/${curBoard.id}`);

    return { success: `${curBoard.name} lists updated successfully` };
  } catch (error: any) {
    return { error: error.message || "server error" };
  }
};
