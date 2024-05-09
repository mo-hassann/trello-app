"use server";

import { db } from "@/db";
import { validateMyData } from "@/lib/validate-data";
import { newListFromSchema } from "@/validation";
import { auth } from "@/auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

type dataType = z.infer<typeof newListFromSchema>;

export const createNewList = async (data: dataType, boardId: string) => {
  try {
    const session = await auth();
    if (!session) return { error: "unauthorized" };
    const userId = session.user?.id;

    const { name } = validateMyData(newListFromSchema, data);

    const curBoard = await db.board.findUnique({
      where: { id: boardId },
      select: { id: true, workspace: { select: { adminId: true } } },
    });
    if (!curBoard) return { error: "board does not exist" };
    if (curBoard.workspace?.adminId !== userId) return { error: "unauthorized" };

    const listNumbers = await db.list.count({
      where: { boardId },
    });
    const newList = await db.list.create({
      data: { name, boardId: curBoard.id, index: listNumbers },
    });

    revalidatePath(`/boards/${newList.boardId}`);
    revalidateTag(`lists`);

    return { success: `${newList.name} created successfully`, data: newList };
  } catch (error: any) {
    return { error: error.message || "server error" };
  }
};
