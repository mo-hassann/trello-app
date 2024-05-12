"use server";

import { db } from "@/db";
import { currentUser } from "@/lib/auth";
import { validateMyData } from "@/lib/validate-data";
import { newCardFromSchema } from "@/validation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type dataType = z.infer<typeof newCardFromSchema>;

export const createNewCard = async (data: dataType, listId: string) => {
  try {
    const curUser = await currentUser();
    if (!curUser || !curUser.id) return { error: "unauthorized" };

    const { title } = validateMyData(newCardFromSchema, data);

    const curList = await db.list.findUnique({
      where: { id: listId },
      select: { id: true, board: { select: { id: true, members: { select: { id: true } } } } },
    });
    if (!curList) return { error: "list does not exist" };

    // check if the user is member in the board
    const userIsBoardMember = curList.board?.members.some((member) => member.id === curUser.id);
    if (!userIsBoardMember) return { error: "you are not member in this board" };

    const cardsNumbers = await db.card.count({
      where: { listId },
    });

    const newCard = await db.card.create({
      data: { title, listId: curList.id, index: cardsNumbers, userId: curUser.id },
    });

    revalidatePath(`/boards/${curList.board?.id}`);

    return { success: `${newCard.title} created successfully`, data: newCard };
  } catch (error: any) {
    return { error: error.message || "server error" };
  }
};
