"use server";

import { db } from "@/db";
import { validateMyData } from "@/lib/validate-data";
import { listsToReorderSchema } from "@/validation";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type dataType = z.infer<typeof listsToReorderSchema>;

export const reorderListsAction = async (data: dataType, boardId: string) => {
  try {
    const session = await auth();
    if (!session) return { error: "unauthorized" };
    const userId = session.user?.id;

    const itemsToUpdate = validateMyData(listsToReorderSchema, data);

    const curBoard = await db.board.findUnique({
      where: { id: boardId },
      select: { id: true, name: true, workspace: { select: { adminId: true } } },
    });
    if (!curBoard) return { error: "board does not exist" };
    if (curBoard.workspace?.adminId !== userId) return { error: "unauthorized" };

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
