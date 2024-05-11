"use server";

import { db } from "@/db";
import { validateMyData } from "@/lib/validate-data";
import { favoriteBoardFromSchema } from "@/validation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { currentUser } from "@/lib/auth";

type dataType = z.infer<typeof favoriteBoardFromSchema>;

export const setFavoriteBoard = async (data: dataType, boardId: string) => {
  try {
    if (!boardId) return { error: "missing board id" };
    const curUser = await currentUser();
    if (!curUser || !curUser.id) return { error: "unauthorized" };

    const { favoriteState } = validateMyData(favoriteBoardFromSchema, data);

    const curBoard = await db.board.findUnique({
      where: { id: boardId },
      select: { id: true, workspaceId: true, name: true },
    });
    if (!curBoard) return { error: "board does not exist" };

    const user = await db.user.findUnique({ where: { id: curUser.id }, select: { id: true } });
    if (!user) return { error: "user does not exist" };

    if (favoriteState === true) {
      // create favorite connection between user and board
      await db.favoriteBoard.create({ data: { boardId: curBoard.id, userId: user.id } });

      revalidatePath(`/workspaces/${curBoard.workspaceId}`);

      return { success: `${curBoard.name} added to favorite boards` };
    } else {
      // delete connection between user and board
      await db.favoriteBoard.delete({ where: { boardId: curBoard.id, userId: user.id } });

      revalidatePath(`/workspaces/${curBoard.workspaceId}`);

      return { success: `${curBoard.name} removed from favorite boards` };
    }
  } catch (error: any) {
    return { error: error.message || "server error" };
  }
};
