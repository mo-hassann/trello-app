"use server";

import { db } from "@/db";
import { validateMyData } from "@/lib/validate-data";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { newCardFromSchema } from "../_schemas";

type dataType = z.infer<typeof newCardFromSchema>;

export const createNewCard = async (data: dataType, boardId: string, listId: string) => {
  try {
    const { userId } = auth();
    if (!userId) return { error: "unauthorized" };

    const { title } = validateMyData(newCardFromSchema, data);

    const curList = await db.list.findUnique({
      where: { id: listId, boardId },
      select: { id: true, board: { select: { workspace: { select: { AdminMemberId: true } } } } },
    });
    if (!curList) return { error: "list does not exist" };
    if (curList?.board?.workspace?.AdminMemberId !== userId) return { error: "unauthorized" };

    const newCard = await db.card.create({ data: { title, listId: curList.id } });

    revalidatePath(`/boards/${boardId}`);

    return { success: `${newCard.title} created successfully`, data: newCard };
  } catch (error: any) {
    return { error: error.message || "server error" };
  }
};