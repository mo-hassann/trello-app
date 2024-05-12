"use server";

import { db } from "@/db";
import { validateMyData } from "@/lib/validate-data";
import { listsToReorderSchema } from "@/validation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { currentUser } from "@/lib/auth";

type dataType = z.infer<typeof listsToReorderSchema>;

export const reorderListsAction = async (data: dataType, boardId: string) => {
  try {
    const curUser = await currentUser();
    if (!curUser || !curUser.id) return { error: "unauthorized" };

    const itemsToUpdate = validateMyData(listsToReorderSchema, data);

    const curBoard = await db.board.findUnique({
      where: { id: boardId },
      select: { id: true, name: true, members: { select: { id: true } } },
    });
    if (!curBoard) return { error: "board does not exist" };

    // check if the user is member in the board
    const userIsBoardMember = curBoard.members.some((member) => member.id === curUser.id);
    if (!userIsBoardMember) return { error: "you are not member in this board" };

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
