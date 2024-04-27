"use server";

import { db } from "@/db";
import { validateMyData } from "@/lib/validate-data";
import { cardsToReorderSchema } from "@/validation";
import { auth } from "@clerk/nextjs";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

type dataType = z.infer<typeof cardsToReorderSchema>;

export const reorderCardAction = async (data: dataType, boardId: string) => {
  try {
    const { userId } = auth();
    if (!userId) return { error: "unauthorized" };

    const itemsToReorder = validateMyData(cardsToReorderSchema, data);

    const curBoard = await db.board.findUnique({
      where: { id: boardId },
      select: { id: true, name: true, workspace: { select: { AdminMemberId: true } } },
    });
    if (!curBoard) return { error: "board does not exist" };
    if (curBoard.workspace?.AdminMemberId !== userId) return { error: "unauthorized" };

    await Promise.all(
      itemsToReorder.map(async (item) => {
        await db.card.update({
          where: { id: item.id },
          data: { index: item.newIndex, ...(item.newListId && { listId: item.newListId }) },
        });
      })
    );

    revalidatePath(`/boards/${curBoard.id}`);
    revalidateTag(`lists`);

    return { success: `${curBoard.name} cards reordered successfully` };
  } catch (error: any) {
    return { error: error.message || "server error" };
  }
};
