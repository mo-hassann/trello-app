import { z } from "zod";

// workspaces
export const newWorkspaceFormSchema = z.object({
  name: z.string().min(3, "workspace name must be grader then 3"),
});

export const editWorkspaceFormSchema = z.object({
  name: z.string().min(3, "workspace name must be grader then 3").optional(),
  isPublic: z.boolean().optional(),
});

export const editWorkspaceImgSchema = z.object({
  url: z.string().url(),
});

// boards
export const newBoardFormSchema = z.object({
  name: z.string().min(1, "name is required"),
  boardColor: z.string().min(1, "color is required"),
});

export const editBoardFormSchema = z.object({
  name: z.string().min(3, "name is required"),
});

export const favoriteBoardFromSchema = z.object({
  favoriteState: z.boolean(),
});

// lists
export const newListFromSchema = z.object({
  name: z.string().min(1, "name is required"),
});

export const listsToReorderSchema = z.array(
  z.object({
    id: z.string().min(1, "id is required"),
    newIndex: z.number().gte(0),
  })
);

// cards
export const newCardFromSchema = z.object({
  title: z.string().min(1, "name is required"),
});

export const cardsToReorderSchema = z.array(
  z.object({
    id: z.string().min(1, "id is required"),
    newIndex: z.number().gte(0),
    newListId: z.string().optional(),
  })
);
