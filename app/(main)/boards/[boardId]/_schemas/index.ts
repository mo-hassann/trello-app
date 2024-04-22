import { z } from "zod";

export const newListFromSchema = z.object({
  name: z.string().min(1, "name is required"),
});

export const newCardFromSchema = z.object({
  title: z.string().min(1, "name is required"),
});
