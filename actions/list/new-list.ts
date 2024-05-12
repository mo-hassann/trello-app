"use server";

import { db } from "@/db";
import { currentUser } from "@/lib/auth";
import { validateMyData } from "@/lib/validate-data";
import { newListFromSchema } from "@/validation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type dataType = z.infer<typeof newListFromSchema>;

export const createNewList = async (data: dataType, boardId?: string) => {
  try {
    if (!boardId) return { error: "missing board id" };
    const curUser = await currentUser();
    if (!curUser || !curUser.id) return { error: "unauthorized" };

    const { name } = validateMyData(newListFromSchema, data);

    const curBoard = await db.board.findUnique({
      where: { id: boardId },
      select: { id: true, members: { select: { id: true } } },
    });
    if (!curBoard) return { error: "board does not exist" };

    // check if the user is member in the board
    const userIsBoardMember = curBoard.members.some((member) => member.id === curUser.id);
    if (!userIsBoardMember) return { error: "you are not member in this board" };

    const listNumbers = await db.list.count({
      where: { boardId },
    });

    const newList = await db.list.create({
      data: { name, boardId: curBoard.id, index: listNumbers, userId: curUser.id },
    });

    revalidatePath(`/boards/${curBoard.id}`);

    return { success: `${newList.name} created successfully`, data: newList };
  } catch (error: any) {
    return { error: error.message || "server error" };
  }
};
