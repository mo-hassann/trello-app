import { z } from "zod";

export const newListFromSchema = z.object({
  name: z.string().min(1, "name is required"),
});

export const newCardFromSchema = z.object({
  title: z.string().min(1, "name is required"),
});

export const listsToUpdateSchema = z.array(
  z.object({
    id: z.string().min(1, "id is required"),
    newIndex: z.number().gte(0),
  })
);

export const cardsToUpdateSchema = z.array(
  z.object({
    id: z.string().min(1, "id is required"),
    newIndex: z.number().gte(0),
    newListId: z.string().optional(),
  })
);
