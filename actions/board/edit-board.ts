"use server";

import { db } from "@/db";
import { validateMyData } from "@/lib/validate-data";
import { editBoardFormSchema } from "@/validation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { currentUser } from "@/lib/auth";

type dataType = z.infer<typeof editBoardFormSchema>;

export const editBoard = async (data: dataType, boardId?: string) => {
  try {
    if (!boardId) return { error: "board id is missing" };

    const curUser = await currentUser();
    if (!curUser || !curUser.id) return { error: "unauthorized" };

    const { name } = validateMyData(editBoardFormSchema, data);

    const curBoard = await db.board.findUnique({
      where: { id: boardId },
      select: { adminId: true },
    });

    if (!curBoard) return { error: "board does not exist" };
    if (curBoard.adminId !== curUser.id)
      return { error: "you do not have permission to do this action" };

    const board = await db.board.update({
      data: { name },
      where: { id: boardId, adminId: curUser.id },
    });

    revalidatePath("/");
    revalidatePath(`/boards/${board.id}`);

    return { success: `${board.name} updated successfully`, data: board };
  } catch (error: any) {
    return { error: error.message || "server error" };
  }
};
