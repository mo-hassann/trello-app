"use server";

import { db } from "@/db";
import { validateMyData } from "@/lib/validate-data";
import { cardsToReorderSchema } from "@/validation";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type dataType = z.infer<typeof cardsToReorderSchema>;

export const reorderCardAction = async (data: dataType, boardId: string) => {
  try {
    const session = await auth();
    if (!session) return { error: "unauthorized" };
    const userId = session.user?.id;

    const itemsToReorder = validateMyData(cardsToReorderSchema, data);

    const curBoard = await db.board.findUnique({
      where: { id: boardId },
      select: { id: true, name: true, workspace: { select: { adminId: true } } },
    });
    if (!curBoard) return { error: "board does not exist" };
    if (curBoard.workspace?.adminId !== userId) return { error: "unauthorized" };

    await Promise.all(
      itemsToReorder.map(async (item) => {
        await db.card.update({
          where: { id: item.id },
          data: { index: item.newIndex, ...(item.newListId && { listId: item.newListId }) },
        });
      })
    );

    revalidatePath(`/boards/${curBoard.id}`);

    return { success: `${curBoard.name} cards reordered successfully` };
  } catch (error: any) {
    return { error: error.message || "server error" };
  }
};
