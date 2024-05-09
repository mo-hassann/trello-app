"use server";

import { db } from "@/db";
import { validateMyData } from "@/lib/validate-data";
import { newCardFromSchema } from "@/validation";
import { auth } from "@/auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

type dataType = z.infer<typeof newCardFromSchema>;

export const createNewCard = async (data: dataType, boardId: string, listId: string) => {
  try {
    const session = await auth();
    if (!session) return { error: "unauthorized" };
    const userId = session.user?.id;

    const { title } = validateMyData(newCardFromSchema, data);

    const curList = await db.list.findUnique({
      where: { id: listId, boardId },
      select: { id: true, board: { select: { workspace: { select: { adminId: true } } } } },
    });
    if (!curList) return { error: "list does not exist" };
    if (curList?.board?.workspace?.adminId !== userId) return { error: "unauthorized" };

    const cardsNumbers = await db.card.count({
      where: { listId },
    });
    console.log(cardsNumbers, "CARDS NOMS");
    const newCard = await db.card.create({
      data: { title, listId: curList.id, index: cardsNumbers },
    });

    revalidatePath(`/boards/${boardId}`);
    revalidateTag(`lists`);

    return { success: `${newCard.title} created successfully`, data: newCard };
  } catch (error: any) {
    return { error: error.message || "server error" };
  }
};
