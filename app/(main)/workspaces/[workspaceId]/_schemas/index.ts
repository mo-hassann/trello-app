import { z } from "zod";

export const newBoardFromSchema = z.object({
  name: z.string().min(1, "name is required"),
  boardColor: z.string().min(1, "color is required"),
});
