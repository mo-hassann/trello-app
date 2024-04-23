"use server";

import { db } from "@/db";
import { validateMyData } from "@/lib/validate-data";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { newListFromSchema } from "../_schemas";

type dataType = z.infer<typeof newListFromSchema>;

export const createNewList = async (data: dataType, boardId: string) => {
  try {
    const { userId } = auth();
    if (!userId) return { error: "unauthorized" };

    const { name } = validateMyData(newListFromSchema, data);

    const curBoard = await db.board.findUnique({
      where: { id: boardId },
      select: { id: true, workspace: { select: { AdminMemberId: true } } },
    });
    if (!curBoard) return { error: "board does not exist" };
    if (curBoard.workspace?.AdminMemberId !== userId) return { error: "unauthorized" };

    const listNumbers = await db.list.count({
      where: { boardId },
    });
    const newList = await db.list.create({
      data: { name, boardId: curBoard.id, index: listNumbers },
    });

    revalidatePath(`/boards/${newList.boardId}`);

    return { success: `${newList.name} created successfully`, data: newList };
  } catch (error: any) {
    return { error: error.message || "server error" };
  }
};
